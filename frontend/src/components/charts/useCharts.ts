import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import dayjs from 'dayjs'

import { AssetsCountChart, AssetsCountStats } from '@/components/charts/assets-count-chart'
// import { ComingSoonChart } from '@/components/charts/coming-soon-chart'
import { DailyTransactionsCountChart, DailyTransactionsCountStats } from '@/components/charts/daily-transactions-count-chart'
import { HoldersCountChart, HoldersCountStats } from '@/components/charts/holders-count-chart'
import { TransactionsCountChart, TransactionsCountStats } from '@/components/charts/transactions-count-chart'
import { ChartCategory, ChartDefinition, HoldersCountChartDataPoint, IssueCountChartDataPoint, TransactionCountChartDataPoint } from '@/components/charts/types'
import { DATE_TEMPLATE } from '@/constants'
import { useDailyRgbppTxCountRecords } from '@/hooks/trpc/useDailyRgbppTxCountRecords'
import { useRgbppHolderCountRecords } from '@/hooks/trpc/useRgbppHolderCountRecords'
import { useRgbppIssueCountRecords } from '@/hooks/trpc/useRgbppIssueCountRecords'
import { useRgbppTransactionCountRecords } from '@/hooks/trpc/useRgbppTransactionCountRecords'

// charts, todo
export function useCharts() {
  const { i18n } = useLingui()

  const charts: ChartDefinition[] = [
    {
      id: 'total-assets',
      title: t(i18n)`Total Count of RGB++ Asset `,
      description: t(i18n)`The total number of RGB++ assets, including FT and DOB`,
      category: 'overview',
      chartRender: AssetsCountChart, 
      statsRender: AssetsCountStats,
      useData: useRgbppIssueCountRecords,
      prepareDownloadData: (data) => {
        return {
          filename: 'rgbpp-assets-count',
          headers: ['Date', 'Coins', 'DOB Collection', 'Total'],
          rows: data?.map((item: IssueCountChartDataPoint) => [
            dayjs(item.timestamp).format(DATE_TEMPLATE),
            item.xudt,
            item.dob,
            item.total
          ])
        }
      },
    },
    {
      id: 'total-holders',
      title: t(i18n)`Total Holders of RGB++ Asset`,
      description: t(i18n)`The number of unique addresses that hold at least one RGB++ asset`,
      category: 'overview',
      chartRender: HoldersCountChart, 
      statsRender: HoldersCountStats,
      useData: useRgbppHolderCountRecords,
      prepareDownloadData: (data) => {
        return {
          filename: 'rgbpp-holders-count',
          headers: ['Date', 'CKB chain holders', 'BTC chain holders', 'Doge chain holders', 'Total'],
          rows: data?.map((item: HoldersCountChartDataPoint) => [
            dayjs(item.timestamp).format(DATE_TEMPLATE),
            item.ckb,
            item.btc,
            item.doge,
            item.total
          ])
        }
      },
    },
    {
      id: 'total-transactions',
      title: t(i18n)`Total Transactions of RGB++ Assets`,
      description: t(i18n)`The number of transactions related to RGB++ assets`,
      category: 'overview',
      chartRender: TransactionsCountChart, 
      statsRender: TransactionsCountStats,
      useData: useRgbppTransactionCountRecords,
      prepareDownloadData: (data) => {
        return {
          filename: 'rgbpp-assets-transactions',
          headers: ['Date', 'CKB chain', 'BTC chain', 'Doge chain', 'Unknown chain', 'Total'],
          rows: data?.map((item: TransactionCountChartDataPoint) => [
            dayjs(item.timestamp).format(DATE_TEMPLATE),
            item.ckb,
            item.btc,
            item.doge,
            item.unknown,
            item.total
          ])
        }
      },
    },
    {
      id: 'daily-transactions',
      title: t(i18n)`Daily Transactions of RGB++ Assets`,
      description: t(i18n)`Daily transactions related to RGB++ assets`,
      category: 'overview',
      chartRender: DailyTransactionsCountChart, 
      statsRender: DailyTransactionsCountStats,
      useData: useDailyRgbppTxCountRecords,
      prepareDownloadData: (data) => {
        return {
          filename: 'rgbpp-daily-transactions',
          headers: ['Date', 'CKB chain', 'BTC chain', 'Doge chain', 'Unknown chain', 'Total'],
          rows: data?.map((item: TransactionCountChartDataPoint) => [
            dayjs(item.timestamp).format(DATE_TEMPLATE),
            item.ckb,
            item.btc,
            item.doge,
            item.unknown,
            item.total
          ])
        }
      },
    }
    ,
    // {
    //   id: 'occupied-ckb',
    //   title: t(i18n)`Total Occupied CKB`,
    //   description: t(i18n)`The total amount of CKB occupied by RGB++ assets`,  
    //   category: 'utilization',
    //   chartRender: ComingSoonChart, 
    //   statsRender: undefined,
    //   useData: () => ({ data: null, isLoading: false }),
    //   prepareDownloadData: (data) => {
    //     return {
    //       filename: 'rgbpp-assets-transactions',
    //       headers: ['Date', 'xUDT(FT)', 'DOB(NFT)', 'Total'],
    //       rows: data?.map((item: IssueCountChartDataPoint) => [
    //         dayjs(item.timestamp).format(DATE_TEMPLATE),
    //         item.xudt,
    //         item.dob,
    //         item.total
    //       ])
    //     }
    //   },
    // },
  ]

  const chartCategories: ChartCategory[] = [
    {
      id: 'overview',
      title: t(i18n)`RGB++ Assets Overview & Activity`,
      charts: charts.filter(chart => chart.category === 'overview'),
    },
    // {
    //   id: 'utilization',
    //   title: t(i18n)`RGB++ Assets Utilization`,
    //   charts: charts.filter(chart => chart.category === 'utilization'),
    // },
  ]

  const getChartById = (id: string) => charts.find(chart => chart.id === id)

  return { charts, chartCategories, getChartById }
}
