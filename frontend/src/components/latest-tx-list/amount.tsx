'use client'

import { Trans } from '@lingui/macro'

import { Text } from '@/components/ui'
import { formatNumber } from '@/lib/string/format-number'
import { CkbTransaction } from '@/types/graphql'

export function Amount({ transaction }: { transaction?: CkbTransaction | null }) {
  if (!transaction?.outputs) return <Trans>-</Trans>

  const outputs = transaction.outputs
  const info = outputs[0].xudtInfo
  const cellType = outputs[0]?.cellType
  if (cellType === 'DOB') {
    return (
      <Trans>
        1{' '}
        <Text as="span" color="text.third" fontSize="14px" fontWeight="medium" ml="4px">
          DOB
        </Text>
      </Trans>
    )
  }
  if (!info) {
    return <Trans>-</Trans>
  }
  return (
    <>
      <b>{formatNumber(info?.amount, 8)}</b>
      <Text as="span" color="text.third" fontSize="14px" fontWeight="medium" ml="4px">
        {info?.symbol}
      </Text>
    </>
  )
}
