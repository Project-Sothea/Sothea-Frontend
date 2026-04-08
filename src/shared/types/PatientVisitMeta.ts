/**
 * Lightweight patient + visit summary returned by the all-patient-visit-meta endpoint.
 * Used by the patient queue and directory tables to avoid fetching full records.
 */
export default interface PatientVisitMeta {
  id?: number
  vid?: number
  familyGroup: string
  /** ISO date string (YYYY-MM-DD) of the visit registration */
  regDate: string
  queueNo: string
  name: string
  khmerName: string
  gender: 'M' | 'F'
  village: string
  contactNo: string
  drugAllergies: string | undefined
  /** Whether the patient was referred to the Infectious Disease station */
  sentToId: boolean
  referralNeeded: boolean

  /** True if the prescription contains at least one drug line */
  hasPrescriptionWithDrug: boolean
  /** True if all prescription drug lines have been marked as packed */
  allPrescriptionDrugsPacked: boolean
  /** True if the prescription has been dispensed to the patient */
  prescriptionDispensed: boolean
}
