import type { SalesRecord } from '@/types/sales'

export interface NamedValue {
  name: string
  value: number
}

export function sumBy(rows: SalesRecord[], selector: (row: SalesRecord) => number): number {
  return rows.reduce((total, row) => total + selector(row), 0)
}

export function groupSumBy(
  rows: SalesRecord[],
  keySelector: (row: SalesRecord) => string | undefined,
  valueSelector: (row: SalesRecord) => number,
): Map<string, number> {
  const totals = new Map<string, number>()
  for (const row of rows) {
    const key = keySelector(row)
    if (!key) continue
    totals.set(key, (totals.get(key) ?? 0) + valueSelector(row))
  }
  return totals
}

export function highestEntry(totals: Map<string, number>): NamedValue | null {
  let best: NamedValue | null = null
  for (const [name, value] of totals) {
    if (!best || value > best.value) best = { name, value }
  }
  return best
}

export function lowestEntry(totals: Map<string, number>): NamedValue | null {
  let worst: NamedValue | null = null
  for (const [name, value] of totals) {
    if (!worst || value < worst.value) worst = { name, value }
  }
  return worst
}

export function toSortedEntries(totals: Map<string, number>, order: 'asc' | 'desc' = 'desc'): NamedValue[] {
  const entries = Array.from(totals, ([name, value]) => ({ name, value }))
  return entries.sort((a, b) => (order === 'desc' ? b.value - a.value : a.value - b.value))
}

export function marginsByKey(
  rows: SalesRecord[],
  keySelector: (row: SalesRecord) => string | undefined,
): Map<string, number> {
  const revenueByKey = groupSumBy(rows, keySelector, (row) => row.sales)
  const profitByKey = groupSumBy(rows, keySelector, (row) => row.profit ?? 0)
  const margins = new Map<string, number>()
  for (const [key, revenue] of revenueByKey) {
    margins.set(key, revenue === 0 ? 0 : ((profitByKey.get(key) ?? 0) / revenue) * 100)
  }
  return margins
}

export function hasProfitData(rows: SalesRecord[]): boolean {
  return rows.some((row) => row.profit !== undefined)
}
