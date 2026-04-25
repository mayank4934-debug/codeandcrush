import type { CSSProperties } from "react";

export type AvatarConfig = {
  skinTone: string;
  hairStyle: string;
  hairColor: string;
  eyeShape: string;
  eyebrowStyle: string;
  mouthStyle: string;
  outfitColor: string;
  accessory: string;
  /** Optional: equipped store outfit id, used to pick outfit shape */
  equippedOutfitId?: string;
};

export const DEFAULT_AVATAR_CONFIG: AvatarConfig = {
  skinTone: "medium-light",
  hairStyle: "long",
  hairColor: "black",
  eyeShape: "round",
  eyebrowStyle: "arched",
  mouthStyle: "smile",
  outfitColor: "#7c3aed",
  accessory: "none",
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
  gray: "#9B9B9B",
  white: "#E8E8E8",
  blue: "#4A90D9",
  purple: "#8E44AD",
  pink: "#FF69B4",
};

// Outfit shape hinting based on id prefix
type OutfitShape =
  | "tee"
  | "dress"
  | "shorts"
  | "skirt"
  | "robe"
  | "armor"
  | "coat";

function getOutfitShape(id: string): OutfitShape {
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
    id.includes("snowflake-coat") ||
    id.includes("tuxedo")
  )
    return "coat";
  return "tee";
}

const FALLBACK_SKIN = "#F5C89A";
const FALLBACK_HAIR = "#1a1a1a";

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
  const skin = SKIN_TONES[config.skinTone] ?? FALLBACK_SKIN;
  const hair = HAIR_COLORS[config.hairColor] ?? FALLBACK_HAIR;
  const outfit = config.outfitColor ?? "#7c3aed";
  const skinLight = `${skin}88`;
  const outfitShape = getOutfitShape(config.equippedOutfitId ?? "tee");

  // A darker shade for pants/legs area
  const pantColor = adjustColor(outfit, -40);
  const shoeColor = "#4a3728";

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 200 280"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ ...style, transition: "all 0.2s ease" }}
      className={className}
      role="img"
      aria-label="Avatar"
    >
      <title>Avatar</title>

      {/* ── Background ── */}
      <rect width="200" height="280" rx="8" fill={`${outfit}14`} />

      {/* ── Full body layers (bottom to top) ── */}
      <LowerBody
        outfit={outfit}
        skin={skin}
        pantColor={pantColor}
        shoeColor={shoeColor}
        shape={outfitShape}
      />
      <UpperBody outfit={outfit} skin={skin} shape={outfitShape} />

      {/* ── Hair Back ── */}
      <HairBack config={config} hair={hair} />

      {/* ── Head ── */}
      <ellipse cx="100" cy="82" rx="40" ry="44" fill={skin} />

      {/* ── Ears ── */}
      <ellipse cx="60" cy="86" rx="7" ry="9" fill={skin} />
      <ellipse cx="60" cy="86" rx="4" ry="6" fill={skinLight} />
      <ellipse cx="140" cy="86" rx="7" ry="9" fill={skin} />
      <ellipse cx="140" cy="86" rx="4" ry="6" fill={skinLight} />

      {/* ── Hair Front ── */}
      <HairFront config={config} hair={hair} />

      {/* ── Eyebrows ── */}
      <Eyebrows config={config} hair={hair} />

      {/* ── Eyes ── */}
      <Eyes config={config} />

      {/* ── Nose ── */}
      <ellipse cx="100" cy="97" rx="3" ry="2" fill={skinLight} />
      <path
        d="M97 95 Q100 100 103 95"
        stroke={`${skin}88`}
        strokeWidth="1.2"
        fill="none"
        strokeLinecap="round"
      />

      {/* ── Cheek blush ── */}
      <ellipse cx="74" cy="100" rx="8" ry="5" fill="#FFB5C8" opacity="0.4" />
      <ellipse cx="126" cy="100" rx="8" ry="5" fill="#FFB5C8" opacity="0.4" />

      {/* ── Mouth ── */}
      <Mouth config={config} />

      {/* ── Accessories ── */}
      <Accessory config={config} />
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

