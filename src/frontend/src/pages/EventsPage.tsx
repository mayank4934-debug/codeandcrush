import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Info, MapPin, Trophy, Users } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";

type EventCategory = "All" | "Hackathon" | "Contest" | "Workshop";
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
}

const EVENTS: Event[] = [
  {
    id: 1,
    name: "Smart India Hackathon 2025",
    organizer: "Government of India / AICTE",
    dateRange: "Aug – Dec 2025",
    location: "Nationwide, India (Offline)",
    category: "Hackathon",
    description:
      "India's largest national hackathon where students solve real-world problem statements from government ministries and PSUs. Categories span healthcare, agriculture, smart cities, fintech, and education. Winners receive ₹1 Lakh per team plus guaranteed internship opportunities.",
    prize: "₹1 Lakh per team + internships",
    participants: 500000,
    difficulty: "All Levels",
    hot: true,
    status: "Upcoming",
    tags: ["India", "Government", "AI", "Social Good"],
  },
  {
    id: 2,
    name: "HackWithInfy 2025",
    organizer: "Infosys",
    dateRange: "Sep – Oct 2025",
    location: "Online (India Focus)",
    category: "Hackathon",
    description:
      "Infosys's flagship national hackathon open to engineering college students across India. Build innovative solutions using modern tech stacks. Shortlisted teams get to present at Infosys campuses and winners receive pre-placement offers.",
    prize: "PPO + Cash Prizes",
    participants: 80000,
    difficulty: "Intermediate",
    hot: true,
    status: "Upcoming",
    tags: ["Infosys", "India", "PPO", "Engineering"],
  },
  {
    id: 3,
    name: "Google Gemini API Developer Competition",
    organizer: "Google",
    dateRange: "Rolling 2025",
    location: "Online (Global)",
    category: "Hackathon",
    description:
      "Build innovative apps powered by Google's Gemini AI APIs. Showcase creative use of multimodal AI, reasoning, and code generation. Winners across categories receive cash prizes, Google credits, and recognition from Google engineers.",
    prize: "$1,000,000+ total prize pool",
    difficulty: "Intermediate",
    hot: true,
    status: "Ongoing",
    tags: ["Google", "AI", "Gemini", "API"],
  },
  {
    id: 4,
    name: "Microsoft Azure AI Hackathon 2025",
    organizer: "Microsoft",
    dateRange: "Q3–Q4 2025",
    location: "Online (Global)",
    category: "Hackathon",
    description:
      "Design and build intelligent solutions powered by Microsoft Azure AI services — from Copilot integrations to Azure OpenAI, Cognitive Services, and ML Studio. Open to all experience levels with dedicated tracks for students and professionals.",
    prize: "$50,000 + Azure credits",
    difficulty: "All Levels",
    hot: true,
    status: "Upcoming",
    tags: ["Microsoft", "Azure", "AI", "Cloud"],
  },
  {
    id: 5,
    name: "MLH Global Hackathon Series 2025–2026",
    organizer: "Major League Hacking",
    dateRange: "Monthly, 2025–2026",
    location: "Online + Global Cities",
    category: "Hackathon",
    description:
      "MLH's world-renowned hackathon series running monthly across 100+ universities and cities globally. Each event runs 24–48 hours and is open to students of all skill levels. Includes hardware hacks, AI tracks, and social good challenges.",
    prize: "Varies per event (up to $10K)",
    participants: 200000,
    difficulty: "All Levels",
    hot: false,
    status: "Ongoing",
    tags: ["MLH", "Student", "Global", "Monthly"],
  },
  {
    id: 6,
    name: "ETHIndia 2025",
    organizer: "ETHGlobal / Devfolio",
    dateRange: "Nov 2025",
    location: "Bengaluru, India",
    category: "Hackathon",
    description:
      "Asia's largest Ethereum hackathon bringing together builders, designers, and entrepreneurs to create the next generation of decentralized applications. 36-hour build sprint with workshops from leading Web3 protocols and $500K+ in prizes.",
    prize: "$500,000+ prize pool",
    participants: 3000,
    difficulty: "Intermediate",
    hot: true,
    status: "Upcoming",
    tags: ["Ethereum", "Web3", "DeFi", "India"],
  },
  {
    id: 7,
    name: "HackJaipur 2025",
    organizer: "HackJaipur Community",
    dateRange: "Aug 2025",
    location: "Jaipur, Rajasthan",
    category: "Hackathon",
    description:
      "Rajasthan's premier annual hackathon celebrating innovation in the Pink City. Students from across India converge for a 36-hour build marathon. Themes span FinTech, HealthTech, EdTech, and Smart City solutions with exciting sponsor tracks.",
    prize: "₹2 Lakh total prizes",
    participants: 1500,
    difficulty: "All Levels",
    hot: false,
    status: "Upcoming",
    tags: ["India", "Jaipur", "Student", "FinTech"],
  },
  {
    id: 8,
    name: "HackBMU 2025",
    organizer: "BML Munjal University",
    dateRange: "Oct 2025",
    location: "Online",
    category: "Hackathon",
    description:
      "BML Munjal University's flagship international hackathon attracting teams from 30+ countries. Build solutions for real-world challenges across sustainability, healthcare, and education. 48-hour sprint with mentorship from industry experts.",
    prize: "$5,000 + internship offers",
    participants: 5000,
    difficulty: "All Levels",
    hot: false,
    status: "Upcoming",
    tags: ["BML Munjal", "International", "Online"],
  },
  {
    id: 9,
    name: "CodeFest 2026 by IIT Kharagpur",
    organizer: "IIT Kharagpur",
    dateRange: "Feb 2026",
    location: "IIT Kharagpur, India",
    category: "Hackathon",
    description:
      "One of India's oldest and most prestigious tech fests hosted by IIT Kharagpur. CodeFest includes a 24-hour hackathon, competitive programming contests, and project expos. Draws over 10,000 participants from premier engineering institutes.",
    prize: "₹5 Lakh+ total prizes",
    participants: 10000,
    difficulty: "Advanced",
    hot: true,
    status: "Upcoming",
    tags: ["IIT", "India", "Prestigious", "Multi-event"],
  },
  {
    id: 10,
    name: "AngelHack Global Series 2025–2026",
    organizer: "AngelHack",
    dateRange: "Multiple dates, 2025–2026",
    location: "50+ Cities + Online",
    category: "Hackathon",
    description:
      "World's largest and most diverse hackathon community with events across 50+ cities. Build real startups and get access to AngelHack's global network of investors and accelerators. Top teams advance to the Global Demo Day for investor pitches.",
    prize: "$100K+ + investor access",
    participants: 300000,
    difficulty: "All Levels",
    hot: false,
    status: "Ongoing",
    tags: ["Startup", "Global", "Investors", "Demo Day"],
  },
  {
    id: 11,
    name: "ICPC Regional Contests 2025–26",
    organizer: "ICPC Foundation",
    dateRange: "Oct 2025 – Feb 2026",
    location: "Multiple Sites, Worldwide",
    category: "Contest",
    description:
      "The International Collegiate Programming Contest — the world's most prestigious university-level programming competition. Teams of 3 solve complex algorithmic problems under 5-hour time pressure. Top regional teams advance to the World Finals.",
    prize: "World Finals qualification + medals",
    participants: 50000,
    difficulty: "Advanced",
    hot: true,
    status: "Upcoming",
    tags: ["ICPC", "Algorithms", "University", "World Finals"],
  },
  {
    id: 12,
    name: "Google Code Jam 2025",
    organizer: "Google",
    dateRange: "Apr – May 2025",
    location: "Online (Global)",
    category: "Contest",
    description:
      "Google's iconic annual algorithmic coding competition with multiple rounds of increasing difficulty. Thousands of coders compete to earn a coveted spot at the finals. Top finishers receive cash prizes and a chance to interview at Google.",
    prize: "Cash prizes + Google interviews",
    participants: 30000,
    difficulty: "Advanced",
    hot: true,
    status: "Past",
    tags: ["Google", "Algorithms", "Competitive Programming"],
  },
  {
    id: 13,
    name: "Facebook Hacker Cup 2025",
    organizer: "Meta",
    dateRange: "Aug – Nov 2025",
    location: "Online (Global)",
    category: "Contest",
    description:
      "Meta's annual international programming competition with multiple elimination rounds. Solve complex algorithmic problems competing with top coders worldwide. Top performers receive cash prizes, Meta merchandise, and recognition from Meta engineers.",
    prize: "Cash prizes + Meta merch",
    participants: 25000,
    difficulty: "Advanced",
    hot: true,
    status: "Upcoming",
    tags: ["Meta", "Algorithms", "Elimination Rounds"],
  },
  {
    id: 14,
    name: "Codeforces Educational Rounds 2025–26",
    organizer: "Codeforces",
    dateRange: "Monthly, ongoing",
    location: "Online",
    category: "Contest",
    description:
      "Monthly educational-style competitive programming rounds designed to teach algorithms and problem-solving patterns. Each round features 7 problems with editorial explanations. Rated rounds contribute to global Codeforces ranking.",
    prize: "Rating + editorial insights",
    difficulty: "Intermediate",
    hot: false,
    status: "Ongoing",
    tags: ["Codeforces", "Educational", "Rated", "Monthly"],
  },
  {
    id: 15,
    name: "LeetCode Weekly Contests 2025–26",
    organizer: "LeetCode",
    dateRange: "Every Sunday, ongoing",
    location: "Online",
    category: "Contest",
    description:
      "Weekly timed contests with 4 problems across Easy, Medium, and Hard difficulty. Crucial for building problem-solving speed for technical interviews at FAANG. Consistency is key to climbing the global leaderboard and improving your rating.",
    prize: "LeetCoins + global ranking",
    difficulty: "All Levels",
    hot: false,
    status: "Ongoing",
    tags: ["LeetCode", "FAANG Prep", "Weekly", "Interview"],
  },
  {
    id: 16,
    name: "CodeChef Long Challenge 2025–26",
    organizer: "CodeChef",
    dateRange: "Monthly, ongoing",
    location: "Online",
    category: "Contest",
    description:
      "CodeChef's monthly 10-day long challenge featuring problems across mathematics, data structures, and algorithms. The extended duration makes it suitable for deep problem exploration and practice for beginners through advanced coders.",
    prize: "Cash prizes + certificates",
    difficulty: "Beginner",
    hot: false,
    status: "Ongoing",
    tags: ["CodeChef", "Monthly", "Beginner-Friendly"],
  },
  {
    id: 17,
    name: "HackerRank Week of Code 2025–26",
    organizer: "HackerRank",
    dateRange: "Quarterly, 2025–2026",
    location: "Online",
    category: "Contest",
    description:
      "HackerRank's quarterly programming contest running over 7 days. Features a series of problems that gradually increase in difficulty, covering algorithms, data structures, AI, and functional programming. Great for building stamina.",
    prize: "Cash prizes + job interviews",
    difficulty: "Intermediate",
    hot: false,
    status: "Upcoming",
    tags: ["HackerRank", "Week-long", "Multi-topic"],
  },
  {
    id: 18,
    name: "AtCoder Regular Contest 2025–26",
    organizer: "AtCoder",
    dateRange: "Biweekly, ongoing",
    location: "Online",
    category: "Contest",
    description:
      "AtCoder's bi-weekly rated competition featuring 6 problems testing advanced algorithmic thinking. Popular among competitive programmers seeking to improve their mathematical problem-solving and dynamic programming skills.",
    prize: "Global rating + recognition",
    difficulty: "Advanced",
    hot: false,
    status: "Ongoing",
    tags: ["AtCoder", "Japanese", "Biweekly", "Rated"],
  },
  {
    id: 19,
    name: "CS50x Puzzle Day 2025",
    organizer: "Harvard / CS50",
    dateRange: "Apr 2025",
    location: "Online (Global)",
    category: "Contest",
    description:
      "Harvard's CS50 annual puzzle-solving event open to everyone — no programming experience required. Teams of up to 4 solve logic puzzles and cryptic challenges. A fun, social event introducing newcomers to computer science concepts.",
    prize: "CS50 certificates + swag",
    participants: 20000,
    difficulty: "Beginner",
    hot: false,
    status: "Past",
    tags: ["Harvard", "CS50", "Beginner", "Puzzles"],
  },
  {
    id: 20,
    name: "TechGig Code Gladiators 2025",
    organizer: "TechGig / Times Internet",
    dateRange: "May – Aug 2025",
    location: "Online (India)",
    category: "Contest",
    description:
      "India's largest coding contest with 300,000+ developers competing across multiple rounds. Tests skills in Java, Python, C++, and more. Industry-recognized contest with direct placement opportunities at top Indian tech firms.",
    prize: "₹20 Lakh total + placement",
    participants: 300000,
    difficulty: "Intermediate",
    hot: true,
    status: "Ongoing",
    tags: ["India", "TechGig", "Placement", "Large-scale"],
  },
  {
    id: 21,
    name: "AI/ML Workshop Series — Google Developers",
    organizer: "Google Developer Groups",
    dateRange: "Monthly, 2025–2026",
    location: "Online + City Chapters",
    category: "Workshop",
    description:
      "Google Developer Groups' monthly workshop series covering practical machine learning, TensorFlow, Keras, and Vertex AI. Hands-on labs, codelabs, and study jams guide you from ML basics to production model deployment on Google Cloud.",
    prize: "Google Cloud credits + certification",
    difficulty: "Beginner",
    hot: false,
    status: "Ongoing",
    tags: ["Google", "ML", "TensorFlow", "GDG"],
  },
  {
    id: 22,
    name: "AWS re:Invent Build-on Workshop 2025",
    organizer: "Amazon Web Services",
    dateRange: "Dec 2025",
    location: "Las Vegas + Online",
    category: "Workshop",
    description:
      "AWS re:Invent's flagship hands-on workshop track covering serverless, containers, generative AI, and DevOps on AWS. Build real cloud architectures with expert AWS developers. Access to deep-dive labs not available anywhere else.",
    prize: "AWS credits + certification vouchers",
    participants: 50000,
    difficulty: "Intermediate",
    hot: true,
    status: "Upcoming",
    tags: ["AWS", "Cloud", "Serverless", "DevOps"],
  },
  {
    id: 23,
    name: "Web Dev Bootcamp — freeCodeCamp 2025",
    organizer: "freeCodeCamp",
    dateRange: "Rolling 2025",
    location: "Online (Global)",
    category: "Workshop",
    description:
      "freeCodeCamp's structured bootcamp-style workshop series covering full stack web development — HTML/CSS, JavaScript, React, Node.js, and databases. 100% free with certifications upon completion. Join a global community of learners.",
    prize: "Free certifications",
    participants: 1000000,
    difficulty: "Beginner",
    hot: false,
    status: "Ongoing",
    tags: ["freeCodeCamp", "Web Dev", "Free", "Certificate"],
  },
  {
    id: 24,
    name: "Blockchain Fundamentals Workshop — Ethereum.org",
    organizer: "Ethereum Foundation",
    dateRange: "Q2–Q3 2025",
    location: "Online",
    category: "Workshop",
    description:
      "Ethereum Foundation's official workshop series for developers entering Web3. Covers Solidity basics, smart contract development, ERC standards, and DApp deployment. Hands-on coding exercises with Hardhat and Foundry toolchains.",
    prize: "POAP badges + community recognition",
    difficulty: "Beginner",
    hot: false,
    status: "Upcoming",
    tags: ["Ethereum", "Solidity", "Web3", "Beginner"],
  },
];

