// Os quatro blocos temáticos do panorama.
//
// Cada métrica devolve `number | null`. `null` significa que a base daquela
// empresa não permite calcular o indicador — nunca uma estimativa. A interface
// desenha esses casos como "sem dado" e mostra o que falta extrair.

import type { AnnualIndicators } from './data'
import { formatDias, formatPct, formatX } from './format'

export interface MetricaPainel {
  key: string
  label: string
  valor: (i: AnnualIndicators) => number | null
  format: (v: number) => string
  menorMelhor: boolean
  /** Fórmula em notação curta, mostrada no popover de ajuda. */
  formula: string
  /** Frase "quanto maior/menor o indicador, ..." mostrada no popover de ajuda. */
  explicacao: string
  /**
   * Indicador sem direção normativa única entre as três empresas (ex.: PMP,
   * onde "maior é melhor" vale para uma companhia aberta mas não para uma
   * cooperativa pagando o próprio associado). Quando `true`, a interface não
   * rotula "maior/menor é melhor" nem destaca um "melhor" valor.
   */
  semJulgamento?: boolean
  /** O que falta para completar o indicador nas empresas sem dado. */
  faltaDado?: string
}

export interface GrupoPainel {
  id: string
  titulo: string
  descricao: string
  metricas: MetricaPainel[]
}

const formatToneladas = (v: number) =>
  `${(v / 1_000_000).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} Mt`

const formatMilhoes = (v: number) =>
  `R$ ${(v / 1_000).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} mi`

const FALTA_CAPEX =
  'Disponível só para a C.Vale. Para BRF e Copacol falta extrair a linha de aquisição de imobilizado e intangível das atividades de investimento da DFC.'

const FALTA_OPERACIONAL =
  'Disponível para a C.Vale em 2022-2025, dos Relatórios Anuais. BRF e Copacol dependem de relatórios operacionais que não estão nesta base (a Copacol só tem esse dado em 2025, fora da faixa comparável para BRF).'

const FALTA_RESULTADO_LIQUIDO =
  'Disponível só para a BRF, extraído da DFP (DRE, conta 3.11). Para Copacol e C.Vale falta extrair a linha de Sobras/Perdas (ou Resultado Líquido) do exercício dos relatórios financeiros.'

