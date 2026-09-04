// Os quatro blocos temáticos do panorama.
//
// Nem todo indicador pedido existe nas demonstrações financeiras usadas aqui.
// Em vez de estimar, cada métrica sem fonte devolve `null` e declara o que
// seria preciso para preenchê-la — a interface a desenha como "sem dado".

import type { AnnualIndicators } from './data'
import { formatDias, formatPct, formatX } from './format'

export interface MetricaPainel {
  key: string
  label: string
  /** `null` quando a demonstração usada não permite calcular o indicador. */
  valor: (i: AnnualIndicators) => number | null
  format: (v: number) => string
  menorMelhor: boolean
  /** O que falta para calcular, quando `valor` devolve `null`. */
  faltaDado?: string
}

export interface GrupoPainel {
  id: string
  titulo: string
  descricao: string
  metricas: MetricaPainel[]
}

/** Indicador ainda sem fonte na base atual. */
function semDado(key: string, label: string, menorMelhor: boolean, falta: string): MetricaPainel {
  return { key, label, valor: () => null, format: (v) => String(v), menorMelhor, faltaDado: falta }
}

export const grupos: GrupoPainel[] = [
  {
    id: 'eficiencia',
    titulo: 'Eficiência Operacional',
    descricao: 'Quanta produção e quanta receita a estrutura instalada consegue gerar.',
    metricas: [
      { key: 'giroAtivo', label: 'Giro do Ativo', valor: (i) => i.giroAtivo, format: formatX, menorMelhor: false },
      semDado(
        'volume',
        'Volume produzido / vendido',
        false,
        'Exige dados operacionais em toneladas ou cabeças abatidas — divulgados nos relatórios de produção e releases trimestrais, não nas demonstrações financeiras.',
      ),
      semDado(
        'produtividade',
        'Produtividade por empregado',
        false,
        'Exige o número médio de empregados do exercício, que nenhum dos dois documentos usados aqui traz.',
      ),
      semDado(
        'capacidade',
        'Utilização da capacidade',
        false,
        'Exige capacidade instalada e produção efetiva por planta — informação operacional, fora das demonstrações financeiras.',
      ),
    ],
  },
  {
    id: 'capital-de-giro',
    titulo: 'Capital de Giro',
    descricao: 'Quantos dias de caixa a operação prende entre pagar o fornecedor e receber do cliente.',
    metricas: [
      { key: 'cicloFinanceiroDias', label: 'Ciclo financeiro', valor: (i) => i.cicloFinanceiroDias, format: formatDias, menorMelhor: true },
      { key: 'pmrDias', label: 'PMR — prazo médio de recebimento', valor: (i) => i.pmrDias, format: formatDias, menorMelhor: true },
      { key: 'pmeDias', label: 'PME — prazo médio de estocagem', valor: (i) => i.pmeDias, format: formatDias, menorMelhor: true },
      { key: 'pmpDias', label: 'PMP — prazo médio de pagamento', valor: (i) => i.pmpDias, format: formatDias, menorMelhor: false },
      { key: 'giroEstoque', label: 'Giro do estoque', valor: (i) => i.giroEstoque, format: formatX, menorMelhor: false },
    ],
  },
  {
    id: 'rentabilidade',
    titulo: 'Rentabilidade',
    descricao: 'Quanto sobra da receita e quanto o capital investido rende.',
    metricas: [
      { key: 'margemOperacional', label: 'Margem operacional', valor: (i) => i.margemOperacional, format: formatPct, menorMelhor: false },
      { key: 'margemEbitda', label: 'Margem EBITDA', valor: (i) => i.margemEbitda, format: formatPct, menorMelhor: false },
      { key: 'roic', label: 'ROIC', valor: (i) => i.roic, format: formatPct, menorMelhor: false },
    ],
  },
  {
    id: 'investimento',
    titulo: 'Investimento e Estrutura',
    descricao: 'Quanto vai para o ativo fixo e como o balanço é financiado.',
    metricas: [
      semDado(
        'capexReceita',
        'CAPEX sobre receita',
        false,
        'Exige a linha de aquisição de imobilizado e intangível da Demonstração dos Fluxos de Caixa (atividades de investimento), ainda não extraída nesta base.',
      ),
      semDado(
        'capexDepreciacao',
        'CAPEX sobre depreciação',
        false,
        'Mesma linha de CAPEX acima. A depreciação já é derivável (EBITDA − EBIT), então basta extrair o CAPEX para liberar os dois indicadores.',
      ),
      { key: 'endividamento', label: 'Índice de endividamento', valor: (i) => i.endividamento, format: formatPct, menorMelhor: true },
      { key: 'alavancagem', label: 'Dívida líquida sobre EBITDA', valor: (i) => i.alavancagem, format: formatX, menorMelhor: true },
    ],
  },
]
