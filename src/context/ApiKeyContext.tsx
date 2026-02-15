import { createContext, useContext, useState, useEffect } from 'react'
import type { ReactNode } from 'react'
import type { ApiKeys } from '../types'

interface ApiKeyContextType {
  keys: ApiKeys
  setKey: (provider: keyof ApiKeys, key: string) => void
  removeKey: (provider: keyof ApiKeys) => void
  hasAnyKey: boolean
}

const ApiKeyContext = createContext<ApiKeyContextType | null>(null)

const STORAGE_KEY = 'usageclaw_keys'

export function ApiKeyProvider({ children }: { children: ReactNode }) {
  const [keys, setKeys] = useState<ApiKeys>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      return stored ? JSON.parse(stored) : {}
    } catch {
      return {}
    }
  })

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(keys))
  }, [keys])

  const setKey = (provider: keyof ApiKeys, key: string) => {
    setKeys(prev => ({ ...prev, [provider]: key }))
  }

  const removeKey = (provider: keyof ApiKeys) => {
    setKeys(prev => {
      const next = { ...prev }
      delete next[provider]
      return next
    })
  }

  const hasAnyKey = Object.values(keys).some(k => k && k.length > 0)

  return (
    <ApiKeyContext.Provider value={{ keys, setKey, removeKey, hasAnyKey }}>
      {children}
    </ApiKeyContext.Provider>
  )
}

export function useApiKeys() {
  const ctx = useContext(ApiKeyContext)
  if (!ctx) throw new Error('useApiKeys must be inside ApiKeyProvider')
  return ctx
}
