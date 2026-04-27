// ─── Interfaces ──────────────────────────────────────────────────────────────

export interface BlueprintResource {
  type: "article" | "video" | "docs" | "practice";
  title: string;
  url?: string;
  internal?: boolean;
}

export interface BlueprintNode {
  id: string;
  label: string;
  section: string;
  type: "required" | "optional" | "bonus";
  description: string;
  keyConcepts: string[];
  difficulty: "beginner" | "intermediate" | "advanced";
  estimatedTime: string;
  resources?: BlueprintResource[];
  docLink?: string;
  children?: string[];
}

export interface BlueprintEdge {
  from: string;
  to: string;
}

export interface BlueprintDomain {
  id: string;
  name: string;
  icon: string;
  color: string;
  description: string;
  category:
    | "web"
    | "mobile"
    | "devops"
    | "data"
    | "security"
    | "design"
    | "other";
  estimatedHours: number;
  difficulty: "beginner" | "intermediate" | "advanced";
  nodes: BlueprintNode[];
  edges: BlueprintEdge[];
}

// ─── 1. Frontend Web Development ─────────────────────────────────────────────
const frontendDomain: BlueprintDomain = {
  id: "frontend",
  name: "Frontend Web Development",
  icon: "🌐",
  color: "#6366f1",
  description:
    "Build modern web UIs with HTML, CSS, JavaScript, TypeScript & React.",
  category: "web",
  estimatedHours: 200,
  difficulty: "beginner",
  nodes: [
    {
      id: "fe-html",
      label: "HTML",
      section: "Basics",
      type: "required",
      description:
        "HTML is the skeleton of every webpage. Master semantic markup, forms, and accessibility patterns to build well-structured, SEO-friendly, and accessible web pages. Learn the full HTML5 API including local storage, canvas, and media elements.",
      keyConcepts: [
        "Semantic Tags",
        "Forms & Inputs",
        "Accessibility",
        "Meta Tags",
        "HTML5 APIs",
      ],
      difficulty: "beginner",
      estimatedTime: "1 week",
      resources: [
        { type: "docs", title: "HTML Documentation", internal: true },
      ],
    },
    {
      id: "fe-css",
      label: "CSS",
      section: "Basics",
      type: "required",
      description:
        "Style and layout webpages using selectors, Flexbox, Grid, and animations. CSS is a design language that controls the visual presentation of every web element. Master responsive design, CSS variables, and the cascade.",
      keyConcepts: [
        "Box Model",
        "Flexbox",
        "CSS Grid",
        "Responsive Design",
        "CSS Variables",
      ],
      difficulty: "beginner",
      estimatedTime: "2 weeks",
    },
    {
      id: "fe-js",
      label: "JavaScript",
      section: "Basics",
      type: "required",
      description:
        "JavaScript brings webpages to life. Learn DOM manipulation, event handling, async programming with Promises and async/await, and modern ES6+ features that make code clean and maintainable.",
      keyConcepts: [
        "DOM API",
        "Events",
        "Promises & async/await",
        "ES6+ Syntax",
        "Closures",
      ],
      difficulty: "beginner",
      estimatedTime: "3 weeks",
    },
    {
      id: "fe-ts",
      label: "TypeScript",
      section: "Intermediate",
      type: "required",
      description:
        "TypeScript adds static typing to JavaScript, catching bugs at compile time. Learn interfaces, generics, type narrowing, and utility types to write safer, more maintainable code at any scale.",
      keyConcepts: [
        "Types & Interfaces",
        "Generics",
        "Type Narrowing",
        "Utility Types",
        "tsconfig",
      ],
      difficulty: "intermediate",
      estimatedTime: "2 weeks",
    },
    {
      id: "fe-react",
      label: "React",
      section: "Intermediate",
      type: "required",
      description:
        "Build UIs with declarative components, hooks, and the React ecosystem. Understand the component lifecycle, how state flows through your app, and how to compose complex UIs from simple building blocks.",
      keyConcepts: [
        "Components & Props",
        "useState / useEffect",
        "React Router",
        "Context API",
        "Vite",
      ],
      difficulty: "intermediate",
      estimatedTime: "4 weeks",
    },
    {
      id: "fe-state",
      label: "State Management",
      section: "Advanced",
      type: "required",
      description:
        "Manage complex app state with Zustand, Redux Toolkit, or React Query. Learn the difference between server state and client state, and choose the right solution for each use case.",
      keyConcepts: [
        "Zustand",
        "Redux Toolkit",
        "React Query",
        "Server vs Client State",
        "Selectors",
      ],
      difficulty: "intermediate",
      estimatedTime: "2 weeks",
    },
    {
      id: "fe-testing",
      label: "Testing",
      section: "Advanced",
      type: "optional",
      description:
        "Write unit, integration, and end-to-end tests with Vitest and Playwright. Good tests give you confidence to refactor and ship new features without breaking existing behavior.",
      keyConcepts: [
        "Vitest / Jest",
        "React Testing Library",
        "Playwright",
        "Mocking",
        "Test Coverage",
      ],
      difficulty: "intermediate",
      estimatedTime: "2 weeks",
    },
    {
      id: "fe-perf",
      label: "Performance",
      section: "Advanced",
      type: "optional",
      description:
        "Optimize Core Web Vitals, code-split bundles, memoize expensive computations, and ship fast apps. Performance is a feature — users abandon slow sites within seconds.",
      keyConcepts: [
        "Core Web Vitals",
        "Code Splitting",
        "Memoization",
        "Lazy Loading",
        "Bundle Analysis",
      ],
      difficulty: "advanced",
      estimatedTime: "2 weeks",
    },
    {
      id: "fe-a11y",
      label: "Accessibility",
      section: "Advanced",
      type: "required",
      description:
        "Build inclusive web apps that work for everyone. Learn WCAG guidelines, ARIA roles, keyboard navigation, screen reader compatibility, and color contrast best practices.",
      keyConcepts: [
        "WCAG 2.1",
        "ARIA Roles",
        "Keyboard Nav",
        "Screen Readers",
        "Color Contrast",
      ],
      difficulty: "intermediate",
      estimatedTime: "1 week",
    },
  ],
  edges: [
    { from: "fe-html", to: "fe-css" },
    { from: "fe-css", to: "fe-js" },
    { from: "fe-js", to: "fe-ts" },
    { from: "fe-ts", to: "fe-react" },
    { from: "fe-react", to: "fe-state" },
    { from: "fe-react", to: "fe-testing" },
    { from: "fe-state", to: "fe-perf" },
    { from: "fe-react", to: "fe-a11y" },
  ],
};

// ─── 2. Backend Development ───────────────────────────────────────────────────
const backendDomain: BlueprintDomain = {
  id: "backend",
  name: "Backend Development",
  icon: "⚙️",
  color: "#0891b2",
  description:
    "Build scalable APIs, manage databases, and secure backend systems.",
  category: "web",
  estimatedHours: 240,
  difficulty: "intermediate",
  nodes: [
    {
      id: "be-lang",
      label: "Choose a Language",
      section: "Foundations",
      type: "required",
      description:
        "Pick Node.js, Python, Go, or Java as your backend language. Each has its strengths — Node for JavaScript familiarity, Python for simplicity, Go for performance, Java for enterprise scale.",
      keyConcepts: [
        "Node.js",
        "Python (FastAPI)",
        "Go",
        "Java (Spring)",
        "Language Ecosystem",
      ],
      difficulty: "beginner",
      estimatedTime: "1 week",
    },
    {
      id: "be-http",
      label: "HTTP & REST",
      section: "Foundations",
      type: "required",
      description:
        "Understand HTTP methods, status codes, REST principles, and API design patterns. HTTP is the backbone of web communication — every backend developer must master it.",
      keyConcepts: [
        "HTTP Methods",
        "Status Codes",
        "REST Principles",
        "CORS",
        "API Versioning",
      ],
      difficulty: "beginner",
      estimatedTime: "1 week",
    },
    {
      id: "be-os",
      label: "OS & Linux Basics",
      section: "Foundations",
      type: "required",
      description:
        "Understand processes, threads, file systems, and networking at the OS level. Backend applications run on Linux servers — know how to navigate, troubleshoot, and optimize them.",
      keyConcepts: [
        "Process Management",
        "File System",
        "Environment Variables",
        "SSH",
        "Cron Jobs",
      ],
      difficulty: "beginner",
      estimatedTime: "1 week",
    },
    {
      id: "be-db",
      label: "Databases",
      section: "Core",
      type: "required",
      description:
        "Store and query data with SQL (PostgreSQL) and NoSQL (MongoDB, Redis). Learn schema design, query optimization, indexing, and the tradeoffs between different database types.",
      keyConcepts: [
        "SQL Queries",
        "Joins & Indexes",
        "ACID Transactions",
        "MongoDB",
        "Redis Caching",
      ],
      difficulty: "intermediate",
      estimatedTime: "3 weeks",
    },
    {
      id: "be-auth",
      label: "Authentication",
      section: "Core",
      type: "required",
      description:
        "Secure your API with JWT, OAuth 2.0, sessions, and rate limiting. Authentication and authorization are critical — a single vulnerability can expose all user data.",
      keyConcepts: [
        "JWT",
        "OAuth 2.0",
        "bcrypt Hashing",
        "Rate Limiting",
        "RBAC",
      ],
      difficulty: "intermediate",
      estimatedTime: "2 weeks",
    },
    {
      id: "be-rest",
      label: "REST API Design",
      section: "Core",
      type: "required",
      description:
        "Design clean, versioned, documented REST APIs using OpenAPI/Swagger. Good API design reduces friction for consumers and makes your backend a platform others can build on.",
      keyConcepts: [
        "Resource Naming",
        "Pagination",
        "Error Handling",
        "OpenAPI/Swagger",
        "API Gateways",
      ],
      difficulty: "intermediate",
      estimatedTime: "1 week",
    },
    {
      id: "be-cache",
      label: "Caching",
      section: "Advanced",
      type: "optional",
      description:
        "Speed up responses with in-memory caching (Redis) and CDN strategies. Proper caching can reduce database load by 90% and dramatically improve response times.",
      keyConcepts: [
        "Redis",
        "Cache Invalidation",
        "CDN",
        "HTTP Cache Headers",
        "Eviction Policies",
      ],
      difficulty: "intermediate",
      estimatedTime: "1 week",
    },
    {
      id: "be-micro",
      label: "Microservices",
      section: "Advanced",
      type: "optional",
      description:
        "Decompose apps into independently deployable services with message queues. Microservices enable teams to work independently and scale individual services based on demand.",
      keyConcepts: [
        "Service Decomposition",
        "Docker",
        "Message Queues (Kafka)",
        "API Gateway",
        "Service Mesh",
      ],
      difficulty: "advanced",
      estimatedTime: "4 weeks",
    },
    {
      id: "be-cicd",
      label: "CI/CD",
      section: "Advanced",
      type: "required",
      description:
        "Automate testing and deployment pipelines with GitHub Actions. CI/CD lets your team ship code multiple times per day with confidence — automated tests catch regressions before they reach production.",
      keyConcepts: [
        "GitHub Actions",
        "Docker",
        "Deployment Strategies",
        "Secrets Management",
        "Rollback",
      ],
      difficulty: "intermediate",
      estimatedTime: "2 weeks",
    },
  ],
  edges: [
    { from: "be-lang", to: "be-http" },
    { from: "be-http", to: "be-os" },
    { from: "be-os", to: "be-db" },
    { from: "be-db", to: "be-auth" },
    { from: "be-auth", to: "be-rest" },
    { from: "be-auth", to: "be-cache" },
    { from: "be-rest", to: "be-micro" },
    { from: "be-micro", to: "be-cicd" },
    { from: "be-cache", to: "be-cicd" },
  ],
};

