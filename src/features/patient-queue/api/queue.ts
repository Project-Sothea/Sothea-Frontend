import { http } from '@shared/api/http'
import type PatientVisitMeta from '@shared/types/PatientVisitMeta'

export async function fetchPatientVisitMetaByDate(date: string) {
  const { data } = await http.get<PatientVisitMeta[]>(`/all-patient-visit-meta/${date}`)
  return data
}
