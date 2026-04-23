export interface PotdEntry {
  date: string; // YYYY-MM-DD
  problemId: number;
  bonusSP: number;
  featured: boolean;
}

/** Rich POTD problem info shown in the POTD card UI */
export interface PotdProblemInfo {
  id: number;
  title: string;
  difficulty: "Easy" | "Medium" | "Hard";
  companies: string[];
  category: string;
  bonusXP: number;
}

export const POTD_PROBLEMS_INFO: PotdProblemInfo[] = [
  {
    id: 1,
    title: "Two Sum",
    difficulty: "Easy",
    companies: ["Google", "Amazon"],
    category: "Array",
    bonusXP: 50,
  },
  {
    id: 2,
    title: "Valid Parentheses",
    difficulty: "Easy",
    companies: ["Amazon", "Microsoft"],
    category: "Stack",
    bonusXP: 50,
  },
  {
    id: 3,
    title: "Maximum Subarray",
    difficulty: "Medium",
    companies: ["Microsoft", "Apple"],
    category: "Dynamic Prog.",
    bonusXP: 75,
  },
  {
    id: 4,
    title: "Merge Intervals",
    difficulty: "Medium",
    companies: ["Meta", "Google"],
    category: "Array",
    bonusXP: 75,
  },
  {
    id: 5,
    title: "Word Break",
    difficulty: "Medium",
    companies: ["Google", "Uber"],
    category: "Dynamic Prog.",
    bonusXP: 75,
  },
  {
    id: 6,
    title: "Binary Tree Level Order Traversal",
    difficulty: "Medium",
    companies: ["Amazon", "Facebook"],
    category: "BFS",
    bonusXP: 75,
  },
  {
    id: 7,
    title: "Longest Palindromic Substring",
    difficulty: "Medium",
    companies: ["Microsoft", "Amadeus"],
    category: "String",
    bonusXP: 75,
  },
  {
    id: 8,
    title: "Reverse Linked List",
    difficulty: "Easy",
    companies: ["Adobe", "Cisco"],
    category: "Linked List",
    bonusXP: 50,
  },
  {
    id: 9,
    title: "Climbing Stairs",
    difficulty: "Easy",
    companies: ["Google", "Apple"],
    category: "Dynamic Prog.",
    bonusXP: 50,
  },
  {
    id: 10,
    title: "Binary Search",
    difficulty: "Easy",
    companies: ["Amazon", "Oracle"],
    category: "Searching",
    bonusXP: 50,
  },
  {
    id: 11,
    title: "Longest Common Subsequence",
    difficulty: "Medium",
    companies: ["Google", "Spotify"],
    category: "Dynamic Prog.",
    bonusXP: 75,
  },
  {
    id: 12,
    title: "Course Schedule",
    difficulty: "Medium",
    companies: ["Meta", "Airbnb"],
    category: "Graph",
    bonusXP: 75,
  },
  {
    id: 13,
    title: "Container With Most Water",
    difficulty: "Medium",
    companies: ["Amazon", "Visa"],
    category: "Two Pointers",
    bonusXP: 75,
  },
  {
    id: 14,
    title: "Trapping Rain Water",
    difficulty: "Hard",
    companies: ["Google", "Goldman Sachs"],
    category: "Two Pointers",
    bonusXP: 100,
  },
  {
    id: 15,
    title: "Median of Two Sorted Arrays",
    difficulty: "Hard",
    companies: ["Microsoft", "Bloomberg"],
    category: "Binary Search",
    bonusXP: 100,
  },
  {
    id: 16,
    title: "N-Queens",
    difficulty: "Hard",
    companies: ["Uber", "Atlassian"],
    category: "Backtracking",
    bonusXP: 100,
  },
  {
    id: 17,
    title: "Minimum Window Substring",
    difficulty: "Hard",
    companies: ["Facebook", "Snapchat"],
    category: "Sliding Window",
    bonusXP: 100,
  },
  {
    id: 18,
    title: "Jump Game",
    difficulty: "Medium",
    companies: ["Amazon", "Oracle"],
    category: "Greedy",
    bonusXP: 75,
  },
  {
    id: 19,
    title: "Find Duplicate Number",
    difficulty: "Medium",
    companies: ["Microsoft", "Nvidia"],
    category: "Array",
    bonusXP: 75,
  },
  {
    id: 20,
    title: "Serialize and Deserialize BST",
    difficulty: "Medium",
    companies: ["Google", "Twitter"],
    category: "Tree",
    bonusXP: 75,
  },
  {
    id: 21,
    title: "Palindrome Number",
    difficulty: "Easy",
    companies: ["Amazon"],
    category: "Math",
    bonusXP: 50,
  },
  {
    id: 22,
    title: "Rotate Array",
    difficulty: "Medium",
    companies: ["Microsoft", "Apple"],
    category: "Array",
    bonusXP: 75,
  },
  {
    id: 23,
    title: "LRU Cache",
    difficulty: "Medium",
    companies: ["Amazon", "Salesforce"],
    category: "Design",
    bonusXP: 75,
  },
  {
    id: 24,
    title: "Decode Ways",
    difficulty: "Medium",
    companies: ["Facebook", "Walmart"],
    category: "Dynamic Prog.",
    bonusXP: 75,
  },
  {
    id: 25,
    title: "Kth Largest Element in Array",
    difficulty: "Medium",
    companies: ["Google", "Netflix"],
    category: "Sorting",
    bonusXP: 75,
  },
  {
    id: 26,
    title: "Meeting Rooms II",
    difficulty: "Medium",
    companies: ["Lyft", "Airbnb"],
    category: "Heap",
    bonusXP: 75,
  },
  {
    id: 27,
    title: "Word Search",
    difficulty: "Medium",
    companies: ["Microsoft", "Samsung"],
    category: "Backtracking",
    bonusXP: 75,
  },
  {
    id: 28,
    title: "Coin Change",
    difficulty: "Medium",
    companies: ["Amazon", "PayPal"],
    category: "Dynamic Prog.",
    bonusXP: 75,
  },
  {
    id: 29,
    title: "Validate Binary Search Tree",
    difficulty: "Medium",
    companies: ["Google", "Expedia"],
    category: "Tree",
    bonusXP: 75,
  },
  {
    id: 30,
    title: "Pacific Atlantic Water Flow",
    difficulty: "Medium",
    companies: ["Google", "Quora"],
    category: "DFS/BFS",
    bonusXP: 75,
  },
];

