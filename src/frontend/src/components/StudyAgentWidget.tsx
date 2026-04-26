/**
 * StudyAgentWidget — floating 3-stage voice-driven study AI companion.
 *
 * Collapsed: circular avatar button with pulsing ring.
 * Expanded:  300×450 chat panel with:
 *   - hold-to-speak mic button (Stage 1)
 *   - animated typing indicator while thinking (Stage 2)
 *   - mouth animation while agent speaks (Stage 3)
 *   - text input fallback
 *   - quick reply chips
 *   - voice toggle
 */
import { AnimatePresence, motion } from "motion/react";
import {
  type KeyboardEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { useStudyAgent } from "../hooks/useStudyAgent";

interface StudyAgentWidgetProps {
  /** The topic/subject the user is currently studying */
  currentTopic: string;
  /** Optional descriptor of the current module */
  moduleName?: string;
  /** Controls whether the widget is shown at all */
  isVisible: boolean;
  /** The active app tab — used by the hook to auto-hide on certain pages */
  activeTab?: string;
}

// ────────────────────────────────────────────────────────────────────────────────
// Sub-components
// ────────────────────────────────────────────────────────────────────────────────

/** Cartoon avatar face — blinking eyes, talking mouth when speaking */
function AgentFace({
  size = 40,
  speaking = false,
}: {
  size?: number;
  speaking?: boolean;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 60 60"
      fill="none"
      aria-hidden="true"
      style={{ display: "block" }}
    >
      {/* Head */}
      <circle cx="30" cy="30" r="28" fill="oklch(0.52 0.15 285 / 0.9)" />
      <circle
        cx="30"
        cy="30"
        r="28"
        stroke="oklch(0.65 0.2 270)"
        strokeWidth="1.5"
        fill="none"
      />
      {/* Hair */}
      <path d="M10 22 Q14 8 30 7 Q46 8 50 22" fill="oklch(0.3 0.05 260)" />
      {/* Eyes */}
      <g className="agent-blink">
        <ellipse cx="21" cy="27" rx="4" ry="4.5" fill="oklch(0.98 0 0)" />
        <ellipse cx="39" cy="27" rx="4" ry="4.5" fill="oklch(0.98 0 0)" />
        <circle cx="22" cy="28" r="2" fill="oklch(0.25 0.15 265)" />
        <circle cx="40" cy="28" r="2" fill="oklch(0.25 0.15 265)" />
        <circle cx="23" cy="27" r="0.7" fill="oklch(0.98 0 0)" />
        <circle cx="41" cy="27" r="0.7" fill="oklch(0.98 0 0)" />
      </g>
      {/* Mouth — open when speaking */}
      {speaking ? (
        <ellipse
          cx="30"
          cy="42"
          rx="7"
          ry="4"
          fill="oklch(0.98 0 0)"
          className="agent-talk"
        />
      ) : (
        <path
          d="M21 40 Q30 47 39 40"
          stroke="oklch(0.98 0 0)"
          strokeWidth="2"
          strokeLinecap="round"
          fill="none"
        />
      )}
      {/* Sparkle */}
      <text x="45" y="14" fontSize="10" style={{ userSelect: "none" }}>
        ✨
      </text>
    </svg>
  );
}

/** Three bouncing dots while agent thinks */
function TypingDots() {
  return (
    <div
      className="flex items-center gap-1 px-3 py-2.5"
      aria-label="Agent is thinking"
    >
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="w-2 h-2 rounded-full bg-primary/70 animate-bounce"
          style={{ animationDelay: `${i * 0.15}s` }}
        />
      ))}
    </div>
  );
}

/** Animated sound-wave rings around mic button when listening */
function SoundWaveRings() {
  return (
    <>
      {[1, 2, 3].map((ring) => (
        <span
          key={ring}
          className="absolute inset-0 rounded-full border-2 border-red-400/60 animate-ping"
          style={{
            animationDelay: `${ring * 0.2}s`,
            animationDuration: "1.2s",
          }}
          aria-hidden="true"
        />
      ))}
    </>
  );
}

