import {
  ArrowPathIcon,
  ArchiveBoxIcon,
  ClockIcon,
  BanknotesIcon,
  TruckIcon,
  ScaleIcon,
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
import { indicadores, ultimoAno, fontes } from './data'

const COLORS = {
  navy: '#1f3864',
  indigo: '#4f46e5',
  slate: '#64748b',
  amber: '#d97706',
  emerald: '#059669',
}

function formatDias(v: number) {
  return `${v.toFixed(1)} dias`
}

function formatBi(v: number) {
  return `R$ ${(v / 1_000_000).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} bi`
}

interface CardProps {
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>
  label: string
  value: string
  detail: string
  accent?: string
}

function IndicatorCard({ icon: Icon, label, value, detail, accent = COLORS.indigo }: CardProps) {
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
      <div className="text-2xl font-bold text-slate-900 dark:text-white">{value}</div>
      <div className="text-xs text-slate-500 dark:text-slate-400">{detail}</div>
    </div>
  )
}

const anoAnterior = indicadores[indicadores.length - 2]

function delta(atual: number, anterior: number, unidade: string, invertido = false) {
  const diff = atual - anterior
  const positivo = invertido ? diff < 0 : diff > 0
  const sinal = diff > 0 ? '+' : ''
  return {
    texto: `${sinal}${diff.toFixed(1)} ${unidade} vs. 2023`,
    positivo,
  }
}

export default function App() {
  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800 dark:bg-slate-950 dark:text-slate-100">
      <header className="border-b border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
        <div className="mx-auto max-w-6xl px-6 py-8">
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
      </header>

      <main className="mx-auto max-w-6xl space-y-10 px-6 py-8">
        <section>
          <h2 className="mb-4 text-lg font-bold text-slate-900 dark:text-white">
            Indicadores-chave ({ultimoAno.ano})
          </h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            <IndicatorCard
              icon={ArrowPathIcon}
              label="Giro do estoque"
              value={`${ultimoAno.giroEstoque.toFixed(2)}x`}
              detail={delta(ultimoAno.giroEstoque, anoAnterior.giroEstoque, 'x').texto}
              accent={COLORS.indigo}
            />
            <IndicatorCard
              icon={ArchiveBoxIcon}
              label="PME (estocagem)"
              value={formatDias(ultimoAno.pmeDias)}
              detail={delta(ultimoAno.pmeDias, anoAnterior.pmeDias, 'dias', true).texto}
              accent={COLORS.navy}
            />
            <IndicatorCard
              icon={ClockIcon}
              label="PMR (recebimento)"
              value={formatDias(ultimoAno.pmrDias)}
              detail={delta(ultimoAno.pmrDias, anoAnterior.pmrDias, 'dias', true).texto}
              accent={COLORS.slate}
            />
            <IndicatorCard
              icon={TruckIcon}
              label="PMP (pagamento)"
              value={formatDias(ultimoAno.pmpDias)}
              detail={delta(ultimoAno.pmpDias, anoAnterior.pmpDias, 'dias').texto}
              accent={COLORS.amber}
            />
            <IndicatorCard
              icon={ScaleIcon}
              label="Ciclo de caixa"
              value={formatDias(ultimoAno.cicloCaixaDias)}
              detail={delta(ultimoAno.cicloCaixaDias, anoAnterior.cicloCaixaDias, 'dias', true).texto}
              accent={COLORS.emerald}
            />
            <IndicatorCard
              icon={BanknotesIcon}
              label="NCG"
              value={formatBi(ultimoAno.ncg)}
              detail={`${ultimoAno.ncgPctReceita.toFixed(1)}% da receita líquida`}
              accent={COLORS.navy}
            />
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-800">
            <h3 className="mb-1 text-sm font-bold text-slate-900 dark:text-white">
              Giro do estoque (x/ano)
            </h3>
            <p className="mb-4 text-xs text-slate-500 dark:text-slate-400">
              Quantas vezes o estoque é vendido e reposto por ano — quanto maior, mais eficiente.
            </p>
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={indicadores} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="ano" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip formatter={(v: any) => `${Number(v).toFixed(2)}x`} />
                <Line
                  type="monotone"
                  dataKey="giroEstoque"
                  name="Giro do estoque"
                  stroke={COLORS.indigo}
                  strokeWidth={2.5}
                  dot={{ r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-800">
            <h3 className="mb-1 text-sm font-bold text-slate-900 dark:text-white">
              Prazos médios (dias)
            </h3>
            <p className="mb-4 text-xs text-slate-500 dark:text-slate-400">
              PME (estocagem), PMR (recebimento) e PMP (pagamento a fornecedores).
            </p>
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={indicadores} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="ano" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip formatter={(v: any) => formatDias(Number(v))} />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Line type="monotone" dataKey="pmeDias" name="PME" stroke={COLORS.navy} strokeWidth={2} dot={{ r: 3 }} />
                <Line type="monotone" dataKey="pmrDias" name="PMR" stroke={COLORS.slate} strokeWidth={2} dot={{ r: 3 }} />
                <Line type="monotone" dataKey="pmpDias" name="PMP" stroke={COLORS.amber} strokeWidth={2} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-800">
            <h3 className="mb-1 text-sm font-bold text-slate-900 dark:text-white">
              Ciclo de caixa operacional (dias)
            </h3>
            <p className="mb-4 text-xs text-slate-500 dark:text-slate-400">
              PME + PMR − PMP. Negativo = operação financiada por fornecedores, não por capital
              próprio.
            </p>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={indicadores} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="ano" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip formatter={(v: any) => formatDias(Number(v))} />
                <Bar dataKey="cicloCaixaDias" name="Ciclo de caixa" fill={COLORS.emerald} radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-800">
            <h3 className="mb-1 text-sm font-bold text-slate-900 dark:text-white">
              Necessidade de Capital de Giro (R$ bilhões)
            </h3>
            <p className="mb-4 text-xs text-slate-500 dark:text-slate-400">
              (Contas a Receber + Estoques) − Fornecedores. O salto de 2022 reflete a conversão
              das lojas Extra Hiper adquiridas naquele ano.
            </p>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={indicadores} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="ano" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} tickFormatter={(v) => `${(v / 1_000_000).toFixed(1)} bi`} />
                <Tooltip formatter={(v: any) => formatBi(Number(v))} />
                <Bar dataKey="ncg" name="NCG" fill={COLORS.navy} radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>

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

        <footer className="pb-8 text-center text-xs text-slate-400">
          Projeto pessoal de análise de dados públicos — Pedro Caio Feitosa Teles
        </footer>
      </main>
    </div>
  )
}
