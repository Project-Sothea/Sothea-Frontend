import type { DrugBatch } from "./DrugBatch"

export interface Drug {
  id: number
  name: string
  unit: string          // e.g. "tablet", "mg"
  defaultSize: number
  notes: string
  batches?: DrugBatch[]
}
