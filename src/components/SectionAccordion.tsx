import { useState } from 'react'
import { ChevronRightIcon } from '@heroicons/react/24/outline'

interface SectionAccordionProps {
  id: string
  title: string
  explainer: string
  icon?: React.ComponentType<React.SVGProps<SVGSVGElement>>
  defaultOpen?: boolean
  children: React.ReactNode
}

export default function SectionAccordion({ id, title, explainer, icon: Icon, defaultOpen = false, children }: SectionAccordionProps) {
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
          {Icon && (
            <span className="section-accordion-icon" aria-hidden="true">
              <Icon width={28} height={28} />
            </span>
          )}
          <div className="section-accordion-text">
            <span className="section-accordion-title">{title}</span>
            <span className="section-accordion-explainer">{explainer}</span>
          </div>
          <ChevronRightIcon className="section-accordion-chevron" width={20} height={20} aria-hidden="true" />
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
