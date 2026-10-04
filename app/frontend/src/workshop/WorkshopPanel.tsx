import type { Memory, StepId } from '../hooks/useMemory.ts'
import { STEPS } from './steps.tsx'

interface Props {
  memory: Memory
  current: number
  done: StepId[]
  onSelect: (index: number) => void
  onComplete: (id: StepId) => void
}

export function WorkshopPanel({ memory, current, done, onSelect, onComplete }: Props) {
  const step = STEPS[current]
  const isLast = current === STEPS.length - 1

  const runAction = async () => {
    if (step.card) document.getElementById(step.card)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    const result = await step.action.run(memory)
    if (result === true) onComplete(step.id)
  }

  return (
    <aside className="workshop" aria-label="Workshop guide">
      <h3>Workshop</h3>
      <div className="hint">Seven steps, about 30–60 minutes.</div>
      <div className="progress">
        <div style={{ width: `${(done.length / STEPS.length) * 100}%` }} />
      </div>
      <ol className="steps">
        {STEPS.map((s, index) => (
          <li key={s.id} className={`${index === current ? 'active' : ''} ${done.includes(s.id) ? 'done' : ''}`}>
            <button type="button" onClick={() => onSelect(index)}>
              <span className="check">{done.includes(s.id) ? '✓' : index + 1}</span>
              <span>
                {s.title}
                <br />
                <span className="hint">{s.minutes} min</span>
              </span>
            </button>
          </li>
        ))}
      </ol>
      <div className="step-body">
        {step.body}
        <div className="row" style={{ marginTop: 14 }}>
          <button className="btn primary small" type="button" onClick={runAction}>{step.action.label}</button>
          {!isLast && (
            <button className="btn ghost small" type="button" onClick={() => onSelect(current + 1)}>Next step →</button>
          )}
        </div>
      </div>
    </aside>
  )
}
