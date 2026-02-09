import { useState, useEffect } from 'react';
import Hero from './components/Hero';
import VoiceRules from './components/VoiceRules';
import ProcessingDemo from './components/ProcessingDemo';
import CitationDemo from './components/CitationDemo';
import ComponentShowcase from './components/ComponentShowcase';
import Configurator from './components/Configurator';
import Footer from './components/Footer';
import ChatPage from './components/ChatPage';

export default function App() {
  const [route, setRoute] = useState(window.location.hash);

  useEffect(() => {
    const onHash = () => setRoute(window.location.hash);
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  if (route === '#/chat') {
    return <ChatPage />;
  }

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
