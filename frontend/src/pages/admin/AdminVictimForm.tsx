import { useState, useEffect, type ChangeEvent } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAdminAuth } from '../../contexts/AdminAuthContext'
import { adminApi } from '../../lib/adminApi'

type ViolenceType = 'homicide' | 'domestic' | 'shooting' | 'other'
type VictimStatus = 'draft' | 'published' | 'archived'

interface FormData {
  name_ar: string; name_he: string; name_en: string
  age: string; profession: string
  city: string; lat: string; lng: string
  date_of_birth: string; date_of_death: string
  violence_type: ViolenceType
  bio_ar: string; bio_he: string; bio_en: string
  photo_url: string; video_url: string
  status: VictimStatus
}

const EMPTY: FormData = {
  name_ar:'', name_he:'', name_en:'', age:'', profession:'',
  city:'', lat:'', lng:'', date_of_birth:'', date_of_death:'',
  violence_type:'shooting', bio_ar:'', bio_he:'', bio_en:'',
  photo_url:'', video_url:'', status:'draft',
}

const ARAB_CITIES = ['أم الفحم','باقة الغربية','الناصرة','شفاعمرو','رهط','طمرة','كفر قاسم','عكا','الطيبة','كفر كنا','تل شيفع','المغار','جلجولية','بني براك','رام الله','اللد','الرملة','يافا']
const CITY_COORDS: Record<string, [number, number]> = {
  'أم الفحم':[32.517,35.152],'باقة الغربية':[32.419,35.038],'الناصرة':[32.702,35.298],
  'شفاعمرو':[32.806,35.171],'رهط':[31.393,34.752],'طمرة':[32.856,35.196],
  'كفر قاسم':[32.113,34.977],'عكا':[32.928,35.082],'الطيبة':[32.270,35.001],
  'كفر كنا':[32.748,35.340],'تل شيفع':[31.370,34.841],'المغار':[32.899,35.398],
  'جلجولية':[32.152,34.960],
}

