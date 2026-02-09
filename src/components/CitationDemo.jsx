export default function CitationDemo() {
  return (
    <div className="section" id="citations">
      <div className="section-label">Citation system — every claim has a source</div>

      <p style={{ color: 'var(--text-secondary)', marginBottom: 'var(--space-6)', maxWidth: 560 }}>
        Three citation formats. Inline superscripts for quick references. Block cards for key sources. Footer lists for complete attribution. Every citation is a clickable link.
      </p>

      <h3 style={{ marginTop: 0 }}>Full conversation example</h3>

      <div className="chat-bubble user">
        <div className="bubble-label">User</div>
        <p style={{ marginBottom: 0 }}>What's the retention rate for Q3?</p>
      </div>

      <div className="chat-bubble">
        <div className="bubble-label">Assistant</div>
        <p>
          124% net revenue retention. Up from 118% in Q2<a className="cite-inline" href="#" onClick={e => e.preventDefault()} title="Q3 Financial Report">1</a>.
        </p>
        <p>
          For context, the SaaS industry median is 110%<a className="cite-inline" href="#" onClick={e => e.preventDefault()} title="OpenView SaaS Benchmarks 2025">2</a>. The improvement came from expansion revenue in the mid-market segment, where average contract value increased 31%<a className="cite-inline" href="#" onClick={e => e.preventDefault()} title="Q3 Financial Report">1</a>.
        </p>

        <div className="cite-block">
          <div className="cite-block-num">1</div>
          <div>
            <div className="cite-block-title"><a href="#" onClick={e => e.preventDefault()}>Q3 Financial Report</a></div>
            <div className="cite-block-meta">Google Drive · Document · <a href="#" onClick={e => e.preventDefault()}>Open document ↗</a></div>
          </div>
        </div>

        <div className="cite-footer">
          <div className="cite-footer-title">Sources</div>
          <ul className="cite-footer-list">
            <li className="cite-footer-item">
              <a className="cite-footer-link" href="#" onClick={e => e.preventDefault()}>
                <span className="cite-inline">1</span>
                Q3 Financial Report
                <span className="cite-footer-source">· Google Drive · Document</span>
                <span className="cite-footer-arrow">↗</span>
              </a>
            </li>
            <li className="cite-footer-item">
              <a className="cite-footer-link" href="#" onClick={e => e.preventDefault()}>
                <span className="cite-inline">2</span>
                OpenView SaaS Benchmarks 2025
                <span className="cite-footer-source">· openviewpartners.com · Web</span>
                <span className="cite-footer-arrow">↗</span>
              </a>
            </li>
          </ul>
        </div>
      </div>

      <h3>Citation rules</h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 'var(--space-3)' }}>
        {[
          "Every factual claim needs a citation",
          "Every citation must link to its source",
          "Place badge after claim, before punctuation",
          "Max 8 per response — consolidate beyond",
          "Reuse numbers for repeated sources",
          "Never fabricate citations or links",
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
    </div>
  );
}
