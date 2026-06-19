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

  const inp = {
    width: '100%', padding: '.75rem 1rem',
    background: 'var(--bg)', border: '1px solid var(--border)',
    borderRadius: '10px', color: 'var(--text)',
    fontFamily: 'Cairo, sans-serif', fontSize: '.95rem', outline: 'none',
  } as const

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg)', padding: '1.5rem' }}>
      <div style={{ width: '100%', maxWidth: '400px' }}>

        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '.5rem' }}>📖</div>
          <h1 style={{ fontSize: '1.3rem', fontWeight: 900, color: 'var(--gold)' }}>لن يُنسَوا</h1>
          <p style={{ fontSize: '.82rem', color: 'var(--muted)', marginTop: '.25rem' }}>لوحة الإدارة</p>
        </div>

        {/* Card */}
        <form onSubmit={handleSubmit} style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '16px', padding: '2rem' }}>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1.5rem', textAlign: 'center' }}>تسجيل دخول المشرف</h2>

          {error && (
            <div style={{ background: 'rgba(231,76,60,.15)', border: '1px solid rgba(231,76,60,.4)', borderRadius: '8px', padding: '.75rem 1rem', marginBottom: '1rem', color: '#e74c3c', fontSize: '.85rem' }}>
              ⚠️ {error}
            </div>
          )}

          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', fontSize: '.82rem', color: 'var(--muted)', marginBottom: '.4rem' }}>البريد الإلكتروني</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)}
              placeholder="admin@example.com" required style={inp}
              onFocus={e => (e.target.style.borderColor = 'var(--gold)')}
              onBlur={e  => (e.target.style.borderColor = 'var(--border)')} />
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', fontSize: '.82rem', color: 'var(--muted)', marginBottom: '.4rem' }}>كلمة المرور</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)}
              placeholder="••••••••" required style={inp}
              onFocus={e => (e.target.style.borderColor = 'var(--gold)')}
              onBlur={e  => (e.target.style.borderColor = 'var(--border)')} />
          </div>

          <button type="submit" disabled={loading} style={{
            width: '100%', padding: '.8rem', borderRadius: '10px', border: 'none',
            background: loading ? 'rgba(201,168,76,.5)' : 'var(--gold)',
            color: '#0d1117', fontFamily: 'Cairo, sans-serif', fontSize: '1rem',
            fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer', transition: 'all .2s',
          }}>
            {loading ? 'جارٍ التحقق...' : 'دخول →'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '.78rem', color: 'var(--muted)' }}>
          هذه الصفحة للمشرفين المعتمدين فقط
        </p>
      </div>
    </div>
  )
}