// ── Upper Body / Torso ───────────────────────────────────────────────────────
function UpperBody({
  outfit,
  skin,
  shape,
}: { outfit: string; skin: string; shape: OutfitShape }) {
  if (shape === "dress") {
    return (
      <>
        {/* Neck */}
        <rect x="90" y="122" width="20" height="15" rx="4" fill={skin} />
        {/* Dress torso flares out */}
        <path
          d="M40 280 Q48 230 60 210 Q72 195 90 188 Q95 185 100 184 Q105 185 110 188 Q128 195 140 210 Q152 230 160 280 Z"
          fill={outfit}
        />
        {/* Dress bodice */}
        <path
          d="M60 210 Q72 195 90 188 Q95 185 100 184 Q105 185 110 188 Q128 195 140 210 Q130 240 100 245 Q70 240 60 210 Z"
          fill={`${outfit}dd`}
        />
        {/* Skirt */}
        <path
          d="M60 210 Q50 245 40 280 L160 280 Q150 245 140 210 Q130 240 100 245 Q70 240 60 210 Z"
          fill={outfit}
          opacity="0.85"
        />
        {/* Dress highlight */}
        <path
          d="M82 188 Q100 200 118 188 L113 182 Q100 192 87 182 Z"
          fill={`${outfit}aa`}
        />
        {/* Waist accent */}
        <path
          d="M68 225 Q100 232 132 225"
          stroke={`${outfit}88`}
          strokeWidth="2"
          fill="none"
          strokeLinecap="round"
        />
      </>
    );
  }

  if (shape === "skirt") {
    return (
      <>
        <rect x="90" y="122" width="20" height="15" rx="4" fill={skin} />
        {/* Top */}
        <path
          d="M30 200 Q42 168 68 158 Q83 152 100 154 Q117 152 132 158 Q158 168 170 200 Z"
          fill={outfit}
        />
        <path
          d="M82 154 Q100 166 118 154 L113 148 Q100 159 87 148 Z"
          fill={`${outfit}cc`}
        />
      </>
    );
  }

  if (shape === "robe") {
    return (
      <>
        <rect x="90" y="122" width="20" height="15" rx="4" fill={skin} />
        {/* Long robe */}
        <path
          d="M35 280 Q44 220 62 200 Q75 188 90 185 Q95 183 100 183 Q105 183 110 185 Q125 188 138 200 Q156 220 165 280 Z"
          fill={outfit}
        />
        {/* Robe lapels */}
        <path
          d="M82 185 L100 210 L118 185 L113 180 L100 204 L87 180 Z"
          fill={`${outfit}99`}
        />
        {/* Robe belt */}
        <path
          d="M68 220 Q100 228 132 220 Q132 224 100 232 Q68 224 68 220 Z"
          fill={`${outfit}88`}
        />
        {/* Robe highlight stripe */}
        <line
          x1="100"
          y1="183"
          x2="100"
          y2="280"
          stroke={`${outfit}40`}
          strokeWidth="3"
        />
      </>
    );
  }

  if (shape === "armor") {
    const armorLight = adjustColor(outfit, 40);
    return (
      <>
        <rect x="90" y="122" width="20" height="15" rx="4" fill={skin} />
        {/* Armor chest plate */}
        <path
          d="M36 200 Q48 168 68 156 Q83 150 100 152 Q117 150 132 156 Q152 168 164 200 Z"
          fill={outfit}
        />
        {/* Chest plate highlight */}
        <path
          d="M78 156 Q100 172 122 156 L118 150 L100 165 L82 150 Z"
          fill={armorLight}
        />
        <ellipse
          cx="100"
          cy="175"
          rx="18"
          ry="14"
          fill={armorLight}
          opacity="0.5"
        />
        {/* Shoulder pads */}
        <ellipse cx="68" cy="162" rx="14" ry="10" fill={armorLight} />
        <ellipse cx="132" cy="162" rx="14" ry="10" fill={armorLight} />
        {/* Center emblem */}
        <polygon
          points="100,165 106,175 100,182 94,175"
          fill={`${outfit}cc`}
          stroke={armorLight}
          strokeWidth="1"
        />
      </>
    );
  }

  if (shape === "coat") {
    const lapelColor = adjustColor(outfit, -20);
    return (
      <>
        <rect x="90" y="122" width="20" height="15" rx="4" fill={skin} />
        {/* Coat body */}
        <path
          d="M30 200 Q42 164 62 152 Q76 145 90 147 Q95 145 100 146 Q105 145 110 147 Q124 145 138 152 Q158 164 170 200 Z"
          fill={outfit}
        />
        {/* Lapels */}
        <path d="M82 147 Q100 165 100 170 L87 147 Z" fill={lapelColor} />
        <path d="M118 147 Q100 165 100 170 L113 147 Z" fill={lapelColor} />
        {/* Buttons */}
        <circle cx="100" cy="172" r="2" fill={lapelColor} />
        <circle cx="100" cy="180" r="2" fill={lapelColor} />
        <circle cx="100" cy="188" r="2" fill={lapelColor} />
        {/* Collar */}
        <path
          d="M74 153 Q88 163 100 160 Q112 163 126 153"
          stroke={lapelColor}
          strokeWidth="2.5"
          fill="none"
          strokeLinecap="round"
        />
        {/* Shading */}
        <path
          d="M62 152 Q50 172 42 200"
          stroke={`${outfit}55`}
          strokeWidth="9"
          strokeLinecap="round"
          fill="none"
        />
        <path
          d="M138 152 Q150 172 158 200"
          stroke={`${outfit}55`}
          strokeWidth="9"
          strokeLinecap="round"
          fill="none"
        />
      </>
    );
  }

  if (shape === "shorts") {
    return (
      <>
        <rect x="90" y="122" width="20" height="15" rx="4" fill={skin} />
        {/* Tank/Tee top */}
        <path
          d="M30 200 Q42 170 68 160 Q83 155 100 157 Q117 155 132 160 Q158 170 170 200 Z"
          fill={outfit}
        />
        <path
          d="M82 157 Q100 169 118 157 L114 151 Q100 162 86 151 Z"
          fill={`${outfit}cc`}
        />
        <path
          d="M68 160 Q52 178 40 200"
          stroke={`${outfit}55`}
          strokeWidth="8"
          strokeLinecap="round"
          fill="none"
        />
        <path
          d="M132 160 Q148 178 160 200"
          stroke={`${outfit}55`}
          strokeWidth="8"
          strokeLinecap="round"
          fill="none"
        />
      </>
    );
  }

  // Default tee
  return (
    <>
      {/* Neck */}
      <rect x="90" y="122" width="20" height="15" rx="4" fill={skin} />
      {/* Shoulders + shirt */}
      <path
        d="M30 200 Q42 162 68 150 Q83 143 100 145 Q117 143 132 150 Q158 162 170 200 Z"
        fill={outfit}
      />
      {/* Collar highlight */}
      <path
        d="M82 150 Q100 162 118 150 L113 144 Q100 155 87 144 Z"
        fill={`${outfit}cc`}
      />
      {/* Arm shading */}
      <path
        d="M68 150 Q50 170 40 200"
        stroke={`${outfit}55`}
        strokeWidth="9"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M132 150 Q150 170 160 200"
        stroke={`${outfit}55`}
        strokeWidth="9"
        strokeLinecap="round"
        fill="none"
      />
    </>
  );
}