const CATEGORY_STYLES: Record<string, string> = {
  Hackathon: "bg-blue-500/20 text-blue-300 border-blue-500/30",
  Contest: "bg-amber-500/20 text-amber-300 border-amber-500/30",
  Workshop: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
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
            2025–2026 hackathons, contests &amp; workshops · {EVENTS.length}{" "}
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
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3 shrink-0" />
                    <span className="truncate max-w-[160px] sm:max-w-none">
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

                {/* Prize + action */}
                <div className="flex items-center justify-between gap-2">
                  {event.prize ? (
                    <span className="text-xs font-semibold text-primary flex items-center gap-1 truncate">
                      <Trophy className="w-3 h-3 shrink-0" /> {event.prize}
                    </span>
                  ) : (
                    <span />
                  )}
                  <Button
                    size="sm"
                    variant="outline"
                    data-ocid={`events.register.button.${i + 1}`}
                    className="h-8 text-xs rounded-full px-3 shrink-0 border-primary/40 text-primary hover:bg-primary hover:text-primary-foreground"
                    onClick={() => setSelectedEvent(event)}
                  >
                    <Info className="w-3 h-3 mr-1" /> Learn More
                  </Button>
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
                Load More Events ({filtered.length - visibleCount} more events)
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
                  <span className="flex items-center gap-2">
                    <span className="font-semibold text-foreground/80 w-20 shrink-0">
                      Organizer
                    </span>
                    {selectedEvent.organizer}
                  </span>
                  <span className="flex items-center gap-2">
                    <span className="font-semibold text-foreground/80 w-20 shrink-0">
                      Dates
                    </span>
                    {selectedEvent.dateRange}
                  </span>
                  <span className="flex items-center gap-2">
                    <span className="font-semibold text-foreground/80 w-20 shrink-0">
                      Location
                    </span>
                    {selectedEvent.location}
                  </span>
                  {selectedEvent.prize && (
                    <span className="flex items-center gap-2">
                      <span className="font-semibold text-foreground/80 w-20 shrink-0">
                        Prize
                      </span>
                      <span className="text-primary font-medium">
                        {selectedEvent.prize}
                      </span>
                    </span>
                  )}
                </div>

                <div className="border-t border-border pt-3">
                  <p className="text-muted-foreground leading-relaxed">
                    {selectedEvent.description}
                  </p>
                </div>

                <div className="border-t border-border pt-3">
                  <p className="text-xs text-muted-foreground italic">
                    💡 Search for "{selectedEvent.name}" on the web or check the
                    organizer's official website to register or learn more.
                  </p>
                </div>
              </div>

              <Button
                className="w-full mt-4 rounded-full"
                data-ocid="events.confirm_button"
                onClick={() => setSelectedEvent(null)}
              >
                Got it
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
