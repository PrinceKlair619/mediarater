import StarRating from './StarRating'

const typeColors = {
  movie: { bg: 'var(--coral-pale)', text: 'var(--coral)', label: 'MOVIE' },
  song:  { bg: 'var(--teal-pale)',  text: 'var(--teal)',  label: 'SONG'  },
}

const genreEmoji = {
  movie: ['🎬', '🎥', '🍿', '🎞️', '🏆'],
  song:  ['🎵', '🎶', '🎸', '🎤', '🎧'],
}

function getEmoji(item) {
  const list = genreEmoji[item.type]
  const idx = Math.abs(item.title.charCodeAt(0) + (item.title.charCodeAt(1) || 0)) % list.length
  return list[idx]
}

export default function MediaCard({ item, rank, onClick }) {
  const colors = typeColors[item.type]
  const emoji = getEmoji(item)

  return (
    <article
      onClick={() => onClick && onClick(item)}
      style={{
        background: 'var(--bg-card)', border: '1px solid var(--border)',
        borderRadius: 'var(--radius-lg)', padding: '20px', cursor: 'pointer',
        transition: 'transform 0.18s, box-shadow 0.18s, border-color 0.18s',
        position: 'relative', overflow: 'hidden',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.transform = 'translateY(-3px)'
        e.currentTarget.style.boxShadow = 'var(--shadow-md)'
        e.currentTarget.style.borderColor = 'var(--border-strong)'
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = 'translateY(0)'
        e.currentTarget.style.boxShadow = 'none'
        e.currentTarget.style.borderColor = 'var(--border)'
      }}
    >
      {rank != null && (
        <span style={{
          position: 'absolute', top: 14, right: 14,
          fontFamily: 'var(--font-display)', fontSize: 11, fontWeight: 800,
          letterSpacing: '0.08em', color: 'var(--text-muted)',
        }}>#{rank}</span>
      )}

      <span style={{
        display: 'inline-block', background: colors.bg, color: colors.text,
        fontSize: 10, fontWeight: 700, letterSpacing: '0.12em',
        padding: '3px 8px', borderRadius: 6, marginBottom: 10,
        fontFamily: 'var(--font-display)',
      }}>{colors.label}</span>

      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: 8 }}>
        <span style={{ fontSize: 28, lineHeight: 1, flexShrink: 0 }}>{emoji}</span>
        <h3 style={{
          fontFamily: 'var(--font-display)', fontSize: 15, fontWeight: 700,
          color: 'var(--text-primary)', lineHeight: 1.3,
        }}>{item.title}</h3>
      </div>

      <p style={{
        fontSize: 13, color: 'var(--text-secondary)', marginBottom: 12,
        overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
      }}>
        {item.type === 'song'
          ? `by ${item.artist}`
          : `Cast: ${item.cast?.slice(0,3).join(', ')}${item.cast?.length > 3 ? '…' : ''}`}
      </p>

      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <StarRating value={Math.round(item.bayesRating * 2) / 2} />
        <span style={{
          fontFamily: 'var(--font-display)', fontSize: 14, fontWeight: 700,
          color: 'var(--text-primary)',
        }}>{item.bayesRating.toFixed(2)}</span>
        <span style={{ fontSize: 12, color: 'var(--text-muted)', marginLeft: 'auto' }}>
          {item.reviewCount} {item.reviewCount === 1 ? 'review' : 'reviews'}
        </span>
      </div>
    </article>
  )
}