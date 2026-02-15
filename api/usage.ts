// Vercel Serverless Function — proxies usage API calls to avoid CORS
// POST /api/usage { provider, apiKey }

interface RequestBody {
  provider: 'openai' | 'anthropic' | 'google'
  apiKey: string
}

export const config = { runtime: 'edge' }

export default async function handler(req: Request) {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json'
  }

  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers })
  }

  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405, headers })
  }

  try {
    const body: RequestBody = await req.json()
    const { provider, apiKey } = body

    if (!provider || !apiKey) {
      return new Response(JSON.stringify({ error: 'Missing provider or apiKey' }), { status: 400, headers })
    }

    let result
    switch (provider) {
      case 'openai':
        result = await fetchOpenAIUsage(apiKey)
        break
      case 'anthropic':
        result = await fetchAnthropicUsage(apiKey)
        break
      case 'google':
        result = await fetchGoogleUsage(apiKey)
        break
      default:
        return new Response(JSON.stringify({ error: `Unknown provider: ${provider}` }), { status: 400, headers })
    }

    return new Response(JSON.stringify(result), { status: 200, headers })
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500, headers })
  }
}

async function fetchOpenAIUsage(apiKey: string) {
  const now = Math.floor(Date.now() / 1000)
  const startOfMonth = Math.floor(new Date(new Date().getFullYear(), new Date().getMonth(), 1).getTime() / 1000)

  // Fetch completions usage
  const completionsRes = await fetch(
    `https://api.openai.com/v1/organization/usage/completions?start_time=${startOfMonth}&end_time=${now}&group_by=model`,
    { headers: { 'Authorization': `Bearer ${apiKey}` } }
  )

  if (!completionsRes.ok) {
    const text = await completionsRes.text()
    if (completionsRes.status === 401) throw new Error('Invalid API key')
    if (completionsRes.status === 403) throw new Error('Key lacks usage permissions — needs api.usage.read scope')
    throw new Error(`OpenAI API ${completionsRes.status}: ${text.slice(0, 200)}`)
  }

  const completionsData = await completionsRes.json()

  // Also try costs endpoint for total spend
  let totalCost = 0
  try {
    const costsRes = await fetch(
      `https://api.openai.com/v1/organization/costs?start_time=${startOfMonth}&end_time=${now}&group_by=line_item`,
      { headers: { 'Authorization': `Bearer ${apiKey}` } }
    )
    if (costsRes.ok) {
      const costsData = await costsRes.json()
      for (const bucket of costsData.data || []) {
        for (const result of bucket.results || []) {
          totalCost += (result.amount?.value || 0) / 100 // cents to dollars
        }
      }
    }
  } catch { /* costs endpoint is optional */ }

  // Parse completions data
  const modelMap = new Map<string, { cost: number; requests: number; input: number; output: number }>()

  for (const bucket of completionsData.data || []) {
    for (const result of bucket.results || []) {
      const model = result.model || result.snapshot_id || 'unknown'
      const existing = modelMap.get(model) || { cost: 0, requests: 0, input: 0, output: 0 }
      existing.requests += result.num_model_requests || 0
      existing.input += result.input_tokens || 0
      existing.output += result.output_tokens || 0
      existing.cost += ((result.input_token_cost || 0) + (result.output_token_cost || 0)) / 100
      modelMap.set(model, existing)
    }
  }

  let totalRequests = 0, totalInput = 0, totalOutput = 0
  const models: { name: string; cost: number; requests: number }[] = []

  for (const [name, stats] of modelMap) {
    totalRequests += stats.requests
    totalInput += stats.input
    totalOutput += stats.output
    if (totalCost === 0) totalCost += stats.cost
    models.push({ name, cost: stats.cost, requests: stats.requests })
  }

  models.sort((a, b) => b.cost - a.cost)

  return {
    provider: 'openai',
    totalSpend: totalCost,
    limit: null,
    requests: totalRequests,
    inputTokens: totalInput,
    outputTokens: totalOutput,
    models
  }
}

async function fetchAnthropicUsage(_apiKey: string) {
  // Anthropic doesn't have a public usage API yet
  throw new Error('Anthropic usage API not publicly available yet')
}

async function fetchGoogleUsage(_apiKey: string) {
  // Google AI Studio doesn't expose usage via API
  throw new Error('Google AI usage API not publicly available yet')
}
