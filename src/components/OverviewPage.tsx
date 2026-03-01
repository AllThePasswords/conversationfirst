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
import Footer from './Footer'
import ThemePresetBar from './ThemePresetBar'

export default function OverviewPage() {
  return (
    <div className="overview-page">
      <ThemePresetBar />
      <div className="page">
        <Hero />
        <Configurator />

        <SectionAccordion id="voice" title="Voice & behaviour" explainer="7 mandatory rules that govern every response.">
          <VoiceRules />
        </SectionAccordion>

        <SectionAccordion id="processing" title="Processing states" explainer="Typography-only loading indicators. No spinners.">
          <ProcessingDemo />
        </SectionAccordion>

        <SectionAccordion id="citations" title="Citation system" explainer="Three citation formats. Every claim has a clickable source.">
          <CitationDemo />
        </SectionAccordion>

        <SectionAccordion id="responses" title="Responses" explainer="Anatomy, rhythm and legibility rules for every assistant message.">
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

        <SectionAccordion id="components" title="App components" explainer="Buttons, badges, alerts, cards, forms and navigation — all tokens, no custom values.">
          <ComponentShowcase />
        </SectionAccordion>

        <Footer />
      </div>
    </div>
  )
}
