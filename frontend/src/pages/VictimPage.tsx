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
              {[
                ['📋', t('victim.copyLink')],
                ['𝕏',  'Twitter'],
                ['f',  'Facebook'],
              ].map(([icon, label]) => (
                <button
                  key={label}
                  className="flex-1 py-2 rounded-lg text-xs transition-all"
                  style={{
                    border:     '1px solid var(--border)',
                    color:      'var(--text-muted)',
                    background: 'var(--bg)',
                  }}
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
          {victim.bio_ar && (
            <div style={card}>
              <h2
                className="font-bold mb-4"
                style={{ color: 'var(--accent-text)', paddingBottom: '.5rem', borderBottom: '1px solid var(--border)' }}
              >
                {t('victim.biography')}
              </h2>
              <p
                className="text-sm"
                style={{ lineHeight: 'var(--leading-loose)', color: 'var(--text)' }}
              >
                {victim.bio_ar}
              </p>
            </div>
          )}

          {victim.testimonials && victim.testimonials.filter(t => t.verified).length > 0 && (
            <div style={card}>
              <h2
                className="font-bold mb-4"
                style={{ color: 'var(--accent-text)', paddingBottom: '.5rem', borderBottom: '1px solid var(--border)' }}
              >
                {t('victim.testimonials')}
              </h2>
              <div className="space-y-5">
                {victim.testimonials.filter(t => t.verified).map(test => (
                  <figure
                    key={test.id}
                    style={{
                      borderInlineStart: '3px solid var(--accent)',
                      paddingInlineStart: '1rem',
                      margin: 0,
                    }}
                  >
                    <blockquote
                      className="text-sm italic mb-2"
                      style={{ lineHeight: 'var(--leading-loose)', color: 'var(--text)' }}
                    >
                      "{test.content_ar}"
                    </blockquote>
                    <figcaption
                      className="text-xs font-semibold"
                      style={{ color: 'var(--accent-text)' }}
                    >
                      — {test.author_name}{test.relation ? ` · ${test.relation}` : ''}
                    </figcaption>
                  </figure>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
