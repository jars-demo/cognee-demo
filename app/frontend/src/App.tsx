// The app shell: top bar, the optional workshop panel, and the page.

import { useCallback, useEffect } from 'react'
import { Footer } from './components/layout/Footer.tsx'
import { TopBar } from './components/layout/TopBar.tsx'
import { type StepId, useMemory } from './hooks/useMemory.ts'
import { useStoredState } from './hooks/useStoredState.ts'
import { HomePage } from './pages/HomePage.tsx'
import { STEPS } from './workshop/steps.tsx'
import { WorkshopPanel } from './workshop/WorkshopPanel.tsx'

export default function App() {
  const startInWorkshop = new URLSearchParams(location.search).has('workshop')
  const [workshopOn, setWorkshopOn] = useStoredState('workshop-on', startInWorkshop)
  const [current, setCurrent] = useStoredState('workshop-step', 0)
  const [done, setDone] = useStoredState<StepId[]>('workshop-done', [])
  const [dark, setDark] = useStoredState('dark', false)

  const complete = useCallback(
    (id: StepId) => setDone((steps) => (steps.includes(id) ? steps : [...steps, id])),
    [setDone],
  )
  const memory = useMemory(complete)

  useEffect(() => {
    document.documentElement.dataset.theme = dark ? 'dark' : 'light'
  }, [dark])

  const step = Math.min(current, STEPS.length - 1)

  return (
    <>
      <TopBar
        status={memory.status}
        statusError={memory.statusError}
        workshopOn={workshopOn}
        onWorkshop={setWorkshopOn}
        dark={dark}
        onTheme={() => setDark(!dark)}
      />
      <div className="layout">
        {workshopOn && (
          <WorkshopPanel memory={memory} current={step} done={done} onSelect={setCurrent} onComplete={complete} />
        )}
        <HomePage memory={memory} focusedCard={workshopOn ? STEPS[step].card : null} dark={dark} />
      </div>
      <Footer />
    </>
  )
}
