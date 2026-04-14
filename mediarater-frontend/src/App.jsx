import { useState, useEffect, useMemo, useCallback, useRef } from 'react'
import { parseSongRatings, parseMovies, buildLibrary } from './dataUtils'
import MediaCard from './components/MediaCard'
import DetailModal from './components/DetailModal'
import AddRatingModal from './components/AddRatingModal'
import StatsBar from './components/StatsBar'

/* ── Dark mode ── */
function useDarkMode() {
  const [dark, setDark] = useState(() =>
    window.matchMedia('(prefers-color-scheme: dark)').matches
  )
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light')
  }, [dark])
  return [dark, setDark]
}

/* ── Mobile detection ── */
function useIsMobile() {
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < 640)
  useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth < 640)
    window.addEventListener('resize', handler)
    return () => window.removeEventListener('resize', handler)
  }, [])
  return isMobile
}

/* ── Floating musical notes canvas ── */
function useNotesCanvas(dark) {
  useEffect(() => {
    const canvas = document.getElementById('notes-canvas')
    if (!canvas) return
    const ctx = canvas.getContext('2d')

    const GLYPHS = ['♩','♪','♫','♬','♭','♮','♯','𝄞','𝄢','𝄡']
    const COLORS_LIGHT = ['#7C4DFF','#FF5C4D','#00C9A7','#FFB020','#2979FF','#F50057','#00C853','#FF6D00']
    const COLORS_DARK  = ['#A07BFF','#FF8A80','#4DDEC6','#FFCC5E','#5A9AFF','#FF5C8A','#4DDB85','#FFB74D']

    let W, H, notes
    const COUNT = 48

    function resize() {
      W = canvas.width  = window.innerWidth
      H = canvas.height = window.innerHeight
    }

    function makeNote() {
      const colors = dark ? COLORS_DARK : COLORS_LIGHT
      return {
        x:     Math.random() * W,
        y:     H + 20 + Math.random() * 200,
        glyph: GLYPHS[Math.floor(Math.random() * GLYPHS.length)],
        color: colors[Math.floor(Math.random() * colors.length)],
        size:  12 + Math.random() * 38,
        speed: 0.35 + Math.random() * 0.85,
        drift: (Math.random() - 0.5) * 0.5,
        rot:   (Math.random() - 0.5) * 0.025,
        angle: 0,
        alpha: 0.14 + Math.random() * 0.28,
        glow:  Math.random() > 0.6 ? 4 + Math.random() * 8 : 0,
      }
    }

    resize()
    notes = Array.from({ length: COUNT }, makeNote).map(n => ({ ...n, y: Math.random() * H }))

    let raf
    function draw() {
      ctx.clearRect(0, 0, W, H)
      for (const n of notes) {
        ctx.save()
        ctx.globalAlpha = n.alpha
        ctx.fillStyle = n.color
        ctx.font = `${n.size}px serif`
        ctx.translate(n.x, n.y)
        ctx.rotate(n.angle)
        if (n.glow > 0) {
          ctx.shadowColor = n.color
          ctx.shadowBlur  = n.glow
        }
        ctx.fillText(n.glyph, 0, 0)
        ctx.restore()

        n.y -= n.speed
        n.x += n.drift
        n.angle += n.rot
        if (n.y < -50) {
          Object.assign(n, makeNote())
          n.x = Math.random() * W
        }
      }
      raf = requestAnimationFrame(draw)
    }

    draw()
    window.addEventListener('resize', resize)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
    }
  }, [dark])
}

/* ── Loader ── */
function Loader() {
  return (
    <div style={{
      minHeight: '60vh', display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center', gap: 16,
    }}>
      <div style={{
        width: 42, height: 42,
        border: '3px solid var(--border)',
        borderTopColor: 'var(--coral)',
        borderRadius: '50%',
        animation: 'spin 0.8s linear infinite',
      }} />
      <p style={{ color: 'var(--text-secondary)', fontSize: 15 }}>Loading media library…</p>
    </div>
  )
}

