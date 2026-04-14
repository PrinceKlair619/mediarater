export default function StatsBar({ library }) {
  const movies = library.filter(i => i.type === 'movie')
  const songs  = library.filter(i => i.type === 'song')
  const totalReviews = library.reduce((a, i) => a + i.reviewCount, 0)
  const avgAll = library.length
    ? library.reduce((a, i) => a + i.bayesRating, 0) / library.length
    : 0

  const stats = [
    { label: 'Total Items',   value: library.length,    color: 'var(--violet)', bg: 'var(--violet-pale)', accent: '#7C4DFF' },
    { label: 'Movies',        value: movies.length,     color: 'var(--coral)',  bg: 'var(--coral-pale)',  accent: '#FF5C4D' },
    { label: 'Songs',         value: songs.length,      color: 'var(--teal)',   bg: 'var(--teal-pale)',   accent: '#00C9A7' },
    { label: 'Total Reviews', value: totalReviews,      color: 'var(--blue)',   bg: 'var(--blue-pale)',   accent: '#2979FF' },
    { label: 'Avg Rating',    value: avgAll.toFixed(2), color: 'var(--amber)',  bg: 'var(--amber-pale)',  accent: '#FFB020' },
  ]

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
      gap: 14, marginBottom: 36,
    }}>
      {stats.map((s, i) => (
        <div
          key={s.label}
          className={`fade-up fade-up-d${Math.min(i+1,4)}`}
          style={{
            background: 'var(--bg-card)',
            borderRadius: 'var(--radius-lg)',
            padding: '20px 20px 16px',
            border: '1px solid var(--border)',
            borderTop: `3px solid ${s.color}`,
            boxShadow: 'var(--shadow-sm)',
            position: 'relative',
            overflow: 'hidden',
            transition: 'transform 0.18s, box-shadow 0.18s',
          }}
          onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = 'var(--shadow-md)' }}
          onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'var(--shadow-sm)' }}
        >
          {/* Background glow blob */}
          <div style={{
            position: 'absolute', bottom: -20, right: -20,
            width: 70, height: 70, borderRadius: '50%',
            background: s.color, opacity: 0.08,
          }} />

          <div style={{
            fontSize: 30, fontWeight: 900, letterSpacing: '-0.04em',
            color: s.color, lineHeight: 1, marginBottom: 6,
          }}>{s.value}</div>
          <div style={{ fontSize: 13, color: 'var(--text-secondary)', fontWeight: 500 }}>{s.label}</div>
        </div>
      ))}
    </div>
  )
}
