export default interface HeightAndWeight {
  id?: number
  vid?: number
  height: number
  weight: number
  bmi: number
  bmiAnalysis: string
  paedsHeight: number | null
  paedsWeight: number | null
}
