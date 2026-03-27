"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface Message {
  id: string;
  role: "user" | "system";
  content: string;
  status?: "thinking" | "done" | "error";
}

const EXAMPLE_CHIPS = [
  "Change slide 3 title",
  "Switch to Dashboard theme",
  "Make intro slide longer",
  "Remove the last slide",
  "Add a key takeaways slide",
  "Make the talking head smaller",
];

interface ChatEditorProps {
  jobId: string;
}

export function ChatEditor({ jobId }: ChatEditorProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  async function sendMessage(text: string) {
    if (!text.trim() || sending) return;

    const userMsg: Message = {
      id: crypto.randomUUID(),
      role: "user",
      content: text.trim(),
    };
    const thinkingMsg: Message = {
      id: crypto.randomUUID(),
      role: "system",
      content: "",
      status: "thinking",
    };

    setMessages((prev) => [...prev, userMsg, thinkingMsg]);
    setInput("");
    setSending(true);

    try {
      const res = await fetch(`/api/project/${jobId}/edit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text.trim(), preview: true }),
      });
      const data = (await res.json().catch(() => ({}))) as { reply?: string; error?: string };
      if (!res.ok) throw new Error(data.error ?? "Couldn't apply that change. Try rephrasing?");

      setMessages((prev) =>
        prev.map((m) =>
          m.id === thinkingMsg.id
            ? { ...m, content: data.reply ?? "Done.", status: "done" as const }
            : m
        )
      );
    } catch {
      setMessages((prev) =>
        prev.map((m) =>
          m.id === thinkingMsg.id
            ? { ...m, content: "Couldn't apply that change. Try rephrasing?", status: "error" as const }
            : m
        )
      );
    } finally {
      setSending(false);
    }
  }

  const isEmpty = messages.length === 0;

  return (
    <div className="flex h-full flex-col bg-card/50">
      {/* Header */}
      <div className="flex items-center gap-2.5 border-b border-border/40 px-4 py-3">
        <div className="flex size-7 items-center justify-center rounded-lg bg-primary/15">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4 text-primary">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09Z" />
          </svg>
        </div>
        <div>
          <h3 className="text-sm font-semibold text-foreground">AI Editor</h3>
          <p className="text-[10px] text-muted-foreground">Edit your video with natural language</p>
        </div>
      </div>

      {/* Messages area */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3">
        {isEmpty && (
          <div className="flex flex-col items-center justify-center py-6 text-center">
            {/* AI sparkle icon */}
            <div className="flex size-12 items-center justify-center rounded-2xl bg-primary/10 mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 text-primary">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 0 0-2.455 2.456Z" />
              </svg>
            </div>
            <p className="text-sm font-medium text-foreground mb-1">What would you like to change?</p>
            <p className="text-xs text-muted-foreground mb-5 max-w-[260px]">
              Describe any edit — slide content, timing, theme, layout, or styling.
            </p>
            <div className="flex flex-wrap justify-center gap-1.5">
              {EXAMPLE_CHIPS.map((chip) => (
                <button
                  key={chip}
                  onClick={() => sendMessage(chip)}
                  className="rounded-full border border-border/60 bg-muted/50 px-2.5 py-1 text-[11px] text-muted-foreground transition-all hover:border-primary/40 hover:text-primary hover:bg-primary/5"
                >
                  {chip}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((msg) => (
          <div
            key={msg.id}
            className={cn("flex", msg.role === "user" ? "justify-end" : "justify-start")}
          >
            {msg.role === "system" && (
              <div className="mr-2 mt-1 flex size-6 shrink-0 items-center justify-center rounded-full bg-primary/15">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="size-3 text-primary">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09Z" />
                </svg>
              </div>
            )}
            <div
              className={cn(
                "max-w-[80%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed",
                msg.role === "user"
                  ? "bg-primary text-primary-foreground rounded-br-md"
                  : msg.status === "error"
                  ? "bg-destructive/10 text-destructive rounded-bl-md"
                  : "bg-muted/80 text-foreground rounded-bl-md"
              )}
            >
              {msg.status === "thinking" ? (
                <div className="flex items-center gap-1.5 py-0.5">
                  <div className="flex gap-0.5">
                    <span className="size-1.5 rounded-full bg-primary/60 animate-bounce" />
                    <span className="size-1.5 rounded-full bg-primary/60 animate-bounce [animation-delay:0.15s]" />
                    <span className="size-1.5 rounded-full bg-primary/60 animate-bounce [animation-delay:0.3s]" />
                  </div>
                  <span className="text-xs text-muted-foreground ml-1">Thinking...</span>
                </div>
              ) : (
                msg.content
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Input area */}
      <div className="border-t border-border/40 p-3">
        <form
          onSubmit={(e) => { e.preventDefault(); sendMessage(input); }}
          className="relative"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Describe changes to your video..."
            disabled={sending}
            className="w-full rounded-xl border border-border/60 bg-muted/30 pl-4 pr-12 py-3 text-sm placeholder:text-muted-foreground/50 focus-visible:border-primary/50 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary/30 disabled:opacity-50 transition-colors"
          />
          <button
            type="submit"
            disabled={!input.trim() || sending}
            aria-label="Send message"
            className="absolute right-2 top-1/2 -translate-y-1/2 flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground transition-all hover:bg-primary/90 disabled:opacity-30 disabled:hover:bg-primary"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="size-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5" />
            </svg>
          </button>
        </form>
      </div>
    </div>
  );
}
