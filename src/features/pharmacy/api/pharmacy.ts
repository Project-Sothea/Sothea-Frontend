import { http } from '@shared/api/http'
import type { Drug } from '@features/pharmacy/types/Drug'
import type { DrugBatch } from '@/features/pharmacy/types/DrugBatch'
import type { BatchLocation } from '../types/BatchLocation'

export async function fetchDrugs() {
  const { data } = await http.get<Drug[]>('/pharmacy/drugs')
  return data
}

export async function fetchDrug(drugId: string | number) {
  const { data } = await http.get<Drug>(`/pharmacy/drugs/${drugId}`)
  return data
}

export async function fetchDrugBatches(drugId: string | number) {
  const { data } = await http.get<DrugBatch[]>(`/pharmacy/batches?drug_id=${drugId}`)
  return data
}

export async function fetchBatches() {
  const { data } = await http.get<DrugBatch[]>('/pharmacy/batches')
  return data
}

export async function createDrug(payload: Omit<Drug, 'id'>) {
  const { data } = await http.post<Drug>('/pharmacy/drugs', payload)
  return data
}

// Payload required to create a batch (without server-populated fields)
export interface CreateBatchPayload
  extends Omit<DrugBatch, 'id' | 'batchLocations'> {
  batchLocations: Array<Omit<BatchLocation, 'id' | 'batchId'>>;
}

export async function createBatch(payload: CreateBatchPayload) {
  const { data } = await http.post<DrugBatch>('/pharmacy/batches', payload)
  return data
}
