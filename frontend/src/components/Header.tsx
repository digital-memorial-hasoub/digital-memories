import { Link, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import i18n from 'i18next'

const LANGS = ['ar', 'he', 'en'] as const

export default function Header() {
  const { t }    = useTranslation()
  const location = useLocation()

  const navItems = [
    { to: '/',        label: t('nav.home') },
    { to: '/victims', label: t('nav.victims') },
    { to: '/map',     label: t('nav.map') },
  ]

  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-16 flex items-center px-6 gap-6"
      style={{ background: 'rgba(13,17,23,.92)', backdropFilter: 'blur(12px)', borderBottom: '1px solid var(--border)' }}>

      <Link to="/" className="flex items-center gap-2 flex-shrink-0">
        <span className="text-2xl">📖</span>
        <div>
          <div className="text-sm font-bold" style={{ color: 'var(--gold)' }}>لن يُنسَوا</div>
          <div className="text-xs" style={{ color: 'var(--muted)' }}>They Will Not Be Forgotten</div>
        </div>
      </Link>

      <nav className="flex gap-1 flex-1">
        {navItems.map(({ to, label }) => (
          <Link key={to} to={to}
            className="px-3 py-1.5 rounded-lg text-sm transition-all"
            style={{
              color:      location.pathname === to ? 'var(--gold)' : 'var(--muted)',
              background: location.pathname === to ? 'rgba(201,168,76,.1)' : 'transparent',
              border:     location.pathname === to ? '1px solid rgba(201,168,76,.25)' : '1px solid transparent',
            }}>
            {label}
          </Link>
        ))}
      </nav>

      <div className="flex gap-1">
        {LANGS.map((lang) => (
          <button key={lang}
            onClick={() => i18n.changeLanguage(lang)}
            className="px-2 py-1 rounded text-xs transition-all uppercase"
            style={{
              background:   i18n.language === lang ? 'rgba(201,168,76,.15)' : 'var(--surface)',
              border:       `1px solid ${i18n.language === lang ? 'var(--gold)' : 'var(--border)'}`,
              color:        i18n.language === lang ? 'var(--gold)' : 'var(--muted)',
            }}>
            {lang}
          </button>
        ))}
      </div>
    </header>
  )
}
