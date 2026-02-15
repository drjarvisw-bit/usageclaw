export type Provider = 'openai' | 'anthropic' | 'google'

export interface ApiKeys {
  openai?: string
  anthropic?: string
  google?: string
}

export interface UsageData {
  provider: Provider
  totalSpend: number
  dailySpend: number[]
  limit: number | null
  requests: number
  tokens: {
    input: number
    output: number
  }
  models: ModelUsage[]
  lastUpdated: Date | null
}

export interface ModelUsage {
  name: string
  requests: number
  tokens: number
  cost: number
}

export interface UsageResult {
  totalSpend: number
  limit: number | null
  requests: number
  inputTokens: number
  outputTokens: number
  dailySpend: number[]
  models: { name: string; cost: number; requests: number }[]
}

export interface UsageError {
  provider: Provider
  message: string
  isCors: boolean
  isAuth: boolean
}

export interface ProviderConfig {
  id: Provider
  name: string
  color: string
  icon: string
  description: string
}

export const PROVIDERS: ProviderConfig[] = [
  {
    id: 'openai',
    name: 'OpenAI',
    color: '#00a67e',
    icon: '◈',
    description: 'GPT-4o, o1, o3, DALL·E, Whisper'
  },
  {
    id: 'anthropic',
    name: 'Anthropic',
    color: '#d4a574',
    icon: '◉',
    description: 'Claude Opus, Sonnet, Haiku'
  },
  {
    id: 'google',
    name: 'Google AI',
    color: '#4285f4',
    icon: '◆',
    description: 'Gemini Pro, Flash, Ultra'
  }
]
