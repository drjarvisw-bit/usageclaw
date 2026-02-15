// UsageClaw Chrome Extension — Popup Script

const PROVIDERS = [
  { id: 'openai', name: 'OpenAI', icon: '◈', color: '#00a67e', desc: 'GPT-4o, o1, o3', status: 'active', placeholder: 'sk-proj-...' },
  { id: 'deepseek', name: 'DeepSeek', icon: '◇', color: '#4D6BFE', desc: 'DeepSeek-V3, R1', status: 'active', placeholder: 'sk-...' },
  { id: 'minimax', name: 'MiniMax', icon: '◎', color: '#FF6B35', desc: 'M2.5, M2.1', status: 'active', placeholder: 'eyJ...' },
  { id: 'anthropic', name: 'Anthropic', icon: '◉', color: '#d4a574', desc: 'Claude', status: 'coming-soon' },
  { id: 'google', name: 'Google AI', icon: '◆', color: '#4285f4', desc: 'Gemini', status: 'coming-soon' },
  { id: 'qwen', name: 'Qwen', icon: '◐', color: '#FF6A00', desc: '通义千问', status: 'coming-soon' },
  { id: 'zhipu', name: 'GLM', icon: '◑', color: '#2563EB', desc: '智谱', status: 'coming-soon' },
  { id: 'together', name: 'Together', icon: '◫', color: '#0EA5E9', desc: 'Llama', status: 'coming-soon' },
  { id: 'groq', name: 'Groq', icon: '◧', color: '#F97316', desc: 'LPU', status: 'coming-soon' },
]

// ── Navigation ──
document.querySelectorAll('.nav button').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.nav button').forEach(b => b.classList.remove('active'))
    document.querySelectorAll('.view').forEach(v => v.classList.remove('active'))
    btn.classList.add('active')
    document.getElementById(`view-${btn.dataset.view}`).classList.add('active')
  })
})

// ── Init ──
async function init() {
  const { keys = {} } = await chrome.storage.local.get('keys')
  renderConfig(keys)
  renderDashboard(keys)
}

// ── Config View ──
function renderConfig(keys) {
  const active = PROVIDERS.filter(p => p.status === 'active')
  const soon = PROVIDERS.filter(p => p.status === 'coming-soon')

  const el = document.getElementById('config-content')
  el.innerHTML = active.map(p => `
    <div class="config-section" data-provider="${p.id}">
      <div class="config-label">
        <span style="color:${p.color}">${p.icon}</span>
        <span>${p.name}</span>
        ${keys[p.id] ? '<span class="saved-badge">✓ saved</span>' : ''}
      </div>
      <div class="config-input-row">
        <input class="config-input" type="password" placeholder="${p.placeholder}"
          value="${keys[p.id] || ''}" data-provider="${p.id}" spellcheck="false" />
        <button class="btn" data-action="save" data-provider="${p.id}">Save</button>
        ${keys[p.id] ? `<button class="btn btn-danger" data-action="remove" data-provider="${p.id}">✕</button>` : ''}
      </div>
    </div>
  `).join('') + `
    <div class="coming-soon">
      <div class="coming-soon-title">⏳ coming soon — waiting for usage API access</div>
      <div class="coming-soon-grid">
        ${soon.map(p => `
          <div class="coming-soon-item">
            <span style="color:${p.color}">${p.icon}</span>
            <span>${p.name}</span>
          </div>
        `).join('')}
      </div>
    </div>
  `

  // Event listeners
  el.querySelectorAll('[data-action="save"]').forEach(btn => {
    btn.addEventListener('click', async () => {
      const pid = btn.dataset.provider
      const input = el.querySelector(`input[data-provider="${pid}"]`)
      const val = input.value.trim()
      if (!val) return
      const { keys = {} } = await chrome.storage.local.get('keys')
      keys[pid] = val
      await chrome.storage.local.set({ keys })
      renderConfig(keys)
      renderDashboard(keys)
    })
  })

  el.querySelectorAll('[data-action="remove"]').forEach(btn => {
    btn.addEventListener('click', async () => {
      const pid = btn.dataset.provider
      const { keys = {} } = await chrome.storage.local.get('keys')
      delete keys[pid]
      await chrome.storage.local.set({ keys })
      renderConfig(keys)
      renderDashboard(keys)
    })
  })
}

