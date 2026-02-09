import MarkdownRenderer from './MarkdownRenderer';

export default function ChatMessage({ message }) {
  const displayContent = typeof message.content === 'string'
    ? message.content
    : Array.isArray(message.content)
      ? message.content.filter(b => b.type === 'text').map(b => b.text).join('')
      : '';

  return (
    <div className={`chat-bubble ${message.role === 'user' ? 'user' : ''}`}>
      <div className="bubble-label">
        {message.role === 'user' ? 'You' : 'Assistant'}
      </div>
      {message.role === 'user' ? (
        <p style={{ marginBottom: 0 }}>{message.content}</p>
      ) : (
        <>
          <MarkdownRenderer content={displayContent} />
          {message.citations && message.citations.length > 0 && (
            <div className="web-citations">
              <div className="web-citations-label">Sources</div>
              {message.citations.map((c, i) => (
                <a
                  key={i}
                  className="web-citation-link"
                  href={c.url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span className="web-citation-num">{i + 1}</span>
                  <span className="web-citation-title">{c.title}</span>
                  <span className="web-citation-url">{new URL(c.url).hostname}</span>
                  <span className="web-citation-arrow">↗</span>
                </a>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
