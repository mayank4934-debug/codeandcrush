import {
  BookOpen,
  Bot,
  Lightbulb,
  Loader2,
  Send,
  Sparkles,
  WifiOff,
  X,
  Zap,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { useApp } from "../context/AppContext";
import { useOpenAIChat, useProxyAIChat } from "../hooks/useQueries";

// ─── Behaviour Tracking (lightweight, guidance-adaptive only) ─────────────────

type TypingSpeed = "slow" | "medium" | "fast";
type HesitationLevel = "high" | "medium" | "low";

type BehaviourSignals = {
  typingSpeed: TypingSpeed;
  hesitationLevel: HesitationLevel;
  responseDelayMs: number;
  sessionNumber: number;
};

function getSessionNumber(): number {
  const raw = localStorage.getItem("cwc_session_count");
  const n = raw ? Number.parseInt(raw, 10) : 0;
  const next = n + 1;
  localStorage.setItem("cwc_session_count", String(next));
  return next;
}

function recordPageVisit(page: string) {
  if (!page) return;
  const raw = localStorage.getItem("cwc_page_visits");
  const visits: Array<{ page: string; ts: number }> = raw
    ? JSON.parse(raw)
    : [];
  // Limit to 20 items
  visits.push({ page, ts: Date.now() });
  localStorage.setItem("cwc_page_visits", JSON.stringify(visits.slice(-20)));
}

// ─── Quick Replies ────────────────────────────────────────────────────────────

const QUICK_REPLIES_GENERAL = [
  "Explain more",
  "Give me a hint",
  "Show an example",
  "What's next?",
];

const QUICK_REPLIES_CODE = [
  "Explain line by line",
  "What are common mistakes?",
  "Show another approach",
  "Time complexity?",
];

const QUICK_REPLIES_HINT = [
  "Give another hint",
  "I'm still confused",
  "Got it — what next?",
  "Show full solution",
];

function getSuggestions(ctx: "code" | "hint" | "general"): string[] {
  const pool =
    ctx === "code"
      ? QUICK_REPLIES_CODE
      : ctx === "hint"
        ? QUICK_REPLIES_HINT
        : QUICK_REPLIES_GENERAL;
  return pool.slice(0, 4);
}

// ─── Local Fallback ───────────────────────────────────────────────────────────

function localFallback(topic: string, userMsg: string): string {
  const lower = userMsg.toLowerCase();
  if (/summary|overview|what.*about|summarize/.test(lower)) {
    return `Here's a quick overview of "${topic}": Review the lesson material and examples provided — they cover the essential concepts. Work through each example step by step to build a solid understanding.`;
  }
  if (/hint|help|stuck|how|confused/.test(lower)) {
    return `For "${topic}", try breaking the problem into smaller steps. Identify what you know, what you need, and what connects them. The examples in the lesson are your best starting point.`;
  }
  if (/code|program|write|implement|function/.test(lower)) {
    return `Start with the simplest working version first. For "${topic}", identify the core pattern, implement it, then refine. Pseudocode before real code is always helpful.`;
  }
  if (/example|show|demonstrate/.test(lower)) {
    return `For "${topic}": trace through the code examples in the lesson notes step by step. Re-implementing them from scratch without looking is the fastest way to internalize the pattern.`;
  }
  if (/time complexity|big o|space complexity|complexity/.test(lower)) {
    return `For "${topic}" complexity analysis: count the operations relative to input size n. Nested loops → O(n²), single pass → O(n), halving each step → O(log n), constant work → O(1).`;
  }
  if (/explain|what is|define|definition/.test(lower)) {
    return `"${topic}" is a core CS concept. Start with the formal definition, then look at concrete examples to build intuition. The lesson material above covers it in detail.`;
  }
  return `Good question about "${topic}". Break it down: what do you already understand, and where exactly does it get unclear? Pinpointing the gap is the first step to solving it.`;
}

// ─── Types ────────────────────────────────────────────────────────────────────

export interface AdvancedChatbotProps {
  topicTitle: string;
  topicContent?: string;
  companionName?: string;
  placeholder?: string;
  context?: string;
  onClose?: () => void;
  className?: string;
}

interface ChatMsg {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  suggestions?: string[];
  hintCount?: number;
}

function makeId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

function formatTime(d: Date): string {
  return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

// ─── Typing Indicator ─────────────────────────────────────────────────────────

function TypingIndicator({ accentColor }: { accentColor: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 4, scale: 0.95 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className="flex justify-start items-end gap-2"
      data-ocid="advanced_chatbot.loading_state"
    >
      <div
        className="w-6 h-6 rounded-full flex items-center justify-center shrink-0 text-white shadow-sm"
        style={{ background: accentColor }}
      >
        <Bot className="w-3 h-3" />
      </div>
      <div
        className="rounded-2xl rounded-bl-sm px-4 py-3 border flex items-center gap-1.5 shadow-sm"
        style={{
          backgroundColor: `${accentColor}18`,
          borderColor: `${accentColor}33`,
        }}
      >
        {[0, 150, 300].map((delay) => (
          <motion.span
            key={delay}
            animate={{ y: [0, -5, 0] }}
            transition={{
              duration: 0.55,
              repeat: Number.POSITIVE_INFINITY,
              delay: delay / 1000,
              ease: "easeInOut",
            }}
            className="w-2 h-2 rounded-full block"
            style={{ backgroundColor: accentColor }}
          />
        ))}
      </div>
    </motion.div>
  );
}

// ─── Message Bubble ───────────────────────────────────────────────────────────

function MessageBubble({
  msg,
  isLatest,
  accentColor,
  onSuggestionClick,
  onGetSolution,
  loading,
}: {
  msg: ChatMsg;
  isLatest: boolean;
  accentColor: string;
  onSuggestionClick: (text: string) => void;
  onGetSolution: () => void;
  loading: boolean;
}) {
  const isUser = msg.role === "user";

  return (
    <motion.div
      key={msg.id}
      initial={{ opacity: 0, y: 12, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.25, ease: [0.25, 0.46, 0.45, 0.94] }}
      className={`flex flex-col gap-1 ${isUser ? "items-end" : "items-start"}`}
    >
      <div
        className={`flex items-end gap-1.5 max-w-[88%] ${isUser ? "flex-row-reverse" : "flex-row"}`}
      >
        {!isUser && (
          <div
            className="w-6 h-6 rounded-full flex items-center justify-center shrink-0 text-white mb-0.5 shadow-sm"
            style={{ background: accentColor }}
          >
            <Bot className="w-3 h-3" />
          </div>
        )}

        <div
          className={`rounded-2xl px-3.5 py-2.5 text-xs leading-relaxed ${
            isUser
              ? "bg-primary text-primary-foreground rounded-br-sm shadow-sm"
              : "text-foreground rounded-bl-sm border shadow-sm"
          }`}
          style={
            !isUser
              ? {
                  backgroundColor: `${accentColor}14`,
                  borderColor: isLatest
                    ? `${accentColor}44`
                    : `${accentColor}28`,
                }
              : {}
          }
        >
          <span style={{ whiteSpace: "pre-wrap" }}>{msg.content}</span>
        </div>
      </div>

      {/* Timestamp */}
      <span
        className={`text-[10px] text-muted-foreground px-1 ${isUser ? "text-right" : "text-left ml-8"}`}
      >
        {formatTime(msg.timestamp)}
      </span>

      {/* Quick reply suggestions — only on latest assistant message */}
      {!isUser && isLatest && !loading && (
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.18, duration: 0.2 }}
          className="ml-8 flex flex-col gap-1.5"
          data-ocid="advanced_chatbot.suggestions"
        >
          {/* Suggestion chips */}
          {msg.suggestions && msg.suggestions.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {msg.suggestions.map((chip) => (
                <button
                  key={chip}
                  type="button"
                  onClick={() => onSuggestionClick(chip)}
                  disabled={loading}
                  data-ocid="advanced_chatbot.suggestion_chip"
                  className="text-[11px] px-2.5 py-1 rounded-full border transition-all hover:scale-105 active:scale-95 disabled:opacity-40"
                  style={{
                    borderColor: `${accentColor}44`,
                    color: accentColor,
                    backgroundColor: `${accentColor}0f`,
                  }}
                >
                  {chip}
                </button>
              ))}
            </div>
          )}

          {/* "Get Solution" button appears after 2+ hints */}
          {(msg.hintCount ?? 0) >= 2 && (
            <button
              type="button"
              onClick={onGetSolution}
              disabled={loading}
              data-ocid="advanced_chatbot.get_solution_button"
              className="self-start text-[11px] px-3 py-1.5 rounded-lg font-semibold transition-all hover:opacity-90 active:scale-95 disabled:opacity-40 text-white"
              style={{ backgroundColor: accentColor }}
            >
              Get Full Solution
            </button>
          )}
        </motion.div>
      )}
    </motion.div>
  );
}

