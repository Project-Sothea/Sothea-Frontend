import { http } from '@shared/api/http'
import type { Drug } from '@features/pharmacy/types/Drug'
import type { DrugBatch } from '@features/pharmacy/types/DrugBatch'

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

export async function createBatch(payload: any) {
  // TODO: type payload
  const { data } = await http.post('/pharmacy/batches', payload)
  return data
}
