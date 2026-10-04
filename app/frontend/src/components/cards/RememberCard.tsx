import type { Memory } from '../../hooks/useMemory.ts'
import { Button, Card } from '../Card.tsx'

export function RememberCard({ memory, highlight }: { memory: Memory; highlight: boolean }) {
  return (
    <Card
      id="card-remember"
      num="1"
      title="Remember"
      highlight={highlight}
      lede={
        <>
          Store text with <code>cognee.remember()</code>. It chunks the text, extracts entities and
          relationships, and indexes everything for search. Separate documents with a line of <code>---</code>.
        </>
      }
    >
      <div className="stack">
        <div>
          <label className="field" htmlFor="remember-text">Text to remember</label>
          <textarea
            id="remember-text"
            value={memory.text}
            onChange={(e) => memory.setText(e.target.value)}
            placeholder="Paste notes, docs or anything you want cognee to remember…"
          />
        </div>
        <div>
          <label className="field" htmlFor="dataset">Dataset</label>
          <input id="dataset" type="text" value={memory.dataset} onChange={(e) => memory.setDataset(e.target.value)} />
        </div>
        <div className="row">
          <Button variant="primary" busy={memory.busy === 'remember'} busyLabel="Remembering…" onClick={memory.remember}>
            Remember
          </Button>
          <Button variant="ghost" onClick={memory.loadSample}>Load sample data</Button>
        </div>
        {memory.notice.remember && <div className="hint">{memory.notice.remember}</div>}
      </div>
    </Card>
  )
}
