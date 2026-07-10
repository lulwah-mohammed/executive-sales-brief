import { useRef, useState, type DragEvent } from 'react'
import { Upload } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { useDatasetStore } from '@/store/useDatasetStore'

export function UploadZone() {
  const loadFromFile = useDatasetStore((state) => state.loadFromFile)
  const inputRef = useRef<HTMLInputElement>(null)
  const [isDragging, setIsDragging] = useState(false)

  const handleFile = (file: File | undefined) => {
    if (!file) return
    void loadFromFile(file)
  }

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    setIsDragging(false)
    handleFile(event.dataTransfer.files?.[0])
  }

  return (
    <div
      onDragOver={(event) => {
        event.preventDefault()
        setIsDragging(true)
      }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={handleDrop}
      className={cn(
        'flex w-full flex-col items-center gap-3 rounded-xl border border-dashed border-border px-8 py-8 text-center transition-colors',
        isDragging ? 'border-ring bg-muted/50' : 'hover:border-muted-foreground/40',
      )}
    >
      <input
        ref={inputRef}
        type="file"
        accept=".csv,text/csv"
        aria-label="Upload CSV file"
        className="hidden"
        onChange={(event) => handleFile(event.target.files?.[0])}
      />
      <Button onClick={() => inputRef.current?.click()} size="lg" className="gap-2">
        <Upload />
        Upload CSV
      </Button>
      <p className="text-xs text-muted-foreground">or drag and drop a .csv file here</p>
    </div>
  )
}
