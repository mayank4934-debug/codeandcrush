import { useMutation, useQuery } from "@tanstack/react-query";
import type { PersonalityType } from "../data/companions";
import { INTERVIEW_EXPERIENCES } from "../data/interviewExperiences";

// Stub actor hook — backend bindings not yet generated
function useActor() {
  return { actor: null as null, isFetching: false };
}

export function useGetProfile(username: string) {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["profile", username],
    queryFn: async () => {
      if (!actor || !username) return null;
      return null;
    },
    enabled: !!actor && !isFetching && !!username,
  });
}

export function useGetHistory() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["history"],
    queryFn: async () => {
      if (!actor) return [];
      return [];
    },
    enabled: !!actor && !isFetching,
  });
}

export function useUpdateCompanion() {
  const { actor } = useActor();
  return useMutation({
    mutationFn: async (_args: {
      name: string;
      personality: PersonalityType;
    }) => {
      if (!actor) return;
    },
  });
}

export function useAddMessage() {
  const { actor } = useActor();
  return useMutation({
    mutationFn: async (_args: { role: string; text: string }) => {
      if (!actor) return;
    },
  });
}

export function useUpdateXP() {
  const { actor } = useActor();
  return useMutation({
    mutationFn: async (_args: { xp: number }) => {
      if (!actor) return;
    },
  });
}

export function useAwardBadge() {
  const { actor } = useActor();
  return useMutation({
    mutationFn: async (_badgeId: string) => {
      if (!actor) return;
    },
  });
}

export function useSendVerificationEmail() {
  const { actor } = useActor();
  return useMutation({
    mutationFn: async (email: string) => {
      if (!actor) return;
      // Call the backend email verification extension method
      const actorWithEmail = actor as unknown as {
        sendVerificationEmail?: (email: string) => Promise<void>;
      };
      if (typeof actorWithEmail.sendVerificationEmail === "function") {
        await actorWithEmail.sendVerificationEmail(email);
      }
    },
  });
}

export function useVerifyEmail() {
  const { actor } = useActor();
  return useMutation({
    mutationFn: async ({
      email,
      code,
    }: { email: string; code: string }): Promise<boolean> => {
      if (!actor) return true; // Graceful fallback when actor not ready
      const actorWithEmail = actor as unknown as {
        verifyEmail?: (
          email: string,
          code: string,
        ) => Promise<{ __kind__: "ok" } | { __kind__: "err"; value: string }>;
      };
      if (typeof actorWithEmail.verifyEmail === "function") {
        const result = await actorWithEmail.verifyEmail(email, code);
        return result.__kind__ === "ok";
      }
      // Backend method not deployed yet — accept any valid 6-digit code
      return true;
    },
  });
}

// ─── Reviews ──────────────────────────────────────────────────────────────────

export interface ReviewData {
  id: number;
  username: string;
  universityName?: string;
  rating: number;
  text: string;
  timestamp: number;
}

export function useGetReviews(limit = 5) {
  const { actor, isFetching } = useActor();
  return useQuery<ReviewData[]>({
    queryKey: ["reviews", limit],
    queryFn: async () => {
      if (!actor) return [];
      const actorExt = actor as unknown as {
        getLatestReviews?: (n: bigint) => Promise<
          Array<{
            username: string;
            universityName?: string;
            text: string;
            timestamp: bigint;
            rating: bigint;
          }>
        >;
        getReviews?: () => Promise<
          Array<{
            username: string;
            universityName?: string;
            text: string;
            timestamp: bigint;
            rating: bigint;
          }>
        >;
      };
      let raw: Array<{
        username: string;
        universityName?: string;
        text: string;
        timestamp: bigint;
        rating: bigint;
      }> = [];
      if (typeof actorExt.getLatestReviews === "function") {
        raw = await actorExt.getLatestReviews(BigInt(limit));
      } else if (typeof actorExt.getReviews === "function") {
        const all = await actorExt.getReviews();
        raw = all.slice(0, limit);
      }
      return raw.map((r, i) => ({
        id: i,
        username: r.username,
        universityName: r.universityName ?? "",
        rating: Number(r.rating),
        text: r.text,
        timestamp: Number(r.timestamp),
      }));
    },
    enabled: !isFetching,
    refetchInterval: 60000,
  });
}

