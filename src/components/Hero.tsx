export default function Hero() {
  return (
    <div className="section" style={{ marginBottom: 'var(--space-12)' }}>
      <div style={{ fontSize: 'var(--text-xs)', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-muted)', fontWeight: 500, marginBottom: 'var(--space-3)' }}>
        Design system for AI chat interfaces
      </div>
      <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: 'var(--text-2xl)', fontWeight: 700, letterSpacing: '-0.02em', lineHeight: 1.15, marginBottom: 'var(--space-4)', marginTop: 0 }}>
        Conversation First
      </h1>
      <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-base)', lineHeight: 1.5, marginBottom: 'var(--space-6)' }}>
        A complete design system for conversational AI: typography, colour, shape, voice rules, processing states, citations, and a full component library. All configurable to your brand and ready to export.
      </p>
      <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-sm)', marginBottom: 0 }}>
        Choose your typefaces, accent and background colours, and button shapes, then download a production-ready spec, an interactive test page, or integration files for Claude, AI prompts, and slash commands. WCAG 2.1 AA compliant by default.
      </p>
    </div>
  );
}
