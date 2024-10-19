export default interface FallRisk {
  id?: number
  vid?: number
  pastYearFall: boolean
  unsteadyStandingFalling: boolean
  fallWorries: boolean
  others: string | null
  furtherReferral: boolean
}
