import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, '../..');
const envFiles = [path.join(projectRoot, '.env.local'), path.join(projectRoot, '.env')];

function loadEnvFile(filePath) {
  if (!fs.existsSync(filePath)) return;
  const lines = fs.readFileSync(filePath, 'utf8').split(/\r?\n/);
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const separatorIndex = trimmed.indexOf('=');
    if (separatorIndex === -1) continue;

    const key = trimmed.slice(0, separatorIndex).trim();
    let value = trimmed.slice(separatorIndex + 1).trim();
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }

    if (!process.env[key]) process.env[key] = value;
  }
}

function loadLocalEnv() {
  for (const filePath of envFiles) loadEnvFile(filePath);
}

loadLocalEnv();

function getFallbackMessage(messages = []) {
  const latestUserMessage = messages.filter((m) => m?.role === 'user').at(-1)?.content || 'your plan';
  return `I’m here to help. For now, I can suggest a practical next step: break the work into one small action for today, work for 25 minutes, and review what you completed. You mentioned “${latestUserMessage}”, so start there.`.trim();
}

function normalizeProviderUrl(rawUrl) {
  if (!rawUrl) return '';
  const trimmed = rawUrl.trim().replace(/\/$/, '');
  if (trimmed.endsWith('/chat/completions')) return trimmed;
  if (trimmed.endsWith('/v1')) return `${trimmed}/chat/completions`;
  if (trimmed.includes('groq.com')) return `${trimmed}/chat/completions`;
  return trimmed;
}

async function callProvider(url, key, model, messages) {
  const orderedUrls = [url, normalizeProviderUrl(url)].filter(Boolean);
  const uniqueUrls = [...new Set(orderedUrls)];

  let lastError = 'AI provider unavailable.';
  for (const candidate of uniqueUrls) {
    try {
      const response = await fetch(candidate, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${key}`
        },
        body: JSON.stringify({ model, messages, temperature: 0.5 })
      });

      const text = await response.text();
      let data = null;
      if (text) {
        try { data = JSON.parse(text); } catch { data = { error: { message: text } }; }
      }

      if (response.ok) {
        return data;
      }

      lastError = data?.error?.message || data?.message || `AI provider error (${response.status})`;
      if (response.status !== 404) break;
    } catch (error) {
      lastError = error instanceof Error ? error.message : 'AI provider request failed.';
    }
  }

  throw new Error(lastError);
}

export default async (req) => {
  if (req.method !== 'POST') {
    return Response.json({ error: 'Method not allowed' }, { status: 405 });
  }

  const url = process.env.AI_API_URL;
  const key = process.env.AI_API_KEY;
  const model = process.env.AI_MODEL || (url?.includes('groq') ? 'llama-3.3-70b-versatile' : 'gpt-4o-mini');

  if (!url || !key) {
    return Response.json({
      message: 'The assistant is running in offline mode because no AI provider credentials were found. I can still help with a simple study plan.'
    });
  }

  try {
    const body = await req.text();
    const parsedBody = body ? JSON.parse(body) : {};
    const messages = Array.isArray(parsedBody.messages) ? parsedBody.messages : [];
    const context = parsedBody.context || {};
    const mode = parsedBody.mode || 'general';

    const instruction = mode === 'timetable'
      ? 'For timetable requests, reply ONLY with valid JSON: {"message":string,"changes":[{"title":string,"day":0-6,"start":"HH:MM","end":"HH:MM","kind":"study"|"class"|"event","color":"#54a580"}]}. Include only sessions that should be added; do not invent fixed classes.'
      : 'Use normal conversational text.';

    const system = {
      role: 'system',
      content: `You are Trackly’s concise, encouraging academic planning assistant. Help students plan realistically, break down work, and protect rest. ${instruction} Current workspace context: ${JSON.stringify(context)}. Never claim to have completed actions or accessed data outside this context.`
    };

    const providerPayload = await callProvider(normalizeProviderUrl(url), key, model, [system, ...messages]);
    const message = providerPayload?.choices?.[0]?.message?.content || providerPayload?.message || 'No response received.';
    return Response.json({ message });
  } catch {
    return Response.json({
      message: 'The assistant is temporarily unavailable, but I can still help with a simple study plan. Try again in a moment or update the AI provider settings.'
    });
  }
};
