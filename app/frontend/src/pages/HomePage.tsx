// The landing page: what cognee is, how it works, the sample datasets, and how to start.

import type { Memory } from '../hooks/useMemory.ts'

const FEATURES = [
  {
    call: 'remember()',
    icon: 'database',
    title: 'Remember',
    text: 'Give cognee text, files or whole folders. It chunks them, finds the people, things and how they relate, and stores it all as a knowledge graph.',
  },
  {
    call: 'recall()',
    icon: 'message-square',
    title: 'Recall',
    text: 'Ask in plain language. cognee searches passages and the graph, and with an LLM writes an answer grounded in what it found.',
  },
  {
    call: 'forget()',
    icon: 'x',
    title: 'Forget',
    text: 'Delete a document or a whole dataset. Its graph, vectors and stored text go with it, so memory stays accurate.',
  },
]

const PIPELINE = ['Your text', 'Chunks', 'Entities & relations', 'Knowledge graph', 'Answers']

export function HomePage({ memory }: { memory: Memory }) {
  return (
    <main className="page">
      <section className="landing-hero">
        <div className="row">
          <span className="pill">Hands-on workshop · 30–60 minutes</span>
          <a className="pill powered" href="https://github.com/topoteretes/cognee" target="_blank" rel="noreferrer">
            <img src="/cognee/cognee-logo.svg" alt="cognee" /> on GitHub
          </a>
        </div>
        <h1>Give your app a memory with cognee</h1>
        <p>
          cognee is an open-source memory engine for AI apps. It turns your data into a knowledge
          graph that agents and apps can search, reason over and keep up to date.
        </p>
        <div className="row">
          <a className="btn" href="#/workshop">Start the workshop</a>
          <a className="btn ghost" href="#/concepts">
            Learn the concepts <img className="icon" src="/cognee/icons/arrow-right.svg" alt="" />
          </a>
        </div>
      </section>

      <section className="section">
        <div className="pipeline" aria-label="How cognee works">
          {PIPELINE.map((stage, index) => (
            <div className="pipeline-stage" key={stage}>
              <span className="pipeline-index">{String(index + 1).padStart(2, '0')}</span>
              {stage}
            </div>
          ))}
        </div>
      </section>

      <section className="section">
        <h2 className="section-title">Three calls, one memory</h2>
        <div className="tiles">
          {FEATURES.map((feature) => (
            <div className="tile" key={feature.title}>
              <span className="tile-icon"><img src={`/cognee/icons/${feature.icon}.svg`} alt="" /></span>
              <code className="tile-call">cognee.{feature.call}</code>
              <h3>{feature.title}</h3>
              <p>{feature.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="section">
        <h2 className="section-title">Sample datasets</h2>
        <p className="section-lede">
          Three small, fictional datasets ship with the workshop, one folder each in{' '}
          <code>data/</code>. Pick any of them in the workshop.
        </p>
        <div className="tiles">
          {memory.samples.map((sample) => (
            <a className="tile link" key={sample.dataset} href="#/workshop" onClick={() => memory.setSampleName(sample.dataset)}>
              <code className="tile-call">{sample.dataset}</code>
              <h3>{sample.title}</h3>
              <p>{sample.description}</p>
              <p className="tile-question">“{sample.questions[0]}”</p>
            </a>
          ))}
        </div>
      </section>

      <section className="section">
        <h2 className="section-title">Run it yourself</h2>
        <div className="tiles">
          <div className="tile">
            <h3>Everything in Docker</h3>
            <pre>{`git clone https://github.com/jars-demo/cognee-demo.git
cd cognee-demo
docker compose up -d --build`}</pre>
            <p>No API key needed. Open http://localhost:3000.</p>
          </div>
          <div className="tile">
            <h3>Guided setup</h3>
            <pre>{'python scripts/setup.py'}</pre>
            <p>Add a free Groq key for LLM answers, use Cognee Cloud, or run without Docker.</p>
          </div>
          <a className="tile link" href="https://github.com/jars-demo/cognee-demo/blob/main/CONTRIBUTING.md" target="_blank" rel="noreferrer">
            <span className="tile-icon"><img src="/cognee/icons/pullrequest.svg" alt="" /></span>
            <h3>Share your use case</h3>
            <p>The workshop ends with your own data in <code>usecases/</code> and a pull request.</p>
          </a>
        </div>
      </section>
    </main>
  )
}
