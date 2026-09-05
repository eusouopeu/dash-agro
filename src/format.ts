import {
  ArrowPathIcon,
  ArchiveBoxIcon,
  ClockIcon,
  TruckIcon,
  ArrowsRightLeftIcon,
  ChartBarIcon,
  BanknotesIcon,
  ArrowTrendingUpIcon,
  ShieldExclamationIcon,
} from '@heroicons/react/24/outline'
import type { AnnualIndicators } from './data'

export function formatDias(v: number) {
  return `${v.toFixed(1)} d`
}
export function formatX(v: number) {
  return `${v.toFixed(2)}x`
}
export function formatPct(v: number) {
  return `${(v * 100).toFixed(1)}%`
}
export function formatBi(v: number) {
  return `R$ ${(v / 1_000_000).toLocaleString('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })} bi`
}
/** Delta assinado, sempre com sinal explícito. */
export function formatDelta(v: number, format: (n: number) => string) {
  return `${v >= 0 ? '+' : '−'}${format(Math.abs(v))}`
}

export interface IndicatorRow {
  key: keyof AnnualIndicators
  label: string
  curto: string
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>
  format: (v: number) => string
  menorMelhor: boolean
  semJulgamento?: boolean
  formula: string
  explicacao: string
}

export const ROWS: IndicatorRow[] = [
  {
    key: 'cicloFinanceiroDias',
    label: 'Ciclo Financeiro',
    curto: 'Ciclo',
    icon: ArrowsRightLeftIcon,
    format: formatDias,
    menorMelhor: true,
    formula: 'PME + PMR − PMP',
    explicacao: 'Quanto menor o ciclo financeiro, menos dias de caixa próprio a operação prende entre pagar o fornecedor e receber do cliente — negativo significa que o fornecedor financia o giro.',
  },
  {
    key: 'giroEstoque',
    label: 'Giro do Estoque',
    curto: 'Giro estoque',
    icon: ArrowPathIcon,
    format: formatX,
    menorMelhor: false,
    formula: 'CMV ÷ Estoques',
    explicacao: 'Quanto maior o giro do estoque, mais vezes por ano o estoque é vendido e reposto.',
  },
  {
    key: 'pmeDias',
    label: 'PME — estocagem',
    curto: 'PME',
    icon: ArchiveBoxIcon,
    format: formatDias,
    menorMelhor: true,
    formula: '(Estoques ÷ CMV) × 365',
    explicacao: 'Quanto menor o PME, menos tempo a mercadoria fica parada no estoque antes de ser vendida.',
  },
  {
    key: 'pmrDias',
    label: 'PMR — recebimento',
    curto: 'PMR',
    icon: ClockIcon,
    format: formatDias,
    menorMelhor: true,
    formula: '(Contas a Receber ÷ Receita Líquida) × 365',
    explicacao: 'Quanto menor o PMR, mais rápido a empresa recebe dos clientes depois da venda.',
  },
  {
    key: 'pmpDias',
    label: 'PMP — pagamento',
    curto: 'PMP',
    icon: TruckIcon,
    format: formatDias,
    menorMelhor: false,
    semJulgamento: true,
    formula: '(Fornecedores ÷ CMV) × 365',
    explicacao: 'Mede quantos dias a empresa demora para pagar seus fornecedores. Não há direção universalmente melhor: numa companhia aberta, um PMP maior costuma liberar caixa; numa cooperativa, o "fornecedor" é em boa parte o próprio associado, e demorar mais para pagá-lo não é um resultado a comemorar.',
  },
  {
    key: 'giroAtivo',
    label: 'Giro do Ativo',
    curto: 'Giro ativo',
    icon: ChartBarIcon,
    format: formatX,
    menorMelhor: false,
    formula: 'Receita Líquida ÷ Ativo Total',
    explicacao: 'Quanto maior o giro do ativo, mais receita a empresa gera para cada real investido em ativos.',
  },
  {
    key: 'margemEbitda',
    label: 'Margem EBITDA',
    curto: 'Marg. EBITDA',
    icon: BanknotesIcon,
    format: formatPct,
    menorMelhor: false,
    formula: 'EBITDA ÷ Receita Líquida',
    explicacao: 'Quanto maior a margem EBITDA, maior a geração de caixa operacional para cada real de receita, antes de juros, impostos, depreciação e amortização.',
  },
  {
    key: 'roic',
    label: 'ROIC',
    curto: 'ROIC',
    icon: ArrowTrendingUpIcon,
    format: formatPct,
    menorMelhor: false,
    formula: 'EBIT × (1 − alíquota efetiva) ÷ (Dívida Líquida + Patrimônio Líquido)',
    explicacao: 'Quanto maior o ROIC, maior o retorno gerado sobre o capital investido na operação.',
  },
  {
    key: 'alavancagem',
    label: 'Alavancagem',
    curto: 'Dív.Líq./EBITDA',
    icon: ShieldExclamationIcon,
    format: formatX,
    menorMelhor: true,
    formula: 'Dívida Líquida ÷ EBITDA',
    explicacao: 'Quanto menor a alavancagem, menos anos de geração de caixa operacional seriam necessários para quitar a dívida líquida.',
  },
]
