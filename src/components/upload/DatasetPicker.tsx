import { Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useDatasetStore } from '@/store/useDatasetStore'

export function DatasetPicker() {
  const loadDemoDataset = useDatasetStore((state) => state.loadDemoDataset)

  return (
    <Button variant="outline" size="lg" className="gap-2" onClick={() => void loadDemoDataset()}>
      <Sparkles />
      Try Demo Dataset
    </Button>
  )
}
