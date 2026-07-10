import { CalendarRange } from 'lucide-react'
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import type { MonthlyPoint } from '@/lib/analysis/kpis'
import { formatCompactCurrency, formatMonthLabel } from '@/lib/utils/formatters'
import { ChartCard } from './ChartCard'

interface RevenueByMonthChartProps {
  data: MonthlyPoint[]
}

export function RevenueByMonthChart({ data }: RevenueByMonthChartProps) {
  return (
    <ChartCard
      title="Revenue by Month"
      description="Total sales across each month in the dataset"
      icon={CalendarRange}
      isEmpty={data.length === 0}
      emptyMessage="This dataset has no Order Date column, so a monthly trend can't be shown."
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
          <Line
            type="monotone"
            dataKey="value"
            name="Revenue"
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
