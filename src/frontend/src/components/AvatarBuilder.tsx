import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Check,
  FlipHorizontal,
  Lock,
  Minus,
  Plus,
  Redo2,
  RotateCcw,
  Share2,
  Sparkles,
  Undo2,
  UserCircle2,
  X,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  CATEGORY_LABELS,
  SEASON_BADGE_COLORS,
  SEASON_ICONS,
  SEASON_LABELS,
  STORE_ITEMS_BY_CATEGORY,
  type StoreCategory,
  type StoreItem,
  type StoreSeason,
  getCurrentSeason,
} from "../data/clothing";
import type { AvatarConfig, AvatarGender } from "./WhatsAppAvatar";
import WhatsAppAvatar, {
  DEFAULT_AVATAR_CONFIG,
  DEFAULT_MALE_CONFIG,
} from "./WhatsAppAvatar";

// ── Customization data ────────────────────────────────────────────────────────
const SKIN_OPTIONS = [
  { id: "light", color: "#FDDBB4", label: "Light" },
  { id: "medium-light", color: "#F5C89A", label: "Med Light" },
  { id: "medium", color: "#E8A87C", label: "Medium" },
  { id: "tan", color: "#D4956A", label: "Tan" },
  { id: "medium-dark", color: "#C68642", label: "Med Dark" },
  { id: "dark", color: "#8D5524", label: "Dark" },
  { id: "very-dark", color: "#4A2912", label: "Very Dark" },
];

const FEMALE_HAIR_STYLES = [
  { id: "long", emoji: "👩", label: "Long" },
  { id: "wavy", emoji: "〰️", label: "Wavy" },
  { id: "curly", emoji: "🌀", label: "Curly" },
  { id: "bun", emoji: "🎀", label: "Bun" },
  { id: "braided", emoji: "🪢", label: "Braided" },
  { id: "ponytail", emoji: "🎗️", label: "Ponytail" },
  { id: "half-up", emoji: "✨", label: "Half Up" },
  { id: "side-braid", emoji: "🌸", label: "Side Braid" },
  { id: "twin-tails", emoji: "🎀", label: "Twin Tails" },
  { id: "buzz", emoji: "✂️", label: "Short Buzz" },
  { id: "bob", emoji: "💇", label: "Bob" },
  { id: "afro", emoji: "🌟", label: "Afro" },
];

const MALE_HAIR_STYLES = [
  { id: "short-fade", emoji: "💈", label: "Fade" },
  { id: "undercut", emoji: "⚡", label: "Undercut" },
  { id: "curly", emoji: "🌀", label: "Curly" },
  { id: "spiky", emoji: "🔱", label: "Spiky" },
  { id: "pompadour", emoji: "🎤", label: "Pompadour" },
  { id: "buzz", emoji: "✂️", label: "Buzz" },
  { id: "wavy", emoji: "〰️", label: "Wavy" },
  { id: "long-back", emoji: "🤘", label: "Long" },
  { id: "bun", emoji: "🎯", label: "Man Bun" },
  { id: "afro", emoji: "🌟", label: "Afro" },
];

const HAIR_COLORS = [
  { id: "black", color: "#1a1a1a", label: "Black" },
  { id: "brown", color: "#6B3A2A", label: "Brown" },
  { id: "blonde", color: "#F4C14D", label: "Blonde" },
  { id: "red", color: "#C0392B", label: "Red" },
  { id: "auburn", color: "#8B3A10", label: "Auburn" },
  { id: "gray", color: "#9B9B9B", label: "Gray" },
  { id: "white", color: "#DDDDDD", label: "White" },
  { id: "blue", color: "#4A90D9", label: "Blue" },
  { id: "purple", color: "#8E44AD", label: "Purple" },
  { id: "pink", color: "#FF69B4", label: "Pink" },
  { id: "holographic", color: "#7B52FF", label: "Holo ✨" },
];

const EYE_SHAPES = [
  { id: "round", label: "Round", icon: "●" },
  { id: "almond", label: "Almond", icon: "◉" },
  { id: "wide", label: "Wide", icon: "◎" },
  { id: "sleepy", label: "Sleepy", icon: "—" },
  { id: "sparkle", label: "Sparkle", icon: "✨" },
];

const EYE_COLORS = [
  { id: "brown", color: "#3B2314", label: "Brown" },
  { id: "hazel", color: "#6B4A1A", label: "Hazel" },
  { id: "green", color: "#2E6B3A", label: "Green" },
  { id: "blue", color: "#1A4B8C", label: "Blue" },
  { id: "gray", color: "#5A6472", label: "Gray" },
  { id: "amber", color: "#C47B0A", label: "Amber" },
  { id: "violet", color: "#5B3A8E", label: "Violet" },
  { id: "cyber", color: "#00E5FF", label: "Cyber 🤖" },
];

const EYEBROW_STYLES_FEMALE = [
  { id: "straight", label: "Straight", icon: "—" },
  { id: "arched", label: "Arched", icon: "∧" },
  { id: "thick", label: "Thick", icon: "▬" },
];

const EYEBROW_STYLES_MALE = [
  { id: "straight", label: "Straight", icon: "—" },
  { id: "arched", label: "Arched", icon: "∧" },
  { id: "thick", label: "Thick", icon: "▬" },
  { id: "furrowed", label: "Furrowed", icon: "∨" },
];

const MOUTH_STYLES = [
  { id: "smile", label: "Smile", icon: "🙂" },
  { id: "big-smile", label: "Big Smile", icon: "😄" },
  { id: "neutral", label: "Neutral", icon: "😐" },
  { id: "smirk", label: "Smirk", icon: "😏" },
  { id: "focused", label: "Focused", icon: "😤" },
];

const OUTFIT_COLORS = [
  { id: "#7c3aed", label: "Purple" },
  { id: "#2563eb", label: "Blue" },
  { id: "#059669", label: "Green" },
  { id: "#dc2626", label: "Red" },
  { id: "#d97706", label: "Orange" },
  { id: "#db2777", label: "Pink" },
  { id: "#374151", label: "Gray" },
  { id: "#1e293b", label: "Black" },
];

const FEMALE_ACCESSORIES = [
  { id: "none", label: "None", icon: "✕" },
  { id: "glasses", label: "Glasses", icon: "👓" },
  { id: "sunglasses", label: "Sunnies", icon: "🕶️" },
  { id: "earrings", label: "Earrings", icon: "💎" },
  { id: "headband", label: "Headband", icon: "🎀" },
  { id: "ar-glasses", label: "AR Glasses", icon: "🔮" },
  { id: "vr-headset", label: "VR Headset", icon: "🥽" },
];

const MALE_ACCESSORIES = [
  { id: "none", label: "None", icon: "✕" },
  { id: "glasses", label: "Glasses", icon: "👓" },
  { id: "sunglasses", label: "Sunnies", icon: "🕶️" },
  { id: "cap", label: "Cap", icon: "🧢" },
  { id: "earrings", label: "Earrings", icon: "💎" },
  { id: "ar-glasses", label: "AR Glasses", icon: "🔮" },
  { id: "vr-headset", label: "VR Headset", icon: "🥽" },
];

