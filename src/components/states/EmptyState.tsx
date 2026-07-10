import { Logo } from '@/components/layout/Logo'
import { UploadZone } from '@/components/upload/UploadZone'
import { DatasetPicker } from '@/components/upload/DatasetPicker'

export function EmptyState() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center px-6 py-12">
      <div className="flex w-full max-w-md flex-col items-center gap-10 text-center">
        <Logo iconOnly size="lg" />
        <div className="flex flex-col items-center gap-3">
          <span className="text-xs font-semibold tracking-widest text-primary uppercase">
            Executive Decision Support
          </span>
          <h1 className="font-heading text-4xl font-bold tracking-tight text-foreground">
            Executive Sales Brief
          </h1>
          <p className="max-w-sm text-balance text-sm leading-relaxed text-muted-foreground">
            Upload your sales data to understand business performance and
            support confident, executive-level decisions.
          </p>
        </div>
        <div className="flex w-full flex-col items-center gap-5">
          <UploadZone />
          <div className="flex w-full items-center gap-3">
            <span className="h-px flex-1 bg-border" />
            <span className="text-[11px] font-medium tracking-wide text-muted-foreground uppercase">
              or
            </span>
            <span className="h-px flex-1 bg-border" />
          </div>
          <DatasetPicker />
        </div>
      </div>
    </div>
  )
}
