import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";

// ─── Types ─────────────────────────────────────────────────────────────────────
export interface CheckResult {
  status: "correct" | "wrong" | "error" | "pending";
  message: string;
  hint?: string;
  actualOutput?: string;
  expectedOutput?: string;
}

export interface TestCase {
  input: string;
  expected: string;
}

interface TestCaseResult {
  input: string;
  expected: string;
  actual: string;
  passed: boolean;
}

interface Props {
  code: string;
  language: string;
  expectedOutput?: string;
  testCases?: TestCase[];
  onResult?: (result: CheckResult) => void;
  /** "problem" = test cases mode; "practice" = compile-only; "free" = compile-only */
  mode?: "problem" | "practice" | "free";
  autoRun?: boolean;
}

// ─── Judge0 language IDs (same mapping as MultiLangCompiler) ──────────────────
const JUDGE0_LANGUAGE_IDS: Record<string, number> = {
  python: 71,
  javascript: 63,
  typescript: 74,
  java: 62,
  c: 50,
  cpp: 54,
  csharp: 51,
  go: 60,
  rust: 73,
  ruby: 72,
  php: 68,
  swift: 83,
  kotlin: 78,
  r: 80,
  bash: 46,
  perl: 85,
  lua: 64,
  scala: 81,
  haskell: 61,
  elixir: 57,
};

// ─── Fix hints per language ───────────────────────────────────────────────────
function getFixHint(language: string, stderr: string): string {
  const s = stderr.toLowerCase();
  if (s.includes("syntaxerror") || s.includes("syntax error")) {
    if (language === "python")
      return "Check indentation and missing colons (:)";
    if (["c", "cpp", "java", "csharp"].includes(language))
      return "Check for missing semicolons (;) or closing brackets";
    return "Check for syntax errors in your code";
  }
  if (
    s.includes("nameerror") ||
    s.includes("undeclared") ||
    s.includes("undefined")
  )
    return "Variable or function used before it's defined";
  if (s.includes("typeerror") || s.includes("type error"))
    return "You may be using a value of the wrong type";
  if (s.includes("indexerror") || s.includes("index out of bound"))
    return "Array or list index is out of range — check your loop bounds";
  if (s.includes("nullpointer") || s.includes("null pointer"))
    return "A variable is null when you try to use it";
  if (["c", "cpp"].includes(language))
    return "Check closing brackets and semicolons";
  if (language === "python") return "Check indentation and colon usage";
  if (language === "java")
    return "Check curly braces, semicolons, and class structure";
  return "Review your code for syntax errors";
}

// ─── Run code via Judge0 ──────────────────────────────────────────────────────
async function runCode(
  code: string,
  language: string,
  stdin = "",
): Promise<{
  stdout: string;
  stderr: string;
  compileError: string;
  exitCode: number;
}> {
  const langId = JUDGE0_LANGUAGE_IDS[language] ?? 71;
  const res = await fetch(
    "https://ce.judge0.com/submissions?base64_encoded=false&wait=true",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        source_code: code,
        language_id: langId,
        stdin,
      }),
    },
  );
  if (!res.ok) throw new Error(`Judge0 error: ${res.status}`);
  const data = await res.json();
  return {
    stdout: (data.stdout ?? "").trim(),
    stderr: (data.stderr ?? "").trim(),
    compileError: (data.compile_output ?? "").trim(),
    exitCode: data.status?.id === 3 ? 0 : 1,
  };
}

