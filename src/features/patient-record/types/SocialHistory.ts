export default interface SocialHistory {
  id?: number
  vid?: number
  pastSmokingHistory: boolean
  pastSmokingInformation: string | null
  currentSmokingHistory: boolean
  currentSmokingInformation: string | null
  alcoholHistory: boolean
  alcoholInformation: string | null
}
