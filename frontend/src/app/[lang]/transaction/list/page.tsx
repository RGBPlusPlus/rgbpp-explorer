'use client'

import { Trans } from '@lingui/macro'
import dayjs from 'dayjs'
import { Box, Center, Grid, HStack, styled } from 'styled-system/jsx'

import DownloadIcon from '@/assets/download.svg'
import { FailedFallback } from '@/components/failed-fallback'
import { LatestTxnListUI } from '@/components/latest-tx-list/ui'
import { Loading } from '@/components/loading'
import { PaginationSearchParams } from '@/components/pagination-searchparams'
import { TransactionInfo } from '@/components/transaction-info'
import { Heading, Text } from '@/components/ui'
import { DATE_TEMPLATE } from '@/constants'
import { useRgbppTransactions } from '@/hooks/useRgbppData'
import { resolvePage } from '@/lib/resolve-page'
import { formatNumber as formatNumberFn } from '@/lib/string/format-number'
import { RgbppTransaction } from '@/types/graphql'
import { downloadCSV } from '@/utils/download'

export default function Page({ params, searchParams }: { params: { lang: string }; searchParams: { page?: string } }) {
  const page = resolvePage(searchParams.page)
  const pageSize = 10
  const { data: txData, isLoading, error } = useRgbppTransactions(page, 10)

  if (isLoading) {
    return (
      <Center h="823px">
        <Loading />
      </Center>
    )
  }

  if (error || !txData) {
    return (
      <Center h="823px">
        <FailedFallback />
      </Center>
    )
  }

  const prepareDownloadData = (downloadData: RgbppTransaction[]) => {
    return {
      filename: 'rgbpp-transactions',
      headers: ['Date', 'Hash', 'LeapDirection', 'Amount'],
      rows: downloadData?.map((item) => [
        dayjs(item.timestamp).format(DATE_TEMPLATE),
        item.txHash,
        item.direction,
        item.ckbTransaction?.outputs?.[0]?.xudtInfo?.amount ?? '0'
      ])
    }
  }

  const downloadTxn = async () => {
    if (!txData?.data) return
    const downloadData = prepareDownloadData(txData.data as RgbppTransaction[])
    downloadCSV(downloadData.filename, downloadData.headers, downloadData.rows)
  }

  return (
    <Grid gridTemplateColumns="repeat(2, 1fr)" w="100%" maxW="content" p={{ base: '20px', xl: '30px' }} gap="30px">
      {txData ? <TransactionInfo txData={{
        data: txData.data as unknown as RgbppTransaction[],
        pagination: {
          total: txData.pagination.total ?? 0,
          pageSize
        }
      }} /> : null}
      <Box bg="bg.card" rounded="8px" whiteSpace="nowrap" pb="12px" gridColumn="1/3">
        <Heading
          fontSize="20px"
          fontWeight="semibold"
          p="30px"
          w="100%"
          display={'flex'}
          alignItems={'center'}
          justifyContent="space-between"
        >
          <Trans>{formatNumberFn(txData?.pagination.total)} transactions</Trans>
          <styled.button
            px={{ base: '10px', lg: '15px' }}
            height="32px"
            rounded="5px"
            gap="5px"
            cursor="pointer"
            display="flex"
            border="1px solid"
            borderColor="border.light"
            justifyContent="center"
            alignItems="center"
            _hover={{ bg: 'RGB(255, 255, 255, 0.08)' }}
            onClick={downloadTxn}
            disabled={isLoading || !txData}
          >
            <DownloadIcon w="18px" h="18px" />
            <Text display={{ base: 'none', md: 'block' }} fontSize={{ base: '14px' }} whiteSpace="nowrap">
              <Trans>Download Data</Trans>
            </Text>
          </styled.button>
        </Heading>
        <LatestTxnListUI txs={txData.data as unknown as RgbppTransaction[]} />

        <Box p="0px">
          <HStack gap="16px" display={'flex'} alignItems={'center'} justifyContent={'center'} mt="20px">
            <PaginationSearchParams count={txData?.pagination.total ?? 0} pageSize={pageSize} />
          </HStack>
        </Box>
      </Box>
    </Grid>
  )
}