const SEASON_FILTERS: { id: StoreSeason; label: string }[] = [
  { id: "all", label: "All" },
  { id: "spring", label: "🌸 Spring" },
  { id: "summer", label: "☀️ Summer" },
  { id: "fall", label: "🍂 Fall" },
  { id: "winter", label: "❄️ Winter" },
];

// ── Types ─────────────────────────────────────────────────────────────────────
type CustomizeTab =
  | "body"
  | "hair"
  | "face"
  | "outfit"
  | "accessories"
  | "background";

const CUSTOMIZE_TABS: { id: CustomizeTab; label: string; emoji: string }[] = [
  { id: "body", label: "Body", emoji: "🧍" },
  { id: "hair", label: "Hair", emoji: "💇" },
  { id: "face", label: "Face", emoji: "😊" },
  { id: "outfit", label: "Outfit", emoji: "👕" },
  { id: "accessories", label: "Accessories", emoji: "🎒" },
  { id: "background", label: "Background", emoji: "🖼️" },
];

type BuilderMode = "customize" | "store";
type AvatarPose = "standing" | "sitting" | "thinking";

const POSES: { id: AvatarPose; label: string; emoji: string }[] = [
  { id: "standing", label: "Standing", emoji: "🧍" },
  { id: "sitting", label: "Sitting", emoji: "🪑" },
  { id: "thinking", label: "Thinking", emoji: "🤔" },
];

interface PresetSlot {
  config: AvatarConfig | null;
  equippedOutfitId: string;
  label: string;
}

const MAX_HISTORY = 10;
const MAX_PRESETS = 5;

// ── Instagram Story Ring ──────────────────────────────────────────────────────
function InstagramRing({
  ringColor,
  size = 150,
  animated = false,
}: {
  ringColor: string;
  size?: number;
  animated?: boolean;
}) {
  const ringSize = size + 8;
  const cx = ringSize / 2;
  const r = size / 2 + 1;

  return (
    <svg
      width={ringSize}
      height={ringSize}
      viewBox={`0 0 ${ringSize} ${ringSize}`}
      className="absolute inset-0 pointer-events-none"
      style={{ top: -4, left: -4 }}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="ig-ring-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={ringColor} />
          <stop offset="40%" stopColor="#ec4899" />
          <stop offset="80%" stopColor="#f97316" />
          <stop offset="100%" stopColor="#facc15" />
        </linearGradient>
      </defs>
      <circle
        cx={cx}
        cy={cx}
        r={r}
        fill="none"
        stroke="url(#ig-ring-grad)"
        strokeWidth="3"
        strokeLinecap="round"
        strokeDasharray={animated ? "8 4" : undefined}
        style={animated ? { animation: "spin 4s linear infinite" } : undefined}
      />
    </svg>
  );
}

// ── Season Badge ──────────────────────────────────────────────────────────────
function SeasonBadge({ season }: { season: StoreSeason }) {
  if (!season || season === "all") return null;
  const currentSeason = getCurrentSeason();
  const isCurrentSeason = season === currentSeason;
  const colorClass = SEASON_BADGE_COLORS[season];
  const icon = SEASON_ICONS[season];

  return (
    <span
      className={`absolute top-1 right-1 z-20 flex items-center gap-0.5 px-1 py-0.5 rounded-full text-[8px] font-bold border leading-none ${colorClass}`}
      title={`${SEASON_LABELS[season]} ${isCurrentSeason ? "— In Season Now!" : ""}`}
    >
      {icon}
      {isCurrentSeason && (
        <span className="text-[7px] font-extrabold">NOW</span>
      )}
    </span>
  );
}

// ── Seasonal Unlock Toast ─────────────────────────────────────────────────────
function SeasonalUnlockToast({
  itemId,
  onDismiss,
}: {
  itemId: string;
  onDismiss: () => void;
}) {
  useEffect(() => {
    const t = setTimeout(onDismiss, 5000);
    return () => clearTimeout(t);
  }, [onDismiss]);

  return (
    <div
      className="fixed top-4 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 bg-card border border-primary/40 rounded-2xl shadow-xl px-4 py-3 seasonal-toast-enter"
      aria-live="polite"
      data-ocid="avatar.seasonal_unlock_toast"
    >
      <div className="relative">
        <span className="text-2xl sparkle-spin">✨</span>
        <span className="absolute -top-1 -right-1 text-xs">🌸</span>
      </div>
      <div className="min-w-0">
        <p className="text-sm font-bold text-foreground leading-tight">
          Seasonal item unlocked!
        </p>
        <p className="text-xs text-muted-foreground truncate">
          Check your store —{" "}
          <span className="text-primary font-semibold">{itemId}</span> is
          available
        </p>
      </div>
      <button
        type="button"
        onClick={onDismiss}
        className="text-muted-foreground hover:text-foreground transition-colors"
        aria-label="Dismiss"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}

// ── Grid option button ─────────────────────────────────────────────────────────
function OptionTile({
  selected,
  onClick,
  children,
  locked = false,
  cost,
  ocid,
  highlight = false,
}: {
  selected: boolean;
  onClick: () => void;
  children: React.ReactNode;
  locked?: boolean;
  cost?: number;
  ocid?: string;
  highlight?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      data-ocid={ocid}
      className={`relative rounded-xl border-2 transition-all duration-150 flex flex-col items-center justify-center p-2 gap-1 aspect-square
        ${
          selected
            ? "border-primary bg-primary/15 shadow-md shadow-primary/25"
            : highlight
              ? "border-amber-400/60 bg-amber-400/10 scale-105"
              : "border-border bg-muted/40 hover:border-primary/40 hover:bg-muted/70"
        }
        ${locked ? "opacity-70" : ""}`}
    >
      {children}
      {selected && (
        <div className="absolute top-1 right-1 w-4 h-4 bg-primary rounded-full flex items-center justify-center">
          <Check className="w-2.5 h-2.5 text-white" />
        </div>
      )}
      {locked && (
        <div className="absolute inset-0 rounded-xl bg-background/60 flex items-center justify-center flex-col gap-0.5">
          <Lock className="w-4 h-4 text-muted-foreground" />
        </div>
      )}
      {cost !== undefined && cost > 0 && !locked && (
        <span className="absolute bottom-0.5 right-1 text-[9px] font-bold text-amber-400 leading-none">
          💰{cost}
        </span>
      )}
    </button>
  );
}

// ── Store item card ────────────────────────────────────────────────────────────
function StoreCard({
  item,
  isOwned,
  isEquipped,
  isPreviewing,
  canAfford,
  shortage,
  onPreview,
  onBuy,
  onEquip,
}: {
  item: StoreItem;
  isOwned: boolean;
  isEquipped: boolean;
  isPreviewing: boolean;
  canAfford: boolean;
  shortage: number;
  onPreview: (item: StoreItem) => void;
  onBuy: (item: StoreItem) => void;
  onEquip: (item: StoreItem) => void;
}) {
  return (
    <div
      className={`relative rounded-xl border-2 overflow-hidden flex flex-col cursor-pointer transition-all duration-150
        ${
          isPreviewing
            ? "border-primary bg-primary/10 shadow-lg shadow-primary/20 scale-[1.03]"
            : isEquipped
              ? "border-emerald-500/60 bg-emerald-500/5"
              : isOwned
                ? "border-emerald-500/25"
                : "border-border bg-card hover:border-primary/50"
        }`}
      onMouseEnter={() => onPreview(item)}
      onTouchStart={() => onPreview(item)}
      data-ocid={`store.item.${item.id}`}
    >
      {item.season && item.season !== "all" && (
        <SeasonBadge season={item.season} />
      )}
      {isEquipped && (
        <span className="absolute top-1 left-1 z-10 px-1 py-0.5 text-[9px] font-bold bg-emerald-500 text-white rounded-full leading-none">
          On
        </span>
      )}
      {isOwned && !isEquipped && (
        <span className="absolute top-1 left-1 z-10 w-4 h-4 bg-emerald-500/80 rounded-full flex items-center justify-center">
          <Check className="w-2.5 h-2.5 text-white" />
        </span>
      )}
      {!isOwned && !(item.season && item.season !== "all") && (
        <span className="absolute top-1 left-1 z-10">
          <Lock className="w-3 h-3 text-muted-foreground" />
        </span>
      )}
      {!isOwned && item.season && item.season !== "all" && (
        <span className="absolute bottom-8 left-1 z-10">
          <Lock className="w-3 h-3 text-muted-foreground" />
        </span>
      )}
      <button
        type="button"
        onClick={() => onPreview(item)}
        className="flex flex-col items-center gap-1 p-2 pt-3 w-full focus:outline-none"
      >
        <div
          className={`w-10 h-10 rounded-lg flex items-center justify-center text-2xl transition-colors
            ${isPreviewing ? "bg-primary/20" : "bg-muted/60"}`}
        >
          {item.emoji}
        </div>
        <span className="text-[10px] font-medium text-foreground text-center leading-tight line-clamp-2 px-0.5">
          {item.label}
        </span>
        {item.cost === 0 ? (
          <span className="text-[9px] text-emerald-400 font-bold">Free</span>
        ) : (
          <span className="text-[9px] text-amber-400 font-bold">
            💰 {item.cost}
          </span>
        )}
      </button>
      <div className="px-1.5 pb-1.5">
        {isOwned ? (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onEquip(item);
            }}
            data-ocid={`store.equip_button.${item.id}`}
            className={`w-full py-0.5 rounded-md text-[10px] font-bold transition-all
              ${
                isEquipped
                  ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40"
                  : "bg-primary text-primary-foreground hover:bg-primary/90"
              }`}
          >
            {isEquipped ? "✓ Equipped" : "Equip"}
          </button>
        ) : (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              if (canAfford) onBuy(item);
            }}
            disabled={!canAfford}
            data-ocid={`store.buy_button.${item.id}`}
            className={`w-full py-0.5 rounded-md text-[10px] font-bold transition-all
              ${
                canAfford
                  ? "bg-amber-500 text-black hover:bg-amber-400"
                  : "bg-muted text-muted-foreground cursor-not-allowed opacity-60"
              }`}
          >
            {canAfford ? `Buy 💰${item.cost}` : `+${shortage} 💰`}
          </button>
        )}
      </div>
    </div>
  );
}

