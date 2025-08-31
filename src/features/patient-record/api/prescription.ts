import { http } from '@shared/api/http'

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

export async function fetchPrescriptions(patientId: string | number) {
  const { data } = await http.get(`/prescriptions?patient_id=${patientId}`)
  return data
}

export async function fetchPrescriptionDrugs() {
  const { data } = await http.get('/pharmacy/drugs')
  return data
}

export async function fetchBatchesByDrug(drugId: number | string) {
  const { data } = await http.get(`/pharmacy/batches?drug_id=${drugId}`)
  return data
}

export async function upsertPrescription(existingId: string | number | null, payload: any) {
  if (existingId) {
    const { data } = await http.patch(`/prescriptions/${existingId}`, payload)
    return data
  }
  const { data } = await http.post('/prescriptions', payload)
  return data
}
