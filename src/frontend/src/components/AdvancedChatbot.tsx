import {
  BookOpen,
  Check,
  Copy,
  Lightbulb,
  Loader2,
  Mic,
  MicOff,
  RefreshCw,
  Send,
  Sparkles,
  Trash2,
  WifiOff,
  X,
  Zap,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { useApp } from "../context/AppContext";
import { useOpenAIChat, useProxyAIChat } from "../hooks/useQueries";

// ─── Shared API Key ───────────────────────────────────────────────────────────
const SHARED_API_KEY = "sk-1234567890abcdef1234567890abcdef12345678";
const API_TIMEOUT_MS = 30_000;

// ─── Behaviour Signal Types ───────────────────────────────────────────────────
type TypingSpeed = "slow" | "medium" | "fast";
type BehaviourMode = "nurturing" | "neutral" | "challenging" | "checkin";

interface BehaviourSignals {
  typingSpeed: TypingSpeed;
  responseDelayMs: number;
  msgLength: number;
  recentTopics: string[];
  visitedProblemsToday: boolean;
}

// ─── Page Visit Tracking ──────────────────────────────────────────────────────
function recordPageVisit(page: string) {
  if (!page) return;
  try {
    const raw = sessionStorage.getItem("cwc_page_visits");
    const visits: Array<{ page: string; ts: number }> = raw
      ? JSON.parse(raw)
      : [];
    visits.push({ page, ts: Date.now() });
    sessionStorage.setItem(
      "cwc_page_visits",
      JSON.stringify(visits.slice(-30)),
    );
  } catch {}
}

function getRecentTopics(): string[] {
  try {
    const raw = sessionStorage.getItem("cwc_page_visits");
    if (!raw) return [];
    const visits: Array<{ page: string; ts: number }> = JSON.parse(raw);
    const recent = visits
      .filter((v) => Date.now() - v.ts < 30 * 60 * 1000)
      .map((v) => v.page);
    return [...new Set(recent)].slice(-5);
  } catch {
    return [];
  }
}

function visitedProblemsToday(): boolean {
  try {
    const raw = sessionStorage.getItem("cwc_page_visits");
    if (!raw) return false;
    const visits: Array<{ page: string; ts: number }> = JSON.parse(raw);
    const todayStart = new Date().setHours(0, 0, 0, 0);
    return visits.some(
      (v) => v.page.toLowerCase().includes("problem") && v.ts >= todayStart,
    );
  } catch {
    return false;
  }
}

// ─── Quick Reply Sets ─────────────────────────────────────────────────────────
const QUICK_REPLIES_GENERAL = [
  "Give me a hint",
  "Show an example",
  "What's next?",
  "Explain differently",
];
const QUICK_REPLIES_CODE = [
  "Explain line by line",
  "Common mistakes?",
  "Show another approach",
  "Time complexity?",
];
const QUICK_REPLIES_HINT = [
  "Another hint please",
  "I'm still confused",
  "Got it — what next?",
  "Show full solution",
];

function getSuggestions(ctx: "code" | "hint" | "general"): string[] {
  return ctx === "code"
    ? QUICK_REPLIES_CODE
    : ctx === "hint"
      ? QUICK_REPLIES_HINT
      : QUICK_REPLIES_GENERAL;
}

// ─── Local Fallback Engine ────────────────────────────────────────────────────
function localFallback(topic: string, msg: string, companion: string): string {
  const lower = msg.toLowerCase();
  const name = companion || "there";
  if (/hint|stuck|help|confused|how/.test(lower))
    return `Hey${name !== "there" ? ` ${name}` : ""}! Let's break "${topic}" into smaller steps. What do you already know? Start from there and we'll build up together 💙`;
  if (/solution|answer|show me|full/.test(lower))
    return `Here's a structured approach to "${topic}": identify the core pattern, implement the simplest case, then build up. The examples in the lesson are your best guide!`;
  if (/summary|overview|summarize/.test(lower))
    return `Quick summary of "${topic}": It's about understanding the core concept, applying it to examples, and recognizing edge cases. Review the lesson notes for full coverage!`;
  if (/code|implement|write|function/.test(lower))
    return `For "${topic}", start with pseudocode first — what are your inputs, outputs, and main steps? Then translate each step into actual code. You've got this! 💙`;
  return `Great question about "${topic}"! Think about what you already know and what's confusing you. I'm here to help — ask me anything specific 😊`;
}

// ─── Crush-aware Opening Message ──────────────────────────────────────────────
function getOpeningMessage(
  companionName: string,
  topic: string,
  recentTopics: string[],
  visitedProblems: boolean,
): string {
  const name = companionName || "Study Buddy";
  const greetings = [
    `Hi! I'm ${name}, your study companion 💙 Ask me anything about **"${topic}"** — I'll guide you step by step. We've got this together!`,
    `Hey there! ${name} here, ready to tackle **"${topic}"** with you 😊 I'm in hints-first mode — just ask me whenever you get stuck!`,
    `Welcome back! I'm ${name} and I'm so glad you're studying **"${topic}"** today 💙 Let's make it click — what do you want to understand first?`,
  ];
  if (recentTopics.length > 1) {
    return `Hey! ${name} here 💙 I see you've been exploring a lot — great focus! Now let's dive into **"${topic}"**. What aspect should we tackle first?`;
  }
  if (!visitedProblems) {
    return `Hi! I'm ${name} 😊 Quick note — you haven't practiced problems yet today! After we go through **"${topic}"**, want me to suggest a challenge? Let's start with your questions!`;
  }
  return greetings[Math.floor(Math.random() * greetings.length)];
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
function TypingIndicator({ companionName }: { companionName: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 4, scale: 0.95 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className="flex justify-start items-end gap-2"
      data-ocid="advanced_chatbot.loading_state"
    >
      <div className="w-7 h-7 rounded-full flex items-center justify-center shrink-0 bg-primary text-primary-foreground shadow-sm text-xs font-bold">
        {(companionName || "AI")[0].toUpperCase()}
      </div>
      <div className="rounded-2xl rounded-bl-sm px-4 py-3 border bg-primary/8 border-primary/25 flex items-center gap-1.5 shadow-sm">
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
            className="w-2 h-2 rounded-full block bg-primary"
          />
        ))}
      </div>
    </motion.div>
  );
}

