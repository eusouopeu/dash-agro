import type { AnnualIndicators, Empresa } from '../data'

// Cascata do ciclo financeiro: PME + PMR − PMP = Ciclo.
//
// A forma é uma waterfall porque o dado é literalmente uma soma encadeada —
// um empilhado esconderia o fato de que o PMP subtrai e de que o resultado
// pode cruzar o zero. A cor segue a empresa (nunca a direção); a direção é
// codificada pela geometria da barra, pelo sinal do rótulo e pelo preenchimento
// vazado do passo que subtrai.

const W = 340
const H = 236
const PAD = { top: 26, right: 12, bottom: 44, left: 42 }
const PLOT_W = W - PAD.left - PAD.right
const PLOT_H = H - PAD.top - PAD.bottom

export interface DominioCiclo {
  min: number
  max: number
}

/** Domínio compartilhado pelas duas cascatas, para que as alturas sejam comparáveis. */
export function dominioCiclo(lista: AnnualIndicators[]): DominioCiclo {
  const pontos: number[] = [0]
  for (const i of lista) {
    const a = i.pmeDias
    const b = a + i.pmrDias
    pontos.push(a, b, b - i.pmpDias, i.cicloFinanceiroDias)
  }
  const min = Math.min(...pontos)
  const max = Math.max(...pontos)
  const folga = (max - min) * 0.12
  return { min: min - folga, max: max + folga }
}

interface Passo {
  rotulo: string
  de: number
  ate: number
  valor: number
  tipo: 'soma' | 'subtrai' | 'total'
  explica: string
}

function passos(i: AnnualIndicators): Passo[] {
  const aposPme = i.pmeDias
  const aposPmr = aposPme + i.pmrDias
  const aposPmp = aposPmr - i.pmpDias
  return [
    { rotulo: 'PME', de: 0, ate: aposPme, valor: i.pmeDias, tipo: 'soma', explica: 'Dias com a mercadoria parada no estoque' },
    { rotulo: 'PMR', de: aposPme, ate: aposPmr, valor: i.pmrDias, tipo: 'soma', explica: 'Dias esperando o cliente pagar' },
    { rotulo: 'PMP', de: aposPmr, ate: aposPmp, valor: -i.pmpDias, tipo: 'subtrai', explica: 'Dias de prazo obtidos com fornecedores' },
    { rotulo: 'Ciclo', de: 0, ate: i.cicloFinanceiroDias, valor: i.cicloFinanceiroDias, tipo: 'total', explica: 'Dias de caixa próprio presos na operação' },
  ]
}

function fmt(v: number) {
  const s = Math.abs(v).toLocaleString('pt-BR', { minimumFractionDigits: 1, maximumFractionDigits: 1 })
  return `${v >= 0 ? '+' : '−'}${s}`
}

