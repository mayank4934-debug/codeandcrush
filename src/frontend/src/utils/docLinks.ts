/**
 * Maps roadmap/course topic IDs and titles to matching Documentation Hub article IDs.
 * When a topic has a direct match, the "View Documentation" button will
 * pre-select that article in the hub.
 */
export const TOPIC_TO_DOC_MAP: Record<string, string> = {
  // ── Frontend ──────────────────────────────────────────────────────────────
  "html-css": "html-basics",
  javascript: "js-variables",
  "javascript-basics": "js-variables",
  react: "react-components",
  "react-components": "react-components",
  "typescript-fe": "js-functions",
  tailwind: "css-fundamentals",
  "performance-fe": "dom-manipulation",
  "testing-fe": "dom-manipulation",
  "html-basics": "html-basics",
  "css-fundamentals": "css-fundamentals",
  "js-essentials": "js-variables",
  dom: "dom-manipulation",
  "css-layout": "css-layout",
  "react-hooks": "react-hooks",
  "html-forms": "html-basics",
  "semantic-html": "html-basics",
  "css-flexbox": "css-layout",
  "css-grid": "css-layout",
  "responsive-design": "css-layout",
  "js-dom": "dom-manipulation",
  "js-events": "dom-manipulation",
  "js-async": "js-functions",
  "js-es6": "js-variables",
  "react-state": "react-hooks",
  "react-context": "react-hooks",
  "react-router": "react-components",
  "react-testing": "react-components",
  typescript: "js-functions",
  "web-performance": "dom-manipulation",
  "css-animations": "css-fundamentals",
  "frontend-html-semantic": "html-basics",
  "frontend-css-flexbox-grid": "css-layout",
  "frontend-react-hooks": "react-hooks",

  // ── Python ─────────────────────────────────────────────────────────────────
  "python-basics": "python-basics",
  "python-oop": "python-oop",
  "python-scripting": "python-file-io",
  "python-advanced": "python-functions",
  "python-testing": "python-exceptions",
  "variables-data-types": "python-variables",
  "python-lists": "python-lists",
  "python-dicts": "python-dicts",
  "python-exceptions": "python-exceptions",
  "python-functions": "python-functions",
  "python-file-io": "python-file-io",
  "python-variables": "python-variables",
  "python-comprehensions": "python-lists",
  "python-decorators": "python-functions",
  "python-generators": "python-functions",
  "python-modules": "python-basics",
  "python-packages": "python-basics",
  "python-classes": "python-oop",
  "python-inheritance": "python-oop",
  "python-error-handling": "python-exceptions",
  "python-file-handling": "python-file-io",
  "python-data-structures": "python-lists",
  "python-sets": "python-lists",
  "python-tuples": "python-lists",
  "python-strings": "python-basics",
  "python-operators": "python-basics",
  "python-conditionals": "python-basics",
  "python-loops": "python-basics",

  // ── Backend ────────────────────────────────────────────────────────────────
  "node-express": "nodejs-basics",
  databases: "database-connections",
  auth: "auth-basics",
  "api-design": "rest-apis",
  "caching-queues": "backend-rest-api",
  "nodejs-basics": "nodejs-basics",
  "express-routing": "express-routing",
  "rest-apis": "rest-apis",
  "http-methods": "http-methods",
  "auth-basics": "auth-basics",
  "error-handling": "error-handling",
  "backend-nodejs": "nodejs-basics",
  "backend-rest-api": "backend-rest-api",
  "backend-jwt-auth": "backend-jwt-auth",
  "backend-nodejs-event-loop": "backend-nodejs-event-loop",
  "node-js": "nodejs-basics",
  express: "express-routing",
  "jwt-auth": "backend-jwt-auth",
  "sql-databases": "database-connections",
  "nosql-databases": "database-connections",
  mongodb: "database-connections",
  postgresql: "database-connections",
  "database-design": "database-connections",
  "rest-api": "rest-apis",
  graphql: "rest-apis",
  "api-security": "auth-basics",
  middleware: "express-routing",
  "http-status-codes": "http-methods",

  // ── Full Stack ─────────────────────────────────────────────────────────────
  "fullstack-fundamentals": "html-basics",
  "mern-stack": "nodejs-basics",
  nextjs: "react-components",
  deployment: "devops-cicd",
  "web-architecture": "backend-rest-api",
  "state-management": "react-hooks",
  "full-stack-deployment": "devops-cicd",

  // ── Data Science ───────────────────────────────────────────────────────────
  "numpy-pandas": "ds-numpy",
  visualization: "ds-matplotlib",
  statistics: "ds-pandas",
  "sql-ds": "database-connections",
  "ds-numpy": "ds-numpy",
  "ds-pandas": "ds-pandas",
  "ds-matplotlib": "ds-matplotlib",
  "data-cleaning": "data-cleaning",
  "statistical-analysis": "statistical-analysis",
  "feature-engineering": "feature-engineering",
  numpy: "ds-numpy",
  pandas: "ds-pandas",
  matplotlib: "ds-matplotlib",
  "data-analysis": "ds-pandas",
  "data-visualization": "ds-matplotlib",
  "exploratory-data-analysis": "ds-pandas",

  // ── Machine Learning ───────────────────────────────────────────────────────
  "ml-basics": "ml-supervised",
  sklearn: "ml-classification",
  "deep-learning": "ml-neural-networks",
  "ml-supervised": "ml-supervised",
  "ml-classification": "ml-classification",
  "ml-decision-trees": "ml-decision-trees",
  "ml-neural-networks": "ml-neural-networks",
  "ml-model-evaluation": "ml-model-evaluation",
  "ml-overfitting": "ml-overfitting",
  "ml-linear-regression": "ml-linear-regression",
  "supervised-learning": "ml-supervised",
  "unsupervised-learning": "ml-supervised",
  "neural-networks": "ml-neural-networks",
  "linear-regression": "ml-linear-regression",
  classification: "ml-classification",
  "decision-trees": "ml-decision-trees",
  "model-evaluation": "ml-model-evaluation",
  "overfitting-underfitting": "ml-overfitting",
  "natural-language-processing": "ml-neural-networks",
  "computer-vision": "ml-neural-networks",

  // ── DevOps ─────────────────────────────────────────────────────────────────
  linux: "devops-linux",
  "docker-k8s": "devops-docker",
  cicd: "devops-cicd",
  monitoring: "devops-monitoring",
  "devops-docker": "devops-docker",
  "devops-cicd": "devops-cicd",
  "devops-git": "devops-git",
  "devops-linux": "devops-linux",
  "devops-monitoring": "devops-monitoring",
  docker: "devops-docker",
  kubernetes: "devops-docker",
  "ci-cd": "devops-cicd",
  "github-actions": "devops-cicd",
  git: "devops-git",
  "linux-commands": "devops-linux",
  shell: "devops-linux",
  "infrastructure-as-code": "devops-cicd",
  "container-orchestration": "devops-docker",

  // ── Android ────────────────────────────────────────────────────────────────
  kotlin: "android-activities",
  "jetpack-compose": "android-layouts",
  "android-architecture": "android-recyclerview",
  "android-activities": "android-activities",
  "android-intents": "android-intents",
  "android-layouts": "android-layouts",
  "android-recyclerview": "android-recyclerview",
  "android-permissions": "android-permissions",
  "kotlin-basics": "android-activities",
  "android-ui": "android-layouts",
  "android-navigation": "android-intents",
  "android-data": "android-permissions",

  // ── iOS ────────────────────────────────────────────────────────────────────
  swift: "ios-swift-basics",
  swiftui: "ios-swiftui",
  "ios-core-data": "ios-core-data",
  "ios-swift-basics": "ios-swift-basics",
  "ios-uikit": "ios-uikit",
  "ios-view-controllers": "ios-view-controllers",
  "ios-auto-layout": "ios-auto-layout",
  "ios-data-persistence": "ios-data-persistence",
  "swift-basics": "ios-swift-basics",
  "ios-ui": "ios-swiftui",
  "ios-networking": "ios-data-persistence",

  // ── Cybersecurity ──────────────────────────────────────────────────────────
  networking: "cyber-encryption",
  "ethical-hacking": "cyber-sql-injection",
  cryptography: "cyber-encryption",
  "cyber-encryption": "cyber-encryption",
  "cyber-sql-injection": "cyber-sql-injection",
  "cyber-xss": "cyber-xss",
  "cyber-auth-security": "cyber-auth-security",
  encryption: "cyber-encryption",
  "sql-injection": "cyber-sql-injection",
  xss: "cyber-xss",
  "web-security": "cyber-xss",
  "network-security": "cyber-encryption",
  "penetration-testing": "cyber-sql-injection",
  "security-headers": "cyber-auth-security",

  // ── Blockchain ─────────────────────────────────────────────────────────────
  "blockchain-basics": "blockchain-basics",
  solidity: "solidity-basics",
  "smart-contracts": "solidity-basics",
  "web3-basics": "blockchain-basics",
  ethereum: "blockchain-basics",
  defi: "blockchain-basics",
  nft: "blockchain-basics",

  // ── Cloud ──────────────────────────────────────────────────────────────────
  "cloud-basics": "cloud-fundamentals",
  "aws-core": "cloud-aws",
  iac: "devops-docker",
  "cloud-fundamentals": "cloud-fundamentals",
  "cloud-aws": "cloud-aws",
  aws: "cloud-aws",
  azure: "cloud-fundamentals",
  gcp: "cloud-fundamentals",
  "serverless-computing": "cloud-aws",
  "cloud-storage": "cloud-aws",
  "cloud-databases": "cloud-aws",

  // ── AI/ML Engineer ─────────────────────────────────────────────────────────
  "llm-basics": "ml-neural-networks",
  rag: "ml-supervised",
  langchain: "ml-neural-networks",
  "large-language-models": "ml-neural-networks",
  "ai-prompt-engineering": "ml-supervised",
  "transformer-models": "ml-neural-networks",
  "ai-deployment": "ml-model-evaluation",
  "vector-databases": "database-connections",

  // ── Game Dev ───────────────────────────────────────────────────────────────
  "unity-basics": "game-dev-unity",
  "game-design": "game-dev-design",
  "shaders-graphics": "game-dev-graphics",
  "game-dev-unity": "game-dev-unity",
  "game-dev-design": "game-dev-design",
  "game-dev-graphics": "game-dev-graphics",
  "game-physics": "game-dev-unity",
  "game-ui": "game-dev-design",

  // ── UI/UX ──────────────────────────────────────────────────────────────────
  "design-fundamentals": "uiux-principles",
  figma: "uiux-figma",
  "ux-research": "uiux-principles",
  accessibility: "html-basics",
  "uiux-principles": "uiux-principles",
  "uiux-figma": "uiux-figma",
  "design-systems": "uiux-principles",
  "user-research": "uiux-principles",
  wireframing: "uiux-figma",
  prototyping: "uiux-figma",
  "visual-design": "uiux-principles",

  // ── C Programming ─────────────────────────────────────────────────────────
  "c-variables-data-types": "c-variables-data-types",
  "c-control-flow": "c-control-flow",
  "c-data-types": "c-variables-data-types",
  "c-variables": "c-variables-data-types",
  "c-operators": "c-variables-data-types",
  "c-conditionals": "c-control-flow",
  "c-loops": "c-control-flow",
  "c-arrays-strings": "c-control-flow",
  "c-structures-unions": "c-variables-data-types",
  "c-functions": "c-control-flow",
  "c-pointers": "c-variables-data-types",
  "c-memory-management": "c-variables-data-types",
  "c-file-handling": "c-control-flow",
  "c-preprocessor": "c-control-flow",
  "c-input-output": "c-control-flow",
  "c-recursion": "c-control-flow",

  // ── Java ───────────────────────────────────────────────────────────────────
  "java-classes-objects": "java-classes-objects",
  "java-collections": "java-collections",
  "java-streams": "java-streams",
  "java-basics": "java-classes-objects",
  "java-oop": "java-classes-objects",
  "java-inheritance": "java-classes-objects",
  "java-interfaces": "java-classes-objects",
  "java-exceptions": "java-classes-objects",
  "java-generics": "java-collections",
  "java-multithreading": "java-streams",
  "java-spring": "backend-rest-api",
  "java-data-structures": "java-collections",
};

