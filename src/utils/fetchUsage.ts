import { Provider } from '../types'

interface UsageResult {
  totalSpend: number
  limit: number | null
  requests: number
  inputTokens: number
  outputTokens: number
  models: { name: string; cost: number; requests: number }[]
}

const API_BASE = import.meta.env.DEV ? 'http://localhost:3001' : ''

export async function fetchUsage(provider: Provider, apiKey: string): Promise<UsageResult> {
  const res = await fetch(`${API_BASE}/api/usage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ provider, apiKey })
  })

  if (!res.ok) {
    const data = await res.json().catch(() => ({ error: `HTTP ${res.status}` }))
    throw new Error(data.error || `API error: ${res.status}`)
  }

  return res.json()
}
