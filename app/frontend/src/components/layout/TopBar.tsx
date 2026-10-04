import type { Status } from '../../api/types.ts'
import { ROUTES, type Route } from '../../router.ts'

interface Props {
  route: Route
  status: Status | null
  statusError: boolean
  dark: boolean
  onTheme: () => void
}

export function TopBar({ route, status, statusError, dark, onTheme }: Props) {
  const badgeClass = status ? (status.llm_available === false ? 'warn' : 'ok') : ''
  const badgeText = statusError
    ? 'Backend not reachable'
    : status
      ? `${status.label} · cognee ${status.cognee_version}`
      : 'Checking setup…'
  return (
    <header className="topbar">
      <a className="logo" href="#/"><span className="logo-dot" />cognee demo</a>
      <nav className="nav" aria-label="Pages">
        {ROUTES.map((r) => (
          <a key={r.route} href={r.href} className={route === r.route ? 'active' : ''}>
            {r.label}
          </a>
        ))}
      </nav>
      <div className="spacer" />
      <span className={`badge ${badgeClass}`} title={status?.detail}>{badgeText}</span>
      <button className="btn ghost small" type="button" onClick={onTheme} aria-label="Toggle dark mode">
        {dark ? 'Light' : 'Dark'}
      </button>
    </header>
  )
}
