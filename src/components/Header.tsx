import { NavLink } from 'react-router-dom'
import { useContrast } from '../hooks/useContrast'

const NAV_LINKS = [
  { to: '/', label: 'Início', end: true },
  { to: '/museum', label: 'Museu' },
  { to: '/simulator', label: 'Simulador' },
  { to: '/search', label: 'Busca' },
  { to: '/genes', label: 'Genes' },
  { to: '/clinical-trials', label: 'Ensaios' },
  { to: '/analytics', label: 'Analytics' },
  { to: '/admin', label: 'Admin' },
]

export default function Header() {
  const { isHighContrast, toggle } = useContrast()

  return (
    <nav className="navbar" role="navigation" aria-label="Navegação principal">
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

        <button
          className="contrast-toggle"
          onClick={toggle}
          aria-label="Alternar alto contraste (Alt+C)"
          aria-pressed={isHighContrast}
        >
          {isHighContrast ? '🌞 Normal' : '🌓 Alto Contraste'}
        </button>
      </div>
    </nav>
  )
}
