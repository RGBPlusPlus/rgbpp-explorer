'use client'

import { Trans } from '@lingui/macro'
import { ReactNode } from 'react'
import { Box, Grid, HStack, VStack } from 'styled-system/jsx'

import ArrowIcon from '@/assets/arrow.svg'
// import BchIcon from '@/assets/chains/bch.svg'
import BtcIcon from '@/assets/chains/btc.svg'
import CkbIcon from '@/assets/chains/ckb.svg'
// import DogeIcon from '@/assets/chains/doge.svg'
// import UtxoStackIcon from '@/assets/chains/utxo-stack.svg'
import Link from '@/components/ui/link'
import { Text } from '@/components/ui/primitives/text'
import { useBtcInfo, useCkbInfo } from '@/hooks/useRgbppData'
import { formatNumber } from '@/lib/string/format-number'

function FieldGroup({ fields }: { fields: Array<{ label: ReactNode; value: ReactNode }> }) {
  return (
    <VStack gap="16px" fontSize="14px" lineHeight="18px" w="100%">
      {fields.map((field, i) => (
        <HStack key={i} justify="space-between" w="100%">
          <Box color="text.third">{field.label}</Box>
          <Box>{field.value}</Box>
        </HStack>
      ))}
    </VStack>
  )
}

export function NetworkCards() {
  const {data:btcChainInfo} = useBtcInfo()
  const {data:ckbChainInfo} = useCkbInfo()
  
  return (
    <Grid w="100%" gridTemplateColumns={{ base: '100%', sm: 'repeat(2, 1fr)', lg: 'repeat(2, 1fr)' }}>
      <Link
        href="/explorer/btc"
        display="flex"
        alignItems="start"
        flexDir="column"
        justifyContent="space-between"
        gap="36px"
        bg="bg.card"
        _hover={{ bg: 'bg.card.hover' }}
        transition="200ms"
        rounded="8px"
        p={{ base: '20px', xl: '30px' }}
      >
        <HStack gap="16px" w="100%">
          <BtcIcon w="48px" />
          <Text fontSize="22px" fontWeight="bold">
            <Trans>Bitcoin</Trans>
          </Text>
          <ArrowIcon ml="auto" w="28px" />
        </HStack>
        <FieldGroup
          fields={[
            {
              label: <Trans>Block Height</Trans>,
              value: formatNumber(btcChainInfo?.tipBlockHeight ?? 0),
            },
            {
              label: <Trans>Txns(24H)</Trans>,
              value: formatNumber(btcChainInfo?.rgbpp?.txCountInLast24h ?? 0),
            },
          ]}
        />
      </Link>
      <Link
        href="/explorer/ckb"
        display="flex"
        flexDir="column"
        justifyContent="space-between"
        alignItems="start"
        gap="36px"
        bg="bg.card"
        _hover={{ bg: 'bg.card.hover' }}
        transition="200ms"
        rounded="8px"
        p={{ base: '20px', xl: '30px' }}
      >
        <HStack gap="16px" w="100%">
          <CkbIcon w="48px" />
          <Text fontSize="22px" fontWeight="bold">
            <Trans>CKB</Trans>
          </Text>
          <ArrowIcon ml="auto" w="28px" />
        </HStack>
        <FieldGroup
          fields={[
            {
              label: <Trans>Block Height</Trans>,
              value: formatNumber(ckbChainInfo?.tipBlock?.number ?? 0),
            },
            {
              label: <Trans>Txns(24H)</Trans>,
              value: formatNumber(ckbChainInfo?.txCountInLast24h ?? 0),
            },
          ]}
        />
      </Link>
       {/* <VStack
        gap="40px"
        bg="bg.card"
        rounded="8px"
        p="30px"
        opacity={0.5}
        fontSize="14px"
        gridColumn={{ base: 'auto', sm: '1/3', lg: 'auto' }}
      >
       <HStack gap="24px" fontWeight="semibold" w="100%" justify="center">
          <HStack>
            <DogeIcon w="32px" h="32px" />
            <Text>DOGE</Text>
          </HStack>
          <HStack>
            <BchIcon w="32px" h="32px" />
            <Text>BCH</Text>
          </HStack>
          <HStack whiteSpace="nowrap">
            <UtxoStackIcon w="32px" h="32px" />
            <Text>UTXO Stack</Text>
          </HStack>
        </HStack> 
        <Box fontWeight="semibold" py="10px" px="40px" rounded="100px" bg="bg.input" mx="auto">
          <Trans>Coming</Trans>
        </Box>
      </VStack>*/}
    </Grid>
  )
}
