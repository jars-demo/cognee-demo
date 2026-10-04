// A tiny hash router: #/ , #/concepts and #/workshop. Hash URLs need no server configuration,
// so the same build works behind nginx, FastAPI and the Vite dev server.

import { useEffect, useState } from 'react'

export type Route = 'home' | 'concepts' | 'workshop'

export const ROUTES: { route: Route; label: string; href: string }[] = [
  { route: 'home', label: 'Home', href: '#/' },
  { route: 'concepts', label: 'Concepts', href: '#/concepts' },
  { route: 'workshop', label: 'Workshop', href: '#/workshop' },
]

function parse(hash: string): Route {
  const path = hash.replace(/^#\/?/, '').split(/[?#]/)[0]
  return path === 'concepts' || path === 'workshop' ? path : 'home'
}

export function useRoute(): Route {
  // Old links used ?workshop; send them to the workshop page.
  if (!location.hash && new URLSearchParams(location.search).has('workshop')) {
    history.replaceState(null, '', `${location.pathname}#/workshop`)
  }
  const [route, setRoute] = useState<Route>(() => parse(location.hash))
  useEffect(() => {
    const onChange = () => {
      setRoute(parse(location.hash))
      window.scrollTo({ top: 0 })
    }
    window.addEventListener('hashchange', onChange)
    return () => window.removeEventListener('hashchange', onChange)
  }, [])
  return route
}
