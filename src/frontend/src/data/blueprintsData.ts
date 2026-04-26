// ─── Interfaces ──────────────────────────────────────────────────────────────

export interface BlueprintNode {
  id: string;
  label: string;
  section: string;
  type: "required" | "optional" | "bonus";
  description: string;
  keyConcepts: string[];
  difficulty: "beginner" | "intermediate" | "advanced";
  estimatedTime: string;
  docLink?: string;
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
  nodes: [
    {
      id: "fe-html",
      label: "HTML",
      section: "Basics",
      type: "required",
      description:
        "The skeleton of every webpage — semantic markup, forms, and accessibility.",
      keyConcepts: [
        "Semantic Tags",
        "Forms & Inputs",
        "Accessibility",
        "Meta Tags",
        "HTML5 APIs",
      ],
      difficulty: "beginner",
      estimatedTime: "1 week",
    },
    {
      id: "fe-css",
      label: "CSS",
      section: "Basics",
      type: "required",
      description:
        "Style and layout webpages using selectors, Flexbox, Grid, and animations.",
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
        "Bring webpages to life — DOM manipulation, events, and async programming.",
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
        "Type-safe JavaScript for large codebases — interfaces, generics, and tooling.",
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
        "Build UIs with declarative components, hooks, and the React ecosystem.",
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
        "Manage complex app state with Zustand, Redux Toolkit, or React Query.",
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
        "Write unit, integration, and end-to-end tests with Vitest and Playwright.",
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
        "Optimize Core Web Vitals, code-split, memoize, and ship fast apps.",
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
  ],
  edges: [
    { from: "fe-html", to: "fe-css" },
    { from: "fe-css", to: "fe-js" },
    { from: "fe-js", to: "fe-ts" },
    { from: "fe-ts", to: "fe-react" },
    { from: "fe-react", to: "fe-state" },
    { from: "fe-react", to: "fe-testing" },
    { from: "fe-state", to: "fe-perf" },
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
  nodes: [
    {
      id: "be-lang",
      label: "Choose a Language",
      section: "Foundations",
      type: "required",
      description:
        "Pick Node.js, Python, Go, or Java as your backend language.",
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
        "Understand HTTP methods, status codes, REST principles, and API design.",
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
      id: "be-db",
      label: "Databases",
      section: "Core",
      type: "required",
      description:
        "Store and query data with SQL (PostgreSQL) and NoSQL (MongoDB, Redis).",
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
        "Secure your API with JWT, OAuth 2.0, sessions, and rate limiting.",
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
        "Design clean, versioned, documented REST APIs using OpenAPI/Swagger.",
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
        "Speed up responses with in-memory caching (Redis) and CDN strategies.",
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
        "Decompose apps into independently deployable services with message queues.",
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
        "Automate testing and deployment pipelines with GitHub Actions.",
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
    { from: "be-http", to: "be-db" },
    { from: "be-http", to: "be-rest" },
    { from: "be-db", to: "be-auth" },
    { from: "be-auth", to: "be-cache" },
    { from: "be-auth", to: "be-micro" },
    { from: "be-rest", to: "be-cicd" },
    { from: "be-micro", to: "be-cicd" },
  ],
};

// ─── 3. Python ────────────────────────────────────────────────────────────────
const pythonDomain: BlueprintDomain = {
  id: "python",
  name: "Python",
  icon: "🐍",
  color: "#eab308",
  description:
    "Master Python from syntax to data analysis, APIs, and machine learning.",
  nodes: [
    {
      id: "py-syntax",
      label: "Syntax & Basics",
      section: "Basics",
      type: "required",
      description:
        "Variables, data types, control flow, functions, and list comprehensions.",
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
      description: "Lists, dicts, sets, tuples and the collections module.",
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
        "Conditionals, loops, comprehensions, generators, and exception handling.",
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
        "Classes, inheritance, dunder methods, properties, and dataclasses.",
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
        "Organize code with modules, packages, virtual environments, and pip.",
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
        "Read and write text, CSV, and JSON files using context managers.",
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
      description: "Concurrent I/O with asyncio, async/await, and aiohttp.",
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
      description: "Write unit and integration tests with pytest and mock.",
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
      description: "Package Python projects and publish to PyPI.",
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

// ─── 4. Data Science ──────────────────────────────────────────────────────────
const dataScienceDomain: BlueprintDomain = {
  id: "datascience",
  name: "Data Science",
  icon: "📊",
  color: "#8b5cf6",
  description:
    "Analyse data, build ML models, and tell stories with visualizations.",
  nodes: [
    {
      id: "ds-stats",
      label: "Statistics",
      section: "Math",
      type: "required",
      description:
        "Descriptive stats, probability distributions, hypothesis testing, and A/B testing.",
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
        "Vectors, matrices, and eigenvalues — the foundation of ML algorithms.",
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
        "Fast numerical computation with N-dimensional arrays and broadcasting.",
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
        "Data wrangling — loading, cleaning, transforming, and aggregating data.",
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
        "Visualize data with charts, heatmaps, and interactive Plotly dashboards.",
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
        "Train classification and regression models, cross-validate, and tune hyperparameters.",
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
        "Assess model performance with the right metrics and avoid data leakage.",
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
  ],
  edges: [
    { from: "ds-stats", to: "ds-linalg" },
    { from: "ds-linalg", to: "ds-numpy" },
    { from: "ds-numpy", to: "ds-pandas" },
    { from: "ds-pandas", to: "ds-viz" },
    { from: "ds-viz", to: "ds-sklearn" },
    { from: "ds-sklearn", to: "ds-eval" },
  ],
};

// ─── 5. DevOps / CI-CD ────────────────────────────────────────────────────────
const devopsDomain: BlueprintDomain = {
  id: "devops",
  name: "DevOps / CI-CD",
  icon: "🚀",
  color: "#0d9488",
  description:
    "Automate infrastructure, CI/CD pipelines, and cloud deployments at scale.",
  nodes: [
    {
      id: "dv-linux",
      label: "Linux & Shell",
      section: "Linux",
      type: "required",
      description:
        "Filesystem, process management, shell scripting, and permissions.",
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
        "TCP/IP, DNS, HTTP, ports, and basic network troubleshooting.",
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
        "Containerize applications with Dockerfiles, images, and Docker Compose.",
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
        "Orchestrate containers with Pods, Deployments, Services, and Ingress.",
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
      id: "dv-gh",
      label: "GitHub Actions",
      section: "Pipelines",
      type: "required",
      description:
        "Build CI/CD pipelines that lint, test, build, and deploy automatically.",
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
      id: "dv-jenkins",
      label: "Jenkins / GitLab CI",
      section: "Pipelines",
      type: "optional",
      description:
        "Enterprise CI/CD with Jenkinsfiles and GitLab CI/CD pipelines.",
      keyConcepts: [
        "Jenkinsfile (Declarative)",
        "GitLab CI YAML",
        "Agents & Executors",
        "Plugins",
        "Pipeline Stages",
      ],
      difficulty: "intermediate",
      estimatedTime: "2 weeks",
    },
  ],
  edges: [
    { from: "dv-linux", to: "dv-net" },
    { from: "dv-net", to: "dv-docker" },
    { from: "dv-docker", to: "dv-k8s" },
    { from: "dv-docker", to: "dv-gh" },
    { from: "dv-k8s", to: "dv-jenkins" },
    { from: "dv-gh", to: "dv-jenkins" },
  ],
};

// ─── 6. Cybersecurity ─────────────────────────────────────────────────────────
const cybersecurityDomain: BlueprintDomain = {
  id: "cybersecurity",
  name: "Cybersecurity",
  icon: "🔐",
  color: "#ef4444",
  description:
    "Protect systems from attacks — networking, cryptography, pentesting, and defense.",
  nodes: [
    {
      id: "cy-net",
      label: "Networking & Protocols",
      section: "Fundamentals",
      type: "required",
      description:
        "TCP/IP, DNS, HTTP, OSI model, and network scanning with nmap.",
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
      id: "cy-crypto",
      label: "Cryptography",
      section: "Fundamentals",
      type: "required",
      description:
        "Symmetric/asymmetric encryption, hashing, PKI, and digital signatures.",
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
        "OWASP Top 10 — SQL injection, XSS, CSRF, broken auth, and IDOR.",
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
        "Ethical hacking methodology — recon, exploitation, and reporting.",
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
        "Defense-in-depth with firewalls, IDS/IPS, and SIEM log analysis.",
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
        "NIST IR framework — identify, contain, eradicate, and recover from breaches.",
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
  ],
  edges: [
    { from: "cy-net", to: "cy-crypto" },
    { from: "cy-net", to: "cy-web" },
    { from: "cy-crypto", to: "cy-pen" },
    { from: "cy-web", to: "cy-pen" },
    { from: "cy-web", to: "cy-fw" },
    { from: "cy-fw", to: "cy-ir" },
  ],
};

// ─── 7. Machine Learning ──────────────────────────────────────────────────────
const mlDomain: BlueprintDomain = {
  id: "ml",
  name: "Machine Learning",
  icon: "🤖",
  color: "#f97316",
  description:
    "Build predictive models from math foundations to deep learning and LLMs.",
  nodes: [
    {
      id: "ml-stats",
      label: "Statistics & Probability",
      section: "Foundations",
      type: "required",
      description:
        "Probability, distributions, Bayes' theorem, and statistical inference.",
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
      description: "NumPy, Pandas, Matplotlib — the data science Python stack.",
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
        "Regression, classification, decision trees, random forests, and gradient boosting.",
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
        "Clustering (K-means, DBSCAN), dimensionality reduction (PCA, t-SNE).",
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
        "Agents, environments, Q-learning, and policy gradient methods.",
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
        "Perceptrons, backpropagation, activation functions, and training loops.",
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
        "Convolutional networks for image classification, detection, and segmentation.",
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
        "Transformer architecture, BERT, GPT, fine-tuning, and RAG pipelines.",
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
  ],
  edges: [
    { from: "ml-stats", to: "ml-py" },
    { from: "ml-py", to: "ml-supervised" },
    { from: "ml-supervised", to: "ml-unsupervised" },
    { from: "ml-supervised", to: "ml-rl" },
    { from: "ml-unsupervised", to: "ml-nn" },
    { from: "ml-nn", to: "ml-cnn" },
    { from: "ml-nn", to: "ml-llm" },
  ],
};

// ─── 8. Android Development ───────────────────────────────────────────────────
const androidDomain: BlueprintDomain = {
  id: "android",
  name: "Android Development",
  icon: "📱",
  color: "#22c55e",
  description:
    "Build native Android apps with Kotlin, Jetpack Compose, and the Android ecosystem.",
  nodes: [
    {
      id: "an-kotlin",
      label: "Kotlin Basics",
      section: "Java/Kotlin Basics",
      type: "required",
      description:
        "Kotlin syntax, null safety, extension functions, coroutines, and OOP.",
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
      id: "an-java",
      label: "Java for Android",
      section: "Java/Kotlin Basics",
      type: "optional",
      description:
        "Legacy Android development with Java — still used in many large codebases.",
      keyConcepts: [
        "Java OOP",
        "Generics",
        "Threads",
        "Android APIs in Java",
        "Interoperability",
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
        "Lifecycle, back stack, fragment transactions, and navigation component.",
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
        "XML layouts, ConstraintLayout, RecyclerView, and view binding.",
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
      id: "an-intents",
      label: "Intents & Broadcasts",
      section: "Android Core",
      type: "required",
      description:
        "Explicit/implicit intents, broadcast receivers, and intent filters.",
      keyConcepts: [
        "Explicit Intents",
        "Implicit Intents",
        "BroadcastReceiver",
        "Intent Filters",
        "Deep Links",
      ],
      difficulty: "intermediate",
      estimatedTime: "1 week",
    },
    {
      id: "an-compose",
      label: "Jetpack Compose",
      section: "Advanced",
      type: "required",
      description:
        "Declarative UI toolkit — composables, state hoisting, and theming.",
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
      section: "Advanced",
      type: "required",
      description:
        "ViewModel, LiveData, Flow, Room, and clean architecture patterns.",
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
      id: "an-play",
      label: "Play Store Publishing",
      section: "Advanced",
      type: "required",
      description:
        "Sign, build, and publish your app — APK vs AAB, review process, and monetization.",
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
    { from: "an-kotlin", to: "an-java" },
    { from: "an-kotlin", to: "an-activity" },
    { from: "an-activity", to: "an-layouts" },
    { from: "an-layouts", to: "an-intents" },
    { from: "an-intents", to: "an-compose" },
    { from: "an-compose", to: "an-mvvm" },
    { from: "an-mvvm", to: "an-play" },
  ],
};

// ─── 9. AR/VR Development ─────────────────────────────────────────────────────
const arvrDomain: BlueprintDomain = {
  id: "arvr",
  name: "AR/VR Development",
  icon: "🥽",
  color: "#a855f7",
  description:
    "Build immersive augmented and virtual reality experiences for web, mobile, and headsets.",
  nodes: [
    {
      id: "av-3dmath",
      label: "3D Math",
      section: "Foundations",
      type: "required",
      description:
        "Vectors, matrices, quaternions, coordinate systems, and transformations for 3D space.",
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
        "Rendering pipelines, shaders, lighting models, and texture mapping.",
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
        "Browser-based XR using the WebXR Device API — sessions, frames, and hit testing.",
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
        "3D scenes in the browser — geometries, materials, cameras, and animations.",
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
        "Build VR and AR experiences in Unity using XR Interaction Toolkit.",
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
        "Mobile AR foundations — plane detection, anchors, and light estimation.",
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
      id: "av-plane",
      label: "Plane Detection & Anchors",
      section: "AR Specific",
      type: "optional",
      description:
        "Place virtual objects on real-world surfaces using hit testing and anchors.",
      keyConcepts: [
        "Hit Testing",
        "World Anchors",
        "Surface Tracking",
        "Scene Understanding",
        "Persistent Anchors",
      ],
      difficulty: "intermediate",
      estimatedTime: "1 week",
    },
    {
      id: "av-vrsdk",
      label: "VR SDKs",
      section: "VR Specific",
      type: "required",
      description:
        "Meta Quest, SteamVR, and OpenXR — the standard runtimes for VR hardware.",
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
      id: "av-interaction",
      label: "Interaction Design",
      section: "VR Specific",
      type: "required",
      description:
        "Controller input, hand tracking, gaze interaction, and spatial UI design.",
      keyConcepts: [
        "Controller Input",
        "Hand Tracking",
        "Gaze / Foveated Rendering",
        "Spatial UI (panels)",
        "Haptics",
      ],
      difficulty: "intermediate",
      estimatedTime: "2 weeks",
    },
    {
      id: "av-mr",
      label: "Mixed Reality",
      section: "Advanced",
      type: "optional",
      description:
        "Blend real and virtual worlds with passthrough cameras and scene meshing.",
      keyConcepts: [
        "Passthrough Video",
        "Scene Meshing",
        "Spatial Anchors (cloud)",
        "Depth Occlusion",
        "Real-World Interaction",
      ],
      difficulty: "advanced",
      estimatedTime: "3 weeks",
    },
    {
      id: "av-perf",
      label: "Performance Optimization",
      section: "Advanced",
      type: "required",
      description:
        "Maintain 90fps in XR — culling, LODs, draw call batching, and shader optimization.",
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
    {
      id: "av-deploy",
      label: "Deployment & Distribution",
      section: "Advanced",
      type: "required",
      description:
        "Ship to Meta Quest Store, SideQuest, App Store, and WebXR hosting.",
      keyConcepts: [
        "Meta Quest Store",
        "SideQuest / App Lab",
        "WebXR Hosting",
        "App Signing",
        "Review Process",
      ],
      difficulty: "intermediate",
      estimatedTime: "1 week",
    },
  ],
  edges: [
    { from: "av-3dmath", to: "av-graphics" },
    { from: "av-graphics", to: "av-webxr" },
    { from: "av-graphics", to: "av-threejs" },
    { from: "av-graphics", to: "av-unity" },
    { from: "av-webxr", to: "av-arcore" },
    { from: "av-threejs", to: "av-arcore" },
    { from: "av-arcore", to: "av-plane" },
    { from: "av-unity", to: "av-vrsdk" },
    { from: "av-vrsdk", to: "av-interaction" },
    { from: "av-plane", to: "av-mr" },
    { from: "av-interaction", to: "av-mr" },
    { from: "av-mr", to: "av-perf" },
    { from: "av-perf", to: "av-deploy" },
  ],
};

// ─── 10. System Design ────────────────────────────────────────────────────────
const systemDesignDomain: BlueprintDomain = {
  id: "systemdesign",
  name: "System Design",
  icon: "🏗️",
  color: "#475569",
  description:
    "Design scalable distributed systems — from load balancing to microservices.",
  nodes: [
    {
      id: "sd-scale",
      label: "Scalability",
      section: "Basics",
      type: "required",
      description:
        "Horizontal vs vertical scaling, stateless services, and bottleneck analysis.",
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
        "Distribute traffic with round-robin, consistent hashing, and health checks.",
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
        "CDN, in-memory caches (Redis), eviction policies, and cache invalidation.",
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
        "SQL vs NoSQL, when to choose each, replication, and sharding.",
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
        "Consistency, availability, partition tolerance — tradeoffs in distributed databases.",
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
      id: "sd-shard",
      label: "Sharding",
      section: "Data",
      type: "optional",
      description:
        "Horizontally partition data across multiple databases for massive scale.",
      keyConcepts: [
        "Range Sharding",
        "Hash Sharding",
        "Directory-Based",
        "Cross-Shard Queries",
        "Resharding",
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
        "Decompose monoliths into independent services with well-defined APIs.",
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
        "Async communication with Kafka, event sourcing, and CQRS patterns.",
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
      id: "sd-api",
      label: "API Design",
      section: "Architecture",
      type: "required",
      description:
        "REST, GraphQL, gRPC — design, version, and document production APIs.",
      keyConcepts: [
        "REST vs GraphQL vs gRPC",
        "Versioning",
        "Rate Limiting",
        "OpenAPI",
        "Backward Compatibility",
      ],
      difficulty: "intermediate",
      estimatedTime: "1 week",
    },
  ],
  edges: [
    { from: "sd-scale", to: "sd-lb" },
    { from: "sd-lb", to: "sd-cache" },
    { from: "sd-cache", to: "sd-db" },
    { from: "sd-db", to: "sd-cap" },
    { from: "sd-cap", to: "sd-shard" },
    { from: "sd-db", to: "sd-micro" },
    { from: "sd-micro", to: "sd-event" },
    { from: "sd-micro", to: "sd-api" },
    { from: "sd-shard", to: "sd-event" },
  ],
};

// ─── Export ───────────────────────────────────────────────────────────────────
export const BLUEPRINT_DOMAINS: BlueprintDomain[] = [
  frontendDomain,
  backendDomain,
  pythonDomain,
  dataScienceDomain,
  devopsDomain,
  cybersecurityDomain,
  mlDomain,
  androidDomain,
  arvrDomain,
  systemDesignDomain,
];