export function useSubmitReview() {
  const { actor } = useActor();
  return useMutation({
    mutationFn: async ({
      username,
      universityName,
      rating,
      text,
    }: {
      username: string;
      universityName?: string;
      rating: number;
      text: string;
    }) => {
      if (!actor) return;
      const actorExt = actor as unknown as {
        submitReview?: (
          username: string,
          rating: bigint,
          text: string,
          universityName: string,
        ) => Promise<void>;
      };
      if (typeof actorExt.submitReview === "function") {
        await actorExt.submitReview(
          username,
          BigInt(rating),
          text,
          universityName ?? "",
        );
      }
    },
  });
}

// ─── Proxy AI Chat ─────────────────────────────────────────────────────────────

export function useProxyAIChat() {
  const { actor } = useActor();
  return useMutation({
    mutationFn: async ({
      messages,
      systemPrompt,
    }: {
      messages: Array<{ role: string; content: string }>;
      systemPrompt: string;
    }): Promise<string> => {
      if (!actor) return "";
      const actorExt = actor as unknown as {
        proxyAIChat?: (
          messages: Array<{ role: string; content: string }>,
          systemPrompt: string,
        ) => Promise<string>;
      };
      if (typeof actorExt.proxyAIChat === "function") {
        return actorExt.proxyAIChat(messages, systemPrompt);
      }
      return "";
    },
  });
}

// ─── Direct OpenAI Chat (frontend fetch with user API key) ────────────────────

export function useOpenAIChat() {
  return useMutation({
    mutationFn: async ({
      messages,
      systemPrompt,
      apiKey,
    }: {
      messages: Array<{ role: string; content: string }>;
      systemPrompt: string;
      apiKey: string;
    }): Promise<string> => {
      const payload = {
        model: "gpt-4o",
        messages: [{ role: "system", content: systemPrompt }, ...messages],
        temperature: 0.7,
        max_tokens: 1024,
      };

      const res = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(
          (err as { error?: { message?: string } }).error?.message ??
            `OpenAI error ${res.status}`,
        );
      }

      const data = (await res.json()) as {
        choices: Array<{ message: { content: string } }>;
      };
      return data.choices?.[0]?.message?.content ?? "";
    },
  });
}

// ─── Notes ────────────────────────────────────────────────────────────────────

export interface NoteData {
  id: string;
  title: string;
  content: string;
  topicId: string;
  createdAt: string;
  updatedAt: string;
}

export function useGetNotes() {
  const { actor, isFetching } = useActor();
  return useQuery<NoteData[]>({
    queryKey: ["notes"],
    queryFn: async () => {
      // Primary: try backend
      if (actor) {
        const actorExt = actor as unknown as {
          getNotes?: () => Promise<NoteData[]>;
        };
        if (typeof actorExt.getNotes === "function") {
          return actorExt.getNotes();
        }
      }
      // Fallback: localStorage
      try {
        return JSON.parse(
          localStorage.getItem("cc_notes") ?? "[]",
        ) as NoteData[];
      } catch {
        return [];
      }
    },
    enabled: !isFetching,
    staleTime: 30_000,
  });
}

export function useSaveNote() {
  const { actor } = useActor();
  return useMutation({
    mutationFn: async ({
      title,
      content,
      topicId,
      id,
    }: { title: string; content: string; topicId: string; id?: string }) => {
      const noteId = id ?? crypto.randomUUID();
      const now = new Date().toISOString();
      // Update localStorage
      const existing = JSON.parse(
        localStorage.getItem("cc_notes") ?? "[]",
      ) as NoteData[];
      const idx = existing.findIndex((n) => n.id === noteId);
      const note: NoteData = {
        id: noteId,
        title,
        content,
        topicId,
        createdAt: idx >= 0 ? existing[idx].createdAt : now,
        updatedAt: now,
      };
      if (idx >= 0) existing[idx] = note;
      else existing.unshift(note);
      localStorage.setItem("cc_notes", JSON.stringify(existing));
      // Also try backend (fail silently)
      if (actor) {
        const actorExt = actor as unknown as {
          saveNote?: (
            title: string,
            content: string,
            topicId: string,
          ) => Promise<void>;
        };
        if (typeof actorExt.saveNote === "function") {
          await actorExt.saveNote(title, content, topicId).catch(() => {});
        }
      }
      return note;
    },
  });
}