/**
 * Domain-to-fallback doc map: if no direct topicId match, fall back to the best
 * doc article for the given domain.
 */
const DOMAIN_FALLBACK: Record<string, string> = {
  Frontend: "html-basics",
  Python: "python-basics",
  Backend: "backend-rest-api",
  "Full Stack": "html-basics",
  "Data Science": "ds-numpy",
  "Machine Learning": "ml-supervised",
  DevOps: "devops-docker",
  Android: "android-activities",
  iOS: "ios-swift-basics",
  Cybersecurity: "cyber-encryption",
  Blockchain: "blockchain-basics",
  Cloud: "cloud-fundamentals",
  "AI/ML Engineer": "ml-neural-networks",
  "Game Dev": "game-dev-unity",
  "UI/UX Designer": "uiux-principles",
  "C Programming": "c-variables-data-types",
  "Programming in C": "c-variables-data-types",
  Java: "java-classes-objects",
  "CS Subjects": "c-control-flow",
  "System Design": "backend-rest-api",
};

/**
 * Returns the Documentation Hub article ID for a given topic ID,
 * or null if no mapping exists.
 */
export function getDocId(topicId: string): string | null {
  if (!topicId) return null;

  // Direct match
  if (TOPIC_TO_DOC_MAP[topicId]) return TOPIC_TO_DOC_MAP[topicId];

  // Normalise: lowercase, replace non-alphanumeric with hyphens
  const norm = topicId.toLowerCase().replace(/[^a-z0-9]+/g, "-");
  if (TOPIC_TO_DOC_MAP[norm]) return TOPIC_TO_DOC_MAP[norm];

  // Try partial / substring match
  const key = Object.keys(TOPIC_TO_DOC_MAP).find(
    (k) =>
      norm.includes(k) ||
      k.includes(norm) ||
      topicId.toLowerCase().includes(k) ||
      k.includes(topicId.toLowerCase()),
  );
  return key ? TOPIC_TO_DOC_MAP[key] : null;
}

