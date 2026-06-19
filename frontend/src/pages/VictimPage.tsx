import { useState, type FormEvent } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import CountdownTimer from '../components/CountdownTimer'
import { useVictim } from '../hooks/useVictims'

const TYPE_COLOR: Record<string, string> = {
  homicide: 'var(--type-homicide)',
  domestic: 'var(--type-domestic)',
  shooting: 'var(--type-shooting)',
  other:    'var(--type-other)',
}
const TYPE_BG: Record<string, string> = {
  homicide: 'var(--type-homicide-bg)',
  domestic: 'var(--type-domestic-bg)',
  shooting: 'var(--type-shooting-bg)',
  other:    'var(--type-other-bg)',
}

/* ─── Testimonial submission form ──────────────────────────────────────── */
function TestimonialForm({ victimId }: { victimId: string }) {
  const [authorName, setAuthorName] = useState('')
  const [relation,   setRelation]   = useState('')
  const [content,    setContent]    = useState('')
  const [status,     setStatus]     = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')
  const [open,       setOpen]       = useState(false)

  const inp: React.CSSProperties = {
    width: '100%', padding: '.65rem .9rem',
    background: 'var(--bg)', border: '1px solid var(--border)',
    borderRadius: 'var(--radius-md)', color: 'var(--text)',
    fontFamily: 'var(--font-body)', fontSize: '.88rem', outline: 'none',
    boxSizing: 'border-box',
    transition: 'border-color var(--dur) var(--ease)',
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!authorName.trim() || !content.trim()) return
    setStatus('submitting')
    try {
      const BASE = import.meta.env.VITE_API_URL ?? '/api'
      const res = await fetch(`${BASE}/victims/${victimId}/testimonials`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ author_name: authorName.trim(), relation: relation.trim() || undefined, content_ar: content.trim() }),
      })
      if (!res.ok) throw new Error('Server error')
      setStatus('success')
      setAuthorName(''); setRelation(''); setContent('')
    } catch {
      setStatus('error')
    }
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="w-full py-3 rounded-xl text-sm font-semibold transition-all"
        style={{
          background: 'var(--accent-soft)',
          border:     '1px dashed var(--accent-line)',
          color:      'var(--accent-text)',
        }}
      >
        + أضف شهادتك عن {/* name injected by parent */}هذا الشخص
      </button>
    )
  }

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        background:   'var(--surface)',
        border:       '1px solid var(--border)',
        borderRadius: 'var(--radius-xl)',
        boxShadow:    'var(--shadow-sm)',
        padding:      '1.5rem',
        marginBottom: '1.25rem',
      }}
    >
      {/* Section heading */}
      <div
        className="flex items-center justify-between mb-4 pb-3"
        style={{ borderBottom: '1px solid var(--border)' }}
      >
        <h2 className="font-bold text-sm" style={{ color: 'var(--accent-text)' }}>
          أضف شهادتك
        </h2>
        <button
          type="button"
          onClick={() => { setOpen(false); setStatus('idle') }}
          style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '1.1rem' }}
        >
          ✕
        </button>
      </div>

      {status === 'success' ? (
        <div style={{
          background:   'var(--status-published-bg)',
          border:       '1px solid rgba(47,143,78,.35)',
          borderRadius: 'var(--radius-md)',
          padding:      '1rem 1.25rem',
          color:        'var(--status-published)',
          fontSize:     '.9rem',
          textAlign:    'center',
          lineHeight:   'var(--leading-loose)',
        }}>
          <div className="text-lg mb-1">✓</div>
          <strong>شكراً لشهادتك</strong>
          <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
            ستُراجَع من قِبَل الفريق قبل نشرها
          </p>
          <button
            type="button"
            onClick={() => { setStatus('idle'); setOpen(false) }}
            className="mt-3 text-xs underline"
            style={{ background: 'none', border: 'none', color: 'var(--accent-text)', cursor: 'pointer' }}
          >
            إغلاق
          </button>
        </div>
      ) : (
        <>
          <p className="text-xs mb-4" style={{ color: 'var(--text-muted)', lineHeight: 'var(--leading-loose)' }}>
            شهادتك ستُحفَظ كمسودة وتُعرَض على الفريق قبل نشرها — نقدّر ثقتك وأمانتك.
          </p>

          {/* Row: name + relation */}
          <div className="grid grid-cols-2 gap-3 mb-3">
            <div>
              <label className="block text-xs mb-1" style={{ color: 'var(--text-muted)' }}>
                اسمك <span style={{ color: 'var(--status-danger)' }}>*</span>
              </label>
              <input
                value={authorName}
                onChange={e => setAuthorName(e.target.value)}
                placeholder="محمد عبدالله"
                required
                style={inp}
              />
            </div>
            <div>
              <label className="block text-xs mb-1" style={{ color: 'var(--text-muted)' }}>
                صلتك بالمتوفى
              </label>
              <input
                value={relation}
                onChange={e => setRelation(e.target.value)}
                placeholder="أخ · زوجة · صديق"
                style={inp}
              />
            </div>
          </div>

          {/* Testimonial body */}
          <div className="mb-4">
            <label className="block text-xs mb-1" style={{ color: 'var(--text-muted)' }}>
              شهادتك <span style={{ color: 'var(--status-danger)' }}>*</span>
            </label>
            <textarea
              value={content}
              onChange={e => setContent(e.target.value)}
              placeholder="شارك ذكرى، لحظة، أو كلمة عن هذا الشخص..."
              required
              rows={5}
              style={{
                ...inp,
                resize:     'vertical',
                lineHeight: 'var(--leading-loose)',
                minHeight:  '110px',
              }}
            />
          </div>

          {status === 'error' && (
            <p className="text-xs mb-3" style={{ color: 'var(--status-danger)' }}>
              ⚠️ حدث خطأ، يرجى المحاولة مرة أخرى.
            </p>
          )}

          <div className="flex gap-3 justify-end">
            <button
              type="button"
              onClick={() => { setOpen(false); setStatus('idle') }}
              className="px-4 py-2 rounded-lg text-sm"
              style={{
                border:     '1px solid var(--border)',
                color:      'var(--text-muted)',
                background: 'none',
                cursor:     'pointer',
              }}
            >
              إلغاء
            </button>
            <button
              type="submit"
              disabled={status === 'submitting'}
              className="px-5 py-2 rounded-lg text-sm font-bold"
              style={{
                background: status === 'submitting' ? 'var(--olive-300)' : 'var(--accent)',
                color:      'var(--on-accent)',
                border:     'none',
                cursor:     status === 'submitting' ? 'not-allowed' : 'pointer',
                transition: 'background var(--dur) var(--ease)',
              }}
            >
              {status === 'submitting' ? 'جارٍ الإرسال...' : 'إرسال الشهادة'}
            </button>
          </div>
        </>
      )}
    </form>
  )
}

