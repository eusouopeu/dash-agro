import type { ComponentType, SVGProps } from 'react'
import { PendingBadge } from './PendingBadge'

const INDIGO = '#4f46e5'

export interface IndicatorCardProps {
  icon: ComponentType<SVGProps<SVGSVGElement>>
  label: string
  value: string
  detail: string
  accent?: string
  /** Quando true, ignora `value`/`detail` e exibe um indicador de "dado pendente". */
  pending?: boolean
}

export function IndicatorCard({
  icon: Icon,
  label,
  value,
  detail,
  accent = INDIGO,
  pending,
}: IndicatorCardProps) {
  return (
    <div className="flex flex-col gap-2 rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-800">
      <div className="flex items-center gap-2">
        <span
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg"
          style={{ backgroundColor: `${accent}1a`, color: accent }}
        >
          <Icon className="h-5 w-5" />
        </span>
        <span className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
          {label}
        </span>
      </div>
      <div className="text-2xl font-bold text-slate-900 dark:text-white">{pending ? '—' : value}</div>
      {pending ? <PendingBadge /> : <div className="text-xs text-slate-500 dark:text-slate-400">{detail}</div>}
    </div>
  )
}
