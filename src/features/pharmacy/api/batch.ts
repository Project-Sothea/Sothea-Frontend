import { http } from "@/shared/api/http"
import type { BatchDetail, BatchPostData, DrugBatch, DrugBatchLocation, PresentationStock } from "../types/Batch"

export async function listAllBatches() {
  const { data } = await http.get<BatchDetail[]>(`/pharmacy/presentations/batches`)
  return data
}

export async function listBatchesByPresentation(presentationId: number) {
  const { data } = await http.get<BatchDetail[]>(`/pharmacy/presentations/${presentationId}/batches`)
  return data
}

export async function createBatch(presentationId: number, batchPostData: BatchPostData) {
  const { data } = await http.post<BatchDetail>(`/pharmacy/presentations/${presentationId}/batches`, batchPostData)
  return data
}

export async function getBatch(batchId: number) {
  const { data } = await http.get<BatchDetail>(`/pharmacy/batches/${batchId}`)
  return data
}

export async function updateBatch(batchId: number, updatedBatch: DrugBatch) {
  const { data } = await http.patch<BatchDetail>(`/pharmacy/batches/${batchId}`, updatedBatch)
  return data
}

export async function deleteBatch(batchId: number) {
  const { data } = await http.delete<BatchDetail>(`/pharmacy/batches/${batchId}`)
  return data
}

export async function listBatchLocations(batchId: number) {
  const { data } = await http.get<DrugBatchLocation[]>(`/pharmacy/batches/${batchId}/locations`)
  return data
}

export async function createBatchLocation(batchId: number, newBatchLocation: DrugBatchLocation) {
  const { data } = await http.post<DrugBatchLocation>(`/pharmacy/batches/${batchId}/locations`, newBatchLocation)
  return data
}

export async function updateBatchLocation(locationId: number, updatedBatchLocation: DrugBatchLocation) {
  const { data } = await http.patch<DrugBatchLocation>(`/pharmacy/locations/${locationId}`, updatedBatchLocation)
  return data
}

export async function deleteBatchLocation(locationId: number) {
  const { data } = await http.delete<DrugBatchLocation>(`/pharmacy/locations/${locationId}`)
  return data
}
