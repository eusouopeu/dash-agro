/**
 * Comparação setorial (benchmarking) — indicadores dos mesmos anos para
 * concorrentes diretos do Assaí, para contextualizar se os números da
 * empresa são bons/ruins frente ao setor de atacarejo/varejo alimentar.
 *
 * TODO: preencher com 1-2 concorrentes diretos (ex.: Atacadão/Carrefour
 * Brasil, GPA/Pão de Açúcar) usando a mesma metodologia de `data.ts`
 * (fonte pública — CVM). Enquanto a lista estiver vazia, a seção de
 * benchmarking exibe um aviso de "dados pendentes" em vez de um gráfico
 * vazio.
 */
export interface ConcorrenteAno {
  empresa: string
  ano: number
  giroEstoque: number | null
  cicloCaixaDias: number | null
  margemLiquida: number | null
}

export const CONCORRENTES: ConcorrenteAno[] = []
