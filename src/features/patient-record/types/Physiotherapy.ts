export default interface Physiotherapy {
  id?: number
  patientId?: number
  subjectiveAssessment?: string // Subjective Assessment (Open Ended)
  painScale?: number | null // Pain Scale (A number from 1 to 10)
  objectiveAssessment?: string // Objective Assessment (Open Ended)
  intervention?: string // Intervention (Open Ended)
  evaluation?: string // Evaluation (Open Ended)
}
