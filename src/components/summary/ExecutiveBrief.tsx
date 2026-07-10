import { useMemo } from 'react'
import { FileText } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { generateInsights, type InsightTone } from '@/lib/analysis/insights'
import type { SalesRecord } from '@/types/sales'

interface ExecutiveBriefProps {
  rows: SalesRecord[]
}

const toneDotClass: Record<InsightTone, string> = {
  positive: 'bg-success',
  warning: 'bg-warning',
  critical: 'bg-destructive',
}

export function ExecutiveBrief({ rows }: ExecutiveBriefProps) {
  const insights = useMemo(() => generateInsights(rows), [rows])
  if (insights.length === 0) return null

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="size-4 text-muted-foreground" />
          Executive Brief
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="flex flex-col gap-2.5">
          {insights.map((insight) => (
            <li key={insight.id} className="flex items-start gap-2.5 text-sm text-foreground">
              <span className={`mt-1.5 size-1.5 shrink-0 rounded-full ${toneDotClass[insight.tone]}`} />
              <span>{insight.text}</span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}
