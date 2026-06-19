import { Navigate, Outlet, Link, useLocation } from 'react-router-dom'
import { useAdminAuth } from '../../contexts/AdminAuthContext'

const NAV = [
  { to: '/admin',              icon: '📊', label: 'لوحة التحكم' },
  { to: '/admin/victims',      icon: '👥', label: 'الضحايا' },
  { to: '/admin/victims/new',  icon: '➕', label: 'إضافة ضحية' },
  { to: '/admin/testimonials', icon: '💬', label: 'الشهادات' },
]

export default function AdminLayout() {
  const { user, logout, loading } = useAdminAuth()
  const location = useLocation()

  if (loading) return <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', color: 'var(--muted)', fontFamily: 'Cairo, sans-serif' }}>جارٍ التحميل...</div>
  if (!user)   return <Navigate to="/admin/login" replace />

  const isActive = (to: string) =>
    to === '/admin' ? location.pathname === '/admin' : location.pathname.startsWith(to)

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg)', fontFamily: 'Cairo, sans-serif', direction: 'rtl' }}>

      {/* Sidebar */}
      <aside style={{ width: '240px', background: 'var(--surface)', borderLeft: '1px solid var(--border)', display: 'flex', flexDirection: 'column', flexShrink: 0, position: 'sticky', top: 0, height: '100vh' }}>

        {/* Brand */}
        <div style={{ padding: '1.25rem 1rem', borderBottom: '1px solid var(--border)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '.5rem' }}>
            <span style={{ fontSize: '1.5rem' }}>📖</span>
            <div>
              <div style={{ fontSize: '.88rem', fontWeight: 700, color: 'var(--gold)' }}>لن يُنسَوا</div>
              <div style={{ fontSize: '.7rem', color: 'var(--muted)' }}>لوحة الإدارة</div>
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
                padding: '.65rem .85rem', borderRadius: '10px', marginBottom: '.2rem',
                textDecoration: 'none', fontSize: '.88rem', transition: 'all .15s',
                background:    active ? 'rgba(201,168,76,.12)' : 'transparent',
                border:        `1px solid ${active ? 'rgba(201,168,76,.3)' : 'transparent'}`,
                color:         active ? 'var(--gold)' : 'var(--muted)',
                fontWeight:    active ? 700 : 400,
              }}>
                <span>{icon}</span>{label}
              </Link>
            )
          })}
        </nav>

        {/* User + Logout */}
        <div style={{ padding: '1rem', borderTop: '1px solid var(--border)' }}>
          <div style={{ fontSize: '.78rem', color: 'var(--muted)', marginBottom: '.5rem' }}>
            <div style={{ color: 'var(--text)', fontWeight: 600 }}>{user.user_metadata?.name ?? user.email}</div>
            <div>{user.email}</div>
          </div>
          <button onClick={() => { void logout() }} style={{
            width: '100%', padding: '.5rem', borderRadius: '8px',
            background: 'rgba(231,76,60,.1)', border: '1px solid rgba(231,76,60,.3)',
            color: '#e74c3c', fontFamily: 'Cairo, sans-serif', fontSize: '.8rem',
            cursor: 'pointer', transition: 'all .2s',
          }}>
            تسجيل الخروج
          </button>
          <Link to="/" style={{ display: 'block', textAlign: 'center', marginTop: '.5rem', fontSize: '.75rem', color: 'var(--muted)', textDecoration: 'none' }}>
            ← العودة للموقع
          </Link>
        </div>
      </aside>

      {/* Main content */}
      <main style={{ flex: 1, overflow: 'auto', padding: '2rem' }}>
        <Outlet />
      </main>
    </div>
  )
}
