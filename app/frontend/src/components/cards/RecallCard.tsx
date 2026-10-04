import type { SearchType } from '../../api/types.ts'
import type { Memory } from '../../hooks/useMemory.ts'
import { Button, Card } from '../Card.tsx'

const TYPES: { value: SearchType; label: string; llm?: boolean }[] = [
  { value: '', label: 'Auto (let cognee choose)' },
  { value: 'CHUNKS', label: 'CHUNKS: matching passages, no LLM' },
  { value: 'SUMMARIES', label: 'SUMMARIES: document summaries' },
  { value: 'RAG_COMPLETION', label: 'RAG_COMPLETION: passages + LLM answer', llm: true },
  { value: 'GRAPH_COMPLETION', label: 'GRAPH_COMPLETION: graph + LLM answer', llm: true },
]

export function RecallCard({ memory, highlight }: { memory: Memory; highlight: boolean }) {
  const llm = memory.status?.llm_available !== false
  return (
    <Card
      id="card-recall"
      num="2"
      title="Recall"
      highlight={highlight}
      lede={<>Ask a question with <code>cognee.recall()</code>. On Auto, cognee picks a search type for you.</>}
    >
      <div className="stack">
        <div>
          <label className="field" htmlFor="question">Question</label>
          <input
            id="question"
            type="text"
            value={memory.question}
            onChange={(e) => memory.setQuestion(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && memory.recall()}
            placeholder={memory.suggestions[0] ?? 'Ask anything about what you remembered'}
          />
          {memory.suggestions.length > 0 && (
            <div className="chips">
              <span className="hint">Try:</span>
              {memory.suggestions.map((q) => (
                <button key={q} type="button" className="chip" onClick={() => memory.setQuestion(q)}>
                  {q}
                </button>
              ))}
            </div>
          )}
        </div>
        <div>
          <label className="field" htmlFor="search-type">Search type</label>
          <select id="search-type" value={memory.searchType} onChange={(e) => memory.setSearchType(e.target.value as SearchType)}>
            {TYPES.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
                {t.llm && !llm ? ' (needs a key)' : ''}
              </option>
            ))}
          </select>
        </div>
        <div className="row">
          <Button variant="primary" busy={memory.busy === 'recall'} busyLabel="Thinking…" onClick={() => memory.recall()}>
            Recall
          </Button>
        </div>
        <div className="results">
          {memory.notice.recall && <div className="result error">{memory.notice.recall}</div>}
          {memory.results?.length === 0 && (
            <div className="empty">No results. Did you remember something into “{memory.dataset}” first?</div>
          )}
          {memory.results?.slice(0, 6).map((item, index) => (
            <div className="result" key={index}>
              <div className="meta">
                {[item.search_type, item.source].filter(Boolean).map((tag) => (
                  <span className="tag" key={tag}>{tag}</span>
                ))}
                {typeof item.score === 'number' && <span>score {item.score.toFixed(3)}</span>}
              </div>
              {item.text}
            </div>
          ))}
        </div>
      </div>
    </Card>
  )
}
