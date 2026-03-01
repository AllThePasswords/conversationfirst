export default function ResponseDemo() {
  return (
    <>
      {/* --- Anatomy --- */}
      <h3 style={{ marginTop: 0, fontSize: 'var(--text-lg)' }}>Response anatomy</h3>

      <div className="chat-bubble" style={{ position: 'relative' }}>
        <p>
          Net revenue retention reached 124% in Q3, up from 118% in Q2<a className="cite-inline" href="#" onClick={e => e.preventDefault()} title="Q3 Financial Report">1</a>. The improvement came from expansion revenue in mid-market accounts.
        </p>
        <p>
          Three factors drove the increase:
        </p>
        <ol>
          <li>Average contract value grew 31% as customers adopted premium tiers.</li>
          <li>Churn dropped to 1.8% monthly, down from 2.4% the prior quarter.</li>
          <li>Usage-based billing captured 12% more per-seat revenue on average.</li>
        </ol>
        <p style={{ marginBottom: 0 }}>
          This puts the company well above the SaaS industry median of 110%<a className="cite-inline" href="#" onClick={e => e.preventDefault()} title="OpenView SaaS Benchmarks 2025">2</a>.
        </p>

        <div className="cite-footer">
          <div className="cite-footer-title">Sources</div>
          <ul className="cite-footer-list">
            <li className="cite-footer-item">
              <a className="cite-footer-link" href="#" onClick={e => e.preventDefault()}>
                <span className="cite-inline">1</span>
                Q3 Financial Report
                <span className="cite-footer-source">· Google Drive</span>
              </a>
            </li>
            <li className="cite-footer-item">
              <a className="cite-footer-link" href="#" onClick={e => e.preventDefault()}>
                <span className="cite-inline">2</span>
                OpenView SaaS Benchmarks 2025
                <span className="cite-footer-source">· Web</span>
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div style={{ display: 'grid', gap: 'var(--space-2)', marginTop: 'var(--space-4)', marginBottom: 'var(--space-10)' }}>
        {[
          { label: 'Body', desc: 'Prose, lists, code, headings — all subject to rhythm rules' },
          { label: 'Sources', desc: 'Footer citations separated by a top border — clickable rows' },
        ].map((item, i) => (
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
            <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{item.label}</span>
            {item.desc}
          </div>
        ))}
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

      <div className="grid-2" style={{ gap: 'var(--space-4)', marginBottom: 'var(--space-10)' }}>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <h4 style={{ marginTop: 0 }}>Correct</h4>
          <div className="chat-bubble" style={{ fontSize: 'var(--text-sm)', flex: 1 }}>
            <p>
              The deployment failed because the health check endpoint returns 503 during cold starts. The container needs 4.2 seconds to initialise, but the load balancer timeout is set to 3 seconds.
            </p>
            <p style={{ marginBottom: 0 }}>
              Increase the health check grace period to 10 seconds in your task definition. This gives the container time to warm up before traffic arrives.
            </p>
          </div>
          <p style={{
            fontSize: 'var(--text-xs)',
            color: 'var(--text-muted)',
            padding: 'var(--space-3) var(--space-4)',
            background: 'var(--surface)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-md)',
          }}>
            Two clear paragraphs. No orphans. Natural reading rhythm.
          </p>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <h4 style={{ marginTop: 0 }}>Incorrect</h4>
          <div className="chat-bubble" style={{ fontSize: 'var(--text-sm)', opacity: 0.7, borderStyle: 'dashed', flex: 1 }}>
            <p style={{ marginBottom: 0, maxWidth: 'none' }}>
              The deployment failed because the health check endpoint returns 503 during cold starts because the container needs 4.2 seconds to initialise but the load balancer timeout is set to 3 seconds so you should increase the health check grace period to 10 seconds in your task definition which gives the container time to warm up before traffic arrives and then the health checks will pass and the deployment will succeed and your users will not see any downtime during deployments anymore.
            </p>
          </div>
          <p style={{
            fontSize: 'var(--text-xs)',
            color: 'var(--text-muted)',
            padding: 'var(--space-3) var(--space-4)',
            background: 'var(--destructive-subtle)',
            border: '1px solid color-mix(in srgb, var(--destructive) 15%, transparent)',
            borderRadius: 'var(--radius-md)',
          }}>
            Single run-on paragraph. No structure. Eye loses its place.
          </p>
        </div>
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
