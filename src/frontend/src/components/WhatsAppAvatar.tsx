import type { CSSProperties } from "react";

export type AvatarGender = "male" | "female";

export type AvatarConfig = {
  skinTone: string;
  hairStyle: string;
  hairColor: string;
  eyeShape: string;
  eyeColor?: string;
  eyebrowStyle: string;
  mouthStyle: string;
  outfitColor: string;
  accessory: string;
  gender?: AvatarGender;
  /** Optional: equipped store outfit id, used to pick outfit shape */
  equippedOutfitId?: string;
};

export const DEFAULT_AVATAR_CONFIG: AvatarConfig = {
  skinTone: "medium-light",
  hairStyle: "long",
  hairColor: "black",
  eyeShape: "round",
  eyeColor: "brown",
  eyebrowStyle: "arched",
  mouthStyle: "smile",
  outfitColor: "#7c3aed",
  accessory: "none",
  gender: "female",
};

export const DEFAULT_MALE_CONFIG: AvatarConfig = {
  skinTone: "medium",
  hairStyle: "short-fade",
  hairColor: "black",
  eyeShape: "round",
  eyeColor: "brown",
  eyebrowStyle: "thick",
  mouthStyle: "smile",
  outfitColor: "#2563eb",
  accessory: "none",
  gender: "male",
};

const SKIN_TONES: Record<string, string> = {
  light: "#FDDBB4",
  "medium-light": "#F5C89A",
  medium: "#E8A87C",
  "medium-dark": "#C68642",
  dark: "#8D5524",
  "very-dark": "#4A2912",
  tan: "#D4956A",
};

const HAIR_COLORS: Record<string, string> = {
  black: "#1a1a1a",
  brown: "#6B3A2A",
  blonde: "#F4C14D",
  red: "#C0392B",
  auburn: "#8B3A10",
  gray: "#9B9B9B",
  white: "#E8E8E8",
  blue: "#4A90D9",
  purple: "#8E44AD",
  pink: "#FF69B4",
  holographic: "#7B52FF",
};

// Outfit shape hinting based on id prefix
type OutfitShape =
  | "tee"
  | "dress"
  | "shorts"
  | "skirt"
  | "robe"
  | "armor"
  | "coat"
  | "leather-jacket"
  | "hoodie"
  | "suit"
  | "vr-suit"
  | "futuristic";

function getOutfitShape(id: string): OutfitShape {
  if (id.includes("vr-suit") || id.includes("vr_suit")) return "vr-suit";
  if (id.includes("futuristic") || id.includes("cyberpunk"))
    return "futuristic";
  if (id.includes("leather-jacket") || id.includes("leather"))
    return "leather-jacket";
  if (id.includes("hoodie") || id.includes("sweatshirt")) return "hoodie";
  if (id.includes("suit") || id.includes("tuxedo")) return "suit";
  if (
    id.includes("dress") ||
    id.includes("kimono") ||
    id.includes("floral-sundress") ||
    id.includes("cherry-blossom") ||
    id.includes("tulip-skirt") ||
    id.includes("garden-party") ||
    id.includes("ice-skater") ||
    id.includes("wizard-robe")
  )
    return "dress";
  if (
    id.includes("shorts") ||
    id.includes("beach-waves") ||
    id.includes("surfboard") ||
    id.includes("watermelon") ||
    id.includes("tropical") ||
    id.includes("neon") ||
    id.includes("festival")
  )
    return "shorts";
  if (id.includes("skirt")) return "skirt";
  if (
    id.includes("robe") ||
    id.includes("santa") ||
    id.includes("snowman") ||
    id.includes("halloween")
  )
    return "robe";
  if (id.includes("armor") || id.includes("knight") || id.includes("samurai"))
    return "armor";
  if (
    id.includes("coat") ||
    id.includes("puffer") ||
    id.includes("blazer") ||
    id.includes("detective") ||
    id.includes("blizzard") ||
    id.includes("autumn-coat") ||
    id.includes("snowflake-coat")
  )
    return "coat";
  return "tee";
}

const FALLBACK_SKIN = "#F5C89A";
const FALLBACK_HAIR = "#1a1a1a";

const EYE_IRIS_COLORS: Record<string, string> = {
  brown: "#3B2314",
  hazel: "#6B4A1A",
  green: "#2E6B3A",
  blue: "#1A4B8C",
  gray: "#5A6472",
  amber: "#C47B0A",
  violet: "#5B3A8E",
  cyber: "#00E5FF",
};

interface WhatsAppAvatarProps {
  config: AvatarConfig;
  size?: number;
  style?: CSSProperties;
  className?: string;
}

export default function WhatsAppAvatar({
  config,
  size = 200,
  style,
  className,
}: WhatsAppAvatarProps) {
  const gender: AvatarGender = config.gender ?? "female";
  const skin = SKIN_TONES[config.skinTone] ?? FALLBACK_SKIN;
  const hair = HAIR_COLORS[config.hairColor] ?? FALLBACK_HAIR;
  const outfit = config.outfitColor ?? "#7c3aed";
  const skinLight = `${skin}88`;
  const skinMid = adjustColor(skin, -15);
  const outfitShape = getOutfitShape(config.equippedOutfitId ?? "tee");
  const pantColor = adjustColor(outfit, -40);
  const shoeColor = "#3a2a1e";

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 200 290"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ ...style, transition: "all 0.2s ease" }}
      className={className}
      role="img"
      aria-label={`${gender === "female" ? "Female" : "Male"} Avatar`}
    >
      <title>{gender === "female" ? "Female" : "Male"} Avatar</title>

      {/* Breathing animation keyframes — subtle bob */}
      <style>{`
        @keyframes avatar-breathe {
          0%, 100% { transform: translateY(0) scaleX(1); }
          50% { transform: translateY(-2px) scaleX(1.005); }
        }
        @keyframes avatar-blink {
          0%, 94%, 100% { transform: scaleY(1); }
          96%, 98% { transform: scaleY(0.08); }
        }
        @keyframes avatar-entry {
          0% { opacity: 0; transform: scale(0.82) translateY(8px); }
          100% { opacity: 1; transform: scale(1) translateY(0); }
        }
        @keyframes avatar-sparkle {
          0%, 100% { filter: drop-shadow(0 0 0px transparent); }
          50% { filter: drop-shadow(0 0 12px gold) drop-shadow(0 0 24px gold); }
        }
        @keyframes avatar-hover {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.02); }
        }
        .avatar-breathe {
          animation: avatar-breathe 3s ease-in-out infinite;
          transform-origin: center bottom;
        }
        .avatar-entry-anim {
          animation: avatar-entry 0.45s cubic-bezier(0.34,1.56,0.64,1) forwards;
        }
        .avatar-saved-sparkle {
          animation: avatar-sparkle 0.7s ease-in-out;
        }
        .avatar-blink-group {
          animation: avatar-blink 5s ease-in-out infinite;
          transform-origin: center;
        }
      `}</style>

      {/* Background gradient bubble */}
      <defs>
        <radialGradient id="bg-grad" cx="50%" cy="85%" r="60%">
          <stop offset="0%" stopColor={outfit} stopOpacity="0.08" />
          <stop offset="100%" stopColor={outfit} stopOpacity="0" />
        </radialGradient>
        <filter id="soft-shadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow
            dx="0"
            dy="3"
            stdDeviation="4"
            floodColor={outfit}
            floodOpacity="0.2"
          />
        </filter>
      </defs>
      <rect width="200" height="290" rx="10" fill="url(#bg-grad)" />

      {/* ── Breathing group ── */}
      <g className="avatar-breathe">
        {/* ── Lower body (drawn first, behind torso) ── */}
        <LowerBody
          outfit={outfit}
          skin={skin}
          pantColor={pantColor}
          shoeColor={shoeColor}
          shape={outfitShape}
          gender={gender}
        />

        {/* ── Upper Body / Torso ── */}
        <UpperBody
          outfit={outfit}
          skin={skin}
          shape={outfitShape}
          gender={gender}
        />

        {/* ── Arms ── */}
        <Arms outfit={outfit} skin={skin} shape={outfitShape} gender={gender} />

        {/* ── Neck ── */}
        <Neck skin={skin} skinMid={skinMid} gender={gender} />

        {/* ── Hair Back ── */}
        <HairBack config={config} hair={hair} gender={gender} />

        {/* ── Head ── */}
        <Head
          skin={skin}
          skinLight={skinLight}
          skinMid={skinMid}
          gender={gender}
        />

        {/* ── Hair Front ── */}
        <HairFront config={config} hair={hair} gender={gender} />

        {/* ── Eyebrows ── */}
        <Eyebrows config={config} hair={hair} gender={gender} />

        {/* ── Eyes ── */}
        <Eyes config={config} gender={gender} />

        {/* ── Nose ── */}
        <Nose skin={skin} skinLight={skinLight} gender={gender} />

        {/* ── Cheek blush ── */}
        <CheekBlush gender={gender} />

        {/* ── Mouth ── */}
        <Mouth config={config} gender={gender} />

        {/* ── Accessories ── */}
        <Accessory config={config} />
      </g>
    </svg>
  );
}

