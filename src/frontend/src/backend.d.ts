import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export type VerifyResult = {
    __kind__: "ok";
    ok: null;
} | {
    __kind__: "err";
    err: string;
};
export interface Review {
    id: string;
    universityName: string;
    username: string;
    text: string;
    timestamp: Timestamp;
    rating: bigint;
}
export type Timestamp = bigint;
export interface ProgressReport {
    xp: bigint;
    username: string;
    badges: Array<string>;
    quizzesPassedCount: bigint;
    streakDays: bigint;
    level: bigint;
    completedTopicsCount: bigint;
    enrolledCourses: Array<string>;
}
export interface MockTestResult {
    id: string;
    completedAt: Timestamp;
    timeSpentSecs: bigint;
    maxScore: bigint;
    domain: string;
    userId: Principal;
    answers: Array<bigint>;
    score: bigint;
    totalQuestions: bigint;
    timestamp: bigint;
    timeTaken: bigint;
    testId: string;
    percentage: number;
}
export interface Reaction {
    messageId: string;
    userId: Principal;
    emoji: string;
    timestamp: Timestamp;
}
export interface Story {
    id: string;
    expiresAt: Timestamp;
    viewerIds: Array<Principal>;
    authorId: Principal;
    createdAt: Timestamp;
    mediaUrl: string;
    viewCount: bigint;
    caption?: string;
    mediaType: string;
}
export type EnrollResult = {
    __kind__: "ok";
    ok: null;
} | {
    __kind__: "err";
    err: string;
};
export interface DirectMessage {
    id: string;
    content: string;
    read: boolean;
    receiverId: Principal;
    timestamp: Timestamp;
    senderId: Principal;
}
export interface Conversation {
    participants: Array<Principal>;
    lastMessage: DirectMessage;
    unreadCount: bigint;
}
export interface ChallengeView {
    id: string;
    status: string;
    expiresAt: Timestamp;
    createdAt: Timestamp;
    challengeeScore?: bigint;
    quizTopic: string;
    challengerScore: bigint;
    quizId: string;
    challengee: string;
    challenger: string;
}
export interface Article {
    id: string;
    status: string;
    title: string;
    content: string;
    views: bigint;
    authorId: Principal;
    createdAt: Timestamp;
    tags: Array<string>;
    authorName: string;
    likes: bigint;
    dislikes: bigint;
}
export interface AIChatMessage {
    content: string;
    role: string;
}
export interface HttpHeader {
    value: string;
    name: string;
}
export interface Experience {
    id: string;
    difficulty: string;
    createdAt: Timestamp;
    role: string;
    authorName: string;
    company: string;
    experienceText: string;
}
export interface HttpResponse {
    body: Uint8Array;
    headers: Array<HttpHeader>;
    status_code: number;
}
export interface Message {
    role: string;
    text: string;
    timestamp: bigint;
}
export type CourseId = string;
export interface Question {
    topic: string;
    correctIndex: bigint;
    xpReward: bigint;
    answers: Array<string>;
    difficulty: bigint;
    text: string;
}
export interface HttpRequest {
    url: string;
    method: string;
    body: Uint8Array;
    headers: Array<HttpHeader>;
}
export interface UserProfile {
    xp: bigint;
    personality: Personality;
    username: string;
    messagesSent: bigint;
    badges: Array<string>;
    streakDays: bigint;
    level: bigint;
    burnoutScore: bigint;
    lastActive: bigint;
    completedTopics: Array<string>;
    companionName: string;
}
export interface Note {
    id: string;
    title: string;
    content: string;
    userId: Principal;
    createdAt: Timestamp;
    updatedAt: Timestamp;
    topicId: string;
}
export enum MessageStatus {
    read = "read",
    sent = "sent",
    delivered = "delivered"
}
export enum Personality {
    calm = "calm",
    playful = "playful",
    encouraging = "encouraging",
    witty = "witty"
}
export interface backendInterface {
    addMessage(role: string, text: string): Promise<void>;
    addReaction(messageId: string, emoji: string): Promise<void>;
    addSampleQuestions(): Promise<void>;
    awardBadge(badgeId: string): Promise<void>;
    awardGCoins(amount: bigint): Promise<bigint>;
    checkSeasonalMilestone(domain: string, moduleIndex: bigint): Promise<string | null>;
    completeTopic(topicId: string): Promise<void>;
    createStory(mediaUrl: string, mediaType: string, caption: string | null): Promise<Story>;
    deleteNote(noteId: string): Promise<boolean>;
    deleteStory(storyId: string): Promise<void>;
    dislikeArticle(id: string): Promise<boolean>;
    enrollCourse(courseId: string): Promise<EnrollResult>;
    followUser(targetId: string): Promise<boolean>;
    getActiveChallenges(): Promise<Array<ChallengeView>>;
    getActiveStories(): Promise<Array<Story>>;
    getAllStats(): Promise<UserProfile>;
    getAllTestResults(): Promise<Array<MockTestResult>>;
    getArticles(status: string): Promise<Array<Article>>;
    getChallengeById(id: string): Promise<ChallengeView | null>;
    getChallengeHistory(): Promise<Array<ChallengeView>>;
    getConversations(): Promise<Array<Conversation>>;
    getDomainTestResults(domain: string): Promise<Array<MockTestResult>>;
    getEnrolledCourses(): Promise<Array<CourseId>>;
    getExperiences(): Promise<Array<Experience>>;
    getGCoins(): Promise<bigint>;
    getHistory(): Promise<Array<Message>>;
    getLatestReviews(limit: bigint): Promise<Array<Review>>;
    getMessageStatus(messageId: string): Promise<MessageStatus>;
    getMessages(otherUser: Principal): Promise<Array<DirectMessage>>;
    getMockTestResults(): Promise<Array<MockTestResult>>;
    getMyFollowers(): Promise<Array<string>>;
    getMyFollowing(): Promise<Array<string>>;
    getNotes(): Promise<Array<Note>>;
    getOrCreateProfile(username: string): Promise<UserProfile>;
    getProgressReport(): Promise<ProgressReport>;
    getQuestionsByTopic(topic: string): Promise<Array<Question>>;
    getReactions(messageId: string): Promise<Array<Reaction>>;
    getReviews(): Promise<Array<Review>>;
    getSavedMessages(): Promise<Array<string>>;
    getTestLeaderboard(domain: string, limit: bigint): Promise<Array<[Principal, bigint]>>;
    getUnlockedSeasonalItems(): Promise<Array<string>>;
    getUnreadCount(): Promise<bigint>;
    http_request(req: HttpRequest): Promise<HttpResponse>;
    incrementArticleView(id: string): Promise<boolean>;
    isFollowingUser(targetId: string): Promise<boolean>;
    likeArticle(id: string): Promise<boolean>;
    markDelivered(messageId: string): Promise<void>;
    markMessagesRead(otherUser: Principal): Promise<void>;
    proxyAIChat(messages: Array<AIChatMessage>, systemPrompt: string): Promise<string>;
    recordModuleCompletion(domain: string, moduleIndex: bigint): Promise<string | null>;
    removeReaction(messageId: string): Promise<void>;
    saveDomainTestResult(domain: string, score: bigint, maxScore: bigint, timeSpentSecs: bigint, answers: Array<bigint>): Promise<string>;
    saveMessage(messageId: string): Promise<void>;
    saveMockTestResult(testId: string, score: bigint, totalQuestions: bigint, timeTaken: bigint, answers: Array<string>): Promise<MockTestResult>;
    saveNote(title: string, content: string, topicId: string): Promise<Note>;
    sendChallenge(challengeeId: Principal, quizId: string, quizTopic: string, challengerScore: bigint): Promise<ChallengeView>;
    sendDirectMessage(receiverId: Principal, content: string): Promise<string>;
    sendVerificationEmail(email: string): Promise<void>;
    submitArticle(title: string, content: string, tags: Array<string>, authorName: string): Promise<Article>;
    submitChallengeScore(challengeId: string, score: bigint): Promise<boolean>;
    submitExperience(authorName: string, company: string, role: string, difficulty: string, experienceText: string): Promise<Experience>;
    submitReview(username: string, universityName: string, rating: bigint, text: string): Promise<{
        __kind__: "ok";
        ok: Review;
    } | {
        __kind__: "err";
        err: string;
    }>;
    unenrollCourse(courseId: string): Promise<EnrollResult>;
    unfollowUser(targetId: string): Promise<boolean>;
    unsaveMessage(messageId: string): Promise<void>;
    updateCompanion(name: string, personality: Personality): Promise<void>;
    updateNote(noteId: string, title: string, content: string): Promise<Note | null>;
    verifyEmail(email: string, code: string): Promise<VerifyResult>;
    viewStory(storyId: string): Promise<void>;
}
