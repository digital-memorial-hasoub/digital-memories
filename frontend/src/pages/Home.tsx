import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import VictimCard from '../components/VictimCard'
import OnThisDay from '../components/OnThisDay'
import { api } from '../lib/api'
import type { Victim, PaginatedResponse } from '../types'

export default function Home() {
  const { t }    = useTranslation()
  const navigate = useNavigate()
  const [recent, setRecent]     = useState<Victim[]>([])
  const [showOTD, setShowOTD]   = useState(false)

  useEffect(() => {
    api.victims.list({ limit: '8', status: 'published' })
      .then((res) => setRecent((res as PaginatedResponse<Victim>).data ?? []))
      .catch(() => setRecent([]))

    const timer = setTimeout(() => setShowOTD(true), 800)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="pt-16">
      {showOTD && <OnThisDay onClose={() => setShowOTD(false)} />}

      {/* Hero */}
      <section className="relative text-center py-20 px-6"
        style={{ background: 'linear-gradient(180deg,#0f1a0a 0%,var(--bg) 100%)', borderBottom: '1px solid var(--border)' }}>
        <div className="inline-block text-xs tracking-widest px-4 py-1.5 rounded-full mb-6"
          style={{ color: 'var(--gold)', border: '1px solid rgba(201,168,76,.4)' }}>
          مشروع التخليد الرقمي
        </div>
        <h1 className="text-5xl font-black mb-3" dir="rtl">
          {t('hero.title')} — <span style={{ color: 'var(--gold)' }}>{t('hero.subtitle')}</span>
        </h1>
        <p className="text-lg max-w-xl mx-auto mb-10" style={{ color: 'var(--muted)' }}>{t('hero.desc')}</p>
        <div className="flex justify-center gap-12 flex-wrap">
          {[['٥٠٠+','ضحية معروفة'],['١١','مدينة وبلدة'],['٢٠٢٢–٢٠٢٤','سنوات التوثيق']].map(([n,l]) => (
            <div key={l} className="text-center">
              <div className="text-4xl font-black" style={{ color: 'var(--gold-light, #e8c97a)' }}>{n}</div>
              <div className="text-sm mt-1" style={{ color: 'var(--muted)' }}>{l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Recent */}
      <section className="max-w-6xl mx-auto px-6 py-12">
        <div className="flex items-baseline justify-between mb-6">
          <h2 className="text-xl font-bold">آخر التوثيقات</h2>
          <button onClick={() => navigate('/victims')}
            className="text-sm px-3 py-1.5 rounded-lg transition-all"
            style={{ color: 'var(--gold)', border: '1px solid rgba(201,168,76,.35)' }}>
            عرض الكل →
          </button>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {recent.map((v) => <VictimCard key={v.id} victim={v} />)}
        </div>
      </section>

      {/* Map teaser */}
      <section className="max-w-6xl mx-auto px-6 pb-16">
        <div className="flex items-baseline justify-between mb-6">
          <h2 className="text-xl font-bold">{t('map.title')}</h2>
          <button onClick={() => navigate('/map')}
            className="text-sm px-3 py-1.5 rounded-lg transition-all"
            style={{ color: 'var(--gold)', border: '1px solid rgba(201,168,76,.35)' }}>
            فتح الخريطة →
          </button>
        </div>
        <div onClick={() => navigate('/map')}
          className="h-52 rounded-xl flex flex-col items-center justify-center gap-3 cursor-pointer transition-all"
          style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
          onMouseEnter={e => (e.currentTarget.style.borderColor = 'var(--gold)')}
          onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--border)')}>
          <span className="text-5xl">🗺️</span>
          <p className="text-sm" style={{ color: 'var(--muted)' }}>خريطة حرارية تفاعلية — اضغط للفتح</p>
        </div>
      </section>
    </div>
  )
}
