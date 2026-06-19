import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { api } from '../lib/api'
import type { Victim } from '../types'

interface Props { onClose: () => void }

export default function OnThisDay({ onClose }: Props) {
  const { t }    = useTranslation()
  const navigate = useNavigate()
  const [victims, setVictims] = useState<Victim[]>([])
  const today = new Date().toLocaleDateString('ar-SA', { day: 'numeric', month: 'long' })

  useEffect(() => {
    api.victims.onThisDay()
      .then((res) => setVictims(res as Victim[]))
      .catch(() => setVictims([]))
  }, [])

  const handleClick = (id: string) => { navigate(`/victims/${id}`); onClose() }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,.75)', backdropFilter: 'blur(4px)' }}>
      <div className="w-full max-w-md rounded-2xl overflow-hidden animate-[fadeUp_.3s_ease]"
        style={{ background: 'var(--surface)', border: '1px solid var(--gold)' }}>

        <div className="p-5 flex items-start justify-between"
          style={{ background: 'linear-gradient(135deg,#1a2010,#0d1117)', borderBottom: '1px solid var(--border)' }}>
          <div>
            <p className="text-xs tracking-widest mb-1" style={{ color: 'var(--gold)' }}>📅 {t('onThisDay.title')}</p>
            <h2 className="text-xl font-bold" style={{ color: 'var(--gold-light, #e8c97a)' }}>{t('onThisDay.subtitle')}</h2>
            <p className="text-xs mt-1" style={{ color: 'var(--muted)' }}>{today}</p>
          </div>
          <button onClick={onClose} className="text-sm px-2 py-1 rounded transition-all"
            style={{ border: '1px solid var(--border)', color: 'var(--muted)' }}>✕</button>
        </div>

        <div className="p-4 max-h-[55vh] overflow-y-auto space-y-3">
          {victims.length === 0 && (
            <p className="text-center py-4 text-sm" style={{ color: 'var(--muted)' }}>جارٍ التحميل...</p>
          )}
          {victims.map((v) => (
            <div key={v.id} onClick={() => handleClick(v.id)}
              className="flex gap-3 items-center p-3 rounded-xl cursor-pointer transition-all"
              style={{ background: 'rgba(255,255,255,.03)', border: '1px solid var(--border)' }}
              onMouseEnter={e => (e.currentTarget.style.borderColor = 'var(--gold)')}
              onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--border)')}>
              <span className="text-3xl flex-shrink-0">👤</span>
              <div>
                <p className="font-bold">{v.name_ar}</p>
                <p className="text-xs leading-relaxed" style={{ color: 'var(--muted)' }}>
                  {v.age} سنة · {v.city} · {new Date(v.date_of_death).getFullYear()}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="p-4 flex gap-3 justify-end" style={{ borderTop: '1px solid var(--border)' }}>
          <button onClick={onClose}
            className="px-4 py-2 rounded-lg text-sm transition-all"
            style={{ border: '1px solid var(--border)', color: 'var(--muted)' }}>
            {t('onThisDay.skip')}
          </button>
          <button onClick={() => { navigate('/victims'); onClose() }}
            className="px-4 py-2 rounded-lg text-sm font-bold transition-all"
            style={{ background: 'var(--gold)', color: '#0d1117' }}>
            {t('onThisDay.viewAll')}
          </button>
        </div>
      </div>
    </div>
  )
}
