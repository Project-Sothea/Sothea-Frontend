import { describe, expect, it } from 'vitest'
import { fmtStrength } from '../Util'
import type { DrugView } from '../Drug'

describe('percentage strengths', () => {
  const drug = (fields: Partial<DrugView>) =>
    ({
      dosageFormCode: 'CREAM',
      displayAsPercentage: true,
      ...fields
    }) as DrugView

  it('normalizes mass units', () => {
    expect(
      fmtStrength(
        drug({ strengthNum: 500, strengthUnitNum: 'mg', strengthDen: 100, strengthUnitDen: 'g' })
      )
    ).toBe('0.5% CREAM')
    expect(
      fmtStrength(
        drug({ strengthNum: 5000, strengthUnitNum: 'mcg', strengthDen: 1, strengthUnitDen: 'g' })
      )
    ).toBe('0.5% CREAM')
  })
  it('normalizes mass per volume and volume ratios', () => {
    expect(
      fmtStrength(
        drug({ strengthNum: 500, strengthUnitNum: 'mg', strengthDen: 100, strengthUnitDen: 'mL' })
      )
    ).toBe('0.5% CREAM')
    expect(
      fmtStrength(
        drug({ strengthNum: 5, strengthUnitNum: 'mL', strengthDen: 1, strengthUnitDen: 'L' })
      )
    ).toBe('0.5% CREAM')
  })
  it('keeps unsupported units and zero denominators as ratios', () => {
    expect(
      fmtStrength(
        drug({ strengthNum: 500, strengthUnitNum: 'IU', strengthDen: 100, strengthUnitDen: 'g' })
      )
    ).toBe('500 IU / 100 g CREAM')
    expect(
      fmtStrength(
        drug({ strengthNum: 5, strengthUnitNum: 'g', strengthDen: 0, strengthUnitDen: 'g' })
      )
    ).toBe('5 g / 0 g CREAM')
  })
})
