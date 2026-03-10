import { http } from '@shared/api/http'

/**
 * Fetches the patient's photo as a Blob from the protected endpoint.
 * The caller is responsible for creating and revoking an object URL if needed.
 */
export async function getPatientPhotoBlob(patientId: string | number): Promise<Blob> {
  const { data } = await http.get<Blob>(`/patient/${patientId}/photo`, {
    responseType: 'blob'
  })
  return data
}
