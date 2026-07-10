import { ChartColumn } from 'lucide-react'
import { cn } from '@/lib/utils'

interface LogoProps {
  className?: string
  iconOnly?: boolean
  size?: 'sm' | 'lg'
}

const markSize = {
  sm: 'size-8',
  lg: 'size-14',
}

const iconSize = {
  sm: 'size-4',
  lg: 'size-7',
}

const textSize = {
  sm: 'text-sm font-bold',
  lg: 'text-lg font-bold',
}

export function Logo({ className, iconOnly = false, size = 'sm' }: LogoProps) {
  return (
    <div className={cn('flex items-center gap-2.5', className)}>
      <span
        className={cn(
          'flex shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-sm',
          markSize[size],
        )}
      >
        <ChartColumn className={iconSize[size]} strokeWidth={2.25} />
      </span>
      {!iconOnly && (
        <span className={cn('tracking-tight text-foreground', textSize[size])}>
          Executive Sales Brief
        </span>
      )}
    </div>
  )
}
