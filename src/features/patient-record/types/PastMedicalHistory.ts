export default interface PastMedicalHistory {
  id?: number
  vid?: number

  cough: boolean | null
  fever: boolean | null
  blockedNose: boolean | null
  soreThroat: boolean | null
  nightSweats: boolean | null
  unintentionalWeightLoss: boolean | null

  tuberculosis: boolean | null
  tuberculosisHasBeenTreated: boolean | null

  diabetes: boolean | null
  hypertension: boolean | null
  hyperlipidemia: boolean | null
  chronicJointPains: boolean | null
  chronicMuscleAches: boolean | null
  sexuallyTransmittedDisease: boolean | null
  specifiedStds: string | null
  others: string | null
}
