import { useRef, useEffect, useState } from 'react'

interface TypoMetrics {
  capHeight: number
  xHeight: number
  baseline: number
}

function measureTypoMetrics(el: HTMLElement): TypoMetrics | null {
  const style = getComputedStyle(el)
  const fontSize = parseFloat(style.fontSize)
  const lh = parseFloat(style.lineHeight)
  const lineHeight = Number.isFinite(lh) ? lh : fontSize * 1.15

  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')
  if (!ctx) return null

  ctx.font = `${style.fontWeight} ${fontSize}px ${style.fontFamily}`

  const tm = ctx.measureText('Hx')
  const fontAscent = tm.fontBoundingBoxAscent
  const fontDescent = tm.fontBoundingBoxDescent
  const contentArea = fontAscent + fontDescent
  const halfLeading = (lineHeight - contentArea) / 2

  const baseline = halfLeading + fontAscent
  const capHeight = baseline - ctx.measureText('H').actualBoundingBoxAscent
  const xHeight = baseline - ctx.measureText('x').actualBoundingBoxAscent

  return { capHeight, xHeight, baseline }
}

export default function Hero() {
  const h1Ref = useRef<HTMLHeadingElement>(null)
  const kickerRef = useRef<HTMLDivElement>(null)
  const [metrics, setMetrics] = useState<TypoMetrics | null>(null)
  const [kickerMetrics, setKickerMetrics] = useState<TypoMetrics | null>(null)

  useEffect(() => {
    const measure = () => {
      if (h1Ref.current) {
        const m = measureTypoMetrics(h1Ref.current)
        if (m) setMetrics(m)
      }
      if (kickerRef.current) {
        const km = measureTypoMetrics(kickerRef.current)
        if (km) setKickerMetrics(km)
      }
    }

    measure()
    // Re-measure after web fonts finish loading
    document.fonts.ready.then(measure)
    // Re-measure when theme changes (Configurator updates style on <html>)
    const observer = new MutationObserver(measure)
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['style'],
    })
    return () => observer.disconnect()
  }, [])

  return (
    <div className="section" style={{ marginBottom: 'var(--space-12)' }}>
      <div style={{ position: 'relative' }}>
        <div ref={kickerRef} style={{ fontSize: 'var(--text-xs)', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-muted)', fontWeight: 500, marginBottom: 'var(--space-3)' }}>
          Design system for AI chat interfaces
        </div>
        {kickerMetrics && (
          <div aria-hidden="true" style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'visible' }}>
            <div className="typo-guide" style={{ top: kickerMetrics.capHeight }}>
              <span className="typo-guide-label">cap height</span>
            </div>
            <div className="typo-guide" style={{ top: kickerMetrics.baseline }}>
              <span className="typo-guide-label">baseline</span>
            </div>
          </div>
        )}
      </div>
      <div style={{ position: 'relative' }}>
        <h1 ref={h1Ref} style={{ fontFamily: 'var(--font-heading)', fontSize: 'var(--text-2xl)', fontWeight: 700, letterSpacing: '-0.02em', lineHeight: 1.15, marginBottom: 'var(--space-4)', marginTop: 0 }}>
          Conversation First
        </h1>
        {metrics && (
          <div aria-hidden="true" style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'visible' }}>
            <div className="typo-guide" style={{ top: metrics.capHeight }}>
              <span className="typo-guide-label">cap height</span>
            </div>
            <div className="typo-guide" style={{ top: metrics.xHeight }}>
              <span className="typo-guide-label">x-height</span>
            </div>
            <div className="typo-guide" style={{ top: metrics.baseline }}>
              <span className="typo-guide-label">baseline</span>
            </div>
          </div>
        )}
      </div>
      <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-base)', lineHeight: 1.5, marginBottom: 'var(--space-6)' }}>
        A complete design system for conversational AI: typography, colour, shape, voice rules, processing states, citations, and a full component library. All configurable to your brand and ready to export.
      </p>
      <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-sm)', marginBottom: 'var(--space-6)' }}>
        Choose your typefaces, accent and background colours, and button shapes, then download a production-ready spec, an interactive test page, or integration files for Claude, AI prompts, and slash commands. WCAG 2.1 AA compliant by default.
      </p>

    </div>
  );
}
