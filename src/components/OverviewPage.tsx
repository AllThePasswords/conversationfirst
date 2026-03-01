import { useState } from 'react'
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

type Tab = 'spec' | 'configure'

export default function OverviewPage() {
  const [activeTab, setActiveTab] = useState<Tab>('spec')

  return (
    <div className="overview-page">
      <ThemePresetBar />
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
        </div>

        {/* ── Design Spec panel ── */}
        {activeTab === 'spec' && (
          <div
            className="ds-panel"
            role="tabpanel"
            id="ds-panel-spec"
            aria-labelledby="ds-tab-spec"
          >
            <SectionAccordion id="voice" title="Voice & behaviour" explainer="7 mandatory rules that govern every response.">
              <VoiceRules />
            </SectionAccordion>

            <SectionAccordion id="processing" title="Processing states" explainer="Typography-only loading indicators. No spinners.">
              <ProcessingDemo />
            </SectionAccordion>

            <SectionAccordion id="citations" title="Citation system" explainer="Three citation formats. Every claim has a clickable source.">
              <CitationDemo />
            </SectionAccordion>

            <SectionAccordion id="chat-input" title="Chat input" explainer="The primary interaction surface. Attach menu, voice waveform, auto-send.">
              <ChatInputDemo />
            </SectionAccordion>

            <SectionAccordion id="responses" title="Responses" explainer="Anatomy, rhythm and legibility rules for every response message.">
              <ResponseDemo />
            </SectionAccordion>

            <SectionAccordion id="lists" title="Lists" explainer="Bullets, numbers and nesting with tight rhythm and distinct markers.">
              <ListDemo />
            </SectionAccordion>

            <SectionAccordion id="tables" title="Tables" explainer="Structured data inside chat bubbles. Auto-styled from GFM markdown.">
              <TableDemo />
            </SectionAccordion>

            <SectionAccordion id="inline-forms" title="Inline forms & actions" explainer="Collecting input and confirmation inside chat response bubbles.">
              <InlineFormsDemo />
            </SectionAccordion>

            <SectionAccordion id="icons" title="Icons" explainer="Heroicons v2 — outline for UI chrome, solid for compact indicators. One library, consistent sizing.">
              <IconDemo />
            </SectionAccordion>

            <SectionAccordion id="components" title="App components" explainer="Buttons, badges, alerts, cards, forms and navigation — all tokens, no custom values.">
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
