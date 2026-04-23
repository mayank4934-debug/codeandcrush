export interface CompanyPrep {
  company: string;
  logo: string; // emoji
  color: string; // tailwind bg class for branding accent
  difficulty: "hard" | "medium";
  topProblemIds: number[]; // IDs from CODING_PROBLEMS (1–50)
  patterns: string[]; // common interview patterns
  checklist: string[]; // mock interview checklist
  rounds: string[]; // typical interview rounds
  tips: string;
  interviewPattern: string; // what the company specifically focuses on
  focusAreas: string[]; // 3-5 key focus areas with short descriptions
}

export const COMPANY_PREP: CompanyPrep[] = [
  {
    company: "Google",
    logo: "🔵",
    color: "bg-blue-500",
    difficulty: "hard",
    topProblemIds: [1, 3, 9, 14, 24, 33, 44, 50],
    patterns: [
      "Dynamic Programming (memoization + tabulation)",
      "Graph traversal (BFS/DFS) on grid problems",
      "Sliding Window + Two Pointers",
      "Binary Search on answer",
      "Interval merging and overlapping ranges",
      "Tries and string manipulation",
    ],
    checklist: [
      "Solve at least 5 Hard DP problems (Coin Change, LCS, Edit Distance)",
      "Master BFS/DFS on 2D grids (Number of Islands, Walls and Gates)",
      "Practice system design for distributed systems (Google Search, Maps)",
      "Study time/space complexity analysis thoroughly — every answer must include it",
      "Be ready to write clean code on the board — no IDE",
      "Practice explaining your thought process out loud before coding",
      "Review Googleyness questions (googliness, leadership, impact)",
      "Mock: 45-min timed coding interview with a friend or on Pramp",
    ],
    rounds: [
      "Technical Phone Screen (45 min)",
      "Onsite Loop (4–5 rounds)",
      "Coding × 2",
      "System Design × 1",
      "Googleyness/Leadership × 1",
    ],
    tips: "Google values clean code, systematic thinking, and communication. Always discuss edge cases and trade-offs before diving into code. System Design rounds expect scalable, fault-tolerant solutions.",
    interviewPattern:
      "Google emphasizes algorithmic thinking and code quality over speed. Interviews test your ability to break complex problems into sub-problems, write production-quality code, and communicate trade-offs clearly. Expect a mix of classic CS algorithms and novel problem variations that require creative thinking.",
    focusAreas: [
      "Dynamic Programming — expect multi-dimensional DP, state compression, and optimization variants",
      "Graph Algorithms — BFS/DFS on grids, shortest paths, topological sort, connected components",
      "System Design — scalable distributed systems, consistency vs. availability trade-offs",
      "Code Quality — clean abstractions, proper error handling, and O(n) complexity analysis",
      "Communication — thinking out loud, articulating edge cases, and collaborative problem-solving",
    ],
  },
  {
    company: "Amazon",
    logo: "🟠",
    color: "bg-orange-500",
    difficulty: "medium",
    topProblemIds: [1, 4, 9, 13, 19, 26, 38, 47],
    patterns: [
      "Arrays and Hash Maps (frequency counting)",
      "Sliding Window for subarray/substring problems",
      "Tree traversals (level order, path finding)",
      "Greedy algorithms",
      "Two Pointers on sorted arrays",
      "Dynamic Programming for optimization",
    ],
    checklist: [
      "Study all 16 Amazon Leadership Principles — prepare 2 STAR stories per principle",
      "Practice LeetCode Medium problems (mix of arrays, trees, graphs)",
      "Implement common data structures from scratch (HashMap, LinkedList, Stack)",
      "Prepare System Design: design Amazon's cart, recommendation engine, order system",
      "Practice coding under 30 minutes for Medium problems",
      "Review behavioral questions: 'Tell me about a time you failed'",
      "Know OOP principles — Amazon heavily values clean, object-oriented code",
    ],
    rounds: [
      "Online Assessment (2 coding + survey)",
      "Loop Interview (4–5 rounds)",
      "Coding × 2–3",
      "System Design × 1",
      "Bar Raiser Round",
    ],
    tips: "Amazon's bar raiser is the key hurdle. Every decision should tie back to the Leadership Principles. For coding, accuracy > speed. Always think about edge cases and discuss your approach before writing.",
    interviewPattern:
      "Amazon uniquely blends technical coding with behavioral Leadership Principle questions in every round. Expect interviewers to probe both your technical depth and culture fit simultaneously. The Bar Raiser — an unrelated senior engineer — attends one round specifically to raise the hiring bar.",
    focusAreas: [
      "Leadership Principles — every answer should map to Customer Obsession, Ownership, or Deliver Results",
      "Arrays & Hash Maps — Amazon loves frequency counting, sliding window, and hash-based lookups",
      "Tree Traversals — level-order BFS, path finding, and BST operations appear frequently",
      "System Design — large-scale e-commerce systems: carts, recommendations, order pipelines",
      "STAR Method — Situation, Task, Action, Result for all behavioral questions",
    ],
  },
  {
    company: "Microsoft",
    logo: "🪟",
    color: "bg-sky-500",
    difficulty: "medium",
    topProblemIds: [4, 14, 22, 27, 32, 36, 42, 46],
    patterns: [
      "Dynamic Programming (classic problems)",
      "Tree traversals and BST operations",
      "String manipulation and parsing",
      "Recursion and backtracking",
      "Linked list operations",
      "Bit manipulation",
    ],
    checklist: [
      "Practice 30 Medium LeetCode problems across all categories",
      "Study OOP and design patterns (Singleton, Factory, Observer)",
      "Prepare system design: design OneDrive, Teams, or VS Code backend",
      "Review C#/.NET or Java OOP concepts based on the team you're targeting",
      "Practice behavioral questions: growth mindset, collaboration, impact",
      "Study recursion deeply — Microsoft loves recursive problem-solving",
      "Prepare 3–4 projects you built, with technical depth you can discuss",
    ],
    rounds: [
      "Recruiter Screen",
      "Technical Phone Screen (45–60 min)",
      "Onsite Loop (4–5 rounds)",
      "Hiring Manager Round",
    ],
    tips: "Microsoft values collaborative culture and growth mindset. Be open about what you don't know and show how you'd learn. Coding rounds are usually problem-solving focused; design rounds for senior roles.",
    interviewPattern:
      "Microsoft interviews test collaborative problem-solving and growth mindset as much as technical ability. Unlike Google/Meta, Microsoft interviewers are approachable and hint-friendly — they want to see how you think through problems with guidance. OOP design and real-world applicability matter more than raw algorithmic speed.",
    focusAreas: [
      "Object-Oriented Design — design patterns, SOLID principles, class hierarchies",
      "Recursion & Backtracking — Microsoft loves recursive approaches to trees and string problems",
      "Dynamic Programming — classic 1D/2D DP problems like knapsack and string edit distance",
      "Growth Mindset — show willingness to learn, ask clarifying questions, accept hints gracefully",
      "Behavioral — collaboration stories, resolving disagreements, taking ownership of failures",
    ],
  },
  {
    company: "Meta",
    logo: "🔷",
    color: "bg-indigo-500",
    difficulty: "hard",
    topProblemIds: [8, 9, 12, 23, 30, 39, 43, 50],
    patterns: [
      "Graph algorithms (BFS/DFS, union-find)",
      "Dynamic Programming with state compression",
      "Two Pointers and advanced sliding window",
      "Tree problems (LCA, path sum, diameter)",
      "Design problems (LRU Cache, Twitter feed)",
      "Recursion with pruning (backtracking)",
    ],
    checklist: [
      "Solve all graph problems on LeetCode (Blind 75 + NeetCode 150)",
      "Master Union-Find (Disjoint Set Union) — appears frequently",
      "Prepare system design at scale: Facebook News Feed, Instagram, WhatsApp",
      "Study React/front-end concepts if targeting product engineer roles",
      "Practice in Python — most Meta interviewers are Python-comfortable",
      "Prepare behavioral: Move Fast, Be Bold, Focus on Long-Term Impact",
      "Do 5+ mock interviews — Meta's bar is high, practice under pressure",
      "Review concurrency concepts if targeting back-end/infrastructure",
    ],
    rounds: [
      "Recruiter Screen",
      "Technical Screen (45 min)",
      "Onsite Loop (4 rounds)",
      "Coding × 2",
      "System Design × 1",
      "Behavioral × 1",
    ],
    tips: "Meta interviews are very focused on coding precision and efficiency. Expect hard-level graph and DP problems. For system design, focus on scale — Meta handles billions of users. Be concise and technical.",
    interviewPattern:
      "Meta's interview process is highly structured and focuses on coding precision above all else. Two dedicated coding rounds mean you need to solve hard problems correctly and efficiently. The system design round is uniquely focused on massive scale — think billions of users, petabytes of data, and real-time feeds. Behavioral rounds assess Meta's cultural values: Move Fast, Be Bold.",
    focusAreas: [
      "Graph Algorithms — BFS/DFS, Union-Find, and advanced graph problems are Meta staples",
      "Dynamic Programming — state compression DP and 2D grid DP appear in hard problems",
      "Scale-Focused Design — News Feed, Instagram Stories, WhatsApp groups at billions of users",
      "Code Efficiency — O(n log n) or better expected; brute-force solutions are not accepted",
      "Meta Values — Move Fast, Be Bold, Focus on Long-Term Impact in behavioral rounds",
    ],
  },
  {
    company: "Flipkart",
    logo: "🛒",
    color: "bg-yellow-500",
    difficulty: "medium",
    topProblemIds: [1, 6, 16, 21, 29, 34, 40, 48],
    patterns: [
      "Arrays and sorting algorithms",
      "Strings and pattern matching",
      "Stack and Queue based problems",
      "Sliding Window for optimization",
      "Basic Dynamic Programming",
      "HashMap and counting techniques",
    ],
    checklist: [
      "Practice LeetCode Easy and Medium (focus on arrays, strings, stack/queue)",
      "Study Java fundamentals deeply — Flipkart predominantly uses Java",
      "Prepare system design: shopping cart, recommendation engine, delivery tracking",
      "Review database design and SQL joins",
      "Prepare for low-level design (design a parking lot, elevator system)",
      "Practice core OOP concepts and design patterns",
      "Review past Flipkart campus papers available online",
    ],
    rounds: [
      "Online Test (MCQ + Coding)",
      "Technical Round 1 (DSA)",
      "Technical Round 2 (System Design)",
      "HR Round",
    ],
    tips: "Flipkart campus interviews are approachable with solid DSA preparation. Focus on Easy-Medium LeetCode problems. System design and low-level design are assessed in senior roles. Java proficiency is a strong plus.",
    interviewPattern:
      "Flipkart focuses on solid fundamentals over cutting-edge algorithms. The online test is your first hurdle — MCQs on CS fundamentals plus 2 coding problems. DSA rounds emphasize arrays, strings, and stack/queue patterns. Senior roles add a system design round focused on e-commerce systems. Java is the dominant language and OOP knowledge is tested deeply.",
    focusAreas: [
      "Arrays & Strings — Flipkart's bread-and-butter: sorting, two-pointer, and string matching",
      "Stack & Queue — bracket problems, next greater element, and queue simulations",
      "Java & OOP — strong Java fundamentals, collections framework, and design patterns",
      "E-Commerce Design — design a shopping cart, recommendation engine, or delivery tracking system",
      "SQL & Databases — basic joins, indexing, and normalization for backend roles",
    ],
  },
  {
    company: "Adobe",
    logo: "🔴",
    color: "bg-red-500",
    difficulty: "medium",
    topProblemIds: [3, 7, 18, 25, 31, 37, 41, 45],
    patterns: [
      "Dynamic Programming for optimization",
      "String operations and manipulation",
      "Tree and graph traversals",
      "Object-oriented design (low-level design)",
      "Matrix and 2D array problems",
      "Recursion and divide & conquer",
    ],
    checklist: [
      "Solve 20 Medium LeetCode problems (DP, strings, trees are common)",
      "Study low-level design: design a chess game, parking lot, or ride-sharing app",
      "Review Adobe-specific domains: computer graphics, image processing basics",
      "Practice C++ or Java — Adobe teams often use these",
      "Prepare behavioral around creativity, collaboration, and solving ambiguous problems",
      "Review DBMS fundamentals — SQL queries, normalization, indexes",
      "Study OS concepts: processes, threads, memory management",
    ],
    rounds: [
      "Online Test",
      "Technical Round 1 (DSA Focus)",
      "Technical Round 2 (LLD)",
      "Technical Round 3 (Project Discussion)",
      "HR/Fit Round",
    ],
    tips: "Adobe interviews balance DSA with design thinking. Low-level design rounds are unique — practice designing real systems in code. Interviewers appreciate candidates who ask clarifying questions and think about extensibility.",
    interviewPattern:
      "Adobe stands out with its strong emphasis on Low-Level Design (LLD) alongside DSA. You'll be asked to design and implement systems like a chess game, parking lot, or ride-sharing app in real code. The project discussion round is unique — Adobe expects you to walk through past projects with genuine technical depth, showing creativity and problem-solving. Domain knowledge in graphics or creative tools is a bonus.",
    focusAreas: [
      "Low-Level Design — implement real systems in code: chess, parking lot, elevator, ride-sharing app",
      "Dynamic Programming — optimization problems appear frequently in DSA rounds",
      "Creative Problem-Solving — Adobe values unconventional approaches and design thinking",
      "Project Depth — be ready to dive deep into past projects, technical decisions, and trade-offs",
      "DBMS & OS — normalization, SQL queries, process management for backend/infrastructure roles",
    ],
  },
];
