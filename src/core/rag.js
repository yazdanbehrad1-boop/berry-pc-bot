import { pipeline } from '@xenova/transformers';
import { supabase } from '../lib/supabase.js';

const MATCH_THRESHOLD = parseFloat(process.env.RAG_MATCH_THRESHOLD || '0.55');
const MATCH_COUNT     = parseInt(process.env.RAG_MATCH_COUNT || '6', 10);

// Model is downloaded once (~25MB) and cached locally after that
let extractor = null;
async function getExtractor() {
  if (!extractor) {
    console.log('[RAG] Loading multilingual embedding model (first run: downloads ~120MB)…');
    extractor = await pipeline('feature-extraction', 'Xenova/paraphrase-multilingual-MiniLM-L12-v2');
    console.log('[RAG] Embedding model ready.');
  }
  return extractor;
}

export async function embed(text) {
  const extract = await getExtractor();
  const output  = await extract(text.replace(/\n/g, ' '), { pooling: 'mean', normalize: true });
  return Array.from(output.data);
}

export async function retrieve(query) {
  const queryEmbedding = await embed(query);

  const { data, error } = await supabase.rpc('match_documents_hybrid', {
    query_embedding: queryEmbedding,
    query_text:      query,
    match_threshold: MATCH_THRESHOLD,
    match_count:     MATCH_COUNT,
  });

  if (error) {
    console.error('[RAG] Supabase error:', error.message);
    return [];
  }

  return data || [];
}

export async function ingest(content, metadata = {}) {
  const embedding = await embed(content);

  const { error } = await supabase.from('documents').insert({
    content,
    metadata,
    embedding,
  });

  if (error) throw new Error(`[RAG ingest] ${error.message}`);
}
