import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts'
import type { ProviderConfig, UsageResult } from '../types'
import './UsageChart.css'

interface UsageChartProps {
  data: { provider: ProviderConfig; usage: UsageResult }[]
}

export function UsageChart({ data }: UsageChartProps) {
  const activeData = data.filter(d => d.usage.dailySpend.length > 0)

  if (activeData.length === 0) {
    return (
      <div className="usage-chart">
        <div className="usage-chart-header">
          <span className="usage-chart-title">daily spend trend</span>
        </div>
        <div className="usage-chart-empty">no daily data available</div>
      </div>
    )
  }

  // Build chart data: one entry per day, with a key for each provider
  const maxDays = Math.max(...activeData.map(d => d.usage.dailySpend.length))
  const now = new Date()
  const chartData = Array.from({ length: maxDays }, (_, i) => {
    const date = new Date(now.getFullYear(), now.getMonth(), i + 1)
    const dayLabel = `${date.getMonth() + 1}/${date.getDate()}`
    const entry: Record<string, string | number> = { day: dayLabel }
    for (const d of activeData) {
      entry[d.provider.id] = d.usage.dailySpend[i] ?? 0
    }
    return entry
  })

  return (
    <div className="usage-chart">
      <div className="usage-chart-header">
        <span className="usage-chart-title">daily spend trend</span>
        <div className="usage-chart-legend">
          {activeData.map(d => (
            <div key={d.provider.id} className="legend-item">
              <span
                className="legend-dot"
                style={{ background: d.provider.color }}
              />
              {d.provider.name}
            </div>
          ))}
        </div>
      </div>

      <div className="usage-chart-area">
        <ResponsiveContainer width="100%" height={220}>
          <AreaChart data={chartData} margin={{ top: 4, right: 4, bottom: 0, left: 0 }}>
            <defs>
              {activeData.map(d => (
                <linearGradient
                  key={d.provider.id}
                  id={`gradient-${d.provider.id}`}
                  x1="0" y1="0" x2="0" y2="1"
                >
                  <stop offset="0%" stopColor={d.provider.color} stopOpacity={0.3} />
                  <stop offset="100%" stopColor={d.provider.color} stopOpacity={0} />
                </linearGradient>
              ))}
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="var(--border)"
              vertical={false}
            />
            <XAxis
              dataKey="day"
              tick={{ fontSize: 10, fontFamily: 'var(--font-mono)', fill: '#3a3a4a' }}
              axisLine={{ stroke: 'var(--border)' }}
              tickLine={false}
              interval="preserveStartEnd"
            />
            <YAxis
              tick={{ fontSize: 10, fontFamily: 'var(--font-mono)', fill: '#3a3a4a' }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(v: number) => `$${v}`}
              width={45}
            />
            <Tooltip
              contentStyle={{
                background: '#16161f',
                border: '1px solid #1e1e2e',
                borderRadius: '8px',
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: '11px',
                color: '#e0e0e8',
              }}
              itemStyle={{ color: '#6b6b80' }}
              formatter={(value: number | undefined, name: string | undefined) => {
                const provider = activeData.find(d => d.provider.id === name)
                const label = provider ? provider.provider.name : (name ?? '')
                return [`$${(value ?? 0).toFixed(2)}`, label]
              }}
              labelStyle={{ color: '#6b6b80', fontFamily: "'JetBrains Mono', monospace", fontSize: '10px' }}
            />
            {activeData.map(d => (
              <Area
                key={d.provider.id}
                type="monotone"
                dataKey={d.provider.id}
                stroke={d.provider.color}
                strokeWidth={2}
                fill={`url(#gradient-${d.provider.id})`}
                dot={false}
                activeDot={{ r: 3, strokeWidth: 0, fill: d.provider.color }}
              />
            ))}
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
