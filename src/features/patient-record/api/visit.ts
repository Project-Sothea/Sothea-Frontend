import { http } from '@shared/api/http'
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
import type Patient from '../types/Patient'

export interface AdminPayload {
  regDate: Date
  queueNo: string
  pregnant: boolean
  lastMenstrualPeriod: Date | null
  sentToId: boolean
}

// Responses as observed / required by callers
export interface createPatientVisitResponse {
  vid: number
}

// Accept either AdminPayload (used when creating a visit) or Admin (built from existing form) to avoid casts at call sites
export async function createPatientVisit(
  patientId: string | number,
  admin: AdminPayload | Admin
): Promise<createPatientVisitResponse> {
  const { data } = await http.post<createPatientVisitResponse>(`/patient/${patientId}`, admin)
  return data
}

export async function updatePatientVisit<T = unknown>(
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
  admin: AdminPayload
): Promise<void> {
  await updatePatientVisit(patientId, visitId, { admin })
}

export async function fetchPatientRecord(patientId: string, visitId: string): Promise<Patient> {
  const { data } = await http.get<Patient>(`/patient/${patientId}/${visitId}`)
  return data
}

export async function deletePatientVisit(patientId: string, visitId: string): Promise<void> {
  await http.delete(`/patient/${patientId}/${visitId}`)
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
  await updatePatientVisit(patientId, visitId, { [sectionName]: payload })
}
