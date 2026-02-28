import { useState, useRef, useEffect } from 'react'
import {
  PlusIcon,
  TrashIcon,
  PresentationChartBarIcon,
} from '@heroicons/react/24/outline'
import { usePresentationStore, useActions } from '../lib/presentationStore'
import { useShallow } from 'zustand/react/shallow'
import type { PresentationMeta } from '../lib/types'

function formatDate(dateStr: string): { day: string; time: string } {
  const d = new Date(dateStr)
  const day = d.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
  const time = d.toLocaleTimeString('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
  })
  return { day, time }
}

export default function PresentationsList() {
  const recentPresentations = usePresentationStore(
    useShallow((s) => s.recentPresentations)
  )
  const actions = useActions()
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editingName, setEditingName] = useState('')
  const editInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (editingId && editInputRef.current) {
      editInputRef.current.focus()
      editInputRef.current.select()
    }
  }, [editingId])

  function handleNew() {
    actions.createNewPresentation()
  }

  function handleSelect(p: PresentationMeta) {
    if (editingId === p.id) return
    actions.loadPresentation(p.id)
  }

  function handleDelete(e: React.MouseEvent, id: string) {
    e.stopPropagation()
    actions.deletePresentation(id)
  }

  function handleStartRename(e: React.MouseEvent, p: PresentationMeta) {
    e.stopPropagation()
    setEditingId(p.id)
    setEditingName(p.name)
  }

  function handleFinishRename() {
    if (editingId && editingName.trim()) {
      actions.renamePresentation(editingId, editingName.trim())
    }
    setEditingId(null)
    setEditingName('')
  }

  function handleRenameKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter') {
      handleFinishRename()
    } else if (e.key === 'Escape') {
      setEditingId(null)
      setEditingName('')
    }
  }

  return (
    <div className="fp-presentations">
      <div className="fp-presentations-header">
        <div>
          <span className="fp-presentations-kicker">Presentations</span>
          <h1 className="fp-presentations-title">FullyPresent</h1>
          <p className="fp-presentations-desc">
            Create and present slide decks with AI-powered talk tracks.
          </p>
        </div>
        <button className="fp-btn-primary" onClick={handleNew}>
          <PlusIcon aria-hidden="true" />
          New presentation
        </button>
      </div>

      {recentPresentations.length === 0 ? (
        <div className="fp-presentations-table-wrapper">
          <div className="fp-presentations-empty">
            <PresentationChartBarIcon
              className="fp-presentations-empty-icon"
              aria-hidden="true"
            />
            <p className="fp-presentations-empty-title">No presentations yet</p>
            <p className="fp-presentations-empty-desc">
              Create a new presentation to get started.
            </p>
          </div>
        </div>
      ) : (
        <div className="fp-presentations-table-wrapper">
          <table className="fp-presentations-table">
            <thead>
              <tr>
                <th>Name</th>
                <th className="col-num">Slides</th>
                <th>Last modified</th>
                <th aria-label="Actions" />
              </tr>
            </thead>
            <tbody>
              {recentPresentations.map((p) => {
                const { day, time } = formatDate(p.updatedAt)
                return (
                  <tr key={p.id} onClick={() => handleSelect(p)}>
                    <td>
                      <div className="fp-cell-name-row">
                        {p.thumbnailUrl ? (
                          <img
                            className="fp-cell-thumb"
                            src={p.thumbnailUrl}
                            alt=""
                            aria-hidden="true"
                          />
                        ) : (
                          <div className="fp-cell-thumb fp-cell-thumb--empty" />
                        )}
                        {editingId === p.id ? (
                          <input
                            ref={editInputRef}
                            className="fp-cell-title-input"
                            value={editingName}
                            onChange={(e) => setEditingName(e.target.value)}
                            onBlur={handleFinishRename}
                            onKeyDown={handleRenameKeyDown}
                            onClick={(e) => e.stopPropagation()}
                          />
                        ) : (
                          <span
                            className="fp-cell-title"
                            onDoubleClick={(e) => handleStartRename(e, p)}
                          >
                            {p.name}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="col-num fp-cell-mono">{p.slideCount}</td>
                    <td className="fp-cell-date">
                      <span className="fp-cell-date-day">{day}</span>
                      <span className="fp-cell-date-time">{time}</span>
                    </td>
                    <td>
                      <button
                        className="fp-btn-icon fp-delete-btn"
                        onClick={(e) => handleDelete(e, p.id)}
                        aria-label={`Delete ${p.name}`}
                      >
                        <TrashIcon aria-hidden="true" />
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
