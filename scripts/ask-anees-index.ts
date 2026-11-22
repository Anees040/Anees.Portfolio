import { readFile, realpath, writeFile, rename } from "node:fs/promises";
import { dirname, resolve, relative } from "node:path";
import { fileURLToPath } from "node:url";
import { chunkMarkdown, normalizeDocument } from "../lib/ask-anees/chunking.ts";
import { contentHash, EMBEDDING_MODEL, validateIndex, validateVectors, type KnowledgeChunk, type KnowledgeIndex } from "../lib/ask-anees/index-schema.ts";
import { approvedDocuments, sources } from "../lib/ask-anees/sources.ts";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const directory = resolve(root, "knowledge/ask-anees");
const output = resolve(root, "workers/ask-anees/src/knowledge/index.json");
async function main() {
  const documents: KnowledgeIndex["documents"] = [], chunks: KnowledgeChunk[] = [];
  const sourceRoot = await realpath(directory);
  for (const document of approvedDocuments) {
    const path = await realpath(resolve(directory, document.file));
    if (relative(sourceRoot, path).startsWith("..") || dirname(path) !== sourceRoot) throw new Error(`Approved source escaped the knowledge directory: ${document.file}`);
    const content = normalizeDocument(await readFile(path, "utf8"));
    if (!content) { console.warn(`Skipped empty approved document: ${document.file}`); continue; }
    if (content.length > 100_000) throw new Error(`Document too large: ${document.file}`);
    const source = sources[document.sourceId];
    const splits = chunkMarkdown(content, source.title);
    if (!splits.length) { console.warn(`Skipped document without body content: ${document.file}`); continue; }
    documents.push({ file: document.file, sourceId: source.id, contentHash: await contentHash(content) });
    for (let i = 0; i < splits.length; i++) chunks.push({ id: `${source.id}:${i + 1}`, sourceId: source.id, title: source.title, href: source.href, section: splits[i].section, content: splits[i].content, contentHash: await contentHash(splits[i].content), ...("projectSlug" in document ? { projectSlug: document.projectSlug } : {}), embedding: [] });
  }
  if (!chunks.length || chunks.length > 1000) throw new Error("Knowledge corpus is empty or too large.");
  console.log(`Approved corpus: ${documents.length} documents, ${chunks.length} chunks (400 estimated tokens, 70 overlap within sections).`);
  if (process.argv.includes("--dry-run")) { console.log("Dry run: no model calls or index writes."); return; }
  let previous: KnowledgeIndex | undefined;
  try { previous = await validateIndex(JSON.parse(await readFile(output, "utf8"))); }
  catch { console.warn("Previous index is invalid; its vectors will not be reused."); }
  const reusable = new Map(previous?.status === "ready" ? previous.chunks.map(chunk => [chunk.contentHash, chunk.embedding]) : []);
  for (const chunk of chunks) chunk.embedding = reusable.get(chunk.contentHash) ?? [];
  const pending = chunks.filter(chunk => !chunk.embedding.length);
  let dimensions = previous?.status === "ready" ? previous.dimensions! : undefined;
  if (pending.length) {
    const url = process.env.ASK_ANEES_WORKER_URL, secret = process.env.ASK_ANEES_INDEX_SECRET;
    if (!url || !secret || secret.length < 32) throw new Error("Set ASK_ANEES_WORKER_URL and ASK_ANEES_INDEX_SECRET in your shell, then rerun. No index was changed.");
    const endpoint = new URL(url);
    if (endpoint.protocol !== "https:" || endpoint.username || endpoint.password || endpoint.pathname !== "/" || endpoint.search || endpoint.hash) throw new Error("Use the HTTPS Worker origin as ASK_ANEES_WORKER_URL.");
    for (let offset = 0; offset < pending.length; offset += 8) {
      const batch = pending.slice(offset, offset + 8);
      const response = await fetch(new URL("/internal/embed", endpoint), { method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer ${secret}` }, body: JSON.stringify({ texts: batch.map(chunk => chunk.content) }), signal: AbortSignal.timeout(45_000), redirect: "error" });
      if (!response.ok) throw new Error(`Embedding batch failed (HTTP ${response.status}). Check authentication, availability and the free daily allocation. No retries or paid fallback; existing index unchanged.`);
      const result = await response.json() as { model?: string; dimensions?: number; data?: unknown };
      if (result.model !== EMBEDDING_MODEL) throw new Error("Embedding model mismatch.");
      const vectors = validateVectors(result.data, batch.length, dimensions);
      dimensions ??= vectors[0].length;
      if (result.dimensions !== dimensions) throw new Error("Embedding dimension metadata mismatch.");
      batch.forEach((chunk, i) => { chunk.embedding = vectors[i]; });
      console.log(`Embedded ${Math.min(offset + 8, pending.length)}/${pending.length} new chunks.`);
    }
  }
  const index: KnowledgeIndex = { schemaVersion: 1, status: "ready", embeddingModel: EMBEDDING_MODEL, dimensions: dimensions!, generatedAt: new Date().toISOString(), corpusHash: await contentHash(JSON.stringify(documents)), documents, chunks };
  await validateIndex(index);
  const json = JSON.stringify(index);
  if (Buffer.byteLength(json) > 2_500_000) throw new Error("Index exceeds the small-corpus budget (2.5 MB).");
  // Atomic replacement only after every real vector and hash passes validation.
  await writeFile(`${output}.tmp`, json, "utf8");
  await rename(`${output}.tmp`, output);
  console.log(`Saved ${documents.length} documents / ${chunks.length} chunks / ${dimensions} dimensions / ${(Buffer.byteLength(json) / 1024).toFixed(1)} KiB. Reused ${chunks.length - pending.length} unchanged chunks.`);
}
main().catch(error => { console.error(error instanceof Error ? error.message : "Indexing failed."); process.exitCode = 1; });
