// The Workshop page on the static (Vercel) site: the live playground needs cognee running, so
// this shows the steps and how to start the workshop on your own machine.

import { REPO_URL } from '../site.ts'
import { STEPS } from '../workshop/steps.tsx'

export function RunLocallyPage() {
  return (
    <main className="page">
      <section className="page-header">
        <span className="pill">Workshop</span>
        <h1>Run the workshop on your machine</h1>
        <p>
          The workshop runs cognee next to the app, so it needs Docker on your computer. No account
          and no API key: everything stays local.
        </p>
      </section>

      <div className="tiles two">
        <div className="tile">
          <span className="tile-call">1 · Start it</span>
          <h3>One command with Docker</h3>
          <pre>{`git clone ${REPO_URL}.git
cd cognee-demo
docker compose up -d --build`}</pre>
          <p>Then open http://localhost:3000/#/workshop.</p>
        </div>
        <div className="tile">
          <span className="tile-call">2 · Follow the steps</span>
          <h3>Seven steps, about 30–60 minutes</h3>
          <ol className="step-list">
            {STEPS.map((step) => (
              <li key={step.id}>
                {step.title} <span className="hint">· {step.minutes} min</span>
              </li>
            ))}
          </ol>
        </div>
      </div>

      <section className="section">
        <div className="concept cta">
          <h2>Prefer to read first?</h2>
          <p>The concepts page explains everything the workshop uses, with examples.</p>
          <div className="row">
            <a className="btn" href="#/concepts">Read the concepts</a>
            <a className="btn ghost" href={REPO_URL} target="_blank" rel="noreferrer">View on GitHub</a>
          </div>
        </div>
      </section>
    </main>
  )
}
