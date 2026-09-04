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
  ReferenceLine,
} from 'recharts'
import { brf, copacol, anosComuns, indicadorPorAno, type Empresa } from '../data'
import { formatDias, formatX, formatBi } from '../format'
import { grupos } from '../painel'
import { CicloWaterfall, dominioCiclo } from '../components/CicloWaterfall'
import { ComparativoBarras } from '../components/ComparativoBarras'
import { Card, TituloSecao, MolduraGrafico, TooltipCartao, EIXO, GRADE } from '../components/ui'

const ANOS_SERIE = Array.from(
  new Set([...brf.indicadores, ...copacol.indicadores].map((i) => i.ano)),
).sort()

/** Série anual de um indicador para as duas empresas, com buraco onde falta dado. */
function serie(key: 'cicloFinanceiroDias' | 'giroEstoque') {
  return ANOS_SERIE.map((a) => ({
    ano: a,
    BRF: brf.indicadores.find((i) => i.ano === a)?.[key],
    Copacol: copacol.indicadores.find((i) => i.ano === a)?.[key],
  }))
}

const CICLO_SERIE = serie('cicloFinanceiroDias')
const GIRO_SERIE = serie('giroEstoque')

export function Panorama({ ano, setAno }: { ano: number; setAno: (a: number) => void }) {
  const brfAtual = indicadorPorAno(brf, ano)
  const copacolAtual = indicadorPorAno(copacol, ano)

  const dominio = dominioCiclo([brfAtual, copacolAtual])

  const rentabilidade = [
    { metrica: 'Margem EBITDA', BRF: brfAtual.margemEbitda * 100, Copacol: copacolAtual.margemEbitda * 100 },
    { metrica: 'ROIC', BRF: brfAtual.roic * 100, Copacol: copacolAtual.roic * 100 },
  ]

  const participantes = [
    { empresa: brf, indicador: brfAtual },
    { empresa: copacol, indicador: copacolAtual },
  ]

  const receitaCresc = (empresa: Empresa) => {
    const atual = indicadorPorAno(empresa, ano)
    const anterior = empresa.indicadores.find((i) => i.ano === ano - 1)
    if (!anterior) return null
    return (atual.receitaLiquida - anterior.receitaLiquida) / anterior.receitaLiquida
  }

  const diferencaCiclo = copacolAtual.cicloFinanceiroDias - brfAtual.cicloFinanceiroDias

  return (
    <div className="space-y-14">
      {/* ---------------------------------------------------------------- */}
      {/* Abertura: a tese, e logo abaixo o mecanismo que a sustenta       */}
      {/* ---------------------------------------------------------------- */}
      <section>
        <div className="flex flex-wrap items-start justify-between gap-6">
          <div className="max-w-2xl">
            <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-petroleo">
              Setor de proteína animal · exercícios {anosComuns[0]}–{anosComuns[anosComuns.length - 1]}
            </p>
            <h1 className="mt-3 text-4xl font-extrabold leading-[1.05] tracking-tight text-tinta sm:text-5xl">
              Quem financia
              <br />
              o giro do outro?
            </h1>
            <p className="mt-5 text-base leading-relaxed text-cinza">
              Em {ano}, a BRF fecha o ciclo financeiro em{' '}
              <strong className="font-semibold text-tinta">{formatDias(brfAtual.cicloFinanceiroDias)}</strong> e a
              Copacol em <strong className="font-semibold text-tinta">{formatDias(copacolAtual.cicloFinanceiroDias)}</strong>
              {' — '}
              uma distância de {formatDias(Math.abs(diferencaCiclo))}. A cascata abaixo mostra de onde ela vem: prazo com
              fornecedor.
            </p>
          </div>

          <label className="flex shrink-0 flex-col gap-1.5">
            <span className="font-mono text-[11px] uppercase tracking-[0.15em] text-cinza">Ano de referência</span>
            <select
              value={ano}
              onChange={(e) => setAno(Number(e.target.value))}
              className="tabular cursor-pointer rounded-md border border-linha-forte bg-carta px-3 py-2 font-mono text-sm font-semibold text-tinta hover:border-petroleo"
            >
              {anosComuns.map((a) => (
                <option key={a} value={a}>
                  {a}
                </option>
              ))}
            </select>
          </label>
        </div>

        {/* Assinatura da página: a cascata do ciclo financeiro */}
        <Card className="mt-8 overflow-hidden">
          <div className="grid gap-x-8 gap-y-10 p-6 sm:p-8 md:grid-cols-2">
            <CicloWaterfall empresa={brf} indicador={brfAtual} dominio={dominio} />
            <CicloWaterfall empresa={copacol} indicador={copacolAtual} dominio={dominio} />
          </div>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 border-t border-linha bg-papel px-6 py-3 sm:px-8">
            <span className="flex items-center gap-1.5 font-mono text-[11px] text-cinza">
              <span className="inline-block h-2.5 w-2.5 rounded-[2px] bg-cinza" aria-hidden="true" />
              soma dias ao ciclo
            </span>
            <span className="flex items-center gap-1.5 font-mono text-[11px] text-cinza">
              <span className="inline-block h-2.5 w-2.5 rounded-[2px] border-[1.5px] border-cinza" aria-hidden="true" />
              subtrai dias do ciclo
            </span>
            <span className="flex items-center gap-1.5 font-mono text-[11px] text-cinza">
              <span className="inline-block h-2.5 w-2.5 rounded-[2px] bg-tinta" aria-hidden="true" />
              ciclo resultante
            </span>
          </div>
        </Card>
      </section>

      {/* ---------------------------------------------------------------- */}
      {/* Identificação das duas empresas                                   */}
      {/* ---------------------------------------------------------------- */}
      <section>
        <TituloSecao titulo="As duas empresas" descricao={`Porte e crescimento em ${ano}.`} />
        <div className="grid gap-4 sm:grid-cols-2">
          {[brf, copacol].map((empresa) => {
            const atual = indicadorPorAno(empresa, ano)
            const cresc = receitaCresc(empresa)
            return (
              <Card key={empresa.id} className="relative overflow-hidden p-6">
                <span className="absolute inset-y-0 left-0 w-1" style={{ backgroundColor: empresa.cor }} aria-hidden="true" />
                <p
                  className="inline-block rounded-[3px] px-2 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-[0.12em]"
                  style={{ backgroundColor: empresa.corSuave, color: empresa.cor }}
                >
                  {empresa.nomeCurto}
                </p>
                <h3 className="mt-2.5 text-lg font-bold tracking-tight text-tinta">{empresa.nome}</h3>
                <p className="mt-0.5 text-xs text-cinza">{empresa.subtitulo}</p>
                <p className="tabular mt-5 font-mono text-3xl font-semibold text-tinta">{formatBi(atual.receitaLiquida)}</p>
                <p className="mt-1 text-xs text-cinza">
                  Receita líquida de {ano}
                  {cresc !== null && (
                    <>
                      {' · '}
                      <span className="tabular font-mono font-semibold text-tinta">
                        {cresc >= 0 ? '+' : '−'}
                        {Math.abs(cresc * 100).toFixed(1)}%
                      </span>{' '}
                      vs. {ano - 1}
                    </>
                  )}
                </p>
              </Card>
            )
          })}
        </div>
      </section>

      {/* ---------------------------------------------------------------- */}
      {/* Séries e comparativos                                             */}
      {/* ---------------------------------------------------------------- */}
      <section>
        <TituloSecao
          titulo="Séries e comparativos"
          descricao="Evolução no tempo e recorte do ano selecionado. As duas empresas mantêm a mesma cor em todos os gráficos."
        />
        <div className="grid gap-4 lg:grid-cols-2">
          <MolduraGrafico
            titulo="Ciclo financeiro ao longo do tempo"
            descricao="PME + PMR − PMP, em dias. Abaixo da linha do zero, o fornecedor financia a operação."
            legenda={[
              { rotulo: 'BRF', cor: brf.cor },
              { rotulo: 'Copacol', cor: copacol.cor },
            ]}
          >
            <ResponsiveContainer width="100%" height={230}>
              <LineChart data={CICLO_SERIE} margin={{ top: 6, right: 12, left: -14, bottom: 0 }}>
                <CartesianGrid {...GRADE} vertical={false} />
                <XAxis dataKey="ano" {...EIXO} />
                <YAxis {...EIXO} width={46} />
                <ReferenceLine y={0} stroke="#171717" strokeWidth={1.25} />
                <Tooltip cursor={{ stroke: '#d2ccbe', strokeWidth: 1 }} content={<TooltipCartao format={formatDias} />} />
                <Line type="monotone" dataKey="BRF" stroke={brf.cor} strokeWidth={2} dot={{ r: 4, strokeWidth: 2, stroke: '#fffefb' }} connectNulls isAnimationActive={false} />
                <Line type="monotone" dataKey="Copacol" stroke={copacol.cor} strokeWidth={2} dot={{ r: 4, strokeWidth: 2, stroke: '#fffefb' }} connectNulls isAnimationActive={false} />
              </LineChart>
            </ResponsiveContainer>
          </MolduraGrafico>

          <MolduraGrafico
            titulo="Giro do estoque ao longo do tempo"
            descricao="Quantas vezes o estoque é vendido e reposto por ano. Quanto maior, mais eficiente."
            legenda={[
              { rotulo: 'BRF', cor: brf.cor },
              { rotulo: 'Copacol', cor: copacol.cor },
            ]}
          >
            <ResponsiveContainer width="100%" height={230}>
              <LineChart data={GIRO_SERIE} margin={{ top: 6, right: 12, left: -14, bottom: 0 }}>
                <CartesianGrid {...GRADE} vertical={false} />
                <XAxis dataKey="ano" {...EIXO} />
                <YAxis {...EIXO} width={46} domain={[0, 'auto']} />
                <Tooltip cursor={{ stroke: '#d2ccbe', strokeWidth: 1 }} content={<TooltipCartao format={formatX} />} />
                <Line type="monotone" dataKey="BRF" stroke={brf.cor} strokeWidth={2} dot={{ r: 4, strokeWidth: 2, stroke: '#fffefb' }} connectNulls isAnimationActive={false} />
                <Line type="monotone" dataKey="Copacol" stroke={copacol.cor} strokeWidth={2} dot={{ r: 4, strokeWidth: 2, stroke: '#fffefb' }} connectNulls isAnimationActive={false} />
              </LineChart>
            </ResponsiveContainer>
          </MolduraGrafico>

          <MolduraGrafico
            titulo={`Rentabilidade em ${ano}`}
            descricao="Margem EBITDA e ROIC. As duas medidas estão em porcentagem, então dividem o mesmo eixo."
            legenda={[
              { rotulo: 'BRF', cor: brf.cor },
              { rotulo: 'Copacol', cor: copacol.cor },
            ]}
          >
            <ResponsiveContainer width="100%" height={230}>
              <BarChart data={rentabilidade} margin={{ top: 6, right: 12, left: -14, bottom: 0 }} barGap={2}>
                <CartesianGrid {...GRADE} vertical={false} />
                <XAxis dataKey="metrica" {...EIXO} />
                <YAxis {...EIXO} width={46} tickFormatter={(v) => `${v}%`} />
                <ReferenceLine y={0} stroke="#171717" strokeWidth={1.25} />
                <Tooltip cursor={{ fill: 'rgba(23,23,23,0.04)' }} content={<TooltipCartao format={(v) => `${v.toFixed(1)}%`} />} />
                <Bar dataKey="BRF" fill={brf.cor} radius={[3, 3, 0, 0]} maxBarSize={54} isAnimationActive={false} />
                <Bar dataKey="Copacol" fill={copacol.cor} radius={[3, 3, 0, 0]} maxBarSize={54} isAnimationActive={false} />
              </BarChart>
            </ResponsiveContainer>
          </MolduraGrafico>

        </div>
      </section>

      {/* ---------------------------------------------------------------- */}
      {/* Recorte do ano, por bloco temático                                */}
      {/* ---------------------------------------------------------------- */}
      <section>
        <TituloSecao
          titulo={`Indicadores de ${ano}`}
          descricao="Quatro blocos temáticos. Indicadores que dependem de dados operacionais fora das demonstrações financeiras aparecem marcados como sem dado."
        />
        <div className="grid gap-4 xl:grid-cols-2">
          {grupos.map((grupo) => (
            <ComparativoBarras key={grupo.id} grupo={grupo} participantes={participantes} ano={ano} />
          ))}
        </div>
      </section>
    </div>
  )
}
