export interface NewsArticle {
  id: string;
  category: NewsCategory;
  headline: string;
  summary: string;
  source: string;
  date: string;
  readTime: string;
  author: string;
  tags: string[];
  fullContent: string;
  relatedIds: string[];
  url?: string;
  image?: string;
  isLive?: boolean;
}

export type NewsCategory =
  | "AI & ML"
  | "Cybersecurity"
  | "Cloud"
  | "Web Dev"
  | "Open Source"
  | "Mobile"
  | "Research";

export interface MagazineArticle {
  id: string;
  category: string;
  headline: string;
  byline: string;
  readTime: string;
  date: string;
  teaser: string;
  gradient: string;
  icon: string;
  featured?: boolean;
  body: string;
  pullQuote: string;
  relatedTitles: string[];
  url?: string;
  image?: string;
  isNew?: boolean;
  isLive?: boolean;
}

export interface RssItem {
  title: string;
  link: string;
  pubDate: string;
  author: string;
  thumbnail?: string;
  description: string;
  content?: string;
  enclosure?: { link: string; type: string; length: number };
  categories?: string[];
}

export interface RssFeed {
  status: string;
  feed: { title: string; link: string; description: string; image?: string };
  items: RssItem[];
}

export const NEWS_CATEGORIES: NewsCategory[] = [
  "AI & ML",
  "Cybersecurity",
  "Cloud",
  "Web Dev",
  "Open Source",
  "Mobile",
  "Research",
];

export const NEWS_CATEGORY_COLORS: Record<string, string> = {
  "AI & ML":
    "bg-violet-100 text-violet-700 border-violet-200 dark:bg-violet-900/30 dark:text-violet-300",
  Cybersecurity:
    "bg-red-100 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-300",
  Cloud:
    "bg-sky-100 text-sky-700 border-sky-200 dark:bg-sky-900/30 dark:text-sky-300",
  "Web Dev":
    "bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-300",
  "Open Source":
    "bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-300",
  Mobile:
    "bg-pink-100 text-pink-700 border-pink-200 dark:bg-pink-900/30 dark:text-pink-300",
  Research:
    "bg-indigo-100 text-indigo-700 border-indigo-200 dark:bg-indigo-900/30 dark:text-indigo-300",
  // Magazine categories
  "Artificial Intelligence":
    "text-violet-700 bg-violet-50 border-violet-200 dark:text-violet-300 dark:bg-violet-900/30 dark:border-violet-700",
  Computing:
    "text-sky-700 bg-sky-50 border-sky-200 dark:text-sky-300 dark:bg-sky-900/30 dark:border-sky-700",
  Climate:
    "text-emerald-700 bg-emerald-50 border-emerald-200 dark:text-emerald-300 dark:bg-emerald-900/30 dark:border-emerald-700",
  Biotechnology:
    "text-pink-700 bg-pink-50 border-pink-200 dark:text-pink-300 dark:bg-pink-900/30 dark:border-pink-700",
  Connectivity:
    "text-orange-700 bg-orange-50 border-orange-200 dark:text-orange-300 dark:bg-orange-900/30 dark:border-orange-700",
  Business:
    "text-amber-700 bg-amber-50 border-amber-200 dark:text-amber-300 dark:bg-amber-900/30 dark:border-amber-700",
};

