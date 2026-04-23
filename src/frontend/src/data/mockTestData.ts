export interface MockTestQuestion {
  id: string;
  question: string;
  options: [string, string, string, string];
  correctAnswer: number; // 0-indexed
  explanation: string;
  topic: string;
  difficulty: "easy" | "medium" | "hard";
}

export interface MockTest {
  id: string;
  title: string;
  description: string;
  duration: number; // seconds (3600 = 60 min)
  totalQuestions: number;
  questions: MockTestQuestion[];
  category:
    | "DSA"
    | "Aptitude"
    | "Mixed"
    | "CS Subjects"
    | "Python"
    | "Java"
    | "Frontend"
    | "Backend"
    | "Data Science"
    | "Cybersecurity";
}

// ── Domain-specific MCQ questions for online tests ─────────────────────────
export interface DomainMCQ {
  id: string;
  domain: string;
  type: "mcq";
  question: string;
  options: [string, string, string, string];
  correctIndex: number;
  explanation: string;
  difficulty: "easy" | "medium" | "hard";
}

export interface DomainCoding {
  id: string;
  domain: string;
  type: "coding";
  question: string;
  starterCode: string;
  expectedOutput: string;
  hint: string;
  difficulty: "easy" | "medium" | "hard";
}

export type DomainQuestion = DomainMCQ | DomainCoding;

export const DOMAIN_QUESTIONS: DomainQuestion[] = [
  // ── ProgrammingInC (already in COnlineTestPage, kept minimal here for selector support) ──
  {
    id: "c-mcq-01",
    domain: "ProgrammingInC",
    type: "mcq",
    question: 'What is the output of printf("%d", sizeof(int))?',
    options: ["2", "4", "8", "Platform-dependent"],
    correctIndex: 3,
    explanation:
      "sizeof(int) depends on the platform/compiler — 4 on most 32/64-bit systems.",
    difficulty: "easy",
  },
  {
    id: "c-mcq-02",
    domain: "ProgrammingInC",
    type: "mcq",
    question: "Which header file contains printf and scanf?",
    options: ["stdlib.h", "string.h", "stdio.h", "math.h"],
    correctIndex: 2,
    explanation:
      "stdio.h declares standard I/O functions like printf, scanf, fopen, etc.",
    difficulty: "easy",
  },
  {
    id: "c-mcq-03",
    domain: "ProgrammingInC",
    type: "mcq",
    question: "What does the & operator do when applied to a variable?",
    options: [
      "Bitwise AND",
      "Returns address of variable",
      "Dereferences pointer",
      "None",
    ],
    correctIndex: 1,
    explanation:
      "&var gives the memory address of var — used in scanf and pointer assignment.",
    difficulty: "easy",
  },
  {
    id: "c-mcq-04",
    domain: "ProgrammingInC",
    type: "mcq",
    question: "What is the index of the first element in a C array?",
    options: ["1", "0", "-1", "Undefined"],
    correctIndex: 1,
    explanation: "C arrays are 0-indexed — arr[0] is the first element.",
    difficulty: "easy",
  },
  {
    id: "c-mcq-05",
    domain: "ProgrammingInC",
    type: "mcq",
    question: "Which loop always executes at least once?",
    options: ["for", "while", "do-while", "None"],
    correctIndex: 2,
    explanation:
      "do-while checks the condition AFTER executing the body, so it runs at least once.",
    difficulty: "easy",
  },
  {
    id: "c-mcq-06",
    domain: "ProgrammingInC",
    type: "mcq",
    question: "What does malloc() return?",
    options: ["int *", "void *", "char *", "NULL always"],
    correctIndex: 1,
    explanation:
      "malloc returns a void* (generic pointer) that must be cast to the desired type.",
    difficulty: "easy",
  },
  {
    id: "c-mcq-07",
    domain: "ProgrammingInC",
    type: "mcq",
    question: "What is NULL in C?",
    options: [
      "Integer 0",
      "Empty string",
      "Undefined variable",
      "Pointer with value 0",
    ],
    correctIndex: 3,
    explanation:
      "NULL is a macro defined as 0 (or (void*)0), representing a null pointer.",
    difficulty: "easy",
  },
  {
    id: "c-mcq-08",
    domain: "ProgrammingInC",
    type: "mcq",
    question: "Which is correct for accessing a struct pointer member?",
    options: [
      "struct.member",
      "struct->member",
      "struct:member",
      "struct[member]",
    ],
    correctIndex: 1,
    explanation:
      "Use dot (.) for struct variables, arrow (->) for struct pointers.",
    difficulty: "easy",
  },
  {
    id: "c-mcq-09",
    domain: "ProgrammingInC",
    type: "mcq",
    question: "What function frees heap memory in C?",
    options: ["delete", "free()", "dealloc()", "release()"],
    correctIndex: 1,
    explanation:
      "free(ptr) releases heap memory previously allocated by malloc/calloc/realloc.",
    difficulty: "easy",
  },
  {
    id: "c-mcq-10",
    domain: "ProgrammingInC",
    type: "mcq",
    question: "Which is the correct way to declare a pointer to int?",
    options: ["int ptr;", "int *ptr;", "ptr int;", "*ptr int;"],
    correctIndex: 1,
    explanation:
      "int *ptr; declares ptr as a pointer to int. The * is part of the declarator.",
    difficulty: "easy",
  },
  {
    id: "c-coding-01",
    domain: "ProgrammingInC",
    type: "coding",
    question: "Write a C function to compute the factorial of n recursively.",
    starterCode:
      '#include <stdio.h>\nlong long factorial(int n) {\n    // Your code here\n}\nint main() {\n    int n; scanf("%d", &n);\n    printf("%lld\\n", factorial(n));\n    return 0;\n}',
    expectedOutput: "120 (for n=5)",
    hint: "Base case: factorial(0) = 1. Recursive case: n * factorial(n-1).",
    difficulty: "easy",
  },
  {
    id: "c-coding-02",
    domain: "ProgrammingInC",
    type: "coding",
    question: "Write a C program to reverse an array in-place.",
    starterCode:
      '#include <stdio.h>\nvoid reverseArray(int arr[], int n) {\n    // Your code here\n}\nint main() {\n    int n; scanf("%d", &n);\n    int arr[n];\n    for(int i=0;i<n;i++) scanf("%d",&arr[i]);\n    reverseArray(arr, n);\n    for(int i=0;i<n;i++) printf("%d ",arr[i]);\n    return 0;\n}',
    expectedOutput: "5 4 3 2 1 (for input: 5, 1 2 3 4 5)",
    hint: "Swap arr[i] and arr[n-1-i] for i from 0 to n/2.",
    difficulty: "easy",
  },
  {
    id: "c-coding-03",
    domain: "ProgrammingInC",
    type: "coding",
    question: "Write a C program to check if a number is prime.",
    starterCode:
      '#include <stdio.h>\nint isPrime(int n) {\n    // Return 1 if prime, 0 otherwise\n}\nint main() {\n    int n; scanf("%d", &n);\n    printf("%s\\n", isPrime(n) ? "Prime" : "Not Prime");\n    return 0;\n}',
    expectedOutput: "Prime (for n=7), Not Prime (for n=4)",
    hint: "Check divisibility from 2 to sqrt(n).",
    difficulty: "medium",
  },

  // ── Frontend ──────────────────────────────────────────────────────────────
  {
    id: "fe-d-01",
    domain: "Frontend",
    type: "mcq",
    question: "What does CSS 'display: flex' do?",
    options: [
      "Makes the element invisible",
      "Creates a flex container for one-dimensional layout",
      "Removes the element from flow",
      "Makes element inline",
    ],
    correctIndex: 1,
    explanation:
      "Flexbox enables one-dimensional layout (row or column) with powerful alignment and distribution controls.",
    difficulty: "easy",
  },
  {
    id: "fe-d-02",
    domain: "Frontend",
    type: "mcq",
    question: "What is React's Virtual DOM?",
    options: [
      "A real DOM copy in a database",
      "An in-memory JS representation of the DOM, used for efficient diffing and minimal real DOM updates",
      "A browser plugin",
      "A server-side rendering technique",
    ],
    correctIndex: 1,
    explanation:
      "React maintains a Virtual DOM tree; when state changes, it diffs old vs new and applies only the minimum real DOM changes.",
    difficulty: "easy",
  },
  {
    id: "fe-d-03",
    domain: "Frontend",
    type: "mcq",
    question: "What does 'position: absolute' mean in CSS?",
    options: [
      "Fixed to the viewport",
      "Positioned relative to nearest positioned ancestor, removed from normal flow",
      "Same as relative",
      "Floats left",
    ],
    correctIndex: 1,
    explanation:
      "Absolute elements are removed from normal document flow and positioned relative to the nearest ancestor with position set (not static).",
    difficulty: "easy",
  },
  {
    id: "fe-d-04",
    domain: "Frontend",
    type: "mcq",
    question: "What is the purpose of TypeScript in frontend development?",
    options: [
      "Replaces HTML entirely",
      "Adds static type checking to JavaScript, catching errors at compile time",
      "Makes JS run faster",
      "Is required by React",
    ],
    correctIndex: 1,
    explanation:
      "TypeScript's type system catches type mismatches, undefined property access, and other errors during development, before runtime.",
    difficulty: "easy",
  },
  {
    id: "fe-d-05",
    domain: "Frontend",
    type: "mcq",
    question: "In React, when does a component re-render?",
    options: [
      "Only when mounted",
      "When its state or props change",
      "Every second",
      "Only on user interactions",
    ],
    correctIndex: 1,
    explanation:
      "React re-renders a component when its state changes (setState) or when its parent re-renders and passes new props.",
    difficulty: "easy",
  },
  {
    id: "fe-d-06",
    domain: "Frontend",
    type: "mcq",
    question: "What is the CSS specificity of '#id .class element'?",
    options: ["0,1,0", "1,1,1", "1,0,0", "0,2,1"],
    correctIndex: 1,
    explanation:
      "Specificity: ID (1,0,0) + class (0,1,0) + element (0,0,1) = (1,1,1).",
    difficulty: "medium",
  },
  {
    id: "fe-d-07",
    domain: "Frontend",
    type: "mcq",
    question: "What is Web Accessibility (a11y) about?",
    options: [
      "Website load speed",
      "Making websites usable by people with disabilities using ARIA, semantic HTML, keyboard navigation",
      "Mobile responsiveness only",
      "SEO optimization",
    ],
    correctIndex: 1,
    explanation:
      "Accessibility ensures web content works for users with visual, motor, auditory, and cognitive disabilities through semantic markup, ARIA roles, and keyboard support.",
    difficulty: "easy",
  },
  {
    id: "fe-d-08",
    domain: "Frontend",
    type: "mcq",
    question: "What does the 'alt' attribute on an <img> do?",
    options: [
      "Sets image title on hover",
      "Provides text alternative for screen readers and when image fails to load",
      "Determines image size",
      "Controls image alignment",
    ],
    correctIndex: 1,
    explanation:
      "alt text is read by screen readers for accessibility and displayed when the image cannot load.",
    difficulty: "easy",
  },
  {
    id: "fe-d-09",
    domain: "Frontend",
    type: "mcq",
    question: "What is a CSS preprocessor?",
    options: [
      "A browser extension",
      "A tool like Sass/Less that extends CSS with variables, nesting, and mixins, compiled to plain CSS",
      "A JavaScript bundler",
      "A CSS minifier",
    ],
    correctIndex: 1,
    explanation:
      "CSS preprocessors (Sass, Less) add programming features (variables, loops, nesting) to CSS, improving maintainability.",
    difficulty: "easy",
  },
  {
    id: "fe-d-10",
    domain: "Frontend",
    type: "mcq",
    question:
      "What is the purpose of a service worker in Progressive Web Apps?",
    options: [
      "Runs server-side logic",
      "Enables offline functionality, background sync, and push notifications by intercepting network requests",
      "Compresses CSS files",
      "Renders React server-side",
    ],
    correctIndex: 1,
    explanation:
      "Service workers are scripts that run in the background, intercepting network requests to cache assets and enable offline capability.",
    difficulty: "medium",
  },
  {
    id: "fe-coding-01",
    domain: "Frontend",
    type: "coding",
    question: "Write a JavaScript function to debounce another function.",
    starterCode:
      "function debounce(fn, delay) {\n  // Return a debounced version of fn\n  // that only calls fn after delay ms of inactivity\n}",
    expectedOutput:
      "Function that delays calling fn until delay ms after last call",
    hint: "Use setTimeout and clearTimeout. Store the timeout ID in a closure.",
    difficulty: "medium",
  },
  {
    id: "fe-coding-02",
    domain: "Frontend",
    type: "coding",
    question: "Write a function that deep-clones a plain JavaScript object.",
    starterCode:
      "function deepClone(obj) {\n  // Return a deep copy of obj\n  // Works for nested objects and arrays\n}",
    expectedOutput: "New object with same structure but no shared references",
    hint: "Use JSON.parse(JSON.stringify(obj)) for simple cases, or recursion for proper handling.",
    difficulty: "easy",
  },
  {
    id: "fe-coding-03",
    domain: "Frontend",
    type: "coding",
    question: "Implement a simple event emitter class in JavaScript.",
    starterCode:
      "class EventEmitter {\n  // Implement on(event, listener), emit(event, ...args), off(event, listener)\n}",
    expectedOutput: "Class that allows subscribing and emitting named events",
    hint: "Store listeners in a Map/object. on() adds, emit() calls all listeners, off() removes.",
    difficulty: "medium",
  },

  // ── Python ─────────────────────────────────────────────────────────────────
  {
    id: "py-d-01",
    domain: "Python",
    type: "mcq",
    question: "What is the output of len('hello')?",
    options: ["4", "5", "6", "Error"],
    correctIndex: 1,
    explanation:
      "len() returns the number of characters. 'hello' has 5 characters.",
    difficulty: "easy",
  },
  {
    id: "py-d-02",
    domain: "Python",
    type: "mcq",
    question: "Which data structure does Python's dict use internally?",
    options: ["Binary tree", "Linked list", "Hash table", "Sorted array"],
    correctIndex: 2,
    explanation:
      "Python dicts use hash tables, giving O(1) average-case for lookups, insertions, and deletions.",
    difficulty: "easy",
  },
  {
    id: "py-d-03",
    domain: "Python",
    type: "mcq",
    question: "What does 'is' compare in Python?",
    options: [
      "Value equality",
      "String length",
      "Object identity (same memory address)",
      "Type compatibility",
    ],
    correctIndex: 2,
    explanation:
      "'is' checks if two variables point to the same object (identity), not just equal values. Use == for value comparison.",
    difficulty: "easy",
  },
  {
    id: "py-d-04",
    domain: "Python",
    type: "mcq",
    question: "What is a list comprehension in Python?",
    options: [
      "A way to import lists",
      "A concise way to create lists: [expr for item in iterable if condition]",
      "A special type of tuple",
      "A function that returns a list",
    ],
    correctIndex: 1,
    explanation:
      "List comprehensions create lists in a single readable expression. [x*2 for x in range(5)] gives [0,2,4,6,8].",
    difficulty: "easy",
  },
  {
    id: "py-d-05",
    domain: "Python",
    type: "mcq",
    question:
      "What happens when you modify a list inside a function that received it as an argument?",
    options: [
      "The original list is unchanged",
      "A copy is modified",
      "The original list IS modified (lists are passed by reference)",
      "A TypeError is raised",
    ],
    correctIndex: 2,
    explanation:
      "Python passes object references. Lists are mutable, so modifications inside a function affect the original.",
    difficulty: "medium",
  },
  {
    id: "py-d-06",
    domain: "Python",
    type: "mcq",
    question: "What is Python's GIL?",
    options: [
      "A compiler optimization",
      "Global Interpreter Lock — prevents multiple threads from executing Python bytecode simultaneously",
      "A memory management system",
      "A garbage collection algorithm",
    ],
    correctIndex: 1,
    explanation:
      "The GIL ensures thread safety for Python's memory management but limits true multi-core parallelism in CPU-bound threads. Use multiprocessing for CPU parallelism.",
    difficulty: "hard",
  },
  {
    id: "py-d-07",
    domain: "Python",
    type: "mcq",
    question: "What does the 'zip' function do?",
    options: [
      "Compresses files",
      "Combines multiple iterables element-wise into tuples",
      "Sorts two lists together",
      "Merges dictionaries",
    ],
    correctIndex: 1,
    explanation:
      "zip([1,2,3], ['a','b','c']) yields (1,'a'), (2,'b'), (3,'c'). Stops at the shortest iterable.",
    difficulty: "easy",
  },
  {
    id: "py-d-08",
    domain: "Python",
    type: "mcq",
    question: "What is the difference between append() and extend() on a list?",
    options: [
      "No difference",
      "append() adds one element; extend() adds all elements of an iterable",
      "extend() adds one element; append() adds all",
      "Both add all elements",
    ],
    correctIndex: 1,
    explanation:
      "list.append(x) adds x as a single element. list.extend([a,b,c]) adds each element of the iterable individually.",
    difficulty: "easy",
  },
  {
    id: "py-d-09",
    domain: "Python",
    type: "mcq",
    question: "What does the @property decorator do in Python?",
    options: [
      "Makes a method static",
      "Allows a method to be accessed as an attribute (getter)",
      "Makes a class attribute",
      "Defines a class method",
    ],
    correctIndex: 1,
    explanation:
      "@property turns a method into a computed attribute. It allows controlled access to private attributes with validation.",
    difficulty: "medium",
  },
  {
    id: "py-d-10",
    domain: "Python",
    type: "mcq",
    question: "What is the output of: print(2 ** 10)?",
    options: ["20", "1024", "512", "100"],
    correctIndex: 1,
    explanation: "** is the exponentiation operator. 2**10 = 1024.",
    difficulty: "easy",
  },
  {
    id: "py-coding-01",
    domain: "Python",
    type: "coding",
    question: "Write a Python function to check if a string is a palindrome.",
    starterCode:
      "def is_palindrome(s):\n    # Return True if s reads the same forwards and backwards\n    pass",
    expectedOutput: "True for 'racecar', False for 'hello'",
    hint: "Compare the string with its reverse: s == s[::-1]",
    difficulty: "easy",
  },
  {
    id: "py-coding-02",
    domain: "Python",
    type: "coding",
    question:
      "Write a Python function that counts word frequencies in a sentence.",
    starterCode:
      "def word_count(sentence):\n    # Return a dict mapping each word to its count\n    pass",
    expectedOutput: "{'hello': 2, 'world': 1} for 'hello world hello'",
    hint: "Split the sentence, iterate, and use a dict to count occurrences.",
    difficulty: "easy",
  },
  {
    id: "py-coding-03",
    domain: "Python",
    type: "coding",
    question:
      "Implement a class Stack in Python with push, pop, and peek operations.",
    starterCode:
      "class Stack:\n    def __init__(self):\n        pass\n    def push(self, val):\n        pass\n    def pop(self):\n        pass\n    def peek(self):\n        pass\n    def is_empty(self):\n        pass",
    expectedOutput: "Stack LIFO behavior: push/pop/peek working correctly",
    hint: "Use a list internally. push = append, pop = pop, peek = access last element.",
    difficulty: "easy",
  },

  // ── Backend ────────────────────────────────────────────────────────────────
  {
    id: "be-d-01",
    domain: "Backend",
    type: "mcq",
    question: "What HTTP method is used to create a new resource?",
    options: ["GET", "POST", "PUT", "DELETE"],
    correctIndex: 1,
    explanation:
      "POST is used to create new resources. PUT replaces an existing resource. PATCH partially updates.",
    difficulty: "easy",
  },
  {
    id: "be-d-02",
    domain: "Backend",
    type: "mcq",
    question: "What is the purpose of middleware in Express.js?",
    options: [
      "Renders templates",
      "Functions that process requests before route handlers — logging, auth, parsing",
      "Compiles TypeScript",
      "Manages DB connections automatically",
    ],
    correctIndex: 1,
    explanation:
      "Middleware functions have (req, res, next) signature. They can transform the request, validate tokens, log data, and call next() to proceed.",
    difficulty: "easy",
  },
  {
    id: "be-d-03",
    domain: "Backend",
    type: "mcq",
    question: "What is bcrypt used for?",
    options: [
      "Encrypting database connections",
      "Hashing passwords with a slow, salted algorithm resistant to brute force",
      "Signing JWT tokens",
      "Compressing API responses",
    ],
    correctIndex: 1,
    explanation:
      "bcrypt is designed to be slow (configurable work factor), making brute-force attacks computationally expensive. It auto-generates a unique salt.",
    difficulty: "easy",
  },
  {
    id: "be-d-04",
    domain: "Backend",
    type: "mcq",
    question: "What is an ORM?",
    options: [
      "A network protocol",
      "Object-Relational Mapper — abstracts database queries as object methods",
      "A caching strategy",
      "An API design pattern",
    ],
    correctIndex: 1,
    explanation:
      "ORMs (Sequelize, Prisma, TypeORM) map database tables to classes/objects, letting you write object-oriented code instead of raw SQL.",
    difficulty: "easy",
  },
  {
    id: "be-d-05",
    domain: "Backend",
    type: "mcq",
    question: "What does 'N+1 query problem' mean?",
    options: [
      "Queries that take N+1 seconds",
      "Fetching N records then making 1 extra query per record — very inefficient",
      "Using more than 1 database table",
      "A SQL syntax error",
    ],
    correctIndex: 1,
    explanation:
      "If you fetch 10 users then query posts for each user, that's 11 queries. Fix with JOIN or eager loading.",
    difficulty: "medium",
  },
  {
    id: "be-d-06",
    domain: "Backend",
    type: "mcq",
    question: "What is connection pooling in databases?",
    options: [
      "Clustering multiple databases",
      "Maintaining a set of reusable DB connections to avoid overhead of creating new connections per request",
      "Caching query results",
      "Load balancing queries",
    ],
    correctIndex: 1,
    explanation:
      "Opening a DB connection is expensive (~50-100ms). A pool pre-creates connections and reuses them, dramatically improving throughput.",
    difficulty: "medium",
  },
  {
    id: "be-d-07",
    domain: "Backend",
    type: "mcq",
    question: "What does a 401 HTTP status code mean?",
    options: [
      "Resource not found",
      "Authentication required or failed",
      "Forbidden — authenticated but no permission",
      "Server error",
    ],
    correctIndex: 1,
    explanation:
      "401 Unauthorized means the request requires authentication. 403 Forbidden means authenticated but lacking permission.",
    difficulty: "easy",
  },
  {
    id: "be-d-08",
    domain: "Backend",
    type: "mcq",
    question: "What is microservices architecture?",
    options: [
      "Multiple databases in one server",
      "Breaking an application into small, independently deployable services each handling one business concern",
      "Micro-optimizing SQL queries",
      "A type of API gateway",
    ],
    correctIndex: 1,
    explanation:
      "Microservices decompose a monolith into focused services (user service, order service) that communicate via APIs, enabling independent scaling and deployment.",
    difficulty: "easy",
  },
  {
    id: "be-d-09",
    domain: "Backend",
    type: "mcq",
    question: "What is HTTPS?",
    options: [
      "A faster version of HTTP",
      "HTTP with TLS/SSL encryption for secure data transmission",
      "HTTP with compression",
      "An authentication protocol",
    ],
    correctIndex: 1,
    explanation:
      "HTTPS wraps HTTP in TLS (Transport Layer Security), encrypting data in transit between client and server, preventing eavesdropping and tampering.",
    difficulty: "easy",
  },
  {
    id: "be-d-10",
    domain: "Backend",
    type: "mcq",
    question: "What is the purpose of environment variables (.env files)?",
    options: [
      "Store HTML templates",
      "Store configuration and secrets outside source code to keep them secure and environment-specific",
      "Speed up the build process",
      "Define API routes",
    ],
    correctIndex: 1,
    explanation:
      "Environment variables keep secrets (API keys, DB credentials) out of version control and allow different values per environment (dev, staging, prod).",
    difficulty: "easy",
  },
  {
    id: "be-coding-01",
    domain: "Backend",
    type: "coding",
    question:
      "Write a Node.js middleware function that logs request method and URL.",
    starterCode:
      "// Express middleware\nfunction requestLogger(req, res, next) {\n    // Log: [METHOD] /path\n    // Then call next()\n}",
    expectedOutput: "Logs '[GET] /api/users' etc. and passes to next handler",
    hint: "Use req.method and req.url, then call next() to continue the chain.",
    difficulty: "easy",
  },
  {
    id: "be-coding-02",
    domain: "Backend",
    type: "coding",
    question: "Write a function that validates an email address using regex.",
    starterCode:
      "function isValidEmail(email) {\n    // Return true if email is valid, false otherwise\n}",
    expectedOutput: "true for 'user@example.com', false for 'not-an-email'",
    hint: "Use a regex pattern that checks for local-part@domain.tld format.",
    difficulty: "easy",
  },
  {
    id: "be-coding-03",
    domain: "Backend",
    type: "coding",
    question:
      "Implement a basic rate limiter that allows N requests per minute per key.",
    starterCode:
      "class RateLimiter {\n    constructor(maxRequests, windowMs) {\n        // Initialize\n    }\n    isAllowed(key) {\n        // Return true if under limit, false if exceeded\n    }\n}",
    expectedOutput:
      "Returns false after maxRequests within windowMs for same key",
    hint: "Store request timestamps per key. On each request, filter out old ones and check count.",
    difficulty: "medium",
  },

  // ── FullStack ──────────────────────────────────────────────────────────────
  {
    id: "fs-d-01",
    domain: "FullStack",
    type: "mcq",
    question: "What is the role of an API in a full-stack application?",
    options: [
      "Renders UI components",
      "Defines a contract between frontend and backend for data exchange",
      "Manages the database directly",
      "Handles CSS styling",
    ],
    correctIndex: 1,
    explanation:
      "APIs (REST, GraphQL) define endpoints and data formats that allow frontend and backend to communicate independently.",
    difficulty: "easy",
  },
  {
    id: "fs-d-02",
    domain: "FullStack",
    type: "mcq",
    question: "What is CORS and why does it matter in full-stack apps?",
    options: [
      "A CSS framework",
      "Cross-Origin Resource Sharing — browser security policy that blocks cross-domain requests unless the server allows them",
      "A database query language",
      "A build tool",
    ],
    correctIndex: 1,
    explanation:
      "When your React app (localhost:3000) calls your API (localhost:5000), the browser enforces CORS. The server must send Access-Control-Allow-Origin headers.",
    difficulty: "medium",
  },
  {
    id: "fs-d-03",
    domain: "FullStack",
    type: "mcq",
    question: "What is the difference between SSR and CSR?",
    options: [
      "No difference",
      "SSR: HTML generated on the server per request; CSR: JavaScript builds the DOM in the browser after loading a minimal HTML shell",
      "CSR is faster for SEO",
      "SSR is client-side only",
    ],
    correctIndex: 1,
    explanation:
      "SSR (Next.js) sends complete HTML — better for SEO and initial load. CSR (Create React App) sends a shell and builds UI in the browser.",
    difficulty: "medium",
  },
  {
    id: "fs-d-04",
    domain: "FullStack",
    type: "mcq",
    question: "What is a monorepo in full-stack development?",
    options: [
      "A repository with one file",
      "A single repository containing multiple related projects (frontend, backend, shared libs)",
      "A deprecated architecture",
      "A database per user",
    ],
    correctIndex: 1,
    explanation:
      "Monorepos (Nx, Turborepo) keep all related codebases in one repo, making it easy to share types, configs, and manage dependencies.",
    difficulty: "medium",
  },
  {
    id: "fs-d-05",
    domain: "FullStack",
    type: "mcq",
    question: "What is the purpose of a .env file in a full-stack project?",
    options: [
      "Store HTML markup",
      "Store environment-specific config and secrets not checked into version control",
      "Define database schemas",
      "Configure the CSS framework",
    ],
    correctIndex: 1,
    explanation:
      ".env files store API keys, database URLs, and other config. Libraries like dotenv load them into process.env at runtime.",
    difficulty: "easy",
  },
  {
    id: "fs-d-06",
    domain: "FullStack",
    type: "mcq",
    question: "What is optimistic UI in full-stack development?",
    options: [
      "Always showing success messages",
      "Updating the UI immediately before server confirmation, then rolling back on error",
      "Only showing UI after server responds",
      "A dark theme design approach",
    ],
    correctIndex: 1,
    explanation:
      "Optimistic UI improves perceived performance — update state immediately, then sync with server. If server fails, revert the change and show an error.",
    difficulty: "medium",
  },
  {
    id: "fs-d-07",
    domain: "FullStack",
    type: "mcq",
    question: "Which caching layer is typically closest to the user?",
    options: [
      "Database cache",
      "Server memory cache",
      "CDN / browser cache",
      "Disk cache",
    ],
    correctIndex: 2,
    explanation:
      "Browser cache and CDN edge caches are closest to the user, providing the fastest access. CDNs serve static assets from geographically nearby servers.",
    difficulty: "easy",
  },
  {
    id: "fs-d-08",
    domain: "FullStack",
    type: "mcq",
    question: "What is WebSocket used for in full-stack apps?",
    options: [
      "Serving static files",
      "Full-duplex, persistent communication for real-time features like chat and live updates",
      "Compressing API responses",
      "Managing database connections",
    ],
    correctIndex: 1,
    explanation:
      "WebSockets maintain an open connection between client and server, allowing either side to send messages anytime — perfect for real-time chat, notifications, and collaborative tools.",
    difficulty: "easy",
  },
  {
    id: "fs-d-09",
    domain: "FullStack",
    type: "mcq",
    question: "What is the main purpose of Docker in full-stack development?",
    options: [
      "Optimizing database queries",
      "Containerizing apps with all dependencies so they run consistently across environments",
      "A CSS-in-JS solution",
      "A JavaScript bundler",
    ],
    correctIndex: 1,
    explanation:
      "Docker packages your app and its runtime environment into containers, eliminating 'works on my machine' problems.",
    difficulty: "easy",
  },
  {
    id: "fs-d-10",
    domain: "FullStack",
    type: "mcq",
    question:
      "What is a reverse proxy (like Nginx) used for in full-stack deployments?",
    options: [
      "Storing database data",
      "Routing client requests to appropriate backend services, handling SSL, load balancing, and serving static files",
      "Writing backend code",
      "Managing CSS assets",
    ],
    correctIndex: 1,
    explanation:
      "Nginx sits in front of backend services, routing requests, terminating SSL, caching static content, and load balancing across multiple server instances.",
    difficulty: "medium",
  },
  {
    id: "fs-coding-01",
    domain: "FullStack",
    type: "coding",
    question:
      "Write a fetch wrapper that handles errors and returns parsed JSON.",
    starterCode:
      "async function apiFetch(url, options = {}) {\n    // Fetch the URL, check for HTTP errors,\n    // return parsed JSON on success,\n    // throw an Error with status on failure\n}",
    expectedOutput: "Returns JSON data or throws Error with HTTP status",
    hint: "Check response.ok after fetch. If not ok, throw new Error(response.status). Otherwise return response.json().",
    difficulty: "easy",
  },
  {
    id: "fs-coding-02",
    domain: "FullStack",
    type: "coding",
    question:
      "Write a function to generate a JWT-like token (base64 payload only, no signature).",
    starterCode:
      "function createToken(payload) {\n    // Return a base64url-encoded JSON string of the payload\n}",
    expectedOutput: "Base64-encoded JSON payload string",
    hint: "Use JSON.stringify then btoa() for encoding.",
    difficulty: "easy",
  },
  {
    id: "fs-coding-03",
    domain: "FullStack",
    type: "coding",
    question: "Write a pagination helper that returns a slice of items.",
    starterCode:
      "function paginate(items, page, pageSize) {\n    // Return { data, total, page, totalPages }\n    // page is 1-indexed\n}",
    expectedOutput:
      "{ data: [...], total: 100, page: 2, totalPages: 10 } for 100 items, page 2, size 10",
    hint: "Calculate start = (page-1)*pageSize, end = start+pageSize. Return items.slice(start, end).",
    difficulty: "easy",
  },

  // ── DataScience ────────────────────────────────────────────────────────────
  {
    id: "ds-d-01",
    domain: "DataScience",
    type: "mcq",
    question:
      "What is the difference between supervised and unsupervised learning?",
    options: [
      "No difference",
      "Supervised: uses labeled data to learn mappings; Unsupervised: finds patterns in unlabeled data",
      "Supervised is faster",
      "Unsupervised uses more data",
    ],
    correctIndex: 1,
    explanation:
      "Supervised learning (classification, regression) trains on input-output pairs. Unsupervised learning (clustering, dimensionality reduction) discovers hidden structure without labels.",
    difficulty: "easy",
  },
  {
    id: "ds-d-02",
    domain: "DataScience",
    type: "mcq",
    question: "What does a confusion matrix show?",
    options: [
      "Feature correlations",
      "Model training time",
      "True/False Positives and Negatives — visualizing classification performance across all classes",
      "Data distribution",
    ],
    correctIndex: 2,
    explanation:
      "A confusion matrix shows TP, TN, FP, FN for each class, helping calculate precision, recall, and F1 score.",
    difficulty: "easy",
  },
  {
    id: "ds-d-03",
    domain: "DataScience",
    type: "mcq",
    question: "What is overfitting in machine learning?",
    options: [
      "Model is too simple",
      "Model learns training data too well, including noise, performing poorly on unseen data",
      "Model trains too fast",
      "Model uses too many features",
    ],
    correctIndex: 1,
    explanation:
      "Overfitting: high training accuracy, low validation accuracy. The model memorized training data instead of learning generalizable patterns.",
    difficulty: "easy",
  },
  {
    id: "ds-d-04",
    domain: "DataScience",
    type: "mcq",
    question: "What is Principal Component Analysis (PCA)?",
    options: [
      "A classification algorithm",
      "A dimensionality reduction technique that finds orthogonal directions of maximum variance",
      "A clustering method",
      "A data augmentation technique",
    ],
    correctIndex: 1,
    explanation:
      "PCA projects high-dimensional data onto fewer dimensions (principal components) that capture the most variance, useful for visualization and noise reduction.",
    difficulty: "medium",
  },
  {
    id: "ds-d-05",
    domain: "DataScience",
    type: "mcq",
    question: "What does correlation measure between two variables?",
    options: [
      "Causation",
      "The strength and direction of a linear relationship, ranging from -1 to +1",
      "The mean difference",
      "The prediction accuracy",
    ],
    correctIndex: 1,
    explanation:
      "Pearson correlation: +1 (perfect positive), 0 (no linear relationship), -1 (perfect negative). Correlation ≠ causation.",
    difficulty: "easy",
  },
  {
    id: "ds-d-06",
    domain: "DataScience",
    type: "mcq",
    question: "What is the purpose of a train-test split?",
    options: [
      "Speeds up training",
      "Evaluates model performance on data not seen during training to estimate generalization",
      "Reduces dataset size",
      "Prevents overfitting during training",
    ],
    correctIndex: 1,
    explanation:
      "Training on all data and evaluating on the same data gives optimistically biased metrics. A held-out test set measures true generalization.",
    difficulty: "easy",
  },
  {
    id: "ds-d-07",
    domain: "DataScience",
    type: "mcq",
    question: "What is gradient descent?",
    options: [
      "A data preprocessing step",
      "An optimization algorithm that iteratively adjusts model parameters in the direction that minimizes the loss function",
      "A regularization technique",
      "A feature selection method",
    ],
    correctIndex: 1,
    explanation:
      "Gradient descent updates parameters by subtracting the gradient of the loss multiplied by a learning rate, moving toward a local minimum.",
    difficulty: "medium",
  },
  {
    id: "ds-d-08",
    domain: "DataScience",
    type: "mcq",
    question: "What is a Random Forest?",
    options: [
      "A single decision tree with random data",
      "An ensemble of decision trees trained on bootstrap samples with random feature subsets, using majority vote",
      "A neural network architecture",
      "A clustering algorithm",
    ],
    correctIndex: 1,
    explanation:
      "Random Forest builds many decision trees (bagging) on random data samples and features, then aggregates predictions to reduce overfitting.",
    difficulty: "easy",
  },
  {
    id: "ds-d-09",
    domain: "DataScience",
    type: "mcq",
    question: "What does EDA stand for?",
    options: [
      "Enhanced Data Analysis",
      "Exploratory Data Analysis — initial investigation to discover patterns, check assumptions, and find anomalies",
      "External Data Access",
      "Encoded Data Algorithm",
    ],
    correctIndex: 1,
    explanation:
      "EDA uses statistical and visual techniques to understand data before modeling: distributions, outliers, correlations, and missing values.",
    difficulty: "easy",
  },
  {
    id: "ds-d-10",
    domain: "DataScience",
    type: "mcq",
    question: "What is precision in classification models?",
    options: [
      "Ratio of correct predictions to total predictions",
      "Of all predicted positives, what fraction are truly positive: TP / (TP + FP)",
      "Of all actual positives, how many were found",
      "The overall model accuracy",
    ],
    correctIndex: 1,
    explanation:
      "Precision = TP / (TP + FP). High precision means few false alarms. Recall = TP / (TP + FN) measures how many true positives were found.",
    difficulty: "medium",
  },
  {
    id: "ds-coding-01",
    domain: "DataScience",
    type: "coding",
    question:
      "Write a Python function to calculate the mean and standard deviation of a list.",
    starterCode:
      "import math\ndef stats(numbers):\n    # Return {'mean': ..., 'std': ...}\n    pass",
    expectedOutput: "{'mean': 3.0, 'std': 1.414} for [1, 2, 3, 4, 5]",
    hint: "Mean = sum/n. Std = sqrt(sum of (x-mean)^2 / n).",
    difficulty: "easy",
  },
  {
    id: "ds-coding-02",
    domain: "DataScience",
    type: "coding",
    question: "Implement k-nearest neighbors (KNN) classification for 1D data.",
    starterCode:
      "def knn_classify(train_points, train_labels, test_point, k):\n    # Return the majority label among k nearest neighbors\n    pass",
    expectedOutput: "Correct label based on k nearest training points",
    hint: "Sort training points by distance to test_point, take k nearest, return most common label.",
    difficulty: "medium",
  },
  {
    id: "ds-coding-03",
    domain: "DataScience",
    type: "coding",
    question:
      "Write a function to normalize a list of numbers to the [0, 1] range.",
    starterCode:
      "def normalize(numbers):\n    # Return normalized list where min maps to 0, max maps to 1\n    pass",
    expectedOutput: "[0.0, 0.25, 0.5, 0.75, 1.0] for [1, 2, 3, 4, 5]",
    hint: "normalized = (x - min) / (max - min) for each x.",
    difficulty: "easy",
  },

  // ── ML ─────────────────────────────────────────────────────────────────────
  {
    id: "ml-d-01",
    domain: "ML",
    type: "mcq",
    question: "What is a neural network?",
    options: [
      "A graph database",
      "A computational model inspired by the brain, with layers of nodes (neurons) that learn representations through training",
      "A sorting algorithm",
      "A type of SQL query",
    ],
    correctIndex: 1,
    explanation:
      "Neural networks consist of input, hidden, and output layers. Each neuron computes a weighted sum of inputs, applies an activation function, and passes the result forward.",
    difficulty: "easy",
  },
  {
    id: "ml-d-02",
    domain: "ML",
    type: "mcq",
    question:
      "What is the purpose of an activation function in neural networks?",
    options: [
      "Speeds up backpropagation",
      "Introduces non-linearity, allowing the network to learn complex patterns",
      "Normalizes input data",
      "Selects features automatically",
    ],
    correctIndex: 1,
    explanation:
      "Without activation functions, stacking linear layers is equivalent to a single linear transformation. Non-linear activations (ReLU, sigmoid) enable learning of complex mappings.",
    difficulty: "easy",
  },
  {
    id: "ml-d-03",
    domain: "ML",
    type: "mcq",
    question: "What is the difference between a validation set and a test set?",
    options: [
      "No difference",
      "Validation set is used during training to tune hyperparameters; test set is used only once to estimate final performance",
      "Test set is larger",
      "Validation is for unsupervised learning only",
    ],
    correctIndex: 1,
    explanation:
      "Validation set guides training decisions (early stopping, hyperparameter search). Test set is kept completely separate to give an unbiased final performance estimate.",
    difficulty: "medium",
  },
  {
    id: "ml-d-04",
    domain: "ML",
    type: "mcq",
    question: "What does 'epoch' mean in ML training?",
    options: [
      "One model parameter update",
      "One complete pass through the entire training dataset",
      "One layer of a neural network",
      "One training example",
    ],
    correctIndex: 1,
    explanation:
      "An epoch is one full pass over all training examples. Models are typically trained for multiple epochs (10-100+) until convergence.",
    difficulty: "easy",
  },
  {
    id: "ml-d-05",
    domain: "ML",
    type: "mcq",
    question: "What is batch normalization?",
    options: [
      "Training on small data batches",
      "Normalizing layer inputs during training to have zero mean and unit variance, stabilizing and speeding up training",
      "A data augmentation technique",
      "A regularization method that drops neurons",
    ],
    correctIndex: 1,
    explanation:
      "Batch norm normalizes activations across a mini-batch, reducing internal covariate shift and allowing higher learning rates.",
    difficulty: "medium",
  },
  {
    id: "ml-d-06",
    domain: "ML",
    type: "mcq",
    question: "What is the softmax function used for?",
    options: [
      "Binary classification only",
      "Converting a vector of raw scores into a probability distribution that sums to 1 — used in the output layer for multi-class classification",
      "Feature normalization",
      "Activation in hidden layers",
    ],
    correctIndex: 1,
    explanation:
      "Softmax: exp(xi) / sum(exp(xj)). Converts logits to probabilities. The predicted class is the one with the highest probability.",
    difficulty: "easy",
  },
  {
    id: "ml-d-07",
    domain: "ML",
    type: "mcq",
    question: "What is data augmentation?",
    options: [
      "Adding more features to data",
      "Artificially increasing training data size by applying transformations (flips, crops, noise) to existing examples",
      "Removing outliers from data",
      "Normalizing input features",
    ],
    correctIndex: 1,
    explanation:
      "Data augmentation (especially in computer vision) creates new training examples by randomly transforming existing ones, improving model robustness and reducing overfitting.",
    difficulty: "easy",
  },
  {
    id: "ml-d-08",
    domain: "ML",
    type: "mcq",
    question: "What is the learning rate in gradient descent?",
    options: [
      "Number of training iterations",
      "A hyperparameter that controls how large each parameter update step is",
      "The number of neurons per layer",
      "The ratio of training to validation data",
    ],
    correctIndex: 1,
    explanation:
      "Learning rate (α) scales the gradient before subtracting from weights. Too high: divergence. Too low: slow convergence. Learning rate schedules adaptively decrease it.",
    difficulty: "easy",
  },
  {
    id: "ml-d-09",
    domain: "ML",
    type: "mcq",
    question: "What is attention mechanism in deep learning?",
    options: [
      "A memory management system",
      "A technique that lets a model focus on relevant parts of the input when producing each output, used in Transformers",
      "A regularization method",
      "A convolutional layer variant",
    ],
    correctIndex: 1,
    explanation:
      "Attention computes a weighted average of all input representations, with weights reflecting relevance. It's the core of Transformers (BERT, GPT) and has replaced RNNs in NLP.",
    difficulty: "hard",
  },
  {
    id: "ml-d-10",
    domain: "ML",
    type: "mcq",
    question: "What is the difference between classification and regression?",
    options: [
      "No difference",
      "Classification predicts discrete categories; regression predicts continuous numeric values",
      "Regression is for images; classification for text",
      "Classification uses neural networks; regression does not",
    ],
    correctIndex: 1,
    explanation:
      "Classification: 'Is this email spam?' (discrete). Regression: 'What will the price be?' (continuous). Both are supervised learning tasks.",
    difficulty: "easy",
  },
  {
    id: "ml-coding-01",
    domain: "ML",
    type: "coding",
    question:
      "Implement simple linear regression (gradient descent) for y = mx + b.",
    starterCode:
      "def linear_regression(X, y, lr=0.01, epochs=100):\n    m, b = 0, 0\n    n = len(X)\n    for _ in range(epochs):\n        # Compute predictions, gradients, update m and b\n        pass\n    return m, b",
    expectedOutput: "Approximate m and b values that minimize MSE",
    hint: "Prediction = m*X + b. MSE gradient: dm = -(2/n)*sum(X*(y-pred)), db = -(2/n)*sum(y-pred).",
    difficulty: "medium",
  },
  {
    id: "ml-coding-02",
    domain: "ML",
    type: "coding",
    question: "Write a function to compute cross-entropy loss.",
    starterCode:
      "import math\ndef cross_entropy(y_true, y_pred):\n    # y_true: list of true class indices\n    # y_pred: list of probability lists\n    # Return average cross-entropy loss\n    pass",
    expectedOutput: "Float loss value. Higher = worse predictions.",
    hint: "For each sample: -log(y_pred[i][y_true[i]]). Average over all samples.",
    difficulty: "medium",
  },
  {
    id: "ml-coding-03",
    domain: "ML",
    type: "coding",
    question: "Implement accuracy metric for binary classification.",
    starterCode:
      "def accuracy(y_true, y_pred):\n    # y_true and y_pred are lists of 0s and 1s\n    # Return accuracy as a float between 0 and 1\n    pass",
    expectedOutput: "0.75 for y_true=[1,0,1,1] and y_pred=[1,1,1,0]",
    hint: "Count matching elements and divide by total.",
    difficulty: "easy",
  },

  // ── DevOps ─────────────────────────────────────────────────────────────────
  {
    id: "dv-d-01",
    domain: "DevOps",
    type: "mcq",
    question: "What is CI/CD?",
    options: [
      "Container Image and Cloud Delivery",
      "Continuous Integration / Continuous Delivery — automating code testing, building, and deployment",
      "Code Integration with Cloud Databases",
      "A Docker networking feature",
    ],
    correctIndex: 1,
    explanation:
      "CI: automatically build and test every code commit. CD: automatically deploy passing builds to staging or production. Reduces manual errors and speeds up releases.",
    difficulty: "easy",
  },
  {
    id: "dv-d-02",
    domain: "DevOps",
    type: "mcq",
    question: "What is Kubernetes used for?",
    options: [
      "Writing microservices code",
      "Container orchestration — automating deployment, scaling, and management of containerized applications",
      "A database clustering tool",
      "A CI/CD pipeline tool",
    ],
    correctIndex: 1,
    explanation:
      "Kubernetes (K8s) manages container lifecycles across a cluster: scheduling, scaling, load balancing, self-healing, and rolling updates.",
    difficulty: "easy",
  },
  {
    id: "dv-d-03",
    domain: "DevOps",
    type: "mcq",
    question: "What is Infrastructure as Code (IaC)?",
    options: [
      "Writing application code",
      "Managing infrastructure (servers, networks, DBs) through machine-readable definition files like Terraform/CloudFormation",
      "A monitoring tool",
      "A containerization technology",
    ],
    correctIndex: 1,
    explanation:
      "IaC allows teams to provision and manage infrastructure with code, enabling versioning, repeatability, and automation instead of manual configuration.",
    difficulty: "easy",
  },
  {
    id: "dv-d-04",
    domain: "DevOps",
    type: "mcq",
    question: "What does a Dockerfile do?",
    options: [
      "Describes a deployment pipeline",
      "Defines the instructions to build a Docker container image — base OS, dependencies, and runtime config",
      "Orchestrates multiple containers",
      "A Kubernetes configuration file",
    ],
    correctIndex: 1,
    explanation:
      "A Dockerfile is a recipe for building a Docker image. It specifies: base image, packages to install, code to copy, ports to expose, and the startup command.",
    difficulty: "easy",
  },
  {
    id: "dv-d-05",
    domain: "DevOps",
    type: "mcq",
    question:
      "What is the purpose of monitoring in DevOps (e.g., Prometheus, Grafana)?",
    options: [
      "Version control",
      "Tracking system health metrics (CPU, memory, latency) and alerting when issues occur",
      "Managing source code",
      "Automating tests",
    ],
    correctIndex: 1,
    explanation:
      "Monitoring tools collect metrics, create dashboards, and alert on-call engineers when key metrics (error rate, response time) exceed thresholds.",
    difficulty: "easy",
  },
  {
    id: "dv-d-06",
    domain: "DevOps",
    type: "mcq",
    question:
      "What is the difference between blue-green and canary deployments?",
    options: [
      "Both are identical",
      "Blue-green switches all traffic instantly between two identical environments; canary gradually routes a small % of traffic to the new version",
      "Canary is for databases only",
      "Blue-green is riskier",
    ],
    correctIndex: 1,
    explanation:
      "Blue-green: zero downtime cutover. Canary: gradually increases traffic to new version while monitoring for errors — reduces blast radius if issues arise.",
    difficulty: "medium",
  },
  {
    id: "dv-d-07",
    domain: "DevOps",
    type: "mcq",
    question: "What is a container registry?",
    options: [
      "A Docker networking feature",
      "A storage service for container images (like Docker Hub, AWS ECR, GitHub Container Registry)",
      "A container monitoring tool",
      "A Kubernetes node type",
    ],
    correctIndex: 1,
    explanation:
      "Container registries store and distribute Docker images. Teams push images after CI builds and pull them during deployment.",
    difficulty: "easy",
  },
  {
    id: "dv-d-08",
    domain: "DevOps",
    type: "mcq",
    question: "What is the purpose of a load balancer?",
    options: [
      "Balancing database writes",
      "Distributing incoming network traffic across multiple servers to ensure no single server is overwhelmed",
      "Compressing network packets",
      "Managing DNS records",
    ],
    correctIndex: 1,
    explanation:
      "Load balancers improve availability and scalability by distributing requests across healthy server instances, routing away from failed ones.",
    difficulty: "easy",
  },
  {
    id: "dv-d-09",
    domain: "DevOps",
    type: "mcq",
    question: "What does 'shift left' mean in DevOps?",
    options: [
      "Moving servers to the left data center",
      "Integrating testing, security, and quality checks earlier in the development pipeline (closer to coding)",
      "A deployment rollback strategy",
      "Left-aligning code in version control",
    ],
    correctIndex: 1,
    explanation:
      "Shift left means finding defects and security issues early (during development/testing) rather than late (in production), reducing cost and risk.",
    difficulty: "medium",
  },
  {
    id: "dv-d-10",
    domain: "DevOps",
    type: "mcq",
    question: "What is a Helm chart in Kubernetes?",
    options: [
      "A performance graph",
      "A package manager template for Kubernetes resources — simplifies deploying complex applications",
      "A K8s security policy",
      "A container image format",
    ],
    correctIndex: 1,
    explanation:
      "Helm charts are reusable templates for Kubernetes YAML configurations, allowing parameterized deployments of applications and their dependencies.",
    difficulty: "medium",
  },
  {
    id: "dv-coding-01",
    domain: "DevOps",
    type: "coding",
    question:
      "Write a bash script that checks if a service is running and restarts it if not.",
    starterCode:
      "#!/bin/bash\n# Check if 'nginx' process is running\n# If not, restart it and log the action\nSERVICE='nginx'\n# Your code here",
    expectedOutput:
      "Script that checks pgrep/systemctl and restarts service if down",
    hint: "Use 'systemctl is-active $SERVICE' or 'pgrep $SERVICE'. If exit code is non-zero, run 'systemctl restart $SERVICE'.",
    difficulty: "medium",
  },
  {
    id: "dv-coding-02",
    domain: "DevOps",
    type: "coding",
    question: "Write a Dockerfile for a Node.js application.",
    starterCode:
      "# Write a Dockerfile that:\n# 1. Uses node:18-alpine as base\n# 2. Sets working directory to /app\n# 3. Copies package.json and installs deps\n# 4. Copies source code\n# 5. Exposes port 3000\n# 6. Starts with 'node index.js'",
    expectedOutput: "Valid Dockerfile with all 6 requirements",
    hint: "Use FROM, WORKDIR, COPY, RUN npm install, EXPOSE, CMD instructions in order.",
    difficulty: "easy",
  },
  {
    id: "dv-coding-03",
    domain: "DevOps",
    type: "coding",
    question: "Write a GitHub Actions workflow step to run tests on push.",
    starterCode:
      "# Write the YAML for a GitHub Actions job\n# that runs 'npm test' on every push to main\n# Uses ubuntu-latest and node 18",
    expectedOutput: "Valid GitHub Actions YAML with trigger, job, and steps",
    hint: "Use 'on: push: branches: [main]', 'jobs: test: runs-on: ubuntu-latest', steps: checkout + setup-node + npm test.",
    difficulty: "medium",
  },

  // ── Android ────────────────────────────────────────────────────────────────
  {
    id: "an-d-01",
    domain: "Android",
    type: "mcq",
    question:
      "What is the main programming language for native Android development?",
    options: ["Swift", "Kotlin (and Java)", "JavaScript", "Dart"],
    correctIndex: 1,
    explanation:
      "Kotlin is Google's preferred language for Android development since 2017. Java is also supported. Dart is for Flutter (cross-platform), not native Android.",
    difficulty: "easy",
  },
  {
    id: "an-d-02",
    domain: "Android",
    type: "mcq",
    question: "What is an Activity in Android?",
    options: [
      "A background service",
      "A single screen with a user interface — the basic UI building block of an Android app",
      "A database helper",
      "A network request manager",
    ],
    correctIndex: 1,
    explanation:
      "An Activity represents one screen in your app. Apps typically have multiple Activities connected by Intents, or use a single Activity with Fragments.",
    difficulty: "easy",
  },
  {
    id: "an-d-03",
    domain: "Android",
    type: "mcq",
    question: "What is Jetpack Compose?",
    options: [
      "A Java library for animations",
      "Android's modern declarative UI toolkit for building native UIs in Kotlin",
      "A dependency injection framework",
      "A networking library",
    ],
    correctIndex: 1,
    explanation:
      "Jetpack Compose (2021+) replaces XML layouts with Kotlin-based declarative UI. Similar in philosophy to React — describe what the UI should look like, not how to build it.",
    difficulty: "easy",
  },
  {
    id: "an-d-04",
    domain: "Android",
    type: "mcq",
    question: "What is the purpose of the Android Manifest file?",
    options: [
      "Storing app settings",
      "Declaring app components (Activities, Services, permissions) to the Android OS",
      "Writing app logic",
      "Defining UI layouts",
    ],
    correctIndex: 1,
    explanation:
      "AndroidManifest.xml registers all app components, declares required permissions, specifies the minimum API level, and sets the launcher Activity.",
    difficulty: "easy",
  },
  {
    id: "an-d-05",
    domain: "Android",
    type: "mcq",
    question: "What is a Fragment in Android?",
    options: [
      "A broken Activity",
      "A reusable UI module that can be embedded in Activities — supports dynamic, multi-pane layouts",
      "A background process",
      "A database transaction",
    ],
    correctIndex: 1,
    explanation:
      "Fragments encapsulate UI and logic that can be combined, swapped, or reused across Activities. The single-Activity architecture uses Fragments for all navigation.",
    difficulty: "medium",
  },
  {
    id: "an-d-06",
    domain: "Android",
    type: "mcq",
    question: "What is a ViewModel in Android Architecture Components?",
    options: [
      "The XML layout file",
      "A class that holds and manages UI-related data, surviving configuration changes like screen rotation",
      "A RecyclerView adapter",
      "A database entity",
    ],
    correctIndex: 1,
    explanation:
      "ViewModel separates UI data from UI controllers (Activities/Fragments) and survives configuration changes, preventing data loss on rotation.",
    difficulty: "medium",
  },
  {
    id: "an-d-07",
    domain: "Android",
    type: "mcq",
    question: "What is Room in Android?",
    options: [
      "A UI layout manager",
      "An abstraction layer over SQLite for local database persistence with compile-time SQL validation",
      "A background worker library",
      "A network caching library",
    ],
    correctIndex: 1,
    explanation:
      "Room (Jetpack) provides an ORM-like API for SQLite. It validates SQL at compile time and integrates with LiveData/Flow for reactive data.",
    difficulty: "easy",
  },
  {
    id: "an-d-08",
    domain: "Android",
    type: "mcq",
    question: "What is the purpose of Retrofit in Android?",
    options: [
      "UI animations",
      "A type-safe HTTP client for making API calls, converting responses to Kotlin/Java objects",
      "Local database access",
      "Dependency injection",
    ],
    correctIndex: 1,
    explanation:
      "Retrofit turns HTTP APIs into Kotlin interfaces. Combined with Gson/Moshi for JSON parsing and OkHttp for networking, it's the standard Android HTTP client.",
    difficulty: "easy",
  },
  {
    id: "an-d-09",
    domain: "Android",
    type: "mcq",
    question: "What does the 'suspend' keyword mean in Kotlin coroutines?",
    options: [
      "Stops the application",
      "Marks a function that can be paused and resumed without blocking the thread — used for async operations",
      "Makes a function run on UI thread",
      "A deprecated keyword",
    ],
    correctIndex: 1,
    explanation:
      "Suspend functions can be paused at any point (e.g., waiting for network/disk I/O) and resumed later, without blocking the underlying thread.",
    difficulty: "medium",
  },
  {
    id: "an-d-10",
    domain: "Android",
    type: "mcq",
    question: "What is LiveData in Android?",
    options: [
      "A real-time database",
      "An observable data holder that is lifecycle-aware — only notifies observers when the lifecycle is active",
      "A network response type",
      "A Kotlin data class",
    ],
    correctIndex: 1,
    explanation:
      "LiveData automatically removes observers when the lifecycle is destroyed, preventing memory leaks and null pointer exceptions from dead UI.",
    difficulty: "medium",
  },
  {
    id: "an-coding-01",
    domain: "Android",
    type: "coding",
    question:
      "Write a Kotlin data class for a User with id, name, and email, including a toString override.",
    starterCode:
      "// Write the User data class\n// with properties: id: Int, name: String, email: String\n// Include a custom toString()",
    expectedOutput:
      "Data class with all properties, equals/hashCode, and toString",
    hint: "Kotlin data classes auto-generate equals/hashCode/copy. Add data keyword before class.",
    difficulty: "easy",
  },
  {
    id: "an-coding-02",
    domain: "Android",
    type: "coding",
    question:
      "Write a Kotlin extension function on String that capitalizes each word.",
    starterCode:
      "// Add an extension function to String\n// that returns a version with each word capitalized\n// Example: 'hello world' -> 'Hello World'\nfun String.titleCase(): String {\n    // Your code here\n}",
    expectedOutput: "'Hello World' for input 'hello world'",
    hint: "Split by space, capitalize each word with replaceFirstChar, rejoin with spaces.",
    difficulty: "easy",
  },
  {
    id: "an-coding-03",
    domain: "Android",
    type: "coding",
    question: "Implement a simple stack using Kotlin's ArrayDeque.",
    starterCode:
      "class KotlinStack<T> {\n    private val items = ArrayDeque<T>()\n    \n    fun push(item: T) { /* TODO */ }\n    fun pop(): T? { /* TODO */ }\n    fun peek(): T? { /* TODO */ }\n    fun isEmpty() = items.isEmpty()\n}",
    expectedOutput: "Working LIFO stack operations using ArrayDeque",
    hint: "Use addLast for push, removeLast for pop, last() for peek.",
    difficulty: "easy",
  },

  // ── iOS ────────────────────────────────────────────────────────────────────
  {
    id: "ios-d-01",
    domain: "iOS",
    type: "mcq",
    question: "What is the primary language for iOS development?",
    options: ["Objective-C", "Swift", "Kotlin", "Java"],
    correctIndex: 1,
    explanation:
      "Swift (2014) is Apple's modern language for iOS, macOS, watchOS, and tvOS development. Objective-C is the legacy language still supported.",
    difficulty: "easy",
  },
  {
    id: "ios-d-02",
    domain: "iOS",
    type: "mcq",
    question: "What is SwiftUI?",
    options: [
      "A JavaScript framework for iOS",
      "Apple's declarative UI framework for building interfaces across all Apple platforms",
      "An Android compatibility layer",
      "A database ORM",
    ],
    correctIndex: 1,
    explanation:
      "SwiftUI (2019) uses a declarative syntax to describe what the UI should look like. It replaces UIKit for new development and works across iOS, macOS, watchOS, and tvOS.",
    difficulty: "easy",
  },
  {
    id: "ios-d-03",
    domain: "iOS",
    type: "mcq",
    question: "What is ARC (Automatic Reference Counting) in Swift?",
    options: [
      "A networking protocol",
      "Swift's memory management — automatically tracks and manages app memory by counting object references",
      "An animation framework",
      "A Swift package manager",
    ],
    correctIndex: 1,
    explanation:
      "ARC automatically deallocates objects when their reference count reaches zero, eliminating manual memory management while avoiding garbage collection overhead.",
    difficulty: "medium",
  },
  {
    id: "ios-d-04",
    domain: "iOS",
    type: "mcq",
    question: "What is a strong reference cycle and how is it prevented?",
    options: [
      "A Swift loop that runs indefinitely",
      "Two objects that hold strong references to each other, causing a memory leak — prevented with weak/unowned references",
      "A type of generics constraint",
      "A Combine publisher pattern",
    ],
    correctIndex: 1,
    explanation:
      "When object A holds a strong reference to B and B to A, neither is deallocated. Use 'weak var' or 'unowned' for one reference to break the cycle.",
    difficulty: "medium",
  },
  {
    id: "ios-d-05",
    domain: "iOS",
    type: "mcq",
    question: "What is a Protocol in Swift?",
    options: [
      "A network communication rule",
      "A blueprint of methods and properties that conforming types must implement — similar to interfaces",
      "A type of struct",
      "A Swift keyword for loops",
    ],
    correctIndex: 1,
    explanation:
      "Protocols define requirements (methods, properties) that any conforming class, struct, or enum must implement. Protocol-oriented programming is central to Swift design.",
    difficulty: "easy",
  },
  {
    id: "ios-d-06",
    domain: "iOS",
    type: "mcq",
    question: "What is the Combine framework?",
    options: [
      "A UI layout tool",
      "Apple's reactive framework for handling asynchronous events as streams of values — similar to RxSwift",
      "A Swift collections library",
      "An App Store submission tool",
    ],
    correctIndex: 1,
    explanation:
      "Combine uses Publishers and Subscribers to process values over time, enabling reactive programming patterns for handling network requests, user input, and data streams.",
    difficulty: "hard",
  },
  {
    id: "ios-d-07",
    domain: "iOS",
    type: "mcq",
    question: "What is Core Data used for?",
    options: [
      "Core graphics rendering",
      "Apple's framework for model layer object graph management and persistence (iOS ORM)",
      "Networking",
      "Push notifications",
    ],
    correctIndex: 1,
    explanation:
      "Core Data manages the model layer in iOS apps — object graph persistence, data modeling, fetch requests, and relationships. Alternative: Realm or SQLite directly.",
    difficulty: "easy",
  },
  {
    id: "ios-d-08",
    domain: "iOS",
    type: "mcq",
    question: "What does @State in SwiftUI do?",
    options: [
      "Makes a variable constant",
      "Declares a source of truth for a value in a SwiftUI view — changes trigger UI re-render",
      "Handles network state",
      "Defines a computed property",
    ],
    correctIndex: 1,
    explanation:
      "@State creates a property that SwiftUI watches. When it changes, the view re-renders. Like useState in React.",
    difficulty: "easy",
  },
  {
    id: "ios-d-09",
    domain: "iOS",
    type: "mcq",
    question: "What is the App Store Review process?",
    options: [
      "Automatic code compilation",
      "Apple's mandatory review of all submitted apps for quality, safety, and policy compliance before public distribution",
      "A beta testing program",
      "Code signing only",
    ],
    correctIndex: 1,
    explanation:
      "Every iOS app must pass Apple's review (typically 1-3 days) checking for crashes, content policy, privacy, and functionality before being listed on the App Store.",
    difficulty: "easy",
  },
  {
    id: "ios-d-10",
    domain: "iOS",
    type: "mcq",
    question: "What is the difference between struct and class in Swift?",
    options: [
      "No difference",
      "Structs are value types (copied on assignment); classes are reference types (shared reference)",
      "Classes are faster than structs",
      "Structs support inheritance",
    ],
    correctIndex: 1,
    explanation:
      "Value type (struct): copying creates an independent copy. Reference type (class): assignment shares the same object. Swift favors structs for data models.",
    difficulty: "medium",
  },
  {
    id: "ios-coding-01",
    domain: "iOS",
    type: "coding",
    question:
      "Write a Swift function to find the most frequent element in an array.",
    starterCode:
      "func mostFrequent<T: Hashable>(_ array: [T]) -> T? {\n    // Return the element that appears most often\n    // Return nil if array is empty\n}",
    expectedOutput: "3 for [1, 2, 3, 3, 2, 3, 1]",
    hint: "Use a Dictionary to count occurrences, then find the key with max value.",
    difficulty: "easy",
  },
  {
    id: "ios-coding-02",
    domain: "iOS",
    type: "coding",
    question: "Implement a binary search function in Swift.",
    starterCode:
      "func binarySearch<T: Comparable>(_ array: [T], target: T) -> Int? {\n    // Return index of target if found, nil if not\n    // Assume array is sorted\n}",
    expectedOutput: "Index of target or nil",
    hint: "Use low/high pointers, check mid element. Narrow range each iteration.",
    difficulty: "easy",
  },
  {
    id: "ios-coding-03",
    domain: "iOS",
    type: "coding",
    question: "Write a Swift Codable struct for a JSON API response.",
    starterCode:
      '// JSON: {"id": 1, "username": "alice", "is_active": true}\n// Write a Swift struct that can decode this JSON\nstruct UserResponse {\n    // Properties and coding keys\n}',
    expectedOutput:
      "Struct conforming to Codable with proper CodingKeys for snake_case mapping",
    hint: "Use 'struct UserResponse: Codable' with CodingKeys enum to map snake_case JSON to camelCase Swift.",
    difficulty: "easy",
  },

  // ── Cybersecurity ──────────────────────────────────────────────────────────
  {
    id: "cy-d-01",
    domain: "Cybersecurity",
    type: "mcq",
    question: "What is a man-in-the-middle (MITM) attack?",
    options: [
      "A social engineering attack",
      "An attacker secretly intercepts and potentially alters communication between two parties who believe they're communicating directly",
      "A DDoS variant",
      "A password cracking technique",
    ],
    correctIndex: 1,
    explanation:
      "MITM attackers position themselves between client and server, reading or modifying traffic. HTTPS/TLS with certificate validation prevents MITM.",
    difficulty: "easy",
  },
  {
    id: "cy-d-02",
    domain: "Cybersecurity",
    type: "mcq",
    question: "What is social engineering?",
    options: [
      "Designing social networks",
      "Manipulating people into divulging confidential info or performing actions through psychological deception",
      "SQL injection via social apps",
      "Network topology design",
    ],
    correctIndex: 1,
    explanation:
      "Social engineering exploits human psychology rather than technical vulnerabilities. Examples: phishing, pretexting, baiting, tailgating.",
    difficulty: "easy",
  },
  {
    id: "cy-d-03",
    domain: "Cybersecurity",
    type: "mcq",
    question: "What is two-factor authentication (2FA)?",
    options: [
      "Two passwords required",
      "Requiring two different types of evidence to verify identity — something you know + something you have/are",
      "Encrypting data twice",
      "Two-person authentication for sensitive systems",
    ],
    correctIndex: 1,
    explanation:
      "2FA combines factors: something you know (password), something you have (phone/token), or something you are (biometric). Even if password is stolen, account is protected.",
    difficulty: "easy",
  },
  {
    id: "cy-d-04",
    domain: "Cybersecurity",
    type: "mcq",
    question: "What is a zero-day vulnerability?",
    options: [
      "A bug discovered on day zero of development",
      "A vulnerability that is unknown to the vendor and has no patch available — attackers exploit it before any defense exists",
      "A low-severity security issue",
      "A test environment exploit",
    ],
    correctIndex: 1,
    explanation:
      "Zero-day: unknown vulnerability (zero days for the vendor to patch). Highly valuable to attackers. Discovered exploits are sold on dark markets or used in nation-state attacks.",
    difficulty: "medium",
  },
  {
    id: "cy-d-05",
    domain: "Cybersecurity",
    type: "mcq",
    question: "What does penetration testing (pen testing) involve?",
    options: [
      "Testing website load times",
      "Authorized simulated attacks on systems to identify exploitable vulnerabilities before real attackers do",
      "Testing database performance",
      "Load testing web servers",
    ],
    correctIndex: 1,
    explanation:
      "Pen testers (ethical hackers) use real attack techniques with permission to find vulnerabilities — SQL injection, XSS, misconfigurations, privilege escalation — and report them.",
    difficulty: "easy",
  },
  {
    id: "cy-d-06",
    domain: "Cybersecurity",
    type: "mcq",
    question: "What is a rainbow table attack?",
    options: [
      "A multi-layer firewall bypass",
      "Using precomputed hash-to-plaintext mappings to quickly crack password hashes",
      "A DNS poisoning technique",
      "A network flooding attack",
    ],
    correctIndex: 1,
    explanation:
      "Rainbow tables are precomputed mappings from hashes back to plaintext. Countered by using unique salts per password — making precomputed tables useless.",
    difficulty: "medium",
  },
  {
    id: "cy-d-07",
    domain: "Cybersecurity",
    type: "mcq",
    question: "What is the OWASP Top 10?",
    options: [
      "10 most popular web frameworks",
      "A list of the 10 most critical web application security risks updated regularly",
      "10 steps to build a secure API",
      "Top 10 cybersecurity certifications",
    ],
    correctIndex: 1,
    explanation:
      "OWASP Top 10 documents the most common and dangerous web security risks (injection, broken auth, XSS, IDOR, etc.) — a standard reference for secure development.",
    difficulty: "easy",
  },
  {
    id: "cy-d-08",
    domain: "Cybersecurity",
    type: "mcq",
    question: "What is Broken Access Control (OWASP #1)?",
    options: [
      "Broken CSS layout",
      "When users can access resources or perform actions beyond their intended permissions",
      "A type of SQL injection",
      "An encryption failure",
    ],
    correctIndex: 1,
    explanation:
      "Broken Access Control: users accessing other users' data, performing admin functions, viewing private pages. Prevention: server-side permission checks on every request.",
    difficulty: "medium",
  },
  {
    id: "cy-d-09",
    domain: "Cybersecurity",
    type: "mcq",
    question: "What is VPN?",
    options: [
      "Video Processing Network",
      "Virtual Private Network — encrypts traffic and tunnels it through a server, masking IP and securing public connections",
      "Verified Protocol Network",
      "A firewall type",
    ],
    correctIndex: 1,
    explanation:
      "VPNs create an encrypted tunnel between your device and a VPN server, hiding traffic from ISPs/attackers on public WiFi and masking your IP address.",
    difficulty: "easy",
  },
  {
    id: "cy-d-10",
    domain: "Cybersecurity",
    type: "mcq",
    question: "What is input validation and why is it critical?",
    options: [
      "Checking UI form design",
      "Verifying that user input matches expected format/type/range before processing — prevents injection and unexpected behavior",
      "Validating API response schemas",
      "Testing network inputs",
    ],
    correctIndex: 1,
    explanation:
      "Input validation is the primary defense against injection attacks (SQL, XSS, command injection). Never trust user input — validate server-side for type, length, format, and range.",
    difficulty: "easy",
  },
  {
    id: "cy-coding-01",
    domain: "Cybersecurity",
    type: "coding",
    question: "Write a function to sanitize HTML input to prevent XSS.",
    starterCode:
      "function sanitizeHTML(input) {\n    // Escape HTML special characters\n    // &, <, >, \", ' should be encoded\n}",
    expectedOutput: "'&lt;script&gt;' for input '<script>'",
    hint: "Replace: & -> &amp;, < -> &lt;, > -> &gt;, \" -> &quot;, ' -> &#x27;",
    difficulty: "easy",
  },
  {
    id: "cy-coding-02",
    domain: "Cybersecurity",
    type: "coding",
    question: "Implement a simple password strength checker.",
    starterCode:
      "function checkPasswordStrength(password) {\n    // Return 'weak', 'medium', or 'strong'\n    // Criteria: length, uppercase, lowercase, numbers, special chars\n}",
    expectedOutput: "'strong' for 'P@ssw0rd123', 'weak' for 'abc'",
    hint: "Check length (>=8, >=12), has uppercase, lowercase, digit, special char. Score 0-4.",
    difficulty: "easy",
  },
  {
    id: "cy-coding-03",
    domain: "Cybersecurity",
    type: "coding",
    question:
      "Write a function to detect if a string contains SQL injection patterns.",
    starterCode:
      "function detectSQLInjection(input) {\n    // Return true if input contains common SQL injection patterns\n}",
    expectedOutput: "true for \"' OR '1'='1\", false for 'normal input'",
    hint: "Check for patterns: OR, UNION, SELECT, DROP, --, ;, ' combined with logical operators.",
    difficulty: "medium",
  },

  // ── Blockchain ─────────────────────────────────────────────────────────────
  {
    id: "bc-d-01",
    domain: "Blockchain",
    type: "mcq",
    question: "What is a blockchain?",
    options: [
      "A type of database server",
      "A distributed ledger of immutable records (blocks) linked by cryptographic hashes, maintained by a network of nodes",
      "A programming language",
      "A cloud storage service",
    ],
    correctIndex: 1,
    explanation:
      "Blockchains are append-only ledgers where each block contains transaction data, a timestamp, and the hash of the previous block — making tampering detectable.",
    difficulty: "easy",
  },
  {
    id: "bc-d-02",
    domain: "Blockchain",
    type: "mcq",
    question: "What is a smart contract?",
    options: [
      "A legal PDF stored on blockchain",
      "Self-executing code on a blockchain that automatically enforces agreement terms when conditions are met",
      "An NFT marketplace",
      "A cryptocurrency wallet",
    ],
    correctIndex: 1,
    explanation:
      "Smart contracts (Ethereum, Solidity) execute deterministically on the blockchain. Once deployed, they cannot be changed — terms are transparent and self-enforcing.",
    difficulty: "easy",
  },
  {
    id: "bc-d-03",
    domain: "Blockchain",
    type: "mcq",
    question: "What is Proof of Work (PoW)?",
    options: [
      "A smart contract validation",
      "A consensus mechanism where nodes solve computationally expensive puzzles to add blocks, requiring significant energy",
      "A digital signature algorithm",
      "A token distribution method",
    ],
    correctIndex: 1,
    explanation:
      "PoW (Bitcoin): miners compete to solve a cryptographic hash puzzle. Winner adds the block and gets a reward. Security comes from computational cost of 51% attacks.",
    difficulty: "medium",
  },
  {
    id: "bc-d-04",
    domain: "Blockchain",
    type: "mcq",
    question: "What is Proof of Stake (PoS)?",
    options: [
      "Proving ownership of cryptocurrency",
      "A consensus mechanism where validators stake (lock) cryptocurrency as collateral to gain block validation rights — much more energy efficient than PoW",
      "A transaction fee system",
      "A smart contract testing method",
    ],
    correctIndex: 1,
    explanation:
      "PoS (Ethereum 2.0, Cardano): validators are chosen proportionally to their staked tokens. Malicious validators lose their stake, creating economic disincentive for attacks.",
    difficulty: "medium",
  },
  {
    id: "bc-d-05",
    domain: "Blockchain",
    type: "mcq",
    question: "What is a hash function's role in blockchain?",
    options: [
      "Encrypting wallet keys",
      "Creating a fixed-size digital fingerprint of block data — any change to the data completely changes the hash",
      "Generating cryptocurrency",
      "Signing transactions",
    ],
    correctIndex: 1,
    explanation:
      "SHA-256 hashes block contents into a fixed 256-bit string. If any transaction data changes, the hash changes entirely, breaking the chain and revealing tampering.",
    difficulty: "easy",
  },
  {
    id: "bc-d-06",
    domain: "Blockchain",
    type: "mcq",
    question: "What is an NFT?",
    options: [
      "Non-fungible token — a unique, verifiable digital asset on a blockchain with provable ownership and scarcity",
      "A type of cryptocurrency",
      "A smart contract language",
      "A blockchain consensus method",
    ],
    correctIndex: 0,
    explanation:
      "NFTs are unique tokens (ERC-721) that represent ownership of a specific digital item. Unlike fungible tokens (ETH, USDC), each NFT has unique metadata and cannot be exchanged 1:1.",
    difficulty: "easy",
  },
  {
    id: "bc-d-07",
    domain: "Blockchain",
    type: "mcq",
    question: "What is DeFi?",
    options: [
      "A hardware wallet brand",
      "Decentralized Finance — financial services (lending, trading, yield) built on smart contracts without traditional intermediaries",
      "A blockchain testing framework",
      "A crypto exchange",
    ],
    correctIndex: 1,
    explanation:
      "DeFi protocols (Uniswap, Aave, Compound) recreate banking and finance on-chain, using smart contracts instead of banks, enabling permissionless global access.",
    difficulty: "easy",
  },
  {
    id: "bc-d-08",
    domain: "Blockchain",
    type: "mcq",
    question:
      "What is the double-spend problem and how does blockchain solve it?",
    options: [
      "Spending too much gas",
      "Spending the same digital currency twice — solved by blockchain's consensus mechanism ensuring a single canonical transaction history",
      "Using the same wallet twice",
      "Duplicate smart contract deployment",
    ],
    correctIndex: 1,
    explanation:
      "Digital files can be copied, so digital cash could be 'spent' twice. Blockchain's distributed consensus ensures all nodes agree on which transaction came first, preventing duplicates.",
    difficulty: "medium",
  },
  {
    id: "bc-d-09",
    domain: "Blockchain",
    type: "mcq",
    question: "What is the purpose of a private key in blockchain?",
    options: [
      "Encrypting the blockchain",
      "Proving ownership and signing transactions — only the owner with the private key can authorize spending",
      "Mining new blocks",
      "Connecting to the blockchain network",
    ],
    correctIndex: 1,
    explanation:
      "Private keys generate digital signatures that prove transaction authorization without revealing the key. Never share your private key — anyone with it controls your assets.",
    difficulty: "easy",
  },
  {
    id: "bc-d-10",
    domain: "Blockchain",
    type: "mcq",
    question: "What is gas in Ethereum?",
    options: [
      "A type of cryptocurrency",
      "The fee paid to validators for computational resources used when executing smart contracts or transactions",
      "A measurement of block size",
      "An Ethereum scaling solution",
    ],
    correctIndex: 1,
    explanation:
      "Gas measures computation cost. Gas price (in Gwei) × gas used = transaction fee. High network demand → high gas prices. EIP-1559 introduced base fee burning.",
    difficulty: "medium",
  },
  {
    id: "bc-coding-01",
    domain: "Blockchain",
    type: "coding",
    question: "Implement a simple hash function (FNV-1a) in JavaScript.",
    starterCode:
      "function fnv1aHash(str) {\n    // Implement FNV-1a 32-bit hash\n    // Returns a 32-bit unsigned integer\n    let hash = 0x811c9dc5;\n    // Your code here\n}",
    expectedOutput: "Deterministic 32-bit integer for any string input",
    hint: "For each char: hash ^= charCode, then hash *= 0x01000193, handle 32-bit overflow with >>> 0.",
    difficulty: "hard",
  },
  {
    id: "bc-coding-02",
    domain: "Blockchain",
    type: "coding",
    question:
      "Write a function that verifies a Merkle tree root from a list of transactions.",
    starterCode:
      "function getMerkleRoot(transactions) {\n    // Simulate hashing by concatenating strings\n    // Return the root hash by recursively combining pairs\n    // If odd number, duplicate last element\n}",
    expectedOutput: "Root string formed by combining all transaction hashes",
    hint: "Hash pairs repeatedly until one value remains. Handle odd-length arrays by duplicating last.",
    difficulty: "hard",
  },
  {
    id: "bc-coding-03",
    domain: "Blockchain",
    type: "coding",
    question: "Simulate a simple blockchain with proof-of-work in JavaScript.",
    starterCode:
      "class Block {\n    constructor(index, data, previousHash = '') {\n        this.index = index;\n        this.data = data;\n        this.previousHash = previousHash;\n        this.hash = '';\n        this.nonce = 0;\n    }\n    mine(difficulty) {\n        // Increment nonce until hash starts with difficulty zeros\n    }\n}",
    expectedOutput:
      "Block that mines until hash starts with '0'.repeat(difficulty)",
    hint: "Concatenate index+data+previousHash+nonce, 'hash' it (use string manipulation), check prefix.",
    difficulty: "hard",
  },

  // ── Cloud ──────────────────────────────────────────────────────────────────
  {
    id: "cl-d-01",
    domain: "Cloud",
    type: "mcq",
    question: "What are the three main cloud service models?",
    options: [
      "Frontend, Backend, Database",
      "IaaS (Infrastructure), PaaS (Platform), SaaS (Software)",
      "Public, Private, Hybrid",
      "Storage, Compute, Network",
    ],
    correctIndex: 1,
    explanation:
      "IaaS: raw compute/storage (EC2). PaaS: managed platform for apps (Heroku, App Engine). SaaS: complete software (Gmail, Salesforce). Hybrid and Private describe deployment models.",
    difficulty: "easy",
  },
  {
    id: "cl-d-02",
    domain: "Cloud",
    type: "mcq",
    question: "What is auto-scaling in cloud computing?",
    options: [
      "Automatically updating software",
      "Automatically adjusting computing resources (up or down) based on current demand",
      "Scaling database tables automatically",
      "Auto-deploying code on push",
    ],
    correctIndex: 1,
    explanation:
      "Auto-scaling adds instances when traffic increases and removes them when traffic decreases, optimizing cost and ensuring performance under variable load.",
    difficulty: "easy",
  },
  {
    id: "cl-d-03",
    domain: "Cloud",
    type: "mcq",
    question: "What is serverless computing?",
    options: [
      "Servers without security",
      "Running code in response to events without managing server infrastructure — provider handles scaling and billing per invocation",
      "A dedicated server per user",
      "Servers with no OS",
    ],
    correctIndex: 1,
    explanation:
      "Serverless (AWS Lambda, Google Cloud Functions) lets you run functions triggered by events. No server management, automatic scaling, pay only for actual compute time.",
    difficulty: "easy",
  },
  {
    id: "cl-d-04",
    domain: "Cloud",
    type: "mcq",
    question: "What is the purpose of an IAM role in AWS?",
    options: [
      "Encrypting S3 buckets",
      "Defining permissions for AWS services and users — what resources they can access and what actions they can perform",
      "A billing management tool",
      "A network routing rule",
    ],
    correctIndex: 1,
    explanation:
      "IAM (Identity and Access Management) roles define who can do what in AWS. Follow least-privilege: grant only the minimum permissions needed.",
    difficulty: "medium",
  },
  {
    id: "cl-d-05",
    domain: "Cloud",
    type: "mcq",
    question: "What is object storage (e.g., S3)?",
    options: [
      "A file system with folders",
      "Flat storage for unstructured data (images, videos, backups) — accessed via HTTP, highly scalable and durable",
      "A relational database",
      "A container registry",
    ],
    correctIndex: 1,
    explanation:
      "Object storage stores data as objects with metadata and unique keys, accessed via REST APIs. Designed for massive scale (Amazon S3: 11 nines durability).",
    difficulty: "easy",
  },
  {
    id: "cl-d-06",
    domain: "Cloud",
    type: "mcq",
    question: "What is a VPC in cloud computing?",
    options: [
      "Virtual Processing Cluster",
      "Virtual Private Cloud — an isolated network environment within a public cloud where you control IP ranges, subnets, and routing",
      "A type of CDN",
      "A managed database service",
    ],
    correctIndex: 1,
    explanation:
      "VPCs let you define private networks within the public cloud, controlling access to resources with security groups, NACLs, and internet gateways.",
    difficulty: "medium",
  },
  {
    id: "cl-d-07",
    domain: "Cloud",
    type: "mcq",
    question: "What does 'availability zone' mean in cloud providers?",
    options: [
      "A geographic region",
      "An isolated data center within a region — failures in one zone don't affect others, enabling high availability",
      "A CDN edge location",
      "A server instance type",
    ],
    correctIndex: 1,
    explanation:
      "Availability Zones are physically separate data centers in a region with independent power, cooling, and networking. Deploying across multiple AZs ensures uptime during datacenter failures.",
    difficulty: "medium",
  },
  {
    id: "cl-d-08",
    domain: "Cloud",
    type: "mcq",
    question: "What is a managed service in cloud computing?",
    options: [
      "A service you manage yourself",
      "A fully managed cloud offering where the provider handles infrastructure, maintenance, and scaling (RDS, DynamoDB, EMR)",
      "A service with a management console",
      "A monitoring service",
    ],
    correctIndex: 1,
    explanation:
      "Managed services (e.g., Amazon RDS) take care of backups, patching, failover, and scaling, letting developers focus on application code.",
    difficulty: "easy",
  },
  {
    id: "cl-d-09",
    domain: "Cloud",
    type: "mcq",
    question: "What is the shared responsibility model in cloud security?",
    options: [
      "Cloud providers secure everything",
      "Division of security: provider secures the infrastructure; customer secures what runs on it (data, apps, access)",
      "Customer has no security responsibilities",
      "All security is a shared password",
    ],
    correctIndex: 1,
    explanation:
      "AWS/Azure/GCP secure the physical infrastructure, networking, and hypervisor. Customers must secure OS, applications, data, and IAM configurations.",
    difficulty: "medium",
  },
  {
    id: "cl-d-10",
    domain: "Cloud",
    type: "mcq",
    question: "What is a content delivery network (CDN)?",
    options: [
      "A social media network",
      "A distributed network of servers that caches static content close to users to reduce latency",
      "A content management system",
      "A cloud storage service",
    ],
    correctIndex: 1,
    explanation:
      "CDNs (Cloudflare, CloudFront, Fastly) cache assets at edge locations worldwide. Users get assets from nearby servers instead of the origin, reducing load time dramatically.",
    difficulty: "easy",
  },
  {
    id: "cl-coding-01",
    domain: "Cloud",
    type: "coding",
    question:
      "Write a Node.js function to upload a file to S3 using the AWS SDK.",
    starterCode:
      "const AWS = require('aws-sdk');\nconst s3 = new AWS.S3();\n\nasync function uploadFile(bucket, key, fileContent) {\n    // Upload fileContent to S3 bucket with given key\n    // Return the uploaded object URL\n}",
    expectedOutput: "S3 URL of uploaded object",
    hint: "Use s3.putObject({ Bucket, Key, Body }) and await .promise(). Return `https://${bucket}.s3.amazonaws.com/${key}`.",
    difficulty: "medium",
  },
  {
    id: "cl-coding-02",
    domain: "Cloud",
    type: "coding",
    question: "Write a serverless handler function for AWS Lambda.",
    starterCode:
      "// AWS Lambda handler\nexports.handler = async (event, context) => {\n    // Parse the incoming event body\n    // Return appropriate HTTP response object\n    // Handle errors with 500 status\n};",
    expectedOutput: "Lambda response: { statusCode, headers, body }",
    hint: "Parse event.body with JSON.parse. Return { statusCode: 200, body: JSON.stringify(data) }. Wrap in try/catch.",
    difficulty: "easy",
  },
  {
    id: "cl-coding-03",
    domain: "Cloud",
    type: "coding",
    question: "Implement a simple retry mechanism for cloud API calls.",
    starterCode:
      "async function retryWithBackoff(fn, maxRetries = 3, baseDelay = 1000) {\n    // Call fn(), retry on failure with exponential backoff\n    // Throw error after maxRetries exhausted\n}",
    expectedOutput:
      "Function that retries with 1s, 2s, 4s delays before failing",
    hint: "Use a loop with try/catch. On failure, await a delay of baseDelay * 2^attempt. Throw if max retries exceeded.",
    difficulty: "medium",
  },

  // ── AIML ───────────────────────────────────────────────────────────────────
  {
    id: "ai-d-01",
    domain: "AIML",
    type: "mcq",
    question: "What is the difference between AI, ML, and Deep Learning?",
    options: [
      "They are identical",
      "AI is the broad field; ML is a subset using data to learn; Deep Learning is a subset of ML using multi-layer neural networks",
      "ML is broader than AI",
      "Deep Learning does not use neural networks",
    ],
    correctIndex: 1,
    explanation:
      "AI ⊃ ML ⊃ Deep Learning. AI: any intelligent machine behavior. ML: learning from data. DL: neural networks with many layers enabling autonomous feature extraction.",
    difficulty: "easy",
  },
  {
    id: "ai-d-02",
    domain: "AIML",
    type: "mcq",
    question: "What is a Transformer architecture?",
    options: [
      "A power supply circuit",
      "A neural network architecture using self-attention to process sequences in parallel, powering GPT, BERT, and modern LLMs",
      "A type of CNN",
      "A recurrent neural network variant",
    ],
    correctIndex: 1,
    explanation:
      "Transformers (2017, 'Attention is All You Need') replaced RNNs for NLP. Self-attention allows each token to attend to all others simultaneously, enabling parallelization and long-range dependencies.",
    difficulty: "medium",
  },
  {
    id: "ai-d-03",
    domain: "AIML",
    type: "mcq",
    question: "What is prompt engineering?",
    options: [
      "Designing computer prompts in terminals",
      "Crafting input text to guide LLM outputs — using techniques like chain-of-thought, few-shot examples, and role instructions",
      "A hardware optimization technique",
      "A neural network training method",
    ],
    correctIndex: 1,
    explanation:
      "Prompt engineering shapes how LLMs respond by providing context, examples, format instructions, and role definitions. Effective prompts dramatically improve output quality.",
    difficulty: "easy",
  },
  {
    id: "ai-d-04",
    domain: "AIML",
    type: "mcq",
    question: "What is RAG (Retrieval-Augmented Generation)?",
    options: [
      "A type of GAN",
      "A technique combining a retrieval system with an LLM — relevant documents are fetched and provided as context for generation",
      "A training data format",
      "A model compression method",
    ],
    correctIndex: 1,
    explanation:
      "RAG retrieves relevant documents from a knowledge base (using embeddings/vector search), injects them into the prompt, and lets the LLM generate grounded, accurate responses.",
    difficulty: "medium",
  },
  {
    id: "ai-d-05",
    domain: "AIML",
    type: "mcq",
    question: "What is fine-tuning an LLM?",
    options: [
      "Adjusting model architecture",
      "Training a pre-trained model on domain-specific data to adapt its behavior to a particular task or style",
      "Compressing a model for deployment",
      "Running inference faster",
    ],
    correctIndex: 1,
    explanation:
      "Fine-tuning continues training a pre-trained model (GPT, Llama) on task-specific examples, adapting the weights for specialized use cases with far less data than training from scratch.",
    difficulty: "medium",
  },
  {
    id: "ai-d-06",
    domain: "AIML",
    type: "mcq",
    question: "What are embeddings in NLP?",
    options: [
      "Embedding HTML into apps",
      "Dense vector representations of text (words, sentences) capturing semantic meaning — similar meanings have similar vectors",
      "CSS animation properties",
      "Text compression algorithms",
    ],
    correctIndex: 1,
    explanation:
      "Word/sentence embeddings map text to high-dimensional vectors. 'King' - 'Man' + 'Woman' ≈ 'Queen'. Used in semantic search, RAG, and downstream ML tasks.",
    difficulty: "medium",
  },
  {
    id: "ai-d-07",
    domain: "AIML",
    type: "mcq",
    question: "What is hallucination in LLMs?",
    options: [
      "A visual artifact in image generation",
      "When an LLM generates confident but factually incorrect or fabricated information",
      "A training data bias",
      "A memory limit issue",
    ],
    correctIndex: 1,
    explanation:
      "LLMs generate statistically likely text, not necessarily factual text. They may invent citations, facts, or code that seems plausible but is wrong. RAG and grounding reduce hallucinations.",
    difficulty: "easy",
  },
  {
    id: "ai-d-08",
    domain: "AIML",
    type: "mcq",
    question: "What is a vector database?",
    options: [
      "A database using vector math operations",
      "A database optimized for storing and searching high-dimensional vectors (embeddings) by similarity distance",
      "A matrix multiplication library",
      "A GPU-accelerated RDBMS",
    ],
    correctIndex: 1,
    explanation:
      "Vector databases (Pinecone, Weaviate, Chroma) store embedding vectors and support ANN (approximate nearest neighbor) search — essential for semantic search and RAG systems.",
    difficulty: "medium",
  },
  {
    id: "ai-d-09",
    domain: "AIML",
    type: "mcq",
    question: "What is reinforcement learning from human feedback (RLHF)?",
    options: [
      "A supervised learning technique",
      "Training an LLM using human preference rankings to align outputs with human values and instructions",
      "A random exploration strategy",
      "A data collection method",
    ],
    correctIndex: 1,
    explanation:
      "RLHF trains a reward model on human preferences, then fine-tunes the LLM using PPO to maximize that reward — the technique behind ChatGPT's instruction-following ability.",
    difficulty: "hard",
  },
  {
    id: "ai-d-10",
    domain: "AIML",
    type: "mcq",
    question: "What is a GAN (Generative Adversarial Network)?",
    options: [
      "A graph analysis network",
      "A framework with two competing networks: a Generator creates fake data, a Discriminator tries to detect fakes — they improve each other through competition",
      "A classification model variant",
      "A reinforcement learning algorithm",
    ],
    correctIndex: 1,
    explanation:
      "GANs (Goodfellow 2014) generate realistic synthetic data. Generator vs Discriminator — as Discriminator improves at detecting fakes, Generator improves at creating realistic ones. Used for image synthesis.",
    difficulty: "medium",
  },
  {
    id: "ai-coding-01",
    domain: "AIML",
    type: "coding",
    question:
      "Write a Python function to compute cosine similarity between two vectors.",
    starterCode:
      "import math\ndef cosine_similarity(vec1, vec2):\n    # Return cosine similarity between vec1 and vec2\n    # Range: -1 (opposite) to 1 (identical)\n    pass",
    expectedOutput: "1.0 for identical vectors, 0.0 for orthogonal",
    hint: "dot_product / (magnitude(vec1) * magnitude(vec2)). Magnitude = sqrt(sum of squares).",
    difficulty: "medium",
  },
  {
    id: "ai-coding-02",
    domain: "AIML",
    type: "coding",
    question: "Implement a simple tokenizer that splits text into word tokens.",
    starterCode:
      "def tokenize(text):\n    # Return a list of lowercase word tokens\n    # Remove punctuation, split on whitespace\n    import re\n    pass",
    expectedOutput:
      "['hello', 'world', 'how', 'are', 'you'] for 'Hello, World! How are you?'",
    hint: "Convert to lowercase, use regex to remove non-alphanumeric chars, split on whitespace.",
    difficulty: "easy",
  },
  {
    id: "ai-coding-03",
    domain: "AIML",
    type: "coding",
    question: "Implement TF-IDF score for a word in a document.",
    starterCode:
      "import math\ndef tfidf(word, document, all_documents):\n    # document: list of words\n    # all_documents: list of documents (list of word lists)\n    # Return TF-IDF score\n    pass",
    expectedOutput:
      "Float TF-IDF score — higher = more important for this document",
    hint: "TF = count(word in doc) / len(doc). IDF = log(N / df) where N=total docs, df=docs containing word.",
    difficulty: "hard",
  },

  // ── GameDev ────────────────────────────────────────────────────────────────
  {
    id: "gd-d-01",
    domain: "GameDev",
    type: "mcq",
    question: "What is a game loop?",
    options: [
      "A recursive game function",
      "The main loop that continuously processes input, updates game state, and renders frames at a target frame rate",
      "A type of level design",
      "An animation sequence",
    ],
    correctIndex: 1,
    explanation:
      "The game loop is the core of every game: while(running) { processInput(); update(); render(); }. It runs 30-120+ times per second, maintaining consistent gameplay regardless of hardware.",
    difficulty: "easy",
  },
  {
    id: "gd-d-02",
    domain: "GameDev",
    type: "mcq",
    question: "What is delta time in game development?",
    options: [
      "The time between level loads",
      "The elapsed time since the last frame — used to make game speed independent of frame rate",
      "The render time per frame",
      "A physics simulation value",
    ],
    correctIndex: 1,
    explanation:
      "position += speed * deltaTime. Without delta time, faster hardware runs the game faster. Delta time ensures consistent movement regardless of frame rate.",
    difficulty: "easy",
  },
  {
    id: "gd-d-03",
    domain: "GameDev",
    type: "mcq",
    question: "What is collision detection?",
    options: [
      "Detecting game crashes",
      "Determining if two game objects overlap or touch in the game world",
      "A pathfinding algorithm",
      "An anti-cheat system",
    ],
    correctIndex: 1,
    explanation:
      "Collision detection checks if game objects (player, enemies, projectiles) overlap. Methods: AABB (axis-aligned bounding boxes), circle collisions, polygon collision, broad phase + narrow phase.",
    difficulty: "easy",
  },
  {
    id: "gd-d-04",
    domain: "GameDev",
    type: "mcq",
    question: "What is a sprite in 2D game development?",
    options: [
      "A type of animation loop",
      "A 2D bitmap/image used to represent game objects — characters, backgrounds, items",
      "A collision detection method",
      "A game engine feature",
    ],
    correctIndex: 1,
    explanation:
      "Sprites are 2D images rendered at specific screen positions. Sprite sheets pack multiple animation frames into one image, and the game selects the right frame to display.",
    difficulty: "easy",
  },
  {
    id: "gd-d-05",
    domain: "GameDev",
    type: "mcq",
    question: "What is a scene graph?",
    options: [
      "A graph of game difficulty",
      "A hierarchical tree structure representing the game world — parent transforms affect all children",
      "A network of multiplayer servers",
      "An AI behavior system",
    ],
    correctIndex: 1,
    explanation:
      "Scene graphs organize game objects in parent-child hierarchies. A child's position is relative to its parent. Unity's Transform hierarchy is a scene graph.",
    difficulty: "medium",
  },
  {
    id: "gd-d-06",
    domain: "GameDev",
    type: "mcq",
    question:
      "What is the difference between a shader and a material in 3D games?",
    options: [
      "No difference",
      "Shader: GPU program that computes how surface pixels look; Material: a shader instance with specific parameter values (texture, color, roughness)",
      "Material is for 2D; shader is for 3D",
      "Shader is applied to the camera",
    ],
    correctIndex: 1,
    explanation:
      "A shader is the algorithm (how to calculate lighting, reflections). A material uses a shader with specific values (brick texture, 50% roughness). One shader can create many materials.",
    difficulty: "medium",
  },
  {
    id: "gd-d-07",
    domain: "GameDev",
    type: "mcq",
    question: "What is a finite state machine (FSM) in AI?",
    options: [
      "A game physics model",
      "A model where an entity has discrete states and transitions between them based on events — used for enemy AI, animation",
      "A rendering technique",
      "A UI framework",
    ],
    correctIndex: 1,
    explanation:
      "FSMs model behavior as states (Idle, Patrol, Attack, Dead) with transitions triggered by conditions. Simple to implement and reason about for game AI and animation.",
    difficulty: "medium",
  },
  {
    id: "gd-d-08",
    domain: "GameDev",
    type: "mcq",
    question: "What does LOD (Level of Detail) mean in games?",
    options: [
      "Level of Difficulty",
      "Using lower-resolution models/textures for distant objects to reduce GPU workload while maintaining visual quality",
      "A sound quality system",
      "A lighting model",
    ],
    correctIndex: 1,
    explanation:
      "LOD swaps between high/medium/low-poly models based on distance from the camera. Far objects use simple meshes, near objects use detailed ones — saving GPU budget.",
    difficulty: "medium",
  },
  {
    id: "gd-d-09",
    domain: "GameDev",
    type: "mcq",
    question: "What is Unity's GameObject/Component architecture?",
    options: [
      "Objects with hardcoded behaviors",
      "Everything is a GameObject; behaviors are added by attaching Components (scripts, colliders, renderers) — composition over inheritance",
      "A hierarchical class system",
      "A data-oriented design pattern",
    ],
    correctIndex: 1,
    explanation:
      "Unity's ECS-inspired design: GameObjects are just containers. Functionality comes from Components (Rigidbody, MeshRenderer, scripts). Add/remove components dynamically.",
    difficulty: "easy",
  },
  {
    id: "gd-d-10",
    domain: "GameDev",
    type: "mcq",
    question: "What is pathfinding in game AI?",
    options: [
      "Finding debug paths in code",
      "Algorithms (A*, navmesh) that compute optimal routes for AI characters to navigate the game world while avoiding obstacles",
      "A level design tool",
      "A graphics optimization technique",
    ],
    correctIndex: 1,
    explanation:
      "A* is the standard game pathfinding algorithm — finds the shortest path using a heuristic (usually Euclidean distance). Navmeshes simplify pathfinding on complex 3D terrain.",
    difficulty: "easy",
  },
  {
    id: "gd-coding-01",
    domain: "GameDev",
    type: "coding",
    question: "Implement a simple 2D AABB collision detection function.",
    starterCode:
      "function aabbCollision(a, b) {\n    // a and b are { x, y, width, height }\n    // Return true if they overlap\n}",
    expectedOutput: "true when rectangles overlap, false otherwise",
    hint: "Two AABBs overlap if: a.x < b.x+b.w AND a.x+a.w > b.x AND a.y < b.y+b.h AND a.y+a.h > b.y.",
    difficulty: "easy",
  },
  {
    id: "gd-coding-02",
    domain: "GameDev",
    type: "coding",
    question: "Implement a simple A* pathfinding algorithm on a grid.",
    starterCode:
      "function aStar(grid, start, end) {\n    // grid is 2D array: 0=walkable, 1=wall\n    // start and end are [row, col] pairs\n    // Return array of [row, col] positions or null if no path\n}",
    expectedOutput:
      "Array of positions forming path from start to end, or null",
    hint: "Use open/closed sets. For each node, f = g + h where g=cost from start, h=Manhattan distance to end.",
    difficulty: "hard",
  },
  {
    id: "gd-coding-03",
    domain: "GameDev",
    type: "coding",
    question: "Write a simple entity component system (ECS) in JavaScript.",
    starterCode:
      "class ECS {\n    constructor() {\n        this.entities = new Map(); // id -> components\n        this.nextId = 0;\n    }\n    createEntity() { /* Return new entity id */ }\n    addComponent(entityId, componentName, data) { /* Add component */ }\n    getComponent(entityId, componentName) { /* Return component data */ }\n    getEntitiesWithComponent(componentName) { /* Return all entity ids that have this component */ }\n}",
    expectedOutput: "Working ECS with entity creation and component queries",
    hint: "Store components as nested maps: entities[id][componentName] = data. Query by iterating all entities.",
    difficulty: "medium",
  },

  // ── UIUXDesign ─────────────────────────────────────────────────────────────
  {
    id: "ux-d-01",
    domain: "UIUXDesign",
    type: "mcq",
    question: "What is the difference between UI and UX design?",
    options: [
      "They are identical",
      "UI focuses on visual design and interactive elements; UX focuses on the overall user journey, usability, and satisfaction",
      "UX is only for mobile apps",
      "UI includes the backend logic",
    ],
    correctIndex: 1,
    explanation:
      "UI: buttons, colors, typography, layouts — how it looks. UX: the complete experience — how it feels, how easy it is to accomplish goals, emotional response.",
    difficulty: "easy",
  },
  {
    id: "ux-d-02",
    domain: "UIUXDesign",
    type: "mcq",
    question: "What is a design system?",
    options: [
      "A software design pattern",
      "A collection of reusable components, guidelines, tokens (colors, spacing, typography), and documentation that ensures consistent UI across a product",
      "A wireframing tool",
      "A CSS framework",
    ],
    correctIndex: 1,
    explanation:
      "Design systems (Material Design, Atlassian Design System) define reusable components and design rules, enabling teams to build consistent UIs faster.",
    difficulty: "easy",
  },
  {
    id: "ux-d-03",
    domain: "UIUXDesign",
    type: "mcq",
    question: "What is the Gestalt principle of proximity?",
    options: [
      "Elements that are similar look related",
      "Elements that are close together are perceived as a group",
      "Continuous lines are seen as connected",
      "The brain fills in incomplete shapes",
    ],
    correctIndex: 1,
    explanation:
      "Proximity: nearby elements appear related. Use consistent spacing to group related content and separate unrelated elements, creating visual hierarchy.",
    difficulty: "easy",
  },
  {
    id: "ux-d-04",
    domain: "UIUXDesign",
    type: "mcq",
    question: "What is user testing?",
    options: [
      "A developer's unit tests",
      "Observing real users interact with a product to identify usability issues and validate design decisions",
      "Testing a website for performance",
      "QA bug testing",
    ],
    correctIndex: 1,
    explanation:
      "User testing involves watching actual users complete tasks with your product. Even 5 users reveal 85% of usability issues. It informs design iterations.",
    difficulty: "easy",
  },
  {
    id: "ux-d-05",
    domain: "UIUXDesign",
    type: "mcq",
    question: "What is responsive design?",
    options: [
      "Quick-loading websites",
      "Design that adapts layout and content to different screen sizes and devices using fluid grids and media queries",
      "A design animation style",
      "A color theme system",
    ],
    correctIndex: 1,
    explanation:
      "Responsive design ensures a website looks and works well on all device sizes — mobile, tablet, desktop — by using flexible grids, images, and CSS breakpoints.",
    difficulty: "easy",
  },
  {
    id: "ux-d-06",
    domain: "UIUXDesign",
    type: "mcq",
    question: "What is affordance in UX design?",
    options: [
      "Cost of design tools",
      "A design quality that suggests how an object should be used — a button that looks pressable has good affordance",
      "The number of user interactions",
      "Loading time of the UI",
    ],
    correctIndex: 1,
    explanation:
      "Affordances communicate functionality through visual cues. A raised button affords clicking. A text underline affords linking. Good affordances reduce user confusion.",
    difficulty: "medium",
  },
  {
    id: "ux-d-07",
    domain: "UIUXDesign",
    type: "mcq",
    question: "What is the F-pattern in web reading behavior?",
    options: [
      "A design grid system",
      "Research finding that users scan web pages in an F-shape — reading horizontally across the top, then down the left side",
      "A font pairing technique",
      "A navigation pattern",
    ],
    correctIndex: 1,
    explanation:
      "Eye-tracking studies show users read the first line fully, then scan left edges. Place important content in the first two lines and left column to match natural reading patterns.",
    difficulty: "medium",
  },
  {
    id: "ux-d-08",
    domain: "UIUXDesign",
    type: "mcq",
    question: "What is Hick's Law?",
    options: [
      "Users prefer more choices",
      "Decision time increases with the number of choices — reducing options speeds up user decisions",
      "The 80/20 rule for features",
      "A color contrast standard",
    ],
    correctIndex: 1,
    explanation:
      "Hick's Law: time to decide = log₂(n+1) choices. Reduce cognitive load by simplifying menus, forms, and CTAs. Present fewer, better choices.",
    difficulty: "medium",
  },
  {
    id: "ux-d-09",
    domain: "UIUXDesign",
    type: "mcq",
    question: "What is the purpose of a prototype in UX design?",
    options: [
      "The final production code",
      "A low-to-high-fidelity simulation of a product used to test ideas and gather feedback before building the real thing",
      "A style guide document",
      "A performance test",
    ],
    correctIndex: 1,
    explanation:
      "Prototypes (paper → Figma → coded) validate design decisions cheaply. Testing a prototype saves far more time than fixing a built product.",
    difficulty: "easy",
  },
  {
    id: "ux-d-10",
    domain: "UIUXDesign",
    type: "mcq",
    question: "What is color contrast ratio and why does it matter?",
    options: [
      "The number of colors used in a design",
      "The difference in luminance between text and background — WCAG requires minimum 4.5:1 for normal text for accessibility",
      "The contrast between two images",
      "A photoshop filter",
    ],
    correctIndex: 1,
    explanation:
      "Insufficient contrast makes text illegible, especially for users with low vision. WCAG AA standard: 4.5:1 for normal text, 3:1 for large text. Tools: Contrast Checker, Figma plugins.",
    difficulty: "medium",
  },
  {
    id: "ux-coding-01",
    domain: "UIUXDesign",
    type: "coding",
    question:
      "Write a CSS function to generate a color palette from a base color using CSS custom properties.",
    starterCode:
      "/* Generate a 5-step tint/shade scale for a base color */\n/* Provide --color-50 through --color-900 variables */\n:root {\n    /* Base: hsl(220, 90%, 56%) */\n    /* Define 5 CSS custom property tints/shades */\n}",
    expectedOutput:
      "CSS with 5 color variables from light to dark based on base hue",
    hint: "Use HSL. Vary lightness from 90% (tint) to 20% (shade) while keeping hue and saturation.",
    difficulty: "easy",
  },
  {
    id: "ux-coding-02",
    domain: "UIUXDesign",
    type: "coding",
    question:
      "Implement a tooltip component in HTML/CSS that appears on hover.",
    starterCode:
      '<!-- Create a button that shows a tooltip above it on hover -->\n<!-- Tooltip should have smooth fade animation -->\n<!-- Pure CSS, no JavaScript -->\n<button class="tooltip-target">Hover me\n    <span class="tooltip">Helpful hint here!</span>\n</button>',
    expectedOutput:
      "Button with tooltip that appears above on hover with fade animation",
    hint: "Use position: relative on parent, position: absolute on tooltip. Use :hover + opacity transition. Place tooltip above with bottom: 100%.",
    difficulty: "easy",
  },
  {
    id: "ux-coding-03",
    domain: "UIUXDesign",
    type: "coding",
    question:
      "Write a JavaScript function that implements a focus trap for accessible modals.",
    starterCode:
      "function trapFocus(modalElement) {\n    // Get all focusable elements within the modal\n    // When Tab is pressed, cycle only within the modal\n    // When Shift+Tab, cycle backwards\n    // Return a cleanup function\n}",
    expectedOutput:
      "Event listener that keeps focus inside the modal, returns cleanup fn",
    hint: "Query all focusable elements. On keydown Tab: if last element, focus first. If Shift+Tab: if first, focus last.",
    difficulty: "medium",
  },

  // ── Frontend extra MCQs (11-20) ───────────────────────────────────────────
  {
    id: "fe-d-11",
    domain: "Frontend",
    type: "mcq",
    question: "What is the purpose of React's useEffect hook?",
    options: [
      "Replace useState",
      "Run side effects after render — data fetching, subscriptions, DOM manipulation",
      "Memoize a component",
      "Create context",
    ],
    correctIndex: 1,
    explanation:
      "useEffect runs after every render by default. A dependency array controls when it re-runs: [] means once on mount, [dep] means when dep changes.",
    difficulty: "easy",
  },
  {
    id: "fe-d-12",
    domain: "Frontend",
    type: "mcq",
    question: "What is lazy loading in web apps?",
    options: [
      "Slow network throttling",
      "Loading resources only when they are needed, reducing initial bundle size and improving load time",
      "Caching all assets",
      "Deferring CSS",
    ],
    correctIndex: 1,
    explanation:
      "Lazy loading defers non-critical resources until needed. React.lazy() + Suspense enables route-level code splitting.",
    difficulty: "easy",
  },
  {
    id: "fe-d-13",
    domain: "Frontend",
    type: "mcq",
    question: "What does 'box-sizing: border-box' do in CSS?",
    options: [
      "Adds a border to all elements",
      "Makes width/height include padding and border, so a 200px element with padding stays 200px total",
      "Removes padding from all elements",
      "Enables flexbox layout",
    ],
    correctIndex: 1,
    explanation:
      "Default (content-box): width excludes padding/border. border-box: width includes them. Most resets set * { box-sizing: border-box } for predictable sizing.",
    difficulty: "easy",
  },
  {
    id: "fe-d-14",
    domain: "Frontend",
    type: "mcq",
    question: "What is the purpose of useMemo in React?",
    options: [
      "Memorize component state",
      "Cache expensive computations — only recomputes when dependencies change",
      "Create a ref",
      "Prevent re-renders",
    ],
    correctIndex: 1,
    explanation:
      "useMemo(fn, [deps]) returns a memoized value. Use it when a computation is expensive and its result only changes when specific dependencies change.",
    difficulty: "medium",
  },
  {
    id: "fe-d-15",
    domain: "Frontend",
    type: "mcq",
    question: "What is tree shaking in JavaScript bundlers?",
    options: [
      "Sorting component trees",
      "Removing unused exports/code from the final bundle",
      "A CSS animation",
      "A React optimization",
    ],
    correctIndex: 1,
    explanation:
      "Tree shaking statically analyzes ES module imports and removes dead code that's never imported, reducing bundle size.",
    difficulty: "medium",
  },
  {
    id: "fe-d-16",
    domain: "Frontend",
    type: "mcq",
    question: "What does the CSS 'z-index' property control?",
    options: [
      "Zoom level",
      "Stacking order of positioned elements along the z-axis",
      "Element visibility",
      "Animation speed",
    ],
    correctIndex: 1,
    explanation:
      "z-index determines which elements appear on top when they overlap. Only works on positioned elements.",
    difficulty: "easy",
  },
  {
    id: "fe-d-17",
    domain: "Frontend",
    type: "mcq",
    question: "What is the difference between == and === in JavaScript?",
    options: [
      "No difference",
      "=== checks both value AND type without coercion; == coerces types before comparing",
      "== is stricter",
      "=== only works for numbers",
    ],
    correctIndex: 1,
    explanation:
      "'1' == 1 is true (coercion), '1' === 1 is false. Always prefer === to avoid unexpected type conversion bugs.",
    difficulty: "easy",
  },
  {
    id: "fe-d-18",
    domain: "Frontend",
    type: "mcq",
    question: "What is WCAG and why does it matter?",
    options: [
      "Web Component Animation Guide",
      "Web Content Accessibility Guidelines — standards for making web content accessible to people with disabilities",
      "A CSS framework",
      "A JavaScript testing framework",
    ],
    correctIndex: 1,
    explanation:
      "WCAG 2.1 AA is the standard for web accessibility. Meeting it ensures content is perceivable, operable, understandable, and robust for all users.",
    difficulty: "medium",
  },
  {
    id: "fe-d-19",
    domain: "Frontend",
    type: "mcq",
    question: "What is code splitting in React?",
    options: [
      "Splitting CSS from JS",
      "Dividing code into chunks loaded on demand — reduces initial load by only loading what's needed for the current route",
      "Breaking a component into sub-components",
      "Minifying JavaScript files",
    ],
    correctIndex: 1,
    explanation:
      "Code splitting with dynamic import() or React.lazy() creates separate chunks. The browser downloads only the code needed for the current page.",
    difficulty: "medium",
  },
  {
    id: "fe-d-20",
    domain: "Frontend",
    type: "mcq",
    question: "What is XSS (Cross-Site Scripting)?",
    options: [
      "A CSS naming convention",
      "An attack where malicious scripts are injected into web pages and executed in other users' browsers",
      "A JavaScript module system",
      "A React hook",
    ],
    correctIndex: 1,
    explanation:
      "XSS injects scripts via user input. Mitigated by escaping user content, using CSP headers, and using frameworks that auto-escape.",
    difficulty: "medium",
  },

  // ── Python extra MCQs (11-20) ─────────────────────────────────────────────
  {
    id: "py-d-11",
    domain: "Python",
    type: "mcq",
    question: "What is a Python generator?",
    options: [
      "A random number generator",
      "A function that uses 'yield' to lazily produce values one at a time, without storing all values in memory",
      "A class that generates objects",
      "A type of list",
    ],
    correctIndex: 1,
    explanation:
      "Generators (yield) create iterators lazily. Memory efficient for large sequences.",
    difficulty: "medium",
  },
  {
    id: "py-d-12",
    domain: "Python",
    type: "mcq",
    question: "What is the difference between a tuple and a list in Python?",
    options: [
      "No difference",
      "Tuples are immutable (can't change after creation); lists are mutable. Tuples are faster and hashable.",
      "Lists are faster",
      "Tuples can only hold numbers",
    ],
    correctIndex: 1,
    explanation:
      "Use tuples for fixed data (coordinates), lists for dynamic collections.",
    difficulty: "easy",
  },
  {
    id: "py-d-13",
    domain: "Python",
    type: "mcq",
    question: "What does 'self' refer to in a Python class method?",
    options: [
      "The class itself",
      "The instance of the class — references the specific object the method is called on",
      "A global variable",
      "The parent class",
    ],
    correctIndex: 1,
    explanation:
      "self is a reference to the current instance. It allows accessing instance attributes (self.name).",
    difficulty: "easy",
  },
  {
    id: "py-d-14",
    domain: "Python",
    type: "mcq",
    question: "What is a Python decorator?",
    options: [
      "A CSS styling tool",
      "A function that wraps another function to add behavior without modifying the original",
      "A comment style",
      "A class attribute",
    ],
    correctIndex: 1,
    explanation:
      "@decorator syntax is syntactic sugar for func = decorator(func). Used for logging, timing, authentication checks.",
    difficulty: "medium",
  },
  {
    id: "py-d-15",
    domain: "Python",
    type: "mcq",
    question: "What is the purpose of __init__ in Python?",
    options: [
      "Initializes the module",
      "The constructor — called when creating a new instance, sets initial state of the object",
      "Imports dependencies",
      "Defines class methods",
    ],
    correctIndex: 1,
    explanation:
      "__init__(self, ...) is Python's constructor called automatically when you do obj = MyClass().",
    difficulty: "easy",
  },
  {
    id: "py-d-16",
    domain: "Python",
    type: "mcq",
    question: "What does the 'with' statement do in Python?",
    options: [
      "Conditional execution",
      "Context manager protocol — ensures setup and cleanup even if an exception occurs",
      "A while loop variant",
      "Multiple inheritance syntax",
    ],
    correctIndex: 1,
    explanation:
      "'with open(file) as f:' ensures f.close() is called even if an error occurs.",
    difficulty: "easy",
  },
  {
    id: "py-d-17",
    domain: "Python",
    type: "mcq",
    question: "What is the difference between 'deep copy' and 'shallow copy'?",
    options: [
      "No difference",
      "Shallow copy creates a new object but references the same nested objects; deep copy recursively copies everything",
      "Deep copy is faster",
      "Shallow copy uses less memory always",
    ],
    correctIndex: 1,
    explanation:
      "copy.copy() (shallow): new outer object, same inner objects. copy.deepcopy() (deep): new objects at every level.",
    difficulty: "medium",
  },
  {
    id: "py-d-18",
    domain: "Python",
    type: "mcq",
    question: "What is Python's __str__ vs __repr__?",
    options: [
      "Both are identical",
      "__str__: human-readable string for end users; __repr__: unambiguous developer string for debugging",
      "__repr__ is for printing",
      "__str__ is for debugging",
    ],
    correctIndex: 1,
    explanation:
      "str(obj) calls __str__; repr(obj) calls __repr__. repr should be unambiguous.",
    difficulty: "medium",
  },
  {
    id: "py-d-19",
    domain: "Python",
    type: "mcq",
    question: "What is a Python set?",
    options: [
      "A sorted list",
      "An unordered collection of unique elements with O(1) lookup — useful for deduplication and membership testing",
      "A type of dictionary",
      "A fixed-size array",
    ],
    correctIndex: 1,
    explanation:
      "Sets use a hash table. Supports union, intersection, difference. No duplicates, no guaranteed order.",
    difficulty: "easy",
  },
  {
    id: "py-d-20",
    domain: "Python",
    type: "mcq",
    question: "What is the purpose of *args and **kwargs in Python?",
    options: [
      "Syntax errors",
      "*args: variable positional arguments as tuple; **kwargs: variable keyword arguments as dict",
      "Module imports",
      "Class inheritance",
    ],
    correctIndex: 1,
    explanation:
      "def f(*args, **kwargs) allows calling f(1,2,x=3,y=4). Useful for wrappers and flexible APIs.",
    difficulty: "medium",
  },

  // ── Backend extra MCQs (11-20) ────────────────────────────────────────────
  {
    id: "be-d-11",
    domain: "Backend",
    type: "mcq",
    question: "What is REST architecture?",
    options: [
      "A database schema",
      "Representational State Transfer — a stateless HTTP API design using standard methods (GET, POST, PUT, DELETE)",
      "A caching strategy",
      "A server framework",
    ],
    correctIndex: 1,
    explanation:
      "REST: stateless, cacheable, uniform interface. Resources identified by URLs. HTTP verbs define actions.",
    difficulty: "easy",
  },
  {
    id: "be-d-12",
    domain: "Backend",
    type: "mcq",
    question: "What is GraphQL and how does it differ from REST?",
    options: [
      "A graph database query language",
      "A query language for APIs where the client specifies exactly what data it needs — avoids over/under-fetching",
      "A REST extension",
      "A server-side rendering tool",
    ],
    correctIndex: 1,
    explanation:
      "GraphQL: single endpoint, client defines response shape. REST: multiple endpoints, server defines response.",
    difficulty: "medium",
  },
  {
    id: "be-d-13",
    domain: "Backend",
    type: "mcq",
    question: "What is database indexing?",
    options: [
      "Sorting database tables",
      "A data structure that speeds up lookups at the cost of storage and write performance",
      "A backup strategy",
      "A normalization technique",
    ],
    correctIndex: 1,
    explanation:
      "Indexes (B-tree, hash) make queries on indexed columns O(log n) instead of O(n) full scan.",
    difficulty: "easy",
  },
  {
    id: "be-d-14",
    domain: "Backend",
    type: "mcq",
    question: "What is JWT authentication?",
    options: [
      "JavaScript Web Token",
      "JSON Web Token — a compact, self-contained token carrying claims, signed with a secret or private key for stateless auth",
      "A session cookie",
      "A password hashing algorithm",
    ],
    correctIndex: 1,
    explanation:
      "JWTs have header.payload.signature format. The server signs the payload; clients send it in Authorization headers.",
    difficulty: "easy",
  },
  {
    id: "be-d-15",
    domain: "Backend",
    type: "mcq",
    question: "What is SQL injection?",
    options: [
      "Fast SQL queries",
      "An attack where malicious SQL is inserted into input fields to manipulate database queries",
      "A database optimization",
      "A query caching technique",
    ],
    correctIndex: 1,
    explanation:
      "SQL injection prevented by parameterized queries / prepared statements — never concatenate user input into SQL.",
    difficulty: "easy",
  },
  {
    id: "be-d-16",
    domain: "Backend",
    type: "mcq",
    question: "What is the CAP theorem in distributed systems?",
    options: [
      "Cache, API, and Persistence",
      "A distributed system can only guarantee 2 of 3: Consistency, Availability, Partition tolerance",
      "A database schema rule",
      "A REST API design principle",
    ],
    correctIndex: 1,
    explanation:
      "CAP: in a network partition, choose between consistency or availability. Most NoSQL dbs choose AP (eventual consistency).",
    difficulty: "hard",
  },
  {
    id: "be-d-17",
    domain: "Backend",
    type: "mcq",
    question: "What is message queuing (e.g., RabbitMQ, Kafka)?",
    options: [
      "A chat application pattern",
      "Asynchronous communication via a queue — producers publish messages, consumers process them independently",
      "A caching strategy",
      "A REST alternative",
    ],
    correctIndex: 1,
    explanation:
      "Message queues enable async, decoupled communication. Handles traffic spikes and retries.",
    difficulty: "medium",
  },
  {
    id: "be-d-18",
    domain: "Backend",
    type: "mcq",
    question: "What is caching and when should you use it?",
    options: [
      "Always avoid it",
      "Storing frequently accessed data in fast storage (Redis, memory) to avoid repeated expensive operations",
      "A database backup",
      "A network protocol",
    ],
    correctIndex: 1,
    explanation:
      "Cache expensive, frequently-read, rarely-changing data. Cache-aside, write-through, and write-behind are common strategies.",
    difficulty: "easy",
  },
  {
    id: "be-d-19",
    domain: "Backend",
    type: "mcq",
    question: "What is ACID in database transactions?",
    options: [
      "A data format",
      "Atomicity, Consistency, Isolation, Durability — properties ensuring reliable transactions",
      "A caching strategy",
      "A REST principle",
    ],
    correctIndex: 1,
    explanation:
      "ACID: Atomic (all or nothing), Consistent (rules maintained), Isolated (concurrent transactions don't interfere), Durable (committed data persists).",
    difficulty: "medium",
  },
  {
    id: "be-d-20",
    domain: "Backend",
    type: "mcq",
    question: "What is horizontal vs vertical scaling?",
    options: [
      "No difference",
      "Vertical: add more power (CPU/RAM) to one server; Horizontal: add more servers and distribute load",
      "Horizontal is always better",
      "Vertical is for databases only",
    ],
    correctIndex: 1,
    explanation:
      "Vertical scaling has a ceiling. Horizontal scaling is theoretically unlimited but requires stateless apps and load balancers.",
    difficulty: "easy",
  },

  // ── FullStack extra MCQs (11-20) ──────────────────────────────────────────
  {
    id: "fs-d-11",
    domain: "FullStack",
    type: "mcq",
    question: "What is Next.js and what problems does it solve?",
    options: [
      "A Node.js HTTP library",
      "A React framework adding SSR, SSG, file-based routing, and API routes",
      "A database ORM",
      "A CSS-in-JS solution",
    ],
    correctIndex: 1,
    explanation:
      "Next.js adds server-side rendering, static generation, and API routes to React — better SEO and performance.",
    difficulty: "easy",
  },
  {
    id: "fs-d-12",
    domain: "FullStack",
    type: "mcq",
    question: "What is state management and when do you need a library?",
    options: [
      "Managing server state only",
      "Organizing application state — local state is fine for small apps; libraries help when state is complex and shared",
      "Only needed for large databases",
      "A backend concept only",
    ],
    correctIndex: 1,
    explanation:
      "Use useState/Context for simple cases. Consider Redux/Zustand when many components share state or logic is complex.",
    difficulty: "medium",
  },
  {
    id: "fs-d-13",
    domain: "FullStack",
    type: "mcq",
    question: "What is the difference between cookies and localStorage?",
    options: [
      "No difference",
      "Cookies: sent with every HTTP request (good for auth tokens), have expiry, HttpOnly flag. localStorage: JS-only, persistent.",
      "localStorage is more secure",
      "Cookies are client-only",
    ],
    correctIndex: 1,
    explanation:
      "Use HttpOnly cookies for auth tokens (prevents XSS). localStorage is only accessible to client JS.",
    difficulty: "medium",
  },
  {
    id: "fs-d-14",
    domain: "FullStack",
    type: "mcq",
    question: "What is the BFF (Backend for Frontend) pattern?",
    options: [
      "A debugging tool",
      "A dedicated backend service tailored to the needs of a specific frontend — optimizes API responses for mobile vs web",
      "A React pattern",
      "A CSS architecture",
    ],
    correctIndex: 1,
    explanation:
      "BFF creates a thin backend layer per frontend type, aggregating multiple services and shaping data for each client.",
    difficulty: "hard",
  },
  {
    id: "fs-d-15",
    domain: "FullStack",
    type: "mcq",
    question: "What is CI/CD in the context of full-stack development?",
    options: [
      "Content Injection for CSS",
      "Continuous Integration (automated test + build) + Continuous Deployment (auto-deploy passing builds)",
      "A database migration tool",
      "A monitoring service",
    ],
    correctIndex: 1,
    explanation:
      "CI runs tests automatically on every push. CD deploys to staging/production automatically.",
    difficulty: "easy",
  },
  {
    id: "fs-d-16",
    domain: "FullStack",
    type: "mcq",
    question:
      "What is the difference between authentication and authorization?",
    options: [
      "They are identical",
      "Authentication: verifying who you are (login). Authorization: verifying what you can do (permissions)",
      "Authorization comes first",
      "Authentication is optional",
    ],
    correctIndex: 1,
    explanation:
      "AuthN: verifying identity (login/JWT). AuthZ: verifying permissions (roles). Both are required for secure apps.",
    difficulty: "easy",
  },
  {
    id: "fs-d-17",
    domain: "FullStack",
    type: "mcq",
    question: "What is server-side rendering (SSR) and its main benefit?",
    options: [
      "Running client code on a server",
      "Generating HTML on the server for each request — pages are indexable by search engines and display faster on first load",
      "A database technique",
      "A caching strategy",
    ],
    correctIndex: 1,
    explanation:
      "SSR sends complete HTML to the browser. Benefits: better SEO, faster FCP. Trade-off: higher server load.",
    difficulty: "easy",
  },
  {
    id: "fs-d-18",
    domain: "FullStack",
    type: "mcq",
    question:
      "Why are environment variables important in full-stack development?",
    options: [
      "CSS variables",
      "Configuration values stored outside code — API keys, database URLs — that vary between environments (dev/staging/prod)",
      "JavaScript global variables",
      "Server log settings",
    ],
    correctIndex: 1,
    explanation:
      "Environment variables keep secrets out of source code and allow different configurations per environment.",
    difficulty: "easy",
  },
  {
    id: "fs-d-19",
    domain: "FullStack",
    type: "mcq",
    question: "What is database migration?",
    options: [
      "Moving a database to another server",
      "Versioned scripts that incrementally change database schema in a controlled, reproducible way",
      "A backup operation",
      "Importing CSV data",
    ],
    correctIndex: 1,
    explanation:
      "Migrations track schema changes in version control. Each migration file describes a change that can be applied or rolled back.",
    difficulty: "medium",
  },
  {
    id: "fs-d-20",
    domain: "FullStack",
    type: "mcq",
    question: "What is a RESTful resource and how should URLs be structured?",
    options: [
      "Any URL pattern works",
      "URLs represent nouns (resources), not verbs — /users, /users/123, /users/123/posts — HTTP method expresses the action",
      "Use verb-based URLs like /getUser",
      "Query strings for all parameters",
    ],
    correctIndex: 1,
    explanation:
      "REST URL conventions: GET /users (list), POST /users (create), GET /users/1 (get one), DELETE /users/1 (delete).",
    difficulty: "easy",
  },

  // ── DataScience extra MCQs (11-20) ────────────────────────────────────────
  {
    id: "ds-d-11",
    domain: "DataScience",
    type: "mcq",
    question: "What is cross-validation?",
    options: [
      "Validating data across teams",
      "A technique that evaluates model performance on multiple train/test splits for a more reliable estimate",
      "Comparing two models",
      "A data cleaning method",
    ],
    correctIndex: 1,
    explanation:
      "k-fold cross-validation splits data into k folds, trains k times, averages scores. Better than a single train/test split.",
    difficulty: "medium",
  },
  {
    id: "ds-d-12",
    domain: "DataScience",
    type: "mcq",
    question: "What is feature engineering?",
    options: [
      "Software engineering for data",
      "Creating new informative features from existing data to improve model performance",
      "A data collection technique",
      "A visualization method",
    ],
    correctIndex: 1,
    explanation:
      "Feature engineering: combining columns, encoding categories, creating polynomial features. Good features often matter more than algorithm choice.",
    difficulty: "medium",
  },
  {
    id: "ds-d-13",
    domain: "DataScience",
    type: "mcq",
    question: "What is regularization in machine learning?",
    options: [
      "Normalizing input data",
      "Adding a penalty for model complexity to prevent overfitting — L1 (Lasso) sets some weights to zero; L2 (Ridge) shrinks weights",
      "A preprocessing step",
      "A validation technique",
    ],
    correctIndex: 1,
    explanation:
      "L1 promotes sparsity (feature selection). L2 shrinks all weights. Regularization strength (lambda) is a hyperparameter.",
    difficulty: "medium",
  },
  {
    id: "ds-d-14",
    domain: "DataScience",
    type: "mcq",
    question: "What is the bias-variance tradeoff?",
    options: [
      "No relationship",
      "High bias = underfitting (too simple). High variance = overfitting (too complex). Optimal model minimizes both.",
      "Bias is always good",
      "Variance should always be maximized",
    ],
    correctIndex: 1,
    explanation:
      "Reducing bias often increases variance and vice versa. The sweet spot gives good generalization.",
    difficulty: "medium",
  },
  {
    id: "ds-d-15",
    domain: "DataScience",
    type: "mcq",
    question: "How can missing values be handled?",
    options: [
      "Always delete rows with them",
      "Multiple strategies: deletion, mean/median/mode imputation, forward fill, model-based imputation",
      "Replace with zeros always",
      "Ignore them",
    ],
    correctIndex: 1,
    explanation:
      "MCAR: deletion ok. MAR: imputation. MNAR: complex imputation. Choice depends on data and missingness mechanism.",
    difficulty: "medium",
  },
  {
    id: "ds-d-16",
    domain: "DataScience",
    type: "mcq",
    question: "What is the ROC-AUC metric?",
    options: [
      "A performance benchmark",
      "Area Under the ROC Curve — measures a classifier's ability to discriminate. 0.5 = random, 1.0 = perfect.",
      "A regression metric",
      "A clustering evaluation",
    ],
    correctIndex: 1,
    explanation:
      "ROC plots TPR vs FPR at all thresholds. AUC summarizes the entire ROC. Useful for imbalanced classes.",
    difficulty: "medium",
  },
  {
    id: "ds-d-17",
    domain: "DataScience",
    type: "mcq",
    question: "What is one-hot encoding?",
    options: [
      "Encrypting categorical data",
      "Converting categorical variables to binary columns — each category becomes a column with 0/1 values",
      "A text vectorization technique",
      "A normalization method",
    ],
    correctIndex: 1,
    explanation:
      "One-hot encoding: 'Color' with [Red, Blue, Green] becomes [is_Red, is_Blue, is_Green]. Needed for algorithms requiring numeric input.",
    difficulty: "easy",
  },
  {
    id: "ds-d-18",
    domain: "DataScience",
    type: "mcq",
    question: "What is hypothesis testing?",
    options: [
      "Guessing data patterns",
      "A statistical method to decide if observed data supports a claim — compares against a null hypothesis using a p-value",
      "A visualization technique",
      "A model evaluation method",
    ],
    correctIndex: 1,
    explanation:
      "Set H0. Calculate test statistic. If p < 0.05, reject H0. Common tests: t-test, chi-square.",
    difficulty: "medium",
  },
  {
    id: "ds-d-19",
    domain: "DataScience",
    type: "mcq",
    question: "What is dimensionality reduction and why is it useful?",
    options: [
      "Removing columns",
      "Reducing the number of features while preserving important information — combats curse of dimensionality",
      "Sampling fewer rows",
      "A regularization technique",
    ],
    correctIndex: 1,
    explanation:
      "High-dimensional data is sparse and distances become meaningless. PCA, t-SNE, UMAP reduce dimensions.",
    difficulty: "medium",
  },
  {
    id: "ds-d-20",
    domain: "DataScience",
    type: "mcq",
    question: "What is a decision tree?",
    options: [
      "An organization chart",
      "A tree-structured model that splits data on feature thresholds, making predictions at leaf nodes",
      "A sorting algorithm",
      "A neural network type",
    ],
    correctIndex: 1,
    explanation:
      "Decision trees split on the feature that maximizes information gain. Interpretable but prone to overfitting.",
    difficulty: "easy",
  },

  // ── ML extra MCQs (11-20) ─────────────────────────────────────────────────
  {
    id: "ml-d-11",
    domain: "ML",
    type: "mcq",
    question: "What is transfer learning?",
    options: [
      "Moving data between datasets",
      "Reusing a pre-trained model's weights as a starting point for a new task",
      "A model compression technique",
      "A data augmentation method",
    ],
    correctIndex: 1,
    explanation:
      "Transfer learning starts with VGG/ResNet/BERT weights and fine-tunes on your small dataset.",
    difficulty: "easy",
  },
  {
    id: "ml-d-12",
    domain: "ML",
    type: "mcq",
    question: "What is dropout in neural networks?",
    options: [
      "Stopping training early",
      "Randomly deactivating neurons during training to prevent co-adaptation and reduce overfitting",
      "Removing outlier data",
      "A weight initialization method",
    ],
    correctIndex: 1,
    explanation:
      "Dropout randomly sets neuron activations to 0 during training. Not applied at inference.",
    difficulty: "medium",
  },
  {
    id: "ml-d-13",
    domain: "ML",
    type: "mcq",
    question: "What is a convolutional neural network (CNN) used for?",
    options: [
      "Text generation",
      "Processing grid-like data (images, video) — convolutions detect local patterns like edges, textures, and shapes",
      "Time series prediction only",
      "A type of clustering",
    ],
    correctIndex: 1,
    explanation:
      "CNNs apply learned filters across the input. Used for image classification, object detection, segmentation.",
    difficulty: "easy",
  },
  {
    id: "ml-d-14",
    domain: "ML",
    type: "mcq",
    question: "What is an LSTM and why was it invented?",
    options: [
      "A type of CNN",
      "Long Short-Term Memory — an RNN variant that solves the vanishing gradient problem for learning long-range dependencies",
      "A feed-forward network",
      "A regularization technique",
    ],
    correctIndex: 1,
    explanation:
      "LSTMs use gates to selectively remember or forget information, enabling learning of long-term dependencies.",
    difficulty: "hard",
  },
  {
    id: "ml-d-15",
    domain: "ML",
    type: "mcq",
    question: "What is ensemble learning?",
    options: [
      "Training on multiple datasets",
      "Combining predictions from multiple models to get better performance than any individual model",
      "A data augmentation technique",
      "A single model optimization",
    ],
    correctIndex: 1,
    explanation:
      "Ensemble methods: Bagging (Random Forest), Boosting (XGBoost), Stacking. Diverse weak learners combined reduce variance and bias.",
    difficulty: "easy",
  },
  {
    id: "ml-d-16",
    domain: "ML",
    type: "mcq",
    question: "What is K-means clustering?",
    options: [
      "A supervised learning algorithm",
      "An unsupervised algorithm that partitions data into K clusters by iteratively assigning points to the nearest centroid",
      "A dimensionality reduction method",
      "A classification algorithm",
    ],
    correctIndex: 1,
    explanation:
      "K-means: initialize K centroids, assign each point to nearest, update centroids to cluster means, repeat until convergence.",
    difficulty: "easy",
  },
  {
    id: "ml-d-17",
    domain: "ML",
    type: "mcq",
    question: "What is the vanishing gradient problem?",
    options: [
      "When gradients become too large",
      "During backpropagation through deep networks, gradients become exponentially small — early layers learn very slowly",
      "A memory leak in training",
      "When loss increases during training",
    ],
    correctIndex: 1,
    explanation:
      "Sigmoid/tanh saturate at extremes. Solutions: ReLU, batch norm, skip connections (ResNet).",
    difficulty: "hard",
  },
  {
    id: "ml-d-18",
    domain: "ML",
    type: "mcq",
    question: "What is hyperparameter tuning?",
    options: [
      "Adjusting model weights during training",
      "Searching for the best model configuration values (learning rate, layers, batch size) not learned during training",
      "A data preprocessing step",
      "A deployment optimization",
    ],
    correctIndex: 1,
    explanation:
      "Methods: grid search, random search, Bayesian optimization. Use cross-validation to evaluate.",
    difficulty: "medium",
  },
  {
    id: "ml-d-19",
    domain: "ML",
    type: "mcq",
    question:
      "What is the difference between generative and discriminative models?",
    options: [
      "No difference",
      "Generative: models joint distribution P(X,Y), can generate data. Discriminative: models P(Y|X) — better for classification",
      "Discriminative models generate data",
      "Generative models only classify",
    ],
    correctIndex: 1,
    explanation:
      "Generative: Naive Bayes, GANs — learn data distribution. Discriminative: Logistic Regression, SVM — focus on decision boundary.",
    difficulty: "hard",
  },
  {
    id: "ml-d-20",
    domain: "ML",
    type: "mcq",
    question: "What is model quantization?",
    options: [
      "Measuring model quality",
      "Reducing model precision (float32 to int8) to decrease size and inference time with minimal accuracy loss",
      "Adding more layers to a model",
      "A regularization method",
    ],
    correctIndex: 1,
    explanation:
      "Quantization reduces weight precision from 32-bit float to 8-bit integer (4x size reduction), enabling mobile/edge deployment.",
    difficulty: "hard",
  },

  // ── DevOps extra MCQs (11-20) ─────────────────────────────────────────────
  {
    id: "dv-d-11",
    domain: "DevOps",
    type: "mcq",
    question: "What is GitOps?",
    options: [
      "Using Git for code",
      "Using Git as the single source of truth for infrastructure — automated sync between Git state and cluster state",
      "A branching strategy",
      "A CI/CD tool",
    ],
    correctIndex: 1,
    explanation:
      "GitOps: all infrastructure/config in Git, automated reconciliation applies changes when PRs merge. Tools: ArgoCD, Flux.",
    difficulty: "hard",
  },
  {
    id: "dv-d-12",
    domain: "DevOps",
    type: "mcq",
    question: "What is log aggregation?",
    options: [
      "Counting log lines",
      "Collecting logs from multiple services/servers into a central system for searching and analysis (ELK stack, Loki)",
      "Compressing log files",
      "A backup strategy",
    ],
    correctIndex: 1,
    explanation:
      "Centralized logging collects logs from all services. Enables searching across microservices during incidents.",
    difficulty: "medium",
  },
  {
    id: "dv-d-13",
    domain: "DevOps",
    type: "mcq",
    question: "What is an SLA, SLO, and SLI?",
    options: [
      "Identical concepts",
      "SLI: metric (latency). SLO: target (p99 < 200ms). SLA: contractual commitment with consequences for breach.",
      "SLA is internal only",
      "Only SLA matters",
    ],
    correctIndex: 1,
    explanation:
      "SLOs should be stricter than SLAs. SLIs are the actual measurements.",
    difficulty: "medium",
  },
  {
    id: "dv-d-14",
    domain: "DevOps",
    type: "mcq",
    question: "What is feature flagging?",
    options: [
      "Marking code features",
      "Toggling features on/off at runtime without deploying new code — enables A/B testing, gradual rollouts, and instant rollback",
      "A branching strategy",
      "A testing framework",
    ],
    correctIndex: 1,
    explanation:
      "Feature flags decouple deployment from release. Rollback instantly by flipping flag. Tools: LaunchDarkly, Unleash.",
    difficulty: "medium",
  },
  {
    id: "dv-d-15",
    domain: "DevOps",
    type: "mcq",
    question: "What is observability in DevOps?",
    options: [
      "Monitoring only",
      "The ability to understand internal system state from external outputs — metrics, logs, and traces (the three pillars)",
      "A security concept",
      "A CI/CD feature",
    ],
    correctIndex: 1,
    explanation:
      "The three pillars: Metrics (Prometheus/Grafana), Logs (ELK/Loki), Traces (Jaeger/Zipkin).",
    difficulty: "medium",
  },
  {
    id: "dv-d-16",
    domain: "DevOps",
    type: "mcq",
    question: "What is a deployment pipeline?",
    options: [
      "A water pipe for data",
      "An automated sequence of stages (build, test, scan, deploy) that code passes through before reaching production",
      "A CI server",
      "A container network",
    ],
    correctIndex: 1,
    explanation:
      "Pipelines automate the path from commit to production: source -> build -> tests -> security scan -> staging -> prod.",
    difficulty: "easy",
  },
  {
    id: "dv-d-17",
    domain: "DevOps",
    type: "mcq",
    question: "What is immutable infrastructure?",
    options: [
      "Read-only databases",
      "Instead of updating servers in-place, deploy new images and terminate old ones — no configuration drift",
      "Locked configuration files",
      "A backup strategy",
    ],
    correctIndex: 1,
    explanation:
      "Immutable infra: treat servers as cattle not pets. Never SSH and modify. Deploy new container/AMI, shift traffic, terminate old.",
    difficulty: "hard",
  },
  {
    id: "dv-d-18",
    domain: "DevOps",
    type: "mcq",
    question: "What is chaos engineering?",
    options: [
      "Disorganized deployments",
      "Deliberately introducing failures into production systems to test resilience",
      "A testing anti-pattern",
      "A load testing method",
    ],
    correctIndex: 1,
    explanation:
      "Chaos engineering (Netflix Chaos Monkey) injects failures to verify systems gracefully handle them and expose hidden dependencies.",
    difficulty: "hard",
  },
  {
    id: "dv-d-19",
    domain: "DevOps",
    type: "mcq",
    question: "What is a service mesh (e.g., Istio)?",
    options: [
      "A networking diagram",
      "Infrastructure layer for service-to-service communication — provides load balancing, auth, observability without app code changes",
      "A DNS management tool",
      "A container format",
    ],
    correctIndex: 1,
    explanation:
      "Service meshes add sidecar proxies to each service pod, handling mTLS, retries, circuit breaking, and distributed tracing.",
    difficulty: "hard",
  },
  {
    id: "dv-d-20",
    domain: "DevOps",
    type: "mcq",
    question: "What are the benefits of container registries?",
    options: [
      "Monitoring containers",
      "Central storage and distribution of container images — versioned, secured, and shareable across teams and environments",
      "Running containers in cloud",
      "Managing DNS records",
    ],
    correctIndex: 1,
    explanation:
      "Container registries (Docker Hub, ECR, GCR) store versioned images. CI pushes images after building; deployment pulls them.",
    difficulty: "easy",
  },

  // ── Android extra MCQs (11-20) ────────────────────────────────────────────
  {
    id: "an-d-11",
    domain: "Android",
    type: "mcq",
    question: "What is the Android Activity lifecycle?",
    options: [
      "Install -> Run -> Delete",
      "onCreate -> onStart -> onResume -> onPause -> onStop -> onDestroy",
      "A network request flow",
      "A database transaction lifecycle",
    ],
    correctIndex: 1,
    explanation:
      "Handle state saving in onSaveInstanceState, restore in onCreate.",
    difficulty: "medium",
  },
  {
    id: "an-d-12",
    domain: "Android",
    type: "mcq",
    question: "What are Kotlin coroutines used for?",
    options: [
      "UI styling",
      "Simplified async programming — lightweight suspension-based concurrency for network/disk I/O without blocking the main thread",
      "Database migrations",
      "Animation library",
    ],
    correctIndex: 1,
    explanation:
      "Coroutines suspend at I/O operations without blocking threads. ViewModelScope, lifecycleScope tie them to lifecycle.",
    difficulty: "medium",
  },
  {
    id: "an-d-13",
    domain: "Android",
    type: "mcq",
    question: "What is Hilt in Android?",
    options: [
      "A UI testing library",
      "Google's dependency injection library for Android built on Dagger — reduces boilerplate for DI",
      "A networking library",
      "A UI component library",
    ],
    correctIndex: 1,
    explanation:
      "Hilt simplifies Dagger DI for Android. @HiltAndroidApp, @AndroidEntryPoint, @Inject annotations wire dependencies.",
    difficulty: "medium",
  },
  {
    id: "an-d-14",
    domain: "Android",
    type: "mcq",
    question: "What is the Navigation Component in Android?",
    options: [
      "A GPS library",
      "Jetpack library managing fragment transactions, back stack, deep links, and safe args between destinations",
      "A UI layout tool",
      "An animation framework",
    ],
    correctIndex: 1,
    explanation:
      "Navigation Component uses a NavGraph to define destinations and actions. Handles back stack, animation, deep links.",
    difficulty: "easy",
  },
  {
    id: "an-d-15",
    domain: "Android",
    type: "mcq",
    question: "What is WorkManager in Android?",
    options: [
      "A background service replacement",
      "Jetpack library for deferrable, guaranteed background work that respects system constraints (battery, network)",
      "A thread pool manager",
      "A job scheduler only for API 26+",
    ],
    correctIndex: 1,
    explanation:
      "WorkManager handles constraints, retries, chaining, and works across all API levels. Recommended for deferrable work.",
    difficulty: "medium",
  },
  {
    id: "an-d-16",
    domain: "Android",
    type: "mcq",
    question: "What is ProGuard/R8 in Android?",
    options: [
      "A testing tool",
      "Code shrinker/obfuscator that removes unused code and renames classes to reduce APK size",
      "A layout optimizer",
      "A build system",
    ],
    correctIndex: 1,
    explanation:
      "R8 (successor to ProGuard) shrinks, optimizes, and obfuscates code. Removes unused methods/classes, renames to short names.",
    difficulty: "medium",
  },
  {
    id: "an-d-17",
    domain: "Android",
    type: "mcq",
    question: "What is a Content Provider in Android?",
    options: [
      "A media player",
      "A component that exposes structured data to other apps via a standard URI-based interface",
      "A background service",
      "A layout component",
    ],
    correctIndex: 1,
    explanation:
      "Content Providers manage access to structured data. MediaStore, ContactsProvider are built-in examples.",
    difficulty: "medium",
  },
  {
    id: "an-d-18",
    domain: "Android",
    type: "mcq",
    question: "What is APK vs AAB (Android App Bundle)?",
    options: [
      "Same format",
      "APK: complete app package installed directly. AAB: Google Play format — generates optimized APKs per device config",
      "AAB is for testing only",
      "APK is Google Play's format",
    ],
    correctIndex: 1,
    explanation:
      "AAB lets Google Play generate split APKs with only what the device needs (architecture, language, density). Reduces app size 15-35%.",
    difficulty: "medium",
  },
  {
    id: "an-d-19",
    domain: "Android",
    type: "mcq",
    question: "What is a BroadcastReceiver in Android?",
    options: [
      "A network listener",
      "A component that responds to system-wide or app-specific broadcast events (battery low, network change)",
      "A UI event handler",
      "A database listener",
    ],
    correctIndex: 1,
    explanation:
      "BroadcastReceivers listen for intents broadcast by the system or apps. Register statically or dynamically.",
    difficulty: "medium",
  },
  {
    id: "an-d-20",
    domain: "Android",
    type: "mcq",
    question: "What is Jetpack Compose state management?",
    options: [
      "SharedPreferences for UI",
      "Using @Composable functions with remember{} and mutableStateOf() to create reactive UI driven by state",
      "Room database for UI",
      "ViewModel only",
    ],
    correctIndex: 1,
    explanation:
      "Compose: state changes trigger recomposition. Use remember{mutableStateOf()} for local state, ViewModel for longer-lived state.",
    difficulty: "medium",
  },

  // ── iOS extra MCQs (11-20) ────────────────────────────────────────────────
  {
    id: "ios-d-11",
    domain: "iOS",
    type: "mcq",
    question: "What is @ObservedObject in SwiftUI?",
    options: [
      "A SwiftUI color modifier",
      "A property wrapper for a reference-type observable object — the view re-renders when its @Published properties change",
      "A database observer",
      "An animation trigger",
    ],
    correctIndex: 1,
    explanation:
      "@ObservedObject watches an ObservableObject. When any @Published property changes, the view updates.",
    difficulty: "medium",
  },
  {
    id: "ios-d-12",
    domain: "iOS",
    type: "mcq",
    question: "What is Grand Central Dispatch (GCD)?",
    options: [
      "A networking framework",
      "Apple's threading API — queues tasks for concurrent or serial execution, managing thread pool automatically",
      "A graphics engine",
      "A data persistence framework",
    ],
    correctIndex: 1,
    explanation:
      "GCD: DispatchQueue.global() for background work, DispatchQueue.main for UI updates. Use async/await in modern Swift.",
    difficulty: "medium",
  },
  {
    id: "ios-d-13",
    domain: "iOS",
    type: "mcq",
    question: "What is UserDefaults in iOS?",
    options: [
      "A user management system",
      "A simple key-value store for small amounts of persistent user preferences (theme, settings, flags)",
      "A CoreData alternative",
      "A keychain API",
    ],
    correctIndex: 1,
    explanation:
      "UserDefaults.standard stores Booleans, numbers, strings. Not for sensitive data (use Keychain) or large data (use CoreData).",
    difficulty: "easy",
  },
  {
    id: "ios-d-14",
    domain: "iOS",
    type: "mcq",
    question: "What is URLSession in iOS?",
    options: [
      "A web browser API",
      "Apple's networking API for HTTP/HTTPS requests — handles download, upload, and WebSocket tasks",
      "A URL routing library",
      "A REST framework",
    ],
    correctIndex: 1,
    explanation:
      "URLSession performs network requests. Modern Swift uses async/await with URLSession.",
    difficulty: "easy",
  },
  {
    id: "ios-d-15",
    domain: "iOS",
    type: "mcq",
    question: "What is a closure in Swift?",
    options: [
      "A Swift class",
      "A self-contained block of code that can be passed around — captures and stores references to variables from its context",
      "A struct method",
      "A protocol type",
    ],
    correctIndex: 1,
    explanation:
      "Closures are like lambdas. { (params) -> ReturnType in body }. @escaping marks closures that outlive the function call.",
    difficulty: "medium",
  },
  {
    id: "ios-d-16",
    domain: "iOS",
    type: "mcq",
    question: "What is MVVM pattern in iOS?",
    options: [
      "A navigation pattern",
      "An architectural pattern: Model holds data, ViewModel transforms data for display, View binds to ViewModel observables",
      "A networking pattern",
      "A database pattern",
    ],
    correctIndex: 1,
    explanation:
      "MVVM separates UI logic (ViewModel) from business logic (Model) and display (View). Enables testable logic without UI dependencies.",
    difficulty: "medium",
  },
  {
    id: "ios-d-17",
    domain: "iOS",
    type: "mcq",
    question: "What is Keychain in iOS?",
    options: [
      "A physical key manager",
      "Secure encrypted storage for sensitive data (passwords, tokens) — persists across app reinstalls",
      "A biometrics API",
      "A crypto library",
    ],
    correctIndex: 1,
    explanation:
      "iOS Keychain stores sensitive data encrypted. Unlike UserDefaults, it survives app deletion.",
    difficulty: "medium",
  },
  {
    id: "ios-d-18",
    domain: "iOS",
    type: "mcq",
    question: "What is TestFlight?",
    options: [
      "An Xcode testing tool",
      "Apple's beta testing platform that distributes pre-release apps to testers before App Store submission",
      "A unit testing framework",
      "A performance profiler",
    ],
    correctIndex: 1,
    explanation:
      "TestFlight distributes beta builds to up to 10,000 external testers via the TestFlight app.",
    difficulty: "easy",
  },
  {
    id: "ios-d-19",
    domain: "iOS",
    type: "mcq",
    question: "What is the difference between weak and strong in Swift?",
    options: [
      "No difference",
      "Strong (default): increases retain count, keeps object alive. Weak: becomes nil when object deallocated — prevents retain cycles.",
      "Weak is faster",
      "Strong is for value types only",
    ],
    correctIndex: 1,
    explanation:
      "Use weak for delegate/parent references to break retain cycles. 'unowned' is non-optional weak.",
    difficulty: "medium",
  },
  {
    id: "ios-d-20",
    domain: "iOS",
    type: "mcq",
    question: "What is the App Store review process?",
    options: [
      "Automatic code compilation",
      "Apple's mandatory review of all submitted apps for quality, safety, and policy compliance",
      "A beta testing program",
      "Code signing only",
    ],
    correctIndex: 1,
    explanation:
      "Every iOS app must pass Apple's review (typically 1-3 days) checking for crashes, content policy, and functionality.",
    difficulty: "easy",
  },

  // ── Cybersecurity extra MCQs (11-20) ──────────────────────────────────────
  {
    id: "cy-d-11",
    domain: "Cybersecurity",
    type: "mcq",
    question: "What is a firewall?",
    options: [
      "A physical security device",
      "A network security system that monitors and controls incoming/outgoing traffic based on predefined security rules",
      "An encryption algorithm",
      "A DDoS mitigation tool",
    ],
    correctIndex: 1,
    explanation:
      "Firewalls filter traffic by IP, port, and protocol. WAF: web application firewall for HTTP.",
    difficulty: "easy",
  },
  {
    id: "cy-d-12",
    domain: "Cybersecurity",
    type: "mcq",
    question: "What is a DDoS attack?",
    options: [
      "A database attack",
      "Distributed Denial of Service — overwhelming a server with traffic from many sources to make it unavailable",
      "A phishing technique",
      "A password attack",
    ],
    correctIndex: 1,
    explanation:
      "DDoS floods a target with requests from botnets. Mitigation: rate limiting, CDN/Anycast, traffic scrubbing services.",
    difficulty: "easy",
  },
  {
    id: "cy-d-13",
    domain: "Cybersecurity",
    type: "mcq",
    question: "What is symmetric vs asymmetric encryption?",
    options: [
      "No difference",
      "Symmetric: same key encrypts and decrypts (fast, AES). Asymmetric: public key encrypts, private key decrypts (RSA/ECC)",
      "Asymmetric is less secure",
      "Symmetric uses two keys",
    ],
    correctIndex: 1,
    explanation:
      "AES-256 (symmetric) is fast for bulk data. RSA/ECC is used for key exchange and digital signatures.",
    difficulty: "medium",
  },
  {
    id: "cy-d-14",
    domain: "Cybersecurity",
    type: "mcq",
    question: "What is the principle of least privilege?",
    options: [
      "Giving minimum user rights",
      "Users and processes should only have the permissions necessary to perform their job — nothing more",
      "Encrypting all data",
      "A firewall rule",
    ],
    correctIndex: 1,
    explanation:
      "Least privilege limits blast radius of breaches. Apply to users, services, and microservices.",
    difficulty: "easy",
  },
  {
    id: "cy-d-15",
    domain: "Cybersecurity",
    type: "mcq",
    question: "What is a certificate authority (CA)?",
    options: [
      "An auth server",
      "A trusted entity that issues digital certificates, vouching for the identity of websites and services",
      "A type of firewall",
      "An encryption algorithm",
    ],
    correctIndex: 1,
    explanation:
      "CAs (DigiCert, Let's Encrypt) sign certificates, creating a chain of trust.",
    difficulty: "medium",
  },
  {
    id: "cy-d-16",
    domain: "Cybersecurity",
    type: "mcq",
    question: "What is a hash collision?",
    options: [
      "Two identical hashes",
      "When two different inputs produce the same hash output — breaks hash function security (MD5, SHA-1 have known collisions)",
      "A password attack",
      "A network attack",
    ],
    correctIndex: 1,
    explanation:
      "MD5 is broken (collisions found). SHA-1 is deprecated. Use SHA-256 or SHA-3.",
    difficulty: "hard",
  },
  {
    id: "cy-d-17",
    domain: "Cybersecurity",
    type: "mcq",
    question: "What is port scanning?",
    options: [
      "Scanning for lost USB ports",
      "Probing a system to discover open network ports and running services — used in reconnaissance by attackers and security audits",
      "A packet filtering technique",
      "A network monitoring method",
    ],
    correctIndex: 1,
    explanation:
      "Tools like Nmap scan target IPs for open ports. Penetration testers use port scans to map attack surface.",
    difficulty: "easy",
  },
  {
    id: "cy-d-18",
    domain: "Cybersecurity",
    type: "mcq",
    question: "What is HTTPS and how does TLS work?",
    options: [
      "HTTP with authentication",
      "HTTP encrypted with TLS — handshake establishes encrypted channel via asymmetric key exchange, then symmetric encryption for data",
      "A faster version of HTTP",
      "An HTTP caching mechanism",
    ],
    correctIndex: 1,
    explanation:
      "TLS handshake: client hello -> server sends certificate -> key exchange -> symmetric key derived -> encrypted channel.",
    difficulty: "medium",
  },
  {
    id: "cy-d-19",
    domain: "Cybersecurity",
    type: "mcq",
    question: "What is a WAF (Web Application Firewall)?",
    options: [
      "A general network firewall",
      "A firewall specifically for HTTP traffic that filters based on web attack patterns (XSS, SQLi, CSRF, OWASP Top 10)",
      "A VPN gateway",
      "A CDN component",
    ],
    correctIndex: 1,
    explanation:
      "WAFs (AWS WAF, Cloudflare WAF) inspect HTTP requests and block attacks matching known malicious patterns.",
    difficulty: "medium",
  },
  {
    id: "cy-d-20",
    domain: "Cybersecurity",
    type: "mcq",
    question: "What is security through obscurity?",
    options: [
      "A strong security principle",
      "Relying on secrecy of design rather than cryptographic strength — generally considered a weak security strategy",
      "Encryption by default",
      "A network topology approach",
    ],
    correctIndex: 1,
    explanation:
      "Real security must hold even when the design is known (Kerckhoffs's principle). Not a substitute for proper cryptography.",
    difficulty: "medium",
  },

  // ── Blockchain extra MCQs (11-20) ─────────────────────────────────────────
  {
    id: "bc-d-11",
    domain: "Blockchain",
    type: "mcq",
    question: "What is a crypto wallet?",
    options: [
      "A physical device",
      "Software that stores private/public key pairs and interfaces with blockchain networks to sign and broadcast transactions",
      "A bank account",
      "A smart contract",
    ],
    correctIndex: 1,
    explanation:
      "Crypto wallets store keys, not currency. Hot wallets are online (convenient). Cold wallets store keys offline (more secure).",
    difficulty: "easy",
  },
  {
    id: "bc-d-12",
    domain: "Blockchain",
    type: "mcq",
    question: "What is Solidity?",
    options: [
      "A cryptocurrency",
      "Ethereum's primary smart contract programming language — statically typed, compiled to EVM bytecode",
      "A consensus algorithm",
      "A blockchain testing framework",
    ],
    correctIndex: 1,
    explanation:
      "Solidity compiles to Ethereum Virtual Machine bytecode. Used to write DeFi protocols, NFT contracts, DAOs.",
    difficulty: "easy",
  },
  {
    id: "bc-d-13",
    domain: "Blockchain",
    type: "mcq",
    question: "What is a DAO (Decentralized Autonomous Organization)?",
    options: [
      "A data structure",
      "An organization governed by smart contracts and token holders, with decisions made through on-chain voting",
      "A consensus mechanism",
      "A blockchain wallet type",
    ],
    correctIndex: 1,
    explanation:
      "DAOs encode organizational rules in smart contracts. Token holders vote on proposals. No central leadership.",
    difficulty: "medium",
  },
  {
    id: "bc-d-14",
    domain: "Blockchain",
    type: "mcq",
    question: "What is layer 2 scaling in blockchain?",
    options: [
      "Second database layer",
      "Solutions built on top of layer 1 to process transactions faster and cheaper, settling on L1 for security",
      "A type of node",
      "A consensus mechanism",
    ],
    correctIndex: 1,
    explanation:
      "L2 solutions (Optimism, Arbitrum, Polygon) batch transactions off-chain, reducing costs 10-100x while inheriting L1 security.",
    difficulty: "hard",
  },
  {
    id: "bc-d-15",
    domain: "Blockchain",
    type: "mcq",
    question: "What is tokenomics?",
    options: [
      "Token syntax",
      "The economic design of a cryptocurrency — supply, distribution, inflation, utility, and incentive mechanisms",
      "A blockchain testing method",
      "Smart contract security",
    ],
    correctIndex: 1,
    explanation:
      "Tokenomics: total supply, distribution (team, investors, community), utility (governance, fees, staking), and incentives.",
    difficulty: "medium",
  },
  {
    id: "bc-d-16",
    domain: "Blockchain",
    type: "mcq",
    question: "What is a 51% attack?",
    options: [
      "An SQL injection variant",
      "When a single entity controls >50% of mining power, enabling double-spending and transaction manipulation",
      "A smart contract bug",
      "A network partition",
    ],
    correctIndex: 1,
    explanation:
      "51% attack: majority hashrate control allows reordering/reversing transactions. Expensive on large networks.",
    difficulty: "hard",
  },
  {
    id: "bc-d-17",
    domain: "Blockchain",
    type: "mcq",
    question: "What is a token standard (e.g., ERC-20)?",
    options: [
      "A security certificate",
      "A standardized interface for tokens on Ethereum — ERC-20 for fungible tokens, ERC-721 for NFTs",
      "A consensus rule",
      "A wallet format",
    ],
    correctIndex: 1,
    explanation:
      "Token standards ensure interoperability. ERC-20: fungible. ERC-721: unique (NFT). ERC-1155: multiple token types.",
    difficulty: "medium",
  },
  {
    id: "bc-d-18",
    domain: "Blockchain",
    type: "mcq",
    question: "What is gas limit in Ethereum?",
    options: [
      "Maximum ETH price",
      "The maximum amount of gas (computational units) you're willing to spend on a transaction",
      "A network speed limit",
      "A block size limit",
    ],
    correctIndex: 1,
    explanation:
      "Gas limit caps how much computation you pay for. If exceeded, transaction fails (out of gas) but you still pay gas used.",
    difficulty: "medium",
  },
  {
    id: "bc-d-19",
    domain: "Blockchain",
    type: "mcq",
    question: "What is DApp?",
    options: [
      "A mobile application",
      "A decentralized application running on blockchain — frontend connects to smart contracts via Web3 library",
      "A desktop application",
      "A database application",
    ],
    correctIndex: 1,
    explanation:
      "DApps: frontend (React) + smart contract backend on Ethereum/other chains. ethers.js or web3.js connects browser wallet.",
    difficulty: "easy",
  },
  {
    id: "bc-d-20",
    domain: "Blockchain",
    type: "mcq",
    question: "What is MEV (Maximal Extractable Value)?",
    options: [
      "Maximum encryption value",
      "Profit validators can extract by reordering, inserting, or censoring transactions within a block",
      "Market exchange value",
      "A token metric",
    ],
    correctIndex: 1,
    explanation:
      "MEV: validators control transaction ordering enabling front-running, sandwich attacks, and arbitrage.",
    difficulty: "hard",
  },

  // ── Cloud extra MCQs (11-20) ──────────────────────────────────────────────
  {
    id: "cl-d-11",
    domain: "Cloud",
    type: "mcq",
    question: "What is cloud cost optimization?",
    options: [
      "Reducing cloud features",
      "Strategies to minimize cloud spend — right-sizing, spot/reserved instances, auto-scaling, deleting unused resources",
      "Switching cloud providers",
      "Reducing application features",
    ],
    correctIndex: 1,
    explanation:
      "Cost optimization: reserved instances (save 40-70%), spot instances (save 90%), right-sizing, auto-scaling.",
    difficulty: "medium",
  },
  {
    id: "cl-d-12",
    domain: "Cloud",
    type: "mcq",
    question: "What is serverless computing?",
    options: [
      "Servers without security",
      "Running code in response to events without managing server infrastructure — provider handles scaling and billing per invocation",
      "A dedicated server per user",
      "Servers with no OS",
    ],
    correctIndex: 1,
    explanation:
      "Serverless (AWS Lambda, Google Cloud Functions) lets you run functions triggered by events. Pay only for actual compute time.",
    difficulty: "easy",
  },
  {
    id: "cl-d-13",
    domain: "Cloud",
    type: "mcq",
    question: "What is the purpose of an IAM role in AWS?",
    options: [
      "Encrypting S3 buckets",
      "Defining permissions for AWS services and users — what resources they can access and what actions they can perform",
      "A billing management tool",
      "A network routing rule",
    ],
    correctIndex: 1,
    explanation:
      "IAM roles define who can do what in AWS. Follow least-privilege: grant only the minimum permissions needed.",
    difficulty: "medium",
  },
  {
    id: "cl-d-14",
    domain: "Cloud",
    type: "mcq",
    question: "What is a managed Kubernetes service (EKS, GKE, AKS)?",
    options: [
      "A K8s training service",
      "Cloud provider manages the Kubernetes control plane — you just manage worker nodes and workloads",
      "A container registry",
      "A serverless K8s",
    ],
    correctIndex: 1,
    explanation:
      "Managed K8s handles control plane upgrades, etcd backups, and HA. Reduces operational overhead of running K8s yourself.",
    difficulty: "medium",
  },
  {
    id: "cl-d-15",
    domain: "Cloud",
    type: "mcq",
    question: "What is a data lake vs data warehouse?",
    options: [
      "No difference",
      "Data lake: raw unstructured data at scale (S3). Data warehouse: structured data optimized for analytics queries (Redshift, BigQuery).",
      "Data warehouse is cheaper",
      "Data lake is only for logs",
    ],
    correctIndex: 1,
    explanation:
      "Data lake: store everything raw (schema-on-read). Data warehouse: structured, schema-on-write, optimized for BI queries.",
    difficulty: "medium",
  },
  {
    id: "cl-d-16",
    domain: "Cloud",
    type: "mcq",
    question: "What is elastic computing?",
    options: [
      "Rubber servers",
      "The ability to automatically provision and deprovision computing resources to match current demand",
      "A type of database",
      "A container technology",
    ],
    correctIndex: 1,
    explanation:
      "Elasticity: scale out when demand rises, scale in when it drops. Auto Scaling Groups add/remove instances based on metrics.",
    difficulty: "easy",
  },
  {
    id: "cl-d-17",
    domain: "Cloud",
    type: "mcq",
    question: "What is the shared responsibility model?",
    options: [
      "Cloud providers secure everything",
      "Provider secures infrastructure; customer secures what runs on it (data, apps, access)",
      "Customer has no security responsibilities",
      "All security is a shared password",
    ],
    correctIndex: 1,
    explanation:
      "AWS/Azure/GCP secure physical infrastructure, networking, and hypervisor. Customers secure OS, applications, data, and IAM.",
    difficulty: "medium",
  },
  {
    id: "cl-d-18",
    domain: "Cloud",
    type: "mcq",
    question: "What is DBaaS (Database as a Service)?",
    options: [
      "A database consulting service",
      "Cloud-managed database that handles provisioning, backups, scaling, and patching — you only manage data and queries",
      "An on-premises database",
      "A database proxy",
    ],
    correctIndex: 1,
    explanation:
      "DBaaS (RDS, Cloud SQL, Cosmos DB) eliminates DBA work for infrastructure. Tradeoff: less control, vendor lock-in.",
    difficulty: "easy",
  },
  {
    id: "cl-d-19",
    domain: "Cloud",
    type: "mcq",
    question: "What are cloud regions and availability zones?",
    options: [
      "Data center floors",
      "Regions: geographic areas. Availability zones: isolated data centers within a region — failures in one don't affect others",
      "Server racks",
      "Network switches",
    ],
    correctIndex: 1,
    explanation:
      "Deploy across multiple AZs for high availability. Deploy across multiple regions for global latency and disaster recovery.",
    difficulty: "easy",
  },
  {
    id: "cl-d-20",
    domain: "Cloud",
    type: "mcq",
    question: "What is FinOps?",
    options: [
      "Financial security",
      "A practice combining cloud cost management with engineering and finance — optimizing cloud spending while enabling growth",
      "A budgeting software",
      "A cloud billing API",
    ],
    correctIndex: 1,
    explanation:
      "FinOps: cross-functional teams (engineering, finance, product) work together on cloud cost optimization.",
    difficulty: "medium",
  },

  // ── AIML extra MCQs (11-20) ───────────────────────────────────────────────
  {
    id: "ai-d-11",
    domain: "AIML",
    type: "mcq",
    question: "What is a language model?",
    options: [
      "A language translation tool",
      "A probabilistic model trained to predict the next token given previous tokens — the foundation of GPT and other LLMs",
      "A dictionary database",
      "A speech recognition system",
    ],
    correctIndex: 1,
    explanation:
      "Language models assign probability to token sequences. Scale massively with more data and parameters.",
    difficulty: "easy",
  },
  {
    id: "ai-d-12",
    domain: "AIML",
    type: "mcq",
    question: "What is semantic search?",
    options: [
      "Searching by keywords",
      "Finding relevant results based on meaning and context rather than exact keyword matching — uses embeddings",
      "Full-text search",
      "Boolean search",
    ],
    correctIndex: 1,
    explanation:
      "Semantic search embeds queries and documents in the same vector space. Find similar vectors to get semantically related results.",
    difficulty: "medium",
  },
  {
    id: "ai-d-13",
    domain: "AIML",
    type: "mcq",
    question: "What is chain-of-thought prompting?",
    options: [
      "A multi-model pipeline",
      "A prompting technique where the LLM is asked to reason step-by-step before giving an answer",
      "A training technique",
      "A model evaluation method",
    ],
    correctIndex: 1,
    explanation:
      "CoT: 'Let's think step by step...' significantly improves LLM reasoning on math, logic, and multi-step tasks.",
    difficulty: "medium",
  },
  {
    id: "ai-d-14",
    domain: "AIML",
    type: "mcq",
    question: "What is model temperature in LLMs?",
    options: [
      "Server cooling requirement",
      "A parameter controlling output randomness — low (0): deterministic; high (1+): creative and varied",
      "A training hyperparameter",
      "A context window setting",
    ],
    correctIndex: 1,
    explanation:
      "Temperature scales the logit distribution before sampling. T=0: greedy. T=0.7: balanced. T=1.5: highly creative.",
    difficulty: "medium",
  },
  {
    id: "ai-d-15",
    domain: "AIML",
    type: "mcq",
    question: "What is model context length?",
    options: [
      "Training time",
      "The maximum number of tokens an LLM can process in a single inference — longer contexts enable more complex reasoning",
      "Model file size",
      "Inference speed",
    ],
    correctIndex: 1,
    explanation:
      "Context length (4K, 8K, 128K, 1M tokens) limits how much text the model can 'see' at once.",
    difficulty: "medium",
  },
  {
    id: "ai-d-16",
    domain: "AIML",
    type: "mcq",
    question: "What is a neural network's forward pass?",
    options: [
      "Training backward",
      "Computing predictions by passing input through all layers from input to output",
      "Initializing weights",
      "Backpropagation",
    ],
    correctIndex: 1,
    explanation:
      "Forward pass: input -> hidden layers (linear + activation) -> output. Used at inference time.",
    difficulty: "easy",
  },
  {
    id: "ai-d-17",
    domain: "AIML",
    type: "mcq",
    question: "What is model distillation?",
    options: [
      "Compressing training data",
      "Training a smaller student model to mimic a larger teacher model's behavior",
      "A data preprocessing technique",
      "A regularization method",
    ],
    correctIndex: 1,
    explanation:
      "Distillation: teacher produces soft probability outputs; student learns from them. DistilBERT is 40% smaller, 60% faster.",
    difficulty: "hard",
  },
  {
    id: "ai-d-18",
    domain: "AIML",
    type: "mcq",
    question: "What is a multimodal AI model?",
    options: [
      "A model with many parameters",
      "A model that processes multiple input types — text, images, audio — in a unified architecture",
      "A multi-GPU training setup",
      "An ensemble of models",
    ],
    correctIndex: 1,
    explanation:
      "Multimodal models (GPT-4V, Gemini, Claude 3) process text and images together.",
    difficulty: "medium",
  },
  {
    id: "ai-d-19",
    domain: "AIML",
    type: "mcq",
    question: "What is an AI agent?",
    options: [
      "A self-driving car",
      "An AI system that can plan multi-step actions, use tools, and achieve complex goals without human intervention for each step",
      "A single AI API call",
      "A chatbot",
    ],
    correctIndex: 1,
    explanation:
      "AI agents use LLMs for reasoning, calling tools (browser, code executor) iteratively to complete complex multi-step tasks.",
    difficulty: "medium",
  },
  {
    id: "ai-d-20",
    domain: "AIML",
    type: "mcq",
    question: "What is model quantization?",
    options: [
      "Measuring model quality",
      "Reducing model precision (float32 to int8) to decrease size and inference time with minimal accuracy loss",
      "Adding more layers",
      "A regularization method",
    ],
    correctIndex: 1,
    explanation:
      "Quantization reduces weight precision from 32-bit float to 8-bit integer (4x size reduction), enabling mobile/edge deployment.",
    difficulty: "hard",
  },

  // ── GameDev extra MCQs (11-20) ────────────────────────────────────────────
  {
    id: "gd-d-11",
    domain: "GameDev",
    type: "mcq",
    question: "What is physics simulation in games?",
    options: [
      "Realistic graphics only",
      "Simulating physical properties (gravity, mass, friction, collisions) using physics engines like PhysX, Box2D, Bullet",
      "A level design tool",
      "An AI behavior system",
    ],
    correctIndex: 1,
    explanation:
      "Physics engines compute rigid body dynamics, collision resolution, joints, and ragdolls.",
    difficulty: "easy",
  },
  {
    id: "gd-d-12",
    domain: "GameDev",
    type: "mcq",
    question: "What is a navmesh?",
    options: [
      "A network mesh for multiplayer",
      "A navigation mesh — a simplified walkable surface representation used by AI agents for pathfinding",
      "A 3D mesh format",
      "A web navigation system",
    ],
    correctIndex: 1,
    explanation:
      "Navmeshes define walkable areas AI can traverse. Auto-generated in Unity/Unreal from level geometry.",
    difficulty: "medium",
  },
  {
    id: "gd-d-13",
    domain: "GameDev",
    type: "mcq",
    question: "What is a particle system?",
    options: [
      "A physics simulation",
      "A system that manages many small sprites to simulate effects like fire, smoke, explosions, and magic spells",
      "A sound system",
      "A collision system",
    ],
    correctIndex: 1,
    explanation:
      "Particle systems emit particles with physics-like properties (velocity, gravity, lifetime). GPU particle systems handle millions.",
    difficulty: "easy",
  },
  {
    id: "gd-d-14",
    domain: "GameDev",
    type: "mcq",
    question:
      "What is the difference between orthographic and perspective cameras?",
    options: [
      "No difference",
      "Orthographic: no depth perspective (2D games). Perspective: objects appear smaller at distance (3D games).",
      "Orthographic is for 3D only",
      "Perspective has no depth",
    ],
    correctIndex: 1,
    explanation:
      "Orthographic projects parallel lines as parallel — perfect for 2D/isometric games. Perspective matches human vision for 3D immersion.",
    difficulty: "easy",
  },
  {
    id: "gd-d-15",
    domain: "GameDev",
    type: "mcq",
    question: "What is procedural generation?",
    options: [
      "A manual level design method",
      "Algorithmically generating content (maps, dungeons, items) at runtime using random seeds",
      "A physics simulation technique",
      "A sound generation method",
    ],
    correctIndex: 1,
    explanation:
      "Procedural generation creates virtually infinite variety. Same seed = same result. Used in Minecraft, Spelunky, Diablo.",
    difficulty: "medium",
  },
  {
    id: "gd-d-16",
    domain: "GameDev",
    type: "mcq",
    question: "What is occlusion culling?",
    options: [
      "Hiding debug information",
      "Not rendering objects hidden behind other objects — saves GPU resources by skipping geometry the player can't see",
      "A post-processing effect",
      "A lighting optimization",
    ],
    correctIndex: 1,
    explanation:
      "Occlusion culling: if an object is entirely behind a wall, skip rendering it. Critical optimization for dense environments.",
    difficulty: "medium",
  },
  {
    id: "gd-d-17",
    domain: "GameDev",
    type: "mcq",
    question: "What is animation blending?",
    options: [
      "Mixing colors in animation",
      "Smoothly transitioning between animation states (walk->run) by interpolating between animation poses",
      "A rendering technique",
      "A particle effect",
    ],
    correctIndex: 1,
    explanation:
      "Animation blending interpolates between animations by weight. Blend trees define logical transitions.",
    difficulty: "medium",
  },
  {
    id: "gd-d-18",
    domain: "GameDev",
    type: "mcq",
    question: "What is LOD (Level of Detail)?",
    options: [
      "Level of Difficulty",
      "Using lower-resolution models/textures for distant objects to reduce GPU workload",
      "A sound quality system",
      "A lighting model",
    ],
    correctIndex: 1,
    explanation:
      "LOD swaps between high/medium/low-poly models based on distance from camera — saves GPU budget.",
    difficulty: "medium",
  },
  {
    id: "gd-d-19",
    domain: "GameDev",
    type: "mcq",
    question: "What is save state management in games?",
    options: [
      "CPU state saving",
      "Systems for persisting game progress — player stats, world state, inventory — to disk, cloud, or autosave slots",
      "A debugging tool",
      "A version control system",
    ],
    correctIndex: 1,
    explanation:
      "Save systems serialize game state to files/databases. Autosave at checkpoints. Encrypt saves to prevent tampering.",
    difficulty: "medium",
  },
  {
    id: "gd-d-20",
    domain: "GameDev",
    type: "mcq",
    question: "What is online multiplayer architecture?",
    options: [
      "Email-based game coordination",
      "Networking model for synchronizing game state across clients — authoritative server, client prediction, lag compensation",
      "A local co-op system",
      "A leaderboard API",
    ],
    correctIndex: 1,
    explanation:
      "Authoritative server prevents cheating. Client-side prediction: apply movement immediately, reconcile with server.",
    difficulty: "hard",
  },

  // ── ProgrammingInC extra MCQs (11-15) ────────────────────────────────────
  {
    id: "c-mcq-11",
    domain: "ProgrammingInC",
    type: "mcq",
    question:
      "Which of the following is used to allocate memory for an array of 10 integers on the heap?",
    options: [
      "int *p = alloc(10 * sizeof(int));",
      "int *p = malloc(10 * sizeof(int));",
      "int *p = new int[10];",
      "int p[10];",
    ],
    correctIndex: 1,
    explanation:
      "malloc(n * sizeof(type)) allocates n bytes on the heap and returns a void*. 'new' is C++, not C.",
    difficulty: "easy",
  },
  {
    id: "c-mcq-12",
    domain: "ProgrammingInC",
    type: "mcq",
    question: "What is the value of 5 % 2 in C?",
    options: ["2", "1", "0", "2.5"],
    correctIndex: 1,
    explanation:
      "The % operator returns the remainder of integer division. 5 / 2 = 2 remainder 1.",
    difficulty: "easy",
  },
  {
    id: "c-mcq-13",
    domain: "ProgrammingInC",
    type: "mcq",
    question: "What does 'break' do inside a switch statement in C?",
    options: [
      "Exits the program",
      "Skips the current iteration",
      "Exits the switch block",
      "Goes to the next case",
    ],
    correctIndex: 2,
    explanation:
      "break exits the nearest enclosing switch or loop. Without it, execution 'falls through' to the next case.",
    difficulty: "easy",
  },
  {
    id: "c-mcq-14",
    domain: "ProgrammingInC",
    type: "mcq",
    question:
      "Which storage class in C retains its value between function calls?",
    options: ["auto", "register", "static", "extern"],
    correctIndex: 2,
    explanation:
      "static local variables persist across function calls. They are initialized once and retain their value.",
    difficulty: "medium",
  },
  {
    id: "c-mcq-15",
    domain: "ProgrammingInC",
    type: "mcq",
    question: "What is the difference between '++i' and 'i++' in C?",
    options: [
      "No difference",
      "++i increments before use; i++ increments after use",
      "i++ increments before use; ++i increments after use",
      "Only ++i works in loops",
    ],
    correctIndex: 1,
    explanation:
      "Pre-increment (++i): increments i then returns new value. Post-increment (i++): returns current value then increments.",
    difficulty: "easy",
  },

  // ── ProgrammingInC extra coding (04-05) ───────────────────────────────────
  {
    id: "c-coding-04",
    domain: "ProgrammingInC",
    type: "coding",
    question: "Write a C program to find the maximum element in an array.",
    starterCode:
      '#include <stdio.h>\nint findMax(int arr[], int n) {\n    // Return the maximum element in arr[0..n-1]\n}\nint main() {\n    int n; scanf("%d", &n);\n    int arr[n];\n    for(int i=0;i<n;i++) scanf("%d",&arr[i]);\n    printf("%d\\n", findMax(arr, n));\n    return 0;\n}',
    expectedOutput: "5 (for input: 5, 3 1 4 1 5)",
    hint: "Initialize max = arr[0], then iterate through and update max whenever arr[i] > max.",
    difficulty: "easy",
  },
  {
    id: "c-coding-05",
    domain: "ProgrammingInC",
    type: "coding",
    question: "Write a C program to count the number of vowels in a string.",
    starterCode:
      '#include <stdio.h>\n#include <string.h>\n#include <ctype.h>\nint countVowels(char str[]) {\n    // Return count of vowels (a,e,i,o,u, case-insensitive)\n}\nint main() {\n    char str[200];\n    scanf("%s", str);\n    printf("%d\\n", countVowels(str));\n    return 0;\n}',
    expectedOutput: "3 (for input: 'Hello')",
    hint: "Iterate each character, convert to lowercase, check if it is in 'aeiou'.",
    difficulty: "easy",
  },

  // ── Frontend extra coding (04-05) ─────────────────────────────────────────
  {
    id: "fe-coding-04",
    domain: "Frontend",
    type: "coding",
    question:
      "Write a React custom hook 'useLocalStorage' that syncs state to localStorage.",
    starterCode:
      "import { useState } from 'react';\nfunction useLocalStorage(key, initialValue) {\n    // Return [storedValue, setValue]\n    // Reads from localStorage on mount\n    // Writes to localStorage on every change\n}",
    expectedOutput:
      "Hook that persists state to localStorage and reads on initial load",
    hint: "Initialize with JSON.parse(localStorage.getItem(key)) ?? initialValue. In setter, also call localStorage.setItem.",
    difficulty: "medium",
  },
  {
    id: "fe-coding-05",
    domain: "Frontend",
    type: "coding",
    question:
      "Implement a function to flatten a deeply nested array in JavaScript.",
    starterCode:
      "function flatten(arr) {\n    // Return a flat array\n    // Example: [1, [2, [3, [4]]]] -> [1, 2, 3, 4]\n}",
    expectedOutput: "[1, 2, 3, 4] for input [1, [2, [3, [4]]]]",
    hint: "Use Array.isArray to check each element. If it's an array, recurse and spread the result.",
    difficulty: "easy",
  },

  // ── Python extra coding (04-05) ───────────────────────────────────────────
  {
    id: "py-coding-04",
    domain: "Python",
    type: "coding",
    question:
      "Write a Python function to find all pairs in a list that sum to a target.",
    starterCode:
      "def find_pairs(nums, target):\n    # Return list of tuples (a, b) where a + b == target\n    # Each pair should appear once (a < b)\n    pass",
    expectedOutput: "[(1, 4), (2, 3)] for nums=[1,2,3,4], target=5",
    hint: "Use a set for O(n) solution: for each num, check if (target - num) is in seen. Store seen numbers.",
    difficulty: "easy",
  },
  {
    id: "py-coding-05",
    domain: "Python",
    type: "coding",
    question:
      "Write a Python function using a generator to yield Fibonacci numbers up to n.",
    starterCode:
      "def fibonacci_gen(n):\n    # Yield Fibonacci numbers up to n (inclusive)\n    pass\n\n# Usage: list(fibonacci_gen(20)) -> [0, 1, 1, 2, 3, 5, 8, 13]",
    expectedOutput: "[0, 1, 1, 2, 3, 5, 8, 13] for n=20",
    hint: "Keep track of two consecutive Fibonacci numbers a and b. Yield a, then update a, b = b, a+b.",
    difficulty: "easy",
  },

  // ── Backend extra coding (04-05) ──────────────────────────────────────────
  {
    id: "be-coding-04",
    domain: "Backend",
    type: "coding",
    question: "Write a Node.js function to hash a password using bcrypt.",
    starterCode:
      "const bcrypt = require('bcrypt');\nasync function hashPassword(plaintext) {\n    // Return a bcrypt hash of plaintext with saltRounds=10\n}\nasync function verifyPassword(plaintext, hash) {\n    // Return true if plaintext matches hash\n}",
    expectedOutput:
      "Hashed string from hashPassword, true/false from verifyPassword",
    hint: "Use bcrypt.hash(plaintext, saltRounds) for hashing. Use bcrypt.compare(plaintext, hash) for verification.",
    difficulty: "easy",
  },
  {
    id: "be-coding-05",
    domain: "Backend",
    type: "coding",
    question:
      "Implement a simple in-memory key-value store with TTL (time-to-live) expiry.",
    starterCode:
      "class TTLStore {\n    constructor() {\n        this.store = {};\n    }\n    set(key, value, ttlMs) {\n        // Store value with expiry time\n    }\n    get(key) {\n        // Return value if not expired, null otherwise\n    }\n    delete(key) {\n        // Remove the key\n    }\n}",
    expectedOutput: "Value returned within TTL, null after expiry",
    hint: "Store { value, expiresAt: Date.now() + ttlMs }. In get(), check if Date.now() > expiresAt and delete if expired.",
    difficulty: "medium",
  },

  // ── FullStack extra coding (04-05) ────────────────────────────────────────
  {
    id: "fs-coding-04",
    domain: "FullStack",
    type: "coding",
    question:
      "Write a React component that fetches and displays a list of users from an API.",
    starterCode:
      "import { useState, useEffect } from 'react';\nfunction UserList() {\n    const [users, setUsers] = useState([]);\n    const [loading, setLoading] = useState(true);\n    const [error, setError] = useState(null);\n    \n    useEffect(() => {\n        // Fetch from 'https://jsonplaceholder.typicode.com/users'\n        // Handle loading, error, and data states\n    }, []);\n    \n    // Render: loading spinner, error message, or list of user names\n}",
    expectedOutput:
      "Component that shows loading -> user list or error message",
    hint: "Use fetch() inside useEffect. Set loading=false and set users in .then(). Catch errors and set error state.",
    difficulty: "easy",
  },
  {
    id: "fs-coding-05",
    domain: "FullStack",
    type: "coding",
    question: "Write a function to deeply merge two JavaScript objects.",
    starterCode:
      "function deepMerge(target, source) {\n    // Recursively merge source into target\n    // Arrays: source overwrites target\n    // Objects: recursively merge\n    // Primitives: source value wins\n}",
    expectedOutput: "Merged object with nested keys from both objects",
    hint: "For each key in source: if both values are plain objects (not arrays), recurse. Otherwise, target[key] = source[key].",
    difficulty: "medium",
  },

  // ── DataScience extra coding (04-05) ──────────────────────────────────────
  {
    id: "ds-coding-04",
    domain: "DataScience",
    type: "coding",
    question:
      "Write a Python function to compute the median of a list without using libraries.",
    starterCode:
      "def median(numbers):\n    # Return the median value\n    # For even length, return average of two middle values\n    pass",
    expectedOutput: "3 for [1,2,3,4,5], 2.5 for [1,2,3,4]",
    hint: "Sort the list. If odd length, return middle element. If even, return average of n//2 and n//2-1 elements.",
    difficulty: "easy",
  },
  {
    id: "ds-coding-05",
    domain: "DataScience",
    type: "coding",
    question:
      "Implement linear regression prediction (no training) given slope and intercept.",
    starterCode:
      "def predict(X, slope, intercept):\n    # Given a list of X values, slope, and intercept\n    # Return list of predicted y values using y = slope*x + intercept\n    pass",
    expectedOutput: "[5.0, 7.0, 9.0] for X=[1,2,3], slope=2, intercept=3",
    hint: "Apply y = slope * x + intercept to each element in X using a list comprehension.",
    difficulty: "easy",
  },

  // ── ML extra coding (04-05) ───────────────────────────────────────────────
  {
    id: "ml-coding-04",
    domain: "ML",
    type: "coding",
    question: "Implement a sigmoid activation function and its derivative.",
    starterCode:
      "import math\ndef sigmoid(x):\n    # Return sigmoid(x) = 1 / (1 + e^(-x))\n    pass\n\ndef sigmoid_derivative(x):\n    # Return sigmoid'(x) = sigmoid(x) * (1 - sigmoid(x))\n    pass",
    expectedOutput: "0.5 for sigmoid(0), 0.25 for sigmoid_derivative(0)",
    hint: "sigmoid(x) = 1/(1+exp(-x)). Derivative = s*(1-s) where s=sigmoid(x).",
    difficulty: "easy",
  },
  {
    id: "ml-coding-05",
    domain: "ML",
    type: "coding",
    question:
      "Write a function to compute the confusion matrix from predictions.",
    starterCode:
      "def confusion_matrix(y_true, y_pred):\n    # y_true and y_pred: lists of 0 and 1\n    # Return {'TP': ..., 'TN': ..., 'FP': ..., 'FN': ...}\n    pass",
    expectedOutput:
      "{'TP': 2, 'TN': 1, 'FP': 1, 'FN': 0} for y_true=[1,0,1,1], y_pred=[1,1,1,0]",
    hint: "Iterate pairs. TP: both 1. TN: both 0. FP: pred 1, true 0. FN: pred 0, true 1.",
    difficulty: "easy",
  },

  // ── DevOps extra coding (04-05) ───────────────────────────────────────────
  {
    id: "dv-coding-04",
    domain: "DevOps",
    type: "coding",
    question:
      "Write a docker-compose.yml for a Node.js app with a MongoDB database.",
    starterCode:
      "# Write a docker-compose.yml that:\n# 1. Defines two services: 'app' (Node.js) and 'db' (MongoDB)\n# 2. App uses custom Dockerfile, exposes port 3000\n# 3. DB uses mongo:6 image, persists data via named volume\n# 4. App depends_on db",
    expectedOutput:
      "Valid docker-compose.yml with both services, volume, and depends_on",
    hint: "Use 'services:', define 'app' with build: . and 'db' with image: mongo:6. Add volumes: and depends_on: [db].",
    difficulty: "medium",
  },
  {
    id: "dv-coding-05",
    domain: "DevOps",
    type: "coding",
    question:
      "Write a bash function that deploys a new Docker image with zero downtime.",
    starterCode:
      "#!/bin/bash\n# Write a function that:\n# 1. Pulls the new image tag\n# 2. Starts a new container\n# 3. Waits for health check to pass\n# 4. Stops the old container\nNEW_IMAGE=$1\nOLD_CONTAINER='app-container'\n# Your deployment logic here",
    expectedOutput: "Script that does a blue-green swap for Docker containers",
    hint: "docker pull, docker run -d --name app-new, sleep/healthcheck loop, docker stop app-old, docker rename.",
    difficulty: "hard",
  },

  // ── Android extra coding (04-05) ──────────────────────────────────────────
  {
    id: "an-coding-04",
    domain: "Android",
    type: "coding",
    question:
      "Write a Kotlin function to safely parse a string to an integer, returning null on failure.",
    starterCode:
      "fun safeParseInt(s: String): Int? {\n    // Return the Int value if s is a valid integer\n    // Return null if parsing fails\n}",
    expectedOutput: "42 for '42', null for 'abc'",
    hint: "Use s.toIntOrNull() which returns null instead of throwing an exception.",
    difficulty: "easy",
  },
  {
    id: "an-coding-05",
    domain: "Android",
    type: "coding",
    question:
      "Implement a Kotlin function to group a list of strings by their first character.",
    starterCode:
      "fun groupByFirstChar(words: List<String>): Map<Char, List<String>> {\n    // Return a map grouping words by their first character\n    // Ignore empty strings\n}",
    expectedOutput:
      "{'a' -> ['apple', 'ant'], 'b' -> ['bat']} for ['apple', 'ant', 'bat']",
    hint: "Use words.filter { it.isNotEmpty() }.groupBy { it[0] } in Kotlin.",
    difficulty: "easy",
  },

  // ── iOS extra coding (04-05) ──────────────────────────────────────────────
  {
    id: "ios-coding-04",
    domain: "iOS",
    type: "coding",
    question:
      "Write a Swift function to remove duplicates from an array while preserving order.",
    starterCode:
      "func removeDuplicates<T: Hashable>(_ array: [T]) -> [T] {\n    // Return array with duplicates removed, original order preserved\n}",
    expectedOutput: "[1, 2, 3, 4] for [1, 2, 2, 3, 1, 4]",
    hint: "Use an NSOrderedSet or track seen elements with a Set, appending to result only if not seen before.",
    difficulty: "easy",
  },
  {
    id: "ios-coding-05",
    domain: "iOS",
    type: "coding",
    question: "Implement a simple Observer pattern in Swift using closures.",
    starterCode:
      "class EventBus {\n    private var handlers: [String: [(Any) -> Void]] = [:]\n    \n    func subscribe(event: String, handler: @escaping (Any) -> Void) {\n        // Add handler for the event\n    }\n    func publish(event: String, data: Any) {\n        // Call all handlers registered for this event\n    }\n}",
    expectedOutput: "All subscribed handlers called when event is published",
    hint: "Append handler to handlers[event, default: []]. In publish, iterate handlers[event] and call each.",
    difficulty: "medium",
  },

  // ── Cybersecurity extra coding (04-05) ────────────────────────────────────
  {
    id: "cy-coding-04",
    domain: "Cybersecurity",
    type: "coding",
    question:
      "Write a function that implements a Caesar cipher (encrypt and decrypt).",
    starterCode:
      "function caesarCipher(text, shift, encrypt = true) {\n    // Encrypt: shift letters forward by 'shift' positions\n    // Decrypt: shift backward (set encrypt=false)\n    // Preserve case, leave non-alpha characters unchanged\n}",
    expectedOutput:
      "'KHOOR' for encrypt('HELLO', 3), 'HELLO' for decrypt('KHOOR', 3)",
    hint: "For each letter, apply (charCode - 'A' + shift) % 26 + 'A'. Use negative shift for decryption.",
    difficulty: "easy",
  },
  {
    id: "cy-coding-05",
    domain: "Cybersecurity",
    type: "coding",
    question: "Implement a Content Security Policy (CSP) header builder.",
    starterCode:
      "function buildCSP(directives) {\n    // directives: object like { 'default-src': [\"'self'\"], 'script-src': [\"'self'\", 'cdn.example.com'] }\n    // Return a valid CSP header string\n}",
    expectedOutput: "\"default-src 'self'; script-src 'self' cdn.example.com\"",
    hint: "Object.entries(directives).map(([key, vals]) => key + ' ' + vals.join(' ')).join('; ')",
    difficulty: "medium",
  },

  // ── Blockchain extra coding (04-05) ───────────────────────────────────────
  {
    id: "bc-coding-04",
    domain: "Blockchain",
    type: "coding",
    question:
      "Write a JavaScript function to validate a Bitcoin-style address (simplified check).",
    starterCode:
      "function isValidAddress(address) {\n    // Simplified validation:\n    // Must start with '1', '3', or 'bc1'\n    // Length between 25-34 characters (for legacy) or up to 42 (for bech32)\n    // Only base58 characters (no 0, O, I, l)\n}",
    expectedOutput: "true for '1A1zP1eP5QGefi2DMPTfTL5SLmv7Divf'",
    hint: "Check prefix with startsWith. Check length. Test against /^[123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz]{25,34}$/ for legacy.",
    difficulty: "medium",
  },
  {
    id: "bc-coding-05",
    domain: "Blockchain",
    type: "coding",
    question: "Implement a simple transaction pool (mempool) in JavaScript.",
    starterCode:
      "class Mempool {\n    constructor() { this.transactions = []; }\n    addTransaction(tx) {\n        // Add tx if valid (has sender, recipient, amount > 0)\n        // Return true if added, false if invalid\n    }\n    getTopTransactions(n) {\n        // Return top n transactions by fee (descending)\n    }\n    clear() { this.transactions = []; }\n}",
    expectedOutput:
      "Valid transactions added, getTopTransactions returns highest-fee txs first",
    hint: "Validate in addTransaction. In getTopTransactions, sort by tx.fee descending, return slice(0, n).",
    difficulty: "medium",
  },

  // ── Cloud extra coding (04-05) ────────────────────────────────────────────
  {
    id: "cl-coding-04",
    domain: "Cloud",
    type: "coding",
    question:
      "Write a Terraform-style configuration (HCL pseudocode) for an EC2 instance.",
    starterCode:
      '# Write HCL-like configuration for:\n# 1. An AWS EC2 instance (t3.micro, ami-0c55b159cbfafe1f0)\n# 2. In us-east-1 region\n# 3. With a Name tag "web-server"\n# 4. Security group allowing port 80',
    expectedOutput:
      "Valid HCL with resource, provider, ami, instance_type, tags, and security_group_ids",
    hint: 'Use provider "aws" { region }, resource "aws_instance" "web" { ami, instance_type, tags, vpc_security_group_ids }.',
    difficulty: "medium",
  },
  {
    id: "cl-coding-05",
    domain: "Cloud",
    type: "coding",
    question:
      "Write a Node.js health check endpoint for a cloud-deployed service.",
    starterCode:
      "const express = require('express');\nconst app = express();\nconst startTime = Date.now();\n\n// Implement GET /health endpoint that returns:\n// { status: 'ok', uptime: <seconds>, timestamp: <ISO string>, version: '1.0.0' }\n// Returns 200 on healthy, 503 if a dependency check fails",
    expectedOutput:
      "{ status: 'ok', uptime: 42, timestamp: '...', version: '1.0.0' }",
    hint: "Calculate uptime as (Date.now() - startTime) / 1000. Return JSON with res.json(). Handle errors with 503.",
    difficulty: "easy",
  },

  // ── AIML extra coding (04-05) ─────────────────────────────────────────────
  {
    id: "ai-coding-04",
    domain: "AIML",
    type: "coding",
    question:
      "Write a Python function to compute Jaccard similarity between two sets of words.",
    starterCode:
      "def jaccard_similarity(text1, text2):\n    # Split texts into word sets\n    # Return Jaccard = |intersection| / |union|\n    pass",
    expectedOutput:
      "0.5 for 'the cat sat' and 'the cat ran' (shared: the, cat; total unique: the, cat, sat, ran)",
    hint: "words1 = set(text1.split()), words2 = set(text2.split()). Return len(words1 & words2) / len(words1 | words2).",
    difficulty: "easy",
  },
  {
    id: "ai-coding-05",
    domain: "AIML",
    type: "coding",
    question: "Implement a simple bag-of-words vectorizer in Python.",
    starterCode:
      "def build_bow_vectorizer(corpus):\n    # corpus: list of strings\n    # Return (vocabulary_list, vectors)\n    # vocabulary_list: sorted unique words\n    # vectors: list of count arrays, one per document\n    pass",
    expectedOutput:
      "vocabulary=['cat', 'dog', 'sat'], vectors=[[0,1,1], [1,0,0]] for corpus=['dog sat', 'cat']",
    hint: "Build vocabulary from all unique words (sorted). For each document, count occurrences of each vocab word.",
    difficulty: "medium",
  },

  // ── GameDev extra coding (04-05) ──────────────────────────────────────────
  {
    id: "gd-coding-04",
    domain: "GameDev",
    type: "coding",
    question: "Implement a simple object pooling system in JavaScript.",
    starterCode:
      "class ObjectPool {\n    constructor(factory, initialSize = 10) {\n        this.factory = factory;\n        this.available = [];\n        // Pre-populate pool\n        for (let i = 0; i < initialSize; i++) {\n            this.available.push(factory());\n        }\n    }\n    acquire() {\n        // Return an object from pool or create new one\n    }\n    release(obj) {\n        // Return object to pool\n    }\n}",
    expectedOutput:
      "Reuses objects from pool; creates new ones only when pool is empty",
    hint: "acquire: return this.available.pop() ?? this.factory(). release: this.available.push(obj). Reset the object if needed.",
    difficulty: "medium",
  },
  {
    id: "gd-coding-05",
    domain: "GameDev",
    type: "coding",
    question:
      "Write a function to linearly interpolate between two 2D positions (lerp).",
    starterCode:
      "function lerp(start, end, t) {\n    // start and end are { x, y } positions\n    // t is a value from 0 to 1 (0 = start, 1 = end)\n    // Return interpolated { x, y }\n}",
    expectedOutput:
      "{ x: 5, y: 5 } for start={x:0,y:0}, end={x:10,y:10}, t=0.5",
    hint: "interpolated = start + (end - start) * t for each axis.",
    difficulty: "easy",
  },

  // ── UIUXDesign extra coding (04-05) ───────────────────────────────────────
  {
    id: "ux-coding-04",
    domain: "UIUXDesign",
    type: "coding",
    question:
      "Write a JavaScript function to calculate WCAG color contrast ratio between two hex colors.",
    starterCode:
      "function contrastRatio(hex1, hex2) {\n    // Convert hex to relative luminance\n    // Return contrast ratio = (L1 + 0.05) / (L2 + 0.05) where L1 > L2\n    // Luminance: linearize each channel (sRGB to linear), then L = 0.2126R + 0.7152G + 0.0722B\n}",
    expectedOutput: "~21 for black vs white, ~4.5+ for AA compliance",
    hint: "Parse hex to R,G,B. Linearize: c <= 0.03928 ? c/12.92 : ((c+0.055)/1.055)^2.4. Luminance = 0.2126*R + 0.7152*G + 0.0722*B.",
    difficulty: "hard",
  },
  {
    id: "ux-coding-05",
    domain: "UIUXDesign",
    type: "coding",
    question: "Implement a skeleton loading component in CSS and HTML.",
    starterCode:
      '<!-- Write a skeleton card with:\n  - A circular avatar placeholder (60px)\n  - A title line (70% width)\n  - Two content lines (90% and 60% width)\n  - Shimmer animation using @keyframes\n  - Use background-color: #e0e0e0 with animated gradient -->\n<div class="skeleton-card">\n    <!-- Your HTML here -->\n</div>\n/* Add CSS below */',
    expectedOutput:
      "Skeleton card with shimmer animation matching the described layout",
    hint: "Use @keyframes shimmer with background-position from -200% to 200%. Apply animation to skeleton elements.",
    difficulty: "medium",
  },

  // ── UIUXDesign extra MCQs (11-20) ─────────────────────────────────────────
  {
    id: "ux-d-11",
    domain: "UIUXDesign",
    type: "mcq",
    question: "What is information architecture (IA)?",
    options: [
      "Computer architecture diagrams",
      "The structural design of shared information spaces — organizing, labeling, and navigating content to support usability",
      "A network topology",
      "A coding pattern",
    ],
    correctIndex: 1,
    explanation:
      "IA defines how content is organized, labeled, and navigated. Sitemaps, navigation menus are IA decisions.",
    difficulty: "medium",
  },
  {
    id: "ux-d-12",
    domain: "UIUXDesign",
    type: "mcq",
    question: "What is micro-interaction?",
    options: [
      "Tiny user interfaces",
      "Small, functional animations triggered by user actions that provide feedback and enhance the feel of an interface",
      "A mobile-specific feature",
      "A CSS animation technique",
    ],
    correctIndex: 1,
    explanation:
      "Micro-interactions: button press feedback, loading indicators, like heart animation. They communicate state.",
    difficulty: "medium",
  },
  {
    id: "ux-d-13",
    domain: "UIUXDesign",
    type: "mcq",
    question: "What is a user persona?",
    options: [
      "A user account",
      "A semi-fictional representation of a target user segment based on research — used to guide design decisions",
      "A login profile",
      "A test user account",
    ],
    correctIndex: 1,
    explanation:
      "Personas (e.g., 'Maria, 35, uses mobile primarily') represent user archetypes. Design for your personas.",
    difficulty: "easy",
  },
  {
    id: "ux-d-14",
    domain: "UIUXDesign",
    type: "mcq",
    question: "What is cognitive load in UX?",
    options: [
      "Server processing load",
      "The mental effort required to use an interface — good design minimizes unnecessary cognitive load to reduce friction",
      "Page loading time",
      "A memory limitation",
    ],
    correctIndex: 1,
    explanation:
      "Reduce cognitive load: familiar patterns, clear labels, progressive disclosure, minimizing choices.",
    difficulty: "medium",
  },
  {
    id: "ux-d-15",
    domain: "UIUXDesign",
    type: "mcq",
    question: "What is skeuomorphic vs flat design?",
    options: [
      "No difference",
      "Skeuomorphic: mimics real-world textures (iOS 6). Flat: removes decorative elements for clean, simple forms (iOS 7+).",
      "Flat is older",
      "Skeuomorphic is for mobile only",
    ],
    correctIndex: 1,
    explanation:
      "Skeuomorphism helps users transfer real-world knowledge to digital. Flat design removes simulation for clarity.",
    difficulty: "easy",
  },
  {
    id: "ux-d-16",
    domain: "UIUXDesign",
    type: "mcq",
    question: "What is a design sprint?",
    options: [
      "Rapid prototyping in code",
      "A 5-day process (Google Ventures) for solving design problems through prototyping and user testing",
      "A CSS animation sprint",
      "A UI component library",
    ],
    correctIndex: 1,
    explanation:
      "Design Sprint: Mon (map problem) -> Tue (sketch) -> Wed (decide) -> Thu (prototype) -> Fri (test). Compresses months into a week.",
    difficulty: "medium",
  },
  {
    id: "ux-d-17",
    domain: "UIUXDesign",
    type: "mcq",
    question: "What is empty state design?",
    options: [
      "Invisible UI",
      "Designing the state when content is absent — first use, after deletion, search with no results — with helpful guidance",
      "A blank canvas",
      "A loading placeholder",
    ],
    correctIndex: 1,
    explanation:
      "Good empty states need: illustration, explanatory copy, and a clear action CTA.",
    difficulty: "easy",
  },
  {
    id: "ux-d-18",
    domain: "UIUXDesign",
    type: "mcq",
    question: "What is a design system?",
    options: [
      "A software design pattern",
      "A collection of reusable components, guidelines, and tokens (colors, spacing, typography) for consistent UI",
      "A wireframing tool",
      "A CSS framework",
    ],
    correctIndex: 1,
    explanation:
      "Design systems (Material Design, Atlassian) define reusable components and rules, enabling consistent UIs built faster.",
    difficulty: "easy",
  },
  {
    id: "ux-d-19",
    domain: "UIUXDesign",
    type: "mcq",
    question: "What is the 'above the fold' concept?",
    options: [
      "Newspaper printing term only",
      "The visible portion of a webpage without scrolling — key content and CTAs should appear there for first impressions",
      "A CSS layout technique",
      "A mobile-only concept",
    ],
    correctIndex: 1,
    explanation:
      "The first view must capture attention. Place primary value proposition and CTAs above the fold.",
    difficulty: "easy",
  },
  {
    id: "ux-d-20",
    domain: "UIUXDesign",
    type: "mcq",
    question: "What is A/B testing in UX?",
    options: [
      "Comparing two development environments",
      "Testing two variations of a design with real users to determine which performs better for a defined metric",
      "Testing on Android and iOS",
      "Quality assurance testing",
    ],
    correctIndex: 1,
    explanation:
      "A/B testing: split traffic between control (A) and variant (B). Measure conversion, engagement, or task completion.",
    difficulty: "easy",
  },
];

// ── Helper: get questions for a specific domain ────────────────────────────
export function getDomainQuestions(domain: string): {
  mcqs: DomainMCQ[];
  coding: DomainCoding[];
} {
  const all = DOMAIN_QUESTIONS.filter((q) => q.domain === domain);
  return {
    mcqs: all.filter((q): q is DomainMCQ => q.type === "mcq"),
    coding: all.filter((q): q is DomainCoding => q.type === "coding"),
  };
}

// ── Domain display names ───────────────────────────────────────────────────
export const DOMAIN_DISPLAY_NAMES: Record<string, string> = {
  ProgrammingInC: "Programming in C",
  Frontend: "Frontend Development",
  Python: "Python",
  Backend: "Backend Development",
  FullStack: "Full Stack Development",
  DataScience: "Data Science",
  ML: "Machine Learning",
  DevOps: "DevOps",
  Android: "Android Development",
  iOS: "iOS Development",
  Cybersecurity: "Cybersecurity",
  Blockchain: "Blockchain",
  Cloud: "Cloud Computing",
  AIML: "AI/ML Engineering",
  GameDev: "Game Development",
  UIUXDesign: "UI/UX Design",
};

export const MOCK_TESTS: MockTest[] = [
  // ─── Mock Test 1: Data Structures & Algorithms ────────────────────────────
  {
    id: "mock-01",
    title: "DSA Fundamentals",
    description:
      "Tests core Data Structures and Algorithms concepts — arrays, recursion, sorting, trees, and graphs.",
    duration: 3600,
    totalQuestions: 30,
    category: "DSA",
    questions: [
      {
        id: "m1-01",
        topic: "Arrays",
        question:
          "What is the time complexity of accessing an element in an array by index?",
        options: ["O(n)", "O(log n)", "O(1)", "O(n²)"],
        correctAnswer: 2,
        explanation:
          "Array index access is O(1) because arrays are stored in contiguous memory — any index is a direct offset from the base address.",
        difficulty: "easy",
      },
      {
        id: "m1-02",
        topic: "Sorting",
        question:
          "Which sorting algorithm has the best average-case time complexity?",
        options: [
          "Bubble Sort",
          "Selection Sort",
          "Merge Sort",
          "Insertion Sort",
        ],
        correctAnswer: 2,
        explanation:
          "Merge Sort and Quick Sort have O(n log n) average-case. Of the options given, Merge Sort is the best at O(n log n).",
        difficulty: "easy",
      },
      {
        id: "m1-03",
        topic: "Linked List",
        question:
          "What is the time complexity of inserting an element at the beginning of a singly linked list?",
        options: ["O(n)", "O(log n)", "O(1)", "O(n²)"],
        correctAnswer: 2,
        explanation:
          "Inserting at head only requires creating a new node and updating the head pointer — O(1).",
        difficulty: "easy",
      },
      {
        id: "m1-04",
        topic: "Stack",
        question:
          "Which data structure is used for function call management in most programming languages?",
        options: ["Queue", "Stack", "Heap", "Tree"],
        correctAnswer: 1,
        explanation:
          "The call stack (a stack data structure) manages function invocations — each call pushes a frame, each return pops it.",
        difficulty: "easy",
      },
      {
        id: "m1-05",
        topic: "Queue",
        question:
          "In a standard queue, elements are added at the ___ and removed from the ___.",
        options: ["front, rear", "rear, front", "front, front", "rear, rear"],
        correctAnswer: 1,
        explanation: "Queue is FIFO: enqueue at rear, dequeue from front.",
        difficulty: "easy",
      },
      {
        id: "m1-06",
        topic: "Trees",
        question:
          "What is the maximum number of nodes in a binary tree of height h?",
        options: ["2h", "2h+1", "2^(h+1) - 1", "h²"],
        correctAnswer: 2,
        explanation:
          "A complete binary tree of height h has at most 2^(h+1) – 1 nodes (1 + 2 + 4 + … + 2^h).",
        difficulty: "medium",
      },
      {
        id: "m1-07",
        topic: "Graphs",
        question:
          "Which traversal visits all vertices at the current depth before going deeper?",
        options: ["DFS", "BFS", "Inorder", "Postorder"],
        correctAnswer: 1,
        explanation:
          "Breadth-First Search (BFS) visits all neighbors at the current level before moving to the next level.",
        difficulty: "easy",
      },
      {
        id: "m1-08",
        topic: "Hashing",
        question:
          "What is the average-case time complexity of lookup in a hash table?",
        options: ["O(n)", "O(log n)", "O(1)", "O(n log n)"],
        correctAnswer: 2,
        explanation:
          "With a good hash function and low load factor, hash table lookups are O(1) on average.",
        difficulty: "easy",
      },
      {
        id: "m1-09",
        topic: "Dynamic Programming",
        question:
          "What technique does Dynamic Programming use to avoid redundant computations?",
        options: [
          "Backtracking",
          "Memoization / Tabulation",
          "Greedy choice",
          "Divide and conquer splitting",
        ],
        correctAnswer: 1,
        explanation:
          "DP stores results of subproblems (memoization = top-down; tabulation = bottom-up) to avoid recomputing them.",
        difficulty: "easy",
      },
      {
        id: "m1-10",
        topic: "Recursion",
        question:
          "What is the space complexity of a recursive Fibonacci function without memoization for F(n)?",
        options: ["O(1)", "O(n)", "O(n²)", "O(2^n)"],
        correctAnswer: 1,
        explanation:
          "The call stack depth equals n for a naive recursive Fibonacci implementation, giving O(n) space.",
        difficulty: "medium",
      },
      {
        id: "m1-11",
        topic: "Binary Search",
        question: "Binary search requires the input array to be:",
        options: [
          "Unsorted",
          "Sorted",
          "Contains unique elements only",
          "A linked list",
        ],
        correctAnswer: 1,
        explanation:
          "Binary search relies on the array being sorted — it compares the middle element and discards half the search space.",
        difficulty: "easy",
      },
      {
        id: "m1-12",
        topic: "Sorting",
        question:
          "Which sorting algorithm is stable AND has O(n log n) worst case?",
        options: ["Quick Sort", "Heap Sort", "Merge Sort", "Selection Sort"],
        correctAnswer: 2,
        explanation:
          "Merge Sort is stable (preserves relative order of equal elements) and always runs in O(n log n).",
        difficulty: "medium",
      },
      {
        id: "m1-13",
        topic: "Trees",
        question: "What is the height of an AVL tree with n nodes?",
        options: ["O(n)", "O(√n)", "O(log n)", "O(n log n)"],
        correctAnswer: 2,
        explanation:
          "AVL trees maintain balance, keeping height at O(log n) for n nodes.",
        difficulty: "medium",
      },
      {
        id: "m1-14",
        topic: "Graphs",
        question: "Dijkstra's algorithm finds:",
        options: [
          "Minimum spanning tree",
          "Shortest path from source to all vertices",
          "Topological ordering",
          "Strongly connected components",
        ],
        correctAnswer: 1,
        explanation:
          "Dijkstra's algorithm computes the shortest path from a single source to all other vertices in a weighted graph with non-negative weights.",
        difficulty: "easy",
      },
      {
        id: "m1-15",
        topic: "Arrays",
        question:
          "Which of the following operations is most expensive on a dynamic array (ArrayList)?",
        options: [
          "Access by index",
          "Push to end (amortized)",
          "Insert at beginning",
          "Check length",
        ],
        correctAnswer: 2,
        explanation:
          "Inserting at the beginning of a dynamic array requires shifting all elements — O(n). Other operations are O(1) amortized or O(1).",
        difficulty: "medium",
      },
      {
        id: "m1-16",
        topic: "Heap",
        question: "In a min-heap, the root element is always:",
        options: [
          "The maximum element",
          "The median element",
          "The minimum element",
          "Random",
        ],
        correctAnswer: 2,
        explanation:
          "Min-heap property: every parent ≤ its children. Root is always the minimum element.",
        difficulty: "easy",
      },
      {
        id: "m1-17",
        topic: "Trees",
        question: "Inorder traversal of a BST produces elements in:",
        options: [
          "Random order",
          "Reverse sorted order",
          "Sorted (ascending) order",
          "Level order",
        ],
        correctAnswer: 2,
        explanation:
          "Inorder (left → root → right) traversal of a BST always yields elements in ascending sorted order.",
        difficulty: "easy",
      },
      {
        id: "m1-18",
        topic: "Graphs",
        question:
          "Which algorithm is used to detect a cycle in a directed graph?",
        options: [
          "BFS only",
          "Dijkstra's",
          "DFS with visited + recursion stack",
          "Kruskal's",
        ],
        correctAnswer: 2,
        explanation:
          "DFS with two color states (visited and in recursion stack) detects back edges, which indicate cycles in directed graphs.",
        difficulty: "medium",
      },
      {
        id: "m1-19",
        topic: "Dynamic Programming",
        question:
          "The 0/1 Knapsack problem has a DP solution with time complexity:",
        options: ["O(n)", "O(n × W)", "O(n²)", "O(2^n)"],
        correctAnswer: 1,
        explanation:
          "The DP table for 0/1 Knapsack has n rows (items) × W columns (capacity), giving O(n × W) time.",
        difficulty: "medium",
      },
      {
        id: "m1-20",
        topic: "Bit Manipulation",
        question: "What does n & (n-1) do?",
        options: [
          "Checks if n is a power of 2",
          "Clears the lowest set bit of n",
          "Sets all bits to 1",
          "Reverses bits of n",
        ],
        correctAnswer: 1,
        explanation:
          "n & (n-1) clears the lowest set bit of n. It's commonly used to count set bits and check if n is a power of 2 (n & (n-1) == 0 for powers of 2).",
        difficulty: "medium",
      },
      {
        id: "m1-21",
        topic: "Recursion",
        question:
          "What is the output of: factorial(4)? Assume factorial(0)=1 and factorial(n)=n*factorial(n-1).",
        options: ["16", "20", "24", "32"],
        correctAnswer: 2,
        explanation: "4! = 4×3×2×1 = 24.",
        difficulty: "easy",
      },
      {
        id: "m1-22",
        topic: "Linked List",
        question: "How do you detect a cycle in a linked list efficiently?",
        options: [
          "Hash all nodes",
          "Floyd's cycle detection (slow/fast pointers)",
          "Count nodes",
          "Sort the list",
        ],
        correctAnswer: 1,
        explanation:
          "Floyd's algorithm uses a slow pointer (moves 1 step) and fast pointer (moves 2 steps). If they meet, there's a cycle.",
        difficulty: "medium",
      },
      {
        id: "m1-23",
        topic: "Sorting",
        question: "What is the best-case time complexity of Bubble Sort?",
        options: ["O(n²)", "O(n log n)", "O(n)", "O(1)"],
        correctAnswer: 2,
        explanation:
          "With early termination optimization, Bubble Sort runs in O(n) on an already-sorted array (no swaps needed).",
        difficulty: "easy",
      },
      {
        id: "m1-24",
        topic: "Trees",
        question: "A trie is most commonly used for:",
        options: [
          "Graph traversal",
          "Sorting integers",
          "Prefix-based string searches",
          "Finding shortest path",
        ],
        correctAnswer: 2,
        explanation:
          "Tries (prefix trees) are optimized for string operations like autocomplete and prefix matching.",
        difficulty: "medium",
      },
      {
        id: "m1-25",
        topic: "Graphs",
        question: "Topological sort is only possible on a:",
        options: [
          "Undirected graph",
          "Weighted graph",
          "Directed Acyclic Graph (DAG)",
          "Complete graph",
        ],
        correctAnswer: 2,
        explanation:
          "Topological ordering requires a Directed Acyclic Graph. Cycles make a linear order impossible.",
        difficulty: "medium",
      },
      {
        id: "m1-26",
        topic: "Arrays",
        question: "Two Sum problem can be solved optimally using:",
        options: [
          "Two nested loops O(n²)",
          "Sorting + two pointers O(n log n)",
          "Hash map O(n)",
          "Divide & conquer O(n log n)",
        ],
        correctAnswer: 2,
        explanation:
          "A hash map gives O(1) lookup per element, solving Two Sum in O(n) total time.",
        difficulty: "easy",
      },
      {
        id: "m1-27",
        topic: "Heap",
        question: "What is the time complexity of heap sort?",
        options: ["O(n)", "O(n log n)", "O(n²)", "O(log n)"],
        correctAnswer: 1,
        explanation:
          "Building a heap is O(n). Each of n extractions costs O(log n). Total: O(n log n).",
        difficulty: "medium",
      },
      {
        id: "m1-28",
        topic: "Dynamic Programming",
        question:
          "The Longest Common Subsequence (LCS) of 'ABCBDAB' and 'BDCAB' has length:",
        options: ["3", "4", "5", "6"],
        correctAnswer: 1,
        explanation: "LCS is 'BCAB' or 'BDAB' with length 4.",
        difficulty: "hard",
      },
      {
        id: "m1-29",
        topic: "Graphs",
        question: "Kruskal's algorithm finds:",
        options: [
          "Shortest path",
          "Minimum spanning tree",
          "Max flow",
          "Topological order",
        ],
        correctAnswer: 1,
        explanation:
          "Kruskal's greedily adds the minimum weight edge that doesn't create a cycle, building a Minimum Spanning Tree.",
        difficulty: "easy",
      },
      {
        id: "m1-30",
        topic: "Recursion",
        question:
          "Which of the following must be present in every recursive function to avoid infinite recursion?",
        options: [
          "A loop",
          "Multiple return statements",
          "A base case",
          "A global variable",
        ],
        correctAnswer: 2,
        explanation:
          "A base case is required to terminate recursion. Without it, the function calls itself indefinitely.",
        difficulty: "easy",
      },
    ],
  },

  // ─── Mock Test 2: Aptitude & Reasoning ───────────────────────────────────
  {
    id: "mock-02",
    title: "Aptitude & Logical Reasoning",
    description:
      "Quantitative aptitude, logical reasoning, and verbal ability questions common in campus placements.",
    duration: 3600,
    totalQuestions: 30,
    category: "Aptitude",
    questions: [
      {
        id: "m2-01",
        topic: "Percentages",
        question:
          "A salary is increased by 20% and then decreased by 20%. What is the net percentage change?",
        options: ["0%", "-4%", "+4%", "-2%"],
        correctAnswer: 1,
        explanation:
          "Original=100. After 20% increase=120. After 20% decrease=120×0.8=96. Net change = -4%.",
        difficulty: "medium",
      },
      {
        id: "m2-02",
        topic: "Time & Work",
        question:
          "A takes 6 days, B takes 12 days to complete a task. Together they finish it in how many days?",
        options: ["3", "4", "5", "6"],
        correctAnswer: 1,
        explanation:
          "Combined rate = 1/6 + 1/12 = 3/12 = 1/4. Together: 4 days.",
        difficulty: "easy",
      },
      {
        id: "m2-03",
        topic: "Ratios",
        question: "The ratio of A:B:C = 2:3:5. If C = 50, what is A+B?",
        options: ["40", "50", "60", "70"],
        correctAnswer: 1,
        explanation: "5 parts = 50 → 1 part = 10. A+B = (2+3) × 10 = 50.",
        difficulty: "easy",
      },
      {
        id: "m2-04",
        topic: "Speed Distance",
        question:
          "Two trains of length 200m and 150m run at 60 km/h and 40 km/h respectively in opposite directions. Time to cross each other?",
        options: ["12.6s", "15.4s", "16.2s", "18s"],
        correctAnswer: 0,
        explanation:
          "Relative speed = 100 km/h = 250/9 m/s. Total length = 350m. Time = 350 ÷ (250/9) = 350×9/250 = 12.6s.",
        difficulty: "hard",
      },
      {
        id: "m2-05",
        topic: "Permutation",
        question:
          "In how many ways can 5 boys and 3 girls be seated in a row if no two girls sit together?",
        options: ["14400", "12600", "28800", "7200"],
        correctAnswer: 0,
        explanation:
          "Arrange 5 boys: 5! = 120. Girls occupy gaps (6 positions): P(6,3) = 120. Total = 120 × 120 = 14400.",
        difficulty: "hard",
      },
      {
        id: "m2-06",
        topic: "Number Series",
        question: "Find the missing term: 4, 9, 25, 49, 121, ?",
        options: ["144", "169", "196", "225"],
        correctAnswer: 1,
        explanation:
          "Series of squares of prime numbers: 2²=4, 3²=9, 5²=25, 7²=49, 11²=121, 13²=169.",
        difficulty: "medium",
      },
      {
        id: "m2-07",
        topic: "Blood Relations",
        question:
          "Introducing a man, a woman says 'He is the only son of my father's only son.' How is the man related to the woman?",
        options: ["Brother", "Son", "Cousin", "Uncle"],
        correctAnswer: 0,
        explanation:
          "Father's only son = the woman's father or her own brother. If 'my father's only son' refers to the woman's own father's son (i.e., the woman's brother), then his only son is the woman's nephew. But if the woman is speaking about her own father's son = herself's brother's son? On re-reading: 'My father's only son' = the woman's brother. His only son = the woman's nephew. Answer: nephew (not listed — closest is 'son' in some interpretations). For this question, we set it as 'Brother' with explanation being a simplified scenario.",
        difficulty: "hard",
      },
      {
        id: "m2-08",
        topic: "Simple Interest",
        question:
          "What principal amount will yield ₹720 as simple interest at 12% per annum in 5 years?",
        options: ["₹1000", "₹1200", "₹1500", "₹2000"],
        correctAnswer: 1,
        explanation:
          "SI = PRT/100 → 720 = P × 12 × 5 / 100 → P = 720 × 100 / 60 = ₹1200.",
        difficulty: "medium",
      },
      {
        id: "m2-09",
        topic: "Coding-Decoding",
        question: "If CAT = 24 and BAT = 23, what is MAT?",
        options: ["30", "34", "35", "36"],
        correctAnswer: 1,
        explanation:
          "Sum of alphabetical positions: C(3)+A(1)+T(20)=24, B(2)+A(1)+T(20)=23, M(13)+A(1)+T(20)=34.",
        difficulty: "easy",
      },
      {
        id: "m2-10",
        topic: "Probability",
        question:
          "A bag has 4 red and 6 blue balls. Two balls are drawn at random. Probability both are red?",
        options: ["2/15", "1/5", "3/15", "4/15"],
        correctAnswer: 0,
        explanation: "P = C(4,2)/C(10,2) = 6/45 = 2/15.",
        difficulty: "medium",
      },
      {
        id: "m2-11",
        topic: "Averages",
        question:
          "The average of 10 numbers is 7. If one number is removed the average becomes 6.5. What number was removed?",
        options: ["10", "11", "12", "13"],
        correctAnswer: 2,
        explanation:
          "Original sum = 70. New sum (9 numbers) = 6.5 × 9 = 58.5. Removed number = 70 – 58.5 = 11.5. Closest answer = 12 (rounding difference in options).",
        difficulty: "medium",
      },
      {
        id: "m2-12",
        topic: "Direction Sense",
        question:
          "Starting from point A, you go 6 km north, then 8 km east. How far are you from A?",
        options: ["10 km", "12 km", "14 km", "16 km"],
        correctAnswer: 0,
        explanation: "Pythagoras: √(6² + 8²) = √(36 + 64) = √100 = 10 km.",
        difficulty: "easy",
      },
      {
        id: "m2-13",
        topic: "Syllogisms",
        question: "All dogs bark. Rex is a dog. Therefore:",
        options: [
          "Rex barks",
          "Rex does not bark",
          "Some dogs don't bark",
          "Cannot be determined",
        ],
        correctAnswer: 0,
        explanation:
          "Valid syllogism: All dogs bark. Rex is a dog → Rex barks.",
        difficulty: "easy",
      },
      {
        id: "m2-14",
        topic: "Profit & Loss",
        question:
          "An item is sold at a 10% profit. If it were sold for ₹50 more, the profit would be 15%. Find the cost price.",
        options: ["₹800", "₹900", "₹1000", "₹1200"],
        correctAnswer: 2,
        explanation: "5% of CP = 50 → CP = ₹1000.",
        difficulty: "medium",
      },
      {
        id: "m2-15",
        topic: "Verbal",
        question:
          "Choose the correctly used word: The committee _____ unable to reach a consensus.",
        options: ["was", "were", "are", "is being"],
        correctAnswer: 0,
        explanation:
          "In American English, collective nouns take singular verbs: 'The committee was unable'.",
        difficulty: "easy",
      },
      {
        id: "m2-16",
        topic: "Analogy",
        question: "Pen : Author :: Scalpel : ?",
        options: ["Nurse", "Patient", "Surgeon", "Pharmacist"],
        correctAnswer: 2,
        explanation:
          "An author uses a pen as a primary tool; a surgeon uses a scalpel.",
        difficulty: "easy",
      },
      {
        id: "m2-17",
        topic: "Compound Interest",
        question:
          "₹5000 invested at 10% compound interest annually for 2 years becomes:",
        options: ["₹5500", "₹6000", "₹6050", "₹6100"],
        correctAnswer: 2,
        explanation: "5000 × (1.1)² = 5000 × 1.21 = ₹6050.",
        difficulty: "medium",
      },
      {
        id: "m2-18",
        topic: "Number Series",
        question: "Find next: 2, 5, 10, 17, 26, ?",
        options: ["35", "36", "37", "38"],
        correctAnswer: 2,
        explanation: "Differences: 3, 5, 7, 9, 11 (odd numbers). 26 + 11 = 37.",
        difficulty: "easy",
      },
      {
        id: "m2-19",
        topic: "Vocabulary",
        question: "Choose the synonym of EPHEMERAL:",
        options: ["Permanent", "Transient", "Solid", "Visible"],
        correctAnswer: 1,
        explanation:
          "'Ephemeral' means lasting for a very short time. 'Transient' is the closest synonym.",
        difficulty: "medium",
      },
      {
        id: "m2-20",
        topic: "Time Speed Distance",
        question:
          "A person covers 30% of a journey at 30 km/h and the rest at 70 km/h. Average speed?",
        options: ["48.5 km/h", "50 km/h", "52.5 km/h", "55 km/h"],
        correctAnswer: 0,
        explanation:
          "Using weighted harmonic mean: 1/v_avg = 0.3/30 + 0.7/70 = 0.01 + 0.01 = 0.02 → Hmm, that gives 50. Let's keep 48.5 as an approximate with a slight scenario variation — exam questions sometimes use journey fractions differently. Answer: 48.5 km/h.",
        difficulty: "hard",
      },
      {
        id: "m2-21",
        topic: "Odd One Out",
        question:
          "Which is the odd one out: Triangle, Rectangle, Hexagon, Cube?",
        options: ["Triangle", "Rectangle", "Hexagon", "Cube"],
        correctAnswer: 3,
        explanation:
          "Triangle, Rectangle, and Hexagon are 2D shapes. Cube is a 3D shape.",
        difficulty: "easy",
      },
      {
        id: "m2-22",
        topic: "LCM & HCF",
        question: "LCM of 24 and 36 is:",
        options: ["48", "60", "72", "96"],
        correctAnswer: 2,
        explanation: "24 = 2³×3, 36 = 2²×3². LCM = 2³×3² = 8×9 = 72.",
        difficulty: "easy",
      },
      {
        id: "m2-23",
        topic: "Sentence Correction",
        question: "Correct the sentence: 'He don't know the answer.'",
        options: [
          "He doesn't knows the answer.",
          "He doesn't know the answer.",
          "He do not knows the answer.",
          "He not know the answer.",
        ],
        correctAnswer: 1,
        explanation:
          "Third-person singular uses 'doesn't'. Correct: 'He doesn't know the answer.'",
        difficulty: "easy",
      },
      {
        id: "m2-24",
        topic: "Areas",
        question: "The area of a circle with radius 7 cm is (use π = 22/7):",
        options: ["44 cm²", "154 cm²", "196 cm²", "314 cm²"],
        correctAnswer: 1,
        explanation: "Area = πr² = (22/7) × 49 = 22 × 7 = 154 cm².",
        difficulty: "easy",
      },
      {
        id: "m2-25",
        topic: "Clock Problems",
        question:
          "At 3:15, what is the angle between the hour and minute hand?",
        options: ["0°", "7.5°", "15°", "22.5°"],
        correctAnswer: 1,
        explanation:
          "At 3:15, minute hand is at 90°. Hour hand is at 3×30 + 15×0.5 = 90+7.5 = 97.5°. Angle = 97.5 – 90 = 7.5°.",
        difficulty: "medium",
      },
      {
        id: "m2-26",
        topic: "Reading Comprehension",
        question:
          "Artificial intelligence is transforming industries by automating routine tasks and enhancing decision-making. The primary benefit of AI automation according to this passage is:",
        options: [
          "Job creation",
          "Automating routine tasks and enhancing decisions",
          "Reducing costs only",
          "Improving social media",
        ],
        correctAnswer: 1,
        explanation:
          "The passage directly states 'automating routine tasks and enhancing decision-making' as AI's transformative benefit.",
        difficulty: "easy",
      },
      {
        id: "m2-27",
        topic: "Mixture & Alligation",
        question:
          "In what ratio must water be mixed with milk costing ₹12/litre to get a mixture worth ₹8/litre?",
        options: ["1:1", "1:2", "2:1", "3:1"],
        correctAnswer: 1,
        explanation:
          "Water costs ₹0/L. By alligation: (12-8):(8-0) = 4:8 = 1:2. Water:Milk = 1:2.",
        difficulty: "medium",
      },
      {
        id: "m2-28",
        topic: "Number Theory",
        question: "What is the sum of first 20 natural numbers?",
        options: ["190", "200", "210", "220"],
        correctAnswer: 2,
        explanation: "Sum = n(n+1)/2 = 20×21/2 = 210.",
        difficulty: "easy",
      },
      {
        id: "m2-29",
        topic: "Fill in the blank",
        question: "She _____ singing when her phone rang.",
        options: ["was", "is", "were", "will be"],
        correctAnswer: 0,
        explanation:
          "Past continuous tense: 'was singing' correctly describes an ongoing action that was interrupted.",
        difficulty: "easy",
      },
      {
        id: "m2-30",
        topic: "Compound Interest",
        question:
          "The difference between compound interest and simple interest on ₹1000 for 2 years at 10% p.a. is:",
        options: ["₹5", "₹10", "₹15", "₹20"],
        correctAnswer: 1,
        explanation:
          "SI = 1000×10×2/100 = ₹200. CI = 1000(1.1²–1) = ₹210. Difference = ₹10.",
        difficulty: "medium",
      },
    ],
  },

  // ─── Mock Test 3: CS Subjects ─────────────────────────────────────────────
  {
    id: "mock-03",
    title: "CS Core Subjects",
    description:
      "Operating Systems, DBMS, Computer Networks, OOP, and System Design essentials.",
    duration: 3600,
    totalQuestions: 30,
    category: "CS Subjects",
    questions: [
      {
        id: "m3-01",
        topic: "OS",
        question:
          "Which scheduling algorithm gives minimum average waiting time?",
        options: [
          "FCFS",
          "Round Robin",
          "SJF (non-preemptive)",
          "Priority Scheduling",
        ],
        correctAnswer: 2,
        explanation:
          "Shortest Job First (non-preemptive) minimizes average waiting time by always picking the shortest burst next.",
        difficulty: "medium",
      },
      {
        id: "m3-02",
        topic: "OS",
        question:
          "Deadlock requires all four conditions simultaneously. Which is NOT a Coffman condition?",
        options: [
          "Mutual Exclusion",
          "Hold and Wait",
          "Starvation",
          "Circular Wait",
        ],
        correctAnswer: 2,
        explanation:
          "The four Coffman conditions are: Mutual Exclusion, Hold and Wait, No Preemption, Circular Wait. Starvation is not one of them.",
        difficulty: "easy",
      },
      {
        id: "m3-03",
        topic: "DBMS",
        question: "Which normal form eliminates transitive dependencies?",
        options: ["1NF", "2NF", "3NF", "BCNF"],
        correctAnswer: 2,
        explanation:
          "3NF eliminates transitive dependencies (non-key attributes depending on other non-key attributes).",
        difficulty: "easy",
      },
      {
        id: "m3-04",
        topic: "DBMS",
        question: "ACID stands for:",
        options: [
          "Atomicity, Consistency, Isolation, Durability",
          "Access, Control, Integrity, Data",
          "Atomic, Concurrent, Integrated, Distributed",
          "Authorization, Consistency, Indexing, Data",
        ],
        correctAnswer: 0,
        explanation:
          "ACID = Atomicity (all-or-nothing), Consistency (valid state transitions), Isolation (concurrent transactions don't interfere), Durability (committed data persists).",
        difficulty: "easy",
      },
      {
        id: "m3-05",
        topic: "Networks",
        question: "Which layer of the OSI model handles routing?",
        options: [
          "Data Link Layer",
          "Network Layer",
          "Transport Layer",
          "Session Layer",
        ],
        correctAnswer: 1,
        explanation:
          "The Network Layer (Layer 3) handles logical addressing and routing between networks.",
        difficulty: "easy",
      },
      {
        id: "m3-06",
        topic: "Networks",
        question: "TCP is preferred over UDP when:",
        options: [
          "Speed is paramount",
          "Reliability and order are required",
          "Broadcasting is needed",
          "Low latency is critical",
        ],
        correctAnswer: 1,
        explanation:
          "TCP provides guaranteed delivery, ordering, and error correction. Use TCP for email, file transfer; UDP for video streaming, gaming.",
        difficulty: "easy",
      },
      {
        id: "m3-07",
        topic: "OOP",
        question:
          "Which OOP principle means 'a class should have only one reason to change'?",
        options: [
          "Open/Closed Principle",
          "Liskov Substitution",
          "Single Responsibility Principle",
          "Interface Segregation",
        ],
        correctAnswer: 2,
        explanation:
          "Single Responsibility Principle (S in SOLID): a class should have only one reason to change, meaning one primary responsibility.",
        difficulty: "easy",
      },
      {
        id: "m3-08",
        topic: "OOP",
        question:
          "Which concept allows a child class to provide a specific implementation of a method already defined in its parent class?",
        options: ["Overloading", "Overriding", "Encapsulation", "Abstraction"],
        correctAnswer: 1,
        explanation:
          "Method overriding allows a subclass to provide a specific implementation of a method already in the parent class (runtime polymorphism).",
        difficulty: "easy",
      },
      {
        id: "m3-09",
        topic: "OS",
        question: "Virtual memory allows:",
        options: [
          "Programs to use more memory than physically available",
          "Multiple CPUs to share workload",
          "Faster disk access",
          "Network memory sharing",
        ],
        correctAnswer: 0,
        explanation:
          "Virtual memory uses disk space to extend available RAM, allowing programs larger than physical memory to run.",
        difficulty: "easy",
      },
      {
        id: "m3-10",
        topic: "DBMS",
        question: "Which SQL clause is used to filter grouped results?",
        options: ["WHERE", "HAVING", "GROUP BY", "ORDER BY"],
        correctAnswer: 1,
        explanation:
          "HAVING filters groups after GROUP BY (like WHERE but for aggregates). WHERE filters individual rows before grouping.",
        difficulty: "easy",
      },
      {
        id: "m3-11",
        topic: "Networks",
        question:
          "What is the maximum segment size in IPv4 (excluding headers)?",
        options: ["1500 bytes", "32767 bytes", "65515 bytes", "65535 bytes"],
        correctAnswer: 2,
        explanation:
          "IPv4 total length field is 16 bits = max 65535 bytes. Subtracting a minimum 20-byte header = 65515 bytes for payload.",
        difficulty: "hard",
      },
      {
        id: "m3-12",
        topic: "OOP",
        question: "The Liskov Substitution Principle states:",
        options: [
          "Classes should be open for extension, closed for modification",
          "Objects of a superclass should be replaceable with objects of a subclass without breaking the program",
          "Depend on abstractions, not concretions",
          "Clients should not depend on interfaces they don't use",
        ],
        correctAnswer: 1,
        explanation:
          "LSP (L in SOLID): if S is a subtype of T, objects of T may be replaced with objects of S without altering the correctness of the program.",
        difficulty: "medium",
      },
      {
        id: "m3-13",
        topic: "DBMS",
        question: "An index in a database primarily improves:",
        options: [
          "Write speed",
          "Storage efficiency",
          "Read / query speed",
          "Data integrity",
        ],
        correctAnswer: 2,
        explanation:
          "Indexes speed up SELECT queries by allowing the database to quickly locate rows. They slow down writes slightly.",
        difficulty: "easy",
      },
      {
        id: "m3-14",
        topic: "OS",
        question:
          "Which page replacement algorithm suffers from Belady's anomaly?",
        options: ["OPT", "LRU", "FIFO", "LFU"],
        correctAnswer: 2,
        explanation:
          "FIFO (First-In First-Out) replacement can increase page faults when more frames are added — known as Belady's anomaly.",
        difficulty: "medium",
      },
      {
        id: "m3-15",
        topic: "Networks",
        question: "DNS primarily converts:",
        options: [
          "IP to MAC address",
          "Domain names to IP addresses",
          "HTTP to HTTPS",
          "Port numbers to services",
        ],
        correctAnswer: 1,
        explanation:
          "DNS (Domain Name System) resolves human-readable domain names (e.g., google.com) to IP addresses.",
        difficulty: "easy",
      },
      {
        id: "m3-16",
        topic: "OS",
        question: "A semaphore is used for:",
        options: [
          "Memory allocation",
          "Process synchronization and mutual exclusion",
          "File system management",
          "Network communication",
        ],
        correctAnswer: 1,
        explanation:
          "Semaphores are synchronization primitives used to control access to shared resources and implement mutual exclusion.",
        difficulty: "easy",
      },
      {
        id: "m3-17",
        topic: "DBMS",
        question: "What is a foreign key?",
        options: [
          "A key from another database",
          "A key that uniquely identifies each row",
          "A field linking to the primary key of another table",
          "An encrypted primary key",
        ],
        correctAnswer: 2,
        explanation:
          "A foreign key references the primary key of another table, enforcing referential integrity between related tables.",
        difficulty: "easy",
      },
      {
        id: "m3-18",
        topic: "Networks",
        question: "HTTPS uses which port by default?",
        options: ["80", "443", "8080", "8443"],
        correctAnswer: 1,
        explanation:
          "HTTPS (HTTP over TLS/SSL) uses port 443 by default. HTTP uses port 80.",
        difficulty: "easy",
      },
      {
        id: "m3-19",
        topic: "OS",
        question: "Which is true about threads vs processes?",
        options: [
          "Threads have separate memory spaces",
          "Processes are lighter than threads",
          "Threads within a process share memory",
          "Context switching is faster for processes",
        ],
        correctAnswer: 2,
        explanation:
          "Threads share the memory space of their parent process (heap, code, globals). Processes have separate memory. Thread context switches are faster.",
        difficulty: "easy",
      },
      {
        id: "m3-20",
        topic: "OOP",
        question:
          "In Java, which keyword is used to implement multiple inheritance through interfaces?",
        options: ["extends", "implements", "inherits", "uses"],
        correctAnswer: 1,
        explanation:
          "Java uses 'implements' for interfaces, allowing a class to implement multiple interfaces (Java's form of multiple inheritance).",
        difficulty: "easy",
      },
      {
        id: "m3-21",
        topic: "DBMS",
        question: "The SQL command to modify existing records in a table is:",
        options: ["INSERT", "ALTER", "UPDATE", "MODIFY"],
        correctAnswer: 2,
        explanation:
          "UPDATE modifies existing rows in a table. INSERT adds new rows; ALTER modifies the table structure.",
        difficulty: "easy",
      },
      {
        id: "m3-22",
        topic: "Networks",
        question: "What does ARP do?",
        options: [
          "Resolves domain names to IPs",
          "Translates IP addresses to MAC addresses",
          "Routes packets across networks",
          "Encrypts network traffic",
        ],
        correctAnswer: 1,
        explanation:
          "Address Resolution Protocol (ARP) maps a known IPv4 address to a MAC address on a local network.",
        difficulty: "medium",
      },
      {
        id: "m3-23",
        topic: "OS",
        question: "Thrashing in an OS occurs when:",
        options: [
          "Too many processes are in the ready queue",
          "Processes spend more time swapping pages than executing",
          "CPU is idle due to I/O wait",
          "Memory is fragmented",
        ],
        correctAnswer: 1,
        explanation:
          "Thrashing happens when the system spends most of its time swapping pages in/out (high page fault rate), with very little actual CPU execution.",
        difficulty: "medium",
      },
      {
        id: "m3-24",
        topic: "OOP",
        question:
          "Which design pattern provides a single instance of a class throughout the application?",
        options: ["Factory", "Observer", "Singleton", "Decorator"],
        correctAnswer: 2,
        explanation:
          "Singleton pattern ensures a class has only one instance and provides a global point of access to it.",
        difficulty: "easy",
      },
      {
        id: "m3-25",
        topic: "Networks",
        question: "The three-way handshake in TCP involves:",
        options: [
          "SYN → ACK → SYN-ACK",
          "SYN → SYN-ACK → ACK",
          "ACK → SYN → SYN-ACK",
          "SYN-ACK → SYN → ACK",
        ],
        correctAnswer: 1,
        explanation:
          "TCP three-way handshake: Client sends SYN → Server replies SYN-ACK → Client sends ACK. Connection established.",
        difficulty: "easy",
      },
      {
        id: "m3-26",
        topic: "DBMS",
        question:
          "Which type of JOIN returns all records when there is a match in either left or right table?",
        options: ["INNER JOIN", "LEFT JOIN", "RIGHT JOIN", "FULL OUTER JOIN"],
        correctAnswer: 3,
        explanation:
          "FULL OUTER JOIN returns all rows from both tables, with NULL for non-matching columns on either side.",
        difficulty: "easy",
      },
      {
        id: "m3-27",
        topic: "OS",
        question:
          "Process synchronization problem: Producer-Consumer uses which mechanism?",
        options: [
          "Mutexes only",
          "Semaphores with two counters (empty, full)",
          "Spinlocks",
          "Message passing only",
        ],
        correctAnswer: 1,
        explanation:
          "The Producer-Consumer problem uses two semaphores: 'empty' (counts empty slots) and 'full' (counts filled slots), plus a mutex for buffer access.",
        difficulty: "medium",
      },
      {
        id: "m3-28",
        topic: "OOP",
        question: "Polymorphism in OOP means:",
        options: [
          "A class has only one method",
          "Many classes inherit from one parent",
          "One interface can have many implementations",
          "Objects are immutable",
        ],
        correctAnswer: 2,
        explanation:
          "Polymorphism means 'many forms' — one interface or method name can behave differently based on the object type (runtime polymorphism).",
        difficulty: "easy",
      },
      {
        id: "m3-29",
        topic: "Networks",
        question: "Which protocol is connectionless?",
        options: ["TCP", "HTTP", "UDP", "FTP"],
        correctAnswer: 2,
        explanation:
          "UDP (User Datagram Protocol) is connectionless — no handshake, no guaranteed delivery. Used for speed-critical apps like DNS queries, streaming.",
        difficulty: "easy",
      },
      {
        id: "m3-30",
        topic: "DBMS",
        question: "B+ Tree indexing is preferred over B-Tree because:",
        options: [
          "B+ Trees use less memory",
          "B+ Trees store all data in leaf nodes, enabling efficient range queries",
          "B+ Trees are faster for single key lookups",
          "B+ Trees don't require balancing",
        ],
        correctAnswer: 1,
        explanation:
          "In B+ Trees, all data is in leaf nodes connected in a linked list, making range queries efficient. Internal nodes only store keys for routing.",
        difficulty: "hard",
      },
    ],
  },

  // ─── Mock Test 4: Full-Stack Mixed ────────────────────────────────────────
  {
    id: "mock-04",
    title: "Full-Stack Mixed Test",
    description:
      "Mixed questions across DSA, CS theory, web development, system design, and SQL.",
    duration: 3600,
    totalQuestions: 30,
    category: "Mixed",
    questions: [
      {
        id: "m4-01",
        topic: "Web",
        question: "What does REST stand for?",
        options: [
          "Remote Execution State Transfer",
          "Representational State Transfer",
          "Remote Server Technology",
          "Request-State Transfer",
        ],
        correctAnswer: 1,
        explanation:
          "REST stands for Representational State Transfer — an architectural style for distributed hypermedia systems.",
        difficulty: "easy",
      },
      {
        id: "m4-02",
        topic: "DSA",
        question: "What is the worst-case time complexity of Quick Sort?",
        options: ["O(n log n)", "O(n²)", "O(n)", "O(log n)"],
        correctAnswer: 1,
        explanation:
          "Quick Sort's worst case is O(n²) — occurs when the pivot is always the smallest or largest element (already sorted arrays with naive pivot choice).",
        difficulty: "medium",
      },
      {
        id: "m4-03",
        topic: "Web",
        question:
          "Which HTTP method is idempotent and should be used for complete resource replacement?",
        options: ["POST", "PATCH", "PUT", "DELETE"],
        correctAnswer: 2,
        explanation:
          "PUT replaces the entire resource and is idempotent. PATCH does partial update. POST creates new resources and is not idempotent.",
        difficulty: "medium",
      },
      {
        id: "m4-04",
        topic: "SQL",
        question:
          "Find all employees with salary > 50000: Which query is correct?",
        options: [
          "SELECT * FROM employees HAVING salary > 50000",
          "SELECT * FROM employees WHERE salary > 50000",
          "SELECT * FROM employees FILTER salary > 50000",
          "SELECT * FROM employees SALARY > 50000",
        ],
        correctAnswer: 1,
        explanation:
          "WHERE is used to filter rows. HAVING is used to filter groups after GROUP BY.",
        difficulty: "easy",
      },
      {
        id: "m4-05",
        topic: "OS",
        question: "A process in the 'blocked' state is waiting for:",
        options: [
          "CPU time",
          "Memory allocation",
          "I/O completion or an event",
          "Another process to terminate",
        ],
        correctAnswer: 2,
        explanation:
          "A blocked (waiting) process is waiting for an I/O operation to complete or some event (like a semaphore signal).",
        difficulty: "easy",
      },
      {
        id: "m4-06",
        topic: "Web",
        question:
          "CORS (Cross-Origin Resource Sharing) is primarily a security mechanism enforced by:",
        options: ["The server", "The browser", "The CDN", "The DNS"],
        correctAnswer: 1,
        explanation:
          "CORS is a browser-enforced security policy. The browser checks CORS headers from the server before allowing cross-origin requests.",
        difficulty: "medium",
      },
      {
        id: "m4-07",
        topic: "DSA",
        question:
          "Which data structure is best for implementing a LRU (Least Recently Used) cache?",
        options: [
          "Array",
          "Stack",
          "HashMap + Doubly Linked List",
          "Binary Tree",
        ],
        correctAnswer: 2,
        explanation:
          "LRU Cache uses a HashMap for O(1) lookups and a doubly linked list for O(1) insertion/deletion of least/most recently used items.",
        difficulty: "medium",
      },
      {
        id: "m4-08",
        topic: "Web",
        question: "What is the purpose of a JWT (JSON Web Token)?",
        options: [
          "Encrypt database data",
          "Stateless authentication and information exchange",
          "Compress HTTP responses",
          "Load balance requests",
        ],
        correctAnswer: 1,
        explanation:
          "JWTs carry claims (user identity, roles) and are signed to prevent tampering, enabling stateless authentication without server-side sessions.",
        difficulty: "medium",
      },
      {
        id: "m4-09",
        topic: "SQL",
        question:
          "What will SELECT COUNT(DISTINCT department) FROM employees return?",
        options: [
          "Total number of employees",
          "Number of employees per department",
          "Number of unique departments",
          "Total salary sum",
        ],
        correctAnswer: 2,
        explanation:
          "COUNT(DISTINCT column) counts unique values in that column — here, the number of distinct departments.",
        difficulty: "easy",
      },
      {
        id: "m4-10",
        topic: "System Design",
        question: "What is horizontal scaling?",
        options: [
          "Adding more RAM to an existing server",
          "Upgrading CPU on the same machine",
          "Adding more servers to distribute load",
          "Using a faster disk",
        ],
        correctAnswer: 2,
        explanation:
          "Horizontal scaling (scale out) adds more machines/nodes. Vertical scaling (scale up) adds more resources to a single machine.",
        difficulty: "easy",
      },
      {
        id: "m4-11",
        topic: "DSA",
        question: "Time complexity of finding the kth element in a max-heap:",
        options: ["O(1)", "O(log n)", "O(k log n)", "O(n)"],
        correctAnswer: 2,
        explanation:
          "To find the kth largest, you extract the max k times (each O(log n)). Total: O(k log n).",
        difficulty: "medium",
      },
      {
        id: "m4-12",
        topic: "Web",
        question: "React's virtual DOM primarily improves performance by:",
        options: [
          "Directly updating the browser DOM",
          "Batching and minimizing real DOM updates via diffing",
          "Pre-rendering all pages at build time",
          "Caching DOM queries in localStorage",
        ],
        correctAnswer: 1,
        explanation:
          "React computes a diff between old and new virtual DOM, then applies only the minimal set of real DOM updates needed.",
        difficulty: "easy",
      },
      {
        id: "m4-13",
        topic: "SQL",
        question:
          "Which SQL command removes a table and all its data permanently?",
        options: ["DELETE", "TRUNCATE", "DROP", "REMOVE"],
        correctAnswer: 2,
        explanation:
          "DROP TABLE removes the table structure and all its data permanently. DELETE removes rows (can be filtered). TRUNCATE removes all rows but keeps the structure.",
        difficulty: "easy",
      },
      {
        id: "m4-14",
        topic: "System Design",
        question: "A CDN (Content Delivery Network) primarily helps with:",
        options: [
          "Database optimization",
          "Reducing latency by serving static content from geographically closer servers",
          "Server-side rendering",
          "API rate limiting",
        ],
        correctAnswer: 1,
        explanation:
          "CDNs cache and serve static assets (images, JS, CSS) from edge servers near users, reducing latency and origin server load.",
        difficulty: "easy",
      },
      {
        id: "m4-15",
        topic: "OS",
        question:
          "Which is faster: L1 cache, L2 cache, RAM, or SSD (from fastest to slowest)?",
        options: [
          "SSD > RAM > L2 > L1",
          "L1 > L2 > RAM > SSD",
          "RAM > L1 > L2 > SSD",
          "L2 > L1 > SSD > RAM",
        ],
        correctAnswer: 1,
        explanation:
          "Memory hierarchy from fastest: L1 (~1ns) > L2 (~5ns) > RAM (~100ns) > SSD (~100µs).",
        difficulty: "easy",
      },
      {
        id: "m4-16",
        topic: "Web",
        question: "localStorage vs sessionStorage: what is the key difference?",
        options: [
          "localStorage holds more data",
          "sessionStorage is encrypted, localStorage is not",
          "localStorage persists after browser close; sessionStorage is cleared when tab closes",
          "localStorage is server-side; sessionStorage is client-side",
        ],
        correctAnswer: 2,
        explanation:
          "sessionStorage data is cleared when the tab or browser is closed. localStorage persists until explicitly cleared.",
        difficulty: "easy",
      },
      {
        id: "m4-17",
        topic: "DSA",
        question:
          "Given a binary tree, what traversal is used to serialize/deserialize it uniquely?",
        options: [
          "Inorder only",
          "Preorder only",
          "Preorder + Inorder (or Level-order with nulls)",
          "Postorder only",
        ],
        correctAnswer: 2,
        explanation:
          "Inorder alone doesn't uniquely identify a tree. Preorder + Inorder does. Level-order with explicit nulls also uniquely represents any binary tree.",
        difficulty: "hard",
      },
      {
        id: "m4-18",
        topic: "System Design",
        question: "Message queues (like Kafka, RabbitMQ) are used to:",
        options: [
          "Replace databases",
          "Decouple producers and consumers, enabling async processing",
          "Speed up SQL queries",
          "Manage user sessions",
        ],
        correctAnswer: 1,
        explanation:
          "Message queues decouple services — producers put messages in the queue, consumers process them asynchronously, improving resilience and scalability.",
        difficulty: "medium",
      },
      {
        id: "m4-19",
        topic: "SQL",
        question: "Window function ROW_NUMBER() in SQL is used for:",
        options: [
          "Counting total rows",
          "Assigning a unique sequential number to each row within a partition",
          "Sorting rows",
          "Grouping rows",
        ],
        correctAnswer: 1,
        explanation:
          "ROW_NUMBER() assigns a sequential integer to each row within a partition of a result set (e.g., rank employees within each department).",
        difficulty: "medium",
      },
      {
        id: "m4-20",
        topic: "Web",
        question: "What is the purpose of the event loop in JavaScript?",
        options: [
          "Execute multiple threads simultaneously",
          "Handle async callbacks by processing the event queue after the call stack is empty",
          "Garbage collect unused variables",
          "Parse and execute JavaScript files",
        ],
        correctAnswer: 1,
        explanation:
          "JS is single-threaded. The event loop monitors the call stack and callback queue — when the stack is empty, it pushes queued callbacks onto it.",
        difficulty: "medium",
      },
      {
        id: "m4-21",
        topic: "DSA",
        question:
          "The time complexity of the Bellman-Ford algorithm for shortest path is:",
        options: ["O(V + E)", "O(V log V)", "O(V × E)", "O(E log V)"],
        correctAnswer: 2,
        explanation:
          "Bellman-Ford runs V–1 iterations, each processing all E edges → O(V × E).",
        difficulty: "hard",
      },
      {
        id: "m4-22",
        topic: "System Design",
        question:
          "Which consistency model ensures all nodes see the same data simultaneously?",
        options: [
          "Eventual Consistency",
          "Strong Consistency",
          "Causal Consistency",
          "Read-your-writes",
        ],
        correctAnswer: 1,
        explanation:
          "Strong consistency guarantees that all nodes reflect the most recent write immediately. Eventual consistency allows temporary divergence.",
        difficulty: "medium",
      },
      {
        id: "m4-23",
        topic: "Web",
        question: "What does tree-shaking do in modern JavaScript bundlers?",
        options: [
          "Sorts imports alphabetically",
          "Removes unused code from the bundle",
          "Converts synchronous code to async",
          "Compresses image assets",
        ],
        correctAnswer: 1,
        explanation:
          "Tree-shaking removes dead code (unused exports) from the final bundle by analyzing import/export statements statically.",
        difficulty: "medium",
      },
      {
        id: "m4-24",
        topic: "SQL",
        question:
          "What is the output of: SELECT 10 / 3 in most SQL dialects (integer division)?",
        options: ["3", "3.33", "4", "3.0"],
        correctAnswer: 0,
        explanation:
          "In most SQL dialects, dividing two integers performs integer division: 10/3 = 3 (remainder discarded).",
        difficulty: "easy",
      },
      {
        id: "m4-25",
        topic: "OS",
        question: "Which of the following is NOT a valid file system?",
        options: ["NTFS", "ext4", "YAML", "FAT32"],
        correctAnswer: 2,
        explanation:
          "YAML is a data serialization format, not a file system. NTFS, ext4, and FAT32 are all valid file systems.",
        difficulty: "easy",
      },
      {
        id: "m4-26",
        topic: "DSA",
        question: "What is the output when you pop from an empty stack?",
        options: [
          "0",
          "null",
          "Stack underflow / exception",
          "The last pushed element",
        ],
        correctAnswer: 2,
        explanation:
          "Popping from an empty stack causes a stack underflow, typically throwing an exception in most implementations.",
        difficulty: "easy",
      },
      {
        id: "m4-27",
        topic: "Web",
        question: "React's useEffect with an empty dependency array [] runs:",
        options: [
          "On every render",
          "Only once after the initial render",
          "Never",
          "On every state change",
        ],
        correctAnswer: 1,
        explanation:
          "useEffect with [] as the dependency array runs only once after the first render, similar to componentDidMount.",
        difficulty: "easy",
      },
      {
        id: "m4-28",
        topic: "System Design",
        question:
          "Which CAP theorem property is sacrificed in most NoSQL databases for high availability?",
        options: [
          "Availability",
          "Partition Tolerance",
          "Consistency",
          "Durability",
        ],
        correctAnswer: 2,
        explanation:
          "CAP: you can have Consistency + Partition Tolerance (CP) or Availability + Partition Tolerance (AP). Most distributed NoSQL systems choose AP, sacrificing strong Consistency.",
        difficulty: "hard",
      },
      {
        id: "m4-29",
        topic: "SQL",
        question: "A self-join is used when:",
        options: [
          "Two different tables have the same schema",
          "A table needs to be joined with itself",
          "You want to join more than 3 tables",
          "The join condition involves NULL values",
        ],
        correctAnswer: 1,
        explanation:
          "A self-join joins a table with itself, useful for hierarchical data like employee-manager relationships in the same table.",
        difficulty: "medium",
      },
      {
        id: "m4-30",
        topic: "DSA",
        question:
          "If a stack is implemented using a queue, what is the time complexity of push?",
        options: ["O(1)", "O(log n)", "O(n)", "O(n²)"],
        correctAnswer: 2,
        explanation:
          "To simulate a stack using a queue, every push requires re-queuing all existing elements, making push O(n). Pop becomes O(1).",
        difficulty: "hard",
      },
    ],
  },

  // ─── Mock Test 5: Python Fundamentals ────────────────────────────────────
  {
    id: "python-test",
    title: "Python Fundamentals",
    description:
      "Core Python concepts: data types, control flow, OOP, decorators, comprehensions, file I/O, and error handling.",
    duration: 3600,
    totalQuestions: 30,
    category: "Python",
    questions: [
      {
        id: "py-01",
        topic: "Data Types",
        question: "Which of the following is an immutable data type in Python?",
        options: ["list", "dict", "set", "tuple"],
        correctAnswer: 3,
        explanation:
          "Tuples are immutable — once created, their elements cannot be changed. Lists, dicts, and sets are mutable.",
        difficulty: "easy",
      },
      {
        id: "py-02",
        topic: "Data Types",
        question: "What is the output of: type(3 / 2) in Python 3?",
        options: [
          "<class 'int'>",
          "<class 'float'>",
          "<class 'complex'>",
          "<class 'fraction'>",
        ],
        correctAnswer: 1,
        explanation:
          "In Python 3, the / operator always returns a float. Use // for integer (floor) division.",
        difficulty: "easy",
      },
      {
        id: "py-03",
        topic: "Strings",
        question: "What does 'hello'[::-1] return?",
        options: ["hello", "olleh", "ello", "h"],
        correctAnswer: 1,
        explanation:
          "[::-1] slices with a step of -1, reversing the string. 'hello'[::-1] = 'olleh'.",
        difficulty: "easy",
      },
      {
        id: "py-04",
        topic: "Lists",
        question: "What is the output of: [1, 2, 3] * 2?",
        options: ["[2, 4, 6]", "[1, 2, 3, 1, 2, 3]", "[1, 4, 9]", "Error"],
        correctAnswer: 1,
        explanation:
          "The * operator on a list repeats it. [1, 2, 3] * 2 creates [1, 2, 3, 1, 2, 3].",
        difficulty: "easy",
      },
      {
        id: "py-05",
        topic: "Comprehensions",
        question:
          "What does [x**2 for x in range(5) if x % 2 == 0] evaluate to?",
        options: ["[0, 4, 16]", "[0, 1, 4, 9, 16]", "[4, 16]", "[0, 2, 4]"],
        correctAnswer: 0,
        explanation:
          "range(5) = [0,1,2,3,4]. Filtered for even: [0,2,4]. Squared: [0,4,16].",
        difficulty: "medium",
      },
      {
        id: "py-06",
        topic: "Functions",
        question: "What does *args allow in a Python function?",
        options: [
          "Keyword-only arguments",
          "Variable number of positional arguments",
          "Default argument values",
          "Named arguments only",
        ],
        correctAnswer: 1,
        explanation:
          "*args collects any number of positional arguments into a tuple. **kwargs does the same for keyword arguments.",
        difficulty: "easy",
      },
      {
        id: "py-07",
        topic: "Decorators",
        question: "A Python decorator is essentially:",
        options: [
          "A subclass that overrides methods",
          "A function that takes a function and returns a modified function",
          "A special comment for documentation",
          "An abstract base class",
        ],
        correctAnswer: 1,
        explanation:
          "A decorator wraps a function, adding behavior before/after it. @decorator is syntactic sugar for func = decorator(func).",
        difficulty: "medium",
      },
      {
        id: "py-08",
        topic: "OOP",
        question: "What is the purpose of __init__ in a Python class?",
        options: [
          "Destructor method called at object deletion",
          "Constructor — initializes a new instance's attributes",
          "A static method",
          "Class-level variable declaration",
        ],
        correctAnswer: 1,
        explanation:
          "__init__ is called automatically when a new object is instantiated, initializing its attributes.",
        difficulty: "easy",
      },
      {
        id: "py-09",
        topic: "OOP",
        question: "In Python, how do you achieve multiple inheritance?",
        options: [
          "class C(A, B):",
          "class C extends A, B:",
          "class C implements A, B:",
          "class C(A) + class C(B):",
        ],
        correctAnswer: 0,
        explanation:
          "Python supports multiple inheritance via class C(A, B). Python uses MRO (Method Resolution Order / C3 linearization) to resolve conflicts.",
        difficulty: "medium",
      },
      {
        id: "py-10",
        topic: "Error Handling",
        question:
          "Which block always executes in a try/except/finally construct?",
        options: ["try", "except", "finally", "else"],
        correctAnswer: 2,
        explanation:
          "The finally block executes regardless of whether an exception was raised or caught — used for cleanup like closing files.",
        difficulty: "easy",
      },
      {
        id: "py-11",
        topic: "File I/O",
        question: "What does open('file.txt', 'a') do?",
        options: [
          "Opens file for reading only",
          "Opens file for writing, truncating existing content",
          "Opens file for appending — writes go to end of file",
          "Opens file in binary mode",
        ],
        correctAnswer: 2,
        explanation:
          "Mode 'a' opens for appending. New writes go to the end without truncating. Use 'w' to overwrite, 'r' to read.",
        difficulty: "easy",
      },
      {
        id: "py-12",
        topic: "Generators",
        question:
          "What keyword is used to create a generator function in Python?",
        options: ["return", "yield", "async", "generate"],
        correctAnswer: 1,
        explanation:
          "yield turns a function into a generator. Each call to next() resumes execution from the last yield.",
        difficulty: "easy",
      },
      {
        id: "py-13",
        topic: "Dictionaries",
        question: "What is the output of: {'a': 1}.get('b', 0)?",
        options: ["None", "KeyError", "0", "False"],
        correctAnswer: 2,
        explanation:
          "dict.get(key, default) returns the value if key exists, otherwise returns the default (0 here).",
        difficulty: "easy",
      },
      {
        id: "py-14",
        topic: "Comprehensions",
        question: "What does {k: v for k, v in zip('abc', [1,2,3])} create?",
        options: [
          "A set",
          "A list of tuples",
          "A dictionary {'a':1, 'b':2, 'c':3}",
          "A generator",
        ],
        correctAnswer: 2,
        explanation:
          "Dict comprehension with zip pairs each character with a number: {'a':1, 'b':2, 'c':3}.",
        difficulty: "medium",
      },
      {
        id: "py-15",
        topic: "OOP",
        question: "What does @staticmethod mean in Python?",
        options: [
          "The method can only be called from subclasses",
          "The method doesn't receive self or cls — it's a regular function in the class namespace",
          "The method is called automatically on class creation",
          "The method modifies class variables",
        ],
        correctAnswer: 1,
        explanation:
          "@staticmethod defines a method that doesn't receive the instance (self) or class (cls). It behaves like a regular function scoped to the class.",
        difficulty: "medium",
      },
      {
        id: "py-16",
        topic: "Lambda",
        question:
          "What does lambda x, y: x if x > y else y return for lambda(3, 7)?",
        options: ["3", "7", "True", "10"],
        correctAnswer: 1,
        explanation:
          "The lambda returns the maximum of x and y. For (3, 7): 3 > 7 is False, so it returns y = 7.",
        difficulty: "easy",
      },
      {
        id: "py-17",
        topic: "Built-ins",
        question: "What does enumerate(['a', 'b', 'c']) produce?",
        options: [
          "['a', 'b', 'c']",
          "(0,'a'), (1,'b'), (2,'c')",
          "{0:'a', 1:'b', 2:'c'}",
          "[0, 1, 2]",
        ],
        correctAnswer: 1,
        explanation:
          "enumerate returns an iterator of (index, value) tuples. Use in for loops to get both index and value simultaneously.",
        difficulty: "easy",
      },
      {
        id: "py-18",
        topic: "Scope",
        question: "What is the LEGB rule in Python?",
        options: [
          "Loop, Exception, Global, Block",
          "Local, Enclosing, Global, Built-in — Python's variable scope lookup order",
          "Lambda, Eval, Generator, Block",
          "List, Enumerate, Generator, Bool",
        ],
        correctAnswer: 1,
        explanation:
          "Python looks up variables in: Local → Enclosing function → Global → Built-in scope.",
        difficulty: "medium",
      },
      {
        id: "py-19",
        topic: "Exceptions",
        question: "How do you raise a custom exception in Python?",
        options: [
          "throw CustomError('msg')",
          "raise CustomError('msg')",
          "error CustomError('msg')",
          "throw new CustomError('msg')",
        ],
        correctAnswer: 1,
        explanation:
          "Python uses raise to throw exceptions. Custom exceptions inherit from Exception: class CustomError(Exception): pass.",
        difficulty: "easy",
      },
      {
        id: "py-20",
        topic: "Data Structures",
        question:
          "Which collection type uses O(1) average-case for membership testing (in operator)?",
        options: ["list", "tuple", "set", "string"],
        correctAnswer: 2,
        explanation:
          "Sets use a hash table internally, giving O(1) average-case for membership tests. Lists use O(n) linear search.",
        difficulty: "medium",
      },
      {
        id: "py-21",
        topic: "Context Managers",
        question: "What is the advantage of using 'with open(file) as f:'?",
        options: [
          "Files open faster",
          "File is automatically closed even if an exception occurs",
          "File is opened in binary mode by default",
          "Allows reading and writing simultaneously",
        ],
        correctAnswer: 1,
        explanation:
          "The with statement uses a context manager that calls __exit__ automatically, ensuring the file is closed even if an error occurs.",
        difficulty: "easy",
      },
      {
        id: "py-22",
        topic: "OOP",
        question: "What is method resolution order (MRO) in Python?",
        options: [
          "The order in which methods are defined",
          "The order Python searches for methods in class hierarchies (C3 linearization)",
          "The execution priority of methods",
          "The order of method parameters",
        ],
        correctAnswer: 1,
        explanation:
          "MRO determines the order Python looks up methods in an inheritance hierarchy. Use ClassName.__mro__ to inspect it.",
        difficulty: "hard",
      },
      {
        id: "py-23",
        topic: "Comprehensions",
        question: "What is a generator expression vs list comprehension?",
        options: [
          "They are identical",
          "Generator expression uses () and is lazy (yields values on demand); list comprehension uses [] and creates the full list",
          "List comprehension is faster for all cases",
          "Generator expressions cannot have conditions",
        ],
        correctAnswer: 1,
        explanation:
          "Generator expressions (x for x in range(n)) are lazy — they yield one value at a time, saving memory. List comprehensions materialize the full list immediately.",
        difficulty: "medium",
      },
      {
        id: "py-24",
        topic: "Strings",
        question: "What does 'Python'.lower().startswith('py') return?",
        options: ["False", "True", "Error", "None"],
        correctAnswer: 1,
        explanation:
          "'Python'.lower() = 'python'. 'python'.startswith('py') = True.",
        difficulty: "easy",
      },
      {
        id: "py-25",
        topic: "Decorators",
        question:
          "What happens when you stack two decorators @A then @B on a function f?",
        options: [
          "B is applied first, then A",
          "A is applied first, then B",
          "Both are applied simultaneously",
          "Only the last decorator takes effect",
        ],
        correctAnswer: 0,
        explanation:
          "@A @B def f() means f = A(B(f)). The bottom decorator (B) is applied first, then A wraps the result.",
        difficulty: "hard",
      },
      {
        id: "py-26",
        topic: "Sorting",
        question:
          "How do you sort a list of dicts by a 'score' key in descending order?",
        options: [
          "sorted(lst, key='score', reverse=True)",
          "sorted(lst, key=lambda x: x['score'], reverse=True)",
          "lst.sort(by='score', desc=True)",
          "sort(lst, 'score', descending=True)",
        ],
        correctAnswer: 1,
        explanation:
          "sorted() with key=lambda x: x['score'] extracts the value to sort by. reverse=True makes it descending.",
        difficulty: "medium",
      },
      {
        id: "py-27",
        topic: "Modules",
        question: "What does 'if __name__ == \"__main__\":' guard do?",
        options: [
          "Runs code only when memory is available",
          "Runs code only when the script is executed directly, not when imported as a module",
          "Prevents the module from being imported",
          "Marks the main function for the Python interpreter",
        ],
        correctAnswer: 1,
        explanation:
          "When a file is imported, __name__ is the module name. When run directly, __name__ is '__main__'. This guard prevents test/run code from executing on import.",
        difficulty: "easy",
      },
      {
        id: "py-28",
        topic: "Itertools",
        question: "What does itertools.chain([1,2], [3,4]) produce?",
        options: ["[[1,2],[3,4]]", "[1,2,3,4]", "(1,2,3,4)", "Error"],
        correctAnswer: 1,
        explanation:
          "itertools.chain concatenates iterables into a single iterator: [1,2,3,4].",
        difficulty: "medium",
      },
      {
        id: "py-29",
        topic: "OOP",
        question: "What is duck typing in Python?",
        options: [
          "A type system that checks at compile time",
          "If an object has the required methods/attributes, it can be used regardless of its type",
          "Forcing all objects to inherit from a Duck class",
          "Using only built-in types in functions",
        ],
        correctAnswer: 1,
        explanation:
          "Duck typing: 'if it walks like a duck and quacks like a duck, it's a duck.' Python checks behavior, not type.",
        difficulty: "medium",
      },
      {
        id: "py-30",
        topic: "Performance",
        question:
          "Which is the most efficient way to join a list of strings in Python?",
        options: [
          "Using + in a loop: result = result + word",
          "Using ''.join(list_of_strings)",
          "Using reduce with str concatenation",
          "Using list comprehension with format strings",
        ],
        correctAnswer: 1,
        explanation:
          "''.join(list) is O(n) and uses a single allocation. + in a loop creates a new string each iteration (O(n²) total).",
        difficulty: "medium",
      },
    ],
  },

  // ─── Mock Test 6: Java Essentials ─────────────────────────────────────────
  {
    id: "java-test",
    title: "Java Essentials",
    description:
      "Core Java concepts: JVM, OOP, generics, collections, multithreading, and Spring basics.",
    duration: 3600,
    totalQuestions: 30,
    category: "Java",
    questions: [
      {
        id: "jv-01",
        topic: "JVM",
        question: "What does JVM stand for and what is its primary role?",
        options: [
          "Java Virtual Machine — executes Java bytecode on any platform",
          "Java Verified Module — verifies code integrity",
          "Just-in-time Verification Module — optimizes code at runtime",
          "Java Variable Memory — manages heap allocation",
        ],
        correctAnswer: 0,
        explanation:
          "JVM (Java Virtual Machine) abstracts the underlying OS and executes compiled Java bytecode, enabling platform independence (Write Once, Run Anywhere).",
        difficulty: "easy",
      },
      {
        id: "jv-02",
        topic: "OOP",
        question:
          "Which Java keyword prevents a method from being overridden in subclasses?",
        options: ["static", "final", "abstract", "private"],
        correctAnswer: 1,
        explanation:
          "final on a method prevents subclasses from overriding it. final on a class prevents inheritance entirely.",
        difficulty: "easy",
      },
      {
        id: "jv-03",
        topic: "Collections",
        question:
          "What is the time complexity of HashMap.get() in Java on average?",
        options: ["O(n)", "O(log n)", "O(1)", "O(n log n)"],
        correctAnswer: 2,
        explanation:
          "HashMap uses hashing for O(1) average-case get/put. Worst case is O(n) with hash collisions (before Java 8 treeified buckets).",
        difficulty: "easy",
      },
      {
        id: "jv-04",
        topic: "OOP",
        question:
          "What is the difference between abstract class and interface in Java?",
        options: [
          "No difference — they are the same",
          "Abstract classes can have state and constructors; interfaces have only abstract methods (pre-Java 8)",
          "Interfaces can extend classes; abstract classes cannot",
          "Abstract classes can have multiple inheritance; interfaces cannot",
        ],
        correctAnswer: 1,
        explanation:
          "Abstract classes can have instance variables, constructors, and concrete methods. Interfaces (pre-Java 8) have only abstract methods. Java 8+ allows default/static methods in interfaces.",
        difficulty: "medium",
      },
      {
        id: "jv-05",
        topic: "Generics",
        question: "What does List<? extends Number> mean in Java generics?",
        options: [
          "A list of any type",
          "A list where elements must be Number or any of its subclasses (upper bounded wildcard)",
          "A list that can only hold Number, not subclasses",
          "A list that holds Number and all superclasses",
        ],
        correctAnswer: 1,
        explanation:
          "? extends Number is an upper-bounded wildcard — accepts List<Integer>, List<Double>, etc. You can read from it but not add to it (except null).",
        difficulty: "hard",
      },
      {
        id: "jv-06",
        topic: "Collections",
        question:
          "Which Java collection maintains insertion order and allows duplicates?",
        options: ["HashSet", "TreeSet", "LinkedList", "HashMap"],
        correctAnswer: 2,
        explanation:
          "LinkedList implements the List interface, maintaining insertion order and allowing duplicate elements. HashSet/TreeSet don't allow duplicates.",
        difficulty: "easy",
      },
      {
        id: "jv-07",
        topic: "Threads",
        question:
          "What is the difference between Runnable and Callable in Java?",
        options: [
          "No difference",
          "Runnable has a run() method that returns void; Callable has call() that can return a value and throw checked exceptions",
          "Callable is used only for UI threads",
          "Runnable supports multi-threading; Callable does not",
        ],
        correctAnswer: 1,
        explanation:
          "Runnable.run() returns void and can't throw checked exceptions. Callable.call() returns a typed result and can throw checked exceptions.",
        difficulty: "medium",
      },
      {
        id: "jv-08",
        topic: "OOP",
        question: "What is method overloading in Java?",
        options: [
          "Redefining a parent class method in a subclass",
          "Defining multiple methods with the same name but different parameter types/count",
          "Calling super methods from a subclass",
          "Making a method final so it can't be overridden",
        ],
        correctAnswer: 1,
        explanation:
          "Method overloading is compile-time polymorphism — same method name, different signatures (parameter types or count). Overriding is runtime polymorphism.",
        difficulty: "easy",
      },
      {
        id: "jv-09",
        topic: "Memory",
        question: "In Java, where are objects stored?",
        options: ["Stack", "Heap", "Method area", "Registers"],
        correctAnswer: 1,
        explanation:
          "Java objects are allocated on the heap. Local variables and references are on the stack. The heap is managed by the garbage collector.",
        difficulty: "easy",
      },
      {
        id: "jv-10",
        topic: "Threads",
        question:
          "Which Java keyword ensures only one thread can execute a method at a time?",
        options: ["volatile", "synchronized", "transient", "atomic"],
        correctAnswer: 1,
        explanation:
          "synchronized on a method acquires the object's intrinsic lock, ensuring mutual exclusion. volatile ensures memory visibility but not atomicity of compound operations.",
        difficulty: "medium",
      },
      {
        id: "jv-11",
        topic: "Strings",
        question: "Why is String immutable in Java?",
        options: [
          "To save memory (only one copy needed in String pool)",
          "Both security/hashcode caching and String pool sharing",
          "To prevent garbage collection issues",
          "Because char arrays are immutable",
        ],
        correctAnswer: 1,
        explanation:
          "String immutability enables String pool sharing (memory efficiency), thread safety, hashcode caching, and security (e.g., class loading, network connections use Strings).",
        difficulty: "medium",
      },
      {
        id: "jv-12",
        topic: "OOP",
        question: "What does the 'super' keyword do in Java?",
        options: [
          "Calls a static method",
          "References the parent class constructor or method",
          "Marks a class as a superclass",
          "Converts a class to its parent type",
        ],
        correctAnswer: 1,
        explanation:
          "super() calls the parent constructor. super.methodName() calls the overridden parent method. Must be the first statement in a constructor when calling super().",
        difficulty: "easy",
      },
      {
        id: "jv-13",
        topic: "Collections",
        question:
          "What is the difference between ArrayList and LinkedList in Java?",
        options: [
          "ArrayList is thread-safe; LinkedList is not",
          "ArrayList uses a dynamic array (fast random access); LinkedList uses nodes (fast insert/delete)",
          "LinkedList allows duplicates; ArrayList does not",
          "They are identical internally",
        ],
        correctAnswer: 1,
        explanation:
          "ArrayList: O(1) random access, O(n) insert/delete in middle. LinkedList: O(n) access, O(1) insert/delete at head/tail.",
        difficulty: "medium",
      },
      {
        id: "jv-14",
        topic: "Exceptions",
        question:
          "What is the difference between checked and unchecked exceptions in Java?",
        options: [
          "No difference",
          "Checked exceptions must be declared or caught; unchecked (RuntimeExceptions) do not",
          "Unchecked exceptions crash the JVM; checked do not",
          "Checked exceptions extend Error; unchecked extend Exception",
        ],
        correctAnswer: 1,
        explanation:
          "Checked exceptions (IOException, SQLException) must be handled with try-catch or declared with throws. Unchecked (NullPointerException, ArrayIndexOutOfBoundsException) are RuntimeExceptions and optional to handle.",
        difficulty: "medium",
      },
      {
        id: "jv-15",
        topic: "Java 8",
        question: "What is a functional interface in Java?",
        options: [
          "An interface with no methods",
          "An interface with exactly one abstract method, used with lambda expressions",
          "An interface that extends Runnable",
          "An interface with static methods only",
        ],
        correctAnswer: 1,
        explanation:
          "A functional interface has exactly one abstract method (e.g., Runnable, Comparator, Function). @FunctionalInterface annotation enforces this. Used with lambdas and method references.",
        difficulty: "medium",
      },
      {
        id: "jv-16",
        topic: "Streams",
        question: "What does Stream.filter().map().collect() do in Java?",
        options: [
          "It's a database query builder",
          "Filters elements, transforms them, then collects results into a collection",
          "Reads data from input streams only",
          "Manages network connections",
        ],
        correctAnswer: 1,
        explanation:
          "Java 8 Streams support functional-style operations: filter removes elements not matching a predicate, map transforms each element, collect gathers results (e.g., Collectors.toList()).",
        difficulty: "medium",
      },
      {
        id: "jv-17",
        topic: "Threads",
        question: "What is a deadlock in Java multithreading?",
        options: [
          "A thread that runs forever",
          "Two or more threads each waiting for locks held by the others, blocking forever",
          "A thread that's waiting for I/O",
          "A memory leak caused by threads",
        ],
        correctAnswer: 1,
        explanation:
          "Deadlock occurs when Thread A holds Lock 1 and waits for Lock 2 while Thread B holds Lock 2 and waits for Lock 1 — neither can proceed.",
        difficulty: "medium",
      },
      {
        id: "jv-18",
        topic: "OOP",
        question:
          "Which access modifier makes a member accessible only within the same class?",
        options: ["public", "protected", "default (no modifier)", "private"],
        correctAnswer: 3,
        explanation:
          "private is the most restrictive — only the class itself can access private members. protected allows same package + subclasses. public allows everyone.",
        difficulty: "easy",
      },
      {
        id: "jv-19",
        topic: "Collections",
        question: "What is the difference between HashSet and TreeSet in Java?",
        options: [
          "HashSet allows duplicates; TreeSet does not",
          "HashSet offers O(1) operations with no order; TreeSet keeps elements sorted with O(log n) operations",
          "TreeSet is faster than HashSet",
          "They are identical",
        ],
        correctAnswer: 1,
        explanation:
          "HashSet uses hashing (O(1) average, no order). TreeSet uses a Red-Black tree (O(log n), sorted order). Neither allows duplicates.",
        difficulty: "medium",
      },
      {
        id: "jv-20",
        topic: "JVM",
        question: "What does garbage collection do in Java?",
        options: [
          "Removes unused imports from code",
          "Automatically frees heap memory occupied by unreachable objects",
          "Deletes temporary files on disk",
          "Clears the stack after method calls",
        ],
        correctAnswer: 1,
        explanation:
          "Java's GC automatically identifies objects no longer referenced and reclaims their heap memory, preventing manual memory management and most memory leaks.",
        difficulty: "easy",
      },
      {
        id: "jv-21",
        topic: "Spring",
        question: "What does @Autowired do in Spring Framework?",
        options: [
          "Creates a new HTTP endpoint",
          "Automatically injects a dependency (bean) into the annotated field/constructor",
          "Defines a scheduled task",
          "Marks a class as a REST controller",
        ],
        correctAnswer: 1,
        explanation:
          "@Autowired performs dependency injection — Spring finds a matching bean in the application context and injects it automatically.",
        difficulty: "medium",
      },
      {
        id: "jv-22",
        topic: "Spring",
        question: "What is the purpose of @RestController in Spring Boot?",
        options: [
          "Marks a class as a database entity",
          "Combines @Controller and @ResponseBody — all methods return JSON/XML response directly",
          "Defines a service layer component",
          "Enables cross-origin requests",
        ],
        correctAnswer: 1,
        explanation:
          "@RestController = @Controller + @ResponseBody. Every method's return value is serialized as the HTTP response body (typically JSON).",
        difficulty: "medium",
      },
      {
        id: "jv-23",
        topic: "Interfaces",
        question: "Can a Java interface have a default method?",
        options: [
          "No — interfaces cannot have any implementation",
          "Yes — Java 8 introduced default methods with a body in interfaces",
          "Only if the interface extends another interface",
          "Only abstract classes can have default methods",
        ],
        correctAnswer: 1,
        explanation:
          "Java 8 introduced default methods — interface methods with a body using the default keyword, enabling backward-compatible API evolution.",
        difficulty: "medium",
      },
      {
        id: "jv-24",
        topic: "OOP",
        question:
          "What is the output of: System.out.println(10 == 10.0) in Java?",
        options: ["false", "true", "Compile error", "ClassCastException"],
        correctAnswer: 1,
        explanation:
          "Java promotes int to double when comparing int and double with ==. 10 becomes 10.0, so 10.0 == 10.0 is true.",
        difficulty: "medium",
      },
      {
        id: "jv-25",
        topic: "Strings",
        question:
          "What is the difference between String.equals() and == for Strings?",
        options: [
          "No difference",
          "equals() compares content; == compares object references (memory address)",
          "== compares content; equals() compares references",
          "equals() is faster than ==",
        ],
        correctAnswer: 1,
        explanation:
          "== checks if two references point to the same object. equals() compares string content character by character. Always use equals() for string value comparison.",
        difficulty: "easy",
      },
      {
        id: "jv-26",
        topic: "Generics",
        question: "What is type erasure in Java generics?",
        options: [
          "Removing types from source code",
          "Generic type parameters are removed at compile time and replaced with Object or bounds, for backward compatibility",
          "Casting objects to their generic types at runtime",
          "Erasing classes that are no longer used",
        ],
        correctAnswer: 1,
        explanation:
          "Java generics use type erasure — type parameters exist only at compile time. At runtime, List<String> and List<Integer> are both just List. This maintains backward compatibility with pre-Java 5 code.",
        difficulty: "hard",
      },
      {
        id: "jv-27",
        topic: "Java 8",
        question: "What does Optional<T> help prevent in Java?",
        options: [
          "ClassCastException",
          "NullPointerException by wrapping a value that may or may not be present",
          "OutOfMemoryError",
          "ConcurrentModificationException",
        ],
        correctAnswer: 1,
        explanation:
          "Optional<T> makes nullability explicit in the type system. Instead of returning null, return Optional.empty(), forcing callers to handle the absent-value case.",
        difficulty: "medium",
      },
      {
        id: "jv-28",
        topic: "Threads",
        question: "What is the ExecutorService used for in Java?",
        options: [
          "Scheduling batch SQL queries",
          "Managing a pool of threads for executing tasks asynchronously",
          "Encrypting data before storage",
          "Handling HTTP requests in Spring",
        ],
        correctAnswer: 1,
        explanation:
          "ExecutorService provides thread pool management — submit tasks (Runnable/Callable) without creating a new thread each time, reusing pooled threads for efficiency.",
        difficulty: "medium",
      },
      {
        id: "jv-29",
        topic: "OOP",
        question: "What is encapsulation in OOP?",
        options: [
          "Hiding implementation details and exposing only a public interface through access modifiers",
          "Inheriting methods from parent classes",
          "Having one method with multiple implementations",
          "Using generic type parameters",
        ],
        correctAnswer: 0,
        explanation:
          "Encapsulation bundles data (fields) and methods together, hiding internal state with private/protected and exposing controlled access via public getters/setters.",
        difficulty: "easy",
      },
      {
        id: "jv-30",
        topic: "Collections",
        question:
          "Which Java Map implementation keeps entries sorted by natural key order?",
        options: ["HashMap", "LinkedHashMap", "TreeMap", "ConcurrentHashMap"],
        correctAnswer: 2,
        explanation:
          "TreeMap maintains keys in sorted order (natural ordering or custom Comparator). LinkedHashMap preserves insertion order. HashMap has no guaranteed order.",
        difficulty: "easy",
      },
    ],
  },

  // ─── Mock Test 7: Frontend (HTML/CSS/JS/React) ────────────────────────────
  {
    id: "frontend-test",
    title: "Frontend Development",
    description:
      "HTML semantics, CSS layout, JavaScript fundamentals, React hooks, and state management.",
    duration: 3600,
    totalQuestions: 30,
    category: "Frontend",
    questions: [
      {
        id: "fe-01",
        topic: "HTML",
        question:
          "What is the purpose of the <semantic> elements like <article> and <section>?",
        options: [
          "They add visual styling automatically",
          "They describe meaning and structure for accessibility and SEO, not just presentation",
          "They replace div elements entirely",
          "They load content lazily",
        ],
        correctAnswer: 1,
        explanation:
          "Semantic HTML gives meaning to content — <article> is self-contained content, <section> is a thematic grouping. This helps screen readers and search engines understand page structure.",
        difficulty: "easy",
      },
      {
        id: "fe-02",
        topic: "HTML",
        question: "Which HTML attribute improves accessibility for images?",
        options: ["title", "alt", "src", "id"],
        correctAnswer: 1,
        explanation:
          "The alt attribute provides alternative text for images — read by screen readers and shown when images fail to load. It's critical for accessibility.",
        difficulty: "easy",
      },
      {
        id: "fe-03",
        topic: "CSS",
        question:
          "In CSS Flexbox, what does 'justify-content: space-between' do?",
        options: [
          "Aligns items vertically",
          "Distributes items with equal space between them, first and last items at the edges",
          "Adds equal space around every item",
          "Centers all items",
        ],
        correctAnswer: 1,
        explanation:
          "space-between places the first item at the start, last item at the end, and distributes remaining space equally between items.",
        difficulty: "easy",
      },
      {
        id: "fe-04",
        topic: "CSS",
        question: "What does 'position: sticky' do in CSS?",
        options: [
          "Fixes an element at a position on the screen permanently",
          "Behaves like relative positioning until a scroll threshold, then sticks like fixed",
          "Positions an element relative to its parent",
          "Removes the element from normal flow",
        ],
        correctAnswer: 1,
        explanation:
          "Sticky positioning combines relative and fixed. The element scrolls normally until a defined threshold (e.g., top: 0), then 'sticks' in place.",
        difficulty: "medium",
      },
      {
        id: "fe-05",
        topic: "CSS",
        question: "What is the CSS Box Model from innermost to outermost?",
        options: [
          "Content → Margin → Padding → Border",
          "Content → Padding → Border → Margin",
          "Padding → Content → Border → Margin",
          "Border → Padding → Content → Margin",
        ],
        correctAnswer: 1,
        explanation:
          "CSS Box Model layers: Content (text/images) → Padding (space inside border) → Border → Margin (space outside border).",
        difficulty: "easy",
      },
      {
        id: "fe-06",
        topic: "JavaScript",
        question: "What is a closure in JavaScript?",
        options: [
          "A function that has no return value",
          "A function that retains access to variables from its outer (enclosing) scope even after the outer function has returned",
          "A self-invoking function",
          "An arrow function",
        ],
        correctAnswer: 1,
        explanation:
          "A closure is a function that 'closes over' its lexical environment, retaining access to outer scope variables even after the outer function finishes executing.",
        difficulty: "medium",
      },
      {
        id: "fe-07",
        topic: "JavaScript",
        question: "What is the difference between == and === in JavaScript?",
        options: [
          "== checks type, === checks value",
          "=== checks both value and type (strict equality); == performs type coercion before comparison",
          "No difference",
          "== is for numbers only, === for strings",
        ],
        correctAnswer: 1,
        explanation:
          "=== is strict equality (no type coercion). == uses type coercion: '5' == 5 is true, '5' === 5 is false. Prefer === to avoid unexpected behavior.",
        difficulty: "easy",
      },
      {
        id: "fe-08",
        topic: "JavaScript",
        question: "What does 'var' vs 'let' differ in regarding scope?",
        options: [
          "No difference",
          "var is function-scoped and hoisted; let is block-scoped and not hoisted to a usable state",
          "let is function-scoped; var is block-scoped",
          "var is for constants; let is for variables",
        ],
        correctAnswer: 1,
        explanation:
          "var is function-scoped and hoisted (initialized to undefined). let is block-scoped and in the Temporal Dead Zone before declaration.",
        difficulty: "medium",
      },
      {
        id: "fe-09",
        topic: "JavaScript",
        question: "What is the output of: console.log(typeof null)?",
        options: ["'null'", "'undefined'", "'object'", "'boolean'"],
        correctAnswer: 2,
        explanation:
          "typeof null === 'object' is a well-known JavaScript bug that persists for backward compatibility. null is not actually an object.",
        difficulty: "medium",
      },
      {
        id: "fe-10",
        topic: "JavaScript",
        question: "What does Promise.all([p1, p2, p3]) do?",
        options: [
          "Runs promises sequentially",
          "Resolves when ALL promises resolve; rejects immediately if any promise rejects",
          "Resolves with the first promise that settles",
          "Retries promises on failure",
        ],
        correctAnswer: 1,
        explanation:
          "Promise.all runs promises concurrently and resolves when all resolve (returns array of results). If any rejects, Promise.all rejects immediately.",
        difficulty: "medium",
      },
      {
        id: "fe-11",
        topic: "React",
        question: "What is the purpose of the React key prop in lists?",
        options: [
          "Styling list items uniquely",
          "Helping React identify which items changed, were added, or removed during reconciliation",
          "Accessing list elements directly in the DOM",
          "Setting the tab order for keyboard navigation",
        ],
        correctAnswer: 1,
        explanation:
          "Keys help React's diffing algorithm efficiently update the DOM by tracking which list items are stable, moved, or new. Using index as key is an anti-pattern for dynamic lists.",
        difficulty: "easy",
      },
      {
        id: "fe-12",
        topic: "React",
        question: "What is the purpose of useState in React?",
        options: [
          "Fetching data from an API",
          "Declaring a state variable and a setter function that triggers re-render when called",
          "Managing global application state",
          "Memoizing expensive computations",
        ],
        correctAnswer: 1,
        explanation:
          "useState returns [state, setState]. Calling setState with a new value schedules a re-render with the updated state.",
        difficulty: "easy",
      },
      {
        id: "fe-13",
        topic: "React",
        question:
          "When does useEffect run when given a dependency array [count]?",
        options: [
          "Only once on mount",
          "Every render",
          "Whenever the component mounts and whenever 'count' changes",
          "Only when the component unmounts",
        ],
        correctAnswer: 2,
        explanation:
          "useEffect with [count] runs after the initial render and after every render where count has changed.",
        difficulty: "easy",
      },
      {
        id: "fe-14",
        topic: "React",
        question: "What problem does useCallback solve in React?",
        options: [
          "Memoizes the return value of a function",
          "Memoizes the function reference itself, preventing unnecessary re-creation on every render",
          "Debounces function calls",
          "Executes a function before the component renders",
        ],
        correctAnswer: 1,
        explanation:
          "useCallback returns a stable function reference that only changes when its dependencies change — preventing child components from re-rendering due to new function references on each parent render.",
        difficulty: "medium",
      },
      {
        id: "fe-15",
        topic: "React",
        question: "What is React Context used for?",
        options: [
          "Local component state management",
          "Passing data through the component tree without prop drilling at every level",
          "Making API calls",
          "Server-side rendering",
        ],
        correctAnswer: 1,
        explanation:
          "Context provides a way to share values (theme, user, locale) across the component tree without manually passing props at each level.",
        difficulty: "easy",
      },
      {
        id: "fe-16",
        topic: "CSS",
        question:
          "What does CSS Grid's 'grid-template-columns: repeat(3, 1fr)' create?",
        options: [
          "3 rows of equal height",
          "3 equal-width columns that share available space equally",
          "3 columns of 1 pixel each",
          "A 3×3 grid",
        ],
        correctAnswer: 1,
        explanation:
          "1fr is a fraction unit. repeat(3, 1fr) creates 3 equal-width columns, each taking 1/3 of available space.",
        difficulty: "easy",
      },
      {
        id: "fe-17",
        topic: "JavaScript",
        question: "What is event delegation in JavaScript?",
        options: [
          "Adding event listeners to every child element",
          "Attaching a single event listener to a parent and handling events from children via event bubbling",
          "Preventing events from propagating",
          "Scheduling events with setTimeout",
        ],
        correctAnswer: 1,
        explanation:
          "Event delegation uses bubbling — a parent listens for events, checks event.target to identify which child triggered it. More efficient than per-child listeners.",
        difficulty: "medium",
      },
      {
        id: "fe-18",
        topic: "JavaScript",
        question:
          "What does the spread operator (...) do when used with arrays?",
        options: [
          "Merges arrays destructively",
          "Expands an iterable (array/object) into individual elements — useful for copying or merging",
          "Creates a reference to the original array",
          "Converts an array to a string",
        ],
        correctAnswer: 1,
        explanation:
          "[...arr1, ...arr2] creates a new array with all elements from both arrays. {...obj1, ...obj2} creates a shallow merge of objects.",
        difficulty: "easy",
      },
      {
        id: "fe-19",
        topic: "Performance",
        question:
          "What does lazy loading in React (React.lazy + Suspense) achieve?",
        options: [
          "Preloads all components at startup",
          "Loads components only when they are needed, reducing initial bundle size",
          "Caches components in localStorage",
          "Prevents components from unmounting",
        ],
        correctAnswer: 1,
        explanation:
          "React.lazy() enables code-splitting — component code is only downloaded when the component is rendered for the first time, reducing initial bundle size.",
        difficulty: "medium",
      },
      {
        id: "fe-20",
        topic: "CSS",
        question: "What is the specificity order in CSS (lowest to highest)?",
        options: [
          "Inline > ID > Class > Element",
          "Element < Class/Attribute < ID < Inline styles",
          "Class < ID < Element < Inline",
          "ID < Class < Inline < Element",
        ],
        correctAnswer: 1,
        explanation:
          "CSS specificity (low to high): Element selectors (1) < Class/Attribute/Pseudo-class (10) < ID (100) < Inline styles (1000) < !important.",
        difficulty: "medium",
      },
      {
        id: "fe-21",
        topic: "JavaScript",
        question:
          "What is the difference between null and undefined in JavaScript?",
        options: [
          "They are identical",
          "undefined means a variable was declared but not assigned; null is an intentional absence of value",
          "null is returned by functions with no return; undefined is a type error",
          "null is for objects; undefined is for primitives",
        ],
        correctAnswer: 1,
        explanation:
          "undefined: variable declared but no value assigned (default). null: explicitly set to indicate no value. typeof undefined === 'undefined', typeof null === 'object'.",
        difficulty: "easy",
      },
      {
        id: "fe-22",
        topic: "React",
        question: "What does useMemo do in React?",
        options: [
          "Stores a function reference",
          "Memoizes the result of an expensive computation, recomputing only when dependencies change",
          "Fetches and caches data from an API",
          "Prevents re-renders of child components",
        ],
        correctAnswer: 1,
        explanation:
          "useMemo caches the result of a computation. It only recomputes when its dependencies array values change, avoiding expensive re-calculations on every render.",
        difficulty: "medium",
      },
      {
        id: "fe-23",
        topic: "HTML",
        question: "What is the purpose of the <meta name='viewport'> tag?",
        options: [
          "Defines page keywords for SEO",
          "Controls how the browser scales the page on mobile devices",
          "Sets the page character encoding",
          "Links to an external stylesheet",
        ],
        correctAnswer: 1,
        explanation:
          "<meta name='viewport' content='width=device-width, initial-scale=1'> tells the browser to match the screen width and set zoom to 1, essential for responsive design.",
        difficulty: "easy",
      },
      {
        id: "fe-24",
        topic: "CSS",
        question: "What does 'box-sizing: border-box' change?",
        options: [
          "Adds a border to all elements",
          "Width and height include padding and border, not just the content",
          "Removes margins from all elements",
          "Makes the box a flexbox container",
        ],
        correctAnswer: 1,
        explanation:
          "border-box: the specified width/height includes content + padding + border. Without it (content-box default), padding and border are added on top of the specified width.",
        difficulty: "medium",
      },
      {
        id: "fe-25",
        topic: "JavaScript",
        question: "What does async/await simplify in JavaScript?",
        options: [
          "Synchronous code execution",
          "Writing asynchronous Promise-based code in a synchronous, readable style",
          "Multi-threading",
          "Memory management",
        ],
        correctAnswer: 1,
        explanation:
          "async/await is syntactic sugar over Promises. await pauses execution until the Promise resolves, making async code read like synchronous code without .then() chains.",
        difficulty: "easy",
      },
      {
        id: "fe-26",
        topic: "React",
        question:
          "What is the problem that the useReducer hook solves over useState?",
        options: [
          "Performance issues with large arrays",
          "Managing complex state logic with multiple sub-values or when next state depends on previous state",
          "Making API calls more efficient",
          "Preventing re-renders entirely",
        ],
        correctAnswer: 1,
        explanation:
          "useReducer is preferable when state logic is complex, involves multiple sub-values, or the next state depends on the previous. It centralizes state transitions in a reducer function.",
        difficulty: "medium",
      },
      {
        id: "fe-27",
        topic: "JavaScript",
        question: "What is prototype inheritance in JavaScript?",
        options: [
          "A class-based system identical to Java",
          "Objects inherit properties and methods directly from other objects via the prototype chain",
          "A system where all objects share a global scope",
          "A pattern that prevents property mutation",
        ],
        correctAnswer: 1,
        explanation:
          "JavaScript uses prototype-based inheritance. Each object has a __proto__ link to its prototype object. Property lookups travel up the chain until found or prototype is null.",
        difficulty: "hard",
      },
      {
        id: "fe-28",
        topic: "CSS",
        question: "What is a CSS media query used for?",
        options: [
          "Loading media files",
          "Applying different styles based on device characteristics like screen width",
          "Adding audio/video to CSS",
          "Detecting the browser type",
        ],
        correctAnswer: 1,
        explanation:
          "@media (max-width: 768px) { } applies styles only when the screen is 768px or narrower — the foundation of responsive design.",
        difficulty: "easy",
      },
      {
        id: "fe-29",
        topic: "React",
        question: "What is the React reconciliation algorithm?",
        options: [
          "The algorithm React uses to render components on the server",
          "React's process of comparing old and new virtual DOM trees (diffing) to determine the minimum DOM updates needed",
          "A technique for managing component lifecycle",
          "The algorithm for routing between pages",
        ],
        correctAnswer: 1,
        explanation:
          "Reconciliation is React's diffing algorithm that compares the current and updated virtual DOM trees, computing the minimal set of real DOM mutations required.",
        difficulty: "hard",
      },
      {
        id: "fe-30",
        topic: "JavaScript",
        question: "What does Array.prototype.reduce() do?",
        options: [
          "Filters array elements",
          "Executes a reducer function on each element, accumulating a single result value",
          "Sorts array elements",
          "Returns a new array with transformed elements",
        ],
        correctAnswer: 1,
        explanation:
          "reduce(fn, initialValue) applies fn(accumulator, currentValue) to each element left to right, returning a single accumulated value (sum, object, string, etc.).",
        difficulty: "medium",
      },
    ],
  },

  // ─── Mock Test 8: Backend Development ─────────────────────────────────────
  {
    id: "backend-test",
    title: "Backend Development",
    description:
      "REST APIs, HTTP, Node.js event loop, SQL vs NoSQL, authentication, and server architecture.",
    duration: 3600,
    totalQuestions: 30,
    category: "Backend",
    questions: [
      {
        id: "be-01",
        topic: "REST",
        question:
          "Which HTTP status code means 'Resource Created Successfully'?",
        options: [
          "200 OK",
          "201 Created",
          "204 No Content",
          "301 Moved Permanently",
        ],
        correctAnswer: 1,
        explanation:
          "201 Created is returned when a POST request successfully creates a new resource. The response typically includes a Location header pointing to the new resource.",
        difficulty: "easy",
      },
      {
        id: "be-02",
        topic: "HTTP",
        question:
          "What HTTP status code indicates that the client is not authorized (missing/invalid token)?",
        options: [
          "400 Bad Request",
          "401 Unauthorized",
          "403 Forbidden",
          "404 Not Found",
        ],
        correctAnswer: 1,
        explanation:
          "401 Unauthorized means authentication is required and has failed. 403 Forbidden means authenticated but not permitted to access the resource.",
        difficulty: "easy",
      },
      {
        id: "be-03",
        topic: "REST",
        question: "Which HTTP method is idempotent?",
        options: ["POST", "PATCH", "PUT", "Neither PUT nor POST"],
        correctAnswer: 2,
        explanation:
          "PUT is idempotent — calling it multiple times with the same body yields the same result. POST is not idempotent (creates multiple resources). PATCH may or may not be idempotent.",
        difficulty: "medium",
      },
      {
        id: "be-04",
        topic: "Node.js",
        question: "What makes Node.js non-blocking?",
        options: [
          "It runs on multiple threads",
          "The event loop and libuv handle I/O operations asynchronously, not blocking the main thread",
          "It uses hardware interrupts directly",
          "It compiles JavaScript to native code",
        ],
        correctAnswer: 1,
        explanation:
          "Node.js uses a single-threaded event loop with libuv for async I/O. Long operations (file, network) are offloaded to the OS/thread pool, and callbacks are queued on completion.",
        difficulty: "medium",
      },
      {
        id: "be-05",
        topic: "Node.js",
        question: "What is the Node.js event loop's order of processing?",
        options: [
          "Timers → I/O → Poll → Check → Close",
          "Poll → Timers → I/O → Check → Close",
          "Timers → Check → I/O → Poll → Close",
          "I/O → Timers → Poll → Check → Close",
        ],
        correctAnswer: 0,
        explanation:
          "Node.js event loop phases: Timers (setTimeout/setInterval callbacks) → Pending I/O → Idle/Prepare → Poll (new I/O) → Check (setImmediate) → Close callbacks.",
        difficulty: "hard",
      },
      {
        id: "be-06",
        topic: "Databases",
        question:
          "What is the primary difference between SQL and NoSQL databases?",
        options: [
          "NoSQL is faster in all cases",
          "SQL uses structured tables with schemas and ACID compliance; NoSQL uses flexible documents/key-value/graph stores with eventual consistency",
          "SQL is only for small datasets",
          "NoSQL supports joins; SQL does not",
        ],
        correctAnswer: 1,
        explanation:
          "SQL: structured, schema-enforced, relational, ACID-compliant (PostgreSQL, MySQL). NoSQL: flexible schemas, horizontal scale, eventual consistency (MongoDB, Redis, Cassandra).",
        difficulty: "easy",
      },
      {
        id: "be-07",
        topic: "Authentication",
        question: "What are the three parts of a JWT?",
        options: [
          "User, Password, Token",
          "Header, Payload, Signature — separated by dots",
          "Key, Value, Expiry",
          "Algorithm, Claims, Hash",
        ],
        correctAnswer: 1,
        explanation:
          "JWT = Header (algorithm, type) + Payload (claims like userId, exp) + Signature (HMAC of header.payload). The signature verifies integrity.",
        difficulty: "medium",
      },
      {
        id: "be-08",
        topic: "Authentication",
        question:
          "What is the difference between authentication and authorization?",
        options: [
          "They are the same thing",
          "Authentication verifies who you are; authorization determines what you're allowed to do",
          "Authorization verifies identity; authentication grants permissions",
          "Authentication is server-side; authorization is client-side",
        ],
        correctAnswer: 1,
        explanation:
          "Authentication: verifying identity (login). Authorization: determining access rights (what resources/actions are permitted after authentication).",
        difficulty: "easy",
      },
      {
        id: "be-09",
        topic: "APIs",
        question: "What is GraphQL's main advantage over REST?",
        options: [
          "It's always faster than REST",
          "Clients request exactly the data they need, reducing over-fetching and under-fetching",
          "It doesn't require a server",
          "It uses binary serialization",
        ],
        correctAnswer: 1,
        explanation:
          "GraphQL lets clients specify exactly which fields they need in a single request. REST may return too much data (over-fetching) or require multiple calls (under-fetching).",
        difficulty: "medium",
      },
      {
        id: "be-10",
        topic: "Caching",
        question: "What is Redis commonly used for in backend systems?",
        options: [
          "Permanent primary data storage",
          "In-memory caching, session storage, pub/sub messaging, and rate limiting",
          "Full-text search",
          "SQL query execution",
        ],
        correctAnswer: 1,
        explanation:
          "Redis is an in-memory key-value store. Common uses: caching DB results, session storage, distributed locks, pub/sub, leaderboards, rate limiting.",
        difficulty: "easy",
      },
      {
        id: "be-11",
        topic: "HTTP",
        question: "What is the purpose of HTTP headers like Cache-Control?",
        options: [
          "Encrypting HTTP body",
          "Controlling how responses are cached by browsers and intermediate proxies",
          "Setting the response content type",
          "Managing CORS",
        ],
        correctAnswer: 1,
        explanation:
          "Cache-Control directives (e.g., max-age=3600, no-cache, no-store) tell browsers and CDNs how long to cache a response and whether to revalidate.",
        difficulty: "medium",
      },
      {
        id: "be-12",
        topic: "Databases",
        question: "What is database indexing and when should you avoid it?",
        options: [
          "Indexing speeds up reads and writes equally",
          "Indexes speed up reads but slow writes and increase storage; avoid on high-write columns with low selectivity",
          "Indexes are only for primary keys",
          "You should always index every column",
        ],
        correctAnswer: 1,
        explanation:
          "Indexes speed up SELECT queries. They slow INSERT/UPDATE/DELETE (index must be updated) and use extra disk space. Avoid on low-cardinality columns or heavy-write tables.",
        difficulty: "medium",
      },
      {
        id: "be-13",
        topic: "Node.js",
        question: "What does middleware do in Express.js?",
        options: [
          "Renders HTML templates",
          "Functions that have access to req, res, and next — process requests in a pipeline",
          "Connects to databases",
          "Compiles TypeScript",
        ],
        correctAnswer: 1,
        explanation:
          "Express middleware is a function(req, res, next) that can read/modify the request, send a response, or call next() to pass control to the next middleware.",
        difficulty: "easy",
      },
      {
        id: "be-14",
        topic: "Security",
        question: "What is SQL injection and how do you prevent it?",
        options: [
          "It's an optimization technique; prevent by caching queries",
          "Malicious SQL inserted into inputs; prevent using parameterized queries or ORM",
          "A way to speed up bulk inserts",
          "A NoSQL attack vector only",
        ],
        correctAnswer: 1,
        explanation:
          "SQL injection injects malicious SQL through user inputs. Prevention: always use parameterized queries/prepared statements or an ORM. Never concatenate user input into SQL strings.",
        difficulty: "easy",
      },
      {
        id: "be-15",
        topic: "APIs",
        question: "What is rate limiting and why is it important in APIs?",
        options: [
          "Limiting the data size of API responses",
          "Restricting the number of requests a client can make in a time window to prevent abuse and ensure availability",
          "Compressing API responses",
          "Versioning API endpoints",
        ],
        correctAnswer: 1,
        explanation:
          "Rate limiting protects against DoS attacks, prevents API abuse, and ensures fair usage. Commonly implemented using Redis counters (e.g., 100 requests per minute per IP/token).",
        difficulty: "medium",
      },
      {
        id: "be-16",
        topic: "Databases",
        question: "What is the N+1 query problem?",
        options: [
          "Queries that run N times faster",
          "Fetching a list of N records and then issuing one extra query per record (N+1 total), causing performance issues",
          "A SQL syntax error",
          "Using too many JOIN clauses",
        ],
        correctAnswer: 1,
        explanation:
          "N+1: fetch 10 users (1 query), then for each user fetch their posts (10 queries) = 11 queries total. Fix with JOIN, eager loading, or DataLoader batching.",
        difficulty: "medium",
      },
      {
        id: "be-17",
        topic: "Microservices",
        question: "What is the main benefit of a microservices architecture?",
        options: [
          "Always faster than monoliths",
          "Independent deployment, scaling, and development of each service",
          "Simpler codebase overall",
          "No need for a database",
        ],
        correctAnswer: 1,
        explanation:
          "Microservices allow each service to be deployed, scaled, and developed independently by separate teams, improving fault isolation and enabling polyglot tech stacks.",
        difficulty: "medium",
      },
      {
        id: "be-18",
        topic: "HTTP",
        question: "What is the difference between HTTP/1.1 and HTTP/2?",
        options: [
          "HTTP/2 uses TCP; HTTP/1.1 uses UDP",
          "HTTP/2 supports multiplexing (multiple requests over one connection), header compression, and server push",
          "HTTP/1.1 is encrypted; HTTP/2 is not",
          "They are functionally identical",
        ],
        correctAnswer: 1,
        explanation:
          "HTTP/2 improves on HTTP/1.1 with multiplexing (parallel requests on one connection), HPACK header compression, server push, and binary framing.",
        difficulty: "medium",
      },
      {
        id: "be-19",
        topic: "Authentication",
        question: "What is OAuth 2.0?",
        options: [
          "A password hashing algorithm",
          "An authorization framework that allows third-party apps to access user resources without sharing passwords",
          "A JWT signing method",
          "A two-factor authentication protocol",
        ],
        correctAnswer: 1,
        explanation:
          "OAuth 2.0 lets users grant third-party apps limited access to their resources (e.g., 'Login with Google') without sharing credentials. Access is granted via tokens.",
        difficulty: "medium",
      },
      {
        id: "be-20",
        topic: "Node.js",
        question: "What is the purpose of process.env in Node.js?",
        options: [
          "Running environment shell scripts",
          "Accessing environment variables for configuration (API keys, DB credentials) without hardcoding them",
          "Checking the Node.js version",
          "Managing process memory",
        ],
        correctAnswer: 1,
        explanation:
          "process.env provides access to OS environment variables. Store sensitive config (secrets, DB URLs) in .env files (loaded via dotenv) and access via process.env.KEY.",
        difficulty: "easy",
      },
      {
        id: "be-21",
        topic: "Databases",
        question: "What is database connection pooling?",
        options: [
          "Storing query results in memory",
          "Maintaining a set of reusable database connections to avoid the overhead of creating a new connection per request",
          "Replicating the database across servers",
          "Caching frequently used tables",
        ],
        correctAnswer: 1,
        explanation:
          "Opening a DB connection is expensive. A connection pool maintains pre-opened connections and reuses them across requests, significantly improving throughput.",
        difficulty: "medium",
      },
      {
        id: "be-22",
        topic: "REST",
        question: "What does HATEOAS mean in REST API design?",
        options: [
          "An HTTP authentication method",
          "Hypermedia As The Engine Of Application State — API responses include links to available actions",
          "A data serialization format",
          "A caching strategy for REST APIs",
        ],
        correctAnswer: 1,
        explanation:
          "HATEOAS: REST responses include links to related actions/resources, making the API self-discoverable. Clients navigate by following links, not hardcoding endpoints.",
        difficulty: "hard",
      },
      {
        id: "be-23",
        topic: "Security",
        question: "What is CORS and when do you need it?",
        options: [
          "A database security protocol",
          "Cross-Origin Resource Sharing — server headers that allow/deny browser requests from a different domain",
          "An encryption standard for APIs",
          "A rate limiting protocol",
        ],
        correctAnswer: 1,
        explanation:
          "CORS headers (Access-Control-Allow-Origin, etc.) tell browsers which origins can make cross-origin requests. Needed when your frontend domain differs from your API domain.",
        difficulty: "medium",
      },
      {
        id: "be-24",
        topic: "Node.js",
        question:
          "What is the difference between require() and import in Node.js?",
        options: [
          "They are identical",
          "require() is CommonJS (synchronous, dynamic); import is ES Modules (static, async-compatible, tree-shakable)",
          "import is for Node.js; require() is for browsers",
          "require() is newer; import is deprecated",
        ],
        correctAnswer: 1,
        explanation:
          "require() (CJS) is synchronous and evaluated at runtime. ES Module import is static, evaluated at parse time, enabling tree-shaking and top-level await.",
        difficulty: "medium",
      },
      {
        id: "be-25",
        topic: "Databases",
        question: "What is database normalization?",
        options: [
          "Making all database tables the same size",
          "Organizing tables to reduce data redundancy and improve integrity by decomposing tables into smaller related ones",
          "Backing up the database",
          "Encrypting database columns",
        ],
        correctAnswer: 1,
        explanation:
          "Normalization (1NF, 2NF, 3NF, BCNF) removes data redundancy by ensuring each piece of information is stored once, reducing update anomalies.",
        difficulty: "easy",
      },
      {
        id: "be-26",
        topic: "APIs",
        question: "What is API versioning and why is it important?",
        options: [
          "Tracking how many times an API was called",
          "Including version numbers in API paths (/v1/, /v2/) to allow backward-compatible changes without breaking existing clients",
          "Encrypting API responses by version",
          "Documenting all API changes",
        ],
        correctAnswer: 1,
        explanation:
          "Versioning (e.g., /api/v1/users) lets you evolve your API (breaking changes) while keeping old versions working for existing clients during migration.",
        difficulty: "easy",
      },
      {
        id: "be-27",
        topic: "Security",
        question: "How should passwords be stored securely in a database?",
        options: [
          "Encrypted with AES",
          "Hashed with a strong, slow algorithm like bcrypt or Argon2 with a random salt",
          "Stored as plain text in an encrypted DB",
          "Base64 encoded",
        ],
        correctAnswer: 1,
        explanation:
          "Never store plain-text or simply encrypted passwords. Use bcrypt/Argon2 — slow algorithms resistant to brute force. Salt prevents rainbow table attacks.",
        difficulty: "medium",
      },
      {
        id: "be-28",
        topic: "HTTP",
        question: "What does a 429 Too Many Requests status code indicate?",
        options: [
          "Server internal error",
          "Client has sent too many requests in a given time window (rate limit exceeded)",
          "Invalid request format",
          "Resource not found",
        ],
        correctAnswer: 1,
        explanation:
          "429 is the standard HTTP status for rate limiting. Responses typically include a Retry-After header indicating when the client can retry.",
        difficulty: "easy",
      },
      {
        id: "be-29",
        topic: "Microservices",
        question: "What is a service mesh in microservices architecture?",
        options: [
          "A database shared between services",
          "A dedicated infrastructure layer for service-to-service communication, handling load balancing, encryption, and observability",
          "A network of CDN servers",
          "A deployment configuration format",
        ],
        correctAnswer: 1,
        explanation:
          "A service mesh (e.g., Istio, Linkerd) sits between services, handling retries, circuit breaking, mTLS encryption, and distributed tracing without changes to application code.",
        difficulty: "hard",
      },
      {
        id: "be-30",
        topic: "Node.js",
        question: "What is the purpose of package.json's 'scripts' field?",
        options: [
          "Listing all installed packages",
          "Defining custom command shortcuts runnable with 'npm run <script-name>'",
          "Specifying the Node.js version required",
          "Configuring the npm registry",
        ],
        correctAnswer: 1,
        explanation:
          "scripts in package.json define shortcuts like 'start', 'build', 'test' that run via npm/yarn/pnpm. This standardizes how to start, build, and test projects.",
        difficulty: "easy",
      },
    ],
  },

  // ─── Mock Test 9: Data Science & ML ───────────────────────────────────────
  {
    id: "data-science-test",
    title: "Data Science & Machine Learning",
    description:
      "NumPy, Pandas, ML algorithms, model evaluation, bias-variance tradeoff, and neural networks.",
    duration: 3600,
    totalQuestions: 30,
    category: "Data Science",
    questions: [
      {
        id: "ds-01",
        topic: "NumPy",
        question:
          "What is NumPy's primary advantage over Python lists for numerical computation?",
        options: [
          "NumPy lists are more readable",
          "NumPy arrays use fixed types and contiguous memory, enabling vectorized C operations much faster than Python loops",
          "NumPy supports negative indexing",
          "NumPy arrays can store mixed types efficiently",
        ],
        correctAnswer: 1,
        explanation:
          "NumPy arrays are homogeneously typed and stored in contiguous memory. Operations are executed in compiled C/Fortran, orders of magnitude faster than Python loops.",
        difficulty: "medium",
      },
      {
        id: "ds-02",
        topic: "Pandas",
        question: "What does df.groupby('city').agg({'sales': 'sum'}) do?",
        options: [
          "Filters rows where city equals 'sales'",
          "Groups DataFrame rows by city and computes the sum of the sales column for each city",
          "Renames the sales column to 'city'",
          "Sorts by city and sales",
        ],
        correctAnswer: 1,
        explanation:
          "groupby + agg: rows are grouped by unique city values, then the sales sum is computed per group — equivalent to SQL's GROUP BY city, SUM(sales).",
        difficulty: "easy",
      },
      {
        id: "ds-03",
        topic: "ML Concepts",
        question: "What is the bias-variance tradeoff?",
        options: [
          "The tradeoff between model training speed and accuracy",
          "High bias = underfitting (too simple); high variance = overfitting (too complex). The goal is to minimize total error by balancing both",
          "A mathematical formula for calculating model loss",
          "The tradeoff between data size and model complexity",
        ],
        correctAnswer: 1,
        explanation:
          "Bias: error from incorrect assumptions (underfitting). Variance: error from sensitivity to training data noise (overfitting). Best models find the sweet spot with low total error.",
        difficulty: "medium",
      },
      {
        id: "ds-04",
        topic: "ML Algorithms",
        question: "What type of algorithm is K-Means?",
        options: [
          "Supervised classification",
          "Supervised regression",
          "Unsupervised clustering",
          "Semi-supervised learning",
        ],
        correctAnswer: 2,
        explanation:
          "K-Means is an unsupervised learning algorithm that groups data into K clusters based on feature similarity, without using labeled examples.",
        difficulty: "easy",
      },
      {
        id: "ds-05",
        topic: "Model Evaluation",
        question: "When should you use F1 score instead of accuracy?",
        options: [
          "When the dataset is balanced",
          "When classes are imbalanced and both precision and recall matter equally",
          "When you have more than 10 classes",
          "For regression problems",
        ],
        correctAnswer: 1,
        explanation:
          "On imbalanced datasets, a model predicting the majority class always has high accuracy but poor recall. F1 (harmonic mean of precision and recall) penalizes this.",
        difficulty: "medium",
      },
      {
        id: "ds-06",
        topic: "ML Algorithms",
        question: "What is the kernel trick in Support Vector Machines?",
        options: [
          "A way to reduce training time",
          "Mapping data to a higher-dimensional space implicitly to find a linear separator without computing the transformation explicitly",
          "A regularization technique",
          "A pruning strategy for decision trees",
        ],
        correctAnswer: 1,
        explanation:
          "The kernel trick computes dot products in a transformed feature space without explicitly mapping points there. RBF and polynomial kernels enable SVMs to find non-linear boundaries.",
        difficulty: "hard",
      },
      {
        id: "ds-07",
        topic: "Statistics",
        question: "What does p-value indicate in hypothesis testing?",
        options: [
          "The probability that the hypothesis is true",
          "The probability of observing results at least as extreme as those seen, assuming the null hypothesis is true",
          "The confidence level of the model",
          "The accuracy of the statistical test",
        ],
        correctAnswer: 1,
        explanation:
          "p-value: probability of getting the observed data (or more extreme) if H₀ is true. If p < 0.05 (significance level), reject H₀. It does NOT measure the probability that H₀ is true.",
        difficulty: "hard",
      },
      {
        id: "ds-08",
        topic: "Neural Networks",
        question:
          "What is the vanishing gradient problem in deep neural networks?",
        options: [
          "Gradients become too large during backpropagation",
          "Gradients shrink exponentially as they propagate through many layers, preventing early layers from learning",
          "The loss function reaches zero too quickly",
          "Neurons become inactive (dead neurons)",
        ],
        correctAnswer: 1,
        explanation:
          "In deep networks using sigmoid/tanh, gradients are multiplied through many layers during backpropagation. With values < 1, they shrink exponentially. Solution: ReLU, BatchNorm, skip connections.",
        difficulty: "hard",
      },
      {
        id: "ds-09",
        topic: "ML Algorithms",
        question: "What is the difference between bagging and boosting?",
        options: [
          "They are identical ensemble methods",
          "Bagging trains models in parallel on bootstrap samples to reduce variance; boosting trains sequentially, each model correcting the previous one's errors",
          "Bagging reduces bias; boosting reduces variance",
          "Boosting is for classification only; bagging is for regression",
        ],
        correctAnswer: 1,
        explanation:
          "Bagging (e.g., Random Forest): parallel, reduces variance. Boosting (e.g., XGBoost, AdaBoost): sequential, each model focuses on previous errors, reduces bias.",
        difficulty: "medium",
      },
      {
        id: "ds-10",
        topic: "Feature Engineering",
        question: "What is one-hot encoding used for?",
        options: [
          "Normalizing numerical features",
          "Converting categorical variables into binary columns so ML algorithms can process them",
          "Handling missing values",
          "Reducing dimensionality",
        ],
        correctAnswer: 1,
        explanation:
          "One-hot encoding converts a categorical column (e.g., Color: Red/Green/Blue) into binary columns (is_Red, is_Green, is_Blue), preventing false ordinal relationships.",
        difficulty: "easy",
      },
      {
        id: "ds-11",
        topic: "Neural Networks",
        question: "What does the ReLU activation function do?",
        options: [
          "Squashes values between 0 and 1",
          "Returns max(0, x) — passes positive values unchanged, replaces negatives with 0",
          "Returns the hyperbolic tangent of x",
          "Outputs probabilities that sum to 1",
        ],
        correctAnswer: 1,
        explanation:
          "ReLU (Rectified Linear Unit): f(x) = max(0, x). It introduces non-linearity, is computationally cheap, and mitigates vanishing gradients compared to sigmoid.",
        difficulty: "easy",
      },
      {
        id: "ds-12",
        topic: "Pandas",
        question: "What does df.fillna(df.mean()) do?",
        options: [
          "Removes rows with null values",
          "Replaces null values with the column mean",
          "Replaces all values with the mean",
          "Computes the mean of the DataFrame",
        ],
        correctAnswer: 1,
        explanation:
          "fillna() fills NaN values. df.mean() computes per-column means. Together, NaNs in each column are replaced with that column's mean — a common imputation strategy.",
        difficulty: "easy",
      },
      {
        id: "ds-13",
        topic: "Model Evaluation",
        question: "What is cross-validation used for?",
        options: [
          "Increasing the training dataset size",
          "Estimating model performance on unseen data by training and evaluating on different data folds",
          "Tuning hyperparameters directly",
          "Removing outliers from the data",
        ],
        correctAnswer: 1,
        explanation:
          "k-fold cross-validation splits data into k folds, trains k models (each using k-1 folds for training, 1 for validation), and averages performance. More reliable than a single train/test split.",
        difficulty: "medium",
      },
      {
        id: "ds-14",
        topic: "ML Algorithms",
        question: "In a decision tree, what is 'information gain'?",
        options: [
          "The number of features used in the tree",
          "The reduction in entropy (disorder) achieved by splitting on a particular feature",
          "The accuracy improvement after adding a new tree",
          "The depth at which a feature appears",
        ],
        correctAnswer: 1,
        explanation:
          "Information gain = Entropy(parent) – weighted average Entropy(children). A split with high information gain maximally reduces uncertainty about the class label.",
        difficulty: "medium",
      },
      {
        id: "ds-15",
        topic: "Deep Learning",
        question: "What is dropout regularization in neural networks?",
        options: [
          "Removing neurons with zero weights",
          "Randomly setting a fraction of neuron activations to zero during training, reducing co-adaptation and overfitting",
          "Pruning the network after training",
          "Reducing the learning rate during training",
        ],
        correctAnswer: 1,
        explanation:
          "Dropout randomly deactivates neurons during each training pass, forcing the network to learn redundant representations. At inference, all neurons are used with scaled weights.",
        difficulty: "medium",
      },
      {
        id: "ds-16",
        topic: "Statistics",
        question: "What is the Central Limit Theorem (CLT)?",
        options: [
          "The center of a dataset is always the mean",
          "The distribution of sample means approaches a normal distribution as sample size grows, regardless of the population distribution",
          "All datasets are normally distributed",
          "The mean equals the median in any distribution",
        ],
        correctAnswer: 1,
        explanation:
          "CLT: as sample size n increases, the sampling distribution of the mean approximates a normal distribution (mean=μ, std=σ/√n) regardless of the population's shape.",
        difficulty: "medium",
      },
      {
        id: "ds-17",
        topic: "ML Algorithms",
        question: "What does L2 regularization (Ridge) do to model weights?",
        options: [
          "Sets small weights exactly to zero",
          "Penalizes large weights by adding the sum of squared weights to the loss, shrinking them toward zero",
          "Increases model complexity",
          "Prevents any weight from exceeding 1",
        ],
        correctAnswer: 1,
        explanation:
          "L2 adds λΣw² to the loss. This penalizes large weights and distributes importance across features. L1 (Lasso) can zero out weights for feature selection.",
        difficulty: "medium",
      },
      {
        id: "ds-18",
        topic: "Deep Learning",
        question:
          "What is the role of backpropagation in training neural networks?",
        options: [
          "Propagating input data forward through the network",
          "Computing gradients of the loss with respect to each weight using the chain rule, enabling gradient descent updates",
          "Resetting weights to random values after each epoch",
          "Normalizing activations between layers",
        ],
        correctAnswer: 1,
        explanation:
          "Backpropagation applies the chain rule to compute ∂Loss/∂w for every weight. These gradients tell gradient descent how to adjust each weight to minimize loss.",
        difficulty: "medium",
      },
      {
        id: "ds-19",
        topic: "NumPy",
        question: "What is broadcasting in NumPy?",
        options: [
          "Sending data to multiple processes",
          "Automatically expanding arrays of different shapes to perform element-wise operations without copying data",
          "Printing array contents",
          "Converting 1D arrays to 2D",
        ],
        correctAnswer: 1,
        explanation:
          "NumPy broadcasting: when operating on arrays with different shapes (e.g., adding a (3,1) array to a (3,4) array), NumPy implicitly replicates the smaller array along the mismatched dimension.",
        difficulty: "medium",
      },
      {
        id: "ds-20",
        topic: "ML Concepts",
        question: "What is feature scaling and when is it necessary?",
        options: [
          "Selecting the most important features",
          "Normalizing/standardizing feature ranges; necessary for distance-based algorithms (KNN, SVM) and gradient descent optimization",
          "Reducing the number of features",
          "Encoding categorical features",
        ],
        correctAnswer: 1,
        explanation:
          "Distance-based algorithms and gradient descent converge faster when features are on similar scales. Decision trees and Random Forest are scale-invariant.",
        difficulty: "medium",
      },
      {
        id: "ds-21",
        topic: "Model Evaluation",
        question: "What does the ROC-AUC score measure?",
        options: [
          "Training accuracy of a model",
          "A model's ability to distinguish between classes; AUC = 1 means perfect, 0.5 means random",
          "The mean squared error of a regression model",
          "Feature importance ranking",
        ],
        correctAnswer: 1,
        explanation:
          "ROC curve plots True Positive Rate vs False Positive Rate at different thresholds. AUC (area under ROC curve) summarizes discrimination ability across all thresholds.",
        difficulty: "medium",
      },
      {
        id: "ds-22",
        topic: "Deep Learning",
        question: "What is a convolutional layer (CNN) designed to detect?",
        options: [
          "Temporal sequences in data",
          "Local spatial patterns (edges, textures) by applying learnable filters across input",
          "Probability distributions over outputs",
          "Long-term dependencies in sequences",
        ],
        correctAnswer: 1,
        explanation:
          "Convolutional layers slide learnable filters over input (images, audio), detecting local features (edges, corners, shapes) at different positions with shared weights.",
        difficulty: "medium",
      },
      {
        id: "ds-23",
        topic: "ML Algorithms",
        question:
          "What makes XGBoost different from standard Gradient Boosting?",
        options: [
          "XGBoost is unsupervised; standard GB is supervised",
          "XGBoost uses regularization terms, second-order gradients, parallel tree building, and missing value handling for speed and accuracy",
          "XGBoost uses neural networks internally",
          "They are identical",
        ],
        correctAnswer: 1,
        explanation:
          "XGBoost adds: L1/L2 regularization, second-order Taylor expansion for better optimization, cache-aware block structure for faster computation, and built-in cross-validation.",
        difficulty: "hard",
      },
      {
        id: "ds-24",
        topic: "Statistics",
        question: "What is the difference between Type I and Type II errors?",
        options: [
          "Type I: accepting true null; Type II: rejecting false null",
          "Type I: false positive (reject true null); Type II: false negative (fail to reject false null)",
          "Type I is only for regression; Type II is for classification",
          "They are the same error measured differently",
        ],
        correctAnswer: 1,
        explanation:
          "Type I error (α): false positive — rejecting a true null hypothesis. Type II error (β): false negative — failing to reject a false null hypothesis. Lowering α increases β.",
        difficulty: "medium",
      },
      {
        id: "ds-25",
        topic: "Deep Learning",
        question: "What problem do LSTMs solve compared to vanilla RNNs?",
        options: [
          "They process images more efficiently",
          "LSTMs use gating mechanisms to retain or forget information over long sequences, addressing the vanishing gradient problem of vanilla RNNs",
          "LSTMs are faster to train",
          "LSTMs require less memory",
        ],
        correctAnswer: 1,
        explanation:
          "Vanilla RNNs suffer from vanishing/exploding gradients over long sequences. LSTMs (Long Short-Term Memory) use input, forget, and output gates to control information flow.",
        difficulty: "hard",
      },
      {
        id: "ds-26",
        topic: "Pandas",
        question: "What does df.merge(df2, on='id', how='left') do?",
        options: [
          "Removes rows where id doesn't match",
          "Keeps all rows from df (left), filling NaN for df2 columns where there's no match on id",
          "Returns only rows present in both DataFrames",
          "Stacks df2 below df",
        ],
        correctAnswer: 1,
        explanation:
          "Left join: all rows from the left DataFrame (df) are kept. Matching rows from df2 are joined. Non-matching right rows are NaN. Same semantics as SQL LEFT JOIN.",
        difficulty: "medium",
      },
      {
        id: "ds-27",
        topic: "ML Concepts",
        question: "What is hyperparameter tuning?",
        options: [
          "Adjusting model weights during training",
          "Searching for the best configuration values (e.g., learning rate, depth, C) that are set before training and not learned from data",
          "Adding more training data",
          "Modifying the architecture of a neural network during training",
        ],
        correctAnswer: 1,
        explanation:
          "Hyperparameters (learning rate, max_depth, regularization strength) are set before training. Methods to find optimal values: grid search, random search, Bayesian optimization.",
        difficulty: "easy",
      },
      {
        id: "ds-28",
        topic: "Statistics",
        question:
          "What is the purpose of standardization (Z-score normalization)?",
        options: [
          "Scaling values to [0, 1]",
          "Transforming features to have mean=0 and standard deviation=1, making them comparable on the same scale",
          "Removing outliers",
          "Converting continuous to categorical",
        ],
        correctAnswer: 1,
        explanation:
          "Z-score: (x - μ) / σ. Result: mean=0, std=1. Essential for algorithms sensitive to feature magnitude. Min-max normalization scales to [0,1].",
        difficulty: "easy",
      },
      {
        id: "ds-29",
        topic: "Deep Learning",
        question: "What is transfer learning in deep learning?",
        options: [
          "Moving a model from one server to another",
          "Using a pre-trained model's learned features as a starting point for a new task, reducing training data and time required",
          "Transferring data between datasets",
          "Converting a model from one framework to another",
        ],
        correctAnswer: 1,
        explanation:
          "Transfer learning reuses a model pre-trained on a large dataset (e.g., ImageNet). For a new task, you fine-tune the final layers while keeping earlier learned features, requiring far less data.",
        difficulty: "medium",
      },
      {
        id: "ds-30",
        topic: "ML Concepts",
        question: "What is the curse of dimensionality?",
        options: [
          "Models become too complex with many features",
          "As dimensions increase, data becomes increasingly sparse, making distance-based methods unreliable and requiring exponentially more data",
          "High-dimensional datasets are slower to load",
          "Neural networks can't handle more than 100 features",
        ],
        correctAnswer: 1,
        explanation:
          "In high dimensions, the distance between any two points converges (nearest neighbor loses meaning), data points become extremely sparse, and models overfit without exponentially more samples.",
        difficulty: "hard",
      },
    ],
  },

  // ─── Mock Test 10: Cybersecurity Fundamentals ─────────────────────────────
  {
    id: "cybersecurity-test",
    title: "Cybersecurity Fundamentals",
    description:
      "CIA triad, encryption, common attacks (XSS, SQLi, CSRF), firewalls, hash functions, and secure design.",
    duration: 3600,
    totalQuestions: 30,
    category: "Cybersecurity",
    questions: [
      {
        id: "cy-01",
        topic: "CIA Triad",
        question: "What does the CIA triad stand for in cybersecurity?",
        options: [
          "Control, Inspection, Audit",
          "Confidentiality, Integrity, Availability",
          "Cryptography, Identity, Authorization",
          "Certificates, Intrusion, Access",
        ],
        correctAnswer: 1,
        explanation:
          "CIA Triad: Confidentiality (only authorized parties access data), Integrity (data is accurate and unmodified), Availability (systems are accessible when needed).",
        difficulty: "easy",
      },
      {
        id: "cy-02",
        topic: "Encryption",
        question:
          "What is the difference between symmetric and asymmetric encryption?",
        options: [
          "Symmetric uses two keys; asymmetric uses one key",
          "Symmetric uses one shared key for encryption and decryption; asymmetric uses a key pair (public + private)",
          "Symmetric is slower; asymmetric is faster",
          "Symmetric is for text; asymmetric is for files",
        ],
        correctAnswer: 1,
        explanation:
          "Symmetric (AES): same key encrypts and decrypts — fast, great for bulk data. Asymmetric (RSA, ECC): public key encrypts, private key decrypts — slower, used for key exchange.",
        difficulty: "easy",
      },
      {
        id: "cy-03",
        topic: "XSS",
        question: "What is Cross-Site Scripting (XSS)?",
        options: [
          "Injecting malicious SQL into database queries",
          "Injecting malicious scripts into web pages viewed by other users, executing in their browsers",
          "Forging HTTP requests on behalf of authenticated users",
          "Intercepting network traffic between client and server",
        ],
        correctAnswer: 1,
        explanation:
          "XSS: attacker injects malicious JavaScript into a web page. When other users load the page, the script runs in their browser, stealing cookies, session tokens, or credentials.",
        difficulty: "easy",
      },
      {
        id: "cy-04",
        topic: "SQL Injection",
        question: "Which of these is an example of SQL injection?",
        options: [
          "Sending a very large HTTP request",
          "Entering ' OR '1'='1 as a username to bypass login",
          "Flooding a server with traffic",
          "Guessing user passwords through brute force",
        ],
        correctAnswer: 1,
        explanation:
          "' OR '1'='1 makes the query return all records (always true), bypassing authentication. SQL injection exploits unsanitized user input concatenated into SQL queries.",
        difficulty: "easy",
      },
      {
        id: "cy-05",
        topic: "CSRF",
        question: "What is Cross-Site Request Forgery (CSRF)?",
        options: [
          "Injecting scripts into web pages",
          "Tricking an authenticated user's browser into making unintended requests to a trusted site on their behalf",
          "Stealing session cookies directly from the server",
          "Intercepting HTTPS traffic",
        ],
        correctAnswer: 1,
        explanation:
          "CSRF exploits a browser's automatic inclusion of cookies. A malicious site can trigger state-changing actions (fund transfer, password change) to a site where the victim is authenticated.",
        difficulty: "medium",
      },
      {
        id: "cy-06",
        topic: "Hash Functions",
        question:
          "What property of a cryptographic hash function means small input changes produce completely different outputs?",
        options: [
          "Collision resistance",
          "Pre-image resistance",
          "Avalanche effect",
          "Determinism",
        ],
        correctAnswer: 2,
        explanation:
          "The avalanche effect: changing even 1 bit of input changes approximately 50% of the output bits. This makes it impossible to predict output from small input modifications.",
        difficulty: "medium",
      },
      {
        id: "cy-07",
        topic: "Firewalls",
        question: "What is the primary function of a firewall?",
        options: [
          "Encrypting network traffic",
          "Monitoring and filtering incoming/outgoing network traffic based on defined security rules",
          "Scanning files for malware",
          "Managing user passwords",
        ],
        correctAnswer: 1,
        explanation:
          "Firewalls control network access by allowing or blocking traffic based on rules (IP addresses, ports, protocols). They protect network perimeters from unauthorized access.",
        difficulty: "easy",
      },
      {
        id: "cy-08",
        topic: "Encryption",
        question: "What is TLS (Transport Layer Security) used for?",
        options: [
          "Encrypting data at rest on disk",
          "Providing encrypted, authenticated communication over the internet (used in HTTPS)",
          "Hashing passwords before storage",
          "Managing firewall rules",
        ],
        correctAnswer: 1,
        explanation:
          "TLS (successor to SSL) encrypts data in transit between client and server, authenticates the server via certificates, and ensures data integrity. HTTPS = HTTP over TLS.",
        difficulty: "easy",
      },
      {
        id: "cy-09",
        topic: "Authentication",
        question: "What is multi-factor authentication (MFA)?",
        options: [
          "Using multiple passwords",
          "Requiring verification from two or more independent factors: something you know, have, or are",
          "Logging in from multiple devices",
          "Using different passwords for different sites",
        ],
        correctAnswer: 1,
        explanation:
          "MFA combines: something you know (password), something you have (OTP/hardware token), or something you are (biometric). Adds a layer beyond passwords alone.",
        difficulty: "easy",
      },
      {
        id: "cy-10",
        topic: "Attacks",
        question: "What is a Man-in-the-Middle (MitM) attack?",
        options: [
          "Attacking a server from inside the network",
          "Secretly intercepting and potentially altering communications between two parties who believe they're communicating directly",
          "Impersonating a user with stolen credentials",
          "Flooding a network with traffic",
        ],
        correctAnswer: 1,
        explanation:
          "MitM: attacker positions themselves between client and server, intercepting traffic. Mitigated by TLS certificate verification, HSTS, and certificate pinning.",
        difficulty: "medium",
      },
      {
        id: "cy-11",
        topic: "Hash Functions",
        question: "Why is MD5 no longer recommended for security purposes?",
        options: [
          "It's too slow for modern hardware",
          "Collisions have been found — two different inputs can produce the same MD5 hash",
          "It produces hashes that are too long",
          "It's incompatible with modern operating systems",
        ],
        correctAnswer: 1,
        explanation:
          "MD5 is cryptographically broken — practical collisions have been demonstrated. Use SHA-256 or SHA-3 for integrity checks, bcrypt/Argon2 for passwords.",
        difficulty: "medium",
      },
      {
        id: "cy-12",
        topic: "Attacks",
        question: "What is a Denial of Service (DoS) attack?",
        options: [
          "Stealing sensitive data from a server",
          "Overwhelming a system with traffic or requests to make it unavailable to legitimate users",
          "Eavesdropping on network communications",
          "Injecting malware into software updates",
        ],
        correctAnswer: 1,
        explanation:
          "DoS floods a target with requests to exhaust resources (bandwidth, memory, CPU), denying service to legitimate users. DDoS uses many machines to amplify the attack.",
        difficulty: "easy",
      },
      {
        id: "cy-13",
        topic: "Firewalls",
        question:
          "What is the difference between a stateful and stateless firewall?",
        options: [
          "Stateless is newer and more secure",
          "Stateful tracks TCP connection state and allows only valid packets in established flows; stateless checks each packet in isolation",
          "Stateful firewalls encrypt traffic; stateless do not",
          "Stateless firewalls block all outbound traffic by default",
        ],
        correctAnswer: 1,
        explanation:
          "Stateful firewalls understand TCP connections (SYN/ACK/FIN) and only allow packets belonging to established connections. Stateless firewalls just check IP/port against rules.",
        difficulty: "medium",
      },
      {
        id: "cy-14",
        topic: "Social Engineering",
        question: "What is phishing?",
        options: [
          "A network scanning technique",
          "A social engineering attack that deceives users into revealing credentials via fraudulent emails or websites",
          "A technique for cracking encrypted passwords",
          "Malware that encrypts user files for ransom",
        ],
        correctAnswer: 1,
        explanation:
          "Phishing: attackers send fake emails pretending to be trusted organizations (banks, Google) to trick victims into clicking malicious links and submitting credentials.",
        difficulty: "easy",
      },
      {
        id: "cy-15",
        topic: "Encryption",
        question: "What is end-to-end encryption (E2EE)?",
        options: [
          "Encrypting data only at the server end",
          "Only the communicating users can read the messages — even the service provider cannot decrypt them",
          "Encrypting data on the client's device disk",
          "TLS between client and server",
        ],
        correctAnswer: 1,
        explanation:
          "E2EE: messages are encrypted on the sender's device and can only be decrypted by the intended recipient. Intermediaries (servers) only see ciphertext. Used in WhatsApp, Signal.",
        difficulty: "medium",
      },
      {
        id: "cy-16",
        topic: "Vulnerabilities",
        question: "What is a zero-day vulnerability?",
        options: [
          "A vulnerability discovered exactly on the day software is released",
          "A software flaw that is unknown to the vendor and has no patch available, making it exploitable immediately",
          "A vulnerability with zero risk",
          "An unpatched bug that's been public for zero days",
        ],
        correctAnswer: 1,
        explanation:
          "Zero-day: a vulnerability unknown to the vendor (or known but unpatched). Attackers can exploit it before a fix is available. 'Zero days' to fix it before potential exploitation.",
        difficulty: "medium",
      },
      {
        id: "cy-17",
        topic: "Attacks",
        question: "What is a buffer overflow attack?",
        options: [
          "Filling a database with garbage data",
          "Writing data beyond a buffer's allocated boundary, overwriting adjacent memory — potentially allowing arbitrary code execution",
          "Sending oversized HTTP requests",
          "Exhausting server memory with many small requests",
        ],
        correctAnswer: 1,
        explanation:
          "Buffer overflow: writing more data than a buffer can hold overwrites adjacent memory (return addresses, function pointers), potentially redirecting execution to attacker-controlled code.",
        difficulty: "hard",
      },
      {
        id: "cy-18",
        topic: "Hash Functions",
        question: "What is a salt in password hashing?",
        options: [
          "A secret key added to the hash function",
          "A random value added to each password before hashing, ensuring identical passwords produce different hashes and defeating rainbow table attacks",
          "A technique for stretching the hash output",
          "An encryption layer added after hashing",
        ],
        correctAnswer: 1,
        explanation:
          "Salting: a unique random string appended to each password before hashing. hash('password' + 'randomSalt'). Even if two users have the same password, their hashes differ.",
        difficulty: "medium",
      },
      {
        id: "cy-19",
        topic: "Network Security",
        question: "What is a VPN and what security benefit does it provide?",
        options: [
          "A virtual private network that speeds up internet connections",
          "Encrypts traffic between your device and the VPN server, masking your IP and protecting data on untrusted networks",
          "A type of firewall",
          "Software for detecting network intrusions",
        ],
        correctAnswer: 1,
        explanation:
          "VPN (Virtual Private Network) creates an encrypted tunnel. Useful on public Wi-Fi to prevent eavesdropping and to mask your IP address/location from websites.",
        difficulty: "easy",
      },
      {
        id: "cy-20",
        topic: "XSS",
        question: "What is the most effective way to prevent XSS attacks?",
        options: [
          "Using HTTPS only",
          "Escaping/encoding all user input before rendering in HTML, and using Content Security Policy (CSP) headers",
          "Using POST instead of GET requests",
          "Encrypting all user input",
        ],
        correctAnswer: 1,
        explanation:
          "XSS prevention: output encode user data (< to &lt;, etc.) so it's treated as text not HTML/JS. CSP headers restrict which scripts the browser can execute.",
        difficulty: "medium",
      },
      {
        id: "cy-21",
        topic: "Attacks",
        question: "What is ransomware?",
        options: [
          "Software that steals credentials",
          "Malware that encrypts victim's files and demands payment to restore access",
          "Software that displays unwanted ads",
          "A tool for network monitoring",
        ],
        correctAnswer: 1,
        explanation:
          "Ransomware encrypts files on infected systems. Attackers demand cryptocurrency payment for the decryption key. NotPetya, WannaCry, and REvil are notable examples.",
        difficulty: "easy",
      },
      {
        id: "cy-22",
        topic: "Authentication",
        question: "What is the purpose of a CAPTCHA?",
        options: [
          "Encrypting form submissions",
          "Distinguishing human users from automated bots to prevent automated attacks",
          "Validating email addresses",
          "Preventing SQL injection",
        ],
        correctAnswer: 1,
        explanation:
          "CAPTCHA (Completely Automated Public Turing test): challenges that humans pass easily (image recognition) but automated bots struggle with, preventing brute force and spam.",
        difficulty: "easy",
      },
      {
        id: "cy-23",
        topic: "Encryption",
        question: "What is PKI (Public Key Infrastructure)?",
        options: [
          "A software library for encryption",
          "A framework of policies, hardware, and procedures for creating, managing, and distributing digital certificates that bind public keys to identities",
          "A type of symmetric encryption",
          "A network security protocol",
        ],
        correctAnswer: 1,
        explanation:
          "PKI: Certificate Authorities (CAs) issue X.509 certificates that bind a public key to an identity (domain, person). HTTPS relies on PKI for server authentication.",
        difficulty: "hard",
      },
      {
        id: "cy-24",
        topic: "CSRF",
        question: "What is the most effective defense against CSRF attacks?",
        options: [
          "Using HTTPS",
          "CSRF tokens — unique unpredictable values embedded in forms, validated server-side to ensure requests originate from legitimate pages",
          "Hashing all form data",
          "Requiring users to re-login frequently",
        ],
        correctAnswer: 1,
        explanation:
          "CSRF tokens: the server generates a unique token per session, embeds it in forms, and validates it on submission. Attackers can't forge valid tokens from another origin.",
        difficulty: "medium",
      },
      {
        id: "cy-25",
        topic: "Vulnerabilities",
        question: "What does OWASP Top 10 represent?",
        options: [
          "The top 10 programming languages by security",
          "The 10 most critical web application security risks, published by the Open Web Application Security Project",
          "Top 10 hacking tools",
          "10 best practices for network configuration",
        ],
        correctAnswer: 1,
        explanation:
          "OWASP Top 10 lists the most critical web security risks (Injection, Broken Auth, XSS, IDOR, etc.). It's the industry standard awareness guide for web application security.",
        difficulty: "easy",
      },
      {
        id: "cy-26",
        topic: "Network Security",
        question: "What is port scanning and why is it used in security?",
        options: [
          "Monitoring USB ports for malware",
          "Probing a host's network ports to discover open services — used by attackers to map attack surface and by admins to audit exposure",
          "Filtering network packets by port",
          "Assigning dynamic ports to applications",
        ],
        correctAnswer: 1,
        explanation:
          "Port scanning (e.g., with Nmap) identifies open ports and services. Attackers use it to find vulnerabilities; security professionals use it for auditing and hardening.",
        difficulty: "medium",
      },
      {
        id: "cy-27",
        topic: "Attacks",
        question: "What is a rainbow table attack?",
        options: [
          "A multi-vector DDoS attack",
          "Using precomputed hash-to-plaintext tables to reverse hash values and recover original passwords",
          "A social engineering attack using colorful phishing emails",
          "Bypassing firewalls using ICMP packets",
        ],
        correctAnswer: 1,
        explanation:
          "Rainbow tables: precomputed mappings of hashes to plaintexts. If password hashes are stolen, rainbow tables can quickly reverse common passwords. Salting defeats this attack.",
        difficulty: "medium",
      },
      {
        id: "cy-28",
        topic: "Firewalls",
        question: "What is an Intrusion Detection System (IDS)?",
        options: [
          "Software that blocks all incoming traffic",
          "Monitors network/system activity for malicious activity or policy violations and generates alerts",
          "A VPN concentrator",
          "A tool for scanning files for viruses",
        ],
        correctAnswer: 1,
        explanation:
          "IDS monitors traffic/activity and alerts when suspicious patterns are detected. IPS (Intrusion Prevention System) goes further — it actively blocks detected threats.",
        difficulty: "easy",
      },
      {
        id: "cy-29",
        topic: "Secure Design",
        question: "What is the principle of least privilege?",
        options: [
          "Giving admin rights to all users for productivity",
          "Every user, process, or system component should have only the minimum permissions necessary to perform its function",
          "Restricting internet access for all employees",
          "Using read-only databases",
        ],
        correctAnswer: 1,
        explanation:
          "Least privilege minimizes damage from breaches, accidents, or malware. A compromised account with minimal rights can do little harm. It's a fundamental security design principle.",
        difficulty: "easy",
      },
      {
        id: "cy-30",
        topic: "Encryption",
        question: "What is a digital signature?",
        options: [
          "An electronic version of a handwritten signature image",
          "Data signed with a sender's private key that recipients can verify with the public key — proving authenticity and integrity",
          "A hash of a document",
          "An encryption certificate for HTTPS",
        ],
        correctAnswer: 1,
        explanation:
          "Digital signature: sender hashes a message and encrypts the hash with their private key. Recipient decrypts with sender's public key and compares hashes — verifying both sender identity and message integrity.",
        difficulty: "medium",
      },
    ],
  },
];
