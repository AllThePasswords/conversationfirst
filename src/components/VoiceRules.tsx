const RULES = [
  { title: "Answer first", desc: "Direct answer in the first sentence." },
  { title: "Cite everything", desc: "Every claim has a source." },
  { title: "Give examples", desc: "Follow abstractions with code, data, or before/after." },
  { title: "Stop when done", desc: "No padding, no summaries, no elaboration prompts." },
  { title: "No emotion", desc: "No excitement, apologising, or hedging." },
  { title: "Short sentences", desc: "One idea per sentence. Active voice." },
  { title: "No filler", desc: 'Cut "certainly", "absolutely", "of course", "interestingly".' },
];

export default function VoiceRules() {
  return (
    <>
      <div style={{ display: 'grid', gap: 'var(--space-2)', marginBottom: 'var(--space-10)' }}>
        {RULES.map((r, i) => (
          <div key={i} style={{
            display: 'flex',
            gap: 'var(--space-3)',
            alignItems: 'baseline',
            padding: 'var(--space-3) var(--space-4)',
            background: 'var(--surface)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-md)',
          }}>
            <span style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 'var(--text-xs)',
              fontWeight: 600,
              color: 'var(--accent)',
              minWidth: 16,
            }}>{i + 1}</span>
            <span style={{ fontWeight: 700, fontSize: 'var(--text-sm)' }}>{r.title}</span>
            <span style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)' }}>{r.desc}</span>
          </div>
        ))}
      </div>

      <div className="grid-2" style={{ gap: 'var(--space-4)' }}>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <h3 style={{ marginTop: 0 }}>Correct</h3>
          <div className="chat-bubble" style={{ fontSize: 'var(--text-sm)', flex: 1 }}>

            <p style={{ marginBottom: 'var(--space-2)' }}>
              The <code>UserService.create</code> method throws when <code>email</code> is undefined. Lines 42-47 don't validate input before the database call.
            </p>
            <pre><code>{'if (!email) throw new ValidationError(\'Email required\');'}</code></pre>
            <p style={{ marginBottom: 0, color: 'var(--text-secondary)' }}>
              Run <code>npm test -- --grep "UserService"</code> to verify.
            </p>
          </div>
          <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', padding: 'var(--space-3) var(--space-4)', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)' }}>
            Direct answer, code example, verification command. No filler.
          </p>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <h3 style={{ marginTop: 0 }}>Incorrect</h3>
          <div className="chat-bubble" style={{ fontSize: 'var(--text-sm)', opacity: 0.7, borderStyle: 'dashed', flex: 1 }}>

            <p style={{ marginBottom: 0 }}>
              Great question! Let me take a look at this for you. It appears that there might be an issue with the UserService.create method. Based on my analysis, it seems like the email validation might not be working as expected. I'd recommend adding some validation logic. Let me know if you'd like me to elaborate further!
            </p>
          </div>
          <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', padding: 'var(--space-3) var(--space-4)', background: 'var(--destructive-subtle)', border: '1px solid color-mix(in srgb, var(--destructive) 15%, transparent)', borderRadius: 'var(--radius-md)' }}>
            Filler opener. Four hedges. No code. Unnecessary prompt.
          </p>
        </div>
      </div>
    </>
  );
}
