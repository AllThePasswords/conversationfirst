import { useState, useCallback } from 'react';

function NumberInput({ id, label, hint, placeholder, defaultValue }) {
  const [value, setValue] = useState(defaultValue || '');
  const [error, setError] = useState('');
  const [valid, setValid] = useState(false);

  const handleChange = useCallback((e) => {
    const v = e.target.value;
    setValue(v);
    if (v === '') {
      setError('');
      setValid(false);
    } else if (/[^0-9.]/.test(v)) {
      setError('Numeric values only. Remove: ' + v.replace(/[0-9.]/g, '').split('').map(c => `"${c}"`).join(', '));
      setValid(false);
    } else if ((v.match(/\./g) || []).length > 1) {
      setError('Only one decimal point allowed.');
      setValid(false);
    } else {
      setError('');
      setValid(true);
    }
  }, []);

  return (
    <div className="input-group">
      <label className="input-label" htmlFor={id}>{label}</label>
      {hint && <div className="input-hint">{hint}</div>}
      <input
        id={id}
        className={`input${error ? ' input-error' : valid ? ' input-valid' : ''}`}
        type="text"
        inputMode="decimal"
        placeholder={placeholder}
        value={value}
        onChange={handleChange}
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-error` : undefined}
      />
      {error && (
        <div className="input-error-msg" id={`${id}-error`} role="alert">
          <span aria-hidden="true">!</span> {error}
        </div>
      )}
      {valid && !error && (
        <div className="input-valid-msg">Valid</div>
      )}
    </div>
  );
}

export default function InlineFormsDemo() {
  return (
    <>
      {/* --- Form inside a bubble --- */}
      <h3 style={{ marginTop: 0, fontSize: 'var(--text-lg)' }}>Form inside a response</h3>

      <div className="chat-bubble" style={{ marginBottom: 'var(--space-10)' }}>
        <p>
          To set up billing, I need a few details. All fields are required.
        </p>
        <div className="chat-form">
          <div className="input-group">
            <label className="input-label" htmlFor="demo-company">Company name</label>
            <input id="demo-company" className="input" defaultValue="Acme Corp" />
          </div>
          <div className="input-group">
            <label className="input-label" htmlFor="demo-email">Billing email</label>
            <div className="input-hint">Invoices will be sent to this address.</div>
            <input id="demo-email" className="input" type="email" placeholder="billing@company.com" defaultValue="finance@acme.co" />
          </div>
          <NumberInput
            id="demo-seats"
            label="Number of seats"
            hint="Enter the number of users on your plan."
            placeholder="e.g. 25"
            defaultValue=""
          />
          <div className="input-group">
            <label className="input-label" htmlFor="demo-plan">Plan</label>
            <select id="demo-plan" className="input" defaultValue="pro">
              <option value="starter">Starter — $29/mo</option>
              <option value="pro">Pro — $79/mo</option>
              <option value="enterprise">Enterprise — custom</option>
            </select>
          </div>
          <div className="chat-form-actions">
            <button className="btn btn-primary" type="button">Submit</button>
            <button className="btn btn-secondary" type="button">Cancel</button>
          </div>
        </div>
      </div>

      {/* --- Validation showcase --- */}
      <h3 style={{ fontSize: 'var(--text-lg)' }}>Validation states</h3>

      <div className="grid-2" style={{ gap: 'var(--space-4)', marginBottom: 'var(--space-10)' }}>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <h4 style={{ marginTop: 0 }}>Error state</h4>
          <div className="chat-bubble" style={{ fontSize: 'var(--text-sm)', flex: 1 }}>
            <div className="chat-form" style={{ borderTop: 'none', paddingTop: 0, marginTop: 0 }}>
              <div className="input-group">
                <label className="input-label" htmlFor="demo-err-amount">Amount</label>
                <input id="demo-err-amount" className="input input-error" type="text" value="$45.00" readOnly aria-invalid="true" aria-describedby="demo-err-amount-msg" />
                <div className="input-error-msg" id="demo-err-amount-msg" role="alert">
                  <span aria-hidden="true">!</span> Numeric values only. Remove: "$"
                </div>
              </div>
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
            Red border draws the eye. Message names the offending character.
          </p>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <h4 style={{ marginTop: 0 }}>Valid state</h4>
          <div className="chat-bubble" style={{ fontSize: 'var(--text-sm)', flex: 1 }}>
            <div className="chat-form" style={{ borderTop: 'none', paddingTop: 0, marginTop: 0 }}>
              <div className="input-group">
                <label className="input-label" htmlFor="demo-ok-amount">Amount</label>
                <input id="demo-ok-amount" className="input input-valid" type="text" value="45.00" readOnly />
                <div className="input-valid-msg">Valid</div>
              </div>
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
            Accent border confirms correctness. Minimal label.
          </p>
        </div>
      </div>

      {/* --- CTA action buttons --- */}
      <h3 style={{ fontSize: 'var(--text-lg)' }}>Action buttons</h3>

      <div style={{ marginBottom: 'var(--space-4)' }}>
        <div className="chat-bubble user">
          <p style={{ marginBottom: 0 }}>Deploy the staging branch to production.</p>
        </div>
      </div>

      <div className="chat-bubble" style={{ marginBottom: 'var(--space-10)' }}>
        <p>
          This will deploy <code>staging</code> (commit <code>a3f8c21</code>) to production. The current production version is <code>v2.4.1</code> (commit <code>e7b2d09</code>).
        </p>
        <p style={{ marginBottom: 0 }}>
          13 files changed. 2 database migrations pending. Estimated downtime: 0 seconds (rolling deploy).
        </p>
        <div className="chat-actions">
          <button className="btn btn-primary" type="button">Confirm deploy</button>
          <button className="btn btn-secondary" type="button">Cancel</button>
        </div>
      </div>

      <h4>Destructive confirmation</h4>

      <div className="chat-bubble" style={{ marginBottom: 'var(--space-10)' }}>
        <p>
          This will permanently delete the <code>legacy-api</code> database and all 847 records. This action cannot be undone.
        </p>
        <div className="chat-actions">
          <button className="btn btn-destructive" type="button">Delete database</button>
          <button className="btn btn-secondary" type="button">Keep it</button>
        </div>
      </div>

      <h4>Multi-option actions</h4>

      <div className="chat-bubble" style={{ marginBottom: 'var(--space-10)' }}>
        <p>
          The test suite has 3 failures. How would you like to proceed?
        </p>
        <div className="chat-actions">
          <button className="btn btn-primary" type="button">Fix and retry</button>
          <button className="btn btn-secondary" type="button">Skip failing tests</button>
          <button className="btn btn-ghost" type="button">Show details</button>
        </div>
      </div>

      {/* --- Confirmed states --- */}
      <h3 style={{ fontSize: 'var(--text-lg)' }}>Confirmed states</h3>

      <div className="grid-2" style={{ gap: 'var(--space-4)', marginBottom: 'var(--space-4)' }}>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <h4 style={{ marginTop: 0 }}>Confirmed</h4>
          <div className="chat-bubble" style={{ fontSize: 'var(--text-sm)', flex: 1 }}>
            <p style={{ marginBottom: 0 }}>
              This will deploy <code>staging</code> to production. 13 files changed. 2 migrations pending.
            </p>
            <div className="chat-action-confirmed">
              <span className="chat-action-confirmed-icon confirm">✓</span>
              <span className="chat-action-confirmed-label">Deploy confirmed</span>
              <span className="chat-action-confirmed-time">Just now</span>
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <h4 style={{ marginTop: 0 }}>Declined</h4>
          <div className="chat-bubble" style={{ fontSize: 'var(--text-sm)', flex: 1 }}>
            <p style={{ marginBottom: 0 }}>
              This will permanently delete the <code>legacy-api</code> database and all 847 records.
            </p>
            <div className="chat-action-confirmed">
              <span className="chat-action-confirmed-icon destructive">✗</span>
              <span className="chat-action-confirmed-label">Deletion cancelled</span>
              <span className="chat-action-confirmed-time">2m ago</span>
            </div>
          </div>
        </div>
      </div>

      <div className="chat-bubble" style={{ fontSize: 'var(--text-sm)', marginBottom: 'var(--space-10)' }}>
        <p style={{ marginBottom: 0 }}>
          To set up billing, I need a few details.
        </p>
        <div className="chat-form-confirmed">
          <span>✓</span> Billing details submitted
        </div>
      </div>

      {/* --- Rules --- */}
      <h3 style={{ fontSize: 'var(--text-lg)' }}>Form &amp; action rules</h3>
      <div style={{ display: 'grid', gap: 'var(--space-2)' }}>
        {[
          'Forms are centred on a --bg panel inside the bubble (max-width 400px)',
          'Inputs use --surface background to pop against the recessed panel',
          'Labels use body font, semibold, text-sm',
          'Validation is immediate — no submit-then-error',
          'Error messages name the problem and the fix',
          'Errors use destructive colour, inline below the input',
          'Primary action button is always first (leftmost)',
          'Destructive actions use btn-destructive, never btn-primary',
          'Max 3 buttons per action row — consolidate beyond',
          'Button labels are verbs: "Deploy", "Delete", not "OK"',
          'After click, buttons replaced with confirmed strip (icon + label + time)',
          'Forms collapse to a banner on submit — no stale inputs',
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
