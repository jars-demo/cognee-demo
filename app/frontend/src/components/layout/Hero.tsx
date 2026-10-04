// Compact header for the workshop page.

export function Hero() {
  return (
    <section className="hero">
      <div>
        <h1>Workshop</h1>
        <p>
          Remember some text, see the knowledge graph cognee builds, ask questions, then forget it.
          The guide on the left walks you through it.
        </p>
      </div>
      <div className="flow" aria-label="cognee flow">
        <span className="step">remember</span>→<span className="step">graph</span>→
        <span className="step">recall</span>→<span className="step">forget</span>
      </div>
    </section>
  )
}
