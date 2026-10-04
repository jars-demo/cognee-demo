import type { Memory } from '../../hooks/useMemory.ts'
import { Button, Card } from '../Card.tsx'

export function RememberCard({ memory, highlight }: { memory: Memory; highlight: boolean }) {
  const selected = memory.samples.find((s) => s.dataset === memory.sampleName)
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
          <label className="field" htmlFor="sample">Start from a sample dataset</label>
          <div className="row">
            <select
              id="sample"
              className="grow"
              value={memory.sampleName}
              onChange={(e) => memory.setSampleName(e.target.value)}
            >
              {memory.samples.map((s) => (
                <option key={s.dataset} value={s.dataset}>
                  {s.title} · {s.files} documents
                </option>
              ))}
            </select>
            <Button variant="ghost" onClick={() => memory.loadSample()}>Load sample</Button>
          </div>
          {selected && <div className="hint" style={{ marginTop: 6 }}>{selected.description}</div>}
        </div>
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
          <div className="hint" style={{ marginTop: 6 }}>Recall, Graph and Forget all use this dataset.</div>
        </div>
        <div className="row">
          <Button variant="primary" busy={memory.busy === 'remember'} busyLabel="Remembering…" onClick={memory.remember}>
            Remember
          </Button>
        </div>
        {memory.notice.remember && <div className="hint">{memory.notice.remember}</div>}
      </div>
    </Card>
  )
}
