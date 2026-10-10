import { afterEach, describe, expect, it, vi } from 'vitest'
import { getPrescriptionByVisit } from '../prescription'
import { http } from '@/shared/api/http'

vi.mock('@/shared/api/http', () => ({ http: { get: vi.fn() } }))
afterEach(() => vi.clearAllMocks())

describe('prescriptions by visit', () => {
  it('returns null only when no header exists', async () => {
    vi.mocked(http.get).mockResolvedValue({ data: [] })
    expect(await getPrescriptionByVisit(1, 2)).toBeNull()
  })
  it('returns the existing header', async () => {
    vi.mocked(http.get).mockResolvedValue({ data: [{ id: 7 }] })
    expect(await getPrescriptionByVisit(1, 2)).toEqual({ id: 7 })
  })
  it('reports duplicates rather than pretending the visit is empty', async () => {
    vi.mocked(http.get).mockResolvedValue({ data: [{ id: 7 }, { id: 8 }] })
    await expect(getPrescriptionByVisit(1, 2)).rejects.toThrow('Multiple prescriptions')
  })
})
