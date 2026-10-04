// The main page: the hero, then one card per cognee operation.

import { ActivityLog } from '../components/cards/ActivityLog.tsx'
import { ForgetCard } from '../components/cards/ForgetCard.tsx'
import { GraphCard } from '../components/cards/GraphCard.tsx'
import { RecallCard } from '../components/cards/RecallCard.tsx'
import { RememberCard } from '../components/cards/RememberCard.tsx'
import { Hero } from '../components/layout/Hero.tsx'
import type { Memory } from '../hooks/useMemory.ts'

interface Props {
  memory: Memory
  /** The card the current workshop step points at, highlighted in yellow. */
  focusedCard: string | null
  dark: boolean
}

export function HomePage({ memory, focusedCard, dark }: Props) {
  return (
    <main className="main">
      <Hero />
      <div className="grid">
        <RememberCard memory={memory} highlight={focusedCard === 'card-remember'} />
        <RecallCard memory={memory} highlight={focusedCard === 'card-recall'} />
        <GraphCard memory={memory} highlight={focusedCard === 'card-graph'} dark={dark} />
        <ForgetCard memory={memory} highlight={focusedCard === 'card-forget'} />
        <ActivityLog lines={memory.log} />
      </div>
    </main>
  )
}
