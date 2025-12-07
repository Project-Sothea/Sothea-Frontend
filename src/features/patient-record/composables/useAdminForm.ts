import { ref, computed, type Ref } from 'vue'
import type Admin from '@patient-record/types/Admin'
import type { AdminPayload } from '@patient-record/api/visit'
import { calculateAge } from '@shared/utils/age'

export interface UseAdminFormOptions {
  /** Existing admin data for edit mode */
  initial?: Partial<Admin> | null
  /** Callback to surface first validation error (e.g., toast) */
  onError?: (message: string) => void
}

export interface UseAdminForm {
  // state
  name: Ref<string>
  khmerName: Ref<string>
  dob: Ref<Date>
  gender: Ref<'M' | 'F' | ''>
  contactNo: Ref<string>
  regDate: Ref<Date>
  queueNo: Ref<string>
  village: Ref<string>
  familyGroup: Ref<string>
  pregnant: Ref<boolean | null>
  lastMenstrualPeriod: Ref<Date | null>
  drugAllergies: Ref<string | null>
  sentToId: Ref<boolean | null>
  selectedPhoto: Ref<string>
  photoFile: Ref<File | null>
  isMale: Ref<boolean>
  ageComputed: Ref<number | null>
  // helpers
  buildPayload(): AdminPayload | null
  validate(): boolean
  reset(next?: Partial<Admin> | null): void
  // setters (for child components to avoid prop mutation)
  setDob(next: Date): void
  setRegDate(next: Date): void
  setLastMenstrualPeriod(next: Date | null): void
}

function normalizeDate(input: unknown, fallback: Date | null = null): Date | null {
  if (input instanceof Date) return isNaN(input.getTime()) ? fallback : input
  if (typeof input === 'string') {
    const d = new Date(input)
    return isNaN(d.getTime()) ? fallback : d
  }
  return fallback
}

export function useAdminForm(options: UseAdminFormOptions = {}): UseAdminForm {
  const { initial = null, onError } = options

  const name = ref(initial?.name ?? '')
  const khmerName = ref(initial?.khmerName ?? '')
  const dob = ref(normalizeDate(initial?.dob, new Date()) as Date)
  const gender = ref<'M' | 'F' | ''>((initial?.gender as any) ?? '')
  const contactNo = ref(initial?.contactNo ?? '')
  const regDate = ref((normalizeDate(initial?.regDate, new Date()) || new Date()) as Date)
  const queueNo = ref(initial?.queueNo ?? '')
  const village = ref(initial?.village ?? '')
  const familyGroup = ref(initial?.familyGroup ?? '')
  const pregnant = ref<boolean | null>(initial?.pregnant ?? null)
  const lastMenstrualPeriod = ref<Date | null>(normalizeDate(initial?.lastMenstrualPeriod, null))
  const drugAllergies = ref<string | null>(initial?.drugAllergies ?? '')
  const sentToId = ref<boolean | null>(initial?.sentToId ?? null)
  const selectedPhoto = ref('')
  const photoFile = ref<File | null>(null)
  const isMale = computed(() => gender.value === 'M')

  const ageComputed = computed(() => calculateAge(dob.value))

  function validate(): boolean {
    const checks: Array<[boolean, string]> = [
      [!!name.value, 'Name is required'],
      [!!khmerName.value, 'Khmer Name is required'],
      [!!dob.value, 'Date of Birth is required'],
      [!!gender.value, 'Gender is required'],
      [!!regDate.value, 'Date Registered is required'],
      [!!queueNo.value, 'Queue Number is required'],
      [!!village.value, 'Village is required'],
      [familyGroup.value !== '', 'Family Group is required'],
      [pregnant.value !== null, 'Pregnant? is required'],
      [sentToId.value !== null, 'Sent to Infectious Disease? is required'],
      [ageComputed.value !== null, 'Please enter a valid Date of Birth']
    ]
    const failed = checks.find(([ok]) => !ok)
    if (failed) {
      onError?.(failed[1])
      return false
    }
    return true
  }

  function buildPayload(): AdminPayload | null {
    if (!validate()) return null
    return {
      familyGroup: familyGroup.value,
      regDate: regDate.value,
      queueNo: queueNo.value || null,
      name: name.value.trim(),
      khmerName: khmerName.value.trim(),
      dob: dob.value,
      gender: gender.value || '',
      village: village.value.trim(),
      contactNo: contactNo.value.trim(),
      pregnant: pregnant.value,
      lastMenstrualPeriod: lastMenstrualPeriod.value,
      drugAllergies: (drugAllergies.value || '').trim() || null,
      sentToId: sentToId.value
    }
  }

  function reset(next?: Partial<Admin> | null) {
    const src = next ?? null
    name.value = src?.name ?? ''
    khmerName.value = src?.khmerName ?? ''
    dob.value = (normalizeDate(src?.dob, dob.value) || dob.value) as Date
    gender.value = (src?.gender as any) ?? ''
    contactNo.value = src?.contactNo ?? ''
    regDate.value = (normalizeDate(src?.regDate, regDate.value) || regDate.value) as Date
    queueNo.value = src?.queueNo ?? ''
    village.value = src?.village ?? ''
    familyGroup.value = src?.familyGroup ?? ''
    pregnant.value = src?.pregnant ?? null
    lastMenstrualPeriod.value = normalizeDate(src?.lastMenstrualPeriod, null)
    drugAllergies.value = src?.drugAllergies ?? ''
    sentToId.value = src?.sentToId ?? null
    selectedPhoto.value = ''
    photoFile.value = null
  }

  function setDob(next: Date) {
    dob.value = normalizeDate(next, dob.value) as Date
  }
  function setRegDate(next: Date) {
    regDate.value = normalizeDate(next, regDate.value) as Date
  }
  function setLastMenstrualPeriod(next: Date | null) {
    lastMenstrualPeriod.value = normalizeDate(next, null)
  }

  return {
    name,
    khmerName,
    dob,
    gender,
    contactNo,
    regDate,
    queueNo,
    village,
    familyGroup,
    pregnant,
    lastMenstrualPeriod,
    drugAllergies,
    sentToId,
    selectedPhoto,
    photoFile,
    isMale,
    ageComputed: ageComputed as Ref<number | null>,
    buildPayload,
    validate,
    reset,
    setDob,
    setRegDate,
    setLastMenstrualPeriod
  }
}
