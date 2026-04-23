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

// ── Types ──────────────────────────────────────────────────────────────────────
interface TestHistoryEntry {
  date: string;
  score: number;
  maxScore: number;
  timeTaken: number;
  domain: string;
}

// ── Helpers ───────────────────────────────────────────────────────────────────
function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
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

const DOMAIN_META: Record<string, { emoji: string }> = {
  ProgrammingInC: { emoji: "🔧" },
  Frontend: { emoji: "🌐" },
  Python: { emoji: "🐍" },
  Backend: { emoji: "⚙️" },
  FullStack: { emoji: "🏗️" },
  DataScience: { emoji: "📊" },
  ML: { emoji: "🤖" },
  DevOps: { emoji: "🚀" },
  Android: { emoji: "📱" },
  iOS: { emoji: "🍎" },
  Cybersecurity: { emoji: "🔐" },
  Blockchain: { emoji: "⛓️" },
  Cloud: { emoji: "☁️" },
  AIML: { emoji: "🧠" },
  GameDev: { emoji: "🎮" },
  UIUXDesign: { emoji: "🎨" },
};

const ALL_DOMAINS = Object.keys(DOMAIN_DISPLAY_NAMES);

// ── Sub-components ────────────────────────────────────────────────────────────
function TimerBadge({ remaining }: { remaining: number }) {
  const isLow = remaining < 300;
  return (
    <div
      className={`flex items-center gap-2 px-3 py-1.5 rounded-full font-mono font-bold text-sm border ${
        isLow
          ? "bg-red-500/10 border-red-400 text-red-400 animate-pulse"
          : "bg-primary/10 border-primary/30 text-primary"
      }`}
    >
      ⏱ {formatTime(remaining)}
      {isLow && <span className="text-xs">LOW</span>}
    </div>
  );
}

// ── Domain Selector ───────────────────────────────────────────────────────────
function DomainSelector({ onSelect }: { onSelect: (domain: string) => void }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
      {ALL_DOMAINS.map((d) => {
        const meta = DOMAIN_META[d] ?? { emoji: "📝" };
        const { mcqs, coding } = getDomainQuestions(d);
        return (
          <button
            key={d}
            type="button"
            onClick={() => onSelect(d)}
            className="bg-card border border-border rounded-2xl p-3 text-left hover:shadow-md hover:border-primary/50 transition-all"
            data-ocid={`domain_test.select.${d.toLowerCase()}`}
          >
            <div className="text-xl mb-1">{meta.emoji}</div>
            <div className="font-bold text-foreground text-xs leading-tight mb-0.5 truncate">
              {DOMAIN_DISPLAY_NAMES[d] ?? d}
            </div>
            <div className="text-[10px] text-muted-foreground">
              {mcqs.length} MCQ · {coding.length} Code
            </div>
          </button>
        );
      })}
    </div>
  );
}