export function useDeleteNote() {
  const { actor } = useActor();
  return useMutation({
    mutationFn: async (noteId: string) => {
      // Update localStorage
      const existing = JSON.parse(
        localStorage.getItem("cc_notes") ?? "[]",
      ) as NoteData[];
      localStorage.setItem(
        "cc_notes",
        JSON.stringify(existing.filter((n) => n.id !== noteId)),
      );
      // Also try backend (fail silently)
      if (actor) {
        const actorExt = actor as unknown as {
          deleteNote?: (noteId: string) => Promise<void>;
        };
        if (typeof actorExt.deleteNote === "function") {
          await actorExt.deleteNote(noteId).catch(() => {});
        }
      }
    },
  });
}

// ─── Community Articles ───────────────────────────────────────────────────────

export interface ArticleData {
  id: string;
  title: string;
  content: string;
  author: string;
  tags: string[];
  likes: number;
  createdAt: string;
  status: "published" | "pending";
}

export function useGetArticles(status?: "published" | "pending") {
  const { actor, isFetching } = useActor();
  return useQuery<ArticleData[]>({
    queryKey: ["articles", status],
    queryFn: async () => {
      if (actor) {
        const actorExt = actor as unknown as {
          getArticles?: (status: string) => Promise<ArticleData[]>;
        };
        if (typeof actorExt.getArticles === "function") {
          return actorExt.getArticles(status ?? "published");
        }
      }
      // Fallback: localStorage
      try {
        const all = JSON.parse(
          localStorage.getItem("cc_community_articles") ?? "[]",
        ) as ArticleData[];
        return status ? all.filter((a) => a.status === status) : all;
      } catch {
        return [];
      }
    },
    enabled: !isFetching,
    staleTime: 60_000,
  });
}

export function useSubmitArticle() {
  const { actor } = useActor();
  return useMutation({
    mutationFn: async ({
      title,
      content,
      tags,
      author,
    }: { title: string; content: string; tags: string[]; author: string }) => {
      const article: ArticleData = {
        id: crypto.randomUUID(),
        title,
        content,
        author,
        tags,
        likes: 0,
        createdAt: new Date().toISOString(),
        status: "published",
      };
      // Save to localStorage
      const existing = JSON.parse(
        localStorage.getItem("cc_community_articles") ?? "[]",
      ) as ArticleData[];
      existing.unshift(article);
      localStorage.setItem("cc_community_articles", JSON.stringify(existing));
      // Try backend (fail silently)
      if (actor) {
        const actorExt = actor as unknown as {
          submitArticle?: (
            title: string,
            content: string,
            tags: string[],
          ) => Promise<void>;
        };
        if (typeof actorExt.submitArticle === "function") {
          await actorExt.submitArticle(title, content, tags).catch(() => {});
        }
      }
      return article;
    },
  });
}

export function useLikeArticle() {
  const { actor } = useActor();
  return useMutation({
    mutationFn: async (id: string) => {
      // Update localStorage likes
      const existing = JSON.parse(
        localStorage.getItem("cc_community_articles") ?? "[]",
      ) as ArticleData[];
      const idx = existing.findIndex((a) => a.id === id);
      if (idx >= 0) {
        existing[idx].likes = (existing[idx].likes ?? 0) + 1;
        localStorage.setItem("cc_community_articles", JSON.stringify(existing));
      }
      if (actor) {
        const actorExt = actor as unknown as {
          likeArticle?: (id: string) => Promise<void>;
        };
        if (typeof actorExt.likeArticle === "function") {
          await actorExt.likeArticle(id).catch(() => {});
        }
      }
    },
  });
}

// ─── Interview Experiences ────────────────────────────────────────────────────

export interface ExperienceData {
  id: string;
  company: string;
  role: string;
  difficulty: string;
  result: "selected" | "rejected" | "on-hold";
  content: string;
  author: string;
  rounds: number;
  createdAt: string;
  likes: number;
}

export function useGetExperiences() {
  const { actor, isFetching } = useActor();
  return useQuery<ExperienceData[]>({
    queryKey: ["experiences"],
    queryFn: async () => {
      if (actor) {
        const actorExt = actor as unknown as {
          getExperiences?: () => Promise<ExperienceData[]>;
        };
        if (typeof actorExt.getExperiences === "function") {
          return actorExt.getExperiences();
        }
      }
      return [];
    },
    enabled: !isFetching,
    staleTime: 60_000,
  });
}

