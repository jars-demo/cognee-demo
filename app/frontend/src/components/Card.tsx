import type { ReactNode } from 'react'

interface Props {
  id: string
  num: string
  title: string
  lede: ReactNode
  wide?: boolean
  highlight?: boolean
  children: ReactNode
}

export function Card({ id, num, title, lede, wide, highlight, children }: Props) {
  const classes = ['card', wide ? 'wide' : '', highlight ? 'highlight' : ''].join(' ')
  return (
    <section className={classes} id={id}>
      <div className="card-head">
        <span className="num">{/^\d+$/.test(num) ? num.padStart(2, "0") : num}</span>
        <h2>{title}</h2>
      </div>
      <p className="lede">{lede}</p>
      {children}
    </section>
  )
}

export function Button({
  busy, busyLabel, children, variant = '', ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { busy?: boolean; busyLabel?: string; variant?: string }) {
  return (
    <button type="button" className={`btn ${variant}`} disabled={busy || props.disabled} {...props}>
      {busy ? (
        <>
          <span className="spinner" />
          {busyLabel}
        </>
      ) : (
        children
      )}
    </button>
  )
}
