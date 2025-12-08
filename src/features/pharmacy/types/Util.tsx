// types/pharmacy.ts

import type { DrugView } from './Drug'

// RFC3339 from Go's time.Time
export type ISODateString = string

export function fmtDate(s: string) {
  if (!s || s === '–') return '–'
  const d = new Date(s)
  return isNaN(+d) ? s : d.toLocaleDateString('en-SG')
}

// --- Coded lists (extend to match your backend) ---
export type DosageFormCode =
  | 'TAB' // tablet
  | 'CAP' // capsule
  | 'SYR' // syrup
  | 'SUSP' // suspension
  | 'CREAM'
  | 'DROP'
  | 'INJ'
  | 'INH'
  | 'SAT' // sachet

export type RouteCode =
  | 'PO' // oral
  | 'IV'
  | 'IM'
  | 'TOP'
  | 'OTIC'
  | 'OPH'
  | 'INH'
  | 'NAS'

export type UnitCode =
  | 'mcg'
  | 'mg'
  | 'g'
  | 'mL'
  | 'L'
  | 'IU'
  | 'tab'
  | 'cap'
  | 'drop'
  | 'bottle'
  | 'sachet'
  | 'inhaler'
  | 'puff'
  | 'tube'

// Optional: maps to human-readable labels
export const DOSAGE_FORM_LABELS: Record<DosageFormCode, string> = {
  TAB: 'Tablet',
  CAP: 'Capsule',
  SYR: 'Syrup',
  SUSP: 'Suspension',
  CREAM: 'Cream/Ointment',
  DROP: 'Drops',
  INJ: 'Injection',
  INH: 'Inhalation',
  SAT: 'Sachet'
}

export const ROUTE_LABELS: Record<RouteCode, string> = {
  PO: 'Oral',
  IV: 'Intravenous',
  IM: 'Intramuscular',
  TOP: 'Topical',
  OTIC: 'Ear',
  OPH: 'Ophthalmic',
  INH: 'Inhalation',
  NAS: 'Nasal'
}

export const UNIT_LABELS: Record<UnitCode, string> = {
  mcg: 'mcg',
  mg: 'mg',
  g: 'g',
  mL: 'mL',
  L: 'L',
  IU: 'IU',
  tab: 'tablet(s)',
  cap: 'capsule(s)',
  drop: 'drop(s)',
  bottle: 'bottle(s)',
  sachet: 'sachet(s)',
  inhaler: 'inhaler(s)',
  puff: 'puff(s)',
  tube: 'tube(s)'
}

export const UNIT_KIND: Record<UnitCode, 'mass' | 'volume' | 'piece'> = {
  mcg: 'mass',
  mg: 'mass',
  g: 'mass',
  IU: 'mass', // IU treated as mass-potency
  mL: 'volume',
  L: 'volume',
  tab: 'piece',
  cap: 'piece',
  drop: 'piece',
  bottle: 'piece',
  sachet: 'piece',
  inhaler: 'piece',
  puff: 'piece',
  tube: 'piece'
}

export function fmtStrength(drug?: DrugView) {
  if (!drug) {
    return '-'
  }
  const n = drug.strengthNum
  const nu = drug.strengthUnitNum
  const d = drug.strengthDen
  const du = drug.strengthUnitDen
  const form = drug.dosageFormCode
  const displayAsPercentage = drug.displayAsPercentage ?? false

  if (n != null && nu && (d == null || du == null)) {
    // solids: "500 mg TAB"
    return `${n} ${nu} ${form}`
  }
  if (n != null && nu && d != null && du) {
    // liquids/creams: "250 mg/5 mL SYR" or "5% SYR" if displayAsPercentage
    if (displayAsPercentage) {
      // Calculate percentage: (n / d) * 100
      const percentage = (n / d) * 100
      return `${percentage}% ${form}`
    }
    return `${n} ${nu} / ${d} ${du} ${form}`
  }
  // fallback to server-provided displayStrength if present
  return drug.displayStrength || form || '—'
}

export function fmtStrengthWithRoute(drug?: DrugView) {
  if (!drug) {
    return '-'
  }
  const strength = fmtStrength(drug)
  const route = drug.routeCode ? ` — ${drug.routeCode}` : ''
  return `${strength}${route}`
}

