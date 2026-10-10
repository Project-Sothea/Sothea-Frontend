import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { calculatePaedsHeightPercentile, calculatePaedsWeightPercentile } from '../paeds'

const visitDate = new Date(2026, 9, 10, 12)

function dobAtDay(day: number): Date {
  return new Date(2026, 9, 10 - day, 23)
}

describe('WHO PAEDS percentiles', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date(2035, 0, 1))
  })
  afterEach(() => vi.useRealTimers())

  it('uses the visit date even when today is years later', () => {
    expect(calculatePaedsHeightPercentile(dobAtDay(0), 'M', 49.8842, visitDate)).toBe(50)
    expect(calculatePaedsHeightPercentile(dobAtDay(0), 'F', 49.1477, visitDate)).toBe(50)
    expect(calculatePaedsWeightPercentile(dobAtDay(0), 'M', 3.3464, visitDate)).toBe(50)
    expect(calculatePaedsWeightPercentile(dobAtDay(0), 'F', 3.2322, visitDate)).toBe(50)
  })

  it('matches the normal CDF at height z-scores of +1 and -1', () => {
    expect(calculatePaedsHeightPercentile(dobAtDay(0), 'M', 51.77730539, visitDate)).toBeCloseTo(84.1344746, 4)
    expect(calculatePaedsHeightPercentile(dobAtDay(0), 'M', 47.99109461, visitDate)).toBeCloseTo(15.8655254, 4)
  })

  it('uses the non-linear LMS transformation for weight', () => {
    // WHO newborn boys: L=0.3487, M=3.3464, S=0.14602; z=2.
    expect(calculatePaedsWeightPercentile(dobAtDay(0), 'M', 4.419353800696, visitDate)).toBeCloseTo(97.7249868, 4)
  })

  it('preserves the WHO transition from length to height at days 730/731', () => {
    expect(calculatePaedsHeightPercentile(dobAtDay(730), 'M', 87.8018, visitDate)).toBe(50)
    expect(calculatePaedsHeightPercentile(dobAtDay(731), 'M', 87.1303, visitDate)).toBe(50)
  })

  it('includes day 1856 and rejects unsupported ages', () => {
    expect(calculatePaedsHeightPercentile(dobAtDay(1856), 'M', 110.4969, visitDate)).toBe(50)
    expect(calculatePaedsWeightPercentile(dobAtDay(1856), 'M', 18.4968, visitDate)).toBe(50)
    for (const day of [-1, 1857]) {
      expect(calculatePaedsHeightPercentile(dobAtDay(day), 'M', 100, visitDate)).toBeNull()
      expect(calculatePaedsWeightPercentile(dobAtDay(day), 'F', 15, visitDate)).toBeNull()
    }
  })

  it('rejects invalid dates, genders and measurements', () => {
    for (const calculate of [calculatePaedsHeightPercentile, calculatePaedsWeightPercentile]) {
      for (const dob of [null, undefined, '', 'invalid', new Date(NaN)]) {
        expect(calculate(dob, 'M', 10, visitDate)).toBeNull()
      }
      for (const value of [0, -1, NaN, Infinity, -Infinity]) {
        expect(calculate(dobAtDay(0), 'F', value, visitDate)).toBeNull()
      }
      expect(calculate(dobAtDay(0), 'X' as 'M', 10, visitDate)).toBeNull()
      for (const date of [null, undefined, '', 'invalid', new Date(NaN)]) {
        expect(calculate(dobAtDay(0), 'M', 10, date)).toBeNull()
      }
    }
  })

  it('recalculates age for different visits for the same patient', () => {
    const dob = dobAtDay(0)
    const nextVisit = new Date(2026, 9, 11, 12)
    expect(calculatePaedsHeightPercentile(dob, 'M', 50.0601, nextVisit)).toBe(50)
    expect(calculatePaedsHeightPercentile(dob, 'M', 50.0601, visitDate)).toBeGreaterThan(50)
    expect(calculatePaedsWeightPercentile(dob, 'M', 3.3174, nextVisit)).toBe(50)
    expect(calculatePaedsWeightPercentile(dob, 'M', 3.3174, visitDate)).toBeLessThan(50)
  })
})
