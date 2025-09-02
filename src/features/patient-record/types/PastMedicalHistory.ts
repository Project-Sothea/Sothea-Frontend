export default interface PastMedicalHistory {
  id?: number
  vid?: number
  tuberculosis: boolean
  diabetes: boolean
  hypertension: boolean
  hyperlipidemia: boolean
  chronicJointPains: boolean
  chronicMuscleAches: boolean
  sexuallyTransmittedDisease: boolean
  specifiedSTDs: string | null
  others: string | null
}