export function fmtDispenseUnit(drug?: DrugView) {
  if (!drug) {
    return '-'
  }
  // Examples:
  // - bottle with content: "Dispense: bottle • 100 mL"
  // - tab/cap/etc: "Dispense unit: tab"
  const u = drug.dispenseUnit
  const amt = drug.pieceContentAmount
  const unit = drug.pieceContentUnit

  if (u === 'bottle' && amt != null && unit) return `Dispense: Bottle • ${amt} ${unit}`
  if (u) return `Dispense unit: ${UNIT_LABELS[u]}`
  if (drug.strengthUnitNum) return `Unit: ${drug.strengthUnitNum}`
  return ''
}

// Format drug name with drug code prefix
export function fmtDrugName(
  drug?: DrugView | { genericName: string; brandName?: string; drugCode?: number }
): string {
  if (!drug) return '—'
  const name = drug.genericName || drug.brandName || 'Drug'
  const drugCode = 'drugCode' in drug ? drug.drugCode : undefined
  if (drugCode != null) {
    return `${drugCode}. ${name}`
  }
  return name
}

// Format drug name with brand name in parentheses
export function fmtDrugNameWithBrand(
  drug?: DrugView | { genericName: string; brandName?: string; drugCode?: number }
): string {
  if (!drug) return '—'
  const baseName = fmtDrugName(drug)
  const brand = 'brandName' in drug ? drug.brandName : undefined
  if (brand && drug.genericName) {
    return `${baseName} (${brand})`
  }
  return baseName
}

export type ScheduleKind = 'hour' | 'day' | 'week' | 'month'

// Common dosing frequency codes (tightened type instead of plain string)
export type FrequencyCode =
  | 'OM' // Once Morning
  | 'ON' // Once Night
  | 'OA' // Once Afternoon
  | 'BD' // Twice a day
  | 'TDS' // 3 times a day
  | 'QDS' // 4 times a day
  | 'EOD' // Every other day
  | 'q4h' // Every 4 hours
  | 'q6h' // Every 6 hours
  | 'q8h' // Every 8 hours
  | 'q12h' // Every 12 hours

export const FREQUENCY_OPTIONS = [
  {
    code: 'OM' as FrequencyCode,
    label: 'Once every morning',
    scheduleKind: 'day' as ScheduleKind,
    everyN: 1,
    frequencyPerSchedule: 1
  },
  {
    code: 'ON' as FrequencyCode,
    label: 'Once every night',
    scheduleKind: 'day' as ScheduleKind,
    everyN: 1,
    frequencyPerSchedule: 1
  },
  {
    code: 'OA' as FrequencyCode,
    label: 'Once every afternoon',
    scheduleKind: 'day' as ScheduleKind,
    everyN: 1,
    frequencyPerSchedule: 1
  },
  {
    code: 'BD' as FrequencyCode,
    label: '2 times a day',
    scheduleKind: 'day' as ScheduleKind,
    everyN: 1,
    frequencyPerSchedule: 2
  },
  {
    code: 'TDS' as FrequencyCode,
    label: '3 times a day',
    scheduleKind: 'day' as ScheduleKind,
    everyN: 1,
    frequencyPerSchedule: 3
  },
  {
    code: 'QDS' as FrequencyCode,
    label: '4 times a day',
    scheduleKind: 'day' as ScheduleKind,
    everyN: 1,
    frequencyPerSchedule: 4
  },
  {
    code: 'EOD' as FrequencyCode,
    label: 'Every other day',
    scheduleKind: 'day' as ScheduleKind,
    everyN: 2,
    frequencyPerSchedule: 1
  },
  {
    code: 'q4h' as FrequencyCode,
    label: 'Every 4 hours',
    scheduleKind: 'hour' as ScheduleKind,
    everyN: 4,
    frequencyPerSchedule: 1
  },
  {
    code: 'q6h' as FrequencyCode,
    label: 'Every 6 hours',
    scheduleKind: 'hour' as ScheduleKind,
    everyN: 6,
    frequencyPerSchedule: 1
  },
  {
    code: 'q8h' as FrequencyCode,
    label: 'Every 8 hours',
    scheduleKind: 'hour' as ScheduleKind,
    everyN: 8,
    frequencyPerSchedule: 1
  },
  {
    code: 'q12h' as FrequencyCode,
    label: 'Every 12 hours',
    scheduleKind: 'hour' as ScheduleKind,
    everyN: 12,
    frequencyPerSchedule: 1
  }
] as const
