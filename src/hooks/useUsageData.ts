import { useState, useEffect, useCallback, useRef } from 'react'
import type { Provider, UsageResult } from '../types'
import { fetchUsage } from '../utils/fetchUsage'
import { getMockUsage } from '../utils/mockData'

const REFRESH_INTERVAL_MS = 5 * 60 * 1000 // 5 minutes

interface UseUsageDataState {
  data: UsageResult | null
  loading: boolean
  error: string | null
}

interface UseUsageDataReturn extends UseUsageDataState {
  refresh: () => void
  lastUpdated: Date | null
}

/**
 * Custom hook for fetching and managing usage data for a single provider.
 *
 * @param provider - The API provider to fetch usage for
 * @param apiKey   - The user's API key (empty/undefined skips fetching)
 * @param demoMode - When true, returns mock data instead of making real API calls
 */
export function useUsageData(
  provider: Provider,
  apiKey: string | undefined,
  demoMode: boolean = false
): UseUsageDataReturn {
  const [state, setState] = useState<UseUsageDataState>({
    data: null,
    loading: false,
    error: null,
  })
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)

  // Track whether component is still mounted
  const mountedRef = useRef(true)
  useEffect(() => {
    mountedRef.current = true
    return () => { mountedRef.current = false }
  }, [])

  const load = useCallback(async () => {
    if (!apiKey && !demoMode) return

    setState(prev => ({ ...prev, loading: true, error: null }))

    try {
      let result: UsageResult

      if (demoMode) {
        // Simulate a small delay so loading state is visible
        await new Promise(r => setTimeout(r, 400 + Math.random() * 600))
        result = getMockUsage(provider)
      } else {
        result = await fetchUsage(provider, apiKey!)
      }

      if (mountedRef.current) {
        setState({ data: result, loading: false, error: null })
        setLastUpdated(new Date())
      }
    } catch (err: unknown) {
      if (mountedRef.current) {
        const message = err instanceof Error ? err.message : String(err)
        setState(prev => ({ ...prev, loading: false, error: message }))
      }
    }
  }, [provider, apiKey, demoMode])

  // Initial fetch and auto-refresh
  useEffect(() => {
    load()

    const interval = setInterval(load, REFRESH_INTERVAL_MS)
    return () => clearInterval(interval)
  }, [load])

  return {
    ...state,
    refresh: load,
    lastUpdated,
  }
}
