import { useState, useEffect, useRef } from 'react'
import StarRating from './StarRating'

/* ── Searchable dropdown with iTunes API integration ── */
function SearchableSelect({ mediaType, library, onSelect }) {
  const [query, setQuery]           = useState('')
  const [open, setOpen]             = useState(false)
  const [itunesResults, setItunes]  = useState([])
  const [loading, setLoading]       = useState(false)
  const containerRef                = useRef(null)
  const debounceRef                 = useRef(null)

  const localItems = library.filter(i => i.type === mediaType)

  const filteredLocal = query.length > 0
    ? localItems.filter(i =>
        i.title.toLowerCase().includes(query.toLowerCase()) ||
        (i.artist && i.artist.toLowerCase().includes(query.toLowerCase())) ||
        (i.cast && i.cast.some(c => c.toLowerCase().includes(query.toLowerCase())))
      ).slice(0, 12)
    : localItems.slice(0, 20)

  /* Reset when mediaType changes */
  useEffect(() => {
    setQuery('')
    setItunes([])
    setLoading(false)
    setOpen(false)
    onSelect(null)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mediaType])

  /* Debounced iTunes search */
  useEffect(() => {
    if (query.length < 1) { setItunes([]); setLoading(false); return }
    setLoading(true)
    clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(async () => {
      try {
        const media  = mediaType === 'movie' ? 'movie' : 'music'
        const entity = mediaType === 'movie' ? 'movie' : 'song'
        const url    = `https://itunes.apple.com/search?term=${encodeURIComponent(query)}&media=${media}&entity=${entity}&limit=20`
        const res    = await fetch(url)
        const data   = await res.json()

        const localIds = new Set(localItems.map(i => i.id))
        const fresh = data.results
          .filter(r => r.trackName && !localIds.has(`itunes-${r.trackId}`))
          .slice(0, 10)
          .map(r => ({
            id:          `itunes-${r.trackId}`,
            type:        mediaType,
            title:       r.trackName,
            artist:      mediaType === 'song'  ? r.artistName : undefined,
            cast:        mediaType === 'movie' ? [r.artistName].filter(Boolean) : undefined,
            ratings:     [],
            ratingValues:[],
            avgRating:   0,
            bayesRating: 0,
            reviewCount: 0,
            fromItunes:  true,
          }))
        setItunes(fresh)
      } catch {
        setItunes([])
      } finally {
        setLoading(false)
      }
    }, 350)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query, mediaType])

  /* Close on outside click */
  useEffect(() => {
    const handler = e => {
      if (containerRef.current && !containerRef.current.contains(e.target))
        setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const handlePick = item => {
    setQuery(item.title)
    setOpen(false)
    onSelect(item)
  }

  /* Merge + de-duplicate */
  const localSrc = filteredLocal.map(i => ({ ...i, fromItunes: false }))
  const seen     = new Set(localSrc.map(i => i.id))
  const netSrc   = itunesResults.filter(i => !seen.has(i.id))

  const showDropdown = open && (localSrc.length > 0 || netSrc.length > 0 || loading || query.length >= 1)

  return (
    <div ref={containerRef} style={{ position: 'relative' }}>
      <div style={{ position: 'relative' }}>
        <svg width="15" height="15" viewBox="0 0 16 16" fill="none" style={{
          position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)',
          color: 'var(--text-muted)', pointerEvents: 'none',
        }}>
          <circle cx="6.5" cy="6.5" r="5" stroke="currentColor" strokeWidth="1.5"/>
          <path d="M10.5 10.5L14 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
        <input
          type="text"
          value={query}
          placeholder={`Search ${mediaType === 'movie' ? 'movies' : 'songs'} — library or online…`}
          onChange={e => { setQuery(e.target.value); setOpen(true); onSelect(null) }}
          onFocus={() => setOpen(true)}
          autoComplete="off"
          style={{
            width: '100%', padding: '11px 14px 11px 36px',
            borderRadius: 'var(--radius-md)',
            border: `1.5px solid ${open ? 'var(--violet)' : 'var(--border-strong)'}`,
            background: 'var(--bg)', color: 'var(--text-primary)',
            fontSize: 15, outline: 'none', transition: 'border-color 0.15s',
            boxShadow: open ? '0 0 0 3px rgba(124,77,255,0.12)' : 'none',
          }}
        />
        {loading && (
          <div style={{
            position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
            width: 14, height: 14,
            border: '2px solid var(--border)',
            borderTopColor: 'var(--violet)',
            borderRadius: '50%',
            animation: 'spin 0.8s linear infinite',
          }} />
        )}
      </div>

      {showDropdown && (
        <div style={{
          position: 'absolute', top: 'calc(100% + 4px)', left: 0, right: 0, zIndex: 300,
          background: 'var(--bg-card)',
          border: '1px solid var(--border-strong)',
          borderRadius: 'var(--radius-md)',
          maxHeight: 260, overflowY: 'auto',
          boxShadow: '0 12px 40px rgba(0,0,0,0.22)',
        }}>
          {/* Library items */}
          {localSrc.length > 0 && (
            <>
              <div style={{
                padding: '6px 12px 2px',
                fontSize: 10, fontWeight: 700,
                color: 'var(--text-muted)', letterSpacing: '0.10em',
                textTransform: 'uppercase',
              }}>Library</div>
              {localSrc.map(item => (
                <ResultRow key={item.id} item={item} onPick={handlePick} accent="var(--teal)" badge="LOCAL" />
              ))}
            </>
          )}

          {/* iTunes results */}
          {netSrc.length > 0 && (
            <>
              <div style={{
                padding: '6px 12px 2px',
                fontSize: 10, fontWeight: 700,
                color: 'var(--blue)', letterSpacing: '0.10em',
                textTransform: 'uppercase',
                borderTop: localSrc.length > 0 ? '1px solid var(--border)' : 'none',
              }}>Online · iTunes</div>
              {netSrc.map(item => (
                <ResultRow key={item.id} item={item} onPick={handlePick} accent="var(--blue)" badge="NEW" />
              ))}
            </>
          )}

          {!loading && localSrc.length === 0 && netSrc.length === 0 && query.length >= 2 && (
            <div style={{ padding: '14px 14px', color: 'var(--text-muted)', fontSize: 14 }}>
              No results found
            </div>
          )}
        </div>
      )}
    </div>
  )
}

function ResultRow({ item, onPick, accent, badge }) {
  const sub = item.artist || item.cast?.join(', ') || ''
  return (
    <div
      onMouseDown={e => { e.preventDefault(); onPick(item) }}
      style={{
        padding: '9px 14px', cursor: 'pointer',
        display: 'flex', alignItems: 'center', gap: 10,
        borderBottom: '1px solid var(--border)',
        transition: 'background 0.1s',
      }}
      onMouseEnter={e => e.currentTarget.style.background = 'var(--violet-pale)'}
      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
    >
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          fontSize: 14, fontWeight: 600,
          color: 'var(--text-primary)',
          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
        }}>{item.title}</div>
        {sub && (
          <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 1 }}>{sub}</div>
        )}
      </div>
      <span style={{
        fontSize: 10, fontWeight: 700, letterSpacing: '0.08em',
        color: accent, background: `color-mix(in srgb, ${accent} 15%, transparent)`,
        padding: '2px 7px', borderRadius: 99, flexShrink: 0,
      }}>{badge}</span>
    </div>
  )
}