// ── Dashboard View ──
async function renderDashboard(keys) {
  const el = document.getElementById('dashboard-content')
  const connected = PROVIDERS.filter(p => p.status === 'active' && keys[p.id])

  if (connected.length === 0) {
    el.innerHTML = `
      <div class="empty-state">
        <div class="icon">🦀</div>
        <div class="title">No providers connected</div>
        <div class="desc">Go to Config to add your API keys</div>
      </div>
    `
    return
  }

  // Show loading state for each
  el.innerHTML = connected.map(p => `
    <div class="provider-section" id="provider-${p.id}">
      <div class="provider-header">
        <div class="provider-name">
          <span class="status-dot" style="background: var(--text-muted)"></span>
          <span class="provider-icon" style="color:${p.color}">${p.icon}</span>
          <span>${p.name}</span>
        </div>
        <button class="refresh-btn" data-refresh="${p.id}">↻</button>
      </div>
      <div class="loading-bar"><div class="loading-bar-inner"></div></div>
      <span style="font-size:10px;color:var(--text-muted)">fetching usage data...</span>
    </div>
  `).join('')

  // Fetch each provider
  for (const p of connected) {
    try {
      const data = await fetchProviderUsage(p.id, keys[p.id])
      renderProviderData(p, data)
      // Cache it
      await chrome.storage.local.set({ [`cache_${p.id}`]: { data, ts: Date.now() } })
    } catch (err) {
      renderProviderError(p, err.message)
    }
  }

  // Refresh buttons
  el.querySelectorAll('[data-refresh]').forEach(btn => {
    btn.addEventListener('click', async () => {
      const pid = btn.dataset.refresh
      const p = PROVIDERS.find(x => x.id === pid)
      btn.classList.add('spinning')
      try {
        const data = await fetchProviderUsage(pid, keys[pid])
        renderProviderData(p, data)
        await chrome.storage.local.set({ [`cache_${pid}`]: { data, ts: Date.now() } })
      } catch (err) {
        renderProviderError(p, err.message)
      }
      btn.classList.remove('spinning')
    })
  })
}

function renderProviderData(provider, data) {
  const el = document.getElementById(`provider-${provider.id}`)
  if (!el) return

  const statusColor = data.totalSpend > 80 ? '#ff4466' : data.totalSpend > 40 ? '#ffaa00' : '#00ff88'

  el.innerHTML = `
    <div class="provider-header">
      <div class="provider-name">
        <span class="status-dot" style="background: ${statusColor}"></span>
        <span class="provider-icon" style="color:${provider.color}">${provider.icon}</span>
        <span>${provider.name}</span>
      </div>
      <button class="refresh-btn" data-refresh="${provider.id}">↻</button>
    </div>
    <div class="spend-row">
      <span class="spend-currency">$</span>
      <span class="spend-value">${data.totalSpend.toFixed(2)}</span>
      <span class="spend-label">this month</span>
    </div>
    <div class="stats-grid">
      <div class="stat">
        <span class="stat-value">${formatNum(data.requests)}</span>
        <span class="stat-label">Requests</span>
      </div>
      <div class="stat">
        <span class="stat-value">${formatNum(data.inputTokens)}</span>
        <span class="stat-label">Input Tokens</span>
      </div>
      <div class="stat">
        <span class="stat-value">${formatNum(data.outputTokens)}</span>
        <span class="stat-label">Output Tokens</span>
      </div>
    </div>
    ${data.models && data.models.length > 0 ? `
      <div class="models-list">
        <div class="models-title">Models</div>
        ${data.models.slice(0, 8).map(m => `
          <div class="model-row">
            <span class="model-name">${m.name}</span>
            <span class="model-cost">$${m.cost.toFixed(2)}</span>
          </div>
        `).join('')}
      </div>
    ` : ''}
    ${data.note ? `<div style="font-size:10px;color:var(--text-muted);margin-top:8px;">${data.note}</div>` : ''}
  `
}

