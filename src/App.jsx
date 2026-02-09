import Hero from './components/Hero';
import VoiceRules from './components/VoiceRules';
import ProcessingDemo from './components/ProcessingDemo';
import CitationDemo from './components/CitationDemo';
import ComponentShowcase from './components/ComponentShowcase';
import Configurator from './components/Configurator';
import Footer from './components/Footer';

export default function App() {
  return (
    <div className="page">
      <Hero />
      <VoiceRules />
      <ProcessingDemo />
      <CitationDemo />
      <ComponentShowcase />
      <Configurator />
      <Footer />
    </div>
  );
}