// ─── Category detection ─────────────────────────────────────────────────────
export function detectCategory(
  title: string,
  description: string,
): NewsCategory {
  const text = `${title} ${description}`.toLowerCase();
  if (
    /\b(ai|artificial intelligence|machine learning|deep learning|llm|gpt|claude|openai|anthropic|neural|model)\b/.test(
      text,
    )
  )
    return "AI & ML";
  if (
    /\b(hack|security|vulnerability|malware|ransomware|breach|cyber|cve|exploit|phishing|zero.?day)\b/.test(
      text,
    )
  )
    return "Cybersecurity";
  if (
    /\b(cloud|aws|azure|gcp|kubernetes|docker|serverless|devops|infrastructure)\b/.test(
      text,
    )
  )
    return "Cloud";
  if (
    /\b(javascript|typescript|react|vue|angular|css|html|browser|web|frontend|node)\b/.test(
      text,
    )
  )
    return "Web Dev";
  if (
    /\b(open.?source|linux|github|git|rust|python|swift|kotlin|compiler)\b/.test(
      text,
    )
  )
    return "Open Source";
  if (
    /\b(ios|android|mobile|smartphone|app store|iphone|pixel|samsung)\b/.test(
      text,
    )
  )
    return "Mobile";
  if (
    /\b(research|study|university|paper|arxiv|scientists|quantum|lab|experiment)\b/.test(
      text,
    )
  )
    return "Research";
  return "Web Dev";
}

export function stripHtml(html: string): string {
  return html
    .replace(/<[^>]*>/g, "")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, " ")
    .replace(/\s{2,}/g, " ")
    .trim();
}

export function calcReadTime(text: string): string {
  const words = text.split(/\s+/).length;
  return `${Math.max(1, Math.ceil(words / 200))} min read`;
}

