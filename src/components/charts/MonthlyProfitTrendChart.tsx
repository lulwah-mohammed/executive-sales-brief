import { TrendingUp } from 'lucide-react'
import { CartesianGrid, Line, LineChart, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import type { MonthlyPoint } from '@/lib/analysis/kpis'
import { formatCompactCurrency, formatMonthLabel } from '@/lib/utils/formatters'
import { ChartCard } from './ChartCard'

interface MonthlyProfitTrendChartProps {
  data: MonthlyPoint[]
  hasProfitData: boolean
}

export function MonthlyProfitTrendChart({ data, hasProfitData }: MonthlyProfitTrendChartProps) {
  return (
    <ChartCard
      title="Monthly Profit Trend"
      description="Profit across each month, with the zero line marking breakeven"
      icon={TrendingUp}
      isEmpty={data.length === 0}
      emptyMessage={
        hasProfitData
          ? "This dataset has no Order Date column, so a monthly trend can't be shown."
          : "This dataset has no Profit column, so a monthly profit trend can't be shown."
      }
    >
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 8, right: 8, left: 8, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
          <XAxis
            dataKey="month"
            tickFormatter={formatMonthLabel}
            tick={{ fill: 'var(--muted-foreground)', fontSize: 12 }}
            tickLine={false}
            axisLine={{ stroke: 'var(--border)' }}
          />
          <YAxis
            tickFormatter={formatCompactCurrency}
            tick={{ fill: 'var(--muted-foreground)', fontSize: 12 }}
            tickLine={false}
            axisLine={false}
            width={56}
          />
          <Tooltip
            formatter={(value) => formatCompactCurrency(Number(value))}
            labelFormatter={(label) => formatMonthLabel(String(label))}
            contentStyle={{
              background: 'var(--card)',
              border: '1px solid var(--border)',
              borderRadius: 8,
              fontSize: 12,
            }}
          />
          <ReferenceLine y={0} stroke="var(--chart-highlight)" strokeWidth={2} strokeDasharray="4 3" />
          <Line
            type="monotone"
            dataKey="value"
            name="Profit"
            stroke="var(--primary)"
            strokeWidth={2}
            dot={{ r: 3 }}
            activeDot={{ r: 5, fill: 'var(--chart-highlight)', stroke: 'var(--primary)', strokeWidth: 1.5 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </ChartCard>
  )
}