export default function AdminVictimForm() {
  const { id }    = useParams<{ id?: string }>()
  const navigate  = useNavigate()
  const { token } = useAdminAuth()
  const isEdit    = Boolean(id)

  const [form,     setForm]     = useState<FormData>(EMPTY)
  const [saving,   setSaving]   = useState(false)
  const [error,    setError]    = useState('')
  const [success,  setSuccess]  = useState('')
  const [uploading,setUploading]= useState(false)
  const [tab, setTab]           = useState<'ar' | 'he' | 'en'>('ar')

  useEffect(() => {
    if (!isEdit || !token) return
    adminApi.victims.get(token, id!).then(v => {
      const vic = v as any
      setForm({
        name_ar: vic.name_ar ?? '', name_he: vic.name_he ?? '', name_en: vic.name_en ?? '',
        age: String(vic.age ?? ''), profession: vic.profession ?? '',
        city: vic.city ?? '', lat: String(vic.lat ?? ''), lng: String(vic.lng ?? ''),
        date_of_birth: vic.date_of_birth ? vic.date_of_birth.split('T')[0] : '',
        date_of_death: vic.date_of_death ? vic.date_of_death.split('T')[0] : '',
        violence_type: vic.violence_type ?? 'shooting',
        bio_ar: vic.bio_ar ?? '', bio_he: vic.bio_he ?? '', bio_en: vic.bio_en ?? '',
        photo_url: vic.photo_url ?? '', video_url: vic.video_url ?? '',
        status: vic.status ?? 'draft',
      })
    }).catch(console.error)
  }, [isEdit, id, token])

  const set = (k: keyof FormData) => (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const val = e.target.value
    const patch: Partial<FormData> = { [k]: val }
    if (k === 'city' && CITY_COORDS[val]) {
      patch.lat = String(CITY_COORDS[val][0])
      patch.lng = String(CITY_COORDS[val][1])
    }
    setForm(prev => ({ ...prev, ...patch }))
  }

  const handlePhotoUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !token) return
    setUploading(true)
    try {
      const { url } = await adminApi.upload(token, file)
      setForm(prev => ({ ...prev, photo_url: url }))
    } catch { setError('فشل رفع الصورة') }
    finally { setUploading(false) }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!token) return
    setError(''); setSaving(true)
    try {
      const payload = {
        ...form,
        age: parseInt(form.age),
        lat: parseFloat(form.lat),
        lng: parseFloat(form.lng),
        date_of_birth: form.date_of_birth || undefined,
        date_of_death: form.date_of_death,
      }
      if (isEdit) await adminApi.victims.update(token, id!, payload)
      else        await adminApi.victims.create(token, payload)
      setSuccess(isEdit ? 'تم تحديث السجل بنجاح ✅' : 'تم إضافة الضحية بنجاح ✅')
      setTimeout(() => navigate('/admin/victims'), 1200)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'حدث خطأ')
    } finally { setSaving(false) }
  }

  const inp = {
    width: '100%', padding: '.65rem .9rem',
    background: 'var(--bg)', border: '1px solid var(--border)',
    borderRadius: '8px', color: 'var(--text)',
    fontFamily: 'Cairo, sans-serif', fontSize: '.88rem', outline: 'none',
    boxSizing: 'border-box' as const,
  }
  const Field = ({ label, children }: { label: string; children: React.ReactNode }) => (
    <div style={{ marginBottom: '1rem' }}>
      <label style={{ display: 'block', fontSize: '.78rem', color: 'var(--muted)', marginBottom: '.35rem' }}>{label}</label>
      {children}
    </div>
  )
  const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '14px', padding: '1.5rem', marginBottom: '1.25rem' }}>
      <h2 style={{ fontSize: '.95rem', fontWeight: 700, color: 'var(--gold)', marginBottom: '1.25rem', paddingBottom: '.5rem', borderBottom: '1px solid var(--border)' }}>{title}</h2>
      {children}
    </div>
  )
  const grid2 = { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }

  return (
    <div style={{ maxWidth: '780px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
        <button onClick={() => navigate('/admin/victims')} style={{ background: 'none', border: '1px solid var(--border)', borderRadius: '8px', padding: '.4rem .8rem', color: 'var(--muted)', fontFamily: 'Cairo, sans-serif', cursor: 'pointer' }}>← رجوع</button>
        <h1 style={{ fontSize: '1.3rem', fontWeight: 900 }}>{isEdit ? 'تعديل بيانات الضحية' : 'إضافة ضحية جديدة'}</h1>
      </div>

      {error   && <div style={{ background: 'rgba(231,76,60,.15)', border: '1px solid rgba(231,76,60,.4)', borderRadius: '8px', padding: '.75rem 1rem', marginBottom: '1rem', color: '#e74c3c' }}>⚠️ {error}</div>}
      {success && <div style={{ background: 'rgba(39,174,96,.15)',  border: '1px solid rgba(39,174,96,.4)',  borderRadius: '8px', padding: '.75rem 1rem', marginBottom: '1rem', color: '#27ae60' }}>✅ {success}</div>}

      <form onSubmit={handleSubmit}>

        {/* Basic Info */}
        <Section title="🪪 المعلومات الأساسية">
          <Field label="الاسم بالعربية *">
            <input value={form.name_ar} onChange={set('name_ar')} required placeholder="مثال: محمد أحمد العلي" style={inp} />
          </Field>
          <div style={grid2}>
            <Field label="العمر *"><input type="number" value={form.age} onChange={set('age')} required min="1" max="120" style={inp} /></Field>
            <Field label="المهنة / الصفة"><input value={form.profession} onChange={set('profession')} placeholder="طالب، معلمة، عامل..." style={inp} /></Field>
          </div>
        </Section>

        {/* Location & Dates */}
        <Section title="📍 الموقع والتواريخ">
          <Field label="المدينة / البلدة *">
            <select value={form.city} onChange={set('city')} required style={inp}>
              <option value="">اختر المدينة</option>
              {ARAB_CITIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </Field>
          <div style={grid2}>
            <Field label="خط العرض (lat)"><input type="number" value={form.lat} onChange={set('lat')} step="0.0001" placeholder="32.517" style={inp} /></Field>
            <Field label="خط الطول (lng)"><input type="number" value={form.lng} onChange={set('lng')} step="0.0001" placeholder="35.152" style={inp} /></Field>
          </div>
          <div style={grid2}>
            <Field label="تاريخ الميلاد"><input type="date" value={form.date_of_birth} onChange={set('date_of_birth')} style={inp} /></Field>
            <Field label="تاريخ الوفاة *"><input type="date" value={form.date_of_death} onChange={set('date_of_death')} required style={inp} /></Field>
          </div>
        </Section>

        {/* Violence type + Status */}
        <Section title="⚖️ نوع الجريمة والحالة">
          <div style={grid2}>
            <Field label="نوع الجريمة *">
              <select value={form.violence_type} onChange={set('violence_type')} style={inp}>
                <option value="homicide">جريمة قتل</option>
                <option value="domestic">عنف أسري</option>
                <option value="shooting">إطلاق نار</option>
                <option value="other">أخرى</option>
              </select>
            </Field>
            <Field label="حالة النشر">
              <select value={form.status} onChange={set('status')} style={inp}>
                <option value="draft">مسودة (غير منشور)</option>
                <option value="published">منشور على الموقع</option>
                <option value="archived">مؤرشف</option>
              </select>
            </Field>
          </div>
        </Section>

        {/* Biography — tabbed */}
        <Section title="📝 السيرة الشخصية">
          <div style={{ display: 'flex', gap: '.4rem', marginBottom: '1rem' }}>
            {(['ar','he','en'] as const).map(lang => (
              <button type="button" key={lang} onClick={() => setTab(lang)} style={{
                padding: '.35rem .9rem', borderRadius: '8px', border: '1px solid',
                borderColor: tab === lang ? 'var(--gold)' : 'var(--border)',
                background:  tab === lang ? 'rgba(201,168,76,.12)' : 'none',
                color:       tab === lang ? 'var(--gold)' : 'var(--muted)',
                fontFamily: 'Cairo, sans-serif', cursor: 'pointer',
              }}>
                {lang === 'ar' ? 'عربي' : lang === 'he' ? 'עברית' : 'English'}
              </button>
            ))}
          </div>
          {tab === 'ar' && <textarea value={form.bio_ar} onChange={set('bio_ar')} rows={6} placeholder="السيرة الشخصية بالعربية..." style={{ ...inp, resize: 'vertical' as const }} />}
          {tab === 'he' && <textarea value={form.bio_he} onChange={set('bio_he')} rows={6} dir="rtl" placeholder="ביוגרפיה בעברית..." style={{ ...inp, resize: 'vertical' as const }} />}
          {tab === 'en' && <textarea value={form.bio_en} onChange={set('bio_en')} rows={6} dir="ltr" placeholder="Biography in English..." style={{ ...inp, resize: 'vertical' as const }} />}
        </Section>

        {/* Media */}
        <Section title="🖼️ الصورة والفيديو">
          <Field label="رفع صورة (JPG / PNG / WebP)">
            <div style={{ display: 'flex', gap: '.75rem', alignItems: 'center' }}>
              <input type="file" accept="image/*" onChange={handlePhotoUpload} style={{ flex: 1, ...inp }} />
              {uploading && <span style={{ color: 'var(--gold)', fontSize: '.8rem' }}>جارٍ الرفع...</span>}
            </div>
            {form.photo_url && (
              <div style={{ marginTop: '.5rem', display: 'flex', alignItems: 'center', gap: '.5rem' }}>
                <img src={form.photo_url} alt="preview" style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '8px', border: '1px solid var(--border)' }} />
                <span style={{ fontSize: '.75rem', color: 'var(--muted)', wordBreak: 'break-all' }}>{form.photo_url}</span>
              </div>
            )}
          </Field>
          <Field label="رابط الفيديو (اختياري)">
            <input value={form.video_url} onChange={set('video_url')} placeholder="https://..." style={inp} />
          </Field>
        </Section>

        {/* Name in other languages */}
        <Section title="🌐 الاسم بلغات أخرى (اختياري)">
          <div style={grid2}>
            <Field label="الاسم بالعبرية"><input value={form.name_he} onChange={set('name_he')} dir="rtl" placeholder="שם בעברית" style={inp} /></Field>
            <Field label="الاسم بالإنجليزية"><input value={form.name_en} onChange={set('name_en')} dir="ltr" placeholder="Name in English" style={inp} /></Field>
          </div>
        </Section>

        {/* Submit */}
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
          <button type="button" onClick={() => navigate('/admin/victims')} style={{ padding: '.75rem 1.5rem', border: '1px solid var(--border)', borderRadius: '10px', background: 'none', color: 'var(--muted)', fontFamily: 'Cairo, sans-serif', cursor: 'pointer' }}>
            إلغاء
          </button>
          <button type="submit" disabled={saving} style={{ padding: '.75rem 1.75rem', border: 'none', borderRadius: '10px', background: saving ? 'rgba(201,168,76,.5)' : 'var(--gold)', color: '#0d1117', fontFamily: 'Cairo, sans-serif', fontWeight: 700, cursor: saving ? 'not-allowed' : 'pointer', fontSize: '1rem' }}>
            {saving ? 'جارٍ الحفظ...' : isEdit ? 'حفظ التعديلات' : 'إضافة الضحية'}
          </button>
        </div>
      </form>
    </div>
  )
}
