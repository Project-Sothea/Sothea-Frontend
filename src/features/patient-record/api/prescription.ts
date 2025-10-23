import { http } from '@shared/api/http'
import type { Prescription } from '@/features/pharmacy/types/Prescription'

export async function fetchPrescription() {
  const { data } = await http.get<Prescription[]>('/prescriptions')
  return data
}

export async function fetchPrescriptionByVisit(patientId: string | number, vid: string | number) {
  const { data } = await http.get<Prescription[]>(`/prescriptions?patient_id=${patientId}&vid=${vid}`)
  if (data.length === 0) {
    return null
  }
  return data[0]
}

export async function fetchPrescriptionById(prescriptionId: string | number) {
  const { data } = await http.get<Prescription>(`/prescriptions/${prescriptionId}`)
  return data
}

export async function createPrescription(payload: Prescription) {
  const { data } = await http.post<Prescription>('/prescriptions', payload)
  return data
}

export async function updatePrescription(payload: Prescription) {
  const { data } = await http.patch<Prescription>(`/prescriptions/${payload.id}`, payload)
  return data
}
