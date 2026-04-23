import { useCallback, useEffect, useRef, useState } from "react";

const MOTIVATION_MESSAGES = [
  // 1. You're doing amazing
  "Hey, you're doing amazing today! Every line of code you write is a step forward. Don't stop now — you're closer to your goal than you think. Take a breath, stay focused, and keep going. I believe in you!",

  // 2. It's okay if it's hard
  "It's completely okay if something feels hard right now. Difficulty means you're growing. The best programmers weren't born knowing this — they learned it, just like you're doing. Trust yourself. You've got this!",

  // 3. Quick check-in / break reminder
  "Quick check-in from your study buddy! You've been at it for a while now. Take a sip of water, stretch a little, then dive back in. Small breaks make you sharper and more creative. Ready? Let's go!",

  // 4. Debugging is learning
  "Stuck on a bug? That's not failure — that's where the real learning happens. Every error message is a clue, and you are the detective. Read it slowly, trace back your steps, and trust your instincts. You will crack it!",

  // 5. Consistency wins
  "Showing up every single day is your superpower. You don't need to be perfect — you just need to be consistent. Small daily progress compounds into massive results over time. Keep that streak alive and watch yourself transform!",

  // 6. Celebrate small wins
  "Hey — did you just solve something or finish a section? That's huge! Every small win matters more than you think. You're building skills, confidence, and momentum right now. Be proud of yourself. You are making real progress!",

  // 7. Handling self-doubt
  "Feeling like you don't belong here? Imposter syndrome is real, but it's not the truth. Every developer you admire went through exactly what you're going through. Your curiosity and dedication are exactly what this field needs. You belong here!",

  // 8. The long game
  "Learning to code is a marathon, not a sprint. Every concept that feels confusing today will become second nature with practice. You've already learned so much since you started — and the best is still ahead. Stay the course. You're building something incredible!",

  // 9. Focus mode
  "Right now, every minute you spend focused is an investment in your future career. The skills you're building today will open doors you can't even see yet. Silence the distractions, trust the process, and keep writing that code. Your future self is cheering you on!",

  // 10. You are a builder
  "You are learning to build things that didn't exist before you created them. That's an incredible power. Every project you complete, every feature you ship, is proof of your creativity and intelligence. Keep creating — the world needs what you're building!",

  // 11. Community spirit
  "You are not on this journey alone. Millions of developers around the world are learning and growing right alongside you. Ask questions, share what you know, and celebrate others. Collaboration is how great software gets built — and you're part of that community!",

  // 12. Finish strong
  "You started today with a goal, and you're still here — still coding, still learning, still pushing forward. That kind of dedication is what separates great developers from everyone else. Finish this session strong. You have everything it takes!",
];

const FAREWELL_MESSAGE =
  "Great session today — every minute you put in brings you closer to your goals. Rest well, recharge, and come back tomorrow ready to keep building. You should be really proud of yourself for showing up. See you next time — keep crushing it!";

const MUTE_KEY = "motivationMuted";

/** 15 minutes in milliseconds */
const INTERVAL_MS = 15 * 60 * 1000;

/** Initial delay before first message (3 seconds) */
const INITIAL_DELAY_MS = 3_000;

function pickFemaleVoice(): SpeechSynthesisVoice | null {
  const voices = window.speechSynthesis.getVoices();
  const preferred = [
    "Google UK English Female",
    "Google US English Female",
    "Microsoft Zira",
    "Samantha",
    "Karen",
    "Moira",
    "Fiona",
    "Victoria",
  ];
  for (const name of preferred) {
    const v = voices.find((voice) => voice.name.includes(name));
    if (v) return v;
  }
  // Fallback: any female voice
  const femaleVoice = voices.find(
    (v) =>
      v.name.toLowerCase().includes("female") ||
      v.name.toLowerCase().includes("woman"),
  );
  return femaleVoice ?? null;
}

