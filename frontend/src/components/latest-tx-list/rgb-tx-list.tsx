'use client'

import { Trans } from '@lingui/macro'
import { Box, HStack, VStack } from 'styled-system/jsx'

import BtcIcon from '@/assets/chains/btc.svg'
import CkbIcon from '@/assets/chains/ckb.svg'
import DogeIcon from '@/assets/chains/doge.svg'
import { AgoTimeFormatter } from '@/components/ago-time-formatter'
import { Copier } from '@/components/copier'
import { IfBreakpoint } from '@/components/if-breakpoint'
// import { Amount } from '@/components/latest-tx-list/amount'
import { LayerType } from '@/components/layer-type'
import { Table } from '@/components/ui'
import Link from '@/components/ui/link'
// import { ViewBtcExplorer } from '@/components/view-btc-explorer'
// import { ViewCkbExplorer } from '@/components/view-ckb-explorer'
import { useBreakpoints } from '@/hooks/useBreakpoints'
// import { resolveLayerTypeFromRGBppTransaction } from '@/lib/resolve-layer-type-from-rgbpp-transaction'
// import { resolveRGBppTxHash } from '@/lib/resolve-rgbpp-tx-hash'
import { formatNumber } from '@/lib/string/format-number'
import { truncateMiddle } from '@/lib/string/truncate-middle'
import type { CkbTransaction } from '@/types/graphql'

const filterType = [
  { label: 'BTC', value: 'BTC', icon: <BtcIcon w="18px" h="18px" mr="4px" /> },
  { label: 'CKB', value: 'CKB', icon: <CkbIcon w="18px" h="18px" mr="4px" /> },
  { label: 'DOGE', value: 'DOGE', icon: <DogeIcon w="18px" h="18px" mr="4px" /> },
  { label: 'Leap (Cross-Chain)', value: 'LEAP' },
]

type RGBTransaction = {
  blockTimestamp: string|number
  ckbTxHash: string
  btcTxid: string
  //withinBTC L1 在首页是null
  //in L1-L2 在首页是on
  //leapoutBTC L2-L1 在首页是off
  leapDirection: 'withinBTC' | 'in' | 'leapoutBTC'
  blockNumber: number
  ckbTransaction: CkbTransaction
}

