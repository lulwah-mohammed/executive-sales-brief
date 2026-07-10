import type { SalesRecord } from '@/types/sales'
import { groupSumBy, hasProfitData, marginsByKey, toSortedEntries } from './groupBy'
import { profitMargin, totalRevenue } from './kpis'
import { formatNumber, formatPercent } from '@/lib/utils/formatters'

export type RecommendationPriority = 'high' | 'medium' | 'low'

export interface Recommendation {
  id: string
  priority: RecommendationPriority
  title: string
  detail: string
}

const MARGIN_GAP_THRESHOLD = 3
const HIGH_MARGIN_THRESHOLD = 20
const LOW_REVENUE_SHARE_THRESHOLD = 0.1

const priorityRank: Record<RecommendationPriority, number> = { high: 0, medium: 1, low: 2 }

function productKey(row: SalesRecord): string | undefined {
  return row.product ?? row.subCategory
}

function discountRecommendation(rows: SalesRecord[]): Recommendation | null {
  if (!hasProfitData(rows)) return null

  const fullPrice = rows.filter((row) => row.discount === 0)
  const discounted = rows.filter((row) => row.discount > 0)
  if (fullPrice.length === 0 || discounted.length === 0) return null

  const fullPriceMargin = profitMargin(fullPrice) ?? 0
  const discountedMargin = profitMargin(discounted) ?? 0
  if (fullPriceMargin - discountedMargin < MARGIN_GAP_THRESHOLD) return null

  const tierMargins = marginsByKey(discounted, (row) => String(Math.round(row.discount * 100)))
  const tiers = Array.from(tierMargins, ([tier, margin]) => ({ tier: Number(tier), margin })).sort(
    (a, b) => a.tier - b.tier,
  )
  const breakEven = tiers.find((tier) => tier.margin < 0)

  return {
    id: 'reduce-discounts',
    priority: discountedMargin < 0 ? 'high' : 'medium',
    title: breakEven ? `Cap discounts below ${breakEven.tier}%` : 'Reduce reliance on discounting',
    detail: breakEven
      ? `Margin turns negative once discounts reach ${breakEven.tier}%. Full-price orders run a ${formatPercent(fullPriceMargin)} margin versus ${formatPercent(discountedMargin)} on discounted orders.`
      : `Discounted orders run a ${formatPercent(discountedMargin)} margin versus ${formatPercent(fullPriceMargin)} on full-price orders.`,
  }
}

function pricingReviewRecommendation(rows: SalesRecord[]): Recommendation | null {
  if (!hasProfitData(rows)) return null

  const margins = marginsByKey(rows, productKey)
  if (margins.size === 0) return null

  const [worst] = toSortedEntries(margins, 'asc')
  if (worst.value >= 0) return null

  return {
    id: 'review-pricing',
    priority: 'high',
    title: `Review pricing for ${worst.name}`,
    detail: `${worst.name} runs a ${formatPercent(worst.value)} margin, the weakest of any product line. Reassess pricing, cost, or discount policy for this line.`,
  }
}

function investigateRegionRecommendation(rows: SalesRecord[]): Recommendation | null {
  if (!hasProfitData(rows)) return null

  const margins = marginsByKey(rows, (row) => row.region)
  if (margins.size < 2) return null

  const overall = profitMargin(rows) ?? 0
  const [worst] = toSortedEntries(margins, 'asc')
  if (overall - worst.value < MARGIN_GAP_THRESHOLD) return null

  return {
    id: 'investigate-region',
    priority: worst.value < 0 ? 'high' : 'medium',
    title: `Investigate the ${worst.name} region`,
    detail: `${worst.name} converts sales to profit at ${formatPercent(worst.value)}, well below the ${formatPercent(overall)} company average. Review pricing, discounting, and cost drivers specific to this region.`,
  }
}

function prioritizeCategoryRecommendation(rows: SalesRecord[]): Recommendation | null {
  if (!hasProfitData(rows)) return null

  const margins = marginsByKey(rows, (row) => row.category)
  if (margins.size < 2) return null

  const [best] = toSortedEntries(margins, 'desc')
  return {
    id: 'prioritize-category',
    priority: 'medium',
    title: `Prioritize ${best.name}`,
    detail: `${best.name} converts at a ${formatPercent(best.value)} margin, the strongest of any category. Prioritize inventory and sales focus here to grow high-margin revenue.`,
  }
}

function marketingInvestmentRecommendation(rows: SalesRecord[]): Recommendation | null {
  if (!hasProfitData(rows)) return null

  const revenueByProduct = groupSumBy(rows, productKey, (row) => row.sales)
  const margins = marginsByKey(rows, productKey)
  const revenue = totalRevenue(rows)
  if (revenue === 0) return null

  let best: { name: string; share: number; margin: number } | null = null
  for (const [name, productRevenue] of revenueByProduct) {
    const share = productRevenue / revenue
    const margin = margins.get(name) ?? 0
    const qualifies = margin >= HIGH_MARGIN_THRESHOLD && share <= LOW_REVENUE_SHARE_THRESHOLD
    if (qualifies && (!best || margin > best.margin)) {
      best = { name, share, margin }
    }
  }
  if (!best) return null

  return {
    id: 'focus-marketing',
    priority: 'medium',
    title: `Focus marketing investment on ${best.name}`,
    detail: `${best.name} converts at a strong ${formatPercent(best.margin)} margin but makes up only ${formatPercent(best.share * 100)} of revenue. Additional marketing spend here has room to grow high-margin sales.`,
  }
}

function increaseInventoryRecommendation(rows: SalesRecord[]): Recommendation | null {
  const quantities = groupSumBy(rows, productKey, (row) => row.quantity)
  if (quantities.size === 0) return null

  const [topByQuantity] = toSortedEntries(quantities, 'desc')

  if (!hasProfitData(rows)) {
    return {
      id: 'increase-inventory',
      priority: 'low',
      title: `Increase inventory for ${topByQuantity.name}`,
      detail: `${topByQuantity.name} is the highest-demand product line by units sold (${formatNumber(topByQuantity.value)} units). Ensure stock levels can meet demand.`,
    }
  }

  const margins = marginsByKey(rows, productKey)
  const margin = margins.get(topByQuantity.name) ?? 0
  if (margin < 0) return null

  return {
    id: 'increase-inventory',
    priority: 'low',
    title: `Increase inventory for ${topByQuantity.name}`,
    detail: `${topByQuantity.name} is the highest-demand product line by units sold (${formatNumber(topByQuantity.value)} units) and runs a ${formatPercent(margin)} margin. Ensure stock levels can meet demand.`,
  }
}

export function generateRecommendations(rows: SalesRecord[]): Recommendation[] {
  if (rows.length === 0) return []

  const candidates = [
    discountRecommendation(rows),
    pricingReviewRecommendation(rows),
    investigateRegionRecommendation(rows),
    prioritizeCategoryRecommendation(rows),
    marketingInvestmentRecommendation(rows),
    increaseInventoryRecommendation(rows),
  ]

  return candidates
    .filter((recommendation): recommendation is Recommendation => recommendation !== null)
    .sort((a, b) => priorityRank[a.priority] - priorityRank[b.priority])
}