// ─── Auto-resize textarea ─────────────────────────────────────────────────────

function AutoResizeTextarea({
  value,
  onChange,
  onKeyDown,
  placeholder,
  disabled,
  maxLength,
  "data-ocid": dataOcid,
}: {
  value: string;
  onChange: (v: string) => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
  placeholder: string;
  disabled: boolean;
  maxLength: number;
  "data-ocid"?: string;
}) {
  const ref = useRef<HTMLTextAreaElement>(null);

  // biome-ignore lint/correctness/useExhaustiveDependencies: value is the only dep
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 120)}px`;
  }, [value]);

  return (
    <textarea
      ref={ref}
      value={value}
      rows={1}
      onChange={(e) => {
        if (e.target.value.length <= maxLength) onChange(e.target.value);
      }}
      onKeyDown={onKeyDown}
      placeholder={placeholder}
      disabled={disabled}
      data-ocid={dataOcid}
      style={{ resize: "none", scrollbarWidth: "none" }}
      className="flex-1 bg-transparent text-xs text-foreground placeholder:text-muted-foreground outline-none disabled:opacity-50 min-w-0 leading-relaxed py-1 overflow-hidden"
    />
  );
}

// ─── Shared API key ───────────────────────────────────────────────────────────

const SHARED_API_KEY = "sk-1234567890abcdef1234567890abcdef12345678";
const API_TIMEOUT_MS = 30_000;

// ─── Component ────────────────────────────────────────────────────────────────

export default function AdvancedChatbot({
  topicTitle,
  topicContent = "",
  placeholder,
  context = "",
  onClose,
  className = "",
}: AdvancedChatbotProps) {
  const { apiKey, page: currentPage } = useApp();
  const proxyAIChat = useProxyAIChat();
  const openAIChat = useOpenAIChat();

  // Accent colour — single blue that matches design system
  const accentColor = "oklch(0.58 0.2 265)";

  const effectiveApiKey = apiKey?.startsWith("sk-") ? apiKey : SHARED_API_KEY;

  const [messages, setMessages] = useState<ChatMsg[]>(() => [
    {
      id: makeId(),
      role: "assistant",
      content: `Hi! I'm your CS study assistant. Ask me anything about **"${topicTitle}"** — I'll give you clear guidance, hints, and solutions. Use **Get Summary** or **Get Hint** for quick help.`,
      timestamp: new Date(),
      suggestions: getSuggestions("general"),
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [isAIOffline, setIsAIOffline] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Behaviour tracking refs — used only for adaptive *educational* tone
  const sessionNumberRef = useRef<number>(getSessionNumber());
  const lastAIMsgTimeRef = useRef<number>(Date.now());
  const typingStartRef = useRef<number | null>(null);
  const keyCountRef = useRef(0);
  const pauseTimestampsRef = useRef<number[]>([]);
  const lastKeypressRef = useRef<number | null>(null);
  const typingDurationRef = useRef(0);
  const hintCountRef = useRef(0);

  useEffect(() => {
    const pageCtx = context || topicTitle;
    if (pageCtx) recordPageVisit(pageCtx);
  }, [context, topicTitle]);

  // Read behaviour signals at call time (not memoized to a dep — refs don't trigger re-renders)
  const readBehaviourSignals = useCallback((): BehaviourSignals => {
    const elapsedSec = typingDurationRef.current / 1000 || 1;
    const cps = keyCountRef.current / elapsedSec;
    const avgPause =
      pauseTimestampsRef.current.length > 0
        ? pauseTimestampsRef.current.reduce((a, b) => a + b, 0) /
          pauseTimestampsRef.current.length
        : 0;
    const responseDelayMs = typingStartRef.current
      ? typingStartRef.current - lastAIMsgTimeRef.current
      : 0;

    return {
      typingSpeed: cps < 2 ? "slow" : cps < 5 ? "medium" : "fast",
      hesitationLevel:
        avgPause > 3000 ? "high" : avgPause > 1200 ? "medium" : "low",
      responseDelayMs,
      sessionNumber: sessionNumberRef.current,
    };
  }, []);

  const resetTypingTracking = () => {
    keyCountRef.current = 0;
    pauseTimestampsRef.current = [];
    typingStartRef.current = null;
    lastKeypressRef.current = null;
    typingDurationRef.current = 0;
  };

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    const now = Date.now();
    if (typingStartRef.current === null) typingStartRef.current = now;
    if (lastKeypressRef.current !== null) {
      const gap = now - lastKeypressRef.current;
      if (gap > 800) pauseTimestampsRef.current.push(gap);
      typingDurationRef.current += gap;
    }
    lastKeypressRef.current = now;
    if (e.key.length === 1) keyCountRef.current += 1;

    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  // biome-ignore lint/correctness/useExhaustiveDependencies: scroll after messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  // System prompt — guidance-only, no companion personality
  const buildSystemPrompt = useCallback(
    (signals?: BehaviourSignals): string => {
      let tone = "Be clear, direct, and educational.";
      if (signals) {
        if (
          signals.typingSpeed === "slow" ||
          signals.hesitationLevel === "high"
        ) {
          tone =
            "The student seems unsure. Use simpler language, short sentences, and numbered steps.";
        } else if (
          signals.typingSpeed === "fast" &&
          signals.hesitationLevel === "low"
        ) {
          tone =
            "The student is confident. Be concise and technical — skip basic definitions.";
        }
        if (signals.responseDelayMs > 15000) {
          tone +=
            " The student took a long time to reply — they may be thinking hard. Be patient and offer to explain differently.";
        }
      }

      const pageCtx =
        currentPage === "problems"
          ? "The student is on the Problems page. Focus on algorithmic thinking, patterns, and complexity."
          : currentPage === "dashboard"
            ? "The student is on the Dashboard. Be encouraging and progress-focused."
            : "";

      return `You are a CS study assistant for Code & Crush. You ONLY provide guidance, hints, and problem-solving help for computer science topics when the user asks. Do not chat socially or act as a companion.

