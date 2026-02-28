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
    <section className="section" id="inline-forms" aria-labelledby="inline-forms-heading">
      <h2 className="section-label" id="inline-forms-heading">Inline forms &amp; actions — collecting input inside chat</h2>

      <p style={{ color: 'var(--text-secondary)', marginBottom: 'var(--space-6)', maxWidth: 560 }}>
        When the assistant needs information or confirmation, it renders forms and action buttons directly inside the response bubble. Forms follow the same typographic rules as prose. Validation is immediate, inline, and non-blocking.
      </p>

      {/* --- Form inside a bubble --- */}
      <h3 style={{ marginTop: 0 }}>Form inside a response</h3>
      <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', marginBottom: 'var(--space-3)' }}>
        The assistant asks a question in prose, then presents a form below a separator. Labels use the same weight and size as body text labels. Inputs use the page background to distinguish from the bubble surface.
      </p>

      <div className="chat-bubble">
        <div className="bubble-label">Assistant</div>
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
      <h3>Validation states</h3>
      <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', marginBottom: 'var(--space-3)' }}>
        Validation is immediate. Errors appear below the input on the same line, using the destructive colour. The error message names the problem and the fix. Try typing a letter into the number field above.
      </p>

      <div className="grid-2" style={{ gap: 'var(--space-4)', marginBottom: 'var(--space-6)' }}>
        <div>
          <h4 style={{ marginTop: 0 }}>Error state</h4>
          <div className="chat-bubble" style={{ fontSize: 'var(--text-sm)' }}>
            <div className="bubble-label">Assistant</div>
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
            <strong style={{ color: 'var(--text-secondary)' }}>Why:</strong> Red border draws the eye. Message names the offending character. No modal, no toast — the error is inline and immediate.
          </p>
        </div>
        <div>
          <h4 style={{ marginTop: 0 }}>Valid state</h4>
          <div className="chat-bubble" style={{ fontSize: 'var(--text-sm)' }}>
            <div className="bubble-label">Assistant</div>
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
            <strong style={{ color: 'var(--text-secondary)' }}>Why:</strong> Accent border confirms correctness. Minimal label — no celebration, just confirmation.
          </p>
        </div>
      </div>

      {/* --- CTA action buttons --- */}
      <h3>Action buttons — confirm &amp; decline</h3>
      <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', marginBottom: 'var(--space-3)' }}>
        When the assistant needs a yes/no decision, it presents CTA buttons below the response. The primary action is always first. Destructive actions use the destructive style to signal risk.
      </p>

      <div style={{ marginBottom: 'var(--space-4)' }}>
        <div className="chat-bubble user">
          <div className="bubble-label">You</div>
          <p style={{ marginBottom: 0 }}>Deploy the staging branch to production.</p>
        </div>
      </div>

      <div className="chat-bubble">
        <div className="bubble-label">Assistant</div>
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
      <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', marginBottom: 'var(--space-3)' }}>
        When the action is irreversible, the primary button uses the destructive style.
      </p>

      <div className="chat-bubble">
        <div className="bubble-label">Assistant</div>
        <p>
          This will permanently delete the <code>legacy-api</code> database and all 847 records. This action cannot be undone.
        </p>
        <div className="chat-actions">
          <button className="btn btn-destructive" type="button">Delete database</button>
          <button className="btn btn-secondary" type="button">Keep it</button>
        </div>
      </div>

      <h4>Multi-option actions</h4>
      <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', marginBottom: 'var(--space-3)' }}>
        When there are more than two choices, each option gets its own button. Group related actions together.
      </p>

      <div className="chat-bubble">
        <div className="bubble-label">Assistant</div>
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
      <h3>After selection — confirmed states</h3>
      <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', marginBottom: 'var(--space-3)' }}>
        After a button is clicked, the action row is replaced with a confirmation strip. This provides a permanent record of what was decided. Buttons never remain interactive after selection.
      </p>

      <div className="grid-2" style={{ gap: 'var(--space-4)', marginBottom: 'var(--space-6)' }}>
        <div>
          <h4 style={{ marginTop: 0 }}>Confirmed</h4>
          <div className="chat-bubble" style={{ fontSize: 'var(--text-sm)' }}>
            <div className="bubble-label">Assistant</div>
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
        <div>
          <h4 style={{ marginTop: 0 }}>Declined / destructive</h4>
          <div className="chat-bubble" style={{ fontSize: 'var(--text-sm)' }}>
            <div className="bubble-label">Assistant</div>
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

      <h4>Form submitted</h4>
      <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', marginBottom: 'var(--space-3)' }}>
        After a form is submitted, the form collapses into a confirmation banner at the bottom of the bubble.
      </p>

      <div className="chat-bubble" style={{ fontSize: 'var(--text-sm)' }}>
        <div className="bubble-label">Assistant</div>
        <p style={{ marginBottom: 0 }}>
          To set up billing, I need a few details.
        </p>
        <div className="chat-form-confirmed">
          <span>✓</span> Billing details submitted
        </div>
      </div>

      {/* --- Rules --- */}
      <h3>Form &amp; action rules</h3>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
        gap: 'var(--space-3)',
      }}>
        {[
          'Forms sit below a border separator inside the bubble',
          'Inputs use page background (--bg), not bubble surface',
          'Labels use body font, semibold, text-sm',
          'Validation is immediate — no submit-then-error',
          'Error messages name the problem and the fix',
          'Errors use destructive colour, inline below the input',
          'No modals for validation — all feedback is inline',
          'Primary action button is always first (leftmost)',
          'Destructive actions use btn-destructive, never btn-primary',
          'Action buttons sit below a border separator',
          'Max 3 buttons per action row — consolidate beyond',
          'Button labels are verbs: "Deploy", "Delete", not "OK"',
          'After click, buttons are replaced with a confirmed strip',
          'Confirmed state shows icon, label, and timestamp',
          'Confirmed actions use ✓ (accent), declined use ✗ (destructive)',
          'Forms collapse to a banner on submit — no stale inputs',
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
