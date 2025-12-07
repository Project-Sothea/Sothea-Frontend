export default interface Admin {
  id?: number
  vid?: number
  familyGroup: string
  regDate: Date
  queueNo: string
  name: string
  khmerName: string
  dob: Date
  gender: 'M' | 'F'
  village: string
  contactNo: string
  pregnant: boolean
  lastMenstrualPeriod: Date | null
  drugAllergies: string | null
  sentToId: boolean
}
