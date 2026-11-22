// Dependency-free token estimate, not the hosted model's exact tokenizer.
// UTF-8 budgeting also bounds multilingual text without downloading tokenizer files.
export const estimateTokens = (text: string) => Math.ceil(new TextEncoder().encode(text).length / 4);
export const normalizeDocument = (text: string) => text.replace(/^\uFEFF/, "").normalize("NFC").replace(/\r\n?/g, "\n").replace(/[\t ]+$/gm, "").replace(/\n{3,}/g, "\n\n").trim();

function splitRecursive(text: string, budget: number, level = 0): string[] {
  if (estimateTokens(text) <= budget) return [text];
  const separators = [/\n\n+/, /\n/, /(?<=[.!?])\s+/, /\s+/];
  if (level >= separators.length) {
    const result: string[] = [];
    let part = "";
    for (const char of text) {
      if (estimateTokens(part + char) > budget) { result.push(part); part = ""; }
      part += char;
    }
    if (part) result.push(part);
    return result;
  }
  return text.split(separators[level]).filter(Boolean).flatMap(part => splitRecursive(part, budget, level + 1));
}

export function chunkMarkdown(raw: string, title: string, size = 400, overlap = 70): { section: string; content: string }[] {
  const text = normalizeDocument(raw);
  if (!text) return [];
  const sections: { section: string; text: string }[] = [];
  const headings: string[] = [];
  let lines: string[] = [], section = title;
  const flush = () => { if (lines.join("\n").trim()) sections.push({ section, text: lines.join("\n").trim() }); lines = []; };
  for (const line of text.split("\n")) {
    const heading = /^(#{1,6})\s+(.+)$/.exec(line);
    if (heading) { flush(); headings.length = heading[1].length - 1; headings.push(heading[2]); section = headings.filter(Boolean).join(" / "); }
    else lines.push(line);
  }
  flush();
  return sections.flatMap(({ section, text }) => {
    const prefix = `${title}\nSection: ${section}\n\n`;
    const budget = Math.max(100, size - estimateTokens(prefix));
    const pieces = splitRecursive(text, budget);
    const chunks: { section: string; content: string }[] = [];
    let current: string[] = [];
    for (const piece of pieces) {
      if (current.length && estimateTokens(current.concat(piece).join("\n\n")) > budget) {
        chunks.push({ section, content: prefix + current.join("\n\n") });
        const tail = current.join("\n\n").split(/\s+/);
        let kept = "";
        while (tail.length && estimateTokens(`${tail.at(-1)} ${kept}`) <= overlap) kept = `${tail.pop()} ${kept}`;
        current = kept.trim() ? [kept.trim()] : [];
        if (estimateTokens(current.concat(piece).join("\n\n")) > budget) current = [];
      }
      current.push(piece);
    }
    if (current.length) chunks.push({ section, content: prefix + current.join("\n\n") });
    return chunks;
  });
}
