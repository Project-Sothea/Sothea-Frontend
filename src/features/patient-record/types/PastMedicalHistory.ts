export default interface PastMedicalHistory {
  id?: number
  vid?: number

  cough: boolean
  fever: boolean
  blockedNose: boolean
  soreThroat: boolean
  nightSweats: boolean
  unintentionalWeightLoss: boolean

  tuberculosis: boolean
  tuberculosisHasBeenTreated: boolean

  diabetes: boolean
  hypertension: boolean
  hyperlipidemia: boolean
  chronicJointPains: boolean
  chronicMuscleAches: boolean
  sexuallyTransmittedDisease: boolean
  specifiedSTDs: string | null
  others: string | null
}
