export default function StarRating({ value, max = 5, size = 16, interactive = false, onChange }) {
    const stars = []
    for (let i = 1; i <= max; i++) {
      const filled = value >= i
      const half = !filled && value >= i - 0.5
      stars.push(
        <span
          key={i}
          onClick={interactive && onChange ? () => onChange(i) : undefined}
          style={{
            display: 'inline-block', fontSize: size, lineHeight: 1,
            cursor: interactive ? 'pointer' : 'default',
            color: filled || half ? 'var(--star-fill)' : 'var(--star-empty)',
            transition: 'color 0.15s', userSelect: 'none',
          }}
        >
          {filled ? '★' : half ? '⯨' : '☆'}
        </span>
      )
    }
    return <span style={{ display: 'inline-flex', gap: 1, lineHeight: 1 }}>{stars}</span>
  }