import {
  Award,
  Boxes,
  DollarSign,
  Layers,
  MapPin,
  MapPinOff,
  Percent,
  Receipt,
  ShoppingCart,
  TrendingUp,
} from 'lucide-react'
import type { KpiSummary, RankedEntry } from '@/lib/analysis/kpis'
import { formatCompactCurrency, formatNumber, formatPercent } from '@/lib/utils/formatters'
import { KpiCard } from './KpiCard'

interface KpiGridProps {
  kpis: KpiSummary
}

function SectionLabel({ children }: { children: string }) {
  return (
    <span className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
      {children}
    </span>
  )
}

function rankedSublabel(entry: RankedEntry): string {
  switch (entry.basis) {
    case 'profit':
      return `${formatCompactCurrency(entry.value)} profit`
    case 'margin':
      return `${formatPercent(entry.value)} margin`
    case 'revenue':
      return `${formatCompactCurrency(entry.value)} revenue`
  }
}

export function KpiGrid({ kpis }: KpiGridProps) {
  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-2.5">
        <SectionLabel>Business Performance Overview</SectionLabel>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          <KpiCard icon={DollarSign} label="Total Revenue" value={formatCompactCurrency(kpis.totalRevenue)} />
          <KpiCard
            icon={TrendingUp}
            label="Total Profit"
            value={kpis.totalProfit === null ? '—' : formatCompactCurrency(kpis.totalProfit)}
            sublabel={kpis.totalProfit === null ? 'No profit data in this dataset' : undefined}
            tone={kpis.totalProfit === null ? 'default' : kpis.totalProfit >= 0 ? 'highlight' : 'negative'}
          />
          <KpiCard
            icon={Percent}
            label="Profit Margin"
            value={kpis.profitMargin === null ? '—' : formatPercent(kpis.profitMargin)}
            sublabel={kpis.profitMargin === null ? 'No profit data in this dataset' : undefined}
            tone={kpis.profitMargin === null ? 'default' : kpis.profitMargin >= 0 ? 'highlight' : 'negative'}
          />
          <KpiCard
            icon={Receipt}
            label="Avg Order Value"
            value={formatCompactCurrency(kpis.averageOrderValue)}
          />
          <KpiCard icon={ShoppingCart} label="Total Orders" value={formatNumber(kpis.totalOrders)} />
          <KpiCard icon={Boxes} label="Units Sold" value={formatNumber(kpis.totalQuantitySold)} />
        </div>
      </div>
      <div className="flex flex-col gap-2.5">
        <SectionLabel>Top &amp; Bottom Performers</SectionLabel>
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          <KpiCard
            icon={Award}
            label="Top Product"
            value={kpis.topProduct?.name ?? '—'}
            sublabel={kpis.topProduct ? rankedSublabel(kpis.topProduct) : undefined}
          />
          <KpiCard
            icon={Layers}
            label="Top Category"
            value={kpis.topCategory?.name ?? '—'}
            sublabel={kpis.topCategory ? rankedSublabel(kpis.topCategory) : undefined}
          />
          <KpiCard
            icon={MapPin}
            label="Top Region"
            value={kpis.topRegion?.name ?? '—'}
            sublabel={kpis.topRegion ? rankedSublabel(kpis.topRegion) : undefined}
            tone={kpis.topRegion?.basis === 'margin' ? 'highlight' : 'default'}
          />
          <KpiCard
            icon={MapPinOff}
            label="Lowest Region"
            value={kpis.lowestRegion?.name ?? '—'}
            sublabel={kpis.lowestRegion ? rankedSublabel(kpis.lowestRegion) : undefined}
            tone={kpis.lowestRegion?.basis === 'margin' && kpis.lowestRegion.value < 0 ? 'negative' : 'default'}
          />
        </div>
      </div>
    </div>
  )
}
