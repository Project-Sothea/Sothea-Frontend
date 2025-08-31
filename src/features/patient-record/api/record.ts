import { http } from '@shared/api/http'
import type PatientMeta from '@features/patient-record/types/PatientMeta'

export async function fetchPatientMeta(id: string) {
  const { data } = await http.get<PatientMeta>(`/patient-meta/${id}`)
  return data
}
