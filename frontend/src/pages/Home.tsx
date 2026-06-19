import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import VictimCard from '../components/VictimCard'
import OnThisDay from '../components/OnThisDay'
import { api } from '../lib/api'
import type { Victim, PaginatedResponse } from '../types'

interface SummaryStats {
  totalVictims: number
  totalCities:  number
  minYear:      number | null
  maxYear:      number | null
}

export default function Home() {
  const { t }    = useTranslation()
  const navigate = useNavigate()
  const [recent,  setRecent]  = useState<Victim[]>([])
  const [stats,   setStats]   = useState<SummaryStats | null>(null)
  const [showOTD, setShowOTD] = useState(false)

  useEffect(() => {
    api.victims.list({ limit: '8', status: 'published' })
      .then((res) => setRecent((res as PaginatedResponse<Victim>).data ?? []))
      .catch(() => setRecent([]))

    fetch('/api/stats/summary')
      .then(r => r.json())
      .then(setStats)
      .catch(() => {})

    const timer = setTimeout(() => setShowOTD(true), 800)
    return () => clearTimeout(timer)
  }, [])

  const victimLabel = stats ? `${stats.totalVictims}` : '…'
  const cityLabel   = stats ? `${stats.totalCities}`  : '…'
  const yearLabel   = stats
    ? (stats.minYear && stats.maxYear && stats.minYear !== stats.maxYear
        ? `${stats.minYear}–${stats.maxYear}`
        : stats.maxYear ? `${stats.maxYear}` : '…')
    : '…'

  const statItems: [string, string][] = [
    [victimLabel, t('home.stats.victims')],
    [cityLabel,   t('home.stats.cities')],
    [yearLabel,   t('home.stats.years')],
  ]

  return (
    <div className="pt-16">
      {showOTD && <OnThisDay onClose={() => setShowOTD(false)} />}

      {/* ── Hero ── */}
      <section
        className="text-center py-20 px-6"
        style={{ background: 'var(--wash-olive)', borderBottom: '1px solid var(--border)' }}
      >
        <span
          className="inline-block text-xs mb-6 px-4 py-1.5 rounded-full"
          style={{ color: 'var(--accent-text)', border: '1px solid var(--accent-line)', letterSpacing: 'var(--tracking-wide)' }}
        >
          {t('home.eyebrow')}
        </span>

        <h1 className="text-5xl font-black mb-3" style={{ color: 'var(--ink-800)', lineHeight: 'var(--leading-tight)' }}>
          {t('hero.title')} —{' '}
          <span style={{ color: 'var(--accent-text)' }}>{t('hero.subtitle')}</span>
        </h1>

        <p className="text-lg max-w-xl mx-auto mb-10" style={{ color: 'var(--text-muted)', lineHeight: 'var(--leading-loose)' }}>
          {t('hero.desc')}
        </p>

        {/* Live stats */}
        <div className="flex justify-center gap-12 flex-wrap">
          {statItems.map(([n, l]) => (
            <div key={l} className="text-center">
              <div
                className="text-4xl font-black"
                dir="ltr"
                style={{ color: 'var(--accent)', fontFamily: 'var(--font-mono)', lineHeight: 'var(--leading-tight)' }}
              >
                {n}
              </div>
              <div className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>{l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Recent ── */}
      <section className="max-w-6xl mx-auto px-6 py-12">
        <div className="flex items-baseline justify-between mb-6">
          <h2 className="text-xl font-bold" style={{ color: 'var(--text-strong)' }}>{t('home.recentTitle')}</h2>
          <button
            onClick={() => navigate('/victims')}
            className="text-sm px-3 py-1.5 rounded-lg transition-all"
            style={{ color: 'var(--accent-text)', border: '1px solid var(--accent-line)', background: 'transparent' }}
          >
            {t('home.viewAll')}
          </button>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {recent.map((v) => <VictimCard key={v.id} victim={v} />)}
        </div>
      </section>

      {/* ── Map teaser ── */}
      <section className="max-w-6xl mx-auto px-6 pb-16">
        <div className="flex items-baseline justify-between mb-6">
          <h2 className="text-xl font-bold" style={{ color: 'var(--text-strong)' }}>{t('map.title')}</h2>
          <button
            onClick={() => navigate('/map')}
            className="text-sm px-3 py-1.5 rounded-lg transition-all"
            style={{ color: 'var(--accent-text)', border: '1px solid var(--accent-line)', background: 'transparent' }}
          >
            {t('home.openMap')}
          </button>
        </div>
        <div
          onClick={() => navigate('/map')}
          className="h-52 rounded-xl flex flex-col items-center justify-center gap-3 cursor-pointer transition-all"
          style={{ background: 'var(--surface)', border: '1px solid var(--border)', boxShadow: 'var(--shadow-sm)' }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--accent)'; e.currentTarget.style.boxShadow = 'var(--shadow-md)' }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.boxShadow = 'var(--shadow-sm)' }}
        >
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none"
            stroke="var(--accent)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21" />
            <line x1="9" y1="3" x2="9" y2="18" />
            <line x1="15" y1="6" x2="15" y2="21" />
          </svg>
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>{t('home.mapTeaser')}</p>
        </div>
      </section>
    </div>
  )
}
