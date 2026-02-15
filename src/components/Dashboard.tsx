import { useState } from 'react'
import { useApiKeys } from '../context/ApiKeyContext'
import { PROVIDERS } from '../types'
import type { UsageResult } from '../types'
import { useUsageData } from '../hooks/useUsageData'
import { ProviderCard } from './ProviderCard'
import { CostSummary } from './CostSummary'
import { UsageChart } from './UsageChart'
import { EmptyState } from './EmptyState'
import { AddProviderModal } from './AddProviderModal'

export function Dashboard() {
  const { keys, hasAnyKey } = useApiKeys()
  const [showAddModal, setShowAddModal] = useState(false)
  const [demoMode, setDemoMode] = useState(false)

  const activeProviders = PROVIDERS.filter(p => demoMode || keys[p.id])
  const showDashboard = demoMode || hasAnyKey

  // Fetch usage data for each provider for the summary charts
  const openai = useUsageData('openai', keys.openai, demoMode && true)
  const anthropic = useUsageData('anthropic', keys.anthropic, demoMode && true)
  const google = useUsageData('google', keys.google, demoMode && true)

  const usageByProvider: Record<string, UsageResult | null> = {
    openai: openai.data,
    anthropic: anthropic.data,
    google: google.data,
  }

  const chartData = activeProviders
    .filter(p => usageByProvider[p.id])
    .map(p => ({ provider: p, usage: usageByProvider[p.id]! }))

  if (!showDashboard) return <EmptyState />

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between py-4">
        <div className="font-[var(--font-mono)] text-sm flex items-center gap-2">
          <span className="text-[var(--accent)]">$</span>
          <span className="text-[var(--text-primary)]">usageclaw</span>
          <span className="text-[var(--accent-secondary)]">--watch</span>
          <span className="text-[var(--accent)] animate-[blink_1s_step-end_infinite]">|</span>
        </div>

        <button
          onClick={() => setDemoMode(d => !d)}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-md font-[var(--font-mono)] text-[11px] cursor-pointer transition-all duration-150 border ${
            demoMode
              ? 'bg-[var(--accent-dim)] border-[var(--border-glow)] text-[var(--accent)]'
              : 'bg-transparent border-[var(--border)] text-[var(--text-muted)] hover:text-[var(--text-secondary)] hover:border-[var(--text-muted)]'
          }`}
        >
          <span className={`w-1.5 h-1.5 rounded-full ${demoMode ? 'bg-[var(--accent)]' : 'bg-[var(--text-muted)]'}`} />
          {demoMode ? 'demo mode' : 'demo'}
        </button>
      </div>

      {/* Summary charts */}
      {chartData.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <CostSummary data={chartData} />
          <UsageChart data={chartData} />
        </div>
      )}

      {/* Provider cards */}
      <div className="grid grid-cols-1 md:grid-cols-[repeat(auto-fit,minmax(400px,1fr))] gap-4">
        {activeProviders.map(provider => (
          <ProviderCard
            key={provider.id}
            provider={provider}
            apiKey={keys[provider.id] || 'demo-key'}
            demoMode={demoMode}
          />
        ))}
      </div>

      {!demoMode && activeProviders.length < PROVIDERS.length && (
        <button
          onClick={() => setShowAddModal(true)}
          className="mx-auto flex items-center gap-2 px-4 py-2 rounded-lg border border-dashed border-[var(--border)] text-[var(--text-muted)] font-[var(--font-mono)] text-xs cursor-pointer transition-all duration-150 hover:border-[var(--accent)] hover:text-[var(--accent)] hover:bg-[var(--accent-dim)]"
        >
          <span className="text-lg leading-none">+</span>
          <span>Add provider</span>
        </button>
      )}

      <div className="py-6 text-center">
        <span className="font-[var(--font-mono)] text-[11px] text-[var(--text-muted)]">
          {activeProviders.length} provider{activeProviders.length !== 1 ? 's' : ''} connected
          {demoMode && <><span className="mx-2 text-[var(--border)]">·</span>demo data</>}
          <span className="mx-2 text-[var(--border)]">·</span>
          all data stays in your browser
          <span className="mx-2 text-[var(--border)]">·</span>
          zero server calls
        </span>
      </div>

      {showAddModal && <AddProviderModal onClose={() => setShowAddModal(false)} />}
    </div>
  )
}
