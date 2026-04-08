import { http } from '@shared/api/http'
import type PatientVisitMeta from '@shared/types/PatientVisitMeta'

/**
 * Fetch the queue of patient visit records for the given date.
 * @param date - ISO date string (YYYY-MM-DD)
 */
export async function fetchPatientVisitMetaByDate(date: string) {
  const { data } = await http.get<PatientVisitMeta[]>(`/all-patient-visit-meta/${date}`)
  return data
}
