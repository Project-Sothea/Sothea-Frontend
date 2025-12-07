import type Admin from './Admin'
import type PastMedicalHistory from './PastMedicalHistory'
import type SocialHistory from './SocialHistory'
import type HeightAndWeight from './HeightAndWeight'
import type VitalStatistics from './VitalStatistics'
import type VisualAcuity from './VisualAcuity'
import type FallRisk from './FallRisk'
import type Dental from './Dental'
import type DoctorsConsultation from './DoctorsConsultation'
import type Physiotherapy from './Physiotherapy'

// The Patient type is a composite type that contains all the other types.
export default interface Patient {
  admin: Admin
  pastMedicalHistory: PastMedicalHistory | null
  socialHistory: SocialHistory | null
  vitalStatistics: VitalStatistics | null
  heightAndWeight: HeightAndWeight | null
  visualAcuity: VisualAcuity | null
  fallRisk: FallRisk | null
  dental: Dental | null
  doctorsConsultation: DoctorsConsultation | null
  physiotherapy: Physiotherapy | null
}
