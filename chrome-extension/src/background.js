// Background service worker — periodic usage refresh
chrome.alarms.create('refresh-usage', { periodInMinutes: 30 })

chrome.alarms.onAlarm.addListener(async (alarm) => {
  if (alarm.name === 'refresh-usage') {
    // Trigger refresh for badge update
    const { keys } = await chrome.storage.local.get('keys')
    if (!keys) return

    if (keys.openai) {
      try {
        const data = await fetchOpenAIUsage(keys.openai)
        await chrome.storage.local.set({ 'cache_openai': { data, ts: Date.now() } })
        // Update badge with total spend
        const total = data.totalSpend.toFixed(0)
        chrome.action.setBadgeText({ text: `$${total}` })
        chrome.action.setBadgeBackgroundColor({ color: '#00a67e' })
      } catch (e) {
        console.error('Background refresh failed:', e)
      }
    }
  }
})

async function fetchOpenAIUsage(apiKey) {
  const now = Math.floor(Date.now() / 1000)
  const startOfMonth = Math.floor(new Date(new Date().getFullYear(), new Date().getMonth(), 1).getTime() / 1000)

  const [completionsRes, costsRes] = await Promise.all([
    fetch(`https://api.openai.com/v1/organization/usage/completions?start_time=${startOfMonth}&end_time=${now}&group_by=model`, {
      headers: { 'Authorization': `Bearer ${apiKey}` }
    }),
    fetch(`https://api.openai.com/v1/organization/costs?start_time=${startOfMonth}&end_time=${now}&group_by=line_item`, {
      headers: { 'Authorization': `Bearer ${apiKey}` }
    }).catch(() => null)
  ])

  if (!completionsRes.ok) throw new Error(`API ${completionsRes.status}`)

  const completionsData = await completionsRes.json()
  let totalCost = 0

  if (costsRes?.ok) {
    const costsData = await costsRes.json()
    for (const bucket of costsData.data || []) {
      for (const result of bucket.results || []) {
        totalCost += (result.amount?.value || 0) / 100
      }
    }
  }

  const modelMap = new Map()
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
  const models = []
  for (const [name, stats] of modelMap) {
    totalRequests += stats.requests
    totalInput += stats.input
    totalOutput += stats.output
    if (totalCost === 0) totalCost += stats.cost
    models.push({ name, cost: stats.cost, requests: stats.requests })
  }
  models.sort((a, b) => b.cost - a.cost)

  return { totalSpend: totalCost, requests: totalRequests, inputTokens: totalInput, outputTokens: totalOutput, models }
}
