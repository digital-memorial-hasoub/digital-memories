export default function Footer() {
  return (
    <footer
      className="text-center py-8 text-xs border-t"
      style={{ color: 'var(--text-muted)', borderColor: 'var(--border)', background: 'var(--surface)' }}
    >
      <p>
        مشروع التخليد الرقمي —{' '}
        <span style={{ color: 'var(--accent-text)', fontWeight: 600 }}>They Will Not Be Forgotten</span>
      </p>
      <p className="mt-1" style={{ color: 'var(--text-faint)' }}>كل رقم كان إنساناً</p>
    </footer>
  )
}