export const POTD_POOL: PotdEntry[] = POTD_PROBLEMS_INFO.map((p, i) => ({
  date: `2026-01-${String(i + 1).padStart(2, "0")}`,
  problemId: p.id,
  bonusSP: p.bonusXP,
  featured: p.difficulty === "Hard" || i % 5 === 0,
}));

/** Returns the POTD entry for a given date string (YYYY-MM-DD).
 *  Deterministic cycling through the pool if the date isn't explicitly listed. */
export function getPOTD(dateStr: string): PotdEntry {
  const explicit = POTD_POOL.find((e) => e.date === dateStr);
  if (explicit) return explicit;

  let hash = 0;
  for (let i = 0; i < dateStr.length; i++) {
    hash = (hash * 31 + dateStr.charCodeAt(i)) >>> 0;
  }
  const entry = POTD_POOL[hash % POTD_POOL.length];
  return { ...entry, date: dateStr, featured: false };
}

/** Returns the rich problem info for today's POTD */
export function getTodayPotdInfo(): PotdProblemInfo {
  const today = new Date().toISOString().slice(0, 10);
  const entry = getPOTD(today);
  return (
    POTD_PROBLEMS_INFO.find((p) => p.id === entry.problemId) ??
    POTD_PROBLEMS_INFO[0]
  );
}
