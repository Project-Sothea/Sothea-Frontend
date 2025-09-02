import { http } from '@shared/api/http'
import type Patient from '@patient-record/types/Patient'

export async function fetchPatientRecord(patientId: string, visitId: string): Promise<Patient> {
  const { data } = await http.get<Patient>(`/patient/${patientId}/${visitId}`)
  return data
}

export async function deletePatientVisit(patientId: string, visitId: string): Promise<void> {
  await http.delete(`/patient/${patientId}/${visitId}`)
}
