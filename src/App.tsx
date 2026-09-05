import { useEffect, useState } from 'react'
import {
  PresentationChartLineIcon,
  TableCellsIcon,
  BookOpenIcon,
  VariableIcon,
} from '@heroicons/react/24/outline'
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  CartesianGrid,
  Label,
  ReferenceLine,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from 'recharts'
import { indicadores, ultimoAno, fontes } from './data'
import { formatBi, formatDias } from './format'
import { ThemeToggle } from './components/ThemeToggle'
import { IndicatorCard } from './components/IndicatorCard'
import { ProjecaoCicloChart } from './components/ProjecaoChart'
import { CapitalSection } from './components/CapitalSection'
import { RevenueRealSection } from './components/RevenueRealSection'
import { BenchmarkingSection } from './components/BenchmarkingSection'

const COLORS = {
  navy: '#1f3864',
  indigo: '#4f46e5',
  slate: '#64748b',
  amber: '#d97706',
  emerald: '#059669',
}

const anoAnterior = indicadores[indicadores.length - 2]
import { anoPadrao, type BaseCalculo } from './data'
import { Panorama } from './tabs/Panorama'
import { Tabelas } from './tabs/Tabelas'
import { Fontes } from './tabs/Fontes'
import { Metodologia } from './tabs/Metodologia'

type AbaId = 'panorama' | 'indicadores' | 'fontes' | 'metodologia'

const ABAS: {
  id: AbaId
  rotulo: string
  rotuloCurto: string
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>
}[] = [
  { id: 'panorama', rotulo: 'Panorama geral', rotuloCurto: 'Panorama', icon: PresentationChartLineIcon },
  { id: 'indicadores', rotulo: 'Tabela de indicadores', rotuloCurto: 'Indicadores', icon: TableCellsIcon },
  { id: 'fontes', rotulo: 'Fontes de dados', rotuloCurto: 'Fontes', icon: BookOpenIcon },
  { id: 'metodologia', rotulo: 'Metodologia', rotuloCurto: 'Metodologia', icon: VariableIcon },
]

function abaDaUrl(): AbaId {
  const h = window.location.hash.replace('#', '')
  return ABAS.some((a) => a.id === h) ? (h as AbaId) : 'panorama'
}

