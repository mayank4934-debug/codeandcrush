import { Button } from "@/components/ui/button";
import { ArrowLeft, Code2 } from "lucide-react";
import MultiLangCompiler from "../components/MultiLangCompiler";
import { useApp } from "../context/AppContext";

export default function CompilerPage() {
  const { setPage } = useApp();

  return (
    <div
      className="h-[100dvh] flex flex-col overflow-hidden"
      style={{ background: "#0d1117" }}
    >
      {/* ── Header ── */}
      <header
        className="shrink-0 flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2.5 border-b"
        style={{ background: "#1e1e2e", borderColor: "#2a2a3e" }}
      >
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setPage("study")}
          className="rounded-xl text-gray-400 hover:text-white hover:bg-white/10 shrink-0 w-9 h-9"
          data-ocid="compiler.back_button"
          aria-label="Back to study"
        >
          <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
        </Button>

        <div
          className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl flex items-center justify-center shrink-0"
          style={{ background: "linear-gradient(135deg, #4c1d95, #7c3aed)" }}
        >
          <Code2 className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
        </div>

        <div className="flex-1 min-w-0">
          <h1 className="font-extrabold text-white text-sm sm:text-base leading-tight truncate">
            Online Code Editor
          </h1>
          <p className="text-[10px] sm:text-[11px] text-gray-500 hidden sm:block">
            40+ languages · Monaco Editor · Judge0 powered · Ctrl+Enter to run
          </p>
        </div>

        {/* Keyboard shortcut hints */}
        <div className="hidden lg:flex items-center gap-3 text-[11px] text-gray-600">
          <span>
            <kbd className="bg-[#2a2a3e] border border-[#3a3a55] px-1.5 py-0.5 rounded text-gray-400">
              Ctrl+Enter
            </kbd>
            <span className="ml-1">Run</span>
          </span>
          <span>
            <kbd className="bg-[#2a2a3e] border border-[#3a3a55] px-1.5 py-0.5 rounded text-gray-400">
              Ctrl+S
            </kbd>
            <span className="ml-1">Save</span>
          </span>
          <span>
            <kbd className="bg-[#2a2a3e] border border-[#3a3a55] px-1.5 py-0.5 rounded text-gray-400">
              Ctrl+/
            </kbd>
            <span className="ml-1">Comment</span>
          </span>
        </div>
      </header>

      {/* ── Compiler body (scrollable) ── */}
      <div
        className="flex-1 overflow-y-auto px-3 sm:px-4 pt-3 pb-6"
        style={{ background: "#0d1117" }}
      >
        <MultiLangCompiler />
      </div>
    </div>
  );
}
