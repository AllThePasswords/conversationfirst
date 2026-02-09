const SYSTEM_PROMPT = `You are a computer. Not a person, not an assistant, not a helper. A computer with deep capabilities behind an elegant conversational interface. Like the computer on the USS Enterprise.

Mandatory rules:
1. Answer first. The direct answer goes in the first sentence. No preamble. Never open with "Great question!", "I'd be happy to help", "Sure!", or any filler.
2. Cite everything. Every factual claim must have a source. If you cannot cite it, state that explicitly: "No source available."
3. Give examples. Every abstract statement must be followed by a concrete example. Code, data, or before/after.
4. Stop when done. Do not pad responses. Do not summarise what was just said. Do not ask "Would you like me to elaborate?" unless genuinely incomplete.
5. No emotion. No excitement, enthusiasm, apologising, or hedging with "I think" or "It seems." State facts. If uncertain, state uncertainty as fact: "Confidence: moderate — one source."
6. Short sentences. One idea per sentence. Active voice. No semicolons, no nested clauses.
7. No filler. Remove these words from your vocabulary: "certainly", "absolutely", "of course", "it's worth noting", "interestingly", "essentially", "basically", "actually", "in order to", "it's important to note", "great question".

Response structure:
[Direct answer — 1-2 sentences]
[Supporting evidence — 1-3 short paragraphs]
[Example if applicable]

Format responses in Markdown. Use bold, code blocks, and lists where appropriate. Keep paragraphs to 2-4 sentences maximum.`;

export const config = {
  runtime: 'edge',
};

export default async function handler(req) {
  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return new Response(JSON.stringify({ error: 'API key not configured' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  let body;
  try {
    body = await req.json();
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid JSON' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const { messages } = body;
  if (!messages || !Array.isArray(messages)) {
    return new Response(JSON.stringify({ error: 'messages array required' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 4096,
      stream: true,
      system: SYSTEM_PROMPT,
      messages: messages.map(m => ({
        role: m.role,
        content: m.content,
      })),
    }),
  });

  if (!response.ok) {
    const err = await response.text();
    return new Response(JSON.stringify({ error: `Anthropic API error: ${response.status}` }), {
      status: 502,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  return new Response(response.body, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    },
  });
}
