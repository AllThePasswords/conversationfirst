export default function ChatProcessing() {
  return (
    <div className="processing processing-minimal" style={{ padding: 'var(--space-2) 0' }}>
      <div className="processing-status">
        <div className="processing-cursor"></div>
        <div className="processing-text">
          Processing<span className="dot">.</span><span className="dot">.</span><span className="dot">.</span>
        </div>
      </div>
    </div>
  );
}
