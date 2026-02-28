import { useState, useCallback } from 'react'
import { PlusIcon, XMarkIcon } from '@heroicons/react/20/solid'
import type { Slide } from '../lib/types'

interface SlideThumbnailsProps {
  slides: Slide[]
  currentIndex: number
  onSelect: (index: number) => void
  onAdd: () => void
  onDelete: (index: number) => void
  onReorder: (from: number, to: number) => void
}

export default function SlideThumbnails({
  slides,
  currentIndex,
  onSelect,
  onAdd,
  onDelete,
  onReorder,
}: SlideThumbnailsProps) {
  const [dragIndex, setDragIndex] = useState<number | null>(null)
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null)

  const handleDragStart = useCallback((index: number) => {
    setDragIndex(index)
  }, [])

  const handleDragOver = useCallback((e: React.DragEvent, index: number) => {
    e.preventDefault()
    setDragOverIndex(index)
  }, [])

  const handleDrop = useCallback((index: number) => {
    if (dragIndex !== null && dragIndex !== index) {
      onReorder(dragIndex, index)
    }
    setDragIndex(null)
    setDragOverIndex(null)
  }, [dragIndex, onReorder])

  const handleDragEnd = useCallback(() => {
    setDragIndex(null)
    setDragOverIndex(null)
  }, [])

  return (
    <div className="fp-sidebar-left">
      <div className="fp-thumbnails">
        {slides.map((slide, index) => {
          const isSelected = index === currentIndex
          const isDragOver = index === dragOverIndex && dragIndex !== null && dragIndex !== index
          const isDragging = index === dragIndex

          return (
            <div
              key={slide.id}
              className={`fp-thumb${isSelected ? ' fp-thumb--selected' : ''}${isDragOver ? ' fp-thumb--drag-over' : ''}${isDragging ? ' fp-thumb--dragging' : ''}`}
              onClick={() => onSelect(index)}
              draggable
              onDragStart={() => handleDragStart(index)}
              onDragOver={(e) => handleDragOver(e, index)}
              onDrop={() => handleDrop(index)}
              onDragEnd={handleDragEnd}
            >
              {slide.thumbnail ? (
                <img
                  className="fp-thumb-img"
                  src={slide.thumbnail}
                  alt={`Slide ${index + 1}`}
                  draggable={false}
                />
              ) : (
                <div className="fp-thumb-img fp-thumb-empty" />
              )}
              <span className="fp-thumb-number">{index + 1}</span>
              {slides.length > 1 && (
                <button
                  className="fp-thumb-delete"
                  onClick={(e) => {
                    e.stopPropagation()
                    onDelete(index)
                  }}
                  aria-label={`Delete slide ${index + 1}`}
                >
                  <XMarkIcon aria-hidden="true" />
                </button>
              )}
            </div>
          )
        })}
        <button
          className="fp-add-slide"
          onClick={onAdd}
          aria-label="Add slide"
        >
          <PlusIcon aria-hidden="true" />
        </button>
      </div>
    </div>
  )
}
