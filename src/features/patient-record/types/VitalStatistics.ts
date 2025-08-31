export default interface VitalStatistics {
  id?: number
  vid?: number
  temperature: number
  spO2: number
  systolicBP1: number | null
  diastolicBP1: number | null
  systolicBP2: number | null
  diastolicBP2: number | null
  averageSystolicBP: number | null
  averageDiastolicBP: number | null
  hr1: number
  hr2: number
  averageHR: number
  randomBloodGlucoseMmolL: number
}
