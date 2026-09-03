export function formatDias(v: number) {
  return `${v.toFixed(1)} dias`
}

export function formatBi(v: number) {
  return `R$ ${(v / 1_000_000).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} bi`
}

export function formatPercent(value: number, digits = 1): string {
  return `${(value * 100).toFixed(digits)}%`
}
