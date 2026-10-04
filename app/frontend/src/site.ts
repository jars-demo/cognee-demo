// Build flavours. `npm run build` makes the full app, which talks to the backend.
// `npm run build:static` (used by Vercel) makes a static site with no backend: Home and Concepts
// work as usual, and the Workshop page explains how to run the live version locally.

export const IS_STATIC_SITE = import.meta.env.MODE === 'static'

export const REPO_URL = 'https://github.com/jars-demo/cognee-demo'

// Sample summaries, read from data/*/about.json at build time so the static site can list them.
// In the full app the backend serves the same files through /api/samples.
const ABOUT_FILES = import.meta.glob<{ title: string; description: string; questions: string[] }>(
  '../../../data/*/about.json',
  { eager: true, import: 'default' },
)

const DOCUMENTS = import.meta.glob<string>('../../../data/*/*.md', {
  eager: true,
  query: '?raw',
  import: 'default',
})

const folderOf = (path: string) => path.split('/').at(-2) ?? ''

export const BUNDLED_SAMPLES = Object.entries(ABOUT_FILES)
  .map(([path, about]) => ({
    dataset: folderOf(path),
    title: about.title,
    description: about.description,
    questions: about.questions,
    files: Object.keys(DOCUMENTS).filter((doc) => folderOf(doc) === folderOf(path)).length,
  }))
  .sort((a, b) => a.dataset.localeCompare(b.dataset))
