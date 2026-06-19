import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import type { Victim } from '../types'

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

interface Props { victim: Victim }

export default function VictimCard({ victim }: Props) {
  const navigate  = useNavigate()
  const { t }     = useTranslation()
  const typeLabel = t(`violence.${victim.violence_type}`)

  return (
    <div
      onClick={() => navigate(`/victims/${victim.id}`)}
      className="rounded-xl overflow-hidden cursor-pointer transition-all"
      style={{
        background:  'var(--surface)',
        border:      '1px solid var(--border)',
        boxShadow:   'var(--shadow-sm)',
        transition:  'transform var(--dur) var(--ease), border-color var(--dur) var(--ease), box-shadow var(--dur) var(--ease)',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.borderColor = 'var(--accent)'
        e.currentTarget.style.transform   = 'var(--lift)'
        e.currentTarget.style.boxShadow   = 'var(--shadow-md)'
      }}
      onMouseLeave={e => {
        e.currentTarget.style.borderColor = 'var(--border)'
        e.currentTarget.style.transform   = 'none'
        e.currentTarget.style.boxShadow   = 'var(--shadow-sm)'
      }}
    >
      {/* Portrait */}
      <div
        className="aspect-square flex items-center justify-center relative"
        style={{ background: 'var(--wash-photo)', borderBottom: '1px solid var(--border)' }}
      >
        {victim.photo_url ? (
          <img src={victim.photo_url} alt={victim.name_ar} className="w-full h-full object-cover" />
        ) : (
          <svg width="38%" height="38%" viewBox="0 0 24 24" fill="none"
            stroke="var(--blue-grey-500)" strokeWidth="1.4"
            strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <circle cx="12" cy="8" r="4" />
            <path d="M4 21c0-4.4 3.6-7 8-7s8 2.6 8 7" />
          </svg>
        )}
        <span
          className="absolute top-2 text-xs px-2 py-0.5 rounded font-bold"
          style={{
            insetInlineStart: '0.5rem',
            background: TYPE_BG[victim.violence_type],
            color:      TYPE_COLOR[victim.violence_type],
          }}
        >
          {typeLabel}
        </span>
      </div>

      {/* Identity */}
      <div className="p-3">
        <div className="font-bold mb-1" style={{ color: 'var(--text-strong)' }}>{victim.name_ar}</div>
        <div className="text-xs leading-relaxed" style={{ color: 'var(--text-muted)' }}>
          {victim.age} سنة · {new Date(victim.date_of_death).getFullYear()}
        </div>
        {victim.city && (
          <span
            className="inline-block mt-2 text-xs px-2 py-0.5 rounded"
            style={{ background: 'var(--accent-soft)', color: 'var(--accent-text)' }}
          >
            {victim.city}
          </span>
        )}
      </div>
    </div>
  )
}
