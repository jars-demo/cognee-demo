export function Hero() {
  return (
    <section className="hero">
      <span className="eyebrow">Hands-on with cognee</span>
      <h1>Give your app a <span className="marker">memory</span>.</h1>
      <p>
        Paste in some text. cognee turns it into a knowledge graph of people, things and how they
        connect. Then ask it questions and see where every answer came from.
      </p>
      <div className="flow" aria-label="cognee flow">
        <span className="step">remember()</span><span className="arrow">→</span>
        <span className="step">knowledge graph</span><span className="arrow">→</span>
        <span className="step">recall()</span><span className="arrow">→</span>
        <span className="step">forget()</span>
      </div>
    </section>
  )
}