/* ── Main ── */
export default function App() {
  const [dark, setDark] = useDarkMode()
  const isMobile = useIsMobile()
  useNotesCanvas(dark)

  const [library, setLibrary] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState(null)

  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('all')
  const [sort, setSort]     = useState('bayes')
  const TOP_K = 50

  const [selectedItem, setSelectedItem] = useState(null)
  const [showAddModal, setShowAddModal] = useState(false)
  const [activeView, setActiveView]     = useState('browse')

  /* ── Load CSVs ── */
  useEffect(() => {
    async function load() {
      try {
        const base = import.meta.env.BASE_URL
        const [songText, moviesText, movieRatingsText] = await Promise.all([
          fetch(`${base}data/songratings.csv`).then(r => { if (!r.ok) throw new Error(r.statusText); return r.text() }),
          fetch(`${base}data/movies.csv`).then(r => { if (!r.ok) throw new Error(r.statusText); return r.text() }),
          fetch(`${base}data/movie_ratings.csv`).then(r => { if (!r.ok) throw new Error(r.statusText); return r.text() }),
        ])
        const songs  = parseSongRatings(songText)
        const movies = parseMovies(moviesText, movieRatingsText)
        setLibrary(buildLibrary(songs, movies))
      } catch (e) {
        setError(`Could not load CSV data: ${e.message}. Make sure the CSV files are in public/data/`)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  /* ── Add rating (supports new iTunes items) ── */
  const handleAddRating = useCallback(({ itemId, newItem, reviewerId, rating }) => {
    setLibrary(prev => {
      let base = prev

      /* Inject new iTunes item if it doesn't exist yet */
      if (newItem && !prev.find(i => i.id === newItem.id)) {
        base = [...prev, {
          ...newItem,
          ratings: [], ratingValues: [], avgRating: 0, bayesRating: 0, reviewCount: 0,
        }]
      }

      const updated = base.map(item => {
        if (item.id !== itemId) return item
        if (item.ratings.find(r => r.reviewer === reviewerId)) return item
        const newRatings = [...item.ratings, { reviewer: reviewerId, value: rating }]
        const vals = newRatings.map(r => r.value)
        const n   = vals.length
        const sum = vals.reduce((a, b) => a + b, 0)
        return {
          ...item,
          ratings: newRatings, ratingValues: vals,
          avgRating: sum / n,
          bayesRating: (2 * 3 + sum) / (2 + n),
          reviewCount: n,
        }
      })
      return updated.sort((a, b) => b.bayesRating - a.bayesRating)
    })
  }, [])

  /* ── Filtered list ── */
  const displayed = useMemo(() => {
    let items = library
    if (activeView === 'top') items = items.slice(0, TOP_K)
    if (filter !== 'all')     items = items.filter(i => i.type === filter)
    if (search.trim()) {
      const q = search.trim().toLowerCase()
      items = items.filter(i =>
        i.title.toLowerCase().includes(q) ||
        (i.artist && i.artist.toLowerCase().includes(q)) ||
        (i.cast && i.cast.some(c => c.toLowerCase().includes(q)))
      )
    }
    const s = [...items]
    if (sort === 'bayes')   s.sort((a, b) => b.bayesRating - a.bayesRating)
    if (sort === 'avg')     s.sort((a, b) => b.avgRating - a.avgRating)
    if (sort === 'reviews') s.sort((a, b) => b.reviewCount - a.reviewCount)
    if (sort === 'alpha')   s.sort((a, b) => a.title.localeCompare(b.title))
    return s
  }, [library, filter, search, sort, activeView])

  const rankMap = useMemo(() => {
    const m = {}
    library.forEach((item, i) => { m[item.id] = i + 1 })
    return m
  }, [library])

  if (loading) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Loader />
    </div>
  )

  /* ── Nav ── */
  const tabs = (
    <div style={{ display: 'flex', gap: 4 }}>
      {[['browse','Media'],['top','Top 50']].map(([v, l]) => (
        <button key={v} onClick={() => setActiveView(v)} style={{
          padding: isMobile ? '6px 12px' : '7px 16px',
          borderRadius: 99,
          background: activeView === v ? 'var(--violet)' : 'transparent',
          color: activeView === v ? '#fff' : 'var(--text-secondary)',
          border: activeView === v ? '1px solid var(--violet)' : '1px solid transparent',
          fontSize: isMobile ? 13 : 14, fontWeight: 600, cursor: 'pointer', transition: 'all 0.15s',
        }}>{l}</button>
      ))}
    </div>
  )

  /* ── Movie/Song type toggle (used in nav) ── */
  const typeToggle = (
    <div style={{
      display: 'flex', gap: 3,
      background: 'var(--border)', padding: 3, borderRadius: 99,
    }}>
      {[['movie','Movies'],['song','Songs']].map(([v, l]) => (
        <button key={v} onClick={() => setFilter(f => f === v ? 'all' : v)} style={{
          padding: isMobile ? '5px 10px' : '6px 13px',
          borderRadius: 99,
          background: filter === v ? 'var(--bg-card)' : 'transparent',
          color: filter === v
            ? (v === 'movie' ? 'var(--coral)' : 'var(--teal)')
            : 'var(--text-secondary)',
          fontSize: isMobile ? 12 : 13, fontWeight: 700, cursor: 'pointer',
          transition: 'all 0.15s', border: 'none',
          boxShadow: filter === v ? 'var(--shadow-sm)' : 'none',
          whiteSpace: 'nowrap',
        }}>{l}</button>
      ))}
    </div>
  )

  return (
    <>
    {/* Fixed canvas for floating musical notes background */}
    <canvas id="notes-canvas" style={{
      position: 'fixed', inset: 0, zIndex: 0,
      pointerEvents: 'none', width: '100%', height: '100%',
    }} />

    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', position: 'relative', zIndex: 1 }}>

      {/* ═══ NAV ═══ */}
      <nav style={{
        position: 'sticky', top: 0, zIndex: 100,
        background: 'var(--bg-glass)',
        backdropFilter: 'blur(18px)',
        WebkitBackdropFilter: 'blur(18px)',
        borderBottom: '1px solid var(--border)',
        padding: isMobile ? '10px 16px' : '0 28px',
        display: 'flex', alignItems: 'center',
        flexWrap: isMobile ? 'wrap' : 'nowrap',
        gap: isMobile ? 8 : 18,
        minHeight: 56,
      }}>
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
          <svg width="26" height="26" viewBox="0 0 26 26" fill="none">
            <circle cx="13" cy="13" r="13" fill="url(#lg)"/>
            <text x="13" y="18" textAnchor="middle" fontSize="14" fill="white" fontFamily="serif">♫</text>
            <defs>
              <linearGradient id="lg" x1="0" y1="0" x2="26" y2="26">
                <stop offset="0%" stopColor="#FF5C4D"/>
                <stop offset="100%" stopColor="#7C4DFF"/>
              </linearGradient>
            </defs>
          </svg>
          <span className="text-gradient-logo" style={{
            fontWeight: 800,
            fontSize: isMobile ? 16 : 19,
            letterSpacing: '-0.03em',
          }}>MediaRater</span>
        </div>

        {/* Tabs — inline on desktop */}
        {!isMobile && tabs}

        <div style={{ flex: 1 }} />

        {/* Movie / Song toggle */}
        {!isMobile && typeToggle}

        {/* Rate button */}
        <button onClick={() => setShowAddModal(true)} style={{
          display: 'flex', alignItems: 'center', gap: 5,
          padding: isMobile ? '8px 14px' : '9px 20px',
          borderRadius: 99,
          background: 'linear-gradient(135deg,var(--coral),var(--pink))',
          color: '#fff', border: 'none', cursor: 'pointer',
          fontSize: isMobile ? 13 : 14, fontWeight: 700,
          boxShadow: '0 4px 16px rgba(255,92,77,0.35)',
          transition: 'transform 0.15s, box-shadow 0.15s',
        }}
          onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.04)'; e.currentTarget.style.boxShadow = '0 6px 22px rgba(255,92,77,0.45)' }}
          onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.boxShadow = '0 4px 16px rgba(255,92,77,0.35)' }}
        >
          {isMobile ? '+' : '+ Rate'}
        </button>

        {/* Dark mode */}
        <button onClick={() => setDark(d => !d)} title={dark ? 'Light mode' : 'Dark mode'} style={{
          width: 38, height: 38, borderRadius: '50%',
          background: 'var(--border)', border: '1px solid var(--border-strong)',
          color: 'var(--text-primary)', fontSize: 17, cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          transition: 'background 0.15s', flexShrink: 0,
        }}
          onMouseEnter={e => e.currentTarget.style.background = 'var(--border-strong)'}
          onMouseLeave={e => e.currentTarget.style.background = 'var(--border)'}
        >
          {dark ? '☀' : '☾'}
        </button>

        {/* Tabs + type toggle — second row on mobile */}
        {isMobile && (
          <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: 4, gap: 8 }}>
            {tabs}
            {typeToggle}
          </div>
        )}
      </nav>

      {/* ═══ MAIN ═══ */}
      <main style={{
        flex: 1, maxWidth: 1380, margin: '0 auto', width: '100%',
        padding: isMobile ? '20px 16px' : '36px 28px',
      }}>

        {/* Error */}
        {error && (
          <div style={{
            background: 'var(--coral-pale)', border: '1px solid var(--coral)',
            borderRadius: 'var(--radius-md)', padding: '14px 18px', marginBottom: 24,
            color: 'var(--coral)', fontSize: 15,
          }}>
            {error}
          </div>
        )}

        {/* Hero */}
        <div className="fade-up" style={{ marginBottom: isMobile ? 20 : 32 }}>
          <div style={{ display: 'flex', gap: 6, marginBottom: 14 }}>
            {['var(--coral)','var(--violet)','var(--teal)','var(--amber)','var(--blue)'].map((c, i) => (
              <div key={i} style={{ width: isMobile ? 24 : 32, height: 5, borderRadius: 99, background: c }} />
            ))}
          </div>

          <h1 style={{
            fontSize: 'clamp(28px, 5vw, 54px)',
            fontWeight: 900, letterSpacing: '-0.04em', lineHeight: 1.05,
            color: 'var(--text-primary)', marginBottom: 8,
          }}>
            {activeView === 'browse'
              ? <span className="text-gradient">Media</span>
              : <>Top <span className="text-gradient-amber">50</span></>
            }
          </h1>
          <p style={{ fontSize: isMobile ? 14 : 16, color: 'var(--text-secondary)', fontWeight: 400 }}>
            {activeView === 'browse'
              ? 'Movies and songs ranked by Bayesian average rating'
              : 'Top 50 items by Bayesian weighted score'}
          </p>
        </div>

        {/* Stats */}
        <StatsBar library={library} />

        {/* Top 50 banner */}
        {activeView === 'top' && (
          <div className="fade-up" style={{
            background: 'linear-gradient(135deg, var(--amber-pale), var(--coral-pale))',
            borderRadius: 'var(--radius-lg)', padding: '14px 20px', marginBottom: 24,
            border: '1px solid var(--border)',
            display: 'flex', alignItems: 'center', gap: 12,
          }}>
            <span style={{ fontSize: 22 }}>🏆</span>
            <span style={{ fontSize: 14, color: 'var(--text-secondary)' }}>
              The <strong style={{ color: 'var(--amber)' }}>50 highest-rated</strong> items across your library, ranked by Bayesian weighted score — a formula that accounts for both rating quality and review count to prevent items with very few ratings from dominating.
            </span>
          </div>
        )}

        {/* Controls */}
        <div className="fade-up fade-up-d1" style={{
          display: 'flex', gap: 10, marginBottom: 28, flexWrap: 'wrap', alignItems: 'center',
        }}>
          {/* Search */}
          <div style={{ position: 'relative', flex: '1 1 200px' }}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{
              position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)',
              color: 'var(--text-muted)',
            }}>
              <circle cx="6.5" cy="6.5" r="5" stroke="currentColor" strokeWidth="1.5"/>
              <path d="M10.5 10.5L14 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
            <input type="text" placeholder="Search titles, artists, cast…"
              value={search} onChange={e => setSearch(e.target.value)}
              style={{
                width: '100%', padding: '10px 16px 10px 38px',
                borderRadius: 99, border: '1.5px solid var(--border-strong)',
                background: 'var(--bg-card)', color: 'var(--text-primary)',
                fontSize: 14, outline: 'none',
                transition: 'border-color 0.15s, box-shadow 0.15s',
                boxShadow: 'var(--shadow-sm)',
              }}
              onFocus={e => { e.currentTarget.style.borderColor = 'var(--violet)'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(124,77,255,0.12)' }}
              onBlur={e => { e.currentTarget.style.borderColor = 'var(--border-strong)'; e.currentTarget.style.boxShadow = 'var(--shadow-sm)' }}
            />
          </div>

          {/* Sort */}
          <select value={sort} onChange={e => setSort(e.target.value)} style={{
            padding: '9px 14px', borderRadius: 99,
            border: '1.5px solid var(--border-strong)',
            background: 'var(--bg-card)', color: 'var(--text-primary)',
            fontSize: isMobile ? 12 : 14, fontWeight: 500, cursor: 'pointer',
            boxShadow: 'var(--shadow-sm)',
          }}>
            <option value="bayes">Bayesian Rating</option>
            <option value="avg">Average Rating</option>
            <option value="reviews">Most Reviews</option>
            <option value="alpha">A to Z</option>
          </select>

          <span style={{ fontSize: 13, color: 'var(--text-muted)', fontWeight: 500, whiteSpace: 'nowrap' }}>
            {displayed.length} item{displayed.length !== 1 ? 's' : ''}
          </span>
        </div>

        {/* Grid */}
        {displayed.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 20px', color: 'var(--text-muted)' }}>
            <div style={{
              width: 64, height: 64, borderRadius: '50%',
              background: 'var(--violet-pale)', margin: '0 auto 20px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--violet)" strokeWidth="2">
                <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
              </svg>
            </div>
            <p style={{ fontSize: 17, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 6 }}>
              No results found
            </p>
            <p style={{ fontSize: 14, color: 'var(--text-muted)' }}>
              {library.length === 0
                ? 'Check that CSV files are in public/data/'
                : 'Try a different search or filter'}
            </p>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: `repeat(auto-fill, minmax(${isMobile ? '160px' : '250px'}, 1fr))`,
            gap: isMobile ? 12 : 18,
          }}>
            {displayed.map((item, idx) => (
              <div key={item.id} className="fade-up" style={{ animationDelay: `${Math.min(idx, 14) * 28}ms` }}>
                <MediaCard
                  item={item}
                  rank={activeView === 'top' ? idx + 1 : rankMap[item.id]}
                  onClick={setSelectedItem}
                />
              </div>
            ))}
          </div>
        )}
      </main>

      {/* ═══ FOOTER ═══ */}
      <footer style={{
        borderTop: '1px solid var(--border)',
        padding: isMobile ? '16px' : '22px 28px',
        textAlign: 'center', fontSize: 13,
        color: 'var(--text-muted)', fontWeight: 500,
      }}>
        MediaRater · Bayesian ratings engine · {library.length.toLocaleString()} items in library
      </footer>

      {/* Modals */}
      {selectedItem && <DetailModal item={selectedItem} onClose={() => setSelectedItem(null)} />}
      {showAddModal && (
        <AddRatingModal
          library={library}
          onClose={() => setShowAddModal(false)}
          onAdd={(payload) => { handleAddRating(payload); setShowAddModal(false) }}
        />
      )}
    </div>
    </>
  )
}