// ─── 3. Full Stack Development ────────────────────────────────────────────────
const fullStackDomain: BlueprintDomain = {
  id: "fullstack",
  name: "Full Stack Development",
  icon: "🔄",
  color: "#7c3aed",
  description:
    "Bridge frontend and backend — build complete web apps end-to-end.",
  category: "web",
  estimatedHours: 320,
  difficulty: "intermediate",
  nodes: [
    {
      id: "fs-html-css",
      label: "HTML & CSS",
      section: "Foundations",
      type: "required",
      description:
        "Master semantic HTML structure and modern CSS layouts. These are non-negotiable fundamentals — every line of code you write will ultimately render as HTML and CSS in a browser.",
      keyConcepts: [
        "Semantic HTML",
        "CSS Grid & Flexbox",
        "Responsive Design",
        "CSS Variables",
        "Animations",
      ],
      difficulty: "beginner",
      estimatedTime: "2 weeks",
    },
    {
      id: "fs-js",
      label: "JavaScript ES6+",
      section: "Foundations",
      type: "required",
      description:
        "Modern JavaScript from arrow functions to Promises. JavaScript is the only language that runs in the browser — you'll use it on both frontend and backend as a full stack developer.",
      keyConcepts: [
        "Arrow Functions",
        "Destructuring",
        "Modules",
        "Promises",
        "async/await",
      ],
      difficulty: "beginner",
      estimatedTime: "3 weeks",
    },
    {
      id: "fs-react",
      label: "React",
      section: "Frontend",
      type: "required",
      description:
        "Build dynamic UIs with React components and hooks. React is the most popular frontend library in 2025 — understanding it opens doors to Next.js, React Native, and the wider ecosystem.",
      keyConcepts: [
        "Components",
        "Props & State",
        "Hooks",
        "React Router",
        "Forms",
      ],
      difficulty: "intermediate",
      estimatedTime: "4 weeks",
    },
    {
      id: "fs-node",
      label: "Node.js & Express",
      section: "Backend",
      type: "required",
      description:
        "Build REST APIs with Node.js and Express. Using JavaScript on both ends means you can share types, validation logic, and utilities between frontend and backend.",
      keyConcepts: [
        "Express.js",
        "Middleware",
        "Route Handlers",
        "Environment Config",
        "Error Handling",
      ],
      difficulty: "intermediate",
      estimatedTime: "3 weeks",
    },
    {
      id: "fs-db",
      label: "Databases",
      section: "Backend",
      type: "required",
      description:
        "Connect your app to PostgreSQL or MongoDB. Full stack developers own the entire data lifecycle — from schema design to query optimization to connection pooling.",
      keyConcepts: [
        "PostgreSQL",
        "MongoDB",
        "ORMs (Prisma/Mongoose)",
        "Migrations",
        "Indexes",
      ],
      difficulty: "intermediate",
      estimatedTime: "2 weeks",
    },
    {
      id: "fs-auth",
      label: "Authentication & Sessions",
      section: "Backend",
      type: "required",
      description:
        "Implement secure login with JWT tokens and session management. Authentication is one of the most common places security vulnerabilities are introduced — do it right from the start.",
      keyConcepts: [
        "JWT",
        "Refresh Tokens",
        "OAuth 2.0",
        "Password Hashing",
        "Protected Routes",
      ],
      difficulty: "intermediate",
      estimatedTime: "2 weeks",
    },
    {
      id: "fs-api",
      label: "Full Stack Data Flow",
      section: "Integration",
      type: "required",
      description:
        "Connect React frontend to Express backend — fetch APIs, loading states, error handling, and optimistic updates. This integration layer is where full stack skill shines.",
      keyConcepts: [
        "fetch / axios",
        "React Query",
        "Loading States",
        "Error Boundaries",
        "Optimistic UI",
      ],
      difficulty: "intermediate",
      estimatedTime: "2 weeks",
    },
    {
      id: "fs-deploy",
      label: "Deployment",
      section: "Integration",
      type: "required",
      description:
        "Ship your full stack app to production with Docker and cloud platforms. Deployment is where your app meets real users — understand DNS, HTTPS, environment variables, and monitoring.",
      keyConcepts: [
        "Docker",
        "Environment Variables",
        "HTTPS / SSL",
        "CI/CD Pipelines",
        "Monitoring",
      ],
      difficulty: "intermediate",
      estimatedTime: "2 weeks",
    },
    {
      id: "fs-nextjs",
      label: "Next.js",
      section: "Advanced",
      type: "optional",
      description:
        "Build production-ready full stack apps with Next.js App Router. SSR, ISR, and Server Components blur the line between frontend and backend in powerful ways.",
      keyConcepts: [
        "App Router",
        "Server Components",
        "SSR & SSG",
        "API Routes",
        "Server Actions",
      ],
      difficulty: "advanced",
      estimatedTime: "3 weeks",
    },
  ],
  edges: [
    { from: "fs-html-css", to: "fs-js" },
    { from: "fs-js", to: "fs-react" },
    { from: "fs-js", to: "fs-node" },
    { from: "fs-node", to: "fs-db" },
    { from: "fs-db", to: "fs-auth" },
    { from: "fs-react", to: "fs-api" },
    { from: "fs-auth", to: "fs-api" },
    { from: "fs-api", to: "fs-deploy" },
    { from: "fs-deploy", to: "fs-nextjs" },
  ],
};

// ─── 4. Python ────────────────────────────────────────────────────────────────
const pythonDomain: BlueprintDomain = {
  id: "python",
  name: "Python",
  icon: "🐍",
  color: "#eab308",
  description:
    "Master Python from syntax to data analysis, APIs, and machine learning.",
  category: "other",
  estimatedHours: 160,
  difficulty: "beginner",
  nodes: [
    {
      id: "py-syntax",
      label: "Syntax & Basics",
      section: "Basics",
      type: "required",
      description:
        "Variables, data types, control flow, functions, and list comprehensions. Python's clean syntax makes it one of the easiest languages to learn while being powerful enough for production systems.",
      keyConcepts: [
        "Variables & Types",
        "Control Flow",
        "Functions",
        "List Comprehensions",
        "f-strings",
      ],
      difficulty: "beginner",
      estimatedTime: "1 week",
    },
    {
      id: "py-types",
      label: "Data Types & Collections",
      section: "Basics",
      type: "required",
      description:
        "Lists, dicts, sets, tuples and the collections module. Python's built-in data structures are rich and expressive — knowing when to use each one is a key Python skill.",
      keyConcepts: [
        "Lists vs Tuples",
        "Dicts & Sets",
        "collections Module",
        "Slicing",
        "Iteration",
      ],
      difficulty: "beginner",
      estimatedTime: "1 week",
    },
    {
      id: "py-cf",
      label: "Control Flow",
      section: "Basics",
      type: "required",
      description:
        "Conditionals, loops, comprehensions, generators, and exception handling. Python's generator pattern is one of the most memory-efficient ways to process large data sets.",
      keyConcepts: [
        "if/elif/else",
        "for & while loops",
        "Generators",
        "Exception Handling",
        "Context Managers",
      ],
      difficulty: "beginner",
      estimatedTime: "1 week",
    },
    {
      id: "py-oop",
      label: "OOP",
      section: "Intermediate",
      type: "required",
      description:
        "Classes, inheritance, dunder methods, properties, and dataclasses. Python's object model is flexible — you can mix procedural and object-oriented styles to write clean, maintainable code.",
      keyConcepts: [
        "Classes & Objects",
        "Inheritance",
        "Dunder Methods",
        "Properties",
        "Dataclasses",
      ],
      difficulty: "intermediate",
      estimatedTime: "2 weeks",
    },
    {
      id: "py-modules",
      label: "Modules & Packages",
      section: "Intermediate",
      type: "required",
      description:
        "Organize code with modules, packages, virtual environments, and pip. Understanding Python packaging is essential before contributing to or building any real-world project.",
      keyConcepts: [
        "Imports",
        "Packages",
        "venv / pip",
        "pathlib",
        "pyproject.toml",
      ],
      difficulty: "beginner",
      estimatedTime: "1 week",
    },
    {
      id: "py-fileio",
      label: "File I/O",
      section: "Intermediate",
      type: "required",
      description:
        "Read and write text, CSV, and JSON files using context managers. File I/O is needed in almost every real-world Python application — from data pipelines to config files to log processing.",
      keyConcepts: [
        "File Reading/Writing",
        "CSV & JSON",
        "pathlib",
        "os/sys",
        "Error Handling",
      ],
      difficulty: "beginner",
      estimatedTime: "1 week",
    },
    {
      id: "py-async",
      label: "Async Python",
      section: "Advanced",
      type: "optional",
      description:
        "Concurrent I/O with asyncio, async/await, and aiohttp. Async Python lets you handle thousands of concurrent connections in a web server or data pipeline without the complexity of threads.",
      keyConcepts: [
        "asyncio",
        "async / await",
        "Event Loop",
        "aiohttp",
        "Concurrency vs Parallelism",
      ],
      difficulty: "advanced",
      estimatedTime: "2 weeks",
    },
    {
      id: "py-test",
      label: "Testing",
      section: "Advanced",
      type: "optional",
      description:
        "Write unit and integration tests with pytest and mock. pytest is the gold standard for Python testing — its fixtures system and plugin ecosystem make testing powerful and elegant.",
      keyConcepts: [
        "pytest",
        "Fixtures",
        "Mocking",
        "Parameterization",
        "Coverage",
      ],
      difficulty: "intermediate",
      estimatedTime: "1 week",
    },
    {
      id: "py-pkg",
      label: "Packaging & Distribution",
      section: "Advanced",
      type: "bonus",
      description:
        "Package Python projects and publish to PyPI. Publishing your first open-source Python package is a rite of passage — and great for your portfolio.",
      keyConcepts: [
        "pyproject.toml",
        "setuptools",
        "Poetry",
        "PyPI Publishing",
        "Versioning",
      ],
      difficulty: "advanced",
      estimatedTime: "1 week",
    },
  ],
  edges: [
    { from: "py-syntax", to: "py-types" },
    { from: "py-types", to: "py-cf" },
    { from: "py-cf", to: "py-oop" },
    { from: "py-cf", to: "py-modules" },
    { from: "py-cf", to: "py-fileio" },
    { from: "py-oop", to: "py-async" },
    { from: "py-modules", to: "py-test" },
    { from: "py-test", to: "py-pkg" },
  ],
};

// ─── 5. Java ──────────────────────────────────────────────────────────────────
const javaDomain: BlueprintDomain = {
  id: "java",
  name: "Java",
  icon: "☕",
  color: "#f97316",
  description:
    "Enterprise-grade Java — OOP, Spring Boot, JVM performance, and microservices.",
  category: "other",
  estimatedHours: 200,
  difficulty: "intermediate",
  nodes: [
    {
      id: "jv-basics",
      label: "Java Basics",
      section: "Foundations",
      type: "required",
      description:
        "Variables, data types, operators, control flow, and the Java type system. Java's strict static typing catches bugs at compile time and makes codebases easier to navigate at scale.",
      keyConcepts: [
        "Primitive Types",
        "Autoboxing",
        "Control Flow",
        "Arrays",
        "Type System",
      ],
      difficulty: "beginner",
      estimatedTime: "2 weeks",
    },
    {
      id: "jv-oop",
      label: "OOP in Java",
      section: "Foundations",
      type: "required",
      description:
        "Java is built on object-oriented principles — classes, interfaces, inheritance, polymorphism, and encapsulation. Mastering these is the foundation for every Java framework.",
      keyConcepts: [
        "Classes & Objects",
        "Interfaces",
        "Inheritance",
        "Polymorphism",
        "Encapsulation",
      ],
      difficulty: "beginner",
      estimatedTime: "2 weeks",
    },
    {
      id: "jv-collections",
      label: "Collections Framework",
      section: "Core",
      type: "required",
      description:
        "Java's Collections Framework provides List, Map, Set, and Queue implementations. Knowing when to use ArrayList vs LinkedList vs HashMap is essential for writing efficient Java code.",
      keyConcepts: [
        "ArrayList / LinkedList",
        "HashMap / TreeMap",
        "HashSet",
        "Iterator",
        "Comparator",
      ],
      difficulty: "beginner",
      estimatedTime: "1 week",
    },
    {
      id: "jv-generics",
      label: "Generics",
      section: "Core",
      type: "required",
      description:
        "Write type-safe, reusable code with Java generics. Generics eliminate unchecked casts and help the compiler catch type errors that would otherwise only be discovered at runtime.",
      keyConcepts: [
        "Type Parameters",
        "Wildcards",
        "Bounded Types",
        "Generic Methods",
        "Type Erasure",
      ],
      difficulty: "intermediate",
      estimatedTime: "1 week",
    },
    {
      id: "jv-concurrency",
      label: "Concurrency",
      section: "Core",
      type: "required",
      description:
        "Java's concurrency model — threads, synchronization, locks, and the java.util.concurrent package. Modern Java uses CompletableFuture and virtual threads (Project Loom) for async programming.",
      keyConcepts: [
        "Threads & Runnable",
        "Synchronized",
        "ExecutorService",
        "CompletableFuture",
        "Virtual Threads",
      ],
      difficulty: "advanced",
      estimatedTime: "3 weeks",
    },
    {
      id: "jv-streams",
      label: "Streams & Lambdas",
      section: "Core",
      type: "required",
      description:
        "Functional-style programming in Java 8+ with lambdas, method references, and the Stream API. Streams make data processing pipelines concise, readable, and parallelizable.",
      keyConcepts: [
        "Lambda Expressions",
        "Method References",
        "Stream Operations",
        "Optional",
        "Collectors",
      ],
      difficulty: "intermediate",
      estimatedTime: "2 weeks",
    },
    {
      id: "jv-spring",
      label: "Spring Boot",
      section: "Framework",
      type: "required",
      description:
        "Build production-ready REST APIs and microservices with Spring Boot. Spring Boot is the industry standard for Java backend development — auto-configuration makes it fast to start and powerful to extend.",
      keyConcepts: [
        "Spring IoC",
        "REST Controllers",
        "JPA / Hibernate",
        "Spring Security",
        "Actuator",
      ],
      difficulty: "intermediate",
      estimatedTime: "4 weeks",
    },
    {
      id: "jv-testing",
      label: "Testing with JUnit",
      section: "Advanced",
      type: "required",
      description:
        "Test-driven development with JUnit 5, Mockito, and Spring Boot Test. Java's testing ecosystem is mature and well-integrated — TDD is a common practice in enterprise Java teams.",
      keyConcepts: [
        "JUnit 5",
        "Mockito",
        "Spring MockMvc",
        "Test Slices",
        "Integration Tests",
      ],
      difficulty: "intermediate",
      estimatedTime: "2 weeks",
    },
    {
      id: "jv-patterns",
      label: "Design Patterns",
      section: "Advanced",
      type: "optional",
      description:
        "Classic GoF patterns in Java — Singleton, Factory, Builder, Observer, Strategy, and more. Design patterns are a shared vocabulary for communicating architectural decisions.",
      keyConcepts: [
        "Singleton",
        "Factory / Abstract Factory",
        "Builder",
        "Observer",
        "Strategy",
      ],
      difficulty: "advanced",
      estimatedTime: "2 weeks",
    },
  ],
  edges: [
    { from: "jv-basics", to: "jv-oop" },
    { from: "jv-oop", to: "jv-collections" },
    { from: "jv-collections", to: "jv-generics" },
    { from: "jv-generics", to: "jv-streams" },
    { from: "jv-streams", to: "jv-concurrency" },
    { from: "jv-concurrency", to: "jv-spring" },
    { from: "jv-spring", to: "jv-testing" },
    { from: "jv-testing", to: "jv-patterns" },
  ],
};

