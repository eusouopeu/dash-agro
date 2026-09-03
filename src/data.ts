// Dados reais extraídos das Demonstrações Financeiras Padronizadas (DFP)
// individuais de Sendas Distribuidora S.A. (Assaí Atacadista, B3: ASAI3),
// publicadas pela CVM (https://dados.cvm.gov.br) — CD_CVM 025372.
//
// A CVM só recebe demonstrações INDIVIDUAIS (não consolidadas) dessa
// empresa em todo o período 2020-2024; por isso todos os anos usam a mesma
// base (individual), para manter a série comparável.
//
// Valores em R$ mil, exatamente como reportados (ORDEM_EXERC = "ÚLTIMO" do
// exercício findo em 31/12 de cada ano, exceto 2020, que veio como
// "PENÚLTIMO" no arquivo de referência de 2021 — mesma fonte, mesma conta).

export interface AnnualFinancials {
  ano: number
  receitaLiquida: number // 3.01 Receita de Venda de Bens e/ou Serviços
  cmv: number // 3.02 Custo dos Bens e/ou Serviços Vendidos (valor absoluto)
  estoques: number // 1.01.04 Estoques
  contasAReceber: number // 1.01.03 Contas a Receber
  fornecedores: number // 2.01.02 Fornecedores
  fluxoCaixaOperacional: number // 6.01 Caixa Líquido Atividades Operacionais
  /**
   * Dados pendentes para rentabilidade e estrutura de capital (ROE, ROA,
   * ROIC, dívida líquida/EBITDA, cobertura de juros — ver
   * `computeIndicators`). TODO: preencher com valores reais da DFP/CVM
   * (Demonstração de Resultado e Balanço Patrimonial individuais de Sendas
   * Distribuidora). Enquanto `null`, os indicadores correspondentes
   * aparecem como "dado pendente" no dashboard.
   */
  ebit: number | null
  lucroLiquido: number | null
  patrimonioLiquido: number | null
  ativoTotal: number | null
  dividaBruta: number | null
  caixaEquivalentes: number | null
  despesaFinanceiraLiquida: number | null
  depreciacaoAmortizacao: number | null
}

const PENDENTE = {
  ebit: null,
  lucroLiquido: null,
  patrimonioLiquido: null,
  ativoTotal: null,
  dividaBruta: null,
  caixaEquivalentes: null,
  despesaFinanceiraLiquida: null,
  depreciacaoAmortizacao: null,
} as const

export const dadosBrutos: AnnualFinancials[] = [
  { ano: 2020, receitaLiquida: 36_043_000, cmv: 30_129_000, estoques: 3_739_000, contasAReceber: 216_000, fornecedores: 5_058_000, fluxoCaixaOperacional: 3_545_000, ...PENDENTE },
  { ano: 2021, receitaLiquida: 41_898_000, cmv: 34_753_000, estoques: 4_380_000, contasAReceber: 324_000, fornecedores: 5_942_000, fluxoCaixaOperacional: 3_272_000, ...PENDENTE },
  { ano: 2022, receitaLiquida: 54_520_000, cmv: 45_557_000, estoques: 6_467_000, contasAReceber: 622_000, fornecedores: 12_999_000, fluxoCaixaOperacional: 5_144_000, ...PENDENTE },
  { ano: 2023, receitaLiquida: 66_503_000, cmv: 55_682_000, estoques: 6_664_000, contasAReceber: 1_199_000, fornecedores: 12_110_000, fluxoCaixaOperacional: 5_963_000, ...PENDENTE },
  { ano: 2024, receitaLiquida: 73_819_000, cmv: 61_598_000, estoques: 7_127_000, contasAReceber: 2_210_000, fornecedores: 11_647_000, fluxoCaixaOperacional: 4_932_000, ...PENDENTE },
]

export interface AnnualIndicators extends AnnualFinancials {
  giroEstoque: number // CMV / Estoques (saldo final)
  pmeDias: number // Estoques / CMV * 365 — Prazo Médio de Estocagem (= cobertura de estoque)
  pmrDias: number // Contas a Receber / Receita Líquida * 365
  pmpDias: number // Fornecedores / CMV * 365
  cicloCaixaDias: number // PME + PMR - PMP
  ncg: number // (Contas a Receber + Estoques) - Fornecedores
  ncgPctReceita: number
  fcoPctReceita: number
  /** Rentabilidade e estrutura de capital — `null` enquanto os dados de AnnualFinancials estiverem pendentes. */
  margemLiquida: number | null
  roe: number | null
  roa: number | null
  /** ROIC aproximado (pré-imposto): EBIT / Capital Investido (saldo final). */
  roic: number | null
  giroAtivo: number | null
  alavancagemFinanceira: number | null
  dividaLiquida: number | null
  ebitda: number | null
  dividaLiquidaSobreEbitda: number | null
  coberturaJuros: number | null
}

