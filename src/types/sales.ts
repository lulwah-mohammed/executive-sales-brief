export interface SalesRecord {
  shipMode?: string
  segment?: string
  country?: string
  city?: string
  state?: string
  postalCode?: string
  region?: string
  category?: string
  subCategory?: string
  product?: string
  orderDate?: string
  sales: number
  quantity: number
  discount: number
  profit?: number
}

export type DatasetStatus = 'empty' | 'loading' | 'loaded' | 'error'
