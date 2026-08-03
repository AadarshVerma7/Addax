"use client";

import { useEffect, useRef, useState } from "react";
import { Bot, Sparkles } from "lucide-react";
import PromptInput from "./PromptInput";

type Role = "USER" | "ASSISTANT";

interface Message { id: string; role: Role; content: string; senderName?: string | null; }
interface SendMessageResponse { success: boolean; userMessage?: Message; assistantMessage?: Message; message?: string; }
interface MessageHistoryResponse { success: boolean; messages?: Message[]; hasMore?: boolean; nextCursor?: string | null; message?: string; }
interface ConversationsProps { conversationId: string | null; isCreatingVideo?: boolean; }

const suggestions = [
  "Give me the key takeaways from this video.",
  "Explain the most important concept simply.",
  "What should I remember for an exam?",
  "Which timestamps should I revisit?",
];

function MessageSkeleton() {
  return <div className="max-w-[86%] animate-pulse rounded-2xl border border-blue-400/10 bg-white/[0.035] p-3 shadow-[0_0_24px_rgba(59,130,246,0.18)]"><div className="mb-2 h-2.5 w-14 rounded-full bg-blue-200/20" /><div className="h-3 w-56 max-w-full rounded-full bg-blue-100/15" /><div className="mt-2 h-3 w-40 rounded-full bg-blue-100/10" /></div>;
}

function MessageBubble({ message }: { message: Message }) {
  const isUser = message.role === "USER";
  return <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}><div className={`max-w-[86%] rounded-2xl border px-3.5 py-3 text-sm leading-relaxed shadow-lg backdrop-blur-xl ${isUser ? "border-blue-300/20 bg-blue-500/15 text-blue-50" : "border-white/10 bg-white/[0.045] text-zinc-200"}`}><p className="mb-1 text-[11px] font-medium text-zinc-400">{isUser ? message.senderName || "You" : "Addax"}</p><p className="whitespace-pre-wrap">{message.content}</p></div></div>;
}

