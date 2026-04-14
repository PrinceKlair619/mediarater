import StarRating from './StarRating'

const typeConfig = {
  movie: { color: 'var(--coral)',  pale: 'var(--coral-pale)',  label: 'MOVIE' },
  song:  { color: 'var(--teal)',   pale: 'var(--teal-pale)',   label: 'SONG'  },
}

// Deterministic color accent from title char codes
const ACCENTS = [
  'var(--coral)','var(--violet)','var(--teal)',
  'var(--amber)','var(--blue)','var(--pink)','var(--green)'
]
function getAccent(title) {
  const code = (title.charCodeAt(0) + (title.charCodeAt(1) || 0) + (title.charCodeAt(2) || 0))
  return ACCENTS[code % ACCENTS.length]
}

// Music note SVG icon (small inline)
function NoteIcon({ color, size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 18 18" fill="none">
      <path d="M7 14V5l7-1.5V12" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
      <circle cx="5" cy="14" r="2" fill={color}/>
      <circle cx="12" cy="12" r="2" fill={color}/>
    </svg>
  )
}
function FilmIcon({ color, size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 18 18" fill="none">
      <rect x="1" y="3" width="16" height="12" rx="2" stroke={color} strokeWidth="1.5"/>
      <path d="M1 7h16M1 11h16M5 3v12M13 3v12" stroke={color} strokeWidth="1.2"/>
    </svg>
  )
}

export default function MediaCard({ item, rank, onClick }) {
  const cfg    = typeConfig[item.type]
  const accent = getAccent(item.title)

  return (
    <article
      onClick={() => onClick && onClick(item)}
      style={{
        background: 'var(--bg-card)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius-lg)',
        padding: '20px',
        cursor: 'pointer',
        transition: 'transform 0.18s, box-shadow 0.18s, border-color 0.18s',
        position: 'relative',
        overflow: 'hidden',
        boxShadow: 'var(--shadow-sm)',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.transform = 'translateY(-4px)'
        e.currentTarget.style.boxShadow = 'var(--shadow-lg)'
        e.currentTarget.style.borderColor = 'var(--border-strong)'
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = 'translateY(0)'
        e.currentTarget.style.boxShadow = 'var(--shadow-sm)'
        e.currentTarget.style.borderColor = 'var(--border)'
      }}
    >
      {/* Colored top accent bar */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: 3,
        background: `linear-gradient(90deg, ${cfg.color}, ${accent})`,
        borderRadius: 'var(--radius-lg) var(--radius-lg) 0 0',
      }} />

      {/* Rank badge */}
      {rank != null && (
        <div style={{
          position: 'absolute', top: 14, right: 14,
          background: 'var(--bg)',
          border: '1px solid var(--border-strong)',
          borderRadius: 99,
          padding: '2px 10px',
          fontSize: 12, fontWeight: 700,
          color: 'var(--text-muted)',
          letterSpacing: '0.04em',
        }}>#{rank}</div>
      )}

      {/* Type badge + icon */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 14, marginTop: 6 }}>
        <div style={{
          background: cfg.pale,
          borderRadius: 8, padding: '5px 7px',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          {item.type === 'song'
            ? <NoteIcon color={cfg.color} />
            : <FilmIcon color={cfg.color} />}
        </div>
        <span style={{
          fontSize: 11, fontWeight: 700, letterSpacing: '0.10em',
          color: cfg.color, textTransform: 'uppercase',
        }}>{cfg.label}</span>
      </div>

      {/* Title */}
      <h3 style={{
        fontSize: 16, fontWeight: 700, letterSpacing: '-0.02em',
        color: 'var(--text-primary)', lineHeight: 1.3, marginBottom: 6,
        display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
        overflow: 'hidden',
      }}>{item.title}</h3>

      {/* Subtitle */}
      <p style={{
        fontSize: 14, color: 'var(--text-secondary)', marginBottom: 16,
        overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
        fontWeight: 400,
      }}>
        {item.type === 'song'
          ? `${item.artist}`
          : `${item.cast?.slice(0, 3).join(', ')}${item.cast?.length > 3 ? '...' : ''}`}
      </p>

      {/* Divider */}
      <div style={{ height: 1, background: 'var(--border)', marginBottom: 14 }} />

      {/* Rating row */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <StarRating value={Math.round(item.bayesRating * 2) / 2} />
        <span style={{
          fontSize: 15, fontWeight: 800, letterSpacing: '-0.02em',
          color: accent,
        }}>{item.bayesRating.toFixed(2)}</span>
        <span style={{
          fontSize: 12, color: 'var(--text-muted)', marginLeft: 'auto', fontWeight: 500,
        }}>
          {item.reviewCount} {item.reviewCount === 1 ? 'review' : 'reviews'}
        </span>
      </div>
    </article>
  )
}
