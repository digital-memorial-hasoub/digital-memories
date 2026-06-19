import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import type { Victim } from '../types'

const TYPE_COLOR: Record<string, string> = {
  homicide: '#e74c3c',
  domestic: '#e67e22',
  shooting: '#9b59b6',
  other:    '#3498db',
}
const TYPE_BG: Record<string, string> = {
  homicide: 'rgba(231,76,60,.18)',
  domestic: 'rgba(230,126,34,.18)',
  shooting: 'rgba(155,89,182,.18)',
  other:    'rgba(52,152,219,.18)',
}

interface Props { victim: Victim }

export default function VictimCard({ victim }: Props) {
  const navigate     = useNavigate()
  const { t }        = useTranslation()
  const typeLabel    = t(`violence.${victim.violence_type}`)

  return (
    <div onClick={() => navigate(`/victims/${victim.id}`)}
      className="rounded-xl overflow-hidden cursor-pointer transition-all duration-200 hover:-translate-y-1"
      style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
      onMouseEnter={e => (e.currentTarget.style.borderColor = 'var(--gold)')}
      onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--border)')}>

      <div className="aspect-square flex items-center justify-center text-5xl relative"
        style={{ background: 'linear-gradient(135deg,#1a2535,#2a1e3a)', borderBottom: '1px solid var(--border)' }}>
        {victim.photo_url
          ? <img src={victim.photo_url} alt={victim.name_ar} className="w-full h-full object-cover" />
          : <span>👤</span>}
        <span className="absolute top-2 left-2 text-xs px-2 py-0.5 rounded font-bold"
          style={{ background: TYPE_BG[victim.violence_type], color: TYPE_COLOR[victim.violence_type] }}>
          {typeLabel}
        </span>
      </div>

      <div className="p-3">
        <div className="font-bold mb-1">{victim.name_ar}</div>
        <div className="text-xs leading-relaxed" style={{ color: 'var(--muted)' }}>
          {victim.age} سنة · {new Date(victim.date_of_death).getFullYear()}
        </div>
        <span className="inline-block mt-2 text-xs px-2 py-0.5 rounded"
          style={{ background: 'rgba(255,255,255,.06)', color: 'var(--muted)' }}>
          📍 {victim.city}
        </span>
      </div>
    </div>
  )
}
