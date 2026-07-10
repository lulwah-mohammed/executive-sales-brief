import type { SalesRecord } from '@/types/sales'
import { groupSumBy, hasProfitData, toSortedEntries, type NamedValue } from './groupBy'

export function revenueByRegion(rows: SalesRecord[]): NamedValue[] {
  return toSortedEntries(groupSumBy(rows, (row) => row.region, (row) => row.sales))
}

export function profitByCategory(rows: SalesRecord[]): NamedValue[] {
  if (!hasProfitData(rows)) return []
  return toSortedEntries(groupSumBy(rows, (row) => row.category, (row) => row.profit ?? 0))
}

export function topProductsByProfit(rows: SalesRecord[], limit = 10): NamedValue[] {
  if (!hasProfitData(rows)) return []
  const totals = groupSumBy(
    rows,
    (row) => row.product ?? row.subCategory,
    (row) => row.profit ?? 0,
  )
  return toSortedEntries(totals).slice(0, limit)
}
