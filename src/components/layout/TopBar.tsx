import { Database, RotateCcw } from 'lucide-react'
import { Logo } from '@/components/layout/Logo'
import { Button } from '@/components/ui/button'
import { formatNumber } from '@/lib/utils/formatters'

interface TopBarProps {
  datasetName: string
  rowCount: number
  onReset: () => void
}

export function TopBar({ datasetName, rowCount, onReset }: TopBarProps) {
  return (
    <header className="sticky top-0 z-10 border-b border-border bg-background/80 backdrop-blur-sm">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <Logo />
        <div className="flex items-center gap-3">
          <span className="hidden items-center gap-1.5 rounded-full bg-muted px-3 py-1 text-xs text-muted-foreground sm:flex">
            <Database className="size-3.5" />
            {datasetName} · {formatNumber(rowCount)} rows
          </span>
          <Button variant="outline" size="sm" className="gap-1.5" onClick={onReset}>
            <RotateCcw />
            New dataset
          </Button>
        </div>
      </div>
    </header>
  )
}
