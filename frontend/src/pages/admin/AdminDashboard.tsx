import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAdminAuth } from '../../contexts/AdminAuthContext'

interface Stats { total: number; published: number; draft: number; archived: number; byType: Record<string, number> }

export default function AdminDashboard() {
  const { token } = useAdminAuth()
  const [stats, setStats] = useState<Stats | null>(null)

  useEffect(() => {
    if (!token) return
    const BASE = import.meta.env.VITE_API_URL ?? '/api'
    // Fetch both statuses
    Promise.all([
      fetch(`${BASE}/victims?limit=1&status=published`, { headers: { Authorization: `Bearer ${token}` } }).then(r => r.json()),
      fetch(`${BASE}/victims?limit=1&status=draft`,     { headers: { Authorization: `Bearer ${token}` } }).then(r => r.json()),
      fetch(`${BASE}/victims?limit=1`,                  { headers: { Authorization: `Bearer ${token}` } }).then(r => r.json()),
    ]).then(([pub, draft, all]) => {
      setStats({
        total:     (all as any).total     ?? 0,
        published: (pub as any).total     ?? 0,
        draft:     (draft as any).total   ?? 0,
        archived:  0,
        byType:    {},
      })
    }).catch(console.error)
  }, [token])

  const STAT_CARDS = [
    { label: 'إجمالي الضحايا',   value: stats?.total ?? '—',     color: '#c9a84c', icon: '👥' },
    { label: 'منشور',            value: stats?.published ?? '—', color: '#27ae60', icon: '✅' },
    { label: 'مسودة (بانتظار)', value: stats?.draft ?? '—',    color: '#e67e22', icon: '⏳' },
    { label: 'مؤرشف',           value: stats?.archived ?? '—', color: '#8b949e', icon: '📦' },
  ]

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.4rem', fontWeight: 900, marginBottom: '.3rem' }}>لوحة التحكم</h1>
        <p style={{ fontSize: '.85rem', color: 'var(--muted)' }}>نظرة عامة على حالة قاعدة البيانات</p>
      </div>

      {/* Stats grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(180px,1fr))', gap: '1rem', marginBottom: '2.5rem' }}>
        {STAT_CARDS.map(({ label, value, color, icon }) => (
          <div key={label} style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '14px', padding: '1.25rem' }}>
            <div style={{ fontSize: '1.6rem', marginBottom: '.5rem' }}>{icon}</div>
            <div style={{ fontSize: '2rem', fontWeight: 900, color }}>{value}</div>
            <div style={{ fontSize: '.78rem', color: 'var(--muted)', marginTop: '.2rem' }}>{label}</div>
          </div>
        ))}
      </div>

      {/* Quick actions */}
      <h2 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1rem', color: 'var(--muted)' }}>إجراءات سريعة</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: '1rem' }}>
        {[
          { to: '/admin/victims/new', icon: '➕', label: 'إضافة ضحية جديدة', desc: 'أدخل بيانات ضحية ونشرها' },
          { to: '/admin/victims',     icon: '📋', label: 'إدارة السجلات',    desc: 'مراجعة وتعديل البيانات' },
          { to: '/admin/testimonials',icon: '💬', label: 'مراجعة الشهادات',  desc: 'قبول أو رفض الشهادات المعلقة' },
        ].map(({ to, icon, label, desc }) => (
          <Link key={to} to={to} style={{ textDecoration: 'none' }}>
            <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '12px', padding: '1.25rem', cursor: 'pointer', transition: 'all .2s' }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--gold)' }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--border)' }}>
              <div style={{ fontSize: '1.8rem', marginBottom: '.5rem' }}>{icon}</div>
              <div style={{ fontWeight: 700, marginBottom: '.2rem' }}>{label}</div>
              <div style={{ fontSize: '.78rem', color: 'var(--muted)' }}>{desc}</div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
