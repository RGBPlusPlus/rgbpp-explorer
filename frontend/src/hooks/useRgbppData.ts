import { useMemo } from 'react'

import { Chain } from '@/components/holder-list/type'
import { trpc } from '@/configs/trpc'
import { useRgbppHolderCountRecords } from '@/hooks/trpc/useRgbppHolderCountRecords'
import { useRgbppIssueCountRecords } from '@/hooks/trpc/useRgbppIssueCountRecords'



export function useRgbppData() {
  const { data: marketCap } = trpc.rgbpp.marketCap.useQuery()
  const { data: transactionCountRecords } = trpc.rgbpp.transactionCountRecords.useQuery()

  return {
    marketCap,
    transactionCountRecords,
  }
}

export function useRgbppStatisticsOverview() {
  const { data: marketCap, isLoading: isLoadingMarketcap } = trpc.rgbpp.marketCap.useQuery(undefined, {
    staleTime: 60 * 1000, // 1 minute
    refetchOnWindowFocus: false,
  })
  const { data: totalAssets, isLoading: isLoadingTotalAssets } = useRgbppIssueCountRecords()
  const { data: totalHolders, isLoading: isLoadingTotalHolders } = useRgbppHolderCountRecords()

  const assetCount = useMemo(() => {
    if (!totalAssets?.length) return 0
    return totalAssets[totalAssets.length - 1].total
  }, [totalAssets])

  const holdersCount = useMemo(() => {
    if (!totalHolders?.length) return 0
    return totalHolders[totalHolders.length - 1].total
  }, [totalHolders])

  return {
    marketCap: marketCap?.value || 0,
    assetCount,
    holdersCount,
    loadingStatus: {
      isLoadingMarketcap,
      isLoadingTotalAssets,
      isLoadingTotalHolders,
    },
  }
}

// export function useRgbppXudtList(pageSize = 10, pageIndex = 0) {
//   const { data: xudtList, isLoading } = trpc.rgbpp.infoList.useQuery({
//     pageSize,
//     pageIndex,
//   })

//   return {
//     xudtList,
//     isLoading
//   }
// }

export function useAssetInfo(assetId: string) {
  const { data: assetInfo, isLoading } = trpc.rgbpp.info.useQuery({ assetId })
  const { data: assetQuote } = trpc.rgbpp.quote.useQuery({ assetId })
  // console.log(assetInfo)
  // console.log(assetQuote)
  return {
    assetInfo,
    assetQuote,
    isLoading,
  }
}

// export function useAssetInfoList(pageSize = 10, pageIndex = 0) {
//   const { data: assetList } = trpc.rgbpp.infoList.useQuery({
//     pageSize,
//     pageIndex,
//   })

//   return { assetList }
// }
export function useCoinList(pageSize = 10, pageIndex:number) {
  const { data: assetList } = trpc.rgbpp.coinList.useQuery({
    page: pageIndex,
    pageSize:pageSize,
    // sort:'addresses_count.desc',
  })
  return { assetList }
}

export function useAssetHolders(assetId: string) {
  const { data: holders } = trpc.rgbpp.topHolders.useQuery({
    assetId,
  })

  return { holders }
}


export function useAssetTransactions(assetId?: string, pageSize = 10, pageIndex = 1) {
  const { data: transactions,isLoading,error } = trpc.rgbpp.transactionList.useQuery({
    assetId: assetId ?? '',
    page: pageIndex,
    pageSize,
  })
  return { transactions, isLoading, error }
}
export function useAddressAsset(address: string) {

  const { data: assetInfo } = trpc.rgbpp.addressHoldAssets.useQuery({ address })
  
  return {
    assetInfo,
  }
}



export function useAddressTransactions(address: string,page:number,pageSize:number) {
  const {
    data:addressTransactions,
    isLoading,
    error,
  } = trpc.address.transactions.useQuery({
    address,
    page,
    pageSize,
  })
  return {
    addressTransactions,
    isLoading,
    error,
  }
}
export function useBtcAddressAssets(address: string) {
  const {
    data: addressAssets,
    isLoading,
    error,
  } = trpc.address.getAddressAssets.useQuery(
    address,
  )
  return {
    addressAssets,
    isLoading,
    error,
  }
}
export function useAddressInfoBTC(address: string) {
  const { data: btcInfo, isLoading, error } = trpc.temp.btc.addressBase.useQuery(address)
  return {
    btcInfo,
    isLoading,
    error,
  }
}
export function useAddressInfoCKB(address: string) {
 
  const { data: ckbInfo, isLoading, error } = trpc.explorer.addressBase.useQuery(address)
  return {
    ckbInfo,
    isLoading,
    error,
  }
}
export function useBlockTxs(blockHash: string) {

  const {data,isLoading,error} = trpc.block.getTransactionList.useQuery({
    blockHash,
    pagination:{
      page: 1,
      pageSize: 1,
    }
    
  })
  // 删除不必要的 console.log
  return {
    data,
    isLoading,
    error
  }
}
export function useBlockInfo(chain: Chain, blockHash: string) {
  const { data, isLoading, error } = trpc.block.getBlockInfo.useQuery({
    chain,
    hashOrNumber: blockHash
  } as any)

  return {
    data,
    isLoading,
    error
  }
}
export function useBtcInfo() {
  const { data, isLoading, error } = trpc.temp.btc.chainInfo.useQuery()
  
  return {
    data,
    isLoading,
    error
  }
}
export function useBtcTxDetail(txHash:string) {
  const {data,isLoading,error} =  trpc.temp.btc.transaction.useQuery({txid:txHash})
  return {
    data,
    isLoading,
    error,
  }
}

export function getBtcTipBlockNumber() {
  // @ts-ignore
  const {data,isLoading} = trpc.temp.btc.getTipBlockNumber.useQuery()
  return {
    data,
    isLoading
  }
}

export function useCkbInfo() {
  const { data, isLoading, error } = trpc.explorer.chainInfo.useQuery()
  
  return {
    data,
    isLoading,
    error
  }
}
export function useSearchTrpc(key: string) {
  return trpc.explorer.typeOf.useQuery(key, {
    enabled: !!key,
    retry: false,
  })
}
export function useBtcTxList () {
  const { data, isLoading, error } = trpc.rgbpp.transactionList.useQuery({ 
    assetId: undefined, 
    page: 1, 
    pageSize: 10 
  })
  return {
    data,
    isLoading,
    error
  }
}
export function useBtcTxs (txid:string, options?: { enabled?: boolean }) {

  const {data,isLoading} = trpc.temp.btc.transaction.useQuery({txid})
  return {
    data,
    isLoading
  }
}
export function useCkbTxs (hash: string) {
  const pagination = {
    page: 1,
    pageSize: 10
  }
  const {data, isLoading} = trpc.block.getTransactionList.useQuery({ blockHash: hash, pagination })
  return {
    data,
    isLoading
  }
}

export function useCkbTxDetail (hash:string, options?: { enabled?: boolean }) {
  const {data,isLoading} = trpc.tx.getTxDetail.useQuery(hash, { enabled: options?.enabled })
  return {
    data,
    isLoading
  }
}
export function useRgbppTransactions(page:number,pageSize:number,assetId?:string) {
  const { data, isLoading, error } = trpc.rgbpp.transactionList.useQuery({
    assetId: assetId ?? '',
    page,
    pageSize
  })

  return {
    data: data,
    isLoading,
    error
  }
}

// 获取 BTC 交易详情
export function useBtcTransaction(txid: string) {
  const { data, isLoading, error } = trpc.temp.btc.transaction.useQuery({ txid })
  return {
    data,
    isLoading,
    error
  }
}