// ─── 6. Data Science ──────────────────────────────────────────────────────────
const dataScienceDomain: BlueprintDomain = {
  id: "datascience",
  name: "Data Science",
  icon: "📊",
  color: "#8b5cf6",
  description:
    "Analyse data, build ML models, and tell stories with visualizations.",
  category: "data",
  estimatedHours: 240,
  difficulty: "intermediate",
  nodes: [
    {
      id: "ds-stats",
      label: "Statistics",
      section: "Math",
      type: "required",
      description:
        "Descriptive stats, probability distributions, hypothesis testing, and A/B testing. Statistics is the foundation that lets you distinguish signal from noise in your data — essential for any data scientist.",
      keyConcepts: [
        "Descriptive Stats",
        "Probability Distributions",
        "Hypothesis Testing",
        "Confidence Intervals",
        "A/B Testing",
      ],
      difficulty: "beginner",
      estimatedTime: "3 weeks",
    },
    {
      id: "ds-linalg",
      label: "Linear Algebra",
      section: "Math",
      type: "required",
      description:
        "Vectors, matrices, and eigenvalues — the foundation of ML algorithms. Principal Component Analysis, neural networks, and recommendation systems all rely on linear algebra operations.",
      keyConcepts: [
        "Vectors & Matrices",
        "Dot Product",
        "Eigenvalues",
        "Matrix Decomposition",
        "PCA Foundation",
      ],
      difficulty: "intermediate",
      estimatedTime: "2 weeks",
    },
    {
      id: "ds-numpy",
      label: "NumPy",
      section: "Tools",
      type: "required",
      description:
        "Fast numerical computation with N-dimensional arrays and broadcasting. NumPy is the backbone of the scientific Python ecosystem — almost every ML library builds on top of it.",
      keyConcepts: [
        "ndarray",
        "Broadcasting",
        "Indexing & Slicing",
        "Linear Algebra Ops",
        "Random Module",
      ],
      difficulty: "beginner",
      estimatedTime: "1 week",
    },
    {
      id: "ds-pandas",
      label: "Pandas",
      section: "Tools",
      type: "required",
      description:
        "Data wrangling — loading, cleaning, transforming, and aggregating data. 80% of a data scientist's time is data preparation, and Pandas is the primary tool for that work.",
      keyConcepts: [
        "DataFrame & Series",
        "GroupBy",
        "Merge / Join",
        "Missing Data",
        "Pivot Tables",
      ],
      difficulty: "beginner",
      estimatedTime: "2 weeks",
    },
    {
      id: "ds-viz",
      label: "Matplotlib / Seaborn",
      section: "Tools",
      type: "required",
      description:
        "Visualize data with charts, heatmaps, and interactive Plotly dashboards. Visualization is how you communicate findings to stakeholders — a well-crafted chart can tell a story that tables never could.",
      keyConcepts: [
        "Chart Selection",
        "Matplotlib",
        "Seaborn",
        "Plotly",
        "Data Storytelling",
      ],
      difficulty: "beginner",
      estimatedTime: "1 week",
    },
    {
      id: "ds-sklearn",
      label: "Scikit-learn",
      section: "ML Intro",
      type: "required",
      description:
        "Train classification and regression models, cross-validate, and tune hyperparameters. scikit-learn's consistent API makes it easy to experiment with multiple algorithms and find the best one for your problem.",
      keyConcepts: [
        "fit/predict API",
        "Train/Test Split",
        "Cross-Validation",
        "Pipelines",
        "Grid Search",
      ],
      difficulty: "intermediate",
      estimatedTime: "3 weeks",
    },
    {
      id: "ds-eval",
      label: "Model Evaluation",
      section: "ML Intro",
      type: "required",
      description:
        "Assess model performance with the right metrics and avoid data leakage. Choosing the wrong metric (accuracy for imbalanced data, for example) can lead to models that look great in testing but fail in production.",
      keyConcepts: [
        "Accuracy / F1 / AUC-ROC",
        "Confusion Matrix",
        "Bias-Variance",
        "Overfitting",
        "Learning Curves",
      ],
      difficulty: "intermediate",
      estimatedTime: "1 week",
    },
    {
      id: "ds-sql",
      label: "SQL for Data Science",
      section: "Data Eng",
      type: "required",
      description:
        "Query, transform, and analyze data directly in SQL. Most company data lives in relational databases — SQL fluency lets you access it without needing data engineering support.",
      keyConcepts: [
        "SELECT & Joins",
        "Window Functions",
        "CTEs",
        "Aggregations",
        "Query Optimization",
      ],
      difficulty: "beginner",
      estimatedTime: "2 weeks",
    },
  ],
  edges: [
    { from: "ds-stats", to: "ds-linalg" },
    { from: "ds-linalg", to: "ds-numpy" },
    { from: "ds-numpy", to: "ds-pandas" },
    { from: "ds-pandas", to: "ds-viz" },
    { from: "ds-viz", to: "ds-sklearn" },
    { from: "ds-sklearn", to: "ds-eval" },
    { from: "ds-pandas", to: "ds-sql" },
  ],
};

// ─── 7. ML / AI Engineering ───────────────────────────────────────────────────
const mlDomain: BlueprintDomain = {
  id: "ml",
  name: "ML / AI Engineering",
  icon: "🤖",
  color: "#f97316",
  description:
    "Build predictive models from math foundations to deep learning and LLMs.",
  category: "data",
  estimatedHours: 300,
  difficulty: "advanced",
  nodes: [
    {
      id: "ml-stats",
      label: "Statistics & Probability",
      section: "Foundations",
      type: "required",
      description:
        "Probability, distributions, Bayes' theorem, and statistical inference. You cannot understand why ML algorithms work without a solid grasp of the statistics underlying them.",
      keyConcepts: [
        "Probability Theory",
        "Distributions",
        "Bayes' Theorem",
        "Statistical Tests",
        "Correlation",
      ],
      difficulty: "beginner",
      estimatedTime: "3 weeks",
    },
    {
      id: "ml-py",
      label: "Python for ML",
      section: "Foundations",
      type: "required",
      description:
        "NumPy, Pandas, Matplotlib — the data science Python stack. Python dominates ML because of its ecosystem — from Jupyter notebooks to distributed training with Ray.",
      keyConcepts: [
        "NumPy Arrays",
        "Pandas DataFrames",
        "Matplotlib",
        "Scikit-learn basics",
        "Jupyter",
      ],
      difficulty: "beginner",
      estimatedTime: "2 weeks",
    },
    {
      id: "ml-supervised",
      label: "Supervised Learning",
      section: "Core ML",
      type: "required",
      description:
        "Regression, classification, decision trees, random forests, and gradient boosting. Supervised learning covers the majority of real-world ML problems — master these before diving into deep learning.",
      keyConcepts: [
        "Linear / Logistic Regression",
        "Decision Trees",
        "Random Forests",
        "XGBoost",
        "Model Evaluation",
      ],
      difficulty: "intermediate",
      estimatedTime: "4 weeks",
    },
    {
      id: "ml-unsupervised",
      label: "Unsupervised Learning",
      section: "Core ML",
      type: "required",
      description:
        "Clustering (K-means, DBSCAN), dimensionality reduction (PCA, t-SNE). Unsupervised learning finds hidden structure in unlabeled data — essential for recommendation systems and anomaly detection.",
      keyConcepts: [
        "K-means",
        "DBSCAN",
        "PCA",
        "t-SNE / UMAP",
        "Anomaly Detection",
      ],
      difficulty: "intermediate",
      estimatedTime: "2 weeks",
    },
    {
      id: "ml-rl",
      label: "Reinforcement Learning",
      section: "Core ML",
      type: "optional",
      description:
        "Agents, environments, Q-learning, and policy gradient methods. RL is the foundation of game-playing AI (AlphaGo, OpenAI Five) and autonomous systems.",
      keyConcepts: [
        "MDP",
        "Q-Learning",
        "Policy Gradient",
        "Actor-Critic",
        "OpenAI Gym",
      ],
      difficulty: "advanced",
      estimatedTime: "4 weeks",
    },
    {
      id: "ml-nn",
      label: "Neural Networks",
      section: "Deep Learning",
      type: "required",
      description:
        "Perceptrons, backpropagation, activation functions, and training loops with PyTorch. Understanding these fundamentals lets you debug models and design custom architectures.",
      keyConcepts: [
        "Perceptron",
        "Backpropagation",
        "Activation Functions",
        "Optimizers (Adam)",
        "Regularization",
      ],
      difficulty: "intermediate",
      estimatedTime: "3 weeks",
    },
    {
      id: "ml-cnn",
      label: "CNNs",
      section: "Deep Learning",
      type: "optional",
      description:
        "Convolutional networks for image classification, detection, and segmentation. Transfer learning with pre-trained CNNs (ResNet, EfficientNet) makes it practical to achieve state-of-the-art results with small datasets.",
      keyConcepts: [
        "Convolution & Pooling",
        "ResNet / VGG",
        "Transfer Learning",
        "Data Augmentation",
        "Object Detection",
      ],
      difficulty: "advanced",
      estimatedTime: "3 weeks",
    },
    {
      id: "ml-llm",
      label: "LLMs & Transformers",
      section: "Deep Learning",
      type: "optional",
      description:
        "Transformer architecture, BERT, GPT, fine-tuning, and RAG pipelines. LLMs represent the current frontier of AI — understanding transformers is essential for building modern AI applications.",
      keyConcepts: [
        "Attention Mechanism",
        "BERT / GPT",
        "Fine-tuning",
        "Hugging Face",
        "RAG",
      ],
      difficulty: "advanced",
      estimatedTime: "4 weeks",
    },
    {
      id: "ml-deploy",
      label: "ML Model Deployment",
      section: "Production",
      type: "required",
      description:
        "Serve models as APIs with FastAPI, containerize with Docker, and monitor in production. A model that never gets deployed creates zero value — production ML engineering is a critical skill.",
      keyConcepts: [
        "FastAPI / Flask",
        "Model Serialization",
        "Docker",
        "Monitoring (drift)",
        "Feature Stores",
      ],
      difficulty: "intermediate",
      estimatedTime: "2 weeks",
    },
  ],
  edges: [
    { from: "ml-stats", to: "ml-py" },
    { from: "ml-py", to: "ml-supervised" },
    { from: "ml-supervised", to: "ml-unsupervised" },
    { from: "ml-supervised", to: "ml-rl" },
    { from: "ml-unsupervised", to: "ml-nn" },
    { from: "ml-nn", to: "ml-cnn" },
    { from: "ml-nn", to: "ml-llm" },
    { from: "ml-supervised", to: "ml-deploy" },
    { from: "ml-nn", to: "ml-deploy" },
  ],
};

