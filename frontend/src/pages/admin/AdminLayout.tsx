import { Navigate, Outlet, Link, useLocation } from 'react-router-dom'
import { useAdminAuth } from '../../contexts/AdminAuthContext'

const NAV = [
  { to: '/admin',              icon: '◈',  label: 'لوحة التحكم' },
  { to: '/admin/victims',      icon: '⊞',  label: 'الضحايا' },
  { to: '/admin/victims/new',  icon: '+',  label: 'إضافة ضحية' },
  { to: '/admin/testimonials', icon: '❝',  label: 'الشهادات' },
]

export default function AdminLayout() {
  const { user, logout, loading } = useAdminAuth()
  const location = useLocation()

  if (loading) return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      height: '100vh', color: 'var(--text-muted)', fontFamily: 'var(--font-body)',
      background: 'var(--bg)',
    }}>
      جارٍ التحميل...
    </div>
  )
  if (!user) return <Navigate to="/admin/login" replace />

  const isActive = (to: string) =>
    to === '/admin' ? location.pathname === '/admin' : location.pathname.startsWith(to)

  return (
    <div style={{
      display: 'flex', minHeight: '100vh',
      background: 'var(--bg)', fontFamily: 'var(--font-body)', direction: 'rtl',
    }}>

      {/* ── Sidebar ── */}
      <aside style={{
        width:          'var(--sidebar-w)',
        background:     'var(--surface)',
        borderInlineStart: '1px solid var(--border)',
        display:        'flex',
        flexDirection:  'column',
        flexShrink:     0,
        position:       'sticky',
        top:            0,
        height:         '100vh',
        boxShadow:      'var(--shadow-sm)',
      }}>

        {/* Brand */}
        <div style={{ padding: '1.25rem 1rem', borderBottom: '1px solid var(--border)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '.6rem' }}>
            <img src="/logo.svg" alt="لن يُنسَوا"
              style={{ width: '32px', height: '32px', objectFit: 'contain' }} />
            <div>
              <div style={{ fontSize: '.88rem', fontWeight: 700, color: 'var(--ink-800)' }}>لن يُنسَوا</div>
              <div style={{ fontSize: '.7rem', color: 'var(--text-muted)' }}>لوحة الإدارة</div>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: '.75rem .5rem', overflowY: 'auto' }}>
          {NAV.map(({ to, icon, label }) => {
            const active = isActive(to)
            return (
              <Link key={to} to={to} style={{
                display: 'flex', alignItems: 'center', gap: '.6rem',
                padding: '.65rem .85rem', borderRadius: 'var(--radius-lg)',
                marginBottom: '.2rem', textDecoration: 'none',
                fontSize: '.88rem', transition: 'all var(--dur) var(--ease)',
                background: active ? 'var(--accent-soft)'      : 'transparent',
                border:     `1px solid ${active ? 'var(--accent-line)' : 'transparent'}`,
                color:      active ? 'var(--accent-text)'      : 'var(--text-muted)',
                fontWeight: active ? 600 : 400,
              }}>
                <span style={{ fontSize: '1rem' }}>{icon}</span>
                {label}
              </Link>
            )
          })}
        </nav>

        {/* User + logout */}
        <div style={{ padding: '1rem', borderTop: '1px solid var(--border)' }}>
          <div style={{ fontSize: '.78rem', color: 'var(--text-muted)', marginBottom: '.5rem' }}>
            <div style={{ color: 'var(--text-strong)', fontWeight: 600 }}>
              {user.user_metadata?.name ?? user.email}
            </div>
            <div>{user.email}</div>
          </div>
          <button onClick={() => { void logout() }} style={{
            width: '100%', padding: '.5rem',
            borderRadius: 'var(--radius-md)',
            background: 'var(--status-danger-bg)',
            border:     '1px solid rgba(192,57,43,.3)',
            color:      'var(--status-danger)',
            fontFamily: 'var(--font-body)', fontSize: '.8rem',
            cursor: 'pointer', transition: 'all var(--dur) var(--ease)',
          }}>
            تسجيل الخروج
          </button>
          <Link to="/" style={{
            display: 'block', textAlign: 'center', marginTop: '.5rem',
            fontSize: '.75rem', color: 'var(--text-faint)', textDecoration: 'none',
          }}>
            ← العودة للموقع
          </Link>
        </div>
      </aside>

      {/* ── Main ── */}
      <main style={{ flex: 1, overflow: 'auto', padding: '2rem' }}>
        <Outlet />
      </main>
    </div>
  )
}
