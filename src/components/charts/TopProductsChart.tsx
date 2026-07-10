import { Package } from 'lucide-react'
import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import type { NamedValue } from '@/lib/analysis/groupBy'
import { formatCompactCurrency } from '@/lib/utils/formatters'
import { ChartCard } from './ChartCard'

interface TopProductsChartProps {
  data: NamedValue[]
}

export function TopProductsChart({ data }: TopProductsChartProps) {
  return (
    <ChartCard
      title="Top 10 Products"
      description="Highest profit-contributing products"
      icon={Package}
      isEmpty={data.length === 0}
      emptyMessage="This dataset has no Profit column, so product profit ranking can't be shown."
    >
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          layout="vertical"
          margin={{ top: 8, right: 16, left: 8, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" horizontal={false} />
          <XAxis
            type="number"
            tickFormatter={formatCompactCurrency}
            tick={{ fill: 'var(--muted-foreground)', fontSize: 12 }}
            tickLine={false}
            axisLine={{ stroke: 'var(--border)' }}
          />
          <YAxis
            type="category"
            dataKey="name"
            tick={{ fill: 'var(--muted-foreground)', fontSize: 12 }}
            tickLine={false}
            axisLine={false}
            width={96}
          />
          <Tooltip
            formatter={(value) => formatCompactCurrency(Number(value))}
            contentStyle={{
              background: 'var(--card)',
              border: '1px solid var(--border)',
              borderRadius: 8,
              fontSize: 12,
            }}
          />
          <Bar dataKey="value" name="Profit" radius={[0, 4, 4, 0]} maxBarSize={20}>
            {data.map((entry, index) => (
              <Cell
                key={entry.name}
                fill={
                  entry.value < 0
                    ? 'var(--destructive)'
                    : index === 0
                      ? 'var(--chart-highlight)'
                      : 'var(--primary)'
                }
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </ChartCard>
  )
}
