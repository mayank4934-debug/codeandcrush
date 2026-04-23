import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Check, Info } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import {
  CATEGORY_LABELS,
  STORE_ITEMS_BY_CATEGORY,
  type StoreCategory,
  type StoreItem,
} from "../data/clothing";
import type { AvatarConfig } from "./WhatsAppAvatar";
import WhatsAppAvatar from "./WhatsAppAvatar";

// ── Legacy customization data (preserved) ────────────────────────────────────
const SKIN_OPTIONS = [
  { id: "light", color: "#FDDBB4", label: "Light" },
  { id: "medium-light", color: "#F5C89A", label: "Med Light" },
  { id: "medium", color: "#E8A87C", label: "Medium" },
  { id: "tan", color: "#D4956A", label: "Tan" },
  { id: "medium-dark", color: "#C68642", label: "Med Dark" },
  { id: "dark", color: "#8D5524", label: "Dark" },
  { id: "very-dark", color: "#4A2912", label: "Very Dark" },
];

const HAIR_STYLES = [
  { id: "short", emoji: "💇", label: "Short" },
  { id: "long", emoji: "👩", label: "Long" },
  { id: "wavy", emoji: "〰️", label: "Wavy" },
  { id: "curly", emoji: "🌀", label: "Curly" },
  { id: "bun", emoji: "🎀", label: "Bun" },
  { id: "spiky", emoji: "⚡", label: "Spiky" },
  { id: "buzz", emoji: "✂️", label: "Buzz" },
];

const HAIR_COLORS = [
  { id: "black", color: "#1a1a1a", label: "Black" },
  { id: "brown", color: "#6B3A2A", label: "Brown" },
  { id: "blonde", color: "#F4C14D", label: "Blonde" },
  { id: "red", color: "#C0392B", label: "Red" },
  { id: "gray", color: "#9B9B9B", label: "Gray" },
  { id: "white", color: "#DDDDDD", label: "White" },
  { id: "blue", color: "#4A90D9", label: "Blue" },
  { id: "purple", color: "#8E44AD", label: "Purple" },
  { id: "pink", color: "#FF69B4", label: "Pink" },
];

const EYE_SHAPES = [
  { id: "round", label: "Round", icon: "●" },
  { id: "almond", label: "Almond", icon: "◉" },
  { id: "wide", label: "Wide", icon: "◎" },
  { id: "sleepy", label: "Sleepy", icon: "—" },
  { id: "sparkle", label: "Sparkle", icon: "✨" },
];

const EYEBROW_STYLES = [
  { id: "straight", label: "Straight", icon: "—" },
  { id: "arched", label: "Arched", icon: "∧" },
  { id: "thick", label: "Thick", icon: "▬" },
];

