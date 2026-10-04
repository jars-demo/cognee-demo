// The ideas behind cognee, each with a short example. Read before (or during) the workshop.

import type { ReactNode } from 'react'
import { GraphDiagram } from '../components/GraphDiagram.tsx'

interface Concept {
  id: string
  title: string
  body: string
  code?: string
  visual?: ReactNode
}

const CONCEPTS: Concept[] = [
  {
    id: 'memory-api',
    title: 'The memory API',
    body: 'Four async calls cover the whole lifecycle. remember() stores data and builds the graph, recall() searches it, improve() enriches it over time, and forget() deletes from it.',
    code: `import cognee

await cognee.remember("Sofia leads the Mobile team.", dataset_name="demo")
results = await cognee.recall("Who leads the Mobile team?", datasets=["demo"])
await cognee.forget(dataset="demo")`,
  },
  {
    id: 'datasets',
    title: 'Datasets',
    body: 'A dataset is a named container for related data. Search and delete it on its own, and keep projects apart. In this workshop every folder in data/ becomes the dataset of the same name.',
    code: `await cognee.remember(documents, dataset_name="northwind_trails")
await cognee.recall(question, datasets=["northwind_trails"])`,
  },
  {
    id: 'chunks',
    title: 'Documents and chunks',
    body: 'Every text you remember is a document. cognee splits each document into chunks, small passages that are embedded for search and linked back to their document. Smaller chunks give more focused results.',
    code: 'await cognee.remember(documents, dataset_name="demo", chunk_size=128)',
  },
  {
    id: 'knowledge-graph',
    title: 'Entities and the knowledge graph',
    body: 'From each chunk, an extractor pulls out entities (people, teams, projects) and the relationships between them. They become nodes and edges in a graph database. Every entity points back to the chunk it came from, so answers stay traceable. Here is a small piece of the Northwind graph:',
    visual: <GraphDiagram />,
  },
  {
    id: 'vectors',
    title: 'Embeddings and vector search',
    body: 'Chunks and entities are also turned into embeddings, lists of numbers that capture meaning, and stored in a vector database. Vector search finds text that means something similar to your question, even with different words.',
  },
  {
    id: 'search-types',
    title: 'Search types',
    body: 'recall() picks a search type for you, or you choose one. CHUNKS returns matching passages without an LLM. RAG_COMPLETION and GRAPH_COMPLETION have an LLM write the answer, the latter from graph neighbourhoods, which handles questions that connect several facts.',
    code: `from cognee import SearchType

await cognee.recall(question, query_type=SearchType.CHUNKS)
await cognee.recall(question, query_type=SearchType.GRAPH_COMPLETION)`,
  },
  {
    id: 'extractors',
    title: 'Extractors: local model or LLM',
    body: 'Without an API key, a small local model (GLiNER) builds the graph: free and private, but approximate. With an LLM key, such as a free Groq key, the LLM extracts the graph: richer relationships, and answers in plain language.',
  },
  {
    id: 'modes',
    title: 'Where cognee runs',
    body: 'cognee can run inside your app, as a server (here, the Docker container), or in Cognee Cloud. One call points the SDK at a server, and remember, recall and forget then run there.',
    code: 'await cognee.serve(url="http://localhost:8001")  # or your Cognee Cloud URL',
  },
]

export function ConceptsPage() {
  return (
    <main className="page">
      <section className="page-header">
        <span className="pill">Concepts</span>
        <h1>How cognee works</h1>
        <p>
          The ideas you will use in the workshop, in the order you meet them. Each takes a minute to
          read. For the full picture, see the <a href="https://docs.cognee.ai/" target="_blank" rel="noreferrer">cognee docs</a>.
        </p>
      </section>

      <div className="concepts">
        <nav className="concepts-toc" aria-label="Concepts">
          {CONCEPTS.map((concept, index) => (
            <a key={concept.id} href={`#/concepts`} onClick={(e) => {
              e.preventDefault()
              document.getElementById(concept.id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
            }}>
              <span>{String(index + 1).padStart(2, '0')}</span>
              {concept.title}
            </a>
          ))}
        </nav>
        <div className="concepts-list">
          {CONCEPTS.map((concept, index) => (
            <article className="concept" id={concept.id} key={concept.id}>
              <span className="concept-index">{String(index + 1).padStart(2, '0')}</span>
              <h2>{concept.title}</h2>
              <p>{concept.body}</p>
              {concept.visual}
              {concept.code && <pre>{concept.code}</pre>}
            </article>
          ))}
          <div className="concept cta">
            <h2>Ready to try it?</h2>
            <p>The workshop puts each of these into practice, step by step.</p>
            <a className="btn" href="#/workshop">Start the workshop</a>
          </div>
        </div>
      </div>
    </main>
  )
}
