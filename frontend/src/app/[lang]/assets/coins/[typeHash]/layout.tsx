'use client'
import {  Trans } from '@lingui/macro'
import { PropsWithChildren } from 'react'

import { CoinInfo } from '@/components/coin-info'
import { LinkTabs } from '@/components/link-tabs'

export default async function AssetDetail({
  children,
  params: { typeHash, lang },
}: PropsWithChildren<{ params: { typeHash: string; lang: string } }>) {

  return (
    <>
      <CoinInfo typeHash={typeHash} />
      <LinkTabs
        links={[
          {
            href: `/${lang}/assets/coins/${typeHash}/holders`,
            label: <Trans>Holders</Trans>,
          },
          {
            href: `/${lang}/assets/coins/${typeHash}/transactions`,
            label: <Trans>Transactions</Trans>,
          },
        ]}
        maxW="content"
        w="100%"
        justify="start"
      />

      {children}
    </>
  )
}
