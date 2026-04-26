import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  BookOpen,
  Code2,
  Search,
  Star,
  User2,
  UserPlus,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { addToRecentSearches } from "../components/GlobalSearchBar";
import WhatsAppAvatar from "../components/WhatsAppAvatar";
import { DEFAULT_AVATAR_CONFIG } from "../components/WhatsAppAvatar";
import { useApp } from "../context/AppContext";
import { CODING_PROBLEMS } from "../data/problems";

// ─── Peer users data ──────────────────────────────────────────────────────────
const PEER_USERS = [
  {
    id: "peer_1",
    username: "mayank_codes",
    displayName: "Mayank Sharma",
    followers: 1240,
    xp: 8500,
    streak: 42,
    solvedProblems: 73,
    badges: 12,
    avatarConfig: {
      ...DEFAULT_AVATAR_CONFIG,
      skinTone: "medium",
      hairStyle: "short",
      hairColor: "black",
    },
  },
  {
    id: "peer_2",
    username: "kripanshu_dev",
    displayName: "Kripanshu Wats",
    followers: 2100,
    xp: 12000,
    streak: 65,
    solvedProblems: 120,
    badges: 18,
    avatarConfig: {
      ...DEFAULT_AVATAR_CONFIG,
      skinTone: "light",
      hairStyle: "medium",
      hairColor: "brown",
    },
  },
  {
    id: "peer_3",
    username: "coder_priya",
    displayName: "Priya Gupta",
    followers: 876,
    xp: 5200,
    streak: 21,
    solvedProblems: 45,
    badges: 7,
    avatarConfig: {
      ...DEFAULT_AVATAR_CONFIG,
      skinTone: "medium-dark",
      hairStyle: "long",
      hairColor: "black",
    },
  },
  {
    id: "peer_4",
    username: "algo_arjun",
    displayName: "Arjun Patel",
    followers: 3450,
    xp: 22000,
    streak: 99,
    solvedProblems: 210,
    badges: 30,
    avatarConfig: {
      ...DEFAULT_AVATAR_CONFIG,
      skinTone: "tan",
      hairStyle: "short",
      hairColor: "black",
    },
  },
  {
    id: "peer_5",
    username: "react_riya",
    displayName: "Riya Singh",
    followers: 654,
    xp: 3800,
    streak: 14,
    solvedProblems: 32,
    badges: 5,
    avatarConfig: {
      ...DEFAULT_AVATAR_CONFIG,
      skinTone: "medium-light",
      hairStyle: "long",
      hairColor: "brown",
    },
  },
  {
    id: "peer_6",
    username: "dinesh_ds",
    displayName: "Dinesh Kumar",
    followers: 1890,
    xp: 9700,
    streak: 55,
    solvedProblems: 88,
    badges: 14,
    avatarConfig: {
      ...DEFAULT_AVATAR_CONFIG,
      skinTone: "dark",
      hairStyle: "short",
      hairColor: "black",
    },
  },
  {
    id: "peer_7",
    username: "vinit_ml",
    displayName: "Vinit Sharma",
    followers: 789,
    xp: 6100,
    streak: 30,
    solvedProblems: 56,
    badges: 9,
    avatarConfig: {
      ...DEFAULT_AVATAR_CONFIG,
      skinTone: "medium",
      hairStyle: "medium",
      hairColor: "black",
    },
  },
  {
    id: "peer_8",
    username: "biswajeet_web",
    displayName: "Biswajeet Mandal",
    followers: 1230,
    xp: 7400,
    streak: 38,
    solvedProblems: 64,
    badges: 10,
    avatarConfig: {
      ...DEFAULT_AVATAR_CONFIG,
      skinTone: "medium-dark",
      hairStyle: "short",
      hairColor: "black",
    },
  },
];

