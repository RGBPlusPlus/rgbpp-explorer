import '@/styles/globals.css'

import { GoogleAnalytics } from '@next/third-parties/google'
import type { Metadata } from 'next'
import { Montserrat } from 'next/font/google'

import { env } from '@/constants/env'

const montserrat = Montserrat({
  weight: ['400', '500', '600', '700'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-montserrat',
  fallback: ['Arial', 'sans-serif'],
})

export const metadata: Metadata = {
  title: 'RGB++ Explorer',
  icons: '/logo.svg',
}

type Props = {
  children: React.ReactNode;
};

export default function RootLayout({ children }: Props) {
  return (
    <html lang="en">
      <body className={`${montserrat.variable}`}>
        {env.share.GA_ID ? <GoogleAnalytics gaId={env.share.GA_ID} /> : null}
        {children}
      </body>
    </html>
  )
} 