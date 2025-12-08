import { ref, type Ref } from 'vue'
import type Admin from '@patient-record/types/Admin'
import type { AdminPayload } from '@patient-record/api/visit'

export interface UseAdminFormOptions {
  /** Existing admin data for edit mode */
  initial?: Partial<Admin> | null
  /** Callback to surface first validation error (e.g., toast) */
  onError?: (message: string) => void
}

export interface UseAdminForm {
  // state
  regDate: Ref<Date>
  queueNo: Ref<string>
  pregnant: Ref<boolean | null>
  lastMenstrualPeriod: Ref<Date | null>
  sentToId: Ref<boolean | null>
  // helpers
  buildPayload(): AdminPayload | null
  validate(): boolean
  reset(next?: Partial<Admin> | null): void
  // setters (for child components to avoid prop mutation)
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

  const regDate = ref((normalizeDate(initial?.regDate, new Date()) || new Date()) as Date)
  const queueNo = ref(initial?.queueNo ?? '')
  const pregnant = ref<boolean | null>(initial?.pregnant ?? null)
  const lastMenstrualPeriod = ref<Date | null>(normalizeDate(initial?.lastMenstrualPeriod, null))
  const sentToId = ref<boolean | null>(initial?.sentToId ?? null)

  function validate(): boolean {
    const checks: Array<[boolean, string]> = [
      [!!regDate.value, 'Date Registered is required'],
      [!!queueNo.value, 'Queue Number is required'],
      [pregnant.value !== null, 'Pregnant? is required'],
      [sentToId.value !== null, 'Sent to Infectious Disease? is required']
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
      regDate: regDate.value,
      queueNo: queueNo.value || null,
      pregnant: pregnant.value ?? false,
      lastMenstrualPeriod: lastMenstrualPeriod.value,
      sentToId: sentToId.value ?? false
    }
  }

  function reset(next?: Partial<Admin> | null) {
    const src = next ?? null
    regDate.value = (normalizeDate(src?.regDate, regDate.value) || regDate.value) as Date
    queueNo.value = src?.queueNo ?? ''
    pregnant.value = src?.pregnant ?? null
    lastMenstrualPeriod.value = normalizeDate(src?.lastMenstrualPeriod, null)
    sentToId.value = src?.sentToId ?? null
  }

  function setRegDate(next: Date) {
    regDate.value = normalizeDate(next, regDate.value) as Date
  }
  function setLastMenstrualPeriod(next: Date | null) {
    lastMenstrualPeriod.value = normalizeDate(next, null)
  }

  return {
    regDate,
    queueNo,
    pregnant,
    lastMenstrualPeriod,
    sentToId,
    buildPayload,
    validate,
    reset,
    setRegDate,
    setLastMenstrualPeriod
  }
}
