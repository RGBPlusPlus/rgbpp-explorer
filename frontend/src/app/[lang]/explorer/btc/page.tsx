'use client'
import { Trans } from '@lingui/macro'
import { Box, Center,Grid } from 'styled-system/jsx'

import { Info } from '@/app/[lang]/explorer/btc/info'
import { ExplorerTxList } from '@/components/explorer-tx-list'
import { Loading } from '@/components/loading'
import { Heading } from '@/components/ui'
import { useRgbppTransactions } from '@/hooks/useRgbppData'

export default function Page() {
  const { data: rgbppLatestL1Transactions, isLoading } = useRgbppTransactions(1, 10)
 
  return (
    <Grid gridTemplateColumns="repeat(2, 1fr)" w="100%" maxW="content" p={{ base: '20px', xl: '30px' }} gap="30px">
      <Info />
      <Box bg="bg.card" rounded="8px" whiteSpace="nowrap" pb="12px" gridColumn="1/3">
        <Heading fontSize="20px" fontWeight="semibold" p="30px">
          <Trans>Latest L1 RGB++ transaction</Trans>
        </Heading>
        {isLoading ? (
          <Center h="300px">
            <Loading />
          </Center>
        ) : (
        <ExplorerTxList transactions={rgbppLatestL1Transactions?.data?.map((tx: any) => ({
          ...tx,
          network: 'btc'
        })) as any || []} type="btc" />
        )}
      </Box>
    </Grid>
  )
}