// ── Lower Body / Legs ────────────────────────────────────────────────────────
function LowerBody({
  skin,
  pantColor,
  shoeColor,
  shape,
}: {
  outfit: string;
  skin: string;
  pantColor: string;
  shoeColor: string;
  shape: OutfitShape;
}) {
  // Dress and robe: no separate legs visible
  if (shape === "dress" || shape === "robe") return null;

  if (shape === "shorts") {
    return (
      <>
        {/* Shorts */}
        <path
          d="M62 200 L68 240 Q76 248 88 248 L92 240 L100 260 L108 240 L112 248 Q124 248 132 240 L138 200 Z"
          fill={adjustColor(pantColor, 20)}
        />
        {/* Short hem */}
        <path
          d="M68 240 Q100 250 132 240"
          stroke={`${pantColor}88`}
          strokeWidth="2"
          fill="none"
        />
        {/* Bare legs */}
        <rect x="82" y="248" width="16" height="28" rx="6" fill={skin} />
        <rect x="102" y="248" width="16" height="28" rx="6" fill={skin} />
        {/* Shoes */}
        <ShoeLayer x1={82} x2={98} shoeColor={shoeColor} />
        <ShoeLayer x1={102} x2={118} shoeColor={shoeColor} />
      </>
    );
  }

  if (shape === "skirt") {
    return (
      <>
        {/* Skirt flare */}
        <path
          d="M62 195 Q50 240 44 280 L156 280 Q150 240 138 195 Q120 210 100 212 Q80 210 62 195 Z"
          fill={adjustColor(pantColor, 10)}
          opacity="0.9"
        />
        {/* Skirt highlight */}
        <path
          d="M70 210 Q100 225 130 210"
          stroke={`${pantColor}66`}
          strokeWidth="1.5"
          fill="none"
        />
      </>
    );
  }

  if (shape === "armor") {
    return (
      <>
        {/* Armor leggings */}
        <path
          d="M62 200 L70 250 L80 278 Q90 282 100 280 Q110 282 120 278 L130 250 L138 200 Z"
          fill={adjustColor(pantColor, -10)}
        />
        {/* Armor leg highlight */}
        <line
          x1="86"
          y1="202"
          x2="80"
          y2="278"
          stroke={`${pantColor}55`}
          strokeWidth="3"
          strokeLinecap="round"
        />
        <line
          x1="114"
          y1="202"
          x2="120"
          y2="278"
          stroke={`${pantColor}55`}
          strokeWidth="3"
          strokeLinecap="round"
        />
        {/* Boots/sabatons */}
        <rect x="74" y="260" width="22" height="18" rx="6" fill={shoeColor} />
        <rect x="104" y="260" width="22" height="18" rx="6" fill={shoeColor} />
        <rect
          x="74"
          y="272"
          width="22"
          height="8"
          rx="3"
          fill={adjustColor(shoeColor, 20)}
        />
        <rect
          x="104"
          y="272"
          width="22"
          height="8"
          rx="3"
          fill={adjustColor(shoeColor, 20)}
        />
      </>
    );
  }

  // Default: jeans/pants
  return (
    <>
      {/* Pants */}
      <path
        d="M62 200 L72 260 Q80 272 90 272 L100 265 L110 272 Q120 272 128 260 L138 200 Z"
        fill={pantColor}
      />
      {/* Belt */}
      <rect
        x="62"
        y="198"
        width="76"
        height="8"
        rx="2"
        fill={adjustColor(pantColor, -20)}
      />
      <rect x="96" y="198" width="8" height="8" rx="1" fill="#c8a84b" />
      {/* Pants shading */}
      <line
        x1="100"
        y1="206"
        x2="100"
        y2="265"
        stroke={`${pantColor}44`}
        strokeWidth="2"
      />
      {/* Shoes */}
      <ShoeLayer x1={74} x2={92} shoeColor={shoeColor} />
      <ShoeLayer x1={108} x2={126} shoeColor={shoeColor} />
    </>
  );
}

