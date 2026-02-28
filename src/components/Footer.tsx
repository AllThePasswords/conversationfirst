export default function Footer() {
  return (
    <footer style={{
      borderTop: '1px solid var(--border)',
      paddingTop: 'var(--space-8)',
      marginTop: 'var(--space-12)',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'baseline',
      flexWrap: 'wrap',
      gap: 'var(--space-4)',
    }}>
      <div>
        <div style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: 'var(--text-base)', marginBottom: 'var(--space-1)' }}>
          Conversation First
        </div>
        <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>
          A design system for AI chat interfaces.
        </div>
      </div>
      <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>
        Created by <a href="https://ericgreene.ie" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--text-secondary)', textDecoration: 'underline', textUnderlineOffset: 2 }}>Eric Greene</a>
      </div>
    </footer>
  );
}
