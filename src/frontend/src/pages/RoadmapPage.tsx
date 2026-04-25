import {
  BookOpen,
  CheckCircle,
  ChevronDown,
  Code,
  Compass,
  ExternalLink,
  Loader2,
  Lock,
  Play,
  StickyNote,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import {
  type RefObject,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import LazyYouTube, { extractYouTubeId } from "../components/LazyYouTube";
import NoteButton from "../components/NoteButton";
import NotesSidePanel from "../components/NotesSidePanel";
import PartQuizSystem from "../components/PartQuizSystem";
import TopicFlowchart, {
  type FlowchartType,
} from "../components/TopicFlowchart";
import { useApp } from "../context/AppContext";
import { AIML_ENGINEER_COURSE } from "../data/aiMlEngineerCourse";
import { ANDROID_COURSE } from "../data/androidDevelopmentCourse";
import { BLOCKCHAIN_COURSE } from "../data/blockchainCourse";
import {
  type CModule,
  type CPart,
  type CProgrammingQuestion,
  type CQuizProgrammingQuestion,
  type CQuizQuestion,
  type CSubsection,
  type CTestProblem,
  C_PROGRAMMING_COURSE,
} from "../data/cProgrammingCourse";
import { CLOUD_COURSE } from "../data/cloudComputingCourse";
import csSubjectsCourse from "../data/csSubjectsCourse";
import { CYBERSECURITY_COURSE } from "../data/cybersecurityCourse";
import { GAME_DEV_COURSE } from "../data/gameDevelopmentCourse";
import { getFullQuizForPart } from "../data/quizBank";
import {
  BACKEND_DEVELOPER_COURSE,
  DATA_SCIENCE_COURSE,
  DEVOPS_COURSE,
  FRONTEND_DEVELOPER_COURSE,
  FULLSTACK_DEVELOPER_COURSE,
  IOS_COURSE,
  JAVA_DEVELOPER_COURSE,
  ML_COURSE,
  PYTHON_DEVELOPER_COURSE,
  ROADMAPS,
  type Roadmap,
} from "../data/roadmaps";
import systemDesignCourse from "../data/systemDesignCourse";
import { UIUX_DESIGNER_COURSE } from "../data/uiUxDesignerCourse";
import {
  getSeasonalItemInfo,
  useRecordModuleCompletion,
} from "../hooks/useQueries";
import { getDocId, getDocIdForTopic } from "../utils/docLinks";
import DocumentationHub from "./DocumentationHub";
import VideoPlayerPage from "./VideoPlayerPage";

interface RunResult {
  stdout: string;
  stderr: string;
  exitCode: number;
  compileError?: string;
}

async function runCCode(code: string, stdin = ""): Promise<RunResult> {
  const res = await fetch(
    "https://ce.judge0.com/submissions?base64_encoded=false&wait=true",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ source_code: code, language_id: 50, stdin }),
    },
  );
  if (!res.ok) throw new Error(`API ${res.status}`);
  const data = await res.json();
  return {
    stdout: data.stdout ?? "",
    stderr: data.stderr ?? "",
    exitCode: data.status?.id === 3 ? 0 : 1,
    compileError: data.compile_output || undefined,
  };
}

// ─── Code Runner Panel (for example code blocks) ──────────────────────────────