// ─── 8. DevOps / CI-CD ────────────────────────────────────────────────────────
const devopsDomain: BlueprintDomain = {
  id: "devops",
  name: "DevOps / CI-CD",
  icon: "🚀",
  color: "#0d9488",
  description:
    "Automate infrastructure, CI/CD pipelines, and cloud deployments at scale.",
  category: "devops",
  estimatedHours: 280,
  difficulty: "intermediate",
  nodes: [
    {
      id: "dv-linux",
      label: "Linux & Shell",
      section: "Linux",
      type: "required",
      description:
        "Filesystem, process management, shell scripting, and permissions. Everything in DevOps ultimately runs on Linux — being fluent in the shell is table stakes for a DevOps engineer.",
      keyConcepts: [
        "File System",
        "Process Management",
        "Bash Scripting",
        "Permissions",
        "Systemd",
      ],
      difficulty: "beginner",
      estimatedTime: "2 weeks",
    },
    {
      id: "dv-net",
      label: "Networking Basics",
      section: "Linux",
      type: "required",
      description:
        "TCP/IP, DNS, HTTP, ports, and basic network troubleshooting. When a service goes down at 2am, network knowledge is what helps you diagnose whether it's a routing issue, DNS failure, or firewall rule.",
      keyConcepts: [
        "TCP/IP",
        "DNS",
        "HTTP/HTTPS",
        "Ports",
        "netstat / ss / curl",
      ],
      difficulty: "beginner",
      estimatedTime: "1 week",
    },
    {
      id: "dv-docker",
      label: "Docker",
      section: "Containers",
      type: "required",
      description:
        "Containerize applications with Dockerfiles, images, and Docker Compose. Docker solves the 'works on my machine' problem and is the first step toward cloud-native deployments.",
      keyConcepts: [
        "Dockerfile",
        "Images & Containers",
        "Docker Compose",
        "Volumes",
        "Container Networking",
      ],
      difficulty: "intermediate",
      estimatedTime: "2 weeks",
    },
    {
      id: "dv-k8s",
      label: "Kubernetes",
      section: "Containers",
      type: "required",
      description:
        "Orchestrate containers with Pods, Deployments, Services, and Ingress. Kubernetes is the production standard for running containerized applications at scale across cloud providers.",
      keyConcepts: [
        "Pods & Deployments",
        "Services & Ingress",
        "ConfigMaps & Secrets",
        "Helm",
        "HPA",
      ],
      difficulty: "advanced",
      estimatedTime: "4 weeks",
    },
    {
      id: "dv-iac",
      label: "Infrastructure as Code",
      section: "Automation",
      type: "required",
      description:
        "Provision cloud infrastructure with Terraform and manage configuration with Ansible. IaC treats servers like code — version controlled, reproducible, and auditable.",
      keyConcepts: [
        "Terraform",
        "Ansible",
        "CloudFormation",
        "State Management",
        "Modules",
      ],
      difficulty: "intermediate",
      estimatedTime: "3 weeks",
    },
    {
      id: "dv-gh",
      label: "GitHub Actions",
      section: "Pipelines",
      type: "required",
      description:
        "Build CI/CD pipelines that lint, test, build, and deploy automatically. Every code change should trigger automated quality checks — CI/CD is the backbone of fast, reliable software delivery.",
      keyConcepts: [
        "Workflows & Jobs",
        "Actions & Steps",
        "Secrets",
        "Matrix Builds",
        "Artifacts",
      ],
      difficulty: "intermediate",
      estimatedTime: "1 week",
    },
    {
      id: "dv-monitor",
      label: "Monitoring & Observability",
      section: "Advanced",
      type: "required",
      description:
        "Monitor applications with Prometheus, Grafana, and distributed tracing. You can't fix what you can't see — observability is what gives you insight into production system behavior.",
      keyConcepts: [
        "Prometheus / Grafana",
        "Log Aggregation (ELK)",
        "Distributed Tracing",
        "Alerting",
        "SLOs",
      ],
      difficulty: "intermediate",
      estimatedTime: "2 weeks",
    },
    {
      id: "dv-security",
      label: "DevSecOps",
      section: "Advanced",
      type: "optional",
      description:
        "Shift security left — vulnerability scanning, secrets management, and SAST/DAST in CI pipelines. Security should be automated, not a manual checklist at the end of a sprint.",
      keyConcepts: [
        "SAST / DAST",
        "Secrets Management (Vault)",
        "Container Scanning",
        "SBOM",
        "Policy as Code",
      ],
      difficulty: "advanced",
      estimatedTime: "2 weeks",
    },
  ],
  edges: [
    { from: "dv-linux", to: "dv-net" },
    { from: "dv-net", to: "dv-docker" },
    { from: "dv-docker", to: "dv-k8s" },
    { from: "dv-docker", to: "dv-gh" },
    { from: "dv-linux", to: "dv-iac" },
    { from: "dv-k8s", to: "dv-monitor" },
    { from: "dv-gh", to: "dv-monitor" },
    { from: "dv-iac", to: "dv-k8s" },
    { from: "dv-monitor", to: "dv-security" },
  ],
};

// ─── 9. Android Development ───────────────────────────────────────────────────
const androidDomain: BlueprintDomain = {
  id: "android",
  name: "Android Development",
  icon: "📱",
  color: "#22c55e",
  description:
    "Build native Android apps with Kotlin, Jetpack Compose, and the Android ecosystem.",
  category: "mobile",
  estimatedHours: 240,
  difficulty: "intermediate",
  nodes: [
    {
      id: "an-kotlin",
      label: "Kotlin Basics",
      section: "Foundations",
      type: "required",
      description:
        "Kotlin syntax, null safety, extension functions, coroutines, and OOP. Kotlin is the official Android language — its null safety system alone eliminates an entire class of common Android crashes.",
      keyConcepts: [
        "Null Safety",
        "Data Classes",
        "Extension Functions",
        "Coroutines",
        "Sealed Classes",
      ],
      difficulty: "beginner",
      estimatedTime: "2 weeks",
    },
    {
      id: "an-activity",
      label: "Activities & Fragments",
      section: "Android Core",
      type: "required",
      description:
        "Lifecycle, back stack, fragment transactions, and navigation component. Understanding the Activity lifecycle is foundational — mishandling lifecycle events causes the most common Android bugs.",
      keyConcepts: [
        "Activity Lifecycle",
        "Fragments",
        "Intent",
        "Back Stack",
        "Navigation Component",
      ],
      difficulty: "beginner",
      estimatedTime: "2 weeks",
    },
    {
      id: "an-layouts",
      label: "Layouts & Views",
      section: "Android Core",
      type: "required",
      description:
        "XML layouts, ConstraintLayout, RecyclerView, and view binding. Good layout design is about both visual quality and performance — avoid deep view hierarchies.",
      keyConcepts: [
        "ConstraintLayout",
        "RecyclerView",
        "ViewBinding",
        "Material Design",
        "DP / SP Units",
      ],
      difficulty: "beginner",
      estimatedTime: "2 weeks",
    },
    {
      id: "an-compose",
      label: "Jetpack Compose",
      section: "Modern UI",
      type: "required",
      description:
        "Declarative UI toolkit — composables, state hoisting, and theming. Compose is the future of Android UI — it simplifies complex animations and state management dramatically.",
      keyConcepts: [
        "Composable Functions",
        "State Hoisting",
        "LazyColumn",
        "Material 3",
        "Animation APIs",
      ],
      difficulty: "intermediate",
      estimatedTime: "4 weeks",
    },
    {
      id: "an-mvvm",
      label: "MVVM & Architecture",
      section: "Architecture",
      type: "required",
      description:
        "ViewModel, LiveData, Flow, Room, and clean architecture patterns. Android apps without clear architecture become unmaintainable — MVVM separates UI from business logic cleanly.",
      keyConcepts: [
        "ViewModel",
        "LiveData / StateFlow",
        "Room Database",
        "Hilt (DI)",
        "Repository Pattern",
      ],
      difficulty: "intermediate",
      estimatedTime: "3 weeks",
    },
    {
      id: "an-network",
      label: "Networking & APIs",
      section: "Data Layer",
      type: "required",
      description:
        "Consume REST APIs with Retrofit and handle authentication. Mobile apps almost always need to communicate with a backend — Retrofit makes it type-safe and declarative.",
      keyConcepts: [
        "Retrofit",
        "OkHttp Interceptors",
        "Coroutines & Flow",
        "Error Handling",
        "Offline First",
      ],
      difficulty: "intermediate",
      estimatedTime: "2 weeks",
    },
    {
      id: "an-testing",
      label: "Testing",
      section: "Advanced",
      type: "optional",
      description:
        "Unit test ViewModels and Composables — Robolectric for Android-specific tests, Espresso for UI. A well-tested Android app can be refactored and maintained for years.",
      keyConcepts: [
        "JUnit 4/5",
        "Mockk",
        "Robolectric",
        "Compose Testing",
        "UI Automator",
      ],
      difficulty: "intermediate",
      estimatedTime: "2 weeks",
    },
    {
      id: "an-play",
      label: "Play Store Publishing",
      section: "Advanced",
      type: "required",
      description:
        "Sign, build, and publish your app — APK vs AAB, review process, and monetization strategies. Publishing is where your app meets real users — understand the review process to avoid rejections.",
      keyConcepts: [
        "AAB Format",
        "Keystore Signing",
        "Play Console",
        "App Review",
        "In-App Purchases",
      ],
      difficulty: "intermediate",
      estimatedTime: "1 week",
    },
  ],
  edges: [
    { from: "an-kotlin", to: "an-activity" },
    { from: "an-activity", to: "an-layouts" },
    { from: "an-layouts", to: "an-compose" },
    { from: "an-compose", to: "an-mvvm" },
    { from: "an-mvvm", to: "an-network" },
    { from: "an-network", to: "an-testing" },
    { from: "an-testing", to: "an-play" },
    { from: "an-mvvm", to: "an-play" },
  ],
};

