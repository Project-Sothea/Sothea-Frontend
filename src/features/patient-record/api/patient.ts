import { http } from '@shared/api/http'
import snakecaseKeys from 'snakecase-keys'

export interface PatientPayload {
  name: string
  familyGroup: string
  khmerName: string
  dob: Date
  gender: string
  village: string
  contactNo: string
  drugAllergies: string | null
}

export interface CreatePatientResponse {
  id: number
}

export async function createPatient(
  patient: PatientPayload,
  photoFile?: File | null
): Promise<CreatePatientResponse> {
  if (photoFile) {
    const fd = new FormData()
    fd.append(
      'patientdetails',
      JSON.stringify(snakecaseKeys(patient as unknown as Record<string, unknown>, { deep: true }))
    )
    fd.append('photo', photoFile)
    const { data } = await http.post<CreatePatientResponse>('/patient', fd)
    return data
  }
  const { data } = await http.post<CreatePatientResponse>('/patient', { patientdetails: patient })
  return data
}

export async function updatePatient(
  patientId: string | number,
  patient: PatientPayload,
  photoFile?: File | null
): Promise<void> {
  if (photoFile) {
    const fd = new FormData()
    fd.append(
      'patientdetails',
      JSON.stringify(snakecaseKeys(patient as unknown as Record<string, unknown>, { deep: true }))
    )
    fd.append('photo', photoFile)
    await http.put(`/patient/${patientId}`, fd)
    return
  }
  await http.put(`/patient/${patientId}`, { patientdetails: patient })
}

export async function deletePatient(patientId: string | number): Promise<void> {
  await http.delete(`/patient/${patientId}`)
}
