import { approvedDocuments, sources } from "./sources.ts";

export const EMBEDDING_MODEL = "@cf/baai/bge-m3";
export const CHAT_MODEL = "@cf/google/gemma-4-26b-a4b-it";
export type KnowledgeChunk = {
  id: string; sourceId: string; title: string; section: string; href: string;
  projectSlug?: string; content: string; contentHash: string; embedding: number[];
};
export type KnowledgeIndex = {
  schemaVersion: 1; status: "ready" | "unindexed"; embeddingModel: string;
  dimensions: number | null; generatedAt: string | null; corpusHash: string | null;
  documents: { file: string; sourceId: string; contentHash: string }[];
  chunks: KnowledgeChunk[];
};
export async function contentHash(text: string): Promise<string> {
  const hash = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(text));
  return Array.from(new Uint8Array(hash), byte => byte.toString(16).padStart(2, "0")).join("");
}
export function validateVectors(value: unknown, count: number, dimensions?: number): number[][] {
  if (!Array.isArray(value) || value.length !== count || !count) throw new Error("Embedding batch count mismatch.");
  const width = dimensions ?? (Array.isArray(value[0]) ? value[0].length : 0);
  if (!Number.isInteger(width) || width < 1 || width > 16_384) throw new Error("Invalid embedding dimensions.");
  for (const vector of value) {
    if (!Array.isArray(vector) || vector.length !== width || vector.some(n => typeof n !== "number" || !Number.isFinite(n)) || !vector.some(n => n !== 0)) throw new Error("Invalid embedding vector or dimension mismatch.");
  }
  return value as number[][];
}
export async function validateIndex(value: unknown): Promise<KnowledgeIndex> {
  if (!value || typeof value !== "object") throw new Error("Invalid knowledge index.");
  const index = value as KnowledgeIndex;
  if (index.schemaVersion !== 1 || index.embeddingModel !== EMBEDDING_MODEL || !Array.isArray(index.chunks) || !Array.isArray(index.documents)) throw new Error("Unsupported knowledge index schema or model.");
  if (index.status === "unindexed" && !index.chunks.length && !index.documents.length && index.dimensions === null) return index;
  if (index.status !== "ready" || !index.chunks.length || index.chunks.length > 1000 || !index.dimensions || !index.generatedAt || !/^[a-f0-9]{64}$/.test(index.corpusHash ?? "")) throw new Error("Incomplete knowledge index.");
  const ids = new Set<string>(), docIds = new Set<string>();
  for (const doc of index.documents) {
    if (!approvedDocuments.some(item => item.file === doc.file && item.sourceId === doc.sourceId) || docIds.has(doc.sourceId) || !/^[a-f0-9]{64}$/.test(doc.contentHash)) throw new Error("Invalid knowledge source manifest.");
    docIds.add(doc.sourceId);
  }
  validateVectors(index.chunks.map(chunk => chunk.embedding), index.chunks.length, index.dimensions);
  for (const chunk of index.chunks) {
    const source = sources[chunk.sourceId];
    if (!source || !docIds.has(chunk.sourceId) || chunk.href !== source.href || chunk.title !== source.title || typeof chunk.id !== "string" || !chunk.id.startsWith(`${chunk.sourceId}:`) || ids.has(chunk.id) || typeof chunk.section !== "string" || !chunk.section.trim() || typeof chunk.content !== "string" || !chunk.content.trim() || chunk.content.length > 8000 || (chunk.projectSlug && !["sportlynk", "fitpilot", "sukoon", "eduverse"].includes(chunk.projectSlug))) throw new Error("Invalid chunk metadata.");
    if (chunk.contentHash !== await contentHash(chunk.content)) throw new Error("Knowledge chunk hash mismatch.");
    ids.add(chunk.id);
  }
  if (index.corpusHash !== await contentHash(JSON.stringify(index.documents))) throw new Error("Knowledge manifest hash mismatch.");
  return index;
}
