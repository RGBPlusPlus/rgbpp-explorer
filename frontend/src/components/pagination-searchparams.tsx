'use client'

import { Trans } from '@lingui/macro'
import { redirect, usePathname, useSearchParams } from 'next/navigation'
import { useState } from 'react'

import { Button } from '@/components/ui'
import Link from '@/components/ui/link'
import { NumberInput } from '@/components/ui/number-input'

export function PaginationSearchParams(props: { count: number; pageSize: number }) {
  
  const { count, pageSize } = props
  console.log( count, pageSize)
  const searchParams = useSearchParams()
  const initialPage = Number(searchParams.get('page') ?? '1')
  const pathname = usePathname()
  console.log(initialPage)
  if (isNaN(initialPage)) {
    const params = new URLSearchParams(searchParams.toString())
    console.log(params)
    params.delete('page')
    redirect(`${pathname}?${params.toString()}`)
  }

  const [page, setPage] = useState(initialPage)

  // 构建查询参数
  const queryParams = new URLSearchParams(searchParams.toString())
  queryParams.set('page', page.toString())

  return (
    <>
      <NumberInput
        value={`${page}`}
        onValueChange={(e) => setPage(e.valueAsNumber)}
        min={1}
        max={Math.ceil(count / pageSize)}
        w="150px"
      />
      <Link
        href={`${pathname}?${queryParams.toString()}`}
      >
        <Button>
          <Trans>Go</Trans>
        </Button>
      </Link>
    </>
  )
}
