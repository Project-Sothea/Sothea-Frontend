import type { BatchLocation } from "./BatchLocation"

export interface DrugBatch {
  id: number
  drugId: number
  batchNumber: string
  expiryDate: string // ISO yyyy-mm-dd
  supplier: string
  batchLocations?: BatchLocation[]
}