/** Render message text with **bold** support */
function MessageText({ text }: { text: string }) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return (
    <>
      {parts.map((part, i) =>
        part.startsWith("**") && part.endsWith("**") ? (
          <strong key={i}>{part.slice(2, -2)}</strong>
        ) : (
          <span key={i}>{part}</span>
        ),
      )}
    </>
  );
}

// ────────────────────────────────────────────────────────────────────────────────
// Main widget
// ────────────────────────────────────────────────────────────────────────────────

export default function StudyAgentWidget({
  currentTopic,
  moduleName,
  isVisible,
  activeTab = "study",
}: StudyAgentWidgetProps) {
  const {
    state,
    open,
    close,
    toggleTts,
    startListening,
    stopListening,
    sendText,
    quickReplies,
  } = useStudyAgent(activeTab, currentTopic);

  const [inputText, setInputText] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const micPressedRef = useRef(false);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    if (state.isOpen) scrollToBottom();
  });

  // Focus input when panel opens
  useEffect(() => {
    if (state.isOpen) {
      setTimeout(() => inputRef.current?.focus(), 120);
    }
  }, [state.isOpen]);

  const handleSend = useCallback(async () => {
    const msg = inputText.trim();
    if (!msg || state.isThinking) return;
    setInputText("");
    await sendText(msg);
  }, [inputText, state.isThinking, sendText]);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        handleSend();
      }
    },
    [handleSend],
  );

  // Hold-to-speak: start on pointerdown, stop on pointerup/leave
  const handleMicPointerDown = useCallback(() => {
    if (state.isThinking) return;
    micPressedRef.current = true;
    startListening();
  }, [state.isThinking, startListening]);

  const handleMicPointerUp = useCallback(() => {
    if (!micPressedRef.current) return;
    micPressedRef.current = false;
    stopListening();
  }, [stopListening]);

  if (!isVisible) return null;

  const topicLabel = moduleName
    ? `${currentTopic} · ${moduleName}`
    : currentTopic || "Study Session";

  return (
    <>
      {/* ── Collapsed trigger button ─────────────────────────────────────── */}
      <AnimatePresence>
        {!state.isOpen && (
          <motion.button
            key="agent-trigger"
            type="button"
            data-ocid="study_agent.open_modal_button"
            aria-label="Open Study Agent"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 22 }}
            onClick={open}
            className="fixed bottom-24 right-4 z-40 group"
            style={{ WebkitTapHighlightColor: "transparent" }}
          >
            {/* Outer pulsing glow */}
            <span
              className={`absolute inset-0 rounded-full opacity-30 ${state.isSpeaking ? "animate-ping bg-primary" : "animate-pulse bg-primary/50"}`}
              aria-hidden="true"
            />
            {/* Bob animation */}
            <motion.div
              animate={{ y: [0, -5, 0] }}
              transition={{
                duration: 2.2,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
              }}
              className="relative w-[60px] h-[60px] rounded-full shadow-lg ring-2 ring-primary/60 bg-card overflow-hidden flex items-center justify-center"
            >
              <AgentFace size={52} speaking={state.isSpeaking} />
            </motion.div>
            {/* Tooltip */}
            <span className="absolute bottom-full right-0 mb-2 px-2 py-1 rounded-lg bg-card border border-border text-xs text-foreground whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-md">
              Ask me anything! 🎤
            </span>
          </motion.button>
        )}
      </AnimatePresence>

      {/* ── Expanded chat panel ──────────────────────────────────────────── */}
      <AnimatePresence>
        {state.isOpen && (
          <motion.div
            key="agent-panel"
            data-ocid="study_agent.dialog"
            initial={{ opacity: 0, scale: 0.88, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.88, y: 20 }}
            transition={{ type: "spring", stiffness: 320, damping: 26 }}
            className="fixed bottom-24 right-4 z-40 w-[320px] sm:w-[360px] flex flex-col bg-card border border-primary/30 rounded-2xl shadow-2xl overflow-hidden"
            style={{ height: "min(450px, calc(100dvh - 120px))" }}
          >
            {/* ── Header ─────────────────────────────────────────────── */}
            <div className="bg-primary/10 border-b border-primary/20 px-3 py-2.5 flex items-center gap-2.5 shrink-0">
              <motion.div
                animate={{ scale: state.isSpeaking ? [1, 1.08, 1] : 1 }}
                transition={{
                  duration: 0.4,
                  repeat: state.isSpeaking ? Number.POSITIVE_INFINITY : 0,
                }}
                className="w-9 h-9 rounded-full bg-card ring-2 ring-primary/40 overflow-hidden flex items-center justify-center shrink-0"
              >
                <AgentFace size={34} speaking={state.isSpeaking} />
              </motion.div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-foreground leading-none">
                  Study Agent
                </p>
                {topicLabel && (
                  <p className="text-[11px] text-primary/80 mt-0.5 truncate">
                    📖 {topicLabel}
                  </p>
                )}
              </div>
              <div className="flex items-center gap-1 shrink-0">
                {/* TTS toggle */}
                <button
                  type="button"
                  data-ocid="study_agent.tts.toggle"
                  onClick={toggleTts}
                  title={
                    state.ttsEnabled ? "Voice output on" : "Voice output off"
                  }
                  aria-label={
                    state.ttsEnabled
                      ? "Disable voice output"
                      : "Enable voice output"
                  }
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-sm transition-colors ${
                    state.ttsEnabled
                      ? "bg-primary/20 text-primary"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  }`}
                >
                  {state.ttsEnabled ? "🔊" : "🔇"}
                </button>
                {/* Close */}
                <button
                  type="button"
                  data-ocid="study_agent.close_button"
                  onClick={close}
                  aria-label="Close study agent"
                  className="w-7 h-7 rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* ── Messages area ───────────────────────────────────────── */}
            <div
              className="flex-1 overflow-y-auto px-3 py-3 space-y-3 min-h-0"
              data-ocid="study_agent.messages"
            >
              {state.messages.map((msg, i) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.22 }}
                  data-ocid={`study_agent.message.${i + 1}`}
                >
                  {msg.role === "agent" ? (
                    <div className="flex items-start gap-2">
                      <div className="w-6 h-6 rounded-full bg-primary/20 ring-1 ring-primary/40 flex items-center justify-center shrink-0 mt-0.5">
                        <AgentFace size={22} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="bg-primary/[0.08] border border-primary/15 rounded-2xl rounded-tl-sm px-3 py-2 text-sm text-foreground leading-relaxed">
                          <MessageText text={msg.text} />
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="flex justify-end">
                      <div className="max-w-[80%] bg-primary/15 border border-primary/20 rounded-2xl rounded-tr-sm px-3 py-2 text-sm text-foreground leading-relaxed">
                        {msg.text}
                      </div>
                    </div>
                  )}
                </motion.div>
              ))}

              {/* Interim transcript while listening */}
              {state.interimTranscript && (
                <div className="flex justify-end">
                  <div className="max-w-[80%] bg-muted/60 border border-border rounded-2xl rounded-tr-sm px-3 py-2 text-sm text-muted-foreground leading-relaxed italic">
                    {state.interimTranscript}…
                  </div>
                </div>
              )}

              {/* Thinking indicator */}
              {state.isThinking && (
                <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-start gap-2"
                  data-ocid="study_agent.loading_state"
                >
                  <div className="w-6 h-6 rounded-full bg-primary/20 ring-1 ring-primary/40 flex items-center justify-center shrink-0">
                    <AgentFace size={22} />
                  </div>
                  <div className="bg-primary/[0.08] border border-primary/15 rounded-2xl rounded-tl-sm">
                    <TypingDots />
                  </div>
                </motion.div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* ── Quick replies ────────────────────────────────────────── */}
            {!state.isThinking && state.messages.length > 0 && (
              <div className="px-3 pb-2 flex gap-1.5 flex-wrap shrink-0">
                {quickReplies.map((qr) => (
                  <button
                    key={qr}
                    type="button"
                    data-ocid={`study_agent.quick_reply.${qr.toLowerCase().replace(/\s+/g, "_")}`}
                    onClick={() => sendText(qr)}
                    disabled={state.isThinking}
                    className="text-[11px] px-2.5 py-1 rounded-full border border-primary/30 bg-primary/[0.08] text-primary hover:bg-primary/20 transition-colors font-medium disabled:opacity-40"
                  >
                    {qr}
                  </button>
                ))}
              </div>
            )}

            {/* ── Input area ───────────────────────────────────────────── */}
            <div className="border-t border-border px-3 py-2.5 shrink-0">
              {/* Listening status bar */}
              {state.isListening && (
                <div className="flex items-center gap-2 mb-2 text-xs text-red-400 font-medium">
                  <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                  Listening… speak now
                </div>
              )}

              <div className="flex items-end gap-2">
                {/* Text input */}
                <textarea
                  ref={inputRef}
                  data-ocid="study_agent.input"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder={
                    state.isListening
                      ? "Listening…"
                      : state.voiceSupported
                        ? `Ask about ${currentTopic || "this topic"}…`
                        : `Ask about ${currentTopic || "this topic"}…`
                  }
                  disabled={state.isListening}
                  rows={1}
                  className="flex-1 bg-muted rounded-xl px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground resize-none outline-none min-h-[36px] max-h-24 leading-relaxed focus:ring-1 focus:ring-primary/40 disabled:opacity-50"
                  style={{ scrollbarWidth: "none" }}
                />

                {/* Mic button — hold to speak (only shown if voice supported) */}
                {state.voiceSupported && (
                  <button
                    type="button"
                    data-ocid="study_agent.mic.button"
                    onPointerDown={handleMicPointerDown}
                    onPointerUp={handleMicPointerUp}
                    onPointerLeave={handleMicPointerUp}
                    disabled={state.isThinking}
                    aria-label={
                      state.isListening
                        ? "Listening… release to send"
                        : "Hold to speak"
                    }
                    title={
                      state.isListening ? "Release to send" : "Hold to speak"
                    }
                    className={`relative w-10 h-10 rounded-full flex items-center justify-center shrink-0 transition-colors select-none touch-none disabled:opacity-40 ${
                      state.isListening
                        ? "bg-red-500 text-white shadow-lg"
                        : "bg-muted text-muted-foreground hover:bg-primary/20 hover:text-primary"
                    }`}
                  >
                    {state.isListening && <SoundWaveRings />}
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
                      <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                      <line x1="12" y1="19" x2="12" y2="23" />
                      <line x1="8" y1="23" x2="16" y2="23" />
                    </svg>
                  </button>
                )}

                {/* Send button */}
                <button
                  type="button"
                  data-ocid="study_agent.send.button"
                  onClick={handleSend}
                  disabled={
                    !inputText.trim() || state.isThinking || state.isListening
                  }
                  aria-label="Send message"
                  className="w-9 h-9 rounded-full bg-primary text-primary-foreground flex items-center justify-center shrink-0 disabled:opacity-40 hover:bg-primary/80 transition-colors shadow-md"
                >
                  <svg
                    width="15"
                    height="15"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M22 2L11 13" />
                    <path d="M22 2L15 22 11 13 2 9l20-7z" />
                  </svg>
                </button>
              </div>

              {/* Voice hint */}
              {state.voiceSupported && !state.isListening && (
                <p className="text-[10px] text-muted-foreground mt-1.5 text-center">
                  Hold 🎤 to speak • Press Enter to send
                </p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* CSS animations */}
      <style>{`
        @keyframes agentBlink {
          0%, 90%, 100% { transform: scaleY(1); }
          94%            { transform: scaleY(0.08); }
        }
        .agent-blink {
          animation: agentBlink 3.5s ease-in-out infinite;
          transform-origin: center 27px;
          transform-box: fill-box;
        }
        @keyframes agentTalk {
          0%, 100% { ry: 4; }
          50%       { ry: 7; }
        }
        .agent-talk {
          animation: agentTalk 0.25s ease-in-out infinite;
        }
        @media (prefers-reduced-motion: reduce) {
          .agent-blink, .agent-talk { animation: none; }
        }
      `}</style>
    </>
  );
}
