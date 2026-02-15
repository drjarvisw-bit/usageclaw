import { useState } from 'react'
import { useApiKeys } from '../context/ApiKeyContext'
import { PROVIDERS } from '../types'
import type { ProviderConfig } from '../types'

export function Settings() {
  const { keys, setKey, removeKey } = useApiKeys()

  return (
    <div className="flex flex-col gap-6 max-w-[640px]">
      <div className="py-4">
        <div className="font-[var(--font-mono)] text-sm flex items-center gap-2">
          <span className="text-[var(--accent)]">$</span>
          <span className="text-[var(--text-primary)]">usageclaw config</span>
          <span className="text-[var(--accent-secondary)]">--edit</span>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        {PROVIDERS.map(provider => (
          <KeyInput
            key={provider.id}
            provider={provider}
            value={keys[provider.id] || ''}
            onChange={(v) => v ? setKey(provider.id, v) : removeKey(provider.id)}
          />
        ))}
      </div>

      <div className="mt-2">
        <div className="flex gap-3 p-4 bg-[var(--bg-card)] border border-[var(--border)] rounded-xl">
          <span className="text-xl">🔒</span>
          <div>
            <strong className="font-[var(--font-mono)] text-[13px] block mb-1">Local Storage Only</strong>
            <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
              Your API keys are stored in your browser's localStorage. They never leave your machine — zero server calls, zero tracking.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

function KeyInput({ provider, value, onChange }: {
  provider: ProviderConfig
  value: string
  onChange: (v: string) => void
}) {
  const [show, setShow] = useState(false)
  const [input, setInput] = useState(value)
  const saved = value === input && value.length > 0

  const handleSave = () => {
    if (input.trim()) onChange(input.trim())
  }

  const handleRemove = () => {
    setInput('')
    onChange('')
  }

  return (
    <div
      className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-5 transition-colors duration-200 animate-[fadeIn_0.3s_ease-out] hover:border-[var(--provider-color,var(--border))]"
      style={{ '--provider-color': provider.color } as React.CSSProperties}
    >
      <div className="flex justify-between items-center mb-3 flex-wrap gap-2">
        <div className="flex items-center gap-2 font-[var(--font-mono)] font-semibold text-sm">
          <span className="text-base" style={{ color: provider.color }}>{provider.icon}</span>
          <span>{provider.name}</span>
        </div>
        <span className="font-[var(--font-mono)] text-[11px] text-[var(--text-muted)]">{provider.description}</span>
      </div>

      <div className="flex gap-2 mb-2.5">
        <input
          type={show ? 'text' : 'password'}
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="sk-..."
          spellCheck={false}
          className="flex-1 bg-[var(--bg-primary)] border border-[var(--border)] rounded-lg px-3.5 py-2.5 font-[var(--font-mono)] text-[13px] text-[var(--text-primary)] outline-none transition-colors duration-150 placeholder:text-[var(--text-muted)] focus:border-[var(--provider-color,var(--accent))]"
          style={{ '--provider-color': provider.color } as React.CSSProperties}
        />
        <button
          className="bg-[var(--bg-primary)] border border-[var(--border)] rounded-lg w-10 text-[var(--text-secondary)] cursor-pointer text-sm transition-all duration-150 hover:text-[var(--text-primary)] hover:border-[var(--text-muted)]"
          onClick={() => setShow(!show)}
        >
          {show ? '◉' : '○'}
        </button>
      </div>

      <div className="flex gap-2 items-center">
        {!saved && input.length > 0 && (
          <button
            className="bg-[var(--accent-dim)] border border-[var(--border-glow)] text-[var(--accent)] px-4 py-1.5 rounded-md font-[var(--font-mono)] text-xs cursor-pointer transition-all duration-150 hover:bg-[var(--accent)] hover:text-[var(--bg-primary)]"
            onClick={handleSave}
          >
            Save
          </button>
        )}
        {saved && (
          <span className="font-[var(--font-mono)] text-[11px] text-[var(--accent)]">✓ saved</span>
        )}
        {value && (
          <button
            className="bg-transparent border-none text-[var(--text-muted)] font-[var(--font-mono)] text-[11px] cursor-pointer px-2 py-1.5 hover:text-[var(--danger)]"
            onClick={handleRemove}
          >
            Remove
          </button>
        )}
      </div>
    </div>
  )
}