// ─── 10. iOS Development ──────────────────────────────────────────────────────
const iosDomain: BlueprintDomain = {
  id: "ios",
  name: "iOS Development",
  icon: "🍎",
  color: "#64748b",
  description:
    "Build native iOS apps with Swift, SwiftUI, and the Apple ecosystem.",
  category: "mobile",
  estimatedHours: 240,
  difficulty: "intermediate",
  nodes: [
    {
      id: "ios-swift",
      label: "Swift Basics",
      section: "Foundations",
      type: "required",
      description:
        "Swift syntax, optionals, closures, protocols, and value vs reference types. Swift's safety features — optionals, value semantics, and the actor model — eliminate entire classes of bugs that plagued Objective-C.",
      keyConcepts: [
        "Optionals",
        "Closures",
        "Protocols & Extensions",
        "Value vs Reference Types",
        "Error Handling",
      ],
      difficulty: "beginner",
      estimatedTime: "3 weeks",
    },
    {
      id: "ios-uikit",
      label: "UIKit Basics",
      section: "UI Fundamentals",
      type: "required",
      description:
        "View controllers, Auto Layout, table views, and the UIKit lifecycle. UIKit still powers many apps and is essential for working with legacy codebases — Auto Layout mastery is critical.",
      keyConcepts: [
        "View Controllers",
        "Auto Layout",
        "UITableView",
        "Navigation Stack",
        "Storyboards vs Code",
      ],
      difficulty: "beginner",
      estimatedTime: "3 weeks",
    },
    {
      id: "ios-swiftui",
      label: "SwiftUI",
      section: "Modern UI",
      type: "required",
      description:
        "Declarative UI with SwiftUI — views, state management, animations, and previews. SwiftUI is Apple's vision for the future of Apple platform development across iOS, macOS, watchOS, and tvOS.",
      keyConcepts: [
        "View Protocol",
        "@State & @Binding",
        "NavigationStack",
        "Animations",
        "Canvas Previews",
      ],
      difficulty: "intermediate",
      estimatedTime: "4 weeks",
    },
    {
      id: "ios-combine",
      label: "Combine & async/await",
      section: "Reactive",
      type: "required",
      description:
        "Reactive programming with Combine and Swift Concurrency. Modern iOS development uses async/await and actors to write concurrent code that's readable and free of data races.",
      keyConcepts: [
        "Publishers & Subscribers",
        "async / await",
        "Actors",
        "Task Groups",
        "MainActor",
      ],
      difficulty: "intermediate",
      estimatedTime: "2 weeks",
    },
    {
      id: "ios-data",
      label: "Data Persistence",
      section: "Data Layer",
      type: "required",
      description:
        "Store data locally with Core Data, SwiftData, and UserDefaults. Understanding when to use each persistence mechanism is key to building responsive, offline-capable apps.",
      keyConcepts: [
        "Core Data",
        "SwiftData",
        "UserDefaults",
        "Keychain",
        "iCloud Sync",
      ],
      difficulty: "intermediate",
      estimatedTime: "2 weeks",
    },
    {
      id: "ios-network",
      label: "Networking",
      section: "Data Layer",
      type: "required",
      description:
        "Consume REST APIs with URLSession, decode JSON with Codable, and handle authentication. iOS networking combines Apple's URL loading system with Swift Concurrency for clean async code.",
      keyConcepts: [
        "URLSession",
        "Codable",
        "Async Networking",
        "Authentication Challenges",
        "Background Fetch",
      ],
      difficulty: "intermediate",
      estimatedTime: "1 week",
    },
    {
      id: "ios-appstore",
      label: "App Store Publishing",
      section: "Distribution",
      type: "required",
      description:
        "Provision, sign, and submit your app to the App Store via Xcode and App Store Connect. Apple's review process is thorough — understanding the guidelines saves weeks of back-and-forth.",
      keyConcepts: [
        "Provisioning Profiles",
        "Code Signing",
        "TestFlight",
        "App Review Guidelines",
        "In-App Purchases",
      ],
      difficulty: "intermediate",
      estimatedTime: "1 week",
    },
    {
      id: "ios-arkit",
      label: "ARKit / RealityKit",
      section: "Advanced",
      type: "optional",
      description:
        "Build augmented reality experiences with ARKit and RealityKit. Apple's AR frameworks are the most sophisticated on any platform — powering everything from IKEA's furniture placement to surgical training apps.",
      keyConcepts: [
        "ARSession",
        "Plane Detection",
        "RealityKit Anchors",
        "Reality Composer",
        "Spatial Audio",
      ],
      difficulty: "advanced",
      estimatedTime: "3 weeks",
    },
  ],
  edges: [
    { from: "ios-swift", to: "ios-uikit" },
    { from: "ios-uikit", to: "ios-swiftui" },
    { from: "ios-swiftui", to: "ios-combine" },
    { from: "ios-combine", to: "ios-data" },
    { from: "ios-combine", to: "ios-network" },
    { from: "ios-data", to: "ios-appstore" },
    { from: "ios-network", to: "ios-appstore" },
    { from: "ios-swiftui", to: "ios-arkit" },
  ],
};

// ─── 11. Cybersecurity ────────────────────────────────────────────────────────
const cybersecurityDomain: BlueprintDomain = {
  id: "cybersecurity",
  name: "Cybersecurity",
  icon: "🔐",
  color: "#ef4444",
  description:
    "Protect systems from attacks — networking, cryptography, pentesting, and defense.",
  category: "security",
  estimatedHours: 320,
  difficulty: "advanced",
  nodes: [
    {
      id: "cy-net",
      label: "Networking & Protocols",
      section: "Fundamentals",
      type: "required",
      description:
        "TCP/IP, DNS, HTTP, OSI model, and network scanning with nmap. Network knowledge is the bedrock of cybersecurity — every attack and defense happens at some layer of the network stack.",
      keyConcepts: [
        "OSI Model",
        "TCP/IP",
        "Firewalls & IDS",
        "TLS/SSL",
        "Wireshark",
      ],
      difficulty: "beginner",
      estimatedTime: "2 weeks",
    },
    {
      id: "cy-linux",
      label: "Linux Security",
      section: "Fundamentals",
      type: "required",
      description:
        "Linux hardening, privilege management, sudoers, file permissions, and audit logging. Most servers run Linux — knowing how to secure and audit Linux systems is a core security skill.",
      keyConcepts: [
        "chmod / chown",
        "sudoers & PAM",
        "SELinux / AppArmor",
        "Audit Daemon",
        "SSH Hardening",
      ],
      difficulty: "beginner",
      estimatedTime: "2 weeks",
    },
    {
      id: "cy-crypto",
      label: "Cryptography",
      section: "Fundamentals",
      type: "required",
      description:
        "Symmetric/asymmetric encryption, hashing, PKI, and digital signatures. Cryptography underpins all secure communication — TLS, SSH, password storage, and code signing all rely on it.",
      keyConcepts: [
        "AES / RSA / ECC",
        "Hashing (SHA-256, bcrypt)",
        "PKI & Certificates",
        "Digital Signatures",
        "Key Exchange",
      ],
      difficulty: "intermediate",
      estimatedTime: "2 weeks",
    },
    {
      id: "cy-web",
      label: "Web Security (OWASP)",
      section: "Offensive",
      type: "required",
      description:
        "OWASP Top 10 — SQL injection, XSS, CSRF, broken auth, and IDOR. Web applications are the most attacked surface in 2025 — every developer should understand these vulnerabilities.",
      keyConcepts: [
        "SQL Injection",
        "XSS / CSRF",
        "IDOR",
        "Security Headers",
        "Input Validation",
      ],
      difficulty: "intermediate",
      estimatedTime: "3 weeks",
    },
    {
      id: "cy-pen",
      label: "Penetration Testing",
      section: "Offensive",
      type: "optional",
      description:
        "Ethical hacking methodology — recon, exploitation, and reporting. Pentesting teaches you to think like an attacker, which makes you a dramatically better defender.",
      keyConcepts: [
        "Recon & OSINT",
        "Metasploit",
        "Burp Suite",
        "Privilege Escalation",
        "Reporting",
      ],
      difficulty: "advanced",
      estimatedTime: "6 weeks",
    },
    {
      id: "cy-fw",
      label: "Firewalls & SIEM",
      section: "Defensive",
      type: "required",
      description:
        "Defense-in-depth with firewalls, IDS/IPS, and SIEM log analysis. Detection is as important as prevention — a good SIEM turns mountains of log data into actionable security alerts.",
      keyConcepts: [
        "Firewall Rules",
        "IDS / IPS",
        "SIEM (Splunk / ELK)",
        "Log Analysis",
        "Alert Tuning",
      ],
      difficulty: "intermediate",
      estimatedTime: "2 weeks",
    },
    {
      id: "cy-ir",
      label: "Incident Response",
      section: "Defensive",
      type: "optional",
      description:
        "NIST IR framework — identify, contain, eradicate, and recover from breaches. Incident response planning separates organizations that recover quickly from those that spend weeks in crisis mode.",
      keyConcepts: [
        "NIST IR Framework",
        "Digital Forensics",
        "Memory Analysis",
        "Containment Strategy",
        "Evidence Handling",
      ],
      difficulty: "advanced",
      estimatedTime: "3 weeks",
    },
    {
      id: "cy-cloud",
      label: "Cloud Security",
      section: "Advanced",
      type: "required",
      description:
        "Secure AWS, GCP, or Azure environments — IAM policies, VPC design, S3 hardening, and compliance. Cloud misconfigurations cause more breaches than traditional hacking — this knowledge is critical.",
      keyConcepts: [
        "IAM Least Privilege",
        "VPC & Security Groups",
        "Secrets Manager",
        "CloudTrail",
        "Compliance (SOC2)",
      ],
      difficulty: "advanced",
      estimatedTime: "3 weeks",
    },
  ],
  edges: [
    { from: "cy-net", to: "cy-linux" },
    { from: "cy-linux", to: "cy-crypto" },
    { from: "cy-crypto", to: "cy-web" },
    { from: "cy-web", to: "cy-pen" },
    { from: "cy-web", to: "cy-fw" },
    { from: "cy-fw", to: "cy-ir" },
    { from: "cy-fw", to: "cy-cloud" },
    { from: "cy-pen", to: "cy-cloud" },
  ],
};

// ─── 12. Blockchain ───────────────────────────────────────────────────────────
const blockchainDomain: BlueprintDomain = {
  id: "blockchain",
  name: "Blockchain",
  icon: "⛓️",
  color: "#f59e0b",
  description:
    "Build decentralized apps with Ethereum, Solidity, and Web3 technologies.",
  category: "other",
  estimatedHours: 280,
  difficulty: "advanced",
  nodes: [
    {
      id: "bc-basics",
      label: "Blockchain Fundamentals",
      section: "Foundations",
      type: "required",
      description:
        "Distributed ledgers, consensus mechanisms, cryptographic hashing, and the blockchain data structure. Understanding why blockchain works — and when it doesn't — prevents you from applying it where it's not needed.",
      keyConcepts: [
        "Distributed Ledger",
        "Consensus (PoW/PoS)",
        "SHA-256",
        "Merkle Trees",
        "Forks",
      ],
      difficulty: "beginner",
      estimatedTime: "2 weeks",
    },
    {
      id: "bc-crypto",
      label: "Cryptography for Blockchain",
      section: "Foundations",
      type: "required",
      description:
        "Public/private keys, digital signatures, hash functions, and Merkle trees. Every blockchain transaction is a cryptographically signed message — this knowledge is not optional.",
      keyConcepts: [
        "ECDSA",
        "Digital Signatures",
        "Address Derivation",
        "HD Wallets",
        "BIP-39",
      ],
      difficulty: "intermediate",
      estimatedTime: "1 week",
    },
    {
      id: "bc-ethereum",
      label: "Ethereum & EVM",
      section: "Ethereum",
      type: "required",
      description:
        "The Ethereum Virtual Machine, accounts, transactions, gas, and the EVM execution model. Ethereum is the dominant smart contract platform — understanding the EVM is essential for Solidity development.",
      keyConcepts: [
        "EVM Architecture",
        "EOAs vs Contract Accounts",
        "Gas & OpCodes",
        "Transaction Lifecycle",
        "RPC",
      ],
      difficulty: "intermediate",
      estimatedTime: "2 weeks",
    },
    {
      id: "bc-solidity",
      label: "Solidity",
      section: "Ethereum",
      type: "required",
      description:
        "Write smart contracts in Solidity — data types, mappings, events, modifiers, and inheritance. Solidity bugs can permanently lock funds — mastering security patterns is non-negotiable.",
      keyConcepts: [
        "Data Types & Storage",
        "Mappings & Arrays",
        "Events & Modifiers",
        "Inheritance",
        "Error Handling",
      ],
      difficulty: "intermediate",
      estimatedTime: "4 weeks",
    },
    {
      id: "bc-security",
      label: "Smart Contract Security",
      section: "Ethereum",
      type: "required",
      description:
        "Common vulnerabilities — reentrancy, integer overflow, access control failures, and oracle manipulation. The Ethereum ecosystem has lost billions to smart contract bugs. Security is the most critical skill.",
      keyConcepts: [
        "Reentrancy",
        "Integer Overflow",
        "Access Control",
        "Oracle Manipulation",
        "Audit Process",
      ],
      difficulty: "advanced",
      estimatedTime: "3 weeks",
    },
    {
      id: "bc-hardhat",
      label: "Hardhat & Testing",
      section: "Tools",
      type: "required",
      description:
        "Test, deploy, and verify smart contracts with Hardhat. Production smart contracts must be battle-tested before deployment — a unit test for a smart contract is a security measure.",
      keyConcepts: [
        "Hardhat / Foundry",
        "Mocha & Chai Tests",
        "Deployments",
        "Etherscan Verification",
        "Code Coverage",
      ],
      difficulty: "intermediate",
      estimatedTime: "2 weeks",
    },
    {
      id: "bc-web3",
      label: "Web3.js / Ethers.js",
      section: "Frontend",
      type: "required",
      description:
        "Connect web frontends to the Ethereum network with ethers.js. Building a DApp UI requires understanding how to read state from the chain and sign transactions with a user's wallet.",
      keyConcepts: [
        "Provider & Signer",
        "Contract Interaction",
        "Wallet Connection (MetaMask)",
        "Events Listening",
        "IPFS",
      ],
      difficulty: "intermediate",
      estimatedTime: "2 weeks",
    },
    {
      id: "bc-defi",
      label: "DeFi Protocols",
      section: "Advanced",
      type: "optional",
      description:
        "Understand and build DeFi primitives — AMMs, lending protocols, yield farming, and flash loans. DeFi is the most active area of blockchain development with multi-billion dollar TVL.",
      keyConcepts: [
        "AMM (Uniswap)",
        "Lending (Aave/Compound)",
        "Flash Loans",
        "Yield Farming",
        "MEV",
      ],
      difficulty: "advanced",
      estimatedTime: "4 weeks",
    },
  ],
  edges: [
    { from: "bc-basics", to: "bc-crypto" },
    { from: "bc-crypto", to: "bc-ethereum" },
    { from: "bc-ethereum", to: "bc-solidity" },
    { from: "bc-solidity", to: "bc-security" },
    { from: "bc-solidity", to: "bc-hardhat" },
    { from: "bc-hardhat", to: "bc-web3" },
    { from: "bc-security", to: "bc-defi" },
    { from: "bc-web3", to: "bc-defi" },
  ],
};

