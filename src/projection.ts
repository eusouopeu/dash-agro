export interface Point {
  x: number
  y: number
}

/** Regressão linear simples (mínimos quadrados) sobre uma série (x, y). */
export function linearRegression(points: Point[]): { slope: number; intercept: number } {
  const n = points.length
  const sumX = points.reduce((s, p) => s + p.x, 0)
  const sumY = points.reduce((s, p) => s + p.y, 0)
  const sumXY = points.reduce((s, p) => s + p.x * p.y, 0)
  const sumXX = points.reduce((s, p) => s + p.x * p.x, 0)
  const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX)
  const intercept = (sumY - slope * sumX) / n
  return { slope, intercept }
}

/**
 * Extrapola `yearsAhead` pontos após o último x da série, usando regressão
 * linear simples. Uso apenas ilustrativo — não considera sazonalidade,
 * eventos extraordinários ou mudanças estruturais do negócio.
 */
export function projectLinear(points: Point[], yearsAhead: number): Point[] {
  const { slope, intercept } = linearRegression(points)
  const lastX = points[points.length - 1].x
  return Array.from({ length: yearsAhead }, (_, i) => {
    const x = lastX + i + 1
    return { x, y: slope * x + intercept }
  })
}
