import { http } from '@shared/api/http'
import type PatientVisitMeta from '@shared/types/PatientVisitMeta'

/**
 * Fetch all patient visit records using the backend's default date filter.
 * Used to populate the patient directory on initial load.
 */
export async function fetchDirectoryDefault(): Promise<PatientVisitMeta[]> {
  const { data } = await http.get<PatientVisitMeta[]>('/all-patient-visit-meta/default')
  return data
}
