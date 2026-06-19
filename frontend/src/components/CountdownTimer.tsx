import { useTranslation } from 'react-i18next'
import { useCountdown } from '../hooks/useCountdown'

interface Props { dateOfDeath: string }

export default function CountdownTimer({ dateOfDeath }: Props) {
  const { t }                              = useTranslation()
  const { days, hours, minutes, seconds } = useCountdown(dateOfDeath)

  const units = [
    { value: days,    label: t('victim.days') },
    { value: hours,   label: t('victim.hours') },
    { value: minutes, label: t('victim.minutes') },
    { value: seconds, label: t('victim.seconds') },
  ]

  return (
    <div
      className="rounded-xl p-5 text-center"
      style={{
        background: 'var(--surface)',
        border:     '1px solid var(--border)',
        boxShadow:  'var(--shadow-sm)',
      }}
    >
      <p className="text-xs mb-3 tracking-wider" style={{ color: 'var(--text-muted)', letterSpacing: 'var(--tracking-wide)' }}>
        {t('victim.elapsed')}
      </p>
      <div className="grid grid-cols-4 gap-2">
        {units.map(({ value, label }) => (
          <div key={label}>
            <span
              className="block text-2xl font-black"
              dir="ltr"
              style={{ color: 'var(--accent)', fontFamily: 'var(--font-mono)' }}
            >
              {String(value).padStart(2, '0')}
            </span>
            <span className="text-xs" style={{ color: 'var(--text-muted)' }}>{label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
