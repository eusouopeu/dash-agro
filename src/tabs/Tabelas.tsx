import { useMemo, useState } from 'react'
import { ChevronUpIcon, ChevronDownIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid'
import { empresas, todosAnos, indicadorOpcional, type Empresa } from '../data'
import { ROWS, formatDelta, type IndicatorRow } from '../format'
import { Card, TituloSecao, Sparkline } from '../components/ui'

/** 'indicador' ou o id de uma empresa. */
type ColunaKey = string
type Direcao = 'asc' | 'desc'

interface Celula {
  empresa: Empresa
  valor: number | null
  delta: number | null
}

interface Linha {
  row: IndicatorRow
  celulas: Celula[]
}

const COLUNAS: { key: ColunaKey; rotulo: string; alinha: 'left' | 'right' }[] = [
  { key: 'indicador', rotulo: 'Indicador', alinha: 'left' },
  ...empresas.map((e) => ({ key: e.id, rotulo: e.nomeCurto, alinha: 'right' as const })),
]

function TabelaAno({ ano }: { ano: number }) {
  const [coluna, setColuna] = useState<ColunaKey>('indicador')
  const [direcao, setDirecao] = useState<Direcao>('asc')

  const presentes = empresas.filter((e) => indicadorOpcional(e, ano) !== null)

  const linhas: Linha[] = ROWS.map((row) => ({
    row,
    celulas: empresas.map((empresa) => {
      const atual = indicadorOpcional(empresa, ano)
      const anterior = indicadorOpcional(empresa, ano - 1)
      const valor = atual ? (atual[row.key] as number) : null
      return {
        empresa,
        valor,
        delta: atual && anterior ? valor! - (anterior[row.key] as number) : null,
      }
    }),
  }))

  const ordenadas = useMemo(() => {
    const sinal = direcao === 'asc' ? 1 : -1
    return [...linhas].sort((x, y) => {
      if (coluna === 'indicador') return sinal * x.row.label.localeCompare(y.row.label, 'pt-BR')
      const vx = x.celulas.find((c) => c.empresa.id === coluna)?.valor ?? null
      const vy = y.celulas.find((c) => c.empresa.id === coluna)?.valor ?? null
      // Linhas sem dado vão sempre para o fim, independente da direção.
      if (vx === null && vy === null) return 0
      if (vx === null) return 1
      if (vy === null) return -1
      return sinal * (vx - vy)
    })
  }, [linhas, coluna, direcao])

  const clicar = (k: ColunaKey) => {
    if (k === coluna) setDirecao(direcao === 'asc' ? 'desc' : 'asc')
    else {
      setColuna(k)
      setDirecao('asc')
    }
  }

  return (
    <Card className="overflow-hidden">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-linha bg-papel px-5 py-3">
        <h3 className="tabular font-mono text-lg font-semibold tracking-tight text-tinta">{ano}</h3>
        <p className="font-mono text-[11px] text-cinza">
          {presentes.length === empresas.length
            ? `As três empresas · variação contra ${ano - 1}`
            : `Com dado neste exercício: ${presentes.map((e) => e.nomeCurto).join(', ')}`}
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[820px] border-collapse text-sm">
          <caption className="sr-only">
            Indicadores operacionais no exercício de {ano}. Clique no título de uma coluna para ordenar.
          </caption>
          <thead>
            <tr className="border-b border-linha">
              {COLUNAS.map((col) => {
                const ativa = coluna === col.key
                const Icone = ativa ? (direcao === 'asc' ? ChevronUpIcon : ChevronDownIcon) : ChevronUpDownIcon
                return (
                  <th
                    key={col.key}
                    scope="col"
                    aria-sort={ativa ? (direcao === 'asc' ? 'ascending' : 'descending') : 'none'}
                    className={`px-4 py-0 ${col.alinha === 'right' ? 'text-right' : 'text-left'}`}
                  >
                    <button
                      type="button"
                      onClick={() => clicar(col.key)}
                      className={`group flex w-full items-center gap-1 py-2.5 font-mono text-[11px] font-semibold uppercase tracking-[0.1em] hover:text-petroleo ${
                        col.alinha === 'right' ? 'justify-end' : 'justify-start'
                      } ${ativa ? 'text-petroleo' : 'text-cinza'}`}
                      title={`Ordenar por ${col.rotulo}`}
                    >
                      {col.rotulo}
                      <Icone
                        className={`h-3.5 w-3.5 shrink-0 ${ativa ? 'opacity-100' : 'opacity-30 group-hover:opacity-70'}`}
                        aria-hidden="true"
                      />
                    </button>
                  </th>
                )
              })}
            </tr>
          </thead>
          <tbody>
            {ordenadas.map((l) => (
              <tr key={l.row.key} className="border-b border-linha last:border-0 hover:bg-papel">
                <th scope="row" className="px-4 py-3 text-left font-normal">
                  <span className="flex items-center gap-2.5">
                    <l.row.icon className="h-4 w-4 shrink-0 text-cinza" aria-hidden="true" />
                    <span className="font-medium text-tinta">{l.row.label}</span>
                  </span>
                </th>

                {l.celulas.map(({ empresa, valor, delta }) => (
                  <td key={empresa.id} className="px-4 py-3 text-right">
                    {valor === null ? (
                      <span className="font-mono text-sm text-cinza">—</span>
                    ) : (
                      <span className="flex items-center justify-end gap-2.5">
                        <Sparkline empresa={empresa} dataKey={l.row.key} />
                        <span>
                          <span className="tabular block font-mono text-sm font-semibold text-tinta">
                            {l.row.format(valor)}
                          </span>
                          <span className="tabular block font-mono text-[10px] text-cinza">
                            {delta === null ? `sem ${ano - 1}` : `${formatDelta(delta, l.row.format)} vs. ${ano - 1}`}
                          </span>
                        </span>
                      </span>
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  )
}

export function Tabelas() {
  return (
    <div className="space-y-10">
      <TituloSecao
        titulo="Indicadores por exercício"
        descricao="Uma tabela por ano, com o valor de cada indicador e a variação contra o exercício anterior. Clique no título de qualquer coluna para ordenar em ordem crescente, e de novo para decrescente."
      />

      <p className="-mt-4 rounded-md border border-linha bg-carta px-4 py-3 text-xs leading-relaxed text-cinza">
        <strong className="font-semibold text-tinta">Sobre ordenar pelas colunas das empresas:</strong> a ordenação é
        pelo valor numérico bruto, e os indicadores têm unidades diferentes — dias, múltiplos e porcentagens acabam
        misturados na mesma escala. É útil para achar o maior ou o menor número da coluna, não para ranquear
        desempenho.
      </p>

      {todosAnos.map((ano) => (
        <TabelaAno key={ano} ano={ano} />
      ))}
    </div>
  )
}
