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
}

export const ROWS: IndicatorRow[] = [
  { key: 'cicloFinanceiroDias', label: 'Ciclo Financeiro', curto: 'Ciclo', icon: ArrowsRightLeftIcon, format: formatDias, menorMelhor: true },
  { key: 'giroEstoque', label: 'Giro do Estoque', curto: 'Giro estoque', icon: ArrowPathIcon, format: formatX, menorMelhor: false },
  { key: 'pmeDias', label: 'PME — estocagem', curto: 'PME', icon: ArchiveBoxIcon, format: formatDias, menorMelhor: true },
  { key: 'pmrDias', label: 'PMR — recebimento', curto: 'PMR', icon: ClockIcon, format: formatDias, menorMelhor: true },
  { key: 'pmpDias', label: 'PMP — pagamento', curto: 'PMP', icon: TruckIcon, format: formatDias, menorMelhor: false },
  { key: 'giroAtivo', label: 'Giro do Ativo', curto: 'Giro ativo', icon: ChartBarIcon, format: formatX, menorMelhor: false },
  { key: 'margemEbitda', label: 'Margem EBITDA', curto: 'Marg. EBITDA', icon: BanknotesIcon, format: formatPct, menorMelhor: false },
  { key: 'roic', label: 'ROIC', curto: 'ROIC', icon: ArrowTrendingUpIcon, format: formatPct, menorMelhor: false },
  { key: 'alavancagem', label: 'Alavancagem', curto: 'Dív.Líq./EBITDA', icon: ShieldExclamationIcon, format: formatX, menorMelhor: true },
]

/** `true` se `a` é melhor que `b` para esse indicador. */
export function melhor(row: IndicatorRow, a: number, b: number) {
  return row.menorMelhor ? a < b : a > b
}
