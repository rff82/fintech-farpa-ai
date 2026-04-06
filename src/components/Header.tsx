import { NavLink } from 'react-router-dom'
import { useContrast } from '../hooks/useContrast'
import { useI18n } from '../hooks/useI18n'

export default function Header() {
  const { isHighContrast, toggle } = useContrast()
  const { language, t, toggleLanguage } = useI18n()

  const NAV_LINKS = [
    { to: '/', label: t('nav.home'), end: true },
    { to: '/museum', label: t('nav.museum') },
    { to: '/simulator', label: t('nav.simulator') },
    { to: '/search', label: t('nav.search') },
    { to: '/genes', label: t('nav.genes') },
    { to: '/clinical-trials', label: t('nav.trials') },
    { to: '/analytics', label: t('nav.analytics') },
    { to: '/admin', label: t('nav.admin') },
    { to: '/cloudflare-dashboard', label: t('nav.cloudflare') },
    { to: '/health-data', label: t('nav.healthData') },
  ]

  return (
    <nav className="navbar" role="navigation" aria-label={t('nav.home')}>
      <div className="container">
        <div className="logo">
          <h1>HealthTech CDHR1</h1>
        </div>

        <ul className="nav-links">
          {NAV_LINKS.map(({ to, label, end }) => (
            <li key={to}>
              <NavLink
                to={to}
                end={end}
                className={({ isActive }) => (isActive ? 'active' : undefined)}
              >
                {label}
              </NavLink>
            </li>
          ))}
        </ul>

        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          {/* Botão de Contraste */}
          <button
            className="contrast-toggle"
            onClick={toggle}
            aria-label={t('a11y.highContrast')}
            aria-pressed={isHighContrast}
            style={{
              padding: '0.5rem 1rem',
              border: '1px solid #ddd',
              borderRadius: '4px',
              backgroundColor: 'transparent',
              cursor: 'pointer',
              fontSize: '0.9rem'
            }}
          >
            {isHighContrast ? t('a11y.highContrastOn') : t('a11y.highContrastOff')}
          </button>

          {/* Botão de Idioma */}
          <button
            className="language-toggle"
            onClick={toggleLanguage}
            aria-label={`Switch language to ${language === 'en' ? 'Portuguese' : 'English'}`}
            style={{
              padding: '0.5rem 1rem',
              border: '1px solid #ddd',
              borderRadius: '4px',
              backgroundColor: 'transparent',
              cursor: 'pointer',
              fontSize: '0.9rem',
              fontWeight: 'bold'
            }}
          >
            {language === 'en' ? '🇧🇷 PT-BR' : '🇬🇧 EN'}
          </button>
        </div>
      </div>
    </nav>
  )
}
