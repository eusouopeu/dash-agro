import { ArrowDownIcon, ArrowUpIcon, MinusIcon } from '@heroicons/react/20/solid'
import { CalculatorIcon } from '@heroicons/react/24/outline'
import { formulas, formulasParciais, premissas, limitacoes, type Formula } from '../metodologia'
import { ROWS } from '../format'
import { Card, TituloSecao } from '../components/ui'

type IconeComponente = React.ComponentType<React.SVGProps<SVGSVGElement>>

const ICONE_POR_KEY: Partial<Record<string, IconeComponente>> = Object.fromEntries(
  ROWS.map((r) => [r.key, r.icon]),
)

function CartaoFormula({ f }: { f: Formula }) {
  // Nem todo indicador calculado aparece na tabela comparativa (a NCG, por
  // exemplo), então cai num ícone genérico para os cartões não desalinharem.
  const Icone = ICONE_POR_KEY[f.key] ?? CalculatorIcon
  return (
    <Card className="flex flex-col p-5">
      <div className="flex items-start gap-2.5">
        <Icone className="mt-0.5 h-4 w-4 shrink-0 text-petroleo" aria-hidden="true" />
        <div className="min-w-0 flex-1">
          <h3 className="text-sm font-bold leading-snug tracking-tight text-tinta">{f.nome}</h3>
          {f.sigla && <p className="mt-0.5 font-mono text-[11px] text-cinza">{f.sigla}</p>}
        </div>
      </div>

      {/* A fórmula, desenhada como fração de verdade */}
      <div className="my-5 flex flex-1 items-center justify-center rounded-md bg-papel px-4 py-5">
        {f.expressao ? (
          <p className="tabular text-center font-mono text-sm font-medium leading-relaxed text-tinta">{f.expressao}</p>
        ) : (
          <div className="flex items-center justify-center gap-2">
            <div className="text-center">
              <p className="px-2 pb-1.5 font-mono text-[13px] leading-tight text-tinta">{f.numerador}</p>
              <p className="border-t border-tinta px-2 pt-1.5 font-mono text-[13px] leading-tight text-tinta">
                {f.denominador}
              </p>
            </div>
            {f.fator && <span className="font-mono text-[13px] text-tinta">{f.fator}</span>}
          </div>
        )}
      </div>

      <p className="text-xs leading-relaxed text-cinza">{f.leitura}</p>

      <div className="mt-4 flex items-center gap-2 border-t border-linha pt-3">
        <span className="font-mono text-[10px] uppercase tracking-wider text-cinza">{f.unidade}</span>
        <span className="ml-auto inline-flex items-center gap-1 rounded-[3px] bg-papel px-1.5 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-wider text-tinta">
          {f.melhor === 'maior' && <ArrowUpIcon className="h-3 w-3 text-petroleo" aria-hidden="true" />}
          {f.melhor === 'menor' && <ArrowDownIcon className="h-3 w-3 text-petroleo" aria-hidden="true" />}
          {f.melhor === 'neutro' && <MinusIcon className="h-3 w-3 text-cinza" aria-hidden="true" />}
          {f.melhor === 'neutro' ? 'sem direção normativa' : `${f.melhor} é melhor`}
        </span>
      </div>
    </Card>
  )
}

export function Metodologia() {
  return (
    <div className="space-y-14">
      <section>
        <TituloSecao
          titulo="Fórmulas"
          descricao="Os indicadores calculados neste painel, com a definição exata usada, a unidade do resultado e o sentido da leitura. Indicadores que aparecem como sem dado no panorama não estão aqui — eles dependem de informação operacional que as demonstrações financeiras não trazem."
        />
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {formulas.map((f) => (
            <CartaoFormula key={f.key} f={f} />
          ))}
        </div>
      </section>

      <section>
        <TituloSecao
          titulo="Fórmulas de cobertura parcial"
          descricao="Calculadas só para as empresas cuja base traz os insumos. Onde falta o dado, o panorama mostra sem dado e diz o que precisa ser extraído — nenhum valor é estimado."
        />
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {formulasParciais.map((f) => (
            <CartaoFormula key={f.key} f={f} />
          ))}
        </div>
      </section>

      <section>
        <TituloSecao
          titulo="Premissas"
          descricao="As escolhas de cálculo que precisam estar explícitas para o comparativo se sustentar."
        />
        <div className="space-y-4">
          {premissas.map((bloco) => (
            <Card key={bloco.titulo} className="p-5 sm:p-6">
              <h3 className="text-sm font-bold tracking-tight text-tinta">{bloco.titulo}</h3>
              <p className="mt-1.5 max-w-3xl text-xs leading-relaxed text-cinza">{bloco.base}</p>
              <ul className="mt-4 space-y-2.5 border-t border-linha pt-4">
                {bloco.itens.map((item) => (
                  <li key={item} className="flex gap-3 text-sm leading-relaxed text-cinza">
                    <span className="mt-[9px] h-1 w-1 shrink-0 rounded-full bg-petroleo" aria-hidden="true" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </Card>
          ))}
        </div>
      </section>

      <section>
        <TituloSecao
          titulo="Limitações"
          descricao="O que este comparativo não consegue afirmar, e por quê."
        />
        <Card className="border-brasa/35 bg-brasa/[0.04] p-5 sm:p-6">
          <ul className="space-y-3.5">
            {limitacoes.map((l) => (
              <li key={l} className="flex gap-3 text-sm leading-relaxed text-tinta">
                <span className="mt-[9px] h-1 w-1 shrink-0 rounded-full bg-brasa" aria-hidden="true" />
                <span>{l}</span>
              </li>
            ))}
          </ul>
        </Card>
      </section>
    </div>
  )
}
