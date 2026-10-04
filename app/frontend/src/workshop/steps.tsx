// The seven workshop steps shown in Workshop mode. Keep in sync with workshop/*.md.

import type { ReactNode } from 'react'
import type { Memory, StepId } from '../hooks/useMemory.ts'

export interface Step {
  id: StepId
  title: string
  minutes: number
  card: string | null
  body: ReactNode
  action: { label: string; run: (memory: Memory) => Promise<unknown> | true }
}

export const STEPS: Step[] = [
  {
    id: 'setup',
    title: 'Meet cognee',
    minutes: 5,
    card: null,
    body: (
      <>
        <h4>What is cognee?</h4>
        <p>
          cognee is an open-source memory engine for AI apps. You give it data; it builds a{' '}
          <strong>knowledge graph</strong> (who and what is in your data, and how they connect) plus a
          vector index, so you can ask questions later and get grounded answers.
        </p>
        <div className="callout">The badge in the top bar shows how cognee is running: locally, in Docker, or in the cloud.</div>
        <pre>{`await cognee.remember(text)   # store
await cognee.recall(question)  # ask
await cognee.forget(dataset=…) # delete`}</pre>
      </>
    ),
    action: { label: "I'm set up", run: () => true },
  },
  {
    id: 'remember',
    title: 'Remember some data',
    minutes: 8,
    card: 'card-remember',
    body: (
      <>
        <h4>Store text in memory</h4>
        <ol>
          <li>Click <strong>Try it</strong> to load the sample: three short notes about a fictional company, Northwind Trails.</li>
          <li>Click <strong>Remember</strong>. The first run downloads local models, so give it a minute or two.</li>
        </ol>
        <p>Under the hood, <code>remember()</code> chunks the text, extracts entities and relationships, stores them in a graph database, and embeds everything for search.</p>
        <pre>{'await cognee.remember(documents, dataset_name="northwind_trails")'}</pre>
      </>
    ),
    action: { label: 'Try it: load the sample', run: (m) => m.loadSample() },
  },
  {
    id: 'recall',
    title: 'Ask a question',
    minutes: 5,
    card: 'card-recall',
    body: (
      <>
        <h4>Recall from memory</h4>
        <p>Ask in plain language. On <strong>Auto</strong>, cognee picks a search strategy. Try:</p>
        <ol>
          <li>What is Project Riverbend blocked on?</li>
          <li>Who leads the Mobile team?</li>
          <li>Why did the Mobile team ship offline mode on Android first?</li>
        </ol>
        <pre>{'results = await cognee.recall("What is Project Riverbend blocked on?")'}</pre>
      </>
    ),
    action: {
      label: 'Try it: ask a question',
      run: (m) => m.recall({ question: 'What is Project Riverbend blocked on?', searchType: '' }),
    },
  },
  {
    id: 'graph',
    title: 'Explore the graph',
    minutes: 8,
    card: 'card-graph',
    body: (
      <>
        <h4>See what cognee built</h4>
        <p>Load the graph and click <strong>sofia alvarez</strong> or <strong>ravi patel</strong> to see their connections.</p>
        <p>Node types: <em>Entity</em> (people, projects, services), <em>EntityType</em>, <em>DocumentChunk</em> (pieces of your text), <em>TextDocument</em> and <em>TextSummary</em>. Entities link back to the chunk they came from, which keeps answers traceable.</p>
        <div className="callout">Without a key, a small local model (GLiNER) extracts the graph: fast and free, but it misses links and makes some odd ones. Compare it with an LLM in step 5.</div>
      </>
    ),
    action: { label: 'Try it: load the graph', run: (m) => m.loadGraph() },
  },
  {
    id: 'search-types',
    title: 'Search types & LLM answers',
    minutes: 8,
    card: 'card-recall',
    body: (
      <>
        <h4>Pick how cognee searches</h4>
        <p><strong>CHUNKS</strong> returns the most relevant passages with no LLM. <strong>GRAPH_COMPLETION</strong> walks the graph and has an LLM write the answer.</p>
        <p>For LLM answers, add a free Groq key: create one at{' '}
          <a href="https://console.groq.com/keys" target="_blank" rel="noreferrer">console.groq.com/keys</a>, run{' '}
          <code>python scripts/setup.py</code> again and pick the Groq option, then forget and remember the sample again.</p>
        <pre>{`await cognee.recall(q, query_type=SearchType.CHUNKS)
await cognee.recall(q, query_type=SearchType.GRAPH_COMPLETION)`}</pre>
      </>
    ),
    action: {
      label: 'Try it: search with CHUNKS',
      run: (m) => m.recall({ question: 'Who leads the Mobile team?', searchType: 'CHUNKS' }),
    },
  },
  {
    id: 'forget',
    title: 'Forget',
    minutes: 3,
    card: 'card-forget',
    body: (
      <>
        <h4>Delete from memory</h4>
        <p><code>forget()</code> removes a dataset's graph, vectors and stored text. Recall again afterwards: nothing comes back.</p>
        <pre>{'await cognee.forget(dataset="northwind_trails")'}</pre>
      </>
    ),
    action: { label: 'Try it: forget the dataset', run: (m) => m.forget() },
  },
  {
    id: 'your-use-case',
    title: 'Build your own use case',
    minutes: 15,
    card: null,
    body: (
      <>
        <h4>Make it yours, then open a PR</h4>
        <ol>
          <li>Fork the repo and clone your fork.</li>
          <li>Copy <code>usecases/_template</code> to <code>usecases/&lt;your-github-handle&gt;</code>.</li>
          <li>Add your own text to its <code>data/</code> folder (nothing private).</li>
          <li>Write three questions in <code>run.py</code> and run it.</li>
          <li>Fill in your <code>README.md</code> and open a pull request (see CONTRIBUTING.md).</li>
        </ol>
      </>
    ),
    action: { label: 'Mark as done', run: () => true },
  },
]
