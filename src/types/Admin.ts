export default interface Admin {
  id?: number
  vid?: number
  familyGroup: string
  regDate: string // ISO date string
  queueNo: string
  name: string
  khmerName: string
  dob: string | null // ISO date string
  age: number | null
  gender: 'M' | 'F'
  village: string
  contactNo: string
  pregnant: boolean
  lastMenstrualPeriod: string | null // ISO date string
  drugAllergies: string | null
  sentToId: boolean
  photo: string | null // base64 string
}
