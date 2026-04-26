import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { useApp } from "../context/AppContext";
import {
  DOMAIN_DISPLAY_NAMES,
  type DomainCoding,
  type DomainMCQ,
  getDomainQuestions,
} from "../data/mockTestData";

// ── Types ────────────────────────────────────────────────────────────────────
interface TestHistoryEntry {
  date: string;
  score: number;
  maxScore: number;
  timeTaken: number;
  domain: string;
}

// ── Helpers ──────────────────────────────────────────────────────────────────
function formatTime(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  if (h > 0) {
    return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  }
  return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// Similarity check: does spoken transcript match an option?
function matchTranscriptToOption(
  transcript: string,
  options: string[],
): number {
  const t = transcript.toLowerCase().trim();
  // Exact letter match: "a", "b", "c", "d"
  const letterMap: Record<string, number> = { a: 0, b: 1, c: 2, d: 3 };
  if (t in letterMap) return letterMap[t];
  // Check if transcript contains the option text (or vice versa)
  for (let i = 0; i < options.length; i++) {
    const opt = options[i].toLowerCase();
    if (t.includes(opt) || opt.includes(t)) return i;
    // partial word match — check common words
    const tWords = t.split(/\s+/).filter((w) => w.length > 3);
    const oWords = opt.split(/\s+/).filter((w) => w.length > 3);
    const shared = tWords.filter((w) =>
      oWords.some((ow) => ow.includes(w) || w.includes(ow)),
    );
    if (shared.length >= 1 && oWords.length > 0) return i;
  }
  return -1;
}

const DOMAIN_META: Record<string, { emoji: string; color: string }> = {
  ProgrammingInC: { emoji: "🔧", color: "#3b82f6" },
  Frontend: { emoji: "🌐", color: "#8b5cf6" },
  Python: { emoji: "🐍", color: "#10b981" },
  Backend: { emoji: "⚙️", color: "#f59e0b" },
  FullStack: { emoji: "🏗️", color: "#06b6d4" },
  DataScience: { emoji: "📊", color: "#6366f1" },
  ML: { emoji: "🤖", color: "#ec4899" },
  DevOps: { emoji: "🚀", color: "#f97316" },
  Android: { emoji: "📱", color: "#84cc16" },
  iOS: { emoji: "🍎", color: "#ef4444" },
  Cybersecurity: { emoji: "🔐", color: "#14b8a6" },
  Blockchain: { emoji: "⛓️", color: "#a855f7" },
  Cloud: { emoji: "☁️", color: "#0ea5e9" },
  AIML: { emoji: "🧠", color: "#f43f5e" },
  GameDev: { emoji: "🎮", color: "#22c55e" },
  UIUXDesign: { emoji: "🎨", color: "#fb923c" },
};

const ALL_DOMAINS = Object.keys(DOMAIN_DISPLAY_NAMES);

// ── Voice Hook ────────────────────────────────────────────────────────────────
type VoiceState = "idle" | "listening" | "processing" | "unsupported";

// Local speech recognition type shim (webkit + standard)
type SREvent = {
  results: { [idx: number]: { [idx: number]: { transcript: string } } };
};
type SRInstance = {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  onstart: (() => void) | null;
  onend: (() => void) | null;
  onerror: (() => void) | null;
  onresult: ((e: SREvent) => void) | null;
  start(): void;
  stop(): void;
};
type SRCtor = new () => SRInstance;

function getSR(): SRCtor | null {
  const w = window as Window & {
    SpeechRecognition?: SRCtor;
    webkitSpeechRecognition?: SRCtor;
  };
  return w.SpeechRecognition ?? w.webkitSpeechRecognition ?? null;
}

function useVoiceAnswer(onMatch: (optIdx: number, transcript: string) => void) {
  const [voiceState, setVoiceState] = useState<VoiceState>("idle");
  const [transcript, setTranscript] = useState("");
  const recognitionRef = useRef<SRInstance | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const voiceStateRef = useRef<VoiceState>("idle");

  const isSupported = typeof window !== "undefined" && !!getSR();

  const start = (options: string[]) => {
    const SR = getSR();
    if (!SR) {
      setVoiceState("unsupported");
      return;
    }
    if (voiceStateRef.current === "listening") {
      recognitionRef.current?.stop();
      setVoiceState("idle");
      voiceStateRef.current = "idle";
      return;
    }

    const recognition = new SR();
    recognition.lang = "en-US";
    recognition.continuous = false;
    recognition.interimResults = false;
    recognitionRef.current = recognition;

    recognition.onstart = () => {
      setVoiceState("listening");
      voiceStateRef.current = "listening";
      setTranscript("");
    };

    recognition.onresult = (e: SREvent) => {
      const text = e.results[0][0].transcript;
      setTranscript(text);
      setVoiceState("processing");
      voiceStateRef.current = "processing";
      const matched = matchTranscriptToOption(text, options);
      if (matched >= 0) {
        onMatch(matched, text);
      }
      setTimeout(() => {
        setVoiceState("idle");
        voiceStateRef.current = "idle";
      }, 2000);
    };

    recognition.onerror = () => {
      setVoiceState("idle");
      voiceStateRef.current = "idle";
    };

    recognition.onend = () => {
      if (voiceStateRef.current === "listening") {
        setVoiceState("idle");
        voiceStateRef.current = "idle";
      }
    };

    recognition.start();

    // Auto-stop after 6 seconds
    timeoutRef.current = setTimeout(() => {
      recognition.stop();
      setVoiceState("idle");
      voiceStateRef.current = "idle";
    }, 6000);
  };

  const stop = () => {
    recognitionRef.current?.stop();
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setVoiceState("idle");
    voiceStateRef.current = "idle";
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(
    () => () => {
      recognitionRef.current?.stop();
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    },
    [],
  );

  return { voiceState, transcript, start, stop, isSupported };
}

// ── Confetti ─────────────────────────────────────────────────────────────────
function ConfettiPiece({ index }: { index: number }) {
  const colors = [
    "#4f6ef7",
    "#22c55e",
    "#f59e0b",
    "#ec4899",
    "#10b981",
    "#a855f7",
  ];
  const color = colors[index % colors.length];
  const left = `${(index * 7.3) % 100}%`;
  const delay = `${(index * 0.15) % 3}s`;
  const size = 6 + (index % 5) * 2;
  return (
    <div
      style={{
        position: "absolute",
        left,
        top: "-10px",
        width: size,
        height: size,
        background: color,
        borderRadius: index % 2 === 0 ? "50%" : "2px",
        animation: `confettiFall ${2 + (index % 2)}s linear ${delay} infinite`,
        transform: `rotate(${index * 37}deg)`,
      }}
    />
  );
}

// ── Domain Selector ──────────────────────────────────────────────────────────
function DomainSelector({ onSelect }: { onSelect: (domain: string) => void }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
      {ALL_DOMAINS.map((d) => {
        const meta = DOMAIN_META[d] ?? { emoji: "📝", color: "#4f6ef7" };
        const { mcqs, coding } = getDomainQuestions(d);
        const mcqCount = Math.min(mcqs.length, 20);
        const codeCount = Math.min(coding.length, 5);
        return (
          <button
            key={d}
            type="button"
            onClick={() => onSelect(d)}
            className="group bg-card border border-border rounded-2xl p-4 text-left hover:shadow-lg hover:border-primary/50 hover:-translate-y-0.5 transition-all duration-200"
            data-ocid={`domain_test.select.${d.toLowerCase()}`}
          >
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center text-xl mb-3"
              style={{ background: `${meta.color}20` }}
            >
              {meta.emoji}
            </div>
            <div className="font-bold text-foreground text-sm leading-tight mb-1 truncate">
              {DOMAIN_DISPLAY_NAMES[d] ?? d}
            </div>
            <div className="text-xs text-muted-foreground mb-3">
              {mcqCount} MCQ · {codeCount} Coding
            </div>
            <div
              className="w-full py-1.5 rounded-lg text-xs font-bold text-white text-center opacity-0 group-hover:opacity-100 transition-opacity"
              style={{ background: meta.color }}
            >
              Start Test →
            </div>
          </button>
        );
      })}
    </div>
  );
}

// ── Setup Screen ─────────────────────────────────────────────────────────────
function SetupScreen({
  domain,
  onStart,
  onBack,
  onSelectDomain,
  history,
}: {
  domain: string | null;
  onStart: (minutes: number, domain: string) => void;
  onBack: () => void;
  onSelectDomain: (d: string) => void;
  history: TestHistoryEntry[];
}) {
  const [pendingDomain, setPendingDomain] = useState<string | null>(domain);
  const meta = pendingDomain
    ? (DOMAIN_META[pendingDomain] ?? { emoji: "📝", color: "#4f6ef7" })
    : null;
  const displayName = pendingDomain
    ? (DOMAIN_DISPLAY_NAMES[pendingDomain] ?? pendingDomain)
    : null;

  // Fixed 60-minute test
  const selected = 60;

  return (
    <div className="h-[100dvh] bg-background flex flex-col overflow-hidden">
      {/* Header */}
      <header className="bg-card border-b border-border px-4 py-3 flex items-center gap-3 shrink-0 shadow-subtle">
        <button
          type="button"
          onClick={onBack}
          className="w-9 h-9 rounded-xl flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors shrink-0"
          data-ocid="domain_test.back_button"
          aria-label="Back"
        >
          ←
        </button>
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
            <span className="text-primary font-bold text-sm">📝</span>
          </div>
          <div className="min-w-0">
            <h1 className="font-bold text-foreground text-sm leading-tight truncate">
              {pendingDomain
                ? `${meta?.emoji} ${displayName} Test`
                : "Online Tests"}
            </h1>
            <p className="text-xs text-muted-foreground">
              Select domain · 1 hour · Start test
            </p>
          </div>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto px-4 py-5 pb-24 space-y-5">
          {!pendingDomain ? (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              <div>
                <h2 className="font-bold text-foreground text-base mb-1">
                  📚 Choose a Domain
                </h2>
                <p className="text-xs text-muted-foreground">
                  Each test has randomly selected MCQs + coding questions. Fixed
                  1-hour timer.
                </p>
              </div>
              <DomainSelector
                onSelect={(d) => {
                  setPendingDomain(d);
                  onSelectDomain(d);
                }}
              />
            </motion.div>
          ) : (
            <div className="max-w-xl space-y-4">
              {/* Domain Card */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-card border border-border rounded-2xl p-5"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div
                    className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl"
                    style={{ background: `${meta?.color}20` }}
                  >
                    {meta?.emoji}
                  </div>
                  <div>
                    <h2 className="font-bold text-foreground text-lg">
                      {displayName}
                    </h2>
                    <p className="text-xs text-muted-foreground">
                      Timed assessment · 1 hour fixed
                    </p>
                  </div>
                </div>

                {(() => {
                  const { mcqs, coding } = getDomainQuestions(pendingDomain);
                  const mcqCount = Math.min(mcqs.length, 20);
                  const codeCount = Math.min(coding.length, 5);
                  return (
                    <div className="grid grid-cols-2 gap-3 mb-4">
                      {[
                        {
                          icon: "📋",
                          label: "Section A",
                          value: `${mcqCount} MCQs`,
                          sub: "5 pts each",
                        },
                        {
                          icon: "💻",
                          label: "Section B",
                          value: `${codeCount} Coding`,
                          sub: "10 pts each",
                        },
                        {
                          icon: "⏱",
                          label: "Time Limit",
                          value: "60 minutes",
                          sub: "fixed timer",
                        },
                        {
                          icon: "🎯",
                          label: "XP Reward",
                          value: "Up to 150 XP",
                          sub: "on completion",
                        },
                      ].map((item) => (
                        <div
                          key={item.label}
                          className="bg-muted rounded-xl p-3"
                        >
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-base">{item.icon}</span>
                            <span className="text-xs text-muted-foreground font-medium">
                              {item.label}
                            </span>
                          </div>
                          <div className="text-sm font-bold text-foreground">
                            {item.value}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {item.sub}
                          </div>
                        </div>
                      ))}
                    </div>
                  );
                })()}

                <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-3 text-xs text-amber-400 flex items-start gap-2">
                  <span className="mt-0.5">⚠️</span>
                  <span>
                    Once started, the test cannot be paused. Questions are
                    randomly selected each attempt. Voice answering available on
                    MCQs.
                  </span>
                </div>
              </motion.div>

              <button
                type="button"
                onClick={() => setPendingDomain(null)}
                className="w-full text-xs text-primary font-semibold py-2 rounded-xl border border-primary/30 hover:bg-primary/5 transition-colors"
                data-ocid="domain_test.change_domain_button"
              >
                ← Change Domain
              </button>

              {/* Past Results */}
              {history.filter((h) => h.domain === pendingDomain).length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.08 }}
                  className="bg-card border border-border rounded-2xl p-5"
                >
                  <h3 className="font-bold text-foreground text-sm mb-3">
                    📊 Past Attempts
                  </h3>
                  <div className="space-y-2">
                    {[...history]
                      .filter((h) => h.domain === pendingDomain)
                      .reverse()
                      .slice(0, 5)
                      .map((h, i) => {
                        const pct = Math.round((h.score / h.maxScore) * 100);
                        return (
                          <div
                            key={`history-${i}-${h.date}`}
                            className="flex items-center gap-3 bg-muted rounded-xl px-3 py-2"
                          >
                            <div
                              className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0 ${
                                pct >= 60 ? "bg-green-500" : "bg-red-500"
                              }`}
                            >
                              {pct}%
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="text-sm font-semibold text-foreground">
                                {h.score}/{h.maxScore} pts
                              </div>
                              <div className="text-xs text-muted-foreground">
                                {new Date(h.date).toLocaleDateString()}
                              </div>
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {formatTime(h.timeTaken)}
                            </div>
                          </div>
                        );
                      })}
                  </div>
                </motion.div>
              )}

              <Button
                onClick={() => onStart(selected, pendingDomain)}
                className="w-full h-12 rounded-2xl font-bold text-base shadow-md"
                data-ocid="domain_test.start_button"
              >
                🚀 Start {displayName} Test (60 min)
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Question Number Grid (Sidebar) ────────────────────────────────────────────
function QuestionGrid({
  totalMcq,
  totalCoding,
  currentIndex,
  mcqAnswers,
  codingAttempted,
  onJump,
}: {
  totalMcq: number;
  totalCoding: number;
  currentIndex: number;
  mcqAnswers: Record<string, string[]>;
  codingAttempted: Set<number>;
  onJump: (index: number) => void;
}) {
  const total = totalMcq + totalCoding;
  return (
    <div className="space-y-3">
      <div>
        <div className="text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wide">
          Section A · MCQ
        </div>
        <div className="grid grid-cols-5 gap-1.5">
          {Array.from({ length: totalMcq }, (_, i) => {
            const answered =
              i <
              Object.keys(mcqAnswers).filter((k) => mcqAnswers[k]?.length > 0)
                .length;
            const isCurrent = i === currentIndex;
            return (
              <button
                key={`qg-mcq-${i}`}
                type="button"
                onClick={() => onJump(i)}
                className={`w-8 h-8 rounded-lg text-xs font-bold transition-all ${
                  isCurrent
                    ? "bg-primary text-primary-foreground shadow-md scale-110"
                    : answered
                      ? "bg-green-500 text-white hover:bg-green-600"
                      : "bg-muted text-muted-foreground hover:bg-muted/80 border border-border"
                }`}
                title={`Question ${i + 1}`}
              >
                {i + 1}
              </button>
            );
          })}
        </div>
      </div>
      {totalCoding > 0 && (
        <div>
          <div className="text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wide">
            Section B · Coding
          </div>
          <div className="grid grid-cols-5 gap-1.5">
            {Array.from({ length: totalCoding }, (_, i) => {
              const globalIndex = totalMcq + i;
              const isCurrent = globalIndex === currentIndex;
              const isAttempted = codingAttempted.has(i);
              return (
                <button
                  key={`qg-code-${i}`}
                  type="button"
                  onClick={() => onJump(globalIndex)}
                  className={`w-8 h-8 rounded-lg text-xs font-bold transition-all ${
                    isCurrent
                      ? "bg-primary text-primary-foreground shadow-md scale-110"
                      : isAttempted
                        ? "bg-green-500 text-white hover:bg-green-600"
                        : "bg-muted text-muted-foreground hover:bg-muted/80 border border-border"
                  }`}
                  title={`Coding ${i + 1}`}
                >
                  P{i + 1}
                </button>
              );
            })}
          </div>
        </div>
      )}
      <div className="pt-2 border-t border-border space-y-1.5 text-xs">
        {[
          { color: "bg-primary", label: "Current" },
          { color: "bg-green-500", label: "Answered" },
          { color: "bg-muted border border-border", label: "Unanswered" },
        ].map((item) => (
          <div
            key={item.label}
            className="flex items-center gap-2 text-muted-foreground"
          >
            <div className={`w-4 h-4 rounded ${item.color}`} />
            <span>{item.label}</span>
          </div>
        ))}
      </div>
      <div className="text-xs text-muted-foreground pt-1">
        {Object.values(mcqAnswers).filter((v) => v?.length > 0).length +
          codingAttempted.size}{" "}
        / {total} answered
      </div>
    </div>
  );
}

// ── Voice Button ─────────────────────────────────────────────────────────────
function VoiceButton({
  voiceState,
  isSupported,
  onToggle,
}: {
  voiceState: VoiceState;
  isSupported: boolean;
  onToggle: () => void;
}) {
  if (!isSupported) {
    return (
      <div className="flex items-center gap-1.5 text-xs text-muted-foreground bg-muted/50 rounded-lg px-2 py-1">
        <span>🎤</span>
        <span>Voice not supported</span>
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={onToggle}
      title={
        voiceState === "listening" ? "Stop listening" : "Speak your answer"
      }
      className={`relative flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-semibold transition-all duration-200 select-none ${
        voiceState === "listening"
          ? "bg-red-500/20 text-red-400 border border-red-500/40"
          : voiceState === "processing"
            ? "bg-blue-500/20 text-blue-400 border border-blue-500/40"
            : "bg-muted text-muted-foreground border border-border hover:border-primary/40 hover:text-foreground"
      }`}
      data-ocid="domain_test.voice_button"
      aria-label="Voice answer"
    >
      {voiceState === "listening" && (
        <span className="absolute inset-0 rounded-xl border-2 border-red-400 animate-ping opacity-60 pointer-events-none" />
      )}
      <span className={voiceState === "listening" ? "animate-pulse" : ""}>
        🎤
      </span>
      <span>
        {voiceState === "listening"
          ? "Listening..."
          : voiceState === "processing"
            ? "Processing..."
            : "Voice Answer"}
      </span>
    </button>
  );
}

// ── MCQ Question View ─────────────────────────────────────────────────────────
function McqQuestion({
  question,
  questionNumber,
  totalQuestions,
  selectedOption,
  onSelect,
}: {
  question: DomainMCQ;
  questionNumber: number;
  totalQuestions: number;
  selectedOption: number | undefined;
  onSelect: (optIdx: number) => void;
}) {
  const [voiceTranscript, setVoiceTranscript] = useState("");
  const { voiceState, transcript, start, isSupported } = useVoiceAnswer(
    (optIdx, text) => {
      setVoiceTranscript(text);
      onSelect(optIdx);
    },
  );

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-2 flex-wrap">
        <span className="bg-primary/10 text-primary text-xs font-bold px-2.5 py-1 rounded-full">
          MCQ · Q{questionNumber} of {totalQuestions}
        </span>
        <span className="text-xs text-muted-foreground">5 points</span>
        <div className="ml-auto">
          <VoiceButton
            voiceState={voiceState}
            isSupported={isSupported}
            onToggle={() => start(question.options)}
          />
        </div>
      </div>

      {/* Voice transcript bubble */}
      <AnimatePresence>
        {(voiceState === "listening" ||
          voiceState === "processing" ||
          voiceTranscript) && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.97 }}
            className="flex items-start gap-2 bg-primary/10 border border-primary/30 rounded-xl px-3 py-2"
          >
            <span className="text-base shrink-0">
              {voiceState === "listening"
                ? "🎙️"
                : voiceState === "processing"
                  ? "⏳"
                  : "💬"}
            </span>
            <div>
              <div className="text-xs font-semibold text-primary mb-0.5">
                {voiceState === "listening"
                  ? "Listening... speak your answer"
                  : voiceState === "processing"
                    ? "Matching your answer..."
                    : "You said:"}
              </div>
              {(voiceTranscript || transcript) && (
                <div className="text-xs text-foreground italic">
                  "{voiceTranscript || transcript}"
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="bg-card border border-border rounded-2xl p-5 sm:p-6">
        <p className="text-base sm:text-lg text-foreground font-medium leading-relaxed mb-6">
          {question.question}
        </p>
        <div className="space-y-3">
          {question.options.map((opt, oi) => {
            const isSelected = selectedOption === oi;
            return (
              <button
                key={`opt-${oi}`}
                type="button"
                onClick={() => onSelect(oi)}
                className={`w-full text-left px-4 py-3.5 rounded-xl border text-sm transition-all duration-150 flex items-start gap-3 ${
                  isSelected
                    ? "bg-primary/10 border-primary text-foreground font-semibold shadow-sm"
                    : "bg-background border-border text-foreground hover:border-primary/40 hover:bg-primary/5"
                }`}
              >
                <span
                  className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 mt-0.5 ${
                    isSelected
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {String.fromCharCode(65 + oi)}
                </span>
                <span className="leading-relaxed">{opt}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ── Coding Question View ──────────────────────────────────────────────────────
function CodingQuestion({
  question,
  questionNumber,
  totalCoding,
  code,
  onCodeChange,
}: {
  question: DomainCoding;
  questionNumber: number;
  totalCoding: number;
  code: string;
  onCodeChange: (code: string) => void;
}) {
  const [output, setOutput] = useState("");
  const [running, setRunning] = useState(false);

  const handleRun = async () => {
    setRunning(true);
    await new Promise((r) => setTimeout(r, 700));
    const isModified =
      code.trim() !== question.starterCode.trim() && code.trim().length > 20;
    setOutput(
      isModified
        ? `✅ Looks good!\nExpected output: ${question.expectedOutput}`
        : `⚠️ Please implement the solution.\nExpected: ${question.expectedOutput}`,
    );
    setRunning(false);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <span className="bg-secondary/20 text-secondary-foreground text-xs font-bold px-2.5 py-1 rounded-full">
          Coding · P{questionNumber} of {totalCoding}
        </span>
        <span
          className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
            question.difficulty === "easy"
              ? "bg-green-500/15 text-green-600"
              : question.difficulty === "hard"
                ? "bg-red-500/15 text-red-600"
                : "bg-amber-500/15 text-amber-600"
          }`}
        >
          {question.difficulty}
        </span>
        <span className="text-xs text-muted-foreground">10 points</span>
      </div>

      <div className="bg-card border border-border rounded-2xl p-5">
        <p className="text-base text-foreground font-medium leading-relaxed mb-3">
          {question.question}
        </p>
        <p className="text-sm text-muted-foreground mb-3">💡 {question.hint}</p>
        <div className="bg-muted rounded-xl p-3 text-xs">
          <div className="text-muted-foreground font-semibold mb-1">
            Expected Output
          </div>
          <pre className="font-mono text-foreground whitespace-pre-wrap">
            {question.expectedOutput}
          </pre>
        </div>
      </div>

      <div className="rounded-2xl overflow-hidden border border-border">
        <div className="bg-[#0d1117] flex items-center gap-1.5 px-4 py-2.5 border-b border-white/10">
          <div className="w-3 h-3 rounded-full bg-red-500" />
          <div className="w-3 h-3 rounded-full bg-yellow-500" />
          <div className="w-3 h-3 rounded-full bg-green-500" />
          <span className="ml-2 text-xs text-gray-400 font-mono">
            solution.c
          </span>
        </div>
        <div className="flex bg-[#0d1117]">
          <div className="px-3 py-3 text-right select-none font-mono text-xs text-gray-600 bg-[#161b22] min-w-[2.5rem]">
            {code.split("\n").map((_, i) => (
              <div key={`ln-${i + 1}`}>{i + 1}</div>
            ))}
          </div>
          <textarea
            value={code}
            onChange={(e) => onCodeChange(e.target.value)}
            className="flex-1 bg-transparent text-gray-100 font-mono text-sm py-3 pr-3 resize-none outline-none"
            style={{ minHeight: "200px", lineHeight: "1.6" }}
            spellCheck={false}
            data-ocid={`domain_test.code_editor.${questionNumber}`}
          />
        </div>
        <div className="bg-[#0d1117] border-t border-white/10 px-4 py-3 flex items-center gap-3">
          <Button
            size="sm"
            onClick={handleRun}
            disabled={running}
            className="rounded-full bg-green-600 hover:bg-green-700 text-white font-bold text-xs px-4"
            data-ocid={`domain_test.run.${questionNumber}`}
          >
            {running ? "⏳ Checking..." : "▶ Run & Check"}
          </Button>
        </div>
        {output && (
          <div className="bg-[#0d1117] border-t border-white/10 px-4 pb-3">
            <pre className="font-mono text-xs text-gray-300 whitespace-pre-wrap bg-[#161b22] rounded-xl p-3 max-h-32 overflow-y-auto">
              {output}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Results Screen ────────────────────────────────────────────────────────────
function ResultsScreen({
  domain,
  mcqQuestions,
  mcqAnswers,
  codingQuestions,
  codingAttempted,
  timeTaken,
  xpEarned,
  totalScore,
  maxScore,
  correctMcq,
  onRetake,
  onBack,
}: {
  domain: string;
  mcqQuestions: DomainMCQ[];
  mcqAnswers: Record<string, number>;
  codingQuestions: DomainCoding[];
  codingAttempted: Set<number>;
  timeTaken: number;
  xpEarned: number;
  totalScore: number;
  maxScore: number;
  correctMcq: number;
  onRetake: () => void;
  onBack: () => void;
}) {
  const { setUser, user } = useApp();
  const savedRef = useRef(false);
  const refs = useRef({
    xpEarned,
    userXp: user.xp,
    totalScore,
    timeTaken,
    maxScore,
    domain,
    setUser,
  });

  const pct = maxScore > 0 ? Math.round((totalScore / maxScore) * 100) : 0;
  const passed = pct >= 60;
  const displayName = DOMAIN_DISPLAY_NAMES[domain] ?? domain;
  const meta = DOMAIN_META[domain] ?? { emoji: "📝", color: "#4f6ef7" };

  const gradeInfo =
    pct >= 80
      ? {
          label: "Excellent!",
          color: "text-green-500",
          bg: "bg-green-500/15",
          emoji: "🏆",
        }
      : pct >= 60
        ? {
            label: "Good Job!",
            color: "text-blue-500",
            bg: "bg-blue-500/15",
            emoji: "🌟",
          }
        : pct >= 40
          ? {
              label: "Keep Practicing",
              color: "text-amber-500",
              bg: "bg-amber-500/15",
              emoji: "💪",
            }
          : {
              label: "Needs Improvement",
              color: "text-red-500",
              bg: "bg-red-500/15",
              emoji: "📚",
            };

  useEffect(() => {
    if (savedRef.current) return;
    savedRef.current = true;
    const r = refs.current;
    const key = "cc_domain_test_history";
    const prev: TestHistoryEntry[] = JSON.parse(
      localStorage.getItem(key) ?? "[]",
    );
    prev.push({
      date: new Date().toISOString(),
      score: r.totalScore,
      maxScore: r.maxScore,
      timeTaken: r.timeTaken,
      domain: r.domain,
    });
    localStorage.setItem(key, JSON.stringify(prev));
    r.setUser({ xp: r.userXp + r.xpEarned });
  }, []);

  return (
    <div className="h-[100dvh] bg-background flex flex-col overflow-hidden">
      {passed && (
        <div className="pointer-events-none fixed inset-0 overflow-hidden z-50">
          {Array.from({ length: 20 }, (_, i) => (
            <ConfettiPiece key={i} index={i} />
          ))}
        </div>
      )}

      <header className="bg-card border-b border-border px-4 py-3 flex items-center gap-3 shrink-0 shadow-subtle">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center text-xl"
          style={{ background: `${meta.color}20` }}
        >
          {meta.emoji}
        </div>
        <div className="flex-1 min-w-0">
          <h1 className="font-bold text-foreground text-sm truncate">
            {displayName} — Test Results
          </h1>
          <p className="text-xs text-muted-foreground">
            Completed in {formatTime(timeTaken)}
          </p>
        </div>
        <div
          className={`px-3 py-1.5 rounded-full text-xs font-bold ${passed ? "bg-green-500/15 text-green-600" : "bg-red-500/15 text-red-600"}`}
        >
          {passed ? "✓ Passed" : "✗ Failed"}
        </div>
      </header>

      <div className="flex-1 overflow-y-auto">
        <div className="max-w-2xl mx-auto px-4 py-5 space-y-4 pb-24">
          {/* Score Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-card border border-border rounded-2xl p-6 text-center"
            data-ocid="domain_test.results_card"
          >
            <div
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-full mb-4 ${gradeInfo.bg}`}
            >
              <span className="text-xl">{gradeInfo.emoji}</span>
              <span className={`font-bold text-sm ${gradeInfo.color}`}>
                {gradeInfo.label}
              </span>
            </div>
            <div className="text-6xl font-extrabold text-foreground mb-1">
              {pct}%
            </div>
            <div className="text-muted-foreground text-sm mb-4">
              {totalScore} out of {maxScore} points
            </div>
            <Progress value={pct} className="h-3 mb-5" />
            <div className="grid grid-cols-3 gap-3">
              {[
                {
                  label: "MCQ Score",
                  value: `${correctMcq}/${mcqQuestions.length}`,
                  sub: `${correctMcq * 5} pts`,
                },
                {
                  label: "Coding",
                  value: `${codingAttempted.size}/${codingQuestions.length}`,
                  sub: `${codingAttempted.size * 10} pts`,
                },
                {
                  label: "XP Earned",
                  value: `+${xpEarned}`,
                  sub: "experience",
                },
              ].map((stat) => (
                <div key={stat.label} className="bg-muted rounded-xl p-3">
                  <div className="text-xs text-muted-foreground mb-1">
                    {stat.label}
                  </div>
                  <div className="font-extrabold text-foreground text-lg">
                    {stat.value}
                  </div>
                  <div className="text-xs text-primary">{stat.sub}</div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* MCQ Breakdown */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-card border border-border rounded-2xl p-5"
          >
            <h3 className="font-bold text-foreground text-sm mb-3">
              📋 Review Answers
            </h3>
            <p className="text-xs text-muted-foreground mb-3">
              Full explanations are now available — outside test mode you'd also
              have hint levels to help.
            </p>
            <div className="space-y-3">
              {mcqQuestions.map((q, qi) => {
                const userAns = mcqAnswers[q.id];
                const correct = userAns === q.correctIndex;
                const skipped = userAns === undefined;
                return (
                  <div
                    key={q.id}
                    className={`rounded-xl border p-3 text-xs ${correct ? "border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/10" : "border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/10"}`}
                  >
                    <div className="flex items-start gap-2 mb-2">
                      <span
                        className={`w-5 h-5 rounded-full flex items-center justify-center text-white shrink-0 font-bold text-[10px] ${skipped ? "bg-muted-foreground" : correct ? "bg-green-500" : "bg-red-500"}`}
                      >
                        {skipped ? "–" : correct ? "✓" : "✗"}
                      </span>
                      <p className="text-foreground font-medium leading-snug flex-1">
                        Q{qi + 1}: {q.question}
                      </p>
                      <span
                        className={`font-bold shrink-0 ${correct ? "text-green-600 dark:text-green-400" : "text-muted-foreground"}`}
                      >
                        {correct ? "+5" : "0"}
                      </span>
                    </div>
                    {!skipped && !correct && (
                      <p className="text-red-600 dark:text-red-400 mb-1 ml-7">
                        Your answer: {q.options[userAns]}
                      </p>
                    )}
                    <p
                      className={`ml-7 mb-1 ${correct ? "text-green-700 dark:text-green-300" : "text-green-700 dark:text-green-300"}`}
                    >
                      ✓ Correct: {q.options[q.correctIndex]}
                    </p>
                    {q.explanation && (
                      <div className="ml-7 mt-1.5 bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 rounded-lg px-2.5 py-2">
                        <p className="text-[10px] font-bold text-blue-700 dark:text-blue-300 mb-0.5">
                          💡 Explanation
                        </p>
                        <p className="text-[11px] text-blue-700 dark:text-blue-300 leading-relaxed">
                          {q.explanation}
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </motion.div>

          {/* Actions */}
          <div className="grid grid-cols-2 gap-3">
            <Button
              variant="outline"
              onClick={onBack}
              className="rounded-2xl font-bold"
              data-ocid="domain_test.back_to_studio"
            >
              ← Back
            </Button>
            <Button
              onClick={onRetake}
              className="rounded-2xl font-bold"
              data-ocid="domain_test.retake_button"
            >
              🔁 Try Again
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Voice Permission Banner ───────────────────────────────────────────────────
function VoicePermissionBanner({ onDismiss }: { onDismiss: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      className="mx-3 sm:mx-5 mt-3 bg-primary/10 border border-primary/30 rounded-2xl px-4 py-3 flex items-center gap-3"
      data-ocid="domain_test.voice_permission_banner"
    >
      <span className="text-2xl shrink-0">🎤</span>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-bold text-foreground">
          Enable voice answers?
        </p>
        <p className="text-xs text-muted-foreground">
          Speak your answers during MCQs. Tap the 🎤 button on any question.
        </p>
      </div>
      <button
        type="button"
        onClick={onDismiss}
        className="text-xs font-semibold text-primary hover:text-primary/80 transition-colors shrink-0 px-2 py-1 rounded-lg hover:bg-primary/10"
        data-ocid="domain_test.voice_permission_dismiss"
      >
        Got it!
      </button>
    </motion.div>
  );
}

// ── Main Component ─────────────────────────────────────────────────────────────
export default function COnlineTestPage({
  onBack,
  domain: initialDomain = null,
}: {
  onBack: () => void;
  domain?: string | null;
}) {
  type Phase = "setup" | "test" | "results";
  const [phase, setPhase] = useState<Phase>("setup");
  const [activeDomain, setActiveDomain] = useState<string | null>(
    initialDomain,
  );
  const [mcqQuestions, setMcqQuestions] = useState<DomainMCQ[]>([]);
  const [codingQuestions, setCodingQuestions] = useState<DomainCoding[]>([]);
  const [totalSeconds, setTotalSeconds] = useState(0);
  const [remaining, setRemaining] = useState(0);
  const [mcqAnswers, setMcqAnswers] = useState<Record<string, number>>({});
  const [progCodes, setProgCodes] = useState<Record<string, string>>({});
  const [currentIndex, setCurrentIndex] = useState(0);
  const [timeTaken, setTimeTaken] = useState(0);
  const [history, setHistory] = useState<TestHistoryEntry[]>([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showVoiceBanner, setShowVoiceBanner] = useState(false);
  const [showFiveMinWarning, setShowFiveMinWarning] = useState(false);
  const fiveMinShownRef = useRef(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem("cc_domain_test_history");
    if (saved) setHistory(JSON.parse(saved));
    // Show voice banner once
    const dismissed = localStorage.getItem("cc_voice_banner_dismissed");
    if (!dismissed) setShowVoiceBanner(true);
  }, []);

  const dismissVoiceBanner = () => {
    setShowVoiceBanner(false);
    localStorage.setItem("cc_voice_banner_dismissed", "1");
  };

  const clearTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  // Fixed 60-minute (3600s) timer
  const handleStart = (minutes: number, domain: string) => {
    const { mcqs, coding } = getDomainQuestions(domain);
    // Fresh shuffle on every attempt
    const selectedMcqs = shuffle([...mcqs]).slice(0, Math.min(20, mcqs.length));
    const selectedCoding = shuffle([...coding]).slice(
      0,
      Math.min(5, coding.length),
    );
    setActiveDomain(domain);
    setMcqQuestions(selectedMcqs);
    setCodingQuestions(selectedCoding);
    // Force 1-hour (3600s) regardless of minutes param
    const secs = Math.max(minutes * 60, 3600);
    setTotalSeconds(secs);
    setRemaining(secs);
    setMcqAnswers({});
    setProgCodes(
      Object.fromEntries(selectedCoding.map((q) => [q.id, q.starterCode])),
    );
    setCurrentIndex(0);
    fiveMinShownRef.current = false;
    setShowFiveMinWarning(false);
    setPhase("test");
    timerRef.current = setInterval(() => {
      setRemaining((prev) => {
        // Show 5-minute warning
        if (prev === 300 && !fiveMinShownRef.current) {
          fiveMinShownRef.current = true;
          setShowFiveMinWarning(true);
          setTimeout(() => setShowFiveMinWarning(false), 8000);
        }
        if (prev <= 1) {
          clearTimer();
          setTimeTaken(secs);
          setPhase("results");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleSubmit = () => {
    clearTimer();
    setTimeTaken(totalSeconds - remaining);
    setPhase("results");
  };

  const handleRetake = () => {
    clearTimer();
    setPhase("setup");
    fiveMinShownRef.current = false;
    setShowFiveMinWarning(false);
    const saved = localStorage.getItem("cc_domain_test_history");
    if (saved) setHistory(JSON.parse(saved));
  };

  useEffect(
    () => () => {
      if (timerRef.current) clearInterval(timerRef.current);
    },
    [],
  );

  // Derived state
  const correctMcq = mcqQuestions.filter(
    (q) => mcqAnswers[q.id] === q.correctIndex,
  ).length;
  const codingAttempted = new Set(
    codingQuestions
      .map((q, i) => ({ q, i }))
      .filter(({ q }) => {
        const code = progCodes[q.id] ?? "";
        return code.trim().length > 0 && code.trim() !== q.starterCode.trim();
      })
      .map(({ i }) => i),
  );
  const totalScore = correctMcq * 5 + codingAttempted.size * 10;
  const maxScore = mcqQuestions.length * 5 + codingQuestions.length * 10;
  const xpEarned = correctMcq * 5 + codingAttempted.size * 15;

  const mcqAnswersForGrid: Record<string, string[]> = {};
  mcqQuestions.forEach((q, i) => {
    mcqAnswersForGrid[`q${i}`] =
      mcqAnswers[q.id] !== undefined ? [String(mcqAnswers[q.id])] : [];
  });

  const totalQuestions = mcqQuestions.length + codingQuestions.length;
  const isMcq = currentIndex < mcqQuestions.length;
  const codingIndex = currentIndex - mcqQuestions.length;
  const answeredCount = Object.values(mcqAnswers).length + codingAttempted.size;
  const progressPct = Math.round(
    (answeredCount / Math.max(1, totalQuestions)) * 100,
  );
  const isLowTime = remaining < 300;

  const meta = activeDomain
    ? (DOMAIN_META[activeDomain] ?? { emoji: "📝", color: "#4f6ef7" })
    : { emoji: "📝", color: "#4f6ef7" };
  const displayName = activeDomain
    ? (DOMAIN_DISPLAY_NAMES[activeDomain] ?? activeDomain)
    : "Online Test";

  if (phase === "setup") {
    return (
      <SetupScreen
        domain={activeDomain}
        onStart={handleStart}
        onBack={onBack}
        onSelectDomain={setActiveDomain}
        history={history}
      />
    );
  }

  if (phase === "results" && activeDomain) {
    return (
      <ResultsScreen
        domain={activeDomain}
        mcqQuestions={mcqQuestions}
        mcqAnswers={mcqAnswers}
        codingQuestions={codingQuestions}
        codingAttempted={codingAttempted}
        timeTaken={timeTaken}
        xpEarned={xpEarned}
        totalScore={totalScore}
        maxScore={maxScore}
        correctMcq={correctMcq}
        onRetake={handleRetake}
        onBack={onBack}
      />
    );
  }

  // ── Active Test Layout ────────────────────────────────────────────────────
  return (
    <div className="h-[100dvh] bg-background flex flex-col overflow-hidden">
      {/* ── 5-Minute Warning Overlay ── */}
      <AnimatePresence>
        {showFiveMinWarning && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: -20 }}
            className="fixed top-20 left-1/2 -translate-x-1/2 z-[100] bg-red-500 text-white rounded-2xl px-6 py-4 shadow-2xl flex items-center gap-3 max-w-sm w-[calc(100%-2rem)]"
            data-ocid="domain_test.five_min_warning"
          >
            <span className="text-2xl animate-bounce">⚠️</span>
            <div>
              <p className="font-bold text-sm">5 minutes left!</p>
              <p className="text-xs text-white/80">
                Wrap up your answers and submit soon.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setShowFiveMinWarning(false)}
              className="ml-auto text-white/80 hover:text-white text-lg leading-none"
              aria-label="Close warning"
            >
              ✕
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Top Bar ── */}
      <header className="bg-card border-b border-border shrink-0 shadow-subtle">
        <div className="flex items-center gap-2 px-3 sm:px-4 py-2.5">
          {/* Left: domain name */}
          <div className="flex items-center gap-2 min-w-0 flex-1">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center text-base shrink-0"
              style={{ background: `${meta.color}20` }}
            >
              {meta.emoji}
            </div>
            <div className="min-w-0">
              <div className="font-bold text-foreground text-xs sm:text-sm leading-tight truncate">
                {displayName}
              </div>
              <div className="text-[10px] text-muted-foreground hidden sm:block">
                Q{currentIndex + 1} of {totalQuestions}
              </div>
            </div>
            {/* Test mode badge */}
            <div className="hidden md:flex items-center gap-1 text-[10px] font-bold px-2.5 py-1 rounded-full bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20 shrink-0 ml-2">
              🔒 Test Mode — No hints
            </div>
          </div>

          {/* Center: timer */}
          <div
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full font-mono font-bold text-sm border shrink-0 ${
              isLowTime
                ? "bg-red-500/15 border-red-500/40 text-red-500 animate-pulse"
                : "bg-muted border-border text-foreground"
            }`}
          >
            ⏱ {formatTime(remaining)}
            {isLowTime && <span className="text-[10px] font-normal">LOW</span>}
          </div>

          {/* Right: submit + sidebar toggle */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden w-9 h-9 rounded-xl bg-muted flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Question navigator"
              data-ocid="domain_test.sidebar_toggle"
            >
              ☰
            </button>
            <Button
              onClick={handleSubmit}
              className="rounded-xl font-bold text-xs sm:text-sm px-3 sm:px-4 h-9"
              data-ocid="domain_test.submit_button"
            >
              Submit ✓
            </Button>
          </div>
        </div>

        {/* Progress bar */}
        <div className="px-3 sm:px-4 pb-2">
          <div className="flex items-center justify-between text-[10px] text-muted-foreground mb-1">
            <span>
              {answeredCount}/{totalQuestions} answered
            </span>
            <span>{progressPct}% complete</span>
          </div>
          <Progress value={progressPct} className="h-1.5" />
        </div>
      </header>

      {/* Voice permission banner (shown once) */}
      <AnimatePresence>
        {showVoiceBanner && phase === "test" && (
          <VoicePermissionBanner onDismiss={dismissVoiceBanner} />
        )}
      </AnimatePresence>

      {/* ── Body: Sidebar + Content ── */}
      <div className="flex-1 flex min-h-0 overflow-hidden">
        {/* Sidebar — desktop always visible, mobile drawer */}
        <AnimatePresence>
          {sidebarOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-40 lg:hidden"
              onClick={() => setSidebarOpen(false)}
            />
          )}
        </AnimatePresence>

        <aside
          className={`
            bg-card border-r border-border overflow-y-auto shrink-0 p-4 
            hidden lg:block w-64
          `}
        >
          <h3 className="font-bold text-foreground text-sm mb-4">
            Question Navigator
          </h3>
          <QuestionGrid
            totalMcq={mcqQuestions.length}
            totalCoding={codingQuestions.length}
            currentIndex={currentIndex}
            mcqAnswers={mcqAnswersForGrid}
            codingAttempted={codingAttempted}
            onJump={(i) => setCurrentIndex(i)}
          />
        </aside>

        {/* Mobile drawer */}
        <AnimatePresence>
          {sidebarOpen && (
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 left-0 h-full w-64 bg-card border-r border-border overflow-y-auto z-50 p-4 pt-16"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-foreground text-sm">
                  Question Navigator
                </h3>
                <button
                  type="button"
                  onClick={() => setSidebarOpen(false)}
                  className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center text-muted-foreground"
                  aria-label="Close navigator"
                >
                  ✕
                </button>
              </div>
              <QuestionGrid
                totalMcq={mcqQuestions.length}
                totalCoding={codingQuestions.length}
                currentIndex={currentIndex}
                mcqAnswers={mcqAnswersForGrid}
                codingAttempted={codingAttempted}
                onJump={(i) => {
                  setCurrentIndex(i);
                  setSidebarOpen(false);
                }}
              />
            </motion.aside>
          )}
        </AnimatePresence>

        {/* Main content */}
        <main className="flex-1 overflow-y-auto min-w-0">
          <div className="max-w-2xl mx-auto px-3 sm:px-5 py-5 pb-32">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
              >
                {isMcq ? (
                  <McqQuestion
                    question={mcqQuestions[currentIndex]}
                    questionNumber={currentIndex + 1}
                    totalQuestions={totalQuestions}
                    selectedOption={mcqAnswers[mcqQuestions[currentIndex]?.id]}
                    onSelect={(optIdx) => {
                      const q = mcqQuestions[currentIndex];
                      if (q)
                        setMcqAnswers((prev) => ({ ...prev, [q.id]: optIdx }));
                    }}
                  />
                ) : (
                  <CodingQuestion
                    question={codingQuestions[codingIndex]}
                    questionNumber={codingIndex + 1}
                    totalCoding={codingQuestions.length}
                    code={progCodes[codingQuestions[codingIndex]?.id] ?? ""}
                    onCodeChange={(code) => {
                      const q = codingQuestions[codingIndex];
                      if (q)
                        setProgCodes((prev) => ({ ...prev, [q.id]: code }));
                    }}
                  />
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </main>
      </div>

      {/* ── Footer: Prev / Next — fixed above nav bar ── */}
      <footer
        className="bg-card border-t border-border px-3 sm:px-5 py-3 shrink-0 flex items-center gap-3"
        style={{
          paddingBottom: "calc(0.75rem + env(safe-area-inset-bottom, 0px))",
        }}
        data-ocid="domain_test.nav_footer"
      >
        <Button
          variant="outline"
          onClick={() => setCurrentIndex((p) => Math.max(0, p - 1))}
          disabled={currentIndex === 0}
          className="rounded-xl font-bold px-4 sm:px-5"
          data-ocid="domain_test.prev_button"
        >
          ← Prev
        </Button>

        <div className="flex-1 text-center text-xs sm:text-sm text-muted-foreground font-medium">
          Question{" "}
          <span className="font-bold text-foreground">{currentIndex + 1}</span>{" "}
          of <span className="font-bold text-foreground">{totalQuestions}</span>
        </div>

        {currentIndex < totalQuestions - 1 ? (
          <Button
            onClick={() =>
              setCurrentIndex((p) => Math.min(totalQuestions - 1, p + 1))
            }
            className="rounded-xl font-bold px-4 sm:px-5"
            data-ocid="domain_test.next_button"
          >
            Next →
          </Button>
        ) : (
          <Button
            onClick={handleSubmit}
            className="rounded-xl font-bold px-4 sm:px-5 bg-green-600 hover:bg-green-700 text-white"
            data-ocid="domain_test.finish_button"
          >
            Finish ✓
          </Button>
        )}
      </footer>
    </div>
  );
}
