export default interface VitalStatistics {
  id?: number
  vid?: number
  temperature: number
  spo2: number
  systolicBp1: number | null
  diastolicBp1: number | null
  systolicBp2: number | null
  diastolicBp2: number | null
  averageSystolicBP: number | null
  averageDiastolicBP: number | null
  hr1: number
  hr2: number
  averageHR: number
  randBloodGlucoseMmolL: number | null
  icopeHighBp: boolean | null
}