/**
 * Returns the best Documentation Hub article ID for a given domain + topic title.
 * Falls back to the domain-level article if no topic-specific match exists.
 */
export function getDocIdForTopic(
  domain: string,
  topicTitle: string,
): string | null {
  // Normalise the title to a slug-like ID
  const titleSlug = topicTitle.toLowerCase().replace(/[^a-z0-9]+/g, "-");

  // Try title slug first
  const byTitle = getDocId(titleSlug);
  if (byTitle) return byTitle;

  // Try domain-prefixed slug
  const domainPrefix = domain.toLowerCase().replace(/[^a-z0-9]+/g, "-");
  const byPrefixed = getDocId(`${domainPrefix}-${titleSlug}`);
  if (byPrefixed) return byPrefixed;

  // Domain fallback
  return DOMAIN_FALLBACK[domain] ?? null;
}

/**
 * Stores the target doc article ID in localStorage and returns it so
 * callers can pass it directly as initialTopicId to DocumentationHub.
 */
export function storeDocHubTarget(docId: string): string {
  localStorage.setItem("cc_docHubTarget", docId);
  return docId;
}

/**
 * Reads and clears the stored doc hub target from localStorage.
 * Returns null if nothing was stored.
 */
export function consumeDocHubTarget(): string | null {
  const target = localStorage.getItem("cc_docHubTarget");
  if (target) localStorage.removeItem("cc_docHubTarget");
  return target;
}