export function CicloWaterfall({
  empresa,
  indicador,
  dominio,
}: {
  empresa: Empresa
  indicador: AnnualIndicators
  dominio: DominioCiclo
}) {
  const lista = passos(indicador)
  const escala = (v: number) => PAD.top + PLOT_H - ((v - dominio.min) / (dominio.max - dominio.min)) * PLOT_H
  const y0 = escala(0)

  const larguraPasso = PLOT_W / lista.length
  const larguraBarra = Math.min(46, larguraPasso * 0.6)

  // Linhas de grade a cada 30 dias — a leitura natural é "quantos meses".
  const ticks: number[] = []
  const passoTick = 30
  const inicio = Math.ceil(dominio.min / passoTick) * passoTick
  for (let t = inicio; t <= dominio.max; t += passoTick) ticks.push(t)

  const id = `ciclo-${empresa.id}`

  return (
    <figure className="m-0">
      <figcaption className="mb-3 flex items-baseline gap-2">
        <span
          className="inline-block h-2.5 w-2.5 shrink-0 rounded-full"
          style={{ backgroundColor: empresa.cor }}
          aria-hidden="true"
        />
        <span className="text-sm font-bold text-tinta">{empresa.nomeCurto}</span>
        <span className="font-mono text-xs text-cinza">{empresa.subtitulo}</span>
      </figcaption>

      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="h-auto w-full"
        role="img"
        aria-label={`Cascata do ciclo financeiro da ${empresa.nomeCurto}: PME de ${indicador.pmeDias.toFixed(1)} dias mais PMR de ${indicador.pmrDias.toFixed(1)} dias menos PMP de ${indicador.pmpDias.toFixed(1)} dias resulta em ciclo de ${indicador.cicloFinanceiroDias.toFixed(1)} dias.`}
      >
        <defs>
          <pattern id={`${id}-hachura`} width="6" height="6" patternTransform="rotate(45)" patternUnits="userSpaceOnUse">
            <rect width="6" height="6" fill="var(--color-carta)" />
            <line x1="0" y1="0" x2="0" y2="6" stroke={empresa.cor} strokeWidth="3" />
          </pattern>
        </defs>

        {/* Grade recessiva */}
        {ticks.map((t) => (
          <g key={t}>
            <line x1={PAD.left} y1={escala(t)} x2={W - PAD.right} y2={escala(t)} stroke="var(--color-linha)" strokeWidth="1" />
            <text x={PAD.left - 8} y={escala(t) + 3.5} textAnchor="end" className="fill-cinza font-mono" fontSize="10">
              {t}
            </text>
          </g>
        ))}

        {/* Linha do zero — a referência que importa */}
        <line x1={PAD.left} y1={y0} x2={W - PAD.right} y2={y0} stroke="var(--color-tinta)" strokeWidth="1.25" />

        {lista.map((p, idx) => {
          const cx = PAD.left + larguraPasso * idx + larguraPasso / 2
          const x = cx - larguraBarra / 2
          const yA = escala(p.de)
          const yB = escala(p.ate)
          const topo = Math.min(yA, yB)
          const altura = Math.max(Math.abs(yB - yA), 2)
          const desce = p.ate < p.de
          // Rótulo sempre do lado externo da barra.
          const yRotulo = desce ? topo + altura + 13 : topo - 7

          const preenchimento =
            p.tipo === 'total' ? 'var(--color-tinta)' : p.tipo === 'subtrai' ? `url(#${id}-hachura)` : empresa.cor

          return (
            <g key={p.rotulo}>
              <title>{`${p.rotulo}: ${fmt(p.valor)} dias — ${p.explica}`}</title>

              {/* Conector para o próximo passo */}
              {idx < lista.length - 2 && (
                <line
                  x1={cx + larguraBarra / 2}
                  y1={yB}
                  x2={PAD.left + larguraPasso * (idx + 1) + larguraPasso / 2 - larguraBarra / 2}
                  y2={yB}
                  stroke="var(--color-linha-forte)"
                  strokeWidth="1"
                  strokeDasharray="2 3"
                />
              )}

              <rect
                x={x}
                y={topo}
                width={larguraBarra}
                height={altura}
                rx="3"
                fill={preenchimento}
                stroke={p.tipo === 'subtrai' ? empresa.cor : 'none'}
                strokeWidth={p.tipo === 'subtrai' ? 1.25 : 0}
              />

              <text x={cx} y={yRotulo} textAnchor="middle" className="fill-tinta font-mono" fontSize="11" fontWeight="600">
                {fmt(p.valor)}
              </text>

              <text
                x={cx}
                y={H - PAD.bottom + 17}
                textAnchor="middle"
                className={p.tipo === 'total' ? 'fill-tinta' : 'fill-cinza'}
                fontSize="11"
                fontWeight={p.tipo === 'total' ? 700 : 500}
              >
                {p.rotulo}
              </text>
            </g>
          )
        })}

        <text x={PAD.left - 8} y={PAD.top - 12} textAnchor="end" className="fill-cinza font-mono" fontSize="9">
          dias
        </text>
      </svg>
    </figure>
  )
}
