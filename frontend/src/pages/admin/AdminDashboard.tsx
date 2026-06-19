import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAdminAuth } from '../../contexts/AdminAuthContext'

interface Stats { total: number; published: number; draft: number; archived: number }

export default function AdminDashboard() {
  const { token } = useAdminAuth()
  const [stats, setStats] = useState<Stats | null>(null)

  useEffect(() => {
    if (!token) return
    const BASE = import.meta.env.VITE_API_URL ?? '/api'
    Promise.all([
      fetch(`${BASE}/admin/victims?limit=1&status=published`, { headers: { Authorization: `Bearer ${token}` } }).then(r => r.json()),
      fetch(`${BASE}/admin/victims?limit=1&status=draft`,     { headers: { Authorization: `Bearer ${token}` } }).then(r => r.json()),
      fetch(`${BASE}/admin/victims?limit=1&status=archived`,  { headers: { Authorization: `Bearer ${token}` } }).then(r => r.json()),
    ]).then(([pub, draft, arch]) => {
      setStats({
        total:     ((pub as any).total ?? 0) + ((draft as any).total ?? 0) + ((arch as any).total ?? 0),
        published:  (pub  as any).total ?? 0,
        draft:      (draft as any).total ?? 0,
        archived:   (arch as any).total ?? 0,
      })
    }).catch(console.error)
  }, [token])

  const STAT_CARDS = [
    { label: 'إجمالي الضحايا',  value: stats?.total     ?? '—', color: 'var(--accent)',           border: 'var(--accent-line)' },
    { label: 'منشور',           value: stats?.published  ?? '—', color: 'var(--status-published)', border: 'rgba(47,143,78,.3)' },
    { label: 'مسودة',          value: stats?.draft      ?? '—', color: 'var(--status-pending)',   border: 'rgba(207,113,27,.3)' },
    { label: 'مؤرشف',          value: stats?.archived   ?? '—', color: 'var(--status-archived)',  border: 'rgba(138,132,114,.3)' },
  ]

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.4rem', fontWeight: 900, color: 'var(--text-strong)', marginBottom: '.3rem' }}>
          لوحة التحكم
        </h1>
        <p style={{ fontSize: '.85rem', color: 'var(--text-muted)' }}>نظرة عامة على حالة قاعدة البيانات</p>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(160px,1fr))', gap: '1rem', marginBottom: '2.5rem' }}>
        {STAT_CARDS.map(({ label, value, color, border }) => (
          <div key={label} style={{
            background:   'var(--surface)',
            border:       `1px solid ${border}`,
            borderRadius: 'var(--radius-xl)',
            padding:      '1.25rem',
            boxShadow:    'var(--shadow-sm)',
          }}>
            <div style={{ fontSize: '2.25rem', fontWeight: 900, color, lineHeight: 1 }}>{value}</div>
            <div style={{ fontSize: '.78rem', color: 'var(--text-muted)', marginTop: '.4rem' }}>{label}</div>
          </div>
        ))}
      </div>

      {/* Quick actions */}
      <h2 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1rem', color: 'var(--text-muted)' }}>
        إجراءات سريعة
      </h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: '1rem' }}>
        {[
          { to: '/admin/victims/new',  label: 'إضافة ضحية جديدة', desc: 'أدخل بيانات ضحية ونشرها' },
          { to: '/admin/victims',      label: 'إدارة السجلات',    desc: 'مراجعة وتعديل البيانات' },
          { to: '/admin/testimonials', label: 'مراجعة الشهادات',  desc: 'قبول أو رفض الشهادات المعلقة' },
        ].map(({ to, label, desc }) => (
          <Link key={to} to={to} style={{ textDecoration: 'none' }}>
            <div
              style={{
                background:   'var(--surface)',
                border:       '1px solid var(--border)',
                borderRadius: 'var(--radius-xl)',
                padding:      '1.25rem',
                cursor:       'pointer',
                boxShadow:    'var(--shadow-sm)',
                transition:   'border-color var(--dur) var(--ease), box-shadow var(--dur) var(--ease)',
              }}
              onMouseEnter={e => {
                const el = e.currentTarget as HTMLElement
                el.style.borderColor = 'var(--accent)'
                el.style.boxShadow   = 'var(--shadow-md)'
              }}
              onMouseLeave={e => {
                const el = e.currentTarget as HTMLElement
                el.style.borderColor = 'var(--border)'
                el.style.boxShadow   = 'var(--shadow-sm)'
              }}
            >
              <div style={{ fontWeight: 700, marginBottom: '.2rem', color: 'var(--text-strong)' }}>{label}</div>
              <div style={{ fontSize: '.78rem', color: 'var(--text-muted)' }}>{desc}</div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
