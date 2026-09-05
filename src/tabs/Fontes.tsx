import { ArrowTopRightOnSquareIcon } from '@heroicons/react/20/solid'
import { referencias, gruposReferencia, type ReferenciaABNT } from '../referencias'
import { Card, TituloSecao } from '../components/ui'

/**
 * Renderiza uma referência no formato ABNT NBR 6023:2018.
 * AUTOR. **Título**: subtítulo. Local: Editora, ano. Complemento.
 * Disponível em: URL. Acesso em: data.
 */
function Referencia({ r }: { r: ReferenciaABNT }) {
  return (
    <li className="border-l-2 border-linha-forte py-1 pl-4 hover:border-petroleo">
      <p className="text-sm leading-[1.7] text-tinta">
        {r.autor}. <strong className="font-bold">{r.titulo}</strong>
        {r.subtitulo && <>: {r.subtitulo}</>}. {r.local}: {r.editora}, {r.ano}.
        {r.complemento && <> {r.complemento}.</>}
        {r.url && (
          <>
            {' '}
            Disponível em:{' '}
            <a
              href={r.url}
              target="_blank"
              rel="noreferrer noopener"
              className="inline-flex items-baseline gap-0.5 break-all font-medium text-petroleo underline decoration-petroleo/30 underline-offset-2 hover:decoration-petroleo"
            >
              {r.url}
              <ArrowTopRightOnSquareIcon className="h-3 w-3 shrink-0 translate-y-px" aria-hidden="true" />
            </a>
            . Acesso em: {r.acesso}.
          </>
        )}
      </p>
      {r.nota && <p className="mt-1.5 font-mono text-[11px] leading-relaxed text-cinza">{r.nota}</p>}
    </li>
  )
}

export function Fontes() {
  return (
    <div className="space-y-12">
      <TituloSecao
        titulo="Fontes de dados"
        descricao="Todo número deste painel vem de um dos documentos abaixo. As referências seguem a ABNT NBR 6023:2018 e estão agrupadas pela empresa de origem."
      />

      {gruposReferencia.map((grupo) => {
        const itens = referencias.filter((r) => r.grupo === grupo.id)
        if (itens.length === 0) return null
        return (
          <section key={grupo.id}>
            <div className="mb-4">
              <h3 className="font-mono text-[11px] font-semibold uppercase tracking-[0.16em] text-petroleo">
                {grupo.titulo}
              </h3>
              <p className="mt-1.5 max-w-2xl text-sm leading-relaxed text-cinza">{grupo.descricao}</p>
            </div>
            <Card className="p-5 sm:p-6">
              <ul className="space-y-5">
                {itens.map((r) => (
                  <Referencia key={r.id} r={r} />
                ))}
              </ul>
            </Card>
          </section>
        )
      })}

      <section>
        <div className="mb-4">
          <h3 className="font-mono text-[11px] font-semibold uppercase tracking-[0.16em] text-brasa">
            Como verificar
          </h3>
        </div>
        <Card className="p-5 sm:p-6">
          <ol className="space-y-4 text-sm leading-relaxed text-cinza">
            <li className="flex gap-3">
              <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-tinta font-mono text-[10px] font-semibold text-papel">
                1
              </span>
              <span>
                Baixe o arquivo <code className="rounded bg-papel px-1 py-0.5 font-mono text-xs text-tinta">dfp_cia_aberta_&#123;ano+1&#125;.zip</code>{' '}
                no portal de dados abertos da CVM. Cada exercício da BRF está no pacote do ano seguinte.
              </span>
            </li>
            <li className="flex gap-3">
              <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-tinta font-mono text-[10px] font-semibold text-papel">
                2
              </span>
              <span>
                Filtre por <code className="rounded bg-papel px-1 py-0.5 font-mono text-xs text-tinta">CD_CVM = 016292</code>{' '}
                e <code className="rounded bg-papel px-1 py-0.5 font-mono text-xs text-tinta">ORDEM_EXERC = ÚLTIMO</code>{' '}
                nos CSVs de BPA, BPP, DRE e DFC_MI consolidados.
              </span>
            </li>
            <li className="flex gap-3">
              <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-tinta font-mono text-[10px] font-semibold text-papel">
                3
              </span>
              <span>
                Os números da Copacol vêm de PDFs que a cooperativa não publica de forma indexável. Peça os relatórios
                diretamente à Copacol para conferir linha a linha.
              </span>
            </li>
          </ol>
        </Card>
      </section>
    </div>
  )
}
