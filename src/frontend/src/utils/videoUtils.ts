/**
 * videoUtils.ts
 * Curated map of CS topics → stable YouTube video IDs from trusted educational channels.
 * All IDs manually selected from CS50, freeCodeCamp, Traversy Media, Fireship, The Coding Train, etc.
 */

export interface VideoEntry {
  primary: string;
  fallbacks: string[];
}

/** Mapping: topic key → { primary, fallbacks } */
const VIDEO_MAP: Record<string, VideoEntry> = {
  // ── JavaScript ────────────────────────────────────────────────────────────
  "javascript intro": {
    primary: "W6NZfCO5SIk", // JS in 1 hour — Programming with Mosh
    fallbacks: ["PkZNo7MFNFg", "hdI2bqOjy3c"],
  },
  "javascript basics": {
    primary: "W6NZfCO5SIk",
    fallbacks: ["PkZNo7MFNFg", "hdI2bqOjy3c"],
  },
  "javascript es6": {
    primary: "NCwa_xi0Uuc", // ES6 — Traversy Media
    fallbacks: ["WZuxJ2cl-3Y", "2LeqilIw-28"],
  },
  "javascript promises": {
    primary: "PoRJizFvM7s", // Promises — The Net Ninja
    fallbacks: ["DHvZLI7Db8E", "vn3tm0quoqE"],
  },
  "javascript async await": {
    primary: "V_Kr9OSfDeU", // Async/Await — Fireship
    fallbacks: ["PoRJizFvM7s", "vn3tm0quoqE"],
  },
  "javascript dom": {
    primary: "5fb2aPlgoys", // DOM — Traversy Media
    fallbacks: ["0ik6X4DJKCc", "mPd2aJXCZ2g"],
  },
  "javascript closures": {
    primary: "vKJpeze7nkI", // Closures — Fireship
    fallbacks: ["3a0I8ICR1Vg", "1JsJx1x-2bo"],
  },

  // ── TypeScript ────────────────────────────────────────────────────────────
  "typescript basics": {
    primary: "d56mG7DezGs", // TypeScript — Fireship
    fallbacks: ["BwuLxPH8IDs", "gp5H0Vx39c4"],
  },
  "typescript intro": {
    primary: "d56mG7DezGs",
    fallbacks: ["BwuLxPH8IDs", "gp5H0Vx39c4"],
  },
  "typescript generics": {
    primary: "nePDL5lQSE4", // Generics — Matt Pocock
    fallbacks: ["EcCTIFZqDgU", "IOzkOXSz9gE"],
  },

  // ── Python ────────────────────────────────────────────────────────────────
  "python basics": {
    primary: "rfscVS0vtbw", // Python — freeCodeCamp
    fallbacks: ["kqtD5dpn9C8", "_uQrJ0TkZlc"],
  },
  "python intro": {
    primary: "rfscVS0vtbw",
    fallbacks: ["kqtD5dpn9C8", "_uQrJ0TkZlc"],
  },
  "python functions": {
    primary: "9Os0o3wzS_I", // Python functions — Corey Schafer
    fallbacks: ["rfscVS0vtbw", "kqtD5dpn9C8"],
  },
  "python oop": {
    primary: "ZDa-Z5JzLYM", // Python OOP — Corey Schafer
    fallbacks: ["apACNr7DC_s", "m_MQYyJpIcg"],
  },
  "python data structures": {
    primary: "pkYVOmU3MgA", // Python DS — Tech With Tim
    fallbacks: ["rfscVS0vtbw", "kqtD5dpn9C8"],
  },

  // ── React ─────────────────────────────────────────────────────────────────
  "react tutorial": {
    primary: "Ke90Tje7VS0", // React — Traversy Media
    fallbacks: ["w7ejDZ8SWv8", "j942wKiXFu8"],
  },
  "react hooks": {
    primary: "TNhaISOUy6Q", // React Hooks — Fireship
    fallbacks: ["LlvBzyy-558", "O6P86uwfdR0"],
  },
  "react state management": {
    primary: "5W9T-8ikBPM", // State management — Traversy
    fallbacks: ["TNhaISOUy6Q", "w7ejDZ8SWv8"],
  },
  "react context": {
    primary: "5LrDIWkK_Bc", // Context API — Traversy
    fallbacks: ["TNhaISOUy6Q", "LlvBzyy-558"],
  },
  "react router": {
    primary: "Law7wfdg_ls", // React Router v6 — Traversy
    fallbacks: ["Ke90Tje7VS0", "w7ejDZ8SWv8"],
  },

  // ── Node.js ───────────────────────────────────────────────────────────────
  "nodejs intro": {
    primary: "fBNz5xF-Kx4", // Node.js — Traversy
    fallbacks: ["TlB_eWDSMt4", "ENrzD9HAZK4"],
  },
  "nodejs tutorial": {
    primary: "fBNz5xF-Kx4",
    fallbacks: ["TlB_eWDSMt4", "ENrzD9HAZK4"],
  },
  "express tutorial": {
    primary: "L72fhGm1tfE", // Express — Traversy
    fallbacks: ["fBNz5xF-Kx4", "TlB_eWDSMt4"],
  },

  // ── HTML / CSS ────────────────────────────────────────────────────────────
  "html basics": {
    primary: "pQN-pnXPaVg", // HTML — freeCodeCamp
    fallbacks: ["UB1O30fR-EE", "qz0aGYrrlhU"],
  },
  "css basics": {
    primary: "yfoY53QXEnI", // CSS — freeCodeCamp
    fallbacks: ["1Rs2ND1ryYc", "OXGznpKZ_sA"],
  },
  "css flexbox": {
    primary: "fYq5PXgSsbE", // Flexbox — Traversy
    fallbacks: ["JJSoEo8JSnc", "K74l26pE4YA"],
  },
  "css grid": {
    primary: "jV8B24rSN5o", // CSS Grid — Traversy
    fallbacks: ["EFafSYg-PkI", "rg7Fvvl3taU"],
  },
  "css animations": {
    primary: "zHUpx90NerM", // CSS Animations — Kevin Powell
    fallbacks: ["YszONjKpgg4", "8kK-cA99SA0"],
  },

  // ── Data Structures ───────────────────────────────────────────────────────
  "data structures overview": {
    primary: "RBSGKlAvoiM", // DS — freeCodeCamp full course
    fallbacks: ["B31LgI4Y4DQ", "t2CEgPsws3U"],
  },
  arrays: {
    primary: "QJNwK2uJyGs", // Arrays — CS50
    fallbacks: ["RBSGKlAvoiM", "B31LgI4Y4DQ"],
  },
  "linked lists": {
    primary: "F8AbOfQwl1c", // Linked Lists — freeCodeCamp
    fallbacks: ["njTh_OwMljA", "WwfhLC16bis"],
  },
  "stacks and queues": {
    primary: "wjI1WNcIntg", // Stacks & Queues — CS Dojo
    fallbacks: ["RBSGKlAvoiM", "B31LgI4Y4DQ"],
  },
  "binary trees": {
    primary: "fAAZixBzIAI", // Binary Trees — freeCodeCamp
    fallbacks: ["oSWTXtMglKE", "1-l_UOFi1Xw"],
  },
  "binary search trees": {
    primary: "fAAZixBzIAI",
    fallbacks: ["oSWTXtMglKE", "1-l_UOFi1Xw"],
  },
  "hash tables": {
    primary: "shs0KM3wKv8", // Hash Tables — CS Dojo
    fallbacks: ["KyUTuwz_b7Q", "sfWyugl4JWA"],
  },
  heaps: {
    primary: "t0Cq6tVNRBA", // Heaps — freeCodeCamp
    fallbacks: ["RBSGKlAvoiM", "B31LgI4Y4DQ"],
  },
  graphs: {
    primary: "tWVWeAqZ0WU", // Graphs — freeCodeCamp
    fallbacks: ["RBSGKlAvoiM", "09_LkHNWx_U"],
  },

  // ── Algorithms ────────────────────────────────────────────────────────────
  "algorithms intro": {
    primary: "8hly31xKli0", // Algorithms — freeCodeCamp
    fallbacks: ["KEEKn7Me-ms", "pkkFqlG0Jcs"],
  },
  "sorting algorithms": {
    primary: "g-PGLbMth_g", // Sorting — freeCodeCamp
    fallbacks: ["kgBjXUE_Kkw", "Hoixgm4-P4M"],
  },
  "binary search": {
    primary: "P3YID7liBug", // Binary Search — freeCodeCamp
    fallbacks: ["8hly31xKli0", "KEEKn7Me-ms"],
  },
  "dynamic programming": {
    primary: "oBt53YbR9Kk", // DP — freeCodeCamp
    fallbacks: ["vYquumk4nXw", "oBt53YbR9Kk"],
  },
  recursion: {
    primary: "IJDJ0kBx2LM", // Recursion — freeCodeCamp
    fallbacks: ["8lhxIOAfDss", "rf60MejMz3E"],
  },
  "big o notation": {
    primary: "v4cd1O4zkGw", // Big O — CS Dojo
    fallbacks: ["Mo4vesaut8g", "__vX2dzul-Q"],
  },

  // ── Git ───────────────────────────────────────────────────────────────────
  "git tutorial": {
    primary: "RGOj5yH7evk", // Git — freeCodeCamp
    fallbacks: ["SWYqp7iY_Tc", "DVRQoVRzMIY"],
  },
  "git basics": {
    primary: "RGOj5yH7evk",
    fallbacks: ["SWYqp7iY_Tc", "DVRQoVRzMIY"],
  },
  "github tutorial": {
    primary: "RGOj5yH7evk",
    fallbacks: ["SWYqp7iY_Tc", "nhQLrGnBBs0"],
  },

  // ── SQL / Databases ───────────────────────────────────────────────────────
  "sql basics": {
    primary: "HXV3zeQKqGY", // SQL — freeCodeCamp
    fallbacks: ["7S_tz1z_5bA", "27axs9dO7AE"],
  },
  "sql tutorial": {
    primary: "HXV3zeQKqGY",
    fallbacks: ["7S_tz1z_5bA", "27axs9dO7AE"],
  },
  "databases intro": {
    primary: "wR0jg0eQsZA", // Databases — CS50
    fallbacks: ["HXV3zeQKqGY", "7S_tz1z_5bA"],
  },
  "nosql mongodb": {
    primary: "-bt_y4Loofg", // MongoDB — freeCodeCamp
    fallbacks: ["c2M-rlkkT5o", "ofme2o29ngU"],
  },

  // ── Computer Science Core ─────────────────────────────────────────────────
  "computer networks": {
    primary: "qiQR5rTSshw", // Networks — freeCodeCamp
    fallbacks: ["3QhU9jd03a0", "IPvYjXCsTg8"],
  },
  "operating systems": {
    primary: "vBURTt97EkA", // OS — freeCodeCamp
    fallbacks: ["26QPDBe-NB8", "dOiA2nNJpc0"],
  },
  "compiler design": {
    primary: "Tar4WgAfMr4", // Compilers — Stanford
    fallbacks: ["VDe6xHCHGxg", "eF9qWbuQLuw"],
  },
  "theory of computation": {
    primary: "9syvZr-9xwk", // TOC — Easy Theory
    fallbacks: ["HyUK4iota8E", "i628q-FLEBc"],
  },
  "system design": {
    primary: "FSR1s2b-l_I", // System Design — Gaurav Sen
    fallbacks: ["xpDnVSmNFX0", "i7twT3x5yv8"],
  },
  "computer architecture": {
    primary: "zLP_X4wyHbY", // Architecture — freeCodeCamp
    fallbacks: ["vBURTt97EkA", "26QPDBe-NB8"],
  },

  // ── Web Dev ───────────────────────────────────────────────────────────────
  "rest api": {
    primary: "SLwpqD8n3d0", // REST API — Traversy
    fallbacks: ["0oXYLzuucS8", "7YcW25PHnAA"],
  },
  graphql: {
    primary: "ed8SYXqfuZM", // GraphQL — freeCodeCamp
    fallbacks: ["BcLNfwF04Kw", "ZQL7tL2S0oQ"],
  },
  "docker tutorial": {
    primary: "fqMOX6JJhGo", // Docker — freeCodeCamp
    fallbacks: ["3c-iBn73dDE", "YFl2mCHdv24"],
  },
  "devops intro": {
    primary: "UbtB4sMaaNM", // DevOps — Edureka
    fallbacks: ["fqMOX6JJhGo", "3c-iBn73dDE"],
  },

  // ── C Programming ────────────────────────────────────────────────────────
  "c programming": {
    primary: "KJgsSFOSQv0", // C full course — freeCodeCamp
    fallbacks: ["87SH2R0Rs0", "e9Eds2Rc_x8"],
  },
  "c pointers": {
    primary: "zuegQmMdy8M", // Pointers — Caleb Curry
    fallbacks: ["KJgsSFOSQv0", "87SH2R0Rs0"],
  },
  "c arrays": {
    primary: "QJNwK2uJyGs",
    fallbacks: ["KJgsSFOSQv0", "87SH2R0Rs0"],
  },

  // ── Java ──────────────────────────────────────────────────────────────────
  "java basics": {
    primary: "grEKMHGYyns", // Java — Mosh
    fallbacks: ["eIrMbAQSU34", "A74TOX803D0"],
  },
  "java oop": {
    primary: "pTB0EiLXUC8", // Java OOP — Mosh
    fallbacks: ["grEKMHGYyns", "eIrMbAQSU34"],
  },

  // ── Machine Learning / AI ─────────────────────────────────────────────────
  "machine learning intro": {
    primary: "NWONeJKn9Kc", // ML — StatQuest
    fallbacks: ["i_LwzRVP7bg", "KNAWp2S3w94"],
  },
  "neural networks": {
    primary: "aircAruvnKk", // Neural Nets — 3Blue1Brown
    fallbacks: ["CqOfi41LfDo", "NWONeJKn9Kc"],
  },
  "deep learning": {
    primary: "VyWAvY2CF9c", // Deep Learning — freeCodeCamp
    fallbacks: ["aircAruvnKk", "NWONeJKn9Kc"],
  },

  // ── Cybersecurity ────────────────────────────────────────────────────────
  "cybersecurity intro": {
    primary: "U_P23SqJaDc", // Cybersecurity — freeCodeCamp
    fallbacks: ["inWWhr5tnEA", "qiQR5rTSshw"],
  },
  "cryptography basics": {
    primary: "AQDCe585Lnc", // Cryptography — Computerphile
    fallbacks: ["U_P23SqJaDc", "inWWhr5tnEA"],
  },

  // ── Cloud / DevOps ────────────────────────────────────────────────────────
  "cloud computing": {
    primary: "M988_fsOSWo", // Cloud — freeCodeCamp
    fallbacks: ["UbtB4sMaaNM", "fqMOX6JJhGo"],
  },
  "kubernetes tutorial": {
    primary: "X48VuDVv0do", // Kubernetes — TechWorld
    fallbacks: ["fqMOX6JJhGo", "3c-iBn73dDE"],
  },

  // ── CS50 / Programming Fundamentals ──────────────────────────────────────
  "programming fundamentals": {
    primary: "8mAITcNt710", // CS50x 2023 intro
    fallbacks: ["rfscVS0vtbw", "W6NZfCO5SIk"],
  },
  "object oriented programming": {
    primary: "pTB0EiLXUC8",
    fallbacks: ["ZDa-Z5JzLYM", "grEKMHGYyns"],
  },
  "design patterns": {
    primary: "tv-_1er1mMs", // Design Patterns — Christopher Okhravi
    fallbacks: ["FSR1s2b-l_I", "NU_1StN5Tkk"],
  },
  "clean code": {
    primary: "7EmboKQH8lM", // Clean Code — freeCodeCamp
    fallbacks: ["tv-_1er1mMs", "NU_1StN5Tkk"],
  },
};