function divOrNull(a: number | null, b: number | null): number | null {
  return a === null || b === null || b === 0 ? null : a / b
}

export function computeIndicators(d: AnnualFinancials): AnnualIndicators {
  const pmeDias = (d.estoques / d.cmv) * 365
  const pmrDias = (d.contasAReceber / d.receitaLiquida) * 365
  const pmpDias = (d.fornecedores / d.cmv) * 365
  const ncg = d.contasAReceber + d.estoques - d.fornecedores

  const margemLiquida = divOrNull(d.lucroLiquido, d.receitaLiquida)
  const roe = divOrNull(d.lucroLiquido, d.patrimonioLiquido)
  const roa = divOrNull(d.lucroLiquido, d.ativoTotal)
  const giroAtivo = divOrNull(d.receitaLiquida, d.ativoTotal)
  const alavancagemFinanceira = divOrNull(d.ativoTotal, d.patrimonioLiquido)

  const capitalInvestido =
    d.dividaBruta === null || d.patrimonioLiquido === null || d.caixaEquivalentes === null
      ? null
      : d.dividaBruta + d.patrimonioLiquido - d.caixaEquivalentes
  const roic = divOrNull(d.ebit, capitalInvestido)

  const dividaLiquida =
    d.dividaBruta === null || d.caixaEquivalentes === null ? null : d.dividaBruta - d.caixaEquivalentes
  const ebitda = d.ebit === null || d.depreciacaoAmortizacao === null ? null : d.ebit + d.depreciacaoAmortizacao
  const dividaLiquidaSobreEbitda = divOrNull(dividaLiquida, ebitda)
  const coberturaJuros = divOrNull(d.ebit, d.despesaFinanceiraLiquida)

  return {
    ...d,
    giroEstoque: d.cmv / d.estoques,
    pmeDias,
    pmrDias,
    pmpDias,
    cicloCaixaDias: pmeDias + pmrDias - pmpDias,
    ncg,
    ncgPctReceita: (ncg / d.receitaLiquida) * 100,
    fcoPctReceita: (d.fluxoCaixaOperacional / d.receitaLiquida) * 100,
    margemLiquida,
    roe,
    roa,
    roic,
    giroAtivo,
    alavancagemFinanceira,
    dividaLiquida,
    ebitda,
    dividaLiquidaSobreEbitda,
    coberturaJuros,
  }
}

export const indicadores: AnnualIndicators[] = dadosBrutos.map(computeIndicators)

export const ultimoAno = indicadores[indicadores.length - 1]

export const fontes = {
  origem: 'CVM — Dados Abertos, Demonstrações Financeiras Padronizadas (DFP)',
  url: 'https://dados.cvm.gov.br/dados/CIA_ABERTA/DOC/DFP/DADOS/',
  empresa: 'Sendas Distribuidora S.A. (Assaí Atacadista) — CD_CVM 025372, B3: ASAI3',
  base: 'Demonstrações individuais (não consolidadas) — única base disponível para a empresa em todo o período na CVM',
  formulas: [
    'Giro do Estoque = CMV / Estoques (saldo final do exercício)',
    'PME (Prazo Médio de Estocagem) = Estoques / CMV × 365',
    'PMR (Prazo Médio de Recebimento) = Contas a Receber / Receita Líquida × 365',
    'PMP (Prazo Médio de Pagamento) = Fornecedores / CMV × 365',
    'Ciclo de Caixa Operacional = PME + PMR − PMP',
    'NCG (Necessidade de Capital de Giro) = (Contas a Receber + Estoques) − Fornecedores',
    'ROE = Lucro Líquido / Patrimônio Líquido — dado pendente (ver TODO em src/data.ts)',
    'ROA = Lucro Líquido / Ativo Total — dado pendente',
    'ROIC (aprox., pré-imposto) = EBIT / (Dívida Bruta + Patrimônio Líquido − Caixa) — dado pendente',
    'Dívida Líquida / EBITDA e Cobertura de Juros (EBIT / Despesa Financeira) — dados pendentes',
  ],
}
