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
    <header
      className="fixed top-0 left-0 right-0 z-50 flex items-center px-6 gap-6"
      style={{
        height: 'var(--header-h)',
        background: 'var(--glass-bg)',
        backdropFilter: 'var(--glass-blur)',
        WebkitBackdropFilter: 'var(--glass-blur)',
        borderBottom: '1px solid var(--border)',
        boxShadow: 'var(--shadow-sm)',
      }}
    >
      {/* Logo */}
      <Link to="/" className="flex items-center gap-2.5 flex-shrink-0">
        <img src="/logo.svg" alt="لن يُنسَوا" className="h-9 w-9 object-contain" />
        <div>
          <div className="text-sm font-bold leading-tight" style={{ color: 'var(--ink-800)' }}>لن يُنسَوا</div>
          <div className="text-xs leading-tight" style={{ color: 'var(--text-muted)' }}>They Will Not Be Forgotten</div>
        </div>
      </Link>

      {/* Nav */}
      <nav className="flex gap-1 flex-1">
        {navItems.map(({ to, label }) => {
          const active = location.pathname === to
          return (
            <Link
              key={to}
              to={to}
              className="px-3 py-1.5 rounded-lg text-sm transition-all"
              style={{
                color:      active ? 'var(--accent-text)' : 'var(--text-muted)',
                background: active ? 'var(--accent-soft)' : 'transparent',
                border:     active ? '1px solid var(--accent-line)' : '1px solid transparent',
                fontWeight: active ? 600 : 400,
              }}
            >
              {label}
            </Link>
          )
        })}
      </nav>

      {/* Lang toggle */}
      <div className="flex gap-1">
        {LANGS.map((lang) => {
          const active = i18n.language === lang
          return (
            <button
              key={lang}
              onClick={() => i18n.changeLanguage(lang)}
              className="px-2 py-1 rounded text-xs transition-all uppercase"
              style={{
                background: active ? 'var(--accent-soft)'      : 'var(--surface)',
                border:     active ? '1px solid var(--accent)' : '1px solid var(--border)',
                color:      active ? 'var(--accent-text)'      : 'var(--text-muted)',
                fontWeight: active ? 700 : 400,
              }}
            >
              {lang}
            </button>
          )
        })}
      </div>
    </header>
  )
}
