"use client";

import { useEffect, useRef, useState } from "react";
import PromptInput from "./PromptInput";
import { Copy, Check } from "lucide-react";
import { renderMarkdown } from "../../../lib/markdown";

type Role = "USER" | "ASSISTANT";

interface Message {
  id: string;
  role: Role;
  content: string;
  senderName?: string | null;
}
interface SendMessageResponse {
  success: boolean;
  userMessage?: Message;
  assistantMessage?: Message;
  message?: string;
}
interface MessageHistoryResponse {
  success: boolean;
  messages?: Message[];
  hasMore?: boolean;
  nextCursor?: string | null;
  message?: string;
}
interface ConversationsProps {
  conversationId: string | null;
  isCreatingVideo?: boolean;
}

const suggestions = [
  "Give me the key takeaways from this video.",
  "Explain the most important concept simply.",
  "What should I remember for an exam?",
  "Which timestamps should I revisit?",
];

function MessageSkeleton() {
  return (
    <div className="flex flex-col items-start w-full gap-2 animate-pulse">
      <div className="h-10 w-48 bg-zinc-800/40 rounded-[20px] rounded-bl-[4px]" />
      <div className="h-3 w-8 bg-zinc-800/20 rounded-full ml-1" />
    </div>
  );
}

function MessageBubble({ message }: { message: Message }) {
  const isUser = message.role === "USER";
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(message.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy message:", err);
    }
  };

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"} w-full`}>
      <div className={`flex flex-col ${isUser ? "items-end" : "items-start"} max-w-[85%]`}>
        <div
          className={`px-4 py-2.5 text-[15px] leading-snug select-text break-words ${
            isUser
              ? "bg-[#0A84FF] text-white rounded-[20px] rounded-br-[4px] whitespace-pre-wrap"
              : "bg-[#262629] text-zinc-100 rounded-[20px] rounded-bl-[4px]"
          }`}
        >
          {isUser ? message.content : renderMarkdown(message.content)}
        </div>
        <button
          type="button"
          onClick={handleCopy}
          className="mt-1 flex h-6 w-6 items-center justify-center rounded-md bg-zinc-800/40 hover:bg-zinc-800/80 text-zinc-400 hover:text-zinc-200 transition-all active:scale-95 cursor-pointer focus:outline-none"
          title="Copy message"
        >
          {copied ? (
            <Check size={13} className="text-green-400" />
          ) : (
            <Copy size={13} />
          )}
        </button>
      </div>
    </div>
  );
}

