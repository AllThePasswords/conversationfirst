import { useState, useRef, useEffect } from 'react'
import Hero from './Hero'
import Configurator from './Configurator'
import SectionAccordion from './SectionAccordion'
import VoiceRules from './VoiceRules'
import ProcessingDemo from './ProcessingDemo'
import CitationDemo from './CitationDemo'
import ResponseDemo from './ResponseDemo'
import ListDemo from './ListDemo'
import TableDemo from './TableDemo'
import InlineFormsDemo from './InlineFormsDemo'
import ComponentShowcase from './ComponentShowcase'
import IconDemo from './IconDemo'
import ChatInputDemo from './ChatInputDemo'
import Footer from './Footer'
import ThemePresetBar from './ThemePresetBar'

import {
  ChatBubbleBottomCenterTextIcon,
  ArrowPathIcon,
  BookmarkIcon,
  ChatBubbleOvalLeftIcon,
  DocumentTextIcon,
  ListBulletIcon,
  TableCellsIcon,
  PencilSquareIcon,
  SwatchIcon,
  CubeIcon,
} from '@heroicons/react/24/outline'
type Tab = 'spec' | 'configure'

export default function OverviewPage() {
  const [activeTab, setActiveTab] = useState<Tab>('spec')
  const scrollRef = useRef<HTMLDivElement>(null)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const el = scrollRef.current
    if (!el) return
    const onScroll = () => setScrolled(el.scrollTop > 20)
    el.addEventListener('scroll', onScroll, { passive: true })
    return () => el.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div className="overview-page" ref={scrollRef}>
      <div className="page">
        <Hero />

        {/* ── Master tabs ── */}
        <div className="ds-tabs" role="tablist" aria-label="Design system sections">
          <button
            className={`ds-tab${activeTab === 'spec' ? ' ds-tab--active' : ''}`}
            role="tab"
            aria-selected={activeTab === 'spec'}
            aria-controls="ds-panel-spec"
            id="ds-tab-spec"
            onClick={() => setActiveTab('spec')}
          >
            Design Spec
          </button>
          <button
            className={`ds-tab${activeTab === 'configure' ? ' ds-tab--active' : ''}`}
            role="tab"
            aria-selected={activeTab === 'configure'}
            aria-controls="ds-panel-configure"
            id="ds-tab-configure"
            onClick={() => setActiveTab('configure')}
          >
            Configure
          </button>
          <div className="ds-tabs-spacer" />
          <ThemePresetBar />
        </div>

        {/* ── Design Spec panel ── */}
        {activeTab === 'spec' && (
          <div
            className="ds-panel"
            role="tabpanel"
            id="ds-panel-spec"
            aria-labelledby="ds-tab-spec"
          >
            <SectionAccordion id="voice" title="Voice & behaviour" explainer="8 rules that govern every response." icon={ChatBubbleBottomCenterTextIcon}>
              <VoiceRules />
            </SectionAccordion>

            <SectionAccordion id="processing" title="Processing states" explainer="Typography-only loading indicators. No spinners." icon={ArrowPathIcon}>
              <ProcessingDemo />
            </SectionAccordion>

            <SectionAccordion id="citations" title="Citation system" explainer="Three formats. Every claim links to its source." icon={BookmarkIcon}>
              <CitationDemo />
            </SectionAccordion>

            <SectionAccordion id="chat-input" title="Chat input" explainer="Compose, attach, dictate and send." icon={ChatBubbleOvalLeftIcon}>
              <ChatInputDemo />
            </SectionAccordion>

            <SectionAccordion id="responses" title="Responses" explainer="Anatomy and legibility rules for response text." icon={DocumentTextIcon}>
              <ResponseDemo />
            </SectionAccordion>

            <SectionAccordion id="lists" title="Lists" explainer="Bullets, numbers and nesting with tight rhythm." icon={ListBulletIcon}>
              <ListDemo />
            </SectionAccordion>

            <SectionAccordion id="tables" title="Tables" explainer="Structured data in bubbles. Auto-styled from markdown." icon={TableCellsIcon}>
              <TableDemo />
            </SectionAccordion>

            <SectionAccordion id="inline-forms" title="Inline forms & actions" explainer="Input and confirmation inside response bubbles." icon={PencilSquareIcon}>
              <InlineFormsDemo />
            </SectionAccordion>

            <SectionAccordion id="icons" title="Icons" explainer="Heroicons v2 outline and solid. One library, one size." icon={SwatchIcon}>
              <IconDemo />
            </SectionAccordion>

            <SectionAccordion id="components" title="App components" explainer="Buttons, badges, alerts, cards and forms. All tokens." icon={CubeIcon}>
              <ComponentShowcase />
            </SectionAccordion>
          </div>
        )}

        {/* ── Configure panel ── */}
        {activeTab === 'configure' && (
          <div
            className="ds-panel"
            role="tabpanel"
            id="ds-panel-configure"
            aria-labelledby="ds-tab-configure"
          >
            <Configurator />
          </div>
        )}

        <Footer />
      </div>
    </div>
  )
}
