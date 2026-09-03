import { describe, expect, it } from 'vitest'
import { deflate, indicesDisponiveis, ipcaDisponivel } from './inflacao'

describe('deflate', () => {
  it('retorna o próprio valor quando a origem é o ano-base', () => {
    expect(deflate(1000, 2024, 2024, {})).toBe(1000)
  })

  it('compõe a inflação anual entre a origem e o ano-base', () => {
    const indices = { 2023: 0.1, 2024: 0.2 }
    // 1000 * 1.1 * 1.2 = 1320
    expect(deflate(1000, 2022, 2024, indices)).toBeCloseTo(1320, 6)
  })

  it('retorna null quando falta algum índice no caminho', () => {
    const indices = { 2023: 0.1, 2024: null }
    expect(deflate(1000, 2022, 2024, indices)).toBeNull()
  })

  it('retorna null quando a origem é posterior ao ano-base', () => {
    expect(deflate(1000, 2025, 2024, {})).toBeNull()
  })
})

describe('indicesDisponiveis / ipcaDisponivel', () => {
  it('é falso enquanto os índices reais não forem preenchidos (estado atual do projeto)', () => {
    expect(ipcaDisponivel([2020, 2021, 2022, 2023, 2024])).toBe(false)
  })

  it('é verdadeiro quando todos os índices necessários estão presentes', () => {
    const indices = { 2021: 0.05, 2022: 0.05 }
    expect(indicesDisponiveis([2021, 2022], 2022, indices)).toBe(true)
  })
})
