export default function ResponseDemo() {
  return (
    <section className="section" id="responses" aria-labelledby="responses-heading">
      <h2 className="section-label" id="responses-heading">Responses — anatomy, rhythm &amp; legibility</h2>

      <p style={{ color: 'var(--text-secondary)', marginBottom: 'var(--space-6)', maxWidth: 560 }}>
        Every assistant response follows the same structure. The bubble contains a role label, prose content with enforced typographic rules, and optional citations. Responses are never raw text — they are typeset.
      </p>

      {/* --- Anatomy --- */}
      <h3 style={{ marginTop: 0 }}>Response anatomy</h3>
      <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', marginBottom: 'var(--space-3)' }}>
        Every response bubble has three regions: label, body, and sources.
      </p>

      <div className="chat-bubble" style={{ position: 'relative' }}>
        <div className="bubble-label">Assistant</div>
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
                <span className="cite-footer-arrow">↗</span>
              </a>
            </li>
            <li className="cite-footer-item">
              <a className="cite-footer-link" href="#" onClick={e => e.preventDefault()}>
                <span className="cite-inline">2</span>
                OpenView SaaS Benchmarks 2025
                <span className="cite-footer-source">· Web</span>
                <span className="cite-footer-arrow">↗</span>
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
        gap: 'var(--space-3)',
        marginTop: 'var(--space-4)',
        marginBottom: 'var(--space-8)',
      }}>
        {[
          { label: 'Label', desc: 'Role identifier. Uppercase, muted, monospace weight.' },
          { label: 'Body', desc: 'Prose, lists, code, headings. All subject to measure and rhythm rules.' },
          { label: 'Sources', desc: 'Footer citations. Separated by a top border. Clickable rows.' },
        ].map((item, i) => (
          <div key={i} style={{
            fontSize: 'var(--text-sm)',
            padding: 'var(--space-3) var(--space-4)',
            background: 'var(--surface)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-md)',
          }}>
            <div style={{ fontWeight: 700, marginBottom: 2 }}>{item.label}</div>
            <div style={{ color: 'var(--text-secondary)', lineHeight: 1.5 }}>{item.desc}</div>
          </div>
        ))}
      </div>

      {/* --- Rich content --- */}
      <h3>Rich response — headings, code, lists</h3>
      <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', marginBottom: 'var(--space-3)' }}>
        Responses can contain any markdown element. The typographic rules apply uniformly.
      </p>

      <div className="chat-bubble">
        <div className="bubble-label">Assistant</div>
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
      <h3>Typography &amp; legibility rules</h3>
      <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', marginBottom: 'var(--space-4)' }}>
        Response text follows strict typographic rules for readability. These are enforced in CSS and cannot be overridden per-response.
      </p>

      <div style={{ display: 'grid', gap: 'var(--space-3)', marginBottom: 'var(--space-6)' }}>
        {[
          {
            title: 'Measure (line length)',
            desc: 'Prose lines are capped at 68 characters (var(--measure)). Headings cap at 55 characters. Research shows 45–75 characters per line is optimal for sustained reading.',
            token: '--measure: 68ch',
          },
          {
            title: 'Line height',
            desc: 'Body text uses 1.6× line height. Headings use 1.3×. UI labels use 1.4×. Generous leading prevents line doubling — where the eye loses its place.',
            token: '--line-height-prose: 1.6',
          },
          {
            title: 'Widows & orphans',
            desc: 'CSS orphans: 2 and widows: 2 prevent single words stranded on the first or last line of a paragraph. Combined with text-wrap: pretty for balanced rag.',
            token: 'orphans: 2; widows: 2',
          },
          {
            title: 'Paragraph spacing',
            desc: 'Paragraphs use 0.75em bottom margin — three-quarter line of whitespace. Enough to separate ideas, tight enough to maintain flow. The last paragraph in a bubble has no bottom margin.',
            token: 'margin: 0 0 0.75em',
          },
          {
            title: 'Text wrap',
            desc: 'text-wrap: pretty enables browser-level line balancing. It avoids short last lines and reduces rag. Applied to all prose elements.',
            token: 'text-wrap: pretty',
          },
          {
            title: 'Heading proximity',
            desc: 'Headings use tighter spacing below (8px) than above (1.25em+). This groups headings with their content rather than the previous section.',
            token: 'h + p: margin-top: var(--space-2)',
          },
          {
            title: 'List rhythm',
            desc: 'List items use 4px vertical padding. No bottom margin between items — padding alone creates rhythm. Paragraphs before lists pull up by 0.25em so the list reads as a continuation.',
            token: 'li: padding 4px 0; p + ul: margin-top -0.25em',
          },
        ].map((rule, i) => (
          <div key={i} style={{
            display: 'flex',
            gap: 'var(--space-4)',
            padding: 'var(--space-4) var(--space-5)',
            background: 'var(--surface)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-md)',
          }}>
            <span style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 'var(--text-sm)',
              fontWeight: 600,
              color: 'var(--accent)',
              minWidth: 20,
              paddingTop: 1,
            }}>{i + 1}</span>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontWeight: 700, marginBottom: 2 }}>{rule.title}</div>
              <div style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: 'var(--space-2)' }}>{rule.desc}</div>
              <code style={{ fontSize: 'var(--text-xs)' }}>{rule.token}</code>
            </div>
          </div>
        ))}
      </div>

      {/* --- Do / Don't --- */}
      <h3>Typographic quality — correct vs. incorrect</h3>

      <div className="grid-2" style={{ gap: 'var(--space-4)' }}>
        <div>
          <h4 style={{ marginTop: 0 }}>Correct</h4>
          <div className="chat-bubble" style={{ fontSize: 'var(--text-sm)' }}>
            <div className="bubble-label">Assistant</div>
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
            <strong style={{ color: 'var(--text-secondary)' }}>Why:</strong> Lines stay within measure. Two clear paragraphs. No orphans. Natural reading rhythm.
          </p>
        </div>
        <div>
          <h4 style={{ marginTop: 0 }}>Incorrect</h4>
          <div className="chat-bubble" style={{ fontSize: 'var(--text-sm)', opacity: 0.7, borderStyle: 'dashed' }}>
            <div className="bubble-label">Assistant ✗</div>
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
            <strong style={{ color: 'var(--destructive)' }}>Why this fails:</strong> Single run-on paragraph. Exceeds measure. No structure. Eye loses its place. Fatiguing to read.
          </p>
        </div>
      </div>

      {/* --- User bubble rules --- */}
      <h3>User messages</h3>
      <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', marginBottom: 'var(--space-3)' }}>
        User messages are right-aligned, use the page background colour, and cap at 85% width. Text is displayed as plain text by default, but pasted content may contain markdown formatting.
      </p>

      <div style={{ marginBottom: 'var(--space-4)' }}>
        <div className="chat-bubble user">
          <div className="bubble-label">You</div>
          <p style={{ marginBottom: 0 }}>Why is the deploy timing out?</p>
        </div>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
        gap: 'var(--space-3)',
      }}>
        {[
          'Right-aligned, max-width 85%',
          'Background uses page colour (--bg)',
          'Plain text default — pasted markdown preserved',
          'Same label, padding, and border-radius as assistant',
          'Images render inline above text',
          'No citations or footers',
        ].map((rule, i) => (
          <div key={i} style={{
            fontSize: 'var(--text-sm)',
            color: 'var(--text-secondary)',
            padding: 'var(--space-3) var(--space-4)',
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
      <h3>Response rules</h3>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
        gap: 'var(--space-3)',
      }}>
        {[
          'Prose capped at 68ch line length',
          'Headings capped at 55ch',
          'Line height: 1.6 for body, 1.3 for headings',
          'Orphans ≥ 2, widows ≥ 2 on all paragraphs',
          'text-wrap: pretty for balanced rag',
          'Last paragraph in bubble has no bottom margin',
          'Code blocks use full available width',
          'Headings bind to following content, not preceding',
          'Lists pull up 0.25em when following a paragraph',
          'List items use 4px padding, not margin — no stacking',
          'Last list/blockquote in bubble drops bottom margin',
          'Code blocks tighten to 0 top margin after paragraphs',
          'No horizontal scrolling — code blocks scroll independently',
        ].map((rule, i) => (
          <div key={i} style={{
            fontSize: 'var(--text-sm)',
            color: 'var(--text-secondary)',
            padding: 'var(--space-3) var(--space-4)',
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
    </section>
  );
}
