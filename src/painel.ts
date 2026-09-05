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
  'Disponível para a C.Vale em 2022-2024, dos Relatórios Anuais. BRF e Copacol dependem de relatórios operacionais que não estão nesta base (a Copacol só tem esse dado em 2025, fora da faixa comparável).'

export const grupos: GrupoPainel[] = [
  {
    id: 'eficiencia',
    titulo: 'Eficiência Operacional',
    descricao: 'Quanta produção e quanta receita a estrutura instalada consegue gerar.',
    metricas: [
      { key: 'giroAtivo', label: 'Giro do Ativo', valor: (i) => i.giroAtivo, format: formatX, menorMelhor: false },
      {
        key: 'volume',
        label: 'Volume produzido / recebido',
        valor: (i) => i.volumeToneladas,
        format: formatToneladas,
        menorMelhor: false,
        faltaDado: FALTA_OPERACIONAL,
      },
      {
        key: 'produtividade',
        label: 'Receita por funcionário',
        valor: (i) => i.receitaPorFuncionario,
        format: formatMilhoes,
        menorMelhor: false,
        faltaDado: FALTA_OPERACIONAL,
      },
      {
        key: 'capacidade',
        label: 'Utilização da capacidade de armazenagem',
        valor: (i) => i.utilizacaoCapacidade,
        format: formatX,
        menorMelhor: false,
        faltaDado: FALTA_OPERACIONAL,
      },
    ],
  },
  {
    id: 'capital-de-giro',
    titulo: 'Capital de Giro',
    descricao: 'Quantos dias de caixa a operação prende entre pagar o fornecedor e receber do cliente.',
    metricas: [
      { key: 'cicloFinanceiroDias', label: 'Ciclo financeiro', valor: (i) => i.cicloFinanceiroDias, format: formatDias, menorMelhor: true },
      { key: 'pmrDias', label: 'PMR — prazo médio de recebimento', valor: (i) => i.pmrDias, format: formatDias, menorMelhor: true },
      { key: 'pmeDias', label: 'PME — prazo médio de estocagem', valor: (i) => i.pmeDias, format: formatDias, menorMelhor: true },
      { key: 'pmpDias', label: 'PMP — prazo médio de pagamento', valor: (i) => i.pmpDias, format: formatDias, menorMelhor: false },
      { key: 'giroEstoque', label: 'Giro do estoque', valor: (i) => i.giroEstoque, format: formatX, menorMelhor: false },
    ],
  },
  {
    id: 'rentabilidade',
    titulo: 'Rentabilidade',
    descricao: 'Quanto sobra da receita e quanto o capital investido rende.',
    metricas: [
      { key: 'margemOperacional', label: 'Margem operacional', valor: (i) => i.margemOperacional, format: formatPct, menorMelhor: false },
      { key: 'margemEbitda', label: 'Margem EBITDA', valor: (i) => i.margemEbitda, format: formatPct, menorMelhor: false },
      { key: 'roic', label: 'ROIC', valor: (i) => i.roic, format: formatPct, menorMelhor: false },
    ],
  },
  {
    id: 'investimento',
    titulo: 'Investimento e Estrutura',
    descricao: 'Quanto vai para o ativo fixo e como o balanço é financiado.',
    metricas: [
      {
        key: 'capexReceita',
        label: 'CAPEX sobre receita',
        valor: (i) => i.capexSobreReceita,
        format: formatPct,
        menorMelhor: false,
        faltaDado: FALTA_CAPEX,
      },
      {
        key: 'capexDepreciacao',
        label: 'CAPEX sobre depreciação',
        valor: (i) => i.capexSobreDepreciacao,
        format: formatX,
        menorMelhor: false,
        faltaDado: FALTA_CAPEX,
      },
      { key: 'endividamento', label: 'Índice de endividamento', valor: (i) => i.endividamento, format: formatPct, menorMelhor: true },
      { key: 'alavancagem', label: 'Dívida líquida sobre EBITDA', valor: (i) => i.alavancagem, format: formatX, menorMelhor: true },
    ],
  },
]
