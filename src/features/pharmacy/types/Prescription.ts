import type { ISODateString, ScheduleKind, UnitCode } from "./Util"

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
    presentationId: number
    remarks?: string

    doseAmount: number
    doseUnit: UnitCode

    // Periodic schedule model:
	// periods = ceil(duration / everyN); doses = periods * frequencyPerSchedule
	// Examples:
	//  - TID x 7 days        → kind=day,  everyN=1, freq=3,  duration=7
	//  - q8h x 5 days        → kind=hour, everyN=8, freq=1,  duration=120
	//  - every other day x14 → kind=day,  everyN=2, freq=1,  duration=14
	//  - weekly x 4 weeks    → kind=week, everyN=1, freq=1,  duration=4
    scheduleKind: ScheduleKind // "hour" | "day" | "week" | "month"
    everyN: number
    frequencyPerSchedule: number // administrations per schedule period
    duration: number // in units of scheduleKind

    totalToDispense: number // Computed by backend (in presentation’s dispense unit)
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
    presentationId: number
    remarks?: string

    doseAmount: number
    doseUnit: UnitCode

    scheduleKind: ScheduleKind // "hour" | "day" | "week" | "month"
    everyN: number
    frequencyPerSchedule: number // administrations per schedule period
    duration: number

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
