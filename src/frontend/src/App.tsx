import { Toaster } from "@/components/ui/sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import LoveCallModal from "./components/LoveCallModal";
import { AppProvider, useApp } from "./context/AppContext";
import CodeVisualizationPage from "./pages/CodeVisualizationPage";
import CompilerPage from "./pages/CompilerPage";
import DashboardPage from "./pages/DashboardPage";
import DocumentationHub from "./pages/DocumentationHub";
import EventsPage from "./pages/EventsPage";
import LandingPage from "./pages/LandingPage";
import OnboardingPage from "./pages/OnboardingPage";
import PracticeProgramsPage from "./pages/PracticeProgramsPage";
import ProblemsPage from "./pages/ProblemsPage";
import SocialFeedPage from "./pages/SocialFeedPage";
import StudyApp from "./pages/StudyApp";
import UserProfilePage from "./pages/UserProfilePage";
import { clearToken, isAuthenticated, isTokenExpired } from "./utils/jwtAuth";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: 1, staleTime: 30_000 },
  },
});

const PROTECTED_PAGES = new Set([
  "study",
  "problems",
  "dashboard",
  "events",
  "code-visualizer",
  "compiler",
  "practice-programs",
  "documentation",
  "profile",
  "social-feed",
]);

function SessionExpiredBanner({ onDismiss }: { onDismiss: () => void }) {
  return (
    <div
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 py-2.5 bg-amber-500/90 backdrop-blur-sm text-white text-sm font-medium shadow-md"
      data-ocid="session.expired_banner"
    >
      <span>⚠️ Your session expired. Please sign in again.</span>
      <button
        type="button"
        onClick={onDismiss}
        className="ml-4 text-white/80 hover:text-white text-xs underline underline-offset-2"
        aria-label="Dismiss session expired notice"
      >
        Dismiss
      </button>
    </div>
  );
}

function AppRouter() {
  const { page, setPage, setUser } = useApp();
  const [showExpiredBanner, setShowExpiredBanner] = useState(false);

  useEffect(() => {
    if (PROTECTED_PAGES.has(page)) {
      if (isTokenExpired()) {
        clearToken();
        localStorage.removeItem("cc_user");
        setUser({ isOnboarded: false });
        setShowExpiredBanner(true);
        setPage("onboarding");
      } else if (!isAuthenticated()) {
        setPage("onboarding");
      }
    }
  }, [page, setPage, setUser]);

  return (
    <>
      {showExpiredBanner && (
        <SessionExpiredBanner onDismiss={() => setShowExpiredBanner(false)} />
      )}
      {page === "landing" && <LandingPage />}
      {page === "onboarding" && <OnboardingPage />}
      {page === "study" && <StudyApp />}
      {page === "problems" && <ProblemsPage />}
      {page === "dashboard" && <DashboardPage />}
      {page === "events" && <EventsPage />}
      {page === "code-visualizer" && <CodeVisualizationPage />}
      {page === "compiler" && <CompilerPage />}
      {page === "practice-programs" && <PracticeProgramsPage />}
      {page === "documentation" && (
        <DocumentationHub onBack={() => setPage("problems")} />
      )}
      {page === "profile" && <UserProfilePage />}
      {page === "social-feed" && <SocialFeedPage />}
      <LoveCallModal />
      <Toaster />
    </>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppProvider>
        <AppRouter />
      </AppProvider>
    </QueryClientProvider>
  );
}
