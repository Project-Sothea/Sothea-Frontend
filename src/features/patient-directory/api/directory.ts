import { http } from '@shared/api/http'
import type PatientVisitMeta from '@features/patient-record/types/PatientVisitMeta'

export async function fetchDirectoryDefault() {
  const { data } = await http.get('/all-patient-visit-meta/default')
  return data as PatientVisitMeta[]
}

export async function exportPatientDirectory(includePhoto = false) {
  return http.get('/export-db', {
    responseType: 'blob',
    params: { includePhoto }
  })
}
