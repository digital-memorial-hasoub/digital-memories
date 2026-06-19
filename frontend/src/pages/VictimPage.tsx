import { useParams, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import CountdownTimer from '../components/CountdownTimer'
import { useVictim } from '../hooks/useVictims'

const TYPE_COLOR: Record<string, string> = { homicide:'#e74c3c', domestic:'#e67e22', shooting:'#9b59b6', other:'#3498db' }
const TYPE_BG:    Record<string, string> = { homicide:'rgba(231,76,60,.18)', domestic:'rgba(230,126,34,.18)', shooting:'rgba(155,89,182,.18)', other:'rgba(52,152,219,.18)' }

export default function VictimPage() {
  const { id }   = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { t }    = useTranslation()
  const { data: victim, loading } = useVictim(id ?? '')

  if (loading) return <div className="pt-24 text-center" style={{ color: 'var(--muted)' }}>جارٍ التحميل...</div>
  if (!victim) return <div className="pt-24 text-center" style={{ color: 'var(--muted)' }}>لم يتم العثور على الضحية</div>

  const sectionStyle = { background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '12px', padding: '1.75rem', marginBottom: '1.25rem' }

  return (
    <div className="pt-16">
      <button onClick={() => navigate(-1)}
        className="m-6 flex items-center gap-2 text-sm px-4 py-2 rounded-lg transition-all"
        style={{ border: '1px solid var(--border)', color: 'var(--muted)', background: 'none' }}>
        ← {t('nav.victims')}
      </button>

      <div className="max-w-5xl mx-auto px-6 pb-16 grid md:grid-cols-[280px,1fr] gap-6 items-start">
        {/* Sidebar */}
        <aside className="space-y-4">
          <div className="rounded-xl overflow-hidden" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
            <div className="aspect-square flex items-center justify-center text-7xl"
              style={{ background: 'linear-gradient(135deg,#1a2535,#2a1e3a)', borderBottom: '1px solid var(--border)' }}>
              {victim.photo_url ? <img src={victim.photo_url} alt={victim.name_ar} className="w-full h-full object-cover" /> : '👤'}
            </div>
            <div className="p-5">
              <h1 className="text-xl font-bold mb-3">{victim.name_ar}</h1>
              {[
                [t('victim.age'),         `${victim.age} سنة`],
                [t('victim.city'),        victim.city],
                [t('victim.profession'),  victim.profession ?? '—'],
                [t('victim.dateOfDeath'), new Date(victim.date_of_death).toLocaleDateString('ar-SA')],
              ].map(([k, v]) => (
                <div key={k} className="flex justify-between py-2 text-sm" style={{ borderBottom: '1px solid rgba(255,255,255,.05)' }}>
                  <span style={{ color: 'var(--muted)' }}>{k}</span>
                  <span className="font-semibold">{v}</span>
                </div>
              ))}
              <span className="inline-block mt-3 text-xs px-3 py-1 rounded font-bold"
                style={{ background: TYPE_BG[victim.violence_type], color: TYPE_COLOR[victim.violence_type] }}>
                {t(`violence.${victim.violence_type}`)}
              </span>
            </div>
          </div>

          <CountdownTimer dateOfDeath={victim.date_of_death} />

          <div className="rounded-xl p-4" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
            <p className="text-xs mb-3" style={{ color: 'var(--muted)' }}>{t('victim.share')}</p>
            <div className="flex gap-2">
              {[['📋', t('victim.copyLink')], ['𝕏', 'Twitter'], ['📘', 'Facebook']].map(([icon, label]) => (
                <button key={label} className="flex-1 py-2 rounded-lg text-xs transition-all"
                  style={{ border: '1px solid var(--border)', color: 'var(--muted)', background: 'var(--bg)' }}
                  onClick={() => icon === '📋' && navigator.clipboard.writeText(window.location.href)}>
                  {icon}
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* Content */}
        <div>
          {victim.bio_ar && (
            <div style={sectionStyle}>
              <h2 className="font-bold mb-4" style={{ color: 'var(--gold)' }}>{t('victim.biography')}</h2>
              <p className="leading-loose text-sm">{victim.bio_ar}</p>
            </div>
          )}

          {victim.testimonials && victim.testimonials.length > 0 && (
            <div style={sectionStyle}>
              <h2 className="font-bold mb-4" style={{ color: 'var(--gold)' }}>{t('victim.testimonials')}</h2>
              <div className="space-y-5">
                {victim.testimonials.filter(t => t.verified).map(test => (
                  <div key={test.id} className="pr-4" style={{ borderRight: '3px solid var(--gold)' }}>
                    <p className="text-sm italic leading-loose mb-2">"{test.content_ar}"</p>
                    <p className="text-xs font-semibold" style={{ color: 'var(--gold)' }}>
                      — {test.author_name}{test.relation ? ` · ${test.relation}` : ''}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
