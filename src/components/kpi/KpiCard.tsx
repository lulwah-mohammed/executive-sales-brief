import type { ComponentType, ReactNode } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'

interface KpiCardProps {
  label: string
  value: ReactNode
  sublabel?: ReactNode
  tone?: 'default' | 'positive' | 'negative' | 'highlight'
  icon?: ComponentType<{ className?: string }>
}

const toneClass: Record<NonNullable<KpiCardProps['tone']>, string> = {
  default: 'text-foreground',
  positive: 'text-success',
  negative: 'text-destructive',
  highlight: 'text-chart-highlight',
}

export function KpiCard({ label, value, sublabel, tone = 'default', icon: Icon }: KpiCardProps) {
  return (
    <Card size="sm" className="transition-shadow hover:shadow-sm">
      <CardContent className="flex flex-col gap-1.5">
        <div className="flex items-center gap-1.5 text-muted-foreground">
          {Icon && <Icon className="size-3.5" />}
          <span className="text-xs font-medium tracking-wide uppercase">{label}</span>
        </div>
        <span className={cn('truncate text-xl font-semibold tracking-tight', toneClass[tone])}>
          {value}
        </span>
        {sublabel && <span className="truncate text-xs text-muted-foreground">{sublabel}</span>}
      </CardContent>
    </Card>
  )
}
