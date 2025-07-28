
'use client'

import { Trans } from '@lingui/macro'
import { Box, HStack, VStack } from 'styled-system/jsx'

import { IfBreakpoint } from '@/components/if-breakpoint'
import { LatestTxnListUI } from '@/components/latest-tx-list/ui'
import { PaginationSearchParams } from '@/components/pagination-searchparams'
import { Text } from '@/components/ui'
import { useRgbppTransactions } from '@/hooks/useRgbppData'
import { resolvePage } from '@/lib/resolve-page'
import { formatNumber } from '@/lib/string/format-number'
import type { RgbppTransaction } from '@/types/graphql'

export default  function Page({
  params: { typeHash },
  searchParams,
}: {
  params: { typeHash: string;}
  searchParams: { page?: string }
}) {
  const page = resolvePage(searchParams.page)
  const pageSize = 10
  const { data: txData, isLoading, error } = useRgbppTransactions(page,pageSize,typeHash)
   
  const transactions = txData?.data as RgbppTransaction[] || []

  return (
    <VStack w="100%" maxW="content" gap="32px">
      <Box w="100%" bg="bg.card" rounded="8px" pt={{ base: '10px', md: '30px' }} pb="10px">
        <LatestTxnListUI txs={(transactions).map(tx => ({
          ...tx,
          btc: { txid: tx.btc?.txid ?? null }
        })) ?? []} />
      </Box>

      <HStack gap="16px" mt="auto" p="30px">
        <IfBreakpoint breakpoint="md">
          <Text fontSize="14px"><Trans>Total</Trans> ${formatNumber(transactions.length ?? undefined)} <Trans>Items</Trans></Text>
        </IfBreakpoint>
        <PaginationSearchParams count={transactions.length ?? 0} pageSize={pageSize} />
      </HStack>
    </VStack>
  )
}
