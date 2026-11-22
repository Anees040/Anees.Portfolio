import type { KnowledgeChunk, KnowledgeIndex } from "../../../lib/ask-anees/index-schema.ts";
import { estimateTokens } from "../../../lib/ask-anees/chunking.ts";
import { sources } from "../../../lib/ask-anees/sources.ts";

const stopwords = new Set("a an the and or to of in on for with from is are was has have he his him i me you your it its this that what which who how tell about does did built build project projects anees muhammad please".split(" "));
export const keywords = (text: string) => [...new Set((text.toLocaleLowerCase().match(/[\p{L}\p{N}]+/gu) ?? []).filter(word => !stopwords.has(word)))];
export function cosine(a: number[], b: number[]): number {
  if (a.length !== b.length) throw new Error("Query embedding dimension mismatch.");
  let dot = 0, aa = 0, bb = 0;
  for (let i = 0; i < a.length; i++) { dot += a[i] * b[i]; aa += a[i] ** 2; bb += b[i] ** 2; }
  return aa && bb ? dot / Math.sqrt(aa * bb) : 0;
}

export function retrieve(index: KnowledgeIndex, query: string, vector: number[], limit = 6) {
  const terms = keywords(query);
  const documents = index.chunks.map(chunk => keywords(`${chunk.title} ${chunk.section} ${chunk.content}`));
  const average = documents.reduce((sum, words) => sum + words.length, 0) / Math.max(1, documents.length);
  const scored = index.chunks.map((chunk, i) => {
    const words = documents[i];
    // BM25-style IDF and length normalization. No fabricated vector scores.
    const lexical = terms.reduce((sum, term) => {
      const tf = words.filter(word => word === term).length;
      const df = documents.filter(words => words.includes(term)).length;
      const idf = Math.log(1 + (documents.length - df + 0.5) / (df + 0.5));
      return sum + idf * tf * 2.2 / (tf + 1.2 * (0.25 + 0.75 * words.length / Math.max(1, average)));
    }, 0);
    return { chunk, similarity: cosine(vector, chunk.embedding), lexical, rankScore: 0 };
  });
  // Provisional BGE cutoff, evaluated with mocks; calibrate with live embeddings.
  const semantic = scored.filter(item => item.similarity >= 0.45).sort((a, b) => b.similarity - a.similarity);
  const lexical = scored.filter(item => item.lexical > 0).sort((a, b) => b.lexical - a.lexical);
  for (const list of [semantic, lexical]) list.forEach((item, rank) => { item.rankScore += 1 / (60 + rank + 1); });
  const ids = new Set<string>(), hashes = new Set<string>(), counts = new Map<string, number>();
  const ranked = scored.filter(item => item.rankScore > 0).sort((a, b) => b.rankScore - a.rankScore || b.lexical - a.lexical);
  const selected: typeof ranked = [];
  // First give each relevant source room; then add a second chunk where useful.
  for (const maxPerSource of [1, 2]) for (const item of ranked) {
    const { chunk } = item;
    if (selected.length >= limit || ids.has(chunk.id) || hashes.has(chunk.contentHash) || (counts.get(chunk.sourceId) ?? 0) >= maxPerSource) continue;
    ids.add(chunk.id); hashes.add(chunk.contentHash); counts.set(chunk.sourceId, (counts.get(chunk.sourceId) ?? 0) + 1); selected.push(item);
  }
  return selected;
}

export function boundContext(matches: { chunk: KnowledgeChunk }[]) {
  const chunks: KnowledgeChunk[] = [];
  let tokens = 0, characters = 0;
  for (const { chunk } of matches) {
    const cost = estimateTokens(JSON.stringify(chunk.content)) + 60;
    if (tokens + cost > 2300 || characters + chunk.content.length > 8000) continue;
    tokens += cost; characters += chunk.content.length; chunks.push(chunk);
  }
  return {
    context: JSON.stringify(chunks.map(chunk => ({ source: chunk.sourceId, section: chunk.section, content: chunk.content }))),
    sources: [...new Set(chunks.map(chunk => chunk.sourceId))].map(id => sources[id]),
  };
}
