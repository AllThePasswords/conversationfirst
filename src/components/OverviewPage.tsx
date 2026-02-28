import Hero from './Hero'
import VoiceRules from './VoiceRules'
import ProcessingDemo from './ProcessingDemo'
import CitationDemo from './CitationDemo'
import ResponseDemo from './ResponseDemo'
import InlineFormsDemo from './InlineFormsDemo'
import ComponentShowcase from './ComponentShowcase'
import Configurator from './Configurator'
import Footer from './Footer'
import ThemePresetBar from './ThemePresetBar'

export default function OverviewPage() {
  return (
    <div className="overview-page">
      <ThemePresetBar />
      <div className="page">
        <Hero />
        <VoiceRules />
        <ProcessingDemo />
        <CitationDemo />
        <ResponseDemo />
        <InlineFormsDemo />
        <ComponentShowcase />
        <Configurator />
        <Footer />
      </div>
    </div>
  )
}
