import type { DosageFormCode, RouteCode, UnitCode, ISODateString } from "./Util"

export interface Drug {
  id: number
	genericName:string 
  brandName?: string
  atcCode?: string
  notes?: string
  isActive: boolean
  createdAt?: string
  updatedAt?: string
}

// --- Base presentation returned by some endpoints ---
export interface DrugPresentation {
  id: number;
  drugId: number;

  // coded fields
  dosageFormCode: DosageFormCode;
  routeCode: RouteCode;

  // strength / concentration (optional in Go via omitempty)
  strengthNum?: number;          // e.g. 500
  strengthUnitNum?: UnitCode;    // e.g. "mg"
  strengthDen?: number;          // e.g. 5 (mL)
  strengthUnitDen?: UnitCode;    // e.g. "mL"

  // inventory base unit (what you deduct)
  dispenseUnit: UnitCode;

  // piece-dispensed liquids/creams (optional)
  pieceContentAmount?: number;   // e.g. 100 (mL per bottle)
  pieceContentUnit?: UnitCode;

  isFractionalAllowed: boolean;

  // optional metadata
  barcode?: string;
  notes?: string;

  createdAt?: ISODateString;
  updatedAt?: ISODateString;
}

// --- "View" returned by presentation view endpoints (adds server-computed labels) ---
export type DrugPresentationView = DrugPresentation & {
  drugName: string;            // e.g. "Paracetamol"
  displayStrength: string;     // e.g. "500 mg tab" or "250 mg/5 mL syrup"
  displayRoute: string;        // e.g. "PO"
  displayLabel: string;        // e.g. "Paracetamol 500 mg tablet (PO)"
};

export interface DrugWithPresentations {
  drug: Drug
  presentations: DrugPresentationView[]
}