// ─── TestCaseRow ──────────────────────────────────────────────────────────────
function TestCaseRow({ tc, idx }: { tc: TestCaseResult; idx: number }) {
  const [open, setOpen] = useState(!tc.passed);
  return (
    <div
      className={`rounded-xl border overflow-hidden ${tc.passed ? "border-green-500/30 bg-green-500/5" : "border-red-500/30 bg-red-500/5"}`}
      data-ocid={`code_checker.test_case.${idx + 1}`}
    >
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center gap-3 px-4 py-2.5 text-left"
      >
        <span
          className={`text-sm font-bold shrink-0 ${tc.passed ? "text-green-500" : "text-red-500"}`}
        >
          {tc.passed ? "✓" : "✗"}
        </span>
        <span className="text-sm font-semibold text-foreground flex-1">
          Test {idx + 1}
        </span>
        <span
          className={`text-xs px-2 py-0.5 rounded-full font-semibold shrink-0 ${tc.passed ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"}`}
        >
          {tc.passed ? "Passed" : "Failed"}
        </span>
        <span className="text-xs text-muted-foreground">
          {open ? "▲" : "▼"}
        </span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-3 grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs font-mono">
              <div>
                <div className="text-muted-foreground font-sans font-semibold mb-1">
                  Input
                </div>
                <div className="bg-muted/40 rounded-lg px-3 py-2 text-foreground whitespace-pre-wrap break-all">
                  {tc.input || "(none)"}
                </div>
              </div>
              <div>
                <div className="text-muted-foreground font-sans font-semibold mb-1">
                  Expected
                </div>
                <div className="bg-green-500/10 text-green-700 dark:text-green-400 rounded-lg px-3 py-2 whitespace-pre-wrap break-all">
                  {tc.expected}
                </div>
              </div>
              <div>
                <div className="text-muted-foreground font-sans font-semibold mb-1">
                  Actual
                </div>
                <div
                  className={`rounded-lg px-3 py-2 whitespace-pre-wrap break-all ${tc.passed ? "bg-green-500/10 text-green-700 dark:text-green-400" : "bg-red-500/10 text-red-700 dark:text-red-400"}`}
                >
                  {tc.actual || "(empty)"}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── CodeChecker ──────────────────────────────────────────────────────────────
export default function CodeChecker({
  code,
  language,
  expectedOutput,
  testCases,
  onResult,
  mode = "free",
  autoRun = false,
}: Props) {
  const [result, setResult] = useState<CheckResult | null>(null);
  const [tcResults, setTcResults] = useState<TestCaseResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const hasFiredRef = useRef(false);

  const check = async () => {
    if (!code.trim()) return;
    setIsRunning(true);
    setResult({ status: "pending", message: "Running your code..." });
    setTcResults([]);

    try {
      if (mode === "problem" && testCases && testCases.length > 0) {
        // Run each test case
        const results: TestCaseResult[] = [];
        for (const tc of testCases) {
          const out = await runCode(code, language, tc.input);
          const passed =
            out.exitCode === 0 &&
            !out.compileError &&
            !out.stderr &&
            out.stdout.trim() === tc.expected.trim();
          results.push({
            input: tc.input,
            expected: tc.expected,
            actual: out.compileError || out.stderr || out.stdout,
            passed,
          });
        }
        setTcResults(results);
        const allPassed = results.every((r) => r.passed);
        const passedCount = results.filter((r) => r.passed).length;
        const finalResult: CheckResult = allPassed
          ? {
              status: "correct",
              message: `All ${results.length} test cases passed!`,
            }
          : {
              status: "wrong",
              message: `${passedCount}/${results.length} test cases passed`,
              actualOutput: results.find((r) => !r.passed)?.actual,
              expectedOutput: results.find((r) => !r.passed)?.expected,
            };
        setResult(finalResult);
        onResult?.(finalResult);
      } else if (expectedOutput) {
        const out = await runCode(code, language);
        if (out.compileError) {
          const r: CheckResult = {
            status: "error",
            message: "Compile error",
            hint: getFixHint(language, out.compileError),
            actualOutput: out.compileError,
          };
          setResult(r);
          onResult?.(r);
        } else if (out.stderr) {
          const r: CheckResult = {
            status: "error",
            message: "Runtime error",
            hint: getFixHint(language, out.stderr),
            actualOutput: out.stderr,
          };
          setResult(r);
          onResult?.(r);
        } else if (out.stdout.trim() === expectedOutput.trim()) {
          const r: CheckResult = {
            status: "correct",
            message: "Correct! Output matches expected.",
          };
          setResult(r);
          onResult?.(r);
        } else {
          const r: CheckResult = {
            status: "wrong",
            message: "Wrong answer",
            actualOutput: out.stdout,
            expectedOutput,
          };
          setResult(r);
          onResult?.(r);
        }
      } else {
        // compile / practice mode — just check it runs
        const out = await runCode(code, language);
        if (out.compileError) {
          const r: CheckResult = {
            status: "error",
            message: "Compile error",
            hint: getFixHint(language, out.compileError),
            actualOutput: out.compileError,
          };
          setResult(r);
          onResult?.(r);
        } else if (out.stderr) {
          const r: CheckResult = {
            status: "error",
            message: "Runtime error",
            hint: getFixHint(language, out.stderr),
            actualOutput: out.stderr,
          };
          setResult(r);
          onResult?.(r);
        } else {
          const r: CheckResult = {
            status: "correct",
            message:
              mode === "practice"
                ? "Code runs successfully! Output looks good."
                : "Code compiles and runs without errors.",
            actualOutput: out.stdout,
          };
          setResult(r);
          onResult?.(r);
        }
      }
    } catch {
      const r: CheckResult = {
        status: "error",
        message: "Could not reach the compiler. Check your connection.",
      };
      setResult(r);
      onResult?.(r);
    } finally {
      setIsRunning(false);
    }
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const checkRef = useRef(check);
  checkRef.current = check;

  useEffect(() => {
    if (autoRun && !hasFiredRef.current && code.trim()) {
      hasFiredRef.current = true;
      checkRef.current();
    }
  }, [autoRun, code]);

  // Status banner styling
  const bannerStyle =
    !result || result.status === "pending"
      ? "bg-muted/40 border-border text-foreground"
      : result.status === "correct"
        ? "bg-green-500/10 border-green-500/30 text-green-700 dark:text-green-400"
        : result.status === "wrong"
          ? "bg-red-500/10 border-red-500/30 text-red-700 dark:text-red-400"
          : "bg-orange-500/10 border-orange-500/30 text-orange-700 dark:text-orange-400";

  const statusIcon =
    !result || result.status === "pending"
      ? "⏳"
      : result.status === "correct"
        ? "✓"
        : result.status === "wrong"
          ? "✗"
          : "⚠";

  return (
    <div className="space-y-3" data-ocid="code_checker.panel">
      {/* Run button */}
      {!autoRun && (
        <button
          type="button"
          onClick={check}
          disabled={isRunning || !code.trim()}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-bold hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          data-ocid="code_checker.check_button"
        >
          {isRunning ? (
            <>
              <span className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin shrink-0" />
              Running...
            </>
          ) : (
            <>
              <span>▶</span>
              {mode === "problem" ? "Check Solution" : "Check Code"}
            </>
          )}
        </button>
      )}

      <AnimatePresence mode="wait">
        {(isRunning || result) && (
          <motion.div
            key={result?.status ?? "pending"}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            className="space-y-3"
          >
            {/* Main banner */}
            <div
              className={`rounded-xl border px-4 py-3 flex items-center gap-3 ${bannerStyle}`}
              data-ocid={
                result?.status === "correct"
                  ? "code_checker.success_state"
                  : result?.status === "pending"
                    ? "code_checker.loading_state"
                    : "code_checker.error_state"
              }
            >
              {isRunning ? (
                <span className="w-4 h-4 rounded-full border-2 border-current/30 border-t-current animate-spin shrink-0" />
              ) : (
                <span className="text-base shrink-0">{statusIcon}</span>
              )}
              <div className="flex-1 min-w-0">
                <span className="text-sm font-bold">
                  {isRunning ? "Running..." : result?.message}
                </span>
                {result?.hint && (
                  <p className="text-xs mt-1 opacity-80">💡 {result.hint}</p>
                )}
              </div>
            </div>

            {/* Wrong answer — show actual vs expected */}
            {result?.status === "wrong" && !tcResults.length && (
              <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                <div>
                  <div className="font-sans font-semibold text-muted-foreground mb-1">
                    Expected
                  </div>
                  <div className="bg-green-500/10 text-green-700 dark:text-green-400 rounded-lg px-3 py-2 whitespace-pre-wrap break-all">
                    {result.expectedOutput ?? "—"}
                  </div>
                </div>
                <div>
                  <div className="font-sans font-semibold text-muted-foreground mb-1">
                    Actual
                  </div>
                  <div className="bg-red-500/10 text-red-700 dark:text-red-400 rounded-lg px-3 py-2 whitespace-pre-wrap break-all">
                    {result.actualOutput ?? "(empty)"}
                  </div>
                </div>
              </div>
            )}

            {/* Error output */}
            {result?.status === "error" && result.actualOutput && (
              <div className="text-xs font-mono bg-orange-500/10 border border-orange-500/20 text-orange-700 dark:text-orange-400 rounded-lg px-3 py-2.5 whitespace-pre-wrap overflow-x-auto">
                {result.actualOutput}
              </div>
            )}

            {/* Test case results */}
            {tcResults.length > 0 && (
              <div className="space-y-2">
                <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                  Test Cases
                </div>
                {tcResults.map((tc, i) => (
                  <TestCaseRow key={`tc-${i}`} tc={tc} idx={i} />
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
