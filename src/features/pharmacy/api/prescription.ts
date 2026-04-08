import { http } from '@/shared/api/http'
import type {
  LineAllocation,
  Prescription,
  PrescriptionLine,
  PrescriptionLinePostData,
  PrescriptionPostData,
  SetAllocationsPostData
} from '../types/Prescription'

/**
 * Fetch the prescription for a given patient visit.
 * Returns null if no prescription exists (backend may return an empty array).
 */
export async function getPrescriptionByVisit(patientId: number, vid: number) {
  const { data } = await http.get<Prescription[]>(
    `/prescriptions?patient_id=${patientId}&vid=${vid}`
  )
  if (data.length != 1) {
    return null
  }
  return data[0]
}

/** Fetch a prescription by its ID. */
export async function getPrescriptionByID(id: number) {
  const { data } = await http.get<Prescription>(`/prescriptions/${id}`)
  return data
}

/** Create a new prescription. */
export async function createPrescription(newPrescription: PrescriptionPostData) {
  const { data } = await http.post<Prescription>(`/prescriptions`, newPrescription)
  return data
}

/** Update an existing prescription's details. */
export async function updatePrescription(id: number, updatedPrescription: PrescriptionPostData) {
  const { data } = await http.patch<Prescription>(`/prescriptions/${id}`, updatedPrescription)
  return data
}

/** Mark a prescription as dispensed. */
export async function dispensePrescription(id: number) {
  const { data } = await http.post<Prescription>(`/prescriptions/${id}/dispense`)
  return data
}

/** Add a drug line item to a prescription. */
export async function createLine(prescriptionId: number, newLine: PrescriptionLinePostData) {
  const { data } = await http.post<PrescriptionLine>(
    `/prescriptions/${prescriptionId}/lines`,
    newLine
  )
  return data
}

/** Update an existing prescription line item. */
export async function updateLine(lineId: number, updatedLine: PrescriptionLinePostData) {
  const { data } = await http.patch<PrescriptionLine>(`/prescriptions/lines/${lineId}`, updatedLine)
  return data
}

/** Remove a line item from a prescription. */
export async function deleteLine(lineId: number) {
  const { data } = await http.delete<PrescriptionLine>(`/prescriptions/lines/${lineId}`)
  return data
}

/** Fetch all batch allocations for a prescription line. */
export async function listLineAllocations(lineId: number) {
  const { data } = await http.get<LineAllocation[]>(`/prescriptions/lines/${lineId}/allocations`)
  return data
}

/** Replace all batch allocations for a prescription line (full replacement, not a patch). */
export async function setLineAllocations(lineId: number, newLines: SetAllocationsPostData) {
  const { data } = await http.put<LineAllocation[]>(
    `/prescriptions/lines/${lineId}/allocations`,
    newLines
  )
  return data
}

/** Mark a prescription line as packed (ready for dispensing). */
export async function markLinePacked(lineId: number) {
  const { data } = await http.post<PrescriptionLine>(`/prescriptions/lines/${lineId}/pack`)
  return data
}

/** Unmark a prescription line as packed. */
export async function unmarkLinePacked(lineId: number) {
  const { data } = await http.post<PrescriptionLine>(`/prescriptions/lines/${lineId}/unpack`)
  return data
}