// ── Pose-aware avatar frame ───────────────────────────────────────────────────
function AvatarPoseFrame({
  pose,
  children,
  mirrored,
  zoom,
  rotation,
  highlightPart,
}: {
  pose: AvatarPose;
  children: React.ReactNode;
  mirrored: boolean;
  zoom: number;
  rotation: number;
  highlightPart: string | null;
}) {
  const poseClass =
    pose === "sitting"
      ? "avatar-pose-sitting"
      : pose === "thinking"
        ? "avatar-pose-thinking"
        : "avatar-pose-standing";

  return (
    <div
      className={`avatar-idle ${poseClass} ${highlightPart ? "avatar-part-highlight" : ""}`}
      style={{
        transform: `scaleX(${mirrored ? -1 : 1}) scale(${zoom}) rotate(${rotation}deg)`,
        transition: "transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1)",
        transformOrigin: "center bottom",
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "flex-end",
        justifyContent: "center",
      }}
    >
      {children}
    </div>
  );
}

// ── Preset Thumbnail ──────────────────────────────────────────────────────────
function PresetDot({
  slot,
  index,
  isActive,
  onSave,
  onLoad,
}: {
  slot: PresetSlot;
  index: number;
  isActive: boolean;
  onSave: (i: number) => void;
  onLoad: (i: number) => void;
}) {
  const isEmpty = slot.config === null;
  return (
    <div className="flex flex-col items-center gap-1">
      <button
        type="button"
        onClick={() => (isEmpty ? onSave(index) : onLoad(index))}
        data-ocid={`avatar.preset.${index + 1}`}
        title={isEmpty ? `Save to slot ${index + 1}` : `Load ${slot.label}`}
        className={`relative w-10 h-10 rounded-full border-2 overflow-hidden flex items-end justify-center transition-all
          ${
            isActive
              ? "border-primary shadow-md shadow-primary/30"
              : isEmpty
                ? "border-dashed border-border bg-muted/30 hover:border-primary/40"
                : "border-border bg-muted/50 hover:border-primary/60 hover:scale-110"
          }`}
      >
        {isEmpty ? (
          <span className="text-lg text-muted-foreground">+</span>
        ) : (
          <WhatsAppAvatar
            config={{
              ...slot.config!,
              equippedOutfitId: slot.equippedOutfitId,
            }}
            size={40}
          />
        )}
        {isActive && !isEmpty && (
          <span className="absolute bottom-0 inset-x-0 h-1 bg-primary rounded-b-full" />
        )}
      </button>
      {!isEmpty && (
        <button
          type="button"
          onClick={() => onSave(index)}
          data-ocid={`avatar.preset_save.${index + 1}`}
          title={`Overwrite slot ${index + 1}`}
          className="text-[9px] text-muted-foreground hover:text-primary transition-colors leading-none"
        >
          Save
        </button>
      )}
    </div>
  );
}

