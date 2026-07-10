import { SALES_SCHEMA, normalizeHeader } from './schema'

export interface ColumnMapping {
  [key: string]: string | undefined
}

export interface ColumnMapResult {
  mapping: ColumnMapping
  missingRequired: string[]
}

export function mapColumns(headers: string[]): ColumnMapResult {
  const normalizedToOriginal = new Map<string, string>()
  for (const header of headers) {
    normalizedToOriginal.set(normalizeHeader(header), header)
  }

  const mapping: ColumnMapping = {}
  const missingRequired: string[] = []

  for (const field of SALES_SCHEMA) {
    const match = field.aliases
      .map((alias) => normalizedToOriginal.get(alias))
      .find((original) => original !== undefined)

    if (match) {
      mapping[field.key] = match
    } else if (field.required) {
      missingRequired.push(field.key)
    }
  }

  return { mapping, missingRequired }
}
