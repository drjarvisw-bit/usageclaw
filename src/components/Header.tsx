interface HeaderProps {
  view: 'dashboard' | 'settings'
  setView: (v: 'dashboard' | 'settings') => void
}

export function Header({ view, setView }: HeaderProps) {
  return (
    <header className="border-b border-[var(--border)] bg-[var(--bg-secondary)] backdrop-blur-[20px] sticky top-0 z-[100]">
      <div className="max-w-[1400px] mx-auto px-4 md:px-8 h-14 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <span className="text-[22px]">🦀</span>
          <span className="font-[var(--font-mono)] text-base font-semibold tracking-tight">
            <span className="text-[var(--text-primary)]">Usage</span>
            <span className="text-[var(--accent)]">Claw</span>
          </span>
          <span className="font-[var(--font-mono)] text-[10px] text-[var(--text-muted)] border border-[var(--border)] px-1.5 py-0.5 rounded">
            v0.1.0
          </span>
        </div>

        <nav className="flex gap-1">
          <button
            className={`flex items-center gap-1.5 px-3.5 py-1.5 border rounded-md font-[var(--font-mono)] text-[13px] cursor-pointer transition-all duration-150 ${
              view === 'dashboard'
                ? 'text-[var(--accent)] bg-[var(--accent-dim)] border-[var(--border-glow)]'
                : 'text-[var(--text-secondary)] bg-transparent border-transparent hover:text-[var(--text-primary)] hover:bg-[var(--bg-card)]'
            }`}
            onClick={() => setView('dashboard')}
          >
            <span className="text-sm">▦</span>
            <span>Dashboard</span>
          </button>
          <button
            className={`flex items-center gap-1.5 px-3.5 py-1.5 border rounded-md font-[var(--font-mono)] text-[13px] cursor-pointer transition-all duration-150 ${
              view === 'settings'
                ? 'text-[var(--accent)] bg-[var(--accent-dim)] border-[var(--border-glow)]'
                : 'text-[var(--text-secondary)] bg-transparent border-transparent hover:text-[var(--text-primary)] hover:bg-[var(--bg-card)]'
            }`}
            onClick={() => setView('settings')}
          >
            <span className="text-sm">⚙</span>
            <span>Config</span>
          </button>
        </nav>

        <div className="hidden md:flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)] animate-[pulse-glow_2s_infinite]"></span>
          <span className="font-[var(--font-mono)] text-[11px] text-[var(--text-muted)]">client-side only</span>
        </div>
      </div>
    </header>
  )
}