// ── Setup Screen ──────────────────────────────────────────────────────────────
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
  const [selected, setSelected] = useState(60);
  const [pendingDomain, setPendingDomain] = useState<string | null>(domain);
  const meta = pendingDomain
    ? (DOMAIN_META[pendingDomain] ?? { emoji: "📝" })
    : null;
  const displayName = pendingDomain
    ? (DOMAIN_DISPLAY_NAMES[pendingDomain] ?? pendingDomain)
    : null;

  return (
    <div className="h-[100dvh] bg-background flex flex-col overflow-hidden">
      <header className="bg-card border-b border-border px-3 sm:px-4 py-2.5 sm:py-3 flex items-center gap-2 sm:gap-3 shrink-0">
        <button
          type="button"
          onClick={onBack}
          className="w-9 h-9 rounded-xl flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors shrink-0"
          data-ocid="domain_test.back_button"
          aria-label="Back"
        >
          ←
        </button>
        <div>
          <h1 className="font-extrabold text-foreground text-sm sm:text-base leading-tight">
            {pendingDomain
              ? `${meta?.emoji} ${displayName} Test`
              : "Online Tests"}
          </h1>
          <p className="text-xs text-muted-foreground hidden sm:block">
            Select a domain and start your timed assessment
          </p>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto">
        <div className="max-w-xl mx-auto px-3 sm:px-4 py-4 space-y-4 pb-28">
          {!pendingDomain ? (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-3"
            >
              <h2 className="font-extrabold text-foreground text-base">
                📚 Choose a Domain to Test
              </h2>
              <p className="text-xs text-muted-foreground">
                Each domain test has up to 20 MCQs + 5 coding problems, randomly
                selected each attempt.
              </p>
              <DomainSelector
                onSelect={(d) => {
                  setPendingDomain(d);
                  onSelectDomain(d);
                }}
              />
            </motion.div>
          ) : (
            <>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-card border border-border rounded-2xl p-5"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-2xl">
                    {meta?.emoji}
                  </div>
                  <div>
                    <h2 className="font-extrabold text-foreground text-lg">
                      {displayName}
                    </h2>
                    <p className="text-xs text-muted-foreground">
                      Test your knowledge with MCQs and coding challenges
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
                          value: `${mcqCount} MCQ Questions`,
                        },
                        {
                          icon: "💻",
                          label: "Section B",
                          value: `${codeCount} Coding Problems`,
                        },
                        {
                          icon: "⭐",
                          label: "Max Score",
                          value: `${mcqCount * 5 + codeCount * 10} points`,
                        },
                        {
                          icon: "🎯",
                          label: "XP Reward",
                          value: "Up to 150 XP",
                        },
                      ].map((item) => (
                        <div
                          key={item.label}
                          className="bg-muted rounded-xl p-3 flex items-center gap-2"
                        >
                          <span className="text-lg">{item.icon}</span>
                          <div>
                            <div className="text-xs text-muted-foreground">
                              {item.label}
                            </div>
                            <div className="text-xs font-bold text-foreground">
                              {item.value}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  );
                })()}

                <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-3 text-xs text-yellow-400">
                  ⚠️ Once the test starts, the back button is disabled. Questions
                  are randomly selected each attempt.
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

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-card border border-border rounded-2xl p-5"
              >
                <h3 className="font-bold text-foreground mb-3">
                  ⏱ Select Time Limit
                </h3>
                <div className="grid grid-cols-3 gap-3">
                  {[30, 60, 90].map((min) => (
                    <button
                      key={min}
                      type="button"
                      onClick={() => setSelected(min)}
                      className={`py-4 rounded-xl font-bold text-sm border transition-all ${
                        selected === min
                          ? "bg-primary text-primary-foreground border-primary shadow-lg scale-105"
                          : "bg-muted text-muted-foreground border-border hover:border-primary/50"
                      }`}
                    >
                      {min} min
                    </button>
                  ))}
                </div>
              </motion.div>

              {history.filter((h) => h.domain === pendingDomain).length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="bg-card border border-border rounded-2xl p-5"
                >
                  <h3 className="font-bold text-foreground mb-3">
                    📊 Past Results
                  </h3>
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {[...history]
                      .filter((h) => h.domain === pendingDomain)
                      .reverse()
                      .slice(0, 5)
                      .map((h, i) => (
                        <div
                          key={`history-${i}-${h.date}`}
                          className="flex items-center justify-between bg-muted rounded-xl px-3 py-2 text-sm"
                        >
                          <span className="text-muted-foreground text-xs">
                            {new Date(h.date).toLocaleDateString()}
                          </span>
                          <span className="font-bold text-foreground">
                            {h.score}/{h.maxScore}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {formatTime(h.timeTaken)}
                          </span>
                        </div>
                      ))}
                  </div>
                </motion.div>
              )}

              <Button
                onClick={() => onStart(selected, pendingDomain)}
                className="w-full h-12 rounded-2xl font-extrabold text-base bg-primary text-primary-foreground shadow-lg"
                data-ocid="domain_test.start_button"
              >
                🚀 Start {displayName} Test ({selected} min)
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// ── MCQ Section ───────────────────────────────────────────────────────────────
function McqSection({
  questions,
  answers,
  onAnswer,
}: {
  questions: DomainMCQ[];
  answers: Record<string, number>;
  onAnswer: (qId: string, optIdx: number) => void;
}) {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 bg-primary/10 rounded-xl flex items-center justify-center text-sm font-extrabold text-primary">
          A
        </div>
        <div>
          <h2 className="font-extrabold text-foreground text-base">
            Section A — Multiple Choice
          </h2>
          <p className="text-xs text-muted-foreground">
            {questions.length} questions · 5 points each
          </p>
        </div>
      </div>

      {questions.map((q, qi) => (
        <motion.div
          key={q.id}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: qi * 0.03 }}
          className="bg-card border border-border rounded-2xl p-4"
          data-ocid={`domain_test.q.${qi + 1}`}
        >
          <div className="flex items-start gap-3 mb-3">
            <span className="w-7 h-7 rounded-lg bg-primary/10 text-primary text-xs font-extrabold flex items-center justify-center shrink-0 mt-0.5">
              {qi + 1}
            </span>
            <p className="text-sm text-foreground font-medium leading-relaxed">
              {q.question}
            </p>
          </div>
          <div className="grid grid-cols-1 gap-2 ml-10">
            {q.options.map((opt, oi) => {
              const isSelected = answers[q.id] === oi;
              return (
                <button
                  key={`q${q.id}-o${oi}`}
                  type="button"
                  onClick={() => onAnswer(q.id, oi)}
                  className={`w-full text-left px-3 py-2.5 rounded-xl text-sm border transition-all ${
                    isSelected
                      ? "bg-primary/10 border-primary text-primary font-semibold"
                      : "bg-muted border-border text-muted-foreground hover:border-primary/40 hover:text-foreground"
                  }`}
                >
                  <span className="font-mono text-xs mr-2 opacity-60">
                    {String.fromCharCode(65 + oi)}.
                  </span>
                  {opt}
                </button>
              );
            })}
          </div>
        </motion.div>
      ))}
    </div>
  );
}