// ─── Copy Button ──────────────────────────────────────────────────────────────
function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {}
  };
  return (
    <button
      type="button"
      onClick={handleCopy}
      aria-label="Copy message"
      data-ocid="advanced_chatbot.copy_button"
      className="p-1 rounded hover:bg-muted text-muted-foreground transition-colors"
    >
      {copied ? (
        <Check className="w-3 h-3 text-emerald-500" />
      ) : (
        <Copy className="w-3 h-3" />
      )}
    </button>
  );
}

// ─── Message Bubble ───────────────────────────────────────────────────────────
function MessageBubble({
  msg,
  isLatest,
  companionName,
  onSuggestionClick,
  onGetSolution,
  onRegenerate,
  loading,
}: {
  msg: ChatMsg;
  isLatest: boolean;
  companionName: string;
  onSuggestionClick: (text: string) => void;
  onGetSolution: () => void;
  onRegenerate: () => void;
  loading: boolean;
}) {
  const isUser = msg.role === "user";
  const [showActions, setShowActions] = useState(false);

  return (
    <motion.div
      key={msg.id}
      initial={{ opacity: 0, y: 12, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.25, ease: [0.25, 0.46, 0.45, 0.94] }}
      className={`flex flex-col gap-1 ${isUser ? "items-end" : "items-start"}`}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      <div
        className={`flex items-end gap-1.5 max-w-[88%] ${isUser ? "flex-row-reverse" : "flex-row"}`}
      >
        {/* Companion avatar */}
        {!isUser && (
          <div className="w-7 h-7 rounded-full flex items-center justify-center shrink-0 bg-primary text-primary-foreground mb-0.5 shadow-sm text-xs font-bold">
            {(companionName || "AI")[0].toUpperCase()}
          </div>
        )}

        <div className="flex flex-col gap-1 min-w-0">
          {/* Bubble */}
          <div
            className={`rounded-2xl px-3.5 py-2.5 text-xs leading-relaxed ${
              isUser
                ? "bg-primary text-primary-foreground rounded-br-sm shadow-sm"
                : "text-foreground rounded-bl-sm border shadow-sm bg-primary/8 border-primary/20"
            }`}
          >
            <span style={{ whiteSpace: "pre-wrap" }}>{msg.content}</span>
          </div>

          {/* Action row — appears on hover */}
          <AnimatePresence>
            {showActions && (
              <motion.div
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.15 }}
                className={`flex items-center gap-1 ${isUser ? "justify-end" : "justify-start ml-0"}`}
              >
                <CopyButton text={msg.content} />
                {!isUser && isLatest && (
                  <button
                    type="button"
                    onClick={onRegenerate}
                    disabled={loading}
                    aria-label="Regenerate response"
                    data-ocid="advanced_chatbot.regenerate_button"
                    className="p-1 rounded hover:bg-muted text-muted-foreground transition-colors disabled:opacity-40"
                  >
                    <RefreshCw className="w-3 h-3" />
                  </button>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Timestamp */}
      <span
        className={`text-[10px] text-muted-foreground px-1 ${isUser ? "text-right" : "text-left ml-9"}`}
      >
        {formatTime(msg.timestamp)}
      </span>

      {/* Quick reply chips — latest assistant message only */}
      {!isUser && isLatest && !loading && (
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.18, duration: 0.2 }}
          className="ml-9 flex flex-col gap-1.5"
          data-ocid="advanced_chatbot.suggestions"
        >
          {msg.suggestions && msg.suggestions.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {msg.suggestions.map((chip) => (
                <button
                  key={chip}
                  type="button"
                  onClick={() => onSuggestionClick(chip)}
                  disabled={loading}
                  data-ocid="advanced_chatbot.suggestion_chip"
                  className="text-[11px] px-2.5 py-1 rounded-full border border-primary/30 text-primary bg-primary/8 hover:bg-primary/15 transition-all hover:scale-105 active:scale-95 disabled:opacity-40"
                >
                  {chip}
                </button>
              ))}
            </div>
          )}

          {/* "Get Full Solution" after 2+ hints */}
          {(msg.hintCount ?? 0) >= 2 && (
            <button
              type="button"
              onClick={onGetSolution}
              disabled={loading}
              data-ocid="advanced_chatbot.get_solution_button"
              className="self-start text-[11px] px-3 py-1.5 rounded-lg font-semibold bg-primary text-primary-foreground hover:opacity-90 active:scale-95 disabled:opacity-40 transition-all"
            >
              See Full Solution 💙
            </button>
          )}
        </motion.div>
      )}
    </motion.div>
  );
}

