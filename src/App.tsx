import { useMemo, useState } from 'react'
import {
  ArrowPathIcon,
  ArchiveBoxIcon,
  ClockIcon,
  TruckIcon,
  ScaleIcon,
  ChartBarIcon,
  BanknotesIcon,
  ArrowTrendingUpIcon,
  ShieldExclamationIcon,
} from '@heroicons/react/24/outline'
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from 'recharts'
import {
  brf,
  copacol,
  empresas,
  anosComuns,
  anoPadrao,
  indicadorPorAno,
  fontes,
  type Empresa,
  type AnnualIndicators,
} from './data'

function formatDias(v: number) {
  return `${v.toFixed(1)} d`
}
function formatX(v: number) {
  return `${v.toFixed(2)}x`
}
function formatPct(v: number) {
  return `${(v * 100).toFixed(1)}%`
}
function formatBi(v: number) {
  return `R$ ${(v / 1_000_000).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} bi`
}

interface IndicatorRow {
  key: keyof AnnualIndicators
  label: string
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>
  format: (v: number) => string
  menorMelhor: boolean
}

const ROWS: IndicatorRow[] = [
  { key: 'cicloFinanceiroDias', label: 'Ciclo Financeiro', icon: ScaleIcon, format: formatDias, menorMelhor: true },
  { key: 'giroEstoque', label: 'Giro de Caixa/Estoque', icon: ArrowPathIcon, format: formatX, menorMelhor: false },
  { key: 'pmeDias', label: 'PME (estocagem)', icon: ArchiveBoxIcon, format: formatDias, menorMelhor: true },
  { key: 'pmpDias', label: 'PMP (pagamento)', icon: TruckIcon, format: formatDias, menorMelhor: false },
  { key: 'pmrDias', label: 'PMR (recebimento)', icon: ClockIcon, format: formatDias, menorMelhor: true },
  { key: 'giroAtivo', label: 'Giro do Ativo', icon: ChartBarIcon, format: formatX, menorMelhor: false },
  { key: 'margemEbitda', label: 'Margem EBITDA', icon: BanknotesIcon, format: formatPct, menorMelhor: false },
  { key: 'roic', label: 'ROIC', icon: ArrowTrendingUpIcon, format: formatPct, menorMelhor: false },
  { key: 'alavancagem', label: 'Alavancagem (Dív.Líq./EBITDA)', icon: ShieldExclamationIcon, format: formatX, menorMelhor: true },
]

