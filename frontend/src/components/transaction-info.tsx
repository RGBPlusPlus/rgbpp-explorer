'use client'
import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { Grid, HStack, VStack } from 'styled-system/jsx'

import { OverviewInfo, OverviewInfoItem } from '@/components/overview-info'
import { Heading } from '@/components/ui'
import { RgbppTransaction } from '@/types/graphql'

interface TxDataType {
  data: RgbppTransaction[]
  pagination: {
    total: number
    pageSize: number
  }
}
export function TransactionInfo({ txData }: { txData: TxDataType }) {
  const { i18n } = useLingui()

  return (
    <VStack gridColumn="1/3" gap="20px" bg="bg.card" p={{ base: '20px', md: '30px' }} alignItems="start" rounded="8px">
      <HStack gap="16px" display={'flex'} alignItems={'center'} justifyContent="space-between" w="100%">
        <Heading fontSize="20px" fontWeight="bold">{t(i18n)`Transactions`}</Heading>
        {/* <Link color="text.link" href={'#'}>{t(i18n)`View Transaction Chart`}</Link> */}
      </HStack>
      <Grid w="100%" gridTemplateColumns={{ base: '1fr', lg: 'repeat(2, 1fr)' }} gap={{ base: '20px', md: '30px' }}>
        <OverviewInfo>
          <OverviewInfoItem label={t(i18n)`Total Transactions`} formatNumber>
            {txData?.pagination.total}
          </OverviewInfoItem>
          <OverviewInfoItem label={t(i18n)`24H Transactions`} formatNumber>
            20000
          </OverviewInfoItem>
        </OverviewInfo>
        <OverviewInfo>
          <OverviewInfoItem label={t(i18n)`Avg. Confirmation Time`}>11 min</OverviewInfoItem>
          <OverviewInfoItem label={t(i18n)`Avg. Transaction Fee`}>0.0003 ckb</OverviewInfoItem>
        </OverviewInfo>
      </Grid>
    </VStack>
  )
}
