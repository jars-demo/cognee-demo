// The app shell: top bar, the current page, footer.

import { useCallback, useEffect } from 'react'
import { BackToTop } from './components/layout/BackToTop.tsx'
import { Footer } from './components/layout/Footer.tsx'
import { TopBar } from './components/layout/TopBar.tsx'
import { type StepId, useMemory } from './hooks/useMemory.ts'
import { useStoredState } from './hooks/useStoredState.ts'
import { ConceptsPage } from './pages/ConceptsPage.tsx'
import { HomePage } from './pages/HomePage.tsx'
import { WorkshopPage } from './pages/WorkshopPage.tsx'
import { RunLocallyPage } from './pages/RunLocallyPage.tsx'
import { useRoute } from './router.ts'
import { IS_STATIC_SITE } from './site.ts'
import { STEPS } from './workshop/steps.tsx'

export default function App() {
  const route = useRoute()
  const [guideOpen, setGuideOpen] = useStoredState('workshop-guide-open', true)
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

  return (
    <>
      <TopBar route={route} status={memory.status} statusError={memory.statusError} dark={dark} onTheme={() => setDark(!dark)} />
      {route === 'home' && <HomePage memory={memory} />}
      {route === 'concepts' && <ConceptsPage />}
      {route === 'workshop' && IS_STATIC_SITE && <RunLocallyPage />}
      {route === 'workshop' && !IS_STATIC_SITE && (
        <WorkshopPage
          memory={memory}
          dark={dark}
          guideOpen={guideOpen}
          onGuide={setGuideOpen}
          current={Math.min(current, STEPS.length - 1)}
          done={done}
          onSelect={setCurrent}
          onComplete={complete}
          onReset={() => {
            setDone([])
            setCurrent(0)
          }}
        />
      )}
      <Footer />
      <BackToTop />
    </>
  )
}