// ── Gender Selector Screen ────────────────────────────────────────────────────
function GenderSelector({
  onSelect,
}: {
  onSelect: (gender: AvatarGender) => void;
}) {
  return (
    <div
      className="flex flex-col items-center justify-center gap-6 p-6 h-full"
      data-ocid="avatar.gender_selector"
    >
      <div className="text-center">
        <h2 className="text-lg font-bold text-foreground mb-1">
          Create Your Avatar
        </h2>
        <p className="text-sm text-muted-foreground">
          Choose your avatar style to get started
        </p>
      </div>
      <div className="flex gap-4 w-full max-w-sm">
        {/* Male card */}
        <button
          type="button"
          onClick={() => onSelect("male")}
          data-ocid="avatar.gender.male"
          className="flex-1 flex flex-col items-center gap-3 p-4 rounded-2xl border-2 border-border bg-muted/30 hover:border-primary hover:bg-primary/5 transition-all group"
        >
          <div className="relative w-24 h-36 overflow-hidden rounded-xl bg-gradient-to-b from-muted/30 to-transparent flex items-end justify-center">
            <WhatsAppAvatar config={DEFAULT_MALE_CONFIG} size={100} />
          </div>
          <div className="text-center">
            <p className="text-sm font-bold text-foreground group-hover:text-primary transition-colors">
              👦 Male
            </p>
            <p className="text-[10px] text-muted-foreground">
              Masculine styles
            </p>
          </div>
        </button>

        {/* Female card */}
        <button
          type="button"
          onClick={() => onSelect("female")}
          data-ocid="avatar.gender.female"
          className="flex-1 flex flex-col items-center gap-3 p-4 rounded-2xl border-2 border-border bg-muted/30 hover:border-pink-400 hover:bg-pink-400/5 transition-all group"
        >
          <div className="relative w-24 h-36 overflow-hidden rounded-xl bg-gradient-to-b from-muted/30 to-transparent flex items-end justify-center">
            <WhatsAppAvatar config={DEFAULT_AVATAR_CONFIG} size={100} />
          </div>
          <div className="text-center">
            <p className="text-sm font-bold text-foreground group-hover:text-pink-400 transition-colors">
              👧 Female
            </p>
            <p className="text-[10px] text-muted-foreground">Feminine styles</p>
          </div>
        </button>
      </div>
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────
interface AvatarBuilderProps {
  config: AvatarConfig;
  onChange: (patch: Partial<AvatarConfig>) => void;
  onDone: () => void;
  onSetProfilePicture?: () => void;
  gcoins?: number;
  ownedItems?: string[];
  equippedStoreItems?: Record<StoreCategory, string>;
  onBuyItem?: (item: StoreItem) => void;
  onEquipItem?: (item: StoreItem) => void;
  unlockedSeasonalItemId?: string | null;
  onSeasonalToastDismiss?: () => void;
}

export default function AvatarBuilder({
  config,
  onChange,
  onDone,
  onSetProfilePicture,
  gcoins = 1250,
  ownedItems = ["outfit-casual-tee", "acc-none", "bg-default", "pet-none"],
  equippedStoreItems = {
    outfits: "outfit-casual-tee",
    accessories: "acc-none",
    backgrounds: "bg-default",
    pets: "pet-none",
    special: "",
  },
  onBuyItem,
  onEquipItem,
  unlockedSeasonalItemId = null,
  onSeasonalToastDismiss,
}: AvatarBuilderProps) {
  // If config has no gender, show the gender selector first
  const [showGenderSelector, setShowGenderSelector] = useState<boolean>(
    !config.gender,
  );
  const [mode, setMode] = useState<BuilderMode>("customize");
  const [customizeTab, setCustomizeTab] = useState<CustomizeTab>("body");
  const [storeCategory, setStoreCategory] = useState<StoreCategory>("outfits");
  const [seasonFilter, setSeasonFilter] = useState<StoreSeason>("all");
  const [previewItem, setPreviewItem] = useState<StoreItem | null>(null);
  const [gcoinDisplay, setGcoinDisplay] = useState(gcoins);
  const [pose, setPose] = useState<AvatarPose>("standing");
  const [saved, setSaved] = useState(false);
  const [mirrored, setMirrored] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [highlightPart, setHighlightPart] = useState<string | null>(null);
  const [history, setHistory] = useState<Array<Partial<AvatarConfig>>>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [presets, setPresets] = useState<PresetSlot[]>(() =>
    Array.from({ length: MAX_PRESETS }, (_, i) => ({
      config: null,
      equippedOutfitId: "outfit-casual-tee",
      label: `Preset ${i + 1}`,
    })),
  );
  const [activePreset, setActivePreset] = useState<number | null>(null);
  const prevPinchDist = useRef<number | null>(null);
  const previewRef = useRef<HTMLDivElement>(null);
  const prevCoins = useRef(gcoins);
  const tabBarRef = useRef<HTMLDivElement>(null);

  const gender: AvatarGender = config.gender ?? "female";
  const hairStyles = gender === "male" ? MALE_HAIR_STYLES : FEMALE_HAIR_STYLES;
  const eyebrowStyles =
    gender === "male" ? EYEBROW_STYLES_MALE : EYEBROW_STYLES_FEMALE;
  const accessories = gender === "male" ? MALE_ACCESSORIES : FEMALE_ACCESSORIES;

  useEffect(() => {
    if (gcoins !== prevCoins.current) {
      prevCoins.current = gcoins;
      setGcoinDisplay(gcoins);
    }
  }, [gcoins]);

  useEffect(() => {
    if (storeCategory !== "outfits") setSeasonFilter("all");
  }, [storeCategory]);

  // Pinch-zoom handlers
  useEffect(() => {
    const el = previewRef.current;
    if (!el) return;

    function onTouchMove(e: TouchEvent) {
      if (e.touches.length !== 2) return;
      e.preventDefault();
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      const dist = Math.hypot(dx, dy);
      if (prevPinchDist.current !== null) {
        const delta = dist - prevPinchDist.current;
        setZoom((z) => Math.max(0.5, Math.min(2.5, z + delta * 0.005)));
      }
      prevPinchDist.current = dist;
    }
    function onTouchEnd() {
      prevPinchDist.current = null;
    }

    el.addEventListener("touchmove", onTouchMove, { passive: false });
    el.addEventListener("touchend", onTouchEnd);
    return () => {
      el.removeEventListener("touchmove", onTouchMove);
      el.removeEventListener("touchend", onTouchEnd);
    };
  }, []);

  const pushHistory = useCallback(
    (patch: Partial<AvatarConfig>) => {
      setHistory((h) => {
        const newH = h.slice(0, historyIndex + 1);
        newH.push(patch);
        if (newH.length > MAX_HISTORY) newH.shift();
        return newH;
      });
      setHistoryIndex((i) => Math.min(i + 1, MAX_HISTORY - 1));
    },
    [historyIndex],
  );

  function handleChange(patch: Partial<AvatarConfig>) {
    pushHistory(patch);
    onChange(patch);
    setActivePreset(null);
  }

  function handleGenderSelect(g: AvatarGender) {
    const defaults = g === "male" ? DEFAULT_MALE_CONFIG : DEFAULT_AVATAR_CONFIG;
    onChange({ ...defaults, gender: g });
    setShowGenderSelector(false);
  }

  function handleUndo() {
    if (historyIndex < 0) return;
    const prev = history[historyIndex - 1];
    if (prev) onChange(prev);
    setHistoryIndex((i) => Math.max(-1, i - 1));
  }

  function handleRedo() {
    if (historyIndex >= history.length - 1) return;
    const next = history[historyIndex + 1];
    if (next) onChange(next);
    setHistoryIndex((i) => Math.min(history.length - 1, i + 1));
  }

  function savePreset(index: number) {
    setPresets((prev) => {
      const next = [...prev];
      next[index] = {
        config: { ...config },
        equippedOutfitId: equippedStoreItems.outfits,
        label: `Slot ${index + 1}`,
      };
      return next;
    });
    setActivePreset(index);
  }

  function loadPreset(index: number) {
    const slot = presets[index];
    if (!slot.config) return;
    onChange(slot.config);
    if (slot.equippedOutfitId && onEquipItem) {
      const item = STORE_ITEMS_BY_CATEGORY.outfits.find(
        (i) => i.id === slot.equippedOutfitId,
      );
      if (item) onEquipItem(item);
    }
    setActivePreset(index);
  }

  const ringColor = config.outfitColor ?? "#7c3aed";

  const isOwned = (item: StoreItem) =>
    ownedItems.includes(item.id) || item.cost === 0;
  const isEquipped = (item: StoreItem) =>
    equippedStoreItems[item.category] === item.id;
  const isPreviewing = (item: StoreItem) => previewItem?.id === item.id;

  const filteredStoreItems = (() => {
    const items = STORE_ITEMS_BY_CATEGORY[storeCategory];
    if (storeCategory !== "outfits" || seasonFilter === "all") return items;
    return items.filter(
      (item) => item.season === seasonFilter || item.season === "all",
    );
  })();

  function handlePreview(item: StoreItem) {
    setPreviewItem((prev) => (prev?.id === item.id ? null : item));
  }

  function handleBuy(item: StoreItem) {
    if (gcoinDisplay < item.cost) return;
    setGcoinDisplay((c) => c - item.cost);
    onBuyItem?.(item);
    onEquipItem?.(item);
    setPreviewItem(null);
  }

  function handleEquip(item: StoreItem) {
    onEquipItem?.(item);
    setPreviewItem(null);
  }

  function handleSave() {
    setSaved(true);
    onDone();
    setTimeout(() => setSaved(false), 2000);
  }

  function handleShare() {
    if (navigator.share) {
      navigator
        .share({
          title: "My Code & Crush Avatar",
          text: "Check out my avatar!",
        })
        .catch(() => null);
    }
  }

  const poseConfig: AvatarConfig = {
    ...config,
    equippedOutfitId: equippedStoreItems.outfits,
    mouthStyle:
      pose === "thinking"
        ? "smirk"
        : pose === "sitting"
          ? "smile"
          : config.mouthStyle,
  };

  const storeCategories: StoreCategory[] = [
    "outfits",
    "accessories",
    "backgrounds",
    "pets",
    "special",
  ];

  return (
    <>
      {unlockedSeasonalItemId && (
        <SeasonalUnlockToast
          itemId={unlockedSeasonalItemId}
          onDismiss={() => onSeasonalToastDismiss?.()}
        />
      )}

      <div
        className="bg-card rounded-2xl border border-border overflow-hidden flex flex-col"
        data-ocid="avatar.builder"
      >
        {/* ── Header bar ── */}
        <div className="flex items-center justify-between px-4 py-2.5 border-b border-border bg-muted/30 shrink-0">
          <div className="flex items-center gap-2">
            <span
              className="text-sm font-bold text-amber-400 tabular-nums"
              data-ocid="avatar.gcoins_display"
            >
              💰 {gcoinDisplay.toLocaleString()}
            </span>
            {/* Gender badge */}
            <button
              type="button"
              onClick={() => setShowGenderSelector(true)}
              data-ocid="avatar.change_gender_button"
              className="text-[10px] px-2 py-0.5 rounded-full border border-border bg-muted/40 hover:bg-muted text-muted-foreground transition-colors flex items-center gap-1"
              title="Change gender"
            >
              {gender === "male" ? "👦" : "👧"}
              <span className="capitalize">{gender}</span>
            </button>
          </div>

          {/* Mode toggle */}
          <div className="flex gap-0.5 bg-muted rounded-full p-0.5">
            <button
              type="button"
              onClick={() => setMode("customize")}
              data-ocid="avatar.customize_tab"
              className={`text-xs px-3 py-1 rounded-full font-semibold transition-all ${
                mode === "customize"
                  ? "bg-primary text-primary-foreground shadow"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              🎨 Create
            </button>
            <button
              type="button"
              onClick={() => setMode("store")}
              data-ocid="avatar.store_tab"
              className={`text-xs px-3 py-1 rounded-full font-semibold transition-all ${
                mode === "store"
                  ? "bg-primary text-primary-foreground shadow"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              🛍️ Store
            </button>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={handleUndo}
              disabled={historyIndex < 0}
              data-ocid="avatar.undo_button"
              title="Undo"
              className="w-7 h-7 rounded-lg flex items-center justify-center bg-muted/60 hover:bg-muted transition-colors disabled:opacity-30"
            >
              <Undo2 className="w-3.5 h-3.5 text-foreground" />
            </button>
            <button
              type="button"
              onClick={handleRedo}
              disabled={historyIndex >= history.length - 1}
              data-ocid="avatar.redo_button"
              title="Redo"
              className="w-7 h-7 rounded-lg flex items-center justify-center bg-muted/60 hover:bg-muted transition-colors disabled:opacity-30"
            >
              <Redo2 className="w-3.5 h-3.5 text-foreground" />
            </button>
            <Button
              size="sm"
              onClick={handleSave}
              className="h-7 text-xs rounded-full px-3"
              data-ocid="avatar.done_button"
            >
              {saved ? "✓ Saved" : "Save"}
            </Button>
          </div>
        </div>

        {/* ── Gender selector overlay ── */}
        {showGenderSelector ? (
          <GenderSelector onSelect={handleGenderSelect} />
        ) : (
          /* ── Main layout ── */
          <div className="flex flex-col md:flex-row flex-1 min-h-0">
            {/* ── LEFT: Avatar Preview ── */}
            <div className="flex flex-col items-center justify-between gap-3 py-4 px-4 bg-gradient-to-b from-muted/20 to-muted/5 md:w-[42%] md:border-r border-border shrink-0">
              <div className="flex flex-col items-center gap-2 w-full">
                <div
                  ref={previewRef}
                  className="relative w-full flex items-center justify-center"
                  style={{
                    aspectRatio: "3/5",
                    maxHeight: 300,
                    touchAction: "none",
                    cursor: "grab",
                  }}
                  data-ocid="avatar.preview"
                >
                  <div
                    className="absolute inset-0 rounded-2xl overflow-hidden"
                    style={{
                      background: `radial-gradient(ellipse at 50% 80%, ${ringColor}18 0%, transparent 70%), linear-gradient(to bottom, oklch(0.18 0.04 265) 0%, oklch(0.13 0.03 260) 100%)`,
                    }}
                  />
                  <div
                    className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full blur-lg opacity-30"
                    style={{ width: "55%", height: 16, background: ringColor }}
                  />

                  {/* Gender badge overlay */}
                  <div className="absolute top-2 left-2 z-10 flex items-center gap-1 bg-card/60 backdrop-blur-sm border border-border/40 rounded-full px-2 py-0.5 text-[10px] font-bold text-muted-foreground">
                    {gender === "male" ? "👦" : "👧"}
                    <span className="capitalize">{gender}</span>
                  </div>

                  {/* Instagram ring badge */}
                  <div
                    className="absolute top-2 right-2 z-10"
                    style={{ width: 42, height: 42 }}
                  >
                    <div className="relative w-10 h-10 rounded-full border border-border/40 overflow-hidden bg-card/40">
                      <InstagramRing
                        ringColor={ringColor}
                        size={36}
                        animated={pose === "thinking"}
                      />
                      <div className="w-full h-full flex items-end justify-center overflow-hidden">
                        <WhatsAppAvatar config={poseConfig} size={40} />
                      </div>
                    </div>
                  </div>

                  {/* Main full-body avatar */}
                  <div className="relative w-full h-full flex items-end justify-center overflow-hidden rounded-2xl">
                    <AvatarPoseFrame
                      pose={pose}
                      mirrored={mirrored}
                      zoom={zoom}
                      rotation={rotation}
                      highlightPart={highlightPart}
                    >
                      <WhatsAppAvatar
                        config={poseConfig}
                        size={Math.min(260, 240)}
                        style={{
                          filter: `drop-shadow(0 8px 20px ${ringColor}44)`,
                          maxWidth: "100%",
                          height: "auto",
                        }}
                      />
                    </AvatarPoseFrame>
                  </div>

                  <div className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-card/80 backdrop-blur-sm border border-border/40 text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1">
                    {POSES.find((p) => p.id === pose)?.emoji}
                    <span className="text-muted-foreground">
                      {POSES.find((p) => p.id === pose)?.label}
                    </span>
                  </div>
                </div>

                {/* Zoom + Rotate + Flip controls */}
                <div className="flex items-center gap-1.5 justify-center flex-wrap">
                  <button
                    type="button"
                    onClick={() => setZoom((z) => Math.max(0.5, z - 0.1))}
                    data-ocid="avatar.zoom_out_button"
                    title="Zoom out"
                    className="w-7 h-7 rounded-lg bg-muted/60 hover:bg-muted flex items-center justify-center transition-colors"
                  >
                    <Minus className="w-3 h-3" />
                  </button>
                  <span className="text-[10px] text-muted-foreground w-8 text-center tabular-nums">
                    {Math.round(zoom * 100)}%
                  </span>
                  <button
                    type="button"
                    onClick={() => setZoom((z) => Math.min(2.5, z + 0.1))}
                    data-ocid="avatar.zoom_in_button"
                    title="Zoom in"
                    className="w-7 h-7 rounded-lg bg-muted/60 hover:bg-muted flex items-center justify-center transition-colors"
                  >
                    <Plus className="w-3 h-3" />
                  </button>

                  <div className="w-px h-4 bg-border" />

                  <input
                    type="range"
                    min={-30}
                    max={30}
                    step={1}
                    value={rotation}
                    onChange={(e) => setRotation(Number(e.target.value))}
                    data-ocid="avatar.rotation_dial"
                    title={`Rotation: ${rotation}°`}
                    className="w-16 accent-primary h-1 cursor-pointer"
                    aria-label="Rotate avatar"
                  />
                  <button
                    type="button"
                    onClick={() => setRotation(0)}
                    title="Reset rotation"
                    className="text-[9px] text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <RotateCcw className="w-3 h-3" />
                  </button>

                  <div className="w-px h-4 bg-border" />

                  <button
                    type="button"
                    onClick={() => setMirrored((m) => !m)}
                    data-ocid="avatar.mirror_toggle"
                    title="Flip horizontally"
                    className={`w-7 h-7 rounded-lg flex items-center justify-center transition-all ${
                      mirrored
                        ? "bg-primary/20 text-primary border border-primary/40"
                        : "bg-muted/60 hover:bg-muted text-muted-foreground"
                    }`}
                  >
                    <FlipHorizontal className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Pose selector */}
              <div className="flex gap-1.5 justify-center">
                {POSES.map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => setPose(p.id)}
                    data-ocid={`avatar.pose.${p.id}`}
                    title={p.label}
                    className={`flex flex-col items-center gap-0.5 px-2.5 py-1.5 rounded-xl text-xs font-semibold transition-all border-2 ${
                      pose === p.id
                        ? "border-primary bg-primary/15 text-primary"
                        : "border-transparent bg-muted/50 hover:bg-muted text-muted-foreground"
                    }`}
                  >
                    <span className="text-base">{p.emoji}</span>
                    <span className="text-[9px] leading-none">{p.label}</span>
                  </button>
                ))}
              </div>

              {/* Preset slots */}
              <div className="flex flex-col items-center gap-1.5 w-full">
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                  Saved Looks
                </p>
                <div className="flex gap-2 justify-center">
                  {presets.map((slot, i) => (
                    <PresetDot
                      key={i}
                      slot={slot}
                      index={i}
                      isActive={activePreset === i}
                      onSave={savePreset}
                      onLoad={loadPreset}
                    />
                  ))}
                </div>
              </div>

              {/* CTA buttons */}
              <div className="flex flex-col gap-2 w-full max-w-[200px]">
                <Button
                  size="sm"
                  className="w-full rounded-full gap-1.5 text-xs font-bold"
                  onClick={() => onSetProfilePicture?.()}
                  data-ocid="avatar.set_profile_button"
                >
                  <UserCircle2 className="w-3.5 h-3.5" />
                  Set as Profile Picture
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="w-full rounded-full gap-1.5 text-xs"
                  onClick={handleShare}
                  data-ocid="avatar.share_button"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  Share Avatar
                </Button>
              </div>
            </div>

            {/* ── RIGHT: Customize / Store controls ── */}
            <div className="flex flex-col flex-1 min-h-0 min-w-0">
              {/* ── CUSTOMIZE MODE ── */}
              {mode === "customize" && (
                <>
                  <div
                    ref={tabBarRef}
                    className="flex overflow-x-auto scrollbar-hide border-b border-border bg-card shrink-0"
                  >
                    {CUSTOMIZE_TABS.map((tab) => (
                      <button
                        key={tab.id}
                        type="button"
                        onClick={() => setCustomizeTab(tab.id)}
                        data-ocid={`avatar.tab.${tab.id}`}
                        className={`flex flex-col items-center gap-0.5 px-3 py-2 text-[10px] font-semibold whitespace-nowrap transition-all border-b-2 shrink-0
                          ${
                            customizeTab === tab.id
                              ? "border-primary text-primary bg-primary/5"
                              : "border-transparent text-muted-foreground hover:text-foreground"
                          }`}
                      >
                        <span className="text-base">{tab.emoji}</span>
                        {tab.label}
                      </button>
                    ))}
                  </div>

                  <ScrollArea className="flex-1" style={{ maxHeight: 340 }}>
                    <div className="p-3">
                      {/* Body tab */}
                      {customizeTab === "body" && (
                        <div>
                          <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider mb-2">
                            Skin Tone
                          </p>
                          <div className="grid grid-cols-4 sm:grid-cols-7 gap-2 mb-4">
                            {SKIN_OPTIONS.map((opt) => (
                              <OptionTile
                                key={opt.id}
                                selected={config.skinTone === opt.id}
                                onClick={() =>
                                  handleChange({ skinTone: opt.id })
                                }
                                ocid={`avatar.skin.${opt.id}`}
                                highlight={
                                  highlightPart === "body" &&
                                  config.skinTone !== opt.id
                                }
                              >
                                <div
                                  className="w-8 h-8 rounded-full border-2 border-border/60"
                                  style={{ backgroundColor: opt.color }}
                                  onMouseEnter={() => setHighlightPart("body")}
                                  onMouseLeave={() => setHighlightPart(null)}
                                />
                                <span className="text-[9px] text-muted-foreground">
                                  {opt.label}
                                </span>
                              </OptionTile>
                            ))}
                          </div>
                          <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider mb-2">
                            Outfit Color
                          </p>
                          <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
                            {OUTFIT_COLORS.map((opt) => (
                              <OptionTile
                                key={opt.id}
                                selected={config.outfitColor === opt.id}
                                onClick={() =>
                                  handleChange({ outfitColor: opt.id })
                                }
                                ocid={`avatar.outfit_color.${opt.id}`}
                              >
                                <div
                                  className="w-8 h-8 rounded-full border-2 border-border/40"
                                  style={{ backgroundColor: opt.id }}
                                />
                                <span className="text-[9px] text-muted-foreground">
                                  {opt.label}
                                </span>
                              </OptionTile>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Hair tab */}
                      {customizeTab === "hair" && (
                        <div>
                          <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider mb-2">
                            Hair Style{" "}
                            <span className="text-primary/60 font-normal normal-case capitalize">
                              — {gender}
                            </span>
                          </p>
                          <div className="grid grid-cols-4 gap-2 mb-4">
                            {hairStyles.map((opt) => (
                              <OptionTile
                                key={opt.id}
                                selected={config.hairStyle === opt.id}
                                onClick={() =>
                                  handleChange({ hairStyle: opt.id })
                                }
                                ocid={`avatar.hair_style.${opt.id}`}
                                highlight={highlightPart === "hair"}
                              >
                                <span
                                  className="text-xl"
                                  onMouseEnter={() => setHighlightPart("hair")}
                                  onMouseLeave={() => setHighlightPart(null)}
                                >
                                  {opt.emoji}
                                </span>
                                <span className="text-[9px] text-muted-foreground">
                                  {opt.label}
                                </span>
                              </OptionTile>
                            ))}
                          </div>
                          <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider mb-2">
                            Hair Color
                          </p>
                          <div className="grid grid-cols-5 sm:grid-cols-9 gap-2">
                            {HAIR_COLORS.map((opt) => (
                              <OptionTile
                                key={opt.id}
                                selected={config.hairColor === opt.id}
                                onClick={() =>
                                  handleChange({ hairColor: opt.id })
                                }
                                ocid={`avatar.hair_color.${opt.id}`}
                              >
                                <div
                                  className="w-8 h-8 rounded-full border-2 border-border/40"
                                  style={{ backgroundColor: opt.color }}
                                />
                                <span className="text-[9px] text-muted-foreground">
                                  {opt.label}
                                </span>
                              </OptionTile>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Face tab */}
                      {customizeTab === "face" && (
                        <div>
                          <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider mb-2">
                            Eyes
                          </p>
                          <div className="grid grid-cols-4 sm:grid-cols-5 gap-2 mb-4">
                            {EYE_SHAPES.map((opt) => (
                              <OptionTile
                                key={opt.id}
                                selected={config.eyeShape === opt.id}
                                onClick={() =>
                                  handleChange({ eyeShape: opt.id })
                                }
                                ocid={`avatar.eye.${opt.id}`}
                                highlight={highlightPart === "eyes"}
                              >
                                <span
                                  className="text-xl"
                                  onMouseEnter={() => setHighlightPart("eyes")}
                                  onMouseLeave={() => setHighlightPart(null)}
                                >
                                  {opt.icon}
                                </span>
                                <span className="text-[9px] text-muted-foreground">
                                  {opt.label}
                                </span>
                              </OptionTile>
                            ))}
                          </div>
                          <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider mb-2">
                            Eye Color
                          </p>
                          <div className="grid grid-cols-4 sm:grid-cols-8 gap-2 mb-4">
                            {EYE_COLORS.map((opt) => (
                              <OptionTile
                                key={opt.id}
                                selected={
                                  (config.eyeColor ?? "brown") === opt.id
                                }
                                onClick={() =>
                                  handleChange({ eyeColor: opt.id })
                                }
                                ocid={`avatar.eye_color.${opt.id}`}
                              >
                                <div
                                  className="w-8 h-8 rounded-full border-2 border-border/40 flex items-center justify-center"
                                  style={{ backgroundColor: opt.color }}
                                >
                                  {opt.id === "cyber" && (
                                    <span className="text-[8px] text-white font-bold">
                                      AR
                                    </span>
                                  )}
                                </div>
                                <span className="text-[9px] text-muted-foreground">
                                  {opt.label}
                                </span>
                              </OptionTile>
                            ))}
                          </div>
                          <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider mb-2">
                            Eyebrows
                          </p>
                          <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 mb-4">
                            {eyebrowStyles.map((opt) => (
                              <OptionTile
                                key={opt.id}
                                selected={config.eyebrowStyle === opt.id}
                                onClick={() =>
                                  handleChange({ eyebrowStyle: opt.id })
                                }
                                ocid={`avatar.eyebrow.${opt.id}`}
                              >
                                <span className="text-xl font-bold">
                                  {opt.icon}
                                </span>
                                <span className="text-[9px] text-muted-foreground">
                                  {opt.label}
                                </span>
                              </OptionTile>
                            ))}
                          </div>
                          <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider mb-2">
                            Mouth / Expression
                          </p>
                          <div className="grid grid-cols-4 sm:grid-cols-5 gap-2">
                            {MOUTH_STYLES.map((opt) => (
                              <OptionTile
                                key={opt.id}
                                selected={config.mouthStyle === opt.id}
                                onClick={() =>
                                  handleChange({ mouthStyle: opt.id })
                                }
                                ocid={`avatar.mouth.${opt.id}`}
                                highlight={highlightPart === "mouth"}
                              >
                                <span
                                  className="text-xl"
                                  onMouseEnter={() => setHighlightPart("mouth")}
                                  onMouseLeave={() => setHighlightPart(null)}
                                >
                                  {opt.icon}
                                </span>
                                <span className="text-[9px] text-muted-foreground">
                                  {opt.label}
                                </span>
                              </OptionTile>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Outfit tab */}
                      {customizeTab === "outfit" && (
                        <div>
                          <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider mb-2">
                            Outfit Style
                          </p>
                          <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                            {STORE_ITEMS_BY_CATEGORY.outfits.map((item) => (
                              <OptionTile
                                key={item.id}
                                selected={
                                  equippedStoreItems.outfits === item.id
                                }
                                onClick={() => {
                                  if (isOwned(item)) handleEquip(item);
                                }}
                                locked={!isOwned(item)}
                                cost={item.cost}
                                ocid={`avatar.outfit.${item.id}`}
                              >
                                <span className="text-2xl">{item.emoji}</span>
                                <span className="text-[9px] text-muted-foreground text-center leading-tight line-clamp-2">
                                  {item.label}
                                </span>
                                {item.season && item.season !== "all" && (
                                  <span
                                    className={`text-[8px] px-1 rounded-full border ${SEASON_BADGE_COLORS[item.season]}`}
                                  >
                                    {SEASON_ICONS[item.season]}
                                  </span>
                                )}
                              </OptionTile>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Accessories tab */}
                      {customizeTab === "accessories" && (
                        <div>
                          <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider mb-2">
                            Face Accessories
                          </p>
                          <div className="grid grid-cols-4 gap-2 mb-4">
                            {accessories.map((opt) => (
                              <OptionTile
                                key={opt.id}
                                selected={config.accessory === opt.id}
                                onClick={() =>
                                  handleChange({ accessory: opt.id })
                                }
                                ocid={`avatar.accessory.${opt.id}`}
                              >
                                <span className="text-xl">{opt.icon}</span>
                                <span className="text-[9px] text-muted-foreground">
                                  {opt.label}
                                </span>
                              </OptionTile>
                            ))}
                          </div>
                          <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider mb-2">
                            Store Accessories
                          </p>
                          <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                            {STORE_ITEMS_BY_CATEGORY.accessories.map((item) => (
                              <OptionTile
                                key={item.id}
                                selected={
                                  equippedStoreItems.accessories === item.id
                                }
                                onClick={() => {
                                  if (isOwned(item)) handleEquip(item);
                                }}
                                locked={!isOwned(item)}
                                cost={item.cost}
                                ocid={`avatar.store_acc.${item.id}`}
                              >
                                <span className="text-2xl">{item.emoji}</span>
                                <span className="text-[9px] text-muted-foreground text-center leading-tight line-clamp-2">
                                  {item.label}
                                </span>
                              </OptionTile>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Background tab */}
                      {customizeTab === "background" && (
                        <div>
                          <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider mb-2">
                            Background Scene
                          </p>
                          <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                            {STORE_ITEMS_BY_CATEGORY.backgrounds.map((item) => (
                              <OptionTile
                                key={item.id}
                                selected={
                                  equippedStoreItems.backgrounds === item.id
                                }
                                onClick={() => {
                                  if (isOwned(item)) handleEquip(item);
                                }}
                                locked={!isOwned(item)}
                                cost={item.cost}
                                ocid={`avatar.bg.${item.id}`}
                              >
                                <span className="text-2xl">{item.emoji}</span>
                                <span className="text-[9px] text-muted-foreground text-center leading-tight line-clamp-2">
                                  {item.label}
                                </span>
                              </OptionTile>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </ScrollArea>
                </>
              )}

              {/* ── STORE MODE ── */}
              {mode === "store" && (
                <>
                  <div className="flex overflow-x-auto scrollbar-hide border-b border-border bg-card shrink-0">
                    {storeCategories.map((cat) => {
                      const unowned = STORE_ITEMS_BY_CATEGORY[cat].filter(
                        (item) =>
                          !ownedItems.includes(item.id) && item.cost > 0,
                      ).length;
                      return (
                        <button
                          key={cat}
                          type="button"
                          onClick={() => {
                            setStoreCategory(cat);
                            setPreviewItem(null);
                          }}
                          data-ocid={`store.category.${cat}`}
                          className={`relative flex items-center gap-1 px-3 py-2.5 text-xs font-semibold whitespace-nowrap transition-all border-b-2 shrink-0
                            ${
                              storeCategory === cat
                                ? "border-primary text-primary bg-primary/5"
                                : "border-transparent text-muted-foreground hover:text-foreground"
                            }`}
                        >
                          {CATEGORY_LABELS[cat]}
                          {unowned > 0 && (
                            <span className="min-w-[16px] h-4 px-1 text-[9px] font-bold bg-primary text-primary-foreground rounded-full flex items-center justify-center leading-none">
                              {unowned}
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {storeCategory === "outfits" && (
                    <div className="flex overflow-x-auto scrollbar-hide border-b border-border bg-muted/20 shrink-0 px-2 py-1.5 gap-1">
                      {SEASON_FILTERS.map((sf) => (
                        <button
                          key={sf.id}
                          type="button"
                          onClick={() => setSeasonFilter(sf.id)}
                          data-ocid={`store.season_filter.${sf.id}`}
                          className={`flex-shrink-0 px-2.5 py-1 rounded-full text-[10px] font-semibold transition-all whitespace-nowrap
                            ${
                              seasonFilter === sf.id
                                ? "bg-primary text-primary-foreground shadow-sm"
                                : "bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground"
                            }`}
                        >
                          {sf.label}
                        </button>
                      ))}
                      {seasonFilter !== "all" && (
                        <span className="ml-auto flex-shrink-0 self-center text-[9px] text-muted-foreground px-1">
                          {filteredStoreItems.length} items
                        </span>
                      )}
                    </div>
                  )}

                  <ScrollArea className="flex-1" style={{ maxHeight: 290 }}>
                    <div className="p-3 grid grid-cols-3 sm:grid-cols-4 gap-2">
                      {filteredStoreItems.map((item) => (
                        <StoreCard
                          key={item.id}
                          item={item}
                          isOwned={isOwned(item)}
                          isEquipped={isEquipped(item)}
                          isPreviewing={isPreviewing(item)}
                          canAfford={gcoinDisplay >= item.cost}
                          shortage={item.cost - gcoinDisplay}
                          onPreview={handlePreview}
                          onBuy={handleBuy}
                          onEquip={handleEquip}
                        />
                      ))}
                    </div>
                  </ScrollArea>

                  {previewItem && (
                    <div className="px-3 py-2.5 border-t border-border bg-muted/30 flex items-center justify-between gap-2 shrink-0">
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="text-xl">{previewItem.emoji}</span>
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <p className="text-xs font-bold text-foreground truncate">
                              {previewItem.label}
                            </p>
                            {previewItem.season &&
                              previewItem.season !== "all" && (
                                <span
                                  className={`flex-shrink-0 text-[9px] px-1.5 py-0.5 rounded-full border font-bold ${SEASON_BADGE_COLORS[previewItem.season]}`}
                                >
                                  {SEASON_ICONS[previewItem.season]}{" "}
                                  {previewItem.season === getCurrentSeason()
                                    ? "In Season"
                                    : SEASON_LABELS[previewItem.season].split(
                                        " ",
                                      )[1]}
                                </span>
                              )}
                          </div>
                          <p className="text-[10px] text-muted-foreground truncate">
                            {previewItem.description}
                          </p>
                          {previewItem.cost > 0 ? (
                            <p className="text-[10px] text-amber-400 font-bold">
                              💰 {previewItem.cost} GCoins
                            </p>
                          ) : (
                            <p className="text-[10px] text-emerald-400 font-bold">
                              Free
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-1.5 shrink-0">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setPreviewItem(null)}
                          data-ocid="store.cancel_preview_button"
                          className="h-7 text-xs px-2"
                        >
                          Cancel
                        </Button>
                        {isOwned(previewItem) ? (
                          <Button
                            size="sm"
                            onClick={() => handleEquip(previewItem)}
                            data-ocid="store.equip_button"
                            className={`h-7 text-xs px-3 ${isEquipped(previewItem) ? "bg-emerald-600 hover:bg-emerald-500" : ""}`}
                          >
                            {isEquipped(previewItem) ? "✓ Equipped" : "Equip"}
                          </Button>
                        ) : (
                          <Button
                            size="sm"
                            onClick={() => handleBuy(previewItem)}
                            disabled={gcoinDisplay < previewItem.cost}
                            data-ocid="store.buy_equip_button"
                            className="h-7 text-xs px-3 bg-amber-500 text-black hover:bg-amber-400 disabled:bg-muted disabled:text-muted-foreground"
                          >
                            {gcoinDisplay < previewItem.cost
                              ? `Need ${previewItem.cost - gcoinDisplay} more 💰`
                              : `Buy & Equip 💰${previewItem.cost}`}
                          </Button>
                        )}
                      </div>
                    </div>
                  )}
                </>
              )}

              {/* Footer hint */}
              <div className="px-3 py-2 border-t border-border bg-muted/20 shrink-0 flex items-center justify-between gap-2">
                <p className="text-[10px] text-muted-foreground flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-amber-400" />
                  Complete AR/VR domain to unlock VR Suit, Headset &amp; AR
                  Glasses!
                </p>
                <Badge
                  variant="outline"
                  className="text-[10px] border-amber-500/40 text-amber-400"
                >
                  💰 {gcoinDisplay.toLocaleString()}
                </Badge>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
