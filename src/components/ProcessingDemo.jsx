export default function ProcessingDemo() {
  return (
    <section className="section" id="processing" aria-labelledby="processing-heading">
      <h2 className="section-label" id="processing-heading">Processing states — typography only, no spinners</h2>

      <h3 style={{ marginTop: 0 }}>Minimal — cursor only</h3>
      <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', marginBottom: 'var(--space-3)' }}>
        For fast responses under 2 seconds.
      </p>
      <div className="chat-bubble">
        <div className="bubble-label">Assistant</div>
        <div className="processing processing-minimal">
          <div className="processing-status">
            <div className="processing-cursor"></div>
          </div>
        </div>
      </div>

      <h3>Standard — status text</h3>
      <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', marginBottom: 'var(--space-3)' }}>
        Typical responses. Monospace status with animated dots.
      </p>
      <div className="chat-bubble">
        <div className="bubble-label">Assistant</div>
        <div className="processing">
          <div className="processing-status">
            <div className="processing-cursor"></div>
            <div className="processing-text">Processing<span className="dot">.</span><span className="dot">.</span><span className="dot">.</span></div>
          </div>
        </div>
      </div>

      <h3>Detailed — with context</h3>
      <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', marginBottom: 'var(--space-3)' }}>
        Complex queries. Shows what the system is doing.
      </p>
      <div className="chat-bubble">
        <div className="bubble-label">Assistant</div>
        <div className="processing">
          <div className="processing-status">
            <div className="processing-cursor"></div>
            <div className="processing-text">Searching 3 documents<span className="dot">.</span><span className="dot">.</span><span className="dot">.</span></div>
          </div>
          <div className="processing-line"></div>
          <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
            <div style={{ marginBottom: 2 }}>✓ Q3 Financial Report</div>
            <div style={{ marginBottom: 2 }}>✓ SaaS Benchmarks 2025</div>
            <div style={{ animation: 'breathe 1.5s ease-in-out infinite' }}>◇ Sales Pipeline Dashboard</div>
          </div>
        </div>
      </div>

      <h3>Skeleton — content preview</h3>
      <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', marginBottom: 'var(--space-3)' }}>
        Long responses. Shows the shape of incoming content.
      </p>
      <div className="chat-bubble">
        <div className="bubble-label">Assistant</div>
        <div className="processing">
          <div className="processing-status">
            <div className="processing-cursor"></div>
            <div className="processing-text">Composing response<span className="dot">.</span><span className="dot">.</span><span className="dot">.</span></div>
          </div>
          <div className="processing-skeleton">
            <div className="skeleton-line" style={{ width: '45%', height: 16, marginBottom: 'var(--space-3)' }}></div>
            <div className="skeleton-line" style={{ width: '100%' }}></div>
            <div className="skeleton-line" style={{ width: '92%' }}></div>
            <div className="skeleton-line" style={{ width: '78%' }}></div>
            <div className="skeleton-line" style={{ width: '85%', marginBottom: 'var(--space-4)' }}></div>
            <div className="skeleton-line" style={{ width: '35%', height: 14, marginBottom: 'var(--space-2)' }}></div>
            <div className="skeleton-line" style={{ width: '100%' }}></div>
            <div className="skeleton-line" style={{ width: '65%' }}></div>
          </div>
        </div>
      </div>

      <h3>Inline — mid-stream</h3>
      <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', marginBottom: 'var(--space-3)' }}>
        Text streaming in, model still generating.
      </p>
      <div className="chat-bubble">
        <div className="bubble-label">Assistant</div>
        <p>
          Revenue grew 18% quarter-over-quarter, reaching $4.2M<a className="cite-inline" href="#" onClick={e => e.preventDefault()} title="Q3 Financial Report">1</a>. This outpaces the industry median
          <span style={{ display: 'inline-block', width: 2, height: 16, background: 'var(--accent)', animation: 'cursor-blink 1s ease-in-out infinite', verticalAlign: 'text-bottom', marginLeft: 2, borderRadius: 1 }}></span>
        </p>
      </div>
    </section>
  );
}