function ShoeLayer({
  x1,
  x2,
  shoeColor,
}: { x1: number; x2: number; shoeColor: string }) {
  const cx = (x1 + x2) / 2;
  return (
    <>
      <ellipse
        cx={cx}
        cy="272"
        rx={(x2 - x1) / 2 + 2}
        ry="7"
        fill={shoeColor}
      />
      <ellipse
        cx={cx - 2}
        cy="270"
        rx={(x2 - x1) / 2}
        ry="5"
        fill={adjustColor(shoeColor, 25)}
        opacity="0.5"
      />
    </>
  );
}

// ── Hair Back ────────────────────────────────────────────────────────────────
function HairBack({ config, hair }: { config: AvatarConfig; hair: string }) {
  switch (config.hairStyle) {
    case "long":
      return (
        <>
          <path
            d="M60 79 Q50 115 54 142 Q60 158 70 162 Q64 126 64 95 Z"
            fill={hair}
          />
          <path
            d="M140 79 Q150 115 146 142 Q140 158 130 162 Q136 126 136 95 Z"
            fill={hair}
          />
        </>
      );
    case "wavy":
      return (
        <>
          <path
            d="M62 82 Q50 112 54 135 Q60 148 68 150 Q60 122 64 92 Z"
            fill={hair}
          />
          <path
            d="M138 82 Q150 112 146 135 Q140 148 132 150 Q140 122 136 92 Z"
            fill={hair}
          />
        </>
      );
    case "curly":
      return (
        <>
          <path
            d="M62 82 Q50 108 54 130 Q60 142 67 146 Q61 122 64 92 Z"
            fill={hair}
          />
          <path
            d="M138 82 Q150 108 146 130 Q140 142 133 146 Q139 122 136 92 Z"
            fill={hair}
          />
        </>
      );
    default:
      return null;
  }
}

