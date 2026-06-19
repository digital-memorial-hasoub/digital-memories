import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import VictimCard from '../components/VictimCard'
import { useVictims } from '../hooks/useVictims'

const CITIES = ['أم الفحم','الناصرة','باقة الغربية','شفاعمرو','رهط','طمرة','كفر قاسم','عكا','الطيبة','كفر كنا','تل شيفع','المغار','جلجولية']

export default function SearchPage() {
  const { t } = useTranslation()
  const [q,    setQ]    = useState('')
  const [city, setCity] = useState('all')
  const [year, setYear] = useState('all')
  const [type, setType] = useState('all')

  const params: Record<string, string> = {}
  if (q)           params.search = q
  if (city !== 'all') params.city = city
  if (year !== 'all') params.year = year
  if (type !== 'all') params.type = type

  const { data, loading } = useVictims(params)
  const victims = data?.data ?? []

  const selectStyle = {
    padding: '.5rem .8rem',
    background: 'var(--bg)',
    border: '1px solid var(--border)',
    borderRadius: '8px',
    color: 'var(--muted)',
    fontFamily: 'Cairo, sans-serif',
    fontSize: '.85rem',
    outline: 'none',
  }

  return (
    <div className="pt-16 max-w-6xl mx-auto px-6 py-10">
      <h1 className="text-2xl font-black mb-2">قاعدة بيانات الضحايا</h1>
      <p className="text-sm mb-8" style={{ color: 'var(--muted)' }}>ابحث عن ضحية بالاسم، المدينة، السنة، أو نوع الجريمة.</p>

      <div className="flex flex-wrap gap-3 p-5 rounded-xl mb-6"
        style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
        <input value={q} onChange={e => setQ(e.target.value)}
          placeholder={t('search.placeholder')}
          className="flex-1 min-w-48 px-3 py-2 rounded-lg text-sm outline-none"
          style={{ background: 'var(--bg)', border: '1px solid var(--border)', color: 'var(--text)', fontFamily: 'Cairo, sans-serif' }} />
        <select value={city} onChange={e => setCity(e.target.value)} style={selectStyle}>
          <option value="all">{t('search.allCities')}</option>
          {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        <select value={year} onChange={e => setYear(e.target.value)} style={selectStyle}>
          <option value="all">{t('search.allYears')}</option>
          {['2022','2023','2024'].map(y => <option key={y} value={y}>{y}</option>)}
        </select>
        <select value={type} onChange={e => setType(e.target.value)} style={selectStyle}>
          <option value="all">{t('search.allTypes')}</option>
          {(['homicide','domestic','shooting','other'] as const).map(tp => (
            <option key={tp} value={tp}>{t(`violence.${tp}`)}</option>
          ))}
        </select>
      </div>

      <p className="text-sm mb-4" style={{ color: 'var(--muted)' }}>
        {loading ? 'جارٍ البحث...' : <><strong style={{ color: 'var(--gold-light,#e8c97a)' }}>{victims.length}</strong> {t('search.results')}</>}
      </p>

      {!loading && victims.length === 0 && (
        <p className="text-center py-16" style={{ color: 'var(--muted)' }}>{t('search.noResults')}</p>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-4">
        {victims.map(v => <VictimCard key={v.id} victim={v} />)}
      </div>
    </div>
  )
}