/* ─── Main page ─────────────────────────────────────────────────────────── */
export default function VictimPage() {
  const { id }   = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { t }    = useTranslation()
  const { data: victim, loading } = useVictim(id ?? '')

  if (loading) return (
    <div className="pt-24 text-center" style={{ color: 'var(--text-muted)' }}>جارٍ التحميل...</div>
  )
  if (!victim) return (
    <div className="pt-24 text-center" style={{ color: 'var(--text-muted)' }}>لم يتم العثور على الضحية</div>
  )

  const card: React.CSSProperties = {
    background:   'var(--surface)',
    border:       '1px solid var(--border)',
    borderRadius: 'var(--radius-xl)',
    boxShadow:    'var(--shadow-sm)',
    padding:      '1.75rem',
    marginBottom: '1.25rem',
  }

  const verifiedTestimonials = victim.testimonials?.filter(t => t.verified) ?? []

  return (
    <div className="pt-16" style={{ background: 'var(--bg)', minHeight: '100vh' }}>
      {/* Back button */}
      <button
        onClick={() => navigate(-1)}
        className="m-6 flex items-center gap-2 text-sm px-4 py-2 rounded-lg transition-all"
        style={{
          border:     '1px solid var(--border)',
          color:      'var(--text-muted)',
          background: 'var(--surface)',
          boxShadow:  'var(--shadow-sm)',
        }}
      >
        ← {t('nav.victims')}
      </button>

      <div className="max-w-5xl mx-auto px-6 pb-16 grid md:grid-cols-[280px,1fr] gap-6 items-start">

        {/* ── Sidebar ── */}
        <aside className="space-y-4">

          {/* Portrait card */}
          <div
            className="rounded-xl overflow-hidden"
            style={{ background: 'var(--surface)', border: '1px solid var(--border)', boxShadow: 'var(--shadow-sm)' }}
          >
            <div
              className="aspect-square flex items-center justify-center"
              style={{ background: 'var(--wash-photo)', borderBottom: '1px solid var(--border)' }}
            >
              {victim.photo_url ? (
                <img src={victim.photo_url} alt={victim.name_ar} className="w-full h-full object-cover" />
              ) : (
                <svg width="30%" height="30%" viewBox="0 0 24 24" fill="none"
                  stroke="var(--blue-grey-500)" strokeWidth="1.4"
                  strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <circle cx="12" cy="8" r="4" />
                  <path d="M4 21c0-4.4 3.6-7 8-7s8 2.6 8 7" />
                </svg>
              )}
            </div>

            <div className="p-5">
              <h1 className="text-xl font-bold mb-3" style={{ color: 'var(--text-strong)' }}>
                {victim.name_ar}
              </h1>

              {[
                [t('victim.age'),         `${victim.age} سنة`],
                [t('victim.city'),        victim.city],
                [t('victim.profession'),  victim.profession ?? '—'],
                [t('victim.dateOfDeath'), new Date(victim.date_of_death).toLocaleDateString('ar-SA')],
              ].map(([k, v]) => (
                <div
                  key={k}
                  className="flex justify-between py-2 text-sm"
                  style={{ borderBottom: '1px solid var(--border)' }}
                >
                  <span style={{ color: 'var(--text-muted)' }}>{k}</span>
                  <span className="font-semibold" style={{ color: 'var(--text)' }}>{v}</span>
                </div>
              ))}

              <span
                className="inline-block mt-3 text-xs px-3 py-1 rounded font-bold"
                style={{ background: TYPE_BG[victim.violence_type], color: TYPE_COLOR[victim.violence_type] }}
              >
                {t(`violence.${victim.violence_type}`)}
              </span>
            </div>
          </div>

          {/* Countdown */}
          <CountdownTimer dateOfDeath={victim.date_of_death} />

          {/* Share */}
          <div className="rounded-xl p-4" style={{ background: 'var(--surface)', border: '1px solid var(--border)', boxShadow: 'var(--shadow-sm)' }}>
            <p className="text-xs mb-3" style={{ color: 'var(--text-muted)' }}>{t('victim.share')}</p>
            <div className="flex gap-2">
              {([['📋', t('victim.copyLink')], ['𝕏', 'Twitter'], ['f', 'Facebook']] as [string, string][]).map(([icon, label]) => (
                <button
                  key={label}
                  className="flex-1 py-2 rounded-lg text-xs transition-all"
                  style={{ border: '1px solid var(--border)', color: 'var(--text-muted)', background: 'var(--bg)' }}
                  onClick={() => icon === '📋' && navigator.clipboard.writeText(window.location.href)}
                  onMouseEnter={e => (e.currentTarget.style.borderColor = 'var(--accent)')}
                  onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--border)')}
                >
                  {icon}
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* ── Main content ── */}
        <div>
          {/* Biography */}
          {victim.bio_ar && (
            <div style={card}>
              <h2 className="font-bold mb-4"
                style={{ color: 'var(--accent-text)', paddingBottom: '.5rem', borderBottom: '1px solid var(--border)' }}>
                {t('victim.biography')}
              </h2>
              <p className="text-sm" style={{ lineHeight: 'var(--leading-loose)', color: 'var(--text)' }}>
                {victim.bio_ar}
              </p>
            </div>
          )}

          {/* Published testimonials */}
          {verifiedTestimonials.length > 0 && (
            <div style={card}>
              <h2 className="font-bold mb-4"
                style={{ color: 'var(--accent-text)', paddingBottom: '.5rem', borderBottom: '1px solid var(--border)' }}>
                {t('victim.testimonials')}
                <span className="text-xs font-normal mr-2" style={{ color: 'var(--text-faint)' }}>
                  ({verifiedTestimonials.length})
                </span>
              </h2>
              <div className="space-y-5">
                {verifiedTestimonials.map(test => (
                  <figure key={test.id} style={{ borderInlineStart: '3px solid var(--accent)', paddingInlineStart: '1rem', margin: 0 }}>
                    <blockquote className="text-sm italic mb-2" style={{ lineHeight: 'var(--leading-loose)', color: 'var(--text)' }}>
                      "{test.content_ar}"
                    </blockquote>
                    <figcaption className="text-xs font-semibold" style={{ color: 'var(--accent-text)' }}>
                      — {test.author_name}{test.relation ? ` · ${test.relation}` : ''}
                    </figcaption>
                  </figure>
                ))}
              </div>
            </div>
          )}

          {/* ── Submit-a-testimonial section ── */}
          <div style={card}>
            <h2 className="font-bold mb-1"
              style={{ color: 'var(--accent-text)', paddingBottom: '.5rem', borderBottom: '1px solid var(--border)', marginBottom: '1rem' }}>
              شارك ذكرى أو شهادة
            </h2>
            <p className="text-xs mb-4" style={{ color: 'var(--text-muted)', lineHeight: 'var(--leading-loose)' }}>
              هل عرفت {victim.name_ar}؟ كلمة منك تبقى — شهادتك ستُراجَع ثم تُنشَر.
            </p>
            <TestimonialForm victimId={victim.id} />
          </div>
        </div>
      </div>
    </div>
  )
}
