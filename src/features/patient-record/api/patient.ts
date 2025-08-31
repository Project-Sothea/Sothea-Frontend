import { http } from '@shared/api/http'
import type Patient from '@patient-record/types/Patient'

export async function fetchPatientRecord(patientId: string, visitId: string) {
  const { data } = await http.get(`/patient/${patientId}/${visitId}`)
  return data as Patient
}

export async function deletePatientVisit(patientId: string, visitId: string) {
  await http.delete(`/patient/${patientId}/${visitId}`)
}
