import { useEffect, useRef } from 'react'
import type { LogLine } from '../../hooks/useMemory.ts'
import { Card } from '../Card.tsx'

export function ActivityLog({ lines }: { lines: LogLine[] }) {
  const box = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (box.current) box.current.scrollTop = box.current.scrollHeight
  }, [lines])
  return (
    <Card id="card-log" num="⌁" title="Under the hood" lede="Every cognee call this page makes, and how long it took.">
      <div className="log" ref={box}>
        {lines.length === 0 && (
          <div className="line"><span className="time">--:--:--</span><span>Waiting for your first action.</span></div>
        )}
        {lines.map((line) => (
          <div className="line" key={line.id}>
            <span className="time">{line.time}</span>
            <span className={line.kind}>{line.text}</span>
          </div>
        ))}
      </div>
    </Card>
  )
}
