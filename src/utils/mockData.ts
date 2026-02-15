import type { Provider, UsageResult } from '../types'

/**
 * Returns realistic mock usage data for demo mode.
 * Data varies slightly on each call to feel dynamic.
 */
export function getMockUsage(provider: Provider): UsageResult {
  switch (provider) {
    case 'openai': return mockOpenAI()
    case 'anthropic': return mockAnthropic()
    case 'google': return mockGoogle()
    case 'deepseek': return mockDeepSeek()
    case 'minimax': return mockMiniMax()
    case 'qwen': return mockQwen()
    case 'zhipu': return mockZhipu()
    default: return emptyUsage()
  }
}

function generateDailySpend(avgDaily: number, days: number): number[] {
  return Array.from({ length: days }, () => round(avgDaily * (0.4 + Math.random() * 1.2)))
}

function mockOpenAI(): UsageResult {
  const jitter = 0.9 + Math.random() * 0.2 // 0.9–1.1
  const today = new Date().getDate()
  return {
    totalSpend: round(47.83 * jitter),
    limit: 120,
    requests: Math.floor(12_847 * jitter),
    inputTokens: Math.floor(18_432_100 * jitter),
    outputTokens: Math.floor(6_291_400 * jitter),
    dailySpend: generateDailySpend(3.2 * jitter, today),
    models: [
      { name: 'gpt-4o', cost: round(22.14 * jitter), requests: Math.floor(4_230 * jitter) },
      { name: 'gpt-4o-mini', cost: round(8.91 * jitter), requests: Math.floor(5_120 * jitter) },
      { name: 'o3-mini', cost: round(11.47 * jitter), requests: Math.floor(1_892 * jitter) },
      { name: 'gpt-4-turbo', cost: round(3.82 * jitter), requests: Math.floor(980 * jitter) },
      { name: 'dall-e-3', cost: round(1.49 * jitter), requests: Math.floor(625 * jitter) },
    ],
  }
}

function mockAnthropic(): UsageResult {
  const jitter = 0.9 + Math.random() * 0.2
  const today = new Date().getDate()
  return {
    totalSpend: round(63.21 * jitter),
    limit: 100,
    requests: Math.floor(8_432 * jitter),
    inputTokens: Math.floor(24_100_000 * jitter),
    outputTokens: Math.floor(9_870_000 * jitter),
    dailySpend: generateDailySpend(4.2 * jitter, today),
    models: [
      { name: 'claude-opus-4', cost: round(31.50 * jitter), requests: Math.floor(1_240 * jitter) },
      { name: 'claude-sonnet-4', cost: round(18.73 * jitter), requests: Math.floor(3_890 * jitter) },
      { name: 'claude-haiku-3.5', cost: round(8.44 * jitter), requests: Math.floor(2_870 * jitter) },
      { name: 'claude-sonnet-3.5', cost: round(4.54 * jitter), requests: Math.floor(432 * jitter) },
    ],
  }
}

function mockGoogle(): UsageResult {
  const jitter = 0.9 + Math.random() * 0.2
  const today = new Date().getDate()
  return {
    totalSpend: round(12.45 * jitter),
    limit: null,
    requests: Math.floor(5_672 * jitter),
    inputTokens: Math.floor(9_800_000 * jitter),
    outputTokens: Math.floor(3_200_000 * jitter),
    dailySpend: generateDailySpend(0.8 * jitter, today),
    models: [
      { name: 'Gemini 2.0 Flash', cost: round(4.21 * jitter), requests: Math.floor(2_890 * jitter) },
      { name: 'Gemini 2.0 Pro', cost: round(5.87 * jitter), requests: Math.floor(1_340 * jitter) },
      { name: 'Gemini 1.5 Flash', cost: round(1.12 * jitter), requests: Math.floor(980 * jitter) },
      { name: 'Gemini 1.5 Pro', cost: round(1.25 * jitter), requests: Math.floor(462 * jitter) },
    ],
  }
}

function mockDeepSeek(): UsageResult {
  const jitter = 0.9 + Math.random() * 0.2
  const today = new Date().getDate()
  return {
    totalSpend: round(8.92 * jitter),
    limit: 50,
    requests: Math.floor(15_230 * jitter),
    inputTokens: Math.floor(32_100_000 * jitter),
    outputTokens: Math.floor(12_400_000 * jitter),
    dailySpend: generateDailySpend(0.6 * jitter, today),
    models: [
      { name: 'deepseek-chat', cost: round(3.21 * jitter), requests: Math.floor(8_900 * jitter) },
      { name: 'deepseek-reasoner', cost: round(5.71 * jitter), requests: Math.floor(6_330 * jitter) },
    ],
  }
}

function mockMiniMax(): UsageResult {
  const jitter = 0.9 + Math.random() * 0.2
  const today = new Date().getDate()
  return {
    totalSpend: round(15.34 * jitter),
    limit: null,
    requests: Math.floor(6_840 * jitter),
    inputTokens: Math.floor(14_500_000 * jitter),
    outputTokens: Math.floor(5_800_000 * jitter),
    dailySpend: generateDailySpend(1.1 * jitter, today),
    models: [
      { name: 'MiniMax-M2.5', cost: round(8.42 * jitter), requests: Math.floor(3_210 * jitter) },
      { name: 'MiniMax-M2.1', cost: round(4.63 * jitter), requests: Math.floor(2_450 * jitter) },
      { name: 'MiniMax-M2', cost: round(2.29 * jitter), requests: Math.floor(1_180 * jitter) },
    ],
  }
}

function mockQwen(): UsageResult {
  const jitter = 0.9 + Math.random() * 0.2
  const today = new Date().getDate()
  return {
    totalSpend: round(6.78 * jitter),
    limit: null,
    requests: Math.floor(9_120 * jitter),
    inputTokens: Math.floor(16_700_000 * jitter),
    outputTokens: Math.floor(5_900_000 * jitter),
    dailySpend: generateDailySpend(0.5 * jitter, today),
    models: [
      { name: 'qwen-max', cost: round(3.45 * jitter), requests: Math.floor(2_100 * jitter) },
      { name: 'qwen-plus', cost: round(2.11 * jitter), requests: Math.floor(4_320 * jitter) },
      { name: 'qwen-turbo', cost: round(1.22 * jitter), requests: Math.floor(2_700 * jitter) },
    ],
  }
}

function mockZhipu(): UsageResult {
  const jitter = 0.9 + Math.random() * 0.2
  const today = new Date().getDate()
  return {
    totalSpend: round(11.56 * jitter),
    limit: null,
    requests: Math.floor(7_380 * jitter),
    inputTokens: Math.floor(13_200_000 * jitter),
    outputTokens: Math.floor(4_600_000 * jitter),
    dailySpend: generateDailySpend(0.8 * jitter, today),
    models: [
      { name: 'glm-4', cost: round(5.87 * jitter), requests: Math.floor(3_420 * jitter) },
      { name: 'glm-4-flash', cost: round(3.12 * jitter), requests: Math.floor(2_780 * jitter) },
      { name: 'glm-4v', cost: round(2.57 * jitter), requests: Math.floor(1_180 * jitter) },
    ],
  }
}

function emptyUsage(): UsageResult {
  return {
    totalSpend: 0,
    limit: null,
    requests: 0,
    inputTokens: 0,
    outputTokens: 0,
    dailySpend: [],
    models: [],
  }
}

function round(n: number): number {
  return Math.round(n * 100) / 100
}
