'use client'
import { Trans } from '@lingui/macro'
import { useParams } from 'next/navigation'
import { Box, Center, Flex, HStack, VStack } from 'styled-system/jsx'

import { CoinHolderList } from '@/components/holder-list/coin-holder-list'
import { HolderSummarySection } from '@/components/holder-list/holder-summary'
import { Chain } from '@/components/holder-list/type'
import { LoadingBox } from '@/components/loading-box'
import { Heading } from '@/components/ui'
import { useAssetHolders, useAssetInfo } from '@/hooks/useRgbppData'

interface HolderCountItem {
  network: string;
  count: number;
}

interface Holder {
  address: string;
  network: string;
  value: string | number;
  percentage: string | number;
  amount: string | number;
}

export default function Page() {
  const params = useParams()

  const { holders } = useAssetHolders(params.typeHash as string)
  const { assetInfo, assetQuote } = useAssetInfo(params.typeHash as string)

  const totalSupply = Number(assetQuote?.totalSupply) || 0
  const totalHolders = assetQuote?.holderCount?.reduce((sum: number, item: HolderCountItem) => sum + item.count, 0) || 0
  const averageBalance = totalHolders > 0 ? totalSupply / totalHolders : 0

  const holderSummary = {
    totalHolders,
    chainHolders: {
      btc: assetQuote?.holderCount?.find((item: HolderCountItem) => item.network.toLowerCase() === 'btc')?.count || 0,
      ckb: assetQuote?.holderCount?.find((item: HolderCountItem) => item.network.toLowerCase() === 'ckb')?.count || 0,
      doge: assetQuote?.holderCount?.find((item: HolderCountItem) => item.network.toLowerCase() === 'doge')?.count || 0,
    },
    totalSupply,
    averageBalance,
  }

  return (
    <VStack w="100%" maxW="content" gap="30px">
      {assetQuote ? (
        <HolderSummarySection summary={holderSummary} />
      ) : (
        <VStack w="100%" maxW="content" flex={1} gap="32px">
          <Center h="176px" w="100%" rounded="8px" overflow="hidden">
            <LoadingBox />
          </Center>
        </VStack>
      )}
      <Box w="100%" bg="bg.card" flexDir="column" alignItems="center" rounded="8px">
        <Flex
          gap="20px"
          flexDir={{ base: 'column', md: 'row' }}
          w="100%"
          bg="bg.input"
          justifyContent="space-between"
          py="20px"
          px={{ base: '20px', lg: '30px' }}
          roundedTop="8px"
        >
          <HStack gap="16px">
            <Heading fontSize="20px" fontWeight="semibold" w="100%" textAlign="left">
              <Trans>{holderSummary.totalHolders} Holders</Trans>
            </Heading>
          </HStack>
        </Flex>
        <Box p="0px">
          {(holders&&assetInfo) ? (
            <CoinHolderList
              holders={holders.map((holder: Holder, index: number) => ({
                address: holder.address,
                chain: holder.network.toUpperCase() as Chain,
                value: Number(holder.value),
                percentage: Number(holder.percentage),
                rank: index + 1,
                amount: String(holder.amount),
              }))}
              decimals={assetInfo.info.decimals||8}
              totalSupply={totalSupply}
            />
          ) : null}
             
        </Box>
      </Box>
    </VStack>
  )
}
