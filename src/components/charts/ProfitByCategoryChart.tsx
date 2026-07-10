import { Layers } from 'lucide-react'
import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import type { NamedValue } from '@/lib/analysis/groupBy'
import { formatCompactCurrency } from '@/lib/utils/formatters'
import { ChartCard } from './ChartCard'

interface ProfitByCategoryChartProps {
  data: NamedValue[]
}

export function ProfitByCategoryChart({ data }: ProfitByCategoryChartProps) {
  return (
    <ChartCard
      title="Profit by Category"
      description="Total profit by category (red bars are losing money)"
      icon={Layers}
      isEmpty={data.length === 0}
      emptyMessage="This dataset has no Profit column, so category profit can't be shown."
    >
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 8, right: 8, left: 8, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
          <XAxis
            dataKey="name"
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
            contentStyle={{
              background: 'var(--card)',
              border: '1px solid var(--border)',
              borderRadius: 8,
              fontSize: 12,
            }}
          />
          <Bar dataKey="value" name="Profit" radius={[4, 4, 0, 0]} maxBarSize={56}>
            {(() => {
              let positiveIndex = 0
              return data.map((entry) => {
                if (entry.value < 0) {
                  return <Cell key={entry.name} fill="var(--destructive)" />
                }
                const fill = positiveIndex % 2 === 0 ? 'var(--success)' : 'var(--chart-highlight)'
                positiveIndex += 1
                return <Cell key={entry.name} fill={fill} />
              })
            })()}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </ChartCard>
  )
}
