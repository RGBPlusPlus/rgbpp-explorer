'use client'

import { ReactNode } from 'react'

// import { useInView } from 'react-intersection-observer'
import { Skeleton, SkeletonProps } from '@/components/ui/primitives/skeleton'
import { useCkbTxDetail } from '@/hooks/useRgbppData'
import { CkbTransaction } from '@/types/graphql'

interface Props extends Omit<SkeletonProps, 'children'> {
  hash: string
  children: (tx: CkbTransaction) => ReactNode
}

export function CkbTransactionInViewQuery({
  hash,
  children,
  ...props
}: Props) {
  const { data: tx, isLoading } = useCkbTxDetail(hash)
console.log(tx)
  if (isLoading) {
    return <Skeleton {...props} />
  }

  if (!tx) {
    return null
  }

  return <>{children(tx as unknown as CkbTransaction)}</>
}
