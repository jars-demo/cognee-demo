import { REPO_URL } from '../../site.ts'

interface FooterLink {
  label: string
  href: string
}

const COLUMNS: { title: string; links: FooterLink[] }[] = [
  {
    title: 'Workshop',
    links: [
      { label: 'Home', href: '#/' },
      { label: 'Concepts', href: '#/concepts' },
      { label: 'Workshop', href: '#/workshop' },
      { label: 'Source on GitHub', href: REPO_URL },
      { label: 'Contributing', href: `${REPO_URL}/blob/main/CONTRIBUTING.md` },
      { label: 'Use cases', href: `${REPO_URL}/tree/main/usecases` },
    ],
  },
  {
    title: 'cognee',
    links: [
      { label: 'GitHub', href: 'https://github.com/topoteretes/cognee' },
      { label: 'Documentation', href: 'https://docs.cognee.ai/' },
      { label: 'Cognee Cloud', href: 'https://docs.cognee.ai/cognee-cloud/overview' },
      { label: 'Discord', href: 'https://discord.gg/NQPKmU5CCg' },
    ],
  },
  {
    title: 'References',
    links: [
      { label: 'remember()', href: 'https://docs.cognee.ai/core-concepts/main-operations/remember' },
      { label: 'recall()', href: 'https://docs.cognee.ai/core-concepts/main-operations/recall' },
      { label: 'forget()', href: 'https://docs.cognee.ai/core-concepts/main-operations/forget' },
      { label: 'Free Groq key', href: 'https://console.groq.com/keys' },
      { label: 'Docker Desktop', href: 'https://docs.docker.com/get-docker/' },
    ],
  },
]

const isExternal = (href: string) => href.startsWith('http')

export function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-brand">
          <a className="logo" href="#/" aria-label="cognee demo: home">
            <img className="logo-mark" src="/cognee/cognee-logo.svg" alt="cognee" />
            <span className="logo-tag">demo</span>
          </a>
          <p>
            A hands-on workshop for cognee, the open-source memory engine for AI apps: remember,
            recall and forget, end to end.
          </p>
          <div className="row">
            <a className="btn ghost small" href={REPO_URL} target="_blank" rel="noreferrer">
              View on GitHub
            </a>
            <a className="btn ghost small" href={`${REPO_URL}/blob/main/CONTRIBUTING.md`} target="_blank" rel="noreferrer">
              Contribute
            </a>
          </div>
        </div>

        {COLUMNS.map((column) => (
          <nav className="footer-column" key={column.title} aria-label={column.title}>
            <h4>{column.title}</h4>
            <ul>
              {column.links.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    {...(isExternal(link.href) ? { target: '_blank', rel: 'noreferrer' } : {})}
                  >
                    {link.label}
                    {isExternal(link.href) && <span className="footer-external" aria-hidden="true">↗</span>}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>

      <div className="footer-bottom">
        <span>
          Built with 💖 by{' '}
          <a href="https://jishanahmed.in" target="_blank" rel="noreferrer">
            Mr. JARS
          </a>
        </span>
        <span>
          Community workshop, not affiliated with cognee ·{' '}
          <a href={`${REPO_URL}/blob/main/NOTICE.md`} target="_blank" rel="noreferrer">
            Notice
          </a>
        </span>
      </div>
    </footer>
  )
}
