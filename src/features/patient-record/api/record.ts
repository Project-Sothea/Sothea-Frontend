import { http } from '@shared/api/http'
import type PatientMeta from '@features/patient-record/types/PatientMeta'

/**
 * Fetch lightweight patient metadata (name, visits map, etc.) by patient ID.
 * Used to populate the visit selector without loading the full record.
 */
export async function fetchPatientMeta(id: string): Promise<PatientMeta> {
  const { data } = await http.get<PatientMeta>(`/patient-meta/${id}`)
  return data
}
