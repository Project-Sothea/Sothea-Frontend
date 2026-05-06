import { computed, ref, type Ref } from 'vue'
import type PatientDetails from '@patient-record/types/PatientDetails'
import type { PatientPayload } from '@patient-record/api/patient'
import { calculateAge } from '@shared/utils/age'

export interface UsePatientFormOptions {
  /** Existing patient data to pre-populate the form in edit mode. */
  initial?: Partial<PatientDetails> | null
  /** Callback invoked with the first failing validation message (e.g. show a toast). */
  onError?: (message: string) => void
}

export interface UsePatientForm {
  name: Ref<string>
  khmerName: Ref<string>
  dob: Ref<Date>
  gender: Ref<'M' | 'F' | ''>
  village: Ref<string>
  familyGroup: Ref<string>
  contactNo: Ref<string>
  drugAllergies: Ref<string | null>
  selectedPhoto: Ref<string>
  photoFile: Ref<File | null>
  ageComputed: Ref<number | null>
  buildPayload(): PatientPayload | null
  validate(): boolean
  reset(next?: Partial<PatientDetails> | null): void
  setDob(next: Date): void
}

function normalizeDate(input: unknown, fallback: Date | null = null): Date | null {
  if (input instanceof Date) return isNaN(input.getTime()) ? fallback : input
  if (typeof input === 'string') {
    const d = new Date(input)
    return isNaN(d.getTime()) ? fallback : d
  }
  return fallback
}

/**
 * Composable that manages reactive state and validation for the patient details form.
 * Provides `buildPayload()` to construct a submit-ready `PatientPayload` and `reset()`
 * to re-populate the form from new server data.
 */
export function usePatientForm(options: UsePatientFormOptions = {}): UsePatientForm {
  const { initial = null, onError } = options

  const name = ref(initial?.name ?? '')
  const khmerName = ref(initial?.khmerName ?? '')
  const dob = ref(normalizeDate(initial?.dob, new Date()) as Date)
  const gender = ref<'M' | 'F' | ''>((initial?.gender as any) ?? '')
  const village = ref(initial?.village ?? '')
  const familyGroup = ref(initial?.familyGroup ?? '')
  const contactNo = ref(initial?.contactNo ?? '')
  const drugAllergies = ref<string | null>(initial?.drugAllergies ?? '')
  const selectedPhoto = ref('')
  const photoFile = ref<File | null>(null)

  const ageComputed = computed(() => calculateAge(dob.value))

  function validate(): boolean {
    const checks: Array<[boolean, string]> = [
      [!!name.value, 'Name is required'],
      [!!khmerName.value, 'Khmer Name is required'],
      [!!dob.value, 'Date of Birth is required'],
      [!!gender.value, 'Gender is required'],
      [familyGroup.value !== '', 'Family Group is required'],
      [!!village.value, 'Village is required'],
      [ageComputed.value !== null, 'Please enter a valid Date of Birth']
    ]
    const failed = checks.find(([ok]) => !ok)
    if (failed) {
      onError?.(failed[1])
      return false
    }
    return true
  }

  function buildPayload(): PatientPayload | null {
    if (!validate()) return null
    return {
      name: name.value.trim(),
      familyGroup: familyGroup.value,
      khmerName: khmerName.value.trim(),
      dob: dob.value,
      gender: gender.value || '',
      village: village.value.trim(),
      contactNo: contactNo.value.trim(),
      drugAllergies: (drugAllergies.value || '').trim() || null
    }
  }

  function reset(next?: Partial<PatientDetails> | null) {
    const src = next ?? null
    name.value = src?.name ?? ''
    khmerName.value = src?.khmerName ?? ''
    dob.value = (normalizeDate(src?.dob, dob.value) || dob.value) as Date
    gender.value = (src?.gender as any) ?? ''
    village.value = src?.village ?? ''
    familyGroup.value = src?.familyGroup ?? ''
    contactNo.value = src?.contactNo ?? ''
    drugAllergies.value = src?.drugAllergies ?? ''
    selectedPhoto.value = ''
    photoFile.value = null
  }

  function setDob(next: Date) {
    dob.value = (normalizeDate(next, dob.value) || dob.value) as Date
  }

  return {
    name,
    khmerName,
    dob,
    gender,
    village,
    familyGroup,
    contactNo,
    drugAllergies,
    selectedPhoto,
    photoFile,
    ageComputed: ageComputed as Ref<number | null>,
    buildPayload,
    validate,
    reset,
    setDob
  }
}
