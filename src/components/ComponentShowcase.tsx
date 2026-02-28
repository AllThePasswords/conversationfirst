export default function ComponentShowcase() {
  return (
    <section className="section" id="components" aria-labelledby="components-heading">
      <h2 className="section-label" id="components-heading">App components — all tokens, no custom values</h2>

      <h3 style={{ marginTop: 0 }}>Buttons</h3>
      <div style={{ display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap', marginBottom: 'var(--space-6)', alignItems: 'center' }}>
        <button className="btn btn-primary">Primary</button>
        <button className="btn btn-secondary">Secondary</button>
        <button className="btn btn-ghost">Ghost</button>
        <button className="btn btn-destructive">Delete</button>
        <button className="btn btn-primary btn-sm">Small</button>
      </div>

      <h3>Badges</h3>
      <div style={{ display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap', marginBottom: 'var(--space-6)' }}>
        <span className="badge badge-accent">Active</span>
        <span className="badge badge-warning">Pending</span>
        <span className="badge badge-destructive">Error</span>
        <span className="badge badge-muted">Draft</span>
      </div>

      <h3>Alerts</h3>
      <div className="alert alert-accent"><div><strong>Info:</strong> Press <kbd>⌘K</kbd> to open command palette.</div></div>
      <div className="alert alert-warning"><div><strong>Warning:</strong> API key expires in 3 days.</div></div>
      <div className="alert alert-destructive"><div><strong>Error:</strong> Deployment failed. Check build logs.</div></div>

      <h3>Cards</h3>
      <div className="grid-3" style={{ marginBottom: 'var(--space-6)' }}>
        <div className="card">
          <div className="card-title">Weekly Summary</div>
          <div className="card-desc">AI digest of team activity and blockers.</div>
          <div className="card-meta">2 hours ago</div>
        </div>
        <div className="card">
          <div className="card-title">Meeting Notes</div>
          <div className="card-desc">Transcribed notes from calendar events.</div>
          <div className="card-meta">3 new</div>
        </div>
        <div className="card">
          <div className="card-title">Research Agent</div>
          <div className="card-desc">Deep research with citations.</div>
          <div className="card-meta"><span className="badge badge-accent">Beta</span></div>
        </div>
      </div>

      <h3>Stats</h3>
      <div className="grid-3" style={{ marginBottom: 'var(--space-6)' }}>
        <div className="card stat">
          <div className="stat-value">2,847</div>
          <div className="stat-label">Messages</div>
        </div>
        <div className="card stat">
          <div className="stat-value">94.2%</div>
          <div className="stat-label">Accuracy</div>
        </div>
        <div className="card stat">
          <div className="stat-value">1.8s</div>
          <div className="stat-label">Latency</div>
        </div>
      </div>

      <h3>Forms</h3>
      <div style={{ maxWidth: 440, marginBottom: 'var(--space-6)' }}>
        <div className="input-group">
          <label className="input-label" htmlFor="demo-project">Project name</label>
          <input id="demo-project" className="input" defaultValue="Conversation First" />
        </div>
        <div className="input-group">
          <label className="input-label" htmlFor="demo-endpoint">Endpoint</label>
          <div className="input-hint" id="demo-endpoint-hint">Base URL for the AI service</div>
          <input id="demo-endpoint" className="input input-mono" defaultValue="https://api.anthropic.com/v1" aria-describedby="demo-endpoint-hint" />
        </div>
        <div className="input-group">
          <label className="input-label" htmlFor="demo-prompt">System prompt</label>
          <textarea id="demo-prompt" className="input" defaultValue="You are a computer. Answer directly. Cite sources. Give examples. Do not editorialize." />
        </div>
        <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
          <button className="btn btn-primary">Save</button>
          <button className="btn btn-secondary">Cancel</button>
        </div>
      </div>

      <h3>Navigation</h3>
      <div className="grid-2" style={{ marginBottom: 'var(--space-6)' }}>
        <div className="sidebar">
          <div className="sidebar-title">Workspace</div>
          <button className="nav-item active">◆ Dashboard</button>
          <button className="nav-item">◇ Conversations</button>
          <button className="nav-item">◇ Documents</button>
          <div className="sidebar-title" style={{ marginTop: 'var(--space-4)' }}>Settings</div>
          <button className="nav-item">◇ Configuration</button>
          <button className="nav-item">◇ API keys</button>
        </div>
        <div>
          <h4>Empty state</h4>
          <div className="card">
            <div className="empty-state">
              <p>No conversations yet.</p>
              <button className="btn btn-primary">New conversation</button>
            </div>
          </div>
        </div>
      </div>

      <h3>Modal</h3>
      <div className="card" style={{ padding: 0, overflow: 'hidden', marginBottom: 'var(--space-6)' }}>
        <div style={{ background: 'color-mix(in srgb, var(--bg) 60%, transparent)', padding: 'var(--space-8)', display: 'flex', justifyContent: 'center' }}>
          <div className="modal" style={{ position: 'static' }}>
            <h2>Delete conversation?</h2>
            <p>Permanent. Cannot be undone.</p>
            <div className="modal-actions">
              <button className="btn btn-secondary">Cancel</button>
              <button className="btn btn-destructive">Delete</button>
            </div>
          </div>
        </div>
      </div>

      <h3>Toast</h3>
      <div style={{ marginBottom: 'var(--space-6)' }}>
        <span className="toast">✓ Exported</span>
      </div>
    </section>
  );
}
