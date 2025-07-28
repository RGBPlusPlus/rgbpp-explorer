'use client'

// import { notFound } from 'next/navigation'

import { Box, Grid } from 'styled-system/jsx'

import { BtcTransactionOverview } from '@/components/btc/btc-transaction-overview'
import { BtcUtxos } from '@/components/btc/btc-utxos'
import { CkbCells } from '@/components/ckb/ckb-cells'
import { CkbTransactionOverview } from '@/components/ckb/ckb-transaction-overview'
import { Loading } from '@/components/loading'
import { TransactionHeader } from '@/components/transaction-header'
import { useBtcTxs, useCkbTxDetail } from '@/hooks/useRgbppData'
import { resolveLayerTypeFromRGBppTransaction } from '@/lib/resolve-layer-type-from-rgbpp-transaction'
import { CkbTransaction } from '@/types/graphql'

function BtcTransactionPage({ tx }: { tx: string }) {
  const { data: btcTransaction, isLoading } = useBtcTxs(tx)
  if (isLoading || !btcTransaction) return <Loading my="80px" />

  return (
    <>
      {/* todo: remove confirmations */}
      <TransactionHeader
        type={resolveLayerTypeFromRGBppTransaction({
          ckbTransaction: undefined,
          btc: btcTransaction,
          direction: undefined,
          network: 'btc'
        })}
        txid={btcTransaction.txid}
        // confirmations={data.confirmed ? 1 : 0}
      />
      <BtcTransactionOverview btcTransaction={{
        ...btcTransaction,
        vout: btcTransaction.vout.map((output: any) => ({
          ...output,
          spent: output.spent ? {
            txid: '',
            vin: 0,
            status: {
              confirmed: false,
              block_hash: '',
              block_height: 0,
              block_time: 0
            }
          } : null
        }))
      }} />
      <BtcUtxos 
        txid={btcTransaction.txid} 
        vin={btcTransaction.vin} 
        vout={btcTransaction.vout.map((output: any) => ({
          ...output,
          spent: output.spent ? {
            txid: '',
            vin: 0,
            status: {
              confirmed: false,
              block_hash: '',
              block_height: 0,
              block_time: 0
            }
          } : null
        }))} 
      />
    </>
  )
}

function CkbTransactionPage({ tx }: { tx: string }) {
  const { data, isLoading } = useCkbTxDetail(tx)
  if (isLoading || !data) return <Loading my="80px" />

  const hash = data.hash

  return (
    <>
      {/* todo: remove confirmations */}
      <TransactionHeader
        type={resolveLayerTypeFromRGBppTransaction({
          ckbTransaction: data as unknown as CkbTransaction,
          btc: undefined,
          direction: undefined,
          network: 'ckb'
        })}
        txid={hash}
      />

      <CkbTransactionOverview ckbTransaction={data as unknown as CkbTransaction} />
      <CkbCells ckbTransaction={data as unknown as CkbTransaction} />
    </>
  )
}

export default function Page({ params: { tx } }: { params: { tx: string } }) {
  if (tx.startsWith('0x')) {
    return (
      <Grid gridTemplateColumns="repeat(1, 1fr)" w="100%" maxW="content" p={{ base: '20px', xl: '30px' }} gap="30px">
        <Box bg="bg.card" w="100%" rounded="8px" pb="10px" overflow={'hidden'}>
          <CkbTransactionPage tx={tx} />
        </Box>
      </Grid>
    )
  }
  return (
    <Grid gridTemplateColumns="repeat(1, 1fr)" w="100%" maxW="content" p={{ base: '20px', xl: '30px' }} gap="30px">
      <Box bg="bg.card" w="100%" rounded="8px" pb="10px" overflow={'hidden'}>
        <BtcTransactionPage tx={tx} />
      </Box>
    </Grid>
  )
}