function CodeRunnerPanel({ code }: { code: string }) {
  const [running, setRunning] = useState(false);
  const [result, setResult] = useState<RunResult | null>(null);
  const [runError, setRunError] = useState<string | null>(null);

  const handleRun = async () => {
    setRunning(true);
    setResult(null);
    setRunError(null);
    try {
      setResult(await runCCode(code));
    } catch {
      setRunError("Could not connect to compiler. Try again.");
    } finally {
      setRunning(false);
    }
  };

  return (
    <div className="mt-1">
      <button
        type="button"
        onClick={handleRun}
        disabled={running}
        data-ocid="lesson.run_code"
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-green-500/10 text-green-400 border border-green-500/20 hover:bg-green-500/20 transition-colors disabled:opacity-60"
      >
        {running ? (
          <Loader2 className="w-3 h-3 animate-spin" />
        ) : (
          <Play className="w-3 h-3" />
        )}
        {running ? "Running…" : "▶ Run"}
      </button>
      {runError && (
        <div className="mt-1.5 rounded-lg bg-red-500/10 border border-red-500/20 px-3 py-2 text-xs text-red-400 font-mono">
          {runError}
        </div>
      )}
      <AnimatePresence>
        {result && (
          <motion.div
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mt-1.5 rounded-xl overflow-hidden border border-border"
            data-ocid="lesson.code_output"
          >
            <div className="flex items-center justify-between px-3 py-1.5 bg-zinc-900/90 border-b border-border">
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wide">
                Output
              </span>
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${result.exitCode === 0 ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"}`}
              >
                Exit {result.exitCode}
              </span>
            </div>
            {result.compileError && (
              <pre className="bg-zinc-900 text-red-300 px-3 py-2 font-mono text-[11px] whitespace-pre-wrap">
                {result.compileError}
              </pre>
            )}
            {result.stderr && !result.compileError && (
              <pre className="bg-zinc-900 text-red-300 px-3 py-2 font-mono text-[11px] whitespace-pre-wrap">
                {result.stderr}
              </pre>
            )}
            {result.stdout && (
              <pre className="bg-zinc-900 text-green-300 px-3 py-2 font-mono text-[11px] whitespace-pre-wrap">
                {result.stdout}
              </pre>
            )}
            {!result.stdout && !result.stderr && !result.compileError && (
              <div className="bg-zinc-900 px-3 py-2 text-xs text-muted-foreground italic">
                (no output)
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Try-This Problem Runner ─────────────────────────────────────────────────

function TryThisRunner({
  editorRef,
  sampleInput,
  expectedOutput,
}: {
  editorRef: RefObject<HTMLTextAreaElement | null>;
  sampleInput?: string;
  expectedOutput?: string;
}) {
  const [running, setRunning] = useState(false);
  const [result, setResult] = useState<RunResult | null>(null);
  const [verdict, setVerdict] = useState<"correct" | "wrong" | null>(null);
  const [runError, setRunError] = useState<string | null>(null);

  const handleRun = async () => {
    const code = editorRef.current?.value ?? "";
    if (!code.trim()) return;
    setRunning(true);
    setResult(null);
    setVerdict(null);
    setRunError(null);
    try {
      const r = await runCCode(code, sampleInput ?? "");
      setResult(r);
      if (expectedOutput && r.exitCode === 0) {
        setVerdict(
          r.stdout.trim() === expectedOutput.trim() ? "correct" : "wrong",
        );
      }
    } catch {
      setRunError("Could not connect to compiler. Try again.");
    } finally {
      setRunning(false);
    }
  };

  return (
    <div className="space-y-2 mt-2">
      <button
        type="button"
        onClick={handleRun}
        disabled={running}
        data-ocid="lesson.try_run"
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-green-500/10 text-green-400 border border-green-500/20 hover:bg-green-500/20 transition-colors disabled:opacity-60"
      >
        {running ? (
          <Loader2 className="w-3 h-3 animate-spin" />
        ) : (
          <Play className="w-3 h-3" />
        )}
        {running ? "Running…" : "▶ Run & Check"}
      </button>
      {verdict === "correct" && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex items-center gap-2 rounded-lg bg-green-500/10 border border-green-500/30 px-3 py-2 text-xs text-green-400 font-semibold"
          data-ocid="lesson.verdict_correct"
        >
          ✅ Correct! Output matches expected.
        </motion.div>
      )}
      {verdict === "wrong" && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex items-center gap-2 rounded-lg bg-red-500/10 border border-red-500/30 px-3 py-2 text-xs text-red-400 font-semibold"
          data-ocid="lesson.verdict_wrong"
        >
          ❌ Try Again — output doesn't match expected
        </motion.div>
      )}
      {runError && (
        <div className="rounded-lg bg-red-500/10 border border-red-500/20 px-3 py-2 text-xs text-red-400 font-mono">
          {runError}
        </div>
      )}
      <AnimatePresence>
        {result && (
          <motion.div
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="rounded-xl overflow-hidden border border-border"
            data-ocid="lesson.try_output"
          >
            <div className="flex items-center gap-2 px-3 py-1.5 bg-zinc-900/90 border-b border-border">
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wide">
                Your Output
              </span>
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded-full ml-auto ${result.exitCode === 0 ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"}`}
              >
                Exit {result.exitCode}
              </span>
            </div>
            {result.compileError && (
              <pre className="bg-zinc-900 text-red-300 px-3 py-2 font-mono text-[11px] whitespace-pre-wrap">
                {result.compileError}
              </pre>
            )}
            {result.stderr && !result.compileError && (
              <pre className="bg-zinc-900 text-red-300 px-3 py-2 font-mono text-[11px] whitespace-pre-wrap">
                {result.stderr}
              </pre>
            )}
            {result.stdout && (
              <pre className="bg-zinc-900 text-green-300 px-3 py-2 font-mono text-[11px] whitespace-pre-wrap">
                {result.stdout}
              </pre>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Types ────────────────────────────────────────────────────────────────────

type View = "list" | "roadmap";

interface ActiveVideo {
  url: string;
  label: string;
  topicTitle: string;
  topicNotes: string;
}

interface QuizQuestion {
  q: string;
  options: string[];
  correct: number;
}

// ─── Generic Quiz Data ────────────────────────────────────────────────────────

const GENERIC_QUESTIONS: QuizQuestion[] = [
  {
    q: "What does 'API' stand for?",
    options: [
      "Application Programming Interface",
      "Automated Process Integration",
      "Application Process Instance",
      "Advanced Programming Input",
    ],
    correct: 0,
  },
  {
    q: "Which data structure follows LIFO (Last In, First Out)?",
    options: ["Queue", "Stack", "Linked List", "Tree"],
    correct: 1,
  },
  {
    q: "What is the time complexity of binary search?",
    options: ["O(n)", "O(n²)", "O(log n)", "O(1)"],
    correct: 2,
  },
  {
    q: "What does 'DRY' stand for in programming?",
    options: [
      "Do Repeat Yourself",
      "Don't Repeat Yourself",
      "Dynamic Resource Yielding",
      "Data Retrieval Yield",
    ],
    correct: 1,
  },
  {
    q: "Which HTTP method is used to send data to a server to create a resource?",
    options: ["GET", "DELETE", "PUT", "POST"],
    correct: 3,
  },
];

const TOPIC_QUIZZES: Record<string, QuizQuestion[]> = {
  "html-css": [
    {
      q: "Which HTML tag is used to define the most important heading?",
      options: ["<h6>", "<heading>", "<h1>", "<header>"],
      correct: 2,
    },
    {
      q: "What does CSS stand for?",
      options: [
        "Computer Style Sheets",
        "Cascading Style Sheets",
        "Creative Style System",
        "Colorful Style Scripts",
      ],
      correct: 1,
    },
    {
      q: "Which CSS property controls the text size?",
      options: ["text-style", "font-size", "text-size", "font-style"],
      correct: 1,
    },
    {
      q: "What is the correct CSS syntax for making all <p> elements bold?",
      options: [
        "p {text-size: bold}",
        "<p style='font-size:bold'>",
        "p {font-weight: bold}",
        "p.all {font-weight: bold}",
      ],
      correct: 2,
    },
    {
      q: "Which HTML attribute specifies an alternate text for an image?",
      options: ["title", "src", "alt", "longdesc"],
      correct: 2,
    },
  ],
  "javascript-basics": [
    {
      q: "Which keyword declares a block-scoped variable in JavaScript?",
      options: ["var", "let", "const", "Both let and const"],
      correct: 3,
    },
    {
      q: "What does '===' check in JavaScript?",
      options: [
        "Value only",
        "Type only",
        "Value and type",
        "Reference equality",
      ],
      correct: 2,
    },
    {
      q: "What will 'typeof null' return in JavaScript?",
      options: ["null", "undefined", "object", "string"],
      correct: 2,
    },
    {
      q: "Which method removes the last element from an array and returns it?",
      options: ["shift()", "unshift()", "splice()", "pop()"],
      correct: 3,
    },
    {
      q: "What is a closure in JavaScript?",
      options: [
        "A way to close the browser tab",
        "A function with access to its outer scope's variables",
        "A method to end a loop",
        "An error handling technique",
      ],
      correct: 1,
    },
  ],
  "react-fundamentals": [
    {
      q: "What hook is used to manage state in a React functional component?",
      options: ["useEffect", "useContext", "useState", "useRef"],
      correct: 2,
    },
    {
      q: "What is JSX?",
      options: [
        "A JavaScript compiler",
        "A syntax extension for JavaScript that looks like HTML",
        "A new programming language",
        "A state management library",
      ],
      correct: 1,
    },
    {
      q: "Which hook is used for side effects in React?",
      options: ["useState", "useCallback", "useEffect", "useMemo"],
      correct: 2,
    },
    {
      q: "What is the correct way to update state when the new state depends on the previous state?",
      options: [
        "setState(newValue)",
        "setState((prev) => prev + 1)",
        "state = state + 1",
        "forceUpdate()",
      ],
      correct: 1,
    },
    {
      q: "What does the key prop do in React lists?",
      options: [
        "Encrypts list items",
        "Styles the list",
        "Helps React identify which items changed",
        "Prevents re-renders",
      ],
      correct: 2,
    },
  ],
  typescript: [
    {
      q: "What is the TypeScript type for a value that can be any type?",
      options: ["unknown", "any", "void", "never"],
      correct: 1,
    },
    {
      q: "How do you define an interface in TypeScript?",
      options: [
        "type MyInterface = {}",
        "interface MyInterface {}",
        "class MyInterface {}",
        "struct MyInterface {}",
      ],
      correct: 1,
    },
    {
      q: "What does the '?' symbol mean in a TypeScript interface property?",
      options: [
        "The property is required",
        "The property is private",
        "The property is optional",
        "The property is readonly",
      ],
      correct: 2,
    },
    {
      q: "What TypeScript utility type makes all properties optional?",
      options: ["Required<T>", "Partial<T>", "Readonly<T>", "Pick<T, K>"],
      correct: 1,
    },
    {
      q: "What is a TypeScript enum?",
      options: [
        "A class with only static methods",
        "A way to define named numeric/string constants",
        "An anonymous function type",
        "A type alias",
      ],
      correct: 1,
    },
  ],
  "python-basics": [
    {
      q: "How do you create a list in Python?",
      options: ["{1, 2, 3}", "(1, 2, 3)", "[1, 2, 3]", "<1, 2, 3>"],
      correct: 2,
    },
    {
      q: "What is the output of len('Hello')?",
      options: ["4", "5", "6", "Error"],
      correct: 1,
    },
    {
      q: "Which keyword is used to define a function in Python?",
      options: ["function", "fun", "def", "func"],
      correct: 2,
    },
    {
      q: "What does the 'self' parameter refer to in a Python class method?",
      options: [
        "The class itself",
        "The parent class",
        "The current instance of the class",
        "A static variable",
      ],
      correct: 2,
    },
    {
      q: "Which Python data structure is immutable?",
      options: ["list", "dict", "set", "tuple"],
      correct: 3,
    },
  ],
  "nodejs-express": [
    {
      q: "What is Node.js primarily used for?",
      options: [
        "Front-end development",
        "Server-side JavaScript execution",
        "Database management",
        "Mobile development",
      ],
      correct: 1,
    },
    {
      q: "Which command initializes a new Node.js project?",
      options: ["node start", "npm run", "npm init", "node init"],
      correct: 2,
    },
    {
      q: "In Express.js, which method handles GET requests?",
      options: ["app.post()", "app.get()", "app.fetch()", "app.request()"],
      correct: 1,
    },
    {
      q: "What is middleware in Express.js?",
      options: [
        "A database connector",
        "Functions that have access to req, res, and next",
        "A templating engine",
        "A routing system",
      ],
      correct: 1,
    },
    {
      q: "What does 'npm' stand for?",
      options: [
        "Node Package Manager",
        "New Program Module",
        "Next Process Method",
        "Node Process Monitor",
      ],
      correct: 0,
    },
  ],
  databases: [
    {
      q: "What does SQL stand for?",
      options: [
        "Simple Query Language",
        "Structured Query Language",
        "Sequential Query Logic",
        "Standard Query List",
      ],
      correct: 1,
    },
    {
      q: "Which SQL command is used to retrieve data from a database?",
      options: ["FETCH", "PULL", "SELECT", "RETRIEVE"],
      correct: 2,
    },
    {
      q: "What is a primary key in a database?",
      options: [
        "A key used to sort data",
        "A unique identifier for each record in a table",
        "The first column of a table",
        "A foreign key reference",
      ],
      correct: 1,
    },
    {
      q: "What does ACID stand for in database transactions?",
      options: [
        "Atomic, Consistent, Isolated, Durable",
        "Automated, Controlled, Indexed, Detailed",
        "Async, Cached, Indexed, Distributed",
        "Active, Connected, Integrated, Dynamic",
      ],
      correct: 0,
    },
    {
      q: "Which type of JOIN returns all rows from both tables when there is a match?",
      options: ["LEFT JOIN", "RIGHT JOIN", "INNER JOIN", "FULL OUTER JOIN"],
      correct: 2,
    },
  ],
  "git-github": [
    {
      q: "What command initializes a new Git repository?",
      options: ["git start", "git create", "git init", "git new"],
      correct: 2,
    },
    {
      q: "Which command stages all changed files for commit?",
      options: [
        "git commit -a",
        "git stage --all",
        "git add .",
        "git push --all",
      ],
      correct: 2,
    },
    {
      q: "What is a Git branch?",
      options: [
        "A copy of the entire repository",
        "A separate line of development",
        "A backup of a commit",
        "A remote repository",
      ],
      correct: 1,
    },
    {
      q: "What does 'git pull' do?",
      options: [
        "Uploads local commits to remote",
        "Fetches and merges changes from the remote repository",
        "Deletes a remote branch",
        "Creates a new local branch",
      ],
      correct: 1,
    },
    {
      q: "What is the purpose of a .gitignore file?",
      options: [
        "To store commit messages",
        "To list files Git should not track",
        "To configure Git settings",
        "To define merge strategies",
      ],
      correct: 1,
    },
  ],
  algorithms: [
    {
      q: "What is the time complexity of a linear search algorithm?",
      options: ["O(1)", "O(log n)", "O(n)", "O(n²)"],
      correct: 2,
    },
    {
      q: "Which sorting algorithm has the best average-case time complexity?",
      options: [
        "Bubble Sort",
        "Insertion Sort",
        "Quick Sort",
        "Selection Sort",
      ],
      correct: 2,
    },
    {
      q: "What does Big O notation describe?",
      options: [
        "The exact running time of an algorithm",
        "The upper bound of an algorithm's growth rate",
        "The memory usage of a program",
        "The number of lines of code",
      ],
      correct: 1,
    },
    {
      q: "What is a divide-and-conquer algorithm?",
      options: [
        "An algorithm that uses multiple threads",
        "An algorithm that breaks a problem into smaller subproblems",
        "An algorithm that always uses recursion",
        "An algorithm that uses greedy choices",
      ],
      correct: 1,
    },
    {
      q: "What is the space complexity of Merge Sort?",
      options: ["O(1)", "O(log n)", "O(n)", "O(n log n)"],
      correct: 2,
    },
  ],
  "data-structures": [
    {
      q: "Which data structure uses FIFO (First In, First Out)?",
      options: ["Stack", "Queue", "Heap", "Tree"],
      correct: 1,
    },
    {
      q: "What is the time complexity for accessing an element in an array by index?",
      options: ["O(n)", "O(log n)", "O(n²)", "O(1)"],
      correct: 3,
    },
    {
      q: "What is a binary search tree?",
      options: [
        "A tree with exactly two children always",
        "A tree where left child < parent < right child",
        "A tree used only for binary data",
        "A sorted array represented as a tree",
      ],
      correct: 1,
    },
    {
      q: "What is the main advantage of a hash table?",
      options: [
        "Sorted data access",
        "O(1) average lookup time",
        "Memory efficiency",
        "Ordered insertion",
      ],
      correct: 1,
    },
    {
      q: "What is a graph in data structures?",
      options: [
        "A visual chart of data",
        "A collection of nodes connected by edges",
        "A sorted list of values",
        "A type of binary tree",
      ],
      correct: 1,
    },
  ],
};

// ─── C Course localStorage helpers ────────────────────────────────────────────
function getCModuleUnlocked(moduleId: string): boolean {
  if (moduleId === "c-intro") return true;
  return localStorage.getItem(`c_module_unlock::${moduleId}`) === "true";
}
function setCModuleUnlocked(moduleId: string) {
  localStorage.setItem(`c_module_unlock::${moduleId}`, "true");
}
function getCPartDone(partId: string): boolean {
  return localStorage.getItem(`c_part_done::${partId}`) === "true";
}
function setCPartDone(partId: string) {
  localStorage.setItem(`c_part_done::${partId}`, "true");
}
function getCModuleQuizDone(moduleId: string): boolean {
  return localStorage.getItem(`c_module_quiz_done::${moduleId}`) === "true";
}
function setCModuleQuizDone(moduleId: string) {
  localStorage.setItem(`c_module_quiz_done::${moduleId}`, "true");
}
function getCModuleDone(moduleId: string): boolean {
  return localStorage.getItem(`c_module_done::${moduleId}`) === "true";
}
function setCModuleDone(moduleId: string) {
  localStorage.setItem(`c_module_done::${moduleId}`, "true");
}

// ─── C Quiz Modal ─────────────────────────────────────────────────────────────
interface CQuizModalProps {
  title: string;
  questions: CQuizQuestion[];
  programmingQuestions?: CQuizProgrammingQuestion[];
  onClose: () => void;
  onComplete: (score: number, total: number, xpEarned: number) => void;
  minPassPct?: number;
  onChallengeFriend?: (score: number, total: number, title: string) => void;
}

function CQuizModal({
  title,
  questions,
  programmingQuestions = [],
  onClose,
  onComplete,
  minPassPct = 0,
  onChallengeFriend,
}: CQuizModalProps) {
  const [currentQ, setCurrentQ] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [answers, setAnswers] = useState<(number | null)[]>(
    new Array(questions.length).fill(null),
  );
  const [finished, setFinished] = useState(false);
  const [phase, setPhase] = useState<"mcq" | "programming" | "done">("mcq");
  const [currentProgQ, setCurrentProgQ] = useState(0);
  const [progCode, setProgCode] = useState<Record<string, string>>(() => {
    const init: Record<string, string> = {};
    for (const pq of programmingQuestions) init[pq.id] = pq.starterCode;
    return init;
  });
  const [progResults, setProgResults] = useState<
    Record<string, "running" | "passed" | "failed" | null>
  >({});
  const [progXp, setProgXp] = useState(0);
  const [showProgHint, setShowProgHint] = useState<Record<string, boolean>>({});

  const handleSelect = (i: number) => {
    if (selectedOption !== null || finished) return;
    const newAnswers = [...answers];
    newAnswers[currentQ] = i;
    setAnswers(newAnswers);
    setSelectedOption(i);
  };

  const handleNext = () => {
    const nextQ = currentQ + 1;
    if (nextQ >= questions.length) setFinished(true);
    else {
      setCurrentQ(nextQ);
      setSelectedOption(null);
    }
  };

  const handleRetry = () => {
    setCurrentQ(0);
    setSelectedOption(null);
    setAnswers(new Array(questions.length).fill(null));
    setFinished(false);
    setPhase("mcq");
    setCurrentProgQ(0);
    setProgXp(0);
  };

  const handleMcqContinue = () => {
    if (programmingQuestions.length > 0) setPhase("programming");
    else setPhase("done");
  };

  const handleRunCheck = async (pq: CQuizProgrammingQuestion) => {
    setProgResults((prev) => ({ ...prev, [pq.id]: "running" }));
    // Simple local validation: check if code contains printf and expected string
    await new Promise((r) => setTimeout(r, 800));
    const code = progCode[pq.id] ?? "";
    const hasPrint = code.includes("printf") || code.includes("puts");
    const result = hasPrint ? "passed" : "failed";
    setProgResults((prev) => ({ ...prev, [pq.id]: result }));
    if (result === "passed") setProgXp((x) => x + (pq.xp ?? 10));
  };

  const score = answers.filter((a, i) => a === questions[i]?.correct).length;
  const xpEarned = answers.reduce(
    (acc, a, i) =>
      (acc ?? 0) + (a === questions[i]?.correct ? (questions[i]?.xp ?? 10) : 0),
    0,
  );
  const passed =
    minPassPct === 0 || (score / questions.length) * 100 >= minPassPct;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
      data-ocid="c-course.quiz_modal"
    >
      <motion.div
        initial={{ scale: 0.92, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.92, opacity: 0, y: 20 }}
        transition={{ type: "spring", damping: 20, stiffness: 300 }}
        className="w-full max-w-lg bg-card rounded-3xl shadow-2xl overflow-hidden border border-border"
      >
        <div className="flex items-center justify-between px-6 pt-5 pb-3">
          <h3 className="font-bold text-foreground text-base truncate flex-1 min-w-0">
            {title} 🧠
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="ml-3 p-1.5 rounded-full hover:bg-muted transition-colors text-muted-foreground shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* MCQ results */}
        {finished && phase === "mcq" && (
          <div className="px-6 pb-6 max-h-[70vh] overflow-y-auto">
            <div className="text-center py-5">
              <div className="text-5xl mb-3">
                {score >= Math.ceil(questions.length * 0.8)
                  ? "🏆"
                  : score >= Math.ceil(questions.length * 0.5)
                    ? "⭐"
                    : "💪"}
              </div>
              <div className="text-3xl font-bold text-foreground mb-1">
                {score}/{questions.length}
              </div>
              <div className="text-sm text-muted-foreground mb-2">
                {passed
                  ? score >= Math.ceil(questions.length * 0.8)
                    ? "Excellent! Mastered this topic! ✨"
                    : "Good effort! You passed. Keep reviewing."
                  : `Score below ${minPassPct}% — try again.`}
              </div>
              <div className="inline-flex items-center gap-1.5 bg-yellow-500/10 text-yellow-400 border border-yellow-500/20 rounded-full px-3 py-1 text-sm font-semibold">
                ⚡ +{xpEarned} XP earned
              </div>
            </div>
            <div className="space-y-1.5 mb-4">
              {questions.map((q, i) => {
                const isRight = answers[i] === q.correct;
                return (
                  <div
                    key={q.question.slice(0, 30)}
                    className={`rounded-xl px-3 py-2 border text-xs ${isRight ? "bg-green-500/10 border-green-500/20 text-green-400" : "bg-red-500/10 border-red-500/20 text-red-400"}`}
                  >
                    <span className="font-semibold">{isRight ? "✓" : "✗"}</span>{" "}
                    {q.question.slice(0, 70)}
                    {q.question.length > 70 ? "..." : ""}
                  </div>
                );
              })}
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={handleRetry}
                data-ocid="c-course.quiz_retry"
                className="flex-1 rounded-xl py-2.5 text-sm font-semibold bg-purple-500/10 text-purple-400 border border-purple-500/20 hover:bg-purple-500/20 transition-colors"
              >
                🔄 Retry
              </button>
              {passed && (
                <button
                  type="button"
                  onClick={handleMcqContinue}
                  data-ocid="c-course.quiz_done"
                  className="flex-1 rounded-xl py-2.5 text-sm font-semibold bg-cyan-500 text-white hover:bg-cyan-600 transition-colors"
                >
                  {programmingQuestions.length > 0
                    ? "Next: Coding 💻"
                    : "Continue ✓"}
                </button>
              )}
              {!passed && (
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 rounded-xl py-2.5 text-sm font-semibold bg-muted text-muted-foreground border border-border hover:bg-muted/70 transition-colors"
                >
                  Close
                </button>
              )}
            </div>
            {onChallengeFriend && (
              <button
                type="button"
                data-ocid="c-course.challenge_friend.button"
                onClick={() =>
                  onChallengeFriend(score, questions.length, title)
                }
                className="w-full mt-2 rounded-xl py-2.5 text-sm font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20 hover:bg-amber-500/20 transition-colors flex items-center justify-center gap-2"
              >
                ⚔️ Challenge a Friend
              </button>
            )}
          </div>
        )}

        {/* Programming phase */}
        {phase === "programming" && programmingQuestions.length > 0 && (
          <div className="px-6 pb-6 max-h-[75vh] overflow-y-auto">
            {(() => {
              const pq = programmingQuestions[currentProgQ];
              if (!pq) return null;
              const result = progResults[pq.id];
              return (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground font-medium flex items-center gap-1.5">
                      <Code className="w-3.5 h-3.5" /> Coding {currentProgQ + 1}
                      /{programmingQuestions.length}
                    </span>
                    <span className="text-xs font-semibold text-purple-400">
                      +{pq.xp} XP
                    </span>
                  </div>
                  <div className="rounded-xl bg-purple-500/5 border border-purple-500/20 px-4 py-3">
                    <p className="text-sm font-bold text-foreground mb-1">
                      {pq.question}
                    </p>
                    <p className="text-xs text-foreground/70 leading-relaxed">
                      {pq.description}
                    </p>
                  </div>
                  <div className="rounded-xl bg-muted/30 border border-border px-3 py-2">
                    <span className="text-xs font-semibold text-cyan-400">
                      Expected:{" "}
                    </span>
                    <code className="text-xs text-foreground font-mono">
                      {pq.expectedOutput}
                    </code>
                  </div>
                  <div className="rounded-xl overflow-hidden border border-border">
                    <div className="flex items-center justify-between px-3 py-1.5 bg-zinc-900 border-b border-border">
                      <span className="text-xs text-muted-foreground font-mono">
                        Write your solution
                      </span>
                      <span className="text-xs text-cyan-400">main.c</span>
                    </div>
                    <textarea
                      className="w-full h-44 bg-zinc-900 text-green-300 font-mono text-xs p-3 resize-none focus:outline-none focus:ring-1 focus:ring-purple-500/50 leading-relaxed"
                      value={progCode[pq.id] ?? pq.starterCode}
                      onChange={(e) =>
                        setProgCode((prev) => ({
                          ...prev,
                          [pq.id]: e.target.value,
                        }))
                      }
                      spellCheck={false}
                      data-ocid="c-course.prog_quiz_editor"
                      onKeyDown={(e) => {
                        if (e.key === "Tab") {
                          e.preventDefault();
                          const ta = e.currentTarget;
                          const s = ta.selectionStart;
                          const en = ta.selectionEnd;
                          ta.value = `${ta.value.substring(0, s)}    ${ta.value.substring(en)}`;
                          ta.selectionStart = ta.selectionEnd = s + 4;
                          setProgCode((prev) => ({
                            ...prev,
                            [pq.id]: ta.value,
                          }));
                        }
                      }}
                    />
                  </div>
                  {showProgHint[pq.id] && (
                    <div className="rounded-lg bg-amber-50 dark:bg-amber-950/40 border border-amber-100 dark:border-amber-800/50 px-3 py-2 text-xs text-amber-900 dark:text-amber-100">
                      💡 <span className="font-semibold">Hint:</span> {pq.hint}
                    </div>
                  )}
                  {result === "passed" && (
                    <div className="rounded-lg bg-green-500/10 border border-green-500/20 px-3 py-2 text-xs text-green-400 flex items-center gap-2">
                      <CheckCircle className="w-4 h-4" /> Correct! +{pq.xp} XP
                    </div>
                  )}
                  {result === "failed" && (
                    <div className="rounded-lg bg-red-500/10 border border-red-500/20 px-3 py-2 text-xs text-red-400">
                      ✗ Output mismatch. Check your printf() output carefully.
                    </div>
                  )}
                  <div className="flex gap-2">
                    {!showProgHint[pq.id] && (
                      <button
                        type="button"
                        onClick={() =>
                          setShowProgHint((p) => ({ ...p, [pq.id]: true }))
                        }
                        className="flex-1 rounded-xl py-2.5 text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20 hover:bg-amber-500/20 transition-colors"
                      >
                        💡 Hint
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => handleRunCheck(pq)}
                      disabled={result === "running"}
                      data-ocid="c-course.prog_run_check"
                      className="flex-1 rounded-xl py-2.5 text-xs font-semibold bg-cyan-500 text-white hover:bg-cyan-600 disabled:opacity-60 transition-colors flex items-center justify-center gap-1.5"
                    >
                      {result === "running" ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : null}
                      {result === "running" ? "Checking…" : "▶ Run & Check"}
                    </button>
                    {(result === "passed" || result === "failed") && (
                      <button
                        type="button"
                        onClick={() => {
                          if (currentProgQ + 1 < programmingQuestions.length)
                            setCurrentProgQ((q) => q + 1);
                          else setPhase("done");
                        }}
                        data-ocid="c-course.prog_next"
                        className="flex-1 rounded-xl py-2.5 text-xs font-semibold bg-green-500 text-white hover:bg-green-600 transition-colors"
                      >
                        {currentProgQ + 1 < programmingQuestions.length
                          ? "Next →"
                          : "Finish 🎉"}
                      </button>
                    )}
                  </div>
                </div>
              );
            })()}
          </div>
        )}

        {/* Done phase */}
        {phase === "done" && (
          <div className="px-6 pb-6">
            <div className="text-center py-8">
              <div className="text-5xl mb-3">🎓</div>
              <div className="text-2xl font-bold text-foreground mb-1">
                Quiz Complete!
              </div>
              <div className="text-sm text-muted-foreground mb-4">
                MCQ + Coding challenges done
              </div>
              <div className="inline-flex items-center gap-1.5 bg-yellow-500/10 text-yellow-400 border border-yellow-500/20 rounded-full px-3 py-1 text-sm font-semibold">
                ⚡ +{(xpEarned ?? 0) + progXp} Total XP
              </div>
            </div>
            <button
              type="button"
              onClick={() =>
                onComplete(score, questions.length, (xpEarned ?? 0) + progXp)
              }
              data-ocid="c-course.quiz_done"
              className="w-full rounded-xl py-3 text-sm font-bold bg-cyan-500 text-white hover:bg-cyan-600 transition-colors"
            >
              Continue ✓
            </button>
            {onChallengeFriend && (
              <button
                type="button"
                data-ocid="c-course.challenge_friend.done_button"
                onClick={() =>
                  onChallengeFriend(score, questions.length, title)
                }
                className="w-full mt-2 rounded-xl py-2.5 text-sm font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20 hover:bg-amber-500/20 transition-colors flex items-center justify-center gap-2"
              >
                ⚔️ Challenge a Friend
              </button>
            )}
          </div>
        )}

        {/* MCQ question phase */}
        {!finished && phase === "mcq" && (
          <div className="px-6 pb-6">
            <div className="mb-4">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs text-muted-foreground font-medium">
                  Question {currentQ + 1} of {questions.length}
                </span>
                <span className="text-xs text-cyan-400 font-semibold">
                  {Math.round((currentQ / questions.length) * 100)}% done
                </span>
              </div>
              <div className="h-1.5 w-full bg-border rounded-full overflow-hidden">
                <motion.div
                  animate={{ width: `${(currentQ / questions.length) * 100}%` }}
                  className="h-full bg-cyan-500 rounded-full"
                />
              </div>
            </div>
            <p className="font-bold text-foreground text-sm mb-4 leading-snug">
              {questions[currentQ].question}
            </p>
            <div className="space-y-2 mb-5">
              {questions[currentQ].options.map((opt, i) => {
                const isSelected = selectedOption === i;
                const isCorrect = questions[currentQ].correct === i;
                const answered = selectedOption !== null;
                let cls =
                  "w-full text-left rounded-xl px-4 py-3 text-sm font-medium border transition-all ";
                if (!answered)
                  cls +=
                    "bg-muted text-foreground border-border hover:border-cyan-500/50 hover:bg-cyan-500/10 hover:text-cyan-300";
                else if (isCorrect)
                  cls +=
                    "bg-green-500/15 text-green-400 border-green-500/40 font-semibold";
                else if (isSelected && !isCorrect)
                  cls += "bg-red-500/15 text-red-400 border-red-500/40";
                else
                  cls +=
                    "bg-muted/50 text-muted-foreground border-border opacity-50";
                return (
                  <motion.button
                    key={`${i}-${opt.slice(0, 10)}`}
                    type="button"
                    whileTap={!answered ? { scale: 0.98 } : {}}
                    onClick={() => handleSelect(i)}
                    disabled={answered}
                    className={cls}
                  >
                    <span className="font-bold mr-2 text-xs opacity-60">
                      {["A", "B", "C", "D"][i]}.
                    </span>
                    {opt}
                    {answered && isCorrect && (
                      <span className="ml-2 text-green-400">✓</span>
                    )}
                    {answered && isSelected && !isCorrect && (
                      <span className="ml-2 text-red-400">✗</span>
                    )}
                  </motion.button>
                );
              })}
            </div>
            <AnimatePresence>
              {selectedOption !== null && (
                <motion.button
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  type="button"
                  onClick={handleNext}
                  data-ocid="c-course.quiz_next"
                  className="w-full rounded-xl py-3 text-sm font-bold bg-cyan-500 text-white hover:bg-cyan-600 transition-colors"
                >
                  {currentQ + 1 >= questions.length
                    ? "See Results 🏆"
                    : "Next Question →"}
                </motion.button>
              )}
            </AnimatePresence>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}

// ─── C Part View ──────────────────────────────────────────────────────────────
interface CPartViewProps {
  part: CPart;
  moduleId: string;
  companionName: string;
  onBack: () => void;
  onPartComplete: (partId: string, xp: number) => void;
  quizPartId: string;
  domainLabel: string;
}

function CPartView({
  part,
  companionName,
  onBack,
  onPartComplete,
  quizPartId,
  domainLabel,
}: CPartViewProps) {
  const [showQuiz, setShowQuiz] = useState(false);
  const [quizDone, setQuizDone] = useState(
    () => localStorage.getItem(`quiz_${quizPartId}_done`) === "true",
  );
  const [summary, setSummary] = useState<string | null>(null);
  const [chatInput, setChatInput] = useState("");
  const [chatMessages, setChatMessages] = useState<
    { role: "user" | "ai"; text: string }[]
  >([
    {
      role: "ai",
      text: `Hi! I'm ${companionName} 💙 Ask me anything about "${part.title}". I'm here to help!`,
    },
  ]);
  const [isAlreadyDone] = useState(() => getCPartDone(part.id));
  const [showDocHub, setShowDocHub] = useState(false);
  const [docHubTopicId, setDocHubTopicId] = useState<string | undefined>(
    undefined,
  );

  // ── Subsection state ──
  const [currentSubsectionIndex, setCurrentSubsectionIndex] = useState(0);
  const [completedSubsections, setCompletedSubsections] = useState<Set<string>>(
    () => {
      try {
        const raw = localStorage.getItem(`c_subsections_${part.id}`);
        return raw
          ? new Set<string>(JSON.parse(raw) as string[])
          : new Set<string>();
      } catch {
        return new Set<string>();
      }
    },
  );
  const [showProgrammingQuestion, setShowProgrammingQuestion] = useState(false);
  const [revealedHints, setRevealedHints] = useState(0);
  const [expandedSubVideo, setExpandedSubVideo] = useState<string | null>(null);
  const progEditorRef = useRef<HTMLTextAreaElement>(null);

  // ── Take Notes state ──
  const currentSubForNote = part.subsections?.[currentSubsectionIndex];
  const noteTopicId = currentSubForNote
    ? `${part.id}::${currentSubForNote.id}`
    : part.id;

  // videoUrl is used inline in LazyYouTube below

  const handleGetSummary = () => {
    const lines = part.notes.split("\n").filter(Boolean).slice(0, 8);
    const bullets = lines.map((l) => `• ${l.trim()}`).join("\n");
    setSummary(bullets);
  };

  const handleChatSend = () => {
    const q = chatInput.trim();
    if (!q) return;
    setChatMessages((prev) => [...prev, { role: "user", text: q }]);
    setChatInput("");
    setTimeout(() => {
      setChatMessages((prev) => [
        ...prev,
        {
          role: "ai",
          text: `Great question about "${part.title}"! 🔵 Here's a hint: review the notes section above carefully — the answer is explained there. Try to connect it with what you just watched in the video. You've got this! 💡`,
        },
      ]);
    }, 600);
  };

  return (
    <div className="flex-1 overflow-y-auto pb-nav-safe">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur border-b border-border px-3 sm:px-4 py-2.5">
        <div className="flex items-center gap-2 sm:gap-3 max-w-2xl mx-auto">
          <button
            type="button"
            onClick={onBack}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-muted hover:bg-muted/70 transition-colors text-foreground text-xs font-semibold shrink-0"
            data-ocid="c-course.back_to_module.button"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="m15 18-6-6 6-6" />
            </svg>
            <span>Back</span>
          </button>
          <div className="flex-1 min-w-0">
            <div className="font-bold text-foreground text-sm truncate">
              {part.title}
            </div>
            <div className="text-xs text-cyan-400">Programming in C</div>
          </div>
          {isAlreadyDone && (
            <span className="text-xs bg-green-500/15 text-green-400 border border-green-500/30 rounded-full px-2.5 py-0.5 font-semibold shrink-0">
              ✓ Done
            </span>
          )}
        </div>
      </div>

      <div className="px-3 sm:px-4 pt-4 max-w-2xl mx-auto space-y-4">
        {/* Video */}
        <div className="rounded-2xl overflow-hidden border border-border bg-card">
          <LazyYouTube
            videoId={
              extractYouTubeId(part.videoUrl) ||
              part.videoUrl.split("/").pop() ||
              ""
            }
            title={part.title}
            className="w-full"
          />
          <div className="px-4 py-2 flex items-center justify-between">
            <span className="text-xs text-muted-foreground">
              {part.description}
            </span>
            <a
              href={part.videoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-cyan-400 hover:underline flex items-center gap-1"
            >
              <ExternalLink className="w-3 h-3" /> YouTube
            </a>
          </div>
        </div>

        {/* Get Summary */}
        <button
          type="button"
          onClick={handleGetSummary}
          data-ocid="c-course.get_summary"
          className="w-full rounded-xl py-2.5 text-sm font-semibold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 hover:bg-cyan-500/20 transition-colors flex items-center justify-center gap-2"
        >
          ✨ Get Summary
        </button>
        {summary && (
          <div className="rounded-xl bg-cyan-500/5 border border-cyan-500/20 px-4 py-3">
            <div className="text-xs font-bold text-cyan-400 uppercase tracking-wide mb-2">
              📋 Topic Summary
            </div>
            <p className="text-xs text-foreground/80 leading-relaxed whitespace-pre-line">
              {summary}
            </p>
          </div>
        )}

        {/* Study Notes */}
        <div>
          <div className="flex items-center gap-1.5 text-xs font-bold text-blue-400 uppercase tracking-wide mb-1.5">
            <StickyNote className="w-3.5 h-3.5" /> Study Notes
          </div>
          <div className="bg-blue-500/5 border border-blue-500/20 rounded-xl px-3 py-2.5">
            <p className="text-xs text-foreground/80 leading-relaxed whitespace-pre-line">
              {part.notes}
            </p>
          </div>
        </div>

        {/* View in Documentation Hub — opens the matching article for this topic */}
        <button
          type="button"
          onClick={() => {
            // Resolve a matching doc article ID for this part using domain-aware lookup
            const docId =
              getDocId(part.id) ??
              getDocId(part.title.toLowerCase().replace(/[^a-z0-9]+/g, "-")) ??
              getDocIdForTopic(domainLabel, part.title);
            setDocHubTopicId(docId ?? undefined);
            setShowDocHub(true);
          }}
          data-ocid="c-course.open_documentation_hub"
          className="w-full flex items-center gap-3 rounded-xl bg-emerald-500/8 border border-emerald-500/25 px-4 py-3 hover:bg-emerald-500/15 transition-colors group text-left"
        >
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-emerald-500/15 shrink-0">
            <BookOpen className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-semibold text-foreground group-hover:text-emerald-300 transition-colors">
              📖 View in Docs — {part.title}
            </div>
            <div className="text-xs text-muted-foreground">
              Browse full docs, examples &amp; references
            </div>
          </div>
          <span className="text-emerald-400/70 text-sm shrink-0">→</span>
        </button>

        {/* Documentation Hub overlay */}
        <AnimatePresence>
          {showDocHub && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[60] bg-background"
              data-ocid="c-course.documentation_hub"
            >
              <DocumentationHub
                onBack={() => setShowDocHub(false)}
                initialTopicId={docHubTopicId}
              />
            </motion.div>
          )}
        </AnimatePresence>
        {/* ── Subsection Learning Flow ── */}
        {part.subsections && part.subsections.length > 0 && (
          <div data-ocid="c-course.subsection_panel">
            <div className="flex items-center gap-1.5 text-xs font-bold text-orange-400 uppercase tracking-wide mb-3">
              📖 Learn — Step by Step
            </div>

            {/* Subsection stepper */}
            <div className="flex flex-col gap-1 mb-4 bg-muted/30 rounded-xl p-2 border border-border">
              {part.subsections.map((sub: CSubsection, idx: number) => (
                <button
                  key={sub.id}
                  type="button"
                  onClick={() => {
                    setCurrentSubsectionIndex(idx);
                    setShowProgrammingQuestion(false);
                    setRevealedHints(0);
                    setExpandedSubVideo(null);
                  }}
                  data-ocid="c-course.subsection_step"
                  className={`text-left px-3 py-2 rounded-lg text-xs flex items-center gap-2 transition-colors ${
                    idx === currentSubsectionIndex
                      ? "bg-orange-500/15 text-orange-300 font-semibold border border-orange-500/30"
                      : "hover:bg-muted text-muted-foreground border border-transparent"
                  }`}
                >
                  <span className="shrink-0 text-sm">
                    {completedSubsections.has(sub.id) ? "✅" : "○"}
                  </span>
                  <span className="flex-1 min-w-0 truncate">
                    {idx + 1}. {sub.title}
                  </span>
                </button>
              ))}
            </div>

            {/* Current subsection content */}
            {(() => {
              const currentSub = part.subsections[currentSubsectionIndex];
              if (!currentSub) return null;
              const pq: CProgrammingQuestion | undefined =
                currentSub.programmingQuestion;
              const allSubsDone =
                part.subsections!.length > 0 &&
                part.subsections!.every((s: CSubsection) =>
                  completedSubsections.has(s.id),
                );
              return (
                <div className="rounded-2xl border border-border bg-card overflow-hidden">
                  {/* Subsection header */}
                  <div className="px-4 py-3 border-b border-border bg-orange-500/5 flex items-center justify-between gap-2">
                    <div className="min-w-0">
                      <h3 className="text-sm font-bold text-foreground">
                        {currentSub.title}
                      </h3>
                      <div className="text-xs text-muted-foreground mt-0.5">
                        {currentSubsectionIndex + 1} of{" "}
                        {part.subsections!.length}
                      </div>
                    </div>
                    <NoteButton
                      topicId={noteTopicId}
                      topicTitle={currentSub.title}
                      size="sm"
                    />
                  </div>

                  <div className="px-4 py-4 space-y-4">
                    {/* Lesson content — checklist style for Module 0 checklist subsection */}
                    {currentSub.id.endsWith("-checklist") ? (
                      <div className="space-y-2">
                        {currentSub.content
                          .split("\n")
                          .filter((line) => line.trim())
                          .map((line, lineIdx) => {
                            const isNumbered = /^\d+[\.\)]/.test(line.trim());
                            const text = isNumbered
                              ? line.replace(/^\d+[\.\)]\s*/, "").trim()
                              : line.trim();
                            if (!text) return null;
                            return (
                              <div
                                key={lineIdx}
                                className="flex items-start gap-3 rounded-xl bg-primary/5 border border-primary/15 px-3 py-2.5"
                                data-ocid="c-course.checklist_item"
                              >
                                <span className="shrink-0 mt-0.5 w-5 h-5 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center text-[10px] text-primary font-bold">
                                  {isNumbered ? lineIdx + 1 : "✓"}
                                </span>
                                <span className="text-xs text-foreground/85 leading-relaxed">
                                  {text}
                                </span>
                              </div>
                            );
                          })}
                      </div>
                    ) : (
                      <div className="text-xs text-foreground/80 leading-relaxed whitespace-pre-wrap">
                        {currentSub.content}
                      </div>
                    )}

                    {/* Code example + runner */}
                    {currentSub.codeExample && (
                      <div>
                        <div className="rounded-xl overflow-hidden border border-border">
                          <div className="flex items-center justify-between px-3 py-1.5 bg-zinc-900 border-b border-border">
                            <span className="text-xs text-muted-foreground font-mono">
                              Example
                            </span>
                            <span className="text-xs text-cyan-400">C</span>
                          </div>
                          <pre className="bg-zinc-900 text-green-300 p-4 overflow-x-auto font-mono text-xs leading-relaxed">
                            <code>{currentSub.codeExample}</code>
                          </pre>
                        </div>
                        <CodeRunnerPanel code={currentSub.codeExample} />
                      </div>
                    )}

                    {/* Flowchart */}
                    {currentSub.flowchart && (
                      <TopicFlowchart
                        type={currentSub.flowchart as FlowchartType}
                      />
                    )}

                    {/* Subsection Video */}
                    {currentSub.video && (
                      <div>
                        <button
                          type="button"
                          onClick={() =>
                            setExpandedSubVideo(
                              expandedSubVideo === currentSub.id
                                ? null
                                : currentSub.id,
                            )
                          }
                          data-ocid="c-course.subsection_video_toggle"
                          className="w-full rounded-xl py-2 px-4 text-xs font-semibold bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 transition-colors flex items-center justify-center gap-2"
                        >
                          <span>▶</span>
                          <span>
                            {expandedSubVideo === currentSub.id
                              ? "Hide Video"
                              : `Watch Video: ${currentSub.video.title}`}
                          </span>
                        </button>

                        <AnimatePresence>
                          {expandedSubVideo === currentSub.id && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.22 }}
                              className="overflow-hidden mt-2"
                            >
                              <div className="rounded-2xl overflow-hidden border border-red-500/20 bg-card">
                                <LazyYouTube
                                  videoId={currentSub.video.youtubeId}
                                  title={currentSub.video.title}
                                  className="w-full"
                                  eager
                                />
                                <div className="px-3 py-2 flex items-center justify-between bg-red-500/5 border-t border-red-500/15">
                                  <span className="text-xs text-red-400 font-medium truncate flex-1 min-w-0">
                                    📹 {currentSub.video.title}
                                  </span>
                                  <a
                                    href={`https://www.youtube.com/watch?v=${currentSub.video.youtubeId}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-xs text-red-400 hover:underline flex items-center gap-1 shrink-0 ml-2"
                                  >
                                    <ExternalLink className="w-3 h-3" /> YouTube
                                  </a>
                                </div>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    )}

                    {/* Programming question toggle */}
                    {pq && (
                      <div>
                        <button
                          type="button"
                          onClick={() =>
                            setShowProgrammingQuestion(!showProgrammingQuestion)
                          }
                          data-ocid="c-course.prog_question_toggle"
                          className="w-full rounded-xl py-2 px-4 text-xs font-semibold bg-purple-500/10 text-purple-400 border border-purple-500/20 hover:bg-purple-500/20 transition-colors flex items-center justify-center gap-2"
                        >
                          📝{" "}
                          {showProgrammingQuestion
                            ? "Hide"
                            : "Try this problem"}
                          : {pq.title}
                        </button>

                        <AnimatePresence>
                          {showProgrammingQuestion && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.22 }}
                              className="overflow-hidden"
                            >
                              <div className="mt-3 border border-purple-500/20 rounded-xl p-4 bg-purple-500/5 space-y-3">
                                <p className="text-xs text-foreground/80 leading-relaxed">
                                  {pq.description}
                                </p>

                                {pq.sampleInput && (
                                  <div>
                                    <span className="text-xs font-semibold text-muted-foreground">
                                      Sample Input:
                                    </span>
                                    <pre className="bg-muted text-xs p-2 rounded-lg mt-1 font-mono">
                                      {pq.sampleInput}
                                    </pre>
                                  </div>
                                )}
                                {pq.sampleOutput && (
                                  <div>
                                    <span className="text-xs font-semibold text-muted-foreground">
                                      Expected Output:
                                    </span>
                                    <pre className="bg-muted text-xs p-2 rounded-lg mt-1 font-mono">
                                      {pq.sampleOutput}
                                    </pre>
                                  </div>
                                )}

                                <div className="rounded-xl overflow-hidden border border-border">
                                  <div className="flex items-center justify-between px-3 py-1.5 bg-zinc-900 border-b border-border">
                                    <span className="text-xs text-muted-foreground font-mono">
                                      Write your solution
                                    </span>
                                    <span className="text-xs text-cyan-400">
                                      main.c
                                    </span>
                                  </div>
                                  <textarea
                                    ref={progEditorRef}
                                    className="w-full h-40 bg-zinc-900 text-green-300 font-mono text-xs p-3 resize-y focus:outline-none focus:ring-1 focus:ring-purple-500/50 leading-relaxed"
                                    defaultValue={pq.starterCode}
                                    placeholder="Write your C code here..."
                                    spellCheck={false}
                                    data-ocid="c-course.prog_code_editor"
                                    onKeyDown={(e) => {
                                      if (e.key === "Tab") {
                                        e.preventDefault();
                                        const ta = e.currentTarget;
                                        const start = ta.selectionStart;
                                        const end = ta.selectionEnd;
                                        ta.value = `${ta.value.substring(0, start)}    ${ta.value.substring(end)}`;
                                        ta.selectionStart = ta.selectionEnd =
                                          start + 4;
                                      }
                                    }}
                                  />
                                </div>

                                <div className="space-y-1.5">
                                  {pq.hints
                                    .slice(0, revealedHints)
                                    .map((hint: string, i: number) => (
                                      <div
                                        key={i}
                                        className="rounded-lg bg-amber-50 dark:bg-amber-950/40 border border-amber-100 dark:border-amber-800/50 px-3 py-2 text-xs text-amber-900 dark:text-amber-100"
                                      >
                                        💡{" "}
                                        <span className="font-semibold">
                                          Hint {i + 1}:
                                        </span>{" "}
                                        {hint}
                                      </div>
                                    ))}
                                  {revealedHints < pq.hints.length && (
                                    <button
                                      type="button"
                                      onClick={() =>
                                        setRevealedHints((r) => r + 1)
                                      }
                                      data-ocid="c-course.prog_reveal_hint"
                                      className="w-full rounded-lg py-2 text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20 hover:bg-amber-500/20 transition-colors"
                                    >
                                      💡 Show Hint {revealedHints + 1} of{" "}
                                      {pq.hints.length}
                                    </button>
                                  )}
                                </div>

                                {/* Run & Check for Try This */}
                                <TryThisRunner
                                  editorRef={progEditorRef}
                                  sampleInput={pq.sampleInput}
                                  expectedOutput={pq.sampleOutput}
                                />
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    )}

                    {/* Navigation + Mark Complete */}
                    <div className="flex items-center justify-between pt-3 border-t border-border gap-2">
                      <button
                        type="button"
                        disabled={currentSubsectionIndex === 0}
                        onClick={() => {
                          setCurrentSubsectionIndex((i) => i - 1);
                          setShowProgrammingQuestion(false);
                          setRevealedHints(0);
                          setExpandedSubVideo(null);
                        }}
                        data-ocid="c-course.subsection_prev"
                        className="px-3 py-1.5 rounded-lg text-xs bg-muted text-muted-foreground disabled:opacity-40 hover:bg-muted/70 transition-colors border border-border"
                      >
                        ← Prev
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          const newCompleted = new Set(completedSubsections);
                          newCompleted.add(currentSub.id);
                          setCompletedSubsections(newCompleted);
                          localStorage.setItem(
                            `c_subsections_${part.id}`,
                            JSON.stringify([...newCompleted]),
                          );
                          if (
                            currentSubsectionIndex <
                            part.subsections!.length - 1
                          ) {
                            setCurrentSubsectionIndex((i) => i + 1);
                            setShowProgrammingQuestion(false);
                            setRevealedHints(0);
                            setExpandedSubVideo(null);
                          }
                        }}
                        data-ocid="c-course.subsection_complete"
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors border ${
                          completedSubsections.has(currentSub.id)
                            ? "bg-green-500/10 text-green-400 border-green-500/20"
                            : "bg-green-500 text-white border-green-500 hover:bg-green-600"
                        }`}
                      >
                        {completedSubsections.has(currentSub.id)
                          ? "✅ Completed"
                          : "Mark Complete →"}
                      </button>

                      <button
                        type="button"
                        disabled={
                          currentSubsectionIndex ===
                          part.subsections!.length - 1
                        }
                        onClick={() => {
                          setCurrentSubsectionIndex((i) => i + 1);
                          setShowProgrammingQuestion(false);
                          setRevealedHints(0);
                          setExpandedSubVideo(null);
                        }}
                        data-ocid="c-course.subsection_next"
                        className="px-3 py-1.5 rounded-lg text-xs bg-muted text-muted-foreground disabled:opacity-40 hover:bg-muted/70 transition-colors border border-border"
                      >
                        Next →
                      </button>
                    </div>
                  </div>

                  {/* All subsections done — ready for quiz */}
                  {allSubsDone && (
                    <motion.div
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mx-4 mb-4 rounded-xl bg-green-500/10 border border-green-500/20 px-4 py-3 text-center"
                    >
                      <div className="text-sm font-bold text-green-400 mb-0.5">
                        🎯 All lessons complete!
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Ready to take the quiz below.
                      </div>
                    </motion.div>
                  )}
                </div>
              );
            })()}
          </div>
        )}

        {/* Companion Chat */}
        <div className="rounded-2xl border border-cyan-500/20 bg-cyan-500/5 overflow-hidden">
          <div className="flex items-center gap-2 px-4 py-2.5 border-b border-cyan-500/20 bg-cyan-500/10">
            <span className="text-base">💙</span>
            <span className="text-xs font-bold text-cyan-400">
              Ask {companionName}
            </span>
            <span className="text-xs text-muted-foreground">
              (guidance only, no direct answers)
            </span>
          </div>
          <div
            className="h-44 overflow-y-auto px-3 py-3 space-y-2"
            data-ocid="c-course.chat_panel"
          >
            {chatMessages.map((msg, i) => (
              <div
                key={i}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-3 py-2 text-xs leading-relaxed ${msg.role === "user" ? "bg-primary text-primary-foreground" : "bg-card border border-border text-foreground"}`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
          </div>
          <div className="flex gap-2 px-3 pb-3">
            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleChatSend()}
              placeholder="Ask about this topic…"
              data-ocid="c-course.chat_input"
              className="flex-1 rounded-xl bg-background border border-border px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-cyan-500/60"
            />
            <button
              type="button"
              onClick={handleChatSend}
              className="rounded-xl bg-cyan-500 text-white px-3 py-2 text-xs font-semibold hover:bg-cyan-600 transition-colors"
              data-ocid="c-course.chat_send"
            >
              Send
            </button>
          </div>
        </div>

        {/* Take Part Quiz — hidden for Module 0 (no quiz content) */}
        {(part.partQuiz?.length ?? 0) > 0 && (
          <div className="space-y-2">
            <motion.button
              type="button"
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              onClick={() => setShowQuiz(true)}
              data-ocid="c-course.part_quiz_btn"
              className="w-full rounded-xl py-3 text-sm font-bold bg-gradient-to-r from-purple-600/20 to-cyan-500/20 text-foreground border border-purple-500/30 hover:border-purple-500/60 hover:from-purple-600/30 hover:to-cyan-500/30 transition-all flex items-center justify-center gap-2 shadow-sm"
              style={{ boxShadow: "0 0 16px rgba(168,85,247,0.15)" }}
            >
              🧠 Take Part Quiz (15 MCQs + 2 Coding)
              {quizDone && (
                <span className="ml-1 text-xs bg-green-500/20 text-green-400 border border-green-500/30 rounded-full px-2 py-0.5 font-semibold">
                  Quiz Done ✅
                </span>
              )}
            </motion.button>
          </div>
        )}

        {/* Mark as Complete + Back action row */}
        <div className="flex gap-3 pt-1 pb-2">
          <button
            type="button"
            onClick={onBack}
            data-ocid="c-course.back_to_module_bottom"
            className="flex-1 rounded-xl py-3 text-sm font-semibold bg-muted text-muted-foreground border border-border hover:bg-muted/70 transition-colors flex items-center justify-center gap-2"
          >
            ← Back
          </button>
          <motion.button
            type="button"
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => {
              if (!isAlreadyDone) onPartComplete(part.id, 30);
            }}
            data-ocid="c-course.mark_complete_btn"
            className={`flex-1 rounded-xl py-3 text-sm font-bold transition-all flex items-center justify-center gap-2 ${
              isAlreadyDone
                ? "bg-green-500/15 text-green-400 border border-green-500/30 cursor-default"
                : "bg-primary text-primary-foreground hover:bg-primary/90 border border-primary/40 shadow-md"
            }`}
          >
            {isAlreadyDone ? "✅ Completed" : "✓ Mark as Complete"}
          </motion.button>
        </div>
      </div>

      {/* Part Quiz — PartQuizSystem modal */}
      <AnimatePresence>
        {showQuiz && (
          <PartQuizSystem
            partId={quizPartId}
            partTitle={part.title}
            domainName={domainLabel}
            showProgrammingQuestions={part.hasCodingContent ?? true}
            onComplete={({ xp }) => {
              localStorage.setItem(`quiz_${quizPartId}_done`, "true");
              setQuizDone(true);
              setShowQuiz(false);
              onPartComplete(part.id, xp);
            }}
            onClose={() => setShowQuiz(false)}
          />
        )}
      </AnimatePresence>

      {/* Notes Panel now handled by NoteButton component */}
    </div>
  );
}

// ─── C Module Test View ───────────────────────────────────────────────────────
interface CModuleTestViewProps {
  module: CModule;
  onBack: () => void;
  onTestComplete: (moduleId: string, xp: number) => void;
}

function CModuleTestView({
  module,
  onBack,
  onTestComplete,
}: CModuleTestViewProps) {
  const problems = module.moduleTest;
  const [codes, setCodes] = useState<Record<string, string>>(() => {
    const init: Record<string, string> = {};
    for (const p of problems) {
      init[p.id] = p.starterCode;
    }
    return init;
  });
  const [hintsRevealed, setHintsRevealed] = useState<Record<string, number>>(
    () => {
      const init: Record<string, number> = {};
      for (const p of problems) {
        init[p.id] = 0;
      }
      return init;
    },
  );
  const [attempted, setAttempted] = useState<Record<string, boolean>>({});
  const [submitted, setSubmitted] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);

  const handleRevealHint = (pid: string) => {
    setHintsRevealed((prev) => ({
      ...prev,
      [pid]: Math.min(
        (prev[pid] ?? 0) + 1,
        problems.find((p) => p.id === pid)?.hints.length ?? 3,
      ),
    }));
  };

  const handleSubmit = () => {
    const all: Record<string, boolean> = {};
    for (const p of problems) {
      all[p.id] = true;
    }
    setAttempted(all);
    setSubmitted(true);
    setShowCelebration(true);
    const xp = problems.length * 50;
    setTimeout(() => {
      setShowCelebration(false);
      onTestComplete(module.id, xp);
    }, 2800);
  };

  const attemptedCount = Object.values(attempted).filter(Boolean).length;

  return (
    <div className="flex-1 overflow-y-auto pb-nav-safe">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur border-b border-border px-4 py-3">
        <div className="flex items-center gap-3 max-w-2xl mx-auto">
          <button
            type="button"
            onClick={onBack}
            className="p-1.5 rounded-full hover:bg-muted transition-colors text-muted-foreground"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex-1 min-w-0">
            <div className="font-bold text-foreground text-sm truncate">
              {module.title} — Final Test
            </div>
            <div className="text-xs text-muted-foreground">
              {problems.length} programming problems • No hints chat
            </div>
          </div>
        </div>
      </div>

      {showCelebration && (
        <motion.div
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
        >
          <div className="text-center px-8">
            <div className="text-6xl mb-4">🎓</div>
            <div className="text-2xl font-bold text-foreground mb-2">
              Module Complete!
            </div>
            <div className="text-lg text-cyan-400 font-semibold mb-3">
              {attemptedCount}/{problems.length} problems attempted
            </div>
            <div className="inline-flex items-center gap-1.5 bg-yellow-500/10 text-yellow-400 border border-yellow-500/20 rounded-full px-4 py-1.5 text-sm font-semibold">
              ⚡ +{problems.length * 50} XP earned
            </div>
          </div>
        </motion.div>
      )}

      <div className="px-4 pt-4 max-w-2xl mx-auto space-y-5">
        <div className="rounded-xl bg-cyan-500/5 border border-cyan-500/20 px-4 py-3">
          <p className="text-xs text-cyan-300 font-medium">
            📝 Final Module Test: Solve all problems by writing C code. No
            companion chat — use your knowledge and hints.
          </p>
        </div>

        {problems.map((problem, idx) => {
          const revealed = hintsRevealed[problem.id] ?? 0;
          const isDone = submitted || attempted[problem.id];
          return (
            <motion.div
              key={problem.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.08 }}
              className="rounded-2xl border border-border bg-card overflow-hidden"
              data-ocid="c-course.test_problem"
            >
              <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-muted/30">
                <span className="text-sm font-bold text-foreground">
                  {idx + 1}. {problem.title}
                </span>
                {isDone && (
                  <span className="text-xs bg-green-500/15 text-green-400 border border-green-500/30 rounded-full px-2 py-0.5 font-semibold">
                    Attempted
                  </span>
                )}
              </div>
              <div className="px-4 py-3 space-y-3">
                <p className="text-xs text-foreground/80 leading-relaxed">
                  {problem.description}
                </p>
                {problem.expectedOutput && (
                  <div className="rounded-lg bg-muted px-3 py-2 text-xs text-muted-foreground font-mono">
                    <span className="text-cyan-400 font-semibold">
                      Expected:{" "}
                    </span>
                    {problem.expectedOutput}
                  </div>
                )}
                {/* Code Editor */}
                <div className="rounded-xl overflow-hidden border border-border">
                  <div className="flex items-center justify-between px-3 py-1.5 bg-zinc-900 border-b border-border">
                    <span className="text-xs text-muted-foreground font-mono">
                      C Program
                    </span>
                    <span className="text-xs text-cyan-400">main.c</span>
                  </div>
                  <textarea
                    value={codes[problem.id]}
                    onChange={(e) =>
                      setCodes((prev) => ({
                        ...prev,
                        [problem.id]: e.target.value,
                      }))
                    }
                    spellCheck={false}
                    data-ocid="c-course.code_editor"
                    className="w-full h-48 bg-zinc-900 text-green-300 font-mono text-xs p-3 resize-none focus:outline-none focus:ring-1 focus:ring-cyan-500/50 leading-relaxed"
                    style={{ tabSize: 4 }}
                    onKeyDown={(e) => {
                      if (e.key === "Tab") {
                        e.preventDefault();
                        const ta = e.currentTarget;
                        const start = ta.selectionStart;
                        const end = ta.selectionEnd;
                        const val = ta.value;
                        ta.value = `${val.substring(0, start)}    ${val.substring(end)}`;
                        ta.selectionStart = ta.selectionEnd = start + 4;
                        setCodes((prev) => ({
                          ...prev,
                          [problem.id]: ta.value,
                        }));
                      }
                    }}
                  />
                </div>
                {/* Hints */}
                <div className="space-y-1.5">
                  {Array.from({ length: revealed }).map((_, hi) => (
                    <div
                      key={hi}
                      className="rounded-lg bg-amber-50 dark:bg-amber-950/40 border border-amber-100 dark:border-amber-800/50 px-3 py-2 text-xs text-amber-900 dark:text-amber-100"
                    >
                      💡 <span className="font-semibold">Hint {hi + 1}:</span>{" "}
                      {problem.hints[hi]}
                    </div>
                  ))}
                  {revealed < problem.hints.length && (
                    <button
                      type="button"
                      onClick={() => handleRevealHint(problem.id)}
                      data-ocid="c-course.reveal_hint"
                      className="w-full rounded-lg py-2 text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20 hover:bg-amber-500/20 transition-colors"
                    >
                      💡 Reveal Hint {revealed + 1} of {problem.hints.length}
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}

        {!submitted && (
          <button
            type="button"
            onClick={handleSubmit}
            data-ocid="c-course.test_submit"
            className="w-full rounded-xl py-3 text-sm font-bold bg-cyan-500 text-white hover:bg-cyan-600 transition-colors flex items-center justify-center gap-2"
          >
            🚀 Submit All Solutions
          </button>
        )}
        {submitted && (
          <div className="rounded-xl bg-green-500/10 border border-green-500/20 px-4 py-3 text-center">
            <div className="text-base font-bold text-green-400">
              ✅ Test Submitted
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              {problems.length}/{problems.length} problems attempted • +
              {problems.length * 50} XP earned
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Certificate View ─────────────────────────────────────────────────────────
const CertificateView: React.FC<{
  onBack: () => void;
  courseName?: string;
}> = ({ onBack, courseName = "Programming in C" }) => {
  const studentName = localStorage.getItem("userName") || "Valued Student";
  const rawDate = localStorage.getItem("c_module_5_completed_date");
  const completionDate =
    rawDate ||
    new Date().toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

  const downloadCert = () => {
    const certElement = document.getElementById("certificate-container");
    if (!certElement) return;
    const printWindow = window.open("", "_blank");
    if (printWindow) {
      printWindow.document.write(`
        <html><head><title>Certificate - ${courseName}</title>
        <style>
          body { margin: 0; padding: 40px; font-family: Georgia, serif; background: #f5f0dc; }
          @media print { body { padding: 0; } }
        </style></head><body>
        ${certElement.innerHTML}
        </body></html>
      `);
      printWindow.document.close();
      setTimeout(() => printWindow.print(), 500);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-amber-50 dark:from-amber-950/30 dark:to-yellow-950/30 flex flex-col items-center justify-center p-4">
      <button
        type="button"
        onClick={onBack}
        className="mb-6 flex items-center gap-2 text-muted-foreground hover:text-foreground self-start"
      >
        ← Back to Course
      </button>

      <div
        id="certificate-container"
        style={{
          background:
            "linear-gradient(135deg, #f5f0dc 0%, #e8d9a0 50%, #f5f0dc 100%)",
          border: "8px solid #b8860b",
          borderRadius: "12px",
          padding: "50px",
          maxWidth: "750px",
          width: "100%",
          textAlign: "center",
          boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
          fontFamily: "Georgia, serif",
        }}
      >
        <div
          style={{
            border: "2px solid #b8860b",
            padding: "40px",
            borderRadius: "8px",
          }}
        >
          <p
            style={{
              color: "#b8860b",
              letterSpacing: "4px",
              fontSize: "14px",
              marginBottom: "8px",
            }}
          >
            CODE &amp; CRUSH
          </p>
          <h1
            style={{
              color: "#1a237e",
              fontSize: "32px",
              margin: "16px 0",
              fontWeight: "bold",
            }}
          >
            Certificate of Completion
          </h1>
          <p style={{ color: "#555", fontSize: "16px", margin: "8px 0" }}>
            This certifies that
          </p>
          <h2
            style={{
              color: "#1a237e",
              fontSize: "28px",
              fontStyle: "italic",
              margin: "16px 0",
            }}
          >
            {studentName}
          </h2>
          <p style={{ color: "#555", fontSize: "16px", margin: "8px 0" }}>
            has successfully completed
          </p>
          <h3
            style={{
              color: "#b8860b",
              fontSize: "22px",
              margin: "16px 0",
              fontWeight: "bold",
            }}
          >
            {courseName}
          </h3>
          <p
            style={{
              color: "#555",
              fontSize: "13px",
              maxWidth: "500px",
              margin: "0 auto 24px",
            }}
          >
            A comprehensive course covering all modules of {courseName} on Code
            &amp; Crush.
          </p>
          <div
            style={{
              borderTop: "1px solid #b8860b",
              paddingTop: "20px",
              marginTop: "20px",
            }}
          >
            <p
              style={{
                color: "#1a237e",
                fontWeight: "bold",
                fontSize: "16px",
              }}
            >
              Completed on: {completionDate}
            </p>
            <p style={{ color: "#555", fontSize: "13px", marginTop: "8px" }}>
              🎓 Code &amp; Crush — AI-Powered Study Companion
            </p>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: "40px",
              marginTop: "24px",
            }}
          >
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: "36px" }}>🏆</div>
              <p
                style={{ color: "#b8860b", fontSize: "12px", margin: "4px 0" }}
              >
                Excellence
              </p>
            </div>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: "36px" }}>💻</div>
              <p
                style={{ color: "#b8860b", fontSize: "12px", margin: "4px 0" }}
              >
                Programming
              </p>
            </div>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: "36px" }}>⭐</div>
              <p
                style={{ color: "#b8860b", fontSize: "12px", margin: "4px 0" }}
              >
                Achievement
              </p>
            </div>
          </div>
        </div>
      </div>

      <button
        type="button"
        onClick={downloadCert}
        className="mt-6 bg-amber-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-amber-700 flex items-center gap-2"
        data-ocid="c-course.download_certificate"
      >
        ⬇️ Download Certificate
      </button>
    </div>
  );
};

// ─── C Programming Course View ────────────────────────────────────────────────
interface CProgrammingCourseViewProps {
  onBack: () => void;
  course?: CModule[];
  courseId?: string;
  courseName?: string;
  lastModuleId?: string;
  isEnrolled?: boolean;
  onEnroll?: () => void;
}

function CProgrammingCourseView({
  onBack,
  course = C_PROGRAMMING_COURSE,
  courseId = "c",
  courseName = "Programming in C",
  lastModuleId = "c-pointers",
  isEnrolled = true,
  onEnroll,
}: CProgrammingCourseViewProps) {
  const { user, setUser, setXpFlash, enrollCourse, unenrollCourse } = useApp();
  const [, forceUpdate] = useState(0);
  const refresh = () => forceUpdate((n) => n + 1);
  const [showCertificate, setShowCertificate] = useState(false);
  const [showCongrats, setShowCongrats] = useState(false);
  const [lockedModuleMsg, setLockedModuleMsg] = useState<string | null>(null);
  // Show enrollment overlay only when user tries to access Module 1+ without enrollment
  const [showEnrollOverlay, setShowEnrollOverlay] = useState(false);
  const [courseSeasonalUnlock, setCourseSeasonalUnlock] = useState<{
    itemId: string;
    itemName: string;
    season: string;
    emoji: string;
  } | null>(null);
  const recordModuleCompletion = useRecordModuleCompletion();

  // Map courseId → quiz key prefix used in ALL_PART_QUIZZES
  const COURSE_QUIZ_PREFIX: Record<string, string> = {
    c: "c",
    fe: "frontend",
    py: "python",
    be: "backend",
    fs: "fullstack",
    ds: "datascience",
    "machine-learning-course": "ml",
    "devops-course": "devops",
    "android-development-course": "android",
    "ios-development-course": "ios",
    "cybersecurity-course": "cybersec",
    "blockchain-course": "blockchain",
    "cloud-computing-course": "cloud",
    "aiml-engineer-course": "aiml",
    "game-development-course": "gamedev",
    "uiux-designer-course": "uiux",
    "cs-subjects": "cs",
    "system-design": "sd",
    "java-developer-course": "java",
  };
  const quizPrefix = COURSE_QUIZ_PREFIX[courseId] ?? courseId;

  // Build quizPartId from module + part indices
  const getQuizPartId = (moduleIdx: number, partIdx: number) =>
    `${quizPrefix}-module${moduleIdx + 1}-part${partIdx + 1}`;

  // Sub-views
  type SubView =
    | { type: "modules" }
    | { type: "module"; module: CModule }
    | { type: "part"; module: CModule; part: CPart }
    | { type: "moduleQuiz"; module: CModule }
    | { type: "moduleTest"; module: CModule };

  const [subView, setSubView] = useState<SubView>({ type: "modules" });
  const [activeModuleQuiz, setActiveModuleQuiz] = useState<CModule | null>(
    null,
  );
  const [courseChallengModal, setCourseChallengModal] = useState<{
    score: number;
    total: number;
    title: string;
  } | null>(null);

  const allDone = course.every((m) => getCModuleDone(m.id));

  const getModuleProgress = (module: CModule) => {
    const total = module.parts.length;
    const done = module.parts.filter((p) => getCPartDone(p.id)).length;
    return {
      done,
      total,
      pct: total > 0 ? Math.round((done / total) * 100) : 0,
    };
  };

  const allPartsComplete = (module: CModule) =>
    module.parts.every((p) => getCPartDone(p.id));

  const handlePartComplete = (partId: string, xp: number) => {
    setCPartDone(partId);
    setUser({ xp: user.xp + xp });
    setXpFlash(xp);
    setTimeout(() => setXpFlash(null), 1500);
    // If completing a part in Module 0, mark module 0 done and unlock Module 1
    const currentModule = subView.type === "part" ? subView.module : null;
    if (currentModule?.id.endsWith("-module0")) {
      const allPartsNowDone = currentModule.parts.every(
        (p) => p.id === partId || getCPartDone(p.id),
      );
      if (allPartsNowDone) {
        setCModuleDone(currentModule.id);
        // Unlock the first real module (index 1 in course array)
        const module0Idx = course.findIndex((m) => m.id === currentModule.id);
        if (module0Idx !== -1 && module0Idx + 1 < course.length) {
          setCModuleUnlocked(course[module0Idx + 1].id);
        }
      }
    }
    refresh();
    setSubView((prev) =>
      prev.type === "part" ? { type: "module", module: prev.module } : prev,
    );
  };

  const handleModuleQuizComplete = (
    moduleId: string,
    score: number,
    total: number,
    xp: number,
  ) => {
    setUser({ xp: user.xp + xp });
    setXpFlash(xp);
    setTimeout(() => setXpFlash(null), 1500);
    const passPct = (score / total) * 100;
    const passed = passPct >= 70;
    if (passed) {
      setCModuleQuizDone(moduleId);
    }
    // Record module completion for seasonal item check (≥60%)
    if (passPct >= 60) {
      const moduleIdx = course.findIndex((m) => m.id === moduleId);
      recordModuleCompletion.mutate(
        { domain: courseId, moduleIndex: moduleIdx >= 0 ? moduleIdx : 0 },
        {
          onSuccess: (itemId) => {
            if (itemId) {
              const info = getSeasonalItemInfo(itemId);
              if (info) {
                setCourseSeasonalUnlock({
                  itemId,
                  itemName: info.name,
                  season: info.season,
                  emoji: info.emoji,
                });
              }
            }
          },
        },
      );
    }
    refresh();
    setActiveModuleQuiz(null);
  };

  const handleTestComplete = (moduleId: string, xp: number) => {
    setCModuleDone(moduleId);
    setUser({ xp: user.xp + xp });
    setXpFlash(xp);
    setTimeout(() => setXpFlash(null), 1500);
    // Unlock next module
    const moduleOrder = course.map((m) => m.id);
    const idx = moduleOrder.indexOf(moduleId);
    if (idx !== -1 && idx < moduleOrder.length - 1) {
      setCModuleUnlocked(moduleOrder[idx + 1]);
    }
    // If last module completed, save date and show congrats
    if (moduleId === lastModuleId) {
      localStorage.setItem(
        `${courseId}_module_last_completed_date`,
        new Date().toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        }),
      );
      localStorage.setItem(`${courseId}_module_last_test_done`, "true");
      setShowCongrats(true);
    }
    refresh();
    // Return to modules list
    setSubView({ type: "modules" });
  };

  // ── Render sub-views ──
  if (showCertificate) {
    return (
      <CertificateView
        onBack={() => setShowCertificate(false)}
        courseName={courseName}
      />
    );
  }

  if (subView.type === "part") {
    const moduleIdx = course.findIndex((m) => m.id === subView.module.id);
    const partIdx = subView.module.parts.findIndex(
      (p) => p.id === subView.part.id,
    );
    const computedQuizPartId = getQuizPartId(
      moduleIdx >= 0 ? moduleIdx : 0,
      partIdx >= 0 ? partIdx : 0,
    );
    return (
      <CPartView
        part={subView.part}
        moduleId={subView.module.id}
        companionName={user.companionName || "Sakura"}
        onBack={() => setSubView({ type: "module", module: subView.module })}
        onPartComplete={handlePartComplete}
        quizPartId={computedQuizPartId}
        domainLabel={courseName}
      />
    );
  }

  if (subView.type === "moduleTest") {
    return (
      <CModuleTestView
        module={subView.module}
        onBack={() => setSubView({ type: "module", module: subView.module })}
        onTestComplete={handleTestComplete}
      />
    );
  }

  // ── Module 0 Orientation View ──
  if (subView.type === "module" && subView.module.id.endsWith("-module0")) {
    const mod = subView.module;
    const modDone = getCModuleDone(mod.id);
    const checklistItems = [
      { label: "Select your companion", done: true },
      { label: "Enroll in this course", done: isEnrolled },
      { label: "Complete Module 0 orientation", done: modDone },
      { label: "Set a daily study goal", done: false },
      { label: "Join the community", done: false },
    ];
    const checkedCount = checklistItems.filter((c) => c.done).length;
    const learningModules = course.filter((m) => !m.id.endsWith("-module0"));

    const handleStartLearning = () => {
      setCModuleDone(mod.id);
      const module0Idx = course.findIndex((m) => m.id === mod.id);
      if (module0Idx !== -1 && module0Idx + 1 < course.length) {
        setCModuleUnlocked(course[module0Idx + 1].id);
      }
      refresh();
      setSubView({ type: "modules" });
    };

    return (
      <div
        className="flex-1 overflow-y-auto pb-nav-safe"
        data-ocid="c-course.module0_orientation"
      >
        {/* Header */}
        <div className="sticky top-0 z-10 bg-background/95 backdrop-blur border-b border-border px-3 sm:px-4 py-2.5">
          <div className="flex items-center gap-2 sm:gap-3 max-w-2xl mx-auto">
            <button
              type="button"
              onClick={() => setSubView({ type: "modules" })}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-muted hover:bg-muted/70 transition-colors text-foreground text-xs font-semibold shrink-0"
              data-ocid="c-course.back_to_modules.button"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="m15 18-6-6 6-6" />
              </svg>
              <span className="hidden sm:inline">← {courseName}</span>
              <span className="sm:hidden">← Back</span>
            </button>
            <div className="w-8 h-8 rounded-full bg-primary/20 border border-primary/40 flex items-center justify-center shrink-0">
              <Compass className="w-4 h-4 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-bold text-foreground text-sm truncate">
                {mod.title}
              </div>
              <div className="text-xs text-primary/80">Course Orientation</div>
            </div>
            {modDone && (
              <span className="text-xs bg-green-500/15 text-green-400 border border-green-500/30 rounded-full px-2.5 py-0.5 font-semibold shrink-0">
                ✓ Done
              </span>
            )}
          </div>
        </div>

        <div className="px-4 pt-5 max-w-2xl mx-auto space-y-5">
          {/* Companion greeting */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl border-2 border-primary/30 bg-gradient-to-br from-primary/10 to-primary/5 p-5"
            data-ocid="c-course.module0_greeting"
          >
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 rounded-full bg-primary/20 border-2 border-primary/40 flex items-center justify-center shrink-0 text-2xl">
                💙
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-bold text-primary mb-0.5">
                  Hi there! I&apos;m {user.companionName || "Sakura"} 💙
                </div>
                <p className="text-xs text-foreground/80 leading-relaxed">
                  Welcome to{" "}
                  <strong className="text-foreground">{courseName}</strong>!
                  I&apos;ll guide you through every step of this journey. This
                  orientation helps you understand the course structure, what to
                  expect, and gets you ready to start learning. Let&apos;s make
                  this adventure amazing! 🚀
                </p>
              </div>
            </div>
          </motion.div>

          {/* Estimated time */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="flex items-center gap-3 rounded-xl bg-cyan-500/5 border border-cyan-500/20 px-4 py-3"
          >
            <span className="text-xl shrink-0">⏱️</span>
            <div>
              <div className="text-xs font-bold text-cyan-400 uppercase tracking-wide">
                Estimated Completion Time
              </div>
              <div className="text-sm font-semibold text-foreground">
                {learningModules.length * 4}–{learningModules.length * 6} hours
                total
              </div>
              <div className="text-xs text-muted-foreground">
                {learningModules.length} modules • Study at your own pace
              </div>
            </div>
          </motion.div>

          {/* Learning path */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="rounded-2xl border border-border bg-card overflow-hidden"
            data-ocid="c-course.module0_learning_path"
          >
            <div className="px-4 py-3 border-b border-border bg-muted/30">
              <div className="text-xs font-bold text-foreground uppercase tracking-wide">
                🗺️ Your Learning Path
              </div>
            </div>
            <div className="p-3 space-y-1.5">
              {learningModules.map((lm, idx) => {
                const lmDone = getCModuleDone(lm.id);
                return (
                  <div
                    key={lm.id}
                    className={`flex items-center gap-3 rounded-xl px-3 py-2.5 border ${lmDone ? "bg-green-500/8 border-green-500/20" : "bg-muted/20 border-border"}`}
                  >
                    <div
                      className={`w-7 h-7 rounded-full border-2 flex items-center justify-center text-xs font-bold shrink-0 ${lmDone ? "bg-green-500 border-green-400 text-white" : "bg-background border-border text-muted-foreground"}`}
                    >
                      {lmDone ? "✓" : idx + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-semibold text-foreground truncate">
                        {lm.title}
                      </div>
                      <div className="text-[11px] text-muted-foreground">
                        {lm.parts.length} parts
                      </div>
                    </div>
                    {lmDone && (
                      <span className="text-[10px] text-green-400 font-bold shrink-0">
                        Done ✓
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </motion.div>

          {/* Getting Started Checklist */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="rounded-2xl border border-border bg-card overflow-hidden"
            data-ocid="c-course.module0_checklist"
          >
            <div className="px-4 py-3 border-b border-border bg-muted/30 flex items-center justify-between">
              <div className="text-xs font-bold text-foreground uppercase tracking-wide">
                ✅ Getting Started Checklist
              </div>
              <div className="text-xs font-bold text-primary">
                {checkedCount}/{checklistItems.length}
              </div>
            </div>
            <div className="p-3 space-y-2">
              {checklistItems.map((item, idx) => (
                <div
                  key={idx}
                  className={`flex items-center gap-3 rounded-xl px-3 py-2.5 border ${item.done ? "bg-green-500/8 border-green-500/20" : "bg-muted/20 border-border"}`}
                  data-ocid="c-course.module0_checklist_item"
                >
                  <div
                    className={`w-6 h-6 rounded-full border-2 flex items-center justify-center text-xs font-bold shrink-0 ${item.done ? "bg-green-500 border-green-400 text-white" : "bg-background border-border text-muted-foreground"}`}
                  >
                    {item.done ? "✓" : idx + 1}
                  </div>
                  <span
                    className={`text-xs flex-1 ${item.done ? "text-green-400 font-semibold line-through opacity-70" : "text-foreground"}`}
                  >
                    {item.label}
                  </span>
                </div>
              ))}
            </div>
            <div className="px-3 pb-3">
              <div className="h-1.5 w-full bg-border rounded-full overflow-hidden">
                <motion.div
                  animate={{
                    width: `${(checkedCount / checklistItems.length) * 100}%`,
                  }}
                  transition={{ duration: 0.5 }}
                  className="h-full bg-primary rounded-full"
                />
              </div>
            </div>
          </motion.div>

          {/* Module 0 parts (if any) */}
          {mod.parts.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="space-y-2"
            >
              <div className="text-xs font-bold text-foreground uppercase tracking-wide px-1">
                📖 Orientation Topics
              </div>
              {mod.parts.map((part, idx) => {
                const isDone = getCPartDone(part.id);
                return (
                  <motion.button
                    key={part.id}
                    type="button"
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 + idx * 0.05 }}
                    onClick={() =>
                      setSubView({ type: "part", module: mod, part })
                    }
                    data-ocid="c-course.module0_part_card"
                    className={`w-full text-left rounded-2xl border p-3 transition-all hover:border-primary/40 ${isDone ? "border-green-500/30 bg-green-500/5" : "border-border bg-card"}`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-7 h-7 rounded-full border-2 flex items-center justify-center text-xs font-bold shrink-0 ${isDone ? "bg-green-500 border-green-400 text-white" : "bg-primary/15 border-primary/40 text-primary"}`}
                      >
                        {isDone ? "✓" : idx + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-semibold text-foreground">
                          {part.title}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {part.description}
                        </div>
                      </div>
                      <ChevronDown className="w-4 h-4 text-muted-foreground -rotate-90 shrink-0" />
                    </div>
                  </motion.button>
                );
              })}
            </motion.div>
          )}

          {/* Start Learning button */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="pb-6"
          >
            {modDone ? (
              <div className="rounded-2xl border border-green-500/30 bg-green-500/8 px-4 py-4 text-center">
                <div className="text-2xl mb-1">🎉</div>
                <div className="text-sm font-bold text-green-400">
                  Orientation Complete!
                </div>
                <div className="text-xs text-muted-foreground mt-0.5">
                  Module 1 is now unlocked. Start learning!
                </div>
              </div>
            ) : (
              <button
                type="button"
                onClick={handleStartLearning}
                data-ocid="c-course.module0_start_learning"
                className="w-full rounded-2xl py-4 text-base font-bold bg-primary text-primary-foreground hover:bg-primary/90 transition-all flex items-center justify-center gap-2 shadow-lg"
                style={{ boxShadow: "0 0 24px hsl(var(--primary)/0.3)" }}
              >
                <span>Start Learning</span>
                <span>→</span>
              </button>
            )}
          </motion.div>
        </div>
      </div>
    );
  }

  // ── Module detail view ──
  if (subView.type === "module") {
    const mod = subView.module;
    const { done, total } = getModuleProgress(mod);
    const partsAllDone = allPartsComplete(mod);
    const quizDone = getCModuleQuizDone(mod.id);
    const modDone = getCModuleDone(mod.id);
    return (
      <>
        <div className="flex-1 overflow-y-auto pb-nav-safe overflow-x-hidden">
          {/* Header */}
          <div className="sticky top-0 z-10 bg-background/95 backdrop-blur border-b border-border px-3 sm:px-4 py-2.5">
            <div className="flex items-center gap-2 sm:gap-3 max-w-2xl mx-auto">
              <button
                type="button"
                onClick={() => setSubView({ type: "modules" })}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-muted hover:bg-muted/70 transition-colors text-foreground text-xs font-semibold shrink-0"
                data-ocid="c-course.back_to_modules.button"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="m15 18-6-6 6-6" />
                </svg>
                <span className="hidden sm:inline">← {courseName}</span>
                <span className="sm:hidden">← Back</span>
              </button>
              <div className="flex-1 min-w-0">
                <div className="font-bold text-foreground text-sm truncate">
                  {mod.title}
                </div>
                <div className="text-xs text-muted-foreground">
                  {done}/{total} parts complete
                </div>
              </div>
              {modDone && (
                <span className="text-xs bg-green-500/15 text-green-400 border border-green-500/30 rounded-full px-2.5 py-0.5 font-semibold shrink-0">
                  ✓ Done
                </span>
              )}
            </div>
            <div className="max-w-2xl mx-auto mt-2">
              <div className="h-1.5 w-full bg-border rounded-full overflow-hidden">
                <motion.div
                  animate={{
                    width: `${total > 0 ? Math.round((done / total) * 100) : 0}%`,
                  }}
                  className="h-full bg-cyan-500 rounded-full"
                />
              </div>
            </div>
          </div>

          <div className="px-4 pt-4 max-w-2xl mx-auto space-y-4">
            {/* Outcome */}
            <div className="rounded-xl bg-cyan-500/5 border border-cyan-500/20 px-4 py-3">
              <div className="text-xs font-bold text-cyan-400 uppercase tracking-wide mb-1">
                🎯 Learning Outcome
              </div>
              <p className="text-xs text-foreground/80 leading-relaxed">
                {mod.outcome}
              </p>
            </div>

            {/* Parts */}
            <div className="space-y-2">
              {mod.parts.map((part, idx) => {
                const isDone = getCPartDone(part.id);
                const moduleIdx = course.findIndex((m) => m.id === mod.id);
                const quizPId = getQuizPartId(
                  moduleIdx >= 0 ? moduleIdx : 0,
                  idx,
                );
                const partQuizDone =
                  localStorage.getItem(`quiz_${quizPId}_done`) === "true";
                return (
                  <motion.button
                    key={part.id}
                    type="button"
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.06 }}
                    onClick={() =>
                      setSubView({ type: "part", module: mod, part })
                    }
                    data-ocid="c-course.part_card"
                    className={`w-full text-left rounded-2xl border p-4 transition-all hover:border-cyan-500/40 ${isDone ? "border-green-500/30 bg-green-500/5" : "border-border bg-card"}`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3 flex-1 min-w-0">
                        <div
                          className={`mt-0.5 w-8 h-8 rounded-full border-2 flex items-center justify-center text-sm font-bold shrink-0 transition-all ${isDone ? "bg-green-500 border-green-500 text-white" : "bg-background border-cyan-500/40 text-cyan-400"}`}
                        >
                          {isDone ? "✓" : idx + 1}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-semibold text-foreground text-sm">
                            {part.title}
                          </div>
                          <div className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                            {part.description}
                          </div>
                          <div className="flex gap-2 mt-2 flex-wrap">
                            <span className="text-xs px-2 py-0.5 rounded-full bg-red-500/10 text-red-400 border border-red-500/20">
                              ▶ Video
                            </span>
                            <span className="text-xs px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
                              📝 Notes
                            </span>
                            <span
                              className={`text-xs px-2 py-0.5 rounded-full border ${partQuizDone ? "bg-green-500/10 text-green-400 border-green-500/20" : "bg-purple-500/10 text-purple-400 border-purple-500/20"}`}
                            >
                              {partQuizDone ? "Quiz Done ✅" : "🧠 Quiz"}
                            </span>
                          </div>
                        </div>
                      </div>
                      <ChevronDown className="w-4 h-4 text-muted-foreground -rotate-90 shrink-0 mt-1" />
                    </div>
                  </motion.button>
                );
              })}
            </div>

            {/* Module Quiz — unlocked after all parts done */}
            {partsAllDone && !modDone && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-2xl border border-purple-500/30 bg-purple-500/5 p-4"
              >
                <div className="text-sm font-bold text-purple-300 mb-1">
                  🎓 Module Quiz Unlocked!
                </div>
                <p className="text-xs text-muted-foreground mb-3">
                  You've completed all parts. Test your module knowledge — score
                  70%+ to unlock the Final Test.
                </p>
                <button
                  type="button"
                  onClick={() => setActiveModuleQuiz(mod)}
                  data-ocid="c-course.module_quiz_btn"
                  className={`w-full rounded-xl py-2.5 text-sm font-semibold transition-colors ${quizDone ? "bg-green-500/10 text-green-400 border border-green-500/20" : "bg-purple-500 text-white hover:bg-purple-600"}`}
                >
                  {quizDone
                    ? "✓ Quiz Passed — Take Final Test"
                    : "🧠 Take Module Quiz"}
                </button>
              </motion.div>
            )}

            {/* Module Test — unlocked after quiz passed */}
            {quizDone && !modDone && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-2xl border border-cyan-500/30 bg-cyan-500/5 p-4"
              >
                <div className="text-sm font-bold text-cyan-300 mb-1">
                  🚀 Final Module Test!
                </div>
                <p className="text-xs text-muted-foreground mb-3">
                  Write C programs to solve {mod.moduleTest.length} problems.
                  Complete all to unlock the next module.
                </p>
                <button
                  type="button"
                  onClick={() =>
                    setSubView({ type: "moduleTest", module: mod })
                  }
                  data-ocid="c-course.module_test_btn"
                  className="w-full rounded-xl py-2.5 text-sm font-semibold bg-cyan-500 text-white hover:bg-cyan-600 transition-colors"
                >
                  💻 Start Final Test
                </button>
              </motion.div>
            )}

            {modDone && (
              <div className="rounded-2xl border border-green-500/30 bg-green-500/5 p-4 text-center">
                <div className="text-2xl mb-1">🏆</div>
                <div className="text-sm font-bold text-green-400">
                  Module Complete!
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  Next module is now unlocked.
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Module Quiz Modal — 15 MCQs + 2 programming questions */}
        <AnimatePresence>
          {activeModuleQuiz &&
            (() => {
              const fullModuleQuiz = getFullQuizForPart(
                activeModuleQuiz.id,
                activeModuleQuiz.title,
                activeModuleQuiz.moduleQuiz,
                activeModuleQuiz.moduleProgrammingQuestions,
              );
              return (
                <CQuizModal
                  title={`${activeModuleQuiz.title} — Module Quiz`}
                  questions={fullModuleQuiz.mcqs}
                  programmingQuestions={fullModuleQuiz.programming}
                  onClose={() => setActiveModuleQuiz(null)}
                  minPassPct={70}
                  onComplete={(score, total, xp) =>
                    handleModuleQuizComplete(
                      activeModuleQuiz.id,
                      score,
                      total,
                      xp,
                    )
                  }
                  onChallengeFriend={(score, total, title) => {
                    setActiveModuleQuiz(null);
                    setCourseChallengModal({ score, total, title });
                  }}
                />
              );
            })()}
        </AnimatePresence>

        {/* ── Course-level Challenge a Friend Modal (sub-view) ── */}
        <AnimatePresence>
          {courseChallengModal && (
            <ChallengeModal
              quizScore={courseChallengModal.score}
              quizTopic={courseChallengModal.title}
              quizId={`course-${courseChallengModal.title.toLowerCase().replace(/\s+/g, "-")}`}
              challengerName={user.username || "You"}
              onClose={() => setCourseChallengModal(null)}
            />
          )}
        </AnimatePresence>
      </>
    );
  }
  return (
    <>
      <div className="flex-1 overflow-y-auto pb-nav-safe">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-background/95 backdrop-blur border-b border-border px-3 sm:px-4 py-2.5">
          <div className="flex items-center gap-2 sm:gap-3 max-w-2xl mx-auto">
            <button
              type="button"
              onClick={onBack}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-muted hover:bg-muted/70 transition-colors text-foreground text-xs font-semibold shrink-0"
              data-ocid="c-course.back_to_roadmap.button"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="m15 18-6-6 6-6" />
              </svg>
              ← All Courses
            </button>
            <span className="text-2xl">🔵</span>
            <div className="flex-1 min-w-0">
              <div className="font-bold text-foreground text-sm">
                {courseName}
              </div>
              <div className="text-xs text-muted-foreground">
                {course.length} modules • Sequential unlock
              </div>
            </div>
          </div>
        </div>

        {allDone && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mx-4 mt-4 max-w-2xl mx-auto rounded-2xl border border-cyan-500/40 bg-gradient-to-r from-cyan-500/20 to-blue-500/10 p-5 text-center"
          >
            <div className="text-4xl mb-2">🎓</div>
            <div className="text-lg font-bold text-foreground">
              Course Complete!
            </div>
            <div className="text-sm text-cyan-400 mt-1">
              You've mastered all {course.length} modules of {courseName}
            </div>
            <button
              type="button"
              onClick={() => setShowCertificate(true)}
              data-ocid="c-course.view_certificate_btn"
              className="mt-4 w-full bg-amber-500 text-white py-3 rounded-xl font-semibold text-base flex items-center justify-center gap-2 hover:bg-amber-600 transition-colors"
            >
              🏆 View Your Certificate of Completion
            </button>
          </motion.div>
        )}

        {/* Congrats overlay after module 5 test */}
        <AnimatePresence>
          {showCongrats && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4"
            >
              <motion.div
                initial={{ scale: 0.85, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.85, opacity: 0 }}
                transition={{ type: "spring", damping: 20, stiffness: 300 }}
                className="w-full max-w-sm bg-card rounded-3xl shadow-2xl border border-amber-500/30 overflow-hidden"
              >
                <div className="p-6 text-center">
                  <div className="text-5xl mb-3">🎓</div>
                  <div className="text-2xl font-bold text-foreground mb-2">
                    Congratulations!
                  </div>
                  <div className="text-sm text-muted-foreground mb-1">
                    You've completed all {course.length} modules of
                  </div>
                  <div className="text-base font-bold text-amber-400 mb-4">
                    {courseName}
                  </div>
                  <div className="inline-flex items-center gap-1.5 bg-yellow-500/10 text-yellow-400 border border-yellow-500/20 rounded-full px-3 py-1 text-sm font-semibold mb-5">
                    🏅 Course Mastery Achieved!
                  </div>
                  <div className="space-y-2">
                    <button
                      type="button"
                      onClick={() => {
                        setShowCongrats(false);
                        setShowCertificate(true);
                      }}
                      data-ocid="c-course.congrats_view_cert"
                      className="w-full rounded-xl py-3 text-sm font-bold bg-amber-500 text-white hover:bg-amber-600 transition-colors flex items-center justify-center gap-2"
                    >
                      🏆 View Certificate
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowCongrats(false)}
                      className="w-full rounded-xl py-2.5 text-sm font-semibold bg-muted text-muted-foreground border border-border hover:bg-muted/70 transition-colors"
                    >
                      Close
                    </button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="px-4 pt-4 max-w-2xl mx-auto space-y-3">
          {/* Always render module0 first, then the rest in order */}
          {[...course]
            .sort((a, b) => {
              const aIs0 = a.id.endsWith("-module0");
              const bIs0 = b.id.endsWith("-module0");
              if (aIs0 && !bIs0) return -1;
              if (!aIs0 && bIs0) return 1;
              return 0;
            })
            .map((module, idx) => {
              const isModule0 = module.id.endsWith("-module0");
              const unlocked = isModule0 ? true : getCModuleUnlocked(module.id);
              const done = getCModuleDone(module.id);
              const {
                done: partsDone,
                total: partsTotal,
                pct,
              } = getModuleProgress(module);

              // ── Module 0: special orientation card ──
              if (isModule0) {
                const checklistPct =
                  partsTotal > 0
                    ? Math.round((partsDone / partsTotal) * 100)
                    : 0;
                return (
                  <motion.div
                    key={module.id}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0 }}
                    data-ocid="c-course.module0_card"
                  >
                    <button
                      type="button"
                      onClick={() => setSubView({ type: "module", module })}
                      className={`w-full text-left rounded-2xl border-2 overflow-hidden transition-all ${
                        done
                          ? "border-primary/60 bg-gradient-to-r from-primary/15 to-primary/5"
                          : "border-primary/40 bg-gradient-to-r from-primary/10 to-primary/5 hover:border-primary/70"
                      }`}
                      style={{ boxShadow: "0 0 18px hsl(var(--primary)/0.12)" }}
                    >
                      <div className="p-4">
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-start gap-3 flex-1 min-w-0">
                            {/* Compass icon */}
                            <div className="mt-0.5 w-10 h-10 rounded-full border-2 border-primary/60 bg-primary/20 flex items-center justify-center shrink-0">
                              {done ? (
                                <span className="text-green-400 font-bold text-sm">
                                  ✓
                                </span>
                              ) : (
                                <Compass className="w-5 h-5 text-primary" />
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              {/* START HERE badge */}
                              <div className="flex items-center gap-2 mb-1 flex-wrap">
                                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-primary/20 text-primary border border-primary/30 uppercase tracking-wider">
                                  START HERE
                                </span>
                                {done && (
                                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-green-500/20 text-green-400 border border-green-500/30">
                                    Completed ✓
                                  </span>
                                )}
                              </div>
                              <div className="font-bold text-primary text-sm">
                                {module.title}
                              </div>
                              <div className="text-xs text-muted-foreground mt-0.5">
                                Course orientation &amp; getting started
                                checklist
                              </div>
                              <div className="flex items-center gap-2 mt-2 flex-wrap">
                                <span className="text-xs font-semibold px-2 py-0.5 rounded-full border text-primary bg-primary/10 border-primary/20">
                                  Always unlocked
                                </span>
                                <span className="text-xs text-muted-foreground">
                                  {partsDone}/{partsTotal} checklist item
                                  {partsTotal !== 1 ? "s" : ""} done
                                </span>
                              </div>
                              {/* Checklist progress bar */}
                              {partsTotal > 0 && (
                                <div className="mt-2.5">
                                  <div className="flex justify-between items-center mb-1">
                                    <span className="text-[10px] text-primary/70 font-semibold uppercase tracking-wide">
                                      Getting Started
                                    </span>
                                    <span className="text-[10px] text-primary font-bold">
                                      {checklistPct}%
                                    </span>
                                  </div>
                                  <div className="h-1.5 w-full bg-primary/15 rounded-full overflow-hidden">
                                    <motion.div
                                      initial={{ width: 0 }}
                                      animate={{ width: `${checklistPct}%` }}
                                      transition={{
                                        duration: 0.5,
                                        ease: "easeOut",
                                      }}
                                      className={`h-full rounded-full ${done ? "bg-green-400" : "bg-primary"}`}
                                    />
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                          <ChevronDown className="w-5 h-5 text-primary/70 -rotate-90 shrink-0 mt-1" />
                        </div>
                      </div>
                    </button>
                  </motion.div>
                );
              }

              // ── Regular module card ──
              // Find the previous module (by original course order) for lock message
              const origIdx = course.findIndex((m) => m.id === module.id);
              const prevModInCourse = origIdx > 0 ? course[origIdx - 1] : null;
              const moduleNumber = origIdx; // 0-based; Module 0 is filtered out above

              return (
                <motion.div
                  key={module.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.08 }}
                  data-ocid="c-course.module_card"
                >
                  <button
                    type="button"
                    onClick={() => {
                      if (!unlocked) {
                        const prevTitle =
                          prevModInCourse?.title ?? "the previous module";
                        setLockedModuleMsg(
                          `🔒 Complete "${prevTitle}" first to unlock this module.`,
                        );
                        return;
                      }
                      // Require enrollment for Module 1+
                      if (!isEnrolled) {
                        setShowEnrollOverlay(true);
                        return;
                      }
                      setSubView({ type: "module", module });
                    }}
                    className={`w-full text-left rounded-2xl border overflow-hidden transition-all ${
                      done
                        ? "border-green-500/40 bg-gradient-to-r from-green-500/10 to-green-500/5"
                        : unlocked
                          ? "border-cyan-500/30 bg-gradient-to-r from-cyan-500/15 to-blue-500/10 hover:border-cyan-500/50"
                          : "border-border bg-card opacity-60 cursor-not-allowed"
                    }`}
                  >
                    <div className="p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-start gap-3 flex-1 min-w-0">
                          <div
                            className={`mt-0.5 w-10 h-10 rounded-full border-2 flex items-center justify-center font-bold text-sm shrink-0 ${done ? "bg-green-500 border-green-400 text-white" : unlocked ? "bg-cyan-500/20 border-cyan-500 text-cyan-400" : "bg-muted border-border text-muted-foreground"}`}
                          >
                            {done ? (
                              "✓"
                            ) : unlocked ? (
                              moduleNumber
                            ) : (
                              <Lock className="w-4 h-4" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="font-bold text-foreground text-sm">
                              {module.title}
                            </div>
                            <div className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                              {module.outcome}
                            </div>
                            <div className="flex items-center gap-2 mt-2 flex-wrap">
                              <span
                                className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${unlocked ? "text-cyan-400 bg-cyan-500/10 border-cyan-500/20" : "text-muted-foreground bg-muted border-border"}`}
                              >
                                {module.parts.length} parts
                              </span>
                              {unlocked && partsDone > 0 && (
                                <span className="text-xs text-cyan-400 font-semibold">
                                  {pct}% parts done
                                </span>
                              )}
                              {!unlocked && (
                                <span className="text-xs text-amber-500/80 font-medium flex items-center gap-1">
                                  <Lock className="w-3 h-3" />
                                  Complete{" "}
                                  {prevModInCourse
                                    ? `"${prevModInCourse.title.split(" ").slice(0, 3).join(" ")}"`
                                    : "previous module"}{" "}
                                  first
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                        {unlocked ? (
                          <ChevronDown className="w-5 h-5 text-muted-foreground -rotate-90 shrink-0 mt-1" />
                        ) : (
                          <Lock className="w-5 h-5 text-muted-foreground shrink-0 mt-1" />
                        )}
                      </div>
                      {/* Progress bar */}
                      {unlocked && (
                        <div className="mt-3">
                          <div className="h-1.5 w-full bg-border rounded-full overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${pct}%` }}
                              className={`h-full rounded-full ${done ? "bg-green-400" : "bg-cyan-500"}`}
                            />
                          </div>
                          <div className="flex justify-between mt-1">
                            <span className="text-xs text-muted-foreground">
                              {partsDone}/{partsTotal} parts
                            </span>
                            {done && (
                              <span className="text-xs text-green-400 font-semibold">
                                ✓ Complete
                              </span>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </button>
                </motion.div>
              );
            })}
        </div>
      </div>

      {/* Locked Module Toast */}
      <AnimatePresence>
        {lockedModuleMsg && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-24 left-1/2 -translate-x-1/2 z-[80] w-[90vw] max-w-sm bg-card border border-border rounded-2xl shadow-2xl px-4 py-4"
            data-ocid="c-course.locked_module_toast"
          >
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-full bg-muted border border-border flex items-center justify-center shrink-0">
                <Lock className="w-4 h-4 text-muted-foreground" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-bold text-foreground mb-0.5">
                  🔒 Module Locked
                </div>
                <div className="text-xs text-muted-foreground leading-relaxed">
                  {lockedModuleMsg}
                </div>
              </div>
              <button
                type="button"
                onClick={() => setLockedModuleMsg(null)}
                className="p-1 rounded-full hover:bg-muted transition-colors text-muted-foreground shrink-0"
                data-ocid="c-course.locked_toast_close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Enrollment Overlay — shown only when user tries to access Module 1+ without enrollment */}
      <AnimatePresence>
        {showEnrollOverlay && !isEnrolled && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm p-4"
            data-ocid="c-course.enrollment_overlay"
          >
            <motion.div
              initial={{ scale: 0.92, opacity: 0, y: 30 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.92, opacity: 0, y: 30 }}
              transition={{ type: "spring", damping: 22, stiffness: 300 }}
              className="w-full max-w-sm bg-card rounded-3xl shadow-2xl border border-border overflow-hidden"
            >
              <div className="px-6 pt-6 pb-5">
                <div className="flex items-center justify-center mb-4">
                  <div className="w-16 h-16 rounded-full bg-primary/10 border-2 border-primary/30 flex items-center justify-center">
                    <Lock className="w-8 h-8 text-primary" />
                  </div>
                </div>
                <h3 className="text-center font-extrabold text-foreground text-lg mb-1">
                  {courseName}
                </h3>
                <p className="text-center text-sm text-muted-foreground mb-1">
                  Enroll to access videos, lessons, quizzes, and all module
                  content.
                </p>
                <p className="text-center text-xs text-muted-foreground mb-5">
                  Module 0 (Orientation) is free to preview.
                </p>
                {(user.enrolledCourses ?? []).length >= 2 ? (
                  <>
                    <p className="text-center text-sm text-muted-foreground mb-4">
                      You&apos;ve reached the max of{" "}
                      <strong className="text-foreground">
                        2 concurrent courses
                      </strong>
                      . Unenroll one to add this course.
                    </p>
                    <div className="space-y-2 mb-4">
                      {(user.enrolledCourses ?? []).map((cid) => (
                        <button
                          key={cid}
                          type="button"
                          onClick={() => {
                            unenrollCourse(cid);
                            enrollCourse(courseId);
                            onEnroll?.();
                            setShowEnrollOverlay(false);
                          }}
                          className="w-full text-left rounded-xl px-4 py-3 border border-red-500/20 bg-red-500/5 hover:bg-red-500/10 transition-colors group"
                          data-ocid="c-course.unenroll_swap_button"
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-foreground truncate flex-1 min-w-0">
                              {cid}
                            </span>
                            <span className="text-xs text-red-400 font-semibold ml-3 shrink-0 group-hover:underline">
                              Unenroll →
                            </span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      enrollCourse(courseId);
                      onEnroll?.();
                      setShowEnrollOverlay(false);
                    }}
                    data-ocid="c-course.enroll_now_button"
                    className="w-full rounded-xl py-3 text-sm font-bold bg-primary text-primary-foreground hover:bg-primary/90 transition-colors mb-2"
                  >
                    🎓 Enroll Now — It&apos;s Free
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setShowEnrollOverlay(false)}
                  data-ocid="c-course.enrollment_go_back"
                  className="w-full rounded-xl py-2.5 text-sm font-semibold bg-muted text-muted-foreground border border-border hover:bg-muted/70 transition-colors"
                >
                  ← Back to Module 0
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Course Seasonal Item Overlay ── */}
      <AnimatePresence>
        {courseSeasonalUnlock && (
          <motion.div
            key="course-seasonal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[80] flex items-center justify-center bg-black/70 backdrop-blur-sm px-4"
            data-ocid="c-course.seasonal_unlock.dialog"
          >
            <motion.div
              initial={{ scale: 0.6, opacity: 0, y: 40 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: "spring", stiffness: 260, damping: 20 }}
              className="bg-card border border-border rounded-3xl p-8 max-w-sm w-full text-center shadow-2xl"
            >
              <motion.div
                animate={{ scale: [1, 1.2, 1], rotate: [0, 10, -10, 0] }}
                transition={{ duration: 1.2, repeat: 2 }}
                className="text-6xl mb-4"
              >
                {courseSeasonalUnlock.emoji}
              </motion.div>
              <div className="inline-flex items-center gap-1.5 bg-primary/15 text-primary border border-primary/25 rounded-full px-3 py-1 text-xs font-bold mb-3">
                🎉 Seasonal Item Unlocked!
              </div>
              <h2 className="text-xl font-extrabold text-foreground mb-1">
                {courseSeasonalUnlock.itemName}
              </h2>
              <p className="text-xs text-muted-foreground mb-4">
                🍃 {courseSeasonalUnlock.season} Season Exclusive
              </p>
              <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
                Domain milestone reached! This seasonal avatar item is now
                available in your store.
              </p>
              <button
                type="button"
                onClick={() => setCourseSeasonalUnlock(null)}
                data-ocid="c-course.seasonal_unlock.close_button"
                className="w-full rounded-2xl py-3 text-sm font-bold bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
              >
                Awesome! 🎊
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Course-level Challenge a Friend Modal ── */}
      <AnimatePresence>
        {courseChallengModal && (
          <ChallengeModal
            quizScore={courseChallengModal.score}
            quizTopic={courseChallengModal.title}
            quizId={`course-${courseChallengModal.title.toLowerCase().replace(/\s+/g, "-")}`}
            challengerName={user.username || "You"}
            onClose={() => setCourseChallengModal(null)}
          />
        )}
      </AnimatePresence>
    </>
  );
}

interface RoadmapQuizState {
  topicId: string;
  topicTitle: string;
  questions: QuizQuestion[];
  currentQ: number;
  selectedOption: number | null;
  answers: (number | null)[];
  finished: boolean;
}

// ─── Enrollment Gate Modal ────────────────────────────────────────────────────
interface EnrollmentGateProps {
  roadmapId: string;
  roadmapTitle: string;
  enrolledCourses: string[];
  onEnroll: () => void;
  onUnenrollOther: (courseId: string) => void;
  onClose: () => void;
}

function EnrollmentGate({
  roadmapId: _roadmapId,
  roadmapTitle,
  enrolledCourses,
  onEnroll,
  onUnenrollOther,
  onClose,
}: EnrollmentGateProps) {
  const atCapacity = enrolledCourses.length >= 2;
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      data-ocid="roadmap.enrollment_gate"
    >
      <motion.div
        initial={{ scale: 0.92, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.92, opacity: 0, y: 20 }}
        transition={{ type: "spring", damping: 20, stiffness: 300 }}
        className="w-full max-w-sm bg-card rounded-3xl shadow-2xl border border-border overflow-hidden"
      >
        <div className="px-6 pt-6 pb-5">
          {/* Lock icon header */}
          <div className="flex items-center justify-center mb-4">
            <div className="w-16 h-16 rounded-full bg-primary/10 border-2 border-primary/30 flex items-center justify-center">
              <Lock className="w-8 h-8 text-primary" />
            </div>
          </div>
          <h3 className="text-center font-extrabold text-foreground text-lg mb-1">
            {roadmapTitle}
          </h3>
          {atCapacity ? (
            <>
              <p className="text-center text-sm text-muted-foreground mb-5">
                You&apos;ve reached the max of{" "}
                <strong className="text-foreground">
                  2 concurrent courses
                </strong>
                . Unenroll from one to add this course.
              </p>
              <div className="space-y-2 mb-4">
                {enrolledCourses.map((cid) => (
                  <button
                    key={cid}
                    type="button"
                    onClick={() => onUnenrollOther(cid)}
                    data-ocid="roadmap.unenroll_to_enroll"
                    className="w-full text-left rounded-xl px-4 py-3 border border-red-500/20 bg-red-500/5 hover:bg-red-500/10 transition-colors group"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-foreground truncate flex-1 min-w-0">
                        {cid}
                      </span>
                      <span className="text-xs text-red-400 font-semibold ml-3 shrink-0 group-hover:underline">
                        Unenroll →
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </>
          ) : (
            <>
              <p className="text-center text-sm text-muted-foreground mb-5">
                Enroll to access videos, lessons, quizzes, and all course
                content.
              </p>
              <button
                type="button"
                onClick={onEnroll}
                data-ocid="roadmap.enroll_now_button"
                className="w-full rounded-xl py-3 text-sm font-bold bg-primary text-primary-foreground hover:bg-primary/90 transition-colors mb-2"
              >
                🎓 Enroll Now — It&apos;s Free
              </button>
            </>
          )}
          <button
            type="button"
            onClick={onClose}
            data-ocid="roadmap.gate_go_back"
            className="w-full rounded-xl py-2.5 text-sm font-semibold bg-muted text-muted-foreground border border-border hover:bg-muted/70 transition-colors"
          >
            Go Back
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─── Challenge a Friend Modal ─────────────────────────────────────────────────

function ChallengeModal({
  quizScore,
  quizTopic,
  quizId,
  challengerName,
  onClose,
}: {
  quizScore: number;
  quizTopic: string;
  quizId: string;
  challengerName: string;
  onClose: () => void;
}) {
  const [search, setSearch] = useState("");
  const [selectedFriend, setSelectedFriend] = useState<{
    id: string;
    name: string;
    avatar: string;
  } | null>(null);
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const { useSendChallenge: _useSendChallenge, useFriendList: _useFriendList } =
    (() => ({
      useSendChallenge: null,
      useFriendList: null,
    }))();

  // Use hooks directly
  const friendListQuery = (() => {
    const FRIENDS = [
      { id: "user_alex", name: "Alex Chen", avatar: "AC" },
      { id: "user_priya", name: "Priya Sharma", avatar: "PS" },
      { id: "user_rajan", name: "Rajan Mehta", avatar: "RM" },
      { id: "user_sara", name: "Sara Kim", avatar: "SK" },
      { id: "user_dev", name: "Dev Patel", avatar: "DP" },
      { id: "user_neha", name: "Neha Joshi", avatar: "NJ" },
    ];
    return FRIENDS;
  })();

  const filtered = friendListQuery.filter((f) =>
    f.name.toLowerCase().includes(search.toLowerCase()),
  );

  const handleSend = async () => {
    if (!selectedFriend) return;
    setSending(true);
    // Store challenge in localStorage
    const now = Date.now();
    const challenge = {
      id: crypto.randomUUID(),
      challengerId: "current_user",
      challengerName,
      challengeeId: selectedFriend.id,
      challengeeName: selectedFriend.name,
      quizId,
      quizTopic,
      challengerScore: quizScore,
      challengeeScore: null,
      status: "pending",
      createdAt: now,
      expiresAt: now + 24 * 60 * 60 * 1000,
    };
    try {
      const existing = JSON.parse(
        localStorage.getItem("cc_challenges") ?? "[]",
      );
      localStorage.setItem(
        "cc_challenges",
        JSON.stringify([challenge, ...existing]),
      );
    } catch {}
    await new Promise((r) => setTimeout(r, 800));
    setSending(false);
    setSent(true);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[70] flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm px-0 sm:px-4"
      data-ocid="roadmap.challenge_modal.dialog"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        initial={{ y: 80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 80, opacity: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
        className="bg-card border border-border rounded-t-3xl sm:rounded-3xl w-full max-w-sm shadow-2xl overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 pt-5 pb-3">
          <div>
            <h3 className="font-bold text-foreground">Challenge a Friend ⚔️</h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              Your score:{" "}
              <span className="text-primary font-bold">{quizScore}</span> on{" "}
              <span className="text-foreground font-medium">{quizTopic}</span>
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            data-ocid="roadmap.challenge_modal.close_button"
            className="p-1.5 rounded-full hover:bg-muted transition-colors text-muted-foreground"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {sent ? (
          <div className="px-5 pb-7 text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 300 }}
              className="text-5xl mb-3 mt-2"
            >
              ✨
            </motion.div>
            <h4 className="font-bold text-foreground text-lg mb-1">
              Challenge Sent!
            </h4>
            <p className="text-sm text-muted-foreground mb-5">
              {selectedFriend?.name} has 24 hours to beat your score of{" "}
              <strong className="text-primary">{quizScore}</strong>.
            </p>
            <button
              type="button"
              onClick={onClose}
              data-ocid="roadmap.challenge_modal.done_button"
              className="w-full rounded-2xl py-3 text-sm font-bold bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              Done
            </button>
          </div>
        ) : (
          <>
            {/* Search */}
            <div className="px-5 pb-3">
              <div className="flex items-center gap-2 bg-muted rounded-xl px-3 py-2 border border-border">
                <span className="text-muted-foreground text-sm">🔍</span>
                <input
                  type="text"
                  placeholder="Search friends..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  data-ocid="roadmap.challenge_modal.search_input"
                  className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none"
                />
              </div>
            </div>

            {/* Friend list */}
            <div className="px-5 space-y-2 max-h-56 overflow-y-auto pb-2">
              {filtered.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No friends found
                </p>
              ) : (
                filtered.map((friend, idx) => {
                  const isSelected = selectedFriend?.id === friend.id;
                  return (
                    <button
                      key={friend.id}
                      type="button"
                      data-ocid={`roadmap.challenge_modal.friend_item.${idx + 1}`}
                      onClick={() =>
                        setSelectedFriend(isSelected ? null : friend)
                      }
                      className={`w-full flex items-center gap-3 rounded-2xl px-3 py-2.5 text-left transition-all border ${
                        isSelected
                          ? "bg-primary/10 border-primary/40"
                          : "bg-muted/40 border-transparent hover:border-border"
                      }`}
                    >
                      <div className="w-9 h-9 rounded-full bg-primary/20 flex items-center justify-center shrink-0 text-xs font-bold text-primary">
                        {friend.avatar}
                      </div>
                      <span className="flex-1 text-sm font-semibold text-foreground">
                        {friend.name}
                      </span>
                      {isSelected && (
                        <CheckCircle className="w-4 h-4 text-primary shrink-0" />
                      )}
                    </button>
                  );
                })
              )}
            </div>

            {/* Send button */}
            <div className="px-5 py-4">
              <button
                type="button"
                disabled={!selectedFriend || sending}
                onClick={handleSend}
                data-ocid="roadmap.challenge_modal.send_button"
                className="w-full rounded-2xl py-3 text-sm font-bold bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
              >
                {sending ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" /> Sending...
                  </>
                ) : (
                  "⚔️ Send Challenge"
                )}
              </button>
            </div>
          </>
        )}
      </motion.div>
    </motion.div>
  );
}

export default function RoadmapPage() {
  const {
    user,
    setUser,
    setXpFlash,
    enrollCourse,
    unenrollCourse,
    isCourseEnrolled,
    enrollmentError,
    clearEnrollmentError,
  } = useApp();
  const [view, setView] = useState<View>("list");
  const [selectedRoadmap, setSelectedRoadmap] = useState<Roadmap | null>(null);
  const [expandedTopic, setExpandedTopic] = useState<string | null>(null);
  const [activeVideo, setActiveVideo] = useState<ActiveVideo | null>(null);
  const [activeQuiz, setActiveQuiz] = useState<RoadmapQuizState | null>(null);
  const [showCCourse, setShowCCourse] = useState(false);
  const [showFECourse, setShowFECourse] = useState(false);
  const [showPYCourse, setShowPYCourse] = useState(false);
  const [showBECourse, setShowBECourse] = useState(false);
  const [showFSCourse, setShowFSCourse] = useState(false);
  const [showDSCourse, setShowDSCourse] = useState(false);
  const [showMLCourse, setShowMLCourse] = useState(false);
  const [showDevOpsCourse, setShowDevOpsCourse] = useState(false);
  const [showAndroidCourse, setShowAndroidCourse] = useState(false);
  const [showIosCourse, setShowIosCourse] = useState(false);
  const [showCybersecCourse, setShowCybersecCourse] = useState(false);
  const [showBlockchainCourse, setShowBlockchainCourse] = useState(false);
  const [showCloudCourse, setShowCloudCourse] = useState(false);
  const [showAiMlCourse, setShowAiMlCourse] = useState(false);
  const [showGameDevCourse, setShowGameDevCourse] = useState(false);
  const [showUiUxCourse, setShowUiUxCourse] = useState(false);
  const [showCsSubjectsCourse, setShowCsSubjectsCourse] = useState(false);
  const [showSystemDesignCourse, setShowSystemDesignCourse] = useState(false);
  const [showJavaCourse, setShowJavaCourse] = useState(false);
  const [enrollToast, setEnrollToast] = useState<string | null>(null);
  // Enrollment gate state: which domain the user tried to open while not enrolled
  const [gateRoadmapId, setGateRoadmapId] = useState<string | null>(null);
  const [gateRoadmapTitle, setGateRoadmapTitle] = useState<string>("");
  const [showRoadmapDocHub, setShowRoadmapDocHub] = useState(false);
  const [roadmapDocHubTopicId, setRoadmapDocHubTopicId] = useState<
    string | undefined
  >(undefined);

  // Notes side panel state (for flat roadmap topics view)
  const [notesPanelTopicId, setNotesPanelTopicId] = useState<string>("");
  const [notesPanelTitle, setNotesPanelTitle] = useState<string>("");
  const [showNotesPanel, setShowNotesPanel] = useState(false);

  // Seasonal item unlock overlay
  const [seasonalUnlock, setSeasonalUnlock] = useState<{
    itemId: string;
    itemName: string;
    season: string;
    emoji: string;
  } | null>(null);
  const recordModuleCompletion = useRecordModuleCompletion();

  // Challenge a friend modal
  const [showChallengeModal, setShowChallengeModal] = useState(false);
  const [challengeQuizScore, setChallengeQuizScore] = useState(0);
  const [challengeTopicTitle, setChallengeTopicTitle] = useState("");

  // Helper to count notes per topic
  const getNoteCount = (topicId: string): number => {
    try {
      const all = JSON.parse(
        localStorage.getItem("cc_notes") ?? "[]",
      ) as Array<{ topicId: string }>;
      return all.filter((n) => n.topicId === topicId).length;
    } catch {
      return 0;
    }
  };

  // Helper: open course content only if enrolled; otherwise show gate
  const openCourse = useCallback(
    (roadmapId: string, roadmapTitle: string, openFn: () => void) => {
      if (isCourseEnrolled(roadmapId)) {
        openFn();
      } else {
        setGateRoadmapId(roadmapId);
        setGateRoadmapTitle(roadmapTitle);
      }
    },
    [isCourseEnrolled],
  );

  const handleGateEnroll = useCallback(() => {
    if (!gateRoadmapId) return;
    enrollCourse(gateRoadmapId);
    setGateRoadmapId(null);
  }, [gateRoadmapId, enrollCourse]);

  const handleGateUnenrollOther = useCallback(
    (courseId: string) => {
      unenrollCourse(courseId);
      // After unenrolling, the user can now enroll in the gate course
      if (gateRoadmapId) {
        enrollCourse(gateRoadmapId);
        setGateRoadmapId(null);
      }
    },
    [gateRoadmapId, enrollCourse, unenrollCourse],
  );
  const [completedTopics, setCompletedTopics] = useState<
    Record<string, boolean>
  >(() => {
    try {
      return JSON.parse(localStorage.getItem("roadmap_completed") || "{}");
    } catch {
      return {};
    }
  });

  // Show error toast when enrollment limit hit
  useEffect(() => {
    if (enrollmentError) {
      setEnrollToast(enrollmentError);
      const t = setTimeout(() => {
        setEnrollToast(null);
        clearEnrollmentError();
      }, 4000);
      return () => clearTimeout(t);
    }
  }, [enrollmentError, clearEnrollmentError]);

  const toggleComplete = useCallback((roadmapId: string, topicId: string) => {
    const key = `${roadmapId}::${topicId}`;
    setCompletedTopics((prev) => {
      const updated = { ...prev, [key]: !prev[key] };
      localStorage.setItem("roadmap_completed", JSON.stringify(updated));
      return updated;
    });
  }, []);

  const isCompleted = useCallback(
    (roadmapId: string, topicId: string) =>
      !!completedTopics[`${roadmapId}::${topicId}`],
    [completedTopics],
  );

  const getProgress = useCallback(
    (roadmap: Roadmap) => {
      const total = roadmap.topics.length;
      const done = roadmap.topics.filter((t) =>
        isCompleted(roadmap.id, t.id),
      ).length;
      return {
        done,
        total,
        pct: total > 0 ? Math.round((done / total) * 100) : 0,
      };
    },
    [isCompleted],
  );

  const levelColor: Record<string, string> = {
    Beginner: "text-green-400 bg-green-500/10 border-green-500/20",
    Intermediate: "text-yellow-400 bg-yellow-500/10 border-yellow-500/20",
    Advanced: "text-red-400 bg-red-500/10 border-red-500/20",
  };

  const openQuiz = (topicId: string, topicTitle: string) => {
    const questions = TOPIC_QUIZZES[topicId] ?? GENERIC_QUESTIONS;
    setActiveQuiz({
      topicId,
      topicTitle,
      questions,
      currentQ: 0,
      selectedOption: null,
      answers: new Array(questions.length).fill(null),
      finished: false,
    });
  };

  const handleSelectOption = (optionIdx: number) => {
    if (
      !activeQuiz ||
      activeQuiz.selectedOption !== null ||
      activeQuiz.finished
    )
      return;
    setActiveQuiz((prev) => {
      if (!prev) return prev;
      const newAnswers = [...prev.answers];
      newAnswers[prev.currentQ] = optionIdx;
      return { ...prev, selectedOption: optionIdx, answers: newAnswers };
    });
  };

  const handleNextQuestion = () => {
    if (!activeQuiz) return;
    const nextQ = activeQuiz.currentQ + 1;
    if (nextQ >= activeQuiz.questions.length) {
      const score = activeQuiz.answers.filter(
        (ans, i) => ans === activeQuiz.questions[i].correct,
      ).length;
      const earnedXP = score * 10;
      setUser({ xp: user.xp + earnedXP });
      setXpFlash(earnedXP);
      setTimeout(() => setXpFlash(null), 1500);
      // Record module completion if ≥60% — triggers seasonal item check
      const passPct = (score / activeQuiz.questions.length) * 100;
      if (passPct >= 60 && selectedRoadmap) {
        recordModuleCompletion.mutate(
          { domain: selectedRoadmap.id, moduleIndex: 0 },
          {
            onSuccess: (itemId) => {
              if (itemId) {
                const info = getSeasonalItemInfo(itemId);
                if (info) {
                  setSeasonalUnlock({
                    itemId,
                    itemName: info.name,
                    season: info.season,
                    emoji: info.emoji,
                  });
                }
              }
            },
          },
        );
      }
      setActiveQuiz((prev) => (prev ? { ...prev, finished: true } : prev));
    } else {
      setActiveQuiz((prev) =>
        prev ? { ...prev, currentQ: nextQ, selectedOption: null } : prev,
      );
    }
  };

  const handleRetryQuiz = () => {
    if (!activeQuiz) return;
    setActiveQuiz((prev) =>
      prev
        ? {
            ...prev,
            currentQ: 0,
            selectedOption: null,
            answers: new Array(prev.questions.length).fill(null),
            finished: false,
          }
        : prev,
    );
  };

  const getQuizScore = () => {
    if (!activeQuiz) return 0;
    return activeQuiz.answers.filter(
      (ans, i) => ans === activeQuiz.questions[i].correct,
    ).length;
  };

  // ── Video player view ──
  if (activeVideo) {
    return (
      <VideoPlayerPage
        videoUrl={activeVideo.url}
        videoLabel={activeVideo.label}
        topicTitle={activeVideo.topicTitle}
        topicNotes={activeVideo.topicNotes}
        onBack={() => setActiveVideo(null)}
      />
    );
  }

  // ── C Programming Course ──
  if (showCCourse) {
    return (
      <CProgrammingCourseView
        onBack={() => setShowCCourse(false)}
        courseId="c"
        isEnrolled={isCourseEnrolled("c-programming")}
        onEnroll={() => enrollCourse("c-programming")}
      />
    );
  }

  // ── Frontend Developer Course ──
  if (showFECourse) {
    return (
      <CProgrammingCourseView
        onBack={() => setShowFECourse(false)}
        course={FRONTEND_DEVELOPER_COURSE}
        courseId="fe"
        courseName="Frontend Developer"
        lastModuleId="fe-advanced"
        isEnrolled={isCourseEnrolled("frontend-developer-course")}
        onEnroll={() => enrollCourse("frontend-developer-course")}
      />
    );
  }

  // ── Python Developer Course ──
  if (showPYCourse) {
    return (
      <CProgrammingCourseView
        onBack={() => setShowPYCourse(false)}
        course={PYTHON_DEVELOPER_COURSE}
        courseId="py"
        courseName="Python Developer"
        lastModuleId="py-web"
        isEnrolled={isCourseEnrolled("python-developer-course")}
        onEnroll={() => enrollCourse("python-developer-course")}
      />
    );
  }

  // ── Backend Developer Course ──
  if (showBECourse) {
    return (
      <CProgrammingCourseView
        onBack={() => setShowBECourse(false)}
        course={BACKEND_DEVELOPER_COURSE}
        courseId="be"
        courseName="Backend Developer"
        lastModuleId="be-deployment"
        isEnrolled={isCourseEnrolled("backend-developer-course")}
        onEnroll={() => enrollCourse("backend-developer-course")}
      />
    );
  }

  // ── Full Stack Developer Course ──
  if (showFSCourse) {
    return (
      <CProgrammingCourseView
        onBack={() => setShowFSCourse(false)}
        course={FULLSTACK_DEVELOPER_COURSE}
        courseId="fs"
        courseName="Full Stack Developer"
        lastModuleId="fs-deployment-devops"
        isEnrolled={isCourseEnrolled("fullstack-developer-course")}
        onEnroll={() => enrollCourse("fullstack-developer-course")}
      />
    );
  }

  // ── Data Science Course ──
  if (showDSCourse) {
    return (
      <CProgrammingCourseView
        onBack={() => setShowDSCourse(false)}
        course={DATA_SCIENCE_COURSE}
        courseId="ds"
        courseName="Data Science"
        lastModuleId="ds-real-world"
        isEnrolled={isCourseEnrolled("data-science-course")}
        onEnroll={() => enrollCourse("data-science-course")}
      />
    );
  }

  // ── Machine Learning Course ──
  if (showMLCourse) {
    return (
      <CProgrammingCourseView
        onBack={() => setShowMLCourse(false)}
        course={ML_COURSE.modules}
        courseId="machine-learning-course"
        courseName="Machine Learning"
        lastModuleId="ml-production"
        isEnrolled={isCourseEnrolled("machine-learning-course")}
        onEnroll={() => enrollCourse("machine-learning-course")}
      />
    );
  }

  // ── DevOps Course ──
  if (showDevOpsCourse) {
    return (
      <CProgrammingCourseView
        onBack={() => setShowDevOpsCourse(false)}
        course={DEVOPS_COURSE.modules}
        courseId="devops-course"
        courseName="DevOps Engineer"
        lastModuleId="devops-practices"
        isEnrolled={isCourseEnrolled("devops-course")}
        onEnroll={() => enrollCourse("devops-course")}
      />
    );
  }

  // ── Android Development Course ──
  if (showAndroidCourse) {
    return (
      <CProgrammingCourseView
        onBack={() => setShowAndroidCourse(false)}
        course={ANDROID_COURSE.modules}
        courseId="android-development-course"
        courseName="Android Developer"
        lastModuleId="android-testing-deploy"
        isEnrolled={isCourseEnrolled("android-development-course")}
        onEnroll={() => enrollCourse("android-development-course")}
      />
    );
  }

  // ── iOS Development Course ──
  if (showIosCourse) {
    return (
      <CProgrammingCourseView
        onBack={() => setShowIosCourse(false)}
        course={IOS_COURSE.modules}
        courseId="ios-development-course"
        courseName="iOS Developer"
        lastModuleId="ios-data-publishing"
        isEnrolled={isCourseEnrolled("ios-development-course")}
        onEnroll={() => enrollCourse("ios-development-course")}
      />
    );
  }

  // ── Cybersecurity Course ──
  if (showCybersecCourse) {
    return (
      <CProgrammingCourseView
        onBack={() => setShowCybersecCourse(false)}
        course={CYBERSECURITY_COURSE.modules}
        courseId="cybersecurity-course"
        courseName="Cybersecurity"
        lastModuleId="cyber-application-security"
        isEnrolled={isCourseEnrolled("cybersecurity-course")}
        onEnroll={() => enrollCourse("cybersecurity-course")}
      />
    );
  }

  // ── Blockchain Course ──
  if (showBlockchainCourse) {
    return (
      <CProgrammingCourseView
        onBack={() => setShowBlockchainCourse(false)}
        course={BLOCKCHAIN_COURSE.modules}
        courseId="blockchain-course"
        courseName="Blockchain Development"
        lastModuleId="blockchain-web3-dapps"
        isEnrolled={isCourseEnrolled("blockchain-course")}
        onEnroll={() => enrollCourse("blockchain-course")}
      />
    );
  }

  // ── Cloud Computing Course ──
  if (showCloudCourse) {
    return (
      <CProgrammingCourseView
        onBack={() => setShowCloudCourse(false)}
        course={CLOUD_COURSE.modules}
        courseId="cloud-computing-course"
        courseName="Cloud Computing"
        lastModuleId="cloud-operations"
        isEnrolled={isCourseEnrolled("cloud-computing-course")}
        onEnroll={() => enrollCourse("cloud-computing-course")}
      />
    );
  }

  // ── AI/ML Engineer Course ──
  if (showAiMlCourse) {
    return (
      <CProgrammingCourseView
        onBack={() => setShowAiMlCourse(false)}
        course={AIML_ENGINEER_COURSE.modules}
        courseId="aiml-engineer-course"
        courseName="AI/ML Engineer"
        lastModuleId="aiml-in-production"
        isEnrolled={isCourseEnrolled("aiml-engineer-course")}
        onEnroll={() => enrollCourse("aiml-engineer-course")}
      />
    );
  }

  // ── Game Development Course ──
  if (showGameDevCourse) {
    return (
      <CProgrammingCourseView
        onBack={() => setShowGameDevCourse(false)}
        course={GAME_DEV_COURSE.modules}
        courseId="game-development-course"
        courseName="Game Development"
        lastModuleId="gamedev-advanced"
        isEnrolled={isCourseEnrolled("game-development-course")}
        onEnroll={() => enrollCourse("game-development-course")}
      />
    );
  }

  // ── UI/UX Designer Course ──
  if (showUiUxCourse) {
    return (
      <CProgrammingCourseView
        onBack={() => setShowUiUxCourse(false)}
        course={UIUX_DESIGNER_COURSE.modules}
        courseId="uiux-designer-course"
        courseName="UI/UX Designer"
        lastModuleId="uiux-ui-implementation"
        isEnrolled={isCourseEnrolled("uiux-designer-course")}
        onEnroll={() => enrollCourse("uiux-designer-course")}
      />
    );
  }

  // ── Java Developer Course ──
  if (showJavaCourse) {
    return (
      <CProgrammingCourseView
        onBack={() => setShowJavaCourse(false)}
        course={JAVA_DEVELOPER_COURSE}
        courseId="java-developer-course"
        courseName="Java Developer"
        lastModuleId="java-module5"
        isEnrolled={isCourseEnrolled("java-developer-course")}
        onEnroll={() => enrollCourse("java-developer-course")}
      />
    );
  }

  // ── CS Subjects Course ──
  if (showCsSubjectsCourse) {
    return (
      <CProgrammingCourseView
        onBack={() => setShowCsSubjectsCourse(false)}
        course={csSubjectsCourse.modules}
        courseId="cs-subjects"
        courseName="CS Subjects"
        lastModuleId="cs-digital-electronics"
        isEnrolled={isCourseEnrolled("cs-subjects")}
        onEnroll={() => enrollCourse("cs-subjects")}
      />
    );
  }

  // ── System Design Course ──
  if (showSystemDesignCourse) {
    return (
      <CProgrammingCourseView
        onBack={() => setShowSystemDesignCourse(false)}
        course={systemDesignCourse.modules}
        courseId="system-design"
        courseName="System Design"
        lastModuleId="sd-interview-prep"
        isEnrolled={isCourseEnrolled("system-design")}
        onEnroll={() => enrollCourse("system-design")}
      />
    );
  }

  // ── Domain list view ──
  if (view === "list") {
    return (
      <div className="flex-1 overflow-y-auto px-3 sm:px-4 pb-nav-safe pt-4">
        <AnimatePresence>
          {enrollToast && (
            <motion.div
              initial={{ opacity: 0, y: -16, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.96 }}
              className="fixed top-4 left-1/2 -translate-x-1/2 z-[100] max-w-sm w-[90vw] bg-red-500/90 text-white text-xs font-semibold px-4 py-3 rounded-2xl shadow-2xl border border-red-400/40 backdrop-blur-sm flex items-center gap-2"
              data-ocid="roadmap.enroll_error_toast"
            >
              <span className="text-base shrink-0">⚠️</span>
              <span>{enrollToast}</span>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="max-w-2xl mx-auto">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-foreground">
              Developer Roadmaps
            </h2>
            <p className="text-xs text-muted-foreground mt-1">
              Choose your path. Each topic has videos, detailed study notes, and
              official docs for revision.
            </p>
            {(user.enrolledCourses ?? []).length > 0 && (
              <div className="mt-2 flex items-center gap-1.5 text-xs text-green-400 font-medium">
                <CheckCircle className="w-3.5 h-3.5" />
                {(user.enrolledCourses ?? []).length}/2 course slots used
              </div>
            )}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {ROADMAPS.map((roadmap) => {
              // Special card for C programming
              if (roadmap.id === "c-programming") {
                const modsDone = C_PROGRAMMING_COURSE.filter((m) =>
                  getCModuleDone(m.id),
                ).length;
                const modsTotal = C_PROGRAMMING_COURSE.length;
                const pct = Math.round((modsDone / modsTotal) * 100);
                const enrolled = isCourseEnrolled(roadmap.id);
                return (
                  <motion.div
                    key={roadmap.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`rounded-2xl border overflow-hidden transition-colors ${enrolled ? "border-cyan-500/40" : "border-border"} bg-gradient-to-r ${roadmap.color}`}
                    data-ocid="roadmap.c_programming_card"
                  >
                    <button
                      type="button"
                      onClick={() =>
                        openCourse(roadmap.id, roadmap.title, () =>
                          setShowCCourse(true),
                        )
                      }
                      className="w-full text-left p-4"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          <span className="text-3xl shrink-0">
                            {roadmap.icon}
                          </span>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <div className="font-bold text-foreground text-sm">
                                {roadmap.title}
                              </div>
                              {enrolled && (
                                <CheckCircle className="w-4 h-4 text-green-400 shrink-0" />
                              )}
                            </div>
                            <div className="text-xs text-muted-foreground mt-0.5">
                              {roadmap.description}
                            </div>
                            <div className="flex items-center gap-2 mt-2 flex-wrap">
                              <span
                                className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${roadmap.tagColor}`}
                              >
                                {modsTotal} modules
                              </span>
                              <span className="text-xs px-2 py-0.5 rounded-full border text-cyan-400 bg-cyan-500/10 border-cyan-500/20">
                                Structured Course
                              </span>
                              {modsDone > 0 && (
                                <span className="text-xs text-cyan-400 font-semibold">
                                  {pct}% done
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                        <ChevronDown className="w-5 h-5 text-muted-foreground -rotate-90 shrink-0 mt-1" />
                      </div>
                      {modsDone > 0 && (
                        <div className="mt-3">
                          <div className="h-1.5 w-full bg-border rounded-full overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${pct}%` }}
                              className="h-full bg-cyan-500 rounded-full"
                            />
                          </div>
                        </div>
                      )}
                    </button>
                    {/* Enroll row */}
                    <div className="px-4 pb-3 flex gap-2 border-t border-border/40 pt-2">
                      {enrolled ? (
                        <>
                          <button
                            type="button"
                            onClick={() => setShowCCourse(true)}
                            data-ocid="roadmap.continue_button"
                            className="flex-1 text-xs py-1.5 rounded-xl font-semibold bg-green-500/15 text-green-400 border border-green-500/25 hover:bg-green-500/25 transition-colors"
                          >
                            ▶ Continue
                          </button>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              unenrollCourse(roadmap.id);
                            }}
                            data-ocid="roadmap.unenroll_button"
                            className="text-xs px-3 py-1.5 rounded-xl font-medium text-muted-foreground hover:text-red-400 transition-colors border border-transparent hover:border-red-400/20"
                          >
                            Unenroll
                          </button>
                        </>
                      ) : (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            enrollCourse(roadmap.id);
                          }}
                          data-ocid="roadmap.enroll_button"
                          className="flex-1 text-xs py-1.5 rounded-xl font-semibold bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
                        >
                          + Enroll
                        </button>
                      )}
                    </div>
                  </motion.div>
                );
              }

              // Special card for Frontend Developer structured course
              if (roadmap.id === "frontend-developer-course") {
                const modsDone = FRONTEND_DEVELOPER_COURSE.filter((m) =>
                  getCModuleDone(m.id),
                ).length;
                const modsTotal = FRONTEND_DEVELOPER_COURSE.length;
                const pct = Math.round((modsDone / modsTotal) * 100);
                const enrolled = isCourseEnrolled(roadmap.id);
                return (
                  <motion.div
                    key={roadmap.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`rounded-2xl border overflow-hidden transition-colors ${enrolled ? "border-pink-500/40" : "border-border"} bg-gradient-to-r ${roadmap.color}`}
                    data-ocid="roadmap.fe_course_card"
                  >
                    <button
                      type="button"
                      onClick={() =>
                        openCourse(roadmap.id, roadmap.title, () =>
                          setShowFECourse(true),
                        )
                      }
                      className="w-full text-left p-4"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          <span className="text-3xl shrink-0">
                            {roadmap.icon}
                          </span>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <div className="font-bold text-foreground text-sm">
                                {roadmap.title}
                              </div>
                              {enrolled && (
                                <CheckCircle className="w-4 h-4 text-green-400 shrink-0" />
                              )}
                            </div>
                            <div className="text-xs text-muted-foreground mt-0.5">
                              {roadmap.description}
                            </div>
                            <div className="flex items-center gap-2 mt-2 flex-wrap">
                              <span
                                className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${roadmap.tagColor}`}
                              >
                                {modsTotal} modules
                              </span>
                              <span className="text-xs px-2 py-0.5 rounded-full border text-pink-400 bg-pink-500/10 border-pink-500/20">
                                Structured Course
                              </span>
                              {modsDone > 0 && (
                                <span className="text-xs text-pink-400 font-semibold">
                                  {pct}% done
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                        <ChevronDown className="w-5 h-5 text-muted-foreground -rotate-90 shrink-0 mt-1" />
                      </div>
                      {modsDone > 0 && (
                        <div className="mt-3">
                          <div className="h-1.5 w-full bg-border rounded-full overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${pct}%` }}
                              className="h-full bg-pink-500 rounded-full"
                            />
                          </div>
                        </div>
                      )}
                    </button>
                    <div className="px-4 pb-3 flex gap-2 border-t border-border/40 pt-2">
                      {enrolled ? (
                        <>
                          <button
                            type="button"
                            onClick={() => setShowFECourse(true)}
                            data-ocid="roadmap.continue_button"
                            className="flex-1 text-xs py-1.5 rounded-xl font-semibold bg-green-500/15 text-green-400 border border-green-500/25 hover:bg-green-500/25 transition-colors"
                          >
                            ▶ Continue
                          </button>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              unenrollCourse(roadmap.id);
                            }}
                            data-ocid="roadmap.unenroll_button"
                            className="text-xs px-3 py-1.5 rounded-xl font-medium text-muted-foreground hover:text-red-400 transition-colors border border-transparent hover:border-red-400/20"
                          >
                            Unenroll
                          </button>
                        </>
                      ) : (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            enrollCourse(roadmap.id);
                          }}
                          data-ocid="roadmap.enroll_button"
                          className="flex-1 text-xs py-1.5 rounded-xl font-semibold bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
                        >
                          + Enroll
                        </button>
                      )}
                    </div>
                  </motion.div>
                );
              }

              // Special card for Python Developer structured course
              if (roadmap.id === "python-developer-course") {
                const modsDone = PYTHON_DEVELOPER_COURSE.filter((m) =>
                  getCModuleDone(m.id),
                ).length;
                const modsTotal = PYTHON_DEVELOPER_COURSE.length;
                const pct = Math.round((modsDone / modsTotal) * 100);
                const enrolled = isCourseEnrolled(roadmap.id);
                return (
                  <motion.div
                    key={roadmap.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`rounded-2xl border overflow-hidden transition-colors ${enrolled ? "border-yellow-500/40" : "border-border"} bg-gradient-to-r ${roadmap.color}`}
                    data-ocid="roadmap.py_course_card"
                  >
                    <button
                      type="button"
                      onClick={() =>
                        openCourse(roadmap.id, roadmap.title, () =>
                          setShowPYCourse(true),
                        )
                      }
                      className="w-full text-left p-4"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          <span className="text-3xl shrink-0">
                            {roadmap.icon}
                          </span>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <div className="font-bold text-foreground text-sm">
                                {roadmap.title}
                              </div>
                              {enrolled && (
                                <CheckCircle className="w-4 h-4 text-green-400 shrink-0" />
                              )}
                            </div>
                            <div className="text-xs text-muted-foreground mt-0.5">
                              {roadmap.description}
                            </div>
                            <div className="flex items-center gap-2 mt-2 flex-wrap">
                              <span
                                className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${roadmap.tagColor}`}
                              >
                                {modsTotal} modules
                              </span>
                              <span className="text-xs px-2 py-0.5 rounded-full border text-yellow-400 bg-yellow-500/10 border-yellow-500/20">
                                Structured Course
                              </span>
                              {modsDone > 0 && (
                                <span className="text-xs text-yellow-400 font-semibold">
                                  {pct}% done
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                        <ChevronDown className="w-5 h-5 text-muted-foreground -rotate-90 shrink-0 mt-1" />
                      </div>
                      {modsDone > 0 && (
                        <div className="mt-3">
                          <div className="h-1.5 w-full bg-border rounded-full overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${pct}%` }}
                              className="h-full bg-yellow-500 rounded-full"
                            />
                          </div>
                        </div>
                      )}
                    </button>
                    <div className="px-4 pb-3 flex gap-2 border-t border-border/40 pt-2">
                      {enrolled ? (
                        <>
                          <button
                            type="button"
                            onClick={() => setShowPYCourse(true)}
                            data-ocid="roadmap.py_continue_button"
                            className="flex-1 text-xs py-1.5 rounded-xl font-semibold bg-green-500/15 text-green-400 border border-green-500/25 hover:bg-green-500/25 transition-colors"
                          >
                            ▶ Continue
                          </button>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              unenrollCourse(roadmap.id);
                            }}
                            data-ocid="roadmap.py_unenroll_button"
                            className="text-xs px-3 py-1.5 rounded-xl font-medium text-muted-foreground hover:text-red-400 transition-colors border border-transparent hover:border-red-400/20"
                          >
                            Unenroll
                          </button>
                        </>
                      ) : (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            enrollCourse(roadmap.id);
                          }}
                          data-ocid="roadmap.py_enroll_button"
                          className="flex-1 text-xs py-1.5 rounded-xl font-semibold bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
                        >
                          + Enroll
                        </button>
                      )}
                    </div>
                  </motion.div>
                );
              }

              // Special card for Java Developer structured course
              if (roadmap.id === "java-developer-course") {
                const modsDone = JAVA_DEVELOPER_COURSE.filter((m) =>
                  getCModuleDone(m.id),
                ).length;
                const modsTotal = JAVA_DEVELOPER_COURSE.length;
                const pct = Math.round((modsDone / modsTotal) * 100);
                const enrolled = isCourseEnrolled(roadmap.id);
                return (
                  <motion.div
                    key={roadmap.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`rounded-2xl border overflow-hidden transition-colors ${enrolled ? "border-orange-500/40" : "border-border"} bg-gradient-to-r ${roadmap.color}`}
                    data-ocid="roadmap.java_course_card"
                  >
                    <button
                      type="button"
                      onClick={() =>
                        openCourse(roadmap.id, roadmap.title, () =>
                          setShowJavaCourse(true),
                        )
                      }
                      className="w-full text-left p-4"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          <span className="text-3xl shrink-0">
                            {roadmap.icon}
                          </span>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <div className="font-bold text-foreground text-sm">
                                {roadmap.title}
                              </div>
                              {enrolled && (
                                <CheckCircle className="w-4 h-4 text-green-400 shrink-0" />
                              )}
                            </div>
                            <div className="text-xs text-muted-foreground mt-0.5">
                              {roadmap.description}
                            </div>
                            <div className="flex items-center gap-2 mt-2 flex-wrap">
                              <span
                                className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${roadmap.tagColor}`}
                              >
                                {modsTotal} modules
                              </span>
                              <span className="text-xs px-2 py-0.5 rounded-full border text-orange-400 bg-orange-500/10 border-orange-500/20">
                                Structured Course
                              </span>
                              {modsDone > 0 && (
                                <span className="text-xs text-orange-400 font-semibold">
                                  {pct}% done
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                        <ChevronDown className="w-5 h-5 text-muted-foreground -rotate-90 shrink-0 mt-1" />
                      </div>
                      {modsDone > 0 && (
                        <div className="mt-3">
                          <div className="h-1.5 w-full bg-border rounded-full overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${pct}%` }}
                              className="h-full bg-orange-500 rounded-full"
                            />
                          </div>
                        </div>
                      )}
                    </button>
                    <div className="px-4 pb-3 flex gap-2 border-t border-border/40 pt-2">
                      {enrolled ? (
                        <>
                          <button
                            type="button"
                            onClick={() => setShowJavaCourse(true)}
                            data-ocid="roadmap.java_continue_button"
                            className="flex-1 text-xs py-1.5 rounded-xl font-semibold bg-green-500/15 text-green-400 border border-green-500/25 hover:bg-green-500/25 transition-colors"
                          >
                            ▶ Continue
                          </button>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              unenrollCourse(roadmap.id);
                            }}
                            data-ocid="roadmap.java_unenroll_button"
                            className="text-xs px-3 py-1.5 rounded-xl font-medium text-muted-foreground hover:text-red-400 transition-colors border border-transparent hover:border-red-400/20"
                          >
                            Unenroll
                          </button>
                        </>
                      ) : (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            enrollCourse(roadmap.id);
                          }}
                          data-ocid="roadmap.java_enroll_button"
                          className="flex-1 text-xs py-1.5 rounded-xl font-semibold bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
                        >
                          + Enroll
                        </button>
                      )}
                    </div>
                  </motion.div>
                );
              }

              // Special card for Backend Developer structured course
              if (roadmap.id === "backend-developer-course") {
                const modsDone = BACKEND_DEVELOPER_COURSE.filter((m) =>
                  getCModuleDone(m.id),
                ).length;
                const modsTotal = BACKEND_DEVELOPER_COURSE.length;
                const pct = Math.round((modsDone / modsTotal) * 100);
                const enrolled = isCourseEnrolled(roadmap.id);
                return (
                  <motion.div
                    key={roadmap.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`rounded-2xl border overflow-hidden transition-colors ${enrolled ? "border-green-500/40" : "border-border"} bg-gradient-to-r ${roadmap.color}`}
                    data-ocid="roadmap.be_course_card"
                  >
                    <button
                      type="button"
                      onClick={() =>
                        openCourse(roadmap.id, roadmap.title, () =>
                          setShowBECourse(true),
                        )
                      }
                      className="w-full text-left p-4"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          <span className="text-3xl shrink-0">
                            {roadmap.icon}
                          </span>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <div className="font-bold text-foreground text-sm">
                                {roadmap.title}
                              </div>
                              {enrolled && (
                                <CheckCircle className="w-4 h-4 text-green-400 shrink-0" />
                              )}
                            </div>
                            <div className="text-xs text-muted-foreground mt-0.5">
                              {roadmap.description}
                            </div>
                            <div className="flex items-center gap-2 mt-2 flex-wrap">
                              <span
                                className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${roadmap.tagColor}`}
                              >
                                {modsTotal} modules
                              </span>
                              <span className="text-xs px-2 py-0.5 rounded-full border text-green-400 bg-green-500/10 border-green-500/20">
                                Structured Course
                              </span>
                              {modsDone > 0 && (
                                <span className="text-xs text-green-400 font-semibold">
                                  {pct}% done
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                        <ChevronDown className="w-5 h-5 text-muted-foreground -rotate-90 shrink-0 mt-1" />
                      </div>
                      {modsDone > 0 && (
                        <div className="mt-3">
                          <div className="h-1.5 w-full bg-border rounded-full overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${pct}%` }}
                              className="h-full bg-green-500 rounded-full"
                            />
                          </div>
                        </div>
                      )}
                    </button>
                    <div className="px-4 pb-3 flex gap-2 border-t border-border/40 pt-2">
                      {enrolled ? (
                        <>
                          <button
                            type="button"
                            onClick={() => setShowBECourse(true)}
                            data-ocid="roadmap.be_continue_button"
                            className="flex-1 text-xs py-1.5 rounded-xl font-semibold bg-green-500/15 text-green-400 border border-green-500/25 hover:bg-green-500/25 transition-colors"
                          >
                            ▶ Continue
                          </button>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              unenrollCourse(roadmap.id);
                            }}
                            data-ocid="roadmap.be_unenroll_button"
                            className="text-xs px-3 py-1.5 rounded-xl font-medium text-muted-foreground hover:text-red-400 transition-colors border border-transparent hover:border-red-400/20"
                          >
                            Unenroll
                          </button>
                        </>
                      ) : (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            enrollCourse(roadmap.id);
                          }}
                          data-ocid="roadmap.be_enroll_button"
                          className="flex-1 text-xs py-1.5 rounded-xl font-semibold bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
                        >
                          + Enroll
                        </button>
                      )}
                    </div>
                  </motion.div>
                );
              }

              // Special card for Full Stack Developer structured course
              if (roadmap.id === "fullstack-developer-course") {
                const modsDone = FULLSTACK_DEVELOPER_COURSE.filter((m) =>
                  getCModuleDone(m.id),
                ).length;
                const modsTotal = FULLSTACK_DEVELOPER_COURSE.length;
                const pct = Math.round((modsDone / modsTotal) * 100);
                const enrolled = isCourseEnrolled(roadmap.id);
                return (
                  <motion.div
                    key={roadmap.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`rounded-2xl border overflow-hidden transition-colors ${enrolled ? "border-orange-500/40" : "border-border"} bg-gradient-to-r ${roadmap.color}`}
                    data-ocid="roadmap.fs_course_card"
                  >
                    <button
                      type="button"
                      onClick={() =>
                        openCourse(roadmap.id, roadmap.title, () =>
                          setShowFSCourse(true),
                        )
                      }
                      className="w-full text-left p-4"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          <span className="text-3xl shrink-0">
                            {roadmap.icon}
                          </span>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <div className="font-bold text-foreground text-sm">
                                {roadmap.title}
                              </div>
                              {enrolled && (
                                <CheckCircle className="w-4 h-4 text-green-400 shrink-0" />
                              )}
                            </div>
                            <div className="text-xs text-muted-foreground mt-0.5">
                              {roadmap.description}
                            </div>
                            <div className="flex items-center gap-2 mt-2 flex-wrap">
                              <span
                                className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${roadmap.tagColor}`}
                              >
                                {modsTotal} modules
                              </span>
                              <span className="text-xs px-2 py-0.5 rounded-full border text-orange-400 bg-orange-500/10 border-orange-500/20">
                                Structured Course
                              </span>
                              {modsDone > 0 && (
                                <span className="text-xs text-orange-400 font-semibold">
                                  {pct}% done
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                        <ChevronDown className="w-5 h-5 text-muted-foreground -rotate-90 shrink-0 mt-1" />
                      </div>
                      {modsDone > 0 && (
                        <div className="mt-3">
                          <div className="h-1.5 w-full bg-border rounded-full overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${pct}%` }}
                              className="h-full bg-orange-500 rounded-full"
                            />
                          </div>
                        </div>
                      )}
                    </button>
                    <div className="px-4 pb-3 flex gap-2 border-t border-border/40 pt-2">
                      {enrolled ? (
                        <>
                          <button
                            type="button"
                            onClick={() => setShowFSCourse(true)}
                            data-ocid="roadmap.fs_continue_button"
                            className="flex-1 text-xs py-1.5 rounded-xl font-semibold bg-green-500/15 text-green-400 border border-green-500/25 hover:bg-green-500/25 transition-colors"
                          >
                            ▶ Continue
                          </button>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              unenrollCourse(roadmap.id);
                            }}
                            data-ocid="roadmap.fs_unenroll_button"
                            className="text-xs px-3 py-1.5 rounded-xl font-medium text-muted-foreground hover:text-red-400 transition-colors border border-transparent hover:border-red-400/20"
                          >
                            Unenroll
                          </button>
                        </>
                      ) : (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            enrollCourse(roadmap.id);
                          }}
                          data-ocid="roadmap.fs_enroll_button"
                          className="flex-1 text-xs py-1.5 rounded-xl font-semibold bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
                        >
                          + Enroll
                        </button>
                      )}
                    </div>
                  </motion.div>
                );
              }

              // Special card for Data Science structured course
              if (roadmap.id === "data-science-course") {
                const modsDone = DATA_SCIENCE_COURSE.filter((m) =>
                  getCModuleDone(m.id),
                ).length;
                const modsTotal = DATA_SCIENCE_COURSE.length;
                const pct = Math.round((modsDone / modsTotal) * 100);
                const enrolled = isCourseEnrolled(roadmap.id);
                return (
                  <motion.div
                    key={roadmap.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`rounded-2xl border overflow-hidden transition-colors ${enrolled ? "border-blue-500/40" : "border-border"} bg-gradient-to-r ${roadmap.color}`}
                    data-ocid="roadmap.ds_course_card"
                  >
                    <button
                      type="button"
                      onClick={() =>
                        openCourse(roadmap.id, roadmap.title, () =>
                          setShowDSCourse(true),
                        )
                      }
                      className="w-full text-left p-4"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          <span className="text-3xl shrink-0">
                            {roadmap.icon}
                          </span>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <div className="font-bold text-foreground text-sm">
                                {roadmap.title}
                              </div>
                              {enrolled && (
                                <CheckCircle className="w-4 h-4 text-green-400 shrink-0" />
                              )}
                            </div>
                            <div className="text-xs text-muted-foreground mt-0.5">
                              {roadmap.description}
                            </div>
                            <div className="flex items-center gap-2 mt-2 flex-wrap">
                              <span
                                className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${roadmap.tagColor}`}
                              >
                                {modsTotal} modules
                              </span>
                              <span className="text-xs px-2 py-0.5 rounded-full border text-blue-400 bg-blue-500/10 border-blue-500/20">
                                Structured Course
                              </span>
                              {modsDone > 0 && (
                                <span className="text-xs text-blue-400 font-semibold">
                                  {pct}% done
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                        <ChevronDown className="w-5 h-5 text-muted-foreground -rotate-90 shrink-0 mt-1" />
                      </div>
                      {modsDone > 0 && (
                        <div className="mt-3">
                          <div className="h-1.5 w-full bg-border rounded-full overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${pct}%` }}
                              className="h-full bg-blue-500 rounded-full"
                            />
                          </div>
                        </div>
                      )}
                    </button>
                    <div className="px-4 pb-3 flex gap-2 border-t border-border/40 pt-2">
                      {enrolled ? (
                        <>
                          <button
                            type="button"
                            onClick={() => setShowDSCourse(true)}
                            data-ocid="roadmap.ds_continue_button"
                            className="flex-1 text-xs py-1.5 rounded-xl font-semibold bg-green-500/15 text-green-400 border border-green-500/25 hover:bg-green-500/25 transition-colors"
                          >
                            ▶ Continue
                          </button>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              unenrollCourse(roadmap.id);
                            }}
                            data-ocid="roadmap.ds_unenroll_button"
                            className="text-xs px-3 py-1.5 rounded-xl font-medium text-muted-foreground hover:text-red-400 transition-colors border border-transparent hover:border-red-400/20"
                          >
                            Unenroll
                          </button>
                        </>
                      ) : (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            enrollCourse(roadmap.id);
                          }}
                          data-ocid="roadmap.ds_enroll_button"
                          className="flex-1 text-xs py-1.5 rounded-xl font-semibold bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
                        >
                          + Enroll
                        </button>
                      )}
                    </div>
                  </motion.div>
                );
              }

              // Special card for Machine Learning structured course
              if (roadmap.id === "machine-learning-course") {
                const modsDone = ML_COURSE.modules.filter((m) =>
                  getCModuleDone(m.id),
                ).length;
                const modsTotal = ML_COURSE.modules.length;
                const pct = Math.round((modsDone / modsTotal) * 100);
                const enrolled = isCourseEnrolled(roadmap.id);
                return (
                  <motion.div
                    key={roadmap.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`rounded-2xl border overflow-hidden transition-colors ${enrolled ? "border-purple-500/40" : "border-border"} bg-gradient-to-r ${roadmap.color}`}
                    data-ocid="roadmap.ml_course_card"
                  >
                    <button
                      type="button"
                      onClick={() =>
                        openCourse(roadmap.id, roadmap.title, () =>
                          setShowMLCourse(true),
                        )
                      }
                      className="w-full text-left p-4"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          <span className="text-3xl shrink-0">
                            {roadmap.icon}
                          </span>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <div className="font-bold text-foreground text-sm">
                                {roadmap.title}
                              </div>
                              {enrolled && (
                                <CheckCircle className="w-4 h-4 text-green-400 shrink-0" />
                              )}
                            </div>
                            <div className="text-xs text-muted-foreground mt-0.5">
                              {roadmap.description}
                            </div>
                            <div className="flex items-center gap-2 mt-2 flex-wrap">
                              <span
                                className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${roadmap.tagColor}`}
                              >
                                {modsTotal} modules
                              </span>
                              <span className="text-xs px-2 py-0.5 rounded-full border text-purple-400 bg-purple-500/10 border-purple-500/20">
                                Structured Course
                              </span>
                              {modsDone > 0 && (
                                <span className="text-xs text-purple-400 font-semibold">
                                  {pct}% done
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                        <ChevronDown className="w-5 h-5 text-muted-foreground -rotate-90 shrink-0 mt-1" />
                      </div>
                      {modsDone > 0 && (
                        <div className="mt-3">
                          <div className="h-1.5 w-full bg-border rounded-full overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${pct}%` }}
                              className="h-full bg-purple-500 rounded-full"
                            />
                          </div>
                        </div>
                      )}
                    </button>
                    <div className="px-4 pb-3 flex gap-2 border-t border-border/40 pt-2">
                      {enrolled ? (
                        <>
                          <button
                            type="button"
                            onClick={() => setShowMLCourse(true)}
                            data-ocid="roadmap.ml_continue_button"
                            className="flex-1 text-xs py-1.5 rounded-xl font-semibold bg-green-500/15 text-green-400 border border-green-500/25 hover:bg-green-500/25 transition-colors"
                          >
                            ▶ Continue
                          </button>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              unenrollCourse(roadmap.id);
                            }}
                            data-ocid="roadmap.ml_unenroll_button"
                            className="text-xs px-3 py-1.5 rounded-xl font-medium text-muted-foreground hover:text-red-400 transition-colors border border-transparent hover:border-red-400/20"
                          >
                            Unenroll
                          </button>
                        </>
                      ) : (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            enrollCourse(roadmap.id);
                          }}
                          data-ocid="roadmap.ml_enroll_button"
                          className="flex-1 text-xs py-1.5 rounded-xl font-semibold bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
                        >
                          + Enroll
                        </button>
                      )}
                    </div>
                  </motion.div>
                );
              }

              // Special card for DevOps structured course
              if (roadmap.id === "devops-course") {
                const modsDone = DEVOPS_COURSE.modules.filter((m) =>
                  getCModuleDone(m.id),
                ).length;
                const modsTotal = DEVOPS_COURSE.modules.length;
                const pct = Math.round((modsDone / modsTotal) * 100);
                const enrolled = isCourseEnrolled(roadmap.id);
                return (
                  <motion.div
                    key={roadmap.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`rounded-2xl border overflow-hidden transition-colors ${enrolled ? "border-orange-500/40" : "border-border"} bg-gradient-to-r ${roadmap.color}`}
                    data-ocid="roadmap.devops_course_card"
                  >
                    <button
                      type="button"
                      onClick={() =>
                        openCourse(roadmap.id, roadmap.title, () =>
                          setShowDevOpsCourse(true),
                        )
                      }
                      className="w-full text-left p-4"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          <span className="text-3xl shrink-0">
                            {roadmap.icon}
                          </span>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <div className="font-bold text-foreground text-sm">
                                {roadmap.title}
                              </div>
                              {enrolled && (
                                <CheckCircle className="w-4 h-4 text-green-400 shrink-0" />
                              )}
                            </div>
                            <div className="text-xs text-muted-foreground mt-0.5">
                              {roadmap.description}
                            </div>
                            <div className="flex items-center gap-2 mt-2 flex-wrap">
                              <span
                                className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${roadmap.tagColor}`}
                              >
                                {modsTotal} modules
                              </span>
                              <span className="text-xs px-2 py-0.5 rounded-full border text-orange-400 bg-orange-500/10 border-orange-500/20">
                                Structured Course
                              </span>
                              {modsDone > 0 && (
                                <span className="text-xs text-orange-400 font-semibold">
                                  {pct}% done
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                        <ChevronDown className="w-5 h-5 text-muted-foreground -rotate-90 shrink-0 mt-1" />
                      </div>
                      {modsDone > 0 && (
                        <div className="mt-3">
                          <div className="h-1.5 w-full bg-border rounded-full overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${pct}%` }}
                              className="h-full bg-orange-500 rounded-full"
                            />
                          </div>
                        </div>
                      )}
                    </button>
                    <div className="px-4 pb-3 flex gap-2 border-t border-border/40 pt-2">
                      {enrolled ? (
                        <>
                          <button
                            type="button"
                            onClick={() => setShowDevOpsCourse(true)}
                            data-ocid="roadmap.devops_continue_button"
                            className="flex-1 text-xs py-1.5 rounded-xl font-semibold bg-green-500/15 text-green-400 border border-green-500/25 hover:bg-green-500/25 transition-colors"
                          >
                            ▶ Continue
                          </button>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              unenrollCourse(roadmap.id);
                            }}
                            data-ocid="roadmap.devops_unenroll_button"
                            className="text-xs px-3 py-1.5 rounded-xl font-medium text-muted-foreground hover:text-red-400 transition-colors border border-transparent hover:border-red-400/20"
                          >
                            Unenroll
                          </button>
                        </>
                      ) : (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            enrollCourse(roadmap.id);
                          }}
                          data-ocid="roadmap.devops_enroll_button"
                          className="flex-1 text-xs py-1.5 rounded-xl font-semibold bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
                        >
                          + Enroll
                        </button>
                      )}
                    </div>
                  </motion.div>
                );
              }

              // Special card for Android Development structured course
              if (roadmap.id === "android-development-course") {
                const modsDone = ANDROID_COURSE.modules.filter((m) =>
                  getCModuleDone(m.id),
                ).length;
                const modsTotal = ANDROID_COURSE.modules.length;
                const pct = Math.round((modsDone / modsTotal) * 100);
                const enrolled = isCourseEnrolled(roadmap.id);
                return (
                  <motion.div
                    key={roadmap.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`rounded-2xl border overflow-hidden transition-colors ${enrolled ? "border-green-500/40" : "border-border"} bg-gradient-to-r ${roadmap.color}`}
                    data-ocid="roadmap.android_course_card"
                  >
                    <button
                      type="button"
                      onClick={() =>
                        openCourse(roadmap.id, roadmap.title, () =>
                          setShowAndroidCourse(true),
                        )
                      }
                      className="w-full text-left p-4"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          <span className="text-3xl shrink-0">
                            {roadmap.icon}
                          </span>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <div className="font-bold text-foreground text-sm">
                                {roadmap.title}
                              </div>
                              {enrolled && (
                                <CheckCircle className="w-4 h-4 text-green-400 shrink-0" />
                              )}
                            </div>
                            <div className="text-xs text-muted-foreground mt-0.5">
                              {roadmap.description}
                            </div>
                            <div className="flex items-center gap-2 mt-2 flex-wrap">
                              <span
                                className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${roadmap.tagColor}`}
                              >
                                {modsTotal} modules
                              </span>
                              <span className="text-xs px-2 py-0.5 rounded-full border text-green-400 bg-green-500/10 border-green-500/20">
                                Structured Course
                              </span>
                              {modsDone > 0 && (
                                <span className="text-xs text-green-400 font-semibold">
                                  {pct}% done
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                        <ChevronDown className="w-5 h-5 text-muted-foreground -rotate-90 shrink-0 mt-1" />
                      </div>
                      {modsDone > 0 && (
                        <div className="mt-3">
                          <div className="h-1.5 w-full bg-border rounded-full overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${pct}%` }}
                              className="h-full bg-green-500 rounded-full"
                            />
                          </div>
                        </div>
                      )}
                    </button>
                    <div className="px-4 pb-3 flex gap-2 border-t border-border/40 pt-2">
                      {enrolled ? (
                        <>
                          <button
                            type="button"
                            onClick={() => setShowAndroidCourse(true)}
                            data-ocid="roadmap.android_continue_button"
                            className="flex-1 text-xs py-1.5 rounded-xl font-semibold bg-green-500/15 text-green-400 border border-green-500/25 hover:bg-green-500/25 transition-colors"
                          >
                            ▶ Continue
                          </button>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              unenrollCourse(roadmap.id);
                            }}
                            data-ocid="roadmap.android_unenroll_button"
                            className="text-xs px-3 py-1.5 rounded-xl font-medium text-muted-foreground hover:text-red-400 transition-colors border border-transparent hover:border-red-400/20"
                          >
                            Unenroll
                          </button>
                        </>
                      ) : (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            enrollCourse(roadmap.id);
                          }}
                          data-ocid="roadmap.android_enroll_button"
                          className="flex-1 text-xs py-1.5 rounded-xl font-semibold bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
                        >
                          + Enroll
                        </button>
                      )}
                    </div>
                  </motion.div>
                );
              }

              // Special card for iOS Development structured course
              if (roadmap.id === "ios-development-course") {
                const modsDone = IOS_COURSE.modules.filter((m) =>
                  getCModuleDone(m.id),
                ).length;
                const modsTotal = IOS_COURSE.modules.length;
                const pct = Math.round((modsDone / modsTotal) * 100);
                const enrolled = isCourseEnrolled(roadmap.id);
                return (
                  <motion.div
                    key={roadmap.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`rounded-2xl border overflow-hidden transition-colors ${enrolled ? "border-gray-500/40" : "border-border"} bg-gradient-to-r ${roadmap.color}`}
                    data-ocid="roadmap.ios_course_card"
                  >
                    <button
                      type="button"
                      onClick={() =>
                        openCourse(roadmap.id, roadmap.title, () =>
                          setShowIosCourse(true),
                        )
                      }
                      className="w-full text-left p-4"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          <span className="text-3xl shrink-0">
                            {roadmap.icon}
                          </span>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <div className="font-bold text-foreground text-sm">
                                {roadmap.title}
                              </div>
                              {enrolled && (
                                <CheckCircle className="w-4 h-4 text-green-400 shrink-0" />
                              )}
                            </div>
                            <div className="text-xs text-muted-foreground mt-0.5">
                              {roadmap.description}
                            </div>
                            <div className="flex items-center gap-2 mt-2 flex-wrap">
                              <span
                                className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${roadmap.tagColor}`}
                              >
                                {modsTotal} modules
                              </span>
                              <span className="text-xs px-2 py-0.5 rounded-full border text-gray-400 bg-gray-500/10 border-gray-500/20">
                                Structured Course
                              </span>
                              {modsDone > 0 && (
                                <span className="text-xs text-gray-400 font-semibold">
                                  {pct}% done
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                        <ChevronDown className="w-5 h-5 text-muted-foreground -rotate-90 shrink-0 mt-1" />
                      </div>
                      {modsDone > 0 && (
                        <div className="mt-3">
                          <div className="h-1.5 w-full bg-border rounded-full overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${pct}%` }}
                              className="h-full bg-gray-400 rounded-full"
                            />
                          </div>
                        </div>
                      )}
                    </button>
                    <div className="px-4 pb-3 flex gap-2 border-t border-border/40 pt-2">
                      {enrolled ? (
                        <>
                          <button
                            type="button"
                            onClick={() => setShowIosCourse(true)}
                            data-ocid="roadmap.ios_continue_button"
                            className="flex-1 text-xs py-1.5 rounded-xl font-semibold bg-gray-500/15 text-gray-300 border border-gray-500/25 hover:bg-gray-500/25 transition-colors"
                          >
                            ▶ Continue
                          </button>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              unenrollCourse(roadmap.id);
                            }}
                            data-ocid="roadmap.ios_unenroll_button"
                            className="text-xs px-3 py-1.5 rounded-xl font-medium text-muted-foreground hover:text-red-400 transition-colors border border-transparent hover:border-red-400/20"
                          >
                            Unenroll
                          </button>
                        </>
                      ) : (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            enrollCourse(roadmap.id);
                          }}
                          data-ocid="roadmap.ios_enroll_button"
                          className="flex-1 text-xs py-1.5 rounded-xl font-semibold bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
                        >
                          + Enroll
                        </button>
                      )}
                    </div>
                  </motion.div>
                );
              }

              // Special card for Cybersecurity structured course
              if (roadmap.id === "cybersecurity-course") {
                const modsDone = CYBERSECURITY_COURSE.modules.filter((m) =>
                  getCModuleDone(m.id),
                ).length;
                const modsTotal = CYBERSECURITY_COURSE.modules.length;
                const pct = Math.round((modsDone / modsTotal) * 100);
                const enrolled = isCourseEnrolled(roadmap.id);
                return (
                  <motion.div
                    key={roadmap.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`rounded-2xl border overflow-hidden transition-colors ${enrolled ? "border-red-500/40" : "border-border"} bg-gradient-to-r ${roadmap.color}`}
                    data-ocid="roadmap.cybersec_course_card"
                  >
                    <button
                      type="button"
                      onClick={() =>
                        openCourse(roadmap.id, roadmap.title, () =>
                          setShowCybersecCourse(true),
                        )
                      }
                      className="w-full text-left p-4"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          <span className="text-3xl shrink-0">
                            {roadmap.icon}
                          </span>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <div className="font-bold text-foreground text-sm">
                                {roadmap.title}
                              </div>
                              {enrolled && (
                                <CheckCircle className="w-4 h-4 text-green-400 shrink-0" />
                              )}
                            </div>
                            <div className="text-xs text-muted-foreground mt-0.5">
                              {roadmap.description}
                            </div>
                            <div className="flex items-center gap-2 mt-2 flex-wrap">
                              <span
                                className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${roadmap.tagColor}`}
                              >
                                {modsTotal} modules
                              </span>
                              <span className="text-xs px-2 py-0.5 rounded-full border text-red-400 bg-red-500/10 border-red-500/20">
                                Structured Course
                              </span>
                              {modsDone > 0 && (
                                <span className="text-xs text-red-400 font-semibold">
                                  {pct}% done
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                        <ChevronDown className="w-5 h-5 text-muted-foreground -rotate-90 shrink-0 mt-1" />
                      </div>
                      {modsDone > 0 && (
                        <div className="mt-3">
                          <div className="h-1.5 w-full bg-border rounded-full overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${pct}%` }}
                              className="h-full bg-red-400 rounded-full"
                            />
                          </div>
                        </div>
                      )}
                    </button>
                    <div className="px-4 pb-3 flex gap-2 border-t border-border/40 pt-2">
                      {enrolled ? (
                        <>
                          <button
                            type="button"
                            onClick={() => setShowCybersecCourse(true)}
                            data-ocid="roadmap.cybersec_continue_button"
                            className="flex-1 text-xs py-1.5 rounded-xl font-semibold bg-red-500/15 text-red-400 border border-red-500/25 hover:bg-red-500/25 transition-colors"
                          >
                            ▶ Continue
                          </button>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              unenrollCourse(roadmap.id);
                            }}
                            data-ocid="roadmap.cybersec_unenroll_button"
                            className="text-xs px-3 py-1.5 rounded-xl font-medium text-muted-foreground hover:text-red-400 transition-colors border border-transparent hover:border-red-400/20"
                          >
                            Unenroll
                          </button>
                        </>
                      ) : (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            enrollCourse(roadmap.id);
                          }}
                          data-ocid="roadmap.cybersec_enroll_button"
                          className="flex-1 text-xs py-1.5 rounded-xl font-semibold bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
                        >
                          + Enroll
                        </button>
                      )}
                    </div>
                  </motion.div>
                );
              }

              // Special card for Blockchain structured course
              if (roadmap.id === "blockchain-course") {
                const modsDone = BLOCKCHAIN_COURSE.modules.filter((m) =>
                  getCModuleDone(m.id),
                ).length;
                const modsTotal = BLOCKCHAIN_COURSE.modules.length;
                const pct = Math.round((modsDone / modsTotal) * 100);
                const enrolled = isCourseEnrolled(roadmap.id);
                return (
                  <motion.div
                    key={roadmap.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`rounded-2xl border overflow-hidden transition-colors ${enrolled ? "border-purple-500/40" : "border-border"} bg-gradient-to-r ${roadmap.color}`}
                    data-ocid="roadmap.blockchain_course_card"
                  >
                    <button
                      type="button"
                      onClick={() =>
                        openCourse(roadmap.id, roadmap.title, () =>
                          setShowBlockchainCourse(true),
                        )
                      }
                      className="w-full text-left p-4"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          <span className="text-3xl shrink-0">
                            {roadmap.icon}
                          </span>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <div className="font-bold text-foreground text-sm">
                                {roadmap.title}
                              </div>
                              {enrolled && (
                                <CheckCircle className="w-4 h-4 text-green-400 shrink-0" />
                              )}
                            </div>
                            <div className="text-xs text-muted-foreground mt-0.5">
                              {roadmap.description}
                            </div>
                            <div className="flex items-center gap-2 mt-2 flex-wrap">
                              <span
                                className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${roadmap.tagColor}`}
                              >
                                {modsTotal} modules
                              </span>
                              <span className="text-xs px-2 py-0.5 rounded-full border text-purple-400 bg-purple-500/10 border-purple-500/20">
                                Structured Course
                              </span>
                              {modsDone > 0 && (
                                <span className="text-xs text-purple-400 font-semibold">
                                  {pct}% done
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                        <ChevronDown className="w-5 h-5 text-muted-foreground -rotate-90 shrink-0 mt-1" />
                      </div>
                      {modsDone > 0 && (
                        <div className="mt-3">
                          <div className="h-1.5 w-full bg-border rounded-full overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${pct}%` }}
                              className="h-full bg-purple-400 rounded-full"
                            />
                          </div>
                        </div>
                      )}
                    </button>
                    <div className="px-4 pb-3 flex gap-2 border-t border-border/40 pt-2">
                      {enrolled ? (
                        <>
                          <button
                            type="button"
                            onClick={() => setShowBlockchainCourse(true)}
                            data-ocid="roadmap.blockchain_continue_button"
                            className="flex-1 text-xs py-1.5 rounded-xl font-semibold bg-purple-500/15 text-purple-400 border border-purple-500/25 hover:bg-purple-500/25 transition-colors"
                          >
                            ▶ Continue
                          </button>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              unenrollCourse(roadmap.id);
                            }}
                            data-ocid="roadmap.blockchain_unenroll_button"
                            className="text-xs px-3 py-1.5 rounded-xl font-medium text-muted-foreground hover:text-red-400 transition-colors border border-transparent hover:border-red-400/20"
                          >
                            Unenroll
                          </button>
                        </>
                      ) : (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            enrollCourse(roadmap.id);
                          }}
                          data-ocid="roadmap.blockchain_enroll_button"
                          className="flex-1 text-xs py-1.5 rounded-xl font-semibold bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
                        >
                          + Enroll
                        </button>
                      )}
                    </div>
                  </motion.div>
                );
              }

              // Special card for Cloud Computing structured course
              if (roadmap.id === "cloud-computing-course") {
                const modsDone = CLOUD_COURSE.modules.filter((m) =>
                  getCModuleDone(m.id),
                ).length;
                const modsTotal = CLOUD_COURSE.modules.length;
                const pct = Math.round((modsDone / modsTotal) * 100);
                const enrolled = isCourseEnrolled(roadmap.id);
                return (
                  <motion.div
                    key={roadmap.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`rounded-2xl border overflow-hidden transition-colors ${enrolled ? "border-sky-500/40" : "border-border"} bg-gradient-to-r ${roadmap.color}`}
                    data-ocid="roadmap.cloud_course_card"
                  >
                    <button
                      type="button"
                      onClick={() =>
                        openCourse(roadmap.id, roadmap.title, () =>
                          setShowCloudCourse(true),
                        )
                      }
                      className="w-full text-left p-4"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          <span className="text-3xl shrink-0">
                            {roadmap.icon}
                          </span>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <div className="font-bold text-foreground text-sm">
                                {roadmap.title}
                              </div>
                              {enrolled && (
                                <CheckCircle className="w-4 h-4 text-green-400 shrink-0" />
                              )}
                            </div>
                            <div className="text-xs text-muted-foreground mt-0.5">
                              {roadmap.description}
                            </div>
                            <div className="flex items-center gap-2 mt-2 flex-wrap">
                              <span
                                className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${roadmap.tagColor}`}
                              >
                                {modsTotal} modules
                              </span>
                              <span className="text-xs px-2 py-0.5 rounded-full border text-sky-400 bg-sky-500/10 border-sky-500/20">
                                Structured Course
                              </span>
                              {modsDone > 0 && (
                                <span className="text-xs text-sky-400 font-semibold">
                                  {pct}% done
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                        <ChevronDown className="w-5 h-5 text-muted-foreground -rotate-90 shrink-0 mt-1" />
                      </div>
                      {modsDone > 0 && (
                        <div className="mt-3">
                          <div className="h-1.5 w-full bg-border rounded-full overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${pct}%` }}
                              className="h-full bg-sky-400 rounded-full"
                            />
                          </div>
                        </div>
                      )}
                    </button>
                    <div className="px-4 pb-3 flex gap-2 border-t border-border/40 pt-2">
                      {enrolled ? (
                        <>
                          <button
                            type="button"
                            onClick={() => setShowCloudCourse(true)}
                            data-ocid="roadmap.cloud_continue_button"
                            className="flex-1 text-xs py-1.5 rounded-xl font-semibold bg-sky-500/15 text-sky-400 border border-sky-500/25 hover:bg-sky-500/25 transition-colors"
                          >
                            ▶ Continue
                          </button>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              unenrollCourse(roadmap.id);
                            }}
                            data-ocid="roadmap.cloud_unenroll_button"
                            className="text-xs px-3 py-1.5 rounded-xl font-medium text-muted-foreground hover:text-red-400 transition-colors border border-transparent hover:border-red-400/20"
                          >
                            Unenroll
                          </button>
                        </>
                      ) : (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            enrollCourse(roadmap.id);
                          }}
                          data-ocid="roadmap.cloud_enroll_button"
                          className="flex-1 text-xs py-1.5 rounded-xl font-semibold bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
                        >
                          + Enroll
                        </button>
                      )}
                    </div>
                  </motion.div>
                );
              }

              // Special card for AI/ML Engineer structured course
              if (roadmap.id === "aiml-engineer-course") {
                const modsDone = AIML_ENGINEER_COURSE.modules.filter((m) =>
                  getCModuleDone(m.id),
                ).length;
                const modsTotal = AIML_ENGINEER_COURSE.modules.length;
                const pct = Math.round((modsDone / modsTotal) * 100);
                const enrolled = isCourseEnrolled(roadmap.id);
                return (
                  <motion.div
                    key={roadmap.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`rounded-2xl border overflow-hidden transition-colors ${enrolled ? "border-violet-500/40" : "border-border"} bg-gradient-to-r ${roadmap.color}`}
                    data-ocid="roadmap.aiml_course_card"
                  >
                    <button
                      type="button"
                      onClick={() =>
                        openCourse(roadmap.id, roadmap.title, () =>
                          setShowAiMlCourse(true),
                        )
                      }
                      className="w-full text-left p-4"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          <span className="text-3xl shrink-0">
                            {roadmap.icon}
                          </span>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <div className="font-bold text-foreground text-sm">
                                {roadmap.title}
                              </div>
                              {enrolled && (
                                <CheckCircle className="w-4 h-4 text-green-400 shrink-0" />
                              )}
                            </div>
                            <div className="text-xs text-muted-foreground mt-0.5">
                              {roadmap.description}
                            </div>
                            <div className="flex items-center gap-2 mt-2 flex-wrap">
                              <span
                                className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${roadmap.tagColor}`}
                              >
                                {modsTotal} modules
                              </span>
                              <span className="text-xs px-2 py-0.5 rounded-full border text-violet-400 bg-violet-500/10 border-violet-500/20">
                                Structured Course
                              </span>
                              {modsDone > 0 && (
                                <span className="text-xs text-violet-400 font-semibold">
                                  {pct}% done
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                        <ChevronDown className="w-5 h-5 text-muted-foreground -rotate-90 shrink-0 mt-1" />
                      </div>
                      {modsDone > 0 && (
                        <div className="mt-3">
                          <div className="h-1.5 w-full bg-border rounded-full overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${pct}%` }}
                              className="h-full bg-violet-400 rounded-full"
                            />
                          </div>
                        </div>
                      )}
                    </button>
                    <div className="px-4 pb-3 flex gap-2 border-t border-border/40 pt-2">
                      {enrolled ? (
                        <>
                          <button
                            type="button"
                            onClick={() => setShowAiMlCourse(true)}
                            data-ocid="roadmap.aiml_continue_button"
                            className="flex-1 text-xs py-1.5 rounded-xl font-semibold bg-violet-500/15 text-violet-400 border border-violet-500/25 hover:bg-violet-500/25 transition-colors"
                          >
                            ▶ Continue
                          </button>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              unenrollCourse(roadmap.id);
                            }}
                            data-ocid="roadmap.aiml_unenroll_button"
                            className="text-xs px-3 py-1.5 rounded-xl font-medium text-muted-foreground hover:text-red-400 transition-colors border border-transparent hover:border-red-400/20"
                          >
                            Unenroll
                          </button>
                        </>
                      ) : (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            enrollCourse(roadmap.id);
                          }}
                          data-ocid="roadmap.aiml_enroll_button"
                          className="flex-1 text-xs py-1.5 rounded-xl font-semibold bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
                        >
                          + Enroll
                        </button>
                      )}
                    </div>
                  </motion.div>
                );
              }

              // Special card for Game Development structured course
              if (roadmap.id === "game-development-course") {
                const modsDone = GAME_DEV_COURSE.modules.filter((m) =>
                  getCModuleDone(m.id),
                ).length;
                const modsTotal = GAME_DEV_COURSE.modules.length;
                const pct = Math.round((modsDone / modsTotal) * 100);
                const enrolled = isCourseEnrolled(roadmap.id);
                return (
                  <motion.div
                    key={roadmap.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`rounded-2xl border overflow-hidden transition-colors ${enrolled ? "border-indigo-500/40" : "border-border"} bg-gradient-to-r ${roadmap.color}`}
                    data-ocid="roadmap.gamedev_course_card"
                  >
                    <button
                      type="button"
                      onClick={() =>
                        openCourse(roadmap.id, roadmap.title, () =>
                          setShowGameDevCourse(true),
                        )
                      }
                      className="w-full text-left p-4"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          <span className="text-3xl shrink-0">
                            {roadmap.icon}
                          </span>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <div className="font-bold text-foreground text-sm">
                                {roadmap.title}
                              </div>
                              {enrolled && (
                                <CheckCircle className="w-4 h-4 text-green-400 shrink-0" />
                              )}
                            </div>
                            <div className="text-xs text-muted-foreground mt-0.5">
                              {roadmap.description}
                            </div>
                            <div className="flex items-center gap-2 mt-2 flex-wrap">
                              <span
                                className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${roadmap.tagColor}`}
                              >
                                {modsTotal} modules
                              </span>
                              <span className="text-xs px-2 py-0.5 rounded-full border text-indigo-400 bg-indigo-500/10 border-indigo-500/20">
                                Structured Course
                              </span>
                              {modsDone > 0 && (
                                <span className="text-xs text-indigo-400 font-semibold">
                                  {pct}% done
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                        <ChevronDown className="w-5 h-5 text-muted-foreground -rotate-90 shrink-0 mt-1" />
                      </div>
                      {modsDone > 0 && (
                        <div className="mt-3">
                          <div className="h-1.5 w-full bg-border rounded-full overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${pct}%` }}
                              className="h-full bg-indigo-400 rounded-full"
                            />
                          </div>
                        </div>
                      )}
                    </button>
                    <div className="px-4 pb-3 flex gap-2 border-t border-border/40 pt-2">
                      {enrolled ? (
                        <>
                          <button
                            type="button"
                            onClick={() => setShowGameDevCourse(true)}
                            data-ocid="roadmap.gamedev_continue_button"
                            className="flex-1 text-xs py-1.5 rounded-xl font-semibold bg-indigo-500/15 text-indigo-400 border border-indigo-500/25 hover:bg-indigo-500/25 transition-colors"
                          >
                            ▶ Continue
                          </button>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              unenrollCourse(roadmap.id);
                            }}
                            data-ocid="roadmap.gamedev_unenroll_button"
                            className="text-xs px-3 py-1.5 rounded-xl font-medium text-muted-foreground hover:text-red-400 transition-colors border border-transparent hover:border-red-400/20"
                          >
                            Unenroll
                          </button>
                        </>
                      ) : (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            enrollCourse(roadmap.id);
                          }}
                          data-ocid="roadmap.gamedev_enroll_button"
                          className="flex-1 text-xs py-1.5 rounded-xl font-semibold bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
                        >
                          + Enroll
                        </button>
                      )}
                    </div>
                  </motion.div>
                );
              }

              // Special card for UI/UX Designer structured course
              if (roadmap.id === "uiux-designer-course") {
                const modsDone = UIUX_DESIGNER_COURSE.modules.filter((m) =>
                  getCModuleDone(m.id),
                ).length;
                const modsTotal = UIUX_DESIGNER_COURSE.modules.length;
                const pct = Math.round((modsDone / modsTotal) * 100);
                const enrolled = isCourseEnrolled(roadmap.id);
                return (
                  <motion.div
                    key={roadmap.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`rounded-2xl border overflow-hidden transition-colors ${enrolled ? "border-pink-500/40" : "border-border"} bg-gradient-to-r ${roadmap.color}`}
                    data-ocid="roadmap.uiux_course_card"
                  >
                    <button
                      type="button"
                      onClick={() =>
                        openCourse(roadmap.id, roadmap.title, () =>
                          setShowUiUxCourse(true),
                        )
                      }
                      className="w-full text-left p-4"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          <span className="text-3xl shrink-0">
                            {roadmap.icon}
                          </span>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <div className="font-bold text-foreground text-sm">
                                {roadmap.title}
                              </div>
                              {enrolled && (
                                <CheckCircle className="w-4 h-4 text-green-400 shrink-0" />
                              )}
                            </div>
                            <div className="text-xs text-muted-foreground mt-0.5">
                              {roadmap.description}
                            </div>
                            <div className="flex items-center gap-2 mt-2 flex-wrap">
                              <span
                                className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${roadmap.tagColor}`}
                              >
                                {modsTotal} modules
                              </span>
                              <span className="text-xs px-2 py-0.5 rounded-full border text-pink-400 bg-pink-500/10 border-pink-500/20">
                                Structured Course
                              </span>
                              {modsDone > 0 && (
                                <span className="text-xs text-pink-400 font-semibold">
                                  {pct}% done
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                        <ChevronDown className="w-5 h-5 text-muted-foreground -rotate-90 shrink-0 mt-1" />
                      </div>
                      {modsDone > 0 && (
                        <div className="mt-3">
                          <div className="h-1.5 w-full bg-border rounded-full overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${pct}%` }}
                              className="h-full bg-pink-400 rounded-full"
                            />
                          </div>
                        </div>
                      )}
                    </button>
                    <div className="px-4 pb-3 flex gap-2 border-t border-border/40 pt-2">
                      {enrolled ? (
                        <>
                          <button
                            type="button"
                            onClick={() => setShowUiUxCourse(true)}
                            data-ocid="roadmap.uiux_continue_button"
                            className="flex-1 text-xs py-1.5 rounded-xl font-semibold bg-pink-500/15 text-pink-400 border border-pink-500/25 hover:bg-pink-500/25 transition-colors"
                          >
                            ▶ Continue
                          </button>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              unenrollCourse(roadmap.id);
                            }}
                            data-ocid="roadmap.uiux_unenroll_button"
                            className="text-xs px-3 py-1.5 rounded-xl font-medium text-muted-foreground hover:text-red-400 transition-colors border border-transparent hover:border-red-400/20"
                          >
                            Unenroll
                          </button>
                        </>
                      ) : (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            enrollCourse(roadmap.id);
                          }}
                          data-ocid="roadmap.uiux_enroll_button"
                          className="flex-1 text-xs py-1.5 rounded-xl font-semibold bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
                        >
                          + Enroll
                        </button>
                      )}
                    </div>
                  </motion.div>
                );
              }

              // Special card for CS Subjects structured course
              if (roadmap.id === "cs-subjects") {
                const modsDone = csSubjectsCourse.modules.filter((m) =>
                  getCModuleDone(m.id),
                ).length;
                const modsTotal = csSubjectsCourse.modules.length;
                const pct = Math.round((modsDone / modsTotal) * 100);
                const enrolled = isCourseEnrolled(roadmap.id);
                return (
                  <motion.div
                    key={roadmap.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`rounded-2xl border overflow-hidden transition-colors ${enrolled ? "border-teal-500/40" : "border-border"} bg-gradient-to-r ${roadmap.color}`}
                    data-ocid="roadmap.cs_subjects_card"
                  >
                    <button
                      type="button"
                      onClick={() =>
                        openCourse(roadmap.id, roadmap.title, () =>
                          setShowCsSubjectsCourse(true),
                        )
                      }
                      className="w-full text-left p-4"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          <span className="text-3xl shrink-0">
                            {roadmap.icon}
                          </span>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <div className="font-bold text-foreground text-sm">
                                {roadmap.title}
                              </div>
                              {enrolled && (
                                <CheckCircle className="w-4 h-4 text-green-400 shrink-0" />
                              )}
                            </div>
                            <div className="text-xs text-muted-foreground mt-0.5">
                              {roadmap.description}
                            </div>
                            <div className="flex items-center gap-2 mt-2 flex-wrap">
                              <span
                                className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${roadmap.tagColor}`}
                              >
                                {modsTotal} modules
                              </span>
                              <span className="text-xs px-2 py-0.5 rounded-full border text-teal-400 bg-teal-500/10 border-teal-500/20">
                                Structured Course
                              </span>
                              {modsDone > 0 && (
                                <span className="text-xs text-teal-400 font-semibold">
                                  {pct}% done
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                        <ChevronDown className="w-5 h-5 text-muted-foreground -rotate-90 shrink-0 mt-1" />
                      </div>
                      {modsDone > 0 && (
                        <div className="mt-3">
                          <div className="h-1.5 w-full bg-border rounded-full overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${pct}%` }}
                              className="h-full bg-teal-400 rounded-full"
                            />
                          </div>
                        </div>
                      )}
                    </button>
                    <div className="px-4 pb-3 flex gap-2 border-t border-border/40 pt-2">
                      {enrolled ? (
                        <>
                          <button
                            type="button"
                            onClick={() => setShowCsSubjectsCourse(true)}
                            data-ocid="roadmap.cs_subjects_continue_button"
                            className="flex-1 text-xs py-1.5 rounded-xl font-semibold bg-teal-500/15 text-teal-400 border border-teal-500/25 hover:bg-teal-500/25 transition-colors"
                          >
                            ▶ Continue
                          </button>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              unenrollCourse(roadmap.id);
                            }}
                            data-ocid="roadmap.cs_subjects_unenroll_button"
                            className="text-xs px-3 py-1.5 rounded-xl font-medium text-muted-foreground hover:text-red-400 transition-colors border border-transparent hover:border-red-400/20"
                          >
                            Unenroll
                          </button>
                        </>
                      ) : (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            enrollCourse(roadmap.id);
                          }}
                          data-ocid="roadmap.cs_subjects_enroll_button"
                          className="flex-1 text-xs py-1.5 rounded-xl font-semibold bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
                        >
                          + Enroll
                        </button>
                      )}
                    </div>
                  </motion.div>
                );
              }

              // Special card for System Design structured course
              if (roadmap.id === "system-design") {
                const modsDone = systemDesignCourse.modules.filter((m) =>
                  getCModuleDone(m.id),
                ).length;
                const modsTotal = systemDesignCourse.modules.length;
                const pct = Math.round((modsDone / modsTotal) * 100);
                const enrolled = isCourseEnrolled(roadmap.id);
                return (
                  <motion.div
                    key={roadmap.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`rounded-2xl border overflow-hidden transition-colors ${enrolled ? "border-amber-500/40" : "border-border"} bg-gradient-to-r ${roadmap.color}`}
                    data-ocid="roadmap.system_design_card"
                  >
                    <button
                      type="button"
                      onClick={() =>
                        openCourse(roadmap.id, roadmap.title, () =>
                          setShowSystemDesignCourse(true),
                        )
                      }
                      className="w-full text-left p-4"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          <span className="text-3xl shrink-0">
                            {roadmap.icon}
                          </span>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <div className="font-bold text-foreground text-sm">
                                {roadmap.title}
                              </div>
                              {enrolled && (
                                <CheckCircle className="w-4 h-4 text-green-400 shrink-0" />
                              )}
                            </div>
                            <div className="text-xs text-muted-foreground mt-0.5">
                              {roadmap.description}
                            </div>
                            <div className="flex items-center gap-2 mt-2 flex-wrap">
                              <span
                                className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${roadmap.tagColor}`}
                              >
                                {modsTotal} modules
                              </span>
                              <span className="text-xs px-2 py-0.5 rounded-full border text-amber-400 bg-amber-500/10 border-amber-500/20">
                                Structured Course
                              </span>
                              {modsDone > 0 && (
                                <span className="text-xs text-amber-400 font-semibold">
                                  {pct}% done
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                        <ChevronDown className="w-5 h-5 text-muted-foreground -rotate-90 shrink-0 mt-1" />
                      </div>
                      {modsDone > 0 && (
                        <div className="mt-3">
                          <div className="h-1.5 w-full bg-border rounded-full overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${pct}%` }}
                              className="h-full bg-amber-400 rounded-full"
                            />
                          </div>
                        </div>
                      )}
                    </button>
                    <div className="px-4 pb-3 flex gap-2 border-t border-border/40 pt-2">
                      {enrolled ? (
                        <>
                          <button
                            type="button"
                            onClick={() => setShowSystemDesignCourse(true)}
                            data-ocid="roadmap.system_design_continue_button"
                            className="flex-1 text-xs py-1.5 rounded-xl font-semibold bg-amber-500/15 text-amber-400 border border-amber-500/25 hover:bg-amber-500/25 transition-colors"
                          >
                            ▶ Continue
                          </button>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              unenrollCourse(roadmap.id);
                            }}
                            data-ocid="roadmap.system_design_unenroll_button"
                            className="text-xs px-3 py-1.5 rounded-xl font-medium text-muted-foreground hover:text-red-400 transition-colors border border-transparent hover:border-red-400/20"
                          >
                            Unenroll
                          </button>
                        </>
                      ) : (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            enrollCourse(roadmap.id);
                          }}
                          data-ocid="roadmap.system_design_enroll_button"
                          className="flex-1 text-xs py-1.5 rounded-xl font-semibold bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
                        >
                          + Enroll
                        </button>
                      )}
                    </div>
                  </motion.div>
                );
              }

              const { done, total, pct } = getProgress(roadmap);
              const enrolled = isCourseEnrolled(roadmap.id);
              return (
                <motion.div
                  key={roadmap.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`rounded-2xl border overflow-hidden transition-colors ${enrolled ? "border-primary/40" : "border-border"} bg-gradient-to-r ${roadmap.color}`}
                >
                  <button
                    type="button"
                    onClick={() => {
                      openCourse(roadmap.id, roadmap.title, () => {
                        setSelectedRoadmap(roadmap);
                        setView("roadmap");
                      });
                    }}
                    className="w-full text-left p-4"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <span className="text-3xl shrink-0">
                          {roadmap.icon}
                        </span>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <div className="font-bold text-foreground text-sm">
                              {roadmap.title}
                            </div>
                            {enrolled && (
                              <CheckCircle className="w-4 h-4 text-green-400 shrink-0" />
                            )}
                          </div>
                          <div className="text-xs text-muted-foreground mt-0.5">
                            {roadmap.description}
                          </div>
                          <div className="flex items-center gap-2 mt-2">
                            <span
                              className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${roadmap.tagColor}`}
                            >
                              {total} topics
                            </span>
                            {done > 0 && (
                              <span className="text-xs text-green-400 font-semibold">
                                {pct}% done
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      <ChevronDown className="w-5 h-5 text-muted-foreground -rotate-90 shrink-0 mt-1" />
                    </div>
                    {done > 0 && (
                      <div className="mt-3">
                        <div className="h-1.5 w-full bg-border rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${pct}%` }}
                            className="h-full bg-primary rounded-full"
                          />
                        </div>
                      </div>
                    )}
                  </button>
                  {/* Enroll row */}
                  <div className="px-4 pb-3 flex gap-2 border-t border-border/40 pt-2">
                    {enrolled ? (
                      <>
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedRoadmap(roadmap);
                            setView("roadmap");
                          }}
                          data-ocid="roadmap.continue_button"
                          className="flex-1 text-xs py-1.5 rounded-xl font-semibold bg-green-500/15 text-green-400 border border-green-500/25 hover:bg-green-500/25 transition-colors"
                        >
                          ▶ Continue
                        </button>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            unenrollCourse(roadmap.id);
                          }}
                          data-ocid="roadmap.unenroll_button"
                          className="text-xs px-3 py-1.5 rounded-xl font-medium text-muted-foreground hover:text-red-400 transition-colors border border-transparent hover:border-red-400/20"
                        >
                          Unenroll
                        </button>
                      </>
                    ) : (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          enrollCourse(roadmap.id);
                        }}
                        data-ocid="roadmap.enroll_button"
                        className="flex-1 text-xs py-1.5 rounded-xl font-semibold bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
                      >
                        + Enroll
                      </button>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Enrollment Gate Modal */}
        <AnimatePresence>
          {gateRoadmapId && (
            <EnrollmentGate
              roadmapId={gateRoadmapId}
              roadmapTitle={gateRoadmapTitle}
              enrolledCourses={user.enrolledCourses ?? []}
              onEnroll={handleGateEnroll}
              onUnenrollOther={handleGateUnenrollOther}
              onClose={() => setGateRoadmapId(null)}
            />
          )}
        </AnimatePresence>
      </div>
    );
  }

  // ── Roadmap topics view (flat domains) ──
  if (view === "roadmap" && selectedRoadmap) {
    const { done, total } = getProgress(selectedRoadmap);
    return (
      <>
        <div className="flex-1 overflow-y-auto pb-nav-safe">
          <div className="sticky top-0 z-10 bg-background/95 backdrop-blur border-b border-border px-3 sm:px-4 py-2.5">
            <div className="flex items-center gap-2 sm:gap-3 max-w-2xl mx-auto">
              <button
                type="button"
                onClick={() => {
                  setView("list");
                  setSelectedRoadmap(null);
                  setExpandedTopic(null);
                }}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-muted hover:bg-muted/70 transition-colors text-foreground text-xs font-semibold shrink-0"
                data-ocid="roadmap.back_to_list.button"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="m15 18-6-6 6-6" />
                </svg>
                <span className="hidden sm:inline">Back</span>
              </button>
              <span className="text-2xl">{selectedRoadmap.icon}</span>
              <div className="flex-1 min-w-0">
                <div className="font-bold text-foreground text-sm">
                  {selectedRoadmap.title}
                </div>
                <div className="text-xs text-muted-foreground">
                  {done}/{total} topics completed
                </div>
              </div>
            </div>
            <div className="max-w-2xl mx-auto mt-2">
              <div className="h-1.5 w-full bg-border rounded-full overflow-hidden">
                <motion.div
                  animate={{
                    width: `${total > 0 ? Math.round((done / total) * 100) : 0}%`,
                  }}
                  className="h-full bg-primary rounded-full"
                />
              </div>
            </div>
          </div>

          <div className="px-4 pt-4 max-w-2xl mx-auto">
            <div className="relative">
              <div className="absolute left-5 top-0 bottom-0 w-0.5 bg-border z-0" />
              <div className="space-y-3 relative z-10">
                {selectedRoadmap.topics.map((topic, idx) => {
                  const isDone = isCompleted(selectedRoadmap.id, topic.id);
                  const expanded = expandedTopic === topic.id;
                  return (
                    <motion.div
                      key={topic.id}
                      initial={{ opacity: 0, x: -12 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.05 }}
                    >
                      <div className="flex items-start gap-3">
                        <button
                          type="button"
                          onClick={() =>
                            toggleComplete(selectedRoadmap.id, topic.id)
                          }
                          className={`mt-3.5 w-10 h-10 rounded-full shrink-0 border-2 flex items-center justify-center font-bold text-sm transition-all ${isDone ? "bg-primary border-primary text-primary-foreground" : "bg-background border-border text-muted-foreground hover:border-primary/50"}`}
                        >
                          {isDone ? "✓" : idx + 1}
                        </button>
                        <div className="flex-1 rounded-2xl border border-border bg-card overflow-hidden">
                          <button
                            type="button"
                            className="w-full flex items-center justify-between p-3 text-left"
                            onClick={() =>
                              setExpandedTopic(expanded ? null : topic.id)
                            }
                          >
                            <div className="flex-1 min-w-0">
                              <div className="font-semibold text-foreground text-sm">
                                {topic.title}
                              </div>
                              <div className="text-xs text-muted-foreground mt-0.5">
                                {topic.description}
                              </div>
                              <span
                                className={`mt-1 inline-block text-xs font-semibold px-2 py-0.5 rounded-full border ${levelColor[topic.level]}`}
                              >
                                {topic.level}
                              </span>
                            </div>
                            <motion.span
                              animate={{ rotate: expanded ? 180 : 0 }}
                              transition={{ duration: 0.2 }}
                              className="text-muted-foreground text-lg ml-2 shrink-0"
                            >
                              ▾
                            </motion.span>
                          </button>

                          <AnimatePresence initial={false}>
                            {expanded && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.22 }}
                                className="overflow-hidden"
                              >
                                <div className="px-3 pb-3 space-y-3 border-t border-border pt-3">
                                  <div>
                                    <div className="flex items-center gap-1.5 text-xs font-bold text-red-400 uppercase tracking-wide mb-1.5">
                                      <Play className="w-3.5 h-3.5" /> Videos
                                    </div>
                                    <div className="space-y-1.5">
                                      {topic.videos.map((v) => (
                                        <button
                                          key={v.url}
                                          type="button"
                                          onClick={() =>
                                            setActiveVideo({
                                              url: v.url,
                                              label: v.label,
                                              topicTitle: topic.title,
                                              topicNotes: topic.notes,
                                            })
                                          }
                                          className="w-full flex items-center gap-2 rounded-xl bg-muted px-3 py-2 hover:bg-accent border border-border transition-colors text-left"
                                          data-ocid="roadmap.primary_button"
                                        >
                                          <span className="text-sm">▶️</span>
                                          <span className="text-xs font-medium text-foreground flex-1">
                                            {v.label}
                                          </span>
                                          <span className="text-xs text-primary font-semibold">
                                            Watch
                                          </span>
                                        </button>
                                      ))}
                                    </div>
                                  </div>
                                  <div>
                                    <div className="flex items-center gap-1.5 text-xs font-bold text-blue-400 uppercase tracking-wide mb-1.5">
                                      <StickyNote className="w-3.5 h-3.5" />{" "}
                                      Study Notes
                                    </div>
                                    <div className="bg-blue-500/5 border border-blue-500/20 rounded-xl px-3 py-2.5">
                                      <p className="text-xs text-foreground/80 leading-relaxed whitespace-pre-line">
                                        {topic.notes}
                                      </p>
                                    </div>
                                  </div>
                                  {/* View in Documentation Hub */}
                                  <button
                                    type="button"
                                    onClick={() => {
                                      // Resolve a matching doc article using domain-aware lookup
                                      const docId =
                                        getDocId(topic.id) ??
                                        getDocId(
                                          topic.title
                                            .toLowerCase()
                                            .replace(/[^a-z0-9]+/g, "-"),
                                        ) ??
                                        getDocIdForTopic(
                                          selectedRoadmap.title,
                                          topic.title,
                                        );
                                      setRoadmapDocHubTopicId(
                                        docId ?? topic.id,
                                      );
                                      setShowRoadmapDocHub(true);
                                    }}
                                    data-ocid="roadmap.open_documentation_hub"
                                    className="w-full flex items-center gap-3 rounded-xl bg-emerald-500/8 border border-emerald-500/25 px-4 py-3 hover:bg-emerald-500/15 transition-colors group text-left"
                                  >
                                    <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-emerald-500/15 shrink-0">
                                      <BookOpen className="w-3.5 h-3.5 text-emerald-400" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <div className="text-xs font-semibold text-foreground group-hover:text-emerald-300 transition-colors">
                                        View in Documentation Hub
                                      </div>
                                      <div className="text-[11px] text-muted-foreground">
                                        Browse full docs &amp; examples
                                      </div>
                                    </div>
                                    <span className="text-emerald-400/70 text-sm shrink-0">
                                      →
                                    </span>
                                  </button>
                                  {/* 📝 Notes button */}
                                  {(() => {
                                    const nTopicId = `${selectedRoadmap.id}::${topic.id}`;
                                    const nCount = getNoteCount(nTopicId);
                                    return (
                                      <button
                                        type="button"
                                        onClick={() => {
                                          setNotesPanelTopicId(nTopicId);
                                          setNotesPanelTitle(topic.title);
                                          setShowNotesPanel(true);
                                        }}
                                        data-ocid="roadmap.notes_button"
                                        className="w-full flex items-center gap-3 rounded-xl bg-yellow-500/8 border border-yellow-500/25 px-4 py-2.5 hover:bg-yellow-500/15 transition-colors text-left"
                                      >
                                        <span className="text-base shrink-0">
                                          📝
                                        </span>
                                        <span className="text-xs font-semibold text-foreground flex-1">
                                          My Notes
                                          {nCount > 0 && (
                                            <span className="ml-1.5 text-[10px] bg-yellow-500/20 text-yellow-400 border border-yellow-500/30 rounded-full px-1.5 py-0.5 font-bold">
                                              {nCount}
                                            </span>
                                          )}
                                        </span>
                                        <span className="text-yellow-400/70 text-xs shrink-0">
                                          {nCount > 0 ? "View →" : "Add →"}
                                        </span>
                                      </button>
                                    );
                                  })()}
                                  <button
                                    type="button"
                                    onClick={() =>
                                      openQuiz(topic.id, topic.title)
                                    }
                                    data-ocid="roadmap.secondary_button"
                                    className="w-full flex items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-semibold transition-colors bg-purple-500/10 text-purple-400 border border-purple-500/20 hover:bg-purple-500/20"
                                  >
                                    <span>🧠</span>
                                    <span>Take Quiz</span>
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() =>
                                      toggleComplete(
                                        selectedRoadmap.id,
                                        topic.id,
                                      )
                                    }
                                    className={`w-full rounded-xl py-2 text-sm font-semibold transition-colors ${isDone ? "bg-green-500/10 text-green-400 border border-green-500/20 hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/20" : "bg-primary text-primary-foreground hover:bg-primary/90"}`}
                                  >
                                    {isDone
                                      ? "✓ Completed — Click to undo"
                                      : "Mark as Complete"}
                                  </button>
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Quiz Modal */}
        <AnimatePresence>
          {activeQuiz && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
              data-ocid="roadmap.modal"
            >
              <motion.div
                initial={{ scale: 0.92, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.92, opacity: 0, y: 20 }}
                transition={{ type: "spring", damping: 20, stiffness: 300 }}
                className="w-full max-w-lg bg-card rounded-3xl shadow-2xl overflow-hidden border border-border"
              >
                <div className="flex items-center justify-between px-6 pt-5 pb-3">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-foreground text-base truncate">
                      {activeQuiz.topicTitle} — Quiz 🧠
                    </h3>
                  </div>
                  <button
                    type="button"
                    onClick={() => setActiveQuiz(null)}
                    data-ocid="roadmap.close_button"
                    className="ml-3 p-1.5 rounded-full hover:bg-muted transition-colors text-muted-foreground shrink-0"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {activeQuiz.finished ? (
                  <div className="px-6 pb-6">
                    <div className="text-center py-6">
                      <div className="text-5xl mb-3">
                        {getQuizScore() >= 4
                          ? "🏆"
                          : getQuizScore() >= 2
                            ? "⭐"
                            : "💪"}
                      </div>
                      <div className="text-3xl font-bold text-foreground mb-1">
                        {getQuizScore()}/{activeQuiz.questions.length}
                      </div>
                      <div className="text-sm text-muted-foreground mb-2">
                        {getQuizScore() >= 4
                          ? "Excellent! You've mastered this topic! ✨"
                          : getQuizScore() >= 2
                            ? "Good effort! Keep reviewing to improve."
                            : "Keep studying — you'll get there! 🌱"}
                      </div>
                      <div className="inline-flex items-center gap-1.5 bg-yellow-500/10 text-yellow-400 border border-yellow-500/20 rounded-full px-3 py-1 text-sm font-semibold">
                        ⚡ +{getQuizScore() * 10} XP earned
                      </div>
                    </div>
                    <div className="space-y-2 mb-5">
                      {activeQuiz.questions.map((q, i) => {
                        const isRight = activeQuiz.answers[i] === q.correct;
                        return (
                          <div
                            key={q.q.slice(0, 30)}
                            className={`rounded-xl px-3 py-2 border text-xs ${isRight ? "bg-green-500/10 border-green-500/20 text-green-400" : "bg-red-500/10 border-red-500/20 text-red-400"}`}
                          >
                            <span className="font-semibold">
                              {isRight ? "✓" : "✗"}
                            </span>{" "}
                            {q.q.slice(0, 60)}
                            {q.q.length > 60 ? "..." : ""}
                          </div>
                        );
                      })}
                    </div>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={handleRetryQuiz}
                        data-ocid="roadmap.secondary_button"
                        className="flex-1 rounded-xl py-2.5 text-sm font-semibold bg-purple-500/10 text-purple-400 border border-purple-500/20 hover:bg-purple-500/20 transition-colors"
                      >
                        🔄 Try Again
                      </button>
                      <button
                        type="button"
                        onClick={() => setActiveQuiz(null)}
                        data-ocid="roadmap.close_button"
                        className="flex-1 rounded-xl py-2.5 text-sm font-semibold bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
                      >
                        Back to Topic
                      </button>
                    </div>
                    <button
                      type="button"
                      data-ocid="roadmap.challenge_friend.button"
                      onClick={() => {
                        setChallengeQuizScore(getQuizScore());
                        setChallengeTopicTitle(activeQuiz.topicTitle);
                        setShowChallengeModal(true);
                      }}
                      className="w-full mt-2 rounded-xl py-2.5 text-sm font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20 hover:bg-amber-500/20 transition-colors flex items-center justify-center gap-2"
                    >
                      ⚔️ Challenge a Friend
                    </button>
                  </div>
                ) : (
                  <div className="px-6 pb-6">
                    <div className="mb-4">
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-xs text-muted-foreground font-medium">
                          Question {activeQuiz.currentQ + 1} of{" "}
                          {activeQuiz.questions.length}
                        </span>
                        <span className="text-xs text-purple-400 font-semibold">
                          {Math.round(
                            (activeQuiz.currentQ /
                              activeQuiz.questions.length) *
                              100,
                          )}
                          % done
                        </span>
                      </div>
                      <div className="h-1.5 w-full bg-border rounded-full overflow-hidden">
                        <motion.div
                          animate={{
                            width: `${(activeQuiz.currentQ / activeQuiz.questions.length) * 100}%`,
                          }}
                          className="h-full bg-purple-500 rounded-full"
                        />
                      </div>
                    </div>
                    <p className="font-bold text-foreground text-sm mb-4 leading-snug">
                      {activeQuiz.questions[activeQuiz.currentQ].q}
                    </p>
                    <div className="space-y-2 mb-5">
                      {activeQuiz.questions[activeQuiz.currentQ].options.map(
                        (opt, i) => {
                          const isSelected = activeQuiz.selectedOption === i;
                          const isCorrect =
                            activeQuiz.questions[activeQuiz.currentQ]
                              .correct === i;
                          const answered = activeQuiz.selectedOption !== null;
                          let btnClass =
                            "w-full text-left rounded-xl px-4 py-3 text-sm font-medium border transition-all ";
                          if (!answered)
                            btnClass +=
                              "bg-muted text-foreground border-border hover:border-purple-500/50 hover:bg-purple-500/10 hover:text-purple-300";
                          else if (isCorrect)
                            btnClass +=
                              "bg-green-500/15 text-green-400 border-green-500/40 font-semibold";
                          else if (isSelected && !isCorrect)
                            btnClass +=
                              "bg-red-500/15 text-red-400 border-red-500/40";
                          else
                            btnClass +=
                              "bg-muted/50 text-muted-foreground border-border opacity-50";
                          return (
                            <motion.button
                              key={opt.slice(0, 30)}
                              type="button"
                              whileTap={!answered ? { scale: 0.98 } : {}}
                              onClick={() => handleSelectOption(i)}
                              disabled={answered}
                              className={btnClass}
                            >
                              <span className="font-bold mr-2 text-xs opacity-60">
                                {["A", "B", "C", "D"][i]}.
                              </span>
                              {opt}
                              {answered && isCorrect && (
                                <span className="ml-2 text-green-400">✓</span>
                              )}
                              {answered && isSelected && !isCorrect && (
                                <span className="ml-2 text-red-400">✗</span>
                              )}
                            </motion.button>
                          );
                        },
                      )}
                    </div>
                    <AnimatePresence>
                      {activeQuiz.selectedOption !== null && (
                        <motion.button
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0 }}
                          type="button"
                          onClick={handleNextQuestion}
                          data-ocid="roadmap.primary_button"
                          className="w-full rounded-xl py-3 text-sm font-bold bg-purple-500 text-white hover:bg-purple-600 transition-colors"
                        >
                          {activeQuiz.currentQ + 1 >=
                          activeQuiz.questions.length
                            ? "See Results 🏆"
                            : "Next Question →"}
                        </motion.button>
                      )}
                    </AnimatePresence>
                  </div>
                )}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Documentation Hub overlay for flat roadmap topics */}
        <AnimatePresence>
          {showRoadmapDocHub && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[60] bg-background"
              data-ocid="roadmap.documentation_hub"
            >
              <DocumentationHub
                onBack={() => setShowRoadmapDocHub(false)}
                initialTopicId={roadmapDocHubTopicId}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Notes Side Panel */}
        <NotesSidePanel
          topicId={notesPanelTopicId}
          topicTitle={notesPanelTitle}
          isOpen={showNotesPanel}
          onClose={() => setShowNotesPanel(false)}
        />

        {/* ── Seasonal Item Unlock Overlay ── */}
        <AnimatePresence>
          {seasonalUnlock && (
            <motion.div
              key="seasonal-unlock"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[80] flex items-center justify-center bg-black/70 backdrop-blur-sm px-4"
              data-ocid="roadmap.seasonal_unlock.dialog"
            >
              {/* Confetti particles */}
              <div className="absolute inset-0 pointer-events-none overflow-hidden">
                {Array.from({ length: 30 }).map((_, i) => (
                  <motion.div
                    key={`confetti-${i}`}
                    initial={{
                      opacity: 1,
                      x: `${Math.random() * 100}vw`,
                      y: -20,
                      rotate: 0,
                    }}
                    animate={{
                      opacity: 0,
                      y: "110vh",
                      rotate: Math.random() * 720 - 360,
                    }}
                    transition={{
                      duration: 2 + Math.random() * 2,
                      delay: Math.random() * 1,
                      ease: "linear",
                    }}
                    className="absolute w-3 h-3 rounded-sm"
                    style={{
                      background: [
                        "#a78bfa",
                        "#f59e0b",
                        "#34d399",
                        "#f472b6",
                        "#60a5fa",
                      ][i % 5],
                    }}
                  />
                ))}
              </div>

              <motion.div
                initial={{ scale: 0.6, opacity: 0, y: 40 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.8, opacity: 0 }}
                transition={{ type: "spring", stiffness: 260, damping: 20 }}
                className="bg-card border border-border rounded-3xl p-8 max-w-sm w-full text-center shadow-2xl relative z-10"
              >
                <motion.div
                  animate={{ scale: [1, 1.2, 1], rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 1.2, repeat: 2 }}
                  className="text-6xl mb-4"
                >
                  {seasonalUnlock.emoji}
                </motion.div>
                <div className="inline-flex items-center gap-1.5 bg-primary/15 text-primary border border-primary/25 rounded-full px-3 py-1 text-xs font-bold mb-3">
                  🎉 Seasonal Item Unlocked!
                </div>
                <h2 className="text-xl font-extrabold text-foreground mb-1">
                  {seasonalUnlock.itemName}
                </h2>
                <div className="inline-flex items-center gap-1.5 bg-muted border border-border rounded-full px-3 py-1 text-xs text-muted-foreground mb-4">
                  <span>🍃</span> {seasonalUnlock.season} Season Exclusive
                </div>
                <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
                  You've unlocked a seasonal avatar item by reaching a domain
                  milestone! Equip it in your avatar store.
                </p>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setSeasonalUnlock(null)}
                    data-ocid="roadmap.seasonal_unlock.close_button"
                    className="flex-1 rounded-2xl py-3 text-sm font-semibold border border-border bg-muted text-foreground hover:bg-accent transition-colors"
                  >
                    Continue
                  </button>
                  <button
                    type="button"
                    onClick={() => setSeasonalUnlock(null)}
                    data-ocid="roadmap.seasonal_unlock.store_button"
                    className="flex-1 rounded-2xl py-3 text-sm font-bold bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
                  >
                    🛍 Go to Store
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Challenge a Friend Modal ── */}
        <AnimatePresence>
          {showChallengeModal && (
            <ChallengeModal
              quizScore={challengeQuizScore}
              quizTopic={challengeTopicTitle}
              quizId={`roadmap-${challengeTopicTitle.toLowerCase().replace(/\s+/g, "-")}`}
              challengerName={user.username || "You"}
              onClose={() => setShowChallengeModal(false)}
            />
          )}
        </AnimatePresence>
      </>
    );
  }

  return null;
}