// ── Programming Section ───────────────────────────────────────────────────────
function ProgramSection({
  questions,
  codes,
  onCodeChange,
}: {
  questions: DomainCoding[];
  codes: Record<string, string>;
  onCodeChange: (qId: string, code: string) => void;
}) {
  const [outputs, setOutputs] = useState<Record<string, string>>({});
  const [running, setRunning] = useState<Record<string, boolean>>({});

  const handleRun = async (q: DomainCoding) => {
    setRunning((r) => ({ ...r, [q.id]: true }));
    await new Promise((resolve) => setTimeout(resolve, 800));
    const code = codes[q.id] ?? q.starterCode;
    const isModified =
      code.trim() !== q.starterCode.trim() && code.trim().length > 20;
    setOutputs((o) => ({
      ...o,
      [q.id]: isModified
        ? `✅ Code looks good!\nExpected: ${q.expectedOutput}`
        : `⚠️ Please implement the solution first.\nExpected: ${q.expectedOutput}`,
    }));
    setRunning((r) => ({ ...r, [q.id]: false }));
  };

  if (questions.length === 0) return null;

  return (
    <div className="space-y-6 mt-8">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 bg-secondary/20 rounded-xl flex items-center justify-center text-sm font-extrabold text-secondary">
          B
        </div>
        <div>
          <h2 className="font-extrabold text-foreground text-base">
            Section B — Coding
          </h2>
          <p className="text-xs text-muted-foreground">
            {questions.length} problems · up to 10 points each
          </p>
        </div>
      </div>

      {questions.map((q, qi) => {
        const code = codes[q.id] ?? q.starterCode;
        return (
          <motion.div
            key={q.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: qi * 0.08 }}
            className="bg-card border border-border rounded-2xl overflow-hidden"
            data-ocid={`domain_test.prog.${qi + 1}`}
          >
            <div className="px-4 pt-4 pb-3 border-b border-border">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-extrabold text-secondary bg-secondary/10 px-2 py-0.5 rounded-full">
                  P{qi + 1}
                </span>
                <span
                  className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                    q.difficulty === "easy"
                      ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                      : q.difficulty === "hard"
                        ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                        : "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
                  }`}
                >
                  {q.difficulty}
                </span>
              </div>
              <p className="text-sm font-medium text-foreground leading-relaxed mt-1">
                {q.question}
              </p>
              <p className="text-xs text-muted-foreground mt-1">💡 {q.hint}</p>
            </div>

            <div className="px-3 sm:px-4 py-3 bg-muted/30 border-b border-border text-xs">
              <div className="text-muted-foreground font-semibold mb-1">
                Expected Output
              </div>
              <pre className="font-mono text-foreground bg-background/50 rounded-lg px-2 py-1.5 whitespace-pre-wrap">
                {q.expectedOutput}
              </pre>
            </div>

            <div className="bg-[#0d1117]">
              <div className="flex items-center gap-2 px-4 py-2 border-b border-white/10">
                <div className="w-2.5 h-2.5 rounded-full bg-red-500" />
                <div className="w-2.5 h-2.5 rounded-full bg-yellow-500" />
                <div className="w-2.5 h-2.5 rounded-full bg-green-500" />
              </div>
              <div className="flex">
                <div className="px-2.5 py-3 text-right select-none font-mono text-xs text-gray-600 bg-[#161b22] min-w-[2.5rem]">
                  {code.split("\n").map((_, i) => (
                    <div key={`ln-p${q.id}-${i + 1}`}>{i + 1}</div>
                  ))}
                </div>
                <textarea
                  value={code}
                  onChange={(e) => onCodeChange(q.id, e.target.value)}
                  className="flex-1 bg-transparent text-gray-100 font-mono text-xs py-3 pr-3 resize-none outline-none"
                  style={{ minHeight: "180px", lineHeight: "1.5" }}
                  spellCheck={false}
                  data-ocid={`domain_test.code_editor.${qi + 1}`}
                />
              </div>
            </div>

            <div className="bg-[#0d1117] border-t border-white/10 px-4 py-3 flex items-center gap-3">
              <Button
                size="sm"
                onClick={() => handleRun(q)}
                disabled={running[q.id]}
                className="rounded-full bg-green-500 hover:bg-green-600 text-white font-bold text-xs"
                data-ocid={`domain_test.run.${qi + 1}`}
              >
                {running[q.id] ? "⏳ Checking..." : "▶ Check Code"}
              </Button>
            </div>
            {outputs[q.id] && (
              <div className="bg-[#0d1117] border-t border-white/10 px-4 pb-3">
                <pre className="font-mono text-xs text-gray-300 whitespace-pre-wrap bg-[#161b22] rounded-xl p-3 max-h-32 overflow-y-auto">
                  {outputs[q.id]}
                </pre>
              </div>
            )}
          </motion.div>
        );
      })}
    </div>
  );
}

// ── Results Screen ────────────────────────────────────────────────────────────
function ResultsScreen({
  domain,
  mcqQuestions,
  mcqAnswers,
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
  const xpRef = useRef(xpEarned);
  const userXpRef = useRef(user.xp);
  const totalScoreRef = useRef(totalScore);
  const timeTakenRef = useRef(timeTaken);
  const maxScoreRef = useRef(maxScore);
  const setUserRef = useRef(setUser);
  const domainRef = useRef(domain);

  const pct = Math.round((totalScore / maxScore) * 100);
  const displayName = DOMAIN_DISPLAY_NAMES[domain] ?? domain;

  const gradeInfo =
    pct >= 80
      ? { label: "Excellent!", color: "text-green-400", emoji: "🏆" }
      : pct >= 60
        ? { label: "Good Job!", color: "text-blue-400", emoji: "🌟" }
        : pct >= 40
          ? { label: "Keep Practicing", color: "text-yellow-400", emoji: "💪" }
          : { label: "Needs Improvement", color: "text-red-400", emoji: "📚" };

  useEffect(() => {
    if (savedRef.current) return;
    savedRef.current = true;
    const key = "cc_domain_test_history";
    const prev: TestHistoryEntry[] = JSON.parse(
      localStorage.getItem(key) ?? "[]",
    );
    prev.push({
      date: new Date().toISOString(),
      score: totalScoreRef.current,
      maxScore: maxScoreRef.current,
      timeTaken: timeTakenRef.current,
      domain: domainRef.current,
    });
    localStorage.setItem(key, JSON.stringify(prev));
    setUserRef.current({ xp: userXpRef.current + xpRef.current });
  }, []);

  return (
    <div className="flex-1 min-h-0 bg-background flex flex-col overflow-hidden">
      <header className="bg-card border-b border-border px-4 py-3 shrink-0 flex items-center gap-3">
        <span className="text-2xl">📊</span>
        <div>
          <h1 className="font-extrabold text-foreground text-base">
            Test Results
          </h1>
          <p className="text-xs text-muted-foreground">{displayName}</p>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto">
        <div className="max-w-xl mx-auto px-4 py-6 space-y-5 pb-28">
          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-card border border-border rounded-2xl p-6 text-center"
          >
            <div className="text-4xl mb-2">{gradeInfo.emoji}</div>
            <div className={`text-2xl font-extrabold mb-1 ${gradeInfo.color}`}>
              {gradeInfo.label}
            </div>
            <div className="text-5xl font-extrabold text-foreground mb-1">
              {totalScore}
              <span className="text-2xl text-muted-foreground">
                /{maxScore}
              </span>
            </div>
            <Progress value={pct} className="h-3 my-3" />
            <div className="grid grid-cols-3 gap-3 mt-4 text-center">
              <div className="bg-muted rounded-xl p-2">
                <div className="text-xs text-muted-foreground">Quiz</div>
                <div className="font-extrabold text-foreground">
                  {correctMcq}/{mcqQuestions.length}
                </div>
              </div>
              <div className="bg-muted rounded-xl p-2">
                <div className="text-xs text-muted-foreground">Time</div>
                <div className="font-extrabold text-foreground">
                  {formatTime(timeTaken)}
                </div>
              </div>
              <div className="bg-muted rounded-xl p-2">
                <div className="text-xs text-muted-foreground">XP Earned</div>
                <div className="font-extrabold text-primary">+{xpEarned}</div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="bg-card border border-border rounded-2xl p-4"
          >
            <h3 className="font-extrabold text-foreground mb-3 text-sm">
              📋 Quiz Breakdown
            </h3>
            <div className="space-y-2">
              {mcqQuestions.map((q, qi) => {
                const userAns = mcqAnswers[q.id];
                const correct = userAns === q.correctIndex;
                const notAnswered = userAns === undefined;
                return (
                  <div key={q.id} className="flex items-start gap-2 text-xs">
                    <span
                      className={`w-5 h-5 rounded-full flex items-center justify-center text-white shrink-0 mt-0.5 font-bold ${
                        notAnswered
                          ? "bg-muted-foreground"
                          : correct
                            ? "bg-green-500"
                            : "bg-red-500"
                      }`}
                    >
                      {notAnswered ? "-" : correct ? "✓" : "✗"}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-foreground font-medium leading-tight">
                        Q{qi + 1}: {q.question}
                      </p>
                      {!notAnswered && !correct && (
                        <p className="text-green-400 mt-0.5">
                          Correct: {q.options[q.correctIndex]}
                        </p>
                      )}
                    </div>
                    <span
                      className={`font-bold shrink-0 ${correct ? "text-green-400" : "text-muted-foreground"}`}
                    >
                      {correct ? "+5" : "0"}
                    </span>
                  </div>
                );
              })}
            </div>
          </motion.div>

          <div className="grid grid-cols-2 gap-3">
            <Button
              variant="outline"
              onClick={onBack}
              className="rounded-2xl font-bold border-border text-foreground"
              data-ocid="domain_test.back_to_studio"
            >
              ← Code Studio
            </Button>
            <Button
              onClick={onRetake}
              className="rounded-2xl font-bold bg-primary text-primary-foreground"
              data-ocid="domain_test.retake"
            >
              🔁 Retake Test
            </Button>
          </div>
        </div>
      </div>
    </div>
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
  const [timeTaken, setTimeTaken] = useState(0);
  const [history, setHistory] = useState<TestHistoryEntry[]>([]);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem("cc_domain_test_history");
    if (saved) setHistory(JSON.parse(saved));
  }, []);

  const clearTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  const handleStart = (minutes: number, domain: string) => {
    const { mcqs, coding } = getDomainQuestions(domain);
    const selectedMcqs = shuffle(mcqs).slice(0, Math.min(20, mcqs.length));
    const selectedCoding = shuffle(coding).slice(0, Math.min(5, coding.length));

    setActiveDomain(domain);
    setMcqQuestions(selectedMcqs);
    setCodingQuestions(selectedCoding);

    const secs = minutes * 60;
    setTotalSeconds(secs);
    setRemaining(secs);
    setMcqAnswers({});
    setProgCodes(
      Object.fromEntries(selectedCoding.map((q) => [q.id, q.starterCode])),
    );
    setPhase("test");
    timerRef.current = setInterval(() => {
      setRemaining((prev) => {
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
    const saved = localStorage.getItem("cc_domain_test_history");
    if (saved) setHistory(JSON.parse(saved));
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const correctMcq = mcqQuestions.filter(
    (q) => mcqAnswers[q.id] === q.correctIndex,
  ).length;
  const progAttempted = codingQuestions.filter((q) => {
    const code = progCodes[q.id] ?? "";
    return code.trim().length > 0 && code.trim() !== q.starterCode.trim();
  }).length;
  const totalScore = correctMcq * 5 + progAttempted * 10;
  const maxScore = mcqQuestions.length * 5 + codingQuestions.length * 10;
  const xpEarned = correctMcq * 5 + progAttempted * 15;

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

  const answeredMcq = Object.keys(mcqAnswers).length;
  const progressPct = Math.round(
    ((answeredMcq +
      codingQuestions.filter(
        (q) =>
          (progCodes[q.id]?.trim().length ?? 0) > 0 &&
          progCodes[q.id] !== q.starterCode,
      ).length) /
      Math.max(1, mcqQuestions.length + codingQuestions.length)) *
      100,
  );

  const meta = activeDomain
    ? (DOMAIN_META[activeDomain] ?? { emoji: "📝" })
    : { emoji: "📝" };
  const displayName = activeDomain
    ? (DOMAIN_DISPLAY_NAMES[activeDomain] ?? activeDomain)
    : "Online Test";

  return (
    <div className="h-[100dvh] bg-background flex flex-col overflow-hidden">
      <header className="bg-card border-b border-border px-3 sm:px-4 py-2.5 sm:py-3 shrink-0">
        <div className="flex items-center justify-between gap-2">
          <div className="min-w-0 flex items-center gap-2">
            <span>{meta.emoji}</span>
            <div>
              <h1 className="font-extrabold text-foreground text-xs sm:text-sm leading-tight">
                {displayName} Test
              </h1>
              <p className="text-xs text-muted-foreground">
                {answeredMcq}/{mcqQuestions.length} MCQs answered
              </p>
            </div>
          </div>
          <TimerBadge remaining={remaining} />
        </div>
        <Progress value={progressPct} className="h-1.5 mt-2" />
      </header>

      <div className="flex-1 overflow-y-auto">
        <div className="max-w-2xl mx-auto px-3 sm:px-4 py-4 sm:py-5 space-y-2 pb-28">
          <McqSection
            questions={mcqQuestions}
            answers={mcqAnswers}
            onAnswer={(qId, optIdx) =>
              setMcqAnswers((prev) => ({ ...prev, [qId]: optIdx }))
            }
          />
          <ProgramSection
            questions={codingQuestions}
            codes={progCodes}
            onCodeChange={(qId, code) =>
              setProgCodes((prev) => ({ ...prev, [qId]: code }))
            }
          />

          <AnimatePresence>
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="pt-4 pb-8"
            >
              <div className="bg-card border border-border rounded-2xl p-3 sm:p-4 flex items-center justify-between gap-3">
                <div className="text-sm text-muted-foreground">
                  <span className="font-bold text-foreground">
                    {answeredMcq}/{mcqQuestions.length}
                  </span>{" "}
                  MCQs answered
                </div>
                <Button
                  onClick={handleSubmit}
                  className="rounded-2xl bg-primary text-primary-foreground font-extrabold px-4 sm:px-6"
                  data-ocid="domain_test.submit"
                >
                  Submit Test ✓
                </Button>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
