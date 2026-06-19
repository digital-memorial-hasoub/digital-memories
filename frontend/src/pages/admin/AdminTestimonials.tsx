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

  useEffect(() => { void load() }, [load])

  const approve = async (id: string) => { await adminApi.testimonials.approve(token!, id); void load() }
  const reject  = async (id: string) => { await adminApi.testimonials.reject(token!, id);  void load() }

  const actionBtn = (variant: 'approve' | 'reject'): React.CSSProperties => ({
    padding: '.35rem .9rem', borderRadius: 'var(--radius-md)', cursor: 'pointer',
    fontFamily: 'var(--font-body)', fontSize: '.8rem',
    border:     variant === 'approve' ? '1px solid rgba(47,143,78,.4)'   : '1px solid rgba(192,57,43,.4)',
    background: variant === 'approve' ? 'var(--status-published-bg)'     : 'var(--status-danger-bg)',
    color:      variant === 'approve' ? 'var(--status-published)'        : 'var(--status-danger)',
  })

  const TABS: [typeof filter, string][] = [
    ['all',      'الكل'],
    ['pending',  'بانتظار المراجعة'],
    ['verified', 'مقبول'],
  ]

  return (
    <div>
      <div style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '1.3rem', fontWeight: 900, color: 'var(--text-strong)' }}>مراجعة الشهادات</h1>
        <p style={{ fontSize: '.8rem', color: 'var(--text-muted)' }}>الشهادات المُرسَلة من الزوار بانتظار المراجعة</p>
      </div>

      {/* Filter tabs */}
      <div style={{ display: 'flex', gap: '.5rem', marginBottom: '1.5rem' }}>
        {TABS.map(([v, l]) => (
          <button key={v} onClick={() => setFilter(v)} style={{
            padding: '.4rem 1rem', borderRadius: 'var(--radius-md)', cursor: 'pointer',
            border:     filter === v ? '1px solid var(--accent)'      : '1px solid var(--border)',
            background: filter === v ? 'var(--accent-soft)'           : 'var(--surface)',
            color:      filter === v ? 'var(--accent-text)'           : 'var(--text-muted)',
            fontFamily: 'var(--font-body)', fontSize: '.85rem',
            fontWeight: filter === v ? 600 : 400,
          }}>
            {l}
          </button>
        ))}
      </div>

      {loading && (
        <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '3rem' }}>جارٍ التحميل...</p>
      )}
      {!loading && items.length === 0 && (
        <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '3rem' }}>
          لا توجد شهادات في هذه الفئة
        </p>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {items.map(item => (
          <div key={item.id} style={{
            background:   'var(--surface)',
            border:       `1px solid ${item.verified ? 'rgba(47,143,78,.35)' : 'var(--border)'}`,
            borderRadius: 'var(--radius-xl)',
            padding:      '1.25rem',
            boxShadow:    'var(--shadow-sm)',
          }}>
            {/* Meta row */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '.75rem', flexWrap: 'wrap', gap: '.5rem' }}>
              <div>
                <span style={{ fontWeight: 700, color: 'var(--text-strong)' }}>{item.author_name}</span>
                {item.relation && (
                  <span style={{ color: 'var(--text-muted)', fontSize: '.82rem', marginInlineStart: '.5rem' }}>
                    · {item.relation}
                  </span>
                )}
                {item.victim && (
                  <span style={{ color: 'var(--accent-text)', fontSize: '.82rem', marginInlineStart: '.5rem' }}>
                    ← {item.victim.name_ar}
                  </span>
                )}
              </div>
              <div style={{ display: 'flex', gap: '.5rem', alignItems: 'center' }}>
                <span style={{ fontSize: '.72rem', color: 'var(--text-faint)' }}>
                  {new Date(item.created_at).toLocaleDateString('ar-SA')}
                </span>
                {item.verified ? (
                  <span style={{
                    padding: '.2rem .6rem', borderRadius: 'var(--radius-pill)', fontSize: '.72rem',
                    background: 'var(--status-published-bg)', color: 'var(--status-published)',
                  }}>
                    مقبول ✓
                  </span>
                ) : (
                  <span style={{
                    padding: '.2rem .6rem', borderRadius: 'var(--radius-pill)', fontSize: '.72rem',
                    background: 'var(--status-pending-bg)', color: 'var(--status-pending)',
                  }}>
                    بانتظار
                  </span>
                )}
              </div>
            </div>

            {/* Quote */}
            <blockquote style={{
              fontSize: '.88rem', lineHeight: 'var(--leading-loose)',
              borderInlineStart: '3px solid var(--accent)',
              paddingInlineStart: '1rem',
              color: 'var(--text)', marginBottom: '1rem',
              fontStyle: 'italic',
            }}>
              "{item.content_ar}"
            </blockquote>

            {/* Actions */}
            <div style={{ display: 'flex', gap: '.6rem', justifyContent: 'flex-end' }}>
              {!item.verified && <button onClick={() => approve(item.id)} style={actionBtn('approve')}>✓ قبول</button>}
              {item.verified  && <button onClick={() => reject(item.id)}  style={actionBtn('reject')}>✕ إلغاء القبول</button>}
              {!item.verified && <button onClick={() => reject(item.id)}  style={actionBtn('reject')}>✕ رفض</button>}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