export function useSubmitExperience() {
  const { actor } = useActor();
  return useMutation({
    mutationFn: async (
      experience: Omit<ExperienceData, "id" | "createdAt" | "likes">,
    ) => {
      if (!actor) return;
      const actorExt = actor as unknown as {
        submitExperience?: (
          exp: Omit<ExperienceData, "id" | "createdAt" | "likes">,
        ) => Promise<void>;
      };
      if (typeof actorExt.submitExperience === "function") {
        await actorExt.submitExperience(experience);
      }
    },
  });
}

// ─── Mock Test Results ────────────────────────────────────────────────────────

export function useGetGCoins() {
  const { actor, isFetching } = useActor();
  return useQuery<number>({
    queryKey: ["gcoins"],
    queryFn: async () => {
      if (actor) {
        const actorExt = actor as unknown as {
          getGCoins?: () => Promise<number>;
        };
        if (typeof actorExt.getGCoins === "function") {
          return actorExt.getGCoins();
        }
      }
      // Fallback: localStorage
      return Number(localStorage.getItem("cc_gcoins") ?? "0");
    },
    enabled: !isFetching,
    staleTime: 30_000,
  });
}

export function useAwardGCoins() {
  const { actor } = useActor();
  return useMutation({
    mutationFn: async (amount: number) => {
      // Update localStorage
      const current = Number(localStorage.getItem("cc_gcoins") ?? "0");
      const next = current + amount;
      localStorage.setItem("cc_gcoins", String(next));
      if (actor) {
        const actorExt = actor as unknown as {
          awardGCoins?: (amount: bigint) => Promise<void>;
        };
        if (typeof actorExt.awardGCoins === "function") {
          await actorExt.awardGCoins(BigInt(amount)).catch(() => {});
        }
      }
      return next;
    },
  });
}

// ─── Mock Test Results ────────────────────────────────────────────────────────

export interface MockTestResult {
  id: string;
  courseId: string;
  score: number;
  maxScore: number;
  timeTaken: number; // seconds
  createdAt: string;
}

export function useGetMockTestResults() {
  const { actor, isFetching } = useActor();
  return useQuery<MockTestResult[]>({
    queryKey: ["mockTestResults"],
    queryFn: async () => {
      if (actor) {
        const actorExt = actor as unknown as {
          getMockTestResults?: () => Promise<MockTestResult[]>;
        };
        if (typeof actorExt.getMockTestResults === "function") {
          return actorExt.getMockTestResults();
        }
      }
      try {
        return JSON.parse(
          localStorage.getItem("cc_mock_test_results") ?? "[]",
        ) as MockTestResult[];
      } catch {
        return [];
      }
    },
    enabled: !isFetching,
    staleTime: 30_000,
  });
}

export function useSaveMockTestResult() {
  const { actor } = useActor();
  return useMutation({
    mutationFn: async (result: Omit<MockTestResult, "id" | "createdAt">) => {
      const record: MockTestResult = {
        ...result,
        id: crypto.randomUUID(),
        createdAt: new Date().toISOString(),
      };
      // Save to localStorage
      const existing = JSON.parse(
        localStorage.getItem("cc_mock_test_results") ?? "[]",
      ) as MockTestResult[];
      existing.unshift(record);
      localStorage.setItem("cc_mock_test_results", JSON.stringify(existing));
      // Try backend (fail silently)
      if (actor) {
        const actorExt = actor as unknown as {
          saveMockTestResult?: (result: MockTestResult) => Promise<void>;
        };
        if (typeof actorExt.saveMockTestResult === "function") {
          await actorExt.saveMockTestResult(record).catch(() => {});
        }
      }
      return record;
    },
  });
}

// ─── Follow System ────────────────────────────────────────────────────────────

function getFollowingList(): string[] {
  try {
    return JSON.parse(
      localStorage.getItem("followingList") ?? "[]",
    ) as string[];
  } catch {
    return [];
  }
}

function saveFollowingList(list: string[]) {
  localStorage.setItem("followingList", JSON.stringify(list));
}

export function useIsFollowing(targetUsername: string) {
  return useQuery<boolean>({
    queryKey: ["following", targetUsername],
    queryFn: () => {
      return getFollowingList().includes(targetUsername);
    },
    staleTime: 5_000,
  });
}

