import { http } from '@shared/api/http'
import type { DrugPrescription } from '@features/pharmacy/types/Prescription'

export interface PrescriptionEntryPayload {
  drugId: number
  dosage: string
  frequency: string
  quantity: number
  batchId?: number | null
}

export interface UpsertPrescriptionPayload {
  patientId: string | number
  visitId: string | number
  entries: PrescriptionEntryPayload[]
}

export async function fetchPrescriptions(
  patientId: string | number
): Promise<DrugPrescription[] | null> {
  const { data } = await http.get<DrugPrescription[] | null>(
    `/prescriptions?patient_id=${patientId}`
  )
  return data
}

export interface PrescriptionDrugMeta {
  id: number
  name: string
  form: string
  strength: string
}
export async function fetchPrescriptionDrugs(): Promise<PrescriptionDrugMeta[]> {
  const { data } = await http.get<PrescriptionDrugMeta[]>('/pharmacy/drugs')
  return data
}

export interface DrugBatchMeta {
  id: number
  batchNo: string
  expiryDate: string
  quantity: number
}
export async function fetchBatchesByDrug(drugId: number | string): Promise<DrugBatchMeta[]> {
  const { data } = await http.get<DrugBatchMeta[]>(`/pharmacy/batches?drug_id=${drugId}`)
  return data
}

export interface UpsertPrescriptionResponse {
  id: number
  patientId: number
  visitId: number
  entries: Array<{
    id: number
    drugId: number
    dosage: string
    frequency: string
    quantity: number
    batchId: number | null
  }>
}

export async function upsertPrescription(
  existingId: string | number | null,
  payload: UpsertPrescriptionPayload
): Promise<UpsertPrescriptionResponse> {
  if (existingId) {
    const { data } = await http.patch<UpsertPrescriptionResponse>(
      `/prescriptions/${existingId}`,
      payload
    )
    return data
  }
  const { data } = await http.post<UpsertPrescriptionResponse>('/prescriptions', payload)
  return data
}
