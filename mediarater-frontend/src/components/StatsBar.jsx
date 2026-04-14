export default function StatsBar({ library }) {
    const movies = library.filter(i => i.type === 'movie')
    const songs  = library.filter(i => i.type === 'song')
    const totalReviews = library.reduce((a, i) => a + i.reviewCount, 0)
    const avgAll = library.length
      ? library.reduce((a, i) => a + i.bayesRating, 0) / library.length
      : 0
  
    const stats = [
      { label: 'Total Items',   value: library.length,    color: 'var(--violet)', bg: 'var(--violet-pale)' },
      { label: 'Movies',        value: movies.length,     color: 'var(--coral)',  bg: 'var(--coral-pale)'  },
      { label: 'Songs',         value: songs.length,      color: 'var(--teal)',   bg: 'var(--teal-pale)'   },
      { label: 'Total Reviews', value: totalReviews,      color: 'var(--blue)',   bg: 'var(--blue-pale)'   },
      { label: 'Avg Rating',    value: avgAll.toFixed(2), color: 'var(--amber)',  bg: 'var(--amber-pale)'  },
    ]
  
    return (
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(110px, 1fr))',
        gap: 12, marginBottom: 32,
      }}>
        {stats.map((s, i) => (
          <div key={s.label} className={`fade-up fade-up-d${Math.min(i+1,4)}`} style={{
            background: s.bg, borderRadius: 'var(--radius-md)',
            padding: '16px 18px', borderLeft: `4px solid ${s.color}`,
          }}>
            <div style={{
              fontFamily: 'var(--font-display)', fontSize: 26, fontWeight: 800,
              color: s.color, lineHeight: 1, marginBottom: 4,
            }}>{s.value}</div>
            <div style={{ fontSize: 12, color: 'var(--text-secondary)', fontWeight: 500 }}>{s.label}</div>
          </div>
        ))}
      </div>
    )
  }