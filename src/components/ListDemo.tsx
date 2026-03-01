export default function ListDemo() {
  return (
    <>
      {/* --- Simple lists --- */}
      <h3 style={{ marginTop: 0 }}>Unordered &amp; ordered lists</h3>
      <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', marginBottom: 'var(--space-3)' }}>
        Simple lists with an introductory sentence. Markers are muted; items use padding, not margin.
      </p>

      <div className="chat-bubble" style={{ marginBottom: 'var(--space-3)' }}>

        <p>
          The API supports three authentication methods:
        </p>
        <ul>
          <li>API key — passed in the <code>Authorization</code> header.</li>
          <li>OAuth 2.0 — for user-delegated access with scoped permissions.</li>
          <li>Service account — for server-to-server calls without user context.</li>
        </ul>
        <p style={{ marginBottom: 0 }}>
          All three methods support rate limiting and audit logging.
        </p>
      </div>

      <div className="chat-bubble" style={{ marginBottom: 'var(--space-6)' }}>

        <p>
          To deploy the application:
        </p>
        <ol>
          <li>Run the test suite and confirm all tests pass.</li>
          <li>Build the production bundle with <code>npm run build</code>.</li>
          <li>Push to the main branch to trigger the CI pipeline.</li>
          <li>Verify the health check endpoint returns <code>200</code>.</li>
        </ol>
      </div>

      {/* --- Paragraph-to-list flow --- */}
      <h3>Paragraph-to-list transition</h3>
      <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', marginBottom: 'var(--space-3)' }}>
        When a list follows a paragraph, it pulls up by 0.25em so the list reads as a continuation of the sentence — not a separate block.
      </p>

      <div className="chat-bubble" style={{ marginBottom: 'var(--space-6)' }}>

        <p>
          Connection pooling reduces latency by reusing open database connections. The pool should be configured based on your workload and expected concurrency.
        </p>
        <p>
          Key parameters to tune:
        </p>
        <ul>
          <li><strong>max</strong> — maximum number of connections in the pool.</li>
          <li><strong>idleTimeoutMillis</strong> — close connections after this idle duration.</li>
          <li><strong>connectionTimeoutMillis</strong> — fail fast if no connection is available.</li>
        </ul>
        <p style={{ marginBottom: 0 }}>
          Monitor pool wait times in production. If P95 exceeds 50ms, increase the pool size or optimise slow queries.
        </p>
      </div>

      {/* --- Nested lists --- */}
      <h3>Nested lists — sub-bullets</h3>
      <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', marginBottom: 'var(--space-3)' }}>
        Each nesting level uses a distinct marker: disc &rarr; circle &rarr; square for bullets, decimal &rarr; lower-alpha &rarr; lower-roman for numbers. Deeper markers fade visually so content stays dominant.
      </p>

      <div className="chat-bubble" style={{ marginBottom: 'var(--space-3)' }}>

        <p>
          The design system uses three spacing scales:
        </p>
        <ul>
          <li>Micro scale — internal component spacing
            <ul>
              <li>4px between related elements within a control.</li>
              <li>8px between grouped controls in a toolbar.</li>
            </ul>
          </li>
          <li>Meso scale — between components
            <ul>
              <li>16px between form fields in a group.</li>
              <li>24px between distinct sections on a page.</li>
            </ul>
          </li>
          <li>Macro scale — page-level layout
            <ul>
              <li>48px between major content regions.</li>
              <li>64px for top-level page margins.</li>
            </ul>
          </li>
        </ul>
      </div>

      <div className="chat-bubble" style={{ marginBottom: 'var(--space-6)' }}>

        <p>
          Migration steps for the database upgrade:
        </p>
        <ol>
          <li>Back up the existing database
            <ol>
              <li>Export all tables to a SQL dump file.</li>
              <li>Verify backup integrity with a checksum.</li>
            </ol>
          </li>
          <li>Apply schema migrations
            <ol>
              <li>Run <code>migrate:pending</code> to preview changes.</li>
              <li>Execute <code>migrate:run</code> against staging first.</li>
            </ol>
          </li>
          <li>Validate data consistency after the migration completes.</li>
        </ol>
      </div>

      {/* --- Rich list items --- */}
      <h3>Rich list items — bold, code, inline formatting</h3>
      <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', marginBottom: 'var(--space-3)' }}>
        List items can contain bold labels, inline code, and mixed formatting without breaking rhythm.
      </p>

      <div className="chat-bubble" style={{ marginBottom: 'var(--space-6)' }}>

        <p>
          Configuration options for the rate limiter:
        </p>
        <ul>
          <li><strong>windowMs</strong> — time window in milliseconds. Default: <code>60000</code> (one minute).</li>
          <li><strong>maxRequests</strong> — maximum requests per window. Set to <code>100</code> for public APIs.</li>
          <li><strong>keyGenerator</strong> — function that identifies clients. Typically extracts the IP address or API key from the request.</li>
          <li><strong>skipFailedRequests</strong> — when <code>true</code>, failed requests (4xx/5xx) do not count toward the limit.</li>
        </ul>
      </div>

      {/* --- Spacing rules --- */}
      <h3>List spacing rules</h3>
      <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', marginBottom: 'var(--space-4)' }}>
        Six rules govern list layout. These are enforced in CSS and apply uniformly to all lists in chat bubbles.
      </p>

      <div style={{ display: 'grid', gap: 'var(--space-3)', marginBottom: 'var(--space-6)' }}>
        {[
          {
            title: 'Marker hierarchy',
            desc: 'Level 1 uses disc, level 2 uses circle, level 3 uses square. Ordered lists follow decimal, lower-alpha, lower-roman. Each level is visually distinct without being loud.',
            token: 'list-style: disc \u2192 circle \u2192 square',
          },
          {
            title: 'Paragraph pull-up',
            desc: 'When a list follows a paragraph, the list pulls up by 0.25em. This creates continuity \u2014 the list reads as an extension of the sentence, not a separate block.',
            token: 'p + ul: margin-top: -0.25em',
          },
          {
            title: 'Padding rhythm',
            desc: 'List items use 4px vertical padding, not margin. First and last items strip their outer padding. No margin-collapse surprises.',
            token: 'li: padding: 4px 0',
          },
          {
            title: 'Nested indentation',
            desc: 'Root lists indent 20px. Nested lists indent 16px. The reduction prevents excessive horizontal drift while maintaining clear hierarchy.',
            token: 'padding-left: 20px \u2192 16px',
          },
          {
            title: 'Marker muting',
            desc: 'Root markers use --text-muted. Each nesting level fades further via color-mix, creating a receding visual hierarchy that draws the eye to content, not chrome.',
            token: '::marker: muted \u2192 70% \u2192 50%',
          },
          {
            title: 'Terminal margin',
            desc: 'The last list in a bubble has zero bottom margin. No trailing whitespace before the bubble edge. Consistent with paragraph behavior.',
            token: '*:last-child: margin-bottom: 0',
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
      <h3>Correct vs. incorrect list usage</h3>

      <div className="grid-2" style={{ gap: 'var(--space-4)' }}>
        <div>
          <h4 style={{ marginTop: 0 }}>Correct</h4>
          <div className="chat-bubble" style={{ fontSize: 'var(--text-sm)' }}>
    
            <p>
              Three factors improved retention this quarter:
            </p>
            <ul>
              <li>Contract value grew 31% from premium tier adoption.</li>
              <li>Monthly churn dropped to 1.8%, down from 2.4%.</li>
              <li>Usage-based billing captured 12% more revenue per seat.</li>
            </ul>
          </div>
          <p style={{
            fontSize: 'var(--text-xs)',
            color: 'var(--text-muted)',
            padding: 'var(--space-3) var(--space-4)',
            background: 'var(--surface)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-md)',
          }}>
            <strong style={{ color: 'var(--text-secondary)' }}>Why:</strong> Introductory sentence sets context. Items are parallel in structure. Each is one clear statement. Rhythm is tight and scannable.
          </p>
        </div>
        <div>
          <h4 style={{ marginTop: 0 }}>Incorrect</h4>
          <div className="chat-bubble" style={{ fontSize: 'var(--text-sm)', opacity: 0.7, borderStyle: 'dashed' }}>

            <ul>
              <li>So basically the retention improved because contract values went up by about 31% or so because customers started using premium tiers more often than before.</li>
              <li>Also churn went down too.</li>
              <li>And the billing changed.</li>
            </ul>
          </div>
          <p style={{
            fontSize: 'var(--text-xs)',
            color: 'var(--text-muted)',
            padding: 'var(--space-3) var(--space-4)',
            background: 'var(--destructive-subtle)',
            border: '1px solid color-mix(in srgb, var(--destructive) 15%, transparent)',
            borderRadius: 'var(--radius-md)',
          }}>
            <strong style={{ color: 'var(--destructive)' }}>Why this fails:</strong> No introductory sentence. Items vary wildly in length. First item is a run-on. Unparallel structure. Reads as an afterthought.
          </p>
        </div>
      </div>
    </>
  );
}
