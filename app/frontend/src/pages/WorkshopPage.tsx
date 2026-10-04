// The workshop: the step-by-step guide next to the live playground (one card per cognee call).

import { ActivityLog } from '../components/cards/ActivityLog.tsx'
import { ForgetCard } from '../components/cards/ForgetCard.tsx'
import { GraphCard } from '../components/cards/GraphCard.tsx'
import { RecallCard } from '../components/cards/RecallCard.tsx'
import { RememberCard } from '../components/cards/RememberCard.tsx'
import { Hero } from '../components/layout/Hero.tsx'
import type { Memory, StepId } from '../hooks/useMemory.ts'
import { STEPS } from '../workshop/steps.tsx'
import { WorkshopPanel } from '../workshop/WorkshopPanel.tsx'

interface Props {
  memory: Memory
  dark: boolean
  guideOpen: boolean
  onGuide: (open: boolean) => void
  current: number
  done: StepId[]
  onSelect: (index: number) => void
  onComplete: (id: StepId) => void
  onReset: () => void
}

export function WorkshopPage({ memory, dark, guideOpen, onGuide, current, done, onSelect, onComplete, onReset }: Props) {
  const focused = guideOpen ? STEPS[current].card : null
  return (
    <div className="layout">
      {guideOpen && (
        <WorkshopPanel memory={memory} current={current} done={done} onSelect={onSelect} onComplete={onComplete} />
      )}
      <main className="main">
        <ProgressBanner
          current={current}
          done={done}
          guideOpen={guideOpen}
          onGuide={onGuide}
          onSelect={onSelect}
          onReset={onReset}
        />
        <Hero />
        <div className="grid">
          <RememberCard memory={memory} highlight={focused === 'card-remember'} />
          <RecallCard memory={memory} highlight={focused === 'card-recall'} />
          <GraphCard memory={memory} highlight={focused === 'card-graph'} dark={dark} />
          <ForgetCard memory={memory} highlight={focused === 'card-forget'} />
          <ActivityLog lines={memory.log} />
        </div>
      </main>
    </div>
  )
}

interface BannerProps {
  current: number
  done: StepId[]
  guideOpen: boolean
  onGuide: (open: boolean) => void
  onSelect: (index: number) => void
  onReset: () => void
}

function ProgressBanner({ current, done, guideOpen, onGuide, onSelect, onReset }: BannerProps) {
  const finished = done.length === STEPS.length
  const percent = Math.round((done.length / STEPS.length) * 100)
  return (
    <div className={`banner ${finished ? 'finished' : ''}`}>
      <div className="banner-text">
        {finished ? (
          <>
            <strong>Workshop complete 🎉</strong>
            <span>Now build your own use case and open a pull request.</span>
          </>
        ) : (
          <>
            <span className="banner-step">
              Step {current + 1} of {STEPS.length}
            </span>
            <strong>{STEPS[current].title}</strong>
          </>
        )}
      </div>
      <div className="banner-bar" role="progressbar" aria-valuenow={percent} aria-valuemin={0} aria-valuemax={100}>
        <div style={{ width: `${percent}%` }} />
      </div>
      <div className="row">
        {finished ? (
          <button type="button" className="btn ghost small" onClick={onReset}>Start over</button>
        ) : (
          current < STEPS.length - 1 && (
            <button type="button" className="btn ghost small" onClick={() => onSelect(current + 1)}>
              Next step →
            </button>
          )
        )}
        <button type="button" className="btn ghost small" onClick={() => onGuide(!guideOpen)}>
          {guideOpen ? 'Hide guide' : 'Show guide'}
        </button>
      </div>
    </div>
  )
}
