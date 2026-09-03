/**
 * Ajuste de valores nominais por inflação (IPCA/IBGE), para comparar a
 * série 2020-2024 em poder de compra constante em vez de reais nominais.
 *
 * TODO: preencher a variação anual do IPCA de cada ano (ex.: 0.0452 para
 * uma inflação de 4,52% no ano) — ver série histórica em
 * https://www.ibge.gov.br/estatisticas/economicas/precos-e-custos/9256-indice-nacional-de-precos-ao-consumidor-amplo.html
 * Enquanto algum ano estiver `null`, a visão "Real (IPCA)" fica indisponível
 * e o dashboard mostra apenas os valores nominais, com um aviso.
 */
export const IPCA_ANUAL: Record<number, number | null> = {
  2020: null,
  2021: null,
  2022: null,
  2023: null,
  2024: null,
}

export const ANO_BASE_IPCA = 2024

/**
 * Deflaciona um valor nominal do `anoOrigem` para reais do `anoBase`,
 * compondo a variação anual do IPCA entre os dois anos. Retorna `null` se
 * algum índice necessário ainda não foi preenchido em `indices`.
 */
export function deflate(
  valorNominal: number,
  anoOrigem: number,
  anoBase: number,
  indices: Record<number, number | null>,
): number | null {
  if (anoOrigem === anoBase) return valorNominal
  if (anoOrigem > anoBase) return null

  let fator = 1
  for (let ano = anoOrigem + 1; ano <= anoBase; ano++) {
    const indice = indices[ano]
    if (indice === null || indice === undefined) return null
    fator *= 1 + indice
  }
  return valorNominal * fator
}

export function indicesDisponiveis(anos: number[], anoBase: number, indices: Record<number, number | null>): boolean {
  return anos.every((ano) => ano === anoBase || indices[ano] != null)
}

/** Deflaciona usando o índice IPCA_ANUAL e o ano-base configurados acima. */
export function deflacionar(valorNominal: number, anoOrigem: number): number | null {
  return deflate(valorNominal, anoOrigem, ANO_BASE_IPCA, IPCA_ANUAL)
}

export function ipcaDisponivel(anos: number[]): boolean {
  return indicesDisponiveis(anos, ANO_BASE_IPCA, IPCA_ANUAL)
}