const MOUTH_STYLES = [
  { id: "smile", label: "Smile", icon: "🙂" },
  { id: "big-smile", label: "Big Smile", icon: "😄" },
  { id: "neutral", label: "Neutral", icon: "😐" },
  { id: "smirk", label: "Smirk", icon: "😏" },
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

const LEGACY_ACCESSORIES = [
  { id: "none", label: "None", icon: "✕" },
  { id: "glasses", label: "Glasses", icon: "👓" },
  { id: "sunglasses", label: "Sunnies", icon: "🕶️" },
  { id: "earrings", label: "Earrings", icon: "💎" },
  { id: "headband", label: "Headband", icon: "🎀" },
];

// ── Types ─────────────────────────────────────────────────────────────────────
type OptionItem = {
  id: string;
  color?: string;
  label: string;
  emoji?: string;
  icon?: string;
};

type BuilderTab = "avatar" | "store";

// ── Section (customize tab) ───────────────────────────────────────────────────
function Section({
  title,
  options,
  value,
  onChange,
  renderOption,
}: {
  title: string;
  options: OptionItem[];
  value: string;
  onChange: (id: string) => void;
  renderOption?: (opt: OptionItem, selected: boolean) => React.ReactNode;
}) {
  return (
    <div className="mb-5">
      <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2.5">
        {title}
      </p>
      <div className="flex flex-wrap gap-2">
        {options.map((opt) => {
          const selected = value === opt.id;
          return (
            <button
              key={opt.id}
              type="button"
              onClick={() => onChange(opt.id)}
              className={`relative rounded-xl border-2 transition-all ${
                selected
                  ? "border-primary shadow-md scale-105"
                  : "border-transparent hover:border-primary/40"
              }`}
            >
              {renderOption ? (
                renderOption(opt, selected)
              ) : (
                <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center text-lg">
                  {opt.emoji ?? opt.icon}
                </div>
              )}
              {selected && (
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-primary rounded-full flex items-center justify-center">
                  <Check className="w-2.5 h-2.5 text-white" />
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ── Instagram Story Ring ──────────────────────────────────────────────────────
function StoryRing({
  hasNew,
  allOwned,
  size = 88,
}: { hasNew: boolean; allOwned: boolean; size?: number }) {
  if (allOwned) return null;
  const ringSize = size + 10;
  const cx = ringSize / 2;
  const cy = ringSize / 2;
  const r = size / 2 + 1;

  return (
    <div
      className="absolute inset-0 flex items-center justify-center pointer-events-none"
      aria-hidden="true"
    >
      <svg
        width={ringSize}
        height={ringSize}
        viewBox={`0 0 ${ringSize} ${ringSize}`}
        role="img"
        aria-label="Avatar story ring"
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          animation: hasNew ? "spin 3s linear infinite" : undefined,
        }}
      >
        <title>Avatar story ring</title>
        <defs>
          <linearGradient
            id="story-ring-grad"
            x1="0%"
            y1="0%"
            x2="100%"
            y2="100%"
          >
            {hasNew ? (
              <>
                <stop offset="0%" stopColor="#f97316" />
                <stop offset="25%" stopColor="#ec4899" />
                <stop offset="60%" stopColor="#8b5cf6" />
                <stop offset="100%" stopColor="#3b82f6" />
              </>
            ) : (
              <>
                <stop offset="0%" stopColor="oklch(0.58 0.2 265)" />
                <stop offset="100%" stopColor="oklch(0.52 0.15 285)" />
              </>
            )}
          </linearGradient>
        </defs>
        <circle
          cx={cx}
          cy={cy}
          r={r}
          fill="none"
          stroke="url(#story-ring-grad)"
          strokeWidth={hasNew ? "3" : "2"}
          opacity={hasNew ? 1 : 0.6}
          strokeDasharray={hasNew ? "6 3" : undefined}
        />
      </svg>
      {/* Outer pulse for new-items state */}
      {hasNew && (
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: ringSize + 8,
            height: ringSize + 8,
            borderRadius: "50%",
            border: "2px solid rgba(236,72,153,0.4)",
            animation: "pulse 2s ease-in-out infinite",
          }}
        />
      )}
    </div>
  );
}

// ── Item Card ─────────────────────────────────────────────────────────────────
function ItemCard({
  item,
  isOwned,
  isEquipped,
  isPreviewing,
  gcoinDisplay,
  onPreview,
  onBuy,
  onEquip,
}: {
  item: StoreItem;
  isOwned: boolean;
  isEquipped: boolean;
  isPreviewing: boolean;
  gcoinDisplay: number;
  onPreview: (item: StoreItem) => void;
  onBuy: (item: StoreItem) => void;
  onEquip: (item: StoreItem) => void;
}) {
  const [hovered, setHovered] = useState(false);
  const canAfford = gcoinDisplay >= item.cost;
  const shortage = item.cost - gcoinDisplay;
  const showActions = hovered || isPreviewing;

  return (
    <div
      className={`relative rounded-xl border-2 overflow-hidden transition-all duration-150 flex flex-col cursor-pointer
        ${
          isPreviewing
            ? "border-primary bg-primary/10 shadow-lg shadow-primary/20 scale-[1.03]"
            : isEquipped
              ? "border-emerald-500/70 bg-emerald-500/5"
              : isOwned
                ? "border-emerald-500/30 bg-card"
                : "border-border bg-card hover:border-primary/50"
        }`}
      onMouseEnter={() => {
        setHovered(true);
        onPreview(item);
      }}
      onMouseLeave={() => setHovered(false)}
      onTouchStart={() => onPreview(item)}
      data-ocid={`store.item.${item.id}`}
    >
      {/* Top badges */}
      {isEquipped && (
        <span className="absolute top-1 right-1 z-10 px-1 py-0.5 text-[9px] font-bold bg-emerald-500 text-white rounded-full leading-none">
          On
        </span>
      )}
      {isOwned && !isEquipped && (
        <span className="absolute top-1 right-1 z-10 w-4 h-4 bg-emerald-500 rounded-full flex items-center justify-center">
          <Check className="w-2.5 h-2.5 text-white" />
        </span>
      )}
      {!isOwned && !canAfford && (
        <span
          className="absolute top-1 left-1 z-10 w-4 h-4 bg-destructive/80 rounded-full flex items-center justify-center"
          title={`Need ${shortage} more GCoins`}
        >
          <Info className="w-2.5 h-2.5 text-white" />
        </span>
      )}

      {/* Main content */}
      <button
        type="button"
        onClick={() => onPreview(item)}
        className="flex flex-col items-center gap-1 p-2 pt-3 w-full focus:outline-none"
      >
        <div
          className={`w-10 h-10 rounded-lg flex items-center justify-center text-2xl leading-none transition-colors
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

      {/* Hover/preview action button */}
      {showActions && (
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
            <div className="relative group/tip">
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
                      : "bg-muted text-muted-foreground cursor-not-allowed opacity-70"
                  }`}
              >
                {canAfford ? `Buy 💰${item.cost}` : `+${shortage} 💰`}
              </button>
              {!canAfford && (
                <div className="absolute bottom-full mb-1 left-1/2 -translate-x-1/2 bg-foreground text-background text-[9px] px-2 py-0.5 rounded whitespace-nowrap opacity-0 group-hover/tip:opacity-100 transition-opacity pointer-events-none z-30">
                  Need {shortage} more GCoins
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────
interface AvatarBuilderProps {
  config: AvatarConfig;
  onChange: (patch: Partial<AvatarConfig>) => void;
  onDone: () => void;
  gcoins?: number;
  ownedItems?: string[];
  equippedStoreItems?: Record<StoreCategory, string>;
  onBuyItem?: (item: StoreItem) => void;
  onEquipItem?: (item: StoreItem) => void;
}

export default function AvatarBuilder({
  config,
  onChange,
  onDone,
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
}: AvatarBuilderProps) {
  const [builderTab, setBuilderTab] = useState<BuilderTab>("store");
  const [storeCategory, setStoreCategory] = useState<StoreCategory>("outfits");
  const [previewItem, setPreviewItem] = useState<StoreItem | null>(null);
  const [gcoinDisplay, setGcoinDisplay] = useState(gcoins);
  const prevCoins = useRef(gcoins);

  useEffect(() => {
    if (gcoins !== prevCoins.current) {
      prevCoins.current = gcoins;
      setGcoinDisplay(gcoins);
    }
  }, [gcoins]);

  const totalUnowned = Object.values(STORE_ITEMS_BY_CATEGORY)
    .flat()
    .filter((item) => !ownedItems.includes(item.id) && item.cost > 0).length;
  const allOwned = totalUnowned === 0;

  const hasNewInCategory = STORE_ITEMS_BY_CATEGORY[storeCategory].some(
    (item) => !ownedItems.includes(item.id) && item.cost > 0,
  );

  const isOwned = (item: StoreItem) =>
    ownedItems.includes(item.id) || item.cost === 0;
  const isEquipped = (item: StoreItem) =>
    equippedStoreItems[item.category] === item.id;
  const isPreviewing = (item: StoreItem) => previewItem?.id === item.id;

  function handlePreview(item: StoreItem) {
    setPreviewItem((prev) => (prev?.id === item.id ? null : item));
  }

  function handleCancelPreview() {
    setPreviewItem(null);
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

  const categories: StoreCategory[] = [
    "outfits",
    "accessories",
    "backgrounds",
    "pets",
    "special",
  ];

  // Equipped items for badge display
  const equippedOutfit = STORE_ITEMS_BY_CATEGORY.outfits.find(
    (i) => i.id === equippedStoreItems.outfits,
  );
  const equippedAcc = STORE_ITEMS_BY_CATEGORY.accessories.find(
    (i) => i.id === equippedStoreItems.accessories,
  );
  const equippedPet = STORE_ITEMS_BY_CATEGORY.pets.find(
    (i) => i.id === equippedStoreItems.pets,
  );

  return (
    <div className="bg-card rounded-2xl border border-border overflow-hidden flex flex-col">
      {/* ── Header ── */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-muted/40 shrink-0">
        <div className="flex items-center gap-2">
          <span className="text-lg font-bold text-amber-400">💰</span>
          <span
            className="text-sm font-bold text-amber-400 tabular-nums"
            data-ocid="avatar.gcoins_display"
          >
            {gcoinDisplay.toLocaleString()} GCoins
          </span>
        </div>
        <div className="flex gap-1 bg-muted rounded-full p-0.5">
          <button
            type="button"
            onClick={() => setBuilderTab("store")}
            data-ocid="avatar.store_tab"
            className={`text-xs px-3 py-1 rounded-full font-semibold transition-all ${
              builderTab === "store"
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            🛍️ Store
          </button>
          <button
            type="button"
            onClick={() => setBuilderTab("avatar")}
            data-ocid="avatar.customize_tab"
            className={`text-xs px-3 py-1 rounded-full font-semibold transition-all ${
              builderTab === "avatar"
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            🎨 Customize
          </button>
        </div>
        <Button
          size="sm"
          onClick={onDone}
          className="h-7 text-xs rounded-full px-4"
          data-ocid="avatar.done_button"
        >
          Done ✓
        </Button>
      </div>

      {/* ── Avatar Preview with Instagram Story Ring ── */}
      <div className="flex flex-col items-center py-5 bg-muted/20 border-b border-border shrink-0">
        <div
          className="relative flex items-center justify-center"
          style={{ width: 100, height: 100 }}
        >
          {/* Story ring (behind avatar) */}
          <StoryRing hasNew={hasNewInCategory} allOwned={allOwned} size={88} />
          {/* Avatar circle */}
          <div className="w-20 h-20 rounded-full overflow-hidden bg-muted border-2 border-background z-10 relative">
            <WhatsAppAvatar config={config} size={80} />
          </div>
        </div>

        {/* Preview badge / equipped items display */}
        <div className="flex gap-1.5 mt-3 flex-wrap justify-center px-3 items-center">
          {previewItem ? (
            <>
              <Badge
                variant="outline"
                className="text-[10px] border-primary text-primary bg-primary/10 animate-pulse"
              >
                👁 Previewing: {previewItem.emoji} {previewItem.label}
              </Badge>
              <button
                type="button"
                onClick={handleCancelPreview}
                data-ocid="store.cancel_preview_button"
                className="text-[10px] text-muted-foreground underline hover:text-foreground transition-colors"
              >
                Reset
              </button>
            </>
          ) : (
            <>
              {equippedOutfit && equippedOutfit.id !== "outfit-casual-tee" && (
                <Badge variant="outline" className="text-[10px]">
                  {equippedOutfit.emoji} {equippedOutfit.label}
                </Badge>
              )}
              {equippedAcc && equippedAcc.id !== "acc-none" && (
                <Badge variant="outline" className="text-[10px]">
                  {equippedAcc.emoji}
                </Badge>
              )}
              {equippedPet && equippedPet.id !== "pet-none" && (
                <Badge variant="outline" className="text-[10px]">
                  {equippedPet.emoji}
                </Badge>
              )}
            </>
          )}
        </div>
      </div>

      {/* ── STORE TAB ── */}
      {builderTab === "store" && (
        <div className="flex flex-col flex-1 min-h-0">
          {/* Category tabs */}
          <div className="flex overflow-x-auto border-b border-border bg-card shrink-0 scrollbar-hide">
            {categories.map((cat) => {
              const catItems = STORE_ITEMS_BY_CATEGORY[cat];
              const unownedCount = catItems.filter(
                (item) => !ownedItems.includes(item.id) && item.cost > 0,
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
                  {unownedCount > 0 && (
                    <span className="ml-0.5 min-w-[16px] h-4 px-1 text-[9px] font-bold bg-primary text-primary-foreground rounded-full flex items-center justify-center leading-none">
                      {unownedCount}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Items grid — 3 cols on mobile, 4 on desktop */}
          <ScrollArea className="flex-1" style={{ maxHeight: 240 }}>
            <div className="p-3 grid grid-cols-3 sm:grid-cols-4 gap-2">
              {STORE_ITEMS_BY_CATEGORY[storeCategory].map((item) => (
                <ItemCard
                  key={item.id}
                  item={item}
                  isOwned={isOwned(item)}
                  isEquipped={isEquipped(item)}
                  isPreviewing={isPreviewing(item)}
                  gcoinDisplay={gcoinDisplay}
                  onPreview={handlePreview}
                  onBuy={handleBuy}
                  onEquip={handleEquip}
                />
              ))}
            </div>
          </ScrollArea>

          {/* Preview action bar */}
          {previewItem && (
            <div className="px-3 py-2.5 border-t border-border bg-muted/30 flex items-center justify-between gap-2 shrink-0">
              <div className="flex items-center gap-2 min-w-0">
                <span className="text-xl">{previewItem.emoji}</span>
                <div className="min-w-0">
                  <p className="text-xs font-bold text-foreground truncate">
                    {previewItem.label}
                  </p>
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
                  onClick={handleCancelPreview}
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
                  <div className="relative group/afford">
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
                    {gcoinDisplay < previewItem.cost && (
                      <div className="absolute bottom-full mb-1 right-0 bg-foreground text-background text-[10px] px-2 py-1 rounded-lg whitespace-nowrap opacity-0 group-hover/afford:opacity-100 transition-opacity pointer-events-none z-20">
                        Need {previewItem.cost - gcoinDisplay} more GCoins to
                        buy
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* All owned state */}
          {allOwned && (
            <div className="px-3 py-2 border-t border-border bg-emerald-500/5 text-center shrink-0">
              <p className="text-[10px] text-emerald-400 font-bold">
                🎉 You own everything in the store!
              </p>
            </div>
          )}
        </div>
      )}

      {/* ── CUSTOMIZE TAB ── */}
      {builderTab === "avatar" && (
        <ScrollArea className="flex-1" style={{ maxHeight: 300 }}>
          <div className="p-4">
            <Section
              title="Skin Tone"
              options={SKIN_OPTIONS}
              value={config.skinTone}
              onChange={(v) => onChange({ skinTone: v })}
              renderOption={(opt, selected) => (
                <div
                  className={`w-10 h-10 rounded-xl border-2 ${selected ? "border-primary" : "border-border"}`}
                  style={{ backgroundColor: opt.color }}
                />
              )}
            />
            <Section
              title="Hair Style"
              options={HAIR_STYLES}
              value={config.hairStyle}
              onChange={(v) => onChange({ hairStyle: v })}
              renderOption={(opt, selected) => (
                <div
                  className={`w-10 h-10 rounded-xl bg-muted flex flex-col items-center justify-center ${selected ? "bg-primary/10" : ""}`}
                >
                  <span className="text-lg">{opt.emoji}</span>
                  <span className="text-[9px] text-muted-foreground">
                    {opt.label}
                  </span>
                </div>
              )}
            />
            <Section
              title="Hair Color"
              options={HAIR_COLORS}
              value={config.hairColor}
              onChange={(v) => onChange({ hairColor: v })}
              renderOption={(opt, selected) => (
                <div
                  className={`w-8 h-8 rounded-full border-2 ${selected ? "border-primary" : "border-border"}`}
                  style={{ backgroundColor: opt.color }}
                />
              )}
            />
            <Section
              title="Eye Shape"
              options={EYE_SHAPES}
              value={config.eyeShape}
              onChange={(v) => onChange({ eyeShape: v })}
              renderOption={(opt, selected) => (
                <div
                  className={`w-12 h-10 rounded-xl flex flex-col items-center justify-center ${selected ? "bg-primary/10" : "bg-muted"}`}
                >
                  <span className="text-base">{opt.icon}</span>
                  <span className="text-[9px] text-muted-foreground mt-0.5">
                    {opt.label}
                  </span>
                </div>
              )}
            />
            <Section
              title="Eyebrows"
              options={EYEBROW_STYLES}
              value={config.eyebrowStyle}
              onChange={(v) => onChange({ eyebrowStyle: v })}
              renderOption={(opt, selected) => (
                <div
                  className={`w-14 h-10 rounded-xl flex flex-col items-center justify-center ${selected ? "bg-primary/10" : "bg-muted"}`}
                >
                  <span className="text-base font-bold">{opt.icon}</span>
                  <span className="text-[9px] text-muted-foreground mt-0.5">
                    {opt.label}
                  </span>
                </div>
              )}
            />
            <Section
              title="Mouth"
              options={MOUTH_STYLES}
              value={config.mouthStyle}
              onChange={(v) => onChange({ mouthStyle: v })}
              renderOption={(opt, selected) => (
                <div
                  className={`w-12 h-10 rounded-xl flex flex-col items-center justify-center ${selected ? "bg-primary/10" : "bg-muted"}`}
                >
                  <span className="text-lg">{opt.icon}</span>
                  <span className="text-[9px] text-muted-foreground">
                    {opt.label}
                  </span>
                </div>
              )}
            />
            <Section
              title="Outfit Color"
              options={OUTFIT_COLORS}
              value={config.outfitColor}
              onChange={(v) => onChange({ outfitColor: v })}
              renderOption={(opt, selected) => (
                <div
                  className={`w-9 h-9 rounded-full border-2 ${selected ? "border-primary" : "border-border"}`}
                  style={{ backgroundColor: opt.id }}
                />
              )}
            />
            <Section
              title="Accessories"
              options={LEGACY_ACCESSORIES}
              value={config.accessory}
              onChange={(v) => onChange({ accessory: v })}
              renderOption={(opt, selected) => (
                <div
                  className={`w-12 h-10 rounded-xl flex flex-col items-center justify-center ${selected ? "bg-primary/10" : "bg-muted"}`}
                >
                  <span className="text-lg">{opt.icon}</span>
                  <span className="text-[9px] text-muted-foreground">
                    {opt.label}
                  </span>
                </div>
              )}
            />
          </div>
        </ScrollArea>
      )}
    </div>
  );
}
