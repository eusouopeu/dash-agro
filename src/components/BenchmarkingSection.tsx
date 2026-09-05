import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { CONCORRENTES } from '../concorrentes'
import { ultimoAno } from '../data'
import { PendingBadge } from './PendingBadge'

const INDIGO = '#4f46e5'
const SLATE = '#94a3b8'

export function BenchmarkingSection() {
  const linhas = [
    { empresa: 'Assaí', cicloCaixaDias: ultimoAno.cicloCaixaDias },
    ...CONCORRENTES.filter((c) => c.ano === ultimoAno.ano && c.cicloCaixaDias !== null).map((c) => ({
      empresa: c.empresa,
      cicloCaixaDias: c.cicloCaixaDias as number,
    })),
  ]
  const temConcorrentes = linhas.length > 1

  return (
    <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-800">
      <h2 className="text-sm font-bold text-slate-900 dark:text-white">
        Comparação setorial — ciclo de caixa ({ultimoAno.ano})
      </h2>
      <p className="mb-4 mt-1 text-xs text-slate-500 dark:text-slate-400">
        Contextualiza o ciclo de caixa operacional do Assaí frente a concorrentes diretos do
        setor de atacarejo/varejo alimentar.
      </p>

      {temConcorrentes ? (
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={linhas} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="empresa" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} tickFormatter={(v) => `${v}d`} />
            <Tooltip formatter={(value: any) => [`${Number(value).toFixed(1)} dias`, 'Ciclo de caixa']} />
            <Bar
              dataKey="cicloCaixaDias"
              radius={[4, 4, 0, 0]}
              shape={(props: any) => (
                <rect
                  {...props}
                  fill={props.payload.empresa === 'Assaí' ? INDIGO : SLATE}
                  rx={4}
                  ry={4}
                />
              )}
            />
          </BarChart>
        </ResponsiveContainer>
      ) : (
        <div className="flex flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-slate-300 p-8 text-center dark:border-slate-600">
          <PendingBadge text="Dados de concorrentes pendentes" />
          <p className="max-w-md text-xs text-slate-500 dark:text-slate-400">
            Adicione 1–2 concorrentes diretos (ex.: Atacadão/Carrefour Brasil, GPA) em{' '}
            <code>src/concorrentes.ts</code> para comparar ciclo de caixa, giro de estoque e
            margem líquida lado a lado com o Assaí.
          </p>
        </div>
      )}
    </section>
  )
}
