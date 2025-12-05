import { http } from '@shared/api/http'
import type { Drug, DrugView } from '../types/Drug'
import type { DrugStock } from '../types/Batch'

export async function listDrugs() {
  const { data } = await http.get<DrugView[]>('/pharmacy/drugs')
  return data
}

export async function createDrug(payload: Omit<Drug, 'id'>) {
  const { data } = await http.post<DrugView>('/pharmacy/drugs', payload)
  return data
}

export async function getDrugStock(drugId: string | number) {
  const { data } = await http.get<DrugStock>(`/pharmacy/drugs/${drugId}`)
  return data
}

export async function updateDrug(drugId: string | number, updatedDrug: Drug) {
  const { data } = await http.patch<DrugView>(`/pharmacy/drugs/${drugId}`, updatedDrug)
  return data
}

export async function deleteDrug(drugId: string | number) {
  const { data } = await http.delete<DrugView>(`/pharmacy/drugs/${drugId}`)
  return data
}
