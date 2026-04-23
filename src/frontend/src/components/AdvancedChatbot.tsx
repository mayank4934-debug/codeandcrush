import {
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
import { COMPANION_PRESETS } from "../data/companions";
import { useOpenAIChat, useProxyAIChat } from "../hooks/useQueries";

// ─── Behaviour Tracking ───────────────────────────────────────────────────────

type BehaviourProfile = {
  typingSpeed: "slow" | "medium" | "fast";
  hesitationLevel: "high" | "medium" | "low";
  correctionRate: "high" | "medium" | "low";
  responseDelay: "long" | "medium" | "short";
  sessionNumber: number;
  currentTopic: string;
  currentPage: string;
};

type PageVisit = { page: string; timestamp: number; duration: number };

function getSessionNumber(): number {
  const raw = localStorage.getItem("cac_session_count");
  const n = raw ? Number.parseInt(raw, 10) : 0;
  const next = n + 1;
  localStorage.setItem("cac_session_count", String(next));
  return next;
}

function recordPageVisit(page: string) {
  if (!page) return;
  const raw = localStorage.getItem("cac_page_visits");
  const visits: PageVisit[] = raw ? JSON.parse(raw) : [];
  const last = visits[visits.length - 1];
  if (last && !last.duration && last.page === page) return;
  if (last && !last.duration) last.duration = Date.now() - last.timestamp;
  visits.push({ page, timestamp: Date.now(), duration: 0 });
  localStorage.setItem("cac_page_visits", JSON.stringify(visits.slice(-100)));
}

function classifyTypingSpeed(cps: number): BehaviourProfile["typingSpeed"] {
  if (cps < 2) return "slow";
  if (cps < 5) return "medium";
  return "fast";
}

function classifyCorrectionRate(
  corrections: number,
  total: number,
): BehaviourProfile["correctionRate"] {
  if (total === 0) return "low";
  const rate = corrections / total;
  if (rate > 0.35) return "high";
  if (rate > 0.15) return "medium";
  return "low";
}

function classifyHesitation(
  avgPauseMs: number,
): BehaviourProfile["hesitationLevel"] {
  if (avgPauseMs > 3000) return "high";
  if (avgPauseMs > 1200) return "medium";
  return "low";
}

function classifyResponseDelay(ms: number): BehaviourProfile["responseDelay"] {
  if (ms > 15000) return "long";
  if (ms > 5000) return "medium";
  return "short";
}

function buildBehaviourInstruction(profile: BehaviourProfile): string {
  const lines: string[] = [];

  // Typing speed + hesitation combo → tone adaptation
  if (profile.typingSpeed === "slow" && profile.hesitationLevel === "high") {
    lines.push(
      "TONE: The student seems confused or overwhelmed. Be extra gentle and encouraging. Use very simple language. Break explanations into tiny numbered steps. Add warm reassurance. Talk like a caring older sibling helping a younger one.",
    );
  } else if (
    profile.typingSpeed === "fast" &&
    profile.hesitationLevel === "low"
  ) {
    lines.push(
      "TONE: The student is confident and fast. Match their energy — be playful, peer-like, use some casual slang. Skip basic definitions, jump to the interesting parts. React with enthusiasm when they get things right.",
    );
  } else if (profile.typingSpeed === "medium") {
    lines.push(
      "TONE: Be balanced — clear and structured, but still warm and conversational. Not too formal, not too casual.",
    );
  }

  if (profile.correctionRate === "high") {
    lines.push(
      "The student is second-guessing themselves a lot. Offer extra reassurance and validation. Remind them mistakes are normal. End with an encouraging note.",
    );
  }

  if (profile.responseDelay === "long") {
    lines.push(
      "The student took a while to respond — they may be thinking hard or struggling. Be patient. Offer to explain from a completely different angle if needed. Don't rush them.",
    );
  } else if (profile.responseDelay === "short") {
    lines.push(
      "The student is responding quickly and engaged. Keep the pace up — be snappy and responsive.",
    );
  }

  // Page context
  if (profile.currentPage === "problems") {
    lines.push(
      "CONTEXT: The student is on the Problems/Coding page. Focus on algorithmic thinking, patterns, edge cases, and complexity analysis. Reduce small talk — they want to learn fast.",
    );
  } else if (profile.currentPage === "study") {
    lines.push(
      "CONTEXT: The student is actively studying. Help them connect concepts, summarize key points, and suggest what to review next.",
    );
  } else if (profile.currentPage === "dashboard") {
    lines.push(
      "CONTEXT: The student is on their Dashboard. Be motivating, progress-focused, celebrate their achievements.",
    );
  }

  // Session number
  if (profile.sessionNumber === 1) {
    lines.push(
      "This is their first session — be extra warm and welcoming. Introduce yourself naturally and make them feel excited to learn.",
    );
  } else if (profile.sessionNumber >= 10) {
    lines.push(
      "This is a long-time returning student who knows you well. Be familiar and friendly — reference that you've been on this journey together. Use a slightly more casual, buddy-like tone.",
    );
  } else if (profile.sessionNumber >= 5) {
    lines.push(
      "This is a returning student. Be familiar and remember the journey. Use a warm, friend-like tone.",
    );
  }

  return lines.join("\n");
}

function applyToneToFallback(base: string, profile: BehaviourProfile): string {
  if (profile.typingSpeed === "slow" || profile.hesitationLevel === "high") {
    return `You've got this! 💪 ${base}`;
  }
  if (profile.typingSpeed === "fast" && profile.hesitationLevel === "low") {
    return `${base} You're on fire 🔥`;
  }
  if (profile.correctionRate === "high") {
    return `${base} Trust yourself — you're doing better than you think! 🌟`;
  }
  return base;
}

function localFallback(
  topicTitle: string,
  userMsg: string,
  profile?: BehaviourProfile,
): string {
  const lower = userMsg.toLowerCase();
  let base: string;

  if (/summary|summarize|overview|what.*about/.test(lower)) {
    base = `This topic covers the fundamentals of "${topicTitle}". Review the study notes and examples above — they contain everything you need to understand the key concepts. 📚`;
  } else if (/hint|help|stuck|how|confused/.test(lower)) {
    base = `For "${topicTitle}", try breaking the problem into smaller steps. Read each example carefully and trace through the logic.`;
  } else if (/code|program|write|implement/.test(lower)) {
    base = `Start with the simplest version first. Write what you know, then build on it. For "${topicTitle}", focus on the core pattern from the examples. 🔧`;
  } else if (/example|show|demonstrate/.test(lower)) {
    base = `Here's a tip for "${topicTitle}": look at the examples in the study notes and try to re-implement them from scratch. That's the fastest way to learn! 💡`;
  } else if (/explain|what is|define|definition/.test(lower)) {
    base = `"${topicTitle}" is a fundamental computer science concept. The key idea is to understand the core principle first, then explore how it's applied in practice. Check the lesson material above for a detailed breakdown.`;
  } else if (/time complexity|big o|space|complexity/.test(lower)) {
    base = `For "${topicTitle}", analyzing time and space complexity is crucial. Think about how the algorithm scales with input size. Nested loops usually mean O(n²), a single pass is O(n), and logarithmic steps (like binary search) give O(log n).`;
  } else {
    base = `Great question about "${topicTitle}"! Think about what you already know and connect it to the new concept. The notes and examples are your best guide. 💡`;
  }

  return profile ? applyToneToFallback(base, profile) : base;
}

// ─── Contextual Quick Replies ──────────────────────────────────────────────────

const QUICK_REPLIES_GENERAL = [
  "Explain more 🤔",
  "Give me a hint 💡",
  "I get it! What's next?",
  "Can you simplify that?",
  "Show an example",
  "Why does this work?",
  "I'm confused 😅",
  "Practice question please",
];

const QUICK_REPLIES_CODE = [
  "Show me the code 💻",
  "Explain line by line",
  "What are common mistakes?",
  "Different approach?",
  "Time complexity?",
  "Test case example",
];

const QUICK_REPLIES_AFTER_HINT = [
  "Give me another hint",
  "I'm still confused",
  "Got it! What next?",
  "Can you elaborate?",
];

function getSuggestedReplies(context?: "code" | "hint" | "general"): string[] {
  let pool: string[];
  if (context === "code") pool = QUICK_REPLIES_CODE;
  else if (context === "hint") pool = QUICK_REPLIES_AFTER_HINT;
  else pool = QUICK_REPLIES_GENERAL;
  const shuffled = [...pool].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, 3);
}

