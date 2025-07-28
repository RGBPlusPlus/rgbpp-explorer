import { resolveLayerTypeFromRGBppTransaction } from '@/lib/resolve-layer-type-from-rgbpp-transaction'
import { RgbppTransaction } from '@/types/graphql'

export function resolveRGBppTxHash(tx: Pick<RgbppTransaction, 'btc' | 'ckbTransaction' | 'direction' | 'network'>) {
  const type = resolveLayerTypeFromRGBppTransaction(tx)
  
  if (!type) return tx.ckbTransaction.outputs[0].txHash
  switch (type) {
    case 'l1-l2':
    case 'l1':
      return tx.btc?.txid ?? tx.ckbTransaction.outputs[0].txHash
    case 'l2-l1':
      return tx.ckbTransaction.outputs[0].txHash ?? tx.btc?.txid
    default:
      return tx.ckbTransaction.outputs[0].txHash
  }
}
