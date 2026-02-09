const RULES = [
  { title: "Answer first", desc: "The direct answer goes in the first sentence. No preamble. Never open with filler." },
  { title: "Cite everything", desc: "Every factual claim must have a source. No citation means no claim." },
  { title: "Give examples", desc: "Every abstract statement must be followed by a concrete example. Code, data, or before/after." },
  { title: "Stop when done", desc: "Do not pad responses. Do not summarise what was just said. Do not ask to elaborate." },
  { title: "No emotion", desc: "No excitement, enthusiasm, apologising, or hedging. State facts. State uncertainty as fact." },
  { title: "Short sentences", desc: "One idea per sentence. Active voice. No semicolons, no nested clauses." },
  { title: "No filler", desc: 'Remove: "certainly", "absolutely", "of course", "it\'s worth noting", "interestingly", "essentially".' },
];

export default function VoiceRules() {
  return (
    <div className="section" id="voice">
      <div className="section-label">Voice &amp; behaviour — 7 mandatory rules</div>

      <div style={{ display: 'grid', gap: 'var(--space-3)', marginBottom: 'var(--space-8)' }}>
        {RULES.map((r, i) => (
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
            <div>
              <div style={{ fontWeight: 700, marginBottom: 2 }}>{r.title}</div>
              <div style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', lineHeight: 1.5 }}>{r.desc}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid-2" style={{ gap: 'var(--space-4)' }}>
        <div>
          <h3 style={{ marginTop: 0 }}>Correct</h3>
          <div className="chat-bubble" style={{ fontSize: 'var(--text-sm)' }}>
            <div className="bubble-label">Assistant</div>
            <p style={{ marginBottom: 'var(--space-2)' }}>
              The <code>UserService.create</code> method throws when <code>email</code> is undefined. Lines 42-47 don't validate input before the database call.
            </p>
            <pre><code>{'if (!email) throw new ValidationError(\'Email required\');'}</code></pre>
            <p style={{ marginBottom: 0, color: 'var(--text-secondary)' }}>
              Run <code>npm test -- --grep "UserService"</code> to verify.
            </p>
          </div>
          <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', padding: 'var(--space-3) var(--space-4)', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)' }}>
            <strong style={{ color: 'var(--text-secondary)' }}>Why this is correct:</strong> Direct answer first. Code example. Verification command. No filler.
          </p>
        </div>
        <div>
          <h3 style={{ marginTop: 0 }}>Incorrect</h3>
          <div className="chat-bubble" style={{ fontSize: 'var(--text-sm)', opacity: 0.55, borderStyle: 'dashed' }}>
            <div className="bubble-label">Assistant ✗</div>
            <p style={{ marginBottom: 0 }}>
              Great question! Let me take a look at this for you. It appears that there might be an issue with the UserService.create method. Based on my analysis, it seems like the email validation might not be working as expected. I'd recommend adding some validation logic. Let me know if you'd like me to elaborate further!
            </p>
          </div>
          <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', padding: 'var(--space-3) var(--space-4)', background: 'var(--destructive-subtle)', border: '1px solid color-mix(in srgb, var(--destructive) 15%, transparent)', borderRadius: 'var(--radius-md)' }}>
            <strong style={{ color: 'var(--destructive)' }}>Why this fails:</strong> Filler opener. Four hedges. No line numbers. No code example. Unnecessary prompt.
          </p>
        </div>
      </div>
    </div>
  );
}
