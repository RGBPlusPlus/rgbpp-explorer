'use client'

import { Trans } from '@lingui/macro'
import Link from 'next/link'
import { Box, Center } from 'styled-system/jsx'

import { FailedFallback } from '@/components/failed-fallback'
import { LatestTxnListUI } from '@/components/latest-tx-list/ui'
import { LoadingBox } from '@/components/loading-box'
import { NoData } from '@/components/no-data'
import { useRgbppTransactions } from '@/hooks/useRgbppData'
import { RgbppTransaction } from '@/types/graphql'

export function HomeRgbppTxnsOverview() {
  const { data: transactions, isLoading, error } = useRgbppTransactions(1,10)
  if (error) {
    return <FailedFallback />
  }

  if (isLoading) {
    return <LoadingBox />
  }

  if (!transactions?.data?.length) {
    return (
      <Center w="100%" bg="bg.card" pt="80px" pb="120px" rounded="8px">
        <NoData>
          <Trans>No Transaction</Trans>
        </NoData>
      </Center>
    )
  }

 
  return (
    <Box w="100%" bg="bg.card" p="24px" rounded="8px">
      <LatestTxnListUI txs={transactions.data as RgbppTransaction[]} />
      <Box mt="16px" textAlign="right">
        <Link href="/transaction/list" style={{ color: 'var(--colors-text-secondary)' }}>
          <Trans>View All Transactions →</Trans>
        </Link>
      </Box>
    </Box>
  )
}