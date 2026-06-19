import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAdminAuth } from '../../contexts/AdminAuthContext'

export default function AdminLogin() {
  const { login }    = useAdminAuth()
  const navigate     = useNavigate()
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [error, setError]       = useState('')
  const [loading, setLoading]   = useState(false)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError(''); setLoading(true)
    try {
      await login(email, password)
      navigate('/admin')
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'فشل تسجيل الدخول')
    } finally { setLoading(false) }
  }

  const inp: React.CSSProperties = {
    width: '100%', padding: '.75rem 1rem',
    background: 'var(--bg)', border: '1px solid var(--border)',
    borderRadius: 'var(--radius-lg)', color: 'var(--text)',
    fontFamily: 'var(--font-body)', fontSize: '.95rem', outline: 'none',
    transition: 'border-color var(--dur) var(--ease)',
  }

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'var(--bg)', padding: '1.5rem',
    }}>
      <div style={{ width: '100%', maxWidth: '400px' }}>

        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <img src="/logo.svg" alt="لن يُنسَوا"
            style={{ width: '56px', height: '56px', margin: '0 auto .75rem', display: 'block' }} />
          <h1 style={{ fontSize: '1.3rem', fontWeight: 900, color: 'var(--ink-800)' }}>لن يُنسَوا</h1>
          <p style={{ fontSize: '.82rem', color: 'var(--text-muted)', marginTop: '.25rem' }}>لوحة الإدارة</p>
        </div>

        {/* Form card */}
        <form
          onSubmit={handleSubmit}
          style={{
            background:   'var(--surface)',
            border:       '1px solid var(--border)',
            borderRadius: 'var(--radius-2xl)',
            padding:      '2rem',
            boxShadow:    'var(--shadow-md)',
          }}
        >
          <h2 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1.5rem', textAlign: 'center', color: 'var(--text-strong)' }}>
            تسجيل دخول المشرف
          </h2>

          {error && (
            <div style={{
              background: 'var(--status-danger-bg)', border: '1px solid rgba(192,57,43,.4)',
              borderRadius: 'var(--radius-md)', padding: '.75rem 1rem', marginBottom: '1rem',
              color: 'var(--status-danger)', fontSize: '.85rem',
            }}>
              ⚠️ {error}
            </div>
          )}

          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', fontSize: '.82rem', color: 'var(--text-muted)', marginBottom: '.4rem' }}>
              البريد الإلكتروني
            </label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)}
              placeholder="admin@example.com" required style={inp} />
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', fontSize: '.82rem', color: 'var(--text-muted)', marginBottom: '.4rem' }}>
              كلمة المرور
            </label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)}
              placeholder="••••••••" required style={inp} />
          </div>

          <button type="submit" disabled={loading} style={{
            width: '100%', padding: '.8rem',
            borderRadius: 'var(--radius-lg)', border: 'none',
            background:   loading ? 'var(--olive-300)' : 'var(--accent)',
            color:        'var(--on-accent)',
            fontFamily:   'var(--font-body)', fontSize: '1rem', fontWeight: 700,
            cursor:       loading ? 'not-allowed' : 'pointer',
            transition:   'background var(--dur) var(--ease)',
          }}>
            {loading ? 'جارٍ التحقق...' : 'دخول ←'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '.78rem', color: 'var(--text-faint)' }}>
          هذه الصفحة للمشرفين المعتمدين فقط
        </p>
      </div>
    </div>
  )
}
