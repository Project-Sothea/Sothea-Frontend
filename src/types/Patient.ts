import type Admin from "./Admin"
import type VisualAcuity from "./VisualAcuity"
import type DoctorsConsultation from "./DoctorsConsultation"
import type PastMedicalHistory from "./PastMedicalHistory"
import type SocialHistory from "./SocialHistory"
import type HeightAndWeight from "./HeightAndWeight"
import type VitalStatistics from "./VitalStatistics"
import type FallRisk from "./FallRisk"

// The Patient type is a composite type that contains all the other types.
export default interface Patient {
  admin: Admin
  pastmedicalhistory: PastMedicalHistory | null
  socialhistory: SocialHistory | null
  vitalstatistics: VitalStatistics | null
  heightandweight: HeightAndWeight | null
  visualacuity: VisualAcuity | null
  fallrisk: FallRisk | null
  doctorsconsultation: DoctorsConsultation | null
}
