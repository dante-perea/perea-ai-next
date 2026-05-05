export type KnowledgeType = 'knowledge_graph' | 'session' | 'idea_list' | 'document';

export function detectKnowledgeType(filename: string, content: Buffer): KnowledgeType {
  const lower = filename.toLowerCase();

  if (lower.endsWith('.json')) {
    try {
      // Parse from end of file to get full JSON (first 64KB may truncate)
      const text = content.toString('utf-8');
      const parsed = JSON.parse(text);
      // Support graphify's node-link format (nodes + links) and generic graph format (nodes + edges)
      if (parsed && typeof parsed === 'object' && Array.isArray(parsed.nodes) &&
          (Array.isArray(parsed.edges) || Array.isArray(parsed.links))) {
        return 'knowledge_graph';
      }
    } catch { /* malformed JSON */ }
    return 'document';
  }

  if (lower.endsWith('.md') || lower.endsWith('.txt') || lower.endsWith('.markdown')) {
    const text = content.toString('utf-8').slice(0, 32_768);
    if (/^(#+ )?(User|Human|Assistant):/m.test(text) || /^\*\*(User|Assistant):\*\*/m.test(text)) {
      return 'session';
    }
    const numberedItems = (text.match(/^\d+\.\s+\S/gm) ?? []).length;
    if (numberedItems >= 15) return 'idea_list';
  }

  return 'document';
}

// Lightweight heuristic when content is unavailable (large-file uploads).
export function detectKnowledgeTypeFromFilename(filename: string): KnowledgeType {
  const lower = filename.toLowerCase();
  const base = lower.split('/').pop() ?? lower;
  if ((base.includes('graph') || base.includes('knowledge')) && base.endsWith('.json')) {
    return 'knowledge_graph';
  }
  if (base.includes('session') && (base.endsWith('.md') || base.endsWith('.txt'))) {
    return 'session';
  }
  return 'document';
}
