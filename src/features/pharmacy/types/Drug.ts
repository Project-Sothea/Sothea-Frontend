import type { DrugBatch } from "./DrugBatch"

export interface Drug {
  id: number
  name: string
  unit: string          // e.g. "tablet", "mg"
  default_size: number
  created_at: string    // ISO date-time if your API returns it
  updated_at: string
  notes: string
  batches?: DrugBatch[]
}