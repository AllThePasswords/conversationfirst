import { useState } from 'react';

export function SectionDivider() {
  return (
    <div className="prep-divider">
      <div className="prep-divider-line" />
    </div>
  );
}

export function Accordion({ question, answer, details, bridge, defaultOpen }) {
  const [open, setOpen] = useState(!!defaultOpen);
  return (
    <div className="prep-accordion" data-open={open}>
      <button
        className="prep-accordion-trigger"
        onClick={() => setOpen(!open)}
      >
        <span>{question}</span>
        <span className="prep-accordion-chevron">{open ? '\u25BE' : '\u25B8'}</span>
      </button>
      <div className="prep-accordion-body">
        <p>{answer}</p>
        {details && details.length > 0 && (
          <div style={{ marginTop: 'var(--space-3)' }}>
            {details.map((d, i) => (
              <div key={i} className="prep-accordion-detail">
                <span>{d}</span>
              </div>
            ))}
          </div>
        )}
        {bridge && (
          <div className="prep-bridge" style={{ marginTop: 'var(--space-3)' }}>
            <div className="prep-bridge-label">Bridge</div>
            <p>{bridge}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export function MetricRow({ metrics }) {
  return (
    <div className="prep-metrics">
      {metrics.map((m, i) => (
        <div key={i} className="prep-metric">
          <div className="prep-metric-value">{m.value}</div>
          <div className="prep-metric-label">{m.label}</div>
          {m.sub && <div className="prep-metric-sub">{m.sub}</div>}
        </div>
      ))}
    </div>
  );
}

export function PrepNav({ backHref, backLabel, prevHref, prevLabel, nextHref, nextLabel, count }) {
  return (
    <nav className="prep-nav">
      <div className="prep-nav-inner">
        <a href={backHref || '#/prep'} className="prep-nav-link">
          {'\u2190'} {backLabel || 'Back to Prep'}
        </a>
        <div className="prep-nav-right">
          {prevHref && (
            <a href={prevHref} className="prep-nav-link">
              Prev: {prevLabel}
            </a>
          )}
          {count && <span className="prep-nav-count">{count}</span>}
          {nextHref && (
            <a href={nextHref} className="prep-nav-link">
              Next: {nextLabel}
            </a>
          )}
        </div>
      </div>
    </nav>
  );
}

export function Bridge({ label, children }) {
  return (
    <div className="prep-bridge">
      <div className="prep-bridge-label">{label || 'Bridge'}</div>
      {children}
    </div>
  );
}

export function InfoBox({ label, children }) {
  return (
    <div className="prep-info">
      {label && <div className="prep-info-label">{label}</div>}
      {children}
    </div>
  );
}

export function Highlight({ label, children }) {
  return (
    <div className="prep-highlight">
      {label && <div className="prep-highlight-label">{label}</div>}
      {children}
    </div>
  );
}

export function TipList({ tips }) {
  return (
    <ol className="prep-tips">
      {tips.map((tip, i) => (
        <li key={i} className="prep-tip">
          <span className="prep-tip-num">{i + 1}</span>
          <div>
            <div className="prep-tip-title">{tip.title}</div>
            <div className="prep-tip-body">{tip.body}</div>
          </div>
        </li>
      ))}
    </ol>
  );
}

export function WalkthroughLinks() {
  return (
    <div className="prep-info">
      <div className="prep-info-label">Case Study Walkthroughs</div>
      <p>Deep-dive narratives for expanding on any answer.</p>
      <div className="prep-walkthrough-grid" style={{ marginTop: 'var(--space-3)' }}>
        <a href="#/prep/breeze" className="prep-walkthrough-link">Breeze AI &rarr;</a>
        <a href="#/prep/mobile" className="prep-walkthrough-link">HubSpot Mobile &rarr;</a>
        <a href="#/prep/leadership" className="prep-walkthrough-link">Design Leadership &rarr;</a>
      </div>
    </div>
  );
}
