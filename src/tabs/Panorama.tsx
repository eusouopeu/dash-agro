import {
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ReferenceLine,
} from 'recharts'
import {
  brf,
  copacol,
  cvale,
  empresas,
  anosComuns,
  indicadorPorAno,
  comBaseCalculo,
  type Empresa,
  type AnnualIndicators,
  type BaseCalculo,
} from '../data'
import { formatDias, formatX, formatBi, formatPct } from '../format'
import { grupos } from '../painel'
import { CicloWaterfall, dominioCiclo } from '../components/CicloWaterfall'
import { ComparativoBarras } from '../components/ComparativoBarras'
import { Card, TituloSecao, MolduraGrafico, TooltipCartao, SeletorBaseCalculo, EIXO, GRADE } from '../components/ui'

const ANOS_SERIE = Array.from(
  new Set(empresas.flatMap((e) => e.indicadores.map((i) => i.ano))),
).sort()

const LEGENDA = empresas.map((e) => ({ rotulo: e.nomeCurto, cor: e.cor }))

/** Série anual de um indicador para as três empresas, com buraco onde falta dado. */
function serie(key: keyof AnnualIndicators, base: BaseCalculo, escala = 1) {
  return ANOS_SERIE.map((a) => {
    const linha: Record<string, number | undefined> = { ano: a }
    for (const e of empresas) {
      const i = e.indicadores.find((x) => x.ano === a)
      const valor = i ? (comBaseCalculo(i, base)[key] as number) : undefined
      linha[e.nomeCurto] = valor === undefined ? undefined : valor * escala
    }
    return linha
  })
}

const AJUDA_CICLO = {
  titulo: 'Ciclo financeiro',
  formula: 'PME + PMR − PMP',
  explicacao: 'Quanto menor o ciclo financeiro, menos dias de caixa próprio a operação prende entre pagar o fornecedor e receber do cliente — negativo significa que o fornecedor financia o giro.',
}
const AJUDA_GIRO_ESTOQUE = {
  titulo: 'Giro do estoque',
  formula: 'CMV ÷ Estoques',
  explicacao: 'Quanto maior o giro do estoque, mais vezes por ano o estoque é vendido e reposto.',
}
const AJUDA_NCG = {
  titulo: 'NCG sobre receita',
  formula: '(Contas a Receber + Estoques − Fornecedores) ÷ Receita Líquida',
  explicacao: 'Quanto menor a NCG sobre receita, menos capital de giro a operação prende — negativa significa que o fornecedor financia o giro, não o caixa próprio da empresa.',
}
const AJUDA_CONVERSAO_CAIXA = {
  titulo: 'Conversão de caixa',
  formula: 'Fluxo de Caixa Operacional ÷ EBITDA',
  explicacao: 'Quanto maior a conversão de caixa, maior a proporção do EBITDA que de fato vira caixa — bem abaixo de 1,0x sinaliza lucro que ainda não virou dinheiro.',
}

