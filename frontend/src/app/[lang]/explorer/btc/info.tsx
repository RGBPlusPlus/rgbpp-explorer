'use client'
import { Trans } from '@lingui/macro'
import { Grid, HStack, VStack } from 'styled-system/jsx'

import BtcIcon from '@/assets/chains/btc.svg'
import SpeedDropIcon from '@/assets/speed/drop.svg'
import SpeedHighIcon from '@/assets/speed/high.svg'
import SpeedLowIcon from '@/assets/speed/low.svg'
import SpeedMediumIcon from '@/assets/speed/medium.svg'
import {
  OverviewInfo,
  OverviewInfoGrid,
  OverviewInfoItem,
  OverviewInfoTagLabel,
  splitLineBefore,
} from '@/components/overview-info'
import { Heading } from '@/components/ui'
import { useBtcInfo } from '@/hooks/useRgbppData'

export function Info() {
  const { data : btcInfo,isLoading} = useBtcInfo()
 
  return (
    btcInfo && !isLoading ? 
    (
      <VStack gridColumn="1/3" gap="20px" bg="bg.card" p={{ base: '20px', md: '30px' }} alignItems="start" rounded="8px">
        <HStack gap="16px">
          <BtcIcon w="48px" h="48px" />
          <Heading fontSize="20px" fontWeight="bold"><Trans>Bitcoin</Trans></Heading>
      </HStack>
      <Grid w="100%" gridTemplateColumns={{ base: '1fr', xl: 'repeat(2, 1fr)' }} gap={{ base: '20px', md: '30px' }}>
        <OverviewInfo>
          <OverviewInfoItem label={<Trans>Block Height</Trans>} formatNumber>
            {btcInfo.tipBlockHeight}
          </OverviewInfoItem>
          <OverviewInfoItem label={<Trans>L1 RGB++ Txns(24H)</Trans>} formatNumber>
            {btcInfo.rgbpp.txCountInLast24h}
          </OverviewInfoItem>
          <OverviewInfoItem label={<Trans>RGB++ Assets Holders</Trans>} formatNumber>
            {btcInfo.rgbpp.holdersCount}
          </OverviewInfoItem>
        </OverviewInfo>
        <OverviewInfoGrid
          gridTemplateColumns={{ base: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' }}
          rowGap="35px"
          css={{
            '& > div:not(:last-child)': {
              pos: 'relative',
              _before: { ...splitLineBefore, content: '" "' },
            },
            '& > div:nth-child(even):not(:last-child)': {
              pos: 'relative',
              _before: {
                ...splitLineBefore,
                content: { base: 'unset', md: '" "' },
              },
            },
          }}
        >
          <OverviewInfoItem
            formatNumber
            unit={<Trans>sats/vB</Trans>}
            direction="column"
            label={
              <OverviewInfoTagLabel bg="danger.a10" color="danger" icon={<SpeedHighIcon />} mx="auto">
                <Trans>High</Trans>
              </OverviewInfoTagLabel>
            }
          >
            {btcInfo.fee.fastestFee}
          </OverviewInfoItem>
          <OverviewInfoItem
            formatNumber
            direction="column"
            unit={<Trans>sats/vB</Trans>}
            label={
              <OverviewInfoTagLabel bg="warning.a10" color="warning" icon={<SpeedMediumIcon />} mx="auto">
                <Trans>Medium</Trans>
              </OverviewInfoTagLabel>
            }
          >
            -
            {/* {btcInfo.fee.halfHourFee} */}
          </OverviewInfoItem>
          <OverviewInfoItem
            formatNumber
            unit={<Trans>sats/vB</Trans>}
            direction="column"
            label={
              <OverviewInfoTagLabel bg="success.a10" color="success" icon={<SpeedLowIcon />} mx="auto">
                <Trans>Low</Trans>
              </OverviewInfoTagLabel>
            }
          >
            {btcInfo.fee.minimumFee}
          </OverviewInfoItem>
          <OverviewInfoItem
            formatNumber
            unit={<Trans>sats/vB</Trans>}
            direction="column"
            label={
              <OverviewInfoTagLabel bg="brand.a10" color="brand" icon={<SpeedDropIcon />} mx="auto">
                <Trans>Drop</Trans>
              </OverviewInfoTagLabel>
            }
          >
            {btcInfo.fee.minimumFee}
          </OverviewInfoItem>
        </OverviewInfoGrid>
      </Grid>
    </VStack>)  
    :null  
  )
}