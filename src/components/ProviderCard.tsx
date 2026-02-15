import { useState, useEffect, useCallback } from 'react'
import { AreaChart, Area, ResponsiveContainer } from 'recharts'
import { RefreshCw, ChevronDown, ChevronUp } from 'lucide-react'
import type { ProviderConfig } from '../types'
import { fetchUsage } from '../utils/fetchUsage'
import { getMockUsage } from '../utils/mockData'
import { ProgressBar } from './ProgressBar'
import './ProviderCard.css'

interface Props {
  provider: ProviderConfig
  apiKey: string
  demoMode?: boolean
}

interface UsageState {
  loading: boolean
  error: string | null
  totalSpend: number
  limit: number | null
  requests: number
  inputTokens: number
  outputTokens: number
  dailySpend: number[]
  models: { name: string; cost: number; requests: number }[]
}

export function ProviderCard({ provider, apiKey, demoMode = false }: Props) {
  const [state, setState] = useState<UsageState>({
    loading: true,
    error: null,
    totalSpend: 0,
    limit: null,
    requests: 0,
    inputTokens: 0,
    outputTokens: 0,
    dailySpend: [],
    models: []
  })
  const [refreshing, setRefreshing] = useState(false)
  const [modelsExpanded, setModelsExpanded] = useState(false)

  const load = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true)
    setState(s => ({ ...s, loading: !isRefresh, error: null }))
    try {
      let data;
      if (demoMode) {
        await new Promise(r => setTimeout(r, 300 + Math.random() * 500))
        data = getMockUsage(provider.id)
      } else {
        data = await fetchUsage(provider.id, apiKey)
      }
      setState(s => ({
        ...s,
        totalSpend: data.totalSpend,
        limit: data.limit,
        requests: data.requests,
        inputTokens: data.inputTokens,
        outputTokens: data.outputTokens,
        models: data.models,
        dailySpend: data.dailySpend ?? [],
        loading: false,
        error: null,
      }))
    } catch (err: any) {
      setState(s => ({ ...s, loading: false, error: err.message }))
    } finally {
      setRefreshing(false)
    }
  }, [provider.id, apiKey, demoMode])

  useEffect(() => {
    load()
  }, [load])

  const maskedKey = apiKey.slice(0, 8) + '···' + apiKey.slice(-4)
  const usagePercent = state.limit
    ? Math.min((state.totalSpend / state.limit) * 100, 100)
    : null

  const statusColor = usagePercent === null
    ? 'var(--accent)'
    : usagePercent < 50
      ? '#00ff88'
      : usagePercent < 80
        ? '#ffaa00'
        : '#ff4466'

  // Sparkline data
  const sparkData = state.dailySpend.map((value, i) => ({ day: i, value }))

  return (
    <div className="provider-card" style={{ '--provider-color': provider.color } as React.CSSProperties}>
      <div className="card-header">
        <div className="card-title">
          <span className="status-dot" style={{ background: statusColor }} />
          <span className="card-icon">{provider.icon}</span>
          <span className="card-name">{provider.name}</span>
        </div>
        <div className="card-header-right">
          <button
            className={`refresh-btn${refreshing ? ' refreshing' : ''}`}
            onClick={() => load(true)}
            disabled={refreshing || state.loading}
            title="Refresh usage data"
          >
            <RefreshCw size={14} />
          </button>
          <div className="card-key" title={maskedKey}>
            <span className="key-icon">🔑</span>
            {maskedKey}
          </div>
        </div>
      </div>

      {state.loading ? (
        <div className="card-loading">
          <div className="loading-bar">
            <div className="loading-progress"></div>
          </div>
          <span className="loading-text">fetching usage data...</span>
        </div>
      ) : state.error ? (
        <div className="card-error">
          <span className="error-icon">⚠</span>
          <span className="error-text">{state.error}</span>
        </div>
      ) : (
        <div className="card-body">
          <div className="spend-row">
            <div className="spend-amount">
              <span className="spend-currency">$</span>
              <span className="spend-value">{state.totalSpend.toFixed(2)}</span>
              {state.limit && (
                <span className="spend-limit">/ ${state.limit.toFixed(0)}</span>
              )}
            </div>
            <span className="spend-label">this month</span>
          </div>

          {usagePercent !== null && (
            <div className="card-progress">
              <ProgressBar value={usagePercent} variant="full" />
            </div>
          )}

          {sparkData.length > 1 && (
            <div className="sparkline-container">
              <ResponsiveContainer width="100%" height={40}>
                <AreaChart data={sparkData} margin={{ top: 2, right: 0, bottom: 0, left: 0 }}>
                  <defs>
                    <linearGradient id={`spark-${provider.id}`} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={provider.color} stopOpacity={0.3} />
                      <stop offset="100%" stopColor={provider.color} stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <Area
                    type="monotone"
                    dataKey="value"
                    stroke={provider.color}
                    strokeWidth={1.5}
                    fill={`url(#spark-${provider.id})`}
                    dot={false}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          )}

          <div className="stats-grid">
            <div className="stat">
              <span className="stat-value">{formatNumber(state.requests)}</span>
              <span className="stat-label">requests</span>
            </div>
            <div className="stat">
              <span className="stat-value">{formatNumber(state.inputTokens)}</span>
              <span className="stat-label">input tokens</span>
            </div>
            <div className="stat">
              <span className="stat-value">{formatNumber(state.outputTokens)}</span>
              <span className="stat-label">output tokens</span>
            </div>
          </div>

          {state.models.length > 0 && (
            <div className="models-section">
              <button
                className="models-toggle"
                onClick={() => setModelsExpanded(e => !e)}
              >
                <span className="models-header">
                  models ({state.models.length})
                </span>
                {modelsExpanded
                  ? <ChevronUp size={14} />
                  : <ChevronDown size={14} />
                }
              </button>
              {modelsExpanded && (
                <div className="models-list">
                  {state.models.map(m => (
                    <div key={m.name} className="model-row">
                      <span className="model-name">{m.name}</span>
                      <span className="model-cost">${m.cost.toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

function formatNumber(n: number): string {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + 'M'
  if (n >= 1_000) return (n / 1_000).toFixed(1) + 'K'
  return n.toString()
}