export function timeAgo(dateStr: string): string {
  const date = new Date(dateStr);
  if (Number.isNaN(date.getTime())) return dateStr;
  const diff = Date.now() - date.getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export function isWithin24h(dateStr: string): boolean {
  const date = new Date(dateStr);
  if (Number.isNaN(date.getTime())) return false;
  return Date.now() - date.getTime() < 86400000;
}

// ─── Fallback static news articles ────────────────────────────────────────────
export const FALLBACK_NEWS: NewsArticle[] = [
  {
    id: "n001",
    category: "AI & ML",
    headline:
      "Google DeepMind Releases AlphaFold 3 Upgrade for Protein Structure Prediction",
    summary:
      "DeepMind's latest AlphaFold iteration expands beyond proteins to model DNA, RNA, and small molecules simultaneously. Researchers across 190 countries now have free access for non-commercial use.",
    source: "Nature",
    date: "Apr 22, 2026",
    readTime: "4 min read",
    author: "Dr. Amelia Chen",
    tags: ["AlphaFold", "Protein Structure", "Deep Learning"],
    relatedIds: ["n002", "n010"],
    fullContent: [
      "Google DeepMind has announced a significant upgrade to its AlphaFold protein structure prediction system. The system can now simultaneously model proteins alongside DNA, RNA, and small molecules — enabling researchers to study entire molecular complexes rather than individual components.",
      "Benchmark performance shows a 45% improvement on CASP-style protein-ligand benchmarks and a 28% reduction in predicted errors for membrane proteins. Inference time decreased by approximately 40% compared to AlphaFold 2.",
      "Access remains free for academic and non-commercial use through the AlphaFold Server.",
    ].join("\n\n"),
  },
  {
    id: "n002",
    category: "AI & ML",
    headline:
      "OpenAI Launches GPT-5 with Improved Reasoning and Extended Context",
    summary:
      "OpenAI's fifth-generation model introduces chain-of-thought reasoning as a first-class feature, with a 1-million token context window and support for real-time web search.",
    source: "OpenAI Blog",
    date: "Apr 21, 2026",
    readTime: "5 min read",
    author: "Sam Altman",
    tags: ["GPT-5", "OpenAI", "LLM"],
    relatedIds: ["n001", "n003"],
    fullContent: [
      "OpenAI has officially released GPT-5, the most capable language model in its lineup, featuring a 1-million token context window and a revamped reasoning engine.",
      "On the MATH benchmark, GPT-5 achieves 92.4%, compared to GPT-4o's 76.6%. On HumanEval, the model scores 94.1%, up from 87.2%.",
      "API pricing remains tiered: the full capability model is priced at $30 per million input tokens.",
    ].join("\n\n"),
  },
  {
    id: "n003",
    category: "Cybersecurity",
    headline:
      "Critical Zero-Day Vulnerability Found in Widely-Used Open-Source Logging Library",
    summary:
      "Security researchers at Wiz disclosed a critical remote code execution vulnerability affecting liblog4x, present in over 2.3 million projects. CISA issued an emergency directive.",
    source: "Krebs on Security",
    date: "Apr 20, 2026",
    readTime: "5 min read",
    author: "Brian Sterling",
    tags: ["Zero-Day", "RCE", "CISA"],
    relatedIds: ["n004", "n005"],
    fullContent: [
      "Security researchers at Wiz have disclosed a critical remote code execution vulnerability in liblog4x, a widely used open-source logging library present in over 2.3 million projects.",
      "The vulnerability allows an unauthenticated attacker to execute arbitrary code on a vulnerable host by causing the affected library to process a specially crafted log message.",
      "CISA issued an emergency directive requiring all federal civilian executive branch agencies to patch or mitigate within 72 hours.",
    ].join("\n\n"),
  },
  {
    id: "n004",
    category: "Cloud",
    headline:
      "AWS Announces Quantum Computing Services Entering General Availability",
    summary:
      "Amazon Web Services has moved its Braket Quantum Computing service from preview to general availability, offering access to four distinct quantum hardware backends.",
    source: "AWS Blog",
    date: "Apr 20, 2026",
    readTime: "4 min read",
    author: "Werner Vogels",
    tags: ["AWS", "Quantum Computing", "Cloud"],
    relatedIds: ["n005"],
    fullContent: [
      "Amazon Web Services has announced the general availability of Amazon Braket Quantum Computing. The GA launch includes access to four quantum hardware backends including a 133-qubit trapped-ion system.",
      "Integration with the broader AWS ecosystem is a key differentiator. Braket jobs can be triggered from Lambda functions, data can be passed to and from S3, and results can be fed directly into SageMaker.",
    ].join("\n\n"),
  },
  {
    id: "n005",
    category: "Web Dev",
    headline:
      "Chrome 125 Adds View Transitions API for Native Multi-Page App Animations",
    summary:
      "Google Chrome 125 ships View Transitions API support for multi-page applications, enabling smooth cross-page animations without JavaScript frameworks.",
    source: "web.dev",
    date: "Apr 19, 2026",
    readTime: "4 min read",
    author: "Jake Archibald",
    tags: ["Chrome", "View Transitions", "Web API"],
    relatedIds: ["n006"],
    fullContent: [
      "Google Chrome 125 has shipped stable support for the View Transitions API for multi-page applications, extending the technology beyond its initial single-page application scope.",
      "The API works by capturing a screenshot of the current state before navigation begins, then rendering the incoming page and performing a configurable animated transition between the two states.",
      "Apple's WebKit team has filed a positive intent-to-implement, while Mozilla has added it to the Firefox standards backlog.",
    ].join("\n\n"),
  },
  {
    id: "n006",
    category: "Open Source",
    headline: "Linux Kernel 6.9 Merges Rust Support for Core Driver Subsystems",
    summary:
      "After years of incremental expansion, Linux 6.9 includes the first Rust-written drivers merged into core kernel subsystems including the NVMe storage driver.",
    source: "LWN.net",
    date: "Apr 13, 2026",
    readTime: "5 min read",
    author: "Jonathan Corbet",
    tags: ["Linux", "Rust", "Kernel"],
    relatedIds: [],
    fullContent: [
      "The Linux 6.9 kernel has merged Rust-written code into two core driver subsystems — NVMe storage and select networking components.",
      "The Rust NVMe driver implements the initialization, queue management, and command submission paths in Rust while delegating hardware-specific low-level register access to a thin C compatibility layer.",
      'Linus Torvalds commented that the NVMe driver merge is "actually boring in a good way — it works, the tests pass, and nobody had to do anything special."',
    ].join("\n\n"),
  },
  {
    id: "n007",
    category: "Mobile",
    headline:
      "Apple Releases iOS 19 Developer Preview with Live Translation and AI Summarization",
    summary:
      "Apple's iOS 19 developer preview includes system-wide live translation supporting 48 languages and on-device AI summarization for notifications and long documents.",
    source: "MacRumors",
    date: "Apr 21, 2026",
    readTime: "4 min read",
    author: "Joe Rossignol",
    tags: ["iOS 19", "Apple", "Mobile", "AI"],
    relatedIds: [],
    fullContent: [
      "Apple has seeded the iOS 19 developer preview, introducing the most AI-centric iOS release in the platform's history.",
      "Live translation is now a system-level capability available across all apps without developer integration. The feature supports 48 languages and runs entirely on-device.",
      "On-device AI summarization is integrated throughout the system. In the Notifications stack, it generates summaries of groups of notifications from the same app.",
    ].join("\n\n"),
  },
  {
    id: "n008",
    category: "Research",
    headline:
      "MIT Team Proposes Energy-Efficient Neural Network Architecture at 10% of GPT-4 Energy Cost",
    summary:
      "A paper from MIT CSAIL introduces SparseFlow, a neural network architecture using dynamic sparse activation that matches GPT-4-scale model performance while consuming approximately 10% of the energy.",
    source: "MIT CSAIL",
    date: "Apr 23, 2026",
    readTime: "6 min read",
    author: "Dr. Maya Johnson",
    tags: ["Energy Efficiency", "Neural Networks", "MIT"],
    relatedIds: [],
    fullContent: [
      "Researchers at MIT's Computer Science and Artificial Intelligence Laboratory have published a paper describing SparseFlow, a neural network architecture that achieves performance comparable to GPT-4-scale models while requiring approximately 10% of the computational energy.",
      "The key insight is dynamic sparse activation: rather than computing all activations for all parameters on every forward pass, the architecture routes each input token through a small learned gating network.",
      "The team trained a 70-billion-parameter SparseFlow model and compared it against GPT-4 on MMLU, HumanEval, and MATH benchmarks.",
    ].join("\n\n"),
  },
];

// ─── Fallback magazine articles ───────────────────────────────────────────────
export const FALLBACK_MAGAZINE: MagazineArticle[] = [
  {
    id: "m1",
    category: "Artificial Intelligence",
    featured: true,
    headline: "The New Wave of AI Coding Assistants: Friend or Crutch?",
    byline: "Dr. Alyssa Martinez",
    readTime: "8 min",
    date: "Apr 2026",
    teaser:
      "GitHub Copilot, Cursor, and their successors have transformed how software is written. But are developers becoming dangerously dependent on AI-generated code they don't fully understand?",
    gradient: "from-violet-600 to-purple-700",
    icon: "💻",
    pullQuote:
      '"The best developers I know use AI assistants the way a surgeon uses a scalpel — with full understanding of what it is doing and complete control over the outcome."',
    relatedTitles: [
      "Teaching Ethics to Engineers: A Failing Grade",
      "Why Systems Programming Is Making a Comeback",
    ],
    body: [
      "The summer of 2024 was when everything changed. GitHub Copilot had been available for two years and Claude Code and Cursor were just entering widespread use. Within six months, surveys showed more than 60% of professional developers were using AI coding assistants daily.",
      "The productivity gains are real and striking. In controlled studies, developer teams using AI assistants shipped features at 30–55% higher velocity than control groups working without them.",
      "But productivity is not the only metric that matters. A quieter concern has been building among senior engineers: are these tools making it easier for developers to produce code they do not truly understand?",
      '"The best developers I know use AI assistants the way a surgeon uses a scalpel — with full understanding of what it\'s doing and complete control over the outcome," argues Dr. Alyssa Martinez of Stanford.',
    ].join("\n\n"),
  },
  {
    id: "m2",
    category: "Computing",
    headline: "Why Systems Programming Is Making a Comeback",
    byline: "James Whitfield",
    readTime: "6 min",
    date: "Apr 2026",
    teaser:
      "A generation of developers raised on managed languages and cloud abstractions is rediscovering the power of C, C++, and Rust. The catalyst: performance and safety suddenly matter more.",
    gradient: "from-sky-600 to-blue-700",
    icon: "⚙️",
    pullQuote:
      '"Rust gives you the control of C with the safety of a managed language."',
    relatedTitles: ["The New Wave of AI Coding Assistants: Friend or Crutch?"],
    body: [
      "For most of the 2010s, the career trajectory of a software engineer pointed firmly away from systems programming. Python, JavaScript, and Go dominated the hiring market.",
      "That era has not ended, exactly — but something significant has shifted in the technical conversation. Systems programming is fashionable again, and for reasons that have nothing to do with nostalgia.",
      "The most visible catalyst is Rust. Mozilla began developing Rust to address safety vulnerabilities in Firefox's rendering engine. Approximately 70% of Chrome's high-severity security bugs are memory safety issues.",
    ].join("\n\n"),
  },
  {
    id: "m3",
    category: "Computing",
    headline: "Quantum Computing's Road to Practical Applications",
    byline: "Prof. Elena Vasquez",
    readTime: "10 min",
    date: "Apr 2026",
    teaser:
      "After decades of promises and incremental progress, quantum computing is approaching a turning point. But the path from noisy current devices to fault-tolerant machines is longer than most acknowledge.",
    gradient: "from-indigo-600 to-violet-700",
    icon: "⚛️",
    pullQuote:
      '"We are in the quantum equivalent of the vacuum tube era — you can build something that works, but the engineering required to do anything useful is enormous."',
    relatedTitles: ["Why Systems Programming Is Making a Comeback"],
    body: [
      "The fundamental challenge is that today's quantum computers are noisy intermediate-scale quantum (NISQ) devices. Their qubits decohere quickly, errors accumulate with every gate operation.",
      "To run algorithms like Shor's algorithm for factoring large numbers, you need fault-tolerant quantum computation with logical error rates below 10^-15. Today's best physical qubit error rates hover around 10^-3.",
      '"We are in the quantum equivalent of the vacuum tube era," says Prof. Elena Vasquez. "You can build something that works, but the engineering required to do anything useful is enormous."',
    ].join("\n\n"),
  },
  {
    id: "m4",
    category: "Climate",
    headline: "The Environmental Cost of Large Language Models",
    byline: "Dr. Kenji Nakamura",
    readTime: "7 min",
    date: "Mar 2026",
    teaser:
      "Training GPT-4 consumed enough electricity to power 1,000 homes for a year. As AI scales up, the industry faces growing pressure to confront the environmental mathematics of its energy use.",
    gradient: "from-emerald-600 to-teal-700",
    icon: "🌍",
    pullQuote:
      '"The energy cost of AI is not a distant problem. It is showing up right now in the electricity bills of local utilities."',
    relatedTitles: ["The Global Race to Regulate Artificial Intelligence"],
    body: [
      "By 2026, a frontier model trained today requires an estimated 5 to 20 gigawatt-hours — at the high end, that is enough to power a small town for a year.",
      "Training is only part of the story. Inference — actually running the model to answer questions — is distributed across millions of user interactions every day. The aggregate inference cost now rivals the training cost.",
      "The industry's response has taken several forms. Efficiency research has become a first-order concern at most major labs. Mixture-of-experts architectures, knowledge distillation, and hardware-software co-design have collectively reduced compute required per unit of capability.",
    ].join("\n\n"),
  },
  {
    id: "m5",
    category: "Biotechnology",
    headline: "CRISPR 2.0: Gene Editing Gets Smarter and Safer",
    byline: "Dr. Sarah Chen",
    readTime: "9 min",
    date: "Mar 2026",
    teaser:
      "Base editing and prime editing have moved beyond proof of concept into early clinical trials, offering precision that classic CRISPR-Cas9 cannot match.",
    gradient: "from-pink-600 to-rose-700",
    icon: "🧬",
    pullQuote:
      '"We can now think of correcting genetic diseases at single-nucleotide resolution. That is the difference between a scalpel and a crowbar."',
    relatedTitles: ["The Environmental Cost of Large Language Models"],
    body: [
      "CRISPR-Cas9 works by creating a double-strand break in DNA at a specified location. It is transformatively more precise and accessible than earlier gene editing technologies. But it is also imperfect.",
      "The next generation of gene editing tools, now entering early clinical stages, addresses these limitations. Base editing can convert one DNA base letter to another without creating a double-strand break.",
      "Early clinical results are encouraging. A base editing program for sickle cell disease achieved complete resolution of symptoms in early trial participants.",
    ].join("\n\n"),
  },
  {
    id: "m6",
    category: "Business",
    headline: "Decentralized AI: Can Blockchain Fix the AI Monopoly Problem?",
    byline: "Marcus Okafor",
    readTime: "8 min",
    date: "Mar 2026",
    teaser:
      "A growing coalition of researchers argues that the concentration of AI capability in a handful of companies represents a fundamental risk to competition and democratic governance.",
    gradient: "from-amber-600 to-yellow-700",
    icon: "⛓️",
    pullQuote:
      '"The scenario we need to avoid is one where three companies control the cognitive infrastructure of the global economy."',
    relatedTitles: ["The Global Race to Regulate Artificial Intelligence"],
    body: [
      "Five years ago, a capable AI assistant required access to models from one of four or five companies. Today it requires access to models from one of two or three. The concentration of frontier AI capability is accelerating, not dispersing.",
      "The decentralized AI movement proposes using blockchain or distributed systems to create AI infrastructure that no single entity controls. Several projects are developing federated training systems where model updates are contributed by participants with cryptographic guarantees.",
      "The technical challenges are real. Coordinating gradient updates across thousands of independent nodes is substantially less efficient than centralized training on a purpose-built cluster.",
    ].join("\n\n"),
  },
  {
    id: "m7",
    category: "Artificial Intelligence",
    headline: "The Invisible Labor of AI Data Labeling",
    byline: "Priya Iyer",
    readTime: "6 min",
    date: "Mar 2026",
    teaser:
      "The polished AI products we use daily are built on millions of hours of work by low-paid contractors around the world.",
    gradient: "from-violet-500 to-purple-600",
    icon: "🏭",
    pullQuote:
      '"Every large language model is, in a sense, a crystallization of human judgment — just the judgment of people who were paid very little."',
    relatedTitles: ["The New Wave of AI Coding Assistants: Friend or Crutch?"],
    body: [
      "This is the data labeling industry. It is vast, largely invisible, and absolutely essential to modern AI. Every large AI system trained on supervised learning requires human labor to create the labeled datasets it learns from.",
      "OpenAI's GPT-4 was trained using reinforcement learning from human feedback, a process that requires human raters to evaluate pairs of model responses. Estimates of the number of labor hours required run to the millions.",
      '"Every large language model is, in a sense, a crystallization of human judgment — just the judgment of people who were paid very little for their contribution," says Priya Iyer of the Oxford Internet Institute.',
    ].join("\n\n"),
  },
  {
    id: "m8",
    category: "Computing",
    headline: "Teaching Ethics to Engineers: A Failing Grade",
    byline: "Dr. Michael Torres",
    readTime: "7 min",
    date: "Feb 2026",
    teaser:
      "Computer science programs have been adding ethics courses for a decade. Yet engineers continue to build systems that discriminate, invade privacy, and cause harm.",
    gradient: "from-slate-600 to-gray-700",
    icon: "🎓",
    pullQuote:
      '"Ethics education that is not integrated into technical practice is just philosophy with a different audience."',
    relatedTitles: [
      "The New Wave of AI Coding Assistants: Friend or Crutch?",
      "The Invisible Labor of AI Data Labeling",
    ],
    body: [
      "The response from computer science programs to growing public concern has been, almost universally, the same: add an ethics course. MIT, Stanford, Carnegie Mellon, Berkeley — all have expanded their ethics offerings in the past five years.",
      '"Ethics education that is not integrated into technical practice is just philosophy with a different audience," argues Dr. Michael Torres of Cornell.',
      "Some programs are experimenting with alternatives. Georgia Tech has piloted a model where ethics discussions are embedded in core technical courses.",
    ].join("\n\n"),
  },
  {
    id: "m9",
    category: "Connectivity",
    headline: "5G's Unfulfilled Promise and What Comes Next",
    byline: "Nina Holloway",
    readTime: "6 min",
    date: "Feb 2026",
    teaser:
      "Carriers spent trillions deploying 5G networks. The killer applications that were supposed to justify the investment never materialized at scale.",
    gradient: "from-orange-500 to-amber-600",
    icon: "📡",
    pullQuote: '"5G was oversold to consumers and undersold to industry."',
    relatedTitles: ["How Neuromorphic Chips Are Reshaping AI Hardware"],
    body: [
      "Five years ago, 5G was going to transform manufacturing, enable autonomous vehicles, make remote surgery routine. Today, the network is largely deployed in high-density urban areas.",
      '"5G was oversold to consumers and undersold to industry. The real applications are in logistics, manufacturing, and critical infrastructure — not smartphone video streaming," says Nina Holloway.',
      "The industry is already planning for 6G, with standardization bodies targeting a 2030 commercial launch.",
    ].join("\n\n"),
  },
  {
    id: "m10",
    category: "Computing",
    headline: "How Neuromorphic Chips Are Reshaping AI Hardware",
    byline: "Dr. Marcus Lee",
    readTime: "9 min",
    date: "Feb 2026",
    teaser:
      "Intel's Loihi 2 and IBM's NorthPole represent a fundamentally different approach to computation — one that mimics the brain's architecture.",
    gradient: "from-cyan-600 to-sky-700",
    icon: "💡",
    pullQuote:
      '"A Loihi 2 chip can process a speech recognition task using less power than a hearing aid battery."',
    relatedTitles: ["Quantum Computing's Road to Practical Applications"],
    body: [
      "The human brain runs on roughly twenty watts of power — about the same as a dim light bulb. The most powerful AI systems today require hundreds of kilowatts.",
      "Neuromorphic computing is the attempt to close this gap by building hardware that more closely mimics the brain's computational architecture. Rather than conventional transistors, neuromorphic chips use circuits that implement spiking neurons.",
      '"A Loihi 2 chip can process a speech recognition task using less power than a hearing aid battery. No GPU comes close to that efficiency," says Dr. Marcus Lee.',
    ].join("\n\n"),
  },
  {
    id: "m11",
    category: "Climate",
    headline: "Carbon Capture Technology Reaches an Inflection Point",
    byline: "Dr. Sarah Okonkwo",
    readTime: "8 min",
    date: "Jan 2026",
    teaser:
      "Direct air capture facilities are finally moving from demonstration scale to industrial scale, with costs falling faster than anticipated.",
    gradient: "from-green-600 to-emerald-700",
    icon: "🌿",
    pullQuote:
      '"We have crossed a threshold where direct air capture is no longer a science project. It is an engineering problem."',
    relatedTitles: ["The Environmental Cost of Large Language Models"],
    body: [
      "The Orca plant in Iceland captured 4,000 tonnes of CO2 from the atmosphere in its first year of operation. The Mammoth plant is designed to capture 36,000 tonnes annually.",
      "Cost reduction has been real. Early estimates put the cost of direct air capture at $1,000 per tonne of CO2. Current commercial deployments operate at $300 to $500 per tonne.",
      '"We have crossed a threshold where direct air capture is no longer a science project. It is an engineering problem, and engineering problems have solutions," argues Dr. Sarah Okonkwo of ETH Zurich.',
    ].join("\n\n"),
  },
  {
    id: "m12",
    category: "Business",
    headline: "The Global Race to Regulate Artificial Intelligence",
    byline: "Laura Fernández",
    readTime: "7 min",
    date: "Jan 2026",
    teaser:
      "The EU has its AI Act, the US has executive orders, China has its own framework. The world's major economies are writing the rules for AI simultaneously.",
    gradient: "from-rose-600 to-pink-700",
    icon: "⚖️",
    pullQuote:
      '"The risk of regulatory fragmentation is that companies optimize for compliance in each jurisdiction separately, rather than for safety globally."',
    relatedTitles: [
      "Decentralized AI: Can Blockchain Fix the AI Monopoly Problem?",
    ],
    body: [
      "The European Union's AI Act became effective in August 2024 and began imposing substantive obligations in 2025. It is the world's most comprehensive AI regulation: a risk-tiered framework.",
      "The United States has taken a different approach. Executive orders have directed federal agencies to develop sector-specific guidance rather than create a horizontal regulatory framework.",
      '"The risk of regulatory fragmentation is that companies optimize for compliance in each jurisdiction separately, rather than for safety globally," says Laura Fernández of the European University Institute.',
    ].join("\n\n"),
  },
];

// ─── RSS Feed URLs ─────────────────────────────────────────────────────────────
export const NEWS_FEED_URLS = [
  "https://api.rss2json.com/v1/api.json?rss_url=https%3A%2F%2Ftechcrunch.com%2Ffeed%2F&count=10",
  "https://api.rss2json.com/v1/api.json?rss_url=https%3A%2F%2Fwww.theverge.com%2Frss%2Findex.xml&count=10",
  "https://api.rss2json.com/v1/api.json?rss_url=https%3A%2F%2Fwww.wired.com%2Ffeed%2Frss&count=10",
];

export const MAGAZINE_FEED_URLS = [
  "https://api.rss2json.com/v1/api.json?rss_url=http%3A%2F%2Ffeeds.arstechnica.com%2Farstechnica%2Findex&count=8",
  "https://api.rss2json.com/v1/api.json?rss_url=https%3A%2F%2Fwww.wired.com%2Ffeed%2Frss&count=8",
  "https://api.rss2json.com/v1/api.json?rss_url=https%3A%2F%2Fspectrum.ieee.org%2Ffeeds%2Ffeed.rss&count=8",
];

export const GRADIENTS = [
  "from-violet-600 to-purple-700",
  "from-sky-600 to-blue-700",
  "from-indigo-600 to-violet-700",
  "from-emerald-600 to-teal-700",
  "from-pink-600 to-rose-700",
  "from-amber-600 to-yellow-700",
  "from-violet-500 to-purple-600",
  "from-slate-600 to-gray-700",
  "from-orange-500 to-amber-600",
  "from-cyan-600 to-sky-700",
  "from-green-600 to-emerald-700",
  "from-rose-600 to-pink-700",
];

export const CATEGORY_ICONS: Record<string, string> = {
  "AI & ML": "🤖",
  Cybersecurity: "🔐",
  Cloud: "☁️",
  "Web Dev": "🌐",
  "Open Source": "🐧",
  Mobile: "📱",
  Research: "🔬",
  "Artificial Intelligence": "🧠",
  Computing: "💻",
  Climate: "🌍",
  Biotechnology: "🧬",
  Connectivity: "📡",
  Business: "📊",
};
