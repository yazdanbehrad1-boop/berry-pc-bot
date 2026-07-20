import { supabase } from '../lib/supabase.js';

const SHORT_TERM_WINDOW = parseInt(process.env.SHORT_TERM_WINDOW || '12', 10);
const LONG_TERM_FETCH   = parseInt(process.env.LONG_TERM_FETCH   || '6',  10);

// ── Short-term memory (in-process, per session) ───────────────────────────────
// Map<sessionId, Array<{role, content}>>
const shortTermStore = new Map();

export function shortTerm(sessionId) {
  return {
    get() {
      return shortTermStore.get(sessionId) || [];
    },

    push(role, content) {
      const history = shortTermStore.get(sessionId) || [];
      history.push({ role, content });

      // Keep only the last N messages
      if (history.length > SHORT_TERM_WINDOW) {
        history.splice(0, history.length - SHORT_TERM_WINDOW);
      }

      shortTermStore.set(sessionId, history);
    },

    clear() {
      shortTermStore.delete(sessionId);
    },
  };
}

// ── Long-term memory (Supabase) ───────────────────────────────────────────────
export async function saveLongTerm(sessionId, role, content, metadata = {}) {
  const { error } = await supabase.from('conversations').insert({
    session_id: sessionId,
    role,
    content,
    metadata,
  });

  if (error) console.error('[Memory] Failed to persist message:', error.message);
}

/**
 * Fetch recent messages from THIS SAME session to provide continuity across
 * process restarts (the in-process short-term store is lost when the free
 * tier sleeps/redeploys).
 *
 * SECURITY: this previously queried `.neq('session_id', sessionId)` — i.e.
 * every OTHER session — and injected those messages into the current chat's
 * context. That leaked other users' recent conversations (names, emails,
 * order details they shared) into every stranger's chat. It MUST stay scoped
 * to the current session with `.eq`. Minor overlap with short-term memory is
 * harmless; cross-session data is never pulled in.
 */
export async function fetchLongTerm(sessionId) {
  const { data, error } = await supabase
    .from('conversations')
    .select('role, content, created_at')
    .eq('session_id', sessionId)
    .order('created_at', { ascending: false })
    .limit(LONG_TERM_FETCH);

  if (error) {
    console.error('[Memory] Failed to fetch long-term:', error.message);
    return [];
  }

  // Reverse so messages are chronological
  return (data || []).reverse();
}

/**
 * Fetch all messages for the current session (useful for a fresh process restart).
 */
export async function fetchSessionHistory(sessionId) {
  const { data, error } = await supabase
    .from('conversations')
    .select('role, content')
    .eq('session_id', sessionId)
    .order('created_at', { ascending: true })
    .limit(SHORT_TERM_WINDOW);

  if (error) {
    console.error('[Memory] Failed to fetch session history:', error.message);
    return [];
  }

  return data || [];
}
