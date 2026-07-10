import type { SalesRecord } from '@/types/sales'
import { groupSumBy, hasProfitData, marginsByKey, toSortedEntries } from './groupBy'
import { monthlyRevenue, profitMargin, totalProfit, totalRevenue } from './kpis'
import { formatCompactCurrency, formatPercent } from '@/lib/utils/formatters'

export type InsightTone = 'positive' | 'warning' | 'critical'

export interface Insight {
  id: string
  tone: InsightTone
  text: string
}

const MARGIN_GAP_THRESHOLD = 3
const HIGH_REVENUE_SHARE_THRESHOLD = 0.2
const LOW_MARGIN_GAP_THRESHOLD = 5

function headlineInsight(rows: SalesRecord[]): Insight {
  const revenue = totalRevenue(rows)
  const profit = totalProfit(rows)
  const margin = profitMargin(rows)

  if (profit === null || margin === null) {
    return {
      id: 'headline',
      tone: 'positive',
      text: `The business generated ${formatCompactCurrency(revenue)} in revenue across ${rows.length.toLocaleString()} orders. This dataset has no Profit column, so profit and margin can't be reported.`,
    }
  }

  return {
    id: 'headline',
    tone: profit >= 0 ? 'positive' : 'critical',
    text: `The business generated ${formatCompactCurrency(revenue)} in revenue and ${formatCompactCurrency(profit)} in profit, a ${formatPercent(margin)} margin.`,
  }
}

function trendInsight(rows: SalesRecord[]): Insight | null {
  const series = monthlyRevenue(rows)
  if (series.length < 2) return null

  const latest = series[series.length - 1]
  const previous = series[series.length - 2]
  if (previous.value === 0) return null

  const change = ((latest.value - previous.value) / previous.value) * 100
  if (Math.abs(change) < 1) return null

  const direction = change >= 0 ? 'increased' : 'decreased'
  return {
    id: 'trend',
    tone: change >= 0 ? 'positive' : 'warning',
    text: `Revenue ${direction} ${formatPercent(Math.abs(change))} in the most recent month compared to the previous month.`,
  }
}

function regionUnderperformanceInsight(rows: SalesRecord[]): Insight | null {
  if (!hasProfitData(rows)) return null

  const margins = marginsByKey(rows, (row) => row.region)
  if (margins.size < 2) return null

  const overall = profitMargin(rows) ?? 0
  const [worst] = toSortedEntries(margins, 'asc')
  if (overall - worst.value < MARGIN_GAP_THRESHOLD) return null

  return {
    id: 'region-underperforming',
    tone: worst.value < 0 ? 'critical' : 'warning',
    text: `The ${worst.name} region is underperforming, with a ${formatPercent(worst.value)} profit margin versus the ${formatPercent(overall)} company average.`,
  }
}

function categoryContradictionInsight(rows: SalesRecord[]): Insight | null {
  if (!hasProfitData(rows)) return null

  const revenueByCategory = groupSumBy(rows, (row) => row.category, (row) => row.sales)
  const margins = marginsByKey(rows, (row) => row.category)
  const revenue = totalRevenue(rows)
  const overallMargin = profitMargin(rows) ?? 0
  if (revenue === 0) return null

  let flagged: { name: string; share: number; margin: number } | null = null
  for (const [name, categoryRevenue] of revenueByCategory) {
    const share = categoryRevenue / revenue
    const margin = margins.get(name) ?? 0
    const qualifies = share >= HIGH_REVENUE_SHARE_THRESHOLD && overallMargin - margin >= LOW_MARGIN_GAP_THRESHOLD
    if (qualifies && (!flagged || share > flagged.share)) {
      flagged = { name, share, margin }
    }
  }
  if (!flagged) return null

  return {
    id: 'category-contradiction',
    tone: 'warning',
    text: `${flagged.name} accounts for ${formatPercent(flagged.share * 100)} of revenue but converts at only a ${formatPercent(flagged.margin)} margin, well below the company average.`,
  }
}

function bestMarginCategoryInsight(rows: SalesRecord[]): Insight | null {
  if (!hasProfitData(rows)) return null

  const margins = marginsByKey(rows, (row) => row.category)
  if (margins.size < 2) return null

  const [best] = toSortedEntries(margins, 'desc')
  return {
    id: 'category-best-margin',
    tone: 'positive',
    text: `${best.name} has the highest margin among all categories at ${formatPercent(best.value)}.`,
  }
}

function discountErosionInsight(rows: SalesRecord[]): Insight | null {
  if (!hasProfitData(rows)) return null

  const discounted = rows.filter((row) => row.discount > 0)
  const fullPrice = rows.filter((row) => row.discount === 0)
  if (discounted.length === 0 || fullPrice.length === 0) return null

  const discountedMargin = profitMargin(discounted) ?? 0
  const fullPriceMargin = profitMargin(fullPrice) ?? 0
  if (fullPriceMargin - discountedMargin < MARGIN_GAP_THRESHOLD) return null

  return {
    id: 'discount-erosion',
    tone: discountedMargin < 0 ? 'critical' : 'warning',
    text: `Discounted orders average a ${formatPercent(discountedMargin)} margin, compared to ${formatPercent(fullPriceMargin)} on full-price orders, suggesting discounting is eroding profitability.`,
  }
}

export function generateInsights(rows: SalesRecord[]): Insight[] {
  if (rows.length === 0) return []

  const candidates = [
    headlineInsight(rows),
    trendInsight(rows),
    regionUnderperformanceInsight(rows),
    categoryContradictionInsight(rows),
    bestMarginCategoryInsight(rows),
    discountErosionInsight(rows),
  ]

  return candidates.filter((insight): insight is Insight => insight !== null)
}
