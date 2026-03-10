export default interface DoctorsConsultation {
  id?: number
  vid?: number
  well: boolean | null
  msk: boolean | null
  cvs: boolean | null
  respi: boolean | null
  gu: boolean | null
  git: boolean | null
  eye: boolean | null
  derm: boolean | null
  others: string | null
  consultationNotes: string | null
  diagnosis: string | null
  treatment: string | null
  referralNeeded: boolean
  referralLoc: string | null
  remarks: string | null
}
