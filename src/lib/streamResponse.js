export async function streamResponse(messages, onChunk, onDone, onError) {
  let response;
  try {
    response = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages }),
    });
  } catch (err) {
    onError('Network error. Check your connection.');
    return;
  }

  if (!response.ok) {
    let errMsg = `Error ${response.status}`;
    try {
      const data = await response.json();
      errMsg = data.error || errMsg;
    } catch {}
    onError(errMsg);
    return;
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop();

      for (const line of lines) {
        if (!line.startsWith('data: ')) continue;
        const data = line.slice(6).trim();
        if (data === '[DONE]') {
          onDone();
          return;
        }
        try {
          const parsed = JSON.parse(data);
          if (parsed.type === 'content_block_delta' && parsed.delta?.text) {
            onChunk(parsed.delta.text);
          }
          if (parsed.type === 'message_stop') {
            onDone();
            return;
          }
        } catch {}
      }
    }
  } catch (err) {
    onError('Stream interrupted.');
    return;
  }

  onDone();
}