/** Darken/lighten a hex color by amount */
function adjustColor(hex: string, amount: number): string {
  const clean = hex.replace("#", "");
  if (clean.length !== 6) return hex;
  const r = Math.max(
    0,
    Math.min(255, Number.parseInt(clean.slice(0, 2), 16) + amount),
  );
  const g = Math.max(
    0,
    Math.min(255, Number.parseInt(clean.slice(2, 4), 16) + amount),
  );
  const b = Math.max(
    0,
    Math.min(255, Number.parseInt(clean.slice(4, 6), 16) + amount),
  );
  return `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;
}

// ── Head ─────────────────────────────────────────────────────────────────────
function Head({
  skin,
  skinLight,
  skinMid,
  gender,
}: { skin: string; skinLight: string; skinMid: string; gender: AvatarGender }) {
  // Female: slightly rounder, softer chin; Male: slightly wider, more angular
  if (gender === "female") {
    return (
      <>
        {/* Ears */}
        <ellipse cx="60" cy="90" rx="7" ry="9" fill={skin} />
        <ellipse cx="60" cy="90" rx="4" ry="5.5" fill={skinLight} />
        <ellipse cx="140" cy="90" rx="7" ry="9" fill={skin} />
        <ellipse cx="140" cy="90" rx="4" ry="5.5" fill={skinLight} />
        {/* Main head shape: slightly oval, soft chin */}
        <ellipse cx="100" cy="86" rx="40" ry="45" fill={skin} />
        {/* Chin softening */}
        <ellipse cx="100" cy="126" rx="18" ry="8" fill={skin} />
        {/* Subtle jaw line shading */}
        <path
          d="M65 110 Q80 128 100 130 Q120 128 135 110"
          stroke={skinMid}
          strokeWidth="1"
          fill="none"
          strokeLinecap="round"
          opacity="0.4"
        />
      </>
    );
  }
  // Male head: wider jaw
  return (
    <>
      {/* Ears — slightly lower on male */}
      <ellipse cx="59" cy="91" rx="8" ry="9.5" fill={skin} />
      <ellipse cx="59" cy="91" rx="5" ry="6" fill={skinLight} />
      <ellipse cx="141" cy="91" rx="8" ry="9.5" fill={skin} />
      <ellipse cx="141" cy="91" rx="5" ry="6" fill={skinLight} />
      {/* Wider head */}
      <ellipse cx="100" cy="85" rx="43" ry="44" fill={skin} />
      {/* Squared jaw */}
      <rect x="66" y="112" width="68" height="16" rx="6" fill={skin} />
      {/* Jaw shading */}
      <path
        d="M64 108 Q72 125 100 128 Q128 125 136 108"
        stroke={skinMid}
        strokeWidth="1.2"
        fill="none"
        strokeLinecap="round"
        opacity="0.35"
      />
    </>
  );
}

// ── Neck ─────────────────────────────────────────────────────────────────────
function Neck({
  skin,
  skinMid,
  gender,
}: { skin: string; skinMid: string; gender: AvatarGender }) {
  const w = gender === "male" ? 22 : 18;
  const x = 100 - w / 2;
  return (
    <>
      <rect x={x} y="126" width={w} height="16" rx="5" fill={skin} />
      {/* Neck shading stripe */}
      <line
        x1={x + w * 0.33}
        y1="126"
        x2={x + w * 0.33}
        y2="142"
        stroke={skinMid}
        strokeWidth="1.2"
        opacity="0.3"
        strokeLinecap="round"
      />
    </>
  );
}

// ── Arms ─────────────────────────────────────────────────────────────────────
function Arms({
  outfit,
  skin,
  shape,
  gender,
}: { outfit: string; skin: string; shape: OutfitShape; gender: AvatarGender }) {
  const armColor =
    shape === "dress" || shape === "shorts" || shape === "skirt"
      ? skin
      : outfit;
  const darkArm = adjustColor(armColor, -25);
  // Male arms slightly wider
  const armW = gender === "male" ? 14 : 12;

  if (shape === "armor") {
    const light = adjustColor(outfit, 35);
    return (
      <>
        {/* Left arm */}
        <path
          d={`M${63} 148 Q${54} 170 ${52} 205 Q${56} 208 ${62} 207 Q${67} 170 ${70} 148 Z`}
          fill={outfit}
        />
        <ellipse cx="57" cy="207" rx="6" ry="4" fill={light} />
        {/* Right arm */}
        <path
          d={`M${137} 148 Q${146} 170 ${148} 205 Q${144} 208 ${138} 207 Q${133} 170 ${130} 148 Z`}
          fill={outfit}
        />
        <ellipse cx="143" cy="207" rx="6" ry="4" fill={light} />
        {/* Shoulder pads */}
        <ellipse cx="66" cy="152" rx="14" ry="9" fill={light} />
        <ellipse cx="134" cy="152" rx="14" ry="9" fill={light} />
      </>
    );
  }

  return (
    <>
      {/* Left arm — slight bend at elbow */}
      <path
        d={`M${63} 148 Q${52 - (gender === "male" ? 4 : 0)} 175 ${50} 210 Q${54} 213 ${60} 212 Q${63} 180 ${70} 152 Z`}
        fill={armColor}
      />
      {/* Left forearm shading */}
      <path
        d={`M${56} 180 Q${53} 198 ${52} 210`}
        stroke={darkArm}
        strokeWidth="1.5"
        fill="none"
        strokeLinecap="round"
        opacity="0.4"
      />
      {/* Left hand */}
      <ellipse cx={55} cy={214} rx={armW / 2 + 2} ry={5} fill={skin} />
      {/* Fingers hint */}
      <path
        d={`M${49} 212 Q${48} 217 ${50} 219`}
        stroke={skin}
        strokeWidth="3"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d={`M${53} 213 Q${52} 219 ${54} 221`}
        stroke={skin}
        strokeWidth="3"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d={`M${57} 214 Q${57} 220 ${58} 221`}
        stroke={skin}
        strokeWidth="3"
        strokeLinecap="round"
        fill="none"
      />

      {/* Right arm */}
      <path
        d={`M${137} 148 Q${148 + (gender === "male" ? 4 : 0)} 175 ${150} 210 Q${146} 213 ${140} 212 Q${137} 180 ${130} 152 Z`}
        fill={armColor}
      />
      <path
        d={`M${144} 180 Q${147} 198 ${148} 210`}
        stroke={darkArm}
        strokeWidth="1.5"
        fill="none"
        strokeLinecap="round"
        opacity="0.4"
      />
      {/* Right hand */}
      <ellipse cx={145} cy={214} rx={armW / 2 + 2} ry={5} fill={skin} />
      {/* Fingers hint */}
      <path
        d={`M${139} 212 Q${138} 217 ${140} 219`}
        stroke={skin}
        strokeWidth="3"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d={`M${143} 213 Q${142} 219 ${144} 221`}
        stroke={skin}
        strokeWidth="3"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d={`M${147} 214 Q${147} 220 ${148} 221`}
        stroke={skin}
        strokeWidth="3"
        strokeLinecap="round"
        fill="none"
      />
    </>
  );
}

// ── Upper Body / Torso ───────────────────────────────────────────────────────
function UpperBody({
  outfit,
  shape,
  gender,
}: {
  outfit: string;
  skin?: string;
  shape: OutfitShape;
  gender: AvatarGender;
}) {
  const dark = adjustColor(outfit, -30);
  const light = adjustColor(outfit, 30);

  // Female torso is slightly narrower with gentle waist curve
  const shoulderL = gender === "female" ? 63 : 57;
  const shoulderR = gender === "female" ? 137 : 143;
  const waistL = gender === "female" ? 72 : 68;
  const waistR = gender === "female" ? 128 : 132;
  const hipL = gender === "female" ? 65 : 70;
  const hipR = gender === "female" ? 135 : 130;

  if (shape === "dress") {
    return (
      <>
        {/* Dress bodice */}
        <path
          d={`M${shoulderL} 148 Q${shoulderL - 5} 160 ${waistL} 178 Q${hipL} 195 60 285 L140 285 Q${hipR} 195 ${waistR} 178 Q${shoulderR + 5} 160 ${shoulderR} 148 Z`}
          fill={outfit}
        />
        {/* Bodice highlight */}
        <path
          d={`M${waistL} 178 Q100 188 ${waistR} 178 Q100 195 ${waistL} 178 Z`}
          fill={light}
          opacity="0.25"
        />
        {/* Waist sash */}
        <path
          d={`M${waistL + 4} 185 Q100 192 ${waistR - 4} 185`}
          stroke={dark}
          strokeWidth="2"
          fill="none"
          strokeLinecap="round"
          opacity="0.5"
        />
        {/* Collar */}
        <path
          d={`M${shoulderL + 8} 148 Q100 162 ${shoulderR - 8} 148`}
          stroke={light}
          strokeWidth="2"
          fill="none"
          strokeLinecap="round"
          opacity="0.6"
        />
      </>
    );
  }

  if (shape === "leather-jacket") {
    const leatherDark = adjustColor(outfit, -50);
    const leatherShine = adjustColor(outfit, 55);
    return (
      <>
        {/* Jacket body */}
        <path
          d={`M${shoulderL} 148 Q${waistL} 168 ${waistL} 200 Q${waistL + 5} 205 100 207 Q${waistR - 5} 205 ${waistR} 200 Q${waistR} 168 ${shoulderR} 148 Z`}
          fill={outfit}
        />
        {/* Jacket sheen left */}
        <path
          d={`M${shoulderL} 148 Q${shoulderL - 2} 165 ${waistL + 3} 190`}
          stroke={leatherShine}
          strokeWidth="3.5"
          fill="none"
          strokeLinecap="round"
          opacity="0.35"
        />
        {/* Jacket sheen right */}
        <path
          d={`M${shoulderR} 148 Q${shoulderR + 2} 165 ${waistR - 3} 190`}
          stroke={leatherShine}
          strokeWidth="3.5"
          fill="none"
          strokeLinecap="round"
          opacity="0.35"
        />
        {/* Front zipper */}
        <line
          x1="100"
          y1="152"
          x2="100"
          y2="205"
          stroke={leatherDark}
          strokeWidth="1.5"
          strokeDasharray="3 2"
          opacity="0.7"
        />
        {/* Lapels */}
        <path
          d={`M${shoulderL + 5} 150 L100 172 L${shoulderR - 5} 150`}
          fill={leatherDark}
          opacity="0.55"
        />
        {/* Collar stand */}
        <path
          d={`M${shoulderL + 3} 148 Q100 160 ${shoulderR - 3} 148`}
          stroke={leatherShine}
          strokeWidth="2"
          fill="none"
          opacity="0.4"
        />
        {/* Zipper pull */}
        <rect
          x="97"
          y="166"
          width="6"
          height="4"
          rx="1"
          fill={leatherShine}
          opacity="0.7"
        />
        {/* Belt line */}
        <path
          d={`M${waistL + 3} 200 Q100 205 ${waistR - 3} 200`}
          stroke={leatherDark}
          strokeWidth="2.5"
          fill="none"
          strokeLinecap="round"
          opacity="0.6"
        />
      </>
    );
  }

  if (shape === "hoodie") {
    const hoodieLight = adjustColor(outfit, 25);
    return (
      <>
        <path
          d={`M${shoulderL} 148 Q${waistL - 3} 165 ${waistL} 200 Q100 208 ${waistR} 200 Q${waistR + 3} 165 ${shoulderR} 148 Z`}
          fill={outfit}
        />
        {/* Hood detail at collar */}
        <path
          d={`M${shoulderL + 6} 148 Q100 165 ${shoulderR - 6} 148`}
          fill={hoodieLight}
          opacity="0.35"
        />
        {/* Kangaroo pocket */}
        <rect
          x="84"
          y="180"
          width="32"
          height="16"
          rx="4"
          fill={adjustColor(outfit, -15)}
          opacity="0.6"
        />
        {/* Center seam */}
        <line
          x1="100"
          y1="148"
          x2="100"
          y2="200"
          stroke={adjustColor(outfit, -20)}
          strokeWidth="1.5"
          opacity="0.4"
        />
      </>
    );
  }

  if (shape === "suit") {
    const lapel = adjustColor(outfit, -35);
    const shirtWhite = "#f0f0f8";
    return (
      <>
        <path
          d={`M${shoulderL} 148 Q${waistL} 168 ${waistL} 200 Q100 208 ${waistR} 200 Q${waistR} 168 ${shoulderR} 148 Z`}
          fill={outfit}
        />
        {/* White shirt showing */}
        <path
          d={`M${shoulderL + 8} 150 Q100 170 ${shoulderR - 8} 150 L${shoulderR - 5} 148 Q100 160 ${shoulderL + 5} 148 Z`}
          fill={shirtWhite}
        />
        {/* Lapels */}
        <path
          d={`M${shoulderL + 5} 150 L100 175 L${shoulderR - 5} 150 Q${shoulderR - 8} 148 ${shoulderR - 4} 148 L100 168 L${shoulderL + 4} 148 Q${shoulderL + 8} 148 ${shoulderL + 5} 150`}
          fill={lapel}
        />
        {/* Buttons */}
        <circle cx="100" cy="178" r="1.8" fill={lapel} />
        <circle cx="100" cy="185" r="1.8" fill={lapel} />
        <circle cx="100" cy="192" r="1.8" fill={lapel} />
        {/* Pocket square */}
        <path
          d="M120 168 Q124 164 128 168 Q126 172 120 168 Z"
          fill={shirtWhite}
        />
      </>
    );
  }

  if (shape === "skirt" || shape === "robe") {
    return (
      <>
        {/* Top blouse/robe bodice */}
        <path
          d={`M${shoulderL} 148 Q${waistL} 165 ${waistL} 195 Q100 200 ${waistR} 195 Q${waistR} 165 ${shoulderR} 148 Z`}
          fill={outfit}
        />
        <path
          d={`M${shoulderL + 5} 150 Q100 164 ${shoulderR - 5} 150`}
          stroke={light}
          strokeWidth="2"
          fill="none"
          opacity="0.5"
        />
        {/* Robe centre line */}
        {shape === "robe" && (
          <line
            x1="100"
            y1="148"
            x2="100"
            y2="200"
            stroke={dark}
            strokeWidth="1.5"
            opacity="0.5"
            strokeDasharray="4 3"
          />
        )}
      </>
    );
  }

  if (shape === "armor") {
    const armorLight = adjustColor(outfit, 40);
    return (
      <>
        {/* Chest plate */}
        <path
          d={`M${shoulderL} 148 Q${waistL} 165 ${waistL} 200 Q100 208 ${waistR} 200 Q${waistR} 165 ${shoulderR} 148 Z`}
          fill={outfit}
        />
        <path
          d={`M${shoulderL + 6} 150 Q100 168 ${shoulderR - 6} 150 L${shoulderR - 3} 147 Q100 162 ${shoulderL + 3} 147 Z`}
          fill={armorLight}
        />
        <ellipse
          cx="100"
          cy="175"
          rx="18"
          ry="14"
          fill={armorLight}
          opacity="0.45"
        />
        <polygon
          points="100,167 106,175 100,181 94,175"
          fill={dark}
          stroke={armorLight}
          strokeWidth="1"
        />
      </>
    );
  }

  if (shape === "vr-suit") {
    const glowAccent = "#00E5FF";
    const suitBase = adjustColor(outfit, -20);
    return (
      <>
        {/* VR Suit torso — sleek black with neon trim */}
        <path
          d={`M${shoulderL} 148 Q${waistL} 163 ${waistL} 200 Q100 208 ${waistR} 200 Q${waistR} 163 ${shoulderR} 148 Z`}
          fill={suitBase}
        />
        {/* Chest panel */}
        <rect
          x="84"
          y="158"
          width="32"
          height="20"
          rx="4"
          fill={adjustColor(suitBase, 10)}
        />
        {/* Neon collar */}
        <path
          d={`M${shoulderL + 6} 148 Q100 162 ${shoulderR - 6} 148`}
          stroke={glowAccent}
          strokeWidth="2"
          fill="none"
          opacity="0.9"
          strokeLinecap="round"
        />
        {/* Neon chest lines */}
        <line
          x1="100"
          y1="158"
          x2="100"
          y2="178"
          stroke={glowAccent}
          strokeWidth="1.5"
          opacity="0.8"
        />
        <path
          d="M88 163 Q100 160 112 163"
          stroke={glowAccent}
          strokeWidth="1"
          fill="none"
          opacity="0.6"
          strokeLinecap="round"
        />
        {/* Glow dots */}
        <circle cx="92" cy="167" r="2" fill={glowAccent} opacity="0.85" />
        <circle cx="108" cy="167" r="2" fill={glowAccent} opacity="0.85" />
      </>
    );
  }

  if (shape === "futuristic") {
    const neon = "#FF00A0";
    const neon2 = "#7B52FF";
    const base = "#0D0D1A";
    return (
      <>
        {/* Cyberpunk torso */}
        <path
          d={`M${shoulderL} 148 Q${waistL} 163 ${waistL} 200 Q100 208 ${waistR} 200 Q${waistR} 163 ${shoulderR} 148 Z`}
          fill={base}
        />
        {/* Diagonal neon lines */}
        <path
          d={`M${shoulderL + 4} 150 L${waistL + 6} 200`}
          stroke={neon}
          strokeWidth="1.5"
          fill="none"
          opacity="0.7"
          strokeLinecap="round"
        />
        <path
          d={`M${shoulderR - 4} 150 L${waistR - 6} 200`}
          stroke={neon}
          strokeWidth="1.5"
          fill="none"
          opacity="0.7"
          strokeLinecap="round"
        />
        {/* Center panel */}
        <rect
          x="90"
          y="156"
          width="20"
          height="30"
          rx="3"
          fill={adjustColor(base, 12)}
        />
        <path
          d="M94 160 Q100 157 106 160 Q100 172 94 160 Z"
          fill={neon2}
          opacity="0.5"
        />
        {/* Collar neon */}
        <path
          d={`M${shoulderL + 5} 148 Q100 160 ${shoulderR - 5} 148`}
          stroke={neon2}
          strokeWidth="2"
          fill="none"
          opacity="0.9"
          strokeLinecap="round"
        />
        {/* Trim seams */}
        <path
          d={`M${shoulderL + 2} 150 Q${waistL} 172 ${waistL} 200`}
          stroke={neon2}
          strokeWidth="1"
          fill="none"
          opacity="0.35"
          strokeLinecap="round"
        />
      </>
    );
  }

  if (shape === "coat") {
    const lapelColor = adjustColor(outfit, -20);
    return (
      <>
        <path
          d={`M${shoulderL} 148 Q${waistL - 3} 165 ${waistL - 3} 200 Q100 208 ${waistR + 3} 200 Q${waistR + 3} 165 ${shoulderR} 148 Z`}
          fill={outfit}
        />
        <path
          d={`M${shoulderL + 5} 150 L100 168 L${shoulderR - 5} 150`}
          fill={lapelColor}
          opacity="0.55"
        />
        <circle cx="100" cy="174" r="2" fill={lapelColor} />
        <circle cx="100" cy="182" r="2" fill={lapelColor} />
        <circle cx="100" cy="190" r="2" fill={lapelColor} />
        <path
          d={`M${shoulderL + 3} 150 Q100 165 ${shoulderR - 3} 150`}
          stroke={light}
          strokeWidth="2"
          fill="none"
          opacity="0.4"
        />
      </>
    );
  }

  if (shape === "shorts") {
    return (
      <>
        {/* Tank/shirt */}
        <path
          d={`M${shoulderL} 148 Q${waistL} 165 ${waistL} 200 Q100 207 ${waistR} 200 Q${waistR} 165 ${shoulderR} 148 Z`}
          fill={outfit}
        />
        <path
          d={`M${shoulderL + 5} 148 Q100 162 ${shoulderR - 5} 148`}
          stroke={light}
          strokeWidth="1.5"
          fill="none"
          opacity="0.5"
        />
      </>
    );
  }

  // Default tee
  return (
    <>
      {/* Shirt torso */}
      <path
        d={`M${shoulderL} 148 Q${waistL} 163 ${waistL} 200 Q100 208 ${waistR} 200 Q${waistR} 163 ${shoulderR} 148 Z`}
        fill={outfit}
      />
      {/* Collar */}
      <path
        d={`M${shoulderL + 7} 148 Q100 162 ${shoulderR - 7} 148`}
        stroke={light}
        strokeWidth="2"
        fill="none"
        opacity="0.5"
      />
      {/* Side seam shading */}
      <path
        d={`M${shoulderL + 2} 150 Q${waistL - 2} 172 ${waistL} 200`}
        stroke={dark}
        strokeWidth="1.5"
        fill="none"
        opacity="0.25"
        strokeLinecap="round"
      />
      <path
        d={`M${shoulderR - 2} 150 Q${waistR + 2} 172 ${waistR} 200`}
        stroke={dark}
        strokeWidth="1.5"
        fill="none"
        opacity="0.25"
        strokeLinecap="round"
      />
    </>
  );
}

// ── Lower Body / Legs ────────────────────────────────────────────────────────
function LowerBody({
  outfit,
  skin,
  pantColor,
  shoeColor,
  shape,
  gender,
}: {
  outfit: string;
  skin: string;
  pantColor: string;
  shoeColor: string;
  shape: OutfitShape;
  gender: AvatarGender;
}) {
  // Female: slightly wider hips; Male: straight legs
  const hipL = gender === "female" ? 62 : 67;
  const hipR = gender === "female" ? 138 : 133;
  const kneeL = gender === "female" ? 68 : 72;
  const kneeR = gender === "female" ? 132 : 128;
  const ankleL = gender === "female" ? 72 : 74;
  const ankleR = gender === "female" ? 128 : 126;
  const jeanColor = adjustColor(pantColor, gender === "female" ? 5 : -5);

  if (shape === "dress" || shape === "robe") {
    return (
      <>
        {/* Long flowing skirt bottom */}
        <path
          d={`M${hipL} 205 Q${hipL - 12} 248 ${hipL - 18} 285 L${hipR + 18} 285 Q${hipR + 12} 248 ${hipR} 205 Q100 218 ${hipL} 205 Z`}
          fill={outfit}
          opacity="0.9"
        />
        {/* Skirt fold lines */}
        <path
          d={`M${hipL + 5} 215 Q${hipL - 5} 255 ${hipL - 10} 285`}
          stroke={adjustColor(outfit, -20)}
          strokeWidth="1.5"
          fill="none"
          opacity="0.3"
        />
        <path
          d="M100 218 Q98 255 96 285"
          stroke={adjustColor(outfit, -15)}
          strokeWidth="1"
          fill="none"
          opacity="0.25"
        />
        <path
          d={`M${hipR - 5} 215 Q${hipR + 5} 255 ${hipR + 10} 285`}
          stroke={adjustColor(outfit, -20)}
          strokeWidth="1.5"
          fill="none"
          opacity="0.3"
        />
      </>
    );
  }

  if (shape === "skirt") {
    return (
      <>
        {/* Skirt */}
        <path
          d={`M${hipL} 200 Q${hipL - 10} 240 ${hipL - 16} 285 L${hipR + 16} 285 Q${hipR + 10} 240 ${hipR} 200 Q100 215 ${hipL} 200 Z`}
          fill={adjustColor(pantColor, 10)}
          opacity="0.88"
        />
        <path
          d={`M${hipL + 3} 210 Q${hipL - 4} 252 ${hipL - 8} 285`}
          stroke={adjustColor(pantColor, -15)}
          strokeWidth="1.5"
          fill="none"
          opacity="0.3"
        />
      </>
    );
  }

  if (shape === "shorts") {
    return (
      <>
        {/* Shorts */}
        <path
          d={`M${hipL} 200 L${kneeL} 235 Q${kneeL + 5} 242 ${ankleL + 5} 242 L100 252 L${ankleR - 5} 242 Q${kneeR - 5} 242 ${kneeR} 235 L${hipR} 200 Z`}
          fill={adjustColor(jeanColor, 20)}
        />
        {/* Shorts hem */}
        <path
          d={`M${kneeL} 235 Q100 245 ${kneeR} 235`}
          stroke={adjustColor(jeanColor, -15)}
          strokeWidth="2"
          fill="none"
          opacity="0.5"
        />
        {/* Bare legs */}
        <rect x={ankleL} y="242" width="20" height="32" rx="7" fill={skin} />
        <rect
          x={ankleR - 20}
          y="242"
          width="20"
          height="32"
          rx="7"
          fill={skin}
        />
        {/* Knee shading */}
        <ellipse
          cx={ankleL + 10}
          cy="259"
          rx="7"
          ry="4"
          fill={adjustColor(skin, -12)}
          opacity="0.3"
        />
        <ellipse
          cx={ankleR - 10}
          cy="259"
          rx="7"
          ry="4"
          fill={adjustColor(skin, -12)}
          opacity="0.3"
        />
        {/* Boots */}
        <BootLayer x={ankleL} shoeColor={shoeColor} />
        <BootLayer x={ankleR - 20} shoeColor={shoeColor} />
      </>
    );
  }

  if (shape === "armor") {
    const armorDark = adjustColor(pantColor, -20);
    return (
      <>
        {/* Armored legs */}
        <path
          d={`M${hipL} 200 L${kneeL} 252 L${ankleL + 2} 278 Q${ankleL + 10} 284 ${ankleL + 18} 278 L${kneeL + 12} 252 L100 240 L${kneeR - 12} 252 L${ankleR - 18} 278 Q${ankleR - 10} 284 ${ankleR - 2} 278 L${kneeR} 252 L${hipR} 200 Z`}
          fill={pantColor}
        />
        {/* Knee plates */}
        <ellipse
          cx={kneeL + 6}
          cy="255"
          rx="10"
          ry="7"
          fill={adjustColor(pantColor, 30)}
        />
        <ellipse
          cx={kneeR - 6}
          cy="255"
          rx="10"
          ry="7"
          fill={adjustColor(pantColor, 30)}
        />
        {/* Leg seam */}
        <line
          x1={kneeL + 6}
          y1="200"
          x2={ankleL + 4}
          y2="278"
          stroke={armorDark}
          strokeWidth="1.5"
          opacity="0.4"
        />
        <line
          x1={kneeR - 6}
          y1="200"
          x2={ankleR - 4}
          y2="278"
          stroke={armorDark}
          strokeWidth="1.5"
          opacity="0.4"
        />
        {/* Metal boots */}
        <rect
          x={ankleL}
          y="270"
          width="22"
          height="18"
          rx="5"
          fill={shoeColor}
        />
        <rect
          x={ankleR - 22}
          y="270"
          width="22"
          height="18"
          rx="5"
          fill={shoeColor}
        />
        <rect
          x={ankleL}
          y="282"
          width="22"
          height="6"
          rx="3"
          fill={adjustColor(shoeColor, 25)}
        />
        <rect
          x={ankleR - 22}
          y="282"
          width="22"
          height="6"
          rx="3"
          fill={adjustColor(shoeColor, 25)}
        />
      </>
    );
  }

  if (shape === "leather-jacket") {
    // Dark jeans with leather jacket
    const darkJean = "#2a3a5c";
    return (
      <>
        {/* Dark jeans */}
        <path
          d={`M${hipL} 205 L${kneeL} 258 L${ankleL + 2} 275 Q${ankleL + 10} 280 ${ankleL + 18} 275 L${kneeL + 12} 258 L100 245 L${kneeR - 12} 258 L${ankleR - 18} 275 Q${ankleR - 10} 280 ${ankleR - 2} 275 L${kneeR} 258 L${hipR} 205 Z`}
          fill={darkJean}
        />
        {/* Belt */}
        <rect
          x={hipL}
          y="203"
          width={hipR - hipL}
          height="7"
          rx="2"
          fill={adjustColor(darkJean, -15)}
        />
        <rect x="97" y="203" width="6" height="7" rx="1" fill="#c8a84b" />
        {/* Jeans center seam */}
        <line
          x1="100"
          y1="210"
          x2="100"
          y2="245"
          stroke={adjustColor(darkJean, 15)}
          strokeWidth="1.5"
          opacity="0.4"
        />
        {/* Knee fade */}
        <ellipse
          cx={kneeL + 6}
          cy="258"
          rx="9"
          ry="6"
          fill={adjustColor(darkJean, 20)}
          opacity="0.4"
        />
        <ellipse
          cx={kneeR - 6}
          cy="258"
          rx="9"
          ry="6"
          fill={adjustColor(darkJean, 20)}
          opacity="0.4"
        />
        {/* Ankle boots */}
        <AnkleBootLayer x={ankleL} shoeColor={adjustColor(shoeColor, -10)} />
        <AnkleBootLayer
          x={ankleR - 22}
          shoeColor={adjustColor(shoeColor, -10)}
        />
      </>
    );
  }

  // Default pants/jeans
  return (
    <>
      {/* Pants legs */}
      <path
        d={`M${hipL} 205 L${kneeL} 256 L${ankleL + 2} 276 Q${ankleL + 10} 282 ${ankleL + 18} 276 L${kneeL + 12} 256 L100 244 L${kneeR - 12} 256 L${ankleR - 18} 276 Q${ankleR - 10} 282 ${ankleR - 2} 276 L${kneeR} 256 L${hipR} 205 Z`}
        fill={jeanColor}
      />
      {/* Belt */}
      <rect
        x={hipL}
        y="203"
        width={hipR - hipL}
        height="7"
        rx="2"
        fill={adjustColor(jeanColor, -18)}
      />
      <rect x="97" y="203" width="6" height="7" rx="1" fill="#c8a84b" />
      {/* Pants seam */}
      <line
        x1="100"
        y1="210"
        x2="100"
        y2="244"
        stroke={adjustColor(jeanColor, 12)}
        strokeWidth="1.5"
        opacity="0.4"
      />
      {/* Knee highlight */}
      <ellipse
        cx={kneeL + 6}
        cy="257"
        rx="8"
        ry="5"
        fill={adjustColor(jeanColor, 18)}
        opacity="0.35"
      />
      <ellipse
        cx={kneeR - 6}
        cy="257"
        rx="8"
        ry="5"
        fill={adjustColor(jeanColor, 18)}
        opacity="0.35"
      />
      {/* Shoes */}
      <SneakerLayer x={ankleL} shoeColor={shoeColor} />
      <SneakerLayer x={ankleR - 22} shoeColor={shoeColor} />
    </>
  );
}

function SneakerLayer({ x, shoeColor }: { x: number; shoeColor: string }) {
  return (
    <>
      <ellipse cx={x + 11} cy="280" rx="14" ry="8" fill={shoeColor} />
      <ellipse
        cx={x + 10}
        cy="278"
        rx="12"
        ry="6"
        fill={adjustColor(shoeColor, 22)}
        opacity="0.5"
      />
      {/* Sole */}
      <path
        d={`M${x - 2} 283 Q${x + 11} 288 ${x + 24} 283`}
        stroke={adjustColor(shoeColor, -15)}
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
      />
      {/* Lace line */}
      <line
        x1={x + 4}
        y1="276"
        x2={x + 18}
        y2="276"
        stroke="white"
        strokeWidth="1"
        opacity="0.3"
      />
    </>
  );
}

function BootLayer({ x, shoeColor }: { x: number; shoeColor: string }) {
  return (
    <>
      <rect x={x} y="268" width="20" height="14" rx="5" fill={shoeColor} />
      <ellipse cx={x + 10} cy="282" rx="13" ry="5" fill={shoeColor} />
      <path
        d={`M${x - 1} 283 Q${x + 10} 288 ${x + 21} 283`}
        stroke={adjustColor(shoeColor, -20)}
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
      />
    </>
  );
}

function AnkleBootLayer({ x, shoeColor }: { x: number; shoeColor: string }) {
  const shine = adjustColor(shoeColor, 35);
  return (
    <>
      {/* Boot shaft */}
      <rect x={x} y="264" width="22" height="20" rx="5" fill={shoeColor} />
      {/* Boot sole/toe */}
      <ellipse cx={x + 11} cy="284" rx="13" ry="5.5" fill={shoeColor} />
      {/* Sole outline */}
      <path
        d={`M${x - 1} 286 Q${x + 11} 291 ${x + 23} 286`}
        stroke={adjustColor(shoeColor, -25)}
        strokeWidth="2.5"
        fill="none"
        strokeLinecap="round"
      />
      {/* Leather shine */}
      <path
        d={`M${x + 3} 266 Q${x + 7} 264 ${x + 11} 268`}
        stroke={shine}
        strokeWidth="1.5"
        fill="none"
        strokeLinecap="round"
        opacity="0.5"
      />
      {/* Boot zipper or lace */}
      <line
        x1={x + 11}
        y1="264"
        x2={x + 11}
        y2="282"
        stroke={adjustColor(shoeColor, 20)}
        strokeWidth="1"
        strokeDasharray="2 2"
        opacity="0.5"
      />
    </>
  );
}

// ── Hair Back ────────────────────────────────────────────────────────────────
function HairBack({
  config,
  hair,
  gender,
}: { config: AvatarConfig; hair: string; gender: AvatarGender }) {
  const style = config.hairStyle;
  // Female long-hair styles show hair behind
  const longFemaleStyles = [
    "long",
    "wavy",
    "curly",
    "braided",
    "ponytail",
    "half-up",
    "side-braid",
    "twin-tails",
  ];
  if (gender === "female" && longFemaleStyles.includes(style)) {
    if (style === "twin-tails") {
      return (
        <>
          <path
            d="M62 84 Q40 110 44 148 Q50 165 60 168 Q52 130 56 96 Z"
            fill={hair}
          />
          <path
            d="M138 84 Q160 110 156 148 Q150 165 140 168 Q148 130 144 96 Z"
            fill={hair}
          />
        </>
      );
    }
    if (style === "side-braid") {
      return (
        <path
          d="M138 84 Q162 120 158 162 Q150 178 138 182 Q148 140 144 96 Z"
          fill={hair}
        />
      );
    }
    return (
      <>
        <path
          d="M62 84 Q48 122 52 152 Q58 168 70 172 Q60 132 62 96 Z"
          fill={hair}
        />
        <path
          d="M138 84 Q152 122 148 152 Q142 168 130 172 Q140 132 138 96 Z"
          fill={hair}
        />
      </>
    );
  }
  return null;
}

// ── Hair Front ───────────────────────────────────────────────────────────────
function HairFront({
  config,
  hair,
  gender,
}: { config: AvatarConfig; hair: string; gender: AvatarGender }) {
  const style = config.hairStyle;
  const dark = adjustColor(hair, -25);
  const lighter = adjustColor(hair, 22);

  // ── Female styles ───
  if (gender === "female") {
    switch (style) {
      case "long":
        return (
          <>
            <path
              d="M62 84 Q62 48 100 44 Q138 48 138 84 Q130 57 118 50 Q108 44 100 45 Q92 44 82 50 Q70 57 62 84 Z"
              fill={hair}
            />
            <path
              d="M62 84 Q60 92 62 100"
              stroke={dark}
              strokeWidth="1.5"
              fill="none"
              opacity="0.3"
            />
          </>
        );
      case "wavy":
        return (
          <>
            <path
              d="M62 84 Q63 48 100 44 Q137 48 138 84 Q130 57 118 51 Q108 46 100 47 Q92 46 82 51 Q70 57 62 84 Z"
              fill={hair}
            />
            {/* Wavy ends on shoulders */}
            <path
              d="M62 84 Q58 96 60 108 Q62 120 64 132"
              stroke={hair}
              strokeWidth="6"
              fill="none"
              strokeLinecap="round"
            />
            <path
              d="M138 84 Q142 96 140 108 Q138 120 136 132"
              stroke={hair}
              strokeWidth="6"
              fill="none"
              strokeLinecap="round"
            />
          </>
        );
      case "curly":
        return (
          <>
            <path
              d="M60 86 Q58 52 76 41 Q88 34 100 36 Q112 34 124 41 Q142 52 140 86 Q134 57 122 50 Q111 44 100 46 Q89 44 78 50 Q66 57 60 86 Z"
              fill={hair}
            />
            <circle cx="65" cy="62" r="10" fill={hair} />
            <circle cx="78" cy="48" r="9" fill={hair} />
            <circle cx="91" cy="42" r="9" fill={hair} />
            <circle cx="100" cy="40" r="9" fill={hair} />
            <circle cx="109" cy="42" r="9" fill={hair} />
            <circle cx="122" cy="48" r="9" fill={hair} />
            <circle cx="135" cy="62" r="10" fill={hair} />
            {/* Curly sides */}
            <circle cx="60" cy="90" r="7" fill={hair} />
            <circle cx="140" cy="90" r="7" fill={hair} />
          </>
        );
      case "bun":
        return (
          <>
            <path
              d="M64 84 Q66 54 100 50 Q134 54 136 84 Q128 62 118 54 Q109 50 100 51 Q91 50 82 54 Q72 62 64 84 Z"
              fill={hair}
            />
            <circle cx="100" cy="35" r="20" fill={hair} />
            <circle cx="100" cy="35" r="14" fill={hair} opacity="0.75" />
            <path
              d="M86 35 Q100 25 114 35"
              stroke={dark}
              strokeWidth="1.5"
              fill="none"
              opacity="0.3"
            />
            <circle cx="95" cy="30" r="2.5" fill={lighter} opacity="0.3" />
          </>
        );
      case "braided":
        return (
          <>
            <path
              d="M62 84 Q62 48 100 44 Q138 48 138 84 Q130 57 118 50 Q108 44 100 45 Q92 44 82 50 Q70 57 62 84 Z"
              fill={hair}
            />
            {/* Braid going down one side */}
            <path
              d="M62 84 Q56 110 58 140 Q60 160 64 172"
              stroke={hair}
              strokeWidth="7"
              fill="none"
              strokeLinecap="round"
            />
            <path
              d="M59 100 Q64 110 59 120 Q54 130 59 140"
              stroke={dark}
              strokeWidth="1.5"
              fill="none"
              opacity="0.4"
            />
          </>
        );
      case "ponytail":
        return (
          <>
            <path
              d="M62 84 Q62 48 100 44 Q138 48 138 84 Q130 57 118 50 Q108 44 100 45 Q92 44 82 50 Q70 57 62 84 Z"
              fill={hair}
            />
            {/* Ponytail flowing back */}
            <path
              d="M100 48 Q112 40 118 32 Q128 20 135 10"
              stroke={hair}
              strokeWidth="10"
              strokeLinecap="round"
              fill="none"
            />
            <path
              d="M100 48 Q110 38 114 28"
              stroke={lighter}
              strokeWidth="3"
              strokeLinecap="round"
              fill="none"
              opacity="0.3"
            />
            {/* Hair tie */}
            <circle cx="118" cy="32" r="4" fill="#ff69b4" />
          </>
        );
      case "half-up":
        return (
          <>
            <path
              d="M62 84 Q62 48 100 44 Q138 48 138 84 Q130 57 118 50 Q108 44 100 45 Q92 44 82 50 Q70 57 62 84 Z"
              fill={hair}
            />
            {/* Upper section pulled back */}
            <path
              d="M78 56 Q100 44 122 56 Q100 50 78 56 Z"
              fill={dark}
              opacity="0.3"
            />
            {/* Mini bun at top */}
            <ellipse cx="100" cy="48" rx="12" ry="8" fill={hair} />
            <path
              d="M92 48 Q100 43 108 48"
              stroke={dark}
              strokeWidth="1"
              fill="none"
              opacity="0.3"
            />
          </>
        );
      case "side-braid":
        return (
          <>
            <path
              d="M62 84 Q62 48 100 44 Q138 48 138 84 Q130 57 118 50 Q108 44 100 45 Q92 44 82 50 Q70 57 62 84 Z"
              fill={hair}
            />
            {/* Braid */}
            <path
              d="M140 88 Q148 112 145 140 Q143 158 139 168"
              stroke={hair}
              strokeWidth="8"
              fill="none"
              strokeLinecap="round"
            />
            <path
              d="M142 100 Q147 112 142 124 Q137 136 142 148"
              stroke={dark}
              strokeWidth="1.5"
              fill="none"
              opacity="0.4"
            />
          </>
        );
      case "twin-tails":
        return (
          <>
            <path
              d="M62 84 Q62 48 100 44 Q138 48 138 84 Q130 57 118 50 Q108 44 100 45 Q92 44 82 50 Q70 57 62 84 Z"
              fill={hair}
            />
            {/* Left tail */}
            <path
              d="M62 84 Q48 105 46 130 Q44 150 48 165"
              stroke={hair}
              strokeWidth="9"
              fill="none"
              strokeLinecap="round"
            />
            {/* Right tail */}
            <path
              d="M138 84 Q152 105 154 130 Q156 150 152 165"
              stroke={hair}
              strokeWidth="9"
              fill="none"
              strokeLinecap="round"
            />
            {/* Ties */}
            <circle cx="62" cy="84" r="4" fill="#ff69b4" />
            <circle cx="138" cy="84" r="4" fill="#ff69b4" />
          </>
        );
      case "buzz":
        return (
          <path
            d="M64 86 Q66 62 78 52 Q90 46 100 47 Q110 46 122 52 Q134 62 136 86 Q128 66 118 58 Q109 53 100 54 Q91 53 82 58 Q72 66 64 86 Z"
            fill={hair}
            opacity="0.88"
          />
        );
      case "bob":
        return (
          <>
            <path
              d="M62 84 Q62 50 100 46 Q138 50 138 84 Q130 60 118 52 Q108 46 100 47 Q92 46 82 52 Q70 60 62 84 Z"
              fill={hair}
            />
            {/* Bob cut ends at chin level — side curtains */}
            <path
              d="M62 84 Q58 102 60 120 Q62 130 68 134 Q60 110 62 84 Z"
              fill={hair}
            />
            <path
              d="M138 84 Q142 102 140 120 Q138 130 132 134 Q140 110 138 84 Z"
              fill={hair}
            />
          </>
        );
      case "afro":
        return (
          <>
            {/* Afro — large rounded cloud of curls */}
            <circle cx="100" cy="62" r="38" fill={hair} />
            {/* Texture bumps */}
            <circle cx="68" cy="72" r="12" fill={adjustColor(hair, -8)} />
            <circle cx="132" cy="72" r="12" fill={adjustColor(hair, -8)} />
            <circle cx="100" cy="35" r="14" fill={adjustColor(hair, -5)} />
            <circle cx="78" cy="46" r="11" fill={adjustColor(hair, -6)} />
            <circle cx="122" cy="46" r="11" fill={adjustColor(hair, -6)} />
            {/* Base coverage */}
            <path
              d="M62 84 Q60 68 72 58 Q88 48 100 47 Q112 48 128 58 Q140 68 138 84 Q130 70 100 66 Q70 70 62 84 Z"
              fill={hair}
            />
          </>
        );
      default: // short female
        return (
          <path
            d="M62 84 Q62 50 100 46 Q138 50 138 84 Q130 59 119 52 Q108 46 100 47 Q92 46 81 52 Q70 59 62 84 Z"
            fill={hair}
          />
        );
    }
  }

  // ── Male styles ───
  switch (style) {
    case "short-fade":
      return (
        <>
          <path
            d="M63 86 Q65 57 80 50 Q91 45 100 46 Q109 45 120 50 Q135 57 137 86 Q128 65 118 57 Q109 52 100 53 Q91 52 82 57 Q72 65 63 86 Z"
            fill={hair}
          />
          {/* Fade sides — lighter color near ears */}
          <path
            d="M63 86 Q62 95 64 104"
            stroke={adjustColor(hair, 20)}
            strokeWidth="5"
            fill="none"
            strokeLinecap="round"
            opacity="0.5"
          />
          <path
            d="M137 86 Q138 95 136 104"
            stroke={adjustColor(hair, 20)}
            strokeWidth="5"
            fill="none"
            strokeLinecap="round"
            opacity="0.5"
          />
        </>
      );
    case "undercut":
      return (
        <>
          {/* Top hair swept to side */}
          <path
            d="M65 86 Q67 52 100 46 Q135 52 137 84 Q120 56 100 52 Q80 50 65 86 Z"
            fill={hair}
          />
          {/* Side swept top */}
          <path
            d="M80 54 Q95 44 118 48 Q100 44 80 54 Z"
            fill={lighter}
            opacity="0.3"
          />
          {/* Undercut sides */}
          <path
            d="M63 88 Q62 100 64 110"
            stroke={adjustColor(hair, 30)}
            strokeWidth="4"
            fill="none"
            strokeLinecap="round"
            opacity="0.35"
          />
          <path
            d="M137 88 Q138 100 136 110"
            stroke={adjustColor(hair, 30)}
            strokeWidth="4"
            fill="none"
            strokeLinecap="round"
            opacity="0.35"
          />
        </>
      );
    case "curly":
      return (
        <>
          <path
            d="M62 86 Q60 52 78 41 Q90 34 100 36 Q110 34 122 41 Q140 52 138 86 Q132 57 120 50 Q110 44 100 46 Q90 44 80 50 Q68 57 62 86 Z"
            fill={hair}
          />
          <circle cx="66" cy="63" r="9" fill={hair} />
          <circle cx="78" cy="50" r="8" fill={hair} />
          <circle cx="90" cy="44" r="8" fill={hair} />
          <circle cx="100" cy="42" r="8" fill={hair} />
          <circle cx="110" cy="44" r="8" fill={hair} />
          <circle cx="122" cy="50" r="8" fill={hair} />
          <circle cx="134" cy="63" r="9" fill={hair} />
        </>
      );
    case "spiky":
      return (
        <>
          <path
            d="M63 85 Q65 57 100 51 Q135 57 137 85 Q129 64 117 56 Q108 52 100 53 Q92 52 83 56 Q71 64 63 85 Z"
            fill={hair}
          />
          <polygon points="76,58 72,36 82,55" fill={hair} />
          <polygon points="88,50 86,29 94,48" fill={hair} />
          <polygon points="100,48 98,26 104,46" fill={hair} />
          <polygon points="112,50 114,29 106,48" fill={hair} />
          <polygon points="124,58 128,36 118,55" fill={hair} />
        </>
      );
    case "pompadour":
      return (
        <>
          <path
            d="M63 86 Q65 58 100 52 Q135 58 137 86 Q129 65 118 57 Q108 52 100 53 Q92 52 82 57 Q71 65 63 86 Z"
            fill={hair}
          />
          {/* Pompadour volume at front */}
          <path
            d="M78 56 Q100 38 122 56 Q110 32 100 30 Q90 32 78 56 Z"
            fill={hair}
          />
          {/* Shine on pompadour */}
          <path
            d="M88 48 Q100 38 112 48"
            stroke={lighter}
            strokeWidth="2"
            fill="none"
            opacity="0.3"
            strokeLinecap="round"
          />
        </>
      );
    case "buzz":
      return (
        <path
          d="M64 87 Q66 61 79 52 Q91 46 100 47 Q109 46 121 52 Q134 61 136 87 Q128 66 118 58 Q109 53 100 54 Q91 53 82 58 Q72 66 64 87 Z"
          fill={hair}
          opacity="0.85"
        />
      );
    case "long-back":
      return (
        <>
          <path
            d="M63 86 Q65 52 100 47 Q135 52 137 86 Q129 60 118 52 Q108 47 100 48 Q92 47 82 52 Q71 60 63 86 Z"
            fill={hair}
          />
        </>
      );
    case "bun":
      return (
        <>
          <path
            d="M64 84 Q66 54 100 50 Q134 54 136 84 Q128 62 118 54 Q109 50 100 51 Q91 50 82 54 Q72 62 64 84 Z"
            fill={hair}
          />
          <circle cx="100" cy="37" r="17" fill={hair} />
        </>
      );
    case "wavy":
      return (
        <path
          d="M63 84 Q64 49 100 45 Q136 49 137 84 Q129 60 118 53 Q108 48 100 49 Q92 48 82 53 Q71 60 63 84 Z"
          fill={hair}
        />
      );
    case "afro":
      return (
        <>
          <circle cx="100" cy="65" r="36" fill={hair} />
          <circle cx="70" cy="75" r="11" fill={adjustColor(hair, -8)} />
          <circle cx="130" cy="75" r="11" fill={adjustColor(hair, -8)} />
          <circle cx="100" cy="38" r="13" fill={adjustColor(hair, -5)} />
          <circle cx="80" cy="50" r="10" fill={adjustColor(hair, -6)} />
          <circle cx="120" cy="50" r="10" fill={adjustColor(hair, -6)} />
          <path
            d="M63 86 Q62 70 74 60 Q88 50 100 48 Q112 50 126 60 Q138 70 137 86 Q128 72 100 68 Q72 72 63 86 Z"
            fill={hair}
          />
        </>
      );
    default: // short male default
      return (
        <path
          d="M63 86 Q65 57 100 52 Q135 57 137 86 Q129 64 118 56 Q108 52 100 53 Q92 52 82 56 Q71 64 63 86 Z"
          fill={hair}
        />
      );
  }
}

// ── Nose ─────────────────────────────────────────────────────────────────────
function Nose({
  skin,
  skinLight,
  gender,
}: { skin: string; skinLight: string; gender: AvatarGender }) {
  if (gender === "male") {
    // Slightly more defined nose
    return (
      <>
        <ellipse cx="100" cy="98" rx="4" ry="2.5" fill={skinLight} />
        <path
          d="M96 94 Q100 101 104 94"
          stroke={`${skin}88`}
          strokeWidth="1.5"
          fill="none"
          strokeLinecap="round"
        />
        <circle cx="96" cy="99" r="1.5" fill={`${skin}55`} />
        <circle cx="104" cy="99" r="1.5" fill={`${skin}55`} />
      </>
    );
  }
  return (
    <>
      <ellipse cx="100" cy="98" rx="3" ry="2" fill={skinLight} />
      <path
        d="M97 96 Q100 101 103 96"
        stroke={`${skin}88`}
        strokeWidth="1.2"
        fill="none"
        strokeLinecap="round"
      />
    </>
  );
}

// ── Cheek blush ───────────────────────────────────────────────────────────────
function CheekBlush({ gender }: { gender: AvatarGender }) {
  if (gender === "male") {
    // Subtle for male
    return (
      <>
        <ellipse cx="74" cy="100" rx="7" ry="4" fill="#FFB5C8" opacity="0.2" />
        <ellipse cx="126" cy="100" rx="7" ry="4" fill="#FFB5C8" opacity="0.2" />
      </>
    );
  }
  return (
    <>
      <ellipse cx="74" cy="101" rx="9" ry="5.5" fill="#FFB5C8" opacity="0.38" />
      <ellipse
        cx="126"
        cy="101"
        rx="9"
        ry="5.5"
        fill="#FFB5C8"
        opacity="0.38"
      />
    </>
  );
}

// ── Eyebrows ─────────────────────────────────────────────────────────────────
function Eyebrows({
  config,
  hair,
  gender,
}: { config: AvatarConfig; hair: string; gender: AvatarGender }) {
  const color = hair === "#E8E8E8" ? "#999" : hair;
  // Male eyebrows slightly lower and thicker by default
  const yOffset = gender === "male" ? 2 : 0;

  switch (config.eyebrowStyle) {
    case "straight":
      return (
        <>
          <line
            x1="74"
            y1={72 + yOffset}
            x2="88"
            y2={72 + yOffset}
            stroke={color}
            strokeWidth={gender === "male" ? 3 : 2.5}
            strokeLinecap="round"
          />
          <line
            x1="112"
            y1={72 + yOffset}
            x2="126"
            y2={72 + yOffset}
            stroke={color}
            strokeWidth={gender === "male" ? 3 : 2.5}
            strokeLinecap="round"
          />
        </>
      );
    case "arched":
      return (
        <>
          <path
            d={`M74 ${75 + yOffset} Q81 ${69 + yOffset} 88 ${73 + yOffset}`}
            stroke={color}
            strokeWidth="2.5"
            fill="none"
            strokeLinecap="round"
          />
          <path
            d={`M112 ${73 + yOffset} Q119 ${69 + yOffset} 126 ${75 + yOffset}`}
            stroke={color}
            strokeWidth="2.5"
            fill="none"
            strokeLinecap="round"
          />
        </>
      );
    case "thick":
      return (
        <>
          <path
            d={`M72 ${76 + yOffset} Q81 ${69 + yOffset} 90 ${73 + yOffset}`}
            stroke={color}
            strokeWidth="4.5"
            fill="none"
            strokeLinecap="round"
          />
          <path
            d={`M110 ${73 + yOffset} Q119 ${69 + yOffset} 128 ${76 + yOffset}`}
            stroke={color}
            strokeWidth="4.5"
            fill="none"
            strokeLinecap="round"
          />
        </>
      );
    case "furrowed":
      return (
        <>
          <path
            d={`M74 ${72 + yOffset} Q81 ${76 + yOffset} 88 ${72 + yOffset}`}
            stroke={color}
            strokeWidth="3"
            fill="none"
            strokeLinecap="round"
          />
          <path
            d={`M112 ${72 + yOffset} Q119 ${76 + yOffset} 126 ${72 + yOffset}`}
            stroke={color}
            strokeWidth="3"
            fill="none"
            strokeLinecap="round"
          />
        </>
      );
    default:
      return (
        <>
          <path
            d={`M74 ${75 + yOffset} Q81 ${69 + yOffset} 88 ${73 + yOffset}`}
            stroke={color}
            strokeWidth="2.5"
            fill="none"
            strokeLinecap="round"
          />
          <path
            d={`M112 ${73 + yOffset} Q119 ${69 + yOffset} 126 ${75 + yOffset}`}
            stroke={color}
            strokeWidth="2.5"
            fill="none"
            strokeLinecap="round"
          />
        </>
      );
  }
}

// ── Eyes ─────────────────────────────────────────────────────────────────────
function Eyes({
  config,
  gender,
}: { config: AvatarConfig; gender: AvatarGender }) {
  const scale = gender === "female" ? 1 : 0.9;
  const rx = 8 * scale;
  const irisColor = EYE_IRIS_COLORS[config.eyeColor ?? "brown"] ?? "#3B2314";
  const isCyber = config.eyeColor === "cyber";
  const pupilColor = isCyber ? "#00CFFF" : "#1a1a1a";
  const lashColor = "#1a1a1a";

  // Shared eye renderer for both left (cx=82) and right (cx=118)
  function renderEye(cx: number) {
    const lx = cx - 2 * scale;
    const x0 = cx - 8;
    const x1 = cx + 8;
    switch (config.eyeShape) {
      case "almond":
        return (
          <g key={cx}>
            <path
              d={`M${x0} 86 Q${cx} 80 ${x1} 86 Q${cx} 92 ${x0} 86 Z`}
              fill="white"
            />
            <ellipse cx={cx} cy="86" rx="4" ry="4.5" fill={irisColor} />
            <circle cx={cx - 1.5} cy="84" r="1.3" fill="white" />
            <path
              d={`M${x0} 86 Q${cx} 80 ${x1} 86`}
              stroke={irisColor}
              strokeWidth="1"
              fill="none"
            />
          </g>
        );
      case "wide":
        return (
          <g key={cx}>
            <ellipse cx={cx} cy="86" rx={rx * 1.1} ry={rx * 1.1} fill="white" />
            <ellipse
              cx={cx}
              cy="86"
              rx={rx * 0.75}
              ry={rx * 0.75}
              fill={irisColor}
            />
            <circle cx={cx - 2} cy="84" r="2" fill="white" />
            <ellipse cx={cx} cy="86" rx="3" ry="3" fill={pupilColor} />
          </g>
        );
      case "sleepy":
        return (
          <g key={cx}>
            <path d={`M${x0} 88 Q${cx} 94 ${x1} 88`} fill="#f0e8e0" />
            <path
              d={`M${x0} 88 Q${cx} 82 ${x1} 88`}
              stroke={irisColor}
              strokeWidth="2"
              fill="#f0e8e0"
              strokeLinecap="round"
            />
            <ellipse cx={cx} cy="88" rx="4" ry="2.5" fill={irisColor} />
            <circle cx={cx - 1.5} cy="86.5" r="1" fill="white" />
          </g>
        );
      case "sparkle":
        return (
          <g key={cx}>
            <ellipse cx={cx} cy="86" rx={rx} ry={rx} fill="white" />
            <ellipse
              cx={cx}
              cy="86"
              rx={rx * 0.625}
              ry={rx * 0.625}
              fill="#6B3FA0"
            />
            <circle cx={cx - 2} cy="84" r="2" fill="white" opacity="0.85" />
            <circle cx={cx + 3} cy="88" r="1" fill="white" opacity="0.6" />
            <circle cx={x0} cy="79" r="1" fill="#FFD700" opacity="0.7" />
            <circle cx={x1} cy="78" r="1.2" fill="#FFD700" opacity="0.7" />
          </g>
        );
      default: // round
        return (
          <g key={cx}>
            <ellipse cx={cx} cy="86" rx={rx} ry={rx} fill="white" />
            <ellipse
              cx={cx}
              cy="86"
              rx={rx * 0.625}
              ry={rx * 0.625}
              fill={irisColor}
            />
            <circle cx={lx} cy="84" r={1.5 * scale} fill="white" />
            <ellipse
              cx={cx}
              cy="86"
              rx={rx * 0.26}
              ry={rx * 0.26}
              fill={pupilColor}
            />
            {isCyber && (
              <ellipse
                cx={cx}
                cy="86"
                rx={rx * 0.8}
                ry={rx * 0.8}
                fill="none"
                stroke="#00E5FF"
                strokeWidth="0.5"
                opacity="0.6"
              />
            )}
          </g>
        );
    }
  }

  return (
    <g className="avatar-blink-group">
      {renderEye(82)}
      {renderEye(118)}
      {gender === "female" &&
        (config.eyeShape === "round" ||
          config.eyeShape === "almond" ||
          config.eyeShape === "sparkle") && (
          <>
            <path
              d="M74 82 Q78 78 82 80 Q86 78 90 82"
              stroke={lashColor}
              strokeWidth="1.5"
              fill="none"
              opacity="0.7"
            />
            <path
              d="M110 82 Q114 78 118 80 Q122 78 126 82"
              stroke={lashColor}
              strokeWidth="1.5"
              fill="none"
              opacity="0.7"
            />
          </>
        )}
    </g>
  );
}

// ── Mouth ────────────────────────────────────────────────────────────────────
function Mouth({
  config,
  gender,
}: { config: AvatarConfig; gender: AvatarGender }) {
  const strokeW = gender === "male" ? "2.2" : "2";
  switch (config.mouthStyle) {
    case "smile":
      return (
        <>
          <path
            d="M88 111 Q100 121 112 111"
            stroke="#C0725A"
            strokeWidth={strokeW}
            fill="none"
            strokeLinecap="round"
          />
          <path d="M88 111 Q100 119 112 111" fill="#E8897A" opacity="0.55" />
        </>
      );
    case "big-smile":
      return (
        <>
          <path
            d="M84 109 Q100 125 116 109"
            stroke="#C0725A"
            strokeWidth={strokeW}
            fill="none"
            strokeLinecap="round"
          />
          <path d="M84 109 Q100 123 116 109" fill="#E05C5C" />
          <path
            d="M88 114 Q100 118 112 114 Q100 121 88 114 Z"
            fill="white"
            opacity="0.8"
          />
        </>
      );
    case "neutral":
      return (
        <line
          x1="90"
          y1="113"
          x2="110"
          y2="113"
          stroke="#C0725A"
          strokeWidth={strokeW}
          strokeLinecap="round"
        />
      );
    case "smirk":
      return (
        <path
          d="M90 113 Q102 120 114 112"
          stroke="#C0725A"
          strokeWidth={strokeW}
          fill="none"
          strokeLinecap="round"
        />
      );
    case "focused":
      return (
        <>
          <line
            x1="91"
            y1="113"
            x2="109"
            y2="113"
            stroke="#C0725A"
            strokeWidth={strokeW}
            strokeLinecap="round"
          />
          <line
            x1="94"
            y1="110"
            x2="94"
            y2="113"
            stroke="#C0725A"
            strokeWidth="1"
            strokeLinecap="round"
            opacity="0.5"
          />
          <line
            x1="106"
            y1="110"
            x2="106"
            y2="113"
            stroke="#C0725A"
            strokeWidth="1"
            strokeLinecap="round"
            opacity="0.5"
          />
        </>
      );
    default:
      return (
        <path
          d="M88 111 Q100 121 112 111"
          stroke="#C0725A"
          strokeWidth={strokeW}
          fill="none"
          strokeLinecap="round"
        />
      );
  }
}

// ── Accessory ────────────────────────────────────────────────────────────────
function Accessory({ config }: { config: AvatarConfig }) {
  switch (config.accessory) {
    case "glasses":
      return (
        <>
          <ellipse
            cx="82"
            cy="86"
            rx="11"
            ry="8"
            stroke="#555"
            strokeWidth="2"
            fill="none"
          />
          <ellipse
            cx="118"
            cy="86"
            rx="11"
            ry="8"
            stroke="#555"
            strokeWidth="2"
            fill="none"
          />
          <line
            x1="93"
            y1="86"
            x2="107"
            y2="86"
            stroke="#555"
            strokeWidth="1.5"
          />
          <line
            x1="71"
            y1="86"
            x2="58"
            y2="89"
            stroke="#555"
            strokeWidth="1.5"
          />
          <line
            x1="129"
            y1="86"
            x2="142"
            y2="89"
            stroke="#555"
            strokeWidth="1.5"
          />
        </>
      );
    case "sunglasses":
      return (
        <>
          <rect
            x="71"
            y="81"
            width="22"
            height="12"
            rx="5"
            fill="#1a1a1a"
            opacity="0.85"
          />
          <rect
            x="107"
            y="81"
            width="22"
            height="12"
            rx="5"
            fill="#1a1a1a"
            opacity="0.85"
          />
          <line
            x1="93"
            y1="87"
            x2="107"
            y2="87"
            stroke="#333"
            strokeWidth="1.5"
          />
          <line
            x1="71"
            y1="87"
            x2="58"
            y2="90"
            stroke="#333"
            strokeWidth="1.5"
          />
          <line
            x1="129"
            y1="87"
            x2="142"
            y2="90"
            stroke="#333"
            strokeWidth="1.5"
          />
          <line
            x1="76"
            y1="84"
            x2="83"
            y2="84"
            stroke="white"
            strokeWidth="1.5"
            opacity="0.4"
            strokeLinecap="round"
          />
          <line
            x1="112"
            y1="84"
            x2="119"
            y2="84"
            stroke="white"
            strokeWidth="1.5"
            opacity="0.4"
            strokeLinecap="round"
          />
        </>
      );
    case "earrings":
      return (
        <>
          <circle
            cx="60"
            cy="93"
            r="4"
            fill="#F4C14D"
            stroke="#D4A017"
            strokeWidth="1"
          />
          <circle
            cx="140"
            cy="93"
            r="4"
            fill="#F4C14D"
            stroke="#D4A017"
            strokeWidth="1"
          />
        </>
      );
    case "headband":
      return (
        <>
          <path
            d="M64 68 Q100 60 136 68"
            stroke="#E91E8C"
            strokeWidth="7"
            fill="none"
            strokeLinecap="round"
          />
          <path
            d="M64 68 Q100 60 136 68"
            stroke="#FF69B4"
            strokeWidth="4"
            fill="none"
            strokeLinecap="round"
            opacity="0.5"
          />
          <path d="M93 62 Q100 57 107 62 Q100 67 93 62 Z" fill="#FF1493" />
          <circle cx="100" cy="62" r="2.5" fill="#FF69B4" />
        </>
      );
    case "vr-headset":
      return (
        <>
          {/* Meta Quest-style VR headset */}
          <rect x="62" y="78" width="76" height="24" rx="8" fill="#1a1a2e" />
          <rect x="64" y="80" width="72" height="20" rx="7" fill="#16213e" />
          {/* Lenses */}
          <ellipse cx="82" cy="90" rx="12" ry="9" fill="#0f3460" />
          <ellipse cx="82" cy="90" rx="10" ry="7" fill="#1a1a4a" />
          <ellipse cx="82" cy="90" rx="7" ry="5" fill="#00CFFF" opacity="0.3" />
          <ellipse cx="118" cy="90" rx="12" ry="9" fill="#0f3460" />
          <ellipse cx="118" cy="90" rx="10" ry="7" fill="#1a1a4a" />
          <ellipse
            cx="118"
            cy="90"
            rx="7"
            ry="5"
            fill="#00CFFF"
            opacity="0.3"
          />
          {/* Bridge */}
          <rect x="92" y="87" width="16" height="6" rx="2" fill="#0f3460" />
          {/* Strap */}
          <path
            d="M62 90 Q50 90 48 92"
            stroke="#1a1a2e"
            strokeWidth="4"
            fill="none"
            strokeLinecap="round"
          />
          <path
            d="M138 90 Q150 90 152 92"
            stroke="#1a1a2e"
            strokeWidth="4"
            fill="none"
            strokeLinecap="round"
          />
          {/* LED strip */}
          <path
            d="M66 82 Q100 80 134 82"
            stroke="#00E5FF"
            strokeWidth="1"
            fill="none"
            opacity="0.6"
            strokeLinecap="round"
          />
        </>
      );
    case "ar-glasses":
      return (
        <>
          {/* HoloLens-style AR glasses */}
          {/* Thin frame */}
          <ellipse
            cx="82"
            cy="86"
            rx="13"
            ry="9"
            stroke="#C0C0C0"
            strokeWidth="1.5"
            fill="none"
          />
          <ellipse
            cx="118"
            cy="86"
            rx="13"
            ry="9"
            stroke="#C0C0C0"
            strokeWidth="1.5"
            fill="none"
          />
          {/* Holographic tint */}
          <ellipse
            cx="82"
            cy="86"
            rx="11"
            ry="7"
            fill="#00E5FF"
            opacity="0.12"
          />
          <ellipse
            cx="118"
            cy="86"
            rx="11"
            ry="7"
            fill="#00E5FF"
            opacity="0.12"
          />
          {/* Lens reflection */}
          <path
            d="M74 82 Q82 80 90 82"
            stroke="white"
            strokeWidth="1"
            fill="none"
            opacity="0.4"
            strokeLinecap="round"
          />
          <path
            d="M110 82 Q118 80 126 82"
            stroke="white"
            strokeWidth="1"
            fill="none"
            opacity="0.4"
            strokeLinecap="round"
          />
          {/* Bridge */}
          <line
            x1="95"
            y1="86"
            x2="105"
            y2="86"
            stroke="#C0C0C0"
            strokeWidth="1.5"
          />
          {/* Temples */}
          <line
            x1="69"
            y1="87"
            x2="57"
            y2="90"
            stroke="#C0C0C0"
            strokeWidth="1.5"
          />
          <line
            x1="131"
            y1="87"
            x2="143"
            y2="90"
            stroke="#C0C0C0"
            strokeWidth="1.5"
          />
          {/* AR data indicator */}
          <circle cx="90" cy="80" r="1.5" fill="#00E5FF" opacity="0.8" />
          <path
            d="M90 78 L92 75"
            stroke="#00E5FF"
            strokeWidth="0.8"
            fill="none"
            opacity="0.6"
          />
        </>
      );
    case "cap":
      return (
        <>
          {/* Baseball cap */}
          <path
            d="M62 72 Q62 52 100 48 Q138 52 138 72 Q130 62 100 60 Q70 62 62 72 Z"
            fill="#2563eb"
          />
          {/* Brim */}
          <path
            d="M56 74 Q100 68 144 74 Q138 80 100 78 Q62 80 56 74 Z"
            fill="#1d4ed8"
          />
          {/* Button on top */}
          <circle cx="100" cy="48" r="3" fill="#1d4ed8" />
          {/* Seam lines */}
          <path
            d="M100 48 Q96 60 90 72"
            stroke="#1d4ed8"
            strokeWidth="1"
            fill="none"
            opacity="0.5"
          />
          <path
            d="M100 48 Q104 60 110 72"
            stroke="#1d4ed8"
            strokeWidth="1"
            fill="none"
            opacity="0.5"
          />
        </>
      );
    default:
      return null;
  }
}
