import { useEffect, useState, useCallback } from 'react'
import { useAdminAuth } from '../../contexts/AdminAuthContext'
import { adminApi } from '../../lib/adminApi'

interface Testimonial {
  id: string; victim_id: string; author_name: string; relation?: string
  content_ar: string; verified: boolean; created_at: string
  victim?: { name_ar: string }
}

export default function AdminTestimonials() {
  const { token } = useAdminAuth()
  const [items,   setItems]   = useState<Testimonial[]>([])
  const [loading, setLoading] = useState(true)
  const [filter,  setFilter]  = useState<'all' | 'pending' | 'verified'>('pending')

  const load = useCallback(async () => {
    if (!token) return
    setLoading(true)
    try {
      const params: Record<string, string> = {}
      if (filter === 'pending')  params.verified = 'false'
      if (filter === 'verified') params.verified = 'true'
      const res = await adminApi.testimonials.list(token, params) as any
      setItems(Array.isArray(res) ? res : res.data ?? [])
    } catch (e) { console.error(e) }
    finally { setLoading(false) }
  }, [token, filter])

  useEffect(() => { load() }, [load])

  const approve = async (id: string) => { await adminApi.testimonials.approve(token!, id); load() }
  const reject  = async (id: string) => { await adminApi.testimonials.reject(token!, id);  load() }

  const btnStyle = (variant: 'approve' | 'reject') => ({
    padding: '.35rem .9rem', borderRadius: '7px', border: '1px solid',
    borderColor:  variant === 'approve' ? 'rgba(39,174,96,.5)'   : 'rgba(231,76,60,.5)',
    background:   variant === 'approve' ? 'rgba(39,174,96,.1)'   : 'rgba(231,76,60,.1)',
    color:        variant === 'approve' ? '#27ae60'               : '#e74c3c',
    fontFamily: 'Cairo, sans-serif', fontSize: '.8rem', cursor: 'pointer',
  } as const)

  return (
    <div>
      <div style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '1.3rem', fontWeight: 900 }}>مراجعة الشهادات</h1>
        <p style={{ fontSize: '.8rem', color: 'var(--muted)' }}>الشهادات المُرسَلة من الزوار بانتظار المراجعة</p>
      </div>

      {/* Filter tabs */}
      <div style={{ display: 'flex', gap: '.5rem', marginBottom: '1.5rem' }}>
        {([['all','الكل'],['pending','بانتظار المراجعة'],['verified','مقبول']] as const).map(([v, l]) => (
          <button key={v} onClick={() => setFilter(v)} style={{
            padding: '.4rem 1rem', borderRadius: '8px', border: '1px solid',
            borderColor: filter === v ? 'var(--gold)' : 'var(--border)',
            background:  filter === v ? 'rgba(201,168,76,.1)' : 'none',
            color:       filter === v ? 'var(--gold)' : 'var(--muted)',
            fontFamily: 'Cairo, sans-serif', cursor: 'pointer', fontSize: '.85rem',
          }}>{l}</button>
        ))}
      </div>

      {loading && <p style={{ color: 'var(--muted)', textAlign: 'center', padding: '3rem' }}>جارٍ التحميل...</p>}
      {!loading && items.length === 0 && <p style={{ color: 'var(--muted)', textAlign: 'center', padding: '3rem' }}>لا توجد شهادات في هذه الفئة</p>}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {items.map(t => (
          <div key={t.id} style={{ background: 'var(--surface)', border: `1px solid ${t.verified ? 'rgba(39,174,96,.3)' : 'var(--border)'}`, borderRadius: '14px', padding: '1.25rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '.75rem', flexWrap: 'wrap', gap: '.5rem' }}>
              <div>
                <span style={{ fontWeight: 700 }}>{t.author_name}</span>
                {t.relation && <span style={{ color: 'var(--muted)', fontSize: '.82rem', marginRight: '.5rem' }}>· {t.relation}</span>}
                {t.victim && <span style={{ color: 'var(--gold)', fontSize: '.82rem', marginRight: '.5rem' }}>← {t.victim.name_ar}</span>}
              </div>
              <div style={{ display: 'flex', gap: '.5rem', alignItems: 'center' }}>
                <span style={{ fontSize: '.72rem', color: 'var(--muted)' }}>{new Date(t.created_at).toLocaleDateString('ar-SA')}</span>
                {t.verified
                  ? <span style={{ padding: '.2rem .6rem', borderRadius: '20px', fontSize: '.72rem', background: 'rgba(39,174,96,.15)', color: '#27ae60' }}>مقبول ✓</span>
                  : <span style={{ padding: '.2rem .6rem', borderRadius: '20px', fontSize: '.72rem', background: 'rgba(230,126,34,.15)', color: '#e67e22' }}>بانتظار</span>}
              </div>
            </div>

            <p style={{ fontSize: '.88rem', lineHeight: '1.75', borderRight: '3px solid var(--border)', paddingRight: '1rem', color: 'var(--text)', marginBottom: '1rem' }}>
              "{t.content_ar}"
            </p>

            <div style={{ display: 'flex', gap: '.6rem', justifyContent: 'flex-end' }}>
              {!t.verified && <button onClick={() => approve(t.id)} style={btnStyle('approve')}>✓ قبول</button>}
              {t.verified  && <button onClick={() => reject(t.id)}  style={btnStyle('reject')}>✕ رفض القبول</button>}
              {!t.verified && <button onClick={() => reject(t.id)}  style={btnStyle('reject')}>✕ رفض</button>}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