function renderProviderError(provider, message) {
  const el = document.getElementById(`provider-${provider.id}`)
  if (!el) return

  el.innerHTML = `
    <div class="provider-header">
      <div class="provider-name">
        <span class="status-dot" style="background: var(--danger)"></span>
        <span class="provider-icon" style="color:${provider.color}">${provider.icon}</span>
        <span>${provider.name}</span>
      </div>
      <button class="refresh-btn" data-refresh="${provider.id}">↻</button>
    </div>
    <div class="error-box">
      <span>⚠</span>
      <span>${message}</span>
    </div>
  `
}

// ── API Fetchers ──
async function fetchProviderUsage(provider, apiKey) {
  switch (provider) {
    case 'openai': return fetchOpenAI(apiKey)
    case 'deepseek': return fetchDeepSeek(apiKey)
    case 'minimax': return fetchMiniMax(apiKey)
    default: throw new Error('Provider not supported yet')
  }
}

async function fetchOpenAI(apiKey) {
  const now = Math.floor(Date.now() / 1000)
  const startOfMonth = Math.floor(new Date(new Date().getFullYear(), new Date().getMonth(), 1).getTime() / 1000)

  const completionsRes = await fetch(
    `https://api.openai.com/v1/organization/usage/completions?start_time=${startOfMonth}&end_time=${now}&group_by=model`,
    { headers: { 'Authorization': `Bearer ${apiKey}` } }
  )

  if (!completionsRes.ok) {
    if (completionsRes.status === 401) throw new Error('Invalid API key')
    if (completionsRes.status === 403) {
      const body = await completionsRes.json().catch(() => ({}))
      if (body.error?.includes?.('usage')) throw new Error('Key needs api.usage.read scope — regenerate at platform.openai.com/api-keys')
      throw new Error('Key lacks usage permissions — needs api.usage.read scope')
    }
    throw new Error(`OpenAI API error: ${completionsRes.status}`)
  }

  const completionsData = await completionsRes.json()

  // Costs endpoint
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
          totalCost += (result.amount?.value || 0) / 100
        }
      }
    }
  } catch {}

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

async function fetchDeepSeek(apiKey) {
  const res = await fetch('https://api.deepseek.com/user/balance', {
    headers: { 'Authorization': `Bearer ${apiKey}` }
  })
  if (!res.ok) {
    if (res.status === 401) throw new Error('Invalid API key')
    throw new Error(`DeepSeek API error: ${res.status}`)
  }

  const data = await res.json()
  const info = data.balance_infos?.[0]
  const total = parseFloat(info?.total_balance || '0')
  const granted = parseFloat(info?.granted_balance || '0')
  const topped = parseFloat(info?.topped_up_balance || '0')
  const currency = info?.currency || 'CNY'

  return {
    totalSpend: 0,
    requests: 0,
    inputTokens: 0,
    outputTokens: 0,
    models: [],
    note: `Balance: ${currency} ${total.toFixed(2)} (granted: ${granted.toFixed(2)}, topped up: ${topped.toFixed(2)})`
  }
}

async function fetchMiniMax(apiKey) {
  const res = await fetch('https://www.minimax.io/v1/api/openplatform/coding_plan/remains', {
    headers: { 'Authorization': `Bearer ${apiKey}`, 'Content-Type': 'application/json' }
  })
  if (!res.ok) {
    if (res.status === 401) throw new Error('Invalid API key')
    if (res.status === 403) throw new Error('Key does not have Coding Plan access')
    throw new Error(`MiniMax API error: ${res.status}`)
  }

  const data = await res.json()
  return {
    totalSpend: 0,
    requests: 0,
    inputTokens: 0,
    outputTokens: 0,
    models: [],
    note: `Coding Plan: ${JSON.stringify(data.data || data)}`
  }
}

// ── Helpers ──
function formatNum(n) {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + 'M'
  if (n >= 1_000) return (n / 1_000).toFixed(1) + 'K'
  return n.toString()
}

// Go
init()
