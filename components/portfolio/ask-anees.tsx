"use client";

import { ArrowUp, ArrowUpRight, RotateCcw, Square, Trash2, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { HISTORY_LIMIT, QUESTION_LIMIT, readSSE, type ChatEvent, type ChatMessage, type Source } from "@/lib/ask-anees/protocol";
import { sources as registeredSources } from "@/lib/ask-anees/sources";
import styles from "./ask-anees.module.css";

type Message = { id: string; role: "user" | "assistant"; text: string; sources: Source[]; complete: boolean };
const starters = ["Tell me about SportLynk.", "Which technologies are evidenced by his projects?", "What did Anees build in Sukoon?"];
function recentHistory(messages: Message[]): ChatMessage[] {
  const history: ChatMessage[] = [];
  let total = 0;
  for (const message of messages.filter(message => message.complete && message.text).slice(-HISTORY_LIMIT).reverse()) {
    const content = message.text.slice(0, 2000);
    if (total + content.length > 8000) break;
    total += content.length; history.unshift({ role: message.role, content });
  }
  return history;
}

export function AskAnees() {
  const dialog = useRef<HTMLDialogElement>(null);
  const input = useRef<HTMLTextAreaElement>(null);
  const log = useRef<HTMLDivElement>(null);
  const request = useRef<AbortController | null>(null);
  const retry = useRef<{ question: string; history: ChatMessage[] } | null>(null);
  const stickToEnd = useRef(true);
  const [messages, setMessages] = useState<Message[]>([]);
  const [question, setQuestion] = useState("");
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState<{ available: boolean; message: string } | null>(null);
  const [error, setError] = useState("");
  const [announcement, setAnnouncement] = useState("");

  useEffect(() => {
    let statusController: AbortController | undefined;
    const open = () => {
      if (dialog.current?.open) return;
      dialog.current?.showModal();
      input.current?.focus({ preventScroll: true });
      statusController?.abort();
      statusController = new AbortController();
      fetch("/api/ask-anees", { signal: statusController.signal }).then(async response => {
        if (!response.ok) throw new Error("Unavailable");
        setStatus(await response.json());
      }).catch(() => { if (!statusController?.signal.aborted) setStatus({ available: false, message: "Ask Anees is unavailable right now. You can contact Anees directly." }); });
    };
    window.addEventListener("ask-anees:open", open);
    return () => { window.removeEventListener("ask-anees:open", open); statusController?.abort(); request.current?.abort(); };
  }, []);

  useEffect(() => {
    if (stickToEnd.current && log.current) log.current.scrollTop = log.current.scrollHeight;
  }, [messages, busy, error]);

  useEffect(() => {
    const viewport = window.visualViewport;
    const update = () => {
      dialog.current?.style.setProperty("--chat-height", `${viewport?.height ?? innerHeight}px`);
      dialog.current?.style.setProperty("--chat-top", `${viewport?.offsetTop ?? 0}px`);
    };
    update(); viewport?.addEventListener("resize", update); viewport?.addEventListener("scroll", update);
    return () => { viewport?.removeEventListener("resize", update); viewport?.removeEventListener("scroll", update); };
  }, []);

  function stop() { request.current?.abort(); setBusy(false); setAnnouncement("Generation stopped."); }
  function close() { stop(); dialog.current?.close(); }

  async function send(text: string, history = recentHistory(messages)) {
    if (request.current || !text.trim() || !status?.available) return;
    const controller = new AbortController();
    request.current = controller;
    retry.current = { question: text, history };
    const id = crypto.randomUUID();
    setMessages(previous => [...previous, { id: crypto.randomUUID(), role: "user", text, sources: [], complete: true }, { id, role: "assistant", text: "", sources: [], complete: false }]);
    setQuestion(""); setBusy(true); setError(""); setAnnouncement("Ask Anees is answering."); stickToEnd.current = true;
    let completed = false;
    try {
      const response = await fetch("/api/ask-anees", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ question: text, history }), signal: controller.signal });
      if (!response.ok) { const failure = await response.json().catch(() => ({})); throw new Error(failure.message ?? "Ask Anees is unavailable. Please try again later."); }
      if (!response.body || !response.headers.get("content-type")?.startsWith("text/event-stream")) throw new Error("The response was interrupted. Please retry.");
      for await (const frame of readSSE(response.body, controller.signal)) {
        const event = JSON.parse(frame) as ChatEvent;
        if (event.type === "delta" && typeof event.text === "string") setMessages(previous => previous.map(message => message.id === id ? { ...message, text: message.text + event.text } : message));
        if (event.type === "sources" && Array.isArray(event.sources)) {
          const safe = event.sources.flatMap(source => registeredSources[source.id]?.href === source.href ? [registeredSources[source.id]] : []);
          setMessages(previous => previous.map(message => message.id === id ? { ...message, sources: safe } : message));
        }
        if (event.type === "error") throw new Error(event.message);
        if (event.type === "complete") { completed = true; setMessages(previous => previous.map(message => message.id === id ? { ...message, complete: true } : message)); break; }
      }
      if (!completed && !controller.signal.aborted) throw new Error("The response was interrupted. Please retry your question.");
      if (completed) setAnnouncement("Answer complete. Source links follow the answer.");
    } catch (failure) {
      if (!controller.signal.aborted) { setError(failure instanceof Error ? failure.message : "The response was interrupted. Please retry."); setAnnouncement("The answer could not be completed."); }
    } finally { if (request.current === controller) request.current = null; setBusy(false); }
  }

  return <dialog ref={dialog} id="ask-anees" className={styles.drawer} aria-labelledby="ask-anees-title" aria-describedby="ask-anees-description" onCancel={stop} onClose={stop} onClick={event => { if (event.target === event.currentTarget) { const rect = event.currentTarget.getBoundingClientRect(); if (event.clientX < rect.left || event.clientX > rect.right) close(); } }}>
    <div className={styles.inner}>
      <header className={styles.header}><div><h2 id="ask-anees-title">Ask <em>Anees</em></h2><p id="ask-anees-description">An AI assistant for the person and work behind this portfolio.</p></div><button className={styles.iconButton} onClick={close} aria-label="Close Ask Anees"><X size={22} aria-hidden="true" /></button></header>
      <div className={styles.toolbar}><span>Curated knowledge. Public sources.</span><button onClick={() => { stop(); setMessages([]); setError(""); retry.current = null; setAnnouncement("Conversation cleared."); input.current?.focus(); }} disabled={!messages.length}><Trash2 size={15} aria-hidden="true" />Clear conversation</button></div>
      <div ref={log} className={styles.messages} role="region" aria-label="Conversation" tabIndex={0} onScroll={event => { const node = event.currentTarget; stickToEnd.current = node.scrollHeight - node.scrollTop - node.clientHeight < 80; }}>
        {!messages.length && <div className={styles.introduction}><h3>Start with the work.</h3><p>Ask about Anees’s projects, education or engineering decisions. Answers draw on approved public knowledge, with links back to the evidence.</p><div className={styles.starters}>{starters.map(starter => <button key={starter} disabled={busy || !status?.available} onClick={() => void send(starter)}>{starter}<ArrowUpRight size={17} aria-hidden="true" /></button>)}</div></div>}
        <ol className={styles.messageList}>{messages.map(message => <li key={message.id} className={message.role === "user" ? styles.userMessage : styles.assistantMessage}><span className={styles.speaker}>{message.role === "user" ? "You" : "Ask Anees · AI assistant"}</span><div className={styles.messageText}>{message.text || (busy ? "Finding relevant portfolio knowledge…" : "No answer generated.")}</div>{message.sources.length > 0 && <nav className={styles.sources} aria-label="Answer sources">{message.sources.map(source => <a key={source.id} href={source.href} onClick={close}>{source.title}<ArrowUpRight size={14} aria-hidden="true" /></a>)}</nav>}{message.text && !message.complete && !busy && <span className={styles.partial}>Partial answer</span>}</li>)}</ol>
        {error && <div className={styles.error} role="alert"><p>{error}</p><button onClick={() => { const last = retry.current; if (last) void send(last.question, last.history); }} disabled={busy}><RotateCcw size={16} aria-hidden="true" />Retry question</button></div>}
        {messages.length > 0 && !busy && !error && <button className={styles.followup} onClick={() => { setQuestion("Which engineering decisions shaped that project?"); input.current?.focus(); }}>Explore an engineering decision <ArrowUpRight size={16} aria-hidden="true" /></button>}
      </div>
      <form className={styles.composer} onSubmit={event => { event.preventDefault(); void send(question.trim()); }}>
        <p className={styles.status}>{status?.message ?? "Checking availability…"} {!status?.available && <a href="mailto:muhammadanees0511@gmail.com">Email Anees</a>}</p>
        <label htmlFor="ask-anees-question">Your question</label>
        <div className={styles.inputRow}><textarea ref={input} id="ask-anees-question" value={question} onChange={event => setQuestion(event.target.value)} maxLength={QUESTION_LIMIT} rows={2} placeholder="Ask about a project or engineering idea…" onKeyDown={event => { if (event.key === "Enter" && !event.shiftKey && !event.nativeEvent.isComposing) { event.preventDefault(); if (!busy) void send(question.trim()); } }} />{busy ? <button type="button" className={styles.send} onClick={stop} aria-label="Stop generation"><Square size={18} aria-hidden="true" /></button> : <button type="submit" className={styles.send} disabled={!question.trim() || !status?.available} aria-label="Send question"><ArrowUp size={22} aria-hidden="true" /></button>}</div>
        <p className={styles.note}>AI answers can be mistaken. Check the sources. This conversation stays in this tab.</p>
      </form>
      <span className={styles.srOnly} role="status" aria-live="polite">{announcement}</span>
    </div>
  </dialog>;
}