// ── Hair Front ───────────────────────────────────────────────────────────────
function HairFront({ config, hair }: { config: AvatarConfig; hair: string }) {
  switch (config.hairStyle) {
    case "short":
      return (
        <path
          d="M60 79 Q61 47 100 43 Q139 47 140 79 Q132 59 122 53 Q111 47 100 49 Q89 47 78 53 Q68 59 60 79 Z"
          fill={hair}
        />
      );
    case "curly":
      return (
        <>
          <path
            d="M60 84 Q56 52 74 41 Q86 34 100 36 Q114 34 126 41 Q144 52 140 84 Q134 56 122 50 Q111 44 100 46 Q89 44 78 50 Q66 56 60 84 Z"
            fill={hair}
          />
          <circle cx="66" cy="62" r="9" fill={hair} />
          <circle cx="78" cy="49" r="8" fill={hair} />
          <circle cx="90" cy="43" r="8" fill={hair} />
          <circle cx="100" cy="41" r="8" fill={hair} />
          <circle cx="110" cy="43" r="8" fill={hair} />
          <circle cx="122" cy="49" r="8" fill={hair} />
          <circle cx="134" cy="62" r="9" fill={hair} />
        </>
      );
    case "long":
      return (
        <path
          d="M60 79 Q61 47 100 43 Q139 47 140 79 Q132 56 120 49 Q109 43 100 44 Q91 43 80 49 Q68 56 60 79 Z"
          fill={hair}
        />
      );
    case "bun":
      return (
        <>
          <path
            d="M64 82 Q66 54 100 50 Q134 54 136 82 Q128 62 118 54 Q109 50 100 51 Q91 50 82 54 Q72 62 64 82 Z"
            fill={hair}
          />
          <circle cx="100" cy="36" r="18" fill={hair} />
          <circle cx="100" cy="36" r="12" fill={hair} opacity="0.75" />
          <circle cx="95" cy="31" r="2.5" fill="white" opacity="0.2" />
        </>
      );
    case "buzz":
      return (
        <path
          d="M62 84 Q64 60 78 50 Q90 44 100 45 Q110 44 122 50 Q136 60 138 84 Q130 64 120 56 Q110 51 100 52 Q90 51 80 56 Q70 64 62 84 Z"
          fill={hair}
          opacity="0.9"
        />
      );
    case "wavy":
      return (
        <path
          d="M62 82 Q63 48 100 44 Q137 48 138 82 Q130 59 118 52 Q109 47 100 48 Q91 47 82 52 Q70 59 62 82 Z"
          fill={hair}
        />
      );
    case "spiky":
      return (
        <>
          <path
            d="M62 82 Q64 56 100 50 Q136 56 138 82 Q130 63 118 55 Q109 51 100 52 Q91 51 82 55 Q70 63 62 82 Z"
            fill={hair}
          />
          <polygon points="74,55 70,35 80,53" fill={hair} />
          <polygon points="86,49 84,29 92,47" fill={hair} />
          <polygon points="100,46 98,25 104,45" fill={hair} />
          <polygon points="114,49 116,29 108,47" fill={hair} />
          <polygon points="126,55 130,35 120,53" fill={hair} />
        </>
      );
    default:
      return (
        <path
          d="M60 79 Q61 47 100 43 Q139 47 140 79 Q132 59 122 53 Q111 47 100 49 Q89 47 78 53 Q68 59 60 79 Z"
          fill={hair}
        />
      );
  }
}

