import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { api } from '../lib/api'
import type { Victim } from '../types'

interface Props { onClose: () => void }

export default function OnThisDay({ onClose }: Props) {
  const { t, i18n } = useTranslation()
  const navigate     = useNavigate()
  const [victims, setVictims] = useState<Victim[]>([])

  const today = new Date().toLocaleDateString(
    i18n.language === 'he' ? 'he-IL' : i18n.language === 'en' ? 'en-GB' : 'ar-SA',
    { day: 'numeric', month: 'long' }
  )

  useEffect(() => {
    api.victims.onThisDay()
      .then((res) => setVictims(res as Victim[]))
      .catch(() => setVictims([]))
  }, [])

  const handleClick = (id: string) => { navigate(`/victims/${id}`); onClose() }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'var(--scrim)', backdropFilter: 'var(--scrim-blur)' }}
    >
      <div
        className="w-full max-w-md rounded-2xl overflow-hidden"
        style={{
          background: 'var(--surface)',
          border:     '1px solid var(--border)',
          boxShadow:  'var(--shadow-lg)',
          animation:  'fadeUp .3s var(--ease)',
        }}
      >
        {/* Header — navy panel */}
        <div
          className="p-5 flex items-start justify-between"
          style={{ background: 'var(--ink-800)', borderBottom: '1px solid rgba(255,255,255,.08)' }}
        >
          <div>
            <p className="text-xs tracking-widest mb-1" style={{ color: 'var(--olive-300)', letterSpacing: 'var(--tracking-wide)' }}>
              {t('onThisDay.title')}
            </p>
            <h2 className="text-xl font-bold" style={{ color: 'var(--paper-50)' }}>
              {t('onThisDay.subtitle')}
            </h2>
            <p className="text-xs mt-1" style={{ color: 'var(--blue-grey-500)' }}>{today}</p>
          </div>
          <button
            onClick={onClose}
            className="text-sm px-2 py-1 rounded transition-all"
            style={{ border: '1px solid rgba(255,255,255,.15)', color: 'var(--blue-grey-500)', background: 'none' }}
          >
            ✕
          </button>
        </div>

        {/* List */}
        <div className="p-4 max-h-[55vh] overflow-y-auto space-y-3">
          {victims.length === 0 && (
            <p className="text-center py-4 text-sm" style={{ color: 'var(--text-muted)' }}>
              {t('common.loading')}
            </p>
          )}
          {victims.map((v) => (
            <div
              key={v.id}
              onClick={() => handleClick(v.id)}
              className="flex gap-3 items-center p-3 rounded-xl cursor-pointer transition-all"
              style={{ background: 'var(--bg)', border: '1px solid var(--border)' }}
              onMouseEnter={e => (e.currentTarget.style.borderColor = 'var(--accent)')}
              onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--border)')}
            >
              <div
                className="flex-shrink-0 w-11 h-11 rounded-full flex items-center justify-center overflow-hidden"
                style={{ background: 'var(--wash-photo)' }}
              >
                {v.photo_url ? (
                  <img src={v.photo_url} alt={v.name_ar} className="w-full h-full object-cover" />
                ) : (
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
                    stroke="var(--blue-grey-500)" strokeWidth="1.5"
                    strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <circle cx="12" cy="8" r="4" />
                    <path d="M4 21c0-4.4 3.6-7 8-7s8 2.6 8 7" />
                  </svg>
                )}
              </div>
              <div>
                <p className="font-bold" style={{ color: 'var(--text-strong)' }}>{v.name_ar}</p>
                <p className="text-xs leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                  {v.age} {t('common.ageUnit')} · {v.city} · {new Date(v.date_of_death).getFullYear()}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="p-4 flex gap-3 justify-end" style={{ borderTop: '1px solid var(--border)' }}>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg text-sm transition-all"
            style={{ border: '1px solid var(--border)', color: 'var(--text-muted)', background: 'none' }}
          >
            {t('onThisDay.skip')}
          </button>
          <button
            onClick={() => { navigate('/victims'); onClose() }}
            className="px-4 py-2 rounded-lg text-sm font-bold transition-all"
            style={{ background: 'var(--accent)', color: 'var(--on-accent)', border: 'none' }}
          >
            {t('onThisDay.viewAll')}
          </button>
        </div>
      </div>
    </div>
  )
}