// ─── Topics from domains ─────────────────────────────────────────────────────
const DOMAIN_TOPICS = [
  {
    id: "t1",
    name: "Python Functions",
    domain: "Python",
    level: "Beginner",
    description: "Define, call, and use parameters in Python functions",
  },
  {
    id: "t2",
    name: "React Hooks",
    domain: "Frontend",
    level: "Intermediate",
    description: "useState, useEffect, useCallback, useMemo, and custom hooks",
  },
  {
    id: "t3",
    name: "Binary Search",
    domain: "DSA",
    level: "Intermediate",
    description: "Efficient O(log n) search on sorted arrays",
  },
  {
    id: "t4",
    name: "Dynamic Programming",
    domain: "DSA",
    level: "Advanced",
    description: "Memoization, tabulation, and common DP patterns",
  },
  {
    id: "t5",
    name: "SQL Joins",
    domain: "Backend",
    level: "Intermediate",
    description: "INNER, LEFT, RIGHT, FULL OUTER joins with examples",
  },
  {
    id: "t6",
    name: "System Design Basics",
    domain: "System Design",
    level: "Advanced",
    description: "Scalability, load balancers, databases, and caching",
  },
  {
    id: "t7",
    name: "Docker & Containers",
    domain: "DevOps",
    level: "Intermediate",
    description: "Containerize applications with Docker and docker-compose",
  },
  {
    id: "t8",
    name: "Neural Networks",
    domain: "Machine Learning",
    level: "Advanced",
    description: "Layers, activation functions, backpropagation",
  },
  {
    id: "t9",
    name: "Linked Lists",
    domain: "DSA",
    level: "Beginner",
    description: "Singly, doubly linked lists, insertion, deletion, traversal",
  },
  {
    id: "t10",
    name: "REST APIs",
    domain: "Backend",
    level: "Intermediate",
    description: "Design, build, and document RESTful APIs",
  },
  {
    id: "t11",
    name: "CSS Grid & Flexbox",
    domain: "Frontend",
    level: "Beginner",
    description: "Modern layout techniques for responsive designs",
  },
  {
    id: "t12",
    name: "Recursion",
    domain: "DSA",
    level: "Beginner",
    description: "Base cases, recursive calls, stack depth, and examples",
  },
];

type FilterTab = "all" | "people" | "topics" | "problems";

const LEVEL_COLORS: Record<string, string> = {
  Beginner: "text-green-400 bg-green-500/10 border-green-500/20",
  Intermediate: "text-amber-400 bg-amber-500/10 border-amber-500/20",
  Advanced: "text-red-400 bg-red-500/10 border-red-500/20",
};

const DIFF_COLORS: Record<string, string> = {
  Easy: "text-green-400",
  Medium: "text-amber-400",
  Hard: "text-red-400",
};

interface SearchPageProps {
  initialQuery: string;
  onClose: () => void;
  onNavigateToProblems: () => void;
  onNavigateToRoadmap: () => void;
  onNavigateToProfile: (userId: string) => void;
}

