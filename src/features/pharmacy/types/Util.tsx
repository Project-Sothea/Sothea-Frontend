// types/pharmacy.ts

import type { DrugPresentationView } from './Drug'

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

export type RouteCode =
  | 'PO' // oral
  | 'IV'
  | 'IM'
  | 'TOP'
  | 'OTIC'
  | 'OPH'

export type UnitCode = 'mcg' | 'mg' | 'g' | 'mL' | 'L' | 'IU' | 'tab' | 'cap' | 'drop' | 'bottle'

// Optional: maps to human-readable labels
export const DOSAGE_FORM_LABELS: Record<DosageFormCode, string> = {
  TAB: 'Tablet',
  CAP: 'Capsule',
  SYR: 'Syrup',
  SUSP: 'Suspension',
  CREAM: 'Cream/Ointment',
  DROP: 'Drops',
  INJ: 'Injection'
}

export const ROUTE_LABELS: Record<RouteCode, string> = {
  PO: 'Oral',
  IV: 'Intravenous',
  IM: 'Intramuscular',
  TOP: 'Topical',
  OTIC: 'Ear',
  OPH: 'Ophthalmic'
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
  bottle: 'bottle'
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
  bottle: 'piece'
}

export function fmtStrength(pres?: DrugPresentationView) {
  if (!pres) {
    return '-'
  }
  const n = pres.strengthNum
  const nu = pres.strengthUnitNum
  const d = pres.strengthDen
  const du = pres.strengthUnitDen
  const form = pres.dosageFormCode

  if (n != null && nu && (d == null || du == null)) {
    // solids: "500 mg TAB"
    return `${n} ${nu} ${form}`
  }
  if (n != null && nu && d != null && du) {
    // liquids/creams: "250 mg/5 mL SYR"
    return `${n} ${nu} / ${d} ${du} ${form}`
  }
  // fallback to server-provided displayStrength if present
  return pres.displayStrength || form || '—'
}

export function fmtStrengthWithRoute(pres?: DrugPresentationView) {
  if (!pres) {
    return '-'
  }
  const strength = fmtStrength(pres)
  const route = pres.routeCode ? ` — ${pres.routeCode}` : ''
  return `${strength}${route}`
}

export function fmtDispenseUnit(pres?: DrugPresentationView) {
  if (!pres) {
    return '-'
  }
  // Examples:
  // - bottle with content: "Dispense: bottle • 100 mL"
  // - tab/cap/etc: "Dispense unit: tab"
  const u = pres.dispenseUnit
  const amt = pres.pieceContentAmount
  const unit = pres.pieceContentUnit

  if (u === 'bottle' && amt != null && unit) return `Dispense: Bottle • ${amt} ${unit}`
  if (u) return `Dispense unit: ${UNIT_LABELS[u]}`
  if (pres.strengthUnitNum) return `Unit: ${pres.strengthUnitNum}`
  return ''
}

export type ScheduleKind = 'hour' | 'day' | 'week' | 'month'

export const SCHEDULE_KINDS: ScheduleKind[] = ['hour', 'day', 'week', 'month']
