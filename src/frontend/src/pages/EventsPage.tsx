import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  ExternalLink,
  Info,
  MapPin,
  Trophy,
  Users,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";

type EventCategory =
  | "All"
  | "Hackathon"
  | "Contest"
  | "Conference"
  | "Workshop";

interface Event {
  id: number;
  name: string;
  organizer: string;
  dateRange: string;
  startDate: Date; // for sorting / "happening soon" detection
  location: string;
  category: Exclude<EventCategory, "All">;
  description: string;
  prize?: string;
  participants?: number;
  difficulty: "Beginner" | "Intermediate" | "Advanced" | "All Levels";
  hot: boolean;
  status: "Upcoming" | "Registration Open" | "Happening Soon";
  tags: string[];
  registerUrl: string;
}

// All events: May 2026 and later only
const EVENTS: Event[] = [
  {
    id: 1,
    name: "PyCon US 2026",
    organizer: "Python Software Foundation",
    dateRange: "May 15–23, 2026",
    startDate: new Date("2026-05-15"),
    location: "Pittsburgh, USA",
    category: "Conference",
    description:
      "The world's biggest Python community gathering — hundreds of talks, open space sessions, and sprints covering Python internals, data science, web development, and AI. An unmissable event for Pythonistas at every level.",
    prize: "Free (virtual) / Paid (in-person)",
    participants: 4000,
    difficulty: "All Levels",
    hot: true,
    status: "Registration Open",
    tags: ["Python", "Community", "USA", "Open Source"],
    registerUrl: "https://us.pycon.org/2026",
  },
  {
    id: 2,
    name: "VueConf 2026",
    organizer: "Vue.js Core Team",
    dateRange: "May 20–22, 2026",
    startDate: new Date("2026-05-20"),
    location: "Amsterdam, Netherlands",
    category: "Conference",
    description:
      "The official Vue.js conference featuring deep-dives into Vue 4, Vite, Nuxt, and the wider Composition API ecosystem. Keynotes from core contributors plus community workshops and networking.",
    prize: "Paid registration",
    participants: 1500,
    difficulty: "Intermediate",
    hot: false,
    status: "Registration Open",
    tags: ["Vue", "JavaScript", "Frontend", "Nuxt"],
    registerUrl: "https://vueconf.us",
  },
  {
    id: 3,
    name: "Microsoft Build 2026",
    organizer: "Microsoft",
    dateRange: "May 19–21, 2026",
    startDate: new Date("2026-05-19"),
    location: "Seattle, USA + Virtual",
    category: "Conference",
    description:
      "Microsoft's flagship developer conference showcasing the latest in Azure, AI Copilot, .NET, Windows, and open-source tooling. Hands-on labs, live keynotes, and thousands of breakout sessions for developers worldwide.",
    prize: "Free (virtual) / Paid (in-person)",
    participants: 80000,
    difficulty: "All Levels",
    hot: true,
    status: "Registration Open",
    tags: ["Microsoft", "Azure", "AI", ".NET", "Copilot"],
    registerUrl: "https://build.microsoft.com",
  },
  {
    id: 4,
    name: "React Summit 2026",
    organizer: "GitNation",
    dateRange: "Jun 12–16, 2026",
    startDate: new Date("2026-06-12"),
    location: "Amsterdam + Remote",
    category: "Conference",
    description:
      "The world's largest React conference, bringing together 10,000+ developers from 100+ countries to explore React 20, Server Components, Next.js, React Native, and the future of frontend architecture.",
    prize: "Paid registration",
    participants: 10000,
    difficulty: "Intermediate",
    hot: true,
    status: "Registration Open",
    tags: ["React", "JavaScript", "Next.js", "Frontend"],
    registerUrl: "https://reactsummit.com",
  },
  {
    id: 5,
    name: "Apple WWDC 2026",
    organizer: "Apple",
    dateRange: "Jun 8–12, 2026",
    startDate: new Date("2026-06-08"),
    location: "Cupertino, USA + Online",
    category: "Conference",
    description:
      "Apple's Worldwide Developers Conference reveals the future of iOS, macOS, visionOS, Swift, and Xcode. Hundreds of sessions, labs with Apple engineers, and hands-on opportunities for app developers.",
    prize: "Free online / Limited in-person tickets",
    participants: 50000,
    difficulty: "Intermediate",
    hot: true,
    status: "Registration Open",
    tags: ["Apple", "iOS", "Swift", "macOS", "visionOS"],
    registerUrl: "https://developer.apple.com/wwdc26",
  },
  {
    id: 6,
    name: "Google I/O Extended 2026",
    organizer: "Google Developer Groups",
    dateRange: "Jun–Aug 2026",
    startDate: new Date("2026-06-01"),
    location: "Worldwide (100+ cities)",
    category: "Conference",
    description:
      "Community-run extensions of Google I/O, organized by GDGs in 100+ cities. Covers the latest in Gemini AI, Android, Flutter, Web, and Firebase — great for networking with local developers.",
    prize: "Free entry",
    participants: 250000,
    difficulty: "All Levels",
    hot: true,
    status: "Upcoming",
    tags: ["Google", "AI", "Android", "Flutter", "GDG"],
    registerUrl: "https://gdg.community.dev",
  },
  {
    id: 7,
    name: "ICML 2026",
    organizer: "IMLS / International ML Society",
    dateRange: "Jul 13–19, 2026",
    startDate: new Date("2026-07-13"),
    location: "Vienna, Austria",
    category: "Conference",
    description:
      "International Conference on Machine Learning — the top-tier academic venue for ML research. Thousands of papers on deep learning, reinforcement learning, generative AI, fairness, and robustness. Workshops, tutorials, and poster sessions.",
    prize: "Paid registration",
    participants: 14000,
    difficulty: "Advanced",
    hot: true,
    status: "Registration Open",
    tags: ["ML", "Deep Learning", "AI", "Research", "Academia"],
    registerUrl: "https://icml.cc/2026",
  },
  {
    id: 8,
    name: "DEF CON 34",
    organizer: "DEF CON Communications",
    dateRange: "Aug 6–9, 2026",
    startDate: new Date("2026-08-06"),
    location: "Las Vegas, USA",
    category: "Conference",
    description:
      "One of the world's largest hacker conventions — villages, CTF competitions, talks on offensive/defensive security, AI hacking, hardware, and social engineering. A must-attend for cybersecurity professionals and enthusiasts.",
    prize: "Paid entry",
    participants: 35000,
    difficulty: "Advanced",
    hot: true,
    status: "Upcoming",
    tags: ["Security", "Hacking", "CTF", "Cybersecurity", "USA"],
    registerUrl: "https://defcon.org",
  },
  {
    id: 9,
    name: "BlackHat USA 2026",
    organizer: "BlackHat",
    dateRange: "Aug 1–6, 2026",
    startDate: new Date("2026-08-01"),
    location: "Las Vegas, USA",
    category: "Conference",
    description:
      "The premier cybersecurity conference for enterprise professionals — briefings on cutting-edge vulnerabilities, AI-driven attacks, zero-days, cloud security, and hands-on training courses from world-class security researchers.",
    prize: "Paid registration",
    participants: 20000,
    difficulty: "Advanced",
    hot: false,
    status: "Registration Open",
    tags: ["Security", "Enterprise", "Vulnerabilities", "AI", "Training"],
    registerUrl: "https://blackhat.com/us-26",
  },
  {
    id: 10,
    name: "MLconf 2026",
    organizer: "MLconf Organizing Team",
    dateRange: "Sep 10–11, 2026",
    startDate: new Date("2026-09-10"),
    location: "San Francisco, USA",
    category: "Conference",
    description:
      "A practitioner-focused ML conference connecting data scientists, ML engineers, and researchers. Sessions cover production ML systems, LLM fine-tuning, computer vision, and responsible AI.",
    prize: "Paid registration",
    participants: 2000,
    difficulty: "Intermediate",
    hot: false,
    status: "Upcoming",
    tags: ["ML", "Data Science", "LLM", "Production AI"],
    registerUrl: "https://mlconf.com",
  },
  {
    id: 11,
    name: "International JavaScript Conference 2026",
    organizer: "S&S Media Group",
    dateRange: "Sep 7–11, 2026",
    startDate: new Date("2026-09-07"),
    location: "Munich, Germany + Online",
    category: "Conference",
    description:
      "Europe's leading JavaScript conference — deep dives into TypeScript, Node.js, React, Vue, Angular, WebAssembly, and web performance. Workshops, talks, and networking across 4 days.",
    prize: "Paid registration",
    participants: 3000,
    difficulty: "Intermediate",
    hot: false,
    status: "Registration Open",
    tags: ["JavaScript", "TypeScript", "Node.js", "React", "Vue"],
    registerUrl: "https://javascript-conference.com",
  },
  {
    id: 12,
    name: "Angular Connect 2026",
    organizer: "Angular Core Team & GDE Network",
    dateRange: "Sep 24–25, 2026",
    startDate: new Date("2026-09-24"),
    location: "London, UK",
    category: "Conference",
    description:
      "The flagship Angular conference — sessions from core team members on Signals, new rendering models, Angular Universal, and enterprise-scale architecture. Attendees get early access to upcoming Angular features.",
    prize: "Paid registration",
    participants: 1200,
    difficulty: "Intermediate",
    hot: false,
    status: "Upcoming",
    tags: ["Angular", "TypeScript", "Frontend", "Enterprise"],
    registerUrl: "https://angularconnect.com",
  },
  {
    id: 13,
    name: "RustConf 2026",
    organizer: "Rust Foundation",
    dateRange: "Sep 18–19, 2026",
    startDate: new Date("2026-09-18"),
    location: "Portland, USA",
    category: "Conference",
    description:
      "The official Rust programming language conference — talks on async Rust, embedded systems, WebAssembly, game dev in Rust, and the evolving Cargo ecosystem. Community-driven and beginner-welcoming.",
    prize: "Paid registration",
    participants: 1500,
    difficulty: "Intermediate",
    hot: false,
    status: "Upcoming",
    tags: ["Rust", "Systems", "WebAssembly", "Open Source"],
    registerUrl: "https://rustconf.com",
  },
  {
    id: 14,
    name: "GitHub Universe 2026",
    organizer: "GitHub",
    dateRange: "Oct 14–15, 2026",
    startDate: new Date("2026-10-14"),
    location: "San Francisco, USA",
    category: "Conference",
    description:
      "GitHub's flagship annual developer conference covering AI-powered development with Copilot, DevSecOps, open source sustainability, and the future of software collaboration. Free virtual access available globally.",
    prize: "Free (virtual) / Paid (in-person)",
    participants: 45000,
    difficulty: "All Levels",
    hot: true,
    status: "Upcoming",
    tags: ["GitHub", "Copilot", "AI", "DevOps", "Open Source"],
    registerUrl: "https://githubuniverse.com",
  },
  {
    id: 15,
    name: "NodeConf 2026",
    organizer: "OpenJS Foundation",
    dateRange: "Oct 22–23, 2026",
    startDate: new Date("2026-10-22"),
    location: "Dublin, Ireland",
    category: "Conference",
    description:
      "The leading conference for the Node.js community — talks on performance, security, async patterns, Deno/Bun comparisons, edge computing with Node, and the latest in npm ecosystem tooling.",
    prize: "Paid registration",
    participants: 1000,
    difficulty: "Intermediate",
    hot: false,
    status: "Upcoming",
    tags: ["Node.js", "JavaScript", "Backend", "npm", "Edge"],
    registerUrl: "https://nodeconf.eu",
  },
  {
    id: 16,
    name: "Meta Connect 2026",
    organizer: "Meta",
    dateRange: "Oct 8–9, 2026",
    startDate: new Date("2026-10-08"),
    location: "Menlo Park, USA + Online",
    category: "Conference",
    description:
      "Meta's annual AR/VR developer event showcasing the future of the metaverse — new Quest hardware, Horizon OS updates, spatial computing developer tools, and AI integration into immersive experiences.",
    prize: "Free (online) / Invite (in-person)",
    participants: 30000,
    difficulty: "All Levels",
    hot: true,
    status: "Upcoming",
    tags: ["Meta", "AR/VR", "Metaverse", "Quest", "AI"],
    registerUrl: "https://metaconnect.com",
  },
  {
    id: 17,
    name: "KubeCon + CloudNativeCon 2026",
    organizer: "CNCF",
    dateRange: "Nov 10–13, 2026",
    startDate: new Date("2026-11-10"),
    location: "Chicago, USA",
    category: "Conference",
    description:
      "The Cloud Native Computing Foundation's flagship event — sessions on Kubernetes, service mesh, observability, GitOps, eBPF, WebAssembly, and platform engineering. The largest cloud-native gathering in the world.",
    prize: "Paid registration",
    participants: 12000,
    difficulty: "Intermediate",
    hot: true,
    status: "Upcoming",
    tags: ["Kubernetes", "Cloud Native", "DevOps", "CNCF", "Docker"],
    registerUrl:
      "https://events.linuxfoundation.org/kubecon-cloudnativecon-north-america",
  },
  {
    id: 18,
    name: "OpenAI DevDay 2026",
    organizer: "OpenAI",
    dateRange: "Nov 5, 2026",
    startDate: new Date("2026-11-05"),
    location: "San Francisco, USA",
    category: "Conference",
    description:
      "OpenAI's annual developer conference unveiling new model capabilities, API features, fine-tuning advances, and the roadmap for GPT-5 and beyond. A key event for AI application developers and researchers.",
    prize: "Free (selected registrants)",
    participants: 5000,
    difficulty: "Intermediate",
    hot: true,
    status: "Upcoming",
    tags: ["OpenAI", "GPT", "AI", "LLM", "Developer API"],
    registerUrl: "https://openai.com/devday",
  },
  {
    id: 19,
    name: "AWS re:Invent 2026",
    organizer: "Amazon Web Services",
    dateRange: "Dec 1–5, 2026",
    startDate: new Date("2026-12-01"),
    location: "Las Vegas, USA",
    category: "Conference",
    description:
      "The world's largest cloud computing conference — 60,000+ attendees, 2,000+ sessions, hands-on labs, certification exams, and major AWS service launches. Essential for cloud architects, developers, and DevOps engineers.",
    prize: "Paid registration",
    participants: 60000,
    difficulty: "Intermediate",
    hot: true,
    status: "Upcoming",
    tags: ["AWS", "Cloud", "Serverless", "DevOps", "AI"],
    registerUrl: "https://reinvent.awsevents.com",
  },
  {
    id: 20,
    name: "Smart India Hackathon 2026",
    organizer: "Government of India / AICTE",
    dateRange: "Aug–Sep 2026",
    startDate: new Date("2026-08-01"),
    location: "Pan India (Offline)",
    category: "Hackathon",
    description:
      "India's largest national hackathon where students solve real-world problem statements from government ministries. Categories span healthcare, agriculture, smart cities, and education. Winners receive ₹1 Lakh + internship opportunities.",
    prize: "₹1 Lakh per team + internships",
    participants: 600000,
    difficulty: "All Levels",
    hot: true,
    status: "Upcoming",
    tags: ["India", "Government", "AI", "Social Good"],
    registerUrl: "https://www.sih.gov.in",
  },
];

