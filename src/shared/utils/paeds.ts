import { parseDob } from './age'
import heightCsv from '../data/who-height-for-age.csv?raw'
import weightCsv from '../data/who-weight-for-age.csv?raw'

type Gender = 'M' | 'F'
type Lms = { l: number; m: number; s: number }
type GrowthTable = Record<Gender, Map<number, Lms>>

function parseTable(csv: string): GrowthTable {
  const table: GrowthTable = { M: new Map(), F: new Map() }
  for (const row of csv.trim().split(/\r?\n/).slice(1)) {
    const [gender, day, l, m, s] = row.split(',')
    table[gender as Gender].set(Number(day), { l: Number(l), m: Number(m), s: Number(s) })
  }
  return table
}

// Bundled locally and parsed once; no network request is needed.
const heightTable = parseTable(heightCsv)
const weightTable = parseTable(weightCsv)

/** Standard normal CDF (Abramowitz & Stegun 26.2.17, error < 7.5e-8). */
function normalCdf(z: number): number {
  if (z === 0) return 0.5
  const t = 1 / (1 + 0.2316419 * Math.abs(z))
  const tail =
    (Math.exp(-0.5 * z * z) / Math.sqrt(2 * Math.PI)) *
    t *
    (0.31938153 +
      t * (-0.356563782 + t * (1.781477937 + t * (-1.821255978 + t * 1.330274429))))
  return z < 0 ? tail : 1 - tail
}

function calculatePercentile(
  table: GrowthTable,
  dobInput: Date | string | null | undefined,
  gender: Gender,
  measurement: number,
  visitDateInput: Date | string | null | undefined
): number | null {
  const dob = parseDob(dobInput)
  let visitDate = parseDob(visitDateInput)
  if (!dob || !visitDate || !Number.isFinite(measurement) || measurement <= 0 || !table[gender]) {
    return null
  }

  if (visitDate < dob) {
    visitDate = new Date();
  }

  // Calendar dates avoid time-of-day and daylight-saving shifts in age.
  const ageInDays = Math.round(
    (Date.UTC(visitDate.getFullYear(), visitDate.getMonth(), visitDate.getDate()) -
      Date.UTC(dob.getFullYear(), dob.getMonth(), dob.getDate())) / 86_400_000
  )
  const lms = table[gender].get(ageInDays)
  if (!lms) return null // WHO daily reference covers days 0–1856 inclusive.

  const { l, m, s } = lms
  const logRatio = Math.log(measurement / m)
  const z = l === 0 ? logRatio / s : Math.expm1(l * logRatio) / (l * s)
  return Math.max(0, Math.min(100, 100 * normalCdf(z)))
}

/**
 * WHO length/height-for-age percentile (0–100), in centimetres.
 * Use recumbent length through day 730 and standing height from day 731.
 * Age is measured at the supplied visit date.
 * Returns null for invalid inputs or ages outside the WHO daily reference.
 */
export function calculatePaedsHeightPercentile(
  dobInput: Date | string | null | undefined,
  gender: Gender,
  height: number,
  visitDate: Date | string | null | undefined
): number | null {
  return calculatePercentile(heightTable, dobInput, gender, height, visitDate)
}

/** WHO weight-for-age percentile (0–100) at the visit date, with weight in kilograms. */
export function calculatePaedsWeightPercentile(
  dobInput: Date | string | null | undefined,
  gender: Gender,
  weight: number,
  visitDate: Date | string | null | undefined
): number | null {
  return calculatePercentile(weightTable, dobInput, gender, weight, visitDate)
}
