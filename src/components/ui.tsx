import type { ReactNode } from 'react'
import { ResponsiveContainer, LineChart, Line } from 'recharts'
import type { AnnualIndicators, Empresa } from '../data'

export function Card({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <div className={`rounded-lg border border-linha bg-carta ${className}`}>{children}</div>
  )
}

/** Título de seção com a régua de assinatura à esquerda. */
export function TituloSecao({
  numero,
  titulo,
  descricao,
}: {
  numero?: string
  titulo: string
  descricao?: string
}) {
  return (
    <div className="mb-5 border-l-2 border-petroleo pl-4">
      {numero && (
        <span className="mb-1 block font-mono text-[11px] uppercase tracking-[0.18em] text-petroleo">{numero}</span>
      )}
      <h2 className="text-xl font-bold tracking-tight text-tinta">{titulo}</h2>
      {descricao && <p className="mt-1.5 max-w-2xl text-sm leading-relaxed text-cinza">{descricao}</p>}
    </div>
  )
}

/** Moldura padrão de gráfico: título, subtítulo e legenda direta acima da área. */
export function MolduraGrafico({
  titulo,
  descricao,
  legenda,
  children,
}: {
  titulo: string
  descricao: string
  legenda?: { rotulo: string; cor: string; hachurada?: boolean }[]
  children: ReactNode
}) {
  return (
    <Card className="p-5">
      <h3 className="text-sm font-bold tracking-tight text-tinta">{titulo}</h3>
      <p className="mt-1 text-xs leading-relaxed text-cinza">{descricao}</p>
      {legenda && (
        <ul className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5">
          {legenda.map((l) => (
            <li key={l.rotulo} className="flex items-center gap-1.5 font-mono text-[11px] text-cinza">
              <span
                className="inline-block h-2.5 w-2.5 rounded-[2px]"
                style={
                  l.hachurada
                    ? { border: `1.5px solid ${l.cor}`, backgroundColor: 'transparent' }
                    : { backgroundColor: l.cor }
                }
                aria-hidden="true"
              />
              {l.rotulo}
            </li>
          ))}
        </ul>
      )}
      <div className="mt-4">{children}</div>
    </Card>
  )
}

/** Tooltip do recharts no vocabulário visual da página. */
export function TooltipCartao({
  active,
  payload,
  label,
  format,
}: {
  active?: boolean
  payload?: { name?: string; value?: number; color?: string }[]
  label?: string | number
  format: (v: number) => string
}) {
  if (!active || !payload?.length) return null
  return (
    <div className="rounded-md border border-linha-forte bg-carta px-3 py-2 shadow-[0_2px_12px_rgba(23,23,23,0.10)]">
      <p className="mb-1.5 font-mono text-[11px] uppercase tracking-wider text-cinza">{label}</p>
      <ul className="space-y-1">
        {payload.map((p) => (
          <li key={p.name} className="flex items-center gap-2 text-xs">
            <span className="inline-block h-2 w-2 rounded-full" style={{ backgroundColor: p.color }} aria-hidden="true" />
            <span className="text-cinza">{p.name}</span>
            <span className="tabular ml-auto font-mono font-semibold text-tinta">
              {p.value == null ? '—' : format(Number(p.value))}
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}

export function Sparkline({ empresa, dataKey }: { empresa: Empresa; dataKey: keyof AnnualIndicators }) {
  const data = empresa.indicadores.map((i) => ({ ano: i.ano, valor: i[dataKey] as number }))
  return (
    <div className="h-7 w-16 shrink-0" aria-hidden="true">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 3, right: 2, left: 2, bottom: 3 }}>
          <Line type="monotone" dataKey="valor" stroke={empresa.cor} strokeWidth={1.5} dot={false} isAnimationActive={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

export const EIXO = {
  tick: { fontSize: 11, fill: '#737373', fontFamily: 'IBM Plex Mono, monospace' },
  axisLine: { stroke: '#e3ded3' },
  tickLine: false,
} as const

export const GRADE = { stroke: '#e3ded3', strokeDasharray: '0' } as const