/* ── Main modal ── */
export default function AddRatingModal({ onClose, onAdd, library }) {
  const [mediaType,    setMediaType]    = useState('movie')
  const [selectedItem, setSelectedItem] = useState(null)
  const [reviewerId,   setReviewerId]   = useState('')
  const [rating,       setRating]       = useState(0)
  const [submitted,    setSubmitted]    = useState(false)
  const [error,        setError]        = useState('')

  const handleSubmit = () => {
    if (!selectedItem)       return setError('Please select a title.')
    if (!reviewerId.trim())  return setError('Please enter your name.')
    if (rating < 1)          return setError('Please choose a star rating.')

    /* Check for duplicate on existing library items */
    if (!selectedItem.fromItunes) {
      const existing = library.find(i => i.id === selectedItem.id)
      if (existing?.ratings?.find(r => r.reviewer === reviewerId.trim())) {
        return setError(`${reviewerId.trim()} already rated this.`)
      }
    }

    onAdd({
      itemId:    selectedItem.id,
      newItem:   selectedItem.fromItunes ? selectedItem : undefined,
      reviewerId: reviewerId.trim(),
      rating,
    })
    setSubmitted(true)
  }

  const inputStyle = {
    width: '100%', padding: '11px 14px',
    borderRadius: 'var(--radius-md)',
    border: '1.5px solid var(--border-strong)',
    background: 'var(--bg)', color: 'var(--text-primary)',
    fontSize: 15, outline: 'none', transition: 'border-color 0.15s',
  }

  return (
    <div onClick={onClose} style={{
      position: 'fixed', inset: 0, zIndex: 1000,
      background: 'rgba(10,9,30,0.65)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '1rem', backdropFilter: 'blur(6px)',
    }}>
      <div onClick={e => e.stopPropagation()} style={{
        background: 'var(--bg-card)', borderRadius: 'var(--radius-xl)',
        border: '1px solid var(--border)', width: '100%', maxWidth: 460,
        boxShadow: '0 32px 96px rgba(0,0,0,0.28)',
        animation: 'fadeUp 0.25s cubic-bezier(0.4,0,0.2,1) both',
        overflow: 'visible',
        maxHeight: '92vh', display: 'flex', flexDirection: 'column',
      }}>

        {/* Gradient bar */}
        <div style={{
          height: 5, flexShrink: 0,
          background: 'linear-gradient(90deg, var(--violet), var(--coral), var(--teal))',
          borderRadius: 'var(--radius-xl) var(--radius-xl) 0 0',
        }} />

        {/* Header */}
        <div style={{
          padding: '22px 24px 16px', borderBottom: '1px solid var(--border)',
          position: 'relative', flexShrink: 0,
        }}>
          <button onClick={onClose} style={{
            position: 'absolute', top: 16, right: 16,
            width: 32, height: 32, borderRadius: '50%',
            background: 'var(--border)', color: 'var(--text-secondary)',
            fontSize: 18, fontWeight: 600, cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            border: 'none',
          }}>×</button>
          <h2 style={{
            fontSize: 20, fontWeight: 800, letterSpacing: '-0.03em',
            color: 'var(--text-primary)', marginBottom: 4,
          }}>Add a Rating</h2>
          <p style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
            Search millions of titles · one rating per person per item
          </p>
        </div>

        {/* Body */}
        <div style={{ padding: '20px 24px 24px', overflowY: 'auto', flex: 1 }}>
          {submitted ? (
            <div style={{ textAlign: 'center', padding: '24px 0' }}>
              <div style={{
                width: 64, height: 64, borderRadius: '50%',
                background: 'linear-gradient(135deg,var(--teal),var(--blue))',
                margin: '0 auto 16px',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 28, color: '#fff',
              }}>✓</div>
              <h3 style={{ fontSize: 20, fontWeight: 800, marginBottom: 8 }}>Rating Added!</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: 15, marginBottom: 22 }}>
                {rating} star{rating !== 1 ? 's' : ''} from {reviewerId}
              </p>
              <button onClick={onClose} style={{
                background: 'linear-gradient(135deg,var(--violet),var(--coral))',
                color: '#fff', border: 'none', borderRadius: 99,
                padding: '11px 32px', fontSize: 15, fontWeight: 700, cursor: 'pointer',
              }}>Done</button>
            </div>
          ) : (
            <>
              {/* Type toggle */}
              <div style={{ display: 'flex', gap: 8, marginBottom: 18 }}>
                {['movie','song'].map(t => (
                  <button key={t} onClick={() => { setMediaType(t); setSelectedItem(null); setError('') }} style={{
                    flex: 1, padding: '10px',
                    borderRadius: 'var(--radius-md)',
                    border: `2px solid ${mediaType === t
                      ? (t === 'movie' ? 'var(--coral)' : 'var(--teal)')
                      : 'var(--border)'}`,
                    background: mediaType === t
                      ? (t === 'movie' ? 'var(--coral-pale)' : 'var(--teal-pale)')
                      : 'transparent',
                    color: mediaType === t
                      ? (t === 'movie' ? 'var(--coral)' : 'var(--teal)')
                      : 'var(--text-secondary)',
                    fontSize: 14, fontWeight: 700, letterSpacing: '0.04em',
                    cursor: 'pointer', transition: 'all 0.15s',
                  }}>
                    {t === 'movie' ? '🎬 Movie' : '🎵 Song'}
                  </button>
                ))}
              </div>

              {/* Searchable title */}
              <div style={{ marginBottom: 14 }}>
                <label style={{
                  display: 'block', fontSize: 13, fontWeight: 600,
                  color: 'var(--text-secondary)', marginBottom: 6,
                }}>Title</label>
                <SearchableSelect
                  mediaType={mediaType}
                  library={library}
                  onSelect={item => { setSelectedItem(item); setError('') }}
                />
                {selectedItem && (
                  <div style={{
                    marginTop: 6, padding: '6px 12px',
                    background: 'var(--violet-pale)', borderRadius: 'var(--radius-sm)',
                    fontSize: 13, color: 'var(--violet)', fontWeight: 600,
                    display: 'flex', alignItems: 'center', gap: 6,
                  }}>
                    <span>✓</span>
                    <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {selectedItem.title}
                    </span>
                    {selectedItem.fromItunes && (
                      <span style={{ fontSize: 11, opacity: 0.7, flexShrink: 0 }}>· iTunes</span>
                    )}
                  </div>
                )}
              </div>

              {/* Name */}
              <div style={{ marginBottom: 14 }}>
                <label style={{
                  display: 'block', fontSize: 13, fontWeight: 600,
                  color: 'var(--text-secondary)', marginBottom: 6,
                }}>Your name</label>
                <input
                  type="text"
                  value={reviewerId}
                  onChange={e => { setReviewerId(e.target.value); setError('') }}
                  placeholder="e.g. Alice"
                  style={inputStyle}
                  onFocus={e => e.currentTarget.style.borderColor = 'var(--violet)'}
                  onBlur={e => e.currentTarget.style.borderColor = 'var(--border-strong)'}
                />
              </div>

              {/* Stars */}
              <div style={{ marginBottom: 22 }}>
                <label style={{
                  display: 'block', fontSize: 13, fontWeight: 600,
                  color: 'var(--text-secondary)', marginBottom: 10,
                }}>Your rating</label>
                <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                  <StarRating
                    value={rating}
                    interactive
                    onChange={v => { setRating(v); setError('') }}
                    size={30}
                  />
                  {rating > 0 && (
                    <span style={{ fontSize: 14, color: 'var(--text-secondary)', marginLeft: 8, fontWeight: 500 }}>
                      {['','Poor','Fair','Good','Great','Exceptional'][rating]}
                    </span>
                  )}
                </div>
              </div>

              {error && (
                <div style={{
                  background: 'var(--coral-pale)', border: '1px solid var(--coral)',
                  borderRadius: 'var(--radius-sm)', padding: '10px 14px',
                  color: 'var(--coral)', fontSize: 14, marginBottom: 16,
                }}>{error}</div>
              )}

              <button
                onClick={handleSubmit}
                onMouseEnter={e => e.currentTarget.style.opacity = '0.88'}
                onMouseLeave={e => e.currentTarget.style.opacity = '1'}
                style={{
                  width: '100%', padding: '13px',
                  background: 'linear-gradient(135deg,var(--violet),var(--coral))',
                  color: '#fff', border: 'none', borderRadius: 99,
                  fontSize: 15, fontWeight: 700, cursor: 'pointer',
                  transition: 'opacity 0.15s',
                  boxShadow: '0 4px 16px rgba(124,77,255,0.3)',
                }}>Submit Rating</button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
