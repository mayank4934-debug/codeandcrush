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
type EventStatus = "All" | "Upcoming" | "Ongoing" | "Past";

interface Event {
  id: number;
  name: string;
  organizer: string;
  dateRange: string;
  location: string;
  category: Exclude<EventCategory, "All">;
  description: string;
  prize?: string;
  participants?: number;
  difficulty: "Beginner" | "Intermediate" | "Advanced" | "All Levels";
  hot: boolean;
  status: "Upcoming" | "Ongoing" | "Past";
  tags: string[];
  registerUrl: string;
}

const EVENTS: Event[] = [
  {
    id: 1,
    name: "Google Summer of Code 2025",
    organizer: "Google",
    dateRange: "May – Aug 2025",
    location: "Remote (Global)",
    category: "Contest",
    description:
      "Google's flagship open source program where students contribute to real-world open source projects under the mentorship of experienced developers. Selected participants receive a stipend of $3,000–$6,600 based on project size. Ideal for students wanting to build their open source portfolio and network with Google engineers.",
    prize: "Stipend $3,000–$6,600",
    participants: 15000,
    difficulty: "Intermediate",
    hot: true,
    status: "Ongoing",
    tags: ["Google", "Open Source", "Mentorship", "Remote"],
    registerUrl: "https://summerofcode.withgoogle.com",
  },
  {
    id: 2,
    name: "Meta Hacker Cup 2025",
    organizer: "Meta",
    dateRange: "Jun – Oct 2025",
    location: "Remote (Global)",
    category: "Contest",
    description:
      "Meta's prestigious annual international programming competition featuring multiple elimination rounds from qualification to the onsite finals. Solve complex algorithmic problems competing against thousands of top coders worldwide. Top performers win cash prizes, exclusive Meta merchandise, and direct recognition from Meta engineers.",
    prize: "$20,000 prize pool",
    participants: 25000,
    difficulty: "Advanced",
    hot: true,
    status: "Upcoming",
    tags: ["Meta", "Algorithms", "Elimination Rounds", "DS"],
    registerUrl: "https://www.facebook.com/hackercup",
  },
  {
    id: 3,
    name: "ICPC World Finals 2025",
    organizer: "ICPC Foundation",
    dateRange: "Oct 2025",
    location: "Luxor, Egypt",
    category: "Contest",
    description:
      "The International Collegiate Programming Contest World Finals — the pinnacle of university-level competitive programming. Teams of three solve complex algorithmic problems under a 5-hour time limit. Top regional finalists from around the world compete for medals, cash prizes, and the most coveted title in competitive programming.",
    prize: "$15,000 + medals",
    participants: 50000,
    difficulty: "Advanced",
    hot: true,
    status: "Upcoming",
    tags: ["ICPC", "Algorithms", "University", "World Finals"],
    registerUrl: "https://icpc.global",
  },
  {
    id: 4,
    name: "ACM SIGKDD Data Mining Cup 2025",
    organizer: "ACM SIGKDD",
    dateRange: "Aug 2025",
    location: "Remote (Global)",
    category: "Contest",
    description:
      "One of the most prestigious data science competitions in academia, organized alongside the KDD Conference. Teams tackle real-world data mining and machine learning challenges submitted by industry sponsors. Winners receive cash prizes and publication recognition in the KDD proceedings.",
    prize: "$10,000 prize pool",
    participants: 5000,
    difficulty: "Advanced",
    hot: false,
    status: "Upcoming",
    tags: ["Data Science", "ML", "ACM", "Mining"],
    registerUrl: "https://www.kdd.org/kdd2025",
  },
  {
    id: 5,
    name: "GitHub Universe 2025",
    organizer: "GitHub",
    dateRange: "Oct 2025",
    location: "San Francisco, USA",
    category: "Conference",
    description:
      "GitHub's flagship annual developer conference bringing together tens of thousands of developers, maintainers, and open source enthusiasts. Sessions cover AI-powered development, GitHub Copilot advances, DevSecOps, and the future of software collaboration. Free virtual attendance option available globally.",
    prize: "Free (Virtual) / Paid (In-person)",
    participants: 40000,
    difficulty: "All Levels",
    hot: false,
    status: "Upcoming",
    tags: ["GitHub", "Copilot", "AI", "DevOps"],
    registerUrl: "https://githubuniverse.com",
  },
  {
    id: 6,
    name: "Google I/O Extended 2025",
    organizer: "Google Developer Groups",
    dateRange: "Jun – Aug 2025",
    location: "Worldwide (100+ cities)",
    category: "Conference",
    description:
      "Community-run extensions of the main Google I/O event, organized by Google Developer Groups across 100+ cities worldwide. Covers Google's latest announcements in AI (Gemini), Android, Flutter, Web, and Cloud. A great opportunity to network locally and watch live I/O sessions with fellow developers.",
    prize: "Free entry",
    participants: 200000,
    difficulty: "All Levels",
    hot: true,
    status: "Upcoming",
    tags: ["Google", "AI", "Android", "Flutter", "GDG"],
    registerUrl: "https://io.google/2025/program/",
  },
  {
    id: 7,
    name: "Smart India Hackathon 2025",
    organizer: "Government of India / AICTE",
    dateRange: "Aug – Sep 2025",
    location: "Pan India (Offline)",
    category: "Hackathon",
    description:
      "India's largest national hackathon where students solve real-world problem statements from government ministries and PSUs. Categories span healthcare, agriculture, smart cities, fintech, and education. Winners receive ₹1 Lakh per team, plus guaranteed internship opportunities with leading public sector organizations.",
    prize: "₹1 Lakh per team + internships",
    participants: 500000,
    difficulty: "All Levels",
    hot: true,
    status: "Upcoming",
    tags: ["India", "Government", "AI", "Social Good"],
    registerUrl: "https://www.sih.gov.in",
  },
  {
    id: 8,
    name: "HackerEarth FutureCode 2025",
    organizer: "HackerEarth",
    dateRange: "Jul 2025",
    location: "Remote (Global)",
    category: "Contest",
    description:
      "HackerEarth's annual flagship algorithm coding competition open to developers of all experience levels. Multiple rounds test data structures, dynamic programming, graphs, and number theory. Top rankers win cash prizes and get noticed by recruiters from 1000+ companies using HackerEarth for hiring.",
    prize: "$5,000 prize pool",
    participants: 50000,
    difficulty: "Intermediate",
    hot: false,
    status: "Upcoming",
    tags: ["HackerEarth", "Algorithms", "Hiring", "Global"],
    registerUrl: "https://www.hackerearth.com/challenges",
  },
  {
    id: 9,
    name: "Codeforces Round Series 2025",
    organizer: "Codeforces",
    dateRange: "Monthly May – Dec 2025",
    location: "Remote (Global)",
    category: "Contest",
    description:
      "Monthly rated competitive programming rounds on one of the world's top competitive programming platforms. Each round features 5–7 algorithmic problems with increasing difficulty. Contributes to your global Codeforces rating used by FAANG recruiters. Educational rounds include editorial explanations for every problem.",
    prize: "Free / Rating-based",
    difficulty: "All Levels",
    hot: false,
    status: "Ongoing",
    tags: ["Codeforces", "Competitive", "Rated", "Monthly"],
    registerUrl: "https://codeforces.com/contests",
  },
  {
    id: 10,
    name: "LeetCode Weekly Contest 2025",
    organizer: "LeetCode",
    dateRange: "Every Sunday, year-round",
    location: "Remote (Global)",
    category: "Contest",
    description:
      "Weekly timed contests with 4 problems across Easy, Medium, and Hard difficulty — the gold standard for FAANG interview prep. Compete globally every Sunday and build the speed and accuracy needed for technical interviews. Biweekly contests also available on alternate Saturdays.",
    prize: "Free / Global ranking",
    difficulty: "All Levels",
    hot: false,
    status: "Ongoing",
    tags: ["LeetCode", "FAANG Prep", "Weekly", "Interview"],
    registerUrl: "https://leetcode.com/contest",
  },
  {
    id: 11,
    name: "Devfolio Build with AI Hackathon 2025",
    organizer: "Devfolio",
    dateRange: "Jun 2025",
    location: "Remote (Global)",
    category: "Hackathon",
    description:
      "A premier online hackathon focused exclusively on AI/ML applications — from LLM-powered tools to computer vision and generative AI projects. Organized by Devfolio, India's largest hackathon platform. Open globally with dedicated tracks for student teams. Winning projects receive mentorship and startup network access.",
    prize: "$10,000 prize pool",
    participants: 10000,
    difficulty: "Intermediate",
    hot: true,
    status: "Upcoming",
    tags: ["AI", "ML", "LLM", "Devfolio", "India"],
    registerUrl: "https://devfolio.co",
  },
  {
    id: 12,
    name: "Microsoft Imagine Cup 2025",
    organizer: "Microsoft",
    dateRange: "Mar – May 2025",
    location: "Remote / Seattle, USA",
    category: "Hackathon",
    description:
      "Microsoft's flagship global student competition for technology-driven innovation. Teams build solutions using AI, cloud, mixed reality, and gaming to address the world's biggest challenges. The grand prize is $100,000, Azure cloud credits, and a mentoring session with Microsoft CEO Satya Nadella.",
    prize: "$100,000 Grand Prize",
    participants: 30000,
    difficulty: "Intermediate",
    hot: true,
    status: "Past",
    tags: ["Microsoft", "Innovation", "Azure", "AI", "Student"],
    registerUrl: "https://imaginecup.microsoft.com",
  },
  {
    id: 13,
    name: "AWS re:Invent 2025",
    organizer: "Amazon Web Services",
    dateRange: "Dec 2025",
    location: "Las Vegas, USA",
    category: "Conference",
    description:
      "The world's largest cloud computing conference hosted by AWS, bringing together 60,000+ developers, architects, and IT professionals. Features 2,000+ sessions, hands-on labs, certification exams, and announcements of major new AWS services. A must-attend event for cloud practitioners worldwide.",
    prize: "Paid registration",
    participants: 60000,
    difficulty: "Intermediate",
    hot: false,
    status: "Upcoming",
    tags: ["AWS", "Cloud", "Serverless", "DevOps", "AI"],
    registerUrl: "https://reinvent.awsevents.com",
  },
  {
    id: 14,
    name: "GitHub Copilot Hackathon 2025",
    organizer: "GitHub",
    dateRange: "Jul 2025",
    location: "Remote (Global)",
    category: "Hackathon",
    description:
      "GitHub's dedicated hackathon challenging developers to build innovative applications using GitHub Copilot AI coding assistant. Explore AI pair programming, code generation, and automation. Projects judged on creativity, technical depth, and practical impact. Great for exploring cutting-edge AI development tools.",
    prize: "$5,000 prize pool",
    participants: 5000,
    difficulty: "Intermediate",
    hot: true,
    status: "Upcoming",
    tags: ["GitHub", "Copilot", "AI Coding", "Automation"],
    registerUrl: "https://github.com/hackathons",
  },
  {
    id: 15,
    name: "CodeChef SnackDown 2025",
    organizer: "CodeChef",
    dateRange: "Sep – Nov 2025",
    location: "Remote (Global)",
    category: "Contest",
    description:
      "CodeChef's annual global team programming contest with two-person teams competing across multiple online rounds culminating in an onsite final. Problems span algorithms, data structures, mathematics, and combinatorics. One of the most popular team competitive programming events with a strong Indian developer community.",
    prize: "$10,000 prize pool",
    participants: 100000,
    difficulty: "Intermediate",
    hot: false,
    status: "Upcoming",
    tags: ["CodeChef", "Team Contest", "Competitive", "India"],
    registerUrl: "https://www.codechef.com/snackdown",
  },
  {
    id: 16,
    name: "Kaggle Competitions 2025",
    organizer: "Kaggle / Google",
    dateRange: "Ongoing 2025",
    location: "Remote (Global)",
    category: "Contest",
    description:
      "Kaggle hosts the world's leading data science and machine learning competitions, with new challenges launching monthly. Compete on real-world datasets across NLP, computer vision, tabular data, and time series. Prize pools regularly exceed $25,000, and top finishers earn Kaggle Grandmaster ranking.",
    prize: "$25,000+ per competition",
    participants: 300000,
    difficulty: "Intermediate",
    hot: false,
    status: "Ongoing",
    tags: ["Kaggle", "Data Science", "ML", "NLP", "CV"],
    registerUrl: "https://www.kaggle.com/competitions",
  },
  {
    id: 17,
    name: "MLH Global Hack Week 2025",
    organizer: "Major League Hacking",
    dateRange: "Monthly 2025",
    location: "Remote (Global)",
    category: "Hackathon",
    description:
      "MLH's monthly themed virtual hack weeks designed for students new to hackathons and open source. Each week focuses on a specific technology like Web3, AI, or open source tools. Low-pressure format with workshops, office hours, and beginner-friendly challenges — perfect for building your first projects.",
    prize: "Free / MLH swag",
    participants: 50000,
    difficulty: "Beginner",
    hot: false,
    status: "Ongoing",
    tags: ["MLH", "Student", "Beginner", "Monthly"],
    registerUrl: "https://ghw.mlh.io",
  },
  {
    id: 18,
    name: "HackMIT 2025",
    organizer: "MIT Students",
    dateRange: "Sep 2025",
    location: "Cambridge, USA",
    category: "Hackathon",
    description:
      "One of the most prestigious university hackathons in the United States, organized by MIT students and attended by 1000+ hackers from top universities globally. 24-hour build sprint with workshops from leading tech companies and $10,000+ in prizes across multiple tracks including hardware, AI, and social good.",
    prize: "$10,000+ prize pool",
    participants: 1000,
    difficulty: "Advanced",
    hot: true,
    status: "Upcoming",
    tags: ["MIT", "University", "USA", "AI", "Hardware"],
    registerUrl: "https://hackmit.org",
  },
  {
    id: 19,
    name: "PyCon US 2025",
    organizer: "Python Software Foundation",
    dateRange: "May 2025",
    location: "Pittsburgh, USA",
    category: "Conference",
    description:
      "The flagship annual conference for the Python programming language community. Features hundreds of talks, tutorials, and open space sessions covering Python internals, data science, web development, and community building. Also includes sprints for contributing to CPython and major Python packages.",
    prize: "Paid registration",
    participants: 3000,
    difficulty: "All Levels",
    hot: false,
    status: "Past",
    tags: ["Python", "Community", "USA", "Open Source"],
    registerUrl: "https://us.pycon.org/2025",
  },
  {
    id: 20,
    name: "AI for Good Hackathon 2025",
    organizer: "UN ITU / AI for Good",
    dateRange: "Jun 2025",
    location: "Remote (Global)",
    category: "Hackathon",
    description:
      "The United Nations ITU's prestigious AI hackathon challenging developers to use artificial intelligence for solving global challenges like climate change, healthcare access, education equity, and food security. Projects are mentored by UN AI experts and winning teams get the opportunity to present at the ITU AI for Good Global Summit.",
    prize: "$15,000 prize pool",
    participants: 8000,
    difficulty: "Intermediate",
    hot: true,
    status: "Upcoming",
    tags: ["AI", "UN", "Social Impact", "Climate", "Healthcare"],
    registerUrl: "https://aiforgood.itu.int",
  },
];

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
  Ongoing: "bg-emerald-500/15 text-emerald-400",
  Past: "bg-muted text-muted-foreground",
};

