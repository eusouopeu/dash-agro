import { useState } from 'react'
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { indicadores } from '../data'
import { deflacionar, ipcaDisponivel } from '../inflacao'
import { formatBi } from '../format'
import { PendingBadge } from './PendingBadge'

const INDIGO = '#4f46e5'
const SLATE = '#94a3b8'

export function RevenueRealSection() {
  const [modo, setModo] = useState<'nominal' | 'real'>('nominal')
  const disponivel = ipcaDisponivel(indicadores.map((d) => d.ano))

  const data = indicadores.map((d) => {
    const real = deflacionar(d.receitaLiquida, d.ano)
    const usarReal = modo === 'real' && real !== null
    return { ano: d.ano, valor: usarReal ? real : d.receitaLiquida }
  })

  return (
    <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-800">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-sm font-bold text-slate-900 dark:text-white">
            Receita líquida — nominal vs. real (IPCA)
          </h2>
          <p className="mt-1 max-w-lg text-xs text-slate-500 dark:text-slate-400">
            Valores nominais misturam crescimento real com efeito preço. A visão "Real"
            deflaciona cada ano para reais de {indicadores[indicadores.length - 1].ano} usando o
            IPCA.
          </p>
        </div>
        <div className="inline-flex overflow-hidden rounded-lg border border-slate-200 text-xs font-medium dark:border-slate-700">
          <button
            type="button"
            onClick={() => setModo('nominal')}
            className={`px-3 py-1.5 ${
              modo === 'nominal'
                ? 'bg-indigo-600 text-white'
                : 'bg-white text-slate-600 dark:bg-slate-800 dark:text-slate-300'
            }`}
          >
            Nominal
          </button>
          <button
            type="button"
            onClick={() => disponivel && setModo('real')}
            disabled={!disponivel}
            title={disponivel ? undefined : 'Índices de IPCA pendentes'}
            className={`px-3 py-1.5 disabled:cursor-not-allowed disabled:opacity-50 ${
              modo === 'real'
                ? 'bg-indigo-600 text-white'
                : 'bg-white text-slate-600 dark:bg-slate-800 dark:text-slate-300'
            }`}
          >
            Real (IPCA)
          </button>
        </div>
      </div>

      {!disponivel && (
        <div className="mt-3 flex items-center gap-2">
          <PendingBadge text="IPCA pendente" />
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Preencha <code>IPCA_ANUAL</code> em <code>src/inflacao.ts</code> para habilitar a
            visão em reais constantes.
          </p>
        </div>
      )}

      <ResponsiveContainer width="100%" height={220} className="mt-3">
        <BarChart data={data} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis dataKey="ano" tick={{ fontSize: 12 }} />
          <YAxis tick={{ fontSize: 12 }} tickFormatter={(v) => `${(v / 1_000_000).toFixed(0)} bi`} />
          <Tooltip formatter={(value: any) => [formatBi(Number(value)), 'Receita líquida']} />
          <Bar dataKey="valor" fill={modo === 'real' ? SLATE : INDIGO} radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </section>
  )
}