export default function App() {
  const [aba, setAba] = useState<AbaId>(abaDaUrl)
  const [ano, setAno] = useState<number>(anoPadrao)
  const [base, setBase] = useState<BaseCalculo>('final')

  // Cada aba é endereçável, então um link pode apontar direto para a metodologia.
  useEffect(() => {
    const sincronizar = () => setAba(abaDaUrl())
    window.addEventListener('hashchange', sincronizar)
    return () => window.removeEventListener('hashchange', sincronizar)
  }, [])

  const irPara = (id: AbaId) => {
    setAba(id)
    window.history.replaceState(null, '', `#${id}`)
    window.scrollTo({ top: 0 })
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800 dark:bg-slate-950 dark:text-slate-100">
      <header className="border-b border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
        <div className="mx-auto flex max-w-6xl items-start justify-between gap-4 px-6 py-8">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-indigo-600 dark:text-indigo-400">
              Assaí Atacadista (B3: ASAI3)
            </p>
            <h1 className="mt-1 text-3xl font-extrabold text-slate-900 dark:text-white sm:text-4xl">
              Indicadores Operacionais — 2020 a 2024
            </h1>
            <p className="mt-3 max-w-3xl text-slate-600 dark:text-slate-300">
              Eficiência de estoque e ciclo operacional de caixa a partir de dados públicos da
              CVM. Em {ultimoAno.ano}, o ciclo de caixa operacional foi de{' '}
              <strong>{formatDias(ultimoAno.cicloCaixaDias)}</strong> — negativo, ou seja, a
              empresa recebe dos clientes e vende o estoque antes de precisar pagar os
              fornecedores, operando com capital de giro financiado por eles.
            </p>
          </div>
          <ThemeToggle />
    <div className="min-h-screen bg-papel">
      <a
        href="#conteudo"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-tinta focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-papel"
      >
        Pular para o conteúdo
      </a>

      {/* ---------------------------------------------------------------- */}
      {/* Navegação lateral — desktop                                       */}
      {/* ---------------------------------------------------------------- */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-60 flex-col bg-petroleo lg:flex">
        <div className="px-6 pb-7 pt-8">
          <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-white/55">Análise setorial</p>
          <p className="mt-2 text-lg font-extrabold leading-tight tracking-tight text-white">
            BRF
            <span className="mx-1 font-normal text-white/45">·</span>
            Copacol
            <span className="mx-1 font-normal text-white/45">·</span>
            C.Vale
          </p>
          <p className="mt-1 font-mono text-[11px] text-white/55">Proteína e grãos · 2021–2025</p>
        </div>

        <nav aria-label="Seções do painel" className="flex-1 px-3">
          <ul className="space-y-0.5">
            {ABAS.map((a) => {
              const ativa = aba === a.id
              return (
                <li key={a.id}>
                  <button
                    type="button"
                    onClick={() => irPara(a.id)}
                    aria-current={ativa ? 'page' : undefined}
                    className={`flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-left text-sm transition-colors ${
                      ativa
                        ? 'bg-white font-semibold text-petroleo'
                        : 'font-medium text-white/75 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    <a.icon className="h-[18px] w-[18px] shrink-0" aria-hidden="true" />
                    {a.rotulo}
                  </button>
                </li>
              )
            })}
          </ul>
        </nav>

        <div className="border-t border-white/15 px-6 py-5">
          <p className="text-[11px] leading-relaxed text-white/55">
            Projeto pessoal de análise de dados públicos
          </p>
          <p className="mt-1 text-[11px] font-semibold text-white/80">Pedro Caio Feitosa Teles</p>
        </div>
      </aside>

      {/* ---------------------------------------------------------------- */}
      {/* Conteúdo                                                          */}
      {/* ---------------------------------------------------------------- */}
      <div className="lg:pl-60">
        <main id="conteudo" className="mx-auto max-w-6xl px-5 pb-28 pt-8 sm:px-8 sm:pt-12 lg:pb-20">
          {aba === 'panorama' && <Panorama ano={ano} setAno={setAno} base={base} setBase={setBase} />}
          {aba === 'indicadores' && <Tabelas base={base} setBase={setBase} />}
          {aba === 'fontes' && <Fontes />}
          {aba === 'metodologia' && <Metodologia />}

          <footer className="mt-16 border-t border-linha pt-6 lg:hidden">
            <p className="text-[11px] leading-relaxed text-cinza">
              Projeto pessoal de análise de dados públicos — Pedro Caio Feitosa Teles
            </p>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={indicadores} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="ano" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} tickFormatter={(v) => `${(v / 1_000_000).toFixed(1)} bi`} />
                <Tooltip formatter={(v: any) => formatBi(Number(v))} />
                <ReferenceLine x={2022} stroke={COLORS.amber} strokeDasharray="4 4">
                  <Label
                    value="Aquisição Extra Hiper"
                    position="insideTopLeft"
                    fontSize={11}
                    fill="#fff"
                    style={{ fontWeight: 600 }}
                  />
                </ReferenceLine>
                <Bar dataKey="ncg" name="NCG" fill={COLORS.navy} radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>

        <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-800">
          <h3 className="mb-1 text-sm font-bold text-slate-900 dark:text-white">
            Projeção simples — ciclo de caixa operacional (2025–2026)
          </h3>
          <p className="mb-4 text-xs text-slate-500 dark:text-slate-400">
            Regressão linear sobre a série {indicadores[0].ano}–{indicadores[indicadores.length - 1].ano}.
            Não é uma previsão financeira oficial nem recomendação de investimento — apenas a
            extrapolação estatística da tendência observada.
          </p>
          <ProjecaoCicloChart />
        </section>

        <CapitalSection />

        <RevenueRealSection />

        <BenchmarkingSection />

        <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-800">
          <h2 className="mb-3 text-sm font-bold text-slate-900 dark:text-white">
            Premissas e fontes
          </h2>
          <ul className="space-y-1.5 text-sm text-slate-600 dark:text-slate-300">
            <li>
              <strong>Empresa:</strong> {fontes.empresa}
            </li>
            <li>
              <strong>Fonte:</strong> {fontes.origem} —{' '}
              <span className="break-all text-indigo-600 dark:text-indigo-400">{fontes.url}</span>
            </li>
            <li>
              <strong>Base contábil:</strong> {fontes.base}
            </li>
          </ul>
          <h3 className="mb-2 mt-4 text-xs font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">
            Fórmulas usadas
          </h3>
          <ul className="list-disc space-y-1 pl-5 text-sm text-slate-600 dark:text-slate-300">
            {fontes.formulas.map((f) => (
              <li key={f}>{f}</li>
            ))}
          </ul>
        </section>
          </footer>
        </main>
      </div>

      {/* ---------------------------------------------------------------- */}
      {/* Navegação inferior — mobile, só ícones                            */}
      {/* ---------------------------------------------------------------- */}
      <nav
        aria-label="Seções do painel"
        className="fixed inset-x-0 bottom-0 z-30 border-t border-black/10 bg-petroleo pb-[env(safe-area-inset-bottom)] lg:hidden"
      >
        <ul className="flex">
          {ABAS.map((a) => {
            const ativa = aba === a.id
            return (
              <li key={a.id} className="flex-1">
                <button
                  type="button"
                  onClick={() => irPara(a.id)}
                  aria-current={ativa ? 'page' : undefined}
                  aria-label={a.rotulo}
                  title={a.rotulo}
                  className="relative flex h-16 w-full items-center justify-center"
                >
                  <span
                    className={`flex h-10 w-10 items-center justify-center rounded-lg transition-colors ${
                      ativa ? 'bg-white text-petroleo' : 'text-white/70'
                    }`}
                  >
                    <a.icon className="h-[22px] w-[22px]" aria-hidden="true" />
                  </span>
                </button>
              </li>
            )
          })}
        </ul>
      </nav>
    </div>
  )
}
