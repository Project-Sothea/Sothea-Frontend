import { http } from '@/shared/api/http'
import type { BatchDetail, BatchPostData, DrugBatchLocation } from '../types/Batch'

/** Fetch every drug batch across all drugs. */
export async function listAllBatches() {
  const { data } = await http.get<BatchDetail[]>(`/pharmacy/batches`)
  return data
}

/** Add a new batch for the specified drug. */
export async function createBatch(drugId: number, batchPostData: BatchPostData) {
  const { data } = await http.post<BatchDetail>(`/pharmacy/drugs/${drugId}/batches`, batchPostData)
  return data
}

/** Update an existing batch's details (e.g. expiry date, quantity). */
export async function updateBatch(batchId: number, updatedBatch: BatchPostData) {
  const { data } = await http.patch<BatchDetail>(`/pharmacy/batches/${batchId}`, updatedBatch)
  return data
}

/** Delete a batch. */
export async function deleteBatch(batchId: number) {
  const { data } = await http.delete<BatchDetail>(`/pharmacy/batches/${batchId}`)
  return data
}

/** Add a storage location entry to a batch (e.g. shelf/bin). */
export async function createBatchLocation(batchId: number, newBatchLocation: DrugBatchLocation) {
  const { data } = await http.post<DrugBatchLocation>(
    `/pharmacy/batches/${batchId}/locations`,
    newBatchLocation
  )
  return data
}

/** Update a storage location entry. */
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

/** Remove a storage location entry from a batch. */
export async function deleteBatchLocation(locationId: number) {
  const { data } = await http.delete<DrugBatchLocation>(`/pharmacy/locations/${locationId}`)
  return data
}