// Sort events by date ascending
const SORTED_EVENTS = [...EVENTS].sort(
  (a, b) => a.startDate.getTime() - b.startDate.getTime(),
);

const TODAY = new Date();
const THIRTY_DAYS = 30 * 24 * 60 * 60 * 1000;

function getDisplayStatus(event: Event): string {
  const diff = event.startDate.getTime() - TODAY.getTime();
  if (diff > 0 && diff <= THIRTY_DAYS) return "Happening Soon";
  return event.status;
}

const CATEGORY_STYLES: Record<string, string> = {
  Hackathon: "bg-purple-500/20 text-purple-300 border-purple-500/30",
  Contest: "bg-blue-500/20 text-blue-300 border-blue-500/30",
  Conference: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
  Workshop: "bg-orange-500/20 text-orange-300 border-orange-500/30",
};

const DIFFICULTY_STYLES: Record<string, string> = {
  Beginner: "bg-green-500/15 text-green-400",
  Intermediate: "bg-yellow-500/15 text-yellow-400",
  Advanced: "bg-red-500/15 text-red-400",
  "All Levels": "bg-muted text-muted-foreground",
};

const STATUS_STYLES: Record<string, string> = {
  Upcoming: "bg-blue-500/15 text-blue-300",
  "Registration Open": "bg-emerald-500/15 text-emerald-400",
  "Happening Soon": "bg-orange-500/15 text-orange-400",
};

