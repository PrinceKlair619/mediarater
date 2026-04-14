import StarRating from './StarRating'

export default function DetailModal({ item, onClose }) {
  if (!item) return null

  const isSong = item.type === 'song'
  const accent = isSong ? 'var(--teal)' : 'var(--coral)'
  const accentPale = isSong ? 'var(--teal-pale)' : 'var(--coral-pale)'

  const ratingDist = [1,2,3,4,5].map(star => ({
    star, count: item.ratings?.filter(r => r.value === star).length || 0,
  }))
  const maxCount = Math.max(...ratingDist.map(r => r.count), 1)

  return (
    <div onClick={onClose} style={{
      position: 'fixed', inset: 0, zIndex: 1000,
      background: 'rgba(0,0,0,0.55)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '1rem', backdropFilter: 'blur(4px)',
    }}>
      <div onClick={e => e.stopPropagation()} style={{
        background: 'var(--bg-card)', borderRadius: 'var(--radius-xl)',
        border: '1px solid var(--border)', width: '100%', maxWidth: 520,
        maxHeight: '88vh', overflowY: 'auto',
        boxShadow: '0 24px 80px rgba(0,0,0,0.25)',
        animation: 'fadeUp 0.25s cubic-bezier(0.4,0,0.2,1) both',
      }}>

        {/* Header */}
        <div style={{
          background: accentPale,
          borderRadius: 'var(--radius-xl) var(--radius-xl) 0 0',
          padding: '28px 28px 20px', position: 'relative',
        }}>
          <button onClick={onClose} style={{
            position: 'absolute', top: 16, right: 16,
            width: 32, height: 32, borderRadius: '50%',
            background: 'var(--border)', color: 'var(--text-secondary)',
            fontSize: 16, cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>✕</button>

          <span style={{
            display: 'inline-block', background: accent, color: '#fff',
            fontSize: 10, fontWeight: 700, letterSpacing: '0.12em',
            padding: '3px 10px', borderRadius: 6,
            fontFamily: 'var(--font-display)', marginBottom: 10,
          }}>{isSong ? 'SONG' : 'MOVIE'}</span>

          <h2 style={{
            fontFamily: 'var(--font-display)', fontSize: 24, fontWeight: 800,
            color: 'var(--text-primary)', lineHeight: 1.2, marginBottom: 6,
          }}>{item.title}</h2>

          <p style={{ fontSize: 14, color: 'var(--text-secondary)' }}>
            {isSong ? item.artist : `${item.cast?.length} cast members`}
          </p>
        </div>

        {/* Body */}
        <div style={{ padding: '24px 28px 28px' }}>
          {/* Score */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: 16,
            marginBottom: 24, paddingBottom: 20, borderBottom: '1px solid var(--border)',
          }}>
            <div>
              <div style={{
                fontFamily: 'var(--font-display)', fontSize: 48, fontWeight: 800,
                color: accent, lineHeight: 1,
              }}>{item.bayesRating.toFixed(2)}</div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>
                Bayesian avg · {item.reviewCount} {item.reviewCount === 1 ? 'review' : 'reviews'}
              </div>
            </div>
            <div>
              <StarRating value={Math.round(item.bayesRating * 2) / 2} size={22} />
              <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 4 }}>
                Raw avg: {item.avgRating.toFixed(2)}
              </div>
            </div>
          </div>

          {/* Distribution */}
          <h4 style={{
            fontFamily: 'var(--font-display)', fontSize: 13, fontWeight: 700,
            letterSpacing: '0.06em', color: 'var(--text-secondary)', marginBottom: 12,
          }}>RATING DISTRIBUTION</h4>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 24 }}>
            {[5,4,3,2,1].map(star => {
              const d = ratingDist.find(r => r.star === star)
              const pct = d ? (d.count / maxCount) * 100 : 0
              return (
                <div key={star} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ fontSize: 13, color: 'var(--text-secondary)', width: 16, textAlign: 'right' }}>{star}</span>
                  <span style={{ color: 'var(--star-fill)', fontSize: 12 }}>★</span>
                  <div style={{ flex: 1, height: 8, background: 'var(--border)', borderRadius: 99, overflow: 'hidden' }}>
                    <div style={{
                      width: `${pct}%`, height: '100%', background: accent,
                      borderRadius: 99, transition: 'width 0.5s cubic-bezier(0.4,0,0.2,1)',
                    }} />
                  </div>
                  <span style={{ fontSize: 12, color: 'var(--text-muted)', width: 20 }}>{d?.count || 0}</span>
                </div>
              )
            })}
          </div>

          {/* Artist / Cast */}
          {isSong && item.artist && (
            <div style={{ marginBottom: 20 }}>
              <h4 style={{
                fontFamily: 'var(--font-display)', fontSize: 13, fontWeight: 700,
                letterSpacing: '0.06em', color: 'var(--text-secondary)', marginBottom: 8,
              }}>ARTIST</h4>
              <span style={{
                display: 'inline-block', background: 'var(--teal-pale)', color: 'var(--teal)',
                padding: '6px 14px', borderRadius: 99, fontSize: 14, fontWeight: 500,
              }}>{item.artist}</span>
            </div>
          )}

          {!isSong && item.cast?.length > 0 && (
            <div>
              <h4 style={{
                fontFamily: 'var(--font-display)', fontSize: 13, fontWeight: 700,
                letterSpacing: '0.06em', color: 'var(--text-secondary)', marginBottom: 10,
              }}>CAST</h4>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {item.cast.map((actor, i) => (
                  <span key={i} style={{
                    background: 'var(--coral-pale)', color: 'var(--coral)',
                    padding: '4px 12px', borderRadius: 99, fontSize: 13,
                  }}>{actor}</span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}