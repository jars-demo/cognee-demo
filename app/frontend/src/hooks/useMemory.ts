// All app state and every action in one hook, so the cards and the workshop panel share it.

import { useCallback, useEffect, useState } from 'react'
import { api } from '../api/client.ts'
import { BUNDLED_SAMPLES, IS_STATIC_SITE } from '../site.ts'
import type { GraphResponse, RecallResult, Sample, SearchType, Status } from '../api/types.ts'

export type LogKind = 'call' | 'ok' | 'err'
export interface LogLine {
  id: number
  time: string
  kind: LogKind
  text: string
}

export type StepId = 'setup' | 'remember' | 'recall' | 'graph' | 'search-types' | 'forget' | 'your-use-case'

// The workshop's sample. Every folder in data/ is a sample, remembered into the dataset of the same name.
export const SAMPLE_DATASET = 'northwind_trails'

let nextLogId = 0

export function useMemory(onStepDone: (id: StepId) => void) {
  const [status, setStatus] = useState<Status | null>(null)
  const [statusError, setStatusError] = useState(false)
  const [dataset, setDataset] = useState(SAMPLE_DATASET)
  const [text, setText] = useState('')
  const [question, setQuestion] = useState('')
  const [searchType, setSearchType] = useState<SearchType>('')
  const [results, setResults] = useState<RecallResult[] | null>(null)
  const [graph, setGraph] = useState<GraphResponse | null>(null)
  const [busy, setBusy] = useState<string | null>(null)
  const [notice, setNotice] = useState<Record<string, string>>({})
  const [log, setLog] = useState<LogLine[]>([])
  const [samples, setSamples] = useState<Sample[]>([])
  const [sampleName, setSampleName] = useState(SAMPLE_DATASET)

  const write = useCallback((kind: LogKind, line: string) => {
    const time = new Date().toLocaleTimeString([], { hour12: false })
    setLog((lines) => [...lines.slice(-199), { id: nextLogId++, time, kind, text: line }])
  }, [])

  const say = (card: string, message: string) => setNotice((n) => ({ ...n, [card]: message }))

  useEffect(() => {
    // The static (Vercel) site has no backend: list the samples bundled at build time.
    if (IS_STATIC_SITE) return setSamples(BUNDLED_SAMPLES)
    api.status().then(setStatus).catch(() => setStatusError(true))
    api
      .samples()
      .then((list) => setSamples(list.samples))
      .catch(() => setSamples(BUNDLED_SAMPLES))
  }, [])

  async function guarded<T>(name: string, task: () => Promise<T>): Promise<T | undefined> {
    setBusy(name)
    try {
      return await task()
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error)
      write('err', `✗ ${name} failed: ${message}`)
      say(name, message)
      return undefined
    } finally {
      setBusy(null)
    }
  }

  const loadSample = async (name: string = sampleName) => {
    const sample = await guarded('remember', () => api.sample(name))
    if (!sample) return
    setSampleName(sample.dataset)
    setText(sample.text)
    setDataset(sample.dataset)
    write('call', `Loaded ${sample.title}: ${sample.files} documents from data/${sample.dataset}/.`)
  }

  // Suggested questions for whichever sample the current dataset came from.
  const suggestions = samples.find((s) => s.dataset === dataset)?.questions ?? []

  const remember = async () => {
    if (!text.trim()) return say('remember', 'Paste some text or load the sample first.')
    say('remember', 'Building the knowledge graph… (the first run downloads local models)')
    write('call', `→ cognee.remember(…, dataset_name="${dataset}")`)
    const result = await guarded('remember', () => api.remember(text, dataset))
    if (!result) return
    say('remember', `Stored ${result.documents} document(s) in “${dataset}” in ${result.seconds}s.`)
    write('ok', `✓ ${result.call} · ${result.seconds}s`)
    onStepDone('remember')
  }

  const recall = async (override?: { question: string; searchType: SearchType }) => {
    const q = override?.question ?? question
    const type = override?.searchType ?? searchType
    if (override) {
      setQuestion(q)
      setSearchType(type)
    }
    if (!q.trim()) return
    write('call', `→ cognee.recall("${q}"${type ? `, query_type=${type}` : ''})`)
    say('recall', '')
    const result = await guarded('recall', () => api.recall(q, dataset, type))
    if (!result) return setResults(null)
    setResults(result.results)
    write('ok', `✓ ${result.call} · ${result.results.length} result(s) · ${result.seconds}s`)
    onStepDone(type ? 'search-types' : 'recall')
  }

  const loadGraph = async () => {
    write('call', `→ visualize_graph_json(dataset="${dataset}")`)
    const result = await guarded('graph', () => api.graph(dataset))
    if (!result) return
    setGraph(result)
    say('graph', `${result.nodes.length} nodes, ${result.edges.length} edges`)
    write('ok', `✓ ${result.call} · ${result.nodes.length} nodes · ${result.seconds}s`)
    if (result.nodes.length) onStepDone('graph')
  }

  const forget = async () => {
    if (!window.confirm(`Forget everything in the “${dataset}” dataset?`)) return
    write('call', `→ cognee.forget(dataset="${dataset}")`)
    const result = await guarded('forget', () => api.forget(dataset))
    if (!result) return
    setGraph(null)
    setResults(null)
    say('forget', `“${dataset}” was forgotten in ${result.seconds}s. Recall again: nothing comes back.`)
    write('ok', `✓ ${result.call} · ${result.seconds}s`)
    onStepDone('forget')
  }

  return {
    status, statusError, dataset, setDataset, text, setText, question, setQuestion,
    samples, sampleName, setSampleName, suggestions,
    searchType, setSearchType, results, graph, busy, notice, log,
    loadSample, remember, recall, loadGraph, forget,
  }
}

export type Memory = ReturnType<typeof useMemory>
