import { describe, expect, it } from 'vitest'
import { computeIndicators, dadosBrutos, indicadores, type AnnualFinancials } from './data'

describe('computeIndicators', () => {
  it('calcula giro, prazos, ciclo de caixa e NCG a partir do saldo final do exercício', () => {
    const fixture: AnnualFinancials = {
      ano: 2001,
      receitaLiquida: 1000,
      cmv: 500,
      estoques: 100,
      contasAReceber: 80,
      fornecedores: 150,
      fluxoCaixaOperacional: 120,
      ebit: null,
      lucroLiquido: null,
      patrimonioLiquido: null,
      ativoTotal: null,
      dividaBruta: null,
      caixaEquivalentes: null,
      despesaFinanceiraLiquida: null,
      depreciacaoAmortizacao: null,
    }

    const result = computeIndicators(fixture)

    expect(result.giroEstoque).toBeCloseTo(5, 6) // 500/100
    expect(result.pmeDias).toBeCloseTo(73, 6) // 100/500*365
    expect(result.pmrDias).toBeCloseTo(29.2, 6) // 80/1000*365
    expect(result.pmpDias).toBeCloseTo(109.5, 6) // 150/500*365
    expect(result.cicloCaixaDias).toBeCloseTo(-7.3, 6) // 73+29.2-109.5
    expect(result.ncg).toBeCloseTo(30, 6) // 80+100-150
    expect(result.ncgPctReceita).toBeCloseTo(3, 6)
    expect(result.fcoPctReceita).toBeCloseTo(12, 6)
  })

  it('retorna null para margem, ROE/ROA/ROIC e endividamento enquanto os dados pendentes não forem preenchidos', () => {
    const fixture: AnnualFinancials = {
      ano: 2001,
      receitaLiquida: 1000,
      cmv: 500,
      estoques: 100,
      contasAReceber: 80,
      fornecedores: 150,
      fluxoCaixaOperacional: 120,
      ebit: null,
      lucroLiquido: null,
      patrimonioLiquido: null,
      ativoTotal: null,
      dividaBruta: null,
      caixaEquivalentes: null,
      despesaFinanceiraLiquida: null,
      depreciacaoAmortizacao: null,
    }

    const result = computeIndicators(fixture)
    expect(result.margemLiquida).toBeNull()
    expect(result.roe).toBeNull()
    expect(result.roa).toBeNull()
    expect(result.roic).toBeNull()
    expect(result.giroAtivo).toBeNull()
    expect(result.alavancagemFinanceira).toBeNull()
    expect(result.dividaLiquida).toBeNull()
    expect(result.ebitda).toBeNull()
    expect(result.dividaLiquidaSobreEbitda).toBeNull()
    expect(result.coberturaJuros).toBeNull()
  })

  it('calcula margem, ROE, ROA, ROIC e endividamento quando os dados estão preenchidos', () => {
    const fixture: AnnualFinancials = {
      ano: 2001,
      receitaLiquida: 1200,
      cmv: 720,
      estoques: 100,
      contasAReceber: 80,
      fornecedores: 150,
      fluxoCaixaOperacional: 120,
      ebit: 240,
      lucroLiquido: 120,
      patrimonioLiquido: 1000,
      ativoTotal: 2400,
      dividaBruta: 600,
      caixaEquivalentes: 200,
      despesaFinanceiraLiquida: 40,
      depreciacaoAmortizacao: 60,
    }

    const result = computeIndicators(fixture)

    expect(result.margemLiquida).toBeCloseTo(120 / 1200, 6)
    expect(result.roe).toBeCloseTo(120 / 1000, 6)
    expect(result.roa).toBeCloseTo(120 / 2400, 6)
    expect(result.giroAtivo).toBeCloseTo(1200 / 2400, 6)
    expect(result.alavancagemFinanceira).toBeCloseTo(2400 / 1000, 6)

    // capital investido = dívida bruta + PL - caixa = 600+1000-200=1400
    expect(result.roic).toBeCloseTo(240 / 1400, 6)

    // dívida líquida = 600-200=400; EBITDA = 240+60=300
    expect(result.dividaLiquida).toBeCloseTo(400, 6)
    expect(result.ebitda).toBeCloseTo(300, 6)
    expect(result.dividaLiquidaSobreEbitda).toBeCloseTo(400 / 300, 6)
    expect(result.coberturaJuros).toBeCloseTo(240 / 40, 6)
  })
})

describe('indicadores (dados reais CVM — Sendas Distribuidora / Assaí)', () => {
  it('cobre a série contínua de 2020 a 2024', () => {
    expect(indicadores.map((d) => d.ano)).toEqual([2020, 2021, 2022, 2023, 2024])
  })

  it('mantém giro de estoque e prazos em faixas plausíveis', () => {
    for (const d of indicadores) {
      expect(d.giroEstoque).toBeGreaterThan(0)
      expect(d.pmeDias).toBeGreaterThan(0)
      expect(d.pmrDias).toBeGreaterThan(0)
      expect(d.pmpDias).toBeGreaterThan(0)
    }
  })

  it('mostra o salto na NCG em 2022 (conversão das lojas Extra Hiper)', () => {
    const ncg2021 = dadosBrutos.find((d) => d.ano === 2021)!
    const ncg2022 = dadosBrutos.find((d) => d.ano === 2022)!
    const ind2021 = computeIndicators(ncg2021)
    const ind2022 = computeIndicators(ncg2022)
    expect(ind2022.ncg).toBeLessThan(ind2021.ncg)
  })
})