export const grupos: GrupoPainel[] = [
  {
    id: 'eficiencia',
    titulo: 'Eficiência Operacional',
    descricao: 'Quanta produção e quanta receita a estrutura instalada consegue gerar.',
    metricas: [
      {
        key: 'giroAtivo',
        label: 'Giro do Ativo',
        valor: (i) => i.giroAtivo,
        format: formatX,
        menorMelhor: false,
        formula: 'Receita Líquida ÷ Ativo Total',
        explicacao: 'Quanto maior o giro do ativo, mais receita a empresa gera para cada real investido em ativos.',
      },
      {
        key: 'volume',
        label: 'Volume produzido / recebido',
        valor: (i) => i.volumeToneladas,
        format: formatToneladas,
        menorMelhor: false,
        formula: 'Volume físico recebido ou produzido no exercício (toneladas)',
        explicacao: 'Quanto maior o volume, maior a escala física da operação no ano.',
        faltaDado: FALTA_OPERACIONAL,
      },
      {
        key: 'produtividade',
        label: 'Receita por funcionário',
        valor: (i) => i.receitaPorFuncionario,
        format: formatMilhoes,
        menorMelhor: false,
        formula: 'Receita Líquida ÷ Número de funcionários',
        explicacao: 'Quanto maior a receita por funcionário, mais receita cada colaborador gera, em média.',
        faltaDado: FALTA_OPERACIONAL,
      },
      {
        key: 'capacidade',
        label: 'Utilização da capacidade de armazenagem',
        valor: (i) => i.utilizacaoCapacidade,
        format: formatX,
        menorMelhor: false,
        formula: 'Volume recebido ÷ Capacidade estática de armazenagem',
        explicacao: 'Quanto maior a utilização, mais perto do limite físico a capacidade de armazenagem está operando.',
        faltaDado: FALTA_OPERACIONAL,
      },
      {
        key: 'margemOperacional',
        label: 'Margem operacional',
        valor: (i) => i.margemOperacional,
        format: formatPct,
        menorMelhor: false,
        formula: 'EBIT ÷ Receita Líquida',
        explicacao: 'Quanto maior a margem operacional, maior a parcela da receita que sobra depois dos custos e despesas operacionais.',
      },
    ],
  },
  {
    id: 'capital-de-giro',
    titulo: 'Capital de Giro',
    descricao: 'Quantos dias de caixa a operação prende entre pagar o fornecedor e receber do cliente.',
    metricas: [
      {
        key: 'cicloFinanceiroDias',
        label: 'Ciclo financeiro',
        valor: (i) => i.cicloFinanceiroDias,
        format: formatDias,
        menorMelhor: true,
        formula: 'PME + PMR − PMP',
        explicacao: 'Quanto menor o ciclo financeiro, menos dias de caixa próprio a operação prende entre pagar o fornecedor e receber do cliente — negativo significa que o fornecedor financia o giro.',
      },
      {
        key: 'pmrDias',
        label: 'PMR — prazo médio de recebimento',
        valor: (i) => i.pmrDias,
        format: formatDias,
        menorMelhor: true,
        formula: '(Contas a Receber ÷ Receita Líquida) × 365',
        explicacao: 'Quanto menor o PMR, mais rápido a empresa recebe dos clientes depois da venda.',
      },
      {
        key: 'pmeDias',
        label: 'PME — prazo médio de estocagem',
        valor: (i) => i.pmeDias,
        format: formatDias,
        menorMelhor: true,
        formula: '(Estoques ÷ CMV) × 365',
        explicacao: 'Quanto menor o PME, menos tempo a mercadoria fica parada no estoque antes de ser vendida.',
      },
      {
        key: 'pmpDias',
        label: 'PMP — prazo médio de pagamento',
        valor: (i) => i.pmpDias,
        format: formatDias,
        menorMelhor: false,
        semJulgamento: true,
        formula: '(Fornecedores ÷ CMV) × 365',
        explicacao: 'Mede quantos dias a empresa demora para pagar seus fornecedores. Não há direção universalmente melhor aqui: numa companhia aberta, um PMP maior costuma liberar caixa; numa cooperativa, o "fornecedor" é em boa parte o próprio associado, e demorar mais para pagá-lo não é um resultado a comemorar.',
      },
      {
        key: 'giroEstoque',
        label: 'Giro do estoque',
        valor: (i) => i.giroEstoque,
        format: formatX,
        menorMelhor: false,
        formula: 'CMV ÷ Estoques',
        explicacao: 'Quanto maior o giro do estoque, mais vezes por ano o estoque é vendido e reposto.',
      },
    ],
  },
  {
    id: 'rentabilidade',
    titulo: 'Rentabilidade',
    descricao: 'Quanto sobra da receita e quanto o capital investido rende.',
    metricas: [
      {
        key: 'margemLiquida',
        label: 'Margem líquida',
        valor: (i) => i.margemLiquida,
        format: formatPct,
        menorMelhor: false,
        formula: 'Resultado Líquido ÷ Receita Líquida',
        explicacao: 'Quanto maior a margem líquida, maior a parcela da receita que sobra depois de juros, impostos e todas as despesas — o que efetivamente sobrou no exercício.',
        faltaDado: FALTA_RESULTADO_LIQUIDO,
      },
      {
        key: 'margemEbitda',
        label: 'Margem EBITDA',
        valor: (i) => i.margemEbitda,
        format: formatPct,
        menorMelhor: false,
        formula: 'EBITDA ÷ Receita Líquida',
        explicacao: 'Quanto maior a margem EBITDA, maior a geração de caixa operacional para cada real de receita, antes de juros, impostos, depreciação e amortização.',
      },
      {
        key: 'roe',
        label: 'ROE',
        valor: (i) => i.roe,
        format: formatPct,
        menorMelhor: false,
        formula: 'Resultado Líquido ÷ Patrimônio Líquido',
        explicacao: 'Quanto maior o ROE, maior o retorno gerado sobre o capital próprio — o que sobrou para quem é dono do negócio (acionista ou cooperado).',
        faltaDado: FALTA_RESULTADO_LIQUIDO,
      },
      {
        key: 'roa',
        label: 'ROA',
        valor: (i) => i.roa,
        format: formatPct,
        menorMelhor: false,
        formula: 'Resultado Líquido ÷ Ativo Total',
        explicacao: 'Quanto maior o ROA, maior o retorno gerado sobre todo o ativo da empresa, incluindo a parte financiada por terceiros.',
        faltaDado: FALTA_RESULTADO_LIQUIDO,
      },
      {
        key: 'roic',
        label: 'ROIC',
        valor: (i) => i.roic,
        format: formatPct,
        menorMelhor: false,
        formula: 'EBIT × (1 − alíquota efetiva) ÷ (Dívida Líquida + Patrimônio Líquido)',
        explicacao: 'Quanto maior o ROIC, maior o retorno gerado sobre o capital investido na operação.',
      },
    ],
  },
  {
    id: 'investimento',
    titulo: 'Investimento e Estrutura',
    descricao: 'Quanto vai para o ativo fixo e como o balanço é financiado.',
    metricas: [
      {
        key: 'capexReceita',
        label: 'Intensidade do CAPEX',
        valor: (i) => i.capexSobreReceita,
        format: formatPct,
        menorMelhor: false,
        formula: 'CAPEX ÷ Receita Líquida',
        explicacao: 'Quanto maior a intensidade do CAPEX, maior a fatia da receita reinvestida em ativo fixo no ano.',
        faltaDado: FALTA_CAPEX,
      },
      {
        key: 'capexDepreciacao',
        label: 'CAPEX / Depreciação',
        valor: (i) => i.capexSobreDepreciacao,
        format: formatX,
        menorMelhor: false,
        formula: 'CAPEX ÷ Depreciação e Amortização',
        explicacao: 'Quanto maior o índice, mais a empresa investe além do necessário para repor o desgaste do ativo — acima de 1x indica expansão, não só manutenção.',
        faltaDado: FALTA_CAPEX,
      },
      {
        key: 'alavancagem',
        label: 'Índice de Alavancagem Financeira',
        valor: (i) => i.alavancagem,
        format: formatX,
        menorMelhor: true,
        formula: 'Dívida Líquida ÷ EBITDA',
        explicacao: 'Quanto menor a alavancagem financeira, menos anos de geração de caixa operacional seriam necessários para quitar a dívida líquida.',
      },
      {
        key: 'endividamento',
        label: 'Índice de Endividamento Geral',
        valor: (i) => i.endividamento,
        format: formatPct,
        menorMelhor: true,
        formula: '(Ativo Total − Patrimônio Líquido) ÷ Ativo Total',
        explicacao: 'Quanto menor o endividamento geral, menor a fatia do ativo total financiada por capital de terceiros.',
      },
    ],
  },
]