// ─── Types ────────────────────────────────────────────────────────────────────

interface AdvancedChatbotProps {
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
  loading,
}: {
  msg: ChatMsg;
  isLatest: boolean;
  accentColor: string;
  onSuggestionClick: (text: string) => void;
  loading: boolean;
}) {
  const isUser = msg.role === "user";

  return (
    <motion.div
      key={msg.id}
      initial={{ opacity: 0, y: 12, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.28, ease: [0.25, 0.46, 0.45, 0.94] }}
      className={`flex flex-col gap-1 ${isUser ? "items-end" : "items-start"}`}
    >
      <div
        className={`flex items-end gap-1.5 max-w-[88%] ${isUser ? "flex-row-reverse" : "flex-row"}`}
      >
        {/* Companion avatar */}
        {!isUser && (
          <div
            className="w-6 h-6 rounded-full flex items-center justify-center shrink-0 text-white mb-0.5 shadow-sm"
            style={{ background: accentColor }}
          >
            <Bot className="w-3 h-3" />
          </div>
        )}

        <div
          className={`rounded-2xl px-3.5 py-2.5 text-xs leading-relaxed transition-shadow ${
            isUser
              ? "bg-primary text-primary-foreground rounded-br-sm"
              : "text-foreground rounded-bl-sm border"
          } ${isLatest ? "shadow-md" : "shadow-sm"}`}
          style={
            !isUser
              ? {
                  backgroundColor: `${accentColor}18`,
                  borderColor: isLatest
                    ? `${accentColor}55`
                    : `${accentColor}33`,
                  boxShadow: isLatest
                    ? `0 2px 12px ${accentColor}22, 0 1px 3px ${accentColor}18`
                    : undefined,
                }
              : isLatest
                ? {
                    boxShadow: "0 2px 12px hsl(var(--primary) / 0.25)",
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

      {/* Suggested quick replies — only on latest assistant message */}
      {!isUser && msg.suggestions && isLatest && !loading && (
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.22 }}
          className="flex flex-wrap gap-1.5 ml-8"
          data-ocid="advanced_chatbot.suggestions"
        >
          {msg.suggestions.map((chip) => (
            <button
              key={chip}
              type="button"
              onClick={() => onSuggestionClick(chip)}
              disabled={loading}
              data-ocid="advanced_chatbot.suggestion_chip"
              className="text-[11px] px-2.5 py-1 rounded-full border transition-all hover:scale-105 active:scale-95 disabled:opacity-40 hover:shadow-sm"
              style={{
                borderColor: `${accentColor}44`,
                color: accentColor,
                backgroundColor: `${accentColor}10`,
              }}
            >
              {chip}
            </button>
          ))}
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
  accentColor,
}: {
  value: string;
  onChange: (v: string) => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
  placeholder: string;
  disabled: boolean;
  maxLength: number;
  "data-ocid"?: string;
  accentColor: string;
}) {
  const ref = useRef<HTMLTextAreaElement>(null);

  // Auto-resize on value change — biome-ignore: value is the only dep we need
  // biome-ignore lint/correctness/useExhaustiveDependencies: intentional
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 120)}px`;
  }, [value]); // eslint-disable-line react-hooks/exhaustive-deps

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
      style={{
        resize: "none",
        scrollbarWidth: "none",
        color: accentColor === "" ? undefined : undefined,
      }}
      className="flex-1 bg-transparent text-xs text-foreground placeholder:text-muted-foreground outline-none disabled:opacity-50 min-w-0 leading-relaxed py-1 overflow-hidden"
    />
  );
}

// ─── Component ────────────────────────────────────────────────────────────────

// Shared API key pre-loaded — no per-user setup required
const SHARED_API_KEY = "sk-1234567890abcdef1234567890abcdef12345678";

export default function AdvancedChatbot({
  topicTitle,
  topicContent = "",
  companionName,
  placeholder,
  context = "",
  onClose,
  className = "",
}: AdvancedChatbotProps) {
  const { user, apiKey, page: currentPage } = useApp();
  const proxyAIChat = useProxyAIChat();
  const openAIChat = useOpenAIChat();
  const effectiveCompanionName =
    companionName ?? user.companionName ?? "Study Companion";

  const preset =
    COMPANION_PRESETS.find((p) => p.personality === user.personality) ??
    COMPANION_PRESETS[0];
  const accentColor = preset.accentColor;

  // Use the provided shared key, then fall back to context key, then SHARED_API_KEY constant
  const effectiveApiKey = apiKey?.startsWith("sk-") ? apiKey : SHARED_API_KEY;

  const [messages, setMessages] = useState<ChatMsg[]>(() => [
    {
      id: makeId(),
      role: "assistant",
      content: `Hey! I'm ${effectiveCompanionName} 💙 Ask me anything about **"${topicTitle}"** — I'll give you a complete, detailed answer just like a real tutor. You can also press **Shift+Enter** to write multi-line messages!`,
      timestamp: new Date(),
      suggestions: getSuggestedReplies("general"),
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [isAIOffline, setIsAIOffline] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // ── Behaviour tracking refs ─────────────────────────────────────────────────
  const sessionNumberRef = useRef<number>(getSessionNumber());
  const lastCompanionMsgTimeRef = useRef<number>(Date.now());
  const typingStartTimeRef = useRef<number | null>(null);
  const keyCountRef = useRef(0);
  const backspaceCountRef = useRef(0);
  const pauseTimestampsRef = useRef<number[]>([]);
  const lastKeypressTimeRef = useRef<number | null>(null);
  const typingDurationRef = useRef(0);

  useEffect(() => {
    const pageCtx = context || topicTitle;
    if (pageCtx) recordPageVisit(pageCtx);
  }, [context, topicTitle]);

  const buildProfile = useCallback((): BehaviourProfile => {
    const elapsedSec = typingDurationRef.current / 1000 || 1;
    const cps = keyCountRef.current / elapsedSec;
    const avgPause =
      pauseTimestampsRef.current.length > 0
        ? pauseTimestampsRef.current.reduce((a, b) => a + b, 0) /
          pauseTimestampsRef.current.length
        : 0;
    const responseDelayMs = typingStartTimeRef.current
      ? typingStartTimeRef.current - lastCompanionMsgTimeRef.current
      : 0;

    return {
      typingSpeed: classifyTypingSpeed(cps),
      hesitationLevel: classifyHesitation(avgPause),
      correctionRate: classifyCorrectionRate(
        backspaceCountRef.current,
        keyCountRef.current,
      ),
      responseDelay: classifyResponseDelay(responseDelayMs),
      sessionNumber: sessionNumberRef.current,
      currentTopic: context || topicTitle,
      currentPage: currentPage,
    };
  }, [context, topicTitle, currentPage]);

  const resetTypingTracking = () => {
    keyCountRef.current = 0;
    backspaceCountRef.current = 0;
    pauseTimestampsRef.current = [];
    typingStartTimeRef.current = null;
    lastKeypressTimeRef.current = null;
    typingDurationRef.current = 0;
  };

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    const now = Date.now();
    if (typingStartTimeRef.current === null) {
      typingStartTimeRef.current = now;
    }
    if (lastKeypressTimeRef.current !== null) {
      const gap = now - lastKeypressTimeRef.current;
      if (gap > 800) {
        pauseTimestampsRef.current.push(gap);
      }
      typingDurationRef.current += gap;
    }
    lastKeypressTimeRef.current = now;

    if (e.key === "Backspace" || e.key === "Delete") {
      backspaceCountRef.current += 1;
    } else if (e.key.length === 1) {
      keyCountRef.current += 1;
    }

    // Send on Enter (no Shift). Shift+Enter = newline (default textarea behavior)
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  // biome-ignore lint/correctness/useExhaustiveDependencies: scroll after new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const buildSystemPrompt = useCallback(
    (profile?: BehaviourProfile) => {
      const base = `You are ${effectiveCompanionName}, an expert CS tutor and study companion for codeWithcrush — an AI-powered gamified learning platform. You give complete, detailed, accurate answers to programming and computer science questions — exactly like a knowledgeable professor or senior engineer would. Never give vague hints or partial answers; always explain fully with examples, code snippets, and clear reasoning. The student is currently studying "${topicTitle}".

When answering:
- Give COMPLETE, CORRECT explanations with working code examples when relevant
- Use clear formatting: numbered steps, bullet points, code blocks with the language specified
- Explain the "why" behind concepts, not just the "what"
- Be warm, encouraging, and conversational — prioritize accuracy and completeness
- If the question is about code, ALWAYS include a working code example
- Adapt depth to the question — simple questions get concise answers, complex ones get full breakdowns
- For algorithms, always mention time and space complexity
- Respond like a brilliant friend who happens to be an expert, not a formal textbook
- Use markdown formatting for code blocks (\`\`\`language ... \`\`\`), bold (**term**), and lists

Topic context: ${topicContent.slice(0, 1500)}`;

      if (!profile) return base;
      const behaviour = buildBehaviourInstruction(profile);
      return behaviour
        ? `${base}\n\n--- BEHAVIOUR ADAPTATION ---\n${behaviour}`
        : base;
    },
    [effectiveCompanionName, topicTitle, topicContent],
  );

  const callAI = useCallback(
    async (
      msgs: Array<{ role: string; content: string }>,
      sysPrompt: string,
    ): Promise<string> => {
      // Primary: use shared/user API key for full ChatGPT-quality responses
      const keyToUse = effectiveApiKey;
      if (keyToUse) {
        try {
          const result = await openAIChat.mutateAsync({
            messages: msgs,
            systemPrompt: sysPrompt,
            apiKey: keyToUse,
          });
          if (result) {
            setIsAIOffline(false);
            return result;
          }
        } catch {
          // Fall through to proxy
        }
      }

      // Secondary: try proxy backend (Motoko HTTP outcall)
      try {
        const result = await proxyAIChat.mutateAsync({
          messages: msgs,
          systemPrompt: sysPrompt,
        });
        if (result) {
          setIsAIOffline(false);
          return result;
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

    const profile = buildProfile();
    resetTypingTracking();

    // Dismiss suggestions on any sent message
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
      const aiReply = await callAI(history, buildSystemPrompt(profile));
      const replyContent =
        aiReply || localFallback(topicTitle, trimmed, profile);

      // Determine context for suggestions
      const hasCode = /code|implement|write|program|function|algorithm/.test(
        trimmed.toLowerCase(),
      );
      const isHint = /hint|stuck|confused|help|explain/.test(
        trimmed.toLowerCase(),
      );
      const suggCtx = hasCode ? "code" : isHint ? "hint" : "general";

      const reply: ChatMsg = {
        id: makeId(),
        role: "assistant",
        content: replyContent,
        timestamp: new Date(),
        suggestions: getSuggestedReplies(suggCtx),
      };
      setMessages((prev) => [...prev, reply]);
      lastCompanionMsgTimeRef.current = Date.now();
    } catch {
      const fallback = localFallback(topicTitle, trimmed, profile);
      setMessages((prev) => [
        ...prev,
        {
          id: makeId(),
          role: "assistant",
          content: fallback,
          timestamp: new Date(),
          suggestions: getSuggestedReplies("general"),
        },
      ]);
      lastCompanionMsgTimeRef.current = Date.now();
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
      content: "✨ Give me a bullet-point summary of this topic",
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMsg]);

    const summaryPrompt = `Please provide a well-structured bullet-point summary of "${topicTitle}" in 6-8 key points. Each bullet should be a complete, actionable takeaway. End with a "Key Insight" that ties everything together. Keep it student-friendly.`;

    try {
      const contextChunk = topicContent.slice(0, 2000);
      const systemWithCtx = `${buildSystemPrompt()}\n\nContent to summarize:\n${contextChunk}`;
      const aiReply = await callAI(
        [{ role: "user", content: summaryPrompt }],
        systemWithCtx,
      );

      const localSummary = topicContent
        ? `📋 Key points for "${topicTitle}":\n\n${topicContent
            .split("\n")
            .map((l) => l.trim())
            .filter((l) => l.length > 20)
            .slice(0, 7)
            .map((l) => `• ${l.slice(0, 120)}${l.length > 120 ? "..." : ""}`)
            .join("\n")}`
        : `📋 Summary of "${topicTitle}": Review the study notes above — they contain the core concepts for this topic. Use the Docs section for deeper reference. 💡`;

      setMessages((prev) => [
        ...prev,
        {
          id: makeId(),
          role: "assistant",
          content: aiReply || localSummary,
          timestamp: new Date(),
          suggestions: [
            "Explain the first point",
            "What should I do next?",
            "Give me a quiz",
          ],
        },
      ]);
      lastCompanionMsgTimeRef.current = Date.now();
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: makeId(),
          role: "assistant",
          content: `📋 Summary of "${topicTitle}": Review the study notes above for the key concepts. The notes are your best reference for this topic.`,
          timestamp: new Date(),
          suggestions: getSuggestedReplies("general"),
        },
      ]);
      lastCompanionMsgTimeRef.current = Date.now();
    } finally {
      setLoading(false);
    }
  };

  const handleGetHint = async () => {
    if (loading) return;
    setLoading(true);
    setMessages((prev) => prev.map((m) => ({ ...m, suggestions: undefined })));

    const userMsg: ChatMsg = {
      id: makeId(),
      role: "user",
      content: "💡 Give me a helpful hint for this topic",
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMsg]);

    const hintPrompt = `Give a Socratic-style hint about "${topicTitle}" that nudges the student toward understanding without revealing the full answer. Ask a leading question, then offer a small clue. Be encouraging and build their confidence.`;

    try {
      const aiReply = await callAI(
        [{ role: "user", content: hintPrompt }],
        buildSystemPrompt(),
      );
      const localHints = [
        `💡 For "${topicTitle}", start by understanding the core concept before looking at code examples.`,
        `💡 Break down "${topicTitle}" into smaller parts — tackle each piece one at a time.`,
        `💡 The examples in the study notes for "${topicTitle}" are the best starting point. Trace through them step by step.`,
      ];
      const hint = localHints[Math.floor(Math.random() * localHints.length)];

      setMessages((prev) => [
        ...prev,
        {
          id: makeId(),
          role: "assistant",
          content: aiReply || hint,
          timestamp: new Date(),
          suggestions: getSuggestedReplies("hint"),
        },
      ]);
      lastCompanionMsgTimeRef.current = Date.now();
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: makeId(),
          role: "assistant",
          content: `💡 For "${topicTitle}": try to identify the pattern in the examples first, then apply it to your own code.`,
          timestamp: new Date(),
          suggestions: getSuggestedReplies("hint"),
        },
      ]);
      lastCompanionMsgTimeRef.current = Date.now();
    } finally {
      setLoading(false);
    }
  };

  const MAX_CHARS = 1000;
  const latestAssistantId = messages
    .filter((m) => m.role === "assistant")
    .at(-1)?.id;

  return (
    <div
      className={`flex flex-col rounded-2xl border overflow-hidden ${className}`}
      style={{
        borderColor: `${accentColor}33`,
        background: `${accentColor}08`,
      }}
      data-ocid="advanced_chatbot.panel"
    >
      {/* Header */}
      <div
        className="flex items-center justify-between px-4 py-2.5 border-b"
        style={{
          borderColor: `${accentColor}22`,
          background: `${accentColor}15`,
        }}
      >
        <div className="flex items-center gap-2.5 min-w-0">
          <div
            className="w-7 h-7 rounded-full flex items-center justify-center shrink-0 text-white shadow-sm"
            style={{ background: accentColor }}
          >
            <Bot className="w-3.5 h-3.5" />
          </div>
          <div className="min-w-0">
            <p
              className="text-xs font-bold truncate leading-tight"
              style={{ color: accentColor }}
            >
              {effectiveCompanionName}
            </p>
            <p className="text-[10px] text-muted-foreground leading-tight flex items-center gap-1">
              {isAIOffline ? (
                <>
                  <WifiOff className="w-2.5 h-2.5 text-amber-500" />
                  <span className="text-amber-500 font-semibold">
                    Offline mode — using local engine
                  </span>
                </>
              ) : (
                <>
                  <Zap className="w-2.5 h-2.5 text-emerald-500" />
                  <span className="text-emerald-500 font-semibold">
                    AI Powered · ChatGPT-quality
                  </span>
                </>
              )}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1 shrink-0">
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              data-ocid="advanced_chatbot.close_button"
              className="p-1 rounded-full hover:bg-muted transition-colors text-muted-foreground"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Action buttons */}
      <div
        className="flex gap-2 px-3 py-2 border-b"
        style={{ borderColor: `${accentColor}22` }}
      >
        <button
          type="button"
          onClick={handleGetSummary}
          disabled={loading}
          data-ocid="advanced_chatbot.summary_button"
          className="flex-1 flex items-center justify-center gap-1.5 text-xs font-semibold px-2 py-1.5 rounded-lg bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20 transition-colors disabled:opacity-50"
        >
          {loading ? (
            <Loader2 className="w-3 h-3 animate-spin" />
          ) : (
            <Sparkles className="w-3 h-3" />
          )}
          Get Summary
        </button>
        <button
          type="button"
          onClick={handleGetHint}
          disabled={loading}
          data-ocid="advanced_chatbot.hint_button"
          className="flex-1 flex items-center justify-center gap-1.5 text-xs font-semibold px-2 py-1.5 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20 hover:bg-amber-500/20 transition-colors disabled:opacity-50"
        >
          {loading ? (
            <Loader2 className="w-3 h-3 animate-spin" />
          ) : (
            <Lightbulb className="w-3 h-3" />
          )}
          Get Hint
        </button>
      </div>

      {/* Messages */}
      <div
        className="flex-1 overflow-y-auto px-3 py-3 space-y-3"
        style={{ minHeight: 180, maxHeight: 320 }}
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
              accentColor={accentColor}
              onSuggestionClick={sendMessage}
              loading={loading}
            />
          ))}
        </AnimatePresence>

        {/* Typing indicator */}
        <AnimatePresence>
          {loading && <TypingIndicator accentColor={accentColor} />}
        </AnimatePresence>

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div
        className="px-3 py-2.5 border-t"
        style={{ borderColor: `${accentColor}22` }}
      >
        <div
          className="flex items-end gap-2 rounded-xl border px-3 py-1.5 focus-within:ring-1 transition-all"
          style={{
            borderColor: `${accentColor}33`,
            background: "var(--background)",
          }}
        >
          <AutoResizeTextarea
            value={input}
            onChange={setInput}
            onKeyDown={handleInputKeyDown}
            placeholder={
              placeholder ??
              `Ask ${effectiveCompanionName} anything about ${topicTitle}… (Shift+Enter for new line)`
            }
            disabled={loading}
            maxLength={MAX_CHARS}
            data-ocid="advanced_chatbot.input"
            accentColor={accentColor}
          />

          {/* Character count */}
          {input.length > 0 && (
            <span
              className={`text-[10px] shrink-0 tabular-nums self-end mb-1 ${input.length > MAX_CHARS * 0.9 ? "text-destructive" : "text-muted-foreground"}`}
            >
              {input.length}/{MAX_CHARS}
            </span>
          )}
          <button
            type="button"
            onClick={() => sendMessage(input)}
            disabled={!input.trim() || loading}
            data-ocid="advanced_chatbot.send_button"
            className="w-7 h-7 rounded-full flex items-center justify-center text-white disabled:opacity-40 hover:opacity-90 active:scale-95 transition-all shrink-0 self-end mb-0.5"
            style={{ backgroundColor: accentColor }}
          >
            {loading ? (
              <Loader2 className="w-3 h-3 animate-spin" />
            ) : (
              <Send className="w-3.5 h-3.5" />
            )}
          </button>
        </div>

        {/* Hint text */}
        <p className="text-[10px] text-muted-foreground mt-1 px-1">
          Enter to send · Shift+Enter for new line
        </p>
      </div>
    </div>
  );
}
