'use client'

import { Trans } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import BigNumber from 'bignumber.js'
// import dayjs from 'dayjs'
// import { sum } from 'lodash-es'
import { Box, HStack, styled, VStack } from 'styled-system/jsx'

import { AppTooltip } from '@/components/app-tooltip'
import { IfBreakpoint } from '@/components/if-breakpoint'
import { TextOverflowTooltip } from '@/components/text-overflow-tooltip'
import { Table, Text } from '@/components/ui'
import Link from '@/components/ui/link'
import { XudtLogoLoader } from '@/components/xudt-logo-loader'
// import { DATE_TEMPLATE } from '@/constants'
// import { RgbppCoinsQuery } from '@/gql/graphql'
import { formatBigNumber, formatNumber } from '@/lib/string/format-number'

type CoinType = {

    firstFoundTime:string|undefined
    holderCount:number
    icon:string
    id:string
    marketCap:string
    name:string | null
    price:string
    priceChange24h:string
    tradingVolume24h:string
    transactionCount:string
  
}

const MarketCapRender = ({ assetInfo }: { assetInfo: CoinType }) => {
  const { i18n } = useLingui()
  const lang = i18n.locale



  const decimals = 8;
  const divisor = new BigNumber(10).pow(decimals);

  
  const marketCap = formatBigNumber(
    assetInfo.marketCap,
    2,
    lang
  );

  return `$${marketCap}` 
}

export function CoinList<T extends CoinType>({ coins }: { coins: T[] | undefined }) {

  return (
    <IfBreakpoint breakpoint="lg" fallback={<CoinListGrid coins={coins} />}>
      <Table.Root w="100%" tableLayout="fixed">
        <Table.Head backgroundColor={'bg.input'}>
          <Table.Row>
            <Table.Header w="200px">
              <Trans>Coin</Trans>
            </Table.Header>
            <Table.Header w="100px">
              <Trans>Holders</Trans>
            </Table.Header>
            <Table.Header w="100px">
              <Trans>Price</Trans>
            </Table.Header>
            <Table.Header w="120px">
              <Trans>Txns(24H)</Trans>
            </Table.Header>
            <Table.Header w="120px">
              <Trans>Volume(24H)</Trans>
            </Table.Header>
           
            {/* <Table.Header w="140px">
              <Trans>Total Supply</Trans>
            </Table.Header> */}
            <Table.Header w="160px">
              <Trans>Market Cap</Trans>
            </Table.Header>
          </Table.Row>
        </Table.Head>
        <Table.Body>
          {coins?.map((coin) => {
            return (
              <Table.Row key={coin.id}>
                <Table.Cell>
                  <Link
                    href={`/assets/coins/${coin.id}`}
                    display="flex"
                    alignItems="center"
                    gap={3}
                    color="text.link"
                    cursor="pointer"
                  >
                    {coin.icon ? (
                      <styled.img w="32px" h="32px" src={coin.icon} rounded="100%" />
                    ) : (
                      <XudtLogoLoader symbol={coin.name} size={{ width: '32px', height: '32px', fontSize: '14px' }} />
                    )}
                    <TextOverflowTooltip label={coin.name}>
                      <Text maxW="200px" truncate cursor="pointer">
                        {coin.name}
                      </Text>
                    </TextOverflowTooltip>
                  </Link>
                </Table.Cell>
                <Table.Cell>{formatNumber(coin.holderCount)}</Table.Cell>
                <Table.Cell overflow={'hidden'} textOverflow={'ellipsis'}>
                  <AppTooltip 
                    trigger={<span>${formatNumber(coin.price)}</span>} 
                    content={formatNumber(coin.price)}
                   />
                </Table.Cell>
                <Table.Cell>{formatNumber(coin.transactionCount)}</Table.Cell>
                <Table.Cell>${formatNumber(coin.tradingVolume24h)}</Table.Cell>
               
                <Table.Cell><MarketCapRender assetInfo={coin} /></Table.Cell>
                {/* <Table.Cell>{coin.deployedAt ? dayjs(coin.deployedAt).format(DATE_TEMPLATE) : '-'}</Table.Cell>*/}
              </Table.Row>
            )
          })}
        </Table.Body>
      </Table.Root>
    </IfBreakpoint>
  )
}

export function CoinListGrid<T extends CoinType>({ coins }: { coins: T[] | undefined }) {
  return (
    <VStack gap={0} w="100%">
      {coins?.map((coin) => {
        return (
          <Link
            href={`/assets/coins/${coin.id}`}
            display="grid"
            w="100%"
            gap="16px"
            gridTemplateColumns="repeat(2, 1fr)"
            key={coin.id}
            p="20px"
            borderBottom="1px solid"
            borderBottomColor="border.primary"
            _hover={{
              bg: 'bg.card.hover',
            }}
          >
            <HStack w="100%" gridColumn="1/3" color="brand">
              {coin.icon ? (
                <styled.img w="32px" h="32px" src={coin.icon} rounded="100%" />
              ) : (
                <XudtLogoLoader symbol={coin.name} size={{ width: '32px', height: '32px', fontSize: '14px' }} />
              )}
              <TextOverflowTooltip label={coin.name}>
                <Text maxW="200px" truncate cursor="pointer">
                  {coin.name}
                </Text>
              </TextOverflowTooltip>
            </HStack>
            {[
              {
                label: <Trans>Holders</Trans>,
                value: formatNumber(coin.holderCount),
              },
              {
                label: <Trans>Price</Trans>,
                value: '$' + formatNumber(coin.price),
              },
              {
                label: <Trans>Txns(24H)</Trans>,
                value: formatNumber(coin.transactionCount),
              },
              {
                label: <Trans>Volume(24H)</Trans>,
                value: '$' + formatNumber(coin.tradingVolume24h),
              },
             
              {
                label: <Trans>Market Cap</Trans>,
                value: <MarketCapRender assetInfo={coin} />, // '$' + formatNumber(coin.quote.marketCap),
              },
              // {
              //   label: <Trans>Deploy Time</Trans>,
              //   value: coin.deployedAt ? dayjs(coin.deployedAt).format(DATE_TEMPLATE) : '-',
              // },
            ].map((x, i) => {
              return (
                <VStack fontSize="14px" w="100%" alignItems="start" fontWeight="medium" key={i} gap="4px">
                  <Box color="text.third">{x.label}</Box>
                  <Box>{x.value}</Box>
                </VStack>
              )
            })}
          </Link>
        )
      })}
    </VStack>
  )
}
