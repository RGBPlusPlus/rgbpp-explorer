'use client'
import { Trans } from '@lingui/macro'
import { Grid, HStack, VStack } from 'styled-system/jsx'

import OverviewSVG from '@/assets/overview.svg'
import { OverflowAmount } from '@/components/overflow-amount'
import { OverviewInfo, OverviewInfoItem } from '@/components/overview-info'
import { Heading } from '@/components/ui'
import { useAddressInfoCKB } from '@/hooks/useRgbppData'
import { shannonToCKB } from '@/lib/ckb/shannon-to-ckb'
import { formatNumber } from '@/lib/string/format-number'

export function CkbAddressOverview({ ckbAddress }: { ckbAddress: string }) {
  if (!ckbAddress) return null
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { ckbInfo, isLoading, error } = useAddressInfoCKB(ckbAddress)
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
        {!isLoading && ckbInfo ? (
          <>
            <OverviewInfo>
              <OverviewInfoItem label={<Trans>CKB Balance</Trans>}>
                <OverflowAmount
                  amount={formatNumber(shannonToCKB(ckbInfo.balance?.total))}
                  symbol={<Trans>CKB</Trans>}
                />
              </OverviewInfoItem>
              <OverviewInfoItem label={<Trans>Available</Trans>}>
                <OverflowAmount
                  amount={formatNumber(shannonToCKB(ckbInfo.balance?.total - ckbInfo.balance?.occupied))}
                  symbol={<Trans>CKB</Trans>}
                />
              </OverviewInfoItem>
              
            </OverviewInfo>
            <OverviewInfo>
            <OverviewInfoItem label={<Trans>Occupied</Trans>}>
                <OverflowAmount
                  amount={formatNumber(shannonToCKB(ckbInfo.balance?.occupied))}
                  symbol={<Trans>CKB</Trans>}
                />
              </OverviewInfoItem>
              <OverviewInfoItem label={<Trans>Txns</Trans>} formatNumber>
                {ckbInfo.tx?.count}
              </OverviewInfoItem>
              {/* <OverviewInfoItem label={<Trans>L2 RGB++ Assets</Trans>} unsupported /> */}
            </OverviewInfo>
          </>
        ) : null}
      </Grid>
    </VStack>
  )
}