export function LatestRGBTxnListUI({ txs }: { txs: RGBTransaction[] }) {
  const isMd = useBreakpoints('md')
  const isLg = useBreakpoints('lg')

  if (!isMd) {
    return txs.map((tx) => {
      const txHash = tx.ckbTxHash
      return (
        <Link
          href={`/transaction/${txHash}`}
          display="flex"
          alignItems="center"
          gap={5}
          fontSize="14px"
          fontWeight="semibold"
          p="20px"
          key={tx.ckbTxHash}
          w="100%"
          flexDirection="column"
          borderBottom="1px solid"
          borderBottomColor="border.primary"
          transition="100ms"
          _hover={{
            bg: 'bg.card.hover',
          }}
          _last={{
            borderBottom: 'none',
          }}
        >
          <HStack gap={3} alignItems="center" w="100%" color="text.link">
            <VStack gap={0} alignItems="start">
              <Box lineHeight="20px">{truncateMiddle(txHash, 10, 8)}</Box>
              <Box color="text.third" fontWeight="medium" lineHeight="16px">
                <AgoTimeFormatter
                  time={tx.blockTimestamp}
                  tooltip
                />
              </Box>
            </VStack>
          </HStack>
          <HStack justifyContent="space-between" w="100%">
            <LayerType type={
              tx.leapDirection === 'withinBTC' ? 'l2' :
              tx.leapDirection === 'in' ? 'l1-l2' :
              'l2-l1'
            } />
            <Box>
            {formatNumber(tx.blockNumber)}
              {/* <Amount transaction={tx.ckbTransaction} /> */}
            </Box>
          </HStack>
        </Link>
      )
    })
  }

  return (
    <VStack w="100%" gap={0}>
      <Table.Root tableLayout="fixed">
        <Table.Head>
          <Table.Row>
            <Table.Header w={{ base: '300px', lg: '354px' }}>
              <Trans>Tx hash</Trans>
            </Table.Header>
            {isLg ? (
              <Table.Header w="140px">
                <Trans>Block Height</Trans>
              </Table.Header>
            ) : null}
            <Table.Header w="160px">
              <Trans>Type</Trans>
            </Table.Header>
            {/* <Table.Header w="190px">
              <Trans>Amount</Trans>
            </Table.Header> */}
            <Table.Header w="135px">
              <Trans>Time</Trans>
            </Table.Header>
          </Table.Row>
        </Table.Head>
        <Table.Body>
          {txs.map((tx) => {
            const txHash = tx.ckbTxHash
            console.log(tx)
            return (
              <Table.Row key={txHash}>
                <Table.Cell>
                  <Copier onlyIcon value={txHash}>
                    <Link
                      href={`/transaction/${txHash}`}
                      display="flex"
                      fontSize="14px"
                      alignItems="center"
                      gap={3}
                      color="text.link"
                    >
                      <IfBreakpoint breakpoint="lg" fallback={truncateMiddle(txHash, 6, 4)}>
                        {truncateMiddle(txHash, 10, 10)}
                      </IfBreakpoint>
                    </Link>
                  </Copier>
                </Table.Cell>
                {isLg ? <Table.Cell>{formatNumber(tx.blockNumber)}</Table.Cell> : null}
                <Table.Cell>
                  <LayerType type={
                    tx.leapDirection === 'withinBTC' ? 'l2' :
                    tx.leapDirection === 'in' ? 'l1-l2' :
                    'l2-l1'
                  } />
                </Table.Cell>
                {/* <Table.Cell>
                  <Amount transaction={tx.ckbTransaction} />
                </Table.Cell> */}
                <Table.Cell>
                  <AgoTimeFormatter time={tx.blockTimestamp} tooltip />
                </Table.Cell>
              </Table.Row>
            )
          })}
        </Table.Body>
      </Table.Root>
      {/* <HStack gap="8px" justifyContent="center" mt="20px">
        {txs.map((tx) => {
          const type = tx.leapDirection === 'BtcToCkb' ? 'l2' : 'l2-l1'
          const txHash = tx.ckbTxHash
          return (
            <Flex
              key={txHash}
              justifyContent="space-between"
              w="100%"
              minH="60px"
              py="8px"
              alignItems="center"
              borderBottom="1px solid"
              borderBottomColor="border.primary"
            >
              <HStack gap="8px">
                <Copier onlyIcon value={txHash}>
                  <Link
                    href={`/transaction/${txHash}`}
                    color="brand"
                    fontSize="14px"
                    cursor="pointer"
                    _hover={{ textDecoration: 'underline' }}
                  >
                    <IfBreakpoint breakpoint="sm" fallback={truncateMiddle(txHash, 6, 6)}>
                      {truncateMiddle(txHash, 10, 10)}
                    </IfBreakpoint>
                  </Link>
                </Copier>
              </HStack>
              <VStack gap={0} alignItems="flex-end" fontSize={{ base: '14px', md: '16px' }} textAlign="right">
                <Box>
                  {formatNumber(tx.blockNumber)}{' '}
                  <Text as="span" fontSize="12px" color="text.third">
                    <Trans>Block</Trans>
                  </Text>
                </Box>
                <Box>
                  {formatNumber(tx.timestamp)}{' '}
                  <Text as="span" fontSize="12px" color="text.third">
                    <Trans>Timestamp</Trans>
                  </Text>
                </Box>
              </VStack>
              <HStack gap="8px">
                {type === 'l2' ? (
                  <ViewBtcExplorer txid={tx.btcTxid} />
                ) : (
                  <ViewCkbExplorer txHash={tx.ckbTxHash} />
                )}
              </HStack>
            </Flex>
          )
        })}
      </HStack> */}
    </VStack>
  )
}
