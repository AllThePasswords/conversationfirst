import { useState } from 'react'

interface SectionAccordionProps {
  id: string
  title: string
  explainer: string
  defaultOpen?: boolean
  children: React.ReactNode
}

export default function SectionAccordion({ id, title, explainer, defaultOpen = false, children }: SectionAccordionProps) {
  const [open, setOpen] = useState(defaultOpen)
  const headingId = `${id}-heading`
  const contentId = `${id}-content`

  return (
    <section className="section-accordion" id={id} data-open={open} aria-labelledby={headingId}>
      <h2 className="section-accordion-header" id={headingId}>
        <button
          className="section-accordion-trigger"
          onClick={() => setOpen(!open)}
          aria-expanded={open}
          aria-controls={contentId}
        >
          <div className="section-accordion-text">
            <span className="section-accordion-title">{title}</span>
            <span className="section-accordion-explainer">{explainer}</span>
          </div>
          <span className="section-accordion-chevron" aria-hidden="true">&#x25B8;</span>
        </button>
      </h2>
      <div
        className="section-accordion-body"
        id={contentId}
        role="region"
        aria-labelledby={headingId}
      >
        <div className="section-accordion-inner">
          {children}
        </div>
      </div>
    </section>
  )
}