function Sparkline({ empresa, dataKey }: { empresa: Empresa; dataKey: keyof AnnualIndicators }) {
  const data = empresa.indicadores.map((i) => ({ ano: i.ano, valor: i[dataKey] as number }))
  return (
    <div className="h-8 w-20">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 2, right: 2, left: 2, bottom: 2 }}>
          <Line type="monotone" dataKey="valor" stroke={empresa.cor} strokeWidth={1.75} dot={false} isAnimationActive={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

function melhor(row: IndicatorRow, a: number, b: number) {
  // retorna true se `a` é melhor que `b` para esse indicador
  return row.menorMelhor ? a < b : a > b
}

export default function App() {
  const [ano, setAno] = useState<number>(anoPadrao)

  const brfAtual = indicadorPorAno(brf, ano)
  const copacolAtual = indicadorPorAno(copacol, ano)
  const brfAnterior = brf.indicadores.find((i) => i.ano === ano - 1)
  const copacolAnterior = copacol.indicadores.find((i) => i.ano === ano - 1)

  const cicloSerie = useMemo(() => {
    const anos = Array.from(new Set([...brf.indicadores, ...copacol.indicadores].map((i) => i.ano))).sort()
    return anos.map((a) => ({
      ano: a,
      BRF: brf.indicadores.find((i) => i.ano === a)?.cicloFinanceiroDias,
      Copacol: copacol.indicadores.find((i) => i.ano === a)?.cicloFinanceiroDias,
    }))
  }, [])

  const giroSerie = useMemo(() => {
    const anos = Array.from(new Set([...brf.indicadores, ...copacol.indicadores].map((i) => i.ano))).sort()
    return anos.map((a) => ({
      ano: a,
      BRF: brf.indicadores.find((i) => i.ano === a)?.giroEstoque,
      Copacol: copacol.indicadores.find((i) => i.ano === a)?.giroEstoque,
    }))
  }, [])

  const composicaoCiclo = [
    { empresa: 'BRF', pme: brfAtual.pmeDias, pmr: brfAtual.pmrDias, pmp: -brfAtual.pmpDias },
    { empresa: 'Copacol', pme: copacolAtual.pmeDias, pmr: copacolAtual.pmrDias, pmp: -copacolAtual.pmpDias },
  ]

  const rentabilidade = [
    { metrica: 'Margem EBITDA', BRF: brfAtual.margemEbitda * 100, Copacol: copacolAtual.margemEbitda * 100 },
    { metrica: 'ROIC', BRF: brfAtual.roic * 100, Copacol: copacolAtual.roic * 100 },
  ]

  const destaques = useMemo(() => {
    return ROWS.map((row) => {
      const anosQueCopacolGanha = anosComuns.filter((a) => {
        const bV = indicadorPorAno(brf, a)[row.key] as number
        const cV = indicadorPorAno(copacol, a)[row.key] as number
        return melhor(row, cV, bV)
      })
      return { row, anosQueCopacolGanha }
    }).filter((d) => d.anosQueCopacolGanha.length > 0)
  }, [])

  const receitaCresc = (empresa: Empresa) => {
    const atual = indicadorPorAno(empresa, ano)
    const anterior = empresa.indicadores.find((i) => i.ano === ano - 1)
    if (!anterior) return null
    return (atual.receitaLiquida - anterior.receitaLiquida) / anterior.receitaLiquida
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800 dark:bg-slate-950 dark:text-slate-100">
      <header className="border-b border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
        <div className="mx-auto max-w-6xl px-6 py-8">
          <p className="text-sm font-semibold uppercase tracking-wide text-indigo-600 dark:text-indigo-400">
            Comparativo de indicadores operacionais — setor de proteína animal
          </p>
          <div className="mt-1 flex flex-wrap items-end justify-between gap-4">
            <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white sm:text-4xl">
              Copacol vs. BRF — Indicadores Operacionais
            </h1>
            <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
              Ano de referência
              <select
                value={ano}
                onChange={(e) => setAno(Number(e.target.value))}
                className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm font-medium text-slate-900 shadow-sm dark:border-slate-600 dark:bg-slate-800 dark:text-white"
              >
                {anosComuns.map((a) => (
                  <option key={a} value={a}>
                    {a}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <p className="mt-3 max-w-3xl text-slate-600 dark:text-slate-300">
            Eficiência de estoque, ciclo de caixa e rentabilidade da BRF S.A. (B3: BRFS3) frente à Copacol,
            cooperativa agroindustrial do Paraná, a partir de demonstrações financeiras auditadas. Anos com dado
            real disponível para as duas empresas: {anosComuns[0]}–{anosComuns[anosComuns.length - 1]}.
          </p>
        </div>
      </header>

      <main className="mx-auto max-w-6xl space-y-10 px-6 py-8">
        {/* Card de comparação em destaque */}
        <section className="grid grid-cols-1 items-center gap-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800 sm:grid-cols-[1fr_auto_1fr]">
          {[brf, copacol].map((empresa) => {
            const atual = indicadorPorAno(empresa, ano)
            const cresc = receitaCresc(empresa)
            return (
              <div key={empresa.id} className="flex flex-col items-center gap-1 text-center sm:items-start sm:text-left">
                <span
                  className="rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wide"
                  style={{ backgroundColor: `${empresa.cor}1a`, color: empresa.cor }}
                >
                  {empresa.nomeCurto}
                </span>
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">{empresa.nome}</h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">{empresa.subtitulo}</p>
                <p className="mt-2 text-2xl font-extrabold text-slate-900 dark:text-white">
                  {formatBi(atual.receitaLiquida)}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Receita líquida {ano}
                  {cresc !== null && (
                    <span className={cresc >= 0 ? 'ml-1 text-emerald-600 dark:text-emerald-400' : 'ml-1 text-red-500'}>
                      ({cresc >= 0 ? '+' : ''}
                      {(cresc * 100).toFixed(1)}% vs. {ano - 1})
                    </span>
                  )}
                </p>
              </div>
            )
          })}
          <div className="flex justify-center">
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-sm font-black text-slate-400 dark:bg-slate-700 dark:text-slate-300">
              VS
            </span>
          </div>
        </section>

        {/* Tabela de indicadores lado a lado */}
        <section>
          <h2 className="mb-4 text-lg font-bold text-slate-900 dark:text-white">Indicadores-chave ({ano})</h2>
          <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-800">
            <table className="w-full min-w-[720px] border-collapse text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-left text-xs uppercase tracking-wide text-slate-500 dark:border-slate-700 dark:text-slate-400">
                  <th className="px-4 py-3 font-semibold">Indicador</th>
                  <th className="px-4 py-3 font-semibold" style={{ color: brf.cor }}>
                    BRF
                  </th>
                  <th className="px-4 py-3 font-semibold" style={{ color: copacol.cor }}>
                    Copacol
                  </th>
                </tr>
              </thead>
              <tbody>
                {ROWS.map((row) => {
                  const bV = brfAtual[row.key] as number
                  const cV = copacolAtual[row.key] as number
                  const bPrev = brfAnterior ? (brfAnterior[row.key] as number) : null
                  const cPrev = copacolAnterior ? (copacolAnterior[row.key] as number) : null
                  const bMelhor = melhor(row, bV, cV)
                  const cMelhor = melhor(row, cV, bV)
                  return (
                    <tr key={row.key} className="border-b border-slate-100 last:border-0 dark:border-slate-700/60">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <row.icon className="h-4 w-4 text-slate-400" />
                          <span className="font-medium text-slate-700 dark:text-slate-200">{row.label}</span>
                        </div>
                      </td>
                      {([
                        { empresa: brf, valor: bV, prev: bPrev, ganha: bMelhor },
                        { empresa: copacol, valor: cV, prev: cPrev, ganha: cMelhor },
                      ] as const).map(({ empresa, valor, prev, ganha }) => (
                        <td key={empresa.id} className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <div>
                              <div className={`text-base font-bold ${ganha ? '' : 'text-slate-700 dark:text-slate-200'}`} style={ganha ? { color: empresa.cor } : undefined}>
                                {row.format(valor)}
                                {ganha && <span className="ml-1 text-[10px] font-semibold uppercase text-emerald-600 dark:text-emerald-400">melhor</span>}
                              </div>
                              {prev !== null && (
                                <div className="text-[11px] text-slate-400">
                                  {valor - prev >= 0 ? '+' : ''}
                                  {row.format(valor - prev)} vs. {ano - 1}
                                </div>
                              )}
                            </div>
                            <Sparkline empresa={empresa} dataKey={row.key} />
                          </div>
                        </td>
                      ))}
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </section>

        {/* Gráficos */}
        <section className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-800">
            <h3 className="mb-1 text-sm font-bold text-slate-900 dark:text-white">Ciclo Financeiro (dias)</h3>
            <p className="mb-4 text-xs text-slate-500 dark:text-slate-400">
              PME + PMR − PMP ao longo do tempo. Negativo = operação financiada por fornecedores.
            </p>
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={cicloSerie} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="ano" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip formatter={(v: any) => (v == null ? '—' : formatDias(Number(v)))} />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Line type="monotone" dataKey="BRF" stroke={brf.cor} strokeWidth={2.5} dot={{ r: 3 }} connectNulls />
                <Line type="monotone" dataKey="Copacol" stroke={copacol.cor} strokeWidth={2.5} dot={{ r: 3 }} connectNulls />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-800">
            <h3 className="mb-1 text-sm font-bold text-slate-900 dark:text-white">
              Composição do Ciclo Financeiro ({ano})
            </h3>
            <p className="mb-4 text-xs text-slate-500 dark:text-slate-400">PME + PMR (barras positivas) − PMP (barra negativa), em dias.</p>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={composicaoCiclo} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="empresa" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip formatter={(v: any) => formatDias(Math.abs(Number(v)))} />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Bar dataKey="pme" name="PME" stackId="a" fill="#1f3864" radius={[0, 0, 0, 0]} />
                <Bar dataKey="pmr" name="PMR" stackId="a" fill="#64748b" radius={[4, 4, 0, 0]} />
                <Bar dataKey="pmp" name="PMP (−)" stackId="a" fill="#d97706" radius={[0, 0, 4, 4]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-800">
            <h3 className="mb-1 text-sm font-bold text-slate-900 dark:text-white">Evolução do Giro de Caixa/Estoque</h3>
            <p className="mb-4 text-xs text-slate-500 dark:text-slate-400">
              Quantas vezes o estoque é vendido e reposto por ano — quanto maior, mais eficiente.
            </p>
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={giroSerie} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="ano" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip formatter={(v: any) => (v == null ? '—' : formatX(Number(v)))} />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Line type="monotone" dataKey="BRF" stroke={brf.cor} strokeWidth={2.5} dot={{ r: 3 }} connectNulls />
                <Line type="monotone" dataKey="Copacol" stroke={copacol.cor} strokeWidth={2.5} dot={{ r: 3 }} connectNulls />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-800">
            <h3 className="mb-1 text-sm font-bold text-slate-900 dark:text-white">Comparativo de Rentabilidade ({ano})</h3>
            <p className="mb-4 text-xs text-slate-500 dark:text-slate-400">Margem EBITDA e ROIC, em %.</p>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={rentabilidade} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="metrica" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} tickFormatter={(v) => `${v}%`} />
                <Tooltip formatter={(v: any) => `${Number(v).toFixed(1)}%`} />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Bar dataKey="BRF" fill={brf.cor} radius={[4, 4, 0, 0]} />
                <Bar dataKey="Copacol" fill={copacol.cor} radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>

        {/* Destaques */}
        <section className="rounded-xl border border-orange-200 bg-orange-50 p-5 dark:border-orange-900/40 dark:bg-orange-950/20">
          <h2 className="mb-3 flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-white">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-orange-100 text-orange-600 dark:bg-orange-900/40 dark:text-orange-300">
              ★
            </span>
            Destaques — onde a Copacol supera a BRF
          </h2>
          {destaques.length === 0 ? (
            <p className="text-sm text-slate-600 dark:text-slate-300">
              Nenhum indicador em que a Copacol supera a BRF em pelo menos um ano de {anosComuns[0]}-
              {anosComuns[anosComuns.length - 1]}.
            </p>
          ) : (
            <ul className="space-y-2 text-sm text-slate-700 dark:text-slate-200">
              {destaques.map(({ row, anosQueCopacolGanha }) => {
                const todos = anosQueCopacolGanha.length === anosComuns.length
                return (
                  <li key={row.key} className="flex items-start gap-2">
                    <row.icon className="mt-0.5 h-4 w-4 shrink-0 text-orange-500" />
                    <span>
                      <strong>{row.label}:</strong> Copacol melhor que BRF{' '}
                      {todos ? (
                        <>em todos os anos comparados ({anosComuns[0]}-{anosComuns[anosComuns.length - 1]})</>
                      ) : (
                        <>em {anosQueCopacolGanha.join(', ')}</>
                      )}
                      {row.key === 'roic' && (
                        <> — em 2022 a BRF teve ROIC negativo ({formatPct(indicadorPorAno(brf, 2022).roic)})</>
                      )}
                    </span>
                  </li>
                )
              })}
            </ul>
          )}
        </section>

        {/* Premissas e fontes */}
        <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-800">
          <h2 className="mb-3 text-sm font-bold text-slate-900 dark:text-white">Premissas e fontes</h2>

          {empresas.map((empresa) => {
            const f = fontes[empresa.id]
            return (
              <div key={empresa.id} className="mb-5 last:mb-0">
                <h3 className="mb-1.5 text-xs font-bold uppercase tracking-wide" style={{ color: empresa.cor }}>
                  {empresa.nome}
                </h3>
                <ul className="space-y-1.5 text-sm text-slate-600 dark:text-slate-300">
                  <li>
                    <strong>Fonte:</strong> {f.origem} —{' '}
                    <span className="break-all text-indigo-600 dark:text-indigo-400">{f.url}</span>
                  </li>
                  <li>
                    <strong>Base contábil:</strong> {f.base}
                  </li>
                </ul>
                <ul className="mt-2 list-disc space-y-1 pl-5 text-xs text-slate-500 dark:text-slate-400">
                  {f.ressalvas.map((r) => (
                    <li key={r}>{r}</li>
                  ))}
                </ul>
              </div>
            )
          })}

          <h3 className="mb-2 mt-4 text-xs font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">
            Fórmulas usadas
          </h3>
          <ul className="list-disc space-y-1 pl-5 text-sm text-slate-600 dark:text-slate-300">
            {fontes.formulas.map((f) => (
              <li key={f}>{f}</li>
            ))}
          </ul>
        </section>

        <footer className="pb-8 text-center text-xs text-slate-400">
          Projeto pessoal de análise de dados públicos — Pedro Caio Feitosa Teles
        </footer>
      </main>
    </div>
  )
}