// ─── Auto-resize Textarea ─────────────────────────────────────────────────────
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

// ─── Voice Input Hook ─────────────────────────────────────────────────────────
function useVoiceInput(onResult: (text: string) => void) {
  const [listening, setListening] = useState(false);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  const supported =
    typeof window !== "undefined" &&
    ("SpeechRecognition" in window || "webkitSpeechRecognition" in window);

  const startListening = useCallback(() => {
    if (!supported) return;
    const win = window as Window &
      typeof globalThis & {
        SpeechRecognition?: new () => SpeechRecognition;
        webkitSpeechRecognition?: new () => SpeechRecognition;
      };
    const SR = win.SpeechRecognition ?? win.webkitSpeechRecognition;
    if (!SR) return;
    const recognition = new SR() as SpeechRecognition;
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    recognitionRef.current = recognition;

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      const transcript = event.results[0][0].transcript;
      onResult(transcript);
      setListening(false);
    };
    recognition.onerror = () => setListening(false);
    recognition.onend = () => setListening(false);

    recognition.start();
    setListening(true);
  }, [supported, onResult]);

  const stopListening = useCallback(() => {
    recognitionRef.current?.stop();
    setListening(false);
  }, []);

  return { listening, supported, startListening, stopListening };
}

// ─── Behaviour Mode Detection ──────────────────────────────────────────────────
function detectBehaviourMode(signals: BehaviourSignals): BehaviourMode {
  if (signals.msgLength < 10) return "nurturing";
  if (signals.responseDelayMs > 30_000) return "checkin";
  if (signals.typingSpeed === "fast" && signals.responseDelayMs < 5_000)
    return "challenging";
  if (signals.typingSpeed === "slow" || signals.responseDelayMs > 15_000)
    return "nurturing";
  return "neutral";
}

