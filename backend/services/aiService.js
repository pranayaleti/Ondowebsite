/**
 * AI chat reply generation using OpenAI or Anthropic when API keys are set.
 * If no key is set, returns null so callers can fall back to rule-based responses.
 */
import { getAISystemPrompt } from '../constants/companyContext.js';
import { readAllDocs, formatDocsForPrompt } from './docReader.js';

const OPENAI_API_KEY = process.env.OPENAI_API_KEY?.trim();
const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY?.trim();
const AI_MODEL_OPENAI = process.env.AI_MODEL_OPENAI || 'gpt-4o-mini';
const AI_MODEL_ANTHROPIC = process.env.AI_MODEL_ANTHROPIC || 'claude-3-5-haiku-20241022';

const MAX_HISTORY = 20;
const QUICK_REPLIES_DEFAULT = [
  { label: 'Get a Quote', value: 'pricing' },
  { label: 'See Our Work', value: 'portfolio' },
  { label: 'Schedule a Call', value: 'schedule_call' },
  { label: 'Learn More', value: 'services' },
];

function isConfigured() {
  return !!(OPENAI_API_KEY || ANTHROPIC_API_KEY);
}

/**
 * Build messages array for LLM from conversation history + new user message.
 * Includes documentation content in system prompt.
 * @param {{ role: string, content: string }[]} history - recent messages (role + content)
 * @param {string} userContent - latest user message
 */
async function buildMessages(history, userContent) {
  // Read documentation files
  let docsContent = '';
  try {
    const docs = await readAllDocs();
    docsContent = formatDocsForPrompt(docs);
  } catch (err) {
    console.error('Error loading docs for AI prompt:', err.message);
    // Continue without docs if there's an error
  }

  // Build system prompt with documentation
  const systemPrompt = getAISystemPrompt(docsContent);
  
  const messages = [{ role: 'system', content: systemPrompt }];
  for (const m of history) {
    if (m.role && m.content) {
      messages.push({ role: m.role === 'assistant' ? 'assistant' : 'user', content: m.content });
    }
  }
  messages.push({ role: 'user', content: userContent });
  return messages;
}

/**
 * Call OpenAI Chat Completions. Returns { content, quickReplies } or null.
 */
async function generateWithOpenAI(messages) {
  if (!OPENAI_API_KEY) return null;
  try {
    const openai = (await import('openai')).default;
    const client = new openai({ apiKey: OPENAI_API_KEY });
    const completion = await client.chat.completions.create({
      model: AI_MODEL_OPENAI,
      messages,
      max_tokens: 512,
      temperature: 0.7,
    });
    const content = completion.choices?.[0]?.message?.content?.trim();
    if (!content) return null;
    return { content, quickReplies: QUICK_REPLIES_DEFAULT };
  } catch (err) {
    console.error('OpenAI AI reply error:', err?.message || err);
    return null;
  }
}

/**
 * Call Anthropic Messages API. Returns { content, quickReplies } or null.
 */
async function generateWithAnthropic(messages) {
  if (!ANTHROPIC_API_KEY) return null;
  try {
    const { Anthropic } = await import('@anthropic-ai/sdk');
    const client = new Anthropic({ apiKey: ANTHROPIC_API_KEY });
    // System message should already be included from buildMessages, but fallback if missing
    const systemMessage = messages.find((m) => m.role === 'system');
    const system = systemMessage?.content || getAISystemPrompt('');
    const chatMessages = messages.filter((m) => m.role !== 'system');
    const response = await client.messages.create({
      model: AI_MODEL_ANTHROPIC,
      max_tokens: 512,
      system,
      messages: chatMessages.map((m) => ({
        role: m.role === 'user' ? 'user' : 'assistant',
        content: m.content,
      })),
    });
    const block = response.content?.find((b) => b.type === 'text');
    const content = block?.text?.trim();
    if (!content) return null;
    return { content, quickReplies: QUICK_REPLIES_DEFAULT };
  } catch (err) {
    console.error('Anthropic AI reply error:', err?.message || err);
    return null;
  }
}

/**
 * Generate an assistant reply for the given conversation history and new user message.
 * Uses OpenAI if OPENAI_API_KEY is set, otherwise Anthropic if ANTHROPIC_API_KEY is set.
 * @param {{ role: string, content: string }[]} recentMessages - last N messages (role, content)
 * @param {string} userContent - new user message
 * @returns {Promise<{ content: string, quickReplies?: { label: string, value: string }[] } | null>}
 */
async function generateReply(recentMessages, userContent) {
  if (!isConfigured()) return null;
  const messages = await buildMessages(recentMessages, userContent);
  const reply = OPENAI_API_KEY
    ? await generateWithOpenAI(messages)
    : await generateWithAnthropic(messages);
  return reply;
}

export { isConfigured, generateReply, MAX_HISTORY };
