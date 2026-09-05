import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { indicadores } from '../data'
import { projectLinear } from '../projection'

const EMERALD = '#059669'
const AMBER = '#d97706'

function formatDias(v: number) {
  return `${v.toFixed(1)} dias`
}

export function ProjecaoCicloChart() {
  const historico = indicadores.map((d) => ({ x: d.ano, y: d.cicloCaixaDias }))
  const projetado = projectLinear(historico, 2)
  const ultimoHistorico = historico[historico.length - 1]

  const data = [
    ...historico.map((p) => ({ ano: p.x, real: Number(p.y.toFixed(1)) })),
    ...projetado.map((p) => ({ ano: p.x, projetado: Number(p.y.toFixed(1)) })),
  ]
  data[historico.length - 1] = {
    ...data[historico.length - 1],
    projetado: Number(ultimoHistorico.y.toFixed(1)),
  }

  return (
    <ResponsiveContainer width="100%" height={240}>
      <LineChart data={data} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
        <XAxis dataKey="ano" tick={{ fontSize: 12 }} />
        <YAxis tick={{ fontSize: 12 }} />
        <Tooltip formatter={(v: any) => formatDias(Number(v))} />
        <Legend wrapperStyle={{ fontSize: 12 }} />
        <Line
          type="monotone"
          dataKey="real"
          name="Ciclo de caixa (real)"
          stroke={EMERALD}
          strokeWidth={2.5}
          dot={{ r: 4 }}
        />
        <Line
          type="monotone"
          dataKey="projetado"
          name="Projeção (regressão linear)"
          stroke={AMBER}
          strokeWidth={2.5}
          strokeDasharray="6 4"
          dot={{ r: 4 }}
          connectNulls
        />
      </LineChart>
    </ResponsiveContainer>
  )
}
