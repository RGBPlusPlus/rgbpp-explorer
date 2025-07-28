'use client'

import { Trans } from '@lingui/macro'
import { Grid, HStack, VStack } from 'styled-system/jsx'

import OverviewSVG from '@/assets/overview.svg'
import { OverflowAmount } from '@/components/overflow-amount'
import { OverviewInfo, OverviewInfoItem } from '@/components/overview-info'
import { Heading } from '@/components/ui'
import { useAddressInfoBTC } from '@/hooks/useRgbppData'
import { satsToBtc } from '@/lib/btc/sats-to-btc'
import { formatNumber } from '@/lib/string/format-number'

export function BtcAddressOverview({ btcAddress }: { btcAddress: string }) {
  if (!btcAddress) return null
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { btcInfo, isLoading, error } = useAddressInfoBTC(btcAddress)
  console.log(btcInfo)
  return (
    <VStack gap={0} w="100%" bg="bg.card" rounded="8px">
      <HStack w="100%" px="30px" py="16px" gap="12px" borderBottom="1px solid" borderBottomColor="border.primary">
        <OverviewSVG w="24px" />
        <Heading fontSize="16px" fontWeight="semibold">
          <Trans>Overview</Trans>
        </Heading>
      </HStack>
      <Grid
        w="100%"
        gridTemplateColumns={{ base: '1fr', lg: 'repeat(2, 1fr)' }}
        gap={{ base: '20px', xl: '30px' }}
        pt="20px"
        pb={{ base: '20px', xl: '30px' }}
        px={{ base: '20px', xl: '30px' }}
        textAlign="center"
      >
        {!isLoading && btcInfo ? (
          <>
            <OverviewInfo>
              <OverviewInfoItem label={<Trans>BTC Balance</Trans>}>
                <OverflowAmount amount={formatNumber(satsToBtc(btcInfo.satoshis))} symbol={<Trans>BTC</Trans>} />
              </OverviewInfoItem>

              <OverviewInfoItem label={<Trans>Txns</Trans>} formatNumber>
                {btcInfo.txCount}
              </OverviewInfoItem>
            </OverviewInfo>
            <OverviewInfo>
              <OverviewInfoItem label={<Trans>Confirmed</Trans>}>
                <OverflowAmount
                  amount={formatNumber(satsToBtc(btcInfo.satoshis).minus(btcInfo.pendingSatoshis))}
                  symbol={<Trans>BTC</Trans>}
                />
              </OverviewInfoItem>
              <OverviewInfoItem label={<Trans>Unconfirmed</Trans>}>
                <OverflowAmount amount={formatNumber(satsToBtc(btcInfo.pendingSatoshis))} symbol={<Trans>BTC</Trans>} />
              </OverviewInfoItem>

              {/* <OverviewInfoItem label={<Trans>L1 RGB++ Assets</Trans>} unsupported />  */}
            </OverviewInfo>
          </>
        ) : null}
      </Grid>
    </VStack>
  )
}
