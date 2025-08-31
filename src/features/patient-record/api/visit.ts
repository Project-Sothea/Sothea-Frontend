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

export interface AdminPayload {
  familyGroup: string
  regDate: string | null
  queueNo: string | null
  name: string
  khmerName: string
  dob: string | null
  age: number | null
  gender: string
  village: string
  contactNo: string
  pregnant: boolean | null
  lastMenstrualPeriod: string | null
  drugAllergies: string | null
  sentToId: boolean | null
  photo: string | null
}

export async function createPatient(admin: AdminPayload) {
  const { data } = await http.post('/patient', admin)
  return data
}

export async function addVisit(patientId: string | number, admin: AdminPayload) {
  const { data } = await http.post(`/patient/${patientId}`, admin)
  return data
}

export async function patchVisit(patientId: string | number, visitId: string | number, body: any) {
  const { data } = await http.patch(`/patient/${patientId}/${visitId}`, body)
  return data
}

export async function updateAdmin(
  patientId: string | number,
  visitId: string | number,
  admin: AdminPayload
) {
  return patchVisit(patientId, visitId, { admin })
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
) {
  return patchVisit(patientId, visitId, { [sectionName]: payload })
}
