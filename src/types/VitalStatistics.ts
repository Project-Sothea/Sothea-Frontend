export default interface VitalStatistics {
  id?: number
  vid?: number
  temperature: number
  spO2: number
  systolicBP1: number
  diastolicBP1: number
  systolicBP2: number
  diastolicBP2: number
  averageSystolicBP: number
  averageDiastolicBP: number
  hr1: number
  hr2: number
  averageHR: number
  randomBloodGlucoseMmolL: number
  randomBloodGlucoseMmolLp: number
}
