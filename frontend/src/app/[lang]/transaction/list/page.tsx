'use client'

import { Trans } from '@lingui/macro'
import { useQuery } from '@tanstack/react-query'
import dayjs from 'dayjs'
import { Box, Center, Grid, HStack, styled } from 'styled-system/jsx'

import DownloadIcon from '@/assets/download.svg'
import { FailedFallback } from '@/components/failed-fallback'
import { LatestRGBTxnListUI } from '@/components/latest-tx-list/rgb-tx-list'
import { Loading } from '@/components/loading'
import { PaginationSearchParams } from '@/components/pagination-searchparams'
import { TransactionInfo } from '@/components/transaction-info'
import { Heading , Text } from '@/components/ui'
import { DATE_TEMPLATE } from '@/constants'
import { resolvePage } from '@/lib/resolve-page'
// import { graphQLClient } from '@/lib/graphql'
import { formatNumber as formatNumberFn } from '@/lib/string/format-number'
import { apiFetcher, RGBTransaction } from '@/services/fecthcer'
// import { QueryKey } from '@/constants/query-key'
import { downloadCSV } from '@/utils/download'


export default function Page({
  params,
  searchParams,
}: {
  params: { lang: string }
  searchParams: { page?: string }
}) {
  const page = resolvePage(searchParams.page),

    sort = 'number.desc',
    pageSize = 10
    
  const {
    isLoading: txLoading,
    data: txData,
    error: txError,
  } = useQuery({
    queryKey: ['rgbpp_transactions'],
    async queryFn() {
      const response = await apiFetcher.fetchRGBTransactions(page, pageSize, sort)
      if (response) {
        const { data, meta } = response
        return { data, meta }
      }
      return null
    },
    refetchInterval: 10000,
  })

  if (txLoading) {
    return (
      <Center h="823px">
        <Loading />
      </Center>
    )
  }

  if (txError || !txData ) {
    return (
      <Center h="823px">
        <FailedFallback />
      </Center>
    )
  }

  const prepareDownloadData = (downloadData: RGBTransaction[]) => {
    return {
      filename: 'rgbpp-transactions',
      headers: ['Date', 'Hash', 'LeapDirection', 'Amount'],
      rows: downloadData?.map((item: RGBTransaction) => [
        dayjs(item.blockTimestamp).format(DATE_TEMPLATE),
        item.txHash,
        item.leapDirection,
        item.ckbTransaction
      ])
    }
  }

  const downloadTxn = async () => {
    if (!txData?.data) { return }
    const downloadData = prepareDownloadData(txData.data.ckbTransactions)
    downloadCSV(downloadData.filename, downloadData.headers, downloadData.rows)
  }

  return (
    <Grid gridTemplateColumns="repeat(2, 1fr)" w="100%" maxW="content" p={{ base: '20px', xl: '30px' }} gap="30px">
      {txData ? <TransactionInfo txData={txData} /> : null}
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
          <Trans>{formatNumberFn(txData?.meta.total)} transactions</Trans>
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
            disabled={txLoading || !txData}
          >
            <DownloadIcon w="18px" h="18px" />
            <Text display={{ base: 'none', md: 'block' }} fontSize={{ base: '14px' }} whiteSpace={'nowrap'}>
              <Trans>Download Data</Trans>
            </Text>
          </styled.button>
        </Heading>
        <Box p="0px">
          <LatestRGBTxnListUI txs={txData?.data?.ckbTransactions.map(tx => ({
            ckbTxHash: tx.txHash,
            btcTxid: tx.rgbTxid,
            blockTimestamp: tx.blockTimestamp,
            ckbTransaction: tx.ckbTransaction,
            leapDirection: tx.leapDirection as 'in' | 'withinBTC' | 'leapoutBTC',
            blockNumber: Number(tx.blockNumber)
          })) || []} />
          
          <HStack gap="16px" display={'flex'}
            alignItems={'center'}
            justifyContent={'center'}
            mt="20px"
          >
            <PaginationSearchParams count={txData?.meta.total} pageSize={pageSize} />
          </HStack>
        </Box>
      </Box>
    </Grid>
  )
}