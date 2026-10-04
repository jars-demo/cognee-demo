import type { Memory } from '../../hooks/useMemory.ts'
import { Button, Card } from '../Card.tsx'

export function ForgetCard({ memory, highlight }: { memory: Memory; highlight: boolean }) {
  return (
    <Card
      id="card-forget"
      num="4"
      title="Forget"
      highlight={highlight}
      lede={<>Remove a dataset with <code>cognee.forget()</code>: its graph, vectors and stored text are deleted.</>}
    >
      <div className="row">
        <Button variant="danger" busy={memory.busy === 'forget'} busyLabel="Forgetting…" onClick={memory.forget}>
          Forget this dataset
        </Button>
      </div>
      {memory.notice.forget && <div className="hint" style={{ marginTop: 12 }}>{memory.notice.forget}</div>}
    </Card>
  )
}
