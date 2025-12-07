import { http } from '@/shared/api/http'
import type { BatchDetail, BatchPostData, DrugBatchLocation } from '../types/Batch'

export async function listAllBatches() {
  const { data } = await http.get<BatchDetail[]>(`/pharmacy/batches`)
  return data
}

export async function createBatch(drugId: number, batchPostData: BatchPostData) {
  const { data } = await http.post<BatchDetail>(`/pharmacy/drugs/${drugId}/batches`, batchPostData)
  return data
}

export async function updateBatch(batchId: number, updatedBatch: BatchPostData) {
  const { data } = await http.patch<BatchDetail>(`/pharmacy/batches/${batchId}`, updatedBatch)
  return data
}

export async function deleteBatch(batchId: number) {
  const { data } = await http.delete<BatchDetail>(`/pharmacy/batches/${batchId}`)
  return data
}

export async function createBatchLocation(batchId: number, newBatchLocation: DrugBatchLocation) {
  const { data } = await http.post<DrugBatchLocation>(
    `/pharmacy/batches/${batchId}/locations`,
    newBatchLocation
  )
  return data
}

export async function updateBatchLocation(
  locationId: number,
  updatedBatchLocation: Omit<DrugBatchLocation, 'id' | 'batchId'>
) {
  const { data } = await http.patch<DrugBatchLocation>(
    `/pharmacy/locations/${locationId}`,
    updatedBatchLocation
  )
  return data
}

export async function deleteBatchLocation(locationId: number) {
  const { data } = await http.delete<DrugBatchLocation>(`/pharmacy/locations/${locationId}`)
  return data
}