// ─── 13. Cloud Computing ──────────────────────────────────────────────────────
const cloudDomain: BlueprintDomain = {
  id: "cloud",
  name: "Cloud Computing",
  icon: "☁️",
  color: "#3b82f6",
  description:
    "Deploy and scale applications on AWS, GCP, or Azure with cloud-native architectures.",
  category: "devops",
  estimatedHours: 260,
  difficulty: "intermediate",
  nodes: [
    {
      id: "cl-fundamentals",
      label: "Cloud Fundamentals",
      section: "Foundations",
      type: "required",
      description:
        "IaaS, PaaS, SaaS, regions, AZs, and the shared responsibility model. Understanding the cloud delivery models helps you make architecture decisions and reason about security boundaries.",
      keyConcepts: [
        "IaaS / PaaS / SaaS",
        "Regions & AZs",
        "Shared Responsibility",
        "OpEx vs CapEx",
        "HA & DR",
      ],
      difficulty: "beginner",
      estimatedTime: "1 week",
    },
    {
      id: "cl-compute",
      label: "Compute (EC2 / VMs)",
      section: "Core Services",
      type: "required",
      description:
        "Launch, configure, and scale virtual machines. EC2 is the foundation of AWS — understanding instance types, AMIs, and auto scaling groups is essential for any cloud architect.",
      keyConcepts: [
        "EC2 Instance Types",
        "AMIs",
        "Auto Scaling",
        "Load Balancers",
        "Placement Groups",
      ],
      difficulty: "beginner",
      estimatedTime: "2 weeks",
    },
    {
      id: "cl-storage",
      label: "Storage (S3 / Blob)",
      section: "Core Services",
      type: "required",
      description:
        "Object storage, file storage, and block storage. S3 is one of the most versatile services in AWS — it powers everything from static websites to data lakes to ML training datasets.",
      keyConcepts: [
        "S3 Buckets & Policies",
        "Lifecycle Rules",
        "Object Versioning",
        "CDN (CloudFront)",
        "EBS / EFS",
      ],
      difficulty: "beginner",
      estimatedTime: "1 week",
    },
    {
      id: "cl-networking",
      label: "Networking (VPC)",
      section: "Core Services",
      type: "required",
      description:
        "Design secure cloud networks with VPCs, subnets, security groups, and routing. VPC architecture determines the security posture of your entire cloud environment — design it thoughtfully.",
      keyConcepts: [
        "VPCs & Subnets",
        "Security Groups & NACLs",
        "Route Tables",
        "VPN / Direct Connect",
        "NAT Gateway",
      ],
      difficulty: "intermediate",
      estimatedTime: "2 weeks",
    },
    {
      id: "cl-serverless",
      label: "Serverless",
      section: "Modern Patterns",
      type: "required",
      description:
        "Build event-driven applications with Lambda functions, API Gateway, and managed services. Serverless eliminates server management overhead and enables pay-per-use pricing at massive scale.",
      keyConcepts: [
        "Lambda Functions",
        "API Gateway",
        "SQS / SNS",
        "EventBridge",
        "Cold Starts",
      ],
      difficulty: "intermediate",
      estimatedTime: "2 weeks",
    },
    {
      id: "cl-iac",
      label: "Infrastructure as Code",
      section: "Automation",
      type: "required",
      description:
        "Provision cloud resources reproducibly with Terraform or CloudFormation. IaC turns your infrastructure into version-controlled code — enabling code review, reproducibility, and disaster recovery.",
      keyConcepts: [
        "Terraform HCL",
        "State Management",
        "Modules",
        "CloudFormation",
        "CDK",
      ],
      difficulty: "intermediate",
      estimatedTime: "3 weeks",
    },
    {
      id: "cl-containers",
      label: "Container Services",
      section: "Modern Patterns",
      type: "required",
      description:
        "Run containerized workloads with ECS, EKS, or Cloud Run. Containers have become the standard unit of deployment — understanding managed container services reduces operational overhead dramatically.",
      keyConcepts: [
        "ECS Fargate",
        "EKS",
        "ECR",
        "Task Definitions",
        "Service Mesh",
      ],
      difficulty: "intermediate",
      estimatedTime: "3 weeks",
    },
    {
      id: "cl-cost",
      label: "Cost Optimization",
      section: "Advanced",
      type: "optional",
      description:
        "Optimize cloud spend with reserved instances, spot instances, and right-sizing. Cloud bills can spiral out of control without cost governance — understanding pricing models is a competitive advantage.",
      keyConcepts: [
        "Reserved Instances",
        "Spot Instances",
        "Right-Sizing",
        "Cost Explorer",
        "Savings Plans",
      ],
      difficulty: "intermediate",
      estimatedTime: "1 week",
    },
  ],
  edges: [
    { from: "cl-fundamentals", to: "cl-compute" },
    { from: "cl-compute", to: "cl-storage" },
    { from: "cl-storage", to: "cl-networking" },
    { from: "cl-networking", to: "cl-serverless" },
    { from: "cl-networking", to: "cl-containers" },
    { from: "cl-serverless", to: "cl-iac" },
    { from: "cl-containers", to: "cl-iac" },
    { from: "cl-iac", to: "cl-cost" },
  ],
};

// ─── 14. Game Development ─────────────────────────────────────────────────────
const gameDomain: BlueprintDomain = {
  id: "gamedev",
  name: "Game Development",
  icon: "🎮",
  color: "#10b981",
  description:
    "Build 2D and 3D games with Unity, Godot, or browser-based engines.",
  category: "other",
  estimatedHours: 280,
  difficulty: "intermediate",
  nodes: [
    {
      id: "gd-math",
      label: "Game Math",
      section: "Foundations",
      type: "required",
      description:
        "Vectors, matrices, trigonometry, and physics fundamentals for games. Game math is not abstract — vectors describe movement, matrices describe transformations, and trig drives all rotational motion.",
      keyConcepts: [
        "Vector Math",
        "Matrix Transforms",
        "Trigonometry",
        "Quaternions",
        "Physics (kinematics)",
      ],
      difficulty: "beginner",
      estimatedTime: "2 weeks",
    },
    {
      id: "gd-engine",
      label: "Choose a Game Engine",
      section: "Foundations",
      type: "required",
      description:
        "Unity (C#), Godot (GDScript/C#), or Phaser (JavaScript) — each has a different sweet spot. Unity dominates professional 3D games, Godot is excellent for 2D indie games, Phaser for web games.",
      keyConcepts: [
        "Unity",
        "Godot",
        "Phaser (Web)",
        "Unreal Engine",
        "Engine Architecture",
      ],
      difficulty: "beginner",
      estimatedTime: "1 week",
    },
    {
      id: "gd-2d",
      label: "2D Game Development",
      section: "Core",
      type: "required",
      description:
        "Sprites, tile maps, collision detection, physics, and 2D cameras. 2D games are the best starting point — the concepts transfer directly to 3D, and 2D games can be incredibly profitable (Stardew Valley, Celeste).",
      keyConcepts: [
        "Sprites & Animations",
        "Tilemap",
        "2D Physics",
        "Camera",
        "Parallax Backgrounds",
      ],
      difficulty: "beginner",
      estimatedTime: "4 weeks",
    },
    {
      id: "gd-3d",
      label: "3D Game Development",
      section: "Core",
      type: "required",
      description:
        "Meshes, materials, lighting, 3D physics, and cameras. The step from 2D to 3D introduces new complexity in every dimension — lighting, depth, and spatial reasoning all become essential.",
      keyConcepts: [
        "3D Meshes & Materials",
        "Lighting Systems",
        "3D Physics",
        "Character Controller",
        "Skyboxes",
      ],
      difficulty: "intermediate",
      estimatedTime: "4 weeks",
    },
    {
      id: "gd-input",
      label: "Input & Controls",
      section: "Core",
      type: "required",
      description:
        "Keyboard, mouse, gamepad, and touch input systems. Game feel is largely determined by input handling — responsive controls separate frustrating games from enjoyable ones.",
      keyConcepts: [
        "Input System",
        "Action Maps",
        "Gamepad Support",
        "Touch Input",
        "Input Buffering",
      ],
      difficulty: "beginner",
      estimatedTime: "1 week",
    },
    {
      id: "gd-audio",
      label: "Audio & Music",
      section: "Polish",
      type: "required",
      description:
        "Sound effects, background music, spatial audio, and audio mixing. Audio is underrated in game development — the right sound effect makes an action feel 10x more satisfying.",
      keyConcepts: [
        "AudioSource / AudioBus",
        "Sound Effects",
        "Music Looping",
        "Spatial Audio",
        "Mixing",
      ],
      difficulty: "beginner",
      estimatedTime: "1 week",
    },
    {
      id: "gd-ui",
      label: "Game UI / HUD",
      section: "Polish",
      type: "required",
      description:
        "Health bars, score displays, menus, and pause screens. Game UIs are constrained by the game's visual language — they must be readable without breaking immersion.",
      keyConcepts: [
        "Canvas vs World UI",
        "Health / Score HUD",
        "Menus & Transitions",
        "Inventory UI",
        "Accessibility",
      ],
      difficulty: "beginner",
      estimatedTime: "1 week",
    },
    {
      id: "gd-publish",
      label: "Publishing & Monetization",
      section: "Advanced",
      type: "required",
      description:
        "Publish to Steam, itch.io, the App Store, or the web. Distribution is where many indie developers get stuck — understanding platform requirements, store pages, and marketing is critical.",
      keyConcepts: [
        "Steam / itch.io",
        "App Store / Play Store",
        "Build Optimization",
        "Marketing",
        "Monetization Models",
      ],
      difficulty: "intermediate",
      estimatedTime: "2 weeks",
    },
  ],
  edges: [
    { from: "gd-math", to: "gd-engine" },
    { from: "gd-engine", to: "gd-2d" },
    { from: "gd-2d", to: "gd-3d" },
    { from: "gd-engine", to: "gd-input" },
    { from: "gd-input", to: "gd-audio" },
    { from: "gd-audio", to: "gd-ui" },
    { from: "gd-3d", to: "gd-publish" },
    { from: "gd-ui", to: "gd-publish" },
  ],
};

