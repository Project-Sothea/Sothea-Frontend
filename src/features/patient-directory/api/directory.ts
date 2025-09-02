import { http } from '@shared/api/http'
import type PatientVisitMeta from '@shared/types/PatientVisitMeta'
import type { AxiosResponse } from 'axios'

export async function fetchDirectoryDefault(): Promise<PatientVisitMeta[]> {
  const { data } = await http.get<PatientVisitMeta[]>('/all-patient-visit-meta/default')
  return data
}

export async function exportPatientDirectory(includePhoto = false): Promise<AxiosResponse<Blob>> {
  return http.get<Blob>('/export-db', {
    responseType: 'blob',
    params: { includePhoto }
  })
}