function Conversations({
  conversationId,
  isCreatingVideo = false,
}: ConversationsProps) {
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
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/conversations/${conversationId}/messages?limit=15`,
          { headers: { Authorization: `Bearer ${token}` } },
        );
        const data = (await response.json()) as MessageHistoryResponse;
        if (!response.ok || !data.success || !data.messages)
          throw new Error(data.message || "Unable to load messages.");
        if (cancelled) return;
        setMessages(data.messages);
        setHasMore(Boolean(data.hasMore));
        setNextCursor(data.nextCursor || null);
        requestAnimationFrame(() =>
          scrollerRef.current?.scrollTo({
            top: scrollerRef.current.scrollHeight,
          }),
        );
      } catch (err: unknown) {
        if (!cancelled)
          setError(
            err instanceof Error ? err.message : "Unable to load messages.",
          );
      } finally {
        if (!cancelled) setIsLoadingHistory(false);
      }
    };

    void fetchLatestMessages();
    return () => {
      cancelled = true;
    };
  }, [conversationId]);

  const loadOlderMessages = async () => {
    if (!conversationId || !nextCursor || !hasMore || isLoadingMore) return;
    const scroller = scrollerRef.current;
    const previousHeight = scroller?.scrollHeight || 0;
    setIsLoadingMore(true);

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/conversations/${conversationId}/messages?limit=15&cursor=${encodeURIComponent(nextCursor)}`,
        { headers: { Authorization: `Bearer ${token}` } },
      );
      const data = (await response.json()) as MessageHistoryResponse;
      if (!response.ok || !data.success || !data.messages)
        throw new Error(data.message || "Unable to load older messages.");

      setMessages((current) => [...data.messages!, ...current]);
      setHasMore(Boolean(data.hasMore));
      setNextCursor(data.nextCursor || null);
      requestAnimationFrame(() => {
        if (scroller)
          scroller.scrollTop += scroller.scrollHeight - previousHeight;
      });
    } catch (err: unknown) {
      setError(
        err instanceof Error ? err.message : "Unable to load older messages.",
      );
    } finally {
      setIsLoadingMore(false);
    }
  };

  const sendMessage = async (suggestion?: string) => {
    const content = (suggestion ?? input).trim();
    if (!content || !conversationId || isSending) return;
    setError(null);
    setInput("");
    setIsSending(true);
    const temporaryMessage: Message = {
      id: `pending-${++pendingMessageNumber.current}`,
      role: "USER",
      content,
      senderName: "You",
    };
    setMessages((current) => [...current, temporaryMessage]);
    requestAnimationFrame(() =>
      scrollerRef.current?.scrollTo({
        top: scrollerRef.current.scrollHeight,
        behavior: "smooth",
      }),
    );

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/messages`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ conversationId, content }),
        },
      );
      const data = (await response.json()) as SendMessageResponse;
      if (
        !response.ok ||
        !data.success ||
        !data.userMessage ||
        !data.assistantMessage
      )
        throw new Error(data.message || "Unable to send your message.");
      const { userMessage, assistantMessage } = data;
      setMessages((current) => [
        ...current.map((message) =>
          message.id === temporaryMessage.id ? userMessage : message,
        ),
        assistantMessage,
      ]);
      requestAnimationFrame(() =>
        scrollerRef.current?.scrollTo({
          top: scrollerRef.current.scrollHeight,
          behavior: "smooth",
        }),
      );
    } catch (err: unknown) {
      setInput(content);
      setMessages((current) =>
        current.filter((message) => message.id !== temporaryMessage.id),
      );
      setError(
        err instanceof Error ? err.message : "Unable to send your message.",
      );
    } finally {
      setIsSending(false);
    }
  };

  const isEmpty = messages.length === 0;
  const disabled =
    !conversationId || isCreatingVideo || isSending || isLoadingHistory;

  return (
    <section className="flex h-[550px] lg:h-[calc(100vh-32px)] lg:min-h-[540px] w-full flex-col rounded-3xl border border-zinc-900 bg-black/60 p-4 backdrop-blur-xl">
      <header className="flex flex-col items-center border-b border-zinc-900 pb-3 text-white">
        <div className="w-10 h-10 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center text-sm font-bold text-white mb-1 shadow-inner select-none">
          A
        </div>
        <h2 className="text-sm font-semibold">Addax AI</h2>
        <p className="text-[10px] text-zinc-500">Active Now</p>
      </header>
      <div
        ref={scrollerRef}
        onScroll={(event) => {
          if (event.currentTarget.scrollTop < 80) void loadOlderMessages();
        }}
        className="no-scrollbar flex-1 space-y-4 overflow-y-auto py-5"
      >
        {isLoadingMore && <MessageSkeleton />}
        {isLoadingHistory && (
          <div className="space-y-4">
            <MessageSkeleton />
            <MessageSkeleton />
            <MessageSkeleton />
          </div>
        )}
        {isEmpty && !isSending && !isLoadingHistory && (
          <div className="flex h-full flex-col justify-center max-w-md mx-auto">
            <div className="mb-6 text-center">
              <h3 className="text-lg font-semibold text-zinc-200">
                Ask Addax Chat
              </h3>
              <p className="mt-1.5 text-sm text-zinc-500">
                Choose a quick prompt below or type your question.
              </p>
            </div>
            <div className="grid grid-cols-1 gap-2">
              {suggestions.map((suggestion) => (
                <button
                  key={suggestion}
                  type="button"
                  onClick={() => sendMessage(suggestion)}
                  disabled={disabled}
                  className="rounded-2xl border border-zinc-800 bg-[#1C1C1E] px-4 py-3 text-left text-xs font-medium text-zinc-300 transition hover:border-zinc-700 hover:bg-zinc-800/80 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        )}
        {messages.map((message) => (
          <MessageBubble key={message.id} message={message} />
        ))}
        {isSending && (
          <div className="flex items-start w-full gap-2">
            <div className="h-9 w-16 bg-[#262629] rounded-[20px] rounded-bl-[4px] flex items-center justify-center gap-1 px-3 py-2">
              <div className="w-1.5 h-1.5 bg-zinc-500 rounded-full animate-bounce [animation-delay:-0.3s]" />
              <div className="w-1.5 h-1.5 bg-zinc-500 rounded-full animate-bounce [animation-delay:-0.15s]" />
              <div className="w-1.5 h-1.5 bg-zinc-500 rounded-full animate-bounce" />
            </div>
          </div>
        )}
        {error && (
          <p className="rounded-xl border border-red-400/15 bg-red-400/5 px-3 py-2 text-xs text-red-300">
            {error}
          </p>
        )}
        {!conversationId && !isCreatingVideo && (
          <p className="text-center text-xs text-zinc-500">
            Select a video to start a conversation.
          </p>
        )}
      </div>
      <PromptInput
        value={input}
        onChange={setInput}
        onSubmit={sendMessage}
        disabled={disabled}
      />
    </section>
  );
}

export default Conversations;
