import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts'
import type { ProviderConfig, UsageResult } from '../types'
import './CostSummary.css'

interface CostSummaryProps {
  data: { provider: ProviderConfig; usage: UsageResult }[]
}

export function CostSummary({ data }: CostSummaryProps) {
  const totalSpend = data.reduce((sum, d) => sum + d.usage.totalSpend, 0)

  const chartData = data
    .filter(d => d.usage.totalSpend > 0)
    .map(d => ({
      name: d.provider.name,
      value: d.usage.totalSpend,
      color: d.provider.color,
    }))
    .sort((a, b) => b.value - a.value)

  const biggestDriver = chartData.length > 0 ? chartData[0] : null

  if (data.length === 0) {
    return (
      <div className="cost-summary">
        <div className="cost-summary-header">
          <span className="cost-summary-title">total spend</span>
        </div>
        <div className="cost-empty">no usage data available</div>
      </div>
    )
  }

  return (
    <div className="cost-summary">
      <div className="cost-summary-header">
        <span className="cost-summary-title">total spend</span>
        {biggestDriver && (
          <span className="cost-summary-title">
            top: {biggestDriver.name}
          </span>
        )}
      </div>

      <div className="cost-total">
        <span className="cost-total-currency">$</span>
        <span className="cost-total-value">{totalSpend.toFixed(2)}</span>
        <span className="cost-total-label">this month</span>
      </div>

      {chartData.length > 0 && (
        <div className="cost-chart-area">
          <ResponsiveContainer width="100%" height={160}>
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={45}
                outerRadius={65}
                paddingAngle={2}
                dataKey="value"
                stroke="none"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value: number | undefined) => [`$${(value ?? 0).toFixed(2)}`, 'Spend']}
                contentStyle={{
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border)',
                  borderRadius: '8px',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '11px',
                  color: 'var(--text-primary)',
                }}
                itemStyle={{ color: 'var(--text-secondary)' }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}

      <div className="cost-breakdown">
        <span className="cost-breakdown-title">breakdown</span>
        {data.map(d => {
          const percent = totalSpend > 0
            ? (d.usage.totalSpend / totalSpend) * 100
            : 0
          return (
            <div key={d.provider.id} className="cost-row">
              <span
                className="cost-row-dot"
                style={{ background: d.provider.color }}
              />
              <span className="cost-row-name">{d.provider.name}</span>
              <div className="cost-row-bar">
                <div
                  className="cost-row-fill"
                  style={{
                    width: `${percent}%`,
                    background: d.provider.color,
                  }}
                />
              </div>
              <span className="cost-row-amount">
                ${d.usage.totalSpend.toFixed(2)}
              </span>
              <span className="cost-row-percent">
                {percent.toFixed(0)}%
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
