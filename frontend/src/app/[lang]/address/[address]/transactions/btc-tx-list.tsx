'use client'

import { VStack } from 'styled-system/jsx'

import { BtcTransactionCardWithQueryInAddress } from '@/components/btc/btc-transaction-card-with-query-in-address'
import { useAddressTransactions } from '@/hooks/useRgbppData'

export default function BtcTxList({ address }: { address: string }) {
  const { addressTransactions, isLoading, error } = useAddressTransactions(address,1,1)

  if (isLoading || error || !addressTransactions?.data) {
    return null
  }

  return (
    <VStack w="100%" gap="30px">
      {addressTransactions.data.map((tx: any) => {
        return <BtcTransactionCardWithQueryInAddress address={address} txid={tx.txHash} key={tx.txHash} />
      })}
    </VStack>
  )
}
