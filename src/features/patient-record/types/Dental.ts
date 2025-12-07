export default interface Dental {
  id?: number
  vid?: number
  fluorideExposure: '6, 7' | '5, 4, 3' | '2, 1, 0'
  diet: '≤1' | '2-3' | '≥4'
  bacterialExposure: 'None in last 2 years' | 'Yes in last 7 - 23 months' | 'Yes in last 6 months'
  oralSymptoms: boolean
  drinkOtherWater: boolean

  riskForDentalCarries: 'Low Risk' | 'Middle Risk' | 'High Risk'

  icopeDifficultyChewing: boolean | null
  icopePainInMouth: boolean | null

  dentalNotes: string | null
}
