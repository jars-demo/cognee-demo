import type { Status } from '../../api/types.ts'

interface Props {
  status: Status | null
  statusError: boolean
  workshopOn: boolean
  onWorkshop: (on: boolean) => void
  dark: boolean
  onTheme: () => void
}

export function TopBar({ status, statusError, workshopOn, onWorkshop, dark, onTheme }: Props) {
  const badgeClass = status ? (status.llm_available === false ? 'warn' : 'ok') : ''
  const badgeText = statusError
    ? 'Backend not reachable'
    : status
      ? `${status.label} · cognee ${status.cognee_version}`
      : 'Checking setup…'
  return (
    <header className="topbar">
      <a className="logo" href="/"><span className="logo-dot" />cognee demo</a>
      <span className={`badge ${badgeClass}`} title={status?.detail}>{badgeText}</span>
      <div className="spacer" />
      <label className="toggle" title="Show the step-by-step workshop guide">
        <input type="checkbox" checked={workshopOn} onChange={(e) => onWorkshop(e.target.checked)} />
        <span className="track" />
        Workshop mode
      </label>
      <button className="btn ghost small" type="button" onClick={onTheme}>{dark ? 'Light' : 'Dark'}</button>
    </header>
  )
}