/**
 * Normalize a topic string for lookup:
 * - lowercase
 * - collapse extra spaces
 * - strip punctuation (keep alphanumeric + space)
 */
function normalizeTopic(topic: string): string {
  return topic
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Returns the best matching VideoEntry for a given topic string.
 * Falls back to a generic CS intro video if no match is found.
 */
export function getVideoForTopic(topic: string): VideoEntry {
  const normalized = normalizeTopic(topic);

  // Exact match
  if (VIDEO_MAP[normalized]) return VIDEO_MAP[normalized];

  // Substring match — find first key that contains the normalized topic or vice-versa
  const keys = Object.keys(VIDEO_MAP);
  const partialMatch = keys.find(
    (k) => k.includes(normalized) || normalized.includes(k),
  );
  if (partialMatch) return VIDEO_MAP[partialMatch];

  // Word-overlap match — find key with most shared words
  const topicWords = normalized.split(" ").filter((w) => w.length > 2);
  let bestKey = "";
  let bestScore = 0;
  for (const key of keys) {
    const keyWords = key.split(" ");
    const shared = topicWords.filter((w) => keyWords.includes(w)).length;
    if (shared > bestScore) {
      bestScore = shared;
      bestKey = key;
    }
  }
  if (bestScore > 0 && bestKey) return VIDEO_MAP[bestKey];

  // Ultimate fallback — CS50 intro
  return {
    primary: "8mAITcNt710",
    fallbacks: ["rfscVS0vtbw", "W6NZfCO5SIk", "RBSGKlAvoiM"],
  };
}

/**
 * Validate a YouTube video ID via the oEmbed API.
 * Returns true if the video exists, false otherwise.
 * Note: This runs client-side; network errors → treated as unavailable.
 */
export async function validateYouTubeVideo(videoId: string): Promise<boolean> {
  if (!videoId || videoId.length < 5) return false;
  try {
    const res = await fetch(
      `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${encodeURIComponent(videoId)}&format=json`,
      { method: "GET", signal: AbortSignal.timeout(5000) },
    );
    return res.ok;
  } catch {
    return false;
  }
}

/** Build a YouTube search URL for a given topic string. */
export function buildYouTubeSearchUrl(topic: string): string {
  const query = encodeURIComponent(`${topic} tutorial programming`);
  return `https://www.youtube.com/results?search_query=${query}`;
}
