import { useState } from 'react'
import StarRating from './StarRating'

export default function AddRatingModal({ onClose, onAdd, library }) {
  const [mediaType, setMediaType] = useState('movie')
  const [selectedId, setSelectedId] = useState('')
  const [reviewerId, setReviewerId] = useState('')
  const [rating, setRating]     = useState(0)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError]       = useState('')

  const filtered = library.filter(i => i.type === mediaType)

  const handleSubmit = () => {
    if (!selectedId)          return setError('Please select a title.')
    if (!reviewerId.trim())   return setError('Please enter your name.')
    if (rating < 1)           return setError('Please choose a star rating.')
    const item = library.find(i => i.id === selectedId)
    if (!item) return setError('Item not found.')
    if (item.ratings?.find(r => r.reviewer === reviewerId.trim())) {
      return setError(`${reviewerId.trim()} already rated this.`)
    }
    onAdd({ itemId: selectedId, type: mediaType, reviewerId: reviewerId.trim(), rating })
    setSubmitted(true)
  }

  const inputStyle = {
    width: '100%', padding: '11px 14px',
    borderRadius: 'var(--radius-md)',
    border: '1.5px solid var(--border-strong)',
    background: 'var(--bg)', color: 'var(--text-primary)',
    fontSize: 15, outline: 'none',
    transition: 'border-color 0.15s',
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
        border: '1px solid var(--border)', width: '100%', maxWidth: 440,
        boxShadow: '0 32px 96px rgba(0,0,0,0.28)',
        animation: 'fadeUp 0.25s cubic-bezier(0.4,0,0.2,1) both',
        overflow: 'hidden',
      }}>

        {/* Gradient header bar */}
        <div style={{
          height: 5,
          background: 'linear-gradient(90deg, var(--violet), var(--coral), var(--teal))',
        }} />

        {/* Header */}
        <div style={{ padding: '24px 26px 18px', borderBottom: '1px solid var(--border)', position: 'relative' }}>
          <button onClick={onClose} style={{
            position: 'absolute', top: 18, right: 18,
            width: 32, height: 32, borderRadius: '50%',
            background: 'var(--border)', color: 'var(--text-secondary)',
            fontSize: 16, fontWeight: 600, cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>×</button>
          <h2 style={{ fontSize: 20, fontWeight: 800, letterSpacing: '-0.03em', color: 'var(--text-primary)', marginBottom: 4 }}>
            Add a Rating
          </h2>
          <p style={{ fontSize: 14, color: 'var(--text-secondary)' }}>
            One rating per reviewer per item
          </p>
        </div>

        <div style={{ padding: '22px 26px 26px' }}>
          {submitted ? (
            <div style={{ textAlign: 'center', padding: '20px 0' }}>
              <div style={{
                width: 64, height: 64, borderRadius: '50%',
                background: 'linear-gradient(135deg,var(--teal),var(--blue))',
                margin: '0 auto 16px',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 28, color: '#fff',
              }}>✓</div>
              <h3 style={{ fontSize: 20, fontWeight: 800, letterSpacing: '-0.03em', marginBottom: 8 }}>Rating Added!</h3>
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
                  <button key={t} onClick={() => { setMediaType(t); setSelectedId('') }} style={{
                    flex: 1, padding: '10px',
                    borderRadius: 'var(--radius-md)',
                    border: `2px solid ${mediaType === t ? (t === 'movie' ? 'var(--coral)' : 'var(--teal)') : 'var(--border)'}`,
                    background: mediaType === t ? (t === 'movie' ? 'var(--coral-pale)' : 'var(--teal-pale)') : 'transparent',
                    color: mediaType === t ? (t === 'movie' ? 'var(--coral)' : 'var(--teal)') : 'var(--text-secondary)',
                    fontSize: 14, fontWeight: 700, letterSpacing: '0.04em',
                    cursor: 'pointer', transition: 'all 0.15s',
                  }}>
                    {t === 'movie' ? 'Movie' : 'Song'}
                  </button>
                ))}
              </div>

              {/* Select title */}
              <div style={{ marginBottom: 14 }}>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 6 }}>
                  Title
                </label>
                <select value={selectedId} onChange={e => setSelectedId(e.target.value)} style={inputStyle}>
                  <option value="">— Choose —</option>
                  {filtered.slice(0, 200).map(i => (
                    <option key={i.id} value={i.id}>{i.title}</option>
                  ))}
                </select>
              </div>

              {/* Name */}
              <div style={{ marginBottom: 14 }}>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 6 }}>
                  Your name
                </label>
                <input type="text" value={reviewerId}
                  onChange={e => { setReviewerId(e.target.value); setError('') }}
                  placeholder="e.g. Alice"
                  style={inputStyle}
                  onFocus={e => e.currentTarget.style.borderColor = 'var(--violet)'}
                  onBlur={e => e.currentTarget.style.borderColor = 'var(--border-strong)'}
                />
              </div>

              {/* Stars */}
              <div style={{ marginBottom: 22 }}>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 10 }}>
                  Your rating
                </label>
                <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                  <StarRating value={rating} interactive onChange={v => { setRating(v); setError('') }} size={30} />
                  {rating > 0 && (
                    <span style={{ fontSize: 14, color: 'var(--text-secondary)', marginLeft: 10, fontWeight: 500 }}>
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

              <button onClick={handleSubmit}
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
