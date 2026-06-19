import { useEffect, useState, useCallback } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAdminAuth } from '../../contexts/AdminAuthContext'
import { adminApi } from '../../lib/adminApi'

type Status = 'published' | 'draft' | 'archived'

interface Victim {
  id: string; name_ar: string; city: string; age: number
  violence_type: string; date_of_death: string; status: Status
}

const STATUS: Record<Status, { bg: string; color: string; label: string }> = {
  published: { bg: 'var(--status-published-bg)', color: 'var(--status-published)', label: 'منشور'  },
  draft:     { bg: 'var(--status-pending-bg)',   color: 'var(--status-pending)',   label: 'مسودة'  },
  archived:  { bg: 'rgba(138,132,114,.15)',       color: 'var(--status-archived)',  label: 'مؤرشف' },
}
const TYPE_LABEL: Record<string, string> = {
  homicide: 'قتل', domestic: 'عنف أسري', shooting: 'إطلاق نار', other: 'أخرى',
}

const LIMIT = 20

export default function AdminVictimsList() {
  const { token } = useAdminAuth()
  const navigate  = useNavigate()
  const [victims,  setVictims]  = useState<Victim[]>([])
  const [loading,  setLoading]  = useState(true)
  const [search,   setSearch]   = useState('')
  const [status,   setStatus]   = useState<'all' | Status>('all')
  const [page,     setPage]     = useState(1)
  const [total,    setTotal]    = useState(0)

  const load = useCallback(async () => {
    if (!token) return
    setLoading(true)
    try {
      const params: Record<string, string> = { page: String(page), limit: String(LIMIT) }
      if (search)           params.search = search
      if (status !== 'all') params.status = status
      const res = await adminApi.victims.list(token, params) as any
      setVictims(res.data ?? [])
      setTotal(res.total ?? 0)
    } catch (e) { console.error(e) }
    finally { setLoading(false) }
  }, [token, page, search, status])

  useEffect(() => { void load() }, [load])

  const archive = async (id: string) => {
    if (!token || !confirm('تأكيد أرشفة هذا السجل؟')) return
    await adminApi.victims.archive(token, id)
    void load()
  }

  const controlStyle: React.CSSProperties = {
    padding: '.5rem .8rem', background: 'var(--bg)',
    border: '1px solid var(--border)', borderRadius: 'var(--radius-md)',
    color: 'var(--text)', fontFamily: 'var(--font-body)', fontSize: '.85rem', outline: 'none',
  }

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.3rem', fontWeight: 900, color: 'var(--text-strong)' }}>إدارة سجلات الضحايا</h1>
          <p style={{ fontSize: '.8rem', color: 'var(--text-muted)' }}>{total} سجل في قاعدة البيانات</p>
        </div>
        <Link to="/admin/victims/new" style={{ textDecoration: 'none' }}>
          <button style={{
            padding: '.65rem 1.25rem', background: 'var(--accent)', border: 'none',
            borderRadius: 'var(--radius-lg)', color: 'var(--on-accent)',
            fontFamily: 'var(--font-body)', fontWeight: 700, cursor: 'pointer',
            boxShadow: 'var(--shadow-sm)',
          }}>
            + إضافة ضحية
          </button>
        </Link>
      </div>

      {/* Filters */}
      <div style={{
        display: 'flex', gap: '.75rem', marginBottom: '1.25rem', flexWrap: 'wrap',
        background: 'var(--surface)', padding: '1rem',
        borderRadius: 'var(--radius-xl)', border: '1px solid var(--border)', boxShadow: 'var(--shadow-sm)',
      }}>
        <input value={search} onChange={e => { setSearch(e.target.value); setPage(1) }}
          placeholder="بحث بالاسم أو المدينة..."
          style={{ ...controlStyle, flex: 1, minWidth: '200px' }} />
        <select value={status} onChange={e => { setStatus(e.target.value as any); setPage(1) }} style={controlStyle}>
          <option value="all">جميع الحالات</option>
          <option value="published">منشور</option>
          <option value="draft">مسودة</option>
          <option value="archived">مؤرشف</option>
        </select>
      </div>

      {/* Table */}
      <div style={{
        background: 'var(--surface)', border: '1px solid var(--border)',
        borderRadius: 'var(--radius-xl)', overflow: 'hidden', boxShadow: 'var(--shadow-sm)',
      }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '.88rem' }}>
          <thead>
            <tr style={{ background: 'var(--bg)', borderBottom: '1px solid var(--border)' }}>
              {['الاسم','المدينة','العمر','نوع الجريمة','تاريخ الوفاة','الحالة','إجراءات'].map(h => (
                <th key={h} style={{
                  padding: '.75rem 1rem', textAlign: 'right',
                  color: 'var(--text-muted)', fontWeight: 600, whiteSpace: 'nowrap',
                }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr><td colSpan={7} style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                جارٍ التحميل...
              </td></tr>
            )}
            {!loading && victims.length === 0 && (
              <tr><td colSpan={7} style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                لا توجد نتائج
              </td></tr>
            )}
            {victims.map((v, i) => {
              const sc = STATUS[v.status] ?? STATUS.draft
              return (
                <tr key={v.id} style={{
                  borderBottom: '1px solid var(--border)',
                  background:   i % 2 === 0 ? 'transparent' : 'var(--bg-raised)',
                }}>
                  <td style={{ padding: '.7rem 1rem', fontWeight: 600, color: 'var(--text-strong)' }}>{v.name_ar}</td>
                  <td style={{ padding: '.7rem 1rem', color: 'var(--text-muted)' }}>{v.city}</td>
                  <td style={{ padding: '.7rem 1rem', color: 'var(--text-muted)' }}>{v.age}</td>
                  <td style={{ padding: '.7rem 1rem', color: 'var(--text-muted)' }}>{TYPE_LABEL[v.violence_type] ?? v.violence_type}</td>
                  <td style={{ padding: '.7rem 1rem', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>
                    {new Date(v.date_of_death).toLocaleDateString('ar-SA')}
                  </td>
                  <td style={{ padding: '.7rem 1rem' }}>
                    <span style={{
                      padding: '.2rem .65rem', borderRadius: 'var(--radius-pill)',
                      fontSize: '.75rem', fontWeight: 700,
                      background: sc.bg, color: sc.color,
                    }}>
                      {sc.label}
                    </span>
                  </td>
                  <td style={{ padding: '.7rem 1rem', whiteSpace: 'nowrap' }}>
                    <button
                      onClick={() => navigate(`/admin/victims/${v.id}/edit`)}
                      style={{
                        padding: '.3rem .7rem', marginInlineEnd: '.4rem',
                        border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)',
                        background: 'none', color: 'var(--text)',
                        fontFamily: 'var(--font-body)', fontSize: '.78rem', cursor: 'pointer',
                      }}
                    >
                      تعديل
                    </button>
                    <button
                      onClick={() => archive(v.id)}
                      style={{
                        padding: '.3rem .7rem',
                        border: '1px solid rgba(192,57,43,.4)', borderRadius: 'var(--radius-sm)',
                        background: 'none', color: 'var(--status-danger)',
                        fontFamily: 'var(--font-body)', fontSize: '.78rem', cursor: 'pointer',
                      }}
                    >
                      أرشفة
                    </button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {total > LIMIT && (
        <div style={{ display: 'flex', justifyContent: 'center', gap: '.5rem', marginTop: '1.25rem' }}>
          <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
            style={{
              padding: '.4rem .9rem', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)',
              background: 'var(--surface)', color: page === 1 ? 'var(--text-faint)' : 'var(--text)',
              fontFamily: 'var(--font-body)', cursor: page === 1 ? 'not-allowed' : 'pointer',
            }}>
            السابق
          </button>
          <span style={{ padding: '.4rem .8rem', color: 'var(--text-muted)', fontSize: '.85rem' }}>
            صفحة {page} من {Math.ceil(total / LIMIT)}
          </span>
          <button onClick={() => setPage(p => p + 1)} disabled={page >= Math.ceil(total / LIMIT)}
            style={{
              padding: '.4rem .9rem', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)',
              background: 'var(--surface)', color: page >= Math.ceil(total / LIMIT) ? 'var(--text-faint)' : 'var(--text)',
              fontFamily: 'var(--font-body)', cursor: page >= Math.ceil(total / LIMIT) ? 'not-allowed' : 'pointer',
            }}>
            التالي
          </button>
        </div>
      )}
    </div>
  )
}
