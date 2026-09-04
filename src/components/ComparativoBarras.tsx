import type { AnnualIndicators, Empresa } from '../data'
import type { GrupoPainel, MetricaPainel } from '../painel'
import { Card } from './ui'

// Comparativo por barras horizontais, um bloco por métrica.
//
// A barra é ancorada no zero e proporcional ao valor — não ao desempenho.
// Assim o Ciclo Financeiro negativo da BRF aparece crescendo para a esquerda
// em vez de virar um número sem representação. Toda empresa usa sua cor cheia:
// quem tem o melhor resultado é marcado só pelo valor em destaque.

interface Participante {
  empresa: Empresa
  indicador: AnnualIndicators | null
}

function Barra({
  metrica,
  participantes,
}: {
  metrica: MetricaPainel
  participantes: Participante[]
}) {
  const valores = participantes.map((p) => ({
    empresa: p.empresa,
    v: p.indicador ? metrica.valor(p.indicador) : null,
  }))

  const presentes = valores.filter((x): x is { empresa: Empresa; v: number } => x.v !== null)

  // Escala ancorada no zero, para que valores negativos tenham direção.
  const min = Math.min(0, ...presentes.map((x) => x.v))
  const max = Math.max(0, ...presentes.map((x) => x.v))
  const span = max - min || 1
  const pct = (v: number) => ((v - min) / span) * 100
  const zero = pct(0)

  const melhorValor = presentes.length
    ? metrica.menorMelhor
      ? Math.min(...presentes.map((x) => x.v))
      : Math.max(...presentes.map((x) => x.v))
    : null

  return (
    <div className="border-b border-linha py-4 last:border-0">
      <div className="mb-3 flex items-baseline justify-between gap-4">
        <h4 className="text-[13px] font-bold leading-snug tracking-tight text-tinta">{metrica.label}</h4>
        <span className="shrink-0 font-mono text-[10px] uppercase tracking-[0.12em] text-cinza">
          {metrica.menorMelhor ? 'menor é melhor' : 'maior é melhor'}
        </span>
      </div>

      <div className="space-y-1.5">
        {valores.map(({ empresa, v }) => {
          const ehMelhor = v !== null && v === melhorValor && presentes.length > 1
          const largura = v === null ? 0 : Math.max(Math.abs(pct(v) - zero), 0.6)
          const esquerda = v === null ? 0 : Math.min(pct(v), zero)

          return (
            <div key={empresa.id} className="grid grid-cols-[64px_1fr_84px] items-center gap-3">
              <span className="truncate text-[11px] text-cinza">{empresa.nomeCurto}</span>

              {v === null ? (
                <div className="h-[15px] rounded-[3px] border border-dashed border-linha-forte" aria-hidden="true" />
              ) : (
                <div className="relative h-[15px] rounded-[3px] bg-papel">
                  {/* Marca do zero, só quando a escala cruza o zero */}
                  {zero > 0.5 && zero < 99.5 && (
                    <span
                      className="absolute inset-y-0 w-px bg-linha-forte"
                      style={{ left: `${zero}%` }}
                      aria-hidden="true"
                    />
                  )}
                  <span
                    className="absolute inset-y-0 rounded-[3px]"
                    style={{ left: `${esquerda}%`, width: `${largura}%`, backgroundColor: empresa.cor }}
                    aria-hidden="true"
                  />
                </div>
              )}

              <span
                className={`tabular text-right font-mono text-xs ${
                  v === null ? 'text-cinza' : ehMelhor ? 'font-semibold text-tinta' : 'text-cinza'
                }`}
              >
                {v === null ? 'sem dado' : metrica.format(v)}
              </span>
            </div>
          )
        })}
      </div>

      {/* A nota só aparece quando alguma empresa de fato ficou sem dado. */}
      {metrica.faltaDado && presentes.length < valores.length && (
        <p className="mt-2.5 pl-[76px] font-mono text-[10px] leading-relaxed text-cinza">{metrica.faltaDado}</p>
      )}
    </div>
  )
}

export function ComparativoBarras({
  grupo,
  participantes,
  ano,
}: {
  grupo: GrupoPainel
  participantes: Participante[]
  ano: number
}) {
  return (
    <Card className="p-5 sm:p-6">
      <h3 className="text-sm font-bold tracking-tight text-tinta">{grupo.titulo}</h3>
      <p className="mt-1 text-xs leading-relaxed text-cinza">{grupo.descricao}</p>
      <p className="mt-0.5 font-mono text-[10px] uppercase tracking-[0.12em] text-cinza">
        Exercício de {ano} · barra proporcional ao valor
      </p>
      <div className="mt-4 border-t border-linha">
        {grupo.metricas.map((m) => (
          <Barra key={m.key} metrica={m} participantes={participantes} />
        ))}
      </div>
    </Card>
  )
}