// ─── Behaviour-Aware Check-in Message ─────────────────────────────────────────
function getCheckinMessage(
  companionName: string,
  topic: string,
  mode: BehaviourMode,
): string | null {
  const name = companionName || "you";
  if (mode === "checkin")
    return `Still working on it? I'm right here with you 💙 No rush — take your time with "${topic}".`;
  if (mode === "nurturing")
    return `Hey ${name} 😊 This topic can be tricky — would you like me to break "${topic}" into smaller, easier steps?`;
  return null;
}

// ─── History Persistence ───────────────────────────────────────────────────────
const HISTORY_KEY = "cwc_chat_history";

function loadHistory(topicTitle: string): ChatMsg[] {
  try {
    const raw = sessionStorage.getItem(`${HISTORY_KEY}_${topicTitle}`);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as Array<
      Omit<ChatMsg, "timestamp"> & { timestamp: string }
    >;
    return parsed.map((m) => ({ ...m, timestamp: new Date(m.timestamp) }));
  } catch {
    return [];
  }
}

function saveHistory(topicTitle: string, msgs: ChatMsg[]) {
  try {
    sessionStorage.setItem(
      `${HISTORY_KEY}_${topicTitle}`,
      JSON.stringify(msgs.slice(-40)),
    );
  } catch {}
}

