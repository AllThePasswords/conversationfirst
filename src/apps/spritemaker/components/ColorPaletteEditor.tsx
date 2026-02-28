import { useRef } from 'react'
import { PlusIcon, XMarkIcon } from '@heroicons/react/20/solid'

interface ColorPaletteEditorProps {
  colors: string[]
  onChange: (colors: string[]) => void
}

export default function ColorPaletteEditor({ colors, onChange }: ColorPaletteEditorProps) {
  const pickerRef = useRef<HTMLInputElement>(null)

  function addColor() {
    if (pickerRef.current) {
      pickerRef.current.click()
    }
  }

  function handlePickerChange(e: React.ChangeEvent<HTMLInputElement>) {
    const hex = e.target.value
    if (!colors.includes(hex)) {
      onChange([...colors, hex])
    }
  }

  function updateColor(index: number, hex: string) {
    const next = [...colors]
    next[index] = hex
    onChange(next)
  }

  function removeColor(index: number) {
    onChange(colors.filter((_, i) => i !== index))
  }

  return (
    <div className="sm-palette">
      {colors.map((color, i) => (
        <div key={i} className="sm-palette-swatch-wrap">
          <input
            type="color"
            value={color}
            onChange={e => updateColor(i, e.target.value)}
            className="sm-palette-input"
            aria-label={`Color ${i + 1}: ${color}`}
          />
          <div
            className="sm-palette-swatch"
            style={{ backgroundColor: color }}
          />
          <button
            className="sm-palette-remove"
            onClick={() => removeColor(i)}
            aria-label={`Remove color ${color}`}
          >
            <XMarkIcon aria-hidden="true" />
          </button>
          <span className="sm-palette-hex">{color}</span>
        </div>
      ))}
      <button className="sm-palette-add" onClick={addColor} aria-label="Add color">
        <PlusIcon aria-hidden="true" />
      </button>
      <input
        ref={pickerRef}
        type="color"
        className="sm-hidden-picker"
        onChange={handlePickerChange}
        aria-hidden="true"
        tabIndex={-1}
      />
    </div>
  )
}
