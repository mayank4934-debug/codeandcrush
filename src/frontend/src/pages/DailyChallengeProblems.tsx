import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ChevronDown, ChevronUp } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useApp } from "../context/AppContext";
import { CODING_PROBLEMS } from "../data/problems";

// ─── Helpers ──────────────────────────────────────────────────────────────────
function getDayStr(): string {
  const now = new Date();
  return `${now.getUTCFullYear()}-${now.getUTCMonth() + 1}-${now.getUTCDate()}`;
}

function getDateLabel(): string {
  return new Date().toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

function getMsUntilMidnightUTC(): number {
  const now = Date.now();
  const todayMidnight = Math.floor(now / 86400000) * 86400000;
  return todayMidnight + 86400000 - now;
}

function formatCountdown(ms: number): string {
  const totalSec = Math.max(0, Math.floor(ms / 1000));
  const h = Math.floor(totalSec / 3600);
  const m = Math.floor((totalSec % 3600) / 60);
  const s = totalSec % 60;
  return [h, m, s].map((v) => String(v).padStart(2, "0")).join(":");
}

const DIFF_COLORS: Record<string, string> = {
  Easy: "bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800",
  Medium:
    "bg-yellow-100 text-yellow-700 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-400 dark:border-yellow-800",
  Hard: "bg-red-100 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800",
};

const LANGUAGES = ["JavaScript", "Python", "C++"] as const;
type Language = (typeof LANGUAGES)[number];

const STARTER_CODE: Record<Language, string> = {
  JavaScript: `// Write your solution in JavaScript
function solve(input) {
  // Your code here
}`,
  Python: `# Write your solution in Python
def solve(input):
    # Your code here
    pass`,
  "C++": `// Write your solution in C++
#include <bits/stdc++.h>
using namespace std;

int solve() {
    // Your code here
    return 0;
}`,
};

const MOCK_SOLVERS = [
  { name: "Alex", medal: "🥇" },
  { name: "Priya", medal: "🥈" },
  { name: "Raj", medal: "🥉" },
];

// ─── Isolated Countdown (never triggers parent re-render) ─────────────────────
const CountdownTimer = memo(function CountdownTimer({
  solverCount,
}: {
  solverCount: number;
}) {
  const [ms, setMs] = useState(getMsUntilMidnightUTC);

  useEffect(() => {
    const id = setInterval(() => setMs(getMsUntilMidnightUTC()), 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-950/30 dark:to-orange-950/30 border border-yellow-200 dark:border-yellow-800/50 rounded-2xl p-5 text-center">
      <p className="text-xs font-semibold text-yellow-700 dark:text-yellow-400 uppercase tracking-wide mb-1">
        Next challenge in
      </p>
      {/* tabular-nums + will-change: contents prevents layout shift on every tick */}
      <div
        className="text-4xl sm:text-5xl font-extrabold tabular-nums text-yellow-600 dark:text-yellow-400 mb-2"
        style={{ willChange: "contents", fontVariantNumeric: "tabular-nums" }}
        data-ocid="daily.countdown"
      >
        {formatCountdown(ms)}
      </div>
      <p className="text-xs text-yellow-600/70 dark:text-yellow-500">
        🔥 Solved by{" "}
        <strong className="text-yellow-700 dark:text-yellow-400">
          {solverCount}
        </strong>{" "}
        {solverCount === 1 ? "person" : "people"} today
      </p>
    </div>
  );
});

// ─── Leaderboard with mobile "Show All" toggle ────────────────────────────────
const Leaderboard = memo(function Leaderboard({
  isSolved,
  username,
}: {
  isSolved: boolean;
  username: string;
}) {
  const [expanded, setExpanded] = useState(false);

  const toggleExpanded = useCallback(() => setExpanded((v) => !v), []);

  return (
    <div className="bg-card rounded-2xl border border-border shadow-sm p-5">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-extrabold text-foreground text-base">
          Today's Top Solvers
        </h3>
        <button
          onClick={toggleExpanded}
          type="button"
          className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors sm:hidden"
          aria-label={expanded ? "Show fewer solvers" : "Show all solvers"}
          data-ocid="daily.leaderboard_toggle"
        >
          {expanded ? (
            <>
              Less <ChevronUp className="w-3 h-3" />
            </>
          ) : (
            <>
              All <ChevronDown className="w-3 h-3" />
            </>
          )}
        </button>
      </div>

      {/* On mobile: max-h-48 when collapsed, auto when expanded */}
      <div
        className={`space-y-2 overflow-hidden transition-all duration-300 ${
          expanded ? "max-h-none" : "max-h-48 sm:max-h-none"
        }`}
        data-ocid="daily.leaderboard"
      >
        {MOCK_SOLVERS.map((s, i) => (
          <div
            key={s.name}
            className="flex items-center gap-3 py-2 px-3 rounded-xl bg-muted/40"
            data-ocid={`daily.leaderboard.item.${i + 1}`}
          >
            <span className="text-xl w-7 shrink-0">{s.medal}</span>
            <span className="font-semibold text-foreground text-sm flex-1">
              {s.name}
            </span>
            <span className="text-xs text-yellow-600 dark:text-yellow-400 font-bold">
              +50 XP
            </span>
          </div>
        ))}
        <AnimatePresence>
          {isSolved && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-3 py-2 px-3 rounded-xl bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800/50"
              data-ocid="daily.leaderboard.you"
            >
              <span className="text-xl w-7 shrink-0">🌟</span>
              <span className="font-semibold text-yellow-700 dark:text-yellow-400 text-sm flex-1">
                {username || "You"}
              </span>
              <span className="text-xs text-yellow-600 dark:text-yellow-400 font-bold">
                +50 XP
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Overflow indicator when collapsed on mobile */}
      {!expanded && MOCK_SOLVERS.length > 2 && (
        <button
          type="button"
          onClick={toggleExpanded}
          className="w-full mt-2 py-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors sm:hidden text-center"
          data-ocid="daily.leaderboard_show_more"
        >
          + {MOCK_SOLVERS.length - 2} more solvers
        </button>
      )}
    </div>
  );
});

// ─── Code Editor — isolated to prevent re-render from parent state ────────────
const CodeEditor = memo(function CodeEditor({
  code,
  language,
  onCodeChange,
  onLanguageChange,
  onSubmit,
  showError,
}: {
  code: string;
  language: Language;
  onCodeChange: (v: string) => void;
  onLanguageChange: (v: Language) => void;
  onSubmit: () => void;
  showError: boolean;
}) {
  const lineCount = code.split("\n").length;

  return (
    <div className="bg-[#1e1e2e] rounded-2xl overflow-hidden border border-border shadow-sm">
      {/* Toolbar */}
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-white/10">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500" />
          <div className="w-3 h-3 rounded-full bg-yellow-500" />
          <div className="w-3 h-3 rounded-full bg-green-500" />
          <span className="text-xs text-gray-400 ml-2 font-mono">
            daily_solution
          </span>
        </div>
        <select
          value={language}
          onChange={(e) => onLanguageChange(e.target.value as Language)}
          className="bg-white/10 text-gray-300 text-xs rounded-lg px-2 py-1 border border-white/10 outline-none cursor-pointer"
          data-ocid="daily.language_select"
        >
          {LANGUAGES.map((l) => (
            <option key={l} value={l} className="bg-[#1e1e2e]">
              {l}
            </option>
          ))}
        </select>
      </div>

      {/* Editor body */}
      <div className="flex">
        <div className="px-3 py-4 text-right select-none font-mono text-xs text-gray-600 bg-[#181825] min-w-[2.5rem]">
          {Array.from({ length: lineCount }, (_, i) => (
            <div key={i + 1}>{i + 1}</div>
          ))}
        </div>
        <textarea
          value={code}
          onChange={(e) => onCodeChange(e.target.value)}
          className="flex-1 bg-transparent text-gray-100 font-mono text-xs py-4 pr-4 resize-none outline-none leading-5"
          style={{ minHeight: "200px", lineHeight: "1.25rem" }}
          spellCheck={false}
          data-ocid="daily.code_editor"
        />
      </div>

      <AnimatePresence>
        {showError && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-xs text-red-400 px-4 pb-2"
            data-ocid="daily.error_state"
          >
            ❌ Please write your solution before submitting.
          </motion.p>
        )}
      </AnimatePresence>

      <div className="flex justify-end px-4 py-3 border-t border-white/10">
        <Button
          onClick={onSubmit}
          className="rounded-full font-bold text-sm gap-2 px-5"
          style={{
            background: "linear-gradient(135deg, #eab308 0%, #f97316 100%)",
            color: "white",
          }}
          data-ocid="daily.submit_button"
        >
          ⚡ Submit Challenge
        </Button>
      </div>
    </div>
  );
});

// ─── Main Component ──────────────────────────────────────────────────────────
export default function DailyChallengeProblems({
  onBack,
}: {
  onBack: () => void;
}) {
  const { user, setUser } = useApp();
  const dayStr = getDayStr();
  const solvedKey = `cc_daily_solved_${dayStr}`;
  const solversKey = "cc_daily_solvers";

  // Today's problem — deterministic, computed once
  const dayIndex = useMemo(
    () => Math.floor(Date.now() / 86400000) % CODING_PROBLEMS.length,
    [],
  );
  const problem = CODING_PROBLEMS[dayIndex];

  // State — NO countdown here; it lives in <CountdownTimer>
  const [code, setCode] = useState(STARTER_CODE.JavaScript);
  const [language, setLanguage] = useState<Language>("JavaScript");
  const [isSolved, setIsSolved] = useState(
    () => !!localStorage.getItem(solvedKey),
  );
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const [showError, setShowError] = useState(false);
  const [solverCount, setSolverCount] = useState(() =>
    Number(localStorage.getItem(solversKey) ?? 0),
  );

  // Sync language starter code
  useEffect(() => {
    if (!isSolved) setCode(STARTER_CODE[language]);
  }, [language, isSolved]);

  const handleLanguageChange = useCallback((lang: Language) => {
    setLanguage(lang);
  }, []);

  const handleCodeChange = useCallback((v: string) => {
    setCode(v);
  }, []);

  const handleSubmit = useCallback(() => {
    setSubmitAttempted(true);
    if (code.trim().length < 30) {
      setShowError(true);
      return;
    }
    setShowError(false);
    localStorage.setItem(solvedKey, "1");
    const newCount = solverCount + 1;
    localStorage.setItem(solversKey, String(newCount));
    setSolverCount(newCount);
    setIsSolved(true);
    setUser({ xp: user.xp + 50 });
  }, [code, solvedKey, solverCount, user.xp, setUser]);

  // Stable ref to prevent scroll-to-top on mount
  const containerRef = useRef<HTMLDivElement>(null);

  if (!problem) return null;

  return (
    <div
      ref={containerRef}
      className="flex-1 min-h-0 bg-background flex flex-col overflow-hidden"
    >
      {/* Header */}
      <header
        className="shrink-0 px-4 py-3 flex items-center gap-3"
        style={{
          background: "linear-gradient(135deg, #eab308 0%, #f97316 100%)",
          borderBottom: "1px solid rgba(255,255,255,0.15)",
        }}
      >
        <Button
          variant="ghost"
          size="icon"
          onClick={onBack}
          className="rounded-xl text-white/80 hover:text-white hover:bg-white/15 shrink-0"
          data-ocid="daily.back_button"
          aria-label="Back to Problems"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center text-xl shrink-0"
          style={{ background: "rgba(255,255,255,0.2)" }}
        >
          ⚡
        </div>
        <div className="flex-1 min-w-0">
          <h1 className="font-extrabold text-white text-base leading-tight">
            Daily Challenge
          </h1>
          <p className="text-[11px] text-white/70">{getDateLabel()}</p>
        </div>
        {isSolved && (
          <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-white/20 text-white border border-white/30 shrink-0">
            ✅ Solved
          </span>
        )}
      </header>

      {/* Scrollable body — overflow-y-auto lives here, not on children */}
      <div className="flex-1 overflow-y-auto overscroll-contain">
        <div className="max-w-2xl mx-auto px-3 sm:px-4 py-4 sm:py-5 space-y-4 pb-28">
          {/* Countdown — isolated component, ticks don't re-render parent */}
          <CountdownTimer solverCount={solverCount} />

          {/* Problem Card */}
          <div className="bg-card rounded-2xl border border-border shadow-sm p-5">
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <Badge
                variant="outline"
                className={`text-xs ${DIFF_COLORS[problem.difficulty]}`}
              >
                {problem.difficulty}
              </Badge>
              <span className="text-xs text-muted-foreground bg-muted px-2.5 py-1 rounded-full">
                {problem.topic}
              </span>
              {problem.companies.slice(0, 3).map((c) => (
                <span
                  key={c}
                  className="text-xs bg-primary/5 text-primary/70 px-2.5 py-1 rounded-full border border-primary/10"
                >
                  {c}
                </span>
              ))}
            </div>

            <h2 className="text-xl font-extrabold text-foreground mb-3">
              {problem.title}
            </h2>
            <p className="text-sm text-foreground leading-relaxed mb-4">
              {problem.description}
            </p>

            {problem.examples.slice(0, 2).map((ex, i) => (
              <div
                key={`ex-${i}`}
                className="bg-[#1a1a2e] rounded-xl p-4 font-mono text-xs mb-2 space-y-1"
              >
                <div>
                  <span className="text-blue-400">Input:</span>{" "}
                  <span className="text-gray-300">{ex.input}</span>
                </div>
                <div>
                  <span className="text-green-400">Output:</span>{" "}
                  <span className="text-gray-300">{ex.output}</span>
                </div>
                {ex.explanation && (
                  <div className="text-gray-500">
                    {"// "}
                    {ex.explanation}
                  </div>
                )}
              </div>
            ))}

            <div className="flex flex-wrap gap-1.5 mt-3">
              {problem.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-xs text-primary/70 bg-primary/5 px-2.5 py-1 rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>

            <div className="mt-4 flex items-center gap-2 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800/50 rounded-xl px-4 py-2.5">
              <span className="text-lg">🏆</span>
              <span className="text-sm font-semibold text-yellow-700 dark:text-yellow-400">
                Solve this to earn <strong>50 Bonus XP + Daily Badge!</strong>
              </span>
            </div>
          </div>

          {/* Already Solved State */}
          <AnimatePresence>
            {isSolved && (
              <motion.div
                key="solved-banner"
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-2xl p-5 text-center"
                data-ocid="daily.success_state"
              >
                <div className="text-4xl mb-2">🎉</div>
                <p className="font-extrabold text-green-700 dark:text-green-400 text-lg">
                  {submitAttempted
                    ? "Challenge Completed! +50 XP Earned"
                    : "✅ Already solved today! Come back tomorrow."}
                </p>
                <p className="text-sm text-green-600 dark:text-green-500 mt-1">
                  New challenge unlocks at midnight UTC
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Code Editor — isolated, stable during countdown ticks */}
          {!isSolved && (
            <CodeEditor
              key="editor"
              code={code}
              language={language}
              onCodeChange={handleCodeChange}
              onLanguageChange={handleLanguageChange}
              onSubmit={handleSubmit}
              showError={showError}
            />
          )}

          {/* Leaderboard — isolated, mobile-constrained */}
          <Leaderboard isSolved={isSolved} username={user.username || ""} />
        </div>
      </div>
    </div>
  );
}
