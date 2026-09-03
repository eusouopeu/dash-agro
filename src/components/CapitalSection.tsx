import {
  ArrowTrendingUpIcon,
  BanknotesIcon,
  ReceiptPercentIcon,
  ScaleIcon,
  ShieldCheckIcon,
} from '@heroicons/react/24/outline'
import { IndicatorCard } from './IndicatorCard'
import { ultimoAno } from '../data'
import { formatPercent } from '../format'

const COLORS = {
  indigo: '#4f46e5',
  navy: '#1f3864',
  slate: '#64748b',
  amber: '#d97706',
  emerald: '#059669',
}

function formatRatio(v: number | null): string {
  return v === null ? '—' : `${v.toFixed(2)}x`
}

function DuPontChip({
  label,
  value,
  pending,
  emphasis,
}: {
  label: string
  value: string
  pending?: boolean
  emphasis?: boolean
}) {
  return (
    <div
      className={`flex flex-col items-center gap-0.5 rounded-lg px-3 py-2 ${
        emphasis ? 'bg-indigo-50 dark:bg-indigo-500/10' : 'bg-slate-50 dark:bg-slate-900/40'
      }`}
    >
      <span
        className={`text-base font-bold ${
          pending
            ? 'text-slate-400 dark:text-slate-500'
            : emphasis
              ? 'text-indigo-700 dark:text-indigo-300'
              : 'text-slate-900 dark:text-white'
        }`}
      >
        {value}
      </span>
      <span className="text-[10px] uppercase tracking-wide text-slate-400 dark:text-slate-500">{label}</span>
    </div>
  )
}

export function CapitalSection() {
  return (
    <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-800">
      <h2 className="text-sm font-bold text-slate-900 dark:text-white">
        Rentabilidade sobre capital e estrutura de capital
      </h2>
      <p className="mb-4 mt-1 text-xs text-slate-500 dark:text-slate-400">
        ROE, ROA, ROIC e os indicadores de endividamento dependem de EBIT, Lucro Líquido,
        Patrimônio Líquido, Ativo Total e dados de dívida ainda não preenchidos em{' '}
        <code>src/data.ts</code> (marcados como <code>TODO</code>). Assim que os valores da
        CVM forem adicionados, os cards abaixo passam a exibir os números automaticamente.
      </p>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        <IndicatorCard
          icon={ArrowTrendingUpIcon}
          label="ROE"
          value={ultimoAno.roe === null ? '—' : formatPercent(ultimoAno.roe)}
          detail={`${ultimoAno.ano} — lucro líquido / PL`}
          accent={COLORS.indigo}
          pending={ultimoAno.roe === null}
        />
        <IndicatorCard
          icon={ScaleIcon}
          label="ROA"
          value={ultimoAno.roa === null ? '—' : formatPercent(ultimoAno.roa)}
          detail={`${ultimoAno.ano} — lucro líquido / ativo`}
          accent={COLORS.navy}
          pending={ultimoAno.roa === null}
        />
        <IndicatorCard
          icon={BanknotesIcon}
          label="ROIC (aprox.)"
          value={ultimoAno.roic === null ? '—' : formatPercent(ultimoAno.roic)}
          detail={`${ultimoAno.ano} — EBIT / capital investido`}
          accent={COLORS.emerald}
          pending={ultimoAno.roic === null}
        />
        <IndicatorCard
          icon={ReceiptPercentIcon}
          label="Dívida líq. / EBITDA"
          value={formatRatio(ultimoAno.dividaLiquidaSobreEbitda)}
          detail={`${ultimoAno.ano}`}
          accent={COLORS.amber}
          pending={ultimoAno.dividaLiquidaSobreEbitda === null}
        />
        <IndicatorCard
          icon={ShieldCheckIcon}
          label="Cobertura de juros"
          value={formatRatio(ultimoAno.coberturaJuros)}
          detail={`${ultimoAno.ano} — EBIT / desp. financeira`}
          accent={COLORS.slate}
          pending={ultimoAno.coberturaJuros === null}
        />
      </div>

      <div className="mt-5 border-t border-slate-100 pt-4 dark:border-slate-700">
        <h3 className="mb-2 text-xs font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">
          Decomposição DuPont do ROE ({ultimoAno.ano})
        </h3>
        <div className="flex flex-wrap items-center gap-2">
          <DuPontChip
            label="Margem líquida"
            value={ultimoAno.margemLiquida === null ? '—' : formatPercent(ultimoAno.margemLiquida)}
            pending={ultimoAno.margemLiquida === null}
          />
          <span className="text-slate-300 dark:text-slate-600">×</span>
          <DuPontChip
            label="Giro do ativo"
            value={ultimoAno.giroAtivo === null ? '—' : `${ultimoAno.giroAtivo.toFixed(2)}x`}
            pending={ultimoAno.giroAtivo === null}
          />
          <span className="text-slate-300 dark:text-slate-600">×</span>
          <DuPontChip
            label="Alavancagem"
            value={
              ultimoAno.alavancagemFinanceira === null
                ? '—'
                : `${ultimoAno.alavancagemFinanceira.toFixed(2)}x`
            }
            pending={ultimoAno.alavancagemFinanceira === null}
          />
          <span className="text-slate-300 dark:text-slate-600">=</span>
          <DuPontChip
            label="ROE"
            value={ultimoAno.roe === null ? '—' : formatPercent(ultimoAno.roe)}
            pending={ultimoAno.roe === null}
            emphasis
          />
        </div>
      </div>
    </section>
  )
}
