import { createClient } from '@supabase/supabase-js';

export const config = {
  runtime: 'edge',
};

// Server-side Supabase client with service role (bypasses RLS)
function getSupabase() {
  const url = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  return createClient(url, key);
}

// Validate access token and return user
async function getUser(req) {
  const supabase = getSupabase();
  if (!supabase) return null;
  const token = req.headers.get('authorization')?.replace('Bearer ', '');
  if (!token) return null;
  const { data: { user }, error } = await supabase.auth.getUser(token);
  if (error || !user) return null;
  return user;
}

// Fetch user's ElevenLabs API key from vault connections
async function getElevenLabsKey(userId) {
  const supabase = getSupabase();
  if (!supabase) return null;

  // Resolve household
  const { data: hh } = await supabase
    .from('user_households')
    .select('household_id')
    .eq('user_id', userId)
    .limit(1)
    .maybeSingle();

  if (!hh?.household_id) return null;

  // Fetch active ElevenLabs connection
  const { data: conn } = await supabase
    .from('connections')
    .select('access_token')
    .eq('household_id', hh.household_id)
    .eq('provider_name', 'elevenlabs')
    .eq('status', 'active')
    .limit(1)
    .maybeSingle();

  return conn?.access_token || null;
}

export default async function handler(req) {
  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 });
  }

  const user = await getUser(req);
  if (!user) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
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

  const { text, voiceId } = body;
  if (!text || typeof text !== 'string') {
    return new Response(JSON.stringify({ error: 'text field required' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const apiKey = await getElevenLabsKey(user.id);
  if (!apiKey) {
    return new Response(JSON.stringify({ error: 'No ElevenLabs connection found. Add your API key in the Vault.' }), {
      status: 404,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // Default voice: Rachel (ElevenLabs default)
  const voice = voiceId || '21m00Tcm4TlvDq8ikWAM';

  try {
    const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voice}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'xi-api-key': apiKey,
      },
      body: JSON.stringify({
        text,
        model_id: 'eleven_multilingual_v2',
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.75,
        },
      }),
    });

    if (!response.ok) {
      const status = response.status;
      let message = 'ElevenLabs synthesis failed.';
      if (status === 401) message = 'ElevenLabs API key is invalid. Update it in the Vault.';
      else if (status === 429) message = 'ElevenLabs rate limit reached. Try again shortly.';
      else if (status === 422) message = 'Text too long or invalid for synthesis.';

      return new Response(JSON.stringify({ error: message }), {
        status: 502,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Convert audio response to base64
    const arrayBuffer = await response.arrayBuffer();
    const base64 = btoa(
      new Uint8Array(arrayBuffer).reduce((data, byte) => data + String.fromCharCode(byte), '')
    );

    return new Response(JSON.stringify({ audio: base64 }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: 'Failed to reach ElevenLabs.' }), {
      status: 502,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
