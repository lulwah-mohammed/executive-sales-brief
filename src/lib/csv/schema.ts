export interface FieldDefinition {
  key: string
  required: boolean
  aliases: string[]
}

export const SALES_SCHEMA: FieldDefinition[] = [
  { key: 'shipMode', required: false, aliases: ['ship mode', 'shipping mode'] },
  { key: 'segment', required: false, aliases: ['segment', 'customer segment'] },
  { key: 'country', required: false, aliases: ['country'] },
  { key: 'city', required: false, aliases: ['city'] },
  { key: 'state', required: false, aliases: ['state', 'province'] },
  { key: 'postalCode', required: false, aliases: ['postal code', 'zip', 'zip code'] },
  { key: 'region', required: false, aliases: ['region'] },
  { key: 'category', required: false, aliases: ['category'] },
  { key: 'subCategory', required: false, aliases: ['sub-category', 'sub category', 'subcategory'] },
  { key: 'product', required: false, aliases: ['product name', 'product', 'item', 'item name', 'sku'] },
  { key: 'orderDate', required: false, aliases: ['order date', 'date'] },
  { key: 'sales', required: true, aliases: ['sales', 'revenue', 'amount'] },
  { key: 'unitPrice', required: false, aliases: ['unit price', 'price unit', 'price per unit', 'price'] },
  { key: 'quantity', required: false, aliases: ['quantity', 'qty', 'units', 'units sold', 'unit sold'] },
  { key: 'discount', required: false, aliases: ['discount'] },
  { key: 'profit', required: false, aliases: ['profit'] },
]

export function normalizeHeader(header: string): string {
  return header
    .trim()
    .toLowerCase()
    .replace(/[_-]+/g, ' ')
    .replace(/\s+/g, ' ')
}
