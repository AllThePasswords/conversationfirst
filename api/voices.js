import { createClient } from '@supabase/supabase-js';

export const config = {
  runtime: 'edge',
};

function getSupabase() {
  const url = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  return createClient(url, key);
}

async function getUser(req) {
  const supabase = getSupabase();
  if (!supabase) return null;
  const token = req.headers.get('authorization')?.replace('Bearer ', '');
  if (!token) return null;
  const { data: { user }, error } = await supabase.auth.getUser(token);
  if (error || !user) return null;
  return user;
}

async function getElevenLabsKey(userId) {
  const supabase = getSupabase();
  if (!supabase) return null;

  const { data: hh } = await supabase
    .from('user_households')
    .select('household_id')
    .eq('user_id', userId)
    .limit(1)
    .maybeSingle();

  if (!hh?.household_id) return null;

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
  if (req.method !== 'GET') {
    return new Response('Method not allowed', { status: 405 });
  }

  const user = await getUser(req);
  if (!user) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const apiKey = await getElevenLabsKey(user.id);
  if (!apiKey) {
    return new Response(JSON.stringify({ error: 'No ElevenLabs connection found.' }), {
      status: 404,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const response = await fetch('https://api.elevenlabs.io/v1/voices', {
      headers: { 'xi-api-key': apiKey },
    });

    if (!response.ok) {
      return new Response(JSON.stringify({ error: 'Failed to fetch voices from ElevenLabs.' }), {
        status: 502,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const data = await response.json();

    // Return a simplified voice list
    const voices = (data.voices || []).map(v => ({
      id: v.voice_id,
      name: v.name,
      category: v.category || 'custom',
      previewUrl: v.preview_url || null,
    }));

    return new Response(JSON.stringify({ voices }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch {
    return new Response(JSON.stringify({ error: 'Failed to reach ElevenLabs.' }), {
      status: 502,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
