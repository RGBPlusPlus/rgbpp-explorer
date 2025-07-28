'use client'

import { Trans } from '@lingui/macro'
import { useEffect, useRef, useState } from 'react'

import { CkbTransactionCardWithQueryInAddress } from '@/components/ckb/ckb-transaction-card-with-query-in-address'
import { Loading } from '@/components/loading'
import { useAddressTransactions } from '@/hooks/useRgbppData'

interface TransactionItem {
  txHash: string;
  // 添加其他可能需要的属性
}

export function CKBTxList({ address }: { address: string }) {
  const [page, setPage] = useState(1)
  const [allTransactions, setAllTransactions] = useState<TransactionItem[]>([])
  const [error, setError] = useState<string | null>(null)
  const { addressTransactions: data, isLoading } = useAddressTransactions(address, page, 1)
  const loadMoreRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (data?.data) {
      setAllTransactions(prev => {
        const existingTxHashes = new Set(prev.map((tx: TransactionItem) => tx.txHash))
        const newTransactions = data.data.filter((tx: TransactionItem) => !existingTxHashes.has(tx.txHash))
        return [...prev, ...newTransactions]
      })
      setError(null)
    }
  }, [data?.data])

  if (isLoading && page === 1) {
    return <Loading my="80px" />
  }

  if (error) {
    return <div className="text-red-500 text-center my-4">{error}</div>
  }

  if (allTransactions.length === 0) {
    return null
  }

  return (
    <>
      {allTransactions.map((item: TransactionItem) => (
        <CkbTransactionCardWithQueryInAddress 
          address={address} 
          hash={item.txHash} 
          key={item.txHash} 
        />
      ))}
      <div 
        ref={loadMoreRef} 
        style={{ 
          height: '100px',
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginTop: '20px',
          cursor: 'pointer'
        }}
        onClick={() => {
          if (!isLoading) {
            console.log('Loading more data, current page:', page)
            setPage(prev => prev + 1)
          }
        }}
      >
        {isLoading ? (
          <Loading my="20px" />
        ) : (
          <span className="text-blue-500 hover:text-blue-700">
            <Trans>Load more</Trans>
          </span>
        )}
      </div>
    </>
  )
}