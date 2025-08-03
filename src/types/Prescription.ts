export interface Prescription {
    id?: number;
    vid?: number;
    patientId?: number;
    notes?: string;
    prescribedDrugs: DrugPrescription[]
}

export interface DrugPrescription {
    id: number
    drugId: number;
    quantity: number;
    remarks: string;
    batches: PrescriptionBatchItem[];
}

export interface PrescriptionBatchItem {
    id: number;
    batchId: number;
    quantity: number
}