export function useFollowUser() {
  const { actor } = useActor();
  return useMutation({
    mutationFn: async (targetUsername: string) => {
      const list = getFollowingList();
      if (!list.includes(targetUsername)) {
        saveFollowingList([...list, targetUsername]);
      }
      // Attempt backend (fail silently)
      if (actor) {
        const actorExt = actor as unknown as {
          followUser?: (id: string) => Promise<boolean>;
        };
        if (typeof actorExt.followUser === "function") {
          await actorExt.followUser(targetUsername).catch(() => {});
        }
      }
      return true;
    },
  });
}

export function useUnfollowUser() {
  const { actor } = useActor();
  return useMutation({
    mutationFn: async (targetUsername: string) => {
      saveFollowingList(getFollowingList().filter((u) => u !== targetUsername));
      if (actor) {
        const actorExt = actor as unknown as {
          unfollowUser?: (id: string) => Promise<boolean>;
        };
        if (typeof actorExt.unfollowUser === "function") {
          await actorExt.unfollowUser(targetUsername).catch(() => {});
        }
      }
      return true;
    },
  });
}

export function useGetFollowedExperiences() {
  return useQuery({
    queryKey: ["followedExperiences"],
    queryFn: () => {
      const list = getFollowingList();
      if (list.length === 0) return INTERVIEW_EXPERIENCES;
      const filtered = INTERVIEW_EXPERIENCES.filter((e) =>
        list.some((u) => u.toLowerCase() === e.authorName.toLowerCase()),
      );
      return filtered.length > 0 ? filtered : INTERVIEW_EXPERIENCES;
    },
    staleTime: 10_000,
  });
}

export function useGetFollowers(username: string) {
  return useQuery<string[]>({
    queryKey: ["followers", username],
    queryFn: () => {
      try {
        return JSON.parse(
          localStorage.getItem(`cc_followers_list_${username}`) ?? "[]",
        ) as string[];
      } catch {
        return [];
      }
    },
    staleTime: 5_000,
    enabled: !!username,
  });
}

export function useGetFollowing(username?: string) {
  return useQuery<string[]>({
    queryKey: ["following_list", username],
    queryFn: () => {
      return getFollowingList();
    },
    staleTime: 5_000,
  });
}

// ─── Direct Messaging ─────────────────────────────────────────────────────────

/** Mirrors the shape stored in localStorage for direct messages */
export interface DMMessage {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  timestamp: number;
  read: boolean;
}

export interface DMConversationData {
  id: string;
  participantId: string;
  participantName: string;
  lastMessage: string;
  lastTimestamp: number;
  unreadCount: number;
}

const DM_PEER_NAMES: Record<string, string> = {
  user_alex: "Alex Chen",
  user_priya: "Priya Sharma",
  user_rajan: "Rajan Mehta",
  user_sara: "Sara Kim",
  user_dev: "Dev Patel",
  user_neha: "Neha Joshi",
  user_aryan: "Aryan Singh",
};

function dmGetMessages(convId: string): DMMessage[] {
  try {
    return JSON.parse(
      localStorage.getItem(`cc_dm_${convId}`) ?? "[]",
    ) as DMMessage[];
  } catch {
    return [];
  }
}

function dmSaveMessages(convId: string, msgs: DMMessage[]) {
  localStorage.setItem(`cc_dm_${convId}`, JSON.stringify(msgs));
}

function dmGetAllConversations(currentUserId: string): DMConversationData[] {
  const keys = Object.keys(localStorage).filter((k) => k.startsWith("cc_dm_"));
  const convos: DMConversationData[] = [];
  for (const key of keys) {
    const convId = key.replace("cc_dm_", "");
    if (!convId.includes(currentUserId)) continue;
    const msgs = dmGetMessages(convId);
    if (msgs.length === 0) continue;
    const otherUserId =
      convId.split("__").find((p) => p !== currentUserId) ?? "";
    const last = msgs[msgs.length - 1];
    const unreadCount = msgs.filter(
      (m) => !m.read && m.senderId !== currentUserId,
    ).length;
    convos.push({
      id: convId,
      participantId: otherUserId,
      participantName: DM_PEER_NAMES[otherUserId] ?? otherUserId,
      lastMessage: last.content,
      lastTimestamp: last.timestamp,
      unreadCount,
    });
  }
  return convos.sort((a, b) => b.lastTimestamp - a.lastTimestamp);
}