function Conversations({ conversationId, isCreatingVideo = false }: ConversationsProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const scrollerRef = useRef<HTMLDivElement>(null);
  const pendingMessageNumber = useRef(0);

  useEffect(() => {
    if (!conversationId) return;
    let cancelled = false;

    const fetchLatestMessages = async () => {
      setIsLoadingHistory(true);
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/conversations/${conversationId}/messages?limit=15`, { headers: { Authorization: `Bearer ${token}` } });
        const data = await response.json() as MessageHistoryResponse;
        if (!response.ok || !data.success || !data.messages) throw new Error(data.message || "Unable to load messages.");
        if (cancelled) return;
        setMessages(data.messages);
        setHasMore(Boolean(data.hasMore));
        setNextCursor(data.nextCursor || null);
        requestAnimationFrame(() => scrollerRef.current?.scrollTo({ top: scrollerRef.current.scrollHeight }));
      } catch (err: unknown) {
        if (!cancelled) setError(err instanceof Error ? err.message : "Unable to load messages.");
      } finally {
        if (!cancelled) setIsLoadingHistory(false);
      }
    };

    void fetchLatestMessages();
    return () => { cancelled = true; };
  }, [conversationId]);

  const loadOlderMessages = async () => {
    if (!conversationId || !nextCursor || !hasMore || isLoadingMore) return;
    const scroller = scrollerRef.current;
    const previousHeight = scroller?.scrollHeight || 0;
    setIsLoadingMore(true);

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/conversations/${conversationId}/messages?limit=15&cursor=${encodeURIComponent(nextCursor)}`, { headers: { Authorization: `Bearer ${token}` } });
      const data = await response.json() as MessageHistoryResponse;
      if (!response.ok || !data.success || !data.messages) throw new Error(data.message || "Unable to load older messages.");

      setMessages((current) => [...data.messages!, ...current]);
      setHasMore(Boolean(data.hasMore));
      setNextCursor(data.nextCursor || null);
      requestAnimationFrame(() => {
        if (scroller) scroller.scrollTop += scroller.scrollHeight - previousHeight;
      });
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Unable to load older messages.");
    } finally {
      setIsLoadingMore(false);
    }
  };

  const sendMessage = async (suggestion?: string) => {
    const content = (suggestion ?? input).trim();
    if (!content || !conversationId || isSending) return;
    setError(null); setInput(""); setIsSending(true);
    const temporaryMessage: Message = { id: `pending-${++pendingMessageNumber.current}`, role: "USER", content, senderName: "You" };
    setMessages((current) => [...current, temporaryMessage]);
    requestAnimationFrame(() => scrollerRef.current?.scrollTo({ top: scrollerRef.current.scrollHeight, behavior: "smooth" }));

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/messages`, { method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` }, body: JSON.stringify({ conversationId, content }) });
      const data = await response.json() as SendMessageResponse;
      if (!response.ok || !data.success || !data.userMessage || !data.assistantMessage) throw new Error(data.message || "Unable to send your message.");
      const { userMessage, assistantMessage } = data;
      setMessages((current) => [...current.map((message) => message.id === temporaryMessage.id ? userMessage : message), assistantMessage]);
      requestAnimationFrame(() => scrollerRef.current?.scrollTo({ top: scrollerRef.current.scrollHeight, behavior: "smooth" }));
    } catch (err: unknown) {
      setInput(content); setMessages((current) => current.filter((message) => message.id !== temporaryMessage.id));
      setError(err instanceof Error ? err.message : "Unable to send your message.");
    } finally { setIsSending(false); }
  };

  const isEmpty = messages.length === 0;
  const disabled = !conversationId || isCreatingVideo || isSending || isLoadingHistory;

  return <section className="flex h-[calc(100vh-32px)] min-h-[540px] w-full flex-col rounded-3xl border border-white/10 bg-zinc-950/55 p-4 shadow-[0_0_45px_rgba(59,130,246,0.07)] backdrop-blur-xl">
    <header className="flex items-center gap-2 border-b border-white/8 pb-3 text-white"><div className="rounded-xl border border-blue-300/15 bg-blue-400/10 p-2 text-blue-200"><Bot size={17} /></div><div><h2 className="text-base font-medium">Ask Chat</h2><p className="text-xs text-zinc-500">Learn from this video</p></div></header>
    <div ref={scrollerRef} onScroll={(event) => { if (event.currentTarget.scrollTop < 80) void loadOlderMessages(); }} className="no-scrollbar flex-1 space-y-3 overflow-y-auto py-5">
      {isLoadingMore && <MessageSkeleton />}
      {isLoadingHistory && <><MessageSkeleton /><MessageSkeleton /><MessageSkeleton /></>}
      {isEmpty && !isSending && !isLoadingHistory && <div className="flex h-full flex-col justify-center"><div className="mb-5 text-center"><Sparkles className="mx-auto mb-3 text-blue-300" size={22} /><p className="text-sm text-zinc-300">What would you like to understand?</p><p className="mt-1 text-xs text-zinc-500">Choose a prompt or ask in your own words.</p></div><div className="grid grid-cols-1 gap-2">{suggestions.map((suggestion) => <button key={suggestion} type="button" onClick={() => sendMessage(suggestion)} disabled={disabled} className="rounded-xl border border-white/10 bg-white/[0.035] px-3 py-2.5 text-left text-xs text-zinc-300 transition hover:border-blue-300/25 hover:bg-blue-400/10 hover:text-white disabled:cursor-not-allowed disabled:opacity-50">{suggestion}</button>)}</div></div>}
      {messages.map((message) => <MessageBubble key={message.id} message={message} />)}
      {isSending && <MessageSkeleton />}
      {error && <p className="rounded-xl border border-red-400/15 bg-red-400/5 px-3 py-2 text-xs text-red-300">{error}</p>}
      {!conversationId && !isCreatingVideo && <p className="text-center text-xs text-zinc-500">Select a video to start a conversation.</p>}
    </div>
    <PromptInput value={input} onChange={setInput} onSubmit={sendMessage} disabled={disabled} />
  </section>;
}

export default Conversations;
