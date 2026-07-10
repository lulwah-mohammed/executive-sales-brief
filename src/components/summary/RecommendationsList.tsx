import { useMemo } from 'react'
import { ListChecks } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { generateRecommendations, type RecommendationPriority } from '@/lib/analysis/recommendations'
import type { SalesRecord } from '@/types/sales'

interface RecommendationsListProps {
  rows: SalesRecord[]
}

const priorityLabel: Record<RecommendationPriority, string> = {
  high: 'High priority',
  medium: 'Medium priority',
  low: 'Low priority',
}

const priorityBadgeVariant: Record<RecommendationPriority, 'destructive' | 'secondary' | 'outline'> = {
  high: 'destructive',
  medium: 'secondary',
  low: 'outline',
}

export function RecommendationsList({ rows }: RecommendationsListProps) {
  const recommendations = useMemo(() => generateRecommendations(rows), [rows])
  if (recommendations.length === 0) return null

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ListChecks className="size-4 text-muted-foreground" />
          Recommended Actions
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        {recommendations.map((recommendation) => (
          <div
            key={recommendation.id}
            className="flex flex-col gap-1 border-b border-border pb-4 last:border-0 last:pb-0"
          >
            <div className="flex items-center gap-2">
              <Badge variant={priorityBadgeVariant[recommendation.priority]}>
                {priorityLabel[recommendation.priority]}
              </Badge>
              <span className="text-sm font-semibold text-foreground">{recommendation.title}</span>
            </div>
            <p className="text-sm text-muted-foreground">{recommendation.detail}</p>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
