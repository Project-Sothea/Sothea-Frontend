export interface Prescription {
    id?: number;
    vid?: number;
    patientId?: number;
    notes?: string;
    prescribedDrugs: DrugPrescription[]
    isDispensed?: boolean;
    dispenserName?: string;
}

export interface DrugPrescription {
    id?: number
    drugId: number;
    remarks: string;
    requestedQty: number;
    isPacked?: boolean;
    packerName?: string;
    batches: PrescriptionBatchItem[];
}

export interface PrescriptionBatchItem {
    id?: number;
    batchLocationId: number;
    quantity: number
}
