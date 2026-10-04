// Shapes returned by the backend (app/backend/api/routes/).

export interface Status {
  mode: 'local' | 'local-llm' | 'remote'
  label: string
  detail: string
  /** null when cognee runs remotely: the server decides. */
  llm_available: boolean | null
  cognee_version: string
}

export interface CallInfo {
  call: string
  seconds: number
}

export interface RememberResponse extends CallInfo {
  documents: number
}

export interface RecallResult {
  text: string
  source: string | null
  search_type: string | null
  score: number | null
}

export interface RecallResponse extends CallInfo {
  results: RecallResult[]
}

export interface GraphNode {
  id: string
  label: string
  type: string
  description: string
}

export interface GraphEdge {
  source: string
  target: string
  label: string
}

export interface GraphResponse extends CallInfo {
  nodes: GraphNode[]
  edges: GraphEdge[]
}

export interface Sample {
  dataset: string
  title: string
  description: string
  questions: string[]
  files: number
}

export interface SampleText extends Sample {
  text: string
}

export type SearchType = '' | 'CHUNKS' | 'SUMMARIES' | 'RAG_COMPLETION' | 'GRAPH_COMPLETION'
