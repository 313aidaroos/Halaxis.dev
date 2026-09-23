"use client";

import { MessageCircle, Send, X } from "lucide-react";
import { useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { ChatMessage } from "@/lib/ai/types";

export function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      content:
        "I can explain Halaxis at a high level. I cannot give personalized investment advice or accept subscriptions. For interest, use the accredited-investor form.",
    },
  ]);
  const listRef = useRef<HTMLDivElement>(null);

  async function send() {
    const text = input.trim();
    if (!text || pending) return;

    const nextMessages: ChatMessage[] = [...messages, { role: "user", content: text }];
    setMessages(nextMessages);
    setInput("");
    setPending(true);
    setError(null);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: nextMessages }),
      });

      if (!response.ok) {
        const data = (await response.json().catch(() => ({}))) as { error?: string };
        throw new Error(data.error ?? "Hala is unavailable.");
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let assistant = "";
      setMessages((current) => [...current, { role: "assistant", content: "" }]);

      if (!reader) {
        throw new Error("No response stream.");
      }

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        assistant += decoder.decode(value, { stream: true });
        const snapshot = assistant;
        setMessages((current) => {
          const copy = [...current];
          copy[copy.length - 1] = { role: "assistant", content: snapshot };
          return copy;
        });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Chat failed.");
    } finally {
      setPending(false);
      listRef.current?.scrollTo({ top: listRef.current.scrollHeight });
    }
  }

  return (
    <div className="fixed bottom-4 right-4 z-40 flex flex-col items-end gap-3">
      {open ? (
        <div
          className="flex h-[28rem] w-[min(24rem,calc(100vw-2rem))] flex-col overflow-hidden rounded-xl border border-border bg-card shadow-2xl"
          role="dialog"
          aria-label="Hala — Halaxis educational assistant"
        >
          <div className="flex items-center justify-between border-b border-border px-4 py-3">
            <div>
              <p className="font-serif text-sm">Ask Hala</p>
              <p className="text-xs text-muted-foreground">Educational only</p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setOpen(false)}
              aria-label="Close chat"
            >
              <X />
            </Button>
          </div>
          <div ref={listRef} className="flex-1 space-y-3 overflow-y-auto p-4 text-sm">
            {messages.map((message, index) => (
              <div
                key={`${message.role}-${index}`}
                className={
                  message.role === "user"
                    ? "ml-8 rounded-lg bg-secondary px-3 py-2"
                    : "mr-6 rounded-lg bg-background px-3 py-2 text-muted-foreground"
                }
              >
                {message.content}
              </div>
            ))}
            {error ? (
              <p className="text-xs text-destructive" role="alert">
                {error}
              </p>
            ) : null}
          </div>
          <form
            className="flex gap-2 border-t border-border p-3"
            onSubmit={(event) => {
              event.preventDefault();
              void send();
            }}
          >
            <Input
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder="Ask a general question"
              aria-label="Message"
              disabled={pending}
            />
            <Button type="submit" size="icon" variant="gold" disabled={pending} aria-label="Send">
              <Send />
            </Button>
          </form>
        </div>
      ) : null}
      <Button
        variant="gold"
        className="shadow-lg"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-controls="halaxis-chat"
      >
        <MessageCircle />
        {open ? "Hide Hala" : "Ask Hala"}
      </Button>
    </div>
  );
}
