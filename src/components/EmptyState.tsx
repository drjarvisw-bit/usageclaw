export function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-8">
      <div className="w-full max-w-[480px] bg-[var(--bg-card)] border border-[var(--border)] rounded-xl overflow-hidden">
        <div className="flex gap-1.5 px-4 py-3 border-b border-[var(--border)]">
          <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]"></span>
          <span className="w-2.5 h-2.5 rounded-full bg-[#febc2e]"></span>
          <span className="w-2.5 h-2.5 rounded-full bg-[#28c840]"></span>
        </div>
        <div className="p-4 font-[var(--font-mono)] text-[13px]">
          <div className="flex gap-2 mb-1.5">
            <span className="text-[var(--accent)]">$</span>
            <span className="text-[var(--text-primary)]">usageclaw init</span>
          </div>
          <div className="flex gap-2 mb-1.5 pl-1">
            <span className="text-[var(--text-secondary)]">→ no API keys configured</span>
          </div>
          <div className="flex gap-2 mb-1.5 pl-1">
            <span className="text-[var(--text-secondary)]">→ go to Config to add your keys</span>
          </div>
          <div className="flex gap-2">
            <span className="text-[var(--accent)]">$</span>
            <span className="text-[var(--accent)] animate-[blink_1s_step-end_infinite]">█</span>
          </div>
        </div>
      </div>
      <div className="text-center">
        <h2 className="font-[var(--font-mono)] text-lg font-semibold mb-2">No providers connected</h2>
        <p className="text-sm text-[var(--text-secondary)] mb-1">
          Add your API keys in <strong>Config</strong> to start monitoring usage.
        </p>
        <p className="font-[var(--font-mono)] text-[11px] text-[var(--text-muted)] mt-3">
          Keys are stored locally in your browser. Nothing leaves your machine.
        </p>
      </div>
    </div>
  )
}