When answering:
- Be clear, concise, and educational
- For coding questions: give working code examples with explanations
- For theory: explain the concept, then give a concrete example
- For hints: use the Socratic method — guide thinking without giving the full answer
- Only show a full solution if the user explicitly asks for it
- Use markdown: code blocks (\`\`\`language\`), **bold** for key terms, numbered lists for steps
- For algorithms, always mention time and space complexity

Current topic: "${topicTitle}"
${topicContent ? `Topic context:\n${topicContent.slice(0, 1500)}` : ""}

Tone: ${tone}
${pageCtx}`;
    },
    [topicTitle, topicContent, currentPage],
  );

  // API call with 30-second timeout
  const callAI = useCallback(
    async (
      msgs: Array<{ role: string; content: string }>,
      sysPrompt: string,
    ): Promise<string> => {
      const timeout = new Promise<null>((_, reject) =>
        setTimeout(() => reject(new Error("timeout")), API_TIMEOUT_MS),
      );

      if (effectiveApiKey) {
        try {
          const result = await Promise.race([
            openAIChat.mutateAsync({
              messages: msgs,
              systemPrompt: sysPrompt,
              apiKey: effectiveApiKey,
            }),
            timeout,
          ]);
          if (result) {
            setIsAIOffline(false);
            return result as string;
          }
        } catch {
          // Fall through to proxy
        }
      }

      try {
        const result = await Promise.race([
          proxyAIChat.mutateAsync({ messages: msgs, systemPrompt: sysPrompt }),
          timeout,
        ]);
        if (result) {
          setIsAIOffline(false);
          return result as string;
        }
      } catch {
        // Fall through to local fallback
      }

      setIsAIOffline(true);
      return "";
    },
    [effectiveApiKey, openAIChat, proxyAIChat],
  );

  const sendMessage = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || loading) return;

    const signals = readBehaviourSignals();
    resetTypingTracking();

    // Clear suggestions from all previous messages
    setMessages((prev) =>
      prev.map((m) => (m.suggestions ? { ...m, suggestions: undefined } : m)),
    );

    const userMsg: ChatMsg = {
      id: makeId(),
      role: "user",
      content: trimmed,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const history = [...messages, userMsg].slice(-10).map((m) => ({
        role: m.role,
        content: m.content,
      }));

      const aiReply = await callAI(history, buildSystemPrompt(signals));
      const replyContent = aiReply || localFallback(topicTitle, trimmed);

      // Determine suggestion context
      const lower = trimmed.toLowerCase();
      const hasCode = /code|implement|write|program|function|algorithm/.test(
        lower,
      );
      const isHint = /hint|stuck|confused|help|explain/.test(lower);
      const suggCtx = hasCode ? "code" : isHint ? "hint" : "general";

      // Track hint count for "Get Solution" button
      if (isHint) hintCountRef.current += 1;

      const reply: ChatMsg = {
        id: makeId(),
        role: "assistant",
        content: replyContent,
        timestamp: new Date(),
        suggestions: getSuggestions(suggCtx),
        hintCount: hintCountRef.current,
      };
      setMessages((prev) => [...prev, reply]);
      lastAIMsgTimeRef.current = Date.now();
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: makeId(),
          role: "assistant",
          content: localFallback(topicTitle, trimmed),
          timestamp: new Date(),
          suggestions: getSuggestions("general"),
        },
      ]);
      lastAIMsgTimeRef.current = Date.now();
    } finally {
      setLoading(false);
    }
  };

  const handleGetSummary = async () => {
    if (loading) return;
    setLoading(true);
    setMessages((prev) => prev.map((m) => ({ ...m, suggestions: undefined })));

    const userMsg: ChatMsg = {
      id: makeId(),
      role: "user",
      content: "Give me a bullet-point summary of this topic",
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMsg]);

    const prompt = `Provide a structured bullet-point summary of "${topicTitle}" in 6-8 key points. Each bullet should be a complete, actionable takeaway a student can review quickly. End with one "Key Insight" sentence that ties it all together.`;

    try {
      const sysCtx = topicContent
        ? `${buildSystemPrompt()}\n\nContent to summarize:\n${topicContent.slice(0, 2000)}`
        : buildSystemPrompt();
      const aiReply = await callAI([{ role: "user", content: prompt }], sysCtx);

      const localSummary = topicContent
        ? `Key points for "${topicTitle}":\n\n${topicContent
            .split("\n")
            .map((l) => l.trim())
            .filter((l) => l.length > 20)
            .slice(0, 7)
            .map((l) => `• ${l.slice(0, 120)}${l.length > 120 ? "…" : ""}`)
            .join("\n")}`
        : `Summary of "${topicTitle}": Review the study notes above — they contain the core concepts. The Documentation Hub has deeper reference material.`;

      setMessages((prev) => [
        ...prev,
        {
          id: makeId(),
          role: "assistant",
          content: aiReply || localSummary,
          timestamp: new Date(),
          suggestions: [
            "Explain first point",
            "What should I study next?",
            "Give me a quiz question",
          ],
        },
      ]);
      lastAIMsgTimeRef.current = Date.now();
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: makeId(),
          role: "assistant",
          content: `Summary of "${topicTitle}": Review the study notes above for the key concepts and examples.`,
          timestamp: new Date(),
          suggestions: getSuggestions("general"),
        },
      ]);
      lastAIMsgTimeRef.current = Date.now();
    } finally {
      setLoading(false);
    }
  };

  const handleGetHint = async () => {
    if (loading) return;
    setLoading(true);
    setMessages((prev) => prev.map((m) => ({ ...m, suggestions: undefined })));

    hintCountRef.current += 1;

    const userMsg: ChatMsg = {
      id: makeId(),
      role: "user",
      content: "Give me a hint for this topic",
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMsg]);

    const prompt = `Give a Socratic-style hint about "${topicTitle}". Ask one leading question that nudges the student toward the answer, then provide a small conceptual clue. Do NOT give the full answer.`;

    try {
      const aiReply = await callAI(
        [{ role: "user", content: prompt }],
        buildSystemPrompt(),
      );
      const fallbackHints = [
        `Hint for "${topicTitle}": What is the simplest case you can solve? Start there and build up.`,
        `Hint for "${topicTitle}": Break it down — what do you know, and what are you trying to find?`,
        `Hint for "${topicTitle}": Look at the examples in the lesson. What pattern do they all share?`,
      ];
      const fallbackHint =
        fallbackHints[hintCountRef.current % fallbackHints.length];

      setMessages((prev) => [
        ...prev,
        {
          id: makeId(),
          role: "assistant",
          content: aiReply || fallbackHint,
          timestamp: new Date(),
          suggestions: getSuggestions("hint"),
          hintCount: hintCountRef.current,
        },
      ]);
      lastAIMsgTimeRef.current = Date.now();
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: makeId(),
          role: "assistant",
          content: `Hint for "${topicTitle}": Identify the core pattern in the examples, then apply it step by step.`,
          timestamp: new Date(),
          suggestions: getSuggestions("hint"),
          hintCount: hintCountRef.current,
        },
      ]);
      lastAIMsgTimeRef.current = Date.now();
    } finally {
      setLoading(false);
    }
  };

  const handleGetSolution = async () => {
    if (loading) return;
    await sendMessage(`Show me the full solution for "${topicTitle}"`);
  };

  const MAX_CHARS = 1000;
  const latestAssistantId = messages
    .filter((m) => m.role === "assistant")
    .at(-1)?.id;

  return (
    <div
      className={`flex flex-col rounded-2xl border bg-card overflow-hidden ${className}`}
      style={{
        borderColor: `${accentColor.replace("oklch(", "oklch(").replace(")", " / 0.2)")}`,
      }}
      data-ocid="advanced_chatbot.panel"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2.5 border-b bg-card">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-7 h-7 rounded-full flex items-center justify-center shrink-0 bg-primary text-primary-foreground shadow-sm">
            <Bot className="w-3.5 h-3.5" />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-bold text-foreground truncate leading-tight">
              CS Study Assistant
            </p>
            <p className="text-[10px] text-muted-foreground leading-tight flex items-center gap-1">
              {isAIOffline ? (
                <>
                  <WifiOff className="w-2.5 h-2.5 text-amber-500" />
                  <span className="text-amber-500 font-medium">
                    Offline — local engine
                  </span>
                </>
              ) : (
                <>
                  <Zap className="w-2.5 h-2.5 text-emerald-500" />
                  <span className="text-emerald-500 font-medium">
                    AI-powered guidance
                  </span>
                </>
              )}
            </p>
          </div>
        </div>
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            data-ocid="advanced_chatbot.close_button"
            aria-label="Close chat"
            className="p-1 rounded-full hover:bg-muted transition-colors text-muted-foreground"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Quick-action toolbar */}
      <div className="flex gap-2 px-3 py-2 border-b bg-muted/30">
        <button
          type="button"
          onClick={handleGetSummary}
          disabled={loading}
          data-ocid="advanced_chatbot.summary_button"
          className="flex-1 flex items-center justify-center gap-1.5 text-[11px] font-semibold px-2 py-1.5 rounded-lg bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20 transition-colors disabled:opacity-50"
        >
          {loading ? (
            <Loader2 className="w-3 h-3 animate-spin" />
          ) : (
            <Sparkles className="w-3 h-3" />
          )}
          Summary
        </button>
        <button
          type="button"
          onClick={handleGetHint}
          disabled={loading}
          data-ocid="advanced_chatbot.hint_button"
          className="flex-1 flex items-center justify-center gap-1.5 text-[11px] font-semibold px-2 py-1.5 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20 hover:bg-amber-500/20 transition-colors disabled:opacity-50"
        >
          {loading ? (
            <Loader2 className="w-3 h-3 animate-spin" />
          ) : (
            <Lightbulb className="w-3 h-3" />
          )}
          Hint
        </button>
        <button
          type="button"
          onClick={() =>
            sendMessage(
              `Explain the key concepts of "${topicTitle}" with examples`,
            )
          }
          disabled={loading}
          data-ocid="advanced_chatbot.explain_button"
          className="flex-1 flex items-center justify-center gap-1.5 text-[11px] font-semibold px-2 py-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20 transition-colors disabled:opacity-50"
        >
          {loading ? (
            <Loader2 className="w-3 h-3 animate-spin" />
          ) : (
            <BookOpen className="w-3 h-3" />
          )}
          Explain
        </button>
      </div>

      {/* Messages */}
      <div
        className="flex-1 overflow-y-auto px-3 py-3 space-y-3"
        style={{ maxHeight: "calc(100vh - 280px)", minHeight: 180 }}
        data-ocid="advanced_chatbot.message_list"
      >
        <AnimatePresence initial={false}>
          {messages.map((msg) => (
            <MessageBubble
              key={msg.id}
              msg={msg}
              isLatest={
                msg.role === "assistant" ? msg.id === latestAssistantId : false
              }
              accentColor="hsl(var(--primary))"
              onSuggestionClick={sendMessage}
              onGetSolution={handleGetSolution}
              loading={loading}
            />
          ))}
        </AnimatePresence>

        <AnimatePresence>
          {loading && <TypingIndicator accentColor="hsl(var(--primary))" />}
        </AnimatePresence>

        <div ref={messagesEndRef} />
      </div>

      {/* Input area */}
      <div className="px-3 py-2.5 border-t bg-card">
        <div className="flex items-end gap-2 rounded-xl border border-input bg-background px-3 py-1.5 focus-within:ring-1 focus-within:ring-ring transition-all">
          <AutoResizeTextarea
            value={input}
            onChange={setInput}
            onKeyDown={handleInputKeyDown}
            placeholder={
              placeholder ?? `Ask a CS question about "${topicTitle}"…`
            }
            disabled={loading}
            maxLength={MAX_CHARS}
            data-ocid="advanced_chatbot.input"
          />

          {input.length > MAX_CHARS * 0.85 && (
            <span
              className={`text-[10px] shrink-0 tabular-nums self-end mb-1 ${
                input.length > MAX_CHARS * 0.95
                  ? "text-destructive"
                  : "text-muted-foreground"
              }`}
            >
              {input.length}/{MAX_CHARS}
            </span>
          )}

          <button
            type="button"
            onClick={() => sendMessage(input)}
            disabled={!input.trim() || loading}
            data-ocid="advanced_chatbot.send_button"
            aria-label="Send message"
            className="w-7 h-7 rounded-full flex items-center justify-center bg-primary text-primary-foreground disabled:opacity-40 hover:opacity-90 active:scale-95 transition-all shrink-0 self-end mb-0.5"
          >
            {loading ? (
              <Loader2 className="w-3 h-3 animate-spin" />
            ) : (
              <Send className="w-3.5 h-3.5" />
            )}
          </button>
        </div>

        <p className="text-[10px] text-muted-foreground mt-1 px-1">
          Enter to send · Shift+Enter for new line
        </p>
      </div>
    </div>
  );
}