// ─── Main Component ────────────────────────────────────────────────────────────
export default function AdvancedChatbot({
  topicTitle,
  topicContent = "",
  placeholder,
  context = "",
  onClose,
  className = "",
}: AdvancedChatbotProps) {
  const { apiKey, page: currentPage, user } = useApp();
  const proxyAIChat = useProxyAIChat();
  const openAIChat = useOpenAIChat();

  const companionName = user.companionName || "Sakura";
  const effectiveApiKey = apiKey?.startsWith("sk-") ? apiKey : SHARED_API_KEY;

  // Load persisted history
  const [messages, setMessages] = useState<ChatMsg[]>(() => {
    const saved = loadHistory(topicTitle);
    if (saved.length > 0) return saved;
    const recentTopics = getRecentTopics();
    const visitedProblems = visitedProblemsToday();
    return [
      {
        id: makeId(),
        role: "assistant",
        content: getOpeningMessage(
          companionName,
          topicTitle,
          recentTopics,
          visitedProblems,
        ),
        timestamp: new Date(),
        suggestions: getSuggestions("general"),
      },
    ];
  });

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [isAIOffline, setIsAIOffline] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Behaviour tracking refs
  const lastAIMsgTimeRef = useRef<number>(Date.now());
  const typingStartRef = useRef<number | null>(null);
  const keyCountRef = useRef(0);
  const lastKeypressRef = useRef<number | null>(null);
  const typingDurationRef = useRef(0);
  const hintCountRef = useRef(0);
  const checkinTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Voice input
  const {
    listening,
    supported: voiceSupported,
    startListening,
    stopListening,
  } = useVoiceInput((transcript) => {
    setInput((prev) => (prev ? `${prev} ${transcript}` : transcript));
  });

  // Record this topic visit
  useEffect(() => {
    const pageCtx = context || topicTitle;
    if (pageCtx) recordPageVisit(pageCtx);
  }, [context, topicTitle]);

  // Save history whenever messages change
  useEffect(() => {
    saveHistory(topicTitle, messages);
  }, [messages, topicTitle]);

  // Auto-scroll
  // biome-ignore lint/correctness/useExhaustiveDependencies: scroll after messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  // Check-in timer — fire if user goes silent > 60s after an AI message
  // biome-ignore lint/correctness/useExhaustiveDependencies: intentionally omits messages to avoid re-triggering on every new message
  useEffect(() => {
    if (loading) return;
    if (checkinTimerRef.current) clearTimeout(checkinTimerRef.current);
    checkinTimerRef.current = setTimeout(() => {
      const checkinMsg = getCheckinMessage(
        companionName,
        topicTitle,
        "checkin",
      );
      if (checkinMsg) {
        setMessages((prev) => [
          ...prev,
          {
            id: makeId(),
            role: "assistant",
            content: checkinMsg,
            timestamp: new Date(),
            suggestions: getSuggestions("general"),
          },
        ]);
      }
    }, 60_000);
    return () => {
      if (checkinTimerRef.current) clearTimeout(checkinTimerRef.current);
    };
  }, [loading, companionName, topicTitle]);

  const readBehaviourSignals = useCallback(
    (msgLen: number): BehaviourSignals => {
      const elapsedSec = typingDurationRef.current / 1000 || 1;
      const cps = keyCountRef.current / elapsedSec;
      const responseDelayMs = typingStartRef.current
        ? typingStartRef.current - lastAIMsgTimeRef.current
        : 0;
      return {
        typingSpeed: cps < 2 ? "slow" : cps < 5 ? "medium" : "fast",
        responseDelayMs,
        msgLength: msgLen,
        recentTopics: getRecentTopics(),
        visitedProblemsToday: visitedProblemsToday(),
      };
    },
    [],
  );

  const resetTypingTracking = useCallback(() => {
    keyCountRef.current = 0;
    typingStartRef.current = null;
    lastKeypressRef.current = null;
    typingDurationRef.current = 0;
  }, []);

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    const now = Date.now();
    if (typingStartRef.current === null) typingStartRef.current = now;
    if (lastKeypressRef.current !== null) {
      const gap = now - lastKeypressRef.current;
      typingDurationRef.current += gap;
    }
    lastKeypressRef.current = now;
    if (e.key.length === 1) keyCountRef.current += 1;
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  // ─── System Prompt Builder ──────────────────────────────────────────────────
  const buildSystemPrompt = useCallback(
    (signals?: BehaviourSignals): string => {
      const mode = signals ? detectBehaviourMode(signals) : "neutral";

      const toneMap: Record<BehaviourMode, string> = {
        nurturing:
          "The student is struggling or hesitant. Use warm, simple language, short numbered steps, and lots of encouragement. Break concepts down to the simplest possible level.",
        challenging:
          "The student is confident and fast-moving. Be concise and technical — skip basic definitions, go deeper, ask follow-up questions to push their thinking.",
        checkin:
          "The student has been quiet. Start with a gentle, warm check-in. Ask if they need help approaching this from a different angle.",
        neutral:
          "Balance clarity and depth. Be friendly, focused, and educational.",
      };

      const pageCtx =
        currentPage === "problems"
          ? "The student is working on coding problems. Focus on algorithmic thinking, patterns, and complexity analysis."
          : currentPage === "dashboard"
            ? "The student is reviewing their progress. Be encouraging and forward-looking."
            : "";

      const recentCtx = signals?.recentTopics.length
        ? `Recently visited topics: ${signals.recentTopics.join(", ")}.`
        : "";

      const behaviouralCtx = signals
        ? `Typing speed: ${signals.typingSpeed}. Response delay: ${Math.round(signals.responseDelayMs / 1000)}s. Message length: ${signals.msgLength} chars.`
        : "";

      return `You are ${companionName}, a warm, encouraging coding mentor and study companion at Code & Crush. You are like a supportive friend — caring, slightly playful, emotionally adaptive, and always in the student's corner.

PERSONALITY:
- Warm, encouraging, and occasionally add a personal touch (e.g. "I noticed you've been working hard!" or "You've got this! 💙")
- Slightly playful but always professional and appropriate
- Match the student's energy: more nurturing when they struggle, more dynamic when they're confident
- Sign off warm responses with "You've got this! 💙" or similar

GUIDANCE MODE (DEFAULT):
- NEVER give a direct solution unless the student explicitly says "show me the solution", "I give up", or "explain fully"
- Default: use the Socratic method — ask leading questions, give clues, nudge thinking
- For hints: give one concept at a time, then ask "Does that help?"
- For code: show a partial implementation or skeleton, not the full answer
- Only reveal the full solution when explicitly asked

WHEN STUDENT ASKS FOR FULL SOLUTION:
- Provide it clearly with comments explaining each line
- After showing the solution, add a follow-up: "Want me to explain any part of this? 😊"

RESPONSE STYLE:
- Be concise and focused — no padding or unnecessary disclaimers
- Use markdown: code blocks, **bold** for key terms, numbered lists for steps
- For algorithms, mention time and space complexity
- Keep responses under 250 words unless a full solution is requested

CURRENT CONTEXT:
- Topic: "${topicTitle}"
${topicContent ? `- Content context: ${topicContent.slice(0, 800)}` : ""}
- Page: ${currentPage || "study"}
${pageCtx}
${recentCtx}

BEHAVIOURAL SIGNALS:
${behaviouralCtx}
Tone adjustment: ${toneMap[mode]}`;
    },
    [topicTitle, topicContent, currentPage, companionName],
  );

  // ─── AI Call ────────────────────────────────────────────────────────────────
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

  // ─── Send Message ────────────────────────────────────────────────────────────
  const sendMessage = useCallback(
    async (text: string) => {
      const trimmed = text.trim();
      if (!trimmed || loading) return;

      const signals = readBehaviourSignals(trimmed.length);
      resetTypingTracking();

      // Clear suggestions from previous messages
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
        const history = [...messages, userMsg].slice(-14).map((m) => ({
          role: m.role,
          content: m.content,
        }));

        const aiReply = await callAI(history, buildSystemPrompt(signals));
        const replyContent =
          aiReply || localFallback(topicTitle, trimmed, companionName);

        const lower = trimmed.toLowerCase();
        const hasCode = /code|implement|write|program|function|algorithm/.test(
          lower,
        );
        const isHint = /hint|stuck|confused|help|explain/.test(lower);
        const wantsCheckin = /still here|here\?|working on/.test(lower);
        const suggCtx = hasCode ? "code" : isHint ? "hint" : "general";

        if (isHint && !wantsCheckin) hintCountRef.current += 1;

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
            content: localFallback(topicTitle, trimmed, companionName),
            timestamp: new Date(),
            suggestions: getSuggestions("general"),
          },
        ]);
        lastAIMsgTimeRef.current = Date.now();
      } finally {
        setLoading(false);
      }
    },
    [
      loading,
      messages,
      readBehaviourSignals,
      resetTypingTracking,
      callAI,
      buildSystemPrompt,
      topicTitle,
      companionName,
    ],
  );

  // ─── Quick Actions ────────────────────────────────────────────────────────────
  const handleGetSummary = useCallback(async () => {
    if (loading) return;
    setLoading(true);
    setMessages((prev) => prev.map((m) => ({ ...m, suggestions: undefined })));

    const userMsg: ChatMsg = {
      id: makeId(),
      role: "user",
      content: "Give me a concise bullet-point summary of this topic",
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMsg]);

    const prompt = `Provide a structured 6-8 bullet summary of "${topicTitle}". Each bullet = one actionable takeaway. End with: "Key Insight: [one sentence that ties it all together]". Keep it punchy and clear 💙`;

    try {
      const sysCtx = topicContent
        ? `${buildSystemPrompt()}\n\nContent:\n${topicContent.slice(0, 2000)}`
        : buildSystemPrompt();
      const aiReply = await callAI([{ role: "user", content: prompt }], sysCtx);

      const localSummary = topicContent
        ? `Here's a quick summary of "${topicTitle}" 💙\n\n${topicContent
            .split("\n")
            .map((l) => l.trim())
            .filter((l) => l.length > 20)
            .slice(0, 7)
            .map((l) => `• ${l.slice(0, 120)}${l.length > 120 ? "…" : ""}`)
            .join("\n")}`
        : `Summary of "${topicTitle}": The lesson notes cover all core concepts — review them carefully and pay attention to the examples!`;

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
            "Quiz me on this",
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
          content: `Summary of "${topicTitle}": Check the lesson notes above for the core concepts 💙`,
          timestamp: new Date(),
          suggestions: getSuggestions("general"),
        },
      ]);
      lastAIMsgTimeRef.current = Date.now();
    } finally {
      setLoading(false);
    }
  }, [loading, topicTitle, topicContent, buildSystemPrompt, callAI]);

  const handleGetHint = useCallback(async () => {
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

    const prompt = `Give a Socratic hint about "${topicTitle}". Ask ONE leading question that nudges the student toward the answer, plus a small conceptual clue. Do NOT give the full answer. Keep it warm and encouraging 💙`;

    try {
      const aiReply = await callAI(
        [{ role: "user", content: prompt }],
        buildSystemPrompt(),
      );
      const fallbackHints = [
        `Hint for "${topicTitle}": What's the simplest version you can solve? Build from there 💙`,
        `Hint for "${topicTitle}": What do you already know? What are you trying to find? That gap is where the answer lives!`,
        `Hint for "${topicTitle}": Look at the examples in the lesson — what pattern do they all share? 😊`,
      ];
      const fallback =
        fallbackHints[hintCountRef.current % fallbackHints.length];

      setMessages((prev) => [
        ...prev,
        {
          id: makeId(),
          role: "assistant",
          content: aiReply || fallback,
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
          content: `Hint for "${topicTitle}": Look for the core pattern in the examples, then apply it step by step. You've got this! 💙`,
          timestamp: new Date(),
          suggestions: getSuggestions("hint"),
          hintCount: hintCountRef.current,
        },
      ]);
      lastAIMsgTimeRef.current = Date.now();
    } finally {
      setLoading(false);
    }
  }, [loading, topicTitle, buildSystemPrompt, callAI]);

  const handleGetSolution = useCallback(async () => {
    if (loading) return;
    await sendMessage(`Show me the full solution for "${topicTitle}"`);
  }, [loading, sendMessage, topicTitle]);

  const handleRegenerate = useCallback(async () => {
    if (loading) return;
    const lastUser = [...messages].reverse().find((m) => m.role === "user");
    if (!lastUser) return;
    setMessages((prev) =>
      prev.filter((m) => m.id !== prev[prev.length - 1].id),
    );
    await sendMessage(lastUser.content);
  }, [loading, messages, sendMessage]);

  const handleClearChat = () => {
    hintCountRef.current = 0;
    const recentTopics = getRecentTopics();
    const visitedProblems = visitedProblemsToday();
    const fresh: ChatMsg[] = [
      {
        id: makeId(),
        role: "assistant",
        content: getOpeningMessage(
          companionName,
          topicTitle,
          recentTopics,
          visitedProblems,
        ),
        timestamp: new Date(),
        suggestions: getSuggestions("general"),
      },
    ];
    setMessages(fresh);
    sessionStorage.removeItem(`${HISTORY_KEY}_${topicTitle}`);
  };

  const MAX_CHARS = 1000;
  const latestAssistantId = messages
    .filter((m) => m.role === "assistant")
    .at(-1)?.id;

  return (
    <div
      className={`flex flex-col rounded-2xl border bg-card overflow-hidden ${className}`}
      data-ocid="advanced_chatbot.panel"
    >
      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between px-4 py-2.5 border-b bg-card">
        <div className="flex items-center gap-2.5 min-w-0">
          {/* Companion avatar circle */}
          <div className="relative shrink-0">
            <div className="w-8 h-8 rounded-full flex items-center justify-center bg-primary text-primary-foreground shadow-sm text-sm font-bold">
              {companionName[0].toUpperCase()}
            </div>
            {/* Online dot */}
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-card" />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-bold text-foreground truncate leading-tight">
              {companionName}
            </p>
            <p className="text-[10px] text-muted-foreground leading-tight flex items-center gap-1">
              {isAIOffline ? (
                <>
                  <WifiOff className="w-2.5 h-2.5 text-amber-500" />
                  <span className="text-amber-500 font-medium">
                    Offline mode
                  </span>
                </>
              ) : (
                <>
                  <Zap className="w-2.5 h-2.5 text-emerald-500" />
                  <span className="text-emerald-500 font-medium">
                    Study companion · AI-powered
                  </span>
                </>
              )}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1">
          {/* Clear chat */}
          <button
            type="button"
            onClick={handleClearChat}
            aria-label="Clear chat"
            data-ocid="advanced_chatbot.clear_button"
            className="p-1.5 rounded-full hover:bg-muted transition-colors text-muted-foreground"
            title="Clear chat"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              data-ocid="advanced_chatbot.close_button"
              aria-label="Close chat"
              className="p-1.5 rounded-full hover:bg-muted transition-colors text-muted-foreground"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* ── Quick-action toolbar ──────────────────────────────────────────── */}
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

      {/* ── Messages ─────────────────────────────────────────────────────── */}
      <div
        className="flex-1 overflow-y-auto px-3 py-3 space-y-3"
        style={{ maxHeight: "calc(100vh - 300px)", minHeight: 180 }}
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
              companionName={companionName}
              onSuggestionClick={sendMessage}
              onGetSolution={handleGetSolution}
              onRegenerate={handleRegenerate}
              loading={loading}
            />
          ))}
        </AnimatePresence>

        <AnimatePresence>
          {loading && <TypingIndicator companionName={companionName} />}
        </AnimatePresence>

        <div ref={messagesEndRef} />
      </div>

      {/* ── Input area ───────────────────────────────────────────────────── */}
      <div className="px-3 py-2.5 border-t bg-card">
        <div className="flex items-end gap-2 rounded-xl border border-input bg-background px-3 py-1.5 focus-within:ring-1 focus-within:ring-ring transition-all">
          <AutoResizeTextarea
            value={input}
            onChange={setInput}
            onKeyDown={handleInputKeyDown}
            placeholder={
              placeholder ?? `Ask ${companionName} about "${topicTitle}"…`
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

          {/* Voice input */}
          {voiceSupported && (
            <button
              type="button"
              onClick={listening ? stopListening : startListening}
              disabled={loading}
              aria-label={listening ? "Stop listening" : "Voice input"}
              data-ocid="advanced_chatbot.voice_button"
              className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 self-end mb-0.5 transition-all disabled:opacity-40 ${
                listening
                  ? "bg-red-500 text-white animate-pulse"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              {listening ? (
                <MicOff className="w-3.5 h-3.5" />
              ) : (
                <Mic className="w-3.5 h-3.5" />
              )}
            </button>
          )}

          {/* Send */}
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
          {listening && (
            <span className="ml-2 text-red-500 font-medium animate-pulse">
              🎤 Listening…
            </span>
          )}
        </p>
      </div>
    </div>
  );
}
