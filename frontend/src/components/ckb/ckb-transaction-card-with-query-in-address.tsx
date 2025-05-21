'use client'

import { Trans } from '@lingui/macro'
import { VStack } from 'styled-system/jsx'

import { CkbCellTables } from '@/components/ckb/ckb-cell-tables'
import { CkbTransactionInViewQuery } from '@/components/ckb/ckb-transaction-in-view-query'
// import { TransactionHeaderInAddress } from '@/components/transaction-header-in-address'
import { UtxoOrCellFooter } from '@/components/utxo-or-cell-footer'
import { TransactionHeaderInAddress } from '../transaction-header-in-address'
import { CkbTransaction } from '@/types/graphql'

export function CkbTransactionCardWithQueryInAddress({ hash, address }: { address: string; hash: string }) {
  return (
    <CkbTransactionInViewQuery hash={hash}>
      {(tx:CkbTransaction) => {
        return (
          <VStack w="100%" gap={0} bg="bg.card" rounded="8px">
            <TransactionHeaderInAddress txid={tx.hash} />
            <CkbCellTables inputs={tx.display_inputs} outputs={tx.display_outputs} isCellbase={tx.is_cellbase} address={address} />
           
          </VStack> 
        )
      }}
    </CkbTransactionInViewQuery>
  )
}
           
   {/* <UtxoOrCellFooter
              fee={tx.fee}
              confirmations={tx.confirmations}
              feeRate={tx.fee_rate}
              ckbCell={tx}
              feeUnit={<Trans>shannons</Trans>}
              sizeUnit={<Trans>kB</Trans>}
              address={address}
            />*/}