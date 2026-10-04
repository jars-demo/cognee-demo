// A small, hand-placed example of what cognee builds from one chunk of the Northwind sample.
// Static on purpose: it explains the idea without needing a backend (also on the Vercel site).

type Kind = 'chunk' | 'entity' | 'type'

interface DiagramNode {
  id: string
  label: string
  kind: Kind
  x: number
  y: number
}

const NODES: DiagramNode[] = [
  { id: 'chunk', label: 'Chunk: “Sofia Alvarez leads the Mobile team…”', kind: 'chunk', x: 320, y: 40 },
  { id: 'sofia', label: 'sofia alvarez', kind: 'entity', x: 140, y: 150 },
  { id: 'mobile', label: 'mobile team', kind: 'entity', x: 500, y: 150 },
  { id: 'tom', label: 'tom becker', kind: 'entity', x: 320, y: 250 },
  { id: 'summit', label: 'project summit', kind: 'entity', x: 120, y: 300 },
  { id: 'person', label: 'person', kind: 'type', x: 230, y: 380 },
  { id: 'team', label: 'team', kind: 'type', x: 560, y: 300 },
]

// t: where along the edge its label sits (0 = source, 1 = target); default halfway.
const EDGES: { from: string; to: string; label: string; dashed?: boolean; t?: number }[] = [
  { from: 'chunk', to: 'sofia', label: 'contains', dashed: true },
  { from: 'chunk', to: 'mobile', label: 'contains', dashed: true },
  { from: 'chunk', to: 'tom', label: 'contains', dashed: true, t: 0.28 },
  { from: 'sofia', to: 'mobile', label: 'leads' },
  { from: 'tom', to: 'mobile', label: 'member_of' },
  { from: 'sofia', to: 'summit', label: 'leads' },
  { from: 'sofia', to: 'person', label: 'is_a', dashed: true },
  { from: 'tom', to: 'person', label: 'is_a', dashed: true },
  { from: 'mobile', to: 'team', label: 'is_a', dashed: true },
]

const byId = new Map(NODES.map((node) => [node.id, node]))

export function GraphDiagram() {
  return (
    <figure className="diagram">
      <svg viewBox="0 0 640 420" role="img" aria-labelledby="diagram-title">
        <title id="diagram-title">
          Example knowledge graph: a chunk contains Sofia Alvarez, the Mobile team and Tom Becker.
          Sofia leads the Mobile team and Project Summit; Tom is a member of the Mobile team.
        </title>
        <defs>
          <marker id="arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
            <path d="M0 0 L10 5 L0 10 z" className="diagram-arrow" />
          </marker>
        </defs>
        {EDGES.map((edge) => {
          const a = byId.get(edge.from)!
          const b = byId.get(edge.to)!
          const t = edge.t ?? 0.5
          const mx = a.x + (b.x - a.x) * t
          const my = a.y + (b.y - a.y) * t
          return (
            <g key={`${edge.from}-${edge.to}`}>
              <line
                x1={a.x}
                y1={a.y}
                x2={b.x}
                y2={b.y}
                className={`diagram-edge ${edge.dashed ? 'dashed' : ''}`}
                markerEnd="url(#arrow)"
              />
              <text x={mx} y={my - 6} className="diagram-edge-label" textAnchor="middle">
                {edge.label}
              </text>
            </g>
          )
        })}
        {NODES.map((node) => (
          <g key={node.id} transform={`translate(${node.x} ${node.y})`}>
            {node.kind === 'chunk' ? (
              <rect x={-170} y={-16} width={340} height={32} rx={8} className="diagram-node chunk" />
            ) : (
              <circle r={node.kind === 'type' ? 7 : 10} className={`diagram-node ${node.kind}`} />
            )}
            <text
              y={node.kind === 'chunk' ? 4 : 26}
              textAnchor="middle"
              className={`diagram-label ${node.kind}`}
            >
              {node.label}
            </text>
          </g>
        ))}
      </svg>
      <figcaption>
        <span><i className="dot entity" /> entity</span>
        <span><i className="dot type" /> entity type</span>
        <span><i className="dot chunk" /> chunk</span>
        <span>dashed: structure · solid: relationships the extractor found</span>
      </figcaption>
    </figure>
  )
}
