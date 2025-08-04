export interface DrugBatch {
  id: number
  drug_id: number
  batch_no: string
  quantity: number
  expiry_date: string // ISO yyyy-mm-dd
  notes?: string
  location: string
  created_at: string
  updated_at: string
}