export function Panorama({
  ano,
  setAno,
  base,
  setBase,
}: {
  ano: number
  setAno: (a: number) => void
  base: BaseCalculo
  setBase: (b: BaseCalculo) => void
}) {
  const atuais = empresas.map((empresa) => ({
    empresa,
    indicador: comBaseCalculo(indicadorPorAno(empresa, ano), base),
  }))
  const brfAtual = comBaseCalculo(indicadorPorAno(brf, ano), base)
  const copacolAtual = comBaseCalculo(indicadorPorAno(copacol, ano), base)
  const cvaleAtual = comBaseCalculo(indicadorPorAno(cvale, ano), base)

  const dominio = dominioCiclo(atuais.map((a) => a.indicador))

  const participantes = atuais

  const receitaCresc = (empresa: Empresa) => {
    const atual = indicadorPorAno(empresa, ano)
    const anterior = empresa.indicadores.find((i) => i.ano === ano - 1)
    if (!anterior) return null
    return (atual.receitaLiquida - anterior.receitaLiquida) / anterior.receitaLiquida
  }

  // A cooperativa com o ciclo mais longo, para nomear o extremo oposto da BRF.
  const cicloMaisLongo = [copacolAtual, cvaleAtual].reduce((a, b) =>
    a.cicloFinanceiroDias >= b.cicloFinanceiroDias ? a : b,
  )
  const empresaCicloMaisLongo = cicloMaisLongo === copacolAtual ? copacol : cvale
  const diferencaCiclo = cicloMaisLongo.cicloFinanceiroDias - brfAtual.cicloFinanceiroDias

  return (
    <div className="space-y-14">
      {/* ---------------------------------------------------------------- */}
      {/* Abertura: a tese                                                  */}
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
              <strong className="font-semibold text-tinta">{formatDias(brfAtual.cicloFinanceiroDias)}</strong> e a{' '}
              {empresaCicloMaisLongo.nomeCurto} em{' '}
              <strong className="font-semibold text-tinta">{formatDias(cicloMaisLongo.cicloFinanceiroDias)}</strong>
              {' — '}
              uma distância de {formatDias(Math.abs(diferencaCiclo))}. Mais abaixo, as cascatas mostram de onde ela
              vem: prazo com fornecedor.
            </p>
            <p className="mt-3 text-base leading-relaxed text-cinza">
              Em capital de giro isso equivale a NCG de{' '}
              <strong className="font-semibold text-tinta">{formatPct(brfAtual.ncgSobreReceita)}</strong> da receita
              para a BRF (negativa: o fornecedor financia o giro) contra{' '}
              <strong className="font-semibold text-tinta">{formatPct(cicloMaisLongo.ncgSobreReceita)}</strong> da
              receita presos na operação da {empresaCicloMaisLongo.nomeCurto}.
            </p>
          </div>

          <div className="flex shrink-0 flex-wrap items-start gap-4">
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
            <SeletorBaseCalculo valor={base} onChange={setBase} />
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------------- */}
      {/* 1. Identificação das três empresas                                */}
      {/* ---------------------------------------------------------------- */}
      <section>
        <TituloSecao titulo="As três empresas" descricao={`Porte e crescimento em ${ano}.`} />
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {empresas.map((empresa) => {
            const atual = indicadorPorAno(empresa, ano)
            const cresc = receitaCresc(empresa)
            return (
              <Card key={empresa.id} className="relative overflow-hidden pt-1">
                <span className="absolute inset-x-0 top-0 h-1" style={{ backgroundColor: empresa.cor }} aria-hidden="true" />
                <div className="p-6">
                  <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.14em]" style={{ color: empresa.cor }}>
                    {empresa.subtitulo}
                  </p>
                  <h3 className="mt-2 text-lg font-bold tracking-tight text-tinta">{empresa.nome}</h3>

                  <p className="tabular mt-5 font-mono text-3xl font-semibold text-tinta">{formatBi(atual.receitaLiquida)}</p>
                  <p className="mt-1 font-mono text-[11px] uppercase tracking-[0.1em] text-cinza">
                    Receita líquida
                    {cresc !== null && (
                      <span className="ml-1.5 normal-case tracking-normal text-tinta">
                        <span className="tabular font-semibold">
                          {cresc >= 0 ? '+' : '−'}
                          {Math.abs(cresc * 100).toFixed(1)}%
                        </span>{' '}
                        vs. {ano - 1}
                      </span>
                    )}
                  </p>

                  <div className="mt-5 grid grid-cols-2 gap-4 border-t border-linha pt-4">
                    <div>
                      <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-cinza">Ativo total</p>
                      <p className="tabular mt-1 font-mono text-sm font-semibold text-tinta">{formatBi(atual.ativoTotal)}</p>
                    </div>
                    <div>
                      <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-cinza">Patrimônio líquido</p>
                      <p className="tabular mt-1 font-mono text-sm font-semibold text-tinta">{formatBi(atual.patrimonioLiquido)}</p>
                    </div>
                  </div>
                </div>
              </Card>
            )
          })}
        </div>
      </section>

      {/* ---------------------------------------------------------------- */}
      {/* 2. Recorte do ano, por bloco temático                             */}
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

      {/* ---------------------------------------------------------------- */}
      {/* 3. Cascata do ciclo financeiro, por empresa                       */}
      {/* ---------------------------------------------------------------- */}
      <section>
        <TituloSecao
          titulo="Ciclo financeiro por empresa"
          descricao={`Cascata de PME + PMR − PMP em ${ano}, a origem dos dias de ciclo de cada empresa.`}
        />
        <Card className="overflow-hidden">
          <div className="grid gap-x-8 gap-y-10 p-6 sm:p-8 md:grid-cols-2 xl:grid-cols-3">
            {atuais.map(({ empresa, indicador }) => (
              <CicloWaterfall key={empresa.id} empresa={empresa} indicador={indicador} dominio={dominio} />
            ))}
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
            <span className="ml-auto font-mono text-[11px] text-cinza">
              base de cálculo: {base === 'final' ? 'saldo final' : 'saldo médio'}
            </span>
          </div>
        </Card>
      </section>

      {/* ---------------------------------------------------------------- */}
      {/* 4. Séries e comparativos                                          */}
      {/* ---------------------------------------------------------------- */}
      <section>
        <TituloSecao
          titulo="Séries e comparativos"
          descricao="Evolução no tempo. As três empresas mantêm a mesma cor em todos os gráficos."
        />
        <div className="grid gap-4 lg:grid-cols-2">
          <MolduraGrafico titulo="Ciclo financeiro" unidade="dias" legenda={LEGENDA} ajuda={[AJUDA_CICLO]}>
            <ResponsiveContainer width="100%" height={230}>
              <LineChart data={serie('cicloFinanceiroDias', base)} margin={{ top: 6, right: 12, left: -14, bottom: 0 }}>
                <CartesianGrid {...GRADE} vertical={false} />
                <XAxis dataKey="ano" {...EIXO} />
                <YAxis {...EIXO} width={46} />
                <ReferenceLine y={0} stroke="#171717" strokeWidth={1.25} />
                <Tooltip cursor={{ stroke: '#d2ccbe', strokeWidth: 1 }} content={<TooltipCartao format={formatDias} />} />
                {empresas.map((e) => (
                  <Line key={e.id} type="monotone" dataKey={e.nomeCurto} stroke={e.cor} strokeWidth={2} dot={{ r: 4, strokeWidth: 2, stroke: '#fffefb' }} connectNulls isAnimationActive={false} />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </MolduraGrafico>

          <MolduraGrafico titulo="Giro do estoque" unidade="x ao ano" legenda={LEGENDA} ajuda={[AJUDA_GIRO_ESTOQUE]}>
            <ResponsiveContainer width="100%" height={230}>
              <LineChart data={serie('giroEstoque', base)} margin={{ top: 6, right: 12, left: -14, bottom: 0 }}>
                <CartesianGrid {...GRADE} vertical={false} />
                <XAxis dataKey="ano" {...EIXO} />
                <YAxis {...EIXO} width={46} domain={[0, 'auto']} />
                <Tooltip cursor={{ stroke: '#d2ccbe', strokeWidth: 1 }} content={<TooltipCartao format={formatX} />} />
                {empresas.map((e) => (
                  <Line key={e.id} type="monotone" dataKey={e.nomeCurto} stroke={e.cor} strokeWidth={2} dot={{ r: 4, strokeWidth: 2, stroke: '#fffefb' }} connectNulls isAnimationActive={false} />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </MolduraGrafico>

          <MolduraGrafico titulo="NCG sobre receita" unidade="% da receita" legenda={LEGENDA} ajuda={[AJUDA_NCG]}>
            <ResponsiveContainer width="100%" height={230}>
              <LineChart data={serie('ncgSobreReceita', base, 100)} margin={{ top: 6, right: 12, left: -14, bottom: 0 }}>
                <CartesianGrid {...GRADE} vertical={false} />
                <XAxis dataKey="ano" {...EIXO} />
                <YAxis {...EIXO} width={46} tickFormatter={(v) => `${v}%`} />
                <ReferenceLine y={0} stroke="#171717" strokeWidth={1.25} />
                <Tooltip cursor={{ stroke: '#d2ccbe', strokeWidth: 1 }} content={<TooltipCartao format={(v) => `${v.toFixed(1)}%`} />} />
                {empresas.map((e) => (
                  <Line key={e.id} type="monotone" dataKey={e.nomeCurto} stroke={e.cor} strokeWidth={2} dot={{ r: 4, strokeWidth: 2, stroke: '#fffefb' }} connectNulls isAnimationActive={false} />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </MolduraGrafico>

          <MolduraGrafico titulo="Conversão de caixa" unidade="x EBITDA" legenda={LEGENDA} ajuda={[AJUDA_CONVERSAO_CAIXA]}>
            <ResponsiveContainer width="100%" height={230}>
              <LineChart data={serie('conversaoCaixa', base)} margin={{ top: 6, right: 12, left: -14, bottom: 0 }}>
                <CartesianGrid {...GRADE} vertical={false} />
                <XAxis dataKey="ano" {...EIXO} />
                <YAxis {...EIXO} width={46} />
                <ReferenceLine y={1} stroke="#171717" strokeWidth={1.25} strokeDasharray="4 3" />
                <Tooltip cursor={{ stroke: '#d2ccbe', strokeWidth: 1 }} content={<TooltipCartao format={formatX} />} />
                {empresas.map((e) => (
                  <Line key={e.id} type="monotone" dataKey={e.nomeCurto} stroke={e.cor} strokeWidth={2} dot={{ r: 4, strokeWidth: 2, stroke: '#fffefb' }} connectNulls isAnimationActive={false} />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </MolduraGrafico>
        </div>
      </section>
    </div>
  )
}
