export default function Hero() {
  function scrollTo(e, id) {
    e.preventDefault();
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  }

  return (
    <div className="section" style={{ marginBottom: 'var(--space-12)', paddingBottom: 'var(--space-8)', borderBottom: '1px solid var(--border)' }}>
      <div style={{ fontSize: 'var(--text-xs)', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-muted)', fontWeight: 500, marginBottom: 'var(--space-3)' }}>
        Design system for AI chat interfaces
      </div>
      <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: 'var(--text-3xl)', fontWeight: 700, letterSpacing: '-0.03em', lineHeight: 1.15, marginBottom: 'var(--space-4)', marginTop: 0 }}>
        Conversation First
      </h1>
      <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-lg)', maxWidth: 560, lineHeight: 1.5, marginBottom: 'var(--space-6)' }}>
        The AI is a computer. Not a person, not an assistant, not a helper. A computer with deep capabilities behind an elegant conversational interface.
      </p>
      <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-base)', maxWidth: 560, marginBottom: 'var(--space-8)' }}>
        Three typeface decisions. Everything else is fixed. Voice rules, design tokens, citation system, processing states, and a complete component library. WCAG 2.1 AA compliant.
      </p>
      <div style={{ display: 'flex', gap: 'var(--space-3)', flexWrap: 'wrap' }}>
        <a href="#/chat?new" className="btn btn-primary" style={{ textDecoration: 'none' }}>
          Try the chat
        </a>
        <a href="#configurator" className="btn btn-secondary" style={{ textDecoration: 'none' }} onClick={(e) => scrollTo(e, 'configurator')}>
          Configure your spec
        </a>
        <a href="#voice" className="btn btn-ghost" style={{ textDecoration: 'none' }} onClick={(e) => scrollTo(e, 'voice')}>
          Read the rules
        </a>
      </div>
    </div>
  );
}
