import { Pencil, Trash2, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

export interface Note {
  id: string;
  topicId: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

interface Props {
  topicId: string;
  topicTitle: string;
  isOpen: boolean;
  onClose: () => void;
}

function loadAllNotes(): Note[] {
  try {
    return JSON.parse(localStorage.getItem("cc_notes") ?? "[]") as Note[];
  } catch {
    return [];
  }
}

function saveAllNotes(notes: Note[]) {
  localStorage.setItem("cc_notes", JSON.stringify(notes));
}

function relativeDate(iso: string): string {
  const diff = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
  if (diff < 60) return "just now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return new Date(iso).toLocaleDateString();
}

export default function NotesSidePanel({
  topicId,
  topicTitle,
  isOpen,
  onClose,
}: Props) {
  const [allNotes, setAllNotes] = useState<Note[]>(loadAllNotes);
  const [newContent, setNewContent] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState("");
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Reload from localStorage when panel opens
  useEffect(() => {
    if (isOpen) {
      setAllNotes(loadAllNotes());
      setNewContent("");
      setEditingId(null);
      setTimeout(() => textareaRef.current?.focus(), 150);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  const topicNotes = useMemo(
    () => allNotes.filter((n) => n.topicId === topicId),
    [allNotes, topicId],
  );

  const handleSaveNew = useCallback(() => {
    const content = newContent.trim();
    if (!content) return;
    const firstLine = content.split("\n")[0]?.trim() ?? "Note";
    const title =
      firstLine.length > 60 ? `${firstLine.slice(0, 57)}…` : firstLine;
    const now = new Date().toISOString();
    const note: Note = {
      id: `note-${Date.now()}-${Math.random().toString(36).slice(2)}`,
      topicId,
      title,
      content,
      createdAt: now,
      updatedAt: now,
    };
    const updated = [note, ...allNotes];
    setAllNotes(updated);
    saveAllNotes(updated);
    setNewContent("");
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }, [newContent, topicId, allNotes]);

  const handleSaveEdit = useCallback(
    (id: string) => {
      const content = editContent.trim();
      if (!content) return;
      const firstLine = content.split("\n")[0]?.trim() ?? "Note";
      const title =
        firstLine.length > 60 ? `${firstLine.slice(0, 57)}…` : firstLine;
      const updated = allNotes.map((n) =>
        n.id === id
          ? { ...n, title, content, updatedAt: new Date().toISOString() }
          : n,
      );
      setAllNotes(updated);
      saveAllNotes(updated);
      setEditingId(null);
      setEditContent("");
    },
    [editContent, allNotes],
  );

  const handleDelete = useCallback(
    (id: string) => {
      const updated = allNotes.filter((n) => n.id !== id);
      setAllNotes(updated);
      saveAllNotes(updated);
      setDeleteConfirmId(null);
    },
    [allNotes],
  );

  const handleStartEdit = useCallback((note: Note) => {
    setEditingId(note.id);
    setEditContent(note.content);
  }, []);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop (mobile only) */}
          <motion.div
            key="notes-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/40 sm:hidden"
            onClick={onClose}
          />

          {/* Panel */}
          <motion.aside
            key="notes-panel"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 320, damping: 32 }}
            className="fixed top-0 right-0 bottom-0 z-50 w-full sm:w-80 bg-card border-l border-border flex flex-col shadow-2xl"
            data-ocid="notes.panel"
          >
            {/* Header */}
            <div className="flex items-center gap-2 px-4 py-3 border-b border-border bg-card shrink-0">
              <span className="text-base">📝</span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-foreground truncate">
                  Notes
                </p>
                <p className="text-[10px] text-muted-foreground truncate">
                  {topicTitle}
                </p>
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close notes panel"
                data-ocid="notes.close_button"
                className="p-1.5 rounded-lg hover:bg-muted transition-colors text-muted-foreground shrink-0"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* New Note input */}
            <div className="px-4 py-3 border-b border-border bg-muted/20 shrink-0">
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wide mb-2">
                Add New Note
              </p>
              <textarea
                ref={textareaRef}
                value={newContent}
                onChange={(e) => setNewContent(e.target.value)}
                placeholder={`Write a note about "${topicTitle}"…`}
                rows={3}
                data-ocid="notes.new_note_textarea"
                className="w-full rounded-xl border border-input bg-background px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 resize-none"
                onKeyDown={(e) => {
                  if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
                    e.preventDefault();
                    handleSaveNew();
                  }
                }}
              />
              <div className="flex items-center justify-between mt-2">
                <span className="text-[10px] text-muted-foreground">
                  Ctrl+Enter to save
                </span>
                <button
                  type="button"
                  onClick={handleSaveNew}
                  disabled={!newContent.trim()}
                  data-ocid="notes.save_button"
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 transition-colors"
                >
                  {saved ? "✓ Saved!" : "Save Note"}
                </button>
              </div>
            </div>

            {/* Notes list */}
            <div className="flex-1 overflow-y-auto px-4 py-3 space-y-2">
              {topicNotes.length === 0 ? (
                <div className="text-center py-8" data-ocid="notes.empty_state">
                  <div className="text-3xl mb-2">📓</div>
                  <p className="text-xs font-medium text-foreground mb-1">
                    No notes for this topic yet
                  </p>
                  <p className="text-[11px] text-muted-foreground">
                    Write something above and save it
                  </p>
                </div>
              ) : (
                <>
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wide">
                    {topicNotes.length} note{topicNotes.length !== 1 ? "s" : ""}{" "}
                    for this topic
                  </p>
                  {topicNotes.map((note, i) => (
                    <div
                      key={note.id}
                      data-ocid={`notes.item.${i + 1}`}
                      className="rounded-xl border border-border bg-muted/30 overflow-hidden"
                    >
                      {editingId === note.id ? (
                        /* Edit mode */
                        <div className="p-3 space-y-2">
                          <textarea
                            value={editContent}
                            onChange={(e) => setEditContent(e.target.value)}
                            rows={4}
                            ref={(el) => {
                              if (el) el.focus();
                            }}
                            data-ocid={`notes.edit_textarea.${i + 1}`}
                            className="w-full rounded-lg border border-input bg-background px-3 py-2 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 resize-none"
                          />
                          <div className="flex gap-2">
                            <button
                              type="button"
                              onClick={() => {
                                setEditingId(null);
                                setEditContent("");
                              }}
                              data-ocid={`notes.cancel_edit_button.${i + 1}`}
                              className="flex-1 rounded-lg py-1.5 text-xs font-semibold bg-muted text-muted-foreground border border-border hover:bg-muted/70 transition-colors"
                            >
                              Cancel
                            </button>
                            <button
                              type="button"
                              onClick={() => handleSaveEdit(note.id)}
                              disabled={!editContent.trim()}
                              data-ocid={`notes.save_edit_button.${i + 1}`}
                              className="flex-1 rounded-lg py-1.5 text-xs font-semibold bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 transition-colors"
                            >
                              Save
                            </button>
                          </div>
                        </div>
                      ) : deleteConfirmId === note.id ? (
                        /* Delete confirm */
                        <div className="p-3 space-y-2">
                          <p className="text-xs text-foreground font-medium">
                            Delete this note?
                          </p>
                          <div className="flex gap-2">
                            <button
                              type="button"
                              onClick={() => setDeleteConfirmId(null)}
                              data-ocid={`notes.cancel_delete_button.${i + 1}`}
                              className="flex-1 rounded-lg py-1.5 text-xs font-semibold bg-muted text-muted-foreground border border-border hover:bg-muted/70 transition-colors"
                            >
                              Cancel
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDelete(note.id)}
                              data-ocid={`notes.confirm_delete_button.${i + 1}`}
                              className="flex-1 rounded-lg py-1.5 text-xs font-semibold bg-red-500 text-white hover:bg-red-600 transition-colors"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      ) : (
                        /* View mode */
                        <div className="p-3">
                          <div className="flex items-start justify-between gap-2 mb-1">
                            <p className="text-xs font-semibold text-foreground line-clamp-1 flex-1 min-w-0">
                              {note.title}
                            </p>
                            <div className="flex gap-1 shrink-0">
                              <button
                                type="button"
                                onClick={() => handleStartEdit(note)}
                                aria-label="Edit note"
                                data-ocid={`notes.edit_button.${i + 1}`}
                                className="p-1 rounded hover:bg-primary/10 text-muted-foreground hover:text-primary transition-colors"
                              >
                                <Pencil className="w-3 h-3" />
                              </button>
                              <button
                                type="button"
                                onClick={() => setDeleteConfirmId(note.id)}
                                aria-label="Delete note"
                                data-ocid={`notes.delete_button.${i + 1}`}
                                className="p-1 rounded hover:bg-red-500/10 text-muted-foreground hover:text-red-400 transition-colors"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            </div>
                          </div>
                          <p className="text-[11px] text-foreground/70 leading-relaxed line-clamp-3 whitespace-pre-line">
                            {note.content}
                          </p>
                          <p className="text-[10px] text-muted-foreground mt-1.5">
                            {relativeDate(note.updatedAt)}
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
                </>
              )}
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
