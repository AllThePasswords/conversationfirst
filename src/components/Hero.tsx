export default function Hero() {
  return (
    <div className="section" style={{ marginBottom: 'var(--space-12)' }}>
      <div style={{ fontSize: 'var(--text-xs)', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-muted)', fontWeight: 500, marginBottom: 'var(--space-3)' }}>
        Design system for AI chat interfaces
      </div>
      <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: 'var(--text-3xl)', fontWeight: 700, letterSpacing: '-0.03em', lineHeight: 1.15, marginBottom: 'var(--space-4)', marginTop: 0 }}>
        Conversation First
      </h1>
      <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-lg)', lineHeight: 1.5, marginBottom: 'var(--space-6)' }}>
        A typographic design system for conversational AI experiences. Built on ten years of mobile chat design and two years shaping AI interfaces — grounded in type rules, flexible enough for any brand.
      </p>
      <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-base)', marginBottom: 0 }}>
        Pick three typefaces, choose an accent colour, and preview a complete, WCAG 2.1 AA compliant system — voice rules, design tokens, processing states, citation formats, and a full component library — in a couple of steps.
      </p>
    </div>
  );
}
