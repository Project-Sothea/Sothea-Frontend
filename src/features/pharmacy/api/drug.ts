import { http } from '@shared/api/http'
import type { Drug, DrugPresentation, DrugPresentationView, DrugWithPresentations } from '@features/pharmacy/types/Drug'
import type { PresentationStock } from '@/features/pharmacy/types/Batch'

export async function listDrugs() {
  const { data } = await http.get<Drug[]>('/pharmacy/drugs')
  return data
}

export async function createDrug(payload: Omit<Drug, 'id'>) {
  const { data } = await http.post<Drug>('/pharmacy/drugs', payload)
  return data
}

export async function getDrug(drugId: string | number) {
  const { data } = await http.get<DrugWithPresentations>(`/pharmacy/drugs/${drugId}`)
  return data
}

export async function updateDrug(drugId: string | number, updatedDrug: Drug) {
  const { data } = await http.patch<DrugWithPresentations>(`/pharmacy/drugs/${drugId}`, updatedDrug)
  return data
}

export async function deleteDrug(drugId: string | number) {
  const { data } = await http.delete<DrugWithPresentations>(`/pharmacy/drugs/${drugId}`)
  return data
}

export async function listAllPresentations() {
  const { data } = await http.get<DrugPresentationView[]>(`/pharmacy/drugs/presentations`)
  return data
}

export async function listPresentationsForDrug(drugId: string | number) {
  const { data } = await http.get<DrugPresentationView[]>(`/pharmacy/drugs/presentations?drugId=${drugId}`)
  return data
}

export async function createPresentation(drugId: string | number, presentation: Omit<DrugPresentation, 'id' | 'drugId'> ) {
  const { data } = await http.post<DrugPresentationView>(`/pharmacy/drugs/${drugId}/presentations`, presentation)
  return data
}

export async function getPresentation(presentationId: string | number) {
  const { data } = await http.get<PresentationStock>(`/pharmacy/presentations/${presentationId}`)
  return data
}

export async function updatePresentation(presentationId: string | number, updatedPresentation: DrugPresentation) {
  const { data } = await http.patch<DrugPresentationView>(`/pharmacy/presentations/${presentationId}`, updatedPresentation)
  return data
}

export async function deletePresentation(presentationId: string | number) {
  const { data } = await http.delete<DrugPresentationView>(`/pharmacy/presentations/${presentationId}`)
  return data
}
