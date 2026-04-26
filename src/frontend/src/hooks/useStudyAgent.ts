/**
 * useStudyAgent — 3-stage voice pipeline hook for the floating study assistant.
 *
 * Stage 1 INPUT:   SpeechRecognition API → interim/final transcript
 * Stage 2 PROCESS: backend.proxyAIChat() via useProxyAIChat mutation
 * Stage 3 OUTPUT:  ElevenLabs TTS → SpeechSynthesis fallback
 */
import { useCallback, useEffect, useRef, useState } from "react";
import { useProxyAIChat } from "./useQueries";

// ────────────────────────────────────────────────────────────────────────────────
// Types
// ────────────────────────────────────────────────────────────────────────────────

export interface StudyMessage {
  id: string;
  role: "agent" | "user";
  text: string;
  timestamp: number;
}

export interface StudyAgentState {
  isOpen: boolean;
  isListening: boolean;
  isSpeaking: boolean;
  isThinking: boolean;
  messages: StudyMessage[];
  currentTopic: string;
  interimTranscript: string;
  ttsEnabled: boolean;
  voiceSupported: boolean;
}

// ────────────────────────────────────────────────────────────────────────────────
// Constants
// ────────────────────────────────────────────────────────────────────────────────

/** Pages where the study agent should be hidden */
const HIDDEN_ON = new Set([
  "problems",
  "compiler",
  "dashboard",
  "events",
  "chat",
]);

export const QUICK_REPLIES = [
  "Explain this",
  "Give a hint",
  "Show example",
  "I'm stuck",
];

// ElevenLabs Rachel voice — used when ttsEnabled and key is available
const ELEVENLABS_VOICE_ID = "EXAVITQu4vr4xnSDxMaL";
// No ElevenLabs key is bundled — we fall straight to SpeechSynthesis fallback
const ELEVENLABS_API_KEY = "";

// ────────────────────────────────────────────────────────────────────────────────
// Helpers
// ────────────────────────────────────────────────────────────────────────────────

export function isStudying(activeTab: string): boolean {
  return !HIDDEN_ON.has(activeTab);
}

function sessionKey(topic: string) {
  return `cc_study_agent_${topic.replace(/\s+/g, "_").toLowerCase()}`;
}

function loadHistory(topic: string): StudyMessage[] {
  try {
    return JSON.parse(
      sessionStorage.getItem(sessionKey(topic)) ?? "[]",
    ) as StudyMessage[];
  } catch {
    return [];
  }
}

function saveHistory(topic: string, messages: StudyMessage[]) {
  sessionStorage.setItem(
    sessionKey(topic),
    JSON.stringify(messages.slice(-40)),
  );
}

function introMessage(topic: string): StudyMessage {
  return {
    id: `intro-${Date.now()}`,
    role: "agent",
    text: `Hi! 👋 I'm your study agent for **${topic}**. Ask me anything and I'll guide you through it with hints and examples. You can type or hold the mic button to speak! 🎤`,
    timestamp: Date.now(),
  };
}

function goodbyeMessage(topic: string): StudyMessage {
  return {
    id: `bye-${Date.now()}`,
    role: "agent",
    text: `Great session on **${topic}**! 🎉 Keep it up — you're making real progress.`,
    timestamp: Date.now(),
  };
}

/** if-else fallback when backend call fails */
function buildFallback(input: string, topic: string): string {
  const lower = input.toLowerCase();
  if (lower.includes("example"))
    return `Here's a quick example for **${topic}**: think of a real-world scenario where this concept applies. What part would you like me to detail further?`;
  if (lower.includes("hint"))
    return `Here's a hint for **${topic}**: break it down into the smallest steps first. What's the first sub-problem you're facing?`;
  if (lower.includes("explain"))
    return `Let me explain **${topic}** a different way. It's a fundamental concept that builds upon prior knowledge. Which specific aspect is unclear?`;
  if (lower.includes("stuck") || lower.includes("help"))
    return `No worries about being stuck — that's how learning works! 💪 For **${topic}**, let's go step-by-step. What was the last thing you understood clearly?`;
  return `I'm here to help with **${topic}**. 🎯 What would you like to explore? Ask me to explain, give a hint, or show an example.`;
}

