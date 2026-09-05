import { describe, expect, it } from 'vitest'
import { linearRegression, projectLinear } from './projection'

describe('linearRegression', () => {
  it('recupera exatamente inclinação e intercepto de uma reta perfeita', () => {
    // y = 3x + 2
    const points = [
      { x: 1, y: 5 },
      { x: 2, y: 8 },
      { x: 3, y: 11 },
      { x: 4, y: 14 },
    ]
    const { slope, intercept } = linearRegression(points)
    expect(slope).toBeCloseTo(3, 6)
    expect(intercept).toBeCloseTo(2, 6)
  })
})

describe('projectLinear', () => {
  it('extrapola os próximos anos seguindo a tendência linear', () => {
    const points = [
      { x: 2020, y: 10 },
      { x: 2021, y: 20 },
      { x: 2022, y: 30 },
      { x: 2023, y: 40 },
      { x: 2024, y: 50 },
    ]
    const projected = projectLinear(points, 2)
    expect(projected).toEqual([
      { x: 2025, y: 60 },
      { x: 2026, y: 70 },
    ])
  })
})