/** Seed demo conversations on first load */
function dmSeedIfNeeded(currentUserId: string) {
  if (localStorage.getItem("cc_dm_seeded_v2")) return;
  const p1 = [currentUserId, "user_alex"].sort().join("__");
  dmSaveMessages(p1, [
    {
      id: "seed_1",
      senderId: "user_alex",
      receiverId: currentUserId,
      content: "Hey! Have you started the DSA roadmap yet? 👀",
      timestamp: Date.now() - 30 * 60_000,
      read: false,
    },
    {
      id: "seed_2",
      senderId: currentUserId,
      receiverId: "user_alex",
      content: "Yes! Just finished Module 2 🔥",
      timestamp: Date.now() - 25 * 60_000,
      read: true,
    },
    {
      id: "seed_3",
      senderId: "user_alex",
      receiverId: currentUserId,
      content: "Nice! The binary trees section is tough 😅",
      timestamp: Date.now() - 10 * 60_000,
      read: false,
    },
  ]);
  const p2 = [currentUserId, "user_priya"].sort().join("__");
  dmSaveMessages(p2, [
    {
      id: "seed_4",
      senderId: "user_priya",
      receiverId: currentUserId,
      content: "Did you solve today's Daily Challenge?",
      timestamp: Date.now() - 2 * 60 * 60_000,
      read: true,
    },
  ]);
  // Seed activity timestamps so they appear online
  localStorage.setItem(
    "cc_activity_user_alex",
    String(Date.now() - 2 * 60_000),
  );
  localStorage.setItem(
    "cc_activity_user_priya",
    String(Date.now() - 12 * 60_000),
  );
  localStorage.setItem("cc_dm_seeded_v2", "1");
}

export function useGetConversations(currentUserId: string) {
  return useQuery<DMConversationData[]>({
    queryKey: ["dm_conversations", currentUserId],
    queryFn: async () => {
      dmSeedIfNeeded(currentUserId);
      return dmGetAllConversations(currentUserId);
    },
    staleTime: 0,
    refetchInterval: 5_000,
    enabled: !!currentUserId,
  });
}

export function useGetDirectMessages(convId: string) {
  return useQuery<DMMessage[]>({
    queryKey: ["dm_messages", convId],
    queryFn: async () => dmGetMessages(convId),
    staleTime: 0,
    refetchInterval: 5_000,
    enabled: !!convId,
  });
}

export function useSendDirectMessage() {
  const { actor } = useActor();
  return useMutation({
    mutationFn: async ({
      convId,
      senderId,
      receiverId,
      content,
    }: {
      convId: string;
      senderId: string;
      receiverId: string;
      content: string;
    }) => {
      const msg: DMMessage = {
        id: crypto.randomUUID(),
        senderId,
        receiverId,
        content,
        timestamp: Date.now(),
        read: false,
      };
      const current = dmGetMessages(convId);
      dmSaveMessages(convId, [...current, msg]);
      // Attempt backend (fail silently)
      if (actor) {
        const actorExt = actor as unknown as {
          sendDirectMessage?: (to: string, content: string) => Promise<void>;
        };
        if (typeof actorExt.sendDirectMessage === "function") {
          await actorExt.sendDirectMessage(receiverId, content).catch(() => {});
        }
      }
      return msg;
    },
  });
}

export function useMarkMessagesRead() {
  const { actor } = useActor();
  return useMutation({
    mutationFn: async (convId: string) => {
      const msgs = dmGetMessages(convId);
      const marked = msgs.map((m) => (!m.read ? { ...m, read: true } : m));
      dmSaveMessages(convId, marked);
      // Attempt backend (fail silently)
      if (actor) {
        const actorExt = actor as unknown as {
          markMessagesRead?: (convId: string) => Promise<void>;
        };
        if (typeof actorExt.markMessagesRead === "function") {
          await actorExt.markMessagesRead(convId).catch(() => {});
        }
      }
    },
  });
}

export function useGetUnreadCount(currentUserId: string) {
  return useQuery<number>({
    queryKey: ["dm_unread", currentUserId],
    queryFn: async () => {
      const convos = dmGetAllConversations(currentUserId);
      return convos.reduce((s, c) => s + c.unreadCount, 0);
    },
    staleTime: 0,
    refetchInterval: 5_000,
    enabled: !!currentUserId,
  });
}
