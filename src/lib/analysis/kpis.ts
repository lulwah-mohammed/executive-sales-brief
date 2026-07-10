import type { SalesRecord } from '@/types/sales'
import { groupSumBy, hasProfitData, highestEntry, lowestEntry, marginsByKey, sumBy } from './groupBy'

export interface RankedEntry {
  name: string
  value: number
  basis: 'profit' | 'revenue' | 'margin'
}

export interface MonthlyPoint {
  month: string
  value: number
}

export interface KpiSummary {
  totalRevenue: number
  totalProfit: number | null
  profitMargin: number | null
  averageOrderValue: number
  totalOrders: number
  totalQuantitySold: number
  topProduct: RankedEntry | null
  topCategory: RankedEntry | null
  topRegion: RankedEntry | null
  lowestRegion: RankedEntry | null
  monthlyRevenue: MonthlyPoint[]
  monthlyProfit: MonthlyPoint[]
  hasTimeSeriesData: boolean
  hasProfitData: boolean
}

export { hasProfitData }

export function totalRevenue(rows: SalesRecord[]): number {
  return sumBy(rows, (row) => row.sales)
}

export function totalProfit(rows: SalesRecord[]): number | null {
  if (!hasProfitData(rows)) return null
  return sumBy(rows, (row) => row.profit ?? 0)
}

export function profitMargin(rows: SalesRecord[]): number | null {
  const profit = totalProfit(rows)
  if (profit === null) return null
  const revenue = totalRevenue(rows)
  return revenue === 0 ? 0 : (profit / revenue) * 100
}

export function totalOrders(rows: SalesRecord[]): number {
  return rows.length
}

export function averageOrderValue(rows: SalesRecord[]): number {
  const orders = totalOrders(rows)
  return orders === 0 ? 0 : totalRevenue(rows) / orders
}

export function totalQuantitySold(rows: SalesRecord[]): number {
  return sumBy(rows, (row) => row.quantity)
}

export function topProduct(rows: SalesRecord[]): RankedEntry | null {
  const productKey = (row: SalesRecord) => row.product ?? row.subCategory
  if (hasProfitData(rows)) {
    const entry = highestEntry(groupSumBy(rows, productKey, (row) => row.profit ?? 0))
    return entry && { ...entry, basis: 'profit' }
  }
  const entry = highestEntry(groupSumBy(rows, productKey, (row) => row.sales))
  return entry && { ...entry, basis: 'revenue' }
}

export function topCategory(rows: SalesRecord[]): RankedEntry | null {
  if (hasProfitData(rows)) {
    const entry = highestEntry(groupSumBy(rows, (row) => row.category, (row) => row.profit ?? 0))
    return entry && { ...entry, basis: 'profit' }
  }
  const entry = highestEntry(groupSumBy(rows, (row) => row.category, (row) => row.sales))
  return entry && { ...entry, basis: 'revenue' }
}

export function topRegion(rows: SalesRecord[]): RankedEntry | null {
  if (hasProfitData(rows)) {
    const entry = highestEntry(marginsByKey(rows, (row) => row.region))
    return entry && { ...entry, basis: 'margin' }
  }
  const entry = highestEntry(groupSumBy(rows, (row) => row.region, (row) => row.sales))
  return entry && { ...entry, basis: 'revenue' }
}

export function lowestRegion(rows: SalesRecord[]): RankedEntry | null {
  if (hasProfitData(rows)) {
    const entry = lowestEntry(marginsByKey(rows, (row) => row.region))
    return entry && { ...entry, basis: 'margin' }
  }
  const entry = lowestEntry(groupSumBy(rows, (row) => row.region, (row) => row.sales))
  return entry && { ...entry, basis: 'revenue' }
}

function monthKey(orderDate: string | undefined): string | undefined {
  if (!orderDate) return undefined
  const date = new Date(orderDate)
  if (Number.isNaN(date.getTime())) return undefined
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
}

function monthlySeries(rows: SalesRecord[], valueSelector: (row: SalesRecord) => number): MonthlyPoint[] {
  const totals = groupSumBy(rows, (row) => monthKey(row.orderDate), valueSelector)
  return Array.from(totals, ([month, value]) => ({ month, value })).sort((a, b) =>
    a.month.localeCompare(b.month),
  )
}

export function monthlyRevenue(rows: SalesRecord[]): MonthlyPoint[] {
  return monthlySeries(rows, (row) => row.sales)
}

export function monthlyProfit(rows: SalesRecord[]): MonthlyPoint[] {
  if (!hasProfitData(rows)) return []
  return monthlySeries(rows, (row) => row.profit ?? 0)
}

export function calculateKpis(rows: SalesRecord[]): KpiSummary {
  const revenueByMonth = monthlyRevenue(rows)
  const profitByMonth = monthlyProfit(rows)

  return {
    totalRevenue: totalRevenue(rows),
    totalProfit: totalProfit(rows),
    profitMargin: profitMargin(rows),
    averageOrderValue: averageOrderValue(rows),
    totalOrders: totalOrders(rows),
    totalQuantitySold: totalQuantitySold(rows),
    topProduct: topProduct(rows),
    topCategory: topCategory(rows),
    topRegion: topRegion(rows),
    lowestRegion: lowestRegion(rows),
    monthlyRevenue: revenueByMonth,
    monthlyProfit: profitByMonth,
    hasTimeSeriesData: revenueByMonth.length > 0,
    hasProfitData: hasProfitData(rows),
  }
}
