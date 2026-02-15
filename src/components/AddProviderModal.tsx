import { useState } from 'react'
import { useApiKeys } from '../context/ApiKeyContext'
import { PROVIDERS } from '../types'
import type { ProviderConfig } from '../types'

interface AddProviderModalProps {
  onClose: () => void
}

export function AddProviderModal({ onClose }: AddProviderModalProps) {
  const { keys, setKey } = useApiKeys()
  const [selected, setSelected] = useState<ProviderConfig | null>(null)
  const [apiKey, setApiKey] = useState('')
  const [show, setShow] = useState(false)

  const availableProviders = PROVIDERS.filter(p => p.status === 'active' && !keys[p.id])

  const handleSave = () => {
    if (selected && apiKey.trim()) {
      setKey(selected.id, apiKey.trim())
      onClose()
    }
  }

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) onClose()
  }

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center bg-black/70 backdrop-blur-sm animate-[fadeIn_0.2s_ease-out]"
      onClick={handleBackdropClick}
    >
      <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl w-full max-w-md mx-4 overflow-hidden animate-[fadeIn_0.3s_ease-out]">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--border)]">
          <div className="font-[var(--font-mono)] text-sm flex items-center gap-2">
            <span className="text-[var(--accent)]">$</span>
            <span>add-provider</span>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 flex items-center justify-center rounded-md text-[var(--text-muted)] bg-transparent border-none cursor-pointer text-lg transition-colors duration-150 hover:text-[var(--text-primary)] hover:bg-[var(--bg-card-hover)]"
          >
            ×
          </button>
        </div>

        {/* Body */}
        <div className="p-5">
          {!selected ? (
            <div className="flex flex-col gap-2">
              <p className="font-[var(--font-mono)] text-[11px] text-[var(--text-muted)] mb-2">
                Select a provider to connect:
              </p>
              {availableProviders.map(provider => (
                <button
                  key={provider.id}
                  onClick={() => setSelected(provider)}
                  className="flex items-center gap-3 p-3.5 rounded-lg border border-[var(--border)] bg-[var(--bg-secondary)] cursor-pointer transition-all duration-150 text-left hover:border-[var(--border-glow)] hover:bg-[var(--bg-card-hover)]"
                >
                  <span className="text-lg" style={{ color: provider.color }}>{provider.icon}</span>
                  <div className="flex-1">
                    <div className="font-[var(--font-mono)] text-sm font-semibold text-[var(--text-primary)]">
                      {provider.name}
                    </div>
                    <div className="font-[var(--font-mono)] text-[11px] text-[var(--text-muted)]">
                      {provider.description}
                    </div>
                  </div>
                  <span className="text-[var(--text-muted)] text-sm">→</span>
                </button>
              ))}
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              <button
                onClick={() => { setSelected(null); setApiKey(''); setShow(false) }}
                className="font-[var(--font-mono)] text-[11px] text-[var(--text-muted)] bg-transparent border-none cursor-pointer text-left p-0 hover:text-[var(--text-primary)]"
              >
                ← back
              </button>

              <div className="flex items-center gap-2">
                <span className="text-lg" style={{ color: selected.color }}>{selected.icon}</span>
                <span className="font-[var(--font-mono)] font-semibold text-sm">{selected.name}</span>
              </div>

              <div>
                <label className="font-[var(--font-mono)] text-[11px] text-[var(--text-muted)] block mb-2">
                  API Key
                </label>
                <div className="flex gap-2">
                  <input
                    type={show ? 'text' : 'password'}
                    value={apiKey}
                    onChange={e => setApiKey(e.target.value)}
                    placeholder="sk-..."
                    spellCheck={false}
                    autoFocus
                    className="flex-1 bg-[var(--bg-primary)] border border-[var(--border)] rounded-lg px-3.5 py-2.5 font-[var(--font-mono)] text-[13px] text-[var(--text-primary)] outline-none transition-colors duration-150 placeholder:text-[var(--text-muted)] focus:border-[var(--accent)]"
                    onKeyDown={e => { if (e.key === 'Enter') handleSave() }}
                  />
                  <button
                    className="bg-[var(--bg-primary)] border border-[var(--border)] rounded-lg w-10 text-[var(--text-secondary)] cursor-pointer text-sm transition-all duration-150 hover:text-[var(--text-primary)] hover:border-[var(--text-muted)]"
                    onClick={() => setShow(!show)}
                  >
                    {show ? '◉' : '○'}
                  </button>
                </div>
              </div>

              <p className="font-[var(--font-mono)] text-[10px] text-[var(--text-muted)] leading-relaxed">
                Your key is stored only in this browser's localStorage. It is never sent to any server.
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        {selected && (
          <div className="flex justify-end gap-2 px-5 py-4 border-t border-[var(--border)]">
            <button
              onClick={onClose}
              className="px-4 py-1.5 rounded-md font-[var(--font-mono)] text-xs text-[var(--text-muted)] bg-transparent border border-[var(--border)] cursor-pointer transition-all duration-150 hover:text-[var(--text-primary)] hover:border-[var(--text-muted)]"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={!apiKey.trim()}
              className="px-4 py-1.5 rounded-md font-[var(--font-mono)] text-xs bg-[var(--accent-dim)] border border-[var(--border-glow)] text-[var(--accent)] cursor-pointer transition-all duration-150 hover:bg-[var(--accent)] hover:text-[var(--bg-primary)] disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-[var(--accent-dim)] disabled:hover:text-[var(--accent)]"
            >
              Connect
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
