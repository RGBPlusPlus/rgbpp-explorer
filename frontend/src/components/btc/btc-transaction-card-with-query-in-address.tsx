'use client'

import { BtcTransactionCardInAddress } from '@/components/btc/btc-transaction-card-in-address'
import { BtcTransactionInViewQuery } from '@/components/btc/btc-transaction-in-view-query'
// import { BitcoinTransaction, CkbTransaction } from '@/gql/graphql'

interface Props {
  txid: string
  ckbTxHash?: string
  address: string
}

export function BtcTransactionCardWithQueryInAddress({ txid, address }: Props) {
  
  return (
    <BtcTransactionInViewQuery txid={txid}>
      {(data) => (
        
        <BtcTransactionCardInAddress
          tx={data }
          address={address}
          // ckbCell={ckbTx}
        />
      )}
    </BtcTransactionInViewQuery>
  )
}
