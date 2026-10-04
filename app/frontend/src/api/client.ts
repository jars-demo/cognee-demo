// Typed calls to the backend. Each function maps to one endpoint, and each endpoint to one
// cognee call (see app/backend/services/memory.py).

import type {
  CallInfo,
  GraphResponse,
  RecallResponse,
  RememberResponse,
  SearchType,
  Status,
} from './types.ts'

async function request<T>(path: string, init?: { method?: string; body?: unknown }): Promise<T> {
  const response = await fetch(path, {
    method: init?.method ?? 'GET',
    headers: init?.body ? { 'Content-Type': 'application/json' } : undefined,
    body: init?.body ? JSON.stringify(init.body) : undefined,
  })
  const payload = await response.json().catch(() => ({}))
  if (!response.ok) {
    const detail = typeof payload.detail === 'string' ? payload.detail : JSON.stringify(payload.detail)
    throw new Error(detail || `Request failed (${response.status})`)
  }
  return payload as T
}

export const api = {
  status: () => request<Status>('/api/status'),

  sample: () => request<{ dataset: string; documents: number; text: string }>('/api/sample'),

  remember: (text: string, dataset: string) =>
    request<RememberResponse>('/api/remember', { method: 'POST', body: { text, dataset } }),

  recall: (question: string, dataset: string, searchType: SearchType) =>
    request<RecallResponse>('/api/recall', {
      method: 'POST',
      body: { question, dataset, search_type: searchType || null },
    }),

  graph: (dataset: string) =>
    request<GraphResponse>(`/api/graph?dataset=${encodeURIComponent(dataset)}`),

  forget: (dataset: string) =>
    request<CallInfo>('/api/forget', { method: 'POST', body: { dataset } }),
}
