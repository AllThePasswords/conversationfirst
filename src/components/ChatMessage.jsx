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
        <div>
          {Array.isArray(message.content) ? (
            <>
              {message.content.filter(b => b.type === 'image').map((img, i) => (
                <img
                  key={i}
                  src={img.url}
                  alt={`Uploaded image ${i + 1}`}
                  className="chat-user-image"
                  loading="lazy"
                />
              ))}
              {message.content.filter(b => b.type === 'text').map((b, i) => (
                <p key={i} style={{ marginBottom: 0 }}>{b.text}</p>
              ))}
            </>
          ) : (
            <p style={{ marginBottom: 0 }}>{message.content}</p>
          )}
        </div>
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
