interface ProgressBarProps {
  value: number
  color?: string
  label?: string
  showPercentage?: boolean
  variant?: 'compact' | 'full'
}

function getGradientColor(percent: number): string {
  if (percent < 50) return '#00ff88'
  if (percent < 80) return '#ffaa00'
  return '#ff4466'
}

export function ProgressBar({
  value,
  color,
  label,
  showPercentage = true,
  variant = 'full'
}: ProgressBarProps) {
  const clamped = Math.max(0, Math.min(100, value))
  const fillColor = color || getGradientColor(clamped)
  const isCompact = variant === 'compact'

  return (
    <div
      className="progress-bar-wrapper"
      style={{
        display: 'flex',
        flexDirection: isCompact ? 'row' : 'column',
        gap: isCompact ? '8px' : '6px',
        alignItems: isCompact ? 'center' : 'stretch',
        width: '100%',
      }}
    >
      {label && (
        <span
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: isCompact ? '11px' : '12px',
            color: 'var(--text-secondary)',
            whiteSpace: 'nowrap',
          }}
        >
          {label}
        </span>
      )}
      <div
        style={{
          flex: 1,
          height: isCompact ? '3px' : '6px',
          background: 'var(--border)',
          borderRadius: isCompact ? '1.5px' : '3px',
          overflow: 'hidden',
          position: 'relative',
        }}
      >
        <div
          style={{
            height: '100%',
            width: `${clamped}%`,
            background: `linear-gradient(90deg, ${fillColor}88, ${fillColor})`,
            borderRadius: 'inherit',
            transition: 'width 0.6s ease-out',
            boxShadow: clamped > 0 ? `0 0 8px ${fillColor}40` : 'none',
          }}
        />
      </div>
      {showPercentage && (
        <span
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: isCompact ? '10px' : '11px',
            color: fillColor,
            minWidth: '36px',
            textAlign: 'right',
            fontWeight: 600,
          }}
        >
          {clamped.toFixed(1)}%
        </span>
      )}
    </div>
  )
}
