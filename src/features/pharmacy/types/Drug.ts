import type { DosageFormCode, RouteCode, UnitCode, ISODateString } from './Util'

// Drug entity ---
export interface Drug {
  id: number

  genericName: string
  brandName?: string
  drugCode?: number | null
  isActive: boolean

  // Dosage and strength fields
  dosageFormCode: DosageFormCode
  routeCode: RouteCode

  // strength / concentration (optional in Go via omitempty)
  strengthNum?: number // e.g. 500
  strengthUnitNum?: UnitCode // e.g. "mg"
  strengthDen?: number // e.g. 5 (mL)
  strengthUnitDen?: UnitCode // e.g. "mL"

  // inventory base unit (what you deduct)
  dispenseUnit: UnitCode

  // piece-dispensed liquids/creams (optional)
  pieceContentAmount?: number // e.g. 100 (mL per bottle)
  pieceContentUnit?: UnitCode

  isFractionalAllowed: boolean

  // optional metadata
  barcode?: string
  notes?: string // Drug-specific notes
  displayAsPercentage?: boolean // If true, display concentration as percentage

  createdAt?: ISODateString
  updatedAt?: ISODateString
}

// --- "View" returned by drug view endpoints (adds server-computed labels) ---
export type DrugView = Drug & {
  displayStrength: string // e.g. "500 mg tab" or "250 mg/5 mL syrup"
  displayRoute: string // e.g. "PO"
  displayLabel: string // e.g. "Paracetamol 500 mg tablet (PO)"
}
