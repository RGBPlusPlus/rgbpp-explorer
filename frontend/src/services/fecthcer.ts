import { toCamelcase } from '@rgbpp-sdk/ckb'
import { AxiosResponse } from 'axios'

import { requesterV1, requesterV2 } from '@/services/requester'
import { Response } from '@/services/types'

async function v1Get<T>(...args: Parameters<typeof requesterV1.get>) {
  return requesterV1.get(...args).then((res) => toCamelcase<Response.Response<T>>(res.data))
}

interface XUDT {
  symbol: string
  decimal: string
  amount: string
  typeHash: string
  udtIconFile: string
  udtType: 'xudt' | 'xudt_compatible'
}

const v1GetWrapped = <T>(...args: Parameters<typeof v1Get>) =>
  v1Get<Response.Wrapper<T>>(...args).then((res) => res?.data)

const v1GetUnwrapped = <T>(...args: Parameters<typeof v1GetWrapped>) =>
  v1GetWrapped<T>(...args).then((wrapper) => wrapper?.attributes)

const v1GetUnwrappedPagedList = <T>(...args: Parameters<typeof v1GetWrapped>) =>
  v1Get<Array<Response.Wrapper<T>>>(...args).then((res) => {
    return {
      data: res?.data.map((wrapper) => ({ ...wrapper.attributes, cellId: wrapper.id })),
      ...res?.meta,
    }
  })

export const apiFetcher = {
  fetchStatistics: () =>
    v1GetUnwrapped<{
      tipBlockNumber: string
      averageBlockTime: string
      currentEpochDifficulty: string
      hashRate: string
      epochInfo: {
        epochNumber: string
        epochLength: string
        index: string
      }
      estimatedEpochTime: string
      transactionsLast24Hrs: string
      transactionsCountPerMinute: string
      reorgStartedAt: string | null
    }>(`statistics`),

  fetchXudts: (page: number, size: number, sort?: string, tags?: string, union?: string) =>
    v1GetUnwrappedPagedList<XUDT>(`/xudts`, {
      params: {
        page,
        page_size: size,
        sort,
        tags,
        union: union ?? 'false',
      },
    }),
  fetchCkbBlock: async (hash_or_number: string) =>
    v1Get<Response.Wrapper<BlockData>>(`/blocks/${hash_or_number}`).then((res) => {
      if (!res) {
        return null
      }
      const block = res.data.attributes
      console.log(block)
      return {
        ckbBlock: {
          version: block.version,
          hash: block.blockHash,
          number: block.number,
          timestamp: block.timestamp,
          transactionsCount: block.transactionsCount,
          totalFee: block.totalTransactionFee,
          miner: {
            address: block.minerHash,
            shannon: block.minerReward,
            transactionsCount: block.transactionsCount,
          },
          reward: block.reward,
          size: block.size,
          confirmations: block.cellConsumed,
        },
      }
    }),
  fetchRGBTransactions: async (page: number, size: number, sort?: string, leapDirection?: string) =>
    requesterV2('/rgb_transactions', {
      params: {
        page,
        page_size: size,
        sort,
        leap_direction: leapDirection,
      },
    }).then((res: AxiosResponse) =>
      toCamelcase<{
        data: {
          ckbTransactions: RGBTransaction[]
        }
        meta: {
          total: number
          pageSize: number
        }
      }>(res.data),
    ),
  fetchRGBTransaction: async (txHash: string) =>
    requesterV2(`/ckb_transactions/${txHash}/display_outputs`).then((res: AxiosResponse) =>
      toCamelcase<{
        data: RGBTransaction
      }>(res.data),
    ),
}

// ====================
// Types
// ====================

export type APIFetcher = typeof apiFetcher

export type APIReturn<T extends keyof APIFetcher> = Awaited<ReturnType<APIFetcher[T]>>

export interface RGBTransaction {
  ckbTransaction: any
  txHash: string
  blockId: number
  blockNumber: string|number
  blockTimestamp: number|string
  leapDirection: string
  rgbCellChanges: number
  rgbTxid: string
}
export interface BlockData {
  blockHash: string;
  uncleBlockHashes: string[] | null;
  minerHash: string;
  transactionsRoot: string;
  rewardStatus: "issued" | "calculated" | string;
  receivedTxFeeStatus: "calculated" | string;
  minerMessage: string;
  number: number;
  startNumber: number;
  length: number;
  version: number;
  proposalsCount: string;
  unclesCount: number;
  timestamp: string;
  reward: number;
  cellConsumed: number;
  totalTransactionFee: number;
  transactionsCount: number;
  totalCellCapacity: number;
  receivedTxFee: number;
  epoch: number;
  blockIndexInEpoch: number;
  nonce: number;
  difficulty: number;
  minerReward: number;
  size: number;
  largestBlockInEpoch: number | null;
  largestBlock: number;
  cycles: number;
  maxCyclesInEpoch: number | null;
  maxCycles: number;
}
