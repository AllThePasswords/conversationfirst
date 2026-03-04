export default function ResponseDemo() {
  return (
    <>
      {/* --- Legibility & rhythm --- */}
      <h3 style={{ marginTop: 0, fontSize: 'var(--text-lg)' }}>Legibility and rhythm</h3>

      <div className="chat-bubble" style={{ marginBottom: 'var(--space-10)' }}>
        <p>
          Every response is a page the reader never asked to visit. They arrived with a question and want to leave with an answer — the typography should never slow them down. Legibility isn't decoration. It's the difference between a response that gets read and one that gets skimmed past.
        </p>
        <p>
          Spacing is the primary tool. Paragraphs need enough air between them that the eye can reset, but not so much that the content feels fragmented. The system uses a 2:1 ratio — paragraph gaps are roughly twice the inter-line gap — which gives each block its own shape without breaking the vertical flow. Headings bind downward to the content they introduce, pulling tighter below than above, so the reader always knows what belongs together.
        </p>
        <p>
          Line length matters just as much. Prose is capped at a comfortable measure so the eye can track back to the start of the next line without losing its place. Code blocks break out of this constraint because developers expect to scan horizontally, but body text never does. Lists tighten their internal spacing so items feel like a single unit, not a scattered collection of bullets.
        </p>
        <p style={{ marginBottom: 0 }}>
          The goal is invisible structure. When the rhythm is right, the reader doesn't notice the typography — they just understand the answer faster. Every spacing token, line-height value, and wrapping rule in this system exists to protect that experience.
        </p>
      </div>

      {/* --- Rich content --- */}
      <h3 style={{ fontSize: 'var(--text-lg)' }}>Rich response — headings, code, lists</h3>

      <div className="chat-bubble" style={{ marginBottom: 'var(--space-10)' }}>
        <h3 style={{ marginTop: 0 }}>Database connection pooling</h3>
        <p>
          Connection pools reuse open connections instead of creating new ones for each query. This reduces latency and prevents exhausting database limits.
        </p>
        <p>
          Configure the pool size based on your workload:
        </p>
        <div className="code-block-wrapper">
          <div className="code-block-header">
            <span className="code-block-lang">javascript</span>
            <button className="code-copy-btn" type="button" aria-label="Copy code">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
              </svg>
              <span className="code-copy-label">Copy</span>
            </button>
          </div>
          <pre><code className="language-javascript">{`const pool = new Pool({
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});`}</code></pre>
        </div>
        <p>
          Key parameters:
        </p>
        <ul>
          <li><strong>max</strong> — maximum connections. Start with <code>2× CPU cores</code>.</li>
          <li><strong>idleTimeoutMillis</strong> — close idle connections after this duration.</li>
          <li><strong>connectionTimeoutMillis</strong> — fail fast if a connection cannot be acquired.</li>
        </ul>
        <p style={{ marginBottom: 0 }}>
          Monitor pool utilisation in production. If wait times exceed 50ms, increase the pool size or optimise slow queries.
        </p>
      </div>

      {/* --- Typography rules --- */}
      <h3 style={{ fontSize: 'var(--text-lg)' }}>Typography rules</h3>

      <div style={{ display: 'grid', gap: 'var(--space-2)', marginBottom: 'var(--space-10)' }}>
        {[
          'Body font-size: var(--text-base) (1rem / 16px) — minimum for serif legibility',
          'Body line-height: 1.5 · Headings: 1.3 · UI labels: 1.4',
          'text-wrap: pretty on prose, balance on headings',
          'Paragraph spacing: var(--paragraph-spacing) (0.5em) — 2:1 ratio to inter-line gap',
          'Headings bind to following content — tighter below than above',
          'List items use 4px padding, not margin — pull up 0.125em after paragraphs',
        ].map((rule, i) => (
          <div key={i} style={{
            fontSize: 'var(--text-sm)',
            color: 'var(--text-secondary)',
            padding: 'var(--space-2) var(--space-4)',
            background: 'var(--surface)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-md)',
            display: 'flex',
            gap: 'var(--space-2)',
            alignItems: 'baseline',
          }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--accent)', fontWeight: 600 }}>✓</span>
            {rule}
          </div>
        ))}
      </div>

      {/* --- Do / Don't --- */}
      <h3 style={{ fontSize: 'var(--text-lg)' }}>Correct vs. incorrect</h3>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)', gridTemplateRows: 'auto 1fr auto', columnGap: 'var(--space-4)', rowGap: 'var(--space-2)', marginBottom: 'var(--space-10)' }}>
        <h4 style={{ marginTop: 0, marginBottom: 0 }}>Correct</h4>
        <h4 style={{ marginTop: 0, marginBottom: 0 }}>Incorrect</h4>

        <div className="chat-bubble" style={{ fontSize: 'var(--text-sm)' }}>
          <p>
            The deployment failed because the health check endpoint returns 503 during cold starts. The container needs 4.2 seconds to initialise, but the load balancer timeout is set to 3 seconds.
          </p>
          <p style={{ marginBottom: 0 }}>
            Increase the health check grace period to 10 seconds in your task definition. This gives the container time to warm up before traffic arrives.
          </p>
        </div>
        <div className="chat-bubble" style={{ fontSize: 'var(--text-sm)', opacity: 0.7, borderStyle: 'dashed', padding: 'var(--space-4) var(--space-5)' }}>
          <p style={{ marginBottom: 0, maxWidth: 'none' }}>
            The deployment failed because the health check endpoint returns 503 during cold starts because the container needs 4.2 seconds to initialise but the load balancer timeout is set to 3 seconds so you should increase the health check grace period to 10 seconds in your task definition which gives the container time to warm up before traffic arrives and then the health checks will pass and the deployment will succeed and your users will not see any downtime during deployments anymore.
          </p>
        </div>

        <p style={{
          fontSize: 'var(--text-xs)',
          color: 'var(--text-muted)',
          padding: 'var(--space-3) var(--space-4)',
          background: 'var(--surface)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-md)',
          margin: 0,
        }}>
          Two clear paragraphs. No orphans. Natural reading rhythm.
        </p>
        <p style={{
          fontSize: 'var(--text-xs)',
          color: 'var(--text-muted)',
          padding: 'var(--space-3) var(--space-4)',
          background: 'var(--destructive-subtle)',
          border: '1px solid color-mix(in srgb, var(--destructive) 15%, transparent)',
          borderRadius: 'var(--radius-md)',
          margin: 0,
        }}>
          Single run-on paragraph. No structure. Eye loses its place.
        </p>
      </div>

      {/* --- User bubble rules --- */}
      <h3 style={{ fontSize: 'var(--text-lg)' }}>User messages</h3>

      <div style={{ marginBottom: 'var(--space-4)' }}>
        <div className="chat-bubble user">
          <p style={{ marginBottom: 0 }}>Why is the deploy timing out?</p>
        </div>
      </div>

      <div style={{ display: 'grid', gap: 'var(--space-2)', marginBottom: 'var(--space-10)' }}>
        {[
          'Right-aligned, max-width 85%',
          'Background: color-mix(in srgb, var(--text) 6%, var(--bg)) — always filled to distinguish from page',
          'Plain text default — pasted markdown preserved',
          'Same padding and border-radius as response bubbles',
          'Images render inline above text',
          'No citations or footers',
        ].map((rule, i) => (
          <div key={i} style={{
            fontSize: 'var(--text-sm)',
            color: 'var(--text-secondary)',
            padding: 'var(--space-2) var(--space-4)',
            background: 'var(--surface)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-md)',
            display: 'flex',
            gap: 'var(--space-2)',
            alignItems: 'baseline',
          }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--accent)', fontWeight: 600 }}>✓</span>
            {rule}
          </div>
        ))}
      </div>

      {/* --- Response rules summary --- */}
      <h3 style={{ fontSize: 'var(--text-lg)' }}>Response rules</h3>
      <div style={{ display: 'grid', gap: 'var(--space-2)' }}>
        {[
          'Font size: var(--text-base) (1rem) — explicit on .chat-bubble',
          'Line height: 1.5 for body, 1.3 for headings',
          'Paragraph spacing: var(--paragraph-spacing) (0.5em) — 2:1 vs inter-line gap',
          'text-wrap: pretty on prose, balance on headings',
          'Last paragraph in bubble has no bottom margin',
          'Code blocks use full available width',
          'Headings bind to following content, not preceding',
          'Lists pull up 0.125em when following a paragraph',
          'List items use 4px padding, not margin',
          'Last list/blockquote in bubble drops bottom margin',
          'Code blocks tighten to 0 top margin after paragraphs',
          'No horizontal scrolling — code blocks scroll independently',
        ].map((rule, i) => (
          <div key={i} style={{
            fontSize: 'var(--text-sm)',
            color: 'var(--text-secondary)',
            padding: 'var(--space-2) var(--space-4)',
            background: 'var(--surface)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-md)',
            display: 'flex',
            gap: 'var(--space-2)',
            alignItems: 'baseline',
          }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--accent)', fontWeight: 600 }}>✓</span>
            {rule}
          </div>
        ))}
      </div>
    </>
  );
}
