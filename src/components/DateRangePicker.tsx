import { useState, useRef, useEffect, useCallback } from 'react'
import { createPortal } from 'react-dom'
import {
  format,
  parse,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  addMonths,
  subMonths,
  isSameDay,
  isSameMonth,
  isAfter,
  isBefore,
  isToday,
  startOfYear,
} from 'date-fns'
import { ChevronLeftIcon, ChevronRightIcon, CalendarDaysIcon } from '@heroicons/react/20/solid'

interface DateRangePickerProps {
  from: string | null
  to: string | null
  onChange: (from: string | null, to: string | null) => void
}

interface Preset {
  label: string
  getRange: () => [Date, Date]
}

const PRESETS: Preset[] = [
  { label: '1M', getRange: () => [subMonths(new Date(), 1), new Date()] },
  { label: '3M', getRange: () => [subMonths(new Date(), 3), new Date()] },
  { label: '6M', getRange: () => [subMonths(new Date(), 6), new Date()] },
  { label: 'YTD', getRange: () => [startOfYear(new Date()), new Date()] },
  { label: '1Y', getRange: () => [subMonths(new Date(), 12), new Date()] },
]

const DAY_LABELS = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su']

function toDate(s: string | null): Date | null {
  if (!s) return null
  return parse(s, 'yyyy-MM-dd', new Date())
}

function fmt(d: Date): string {
  return format(d, 'yyyy-MM-dd')
}

function fmtDisplay(d: Date): string {
  return format(d, 'd MMM yyyy')
}

