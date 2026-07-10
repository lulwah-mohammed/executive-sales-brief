import { Logo } from '@/components/layout/Logo'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

function KpiCardSkeleton() {
  return (
    <Card size="sm">
      <CardContent className="flex flex-col gap-2">
        <Skeleton className="h-3 w-20" />
        <Skeleton className="h-6 w-16" />
      </CardContent>
    </Card>
  )
}

function ChartCardSkeleton() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-4 w-40" />
        <Skeleton className="mt-1 h-3 w-56" />
      </CardHeader>
      <CardContent className="h-72">
        <Skeleton className="h-full w-full" />
      </CardContent>
    </Card>
  )
}

function TextCardSkeleton({ lines }: { lines: number }) {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-4 w-40" />
      </CardHeader>
      <CardContent className="flex flex-col gap-2.5">
        {Array.from({ length: lines }).map((_, index) => (
          <Skeleton key={index} className="h-3.5 w-full" />
        ))}
      </CardContent>
    </Card>
  )
}

export function LoadingState() {
  return (
    <div className="min-h-svh bg-background" aria-busy="true" aria-live="polite">
      <header className="border-b border-border">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-6">
          <Logo />
          <span className="sr-only">Parsing your dataset…</span>
          <Skeleton className="h-8 w-28 rounded-md" />
        </div>
      </header>
      <main className="mx-auto flex max-w-6xl flex-col gap-8 px-4 py-8 sm:px-6">
        <TextCardSkeleton lines={5} />
        <TextCardSkeleton lines={4} />
        <div className="flex flex-col gap-3">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
            {Array.from({ length: 6 }).map((_, index) => (
              <KpiCardSkeleton key={index} />
            ))}
          </div>
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <KpiCardSkeleton key={index} />
            ))}
          </div>
        </div>
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {Array.from({ length: 5 }).map((_, index) => (
            <ChartCardSkeleton key={index} />
          ))}
        </div>
      </main>
    </div>
  )
}
