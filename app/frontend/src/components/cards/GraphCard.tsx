import cytoscape from 'cytoscape'
import { useEffect, useMemo, useRef, useState } from 'react'
import type { GraphNode } from '../../api/types.ts'
import type { Memory } from '../../hooks/useMemory.ts'
import { Button, Card } from '../Card.tsx'

// Muted, distinguishable tones; indigo (the accent) first.
const COLORS = ['#6366f1', '#0ea5e9', '#10b981', '#f59e0b', '#f43f5e', '#8b5cf6', '#64748b', '#14b8a6']

interface Selected {
  node: GraphNode
  links: string[]
}

export function GraphCard({ memory, highlight, dark }: { memory: Memory; highlight: boolean; dark: boolean }) {
  const container = useRef<HTMLDivElement>(null)
  const [selected, setSelected] = useState<Selected | null>(null)
  const graph = memory.graph
  const types = useMemo(() => [...new Set(graph?.nodes.map((n) => n.type) ?? [])].sort(), [graph])
  const color = (type: string) => COLORS[types.indexOf(type) % COLORS.length]
  const ink = dark ? '#fafafa' : '#18181b'

  useEffect(() => {
    setSelected(null)
    if (!container.current || !graph?.nodes.length) return
    const byId = new Map(graph.nodes.map((n) => [n.id, n]))
    const cy = cytoscape({
      container: container.current,
      elements: [
        ...graph.nodes.map((n) => ({ data: { ...n, color: color(n.type) } })),
        ...graph.edges.map((e, i) => ({ data: { id: `e${i}`, ...e } })),
      ],
      style: [
        {
          selector: 'node',
          style: {
            'background-color': 'data(color)', 'border-width': 1.5, 'border-color': dark ? '#09090b' : '#ffffff',
            label: 'data(label)', color: ink, 'font-size': 10, 'font-family': 'Geist, sans-serif',
            'text-valign': 'bottom', 'text-margin-y': 4, width: 18, height: 18,
          },
        },
        {
          selector: 'edge',
          style: {
            width: 1, 'line-color': `${ink}55`, 'target-arrow-color': `${ink}55`,
            'target-arrow-shape': 'triangle', 'arrow-scale': 0.7, 'curve-style': 'bezier',
            label: 'data(label)', 'font-size': 8, color: `${ink}aa`, 'text-rotation': 'autorotate',
          },
        },
        { selector: 'node:selected', style: { 'border-width': 4, 'border-color': '#4f46e5' } },
      ],
      layout: { name: 'cose', animate: false, nodeRepulsion: () => 9000, idealEdgeLength: () => 90 },
      wheelSensitivity: 0.2,
    })
    cy.on('tap', 'node', (event) => {
      const id = event.target.id() as string
      const links = graph.edges
        .filter((e) => e.source === id || e.target === id)
        .slice(0, 12)
        .map((e) =>
          e.source === id
            ? `→ ${e.label || 'related to'} ${byId.get(e.target)?.label}`
            : `← ${e.label || 'related to'} ${byId.get(e.source)?.label}`,
        )
      setSelected({ node: byId.get(id)!, links })
    })
    return () => cy.destroy()
    // color depends on types, which depends on graph
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [graph, ink])

  return (
    <Card
      id="card-graph"
      num="3"
      title="Explore the graph"
      wide
      highlight={highlight}
      lede="This is what cognee built: nodes are entities, chunks and documents; edges are the relationships it found. Drag nodes, click one for details."
    >
      <div className="row">
        <Button busy={memory.busy === 'graph'} busyLabel="Loading…" onClick={memory.loadGraph}>Load graph</Button>
        <span className="hint">{memory.notice.graph}</span>
      </div>
      <div id="graph" ref={container}>
        {graph && !graph.nodes.length && (
          <div className="empty" style={{ margin: 16 }}>The graph for “{memory.dataset}” is empty. Remember something first.</div>
        )}
      </div>
      <div className="legend">
        {types.map((t) => (
          <span className="item" key={t}>
            <span className="swatch" style={{ background: color(t), border: `1px solid ${ink}` }} />
            {t}
          </span>
        ))}
      </div>
      {selected && (
        <div className="results">
          <div className="result">
            <div className="meta"><span className="tag">{selected.node.type}</span></div>
            <strong>{selected.node.label}</strong>
            {selected.node.description && `\n${selected.node.description}`}
            {selected.links.length > 0 && `\n\n${selected.links.join('\n')}`}
          </div>
        </div>
      )}
    </Card>
  )
}
