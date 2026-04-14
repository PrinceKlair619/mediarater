import StarRating from './StarRating'

export default function DetailModal({ item, onClose }) {
  if (!item) return null

  const isSong    = item.type === 'song'
  const accent    = isSong ? 'var(--teal)'  : 'var(--coral)'
  const accentPale= isSong ? 'var(--teal-pale)' : 'var(--coral-pale)'
  const grad      = isSong
    ? 'linear-gradient(135deg,#00C9A7,#2979FF)'
    : 'linear-gradient(135deg,#FF5C4D,#7C4DFF)'

  const ratingDist = [1,2,3,4,5].map(star => ({
    star, count: item.ratings?.filter(r => r.value === star).length || 0,
  }))
  const maxCount = Math.max(...ratingDist.map(r => r.count), 1)

  return (
    <div onClick={onClose} style={{
      position: 'fixed', inset: 0, zIndex: 1000,
      background: 'rgba(10,9,30,0.65)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '1rem', backdropFilter: 'blur(6px)',
    }}>
      <div onClick={e => e.stopPropagation()} style={{
        background: 'var(--bg-card)', borderRadius: 'var(--radius-xl)',
        border: '1px solid var(--border)', width: '100%', maxWidth: 520,
        maxHeight: '90vh', overflowY: 'auto',
        boxShadow: '0 32px 96px rgba(0,0,0,0.28)',
        animation: 'fadeUp 0.25s cubic-bezier(0.4,0,0.2,1) both',
      }}>

        {/* Header */}
        <div style={{
          background: accentPale,
          borderRadius: 'var(--radius-xl) var(--radius-xl) 0 0',
          padding: '28px 28px 22px', position: 'relative',
          borderBottom: '1px solid var(--border)',
        }}>
          <button onClick={onClose} style={{
            position: 'absolute', top: 16, right: 16,
            width: 34, height: 34, borderRadius: '50%',
            background: 'var(--border)', color: 'var(--text-secondary)',
            fontSize: 16, cursor: 'pointer', fontWeight: 600,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            transition: 'background 0.15s',
          }}
            onMouseEnter={e => e.currentTarget.style.background = 'var(--border-strong)'}
            onMouseLeave={e => e.currentTarget.style.background = 'var(--border)'}
          >×</button>

          <span style={{
            display: 'inline-block',
            background: grad, color: '#fff',
            fontSize: 11, fontWeight: 700, letterSpacing: '0.12em',
            padding: '4px 12px', borderRadius: 99,
            marginBottom: 12,
          }}>{isSong ? 'SONG' : 'MOVIE'}</span>

          <h2 style={{
            fontSize: 26, fontWeight: 800, letterSpacing: '-0.03em',
            color: 'var(--text-primary)', lineHeight: 1.2, marginBottom: 6,
          }}>{item.title}</h2>

          <p style={{ fontSize: 15, color: 'var(--text-secondary)' }}>
            {isSong ? item.artist : `${item.cast?.length} cast members`}
          </p>
        </div>

        {/* Body */}
        <div style={{ padding: '26px 28px 30px' }}>

          {/* Big score */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: 20,
            marginBottom: 26, paddingBottom: 22,
            borderBottom: '1px solid var(--border)',
          }}>
            <div style={{
              background: accentPale, borderRadius: 'var(--radius-lg)',
              padding: '14px 20px', textAlign: 'center',
              border: `2px solid ${accent}`,
            }}>
              <div style={{
                fontSize: 46, fontWeight: 900, letterSpacing: '-0.04em',
                color: accent, lineHeight: 1,
              }}>{item.bayesRating.toFixed(2)}</div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4, fontWeight: 500 }}>
                Bayesian avg
              </div>
            </div>
            <div>
              <StarRating value={Math.round(item.bayesRating * 2) / 2} size={24} />
              <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 8 }}>
                Raw avg: <strong style={{ color: 'var(--text-primary)' }}>{item.avgRating.toFixed(2)}</strong>
              </div>
              <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 4 }}>
                <strong style={{ color: 'var(--text-primary)' }}>{item.reviewCount}</strong> {item.reviewCount === 1 ? 'review' : 'reviews'}
              </div>
            </div>
          </div>

          {/* Distribution */}
          <div style={{
            fontSize: 12, fontWeight: 700, letterSpacing: '0.08em',
            color: 'var(--text-muted)', marginBottom: 14, textTransform: 'uppercase',
          }}>Rating Distribution</div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 26 }}>
            {[5,4,3,2,1].map(star => {
              const d = ratingDist.find(r => r.star === star)
              const pct = d ? (d.count / maxCount) * 100 : 0
              return (
                <div key={star} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <span style={{ fontSize: 14, color: 'var(--text-secondary)', fontWeight: 600, width: 14, textAlign: 'right' }}>{star}</span>
                  <span style={{ color: 'var(--star-fill)', fontSize: 13 }}>★</span>
                  <div style={{ flex: 1, height: 9, background: 'var(--border)', borderRadius: 99, overflow: 'hidden' }}>
                    <div style={{
                      width: `${pct}%`, height: '100%', borderRadius: 99,
                      background: `linear-gradient(90deg, ${accent}, var(--violet))`,
                      transition: 'width 0.6s cubic-bezier(0.4,0,0.2,1)',
                    }} />
                  </div>
                  <span style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 600, width: 22, textAlign: 'right' }}>
                    {d?.count || 0}
                  </span>
                </div>
              )
            })}
          </div>

          {/* Artist / Cast */}
          {isSong && item.artist && (
            <div>
              <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.08em', color: 'var(--text-muted)', marginBottom: 10, textTransform: 'uppercase' }}>Artist</div>
              <span style={{
                display: 'inline-block',
                background: 'var(--teal-pale)', color: 'var(--teal)',
                padding: '7px 18px', borderRadius: 99,
                fontSize: 15, fontWeight: 600,
                border: '1px solid var(--teal)',
              }}>{item.artist}</span>
            </div>
          )}

          {!isSong && item.cast?.length > 0 && (
            <div>
              <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.08em', color: 'var(--text-muted)', marginBottom: 10, textTransform: 'uppercase' }}>Cast</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7 }}>
                {item.cast.map((actor, i) => (
                  <span key={i} style={{
                    background: 'var(--coral-pale)', color: 'var(--coral)',
                    padding: '5px 13px', borderRadius: 99,
                    fontSize: 13, fontWeight: 500,
                    border: '1px solid rgba(255,92,77,0.25)',
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
