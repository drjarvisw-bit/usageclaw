export type Provider = 'openai' | 'anthropic' | 'google' | 'deepseek' | 'minimax' | 'qwen' | 'zhipu' | 'together' | 'groq'

export interface ApiKeys {
  openai?: string
  anthropic?: string
  google?: string
  deepseek?: string
  minimax?: string
  qwen?: string
  zhipu?: string
  together?: string
  groq?: string
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
  },
  {
    id: 'deepseek',
    name: 'DeepSeek',
    color: '#4D6BFE',
    icon: '◇',
    description: 'DeepSeek-V3, DeepSeek-R1'
  },
  {
    id: 'minimax',
    name: 'MiniMax',
    color: '#FF6B35',
    icon: '◎',
    description: 'MiniMax-M2.5, M2.1, M2'
  },
  {
    id: 'qwen',
    name: 'Qwen (通义千问)',
    color: '#FF6A00',
    icon: '◐',
    description: 'Qwen-Max, Qwen-Plus, Qwen-Turbo'
  },
  {
    id: 'zhipu',
    name: 'Zhipu GLM (智谱)',
    color: '#2563EB',
    icon: '◑',
    description: 'GLM-4, GLM-4V, CogView'
  },
  {
    id: 'together',
    name: 'Together AI',
    color: '#0EA5E9',
    icon: '◫',
    description: 'Llama, Mixtral, DBRX, Qwen'
  },
  {
    id: 'groq',
    name: 'Groq',
    color: '#F97316',
    icon: '◧',
    description: 'Llama, Mixtral, Gemma (LPU)'
  }
]