export default function SearchPage({
  initialQuery,
  onClose,
  onNavigateToProblems,
  onNavigateToRoadmap,
  onNavigateToProfile,
}: SearchPageProps) {
  const { user } = useApp();
  const [query, setQuery] = useState(initialQuery);
  const [activeTab, setActiveTab] = useState<FilterTab>("all");
  const [followed, setFollowed] = useState<Set<string>>(new Set());
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setTimeout(() => inputRef.current?.focus(), 80);
  }, []);

  // Save to recent on mount if query provided
  useEffect(() => {
    if (initialQuery.trim()) addToRecentSearches(initialQuery);
  }, [initialQuery]);

  // Current user as a searchable "person"
  const currentUserEntry = useMemo(
    () => ({
      id: user.deviceId || "local_user",
      username: user.username || "you",
      displayName: user.username || "You",
      followers: 0,
      xp: user.xp,
      streak: user.streak,
      solvedProblems: user.solvedProblems?.length ?? 0,
      badges: user.badges?.length ?? 0,
      avatarConfig: user.avatarConfig,
    }),
    [user],
  );

  const allPeople = useMemo(
    () => [currentUserEntry, ...PEER_USERS],
    [currentUserEntry],
  );

  const q = query.toLowerCase().trim();

  const filteredPeople = useMemo(() => {
    if (!q) return PEER_USERS.slice(0, 6);
    return allPeople.filter(
      (p) =>
        p.username.toLowerCase().includes(q) ||
        p.displayName.toLowerCase().includes(q),
    );
  }, [q, allPeople]);

  const filteredTopics = useMemo(() => {
    if (!q) return DOMAIN_TOPICS.slice(0, 5);
    return DOMAIN_TOPICS.filter(
      (t) =>
        t.name.toLowerCase().includes(q) ||
        t.domain.toLowerCase().includes(q) ||
        t.description.toLowerCase().includes(q),
    );
  }, [q]);

  const filteredProblems = useMemo(() => {
    if (!q) return CODING_PROBLEMS.slice(0, 5);
    return CODING_PROBLEMS.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.topic.toLowerCase().includes(q) ||
        p.tags.some((t) => t.toLowerCase().includes(q)) ||
        p.companies.some((c) => c.toLowerCase().includes(q)),
    ).slice(0, 20);
  }, [q]);

  const hasResults =
    filteredPeople.length > 0 ||
    filteredTopics.length > 0 ||
    filteredProblems.length > 0;

  const handleFollow = useCallback((id: string) => {
    setFollowed((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const handleSearch = (term: string) => {
    if (term.trim()) addToRecentSearches(term);
    setQuery(term);
  };

  const TABS: { id: FilterTab; label: string }[] = [
    { id: "all", label: "All" },
    { id: "people", label: "People" },
    { id: "topics", label: "Topics" },
    { id: "problems", label: "Problems" },
  ];

  const showPeople = activeTab === "all" || activeTab === "people";
  const showTopics = activeTab === "all" || activeTab === "topics";
  const showProblems = activeTab === "all" || activeTab === "problems";

  return (
    <div
      className="fixed inset-0 z-50 bg-background flex flex-col"
      data-ocid="search.page"
    >
      {/* Header */}
      <div className="bg-card border-b border-border px-3 py-2.5 flex items-center gap-2 shrink-0">
        <button
          type="button"
          data-ocid="search.close_button"
          aria-label="Back"
          onClick={onClose}
          className="w-9 h-9 rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors shrink-0"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="flex-1 flex items-center gap-2 bg-muted border border-input rounded-xl px-3 py-2 focus-within:border-primary/60 transition-colors">
          <Search className="w-4 h-4 text-muted-foreground shrink-0" />
          <input
            ref={inputRef}
            data-ocid="search.search_input"
            type="search"
            value={query}
            onChange={(e) => handleSearch(e.target.value)}
            onKeyDown={(e) => e.key === "Escape" && onClose()}
            placeholder="Search people, topics, problems..."
            className="flex-1 bg-transparent text-foreground placeholder:text-muted-foreground text-sm outline-none min-w-0"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery("")}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <span className="sr-only">Clear</span>×
            </button>
          )}
        </div>
      </div>

      {/* Filter tabs */}
      <div className="bg-card border-b border-border flex px-2 gap-1 shrink-0">
        {TABS.map((tab) => (
          <button
            type="button"
            key={tab.id}
            data-ocid={`search.${tab.id}.tab`}
            onClick={() => setActiveTab(tab.id)}
            className={`px-3 py-3 text-sm font-semibold relative transition-colors ${activeTab === tab.id ? "text-primary" : "text-muted-foreground hover:text-foreground"}`}
          >
            {tab.label}
            {activeTab === tab.id && (
              <motion.span
                layoutId="search-tab-indicator"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-t-full"
              />
            )}
          </button>
        ))}
      </div>

      {/* Results */}
      <div className="flex-1 overflow-y-auto">
        {/* No results */}
        {q && !hasResults && (
          <div
            className="flex flex-col items-center justify-center py-16 px-6 text-center"
            data-ocid="search.empty_state"
          >
            <Search className="w-12 h-12 text-muted-foreground/30 mb-4" />
            <p className="text-foreground font-semibold mb-1">
              No results for "{query}"
            </p>
            <p className="text-sm text-muted-foreground">
              Try searching for a username, topic, or problem title.
            </p>
          </div>
        )}

        <AnimatePresence initial={false}>
          {/* People */}
          {showPeople && filteredPeople.length > 0 && (
            <motion.section
              key="people"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              data-ocid="search.people.section"
            >
              <div className="px-4 py-2 bg-muted/30 border-b border-border">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                  <User2 className="w-3.5 h-3.5" />
                  People
                </p>
              </div>
              {filteredPeople.map((person, i) => (
                <PeopleRow
                  key={person.id}
                  person={person}
                  index={i}
                  isFollowing={followed.has(person.id)}
                  isCurrentUser={person.id === (user.deviceId || "local_user")}
                  onFollow={handleFollow}
                  onProfile={() => onNavigateToProfile(person.id)}
                />
              ))}
            </motion.section>
          )}

          {/* Topics */}
          {showTopics && filteredTopics.length > 0 && (
            <motion.section
              key="topics"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              data-ocid="search.topics.section"
            >
              <div className="px-4 py-2 bg-muted/30 border-b border-border">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5" />
                  Topics
                </p>
              </div>
              {filteredTopics.map((topic, i) => (
                <TopicRow
                  key={topic.id}
                  topic={topic}
                  index={i}
                  onOpen={onNavigateToRoadmap}
                />
              ))}
            </motion.section>
          )}

          {/* Problems */}
          {showProblems && filteredProblems.length > 0 && (
            <motion.section
              key="problems"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              data-ocid="search.problems.section"
            >
              <div className="px-4 py-2 bg-muted/30 border-b border-border">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                  <Code2 className="w-3.5 h-3.5" />
                  Problems
                </p>
              </div>
              {filteredProblems.slice(0, 10).map((problem, i) => (
                <ProblemRow
                  key={problem.id}
                  problem={problem}
                  index={i}
                  onOpen={onNavigateToProblems}
                />
              ))}
            </motion.section>
          )}
        </AnimatePresence>

        {/* Suggested users on empty state */}
        {!q && (
          <div className="p-4">
            <p className="text-sm font-semibold text-foreground mb-3 flex items-center gap-1.5">
              <Star className="w-4 h-4 text-primary" />
              Suggested users
            </p>
            <div className="space-y-1">
              {PEER_USERS.slice(0, 4).map((person, i) => (
                <PeopleRow
                  key={person.id}
                  person={person}
                  index={i}
                  isFollowing={followed.has(person.id)}
                  isCurrentUser={false}
                  onFollow={handleFollow}
                  onProfile={() => onNavigateToProfile(person.id)}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Sub-components ───────────────────────────────────────────────────────────

type PeerUser = Omit<(typeof PEER_USERS)[number], "avatarConfig"> & {
  avatarConfig?: Parameters<typeof WhatsAppAvatar>[0]["config"] | null;
};

function PeopleRow({
  person,
  index,
  isFollowing,
  isCurrentUser,
  onFollow,
  onProfile,
}: {
  person: PeerUser;
  index: number;
  isFollowing: boolean;
  isCurrentUser: boolean;
  onFollow: (id: string) => void;
  onProfile: () => void;
}) {
  return (
    <button
      type="button"
      data-ocid={`search.people.item.${index + 1}`}
      onClick={onProfile}
      className="w-full flex items-center gap-3 px-4 py-3 hover:bg-muted/50 transition-colors border-b border-border/30 text-left"
    >
      {/* Avatar */}
      <div className="w-11 h-11 rounded-full overflow-hidden border-2 border-border shrink-0">
        {person.avatarConfig ? (
          <WhatsAppAvatar
            config={
              person.avatarConfig as Parameters<
                typeof WhatsAppAvatar
              >[0]["config"]
            }
            size={44}
          />
        ) : (
          <div className="w-full h-full bg-primary/20 flex items-center justify-center text-primary font-bold text-base">
            {person.displayName[0]}
          </div>
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-foreground truncate">
          {person.displayName}
        </p>
        <p className="text-xs text-muted-foreground truncate">
          @{person.username} ·{" "}
          {person.followers > 0
            ? `${person.followers.toLocaleString()} followers`
            : "New member"}
        </p>
      </div>

      {/* Follow button */}
      {!isCurrentUser && (
        <Button
          variant={isFollowing ? "outline" : "default"}
          size="sm"
          data-ocid={`search.follow.button.${index + 1}`}
          onClick={(e) => {
            e.stopPropagation();
            onFollow(person.id);
          }}
          className="shrink-0 rounded-full text-xs h-8 px-3"
        >
          {isFollowing ? (
            "Following"
          ) : (
            <>
              <UserPlus className="w-3 h-3 mr-1" />
              Follow
            </>
          )}
        </Button>
      )}
      {isCurrentUser && (
        <Badge variant="outline" className="text-xs shrink-0">
          You
        </Badge>
      )}
    </button>
  );
}

type DomainTopic = (typeof DOMAIN_TOPICS)[number];

function TopicRow({
  topic,
  index,
  onOpen,
}: {
  topic: DomainTopic;
  index: number;
  onOpen: () => void;
}) {
  return (
    <button
      type="button"
      data-ocid={`search.topics.item.${index + 1}`}
      onClick={onOpen}
      className="w-full flex items-center gap-3 px-4 py-3 hover:bg-muted/50 transition-colors border-b border-border/30 text-left"
    >
      <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
        <BookOpen className="w-5 h-5 text-primary" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-foreground truncate">
          {topic.name}
        </p>
        <p className="text-xs text-muted-foreground truncate">
          {topic.domain} · {topic.description}
        </p>
      </div>
      <span
        className={`text-xs border rounded-full px-2 py-0.5 shrink-0 ${LEVEL_COLORS[topic.level] ?? ""}`}
      >
        {topic.level}
      </span>
    </button>
  );
}

type CodingProblem = {
  id: number;
  title: string;
  difficulty: "Easy" | "Medium" | "Hard";
  topic: string;
  tags: string[];
  companies: string[];
};

function ProblemRow({
  problem,
  index,
  onOpen,
}: {
  problem: CodingProblem;
  index: number;
  onOpen: () => void;
}) {
  return (
    <button
      type="button"
      data-ocid={`search.problems.item.${index + 1}`}
      onClick={onOpen}
      className="w-full flex items-center gap-3 px-4 py-3 hover:bg-muted/50 transition-colors border-b border-border/30 text-left"
    >
      <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center shrink-0">
        <Code2 className="w-5 h-5 text-muted-foreground" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-foreground truncate">
          {problem.title}
        </p>
        <div className="flex items-center gap-1.5 mt-0.5 flex-wrap">
          <span
            className={`text-xs font-medium ${DIFF_COLORS[problem.difficulty] ?? ""}`}
          >
            {problem.difficulty}
          </span>
          {problem.companies.slice(0, 2).map((c) => (
            <span
              key={c}
              className="text-xs text-muted-foreground bg-muted rounded-full px-1.5 py-0.5"
            >
              {c}
            </span>
          ))}
        </div>
      </div>
      <span className="text-xs text-muted-foreground shrink-0">
        #{problem.id}
      </span>
    </button>
  );
}
