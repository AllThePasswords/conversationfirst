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
      <h3 style={{ marginTop: 0 }}>Simple comparison table</h3>
      <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', marginBottom: 'var(--space-3)' }}>
        Tables appear when structured data is clearer than prose. An introductory sentence sets context before the table.
      </p>

      <div className="chat-bubble" style={{ marginBottom: 'var(--space-6)' }}>

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
      <h3>API parameter table</h3>
      <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', marginBottom: 'var(--space-3)' }}>
        The most common table type in AI chat — documenting function parameters with inline <code>code</code> for names and types.
      </p>

      <div className="chat-bubble" style={{ marginBottom: 'var(--space-6)' }}>

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
      <h3>Numeric data table</h3>
      <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', marginBottom: 'var(--space-3)' }}>
        Numeric columns use right alignment, tabular numerals, and monospace font for scannable columns. Apply these styles to individual cells.
      </p>

      <div className="chat-bubble" style={{ marginBottom: 'var(--space-6)' }}>

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
      <h3>Key-value table</h3>
      <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', marginBottom: 'var(--space-3)' }}>
        A narrow two-column table for configuration summaries and system specs. Works well in both wide and narrow chat layouts.
      </p>

      <div className="chat-bubble" style={{ marginBottom: 'var(--space-6)' }}>

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
      <h3>Table styling rules</h3>
      <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', marginBottom: 'var(--space-4)' }}>
        Seven rules govern table layout inside chat bubbles. These are enforced in CSS and apply to all GFM markdown tables rendered through the chat.
      </p>

      <div style={{ display: 'grid', gap: 'var(--space-3)', marginBottom: 'var(--space-6)' }}>
        {[
          {
            title: 'Font choice',
            desc: 'Table content uses DM Sans (--font-app) for structured data. Headers use JetBrains Mono for hierarchy. This separates tables from prose typographically.',
            token: 'font-family: var(--font-app)',
          },
          {
            title: 'Inset background',
            desc: 'Tables use --bg background inside bubbles (which use --surface). This creates a subtle inset effect that visually groups the data without adding weight.',
            token: 'background: var(--bg)',
          },
          {
            title: 'Row separators',
            desc: 'Bottom border on each row, no vertical lines. The last row drops its border. Cleaner than a full grid, less busy for conversational context.',
            token: 'border-bottom: 1px solid var(--border)',
          },
          {
            title: 'Compact padding',
            desc: 'Cells use 8px vertical and 16px horizontal padding. Tighter than app tables since chat tables should feel lightweight, not like a spreadsheet.',
            token: 'padding: var(--space-2) var(--space-4)',
          },
          {
            title: 'Hover feedback',
            desc: 'Rows highlight with --accent-subtle on hover, helping track the eye across wide rows. The transition uses --duration-fast for responsive feel.',
            token: 'tr:hover td: var(--accent-subtle)',
          },
          {
            title: 'Overflow handling',
            desc: 'Tables that exceed bubble width scroll horizontally inside a rounded wrapper. The bubble itself never scrolls — only the table region.',
            token: 'overflow-x: auto',
          },
          {
            title: 'Prose rhythm',
            desc: 'Tables follow the same spacing as code blocks: 0.5em top, 0.75em bottom. When preceded by a paragraph, top margin collapses. Last table in a bubble drops bottom margin.',
            token: 'margin: 0.5em 0 0.75em',
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

      {/* --- Correct vs. incorrect --- */}
      <h3>Correct vs. incorrect table usage</h3>

      <div className="grid-2" style={{ gap: 'var(--space-4)' }}>
        <div>
          <h4 style={{ marginTop: 0 }}>Correct</h4>
          <div className="chat-bubble" style={{ fontSize: 'var(--text-sm)' }}>
    
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
            <strong style={{ color: 'var(--text-secondary)' }}>Why:</strong> Introductory sentence explains what varies. Columns are consistent types. Data is scannable and concise. Table adds clarity over prose.
          </p>
        </div>
        <div>
          <h4 style={{ marginTop: 0 }}>Incorrect</h4>
          <div className="chat-bubble" style={{ fontSize: 'var(--text-sm)', opacity: 0.7, borderStyle: 'dashed' }}>

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
            <strong style={{ color: 'var(--destructive)' }}>Why this fails:</strong> No introductory sentence. Columns are vague ("Info", "Details"). Cell content varies wildly — one is prose, another is terse. First column mixes naming styles. A list would serve this content better.
          </p>
        </div>
      </div>
    </>
  );
}