export default function DateRangePicker({ from, to, onChange }: DateRangePickerProps) {
  const [open, setOpen] = useState(false)
  const [viewMonth, setViewMonth] = useState(() => {
    const f = toDate(from)
    return f ? startOfMonth(f) : startOfMonth(new Date())
  })

  const [selectingStart, setSelectingStart] = useState<Date | null>(null)
  const [hoverDate, setHoverDate] = useState<Date | null>(null)

  const wrapperRef = useRef<HTMLDivElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const [dropdownPos, setDropdownPos] = useState<{ top: number; left: number } | null>(null)

  const fromDate = toDate(from)
  const toDate_ = toDate(to)

  useEffect(() => {
    if (!open || !wrapperRef.current) return
    function updatePos() {
      if (!wrapperRef.current) return
      const rect = wrapperRef.current.getBoundingClientRect()
      setDropdownPos({
        top: rect.bottom + 8,
        left: rect.left,
      })
    }
    updatePos()
    window.addEventListener('scroll', updatePos, true)
    window.addEventListener('resize', updatePos)
    return () => {
      window.removeEventListener('scroll', updatePos, true)
      window.removeEventListener('resize', updatePos)
    }
  }, [open])

  useEffect(() => {
    if (!open) return
    function handleClick(e: MouseEvent) {
      const target = e.target as Node
      if (
        wrapperRef.current && !wrapperRef.current.contains(target) &&
        dropdownRef.current && !dropdownRef.current.contains(target)
      ) {
        setOpen(false)
        setSelectingStart(null)
        setHoverDate(null)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [open])

  useEffect(() => {
    if (!open) return
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        setOpen(false)
        setSelectingStart(null)
        setHoverDate(null)
      }
    }
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [open])

  const handlePreset = useCallback((preset: Preset) => {
    const [start, end] = preset.getRange()
    onChange(fmt(start), fmt(end))
    setSelectingStart(null)
    setHoverDate(null)
    setViewMonth(startOfMonth(start))
    setOpen(false)
  }, [onChange])

  const handleDayClick = useCallback((day: Date) => {
    if (!selectingStart) {
      setSelectingStart(day)
      setHoverDate(null)
    } else {
      const [start, end] = isBefore(day, selectingStart)
        ? [day, selectingStart]
        : [selectingStart, day]
      onChange(fmt(start), fmt(end))
      setSelectingStart(null)
      setHoverDate(null)
      setOpen(false)
    }
  }, [selectingStart, onChange])

  const monthStart = startOfMonth(viewMonth)
  const monthEnd = endOfMonth(viewMonth)
  const gridStart = startOfWeek(monthStart, { weekStartsOn: 1 })
  const gridEnd = endOfWeek(monthEnd, { weekStartsOn: 1 })

  const days: Date[] = []
  let cursor = gridStart
  while (!isAfter(cursor, gridEnd)) {
    days.push(cursor)
    cursor = addDays(cursor, 1)
  }

  function isPresetActive(preset: Preset): boolean {
    if (!fromDate || !toDate_) return false
    const [ps, pe] = preset.getRange()
    return isSameDay(fromDate, ps) && isSameDay(toDate_, pe)
  }

  function getDayClasses(day: Date): string {
    const classes: string[] = ['cf-daterange-day']

    if (!isSameMonth(day, viewMonth)) classes.push('outside')
    if (isToday(day)) classes.push('today')

    let rangeStart = fromDate
    let rangeEnd = toDate_

    if (selectingStart) {
      rangeStart = selectingStart
      rangeEnd = hoverDate
      if (rangeStart && rangeEnd && isAfter(rangeStart, rangeEnd)) {
        [rangeStart, rangeEnd] = [rangeEnd, rangeStart]
      }
    }

    if (rangeStart && isSameDay(day, rangeStart)) classes.push('range-start')
    if (rangeEnd && isSameDay(day, rangeEnd)) classes.push('range-end')
    if (
      rangeStart && rangeEnd &&
      isAfter(day, rangeStart) && isBefore(day, rangeEnd)
    ) {
      classes.push('in-range')
    }

    return classes.join(' ')
  }

  const displayText = fromDate && toDate_
    ? `${fmtDisplay(fromDate)} \u2013 ${fmtDisplay(toDate_)}`
    : 'Select dates'

  return (
    <div className="cf-daterange" ref={wrapperRef}>
      <div className="la-filter-group">
        <span className="la-filter-label">Date range</span>
        <button
          type="button"
          className="cf-daterange-trigger"
          onClick={() => setOpen(o => !o)}
          aria-expanded={open}
          aria-haspopup="dialog"
          aria-label={`Date range: ${displayText}`}
        >
          <CalendarDaysIcon className="cf-daterange-icon" aria-hidden="true" />
          <span>{displayText}</span>
        </button>
      </div>

      {open && dropdownPos && createPortal(
        <div
          className="cf-daterange-dropdown cf-daterange-portal"
          ref={dropdownRef}
          role="dialog"
          aria-label="Date range picker"
          style={{ top: dropdownPos.top, left: dropdownPos.left }}
        >
          <div className="cf-daterange-presets">
            {PRESETS.map(p => (
              <button
                key={p.label}
                type="button"
                className={`cf-daterange-preset ${isPresetActive(p) ? 'active' : ''}`}
                onClick={() => handlePreset(p)}
              >
                {p.label}
              </button>
            ))}
          </div>

          <div className="cf-daterange-nav">
            <button
              type="button"
              className="cf-daterange-nav-btn"
              onClick={() => setViewMonth(m => subMonths(m, 1))}
              aria-label="Previous month"
            >
              <ChevronLeftIcon aria-hidden="true" />
            </button>
            <span className="cf-daterange-month-label">
              {format(viewMonth, 'MMMM yyyy')}
            </span>
            <button
              type="button"
              className="cf-daterange-nav-btn"
              onClick={() => setViewMonth(m => addMonths(m, 1))}
              aria-label="Next month"
            >
              <ChevronRightIcon aria-hidden="true" />
            </button>
          </div>

          <div className="cf-daterange-grid">
            {DAY_LABELS.map(d => (
              <div key={d} className="cf-daterange-day-header">{d}</div>
            ))}

            {days.map(day => (
              <button
                key={day.toISOString()}
                type="button"
                className={getDayClasses(day)}
                onClick={() => handleDayClick(day)}
                onMouseEnter={() => { if (selectingStart) setHoverDate(day) }}
                aria-label={format(day, 'd MMMM yyyy')}
              >
                {format(day, 'd')}
              </button>
            ))}
          </div>

          {selectingStart && (
            <div className="cf-daterange-hint">
              Select end date
            </div>
          )}
        </div>,
        document.body
      )}
    </div>
  )
}
