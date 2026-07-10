import Papa from 'papaparse'
import type { SalesRecord } from '@/types/sales'
import { mapColumns } from './columnMapper'

export interface ParsedCsv {
  rows: SalesRecord[]
  rowCount: number
  columnCount: number
  hasProfitData: boolean
}

type RawRow = Record<string, unknown>

function toNumber(value: unknown): number {
  const n = typeof value === 'number' ? value : parseFloat(String(value ?? ''))
  return Number.isFinite(n) ? n : 0
}

function toText(value: unknown): string | undefined {
  if (value === undefined || value === null) return undefined
  const text = String(value).trim()
  return text === '' ? undefined : text
}

function toRecord(row: RawRow, mapping: Record<string, string | undefined>): SalesRecord {
  const get = (key: string) => {
    const column = mapping[key]
    return column === undefined ? undefined : row[column]
  }

  const sales =
    mapping.sales !== undefined
      ? toNumber(get('sales'))
      : toNumber(get('unitPrice')) * toNumber(get('quantity'))

  return {
    shipMode: toText(get('shipMode')),
    segment: toText(get('segment')),
    country: toText(get('country')),
    city: toText(get('city')),
    state: toText(get('state')),
    postalCode: toText(get('postalCode')),
    region: toText(get('region')),
    category: toText(get('category')),
    subCategory: toText(get('subCategory')),
    product: toText(get('product')),
    orderDate: toText(get('orderDate')),
    sales,
    quantity: toNumber(get('quantity')),
    discount: toNumber(get('discount')),
    profit: mapping.profit !== undefined ? toNumber(get('profit')) : undefined,
  }
}

/**
 * Turns a raw PapaParse result into validated SalesRecords, or throws an
 * error with a message meant to be shown directly to the user.
 */
function finalize(parsed: Papa.ParseResult<RawRow>): ParsedCsv {
  const headers = (parsed.meta.fields ?? []).filter((header) => header.trim() !== '')

  if (headers.length === 0) {
    throw new Error('This file appears to be empty or is not a valid CSV.')
  }

  const { mapping, missingRequired } = mapColumns(headers)

  const canDeriveSales = mapping.unitPrice !== undefined && mapping.quantity !== undefined
  const stillMissing = missingRequired.filter((key) => !(key === 'sales' && canDeriveSales))

  if (stillMissing.length > 0) {
    throw new Error(
      'This CSV is missing required column(s): Sales. Add a Sales/Revenue column, or both a unit price and a quantity column so revenue can be calculated, and try again.',
    )
  }

  const rows = parsed.data
    .filter((row) => Object.values(row).some((value) => value !== undefined && String(value).trim() !== ''))
    .map((row) => toRecord(row, mapping))

  if (rows.length === 0) {
    throw new Error('No data rows found in this file. Add at least one row below the header.')
  }

  const criticalParseErrors = parsed.errors.filter((error) => error.type !== 'FieldMismatch')
  if (criticalParseErrors.length > 0 && rows.length < parsed.data.length / 2) {
    throw new Error(
      `This file could not be read as CSV (${criticalParseErrors[0]?.message ?? 'unknown parsing error'}). Check that it is comma-separated and try again.`,
    )
  }

  return {
    rows,
    rowCount: rows.length,
    columnCount: headers.length,
    hasProfitData: mapping.profit !== undefined,
  }
}

/** Parses a user-uploaded CSV file into typed sales records. */
export async function parseCsvFile(file: File): Promise<ParsedCsv> {
  if (file.size === 0) {
    throw new Error('This file is empty.')
  }
  if (!file.name.toLowerCase().endsWith('.csv') && file.type !== 'text/csv') {
    throw new Error('Please upload a .csv file.')
  }

  const parsed = await new Promise<Papa.ParseResult<RawRow>>((resolve, reject) => {
    Papa.parse<RawRow>(file, {
      header: true,
      skipEmptyLines: true,
      complete: resolve,
      error: reject,
    })
  })

  return finalize(parsed)
}

/** Parses a CSV hosted at a URL (used for the bundled demo dataset). */
export async function parseCsvFromUrl(url: string): Promise<ParsedCsv> {
  const parsed = await new Promise<Papa.ParseResult<RawRow>>((resolve, reject) => {
    Papa.parse<RawRow>(url, {
      header: true,
      download: true,
      skipEmptyLines: true,
      complete: resolve,
      error: reject,
    })
  })

  return finalize(parsed)
}
