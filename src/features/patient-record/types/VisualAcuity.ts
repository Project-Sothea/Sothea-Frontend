export default interface VisualAcuity {
  id?: number
  vid?: number
  lEyeVision: number
  rEyeVision: number
  sentToOpto: boolean
  referredForGlasses: boolean
  icopeEyeProblem: boolean
  icopeTreatedForDiabetesOrBp: boolean
  additionalIntervention: string | null
}
