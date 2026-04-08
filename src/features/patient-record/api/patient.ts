import { http } from '@shared/api/http'
import snakecaseKeys from 'snakecase-keys'
import type { AdminPayload } from '@patient-record/api/visit'

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

export interface CreatePatientWithVisitResponse {
  id: number
  vid: number
}

/**
 * Create a new patient record. If a photo file is provided the request is sent
 * as multipart/form-data; otherwise a plain JSON body is used.
 */
export async function createPatient(
  patient: PatientPayload,
  photoFile?: File | null
): Promise<CreatePatientResponse> {
  if (photoFile) {
    const fd = new FormData()
    fd.append(
      'patient_details',
      JSON.stringify(snakecaseKeys(patient as unknown as Record<string, unknown>, { deep: true }))
    )
    fd.append('photo', photoFile)
    const { data } = await http.post<CreatePatientResponse>('/patient', fd)
    return data
  }
  const { data } = await http.post<CreatePatientResponse>('/patient', patient)
  return data
}

/**
 * Create a new patient together with their first visit in a single request.
 * Sends multipart/form-data when a photo is provided.
 */
export async function createPatientWithVisit(
  patient: PatientPayload,
  admin: AdminPayload,
  photoFile?: File | null
) {
  // Prefer multipart when a photo is present to avoid double-posting
  if (photoFile) {
    const fd = new FormData()
    fd.append(
      'patient_details',
      JSON.stringify(
        snakecaseKeys(patient as unknown as Record<string, unknown>, { deep: true })
      )
    )
    fd.append('admin', JSON.stringify(snakecaseKeys(admin as unknown as Record<string, unknown>, { deep: true })))
    fd.append('photo', photoFile)
    const { data } = await http.post<CreatePatientWithVisitResponse>('/patient-with-visit', fd)
    return data
  }

  const body = {
    patient_details: snakecaseKeys((patient || {}) as any, { deep: true }),
    admin: snakecaseKeys((admin || {}) as any, { deep: true })
  }
  const { data } = await http.post<CreatePatientWithVisitResponse>('/patient-with-visit', body)
  return data
}

/** Update an existing patient's details. Sends multipart/form-data when a photo is provided. */
export async function updatePatient(
  patientId: string | number,
  patient: PatientPayload,
  photoFile?: File | null
): Promise<void> {
  if (photoFile) {
    const fd = new FormData()
    fd.append(
      'patient_details',
      JSON.stringify(snakecaseKeys(patient as unknown as Record<string, unknown>, { deep: true }))
    )
    fd.append('photo', photoFile)
    await http.put(`/patient/${patientId}`, fd)
    return
  }
  await http.put(`/patient/${patientId}`, patient )
}

/** Permanently delete a patient and all associated data. */
export async function deletePatient(patientId: string | number): Promise<void> {
  await http.delete(`/patient/${patientId}`)
}
