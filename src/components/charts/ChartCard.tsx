import type { ComponentType, ReactNode } from 'react'
import { CalendarOff } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'

interface ChartCardProps {
  title: string
  description?: string
  icon?: ComponentType<{ className?: string }>
  isEmpty?: boolean
  emptyMessage?: string
  children: ReactNode
}

export function ChartCard({ title, description, icon: Icon, isEmpty, emptyMessage, children }: ChartCardProps) {
  return (
    <Card className="flex flex-col">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {Icon && <Icon className="size-4 text-muted-foreground" />}
          {title}
        </CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent className="h-72">
        {isEmpty ? (
          <div className="flex h-full flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-border px-6 text-center">
            <CalendarOff className="size-5 text-muted-foreground/60" />
            <p className="text-sm text-muted-foreground">
              {emptyMessage ?? 'No data available for this chart.'}
            </p>
          </div>
        ) : (
          children
        )}
      </CardContent>
    </Card>
  )
}
