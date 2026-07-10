import { EmptyState } from '@/components/states/EmptyState'
import { LoadingState } from '@/components/states/LoadingState'
import { ErrorState } from '@/components/states/ErrorState'
import { Dashboard } from '@/components/layout/Dashboard'
import { useDatasetStore } from '@/store/useDatasetStore'

function App() {
  const status = useDatasetStore((state) => state.status)
  const rows = useDatasetStore((state) => state.rows)
  const datasetName = useDatasetStore((state) => state.datasetName)

  switch (status) {
    case 'loading':
      return <LoadingState />
    case 'error':
      return <ErrorState />
    case 'loaded':
      return <Dashboard rows={rows} datasetName={datasetName ?? 'Dataset'} />
    default:
      return <EmptyState />
  }
}

export default App
