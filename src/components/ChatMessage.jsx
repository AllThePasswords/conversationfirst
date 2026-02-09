import MarkdownRenderer from './MarkdownRenderer';

export default function ChatMessage({ message }) {
  return (
    <div className={`chat-bubble ${message.role === 'user' ? 'user' : ''}`}>
      <div className="bubble-label">
        {message.role === 'user' ? 'You' : 'Assistant'}
      </div>
      {message.role === 'user' ? (
        <p style={{ marginBottom: 0 }}>{message.content}</p>
      ) : (
        <MarkdownRenderer content={message.content} />
      )}
    </div>
  );
}
