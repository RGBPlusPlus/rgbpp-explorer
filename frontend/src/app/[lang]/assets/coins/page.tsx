   // @ts-nocheck
'use client'

import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { Box, Center, HStack, VStack } from 'styled-system/jsx'

// import { getI18nInstance } from '@/app/[lang]/appRouterI18n'
import { CoinList } from '@/components/coin-list'
import { IfBreakpoint } from '@/components/if-breakpoint'
import { LoadingBox } from '@/components/loading-box'
import { PaginationSearchParams } from '@/components/pagination-searchparams'
import { Text } from '@/components/ui'
import { useCoinList } from '@/hooks/useRgbppData'
// import { graphql } from '@/gql'
// import { graphQLClient } from '@/lib/graphql'
import { resolvePage } from '@/lib/resolve-page'
import { formatNumber } from '@/lib/string/format-number'

type CoinType = {
  info: {
    symbol: string | null
    id: string
    name: string | null
    decimals: number | null
    icon: string | null
    tags: string[]
  }
  quote: {
    totalSupply: string | null
    holderCount: Array<{
      network: 'ckb' | 'btc' | 'doge' | 'unknown'
      count: number
    }>
    price: string | null
    marketCap: string | null
    volume24h: string | null
    circulatingSupply: string | null
    fdv: string | null
    priceChange24h: number | null
    txCount24h: number
  }
}

export default function Page({
  params,
  searchParams,
}: {
  params: { lang: string }
  searchParams: { page?: string }
}) {
  const { i18n } = useLingui()
  const page = resolvePage(searchParams.page)
  const pageSize = 10

 
  const {assetList,isLoading,error} = useCoinList(pageSize, page,'addresses_count.desc')
  if (!assetList) {
    return (
      <VStack w="100%" maxW="content" flex={1} gap="32px">
      <Center h="176px" w="100%" rounded="8px" overflow="hidden">
        <LoadingBox />
      </Center>
      </VStack>
    )
  }

  return (
    <VStack w="100%" maxW="content" flex={1} gap="32px">
      <Box bg="bg.card" w="100%" rounded="8px" pb="10px" overflow={'hidden'}>
        <Text fontSize={{ base: '18px', lg: '20px' }} fontWeight="semibold" p={{ base: '20px', lg: '30px' }}>
          {t(i18n)`Total: ${formatNumber(assetList.pagination.total)} Coins`}
        </Text>
      {/* {assetList.result.length} */}
        <CoinList coins={assetList.data} />
      </Box>
      <HStack gap="16px">
        <IfBreakpoint breakpoint="md">
          <Text fontSize="14px">{t(i18n)`Total ${formatNumber(assetList?.pagination.total)} Items`}</Text>
        </IfBreakpoint>
        
        {assetList?.pagination ? (
         
          <PaginationSearchParams count={assetList.pagination.total} pageSize={pageSize} />
         
        ) : null}
      </HStack>
    </VStack>
  )
}
