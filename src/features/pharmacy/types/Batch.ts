import type { DrugPresentationView } from "./Drug"
import type { ISODateString, UnitCode } from "./Util"

// Batch = one lot for a presentation. Quantity is in the presentation’s DispenseUnit.
export interface DrugBatch {
  id: number
  presentationId: number
  batchNumber: string
  expiryDate: ISODateString
  supplier?: string
  quantity: number
  createdAt?: ISODateString
  updatedAt?: ISODateString
}

export interface DrugBatchLocation {
	id: number
	batchId: number
	location: string
	quantity: number
	createdAt?: ISODateString
	updatedAt?: ISODateString
}

export interface BatchPostData {
	batch: Omit<DrugBatch, 'id' | 'presentationId' | 'quantity'>
	locations: Omit<DrugBatchLocation, 'id' | 'batchId'>[]
}


export type BatchDetail =  DrugBatch & {
	dispenseUnit: UnitCode
	expirySortKey: string
	batchLocations: DrugBatchLocation[]
}

export interface PresentationStock {
	presentation: DrugPresentationView
	batches: BatchDetail[]
	totalQty: number
}
