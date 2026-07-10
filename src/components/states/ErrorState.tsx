import { AlertTriangle } from 'lucide-react'
import { Logo } from '@/components/layout/Logo'
import { Button } from '@/components/ui/button'
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert'
import { useDatasetStore } from '@/store/useDatasetStore'

export function ErrorState() {
  const error = useDatasetStore((state) => state.error)
  const reset = useDatasetStore((state) => state.reset)

  return (
    <div className="flex min-h-svh flex-col items-center justify-center px-6 py-12">
      <div className="flex w-full max-w-sm flex-col items-center gap-8">
        <Logo iconOnly size="lg" />
        <Alert variant="destructive" className="w-full">
          <AlertTriangle />
          <AlertTitle>Couldn't load this dataset</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
        <Button variant="outline" size="lg" onClick={reset} className="w-full">
          Try another file
        </Button>
      </div>
    </div>
  )
}
