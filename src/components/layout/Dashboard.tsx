import { useMemo } from 'react'
import { TopBar } from '@/components/layout/TopBar'
import { ExecutiveBrief } from '@/components/summary/ExecutiveBrief'
import { RecommendationsList } from '@/components/summary/RecommendationsList'
import { KpiGrid } from '@/components/kpi/KpiGrid'
import { RevenueByMonthChart } from '@/components/charts/RevenueByMonthChart'
import { RevenueByRegionChart } from '@/components/charts/RevenueByRegionChart'
import { ProfitByCategoryChart } from '@/components/charts/ProfitByCategoryChart'
import { TopProductsChart } from '@/components/charts/TopProductsChart'
import { MonthlyProfitTrendChart } from '@/components/charts/MonthlyProfitTrendChart'
import { calculateKpis } from '@/lib/analysis/kpis'
import { profitByCategory, revenueByRegion, topProductsByProfit } from '@/lib/analysis/aggregations'
import { useDatasetStore } from '@/store/useDatasetStore'
import type { SalesRecord } from '@/types/sales'

interface DashboardProps {
  rows: SalesRecord[]
  datasetName: string
}

export function Dashboard({ rows, datasetName }: DashboardProps) {
  const reset = useDatasetStore((state) => state.reset)

  const kpis = useMemo(() => calculateKpis(rows), [rows])
  const regionData = useMemo(() => revenueByRegion(rows), [rows])
  const categoryData = useMemo(() => profitByCategory(rows), [rows])
  const productData = useMemo(() => topProductsByProfit(rows, 10), [rows])

  return (
    <div className="min-h-svh bg-background">
      <TopBar datasetName={datasetName} rowCount={rows.length} onReset={reset} />
      <main className="mx-auto flex max-w-6xl flex-col gap-8 px-4 py-8 sm:px-6">
        <ExecutiveBrief rows={rows} />
        <RecommendationsList rows={rows} />
        <KpiGrid kpis={kpis} />
        <div className="flex flex-col gap-2.5">
          <span className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
            Performance Trends
          </span>
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <RevenueByMonthChart data={kpis.monthlyRevenue} />
            <RevenueByRegionChart data={regionData} />
            <ProfitByCategoryChart data={categoryData} />
            <TopProductsChart data={productData} />
            <MonthlyProfitTrendChart data={kpis.monthlyProfit} hasProfitData={kpis.hasProfitData} />
          </div>
        </div>
      </main>
    </div>
  )
}