function speakMessage(message: string, isMuted: boolean): void {
  if (isMuted || !("speechSynthesis" in window)) return;
  try {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(message);
    const voice = pickFemaleVoice();
    if (voice) utterance.voice = voice;
    utterance.pitch = 1.1;
    utterance.rate = 0.95;
    utterance.volume = 0.8;
    window.speechSynthesis.speak(utterance);
  } catch {
    // Autoplay blocked — silently fail
  }
}

function pickRandom(
  messages: string[],
  lastIndexRef: { current: number },
): string {
  let idx: number;
  do {
    idx = Math.floor(Math.random() * messages.length);
  } while (idx === lastIndexRef.current && messages.length > 1);
  lastIndexRef.current = idx;
  return messages[idx];
}

interface UseMotivationAudioReturn {
  isMuted: boolean;
  toggleMute: () => void;
  muteMotivation: () => void;
  unmuteMotivation: () => void;
  audioBlocked: boolean;
}

export function useMotivationAudio(): UseMotivationAudioReturn {
  const [isMuted, setIsMuted] = useState<boolean>(
    () => localStorage.getItem(MUTE_KEY) === "true",
  );
  const [audioBlocked, setAudioBlocked] = useState(false);
  const lastIndexRef = useRef<number>(-1);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const isMutedRef = useRef(isMuted);
  isMutedRef.current = isMuted;

  // Ensure voices are loaded before first speak
  useEffect(() => {
    if (!("speechSynthesis" in window)) return;

    const trySpeak = () => {
      try {
        speakMessage(
          pickRandom(MOTIVATION_MESSAGES, lastIndexRef),
          isMutedRef.current,
        );
        setAudioBlocked(false);
      } catch {
        setAudioBlocked(true);
      }
    };

    // Delay 3 seconds to allow voices to load and browser to allow audio
    const loadTimer = setTimeout(() => {
      if (window.speechSynthesis.getVoices().length === 0) {
        const onVoicesChanged = () => {
          window.speechSynthesis.removeEventListener(
            "voiceschanged",
            onVoicesChanged,
          );
          trySpeak();
        };
        window.speechSynthesis.addEventListener(
          "voiceschanged",
          onVoicesChanged,
        );
      } else {
        trySpeak();
      }
    }, INITIAL_DELAY_MS);

    // Play every 15 minutes
    intervalRef.current = setInterval(() => {
      try {
        speakMessage(
          pickRandom(MOTIVATION_MESSAGES, lastIndexRef),
          isMutedRef.current,
        );
      } catch {
        // silently ignore
      }
    }, INTERVAL_MS);

    // Farewell on tab/window close (best-effort — browsers may restrict this)
    const handleBeforeUnload = () => {
      if (isMutedRef.current || !("speechSynthesis" in window)) return;
      try {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(FAREWELL_MESSAGE);
        const voice = pickFemaleVoice();
        if (voice) utterance.voice = voice;
        utterance.pitch = 1.1;
        utterance.rate = 0.95;
        utterance.volume = 0.8;
        window.speechSynthesis.speak(utterance);
      } catch {
        // silently ignore — browser may block this on unload
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      clearTimeout(loadTimer);
      if (intervalRef.current !== null) {
        clearInterval(intervalRef.current);
      }
      window.removeEventListener("beforeunload", handleBeforeUnload);
      if ("speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const muteMotivation = useCallback(() => {
    setIsMuted(true);
    localStorage.setItem(MUTE_KEY, "true");
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
  }, []);

  const unmuteMotivation = useCallback(() => {
    setIsMuted(false);
    localStorage.setItem(MUTE_KEY, "false");
  }, []);

  const toggleMute = useCallback(() => {
    setIsMuted((prev) => {
      const next = !prev;
      localStorage.setItem(MUTE_KEY, String(next));
      if (next && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
      return next;
    });
  }, []);

  return {
    isMuted,
    toggleMute,
    muteMotivation,
    unmuteMotivation,
    audioBlocked,
  };
}