const PAGE_SIZE = 8;

export default function EventsPage() {
  const [activeCategory, setActiveCategory] = useState<EventCategory>("All");
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

  const categories: EventCategory[] = [
    "All",
    "Hackathon",
    "Contest",
    "Conference",
    "Workshop",
  ];

  const filtered = SORTED_EVENTS.filter(
    (e) => activeCategory === "All" || e.category === activeCategory,
  );

  const visible = filtered.slice(0, visibleCount);
  const hasMore = visibleCount < filtered.length;

  const handleCategoryChange = (cat: EventCategory) => {
    setActiveCategory(cat);
    setVisibleCount(PAGE_SIZE);
  };

  return (
    <div className="flex-1 overflow-y-auto bg-background pb-24">
      <div className="max-w-2xl mx-auto w-full">
        {/* Header */}
        <div className="px-3 sm:px-4 pt-4 sm:pt-6 pb-3 sm:pb-4">
          <h2 className="text-lg sm:text-xl font-extrabold text-foreground">
            🎤 Events &amp; Opportunities
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            May 2026 onwards · {SORTED_EVENTS.length} upcoming events · sorted
            by date
          </p>
        </div>

        {/* Category Filters */}
        <div
          className="px-3 sm:px-4 pb-3 flex gap-2 overflow-x-auto"
          style={{ scrollbarWidth: "none" }}
        >
          {categories.map((cat) => (
            <button
              type="button"
              key={cat}
              data-ocid={`events.filter_${cat.toLowerCase().replace(/\s+/g, "_")}.tab`}
              onClick={() => handleCategoryChange(cat)}
              className={`px-3 sm:px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all border shrink-0 min-h-[36px] ${
                activeCategory === cat
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-muted text-muted-foreground border-border hover:border-primary/40"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Events List */}
        <div className="px-3 sm:px-4 pb-28 space-y-3">
          <AnimatePresence mode="popLayout">
            {visible.map((event, i) => {
              const displayStatus = getDisplayStatus(event);
              return (
                <motion.div
                  key={event.id}
                  layout
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.25, delay: i * 0.04 }}
                  data-ocid={`events.item.${i + 1}`}
                  className="bg-card border border-border rounded-2xl p-3 sm:p-4 relative overflow-hidden"
                >
                  {event.hot && (
                    <div className="absolute top-3 right-3">
                      <span className="text-xs bg-red-500/20 text-red-300 border border-red-500/30 px-2 py-0.5 rounded-full font-semibold">
                        🔥 Hot
                      </span>
                    </div>
                  )}

                  {/* Title + badges */}
                  <div className="flex items-start gap-2 mb-2">
                    <div
                      className={`flex-1 min-w-0 ${event.hot ? "pr-14" : "pr-0"}`}
                    >
                      <h3 className="font-bold text-foreground text-sm leading-tight mb-1.5">
                        {event.name}
                      </h3>
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span
                          className={`text-xs px-2 py-0.5 rounded-full border font-medium ${CATEGORY_STYLES[event.category] ?? "bg-muted text-muted-foreground border-border"}`}
                        >
                          {event.category}
                        </span>
                        <span
                          className={`text-xs px-2 py-0.5 rounded-full font-medium ${DIFFICULTY_STYLES[event.difficulty]}`}
                        >
                          {event.difficulty}
                        </span>
                        <span
                          className={`text-xs px-2 py-0.5 rounded-full font-medium ${STATUS_STYLES[displayStatus] ?? "bg-muted text-muted-foreground"}`}
                        >
                          {displayStatus}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Organizer + date + location */}
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground mb-2">
                    <span className="font-medium text-foreground/70">
                      {event.organizer}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3 shrink-0" />
                      {event.dateRange}
                    </span>
                    <span className="flex items-center gap-1 min-w-0">
                      <MapPin className="w-3 h-3 shrink-0" />
                      <span
                        className="truncate max-w-[140px] sm:max-w-[220px]"
                        title={event.location}
                      >
                        {event.location}
                      </span>
                    </span>
                    {event.participants && (
                      <span className="flex items-center gap-1">
                        <Users className="w-3 h-3 shrink-0" />
                        {event.participants >= 1000
                          ? `${Math.round(event.participants / 1000)}K+`
                          : event.participants}{" "}
                        participants
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-muted-foreground leading-relaxed mb-2.5">
                    {event.description}
                  </p>

                  {/* Tags */}
                  {event.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-3">
                      {event.tags.slice(0, 4).map((tag) => (
                        <span
                          key={tag}
                          className="text-xs px-1.5 py-0.5 rounded bg-muted text-muted-foreground"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Prize + action buttons */}
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    {event.prize ? (
                      <span className="text-xs font-medium text-primary flex items-center gap-1 min-w-0 flex-wrap">
                        <Trophy className="w-3 h-3 shrink-0" />
                        <span className="break-words">{event.prize}</span>
                      </span>
                    ) : (
                      <span />
                    )}
                    <div className="flex items-center gap-1.5 shrink-0 ml-auto">
                      <Button
                        size="sm"
                        variant="outline"
                        data-ocid={`events.learn_more.button.${i + 1}`}
                        className="h-7 text-xs rounded-full px-2.5 border-border hover:border-primary/40"
                        onClick={() => setSelectedEvent(event)}
                      >
                        <Info className="w-3 h-3 mr-1" /> Details
                      </Button>
                      <Button
                        size="sm"
                        data-ocid={`events.register.button.${i + 1}`}
                        className="h-7 text-xs rounded-full px-2.5 bg-primary text-primary-foreground hover:bg-primary/90"
                        onClick={() =>
                          window.open(
                            event.registerUrl,
                            "_blank",
                            "noopener,noreferrer",
                          )
                        }
                      >
                        <ExternalLink className="w-3 h-3 mr-1" /> Register
                      </Button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>

          {/* Load More */}
          {hasMore && (
            <div className="flex justify-center pt-2">
              <Button
                variant="outline"
                data-ocid="events.load_more_button"
                onClick={() => setVisibleCount((c) => c + PAGE_SIZE)}
                className="rounded-full gap-2 text-sm"
              >
                Load More Events ({filtered.length - visibleCount} more)
              </Button>
            </div>
          )}

          {/* Empty state */}
          {filtered.length === 0 && (
            <div className="text-center py-16" data-ocid="events.empty_state">
              <p className="text-4xl mb-3">🔍</p>
              <p className="text-muted-foreground text-sm">
                No events in this category yet.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Event Detail Modal */}
      <AnimatePresence>
        {selectedEvent && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-background/80 backdrop-blur-sm px-3 pb-safe-area-inset-bottom sm:pb-0"
            onClick={() => setSelectedEvent(null)}
            data-ocid="events.dialog"
          >
            <motion.div
              initial={{ y: 60, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 60, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="bg-card border border-border rounded-2xl p-5 w-full max-w-lg max-h-[85vh] overflow-y-auto mb-4 sm:mb-0"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal header */}
              <div className="flex items-start justify-between gap-3 mb-4">
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-foreground text-base leading-tight mb-2">
                    {selectedEvent.name}
                  </h3>
                  <div className="flex flex-wrap gap-1.5">
                    <Badge
                      className={`text-xs border ${CATEGORY_STYLES[selectedEvent.category]}`}
                    >
                      {selectedEvent.category}
                    </Badge>
                    <Badge
                      className={`text-xs ${DIFFICULTY_STYLES[selectedEvent.difficulty]}`}
                    >
                      {selectedEvent.difficulty}
                    </Badge>
                    <Badge
                      className={`text-xs ${STATUS_STYLES[getDisplayStatus(selectedEvent)] ?? "bg-muted text-muted-foreground"}`}
                    >
                      {getDisplayStatus(selectedEvent)}
                    </Badge>
                    {selectedEvent.hot && (
                      <Badge className="text-xs bg-red-500/20 text-red-300 border border-red-500/30">
                        🔥 Hot
                      </Badge>
                    )}
                  </div>
                </div>
                <button
                  type="button"
                  data-ocid="events.close_button"
                  onClick={() => setSelectedEvent(null)}
                  className="text-muted-foreground hover:text-foreground text-lg leading-none shrink-0 mt-0.5"
                  aria-label="Close"
                >
                  ✕
                </button>
              </div>

              {/* Event details */}
              <div className="space-y-3 text-sm">
                <div className="flex flex-col gap-1.5 text-muted-foreground">
                  <span className="flex items-start gap-2">
                    <span className="font-semibold text-foreground/80 w-20 shrink-0">
                      Organizer
                    </span>
                    <span>{selectedEvent.organizer}</span>
                  </span>
                  <span className="flex items-start gap-2">
                    <span className="font-semibold text-foreground/80 w-20 shrink-0">
                      Dates
                    </span>
                    <span>{selectedEvent.dateRange}</span>
                  </span>
                  <span className="flex items-start gap-2">
                    <span className="font-semibold text-foreground/80 w-20 shrink-0">
                      Location
                    </span>
                    <span className="break-words">
                      {selectedEvent.location}
                    </span>
                  </span>
                  {selectedEvent.prize && (
                    <span className="flex items-start gap-2">
                      <span className="font-semibold text-foreground/80 w-20 shrink-0">
                        Prize
                      </span>
                      <span className="text-primary font-medium break-words">
                        {selectedEvent.prize}
                      </span>
                    </span>
                  )}
                  {selectedEvent.participants && (
                    <span className="flex items-start gap-2">
                      <span className="font-semibold text-foreground/80 w-20 shrink-0">
                        Participants
                      </span>
                      <span>
                        {selectedEvent.participants >= 1000
                          ? `${Math.round(selectedEvent.participants / 1000)}K+`
                          : selectedEvent.participants}{" "}
                        expected
                      </span>
                    </span>
                  )}
                </div>

                <div className="border-t border-border pt-3">
                  <p className="text-muted-foreground leading-relaxed">
                    {selectedEvent.description}
                  </p>
                </div>

                {selectedEvent.tags.length > 0 && (
                  <div className="border-t border-border pt-3">
                    <div className="flex flex-wrap gap-1">
                      {selectedEvent.tags.map((tag) => (
                        <span
                          key={tag}
                          className="text-xs px-1.5 py-0.5 rounded bg-muted text-muted-foreground"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="flex gap-2 mt-4">
                <Button
                  variant="outline"
                  className="flex-1 rounded-full"
                  data-ocid="events.cancel_button"
                  onClick={() => setSelectedEvent(null)}
                >
                  Close
                </Button>
                <Button
                  className="flex-1 rounded-full gap-1.5"
                  data-ocid="events.confirm_button"
                  onClick={() => {
                    window.open(
                      selectedEvent.registerUrl,
                      "_blank",
                      "noopener,noreferrer",
                    );
                    setSelectedEvent(null);
                  }}
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  Register / Learn More
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