// ─── 15. UI/UX Design ─────────────────────────────────────────────────────────
const uiuxDomain: BlueprintDomain = {
  id: "uiux",
  name: "UI/UX Design",
  icon: "🎨",
  color: "#ec4899",
  description:
    "Design beautiful, user-centered interfaces — from wireframes to polished prototypes.",
  category: "design",
  estimatedHours: 200,
  difficulty: "beginner",
  nodes: [
    {
      id: "ux-principles",
      label: "UX Principles",
      section: "Foundations",
      type: "required",
      description:
        "User-centered design, mental models, affordances, feedback, and the design thinking process. Good UX is invisible — users accomplish their goals without thinking about the interface.",
      keyConcepts: [
        "User-Centered Design",
        "Mental Models",
        "Affordances",
        "Feedback Loops",
        "Design Thinking",
      ],
      difficulty: "beginner",
      estimatedTime: "1 week",
    },
    {
      id: "ux-research",
      label: "User Research",
      section: "Discovery",
      type: "required",
      description:
        "Understand users through interviews, surveys, usability tests, and analytics. Research is what separates design from decoration — you cannot design for users you do not understand.",
      keyConcepts: [
        "User Interviews",
        "Surveys",
        "Usability Testing",
        "Affinity Mapping",
        "Personas",
      ],
      difficulty: "beginner",
      estimatedTime: "2 weeks",
    },
    {
      id: "ux-ia",
      label: "Information Architecture",
      section: "Discovery",
      type: "required",
      description:
        "Organize information for findability — navigation patterns, sitemaps, card sorting, and content hierarchies. Bad IA makes users feel lost — good IA makes finding things feel effortless.",
      keyConcepts: [
        "Sitemaps",
        "Card Sorting",
        "Navigation Patterns",
        "Content Hierarchies",
        "Search Patterns",
      ],
      difficulty: "beginner",
      estimatedTime: "1 week",
    },
    {
      id: "ux-wireframes",
      label: "Wireframing",
      section: "Design",
      type: "required",
      description:
        "Sketch low-fidelity wireframes to explore layout options quickly. Wireframes make it cheap to explore many design options before committing to any visual direction — iterate fast at low fidelity.",
      keyConcepts: [
        "Low-Fidelity Sketches",
        "Grid Systems",
        "Component Inventory",
        "User Flows",
        "Responsive Wireframes",
      ],
      difficulty: "beginner",
      estimatedTime: "1 week",
    },
    {
      id: "ux-visual",
      label: "Visual Design",
      section: "Design",
      type: "required",
      description:
        "Typography, color, spacing, iconography, and visual hierarchy. Visual design is how you communicate hierarchy, importance, and tone — every visual choice sends a message to the user.",
      keyConcepts: [
        "Typography Scale",
        "Color Theory",
        "Spacing System",
        "Iconography",
        "Visual Hierarchy",
      ],
      difficulty: "beginner",
      estimatedTime: "2 weeks",
    },
    {
      id: "ux-figma",
      label: "Figma",
      section: "Tools",
      type: "required",
      description:
        "Design high-fidelity mockups, components, auto layout, and interactive prototypes in Figma. Figma has become the industry standard — its component system enables design at scale.",
      keyConcepts: [
        "Components & Variants",
        "Auto Layout",
        "Styles & Libraries",
        "Prototyping",
        "Dev Mode",
      ],
      difficulty: "beginner",
      estimatedTime: "3 weeks",
    },
    {
      id: "ux-design-system",
      label: "Design Systems",
      section: "Advanced",
      type: "required",
      description:
        "Build scalable design systems with component libraries, tokens, and documentation. Design systems make a team's output consistent and dramatically reduce design and engineering time.",
      keyConcepts: [
        "Design Tokens",
        "Component Library",
        "Pattern Documentation",
        "Atomic Design",
        "Figma Libraries",
      ],
      difficulty: "intermediate",
      estimatedTime: "3 weeks",
    },
    {
      id: "ux-motion",
      label: "Motion Design",
      section: "Advanced",
      type: "optional",
      description:
        "Animate UI transitions, microinteractions, and loading states. Good motion communicates causality and state changes — bad motion distracts users from their actual goals.",
      keyConcepts: [
        "Easing Curves",
        "Transition Principles",
        "Micro-interactions",
        "Skeleton Screens",
        "Accessibility",
      ],
      difficulty: "intermediate",
      estimatedTime: "2 weeks",
    },
  ],
  edges: [
    { from: "ux-principles", to: "ux-research" },
    { from: "ux-research", to: "ux-ia" },
    { from: "ux-ia", to: "ux-wireframes" },
    { from: "ux-wireframes", to: "ux-visual" },
    { from: "ux-visual", to: "ux-figma" },
    { from: "ux-figma", to: "ux-design-system" },
    { from: "ux-design-system", to: "ux-motion" },
  ],
};

// ─── 16. System Design ────────────────────────────────────────────────────────
const systemDesignDomain: BlueprintDomain = {
  id: "systemdesign",
  name: "System Design",
  icon: "🏗️",
  color: "#475569",
  description:
    "Design scalable distributed systems — from load balancing to microservices.",
  category: "other",
  estimatedHours: 180,
  difficulty: "advanced",
  nodes: [
    {
      id: "sd-scale",
      label: "Scalability",
      section: "Basics",
      type: "required",
      description:
        "Horizontal vs vertical scaling, stateless services, and bottleneck analysis. Understanding how to identify and remove bottlenecks is the core skill of a systems designer.",
      keyConcepts: [
        "Horizontal vs Vertical",
        "Stateless Services",
        "Bottleneck Analysis",
        "Throughput vs Latency",
        "SLA / SLO",
      ],
      difficulty: "beginner",
      estimatedTime: "1 week",
    },
    {
      id: "sd-lb",
      label: "Load Balancing",
      section: "Basics",
      type: "required",
      description:
        "Distribute traffic with round-robin, consistent hashing, and health checks. Load balancers are the first line of defense against traffic spikes and single points of failure.",
      keyConcepts: [
        "Round-Robin",
        "Consistent Hashing",
        "Health Checks",
        "L4 vs L7",
        "Session Stickiness",
      ],
      difficulty: "intermediate",
      estimatedTime: "1 week",
    },
    {
      id: "sd-cache",
      label: "Caching",
      section: "Basics",
      type: "required",
      description:
        "CDN, in-memory caches (Redis), eviction policies, and cache invalidation. Caching can reduce database load by 90% — but cache invalidation is one of the hardest problems in computer science.",
      keyConcepts: [
        "CDN",
        "Redis / Memcached",
        "Cache-Aside / Write-Through",
        "Cache Invalidation",
        "TTL",
      ],
      difficulty: "intermediate",
      estimatedTime: "1 week",
    },
    {
      id: "sd-db",
      label: "Database Selection",
      section: "Data",
      type: "required",
      description:
        "SQL vs NoSQL, when to choose each, replication, and sharding. The most important system design decision is often which database to use — getting it wrong early is expensive to fix.",
      keyConcepts: [
        "SQL vs NoSQL",
        "ACID vs BASE",
        "Replication",
        "Sharding Strategies",
        "Read Replicas",
      ],
      difficulty: "intermediate",
      estimatedTime: "2 weeks",
    },
    {
      id: "sd-cap",
      label: "CAP Theorem",
      section: "Data",
      type: "required",
      description:
        "Consistency, availability, partition tolerance — tradeoffs in distributed databases. CAP forces you to make explicit choices about what your system sacrifices under network failures.",
      keyConcepts: [
        "CAP Theorem",
        "Consistency Models",
        "Eventual Consistency",
        "Cassandra vs Zookeeper",
        "CRDT",
      ],
      difficulty: "advanced",
      estimatedTime: "1 week",
    },
    {
      id: "sd-micro",
      label: "Microservices",
      section: "Architecture",
      type: "required",
      description:
        "Decompose monoliths into independent services with well-defined APIs. Microservices enable independent deployments and scaling, but introduce distributed systems complexity.",
      keyConcepts: [
        "Service Boundaries",
        "Domain-Driven Design",
        "API Gateway",
        "Service Discovery",
        "Circuit Breakers",
      ],
      difficulty: "advanced",
      estimatedTime: "3 weeks",
    },
    {
      id: "sd-event",
      label: "Event-Driven Architecture",
      section: "Architecture",
      type: "optional",
      description:
        "Async communication with Kafka, event sourcing, and CQRS patterns. Event-driven systems decouple producers from consumers and enable powerful audit trails and replay capabilities.",
      keyConcepts: [
        "Kafka / RabbitMQ",
        "Event Sourcing",
        "CQRS",
        "Saga Pattern",
        "At-Least-Once Delivery",
      ],
      difficulty: "advanced",
      estimatedTime: "2 weeks",
    },
    {
      id: "sd-patterns",
      label: "Design Case Studies",
      section: "Practice",
      type: "required",
      description:
        "Work through real system design problems — URL shortener, Twitter, YouTube, Uber. Practice articulating tradeoffs clearly — this is what system design interviews actually test.",
      keyConcepts: [
        "URL Shortener",
        "Twitter / Feed Systems",
        "Video Streaming",
        "Ride-Sharing",
        "Search Autocomplete",
      ],
      difficulty: "advanced",
      estimatedTime: "3 weeks",
    },
  ],
  edges: [
    { from: "sd-scale", to: "sd-lb" },
    { from: "sd-lb", to: "sd-cache" },
    { from: "sd-cache", to: "sd-db" },
    { from: "sd-db", to: "sd-cap" },
    { from: "sd-cap", to: "sd-micro" },
    { from: "sd-micro", to: "sd-event" },
    { from: "sd-micro", to: "sd-patterns" },
    { from: "sd-event", to: "sd-patterns" },
  ],
};

// ─── 17. CS Subjects ──────────────────────────────────────────────────────────
const csSubjectsDomain: BlueprintDomain = {
  id: "cssubjects",
  name: "CS Subjects",
  icon: "📚",
  color: "#a78bfa",
  description:
    "Core computer science — OS, DBMS, networks, TOC, compiler design, and digital electronics.",
  category: "other",
  estimatedHours: 200,
  difficulty: "intermediate",
  nodes: [
    {
      id: "cs-os",
      label: "Operating Systems",
      section: "Core CS",
      type: "required",
      description:
        "Processes, threads, scheduling, memory management, and file systems. OS concepts appear in backend interviews, systems programming, and anywhere you need to reason about program execution.",
      keyConcepts: [
        "Process vs Thread",
        "CPU Scheduling",
        "Virtual Memory & Paging",
        "Deadlocks",
        "File System",
      ],
      difficulty: "intermediate",
      estimatedTime: "4 weeks",
    },
    {
      id: "cs-dbms",
      label: "DBMS",
      section: "Core CS",
      type: "required",
      description:
        "Relational model, SQL, normalization, transactions, and query optimization. DBMS theory explains why SQL behaves the way it does and how to design schemas that don't rot over time.",
      keyConcepts: [
        "ER Diagrams",
        "Normalization",
        "SQL & Joins",
        "Transactions & ACID",
        "Query Optimization",
      ],
      difficulty: "intermediate",
      estimatedTime: "3 weeks",
    },
    {
      id: "cs-cn",
      label: "Computer Networks",
      section: "Core CS",
      type: "required",
      description:
        "OSI model, TCP/IP, HTTP, DNS, routing, and network security fundamentals. Network knowledge is the foundation for everything from web development to distributed systems to cybersecurity.",
      keyConcepts: [
        "OSI / TCP-IP Stack",
        "HTTP / HTTPS",
        "DNS & DHCP",
        "Routing Protocols",
        "TLS / SSL",
      ],
      difficulty: "intermediate",
      estimatedTime: "3 weeks",
    },
    {
      id: "cs-toc",
      label: "Theory of Computation",
      section: "Theory",
      type: "required",
      description:
        "Automata theory, formal languages, Turing machines, and computational complexity. TOC teaches you the fundamental limits of what computers can and cannot compute.",
      keyConcepts: [
        "DFA / NFA",
        "Context-Free Grammars",
        "Turing Machines",
        "Decidability",
        "P vs NP",
      ],
      difficulty: "advanced",
      estimatedTime: "4 weeks",
    },
    {
      id: "cs-compiler",
      label: "Compiler Design",
      section: "Theory",
      type: "optional",
      description:
        "Lexical analysis, parsing, semantic analysis, code generation, and optimization. Building even a toy compiler deepens your understanding of programming languages and helps you write better code.",
      keyConcepts: [
        "Lexer / Tokenizer",
        "Parser (LL / LR)",
        "AST",
        "Semantic Analysis",
        "Code Generation",
      ],
      difficulty: "advanced",
      estimatedTime: "4 weeks",
    },
    {
      id: "cs-digital",
      label: "Digital Electronics",
      section: "Hardware",
      type: "required",
      description:
        "Boolean algebra, logic gates, combinational/sequential circuits, and basic CPU architecture. Digital electronics bridges the gap between software and hardware — every programmer benefits from this knowledge.",
      keyConcepts: [
        "Boolean Algebra",
        "Logic Gates",
        "Combinational Circuits",
        "Flip-Flops & Latches",
        "CPU Basics",
      ],
      difficulty: "intermediate",
      estimatedTime: "3 weeks",
    },
    {
      id: "cs-dsa",
      label: "Data Structures & Algorithms",
      section: "Problem Solving",
      type: "required",
      description:
        "Arrays, linked lists, trees, graphs, sorting, searching, and dynamic programming. DSA is the foundation of competitive programming and technical interviews at top companies.",
      keyConcepts: [
        "Arrays & Linked Lists",
        "Trees & Graphs",
        "Sorting Algorithms",
        "Dynamic Programming",
        "Big O Notation",
      ],
      difficulty: "intermediate",
      estimatedTime: "8 weeks",
    },
  ],
  edges: [
    { from: "cs-os", to: "cs-dbms" },
    { from: "cs-dbms", to: "cs-cn" },
    { from: "cs-cn", to: "cs-toc" },
    { from: "cs-toc", to: "cs-compiler" },
    { from: "cs-digital", to: "cs-os" },
    { from: "cs-dsa", to: "cs-os" },
    { from: "cs-dsa", to: "cs-dbms" },
  ],
};

