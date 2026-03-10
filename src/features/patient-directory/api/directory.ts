import { http } from '@shared/api/http'
import type PatientVisitMeta from '@shared/types/PatientVisitMeta'

export async function fetchDirectoryDefault(): Promise<PatientVisitMeta[]> {
  const { data } = await http.get<PatientVisitMeta[]>('/all-patient-visit-meta/default')
  return data
}
