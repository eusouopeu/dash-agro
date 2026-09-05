import { ArrowDownTrayIcon } from '@heroicons/react/24/outline'
import { empresas, todosAnos, indicadorOpcional, comBaseCalculo, type Empresa, type BaseCalculo } from '../data'
import { ROWS, type IndicatorRow } from '../format'
import { Card, TituloSecao, InfoPopover, SeletorBaseCalculo } from '../components/ui'

interface Celula {
  row: IndicatorRow
  valor: number | null
}

interface Linha {
  empresa: Empresa
  celulas: Celula[]
}

/**
 * Ponto e vírgula como separador e BOM no início: é o que faz o Excel em português
 * abrir o arquivo já com as colunas separadas e os acentos corretos.
 */
function downloadCsv(ano: number, linhas: Linha[]) {
  const header = ['Instituição', ...ROWS.map((r) => `${r.label} (${r.unit})`)]
  const body = linhas.map((l) => [
    l.empresa.nomeCurto,
    ...l.celulas.map((c) => (c.valor === null ? '' : c.row.csv(c.valor))),
  ])
  const csv = [header, ...body].map((line) => line.join(';')).join('\r\n')

  const blob = new Blob([`﻿${csv}`], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `indicadores-${ano}.csv`
  link.click()
  // Revogar no mesmo tick cancela o download em alguns navegadores.
  setTimeout(() => URL.revokeObjectURL(url), 1000)
}

function TabelaAno({ ano, base }: { ano: number; base: BaseCalculo }) {
  const presentes = empresas.filter((e) => indicadorOpcional(e, ano) !== null)

  const linhas: Linha[] = empresas.map((empresa) => {
    const bruto = indicadorOpcional(empresa, ano)
    const atual = bruto ? comBaseCalculo(bruto, base) : null
    return {
      empresa,
      celulas: ROWS.map((row) => ({
        row,
        valor: atual ? (atual[row.key] as number) : null,
      })),
    }
  })

  return (
    <Card className="overflow-hidden">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-linha bg-papel px-6 py-5">
        <div>
          <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-cinza">Exercício</p>
          <p className="tabular mt-0.5 font-mono text-3xl font-bold tracking-tight text-tinta">{ano}</p>
        </div>
        <button
          type="button"
          onClick={() => downloadCsv(ano, linhas)}
          className="flex items-center gap-2 rounded-md border border-linha px-3 py-1.5 font-mono text-[11px] font-medium uppercase tracking-[0.08em] text-cinza transition-colors hover:border-petroleo hover:text-petroleo"
        >
          <ArrowDownTrayIcon className="h-3.5 w-3.5" />
          Baixar CSV
        </button>
      </div>

      {presentes.length < empresas.length && (
        <p className="border-b border-linha bg-papel px-6 py-2 font-mono text-[11px] text-cinza">
          Com dado neste exercício: {presentes.map((e) => e.nomeCurto).join(', ')}
        </p>
      )}

      <div className="overflow-x-auto">
        <table className="w-full min-w-[1200px] border-collapse text-sm">
          <caption className="sr-only">Indicadores operacionais das três empresas no exercício de {ano}.</caption>
          <thead>
            <tr className="border-b border-linha">
              <th scope="col" className="w-40 px-6 py-3 text-left font-mono text-[11px] font-semibold uppercase tracking-[0.1em] text-cinza">
                Instituição
              </th>
              {ROWS.map((row) => (
                <th key={row.key} scope="col" className="w-28 whitespace-nowrap px-4 py-3 text-right">
                  <span className="flex items-center justify-end gap-1 font-mono text-[11px] font-semibold uppercase tracking-[0.08em] text-cinza">
                    {row.curto}
                    <InfoPopover titulo={row.label} formula={row.formula} explicacao={row.explicacao} />
                  </span>
                  <span className="mt-0.5 block text-right font-mono text-[10px] normal-case tracking-normal text-cinza/70">
                    {row.unit}
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {linhas.map((l) => (
              <tr key={l.empresa.id} className="relative border-b border-linha last:border-0 hover:bg-papel">
                <th scope="row" className="relative whitespace-nowrap px-6 py-4 text-left font-normal">
                  <span className="absolute inset-y-0 left-0 w-1" style={{ backgroundColor: l.empresa.cor }} aria-hidden="true" />
                  <span className="font-semibold text-tinta">{l.empresa.nomeCurto}</span>
                </th>
                {l.celulas.map(({ row, valor }) => (
                  <td key={row.key} className="whitespace-nowrap px-4 py-4 text-right">
                    {valor === null ? (
                      <span className="font-mono text-sm text-cinza">—</span>
                    ) : (
                      <span className="tabular font-mono text-sm font-semibold text-tinta">{row.format(valor)}</span>
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

export function Tabelas({ base, setBase }: { base: BaseCalculo; setBase: (b: BaseCalculo) => void }) {
  return (
    <div className="space-y-10">
      <div className="flex flex-wrap items-start justify-between gap-6">
        <TituloSecao
          titulo="Indicadores por exercício"
          descricao="Uma tabela por ano, com o valor de cada indicador para as três empresas."
        />
        <SeletorBaseCalculo valor={base} onChange={setBase} />
      </div>

      <p className="-mt-4 rounded-md border border-linha bg-carta px-4 py-3 text-xs leading-relaxed text-cinza">
        <strong className="font-semibold text-tinta">Sobre a base de cálculo:</strong> "saldo final" usa o saldo de
        estoques, contas a receber e fornecedores no fim do próprio exercício; "saldo médio" usa a média com o saldo
        do exercício anterior, convenção mais comum para indicadores de prazo. No primeiro exercício de cada empresa
        não há saldo anterior na base, então a tabela mantém o saldo final mesmo com "saldo médio" selecionado.
      </p>

      {todosAnos.map((ano) => (
        <TabelaAno key={ano} ano={ano} base={base} />
      ))}
    </div>
  )
}
