export default interface PatientVisitMeta {
  id?: number
  vid?: number
  familyGroup: string
  regDate: string
  queueNo: string
  name: string
  khmerName: string
  gender: 'M' | 'F'
  village: string
  contactNo: string
  drugAllergies: string | undefined
  sentToId: boolean
  referralNeeded: boolean

  hasPrescriptionWithDrug: boolean
  allPrescriptionDrugsPacked: boolean
  prescriptionDispensed: boolean
}
