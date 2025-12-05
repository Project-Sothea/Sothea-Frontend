import type { DrugView } from "./Drug"
import type { ISODateString, UnitCode } from "./Util"

// Batch = one lot for a drug. Quantity is in the drug's DispenseUnit.
export interface DrugBatch {
  id: number
  drugId: number
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
	batch: Omit<DrugBatch, 'id' | 'drugId' | 'quantity'>
	locations: Omit<DrugBatchLocation, 'id' | 'batchId'>[]
}


export type BatchDetail =  DrugBatch & {
	dispenseUnit: UnitCode
	expirySortKey: string
	batchLocations: DrugBatchLocation[]
}

export interface DrugStock {
	drug: DrugView
	batches: BatchDetail[]
	totalQty: number
}
