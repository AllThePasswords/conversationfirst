import { useState, useRef, useEffect, useCallback, useId } from 'react'
import { createPortal } from 'react-dom'
import { ChevronDownIcon, CheckIcon } from '@heroicons/react/20/solid'

export interface CfSelectOption {
  value: string
  label: string
}

interface CfSelectProps {
  value: string
  onChange: (value: string) => void
  options: CfSelectOption[]
  placeholder?: string
  'aria-label'?: string
  id?: string
  className?: string
  disabled?: boolean
  size?: 'sm' | 'md'
}

export default function CfSelect({
  value,
  onChange,
  options,
  placeholder = 'Select\u2026',
  'aria-label': ariaLabel,
  id: externalId,
  className,
  disabled = false,
  size = 'sm',
}: CfSelectProps) {
  const [open, setOpen] = useState(false)
  const [highlightIndex, setHighlightIndex] = useState(-1)
  const [dropdownPos, setDropdownPos] = useState<{ top: number; left: number; width: number } | null>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const typeAheadRef = useRef('')
  const typeAheadTimerRef = useRef<ReturnType<typeof setTimeout>>(undefined)
  const internalId = useId()
  const selectId = externalId || internalId

  const selectedIndex = options.findIndex(o => o.value === value)
  const selectedOption = selectedIndex >= 0 ? options[selectedIndex] : null
  const displayLabel = selectedOption?.label || placeholder

  // Position calculation
  const updatePos = useCallback(() => {
    if (!triggerRef.current) return
    const rect = triggerRef.current.getBoundingClientRect()
    const spaceBelow = window.innerHeight - rect.bottom
    const dropdownHeight = Math.min(options.length * 32, 240)
    const placeAbove = spaceBelow < dropdownHeight + 8 && rect.top > dropdownHeight + 8

    setDropdownPos({
      top: placeAbove ? rect.top - dropdownHeight - 4 : rect.bottom + 4,
      left: rect.left,
      width: rect.width,
    })
  }, [options.length])

  useEffect(() => {
    if (!open) return
    updatePos()
    window.addEventListener('scroll', updatePos, true)
    window.addEventListener('resize', updatePos)
    return () => {
      window.removeEventListener('scroll', updatePos, true)
      window.removeEventListener('resize', updatePos)
    }
  }, [open, updatePos])

  // Close on outside click
  useEffect(() => {
    if (!open) return
    function handleClick(e: MouseEvent) {
      const target = e.target as Node
      if (
        triggerRef.current && !triggerRef.current.contains(target) &&
        dropdownRef.current && !dropdownRef.current.contains(target)
      ) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [open])

  // Close on Escape
  useEffect(() => {
    if (!open) return
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        e.stopPropagation()
        setOpen(false)
        triggerRef.current?.focus()
      }
    }
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [open])

  // Scroll highlighted option into view
  useEffect(() => {
    if (!open || highlightIndex < 0 || !dropdownRef.current) return
    const optionEl = dropdownRef.current.querySelector(`[id="${selectId}-option-${highlightIndex}"]`)
    if (optionEl) {
      optionEl.scrollIntoView({ block: 'nearest' })
    }
  }, [open, highlightIndex, selectId])

  function openDropdown() {
    if (disabled || options.length === 0) return
    setOpen(true)
    setHighlightIndex(selectedIndex >= 0 ? selectedIndex : 0)
  }

  function selectOption(val: string) {
    onChange(val)
    setOpen(false)
    triggerRef.current?.focus()
  }

  function handleTypeAhead(char: string) {
    clearTimeout(typeAheadTimerRef.current)
    typeAheadRef.current += char.toLowerCase()
    typeAheadTimerRef.current = setTimeout(() => { typeAheadRef.current = '' }, 500)

    const match = options.findIndex(o =>
      o.label.toLowerCase().startsWith(typeAheadRef.current)
    )
    if (match >= 0) setHighlightIndex(match)
  }

  function handleTriggerKeyDown(e: React.KeyboardEvent) {
    switch (e.key) {
      case 'Enter':
      case ' ':
      case 'ArrowDown':
      case 'ArrowUp':
        e.preventDefault()
        if (!open) {
          openDropdown()
        }
        break
    }
  }

  function handleDropdownKeyDown(e: React.KeyboardEvent) {
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        setHighlightIndex(i => Math.min(i + 1, options.length - 1))
        break
      case 'ArrowUp':
        e.preventDefault()
        setHighlightIndex(i => Math.max(i - 1, 0))
        break
      case 'Home':
        e.preventDefault()
        setHighlightIndex(0)
        break
      case 'End':
        e.preventDefault()
        setHighlightIndex(options.length - 1)
        break
      case 'Enter':
      case ' ':
        e.preventDefault()
        if (highlightIndex >= 0 && highlightIndex < options.length) {
          selectOption(options[highlightIndex].value)
        }
        break
      default:
        if (e.key.length === 1 && !e.ctrlKey && !e.metaKey) {
          handleTypeAhead(e.key)
        }
    }
  }

  return (
    <div className={`cf-select${className ? ' ' + className : ''}`}>
      <button
        ref={triggerRef}
        type="button"
        role="combobox"
        id={selectId}
        className={`cf-select-trigger cf-select-trigger--${size}`}
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-activedescendant={open && highlightIndex >= 0 ? `${selectId}-option-${highlightIndex}` : undefined}
        aria-label={ariaLabel}
        disabled={disabled}
        onClick={() => { open ? setOpen(false) : openDropdown() }}
        onKeyDown={open ? handleDropdownKeyDown : handleTriggerKeyDown}
      >
        <span className="cf-select-label">{displayLabel}</span>
        <ChevronDownIcon
          className={`cf-select-chevron${open ? ' cf-select-chevron--open' : ''}`}
          aria-hidden="true"
        />
      </button>

      {open && dropdownPos && createPortal(
        <div
          ref={dropdownRef}
          role="listbox"
          className="cf-select-dropdown"
          aria-label={ariaLabel}
          style={{ top: dropdownPos.top, left: dropdownPos.left, minWidth: dropdownPos.width }}
        >
          {options.map((opt, i) => (
            <div
              key={opt.value}
              id={`${selectId}-option-${i}`}
              role="option"
              className={
                'cf-select-option'
                + (i === highlightIndex ? ' cf-select-option--highlighted' : '')
                + (opt.value === value ? ' cf-select-option--selected' : '')
              }
              aria-selected={opt.value === value}
              onMouseEnter={() => setHighlightIndex(i)}
              onMouseDown={e => { e.preventDefault(); selectOption(opt.value) }}
            >
              <span className="cf-select-option-label">{opt.label}</span>
              {opt.value === value && (
                <CheckIcon className="cf-select-check" aria-hidden="true" />
              )}
            </div>
          ))}
        </div>,
        document.body
      )}
    </div>
  )
}
