import { ref, computed, type Ref } from 'vue'
import { formatDateISO } from '@shared/utils/date'
import type Admin from '@patient-record/types/Admin'
import type { AdminPayload } from '@patient-record/api/visit'

export interface UseAdminFormOptions {
  /** Existing admin data for edit mode */
  initial?: Partial<Admin> | null
  /** Auto fill regDate with today if not provided (default true) */
  autoTodayRegDate?: boolean
  /** Callback to surface first validation error (e.g., toast) */
  onError?: (message: string) => void
}

export interface UseAdminForm {
  // state
  name: Ref<string>
  khmerName: Ref<string>
  dob: Ref<string | null>
  gender: Ref<'M' | 'F' | ''>
  contactNo: Ref<string>
  regDate: Ref<string>
  queueNo: Ref<string>
  village: Ref<string>
  familyGroup: Ref<string>
  pregnant: Ref<boolean | null>
  lastMenstrualPeriod: Ref<string | null>
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
}

export function useAdminForm(options: UseAdminFormOptions = {}): UseAdminForm {
  const { initial = null, autoTodayRegDate = true, onError } = options

  const name = ref(initial?.name ?? '')
  const khmerName = ref(initial?.khmerName ?? '')
  const dob = ref<string | null>(initial?.dob ? formatDateISO(initial.dob) : null)
  const gender = ref<'M' | 'F' | ''>((initial?.gender as any) ?? '')
  const contactNo = ref(initial?.contactNo ?? '')
  const regDate = ref(
    initial?.regDate
      ? formatDateISO(initial.regDate)
      : autoTodayRegDate
        ? formatDateISO(new Date())
        : ''
  )
  const queueNo = ref(initial?.queueNo ?? '')
  const village = ref(initial?.village ?? '')
  const familyGroup = ref(initial?.familyGroup ?? '')
  const pregnant = ref<boolean | null>(initial?.pregnant ?? null)
  const lastMenstrualPeriod = ref<string | null>(
    initial?.lastMenstrualPeriod ? formatDateISO(initial.lastMenstrualPeriod) : null
  )
  const drugAllergies = ref<string | null>(initial?.drugAllergies ?? '')
  const sentToId = ref<boolean | null>(initial?.sentToId ?? null)
  const selectedPhoto = ref('')
  const photoFile = ref<File | null>(null)
  const isMale = computed(() => gender.value === 'M')

  function calculateAge(dateString: string | null): number | null {
    if (!dateString) return null
    const birth = new Date(dateString)
    if (isNaN(birth.getTime())) return null
    const today = new Date()
    let yrs = today.getFullYear() - birth.getFullYear()
    const m = today.getMonth() - birth.getMonth()
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) yrs--
    return yrs
  }

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
      regDate: regDate.value ? new Date(regDate.value).toISOString() : null,
      queueNo: queueNo.value || null,
      name: name.value.trim(),
      khmerName: khmerName.value.trim(),
      dob: dob.value ? new Date(dob.value).toISOString() : null,
      age: ageComputed.value,
      gender: gender.value || '',
      village: village.value.trim(),
      contactNo: contactNo.value.trim(),
      pregnant: pregnant.value,
      lastMenstrualPeriod: lastMenstrualPeriod.value
        ? new Date(lastMenstrualPeriod.value).toISOString()
        : null,
      drugAllergies: (drugAllergies.value || '').trim() || null,
      sentToId: sentToId.value
    }
  }

  function reset(next?: Partial<Admin> | null) {
    const src = next ?? null
    name.value = src?.name ?? ''
    khmerName.value = src?.khmerName ?? ''
    dob.value = src?.dob ? formatDateISO(src.dob) : null
    gender.value = (src?.gender as any) ?? ''
    contactNo.value = src?.contactNo ?? ''
    regDate.value = src?.regDate
      ? formatDateISO(src.regDate)
      : autoTodayRegDate
        ? formatDateISO(new Date())
        : ''
    queueNo.value = src?.queueNo ?? ''
    village.value = src?.village ?? ''
    familyGroup.value = src?.familyGroup ?? ''
    pregnant.value = src?.pregnant ?? null
    lastMenstrualPeriod.value = src?.lastMenstrualPeriod
      ? formatDateISO(src.lastMenstrualPeriod)
      : null
    drugAllergies.value = src?.drugAllergies ?? ''
    sentToId.value = src?.sentToId ?? null
  selectedPhoto.value = ''
  photoFile.value = null
    // isMale is computed now; no manual assignment needed
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
    reset
  }
}