// ─── 18. AR/VR Development ────────────────────────────────────────────────────
const arvrDomain: BlueprintDomain = {
  id: "arvr",
  name: "AR/VR Development",
  icon: "🥽",
  color: "#a855f7",
  description:
    "Build immersive augmented and virtual reality experiences for web, mobile, and headsets.",
  category: "other",
  estimatedHours: 300,
  difficulty: "advanced",
  nodes: [
    {
      id: "av-3dmath",
      label: "3D Math",
      section: "Foundations",
      type: "required",
      description:
        "Vectors, matrices, quaternions, coordinate systems, and transformations for 3D space. You cannot build XR experiences without deeply understanding 3D math — there is no framework that abstracts it away completely.",
      keyConcepts: [
        "Vectors & Dot/Cross Product",
        "Matrices & Transformations",
        "Quaternions",
        "Euler Angles",
        "World vs Local Space",
      ],
      difficulty: "beginner",
      estimatedTime: "2 weeks",
    },
    {
      id: "av-graphics",
      label: "Computer Graphics",
      section: "Foundations",
      type: "required",
      description:
        "Rendering pipelines, shaders, lighting models, and texture mapping. Understanding the rendering pipeline lets you optimize XR apps to hit the 90fps that prevents motion sickness.",
      keyConcepts: [
        "Rendering Pipeline",
        "Vertex & Fragment Shaders",
        "Lighting (Phong/PBR)",
        "Textures & UV Mapping",
        "Depth Buffer",
      ],
      difficulty: "intermediate",
      estimatedTime: "3 weeks",
    },
    {
      id: "av-webxr",
      label: "WebXR API",
      section: "Core Tech",
      type: "required",
      description:
        "Browser-based XR using the WebXR Device API — sessions, frames, and hit testing. WebXR is the standard for XR on the web — it enables AR/VR in any modern browser without app installation.",
      keyConcepts: [
        "XRSession",
        "XRFrame",
        "Reference Spaces",
        "Hit Testing",
        "WebXR Polyfill",
      ],
      difficulty: "intermediate",
      estimatedTime: "2 weeks",
    },
    {
      id: "av-threejs",
      label: "Three.js",
      section: "Core Tech",
      type: "required",
      description:
        "3D scenes in the browser — geometries, materials, cameras, and animations. Three.js makes 3D accessible on the web without deep WebGL knowledge — it's the entry point for most web XR developers.",
      keyConcepts: [
        "Scene / Camera / Renderer",
        "Geometries & Materials",
        "Lighting",
        "Animation Mixer",
        "GLTF Loader",
      ],
      difficulty: "intermediate",
      estimatedTime: "3 weeks",
    },
    {
      id: "av-unity",
      label: "Unity for XR",
      section: "Core Tech",
      type: "optional",
      description:
        "Build VR and AR experiences in Unity using XR Interaction Toolkit. Unity is the most-used engine for VR content development — it targets Meta Quest, SteamVR, HoloLens, and iOS/Android AR.",
      keyConcepts: [
        "XR Interaction Toolkit",
        "XR Rig Setup",
        "Input System",
        "Spatial UI",
        "Build Targets (Android/iOS/PC)",
      ],
      difficulty: "intermediate",
      estimatedTime: "4 weeks",
    },
    {
      id: "av-arcore",
      label: "ARCore / ARKit",
      section: "AR Specific",
      type: "required",
      description:
        "Mobile AR foundations — plane detection, anchors, and light estimation on Android and iOS. ARCore (Google) and ARKit (Apple) are the native AR frameworks that power hundreds of millions of AR experiences.",
      keyConcepts: [
        "Plane Detection",
        "Anchors & Poses",
        "Light Estimation",
        "Point Cloud",
        "ARCore (Android) / ARKit (iOS)",
      ],
      difficulty: "intermediate",
      estimatedTime: "2 weeks",
    },
    {
      id: "av-vrsdk",
      label: "VR SDKs",
      section: "VR Specific",
      type: "required",
      description:
        "Meta Quest, SteamVR, and OpenXR — the standard runtimes for VR hardware. OpenXR is the cross-platform standard that lets you target multiple headsets from a single codebase.",
      keyConcepts: [
        "OpenXR Standard",
        "Meta Quest SDK",
        "SteamVR",
        "Input Bindings",
        "Passthrough API",
      ],
      difficulty: "intermediate",
      estimatedTime: "2 weeks",
    },
    {
      id: "av-perf",
      label: "Performance Optimization",
      section: "Advanced",
      type: "required",
      description:
        "Maintain 90fps in XR — culling, LODs, draw call batching, and shader optimization. Performance in XR is literally a health concern — dropped frames cause motion sickness.",
      keyConcepts: [
        "Frame Rate (72/90fps)",
        "Occlusion Culling",
        "LOD System",
        "Draw Call Batching",
        "Fixed Foveated Rendering",
      ],
      difficulty: "advanced",
      estimatedTime: "2 weeks",
    },
  ],
  edges: [
    { from: "av-3dmath", to: "av-graphics" },
    { from: "av-graphics", to: "av-webxr" },
    { from: "av-graphics", to: "av-threejs" },
    { from: "av-graphics", to: "av-unity" },
    { from: "av-webxr", to: "av-arcore" },
    { from: "av-threejs", to: "av-arcore" },
    { from: "av-unity", to: "av-vrsdk" },
    { from: "av-vrsdk", to: "av-perf" },
    { from: "av-arcore", to: "av-perf" },
  ],
};

// ─── 19. Programming in C ─────────────────────────────────────────────────────
const cProgrammingDomain: BlueprintDomain = {
  id: "cprogramming",
  name: "Programming in C",
  icon: "🔵",
  color: "#0ea5e9",
  description:
    "Master C — the foundation of systems programming, operating systems, and embedded development.",
  category: "other",
  estimatedHours: 160,
  difficulty: "beginner",
  nodes: [
    {
      id: "cp-intro",
      label: "Introduction to C",
      section: "Basics",
      type: "required",
      description:
        "History, compilation model, the main() function, and your first Hello World program. C is the most influential programming language in history — Unix, Linux, Python, and JavaScript are all written in C.",
      keyConcepts: [
        "Compilation (gcc)",
        "main() Function",
        "printf / scanf",
        "Header Files",
        "Preprocessor",
      ],
      difficulty: "beginner",
      estimatedTime: "1 week",
    },
    {
      id: "cp-vars",
      label: "Variables & Data Types",
      section: "Basics",
      type: "required",
      description:
        "Integer types, floating point, char, size_t, and type casting. C is close to the hardware — understanding the size and range of each data type is critical for correct programs.",
      keyConcepts: [
        "int / float / double / char",
        "sizeof Operator",
        "Type Casting",
        "Constants",
        "Overflow Behavior",
      ],
      difficulty: "beginner",
      estimatedTime: "1 week",
    },
    {
      id: "cp-control",
      label: "Control Flow",
      section: "Basics",
      type: "required",
      description:
        "if/else, switch, while, do-while, for, break, and continue. Control flow in C is explicit and close to the machine — understanding how these map to assembly helps write efficient code.",
      keyConcepts: [
        "if / else / switch",
        "while / do-while / for",
        "break & continue",
        "goto (avoid)",
        "Nested Loops",
      ],
      difficulty: "beginner",
      estimatedTime: "1 week",
    },
    {
      id: "cp-functions",
      label: "Functions",
      section: "Basics",
      type: "required",
      description:
        "Function declaration, definition, call stack, pass-by-value vs pass-by-reference, and recursion. C's function model is the basis for all procedural programming — understand the call stack deeply.",
      keyConcepts: [
        "Function Prototypes",
        "Return Types",
        "Pass-by-Value",
        "Recursion",
        "Call Stack",
      ],
      difficulty: "beginner",
      estimatedTime: "1 week",
    },
    {
      id: "cp-arrays",
      label: "Arrays & Strings",
      section: "Core",
      type: "required",
      description:
        "Static arrays, multi-dimensional arrays, C strings, and the string.h library. C strings are null-terminated character arrays — this design causes many security vulnerabilities when mishandled.",
      keyConcepts: [
        "Static Arrays",
        "Array Decay",
        "C Strings (null-terminated)",
        "string.h",
        "Buffer Overflow",
      ],
      difficulty: "beginner",
      estimatedTime: "1 week",
    },
    {
      id: "cp-pointers",
      label: "Pointers",
      section: "Core",
      type: "required",
      description:
        "Memory addresses, pointer arithmetic, pointers to pointers, and the relationship between arrays and pointers. Pointers are C's most powerful and most dangerous feature — mastering them unlocks systems programming.",
      keyConcepts: [
        "Memory Addresses",
        "Pointer Arithmetic",
        "Pointer to Pointer",
        "void Pointers",
        "Function Pointers",
      ],
      difficulty: "intermediate",
      estimatedTime: "2 weeks",
    },
    {
      id: "cp-memory",
      label: "Dynamic Memory",
      section: "Core",
      type: "required",
      description:
        "Heap allocation with malloc/calloc/realloc/free and common memory bugs. Memory management in C is manual — every allocation must be freed, every freed pointer must not be used again.",
      keyConcepts: [
        "malloc / calloc / realloc",
        "free()",
        "Memory Leaks",
        "Valgrind",
        "Stack vs Heap",
      ],
      difficulty: "intermediate",
      estimatedTime: "2 weeks",
    },
    {
      id: "cp-structs",
      label: "Structs & Unions",
      section: "Core",
      type: "required",
      description:
        "Composite data types — structs, unions, bit fields, and struct padding. Structs let you model real-world data in C and are the foundation for all data structure implementations.",
      keyConcepts: [
        "struct Definition",
        "Struct Padding",
        "union",
        "Bit Fields",
        "typedef",
      ],
      difficulty: "intermediate",
      estimatedTime: "1 week",
    },
    {
      id: "cp-fileio",
      label: "File I/O",
      section: "Advanced",
      type: "required",
      description:
        "Read and write files using FILE*, fopen/fclose, fread/fwrite, and text vs binary mode. C file I/O is low-level and portable — the same code runs on any OS.",
      keyConcepts: [
        "FILE* Pointer",
        "fopen / fclose",
        "fread / fwrite / fprintf",
        "Text vs Binary Mode",
        "fseek / ftell",
      ],
      difficulty: "intermediate",
      estimatedTime: "1 week",
    },
    {
      id: "cp-ds",
      label: "Data Structures in C",
      section: "Advanced",
      type: "optional",
      description:
        "Implement linked lists, stacks, queues, binary trees, and hash tables in C. Building data structures from scratch in C deepens your understanding of how they work at the memory level.",
      keyConcepts: [
        "Linked List",
        "Stack & Queue",
        "Binary Search Tree",
        "Hash Table",
        "Dynamic Arrays",
      ],
      difficulty: "intermediate",
      estimatedTime: "3 weeks",
    },
  ],
  edges: [
    { from: "cp-intro", to: "cp-vars" },
    { from: "cp-vars", to: "cp-control" },
    { from: "cp-control", to: "cp-functions" },
    { from: "cp-functions", to: "cp-arrays" },
    { from: "cp-arrays", to: "cp-pointers" },
    { from: "cp-pointers", to: "cp-memory" },
    { from: "cp-memory", to: "cp-structs" },
    { from: "cp-structs", to: "cp-fileio" },
    { from: "cp-fileio", to: "cp-ds" },
  ],
};

// ─── Export ───────────────────────────────────────────────────────────────────
export const BLUEPRINT_DOMAINS: BlueprintDomain[] = [
  frontendDomain,
  backendDomain,
  fullStackDomain,
  pythonDomain,
  javaDomain,
  dataScienceDomain,
  mlDomain,
  devopsDomain,
  androidDomain,
  iosDomain,
  cybersecurityDomain,
  blockchainDomain,
  cloudDomain,
  gameDomain,
  uiuxDomain,
  systemDesignDomain,
  csSubjectsDomain,
  arvrDomain,
  cProgrammingDomain,
];

export const BLUEPRINT_CATEGORIES = [
  { id: "all", label: "All" },
  { id: "web", label: "Web" },
  { id: "mobile", label: "Mobile" },
  { id: "devops", label: "DevOps" },
  { id: "data", label: "Data & AI" },
  { id: "security", label: "Security" },
  { id: "design", label: "Design" },
  { id: "other", label: "Other" },
] as const;
