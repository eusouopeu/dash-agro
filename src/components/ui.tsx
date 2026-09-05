import { useEffect, useRef, useState, type ReactNode } from 'react'
import { QuestionMarkCircleIcon } from '@heroicons/react/20/solid'
import { ResponsiveContainer, LineChart, Line } from 'recharts'
import type { AnnualIndicators, Empresa } from '../data'

/** Conteúdo de um popover de ajuda: fórmula e explicação do sentido do indicador. */
export interface AjudaIndicador {
  titulo: string
  formula: string
  explicacao: string
}

/**
 * Botão "?" que abre um popover com a fórmula e o sentido do indicador
 * ("quanto maior/menor, ..."). Fecha ao clicar fora ou pressionar Esc.
 */
export function InfoPopover({ titulo, formula, explicacao }: AjudaIndicador) {
  const [aberto, setAberto] = useState(false)
  const raiz = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    if (!aberto) return
    const aoClicarFora = (e: MouseEvent) => {
      if (raiz.current && !raiz.current.contains(e.target as Node)) setAberto(false)
    }
    const aoPressionarTecla = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setAberto(false)
    }
    document.addEventListener('mousedown', aoClicarFora)
    document.addEventListener('keydown', aoPressionarTecla)
    return () => {
      document.removeEventListener('mousedown', aoClicarFora)
      document.removeEventListener('keydown', aoPressionarTecla)
    }
  }, [aberto])

  return (
    <span ref={raiz} className="relative inline-flex shrink-0 align-middle">
      <button
        type="button"
        onClick={() => setAberto((v) => !v)}
        aria-expanded={aberto}
        aria-label={`O que é ${titulo}`}
        className="inline-flex h-4 w-4 items-center justify-center rounded-full text-cinza hover:text-petroleo focus:outline-none focus-visible:ring-2 focus-visible:ring-petroleo"
      >
        <QuestionMarkCircleIcon className="h-4 w-4" aria-hidden="true" />
      </button>
      {aberto && (
        <div
          role="tooltip"
          className="absolute left-0 top-full z-20 mt-2 w-64 rounded-md border border-linha-forte bg-carta p-3 text-left normal-case shadow-[0_4px_20px_rgba(23,23,23,0.14)]"
        >
          <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-petroleo">{titulo}</p>
          <p className="tabular mt-1.5 font-mono text-[11px] leading-snug text-tinta">{formula}</p>
          <p className="mt-2 text-xs leading-relaxed text-cinza">{explicacao}</p>
        </div>
      )}
    </span>
  )
}

/** Popover com várias fórmulas — usado quando um gráfico combina mais de um indicador. */
export function InfoPopoverMultiplo({ itens }: { itens: AjudaIndicador[] }) {
  const [aberto, setAberto] = useState(false)
  const raiz = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    if (!aberto) return
    const aoClicarFora = (e: MouseEvent) => {
      if (raiz.current && !raiz.current.contains(e.target as Node)) setAberto(false)
    }
    const aoPressionarTecla = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setAberto(false)
    }
    document.addEventListener('mousedown', aoClicarFora)
    document.addEventListener('keydown', aoPressionarTecla)
    return () => {
      document.removeEventListener('mousedown', aoClicarFora)
      document.removeEventListener('keydown', aoPressionarTecla)
    }
  }, [aberto])

  return (
    <span ref={raiz} className="relative inline-flex shrink-0 align-middle">
      <button
        type="button"
        onClick={() => setAberto((v) => !v)}
        aria-expanded={aberto}
        aria-label="O que são estes indicadores"
        className="inline-flex h-4 w-4 items-center justify-center rounded-full text-cinza hover:text-petroleo focus:outline-none focus-visible:ring-2 focus-visible:ring-petroleo"
      >
        <QuestionMarkCircleIcon className="h-4 w-4" aria-hidden="true" />
      </button>
      {aberto && (
        <div
          role="tooltip"
          className="absolute left-0 top-full z-20 mt-2 w-72 space-y-3 rounded-md border border-linha-forte bg-carta p-3 text-left normal-case shadow-[0_4px_20px_rgba(23,23,23,0.14)]"
        >
          {itens.map((item) => (
            <div key={item.titulo}>
              <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-petroleo">{item.titulo}</p>
              <p className="tabular mt-1.5 font-mono text-[11px] leading-snug text-tinta">{item.formula}</p>
              <p className="mt-2 text-xs leading-relaxed text-cinza">{item.explicacao}</p>
            </div>
          ))}
        </div>
      )}
    </span>
  )
}

/** Alterna entre saldo final e saldo médio para os indicadores de capital de giro. */
export function SeletorBaseCalculo({
  valor,
  onChange,
}: {
  valor: 'final' | 'medio'
  onChange: (v: 'final' | 'medio') => void
}) {
  return (
    <label className="flex shrink-0 flex-col gap-1.5">
      <span className="font-mono text-[11px] uppercase tracking-[0.15em] text-cinza">Base de cálculo</span>
      <div className="inline-flex overflow-hidden rounded-md border border-linha-forte">
        {(
          [
            { v: 'final' as const, r: 'Saldo final' },
            { v: 'medio' as const, r: 'Saldo médio' },
          ]
        ).map((o) => (
          <button
            key={o.v}
            type="button"
            onClick={() => onChange(o.v)}
            aria-pressed={valor === o.v}
            className={`px-3 py-2 font-mono text-xs font-semibold transition-colors ${
              valor === o.v ? 'bg-petroleo text-papel' : 'bg-carta text-cinza hover:text-tinta'
            }`}
          >
            {o.r}
          </button>
        ))}
      </div>
    </label>
  )
}

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
  unidade,
  legenda,
  ajuda,
  children,
}: {
  titulo: string
  descricao?: string
  /** Unidade do eixo, mostrada como selo mono no canto superior direito — ex.: "% ao ano". */
  unidade?: string
  legenda?: { rotulo: string; cor: string; hachurada?: boolean }[]
  /** Fórmula(s) do(s) indicador(es) do gráfico, para o popover de ajuda. */
  ajuda?: AjudaIndicador[]
  children: ReactNode
}) {
  return (
    <Card className="p-5">
      <div className="flex items-start justify-between gap-3">
        <h3 className="flex items-center gap-1.5 text-sm font-bold tracking-tight text-tinta">
          {titulo}
          {ajuda && ajuda.length > 0 && <InfoPopoverMultiplo itens={ajuda} />}
        </h3>
        {unidade && (
          <span className="shrink-0 font-mono text-[10px] uppercase tracking-[0.14em] text-cinza">{unidade}</span>
        )}
      </div>
      {descricao && <p className="mt-1 text-xs leading-relaxed text-cinza">{descricao}</p>}
      {legenda && (
        <ul className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5">
          {legenda.map((l) => (
            <li key={l.rotulo} className="flex items-center gap-1.5 font-mono text-[11px] text-cinza">
              <span
                className="inline-block h-[3px] w-4 shrink-0 rounded-full"
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
