import type { ISODateString, ScheduleKind, UnitCode, FrequencyCode } from './Util'

export interface Prescription {
  id: number
  vid: number
  patientId: number
  notes?: string
  isDispensed: boolean
  dispensedBy?: Number
  dispenserName?: string
  dispensedAt?: ISODateString
  createdBy: number
  creatorName: string
  createdAt: ISODateString
  updatedAt: ISODateString
  lines: PrescriptionLine[]
}

export interface PrescriptionPostData {
  id?: number
  vid: number
  patientId: number
  notes?: string
}

export interface PrescriptionLine {
  id: number
  prescriptionId: number
  drugId: number
  remarks?: string

  doseAmount: number
  doseUnit: UnitCode

  // Frequency code (e.g., 'TDS', 'q8h', 'BD', etc.)
  frequencyCode: FrequencyCode

  prn: boolean // "as needed" / "pro re nata"

  duration: number // in units of durationUnit
  durationUnit: ScheduleKind // "day" | "hour" | "week" | "month"

  totalToDispense: number // Computed by backend (in drug's dispense unit)
  dispenseUnit: UnitCode

  isPacked: boolean
  packedBy?: number
  packerName: string
  packedAt?: ISODateString

  updaterName: string

  drugName: string
  displayStrength: string // e.g., "500 mg/tab" or "250 mg/5 mL"
  displayRoute: string // e.g., "PO"
  displayLabel: string // full text

  allocations: LineAllocation[]
}

export interface PrescriptionLinePostData {
  drugId: number
  remarks?: string

  doseAmount: number
  doseUnit: UnitCode

  frequencyCode: FrequencyCode

  prn: boolean

  duration: number
  durationUnit: ScheduleKind
}

export interface LineAllocation {
  id: number
  lineId: number
  batchLocationId: number
  quantity: number

  createdAt?: ISODateString
  updatedAt?: ISODateString

  batchNumber: string
  location: string
  expiryDate: ISODateString
}

export interface SetAllocationsPostData {
  allocations: {
    batchLocationId: number
    quantity: number
  }[]
}
