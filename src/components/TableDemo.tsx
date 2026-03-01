export default function TableDemo() {
  const numStyle: React.CSSProperties = {
    textAlign: 'right',
    fontVariantNumeric: 'tabular-nums',
    fontFamily: 'var(--font-mono)',
    fontSize: 'var(--text-xs)',
  };

  return (
    <>
      {/* --- Simple comparison table --- */}
      <h3 style={{ marginTop: 0, fontSize: 'var(--text-lg)' }}>Simple comparison table</h3>

      <div className="chat-bubble" style={{ marginBottom: 'var(--space-10)' }}>
        <p>
          Here's a comparison of the three frameworks you asked about:
        </p>
        <div className="table-scroll-wrapper">
          <table>
            <thead>
              <tr>
                <th>Framework</th>
                <th>Language</th>
                <th>SSR</th>
                <th>Bundle size</th>
              </tr>
            </thead>
            <tbody>
              <tr><td>Next.js</td><td>TypeScript</td><td>Yes</td><td>85 KB</td></tr>
              <tr><td>Nuxt</td><td>TypeScript</td><td>Yes</td><td>72 KB</td></tr>
              <tr><td>SvelteKit</td><td>TypeScript</td><td>Yes</td><td>48 KB</td></tr>
            </tbody>
          </table>
        </div>
        <p style={{ marginBottom: 0 }}>
          All three support TypeScript and server-side rendering out of the box. SvelteKit produces the smallest bundles.
        </p>
      </div>

      {/* --- API parameter table --- */}
      <h3 style={{ fontSize: 'var(--text-lg)' }}>API parameter table</h3>

      <div className="chat-bubble" style={{ marginBottom: 'var(--space-10)' }}>
        <p>
          The <code>createUser</code> endpoint accepts these parameters:
        </p>
        <div className="table-scroll-wrapper">
          <table>
            <thead>
              <tr>
                <th>Parameter</th>
                <th>Type</th>
                <th>Required</th>
                <th>Description</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><code>name</code></td>
                <td><code>string</code></td>
                <td>Yes</td>
                <td>Full name of the user</td>
              </tr>
              <tr>
                <td><code>email</code></td>
                <td><code>string</code></td>
                <td>Yes</td>
                <td>Must be unique across accounts</td>
              </tr>
              <tr>
                <td><code>role</code></td>
                <td><code>string</code></td>
                <td>No</td>
                <td>Defaults to <code>"viewer"</code></td>
              </tr>
              <tr>
                <td><code>teamId</code></td>
                <td><code>string</code></td>
                <td>No</td>
                <td>Associates user with a team</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p style={{ marginBottom: 0 }}>
          All string parameters are trimmed and validated on the server.
        </p>
      </div>

      {/* --- Numeric data table --- */}
      <h3 style={{ fontSize: 'var(--text-lg)' }}>Numeric data table</h3>

      <div className="chat-bubble" style={{ marginBottom: 'var(--space-10)' }}>
        <p>
          Here are the Q3 metrics across regions:
        </p>
        <div className="table-scroll-wrapper">
          <table>
            <thead>
              <tr>
                <th>Region</th>
                <th style={{ textAlign: 'right' }}>Revenue</th>
                <th style={{ textAlign: 'right' }}>Growth</th>
                <th style={{ textAlign: 'right' }}>Retention</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>North America</td>
                <td style={numStyle}>$4.2M</td>
                <td style={numStyle}>+18%</td>
                <td style={numStyle}>94.2%</td>
              </tr>
              <tr>
                <td>Europe</td>
                <td style={numStyle}>$2.8M</td>
                <td style={numStyle}>+24%</td>
                <td style={numStyle}>91.7%</td>
              </tr>
              <tr>
                <td>Asia Pacific</td>
                <td style={numStyle}>$1.6M</td>
                <td style={numStyle}>+31%</td>
                <td style={numStyle}>88.4%</td>
              </tr>
              <tr>
                <td>Latin America</td>
                <td style={numStyle}>$0.9M</td>
                <td style={numStyle}>+42%</td>
                <td style={numStyle}>85.1%</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* --- Key-value table --- */}
      <h3 style={{ fontSize: 'var(--text-lg)' }}>Key-value table</h3>

      <div className="chat-bubble" style={{ marginBottom: 'var(--space-10)' }}>
        <p>
          Your current configuration:
        </p>
        <div className="table-scroll-wrapper">
          <table>
            <thead>
              <tr>
                <th>Setting</th>
                <th>Value</th>
              </tr>
            </thead>
            <tbody>
              <tr><td>Instance type</td><td><code>t3.medium</code></td></tr>
              <tr><td>Region</td><td>us-east-1</td></tr>
              <tr><td>Memory</td><td>4 GB</td></tr>
              <tr><td>Storage</td><td>100 GB gp3</td></tr>
              <tr><td>Auto-scaling</td><td>Enabled (2–8 instances)</td></tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* --- Styling rules --- */}
      <h3 style={{ fontSize: 'var(--text-lg)' }}>Table rules</h3>

      <div style={{ display: 'grid', gap: 'var(--space-2)', marginBottom: 'var(--space-10)' }}>
        {[
          'Table content uses --font-app · Headers use --font-mono',
          'Tables use --bg background inside bubbles for subtle inset effect',
          'Bottom border on each row, no vertical lines · Last row drops its border',
          'Cells: 8px vertical, 16px horizontal padding',
          'Rows highlight with --accent-subtle on hover',
          'Tables that exceed width scroll horizontally inside a rounded wrapper',
          'Spacing follows code blocks: 0.5em top, 0.75em bottom',
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

      {/* --- Correct vs. incorrect --- */}
      <h3 style={{ fontSize: 'var(--text-lg)' }}>Correct vs. incorrect</h3>

      <div className="grid-2" style={{ gap: 'var(--space-4)' }}>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <h4 style={{ marginTop: 0 }}>Correct</h4>
          <div className="chat-bubble" style={{ fontSize: 'var(--text-sm)', flex: 1 }}>
            <p>
              The three plans differ mainly in storage and support:
            </p>
            <div className="table-scroll-wrapper">
              <table>
                <thead>
                  <tr><th>Plan</th><th>Storage</th><th>Support</th></tr>
                </thead>
                <tbody>
                  <tr><td>Starter</td><td>10 GB</td><td>Email</td></tr>
                  <tr><td>Pro</td><td>100 GB</td><td>Priority</td></tr>
                  <tr><td>Enterprise</td><td>Unlimited</td><td>Dedicated</td></tr>
                </tbody>
              </table>
            </div>
          </div>
          <p style={{
            fontSize: 'var(--text-xs)',
            color: 'var(--text-muted)',
            padding: 'var(--space-3) var(--space-4)',
            background: 'var(--surface)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-md)',
          }}>
            Intro explains what varies. Consistent column types. Scannable.
          </p>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <h4 style={{ marginTop: 0 }}>Incorrect</h4>
          <div className="chat-bubble" style={{ fontSize: 'var(--text-sm)', opacity: 0.7, borderStyle: 'dashed', flex: 1 }}>
            <div className="table-scroll-wrapper">
              <table>
                <thead>
                  <tr><th>Info</th><th>Details</th></tr>
                </thead>
                <tbody>
                  <tr><td>The starter plan</td><td>This plan gives you 10 GB of storage and you can contact support via email if you need help with anything.</td></tr>
                  <tr><td>Pro</td><td>100 GB, priority support</td></tr>
                  <tr><td>Enterprise pricing</td><td>Contact sales for a quote</td></tr>
                </tbody>
              </table>
            </div>
          </div>
          <p style={{
            fontSize: 'var(--text-xs)',
            color: 'var(--text-muted)',
            padding: 'var(--space-3) var(--space-4)',
            background: 'var(--destructive-subtle)',
            border: '1px solid color-mix(in srgb, var(--destructive) 15%, transparent)',
            borderRadius: 'var(--radius-md)',
          }}>
            No intro. Vague columns. Cell content varies wildly.
          </p>
        </div>
      </div>
    </>
  );
}
