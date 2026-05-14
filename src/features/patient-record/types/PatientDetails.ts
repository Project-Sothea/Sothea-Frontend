export default interface PatientDetails {
  id?: number
  name: string
  familyGroup: string
  khmerName: string
  dob: Date
  gender: 'M' | 'F'
  village: string
  contactNo: string | null
  drugAllergies: string | null
}
