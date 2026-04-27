import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import Editor, { type OnMount } from "@monaco-editor/react";
import {
  ChevronDown,
  ChevronRight,
  ChevronUp,
  Clock,
  Copy,
  FileText,
  History,
  Loader2,
  Maximize2,
  Minimize2,
  Play,
  Save,
  Search,
  Share2,
  Trash2,
  X,
  ZoomIn,
  ZoomOut,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import CodeChecker, { type CheckResult } from "./CodeChecker";

// ─── Types ────────────────────────────────────────────────────────────────────
interface CodeSnippet {
  id: string;
  name: string;
  language: string;
  code: string;
  stdin: string;
  savedAt: string;
}

interface VersionEntry {
  code: string;
  language: string;
  savedAt: string;
}

interface ExecutionResult {
  stdout: string;
  stderr: string;
  compileError: string;
  exitCode: number;
  execTimeMs: number | null;
}

// ─── Language Groups ──────────────────────────────────────────────────────────
const LANGUAGE_GROUPS = [
  {
    group: "Popular",
    langs: [
      {
        id: "python",
        name: "Python",
        emoji: "🐍",
        monacoLang: "python",
        ext: ".py",
        judge0: 71,
      },
      {
        id: "javascript",
        name: "JavaScript",
        emoji: "🟨",
        monacoLang: "javascript",
        ext: ".js",
        judge0: 63,
      },
      {
        id: "typescript",
        name: "TypeScript",
        emoji: "💙",
        monacoLang: "typescript",
        ext: ".ts",
        judge0: 74,
      },
      {
        id: "java",
        name: "Java",
        emoji: "☕",
        monacoLang: "java",
        ext: ".java",
        judge0: 62,
      },
      {
        id: "c",
        name: "C",
        emoji: "⚡",
        monacoLang: "c",
        ext: ".c",
        judge0: 50,
      },
      {
        id: "cpp",
        name: "C++",
        emoji: "⚡",
        monacoLang: "cpp",
        ext: ".cpp",
        judge0: 54,
      },
      {
        id: "csharp",
        name: "C#",
        emoji: "💜",
        monacoLang: "csharp",
        ext: ".cs",
        judge0: 51,
      },
      {
        id: "go",
        name: "Go",
        emoji: "🐹",
        monacoLang: "go",
        ext: ".go",
        judge0: 60,
      },
      {
        id: "rust",
        name: "Rust",
        emoji: "🦀",
        monacoLang: "rust",
        ext: ".rs",
        judge0: 73,
      },
    ],
  },
  {
    group: "Web",
    langs: [
      {
        id: "php",
        name: "PHP",
        emoji: "🐘",
        monacoLang: "php",
        ext: ".php",
        judge0: 68,
      },
      {
        id: "html",
        name: "HTML",
        emoji: "🌐",
        monacoLang: "html",
        ext: ".html",
        judge0: 0,
      },
      {
        id: "css",
        name: "CSS",
        emoji: "🎨",
        monacoLang: "css",
        ext: ".css",
        judge0: 0,
      },
    ],
  },
  {
    group: "Scripting",
    langs: [
      {
        id: "ruby",
        name: "Ruby",
        emoji: "💎",
        monacoLang: "ruby",
        ext: ".rb",
        judge0: 72,
      },
      {
        id: "bash",
        name: "Bash",
        emoji: "💻",
        monacoLang: "shell",
        ext: ".sh",
        judge0: 46,
      },
      {
        id: "powershell",
        name: "PowerShell",
        emoji: "🔵",
        monacoLang: "shell",
        ext: ".ps1",
        judge0: 0,
      },
      {
        id: "perl",
        name: "Perl",
        emoji: "🐪",
        monacoLang: "perl",
        ext: ".pl",
        judge0: 85,
      },
      {
        id: "lua",
        name: "Lua",
        emoji: "🌙",
        monacoLang: "lua",
        ext: ".lua",
        judge0: 64,
      },
    ],
  },
  {
    group: "Functional",
    langs: [
      {
        id: "haskell",
        name: "Haskell",
        emoji: "λ",
        monacoLang: "haskell",
        ext: ".hs",
        judge0: 61,
      },
      {
        id: "elixir",
        name: "Elixir",
        emoji: "💧",
        monacoLang: "elixir",
        ext: ".ex",
        judge0: 57,
      },
      {
        id: "clojure",
        name: "Clojure",
        emoji: "☯️",
        monacoLang: "clojure",
        ext: ".clj",
        judge0: 86,
      },
      {
        id: "scala",
        name: "Scala",
        emoji: "♾️",
        monacoLang: "scala",
        ext: ".scala",
        judge0: 81,
      },
      {
        id: "erlang",
        name: "Erlang",
        emoji: "📡",
        monacoLang: "plaintext",
        ext: ".erl",
        judge0: 58,
      },
    ],
  },
  {
    group: "Academic",
    langs: [
      {
        id: "r",
        name: "R",
        emoji: "📊",
        monacoLang: "r",
        ext: ".r",
        judge0: 80,
      },
      {
        id: "kotlin",
        name: "Kotlin",
        emoji: "🎯",
        monacoLang: "kotlin",
        ext: ".kt",
        judge0: 78,
      },
      {
        id: "swift",
        name: "Swift",
        emoji: "🍎",
        monacoLang: "swift",
        ext: ".swift",
        judge0: 83,
      },
      {
        id: "pascal",
        name: "Pascal",
        emoji: "📐",
        monacoLang: "pascal",
        ext: ".pas",
        judge0: 0,
      },
      {
        id: "cobol",
        name: "COBOL",
        emoji: "🏛️",
        monacoLang: "plaintext",
        ext: ".cob",
        judge0: 0,
      },
      {
        id: "fortran",
        name: "Fortran",
        emoji: "🔢",
        monacoLang: "plaintext",
        ext: ".f90",
        judge0: 0,
      },
    ],
  },
];

const ALL_LANGUAGES = LANGUAGE_GROUPS.flatMap((g) => g.langs);

// ─── Starter Code ─────────────────────────────────────────────────────────────
const STARTER_CODE: Record<string, string> = {
  python: `# Python — Hello World
print("Hello, World!")

name = input("Enter your name: ")
print(f"Welcome, {name}! Happy coding 🚀")`,

  javascript: `// JavaScript — Hello World
const name = "World";
console.log(\`Hello, \${name}!\`);

// Try an array operation
const nums = [1, 2, 3, 4, 5];
const sum = nums.reduce((acc, n) => acc + n, 0);
console.log("Sum:", sum);`,

  typescript: `// TypeScript — Hello World
const greet = (name: string): string => \`Hello, \${name}!\`;

console.log(greet("World"));

const nums: number[] = [1, 2, 3, 4, 5];
const sum: number = nums.reduce((acc, n) => acc + n, 0);
console.log("Sum:", sum);`,

  java: `public class Main {
    public static void main(String[] args) {
        System.out.println("Hello, World!");
        
        // Simple loop
        for (int i = 1; i <= 5; i++) {
            System.out.println("Count: " + i);
        }
    }
}`,

  c: `#include <stdio.h>

int main() {
    printf("Hello, World!\\n");
    
    // Simple loop
    for (int i = 1; i <= 5; i++) {
        printf("Count: %d\\n", i);
    }
    
    return 0;
}`,

  cpp: `#include <iostream>
#include <vector>
using namespace std;

int main() {
    cout << "Hello, World!" << endl;
    
    vector<int> nums = {1, 2, 3, 4, 5};
    int sum = 0;
    for (int n : nums) sum += n;
    cout << "Sum: " << sum << endl;
    
    return 0;
}`,

  csharp: `using System;
using System.Linq;

class Program {
    static void Main() {
        Console.WriteLine("Hello, World!");
        
        int[] nums = {1, 2, 3, 4, 5};
        int sum = nums.Sum();
        Console.WriteLine($"Sum: {sum}");
    }
}`,

  go: `package main

import "fmt"

func main() {
    fmt.Println("Hello, World!")
    
    nums := []int{1, 2, 3, 4, 5}
    sum := 0
    for _, n := range nums {
        sum += n
    }
    fmt.Printf("Sum: %d\\n", sum)
}`,

  rust: `fn main() {
    println!("Hello, World!");
    
    let nums = vec![1, 2, 3, 4, 5];
    let sum: i32 = nums.iter().sum();
    println!("Sum: {}", sum);
}`,

  ruby: `puts "Hello, World!"

nums = [1, 2, 3, 4, 5]
sum = nums.sum
puts "Sum: #{sum}"`,

  php: `<?php
echo "Hello, World!\\n";

$nums = [1, 2, 3, 4, 5];
$sum = array_sum($nums);
echo "Sum: $sum\\n";`,

  swift: `print("Hello, World!")

let nums = [1, 2, 3, 4, 5]
let sum = nums.reduce(0, +)
print("Sum: \\(sum)")`,

  kotlin: `fun main() {
    println("Hello, World!")
    
    val nums = listOf(1, 2, 3, 4, 5)
    val sum = nums.sum()
    println("Sum: $sum")
}`,

  r: `cat("Hello, World!\\n")

nums <- c(1, 2, 3, 4, 5)
cat("Sum:", sum(nums), "\\n")`,

  bash: `#!/bin/bash
echo "Hello, World!"

# Simple loop
for i in {1..5}; do
  echo "Count: $i"
done`,

  perl: `#!/usr/bin/perl
use strict;
use warnings;

print "Hello, World!\\n";

my @nums = (1, 2, 3, 4, 5);
my $sum = 0;
$sum += $_ for @nums;
print "Sum: $sum\\n";`,

  lua: `print("Hello, World!")

local nums = {1, 2, 3, 4, 5}
local sum = 0
for _, v in ipairs(nums) do
  sum = sum + v
end
print("Sum: " .. sum)`,

  scala: `object Main extends App {
  println("Hello, World!")
  
  val nums = List(1, 2, 3, 4, 5)
  val sum = nums.sum
  println(s"Sum: $sum")
}`,

  haskell: `main :: IO ()
main = do
  putStrLn "Hello, World!"
  let nums = [1..5] :: [Int]
  putStrLn $ "Sum: " ++ show (sum nums)`,

  elixir: `IO.puts "Hello, World!"

nums = [1, 2, 3, 4, 5]
sum = Enum.sum(nums)
IO.puts "Sum: #{sum}"`,

  html: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Hello World</title>
  <style>
    body { font-family: sans-serif; padding: 2rem; background: #0d1117; color: #e6edf3; }
    h1 { color: #7c3aed; }
  </style>
</head>
<body>
  <h1>Hello, World!</h1>
  <p>Welcome to the Code & Crush online editor.</p>
</body>
</html>`,

  css: `/* CSS Demo */
body {
  font-family: 'Plus Jakarta Sans', sans-serif;
  background: #0d1117;
  color: #e6edf3;
  padding: 2rem;
}

h1 {
  color: #7c3aed;
  font-size: 2rem;
}`,

  clojure: `(println "Hello, World!")

(def nums [1 2 3 4 5])
(println "Sum:" (reduce + nums))`,

  erlang: `-module(main).
-export([start/0]).

start() ->
  io:format("Hello, World!~n"),
  Nums = [1,2,3,4,5],
  Sum = lists:sum(Nums),
  io:format("Sum: ~p~n", [Sum]).`,

  default: `// Start writing your code here...
// Press Ctrl+Enter (or Cmd+Enter) to run`,
};

// ─── Storage helpers ──────────────────────────────────────────────────────────
function loadSnippets(): CodeSnippet[] {
  try {
    return JSON.parse(
      localStorage.getItem("codeSnippets") ?? "[]",
    ) as CodeSnippet[];
  } catch {
    return [];
  }
}

function saveSnippets(snippets: CodeSnippet[]) {
  localStorage.setItem("codeSnippets", JSON.stringify(snippets));
}

function loadVersionHistory(lang: string): VersionEntry[] {
  try {
    const key = `codeHistory_${lang}`;
    return JSON.parse(localStorage.getItem(key) ?? "[]") as VersionEntry[];
  } catch {
    return [];
  }
}

function saveVersionHistory(lang: string, history: VersionEntry[]) {
  const key = `codeHistory_${lang}`;
  localStorage.setItem(key, JSON.stringify(history.slice(0, 20)));
}

function loadLastCode(lang: string): string {
  return (
    localStorage.getItem(`lastCode_${lang}`) ??
    STARTER_CODE[lang] ??
    STARTER_CODE.default
  );
}

// ─── Language Selector with Search ────────────────────────────────────────────
function LangSelector({
  selected,
  onChange,
}: {
  selected: string;
  onChange: (lang: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const ref = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const lang = ALL_LANGUAGES.find((l) => l.id === selected) ?? ALL_LANGUAGES[0];

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node))
        setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 50);
  }, [open]);

  const filtered = search.trim()
    ? ALL_LANGUAGES.filter((l) =>
        l.name.toLowerCase().includes(search.toLowerCase()),
      )
    : null;

  const groups = filtered
    ? [{ group: "Results", langs: filtered }]
    : LANGUAGE_GROUPS;

  return (
    <div ref={ref} className="relative" data-ocid="compiler.select">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 px-3 py-2 bg-[#2a2a3e] border border-[#3a3a55] rounded-xl text-sm font-semibold text-gray-200 hover:border-violet-500 transition-colors min-w-[160px]"
      >
        <span className="text-base">{lang.emoji}</span>
        <span className="flex-1 text-left">{lang.name}</span>
        {open ? (
          <ChevronUp className="w-4 h-4 text-gray-400" />
        ) : (
          <ChevronDown className="w-4 h-4 text-gray-400" />
        )}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.96 }}
            transition={{ duration: 0.15 }}
            className="absolute left-0 top-full mt-1 z-50 w-64 bg-[#1a1a2e] border border-[#3a3a55] rounded-2xl shadow-2xl overflow-hidden"
          >
            {/* Search */}
            <div className="p-2 border-b border-[#2a2a3e]">
              <div className="flex items-center gap-2 bg-[#0d1117] rounded-lg px-3 py-2">
                <Search className="w-3.5 h-3.5 text-gray-500 shrink-0" />
                <input
                  ref={inputRef}
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search language..."
                  className="flex-1 bg-transparent text-xs text-gray-200 outline-none placeholder:text-gray-600"
                />
              </div>
            </div>
            <ScrollArea className="h-72">
              <div className="p-2">
                {groups.map((g) => (
                  <div key={g.group}>
                    <div className="px-3 py-1.5 text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                      {g.group}
                    </div>
                    {g.langs.map((l) => (
                      <button
                        type="button"
                        key={l.id}
                        onClick={() => {
                          onChange(l.id);
                          setOpen(false);
                          setSearch("");
                        }}
                        className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm transition-colors ${
                          l.id === selected
                            ? "bg-violet-600/30 text-violet-200"
                            : "text-gray-300 hover:bg-[#2a2a3e] hover:text-white"
                        }`}
                      >
                        <span className="text-base">{l.emoji}</span>
                        <span className="font-medium">{l.name}</span>
                        {l.id === selected && (
                          <span className="ml-auto text-[10px] text-violet-400">
                            ●
                          </span>
                        )}
                      </button>
                    ))}
                  </div>
                ))}
                {filtered?.length === 0 && (
                  <div className="py-6 text-center text-gray-600 text-xs italic">
                    No language found
                  </div>
                )}
              </div>
            </ScrollArea>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Console Output Panel ──────────────────────────────────────────────────────
type ConsoleTab = "output" | "errors" | "console";

function ConsolePanel({
  result,
  isRunning,
  onClear,
}: {
  result: ExecutionResult | null;
  isRunning: boolean;
  onClear: () => void;
}) {
  const [tab, setTab] = useState<ConsoleTab>("output");

  const hasError = !!(result?.stderr || result?.compileError);
  const hasOutput = !!result?.stdout;

  const copyOutput = () => {
    const text =
      tab === "output"
        ? (result?.stdout ?? "")
        : (result?.stderr ?? result?.compileError ?? "");
    navigator.clipboard
      .writeText(text)
      .then(() => toast.success("Copied to clipboard"));
  };

  return (
    <div
      className="flex flex-col overflow-hidden border border-[#3a3a55] rounded-xl"
      style={{ background: "#0d1117" }}
      data-ocid="compiler.console"
    >
      {/* Console header */}
      <div className="flex items-center gap-1 px-3 py-2 border-b border-[#1a1a2e] shrink-0">
        <div className="flex items-center gap-0.5">
          {(["output", "errors", "console"] as ConsoleTab[]).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setTab(t)}
              className={`px-3 py-1 rounded-lg text-xs font-semibold capitalize transition-colors ${
                tab === t
                  ? "bg-[#1e1e2e] text-white"
                  : "text-gray-500 hover:text-gray-300"
              }`}
              data-ocid={`compiler.console.${t}`}
            >
              {t}
              {t === "errors" && hasError && (
                <span className="ml-1 text-red-400">●</span>
              )}
              {t === "output" && hasOutput && (
                <span className="ml-1 text-green-400">●</span>
              )}
            </button>
          ))}
        </div>
        <div className="ml-auto flex items-center gap-2">
          {result?.execTimeMs != null && (
            <span className="flex items-center gap-1 text-[11px] text-gray-600">
              <Clock className="w-3 h-3" />
              {result.execTimeMs}ms
            </span>
          )}
          {result && (
            <button
              type="button"
              onClick={copyOutput}
              className="p-1 text-gray-500 hover:text-gray-200 rounded-lg hover:bg-white/5 transition-colors"
              title="Copy output"
              data-ocid="compiler.copy_output"
            >
              <Copy className="w-3.5 h-3.5" />
            </button>
          )}
          <button
            type="button"
            onClick={onClear}
            className="p-1 text-gray-500 hover:text-gray-200 rounded-lg hover:bg-white/5 transition-colors"
            title="Clear console"
            data-ocid="compiler.clear_console"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Console body */}
      <div className="flex-1 overflow-y-auto p-3 min-h-[140px] max-h-[300px] font-mono text-xs leading-5">
        {isRunning && (
          <div
            className="flex items-center gap-2 text-violet-400"
            data-ocid="compiler.loading_state"
          >
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
            <span>Compiling and running...</span>
          </div>
        )}
        {!isRunning && !result && (
          <span className="text-gray-600 italic">
            Press{" "}
            <kbd className="bg-[#1e1e2e] border border-[#3a3a55] px-1 rounded text-[10px] text-gray-400">
              Ctrl+Enter
            </kbd>{" "}
            to run
          </span>
        )}
        {!isRunning && result && tab === "output" && (
          <div
            data-ocid={
              result.exitCode === 0
                ? "compiler.success_state"
                : "compiler.error_state"
            }
          >
            {result.stdout ? (
              <pre className="text-green-300 whitespace-pre-wrap">
                {result.stdout}
              </pre>
            ) : (
              <span className="text-gray-600 italic">(no output)</span>
            )}
          </div>
        )}
        {!isRunning && result && tab === "errors" && (
          <div>
            {result.compileError && (
              <div className="mb-2">
                <div className="text-[10px] font-bold text-red-400 uppercase tracking-widest mb-1">
                  Compile Error
                </div>
                <pre className="text-red-300 whitespace-pre-wrap">
                  {result.compileError}
                </pre>
              </div>
            )}
            {result.stderr && !result.compileError && (
              <pre className="text-red-300 whitespace-pre-wrap">
                {result.stderr}
              </pre>
            )}
            {!result.compileError && !result.stderr && (
              <span className="text-gray-600 italic">No errors ✓</span>
            )}
          </div>
        )}
        {!isRunning && result && tab === "console" && (
          <div>
            <div className="text-gray-500 text-[10px] uppercase tracking-widest mb-2">
              Execution Summary
            </div>
            <div className="space-y-1">
              <div className="flex gap-2">
                <span className="text-gray-500 w-20 shrink-0">Exit code</span>
                <span
                  className={
                    result.exitCode === 0 ? "text-green-400" : "text-red-400"
                  }
                >
                  {result.exitCode}
                </span>
              </div>
              {result.execTimeMs != null && (
                <div className="flex gap-2">
                  <span className="text-gray-500 w-20 shrink-0">Time</span>
                  <span className="text-gray-300">{result.execTimeMs}ms</span>
                </div>
              )}
              <div className="flex gap-2">
                <span className="text-gray-500 w-20 shrink-0">Status</span>
                <span
                  className={
                    result.exitCode === 0 ? "text-green-400" : "text-yellow-400"
                  }
                >
                  {result.exitCode === 0 ? "✓ Success" : "⚠ Runtime Error"}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── History Panel ────────────────────────────────────────────────────────────
function HistoryPanel({
  history,
  onRestore,
  onClose,
}: {
  history: VersionEntry[];
  onRestore: (entry: VersionEntry) => void;
  onClose: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className="flex flex-col w-72 shrink-0 border border-[#3a3a55] rounded-xl overflow-hidden"
      style={{ background: "#181825" }}
      data-ocid="compiler.history.panel"
    >
      <div className="flex items-center justify-between px-4 py-3 border-b border-[#2a2a3e]">
        <span className="text-sm font-bold text-gray-200 flex items-center gap-2">
          <History className="w-4 h-4 text-violet-400" /> Version History
        </span>
        <button
          type="button"
          onClick={onClose}
          className="text-gray-500 hover:text-white"
          data-ocid="compiler.history.close_button"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
      <ScrollArea className="flex-1">
        <div className="p-2 space-y-1">
          {history.length === 0 && (
            <div
              className="py-8 text-center text-gray-600 text-xs italic"
              data-ocid="compiler.history.empty_state"
            >
              No saved versions yet. Auto-saves every 2 minutes.
            </div>
          )}
          {history.map((entry, i) => {
            const date = new Date(entry.savedAt);
            const timeStr = date.toLocaleTimeString("en-US", {
              hour: "2-digit",
              minute: "2-digit",
            });
            const dateStr = date.toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
            });
            return (
              <div
                key={`${entry.savedAt}-${i}`}
                className="flex items-start gap-2 bg-[#1e1e2e] border border-[#3a3a55] rounded-xl p-3 hover:border-violet-500/50 transition-colors group"
                data-ocid={`compiler.history.item.${i + 1}`}
              >
                <div className="flex-1 min-w-0">
                  <div className="text-[11px] text-gray-300 font-mono truncate">
                    {entry.code.split("\n")[0].slice(0, 40) || "(empty)"}
                  </div>
                  <div className="text-[10px] text-gray-600 mt-0.5">
                    {dateStr} · {timeStr}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => onRestore(entry)}
                  className="shrink-0 text-[11px] text-violet-400 hover:text-violet-200 font-semibold px-2 py-1 rounded-lg hover:bg-violet-500/20 transition-colors"
                  data-ocid={`compiler.history.restore_button.${i + 1}`}
                >
                  Restore
                </button>
              </div>
            );
          })}
        </div>
      </ScrollArea>
    </motion.div>
  );
}

// ─── Snippets Panel ────────────────────────────────────────────────────────────
function SnippetsPanel({
  snippets,
  onLoad,
  onDelete,
  onClose,
}: {
  snippets: CodeSnippet[];
  onLoad: (s: CodeSnippet) => void;
  onDelete: (id: string) => void;
  onClose: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className="flex flex-col w-72 shrink-0 border border-[#3a3a55] rounded-xl overflow-hidden"
      style={{ background: "#181825" }}
      data-ocid="compiler.snippets.panel"
    >
      <div className="flex items-center justify-between px-4 py-3 border-b border-[#2a2a3e]">
        <span className="text-sm font-bold text-gray-200 flex items-center gap-2">
          <FileText className="w-4 h-4 text-violet-400" /> My Snippets
          <span className="text-[11px] font-normal text-gray-500 bg-[#2a2a3e] px-2 py-0.5 rounded-full">
            {snippets.length}
          </span>
        </span>
        <button
          type="button"
          onClick={onClose}
          className="text-gray-500 hover:text-white"
          data-ocid="compiler.snippets.close_button"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
      <ScrollArea className="flex-1">
        <div className="p-2 space-y-1">
          {snippets.length === 0 && (
            <div
              className="py-8 text-center text-gray-600 text-xs italic"
              data-ocid="compiler.snippets.empty_state"
            >
              No saved snippets yet.
            </div>
          )}
          {snippets.map((s, idx) => {
            const lang = ALL_LANGUAGES.find((l) => l.id === s.language);
            const date = new Date(s.savedAt).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
            });
            return (
              <div
                key={s.id}
                className="flex items-center gap-2 bg-[#1e1e2e] border border-[#3a3a55] rounded-xl px-3 py-2.5 hover:border-violet-500/50 transition-colors"
                data-ocid={`compiler.item.${idx + 1}`}
              >
                <span className="text-lg shrink-0">{lang?.emoji ?? "📄"}</span>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold text-gray-200 truncate">
                    {s.name}
                  </div>
                  <div className="text-[10px] text-gray-500">
                    {lang?.name} · {date}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => onLoad(s)}
                  className="text-[11px] text-violet-400 hover:text-violet-200 font-semibold px-2 py-1 rounded-lg hover:bg-violet-500/20 transition-colors flex items-center gap-1"
                  data-ocid={`compiler.secondary_button.${idx + 1}`}
                >
                  Load <ChevronRight className="w-3 h-3" />
                </button>
                <button
                  type="button"
                  onClick={() => onDelete(s.id)}
                  className="text-gray-600 hover:text-red-400 transition-colors p-1 rounded-lg hover:bg-red-500/10"
                  data-ocid={`compiler.delete_button.${idx + 1}`}
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            );
          })}
        </div>
      </ScrollArea>
    </motion.div>
  );
}

// ─── Save Dialog ───────────────────────────────────────────────────────────────
function SaveDialog({
  defaultName,
  onSave,
  onClose,
}: {
  defaultName: string;
  onSave: (name: string) => void;
  onClose: () => void;
}) {
  const [name, setName] = useState(defaultName);
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.92 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.92 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.7)" }}
      data-ocid="compiler.dialog"
    >
      <div
        className="w-full max-w-sm rounded-2xl border border-[#3a3a55] p-6"
        style={{ background: "#1e1e2e" }}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-white">💾 Save Snippet</h3>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-500 hover:text-white"
            data-ocid="compiler.close_button"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        <Input
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) =>
            e.key === "Enter" && name.trim() && onSave(name.trim())
          }
          placeholder="Give this snippet a name..."
          className="mb-4 bg-[#0d1117] border-[#3a3a55] text-white placeholder:text-gray-600 focus:border-violet-500"
          autoFocus
          data-ocid="compiler.input"
        />
        <div className="flex gap-2">
          <Button
            onClick={() => name.trim() && onSave(name.trim())}
            disabled={!name.trim()}
            className="flex-1 bg-violet-600 hover:bg-violet-700 text-white font-bold rounded-xl"
            data-ocid="compiler.confirm_button"
          >
            <Save className="w-4 h-4 mr-2" /> Save
          </Button>
          <Button
            variant="outline"
            onClick={onClose}
            className="flex-1 border-[#3a3a55] text-gray-400 hover:text-white rounded-xl"
            data-ocid="compiler.cancel_button"
          >
            Cancel
          </Button>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function MultiLangCompiler() {
  // ── Parse URL params for shared code
  const urlParams = new URLSearchParams(window.location.search);
  const sharedCode = urlParams.get("code");
  const sharedLang = urlParams.get("lang") ?? "python";
  const initialCode = sharedCode
    ? (() => {
        try {
          return atob(sharedCode);
        } catch {
          return STARTER_CODE[sharedLang] ?? STARTER_CODE.default;
        }
      })()
    : loadLastCode(sharedLang);

  const [language, setLanguage] = useState(sharedLang);
  const [code, setCode] = useState(initialCode);
  const [filename, setFilename] = useState("main");
  const [fontSize, setFontSize] = useState(14);
  const [showMinimap, setShowMinimap] = useState(false);
  const [stdin, setStdin] = useState("");
  const [showStdin, setShowStdin] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [result, setResult] = useState<ExecutionResult | null>(null);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [snippets, setSnippets] = useState<CodeSnippet[]>(loadSnippets);
  const [history, setHistory] = useState<VersionEntry[]>(() =>
    loadVersionHistory(sharedLang),
  );
  const [sidePanel, setSidePanel] = useState<"none" | "snippets" | "history">(
    "none",
  );
  const [checkResult, setCheckResult] = useState<CheckResult | null>(null);
  const [showChecker, setShowChecker] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [editorHeight, setEditorHeight] = useState(420);

  const editorRef = useRef<Parameters<OnMount>[0] | null>(null);
  const autoSaveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const autoVersionTimer = useRef<ReturnType<typeof setInterval> | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  // Refs for use in stable callbacks
  const codeRef = useRef(code);
  const languageRef = useRef(language);
  const stdinRef = useRef(stdin);
  const isRunningRef = useRef(isRunning);
  codeRef.current = code;
  languageRef.current = language;
  stdinRef.current = stdin;
  isRunningRef.current = isRunning;

  // ── Persist last code per language
  useEffect(() => {
    localStorage.setItem(`lastCode_${language}`, code);
  }, [code, language]);

  // ── Auto-version every 2 minutes
  useEffect(() => {
    if (autoVersionTimer.current) clearInterval(autoVersionTimer.current);
    autoVersionTimer.current = setInterval(
      () => {
        const c = codeRef.current;
        const l = languageRef.current;
        if (!c.trim()) return;
        const entry: VersionEntry = {
          code: c,
          language: l,
          savedAt: new Date().toISOString(),
        };
        const updated = [entry, ...loadVersionHistory(l)].slice(0, 20);
        saveVersionHistory(l, updated);
        setHistory(updated);
      },
      2 * 60 * 1000,
    );
    return () => {
      if (autoVersionTimer.current) clearInterval(autoVersionTimer.current);
    };
  }, []);

  const handleLanguageChange = (lang: string) => {
    const langDef = ALL_LANGUAGES.find((l) => l.id === lang);
    setLanguage(lang);
    setCode(loadLastCode(lang));
    setResult(null);
    setHistory(loadVersionHistory(lang));
    if (langDef) setFilename(`main${langDef.ext}`);
    setSidePanel("none");
  };

  const handleRun = useCallback(async () => {
    const currentCode = codeRef.current;
    const currentLang = languageRef.current;
    const currentStdin = stdinRef.current;
    if (!currentCode.trim() || isRunningRef.current) return;
    setIsRunning(true);
    setResult(null);
    const start = Date.now();

    const langDef = ALL_LANGUAGES.find((l) => l.id === currentLang);

    // HTML/CSS preview — no execution
    if (currentLang === "html" || currentLang === "css") {
      setResult({
        stdout:
          currentLang === "html"
            ? "HTML preview mode. Paste in a browser to see output."
            : "CSS preview mode. Apply styles in a browser.",
        stderr: "",
        compileError: "",
        exitCode: 0,
        execTimeMs: 0,
      });
      setIsRunning(false);
      return;
    }

    const judge0Id = langDef?.judge0 ?? 71;
    if (judge0Id === 0) {
      setResult({
        stdout: "",
        stderr:
          "This language is not supported for execution in the online compiler.",
        compileError: "",
        exitCode: 1,
        execTimeMs: null,
      });
      setIsRunning(false);
      return;
    }

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000);

    try {
      const res = await fetch(
        "https://ce.judge0.com/submissions?base64_encoded=false&wait=true",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            source_code: currentCode,
            language_id: judge0Id,
            stdin: currentStdin || "",
          }),
          signal: controller.signal,
        },
      );

      if (!res.ok) throw new Error(`API ${res.status}`);
      const data = await res.json();

      const isSuccess = data.status?.id === 3;
      setResult({
        stdout: data.stdout ?? "",
        stderr: data.stderr ?? "",
        compileError: data.compile_output ?? "",
        exitCode: isSuccess ? 0 : 1,
        execTimeMs: Date.now() - start,
      });
    } catch (err: unknown) {
      const isAbort = err instanceof Error && err.name === "AbortError";
      setResult({
        stdout: "",
        stderr: isAbort
          ? "Execution timed out after 10 seconds. Check for infinite loops."
          : "Could not connect to the compiler. Please try again.",
        compileError: "",
        exitCode: 1,
        execTimeMs: null,
      });
    } finally {
      clearTimeout(timeout);
      setIsRunning(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Keyboard shortcuts (after handleRun declaration)
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const mod = e.ctrlKey || e.metaKey;
      if (mod && e.key === "Enter") {
        e.preventDefault();
        handleRun();
      }
      if (mod && e.key === "s") {
        e.preventDefault();
        setShowSaveDialog(true);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [handleRun]);

  const handleSave = (name: string) => {
    const snippet: CodeSnippet = {
      id: crypto.randomUUID(),
      name,
      language,
      code,
      stdin,
      savedAt: new Date().toISOString(),
    };
    const updated = [snippet, ...snippets];
    setSnippets(updated);
    saveSnippets(updated);
    setShowSaveDialog(false);
    toast.success(`Snippet "${name}" saved!`);
  };

  const handleLoad = (s: CodeSnippet) => {
    setLanguage(s.language);
    setCode(s.code);
    setStdin(s.stdin);
    setResult(null);
    setSidePanel("none");
    toast.success(`Loaded: ${s.name}`);
  };

  const handleDelete = (id: string) => {
    const updated = snippets.filter((s) => s.id !== id);
    setSnippets(updated);
    saveSnippets(updated);
  };

  const handleShare = () => {
    const encoded = btoa(code);
    const url = `${window.location.origin}${window.location.pathname}?code=${encoded}&lang=${language}`;
    navigator.clipboard
      .writeText(url)
      .then(() => toast.success("Shareable link copied!"));
  };

  const handleRestoreVersion = (entry: VersionEntry) => {
    setCode(entry.code);
    setSidePanel("none");
    toast.success("Version restored");
  };

  const toggleSidePanel = (panel: "snippets" | "history") => {
    setSidePanel((v) => (v === panel ? "none" : panel));
  };

  const langDef =
    ALL_LANGUAGES.find((l) => l.id === language) ?? ALL_LANGUAGES[0];
  const nextSnippetNum =
    snippets.filter((s) => s.name.startsWith("Snippet_")).length + 1;

  return (
    <div
      ref={containerRef}
      className={`flex flex-col gap-3 ${isFullscreen ? "fixed inset-0 z-40 p-3" : ""}`}
      style={isFullscreen ? { background: "#0d1117" } : {}}
    >
      {/* ── Toolbar ── */}
      <div
        className="flex flex-wrap items-center gap-2 px-3 py-2.5 rounded-xl border border-[#3a3a55]"
        style={{ background: "#1e1e2e" }}
      >
        {/* Left: lang + filename */}
        <LangSelector selected={language} onChange={handleLanguageChange} />

        <div className="flex items-center gap-1.5 bg-[#0d1117] border border-[#3a3a55] rounded-lg px-3 py-1.5 min-w-[120px]">
          <span className="text-[11px] text-gray-500 font-mono">
            {langDef.emoji}
          </span>
          <input
            value={filename}
            onChange={(e) => setFilename(e.target.value)}
            className="flex-1 bg-transparent text-xs text-gray-200 font-mono outline-none min-w-0"
            placeholder="filename"
            spellCheck={false}
            data-ocid="compiler.filename_input"
          />
        </div>

        {/* Font size */}
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => setFontSize((s) => Math.max(12, s - 1))}
            className="p-1.5 text-gray-500 hover:text-white rounded-lg hover:bg-white/5"
            title="Decrease font size"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
          <span className="text-xs text-gray-400 w-6 text-center">
            {fontSize}
          </span>
          <button
            type="button"
            onClick={() => setFontSize((s) => Math.min(20, s + 1))}
            className="p-1.5 text-gray-500 hover:text-white rounded-lg hover:bg-white/5"
            title="Increase font size"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Minimap toggle */}
        <button
          type="button"
          onClick={() => setShowMinimap((v) => !v)}
          className={`text-xs px-2.5 py-1 rounded-lg font-medium transition-colors ${showMinimap ? "bg-violet-600/30 text-violet-300" : "text-gray-500 hover:text-gray-200 bg-[#2a2a3e]"}`}
          data-ocid="compiler.minimap.toggle"
        >
          Minimap
        </button>

        {/* Right: Run + actions */}
        <div className="ml-auto flex items-center gap-2 flex-wrap">
          <button
            type="button"
            onClick={() => setShowStdin((v) => !v)}
            className="text-xs px-2.5 py-1.5 rounded-lg text-gray-400 hover:text-white bg-[#2a2a3e] hover:bg-[#3a3a55] transition-colors font-medium"
            data-ocid="compiler.stdin.toggle"
          >
            {showStdin ? "Hide" : "Show"} Input
          </button>
          <button
            type="button"
            onClick={() => toggleSidePanel("snippets")}
            className={`text-xs px-2.5 py-1.5 rounded-lg font-medium transition-colors ${sidePanel === "snippets" ? "bg-violet-600/30 text-violet-300" : "text-gray-400 hover:text-white bg-[#2a2a3e]"}`}
            data-ocid="compiler.snippets_button"
          >
            <Save className="w-3.5 h-3.5 inline mr-1" />
            My Snippets
          </button>
          <button
            type="button"
            onClick={() => toggleSidePanel("history")}
            className={`text-xs px-2.5 py-1.5 rounded-lg font-medium transition-colors ${sidePanel === "history" ? "bg-violet-600/30 text-violet-300" : "text-gray-400 hover:text-white bg-[#2a2a3e]"}`}
            data-ocid="compiler.history_button"
          >
            <History className="w-3.5 h-3.5 inline mr-1" />
            History
          </button>
          <button
            type="button"
            onClick={handleShare}
            className="text-xs px-2.5 py-1.5 rounded-lg text-gray-400 hover:text-white bg-[#2a2a3e] hover:bg-[#3a3a55] transition-colors font-medium"
            data-ocid="compiler.share_button"
          >
            <Share2 className="w-3.5 h-3.5 inline mr-1" />
            Share
          </button>
          <button
            type="button"
            onClick={() => setShowSaveDialog(true)}
            className="text-xs px-2.5 py-1.5 rounded-lg text-gray-400 hover:text-white bg-[#2a2a3e] hover:bg-[#3a3a55] transition-colors font-medium"
            data-ocid="compiler.save_button"
          >
            <Save className="w-3.5 h-3.5 inline mr-1" />
            Save
          </button>
          <button
            type="button"
            onClick={() => setIsFullscreen((v) => !v)}
            className="text-xs px-2 py-1.5 rounded-lg text-gray-400 hover:text-white bg-[#2a2a3e] hover:bg-[#3a3a55] transition-colors"
            title={isFullscreen ? "Exit fullscreen" : "Fullscreen"}
            data-ocid="compiler.fullscreen_button"
          >
            {isFullscreen ? (
              <Minimize2 className="w-3.5 h-3.5" />
            ) : (
              <Maximize2 className="w-3.5 h-3.5" />
            )}
          </button>
          <Button
            onClick={handleRun}
            disabled={isRunning || !code.trim()}
            className="h-8 px-4 font-bold rounded-xl text-white text-sm shadow-lg"
            style={{
              background: isRunning
                ? "#4c1d95"
                : "linear-gradient(135deg, #7c3aed, #6d28d9)",
              boxShadow: isRunning ? "none" : "0 4px 16px rgba(109,40,217,0.4)",
            }}
            data-ocid="compiler.primary_button"
          >
            {isRunning ? (
              <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />
            ) : (
              <Play className="w-3.5 h-3.5 mr-1.5" />
            )}
            {isRunning ? "Running…" : "Run"}
          </Button>
        </div>
      </div>

      {/* ── Stdin Panel ── */}
      <AnimatePresence initial={false}>
        {showStdin && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div
              className="border border-[#3a3a55] rounded-xl overflow-hidden"
              style={{ background: "#181825" }}
            >
              <div className="px-4 py-2 border-b border-[#2a2a3e] text-xs text-gray-500 font-semibold uppercase tracking-widest">
                Standard Input (stdin)
              </div>
              <textarea
                value={stdin}
                onChange={(e) => setStdin(e.target.value)}
                placeholder="Provide program input here (one value per line)..."
                rows={3}
                className="w-full font-mono text-sm bg-transparent text-gray-300 px-4 py-3 resize-none outline-none placeholder:text-gray-600"
                data-ocid="compiler.stdin.textarea"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Editor + Side Panel ── */}
      <div className="flex gap-3 min-w-0">
        {/* Monaco Editor */}
        <div
          className="flex-1 min-w-0 border border-[#3a3a55] rounded-xl overflow-hidden"
          style={{ height: editorHeight }}
          data-ocid="compiler.editor"
        >
          <Editor
            height="100%"
            language={langDef.monacoLang}
            value={code}
            onChange={(v) => {
              setCode(v ?? "");
              // Debounce auto-save to localStorage
              if (autoSaveTimer.current) clearTimeout(autoSaveTimer.current);
              autoSaveTimer.current = setTimeout(() => {
                localStorage.setItem(`lastCode_${language}`, v ?? "");
              }, 500);
            }}
            theme="vs-dark"
            options={{
              fontSize,
              fontFamily:
                "'JetBrains Mono', 'Fira Code', 'Cascadia Code', monospace",
              fontLigatures: true,
              minimap: { enabled: showMinimap },
              scrollBeyondLastLine: false,
              lineNumbers: "on",
              folding: true,
              automaticLayout: true,
              tabSize: 2,
              wordWrap: "on",
              smoothScrolling: true,
              cursorBlinking: "smooth",
              renderLineHighlight: "gutter",
              bracketPairColorization: { enabled: true },
              suggest: { showWords: true },
              quickSuggestions: true,
              padding: { top: 12, bottom: 12 },
            }}
            onMount={(editor) => {
              editorRef.current = editor;
              editor.addCommand(
                // Monaco KeyMod.CtrlCmd | KeyCode.Enter = 2048 | 3
                2048 | 3,
                () => handleRun(),
              );
            }}
          />
        </div>

        {/* Side panels */}
        <AnimatePresence>
          {sidePanel === "snippets" && (
            <SnippetsPanel
              snippets={snippets}
              onLoad={handleLoad}
              onDelete={handleDelete}
              onClose={() => setSidePanel("none")}
            />
          )}
          {sidePanel === "history" && (
            <HistoryPanel
              history={history}
              onRestore={handleRestoreVersion}
              onClose={() => setSidePanel("none")}
            />
          )}
        </AnimatePresence>
      </div>

      {/* ── Resize handle ── */}
      <div
        className="h-2 flex items-center justify-center cursor-row-resize select-none rounded-full group"
        onMouseDown={(e) => {
          e.preventDefault();
          const startY = e.clientY;
          const startH = editorHeight;
          const onMove = (ev: MouseEvent) => {
            const delta = ev.clientY - startY;
            setEditorHeight(Math.max(200, Math.min(800, startH + delta)));
          };
          const onUp = () => {
            document.removeEventListener("mousemove", onMove);
            document.removeEventListener("mouseup", onUp);
          };
          document.addEventListener("mousemove", onMove);
          document.addEventListener("mouseup", onUp);
        }}
        data-ocid="compiler.resize_handle"
        aria-label="Drag to resize editor"
      >
        <div className="w-16 h-1 rounded-full bg-[#3a3a55] group-hover:bg-violet-500 transition-colors" />
      </div>

      {/* ── Console ── */}
      <ConsolePanel
        result={result}
        isRunning={isRunning}
        onClear={() => setResult(null)}
      />

      {/* ── Code Checker ── */}
      {result && (
        <div
          className="rounded-xl border border-[#3a3a55] overflow-hidden"
          style={{ background: "#181825" }}
        >
          <button
            type="button"
            onClick={() => setShowChecker((v) => !v)}
            className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-gray-200 hover:text-white transition-colors"
            data-ocid="compiler.checker.toggle"
          >
            <span className="text-base">
              {checkResult?.status === "correct"
                ? "✅"
                : checkResult?.status === "error" ||
                    checkResult?.status === "wrong"
                  ? "⚠️"
                  : "🔍"}
            </span>
            <span className="flex-1 text-left">Code Checker</span>
            <span className="text-[11px] font-normal text-gray-500">
              {checkResult
                ? checkResult.status === "correct"
                  ? "Looks good!"
                  : checkResult.message
                : "Check for issues"}
            </span>
            {showChecker ? (
              <ChevronUp className="w-4 h-4 text-gray-400" />
            ) : (
              <ChevronDown className="w-4 h-4 text-gray-400" />
            )}
          </button>
          <AnimatePresence initial={false}>
            {showChecker && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.22 }}
                className="overflow-hidden"
              >
                <div className="border-t border-[#2a2a3e] p-4">
                  <CodeChecker
                    code={code}
                    language={language}
                    mode="free"
                    onResult={setCheckResult}
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* ── Save Dialog ── */}
      <AnimatePresence>
        {showSaveDialog && (
          <SaveDialog
            defaultName={`Snippet_${nextSnippetNum}`}
            onSave={handleSave}
            onClose={() => setShowSaveDialog(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
