import { create } from 'zustand'
import type { DatasetStatus, SalesRecord } from '@/types/sales'
import { parseCsvFile, parseCsvFromUrl } from '@/lib/csv/parseCsv'

interface DatasetState {
  status: DatasetStatus
  datasetName: string | null
  rows: SalesRecord[]
  rowCount: number
  columnCount: number
  hasProfitData: boolean
  error: string | null
  loadFromFile: (file: File) => Promise<void>
  loadDemoDataset: () => Promise<void>
  reset: () => void
}

const DEMO_DATASET_URL = '/sample-data/superstore-demo.csv'
const DEMO_DATASET_NAME = 'SampleSuperstore (demo)'

export const useDatasetStore = create<DatasetState>((set) => ({
  status: 'empty',
  datasetName: null,
  rows: [],
  rowCount: 0,
  columnCount: 0,
  hasProfitData: false,
  error: null,

  loadFromFile: async (file: File) => {
    set({ status: 'loading', error: null })
    try {
      const parsed = await parseCsvFile(file)
      set({
        status: 'loaded',
        datasetName: file.name,
        rows: parsed.rows,
        rowCount: parsed.rowCount,
        columnCount: parsed.columnCount,
        hasProfitData: parsed.hasProfitData,
      })
    } catch (error) {
      set({
        status: 'error',
        error: error instanceof Error ? error.message : 'Failed to parse this CSV file.',
      })
    }
  },

  loadDemoDataset: async () => {
    set({ status: 'loading', error: null })
    try {
      const parsed = await parseCsvFromUrl(DEMO_DATASET_URL)
      set({
        status: 'loaded',
        datasetName: DEMO_DATASET_NAME,
        rows: parsed.rows,
        rowCount: parsed.rowCount,
        columnCount: parsed.columnCount,
        hasProfitData: parsed.hasProfitData,
      })
    } catch (error) {
      set({
        status: 'error',
        error: error instanceof Error ? error.message : 'Failed to load the demo dataset.',
      })
    }
  },

  reset: () =>
    set({
      status: 'empty',
      datasetName: null,
      rows: [],
      rowCount: 0,
      columnCount: 0,
      hasProfitData: false,
      error: null,
    }),
}))
