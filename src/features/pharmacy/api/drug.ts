import { http } from '@shared/api/http'
import type { Drug, DrugView } from '../types/Drug'
import type { DrugStock } from '../types/Batch'

/** Fetch the full list of drugs in the pharmacy catalogue. */
export async function listDrugs() {
  const { data } = await http.get<DrugView[]>('/pharmacy/drugs')
  return data
}

/** Add a new drug to the pharmacy catalogue. */
export async function createDrug(payload: Omit<Drug, 'id'>) {
  const { data } = await http.post<DrugView>('/pharmacy/drugs', payload)
  return data
}

/** Fetch a drug's details including its current stock (all batches and locations). */
export async function getDrugStock(drugId: string | number) {
  const { data } = await http.get<DrugStock>(`/pharmacy/drugs/${drugId}`)
  return data
}

/** Update an existing drug's details. */
export async function updateDrug(drugId: string | number, updatedDrug: Omit<Drug, 'id'>) {
  const { data } = await http.patch<DrugView>(`/pharmacy/drugs/${drugId}`, updatedDrug)
  return data
}

/** Remove a drug from the pharmacy catalogue. */
export async function deleteDrug(drugId: string | number) {
  const { data } = await http.delete<DrugView>(`/pharmacy/drugs/${drugId}`)
  return data
}
