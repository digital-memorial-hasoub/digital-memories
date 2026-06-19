import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { api } from '../lib/api'
import type { MapMarker, CityStats } from '../types'

// Leaflet loaded via CDN in index.html for simplicity in this scaffold
// In production, import from 'leaflet' directly
declare const L: any // eslint-disable-line @typescript-eslint/no-explicit-any

const TYPE_COLOR: Record<string, string> = { homicide:'#e74c3c', domestic:'#e67e22', shooting:'#9b59b6', other:'#3498db' }

interface CityPanel { city: string; stats: CityStats; victims: MapMarker[] }

export default function MapPage() {
  const { t }        = useTranslation()
  const navigate     = useNavigate()
  const mapRef       = useRef<HTMLDivElement>(null)
  const mapInstance  = useRef<any>(null)
  const [panel, setPanel] = useState<CityPanel | null>(null)
  const [yearFilter, setYearFilter] = useState('all')
  const [typeFilter, setTypeFilter] = useState('all')

  useEffect(() => {
    if (!mapRef.current || mapInstance.current) return
    mapInstance.current = L.map(mapRef.current, { center: [32.1, 35.0], zoom: 8 })
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
    }).addTo(mapInstance.current)

    Promise.all([api.victims.map(), api.stats.cities()])
      .then(([markers, cityStats]) => {
        drawMap(markers as MapMarker[], cityStats as CityStats[])
      })
      .catch(console.error)

    return () => { mapInstance.current?.remove(); mapInstance.current = null }
  }, [])

  const drawMap = (markers: MapMarker[], cityStats: CityStats[]) => {
    if (!mapInstance.current) return
    const map   = mapInstance.current
    const maxCt = Math.max(...cityStats.map(c => c.count), 1)

    cityStats.forEach(({ city, lat, lng, count }) => {
      const ratio = count / maxCt
      const hue   = Math.round((1 - ratio) * 120)
      L.circle([lat, lng], {
        radius: 4000 + ratio * 18000,
        color: 'transparent',
        fillColor: `hsl(${hue},90%,50%)`,
        fillOpacity: 0.2 + ratio * 0.3,
      }).addTo(map).on('click', () => {
        const victims = markers.filter(m => m.city === city)
        setPanel({ city, stats: cityStats.find(c => c.city === city)!, victims })
      })
    })

    markers.forEach(v => {
      const icon = L.divIcon({
        className: '',
        html: `<div style="width:20px;height:20px;border-radius:50% 50% 50% 0;background:${TYPE_COLOR[v.violence_type] || '#8b949e'};border:2px solid rgba(255,255,255,.8);transform:rotate(-45deg);box-shadow:0 2px 8px rgba(0,0,0,.5)"></div>`,
        iconSize: [20, 20], iconAnchor: [10, 20], popupAnchor: [0, -22],
      })
      L.marker([v.lat, v.lng], { icon })
        .bindPopup(`
          <div style="font-family:Cairo,sans-serif;padding:.75rem;min-width:180px">
            <div style="font-weight:700;color:#e8c97a;margin-bottom:.4rem">${v.name_ar}</div>
            <div style="font-size:.78rem;color:#8b949e;line-height:1.8">
              ${v.city} · ${new Date(v.date_of_death).getFullYear()}
            </div>
            <button onclick="window._navigateTo('/victims/${v.id}')" style="display:block;width:100%;margin-top:.5rem;padding:.3rem;background:rgba(201,168,76,.15);border:1px solid #c9a84c;border-radius:6px;color:#c9a84c;font-size:.75rem;font-family:Cairo,sans-serif;cursor:pointer">
              ${t('map.readStory')}
            </button>
          </div>`)
        .addTo(map)
    })

    // expose navigate to popup onclick
    ;(window as any)._navigateTo = navigate
  }

  const filterStyle = {
    padding: '.4rem .8rem', background: 'var(--bg)',
    border: '1px solid var(--border)', borderRadius: '8px',
    color: 'var(--muted)', fontFamily: 'Cairo,sans-serif', fontSize: '.8rem', outline: 'none',
  }

  return (
    <div className="flex flex-col" style={{ height: '100vh', paddingTop: '64px' }}>
      <div className="flex items-center gap-3 px-6 py-2 flex-wrap flex-shrink-0"
        style={{ background: 'var(--surface)', borderBottom: '1px solid var(--border)' }}>
        <h2 className="font-bold text-sm ml-auto" style={{ color: 'var(--gold)' }}>🗺️ {t('map.title')}</h2>
        <select value={yearFilter} onChange={e => setYearFilter(e.target.value)} style={filterStyle}>
          <option value="all">{t('map.allYears')}</option>
          {['2022','2023','2024'].map(y => <option key={y} value={y}>{y}</option>)}
        </select>
        <select value={typeFilter} onChange={e => setTypeFilter(e.target.value)} style={filterStyle}>
          <option value="all">{t('map.allTypes')}</option>
          {(['homicide','domestic','shooting','other'] as const).map(tp => (
            <option key={tp} value={tp}>{t(`violence.${tp}`)}</option>
          ))}
        </select>
      </div>

      <div className="flex-1 relative">
        <div ref={mapRef} style={{ width: '100%', height: '100%' }} />

        {/* City panel */}
        {panel && (
          <div className="absolute top-4 right-4 z-[800] w-72 flex flex-col rounded-xl overflow-hidden"
            style={{ background: 'rgba(22,27,34,.95)', border: '1px solid var(--gold)', maxHeight: 'calc(100% - 2rem)' }}>
            <div className="p-4 flex justify-between items-center flex-shrink-0"
              style={{ borderBottom: '1px solid var(--border)' }}>
              <span className="font-bold" style={{ color: 'var(--gold-light,#e8c97a)' }}>📍 {panel.city}</span>
              <button onClick={() => setPanel(null)} style={{ color: 'var(--muted)', background: 'none', border: 'none', fontSize: '1.1rem' }}>✕</button>
            </div>
            <div className="flex gap-4 p-3 flex-shrink-0" style={{ borderBottom: '1px solid var(--border)' }}>
              {[
                [panel.victims.length, t('map.documented')],
                [panel.stats.population?.toLocaleString() ?? '—', t('map.population')],
                [panel.stats.rate_per_100k?.toFixed(1) ?? '—', t('map.rate')],
              ].map(([n, l]) => (
                <div key={String(l)}>
                  <div className="text-xl font-black" style={{ color: 'var(--gold)' }}>{n}</div>
                  <div className="text-xs" style={{ color: 'var(--muted)' }}>{l}</div>
                </div>
              ))}
            </div>
            <div className="overflow-y-auto p-2">
              {panel.victims.map(v => (
                <div key={v.id} onClick={() => navigate(`/victims/${v.id}`)}
                  className="p-3 rounded-lg cursor-pointer mb-1 transition-all"
                  style={{ border: '1px solid transparent' }}
                  onMouseEnter={e => (e.currentTarget.style.borderColor = 'var(--border)')}
                  onMouseLeave={e => (e.currentTarget.style.borderColor = 'transparent')}>
                  <div className="text-sm font-semibold">{v.name_ar}</div>
                  <div className="text-xs mt-0.5" style={{ color: 'var(--muted)' }}>
                    {t(`violence.${v.violence_type}`)} · {new Date(v.date_of_death).getFullYear()}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Legend */}
        <div className="absolute bottom-6 left-4 z-[800] p-3 rounded-xl text-xs"
          style={{ background: 'rgba(22,27,34,.92)', border: '1px solid var(--border)' }}>
          <p className="font-bold mb-2" style={{ color: 'var(--gold)' }}>نوع الجريمة</p>
          {Object.entries(TYPE_COLOR).map(([type, color]) => (
            <div key={type} className="flex items-center gap-2 mb-1" style={{ color: 'var(--muted)' }}>
              <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: color }} />
              {t(`violence.${type}`)}
            </div>
          ))}
          <div className="mt-2 pt-2" style={{ borderTop: '1px solid var(--border)' }}>
            <p className="font-bold mb-1" style={{ color: 'var(--gold)' }}>الكثافة</p>
            <div className="h-2 rounded-full w-28" style={{ background: 'linear-gradient(90deg,#ffffb2,#fd8d3c,#e31a1c)' }} />
            <div className="flex justify-between mt-0.5" style={{ color: 'var(--muted)' }}>
              <span>{t('map.heatLow')}</span><span>{t('map.heatHigh')}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
