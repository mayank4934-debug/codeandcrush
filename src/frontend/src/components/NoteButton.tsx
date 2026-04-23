import { StickyNote } from "lucide-react";
import { useEffect, useState } from "react";
import NotesPanel from "./NotesPanel";

interface Props {
  topicId: string;
  topicTitle: string;
  /** Optional size variant */
  size?: "sm" | "md";
}

function getNoteCount(topicId: string): number {
  try {
    const all = JSON.parse(localStorage.getItem("cc_notes") ?? "[]") as Array<{
      topicId: string;
    }>;
    return all.filter((n) => n.topicId === topicId).length;
  } catch {
    return 0;
  }
}

export default function NoteButton({
  topicId,
  topicTitle,
  size = "md",
}: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [count, setCount] = useState(() => getNoteCount(topicId));

  // Refresh count when panel closes (notes may have changed)
  const handleClose = () => {
    setIsOpen(false);
    setCount(getNoteCount(topicId));
  };

  // Also refresh count on mount when topicId changes
  useEffect(() => {
    setCount(getNoteCount(topicId));
  }, [topicId]);

  const smallCls =
    size === "sm"
      ? "gap-1 px-2 py-1 text-[10px] rounded-lg"
      : "gap-1.5 px-2.5 py-1.5 text-xs rounded-xl";

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        data-ocid="notes.open_button"
        aria-label={`Open notes for ${topicTitle}`}
        className={`inline-flex items-center ${smallCls} font-semibold bg-yellow-500/10 text-yellow-400 border border-yellow-500/25 hover:bg-yellow-500/20 transition-colors shrink-0`}
      >
        <StickyNote className={size === "sm" ? "w-3 h-3" : "w-3.5 h-3.5"} />
        <span>Notes</span>
        {count > 0 && (
          <span className="ml-0.5 bg-yellow-500/25 text-yellow-300 rounded-full px-1.5 py-px text-[9px] font-bold leading-none">
            {count}
          </span>
        )}
      </button>

      <NotesPanel
        topicId={topicId}
        topicTitle={topicTitle}
        isOpen={isOpen}
        onClose={handleClose}
      />
    </>
  );
}