// ── Eyebrows ─────────────────────────────────────────────────────────────────
function Eyebrows({ config, hair }: { config: AvatarConfig; hair: string }) {
  const color = hair === "#E8E8E8" ? "#999" : hair;
  switch (config.eyebrowStyle) {
    case "straight":
      return (
        <>
          <line
            x1="74"
            y1="72"
            x2="88"
            y2="72"
            stroke={color}
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          <line
            x1="112"
            y1="72"
            x2="126"
            y2="72"
            stroke={color}
            strokeWidth="2.5"
            strokeLinecap="round"
          />
        </>
      );
    case "arched":
      return (
        <>
          <path
            d="M74 75 Q81 69 88 73"
            stroke={color}
            strokeWidth="2.5"
            fill="none"
            strokeLinecap="round"
          />
          <path
            d="M112 73 Q119 69 126 75"
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
            d="M73 75 Q81 69 89 73"
            stroke={color}
            strokeWidth="4"
            fill="none"
            strokeLinecap="round"
          />
          <path
            d="M111 73 Q119 69 127 75"
            stroke={color}
            strokeWidth="4"
            fill="none"
            strokeLinecap="round"
          />
        </>
      );
    default:
      return (
        <>
          <path
            d="M74 75 Q81 69 88 73"
            stroke={color}
            strokeWidth="2.5"
            fill="none"
            strokeLinecap="round"
          />
          <path
            d="M112 73 Q119 69 126 75"
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
function Eyes({ config }: { config: AvatarConfig }) {
  switch (config.eyeShape) {
    case "round":
      return (
        <>
          <ellipse cx="82" cy="85" rx="8" ry="8" fill="white" />
          <ellipse cx="82" cy="85" rx="5" ry="5" fill="#3B2314" />
          <circle cx="80" cy="83" r="1.5" fill="white" />
          <ellipse cx="82" cy="85" rx="2" ry="2" fill="#1a1a1a" />
          <ellipse cx="118" cy="85" rx="8" ry="8" fill="white" />
          <ellipse cx="118" cy="85" rx="5" ry="5" fill="#3B2314" />
          <circle cx="116" cy="83" r="1.5" fill="white" />
          <ellipse cx="118" cy="85" rx="2" ry="2" fill="#1a1a1a" />
        </>
      );
    case "almond":
      return (
        <>
          <path d="M74 85 Q82 79 90 85 Q82 91 74 85 Z" fill="white" />
          <ellipse cx="82" cy="85" rx="4" ry="4" fill="#3B2314" />
          <circle cx="80.5" cy="83.5" r="1.2" fill="white" />
          <path
            d="M74 85 Q82 79 90 85"
            stroke="#5C3A1E"
            strokeWidth="1"
            fill="none"
          />
          <path d="M110 85 Q118 79 126 85 Q118 91 110 85 Z" fill="white" />
          <ellipse cx="118" cy="85" rx="4" ry="4" fill="#3B2314" />
          <circle cx="116.5" cy="83.5" r="1.2" fill="white" />
          <path
            d="M110 85 Q118 79 126 85"
            stroke="#5C3A1E"
            strokeWidth="1"
            fill="none"
          />
        </>
      );
    case "wide":
      return (
        <>
          <ellipse cx="82" cy="85" rx="9" ry="9" fill="white" />
          <ellipse cx="82" cy="85" rx="6" ry="6" fill="#3B2314" />
          <circle cx="80" cy="83" r="2" fill="white" />
          <ellipse cx="82" cy="85" rx="2.5" ry="2.5" fill="#1a1a1a" />
          <ellipse cx="118" cy="85" rx="9" ry="9" fill="white" />
          <ellipse cx="118" cy="85" rx="6" ry="6" fill="#3B2314" />
          <circle cx="116" cy="83" r="2" fill="white" />
          <ellipse cx="118" cy="85" rx="2.5" ry="2.5" fill="#1a1a1a" />
        </>
      );
    case "sleepy":
      return (
        <>
          <path d="M74 87 Q82 93 90 87" fill="#f0e8e0" />
          <path
            d="M74 87 Q82 81 90 87"
            stroke="#3B2314"
            strokeWidth="2"
            fill="#f0e8e0"
            strokeLinecap="round"
          />
          <ellipse cx="82" cy="87" rx="4" ry="2.5" fill="#3B2314" />
          <circle cx="80.5" cy="85.5" r="1" fill="white" />
          <path d="M110 87 Q118 93 126 87" fill="#f0e8e0" />
          <path
            d="M110 87 Q118 81 126 87"
            stroke="#3B2314"
            strokeWidth="2"
            fill="#f0e8e0"
            strokeLinecap="round"
          />
          <ellipse cx="118" cy="87" rx="4" ry="2.5" fill="#3B2314" />
          <circle cx="116.5" cy="85.5" r="1" fill="white" />
        </>
      );
    case "sparkle":
      return (
        <>
          <ellipse cx="82" cy="85" rx="8" ry="8" fill="white" />
          <ellipse cx="82" cy="85" rx="5" ry="5" fill="#6B3FA0" />
          <circle cx="80" cy="83" r="2" fill="white" opacity="0.8" />
          <circle cx="85" cy="87" r="1" fill="white" opacity="0.6" />
          <ellipse cx="118" cy="85" rx="8" ry="8" fill="white" />
          <ellipse cx="118" cy="85" rx="5" ry="5" fill="#6B3FA0" />
          <circle cx="116" cy="83" r="2" fill="white" opacity="0.8" />
          <circle cx="121" cy="87" r="1" fill="white" opacity="0.6" />
          <circle cx="74" cy="79" r="1" fill="#FFD700" opacity="0.7" />
          <circle cx="90" cy="78" r="1.2" fill="#FFD700" opacity="0.7" />
          <circle cx="110" cy="79" r="1" fill="#FFD700" opacity="0.7" />
          <circle cx="126" cy="78" r="1.2" fill="#FFD700" opacity="0.7" />
        </>
      );
    default:
      return (
        <>
          <ellipse cx="82" cy="85" rx="8" ry="8" fill="white" />
          <ellipse cx="82" cy="85" rx="5" ry="5" fill="#3B2314" />
          <circle cx="80" cy="83" r="1.5" fill="white" />
          <ellipse cx="118" cy="85" rx="8" ry="8" fill="white" />
          <ellipse cx="118" cy="85" rx="5" ry="5" fill="#3B2314" />
          <circle cx="116" cy="83" r="1.5" fill="white" />
        </>
      );
  }
}

// ── Mouth ────────────────────────────────────────────────────────────────────
function Mouth({ config }: { config: AvatarConfig }) {
  switch (config.mouthStyle) {
    case "smile":
      return (
        <>
          <path
            d="M88 110 Q100 120 112 110"
            stroke="#C0725A"
            strokeWidth="2"
            fill="none"
            strokeLinecap="round"
          />
          <path d="M88 110 Q100 118 112 110" fill="#E8897A" opacity="0.6" />
        </>
      );
    case "big-smile":
      return (
        <>
          <path
            d="M84 108 Q100 124 116 108"
            stroke="#C0725A"
            strokeWidth="2"
            fill="none"
            strokeLinecap="round"
          />
          <path d="M84 108 Q100 122 116 108" fill="#E05C5C" />
          <path
            d="M88 113 Q100 117 112 113 Q100 120 88 113 Z"
            fill="white"
            opacity="0.8"
          />
        </>
      );
    case "neutral":
      return (
        <line
          x1="90"
          y1="112"
          x2="110"
          y2="112"
          stroke="#C0725A"
          strokeWidth="2"
          strokeLinecap="round"
        />
      );
    case "smirk":
      return (
        <path
          d="M90 112 Q102 119 114 111"
          stroke="#C0725A"
          strokeWidth="2"
          fill="none"
          strokeLinecap="round"
        />
      );
    default:
      return (
        <path
          d="M88 110 Q100 120 112 110"
          stroke="#C0725A"
          strokeWidth="2"
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
            cy="85"
            rx="11"
            ry="8"
            stroke="#555"
            strokeWidth="2"
            fill="none"
          />
          <ellipse
            cx="118"
            cy="85"
            rx="11"
            ry="8"
            stroke="#555"
            strokeWidth="2"
            fill="none"
          />
          <line
            x1="93"
            y1="85"
            x2="107"
            y2="85"
            stroke="#555"
            strokeWidth="1.5"
          />
          <line
            x1="71"
            y1="85"
            x2="58"
            y2="88"
            stroke="#555"
            strokeWidth="1.5"
          />
          <line
            x1="129"
            y1="85"
            x2="142"
            y2="88"
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
            y="80"
            width="22"
            height="12"
            rx="5"
            fill="#1a1a1a"
            opacity="0.85"
          />
          <rect
            x="107"
            y="80"
            width="22"
            height="12"
            rx="5"
            fill="#1a1a1a"
            opacity="0.85"
          />
          <line
            x1="93"
            y1="86"
            x2="107"
            y2="86"
            stroke="#333"
            strokeWidth="1.5"
          />
          <line
            x1="71"
            y1="86"
            x2="58"
            y2="89"
            stroke="#333"
            strokeWidth="1.5"
          />
          <line
            x1="129"
            y1="86"
            x2="142"
            y2="89"
            stroke="#333"
            strokeWidth="1.5"
          />
          <line
            x1="76"
            y1="83"
            x2="83"
            y2="83"
            stroke="white"
            strokeWidth="1.5"
            opacity="0.4"
            strokeLinecap="round"
          />
          <line
            x1="112"
            y1="83"
            x2="119"
            y2="83"
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
            d="M64 67 Q100 59 136 67"
            stroke="#E91E8C"
            strokeWidth="7"
            fill="none"
            strokeLinecap="round"
          />
          <path
            d="M64 67 Q100 59 136 67"
            stroke="#FF69B4"
            strokeWidth="4"
            fill="none"
            strokeLinecap="round"
            opacity="0.5"
          />
          <path d="M93 61 Q100 56 107 61 Q100 66 93 61 Z" fill="#FF1493" />
          <circle cx="100" cy="61" r="2.5" fill="#FF69B4" />
        </>
      );
    default:
      return null;
  }
}
