import { computed } from 'vue'
import type FallRisk from '@patient-record/types/FallRisk'
import type VisualAcuity from '@patient-record/types/VisualAcuity'
import type HeightAndWeight from '@patient-record/types/HeightAndWeight'
import type PatientDetails from '@patient-record/types/PatientDetails'
import { calculatePaedsHeightPercentile, calculatePaedsWeightPercentile } from '@shared/utils/paeds'

export interface ReferralWarningData {
  age?: number | null
  fallRisk?: FallRisk | null
  visualAcuity?: VisualAcuity | null
  temperature?: number | null
  patientDetails?: PatientDetails | null
  heightAndWeight?: HeightAndWeight | null
  visitDate?: Date | string | null
}

export function useReferralWarnings(props: ReferralWarningData) {
  const heightWeightWarning = computed(() => {
    if (props.age == null || props.age < 0 || props.age >= 2) return ''
    const details = props.patientDetails
    const measurements = props.heightAndWeight
    if (!details || !measurements) return ''

    const percentiles = [
      [
        'Height',
        calculatePaedsHeightPercentile(
          details.dob,
          details.gender,
          measurements.height,
          props.visitDate
        )
      ],
      [
        'Weight',
        calculatePaedsWeightPercentile(
          details.dob,
          details.gender,
          measurements.weight,
          props.visitDate
        )
      ]
    ] as const
    const warnings: string[] = []
    for (const [label, percentile] of percentiles) {
      if (percentile == null) continue
      // Match the percentile displayed in HeightWeightModal.
      const displayedPercentile = +percentile.toFixed(2)
      if (displayedPercentile < 15) warnings.push(`${label} is below 15th percentile`)
      else if (displayedPercentile > 85) warnings.push(`${label} is above 85th percentile`)
    }
    return warnings.join('\n')
  })

  const needsKhmerOpticsReferral = computed(() => {
    const visualAcuity = props.visualAcuity
    if (!visualAcuity) return false
    return visualAcuity.lEyeVision > 24 || visualAcuity.rEyeVision > 24
  })

  const visualAcuityFmt = computed(() => {
    const visualAcuity = props.visualAcuity
    if (!visualAcuity) return ''
    const fmt = []
    if (visualAcuity.lEyeVision > 24) {
      fmt.push(`L: ${visualAcuity.lEyeVision}/24`)
    }
    if (visualAcuity.rEyeVision > 24) {
      fmt.push(`R: ${visualAcuity.rEyeVision}/24`)
    }
    return fmt.join(', ')
  })

  const fallRiskScore = computed(() => {
    if (!props.fallRisk) return 0
    return (
      (props.fallRisk.sideToSideBalance ?? 0) +
      (props.fallRisk.semiTandemBalance ?? 0) +
      (props.fallRisk.tandemBalance ?? 0) +
      (props.fallRisk.gaitSpeedTest ?? 0) +
      (props.fallRisk.chairStandTest ?? 0)
    )
  })
  const needsPhysiotherapistReferral = computed(() => {
    if (!props.fallRisk) return false
    return fallRiskScore.value < 7
  })

  const warningLinks = computed(() => {
    const flags: { message: string; section: string }[] = []
    if (props.age != null && props.age <= 16) {
      flags.push({ message: `PAEDS required: ${props.age} years old`, section: 'patient' })
    }
    if (props.temperature != null && props.temperature >= 38) {
      flags.push({ message: `Referral to ID needed (${props.temperature}°C)`, section: 'vital-stats' })
    }
    if (heightWeightWarning.value) {
      flags.push(
        ...heightWeightWarning.value.split('\n').map((message) => ({
          message,
          section: 'height-weight'
        }))
      )
    }
    if (needsKhmerOpticsReferral.value) {
      flags.push({ message: `Referral to Khmer Optics needed (${visualAcuityFmt.value})`, section: 'visual-acuity' })
    }
    if (needsPhysiotherapistReferral.value) {
      flags.push({ message: `Referral to Physiotherapist needed (Fall Risk Score: ${fallRiskScore.value})`, section: 'fall-risk' })
    }
    return flags
  })
  const redFlags = computed(() => warningLinks.value.map((flag) => flag.message))

  return {
    heightWeightWarning,
    needsKhmerOpticsReferral,
    needsPhysiotherapistReferral,
    redFlags,
    warningLinks
  }
}