const PAGE_SIZE = 8;

export default function EventsPage() {
  const [activeCategory, setActiveCategory] = useState<EventCategory>("All");
  const [activeStatus, setActiveStatus] = useState<EventStatus>("All");
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

  const categories: EventCategory[] = [
    "All",
    "Hackathon",
    "Contest",
    "Conference",
    "Workshop",
  ];
  const statuses: EventStatus[] = ["All", "Upcoming", "Ongoing", "Past"];

  const filtered = EVENTS.filter((e) => {
    const catMatch = activeCategory === "All" || e.category === activeCategory;
    const statusMatch = activeStatus === "All" || e.status === activeStatus;
    return catMatch && statusMatch;
  });

  const visible = filtered.slice(0, visibleCount);
  const hasMore = visibleCount < filtered.length;

  const handleCategoryChange = (cat: EventCategory) => {
    setActiveCategory(cat);
    setVisibleCount(PAGE_SIZE);
  };

  const handleStatusChange = (status: EventStatus) => {
    setActiveStatus(status);
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
            2025–2026 hackathons, contests &amp; conferences · {EVENTS.length}{" "}
            events
          </p>
        </div>

        {/* Category Filters */}
        <div
          className="px-3 sm:px-4 pb-2 flex gap-2 overflow-x-auto"
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

        {/* Status Filters */}
        <div
          className="px-3 sm:px-4 pb-3 flex gap-2 overflow-x-auto"
          style={{ scrollbarWidth: "none" }}
        >
          {statuses.map((status) => (
            <button
              type="button"
              key={status}
              data-ocid={`events.status_${status.toLowerCase()}.tab`}
              onClick={() => handleStatusChange(status)}
              className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-all border shrink-0 min-h-[30px] ${
                activeStatus === status
                  ? "bg-accent text-accent-foreground border-primary/50"
                  : "bg-transparent text-muted-foreground border-border hover:border-border/80"
              }`}
            >
              {status}
            </button>
          ))}
        </div>

        {/* Events List */}
        <div className="px-3 sm:px-4 pb-28 space-y-3">
          <AnimatePresence mode="popLayout">
            {visible.map((event, i) => (
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
                        className={`text-xs px-2 py-0.5 rounded-full font-medium ${STATUS_STYLES[event.status]}`}
                      >
                        {event.status}
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
                    <Calendar className="w-3 h-3 shrink-0" /> {event.dateRange}
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
            ))}
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
                      className={`text-xs ${STATUS_STYLES[selectedEvent.status]}`}
                    >
                      {selectedEvent.status}
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
