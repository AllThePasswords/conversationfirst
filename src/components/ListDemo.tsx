export default function ListDemo() {
  return (
    <>
      {/* --- Simple lists --- */}
      <h3 style={{ marginTop: 0, fontSize: 'var(--text-lg)' }}>Unordered &amp; ordered lists</h3>

      <div className="chat-bubble" style={{ marginBottom: 'var(--space-3)' }}>
        <p>
          The API supports three authentication methods:
        </p>
        <ul>
          <li>API key: passed in the <code>Authorization</code> header.</li>
          <li>OAuth 2.0: for user-delegated access with scoped permissions.</li>
          <li>Service account: for server-to-server calls without user context.</li>
        </ul>
        <p style={{ marginBottom: 0 }}>
          All three methods support rate limiting and audit logging.
        </p>
      </div>

      <div className="chat-bubble" style={{ marginBottom: 'var(--space-10)' }}>
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
      <h3 style={{ fontSize: 'var(--text-lg)' }}>Paragraph-to-list transition</h3>

      <div className="chat-bubble" style={{ marginBottom: 'var(--space-10)' }}>
        <p>
          Connection pooling reduces latency by reusing open database connections. The pool should be configured based on your workload and expected concurrency.
        </p>
        <p>
          Key parameters to tune:
        </p>
        <ul>
          <li><strong>max</strong>: maximum number of connections in the pool.</li>
          <li><strong>idleTimeoutMillis</strong>: close connections after this idle duration.</li>
          <li><strong>connectionTimeoutMillis</strong>: fail fast if no connection is available.</li>
        </ul>
        <p style={{ marginBottom: 0 }}>
          Monitor pool wait times in production. If P95 exceeds 50ms, increase the pool size or optimise slow queries.
        </p>
      </div>

      {/* --- Nested lists --- */}
      <h3 style={{ fontSize: 'var(--text-lg)' }}>Nested lists</h3>

      <div className="chat-bubble" style={{ marginBottom: 'var(--space-3)' }}>
        <p>
          The design system uses three spacing scales:
        </p>
        <ul>
          <li>Micro scale: internal component spacing
            <ul>
              <li>4px between related elements within a control.</li>
              <li>8px between grouped controls in a toolbar.</li>
            </ul>
          </li>
          <li>Meso scale: between components
            <ul>
              <li>16px between form fields in a group.</li>
              <li>24px between distinct sections on a page.</li>
            </ul>
          </li>
          <li>Macro scale: page-level layout
            <ul>
              <li>48px between major content regions.</li>
              <li>64px for top-level page margins.</li>
            </ul>
          </li>
        </ul>
      </div>

      <div className="chat-bubble" style={{ marginBottom: 'var(--space-10)' }}>
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
      <h3 style={{ fontSize: 'var(--text-lg)' }}>Rich list items</h3>

      <div className="chat-bubble" style={{ marginBottom: 'var(--space-10)' }}>
        <p>
          Configuration options for the rate limiter:
        </p>
        <ul>
          <li><strong>windowMs</strong>: time window in milliseconds. Default: <code>60000</code> (one minute).</li>
          <li><strong>maxRequests</strong>: maximum requests per window. Set to <code>100</code> for public APIs.</li>
          <li><strong>keyGenerator</strong>: function that identifies clients. Typically extracts the IP address or API key from the request.</li>
          <li><strong>skipFailedRequests</strong>: when <code>true</code>, failed requests (4xx/5xx) do not count toward the limit.</li>
        </ul>
      </div>

      {/* --- Spacing rules --- */}
      <h3 style={{ fontSize: 'var(--text-lg)' }}>List rules</h3>

      <div style={{ display: 'grid', gap: 'var(--space-2)', marginBottom: 'var(--space-10)' }}>
        {[
          'Markers: disc → circle → square · Ordered: decimal → lower-alpha → lower-roman',
          'List after paragraph pulls up 0.25em for continuity',
          'Items use 4px vertical padding, not margin. First/last strip outer padding',
          'Root indent 20px, nested 16px. Prevents excessive drift',
          'Markers use --text-muted, fading further at each nesting level',
          'Last list in a bubble has zero bottom margin',
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

      <div className="grid-2" style={{ gap: 'var(--space-4)' }}>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <h4 style={{ marginTop: 0 }}>Correct</h4>
          <div className="chat-bubble" style={{ fontSize: 'var(--text-sm)', flex: 1 }}>
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
            Intro sentence sets context. Parallel structure. Tight rhythm.
          </p>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <h4 style={{ marginTop: 0 }}>Incorrect</h4>
          <div className="chat-bubble" style={{ fontSize: 'var(--text-sm)', opacity: 0.7, borderStyle: 'dashed', flex: 1 }}>
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
            No intro. Items vary wildly in length. Unparallel structure.
          </p>
        </div>
      </div>
    </>
  );
}
