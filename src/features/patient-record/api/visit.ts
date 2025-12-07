import { http } from '@shared/api/http'
import snakecaseKeys from 'snakecase-keys'
import type VitalStatistics from '../types/VitalStatistics'
import type VisualAcuity from '../types/VisualAcuity'
import type FallRisk from '../types/FallRisk'
import type HeightAndWeight from '../types/HeightAndWeight'
import type PastMedicalHistory from '../types/PastMedicalHistory'
import type SocialHistory from '../types/SocialHistory'
import type Physiotherapy from '../types/Physiotherapy'
import type Dental from '../types/Dental'
import type DoctorsConsultation from '../types/DoctorsConsultation'
import type Admin from '../types/Admin'

export interface AdminPayload {
  familyGroup: string
  regDate: Date
  queueNo: string | null
  name: string
  khmerName: string
  dob: Date
  gender: string
  village: string
  contactNo: string
  pregnant: boolean | null
  lastMenstrualPeriod: Date | null
  drugAllergies: string | null
  sentToId: boolean | null
}

// Responses as observed / required by callers
export interface CreatePatientResponse {
  id: number
}
export interface AddVisitResponse {
  vid: number
}

export async function createPatient(
  admin: AdminPayload,
  photoFile?: File | null
): Promise<CreatePatientResponse> {
  const fd = new FormData()
  // Convert admin to snake_case before stringifying (FormData bypasses interceptor conversion)
  fd.append(
    'admin',
    JSON.stringify(snakecaseKeys(admin as unknown as Record<string, unknown>, { deep: true }))
  )
  if (photoFile) {
    fd.append('photo', photoFile)
  }
  const { data } = await http.post<CreatePatientResponse>('/patient', fd)
  return data
}

// Accept either AdminPayload (used when creating new patient) or Admin (built from existing form) to avoid casts at call sites
export async function addVisit(
  patientId: string | number,
  admin: AdminPayload | Admin,
  photoFile?: File | null
): Promise<AddVisitResponse> {
  const fd = new FormData()
  // Convert admin to snake_case before stringifying
  fd.append(
    'admin',
    JSON.stringify(snakecaseKeys(admin as unknown as Record<string, unknown>, { deep: true }))
  )
  if (photoFile) {
    fd.append('photo', photoFile)
  }
  const { data } = await http.post<AddVisitResponse>(`/patient/${patientId}`, fd)
  return data
}

export async function patchVisit<T = unknown>(
  patientId: string | number,
  visitId: string | number,
  body: unknown
): Promise<T> {
  const { data } = await http.patch<T>(`/patient/${patientId}/${visitId}`, body)
  return data
}

export async function updateAdmin(
  patientId: string | number,
  visitId: string | number,
  admin: AdminPayload,
  photoFile?: File | null
): Promise<void> {
  if (photoFile) {
    const fd = new FormData()
    // Convert admin to snake_case before stringifying
    fd.append(
      'admin',
      JSON.stringify(snakecaseKeys(admin as unknown as Record<string, unknown>, { deep: true }))
    )
    fd.append('photo', photoFile)
    await patchVisit(patientId, visitId, fd)
    return
  }
  await patchVisit(patientId, visitId, { admin })
}

// Generic section updater (e.g., vitalStats, visualAcuity, etc.)
// Section name -> payload type mapping
export type SectionPayloadMap = {
  vitalStatistics: VitalStatistics
  visualAcuity: VisualAcuity
  fallRisk: FallRisk
  heightAndWeight: HeightAndWeight
  pastMedicalHistory: PastMedicalHistory
  socialHistory: SocialHistory
  physiotherapy: Physiotherapy
  dental: Dental
  doctorsConsultation: DoctorsConsultation
  // prescriptions handled separately
}
export type SectionName = keyof SectionPayloadMap

export async function updateSection<K extends SectionName>(
  patientId: string | number,
  visitId: string | number,
  sectionName: K,
  payload: SectionPayloadMap[K]
): Promise<void> {
  await patchVisit(patientId, visitId, { [sectionName]: payload })
}
