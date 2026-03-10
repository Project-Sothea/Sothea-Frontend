import { http } from '@/shared/api/http'
import type {
  LineAllocation,
  Prescription,
  PrescriptionLine,
  PrescriptionLinePostData,
  PrescriptionPostData,
  SetAllocationsPostData
} from '../types/Prescription'

export async function getPrescriptionByVisit(patientId: number, vid: number) {
  const { data } = await http.get<Prescription[]>(
    `/prescriptions?patient_id=${patientId}&vid=${vid}`
  )
  if (data.length != 1) {
    return null
  }
  return data[0]
}

export async function getPrescriptionByID(id: number) {
  const { data } = await http.get<Prescription>(`/prescriptions/${id}`)
  return data
}

export async function createPrescription(newPrescription: PrescriptionPostData) {
  const { data } = await http.post<Prescription>(`/prescriptions`, newPrescription)
  return data
}

export async function updatePrescription(id: number, updatedPrescription: PrescriptionPostData) {
  const { data } = await http.patch<Prescription>(`/prescriptions/${id}`, updatedPrescription)
  return data
}

export async function dispensePrescription(id: number) {
  const { data } = await http.post<Prescription>(`/prescriptions/${id}/dispense`)
  return data
}

export async function createLine(prescriptionId: number, newLine: PrescriptionLinePostData) {
  const { data } = await http.post<PrescriptionLine>(
    `/prescriptions/${prescriptionId}/lines`,
    newLine
  )
  return data
}

export async function updateLine(lineId: number, updatedLine: PrescriptionLinePostData) {
  const { data } = await http.patch<PrescriptionLine>(`/prescriptions/lines/${lineId}`, updatedLine)
  return data
}

export async function deleteLine(lineId: number) {
  const { data } = await http.delete<PrescriptionLine>(`/prescriptions/lines/${lineId}`)
  return data
}

export async function listLineAllocations(lineId: number) {
  const { data } = await http.get<LineAllocation[]>(`/prescriptions/lines/${lineId}/allocations`)
  return data
}

// replaces all
export async function setLineAllocations(lineId: number, newLines: SetAllocationsPostData) {
  const { data } = await http.put<LineAllocation[]>(
    `/prescriptions/lines/${lineId}/allocations`,
    newLines
  )
  return data
}

export async function markLinePacked(lineId: number) {
  const { data } = await http.post<PrescriptionLine>(`/prescriptions/lines/${lineId}/pack`)
  return data
}

export async function unmarkLinePacked(lineId: number) {
  const { data } = await http.post<PrescriptionLine>(`/prescriptions/lines/${lineId}/unpack`)
  return data
}