// ────────────────────────────────────────────────────────────────────────────────
// Stage 3: TTS helpers
// ────────────────────────────────────────────────────────────────────────────────

async function speakElevenLabs(text: string): Promise<boolean> {
  if (!ELEVENLABS_API_KEY) return false;
  try {
    const res = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${ELEVENLABS_VOICE_ID}`,
      {
        method: "POST",
        headers: {
          "xi-api-key": ELEVENLABS_API_KEY,
          "Content-Type": "application/json",
          Accept: "audio/mpeg",
        },
        body: JSON.stringify({
          text,
          model_id: "eleven_monolingual_v1",
          voice_settings: { stability: 0.5, similarity_boost: 0.75 },
        }),
      },
    );
    if (!res.ok) return false;
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const audio = new Audio(url);
    audio.play();
    audio.onended = () => URL.revokeObjectURL(url);
    return true;
  } catch {
    return false;
  }
}

function speakWebSpeech(text: string): boolean {
  if (!("speechSynthesis" in window)) return false;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text.replace(/\*\*/g, ""));
  // Prefer a female voice
  const voices = window.speechSynthesis.getVoices();
  const preferred = voices.find(
    (v) =>
      v.name.includes("Google UK English Female") ||
      v.name.includes("Zira") ||
      v.name.includes("Samantha") ||
      v.name.includes("Female"),
  );
  if (preferred) utterance.voice = preferred;
  utterance.rate = 0.95;
  utterance.pitch = 1.1;
  utterance.volume = 0.9;
  window.speechSynthesis.speak(utterance);
  return true;
}

async function speak(text: string) {
  const ok = await speakElevenLabs(text);
  if (!ok) speakWebSpeech(text);
}

// ────────────────────────────────────────────────────────────────────────────────
// Main hook
// ────────────────────────────────────────────────────────────────────────────────

export function useStudyAgent(activeTab: string, currentTopic: string) {
  const visible = isStudying(activeTab);
  const proxyAIChat = useProxyAIChat();

  // Check SpeechRecognition support once
  const voiceSupported =
    typeof window !== "undefined" &&
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    !!(
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition
    );

  const [state, setState] = useState<StudyAgentState>(() => {
    const history = currentTopic ? loadHistory(currentTopic) : [];
    const messages =
      history.length > 0
        ? history
        : currentTopic
          ? [introMessage(currentTopic)]
          : [];
    if (currentTopic && history.length === 0)
      saveHistory(currentTopic, messages);
    return {
      isOpen: false,
      isListening: false,
      isSpeaking: false,
      isThinking: false,
      messages,
      currentTopic,
      interimTranscript: "",
      ttsEnabled: false,
      voiceSupported,
    };
  });

  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const prevTopicRef = useRef(currentTopic);
  const didInitRef = useRef(false);
  const currentStateRef = useRef(state);
  currentStateRef.current = state;

  // ── Topic change handler ────────────────────────────────────────────────────
  useEffect(() => {
    const prevTopic = prevTopicRef.current;
    if (prevTopic === currentTopic) return;

    setState((s) => {
      if (prevTopic) {
        const bye = goodbyeMessage(prevTopic);
        saveHistory(prevTopic, [...s.messages, bye]);
      }
      const existing = currentTopic ? loadHistory(currentTopic) : [];
      const msgs: StudyMessage[] =
        existing.length > 0
          ? existing
          : currentTopic
            ? [introMessage(currentTopic)]
            : [];
      if (currentTopic && existing.length === 0)
        saveHistory(currentTopic, msgs);
      return { ...s, currentTopic, messages: msgs, isThinking: false };
    });

    prevTopicRef.current = currentTopic;
  }, [currentTopic]);

  // ── First-load intro (mount once) ──────────────────────────────────────────
  useEffect(() => {
    if (didInitRef.current || !currentTopic) return;
    didInitRef.current = true;
    setState((s) => {
      if (s.messages.length === 0) {
        const msg = introMessage(currentTopic);
        saveHistory(currentTopic, [msg]);
        return { ...s, messages: [msg] };
      }
      return s;
    });
  }, [currentTopic]);

  // ── Cleanup recognition on unmount ─────────────────────────────────────────
  useEffect(() => {
    return () => {
      recognitionRef.current?.abort();
      window.speechSynthesis?.cancel();
    };
  }, []);

  // ── Actions ────────────────────────────────────────────────────────────────

  const open = useCallback(() => setState((s) => ({ ...s, isOpen: true })), []);
  const close = useCallback(() => {
    recognitionRef.current?.abort();
    setState((s) => ({
      ...s,
      isOpen: false,
      isListening: false,
      interimTranscript: "",
    }));
  }, []);

  const toggleTts = useCallback(
    () => setState((s) => ({ ...s, ttsEnabled: !s.ttsEnabled })),
    [],
  );

  // ── Stage 2: process text through AI ───────────────────────────────────────
  const processText = useCallback(
    async (text: string) => {
      if (!text.trim()) return;
      const s = currentStateRef.current;

      const userMsg: StudyMessage = {
        id: `u-${Date.now()}`,
        role: "user",
        text,
        timestamp: Date.now(),
      };

      setState((prev) => {
        const next = [...prev.messages, userMsg];
        saveHistory(prev.currentTopic, next);
        return {
          ...prev,
          messages: next,
          isThinking: true,
          interimTranscript: "",
        };
      });

      const systemPrompt = `You are a friendly, encouraging CS study assistant for Code & Crush. The student is currently studying: "${s.currentTopic}". Give clear, encouraging guidance. Keep responses under 100 words for voice output. Use the Socratic method — guide rather than give direct answers. Use **bold** for key terms.`;

      const contextMessages = s.messages.slice(-8).map((m) => ({
        role: m.role === "agent" ? "assistant" : "user",
        content: m.text,
      }));

      let reply = "";
      try {
        reply = await proxyAIChat.mutateAsync({
          messages: [...contextMessages, { role: "user", content: text }],
          systemPrompt,
        });
      } catch {
        reply = buildFallback(text, s.currentTopic);
      }

      if (!reply) reply = buildFallback(text, s.currentTopic);

      const agentMsg: StudyMessage = {
        id: `a-${Date.now()}`,
        role: "agent",
        text: reply,
        timestamp: Date.now(),
      };

      setState((prev) => {
        const next = [...prev.messages, agentMsg];
        saveHistory(prev.currentTopic, next);
        return { ...prev, messages: next, isThinking: false };
      });

      // Stage 3: TTS output
      if (currentStateRef.current.ttsEnabled) {
        setState((prev) => ({ ...prev, isSpeaking: true }));
        await speak(reply.replace(/\*\*/g, ""));
        setState((prev) => ({ ...prev, isSpeaking: false }));
      }
    },
    [proxyAIChat],
  );

  // ── Stage 1: voice capture — start listening ───────────────────────────────
  const startListening = useCallback(() => {
    if (!voiceSupported) return;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const SpeechRecognitionCtor: new () => SpeechRecognition =
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (window as any).SpeechRecognition ??
      (window as any).webkitSpeechRecognition;

    if (!SpeechRecognitionCtor) return;

    const recognition = new SpeechRecognitionCtor();
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = "en-US";

    recognition.onstart = () => {
      setState((s) => ({ ...s, isListening: true, interimTranscript: "" }));
    };

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      let interim = "";
      let final = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        if (result.isFinal) {
          final += result[0].transcript;
        } else {
          interim += result[0].transcript;
        }
      }
      if (interim) {
        setState((s) => ({ ...s, interimTranscript: interim }));
      }
      if (final) {
        setState((s) => ({ ...s, isListening: false, interimTranscript: "" }));
        processText(final.trim());
      }
    };

    recognition.onerror = () => {
      setState((s) => ({ ...s, isListening: false, interimTranscript: "" }));
    };

    recognition.onend = () => {
      setState((s) => ({ ...s, isListening: false }));
    };

    recognitionRef.current = recognition;
    recognition.start();
  }, [voiceSupported, processText]);

  // ── Stage 1: stop listening early ─────────────────────────────────────────
  const stopListening = useCallback(() => {
    recognitionRef.current?.stop();
    setState((s) => ({ ...s, isListening: false }));
  }, []);

  return {
    state,
    visible,
    open,
    close,
    toggleTts,
    startListening,
    stopListening,
    sendText: processText,
    quickReplies: QUICK_REPLIES,
  };
}
