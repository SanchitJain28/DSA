import { useState, useMemo, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { PROBLEMS, type ProblemInfo } from "@/data/problems";

// Category color accents and 2-letter codes from Claude Design
const ACCENTS: Record<string, string> = {
  trees: "#10b981",
  arrays: "#6366f1",
  "linked-list": "#8b5cf6",
  stack: "#f59e0b",
  "binary-search": "#06b6d4",
  "sliding-window": "#0ea5e9",
  recursion: "#f43f5e",
};

const TOPIC_LABELS: Record<string, string> = {
  trees: "Trees",
  arrays: "Arrays",
  "linked-list": "Linked Lists",
  stack: "Stack",
  "binary-search": "Binary Search",
  "sliding-window": "Sliding Window",
  recursion: "Recursion",
};

const CODES: Record<string, string> = {
  trees: "TR",
  arrays: "AR",
  "linked-list": "LL",
  stack: "ST",
  "binary-search": "BS",
  "sliding-window": "SW",
  recursion: "RC",
};

const DIF_COLORS: Record<string, string> = {
  Easy: "#10b981",
  Medium: "#f59e0b",
  Hard: "#f43f5e",
};

export default function HomePage() {
  const navigate = useNavigate();
  const searchRef = useRef<HTMLInputElement>(null);

  const [query, setQuery] = useState("");
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [selectedDiff, setSelectedDiff] = useState<string | null>(null);

  // Keyboard shortcut (⌘K or / or Esc)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const k = (e.key || "").toLowerCase();
      if ((e.metaKey || e.ctrlKey) && k === "k") {
        e.preventDefault();
        searchRef.current?.focus();
      }
      if (
        k === "/" &&
        document.activeElement?.tagName !== "INPUT" &&
        document.activeElement?.tagName !== "TEXTAREA"
      ) {
        e.preventDefault();
        searchRef.current?.focus();
      }
      if (k === "escape" && document.activeElement === searchRef.current) {
        searchRef.current?.blur();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const totalCount = PROBLEMS.length;
  const q = query.trim().toLowerCase();

  // Filter problems based on query, topic, and difficulty
  const filtered = useMemo(() => {
    return PROBLEMS.filter((p) => {
      if (selectedTopic && p.topicId !== selectedTopic) return false;
      if (selectedDiff && p.difficulty !== selectedDiff) return false;
      if (q) {
        const hay = (
          p.title +
          " " +
          p.topic +
          " " +
          p.description +
          " " +
          p.tags.join(" ")
        ).toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [selectedTopic, selectedDiff, q]);

  const hasFilters = Boolean(query || selectedTopic || selectedDiff);

  const handleReset = () => {
    setQuery("");
    setSelectedTopic(null);
    setSelectedDiff(null);
  };

  const topicsList = Object.keys(ACCENTS) as (keyof typeof ACCENTS)[];
  const diffsList = ["Easy", "Medium", "Hard"] as const;

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-[#e5e5e5] font-['Space_Grotesk',sans-serif] relative overflow-x-hidden selection:bg-[#6366f1] selection:text-white">
      {/* Background Grid Pattern */}
      <div
        className="fixed inset-0 pointer-events-none z-0"
        style={{
          backgroundImage:
            "linear-gradient(#ffffff08 1px, transparent 1px), linear-gradient(90deg, #ffffff08 1px, transparent 1px)",
          backgroundSize: "56px 56px",
        }}
      />

      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-[14px] bg-[rgba(10,10,10,0.72)] border-b border-[#262626]">
        <div className="max-w-[1240px] mx-auto px-7 py-4 flex items-center justify-between gap-5">
          <Link to="/" className="flex items-center gap-3 group cursor-pointer">
            <img
              src="/tracedsa.png"
              alt="Trace DSA Logo"
              className="w-[34px] h-[34px] object-contain rounded-md shadow-[0_0_16px_-4px_rgba(99,102,241,0.4)] group-hover:scale-105 transition-all"
            />
            <span className="font-['JetBrains_Mono',monospace] font-bold text-[16px] tracking-[-0.02em] text-white">
              Trace<span className="text-[#6366f1]">DSA</span>
            </span>
          </Link>

          <nav className="flex items-center gap-2 font-['JetBrains_Mono',monospace] text-[12.5px]">
            <Link
              to="/visualizer"
              className="px-3.5 py-2 border border-[#262626] rounded text-[#d4d4d4] uppercase tracking-[0.04em] transition-all hover:border-[#6366f1] hover:text-white hover:bg-[#6366f114]"
            >
              Visualizer Workbench
            </Link>
            <Link
              to="/revision"
              className="px-3.5 py-2 border border-[#262626] rounded text-[#d4d4d4] uppercase tracking-[0.04em] transition-all hover:border-[#8b5cf6] hover:text-white hover:bg-[#8b5cf614]"
            >
              Spaced Repetition
            </Link>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 max-w-[1240px] mx-auto px-7">
        {/* Hero Section */}
        <section className="pt-20 pb-14 max-w-[820px] relative">
          <div className="inline-flex items-center gap-2 border border-[#262626] px-3 py-1.5 font-['JetBrains_Mono',monospace] text-[11px] tracking-[0.08em] uppercase text-[#a3a3a3] mb-7 rounded-sm bg-[#0f0f0f]/60">
            <span className="w-[7px] h-[7px] bg-[#10b981] animate-pulse rounded-full" />
            Interactive algorithm playground
          </div>

          <h1 className="text-[clamp(40px,6vw,72px)] leading-[1.02] font-bold tracking-[-0.03em] mb-5 text-white">
            Master DSA Through{" "}
            <span className="text-[#8b5cf6] bg-gradient-to-r from-[#a78bfa] to-[#8b5cf6] bg-clip-text text-transparent">
              Visual Intuition
            </span>
          </h1>

          <p className="text-[18px] leading-[1.6] text-[#a3a3a3] max-w-[600px] mb-9">
            Step through data structures and algorithms frame by frame. Watch
            pointers move, trees balance, and windows slide — no more
            memorizing, start seeing.
          </p>

          <div className="flex flex-wrap gap-3">
            <div className="flex items-center gap-2.5 border border-[#262626] rounded bg-gradient-to-b from-[rgba(30,30,33,0.7)] to-[rgba(18,18,20,0.7)] px-4 py-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.03)]">
              <span className="font-['JetBrains_Mono',monospace] font-bold text-[18px] text-[#e5e5e5]">
                {totalCount}+
              </span>
              <span className="text-[13px] text-[#737373] uppercase tracking-[0.06em]">
                Visualizers
              </span>
            </div>

            <div className="flex items-center gap-2.5 border border-[#262626] rounded bg-gradient-to-b from-[rgba(30,30,33,0.7)] to-[rgba(18,18,20,0.7)] px-4 py-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.03)]">
              <span className="font-['JetBrains_Mono',monospace] font-bold text-[18px] text-[#e5e5e5]">
                7
              </span>
              <span className="text-[13px] text-[#737373] uppercase tracking-[0.06em]">
                Categories
              </span>
            </div>

            <div className="flex items-center gap-2.5 border border-[#262626] rounded bg-gradient-to-b from-[rgba(30,30,33,0.7)] to-[rgba(18,18,20,0.7)] px-4 py-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.03)]">
              <span className="font-['JetBrains_Mono',monospace] font-bold text-[18px] text-[#e5e5e5]">
                Live
              </span>
              <span className="text-[13px] text-[#737373] uppercase tracking-[0.06em]">
                Playback
              </span>
            </div>
          </div>
        </section>

        {/* Sticky Search & Filter Bar */}
        <div className="sticky top-[67px] z-40 py-4 bg-[rgba(10,10,10,0.85)] backdrop-blur-[14px] border-b border-[#1a1a1a] -mx-7 px-7">
          <div className="flex items-center border border-[#2a2a2e] focus-within:border-[#6366f1] rounded-md bg-[#0f0f0f] px-4 h-[52px] transition-all shadow-[inset_0_1px_2px_rgba(0,0,0,0.5)] focus-within:shadow-[inset_0_1px_2px_rgba(0,0,0,0.5),0_0_0_3px_rgba(99,102,241,0.12)]">
            <span className="font-['JetBrains_Mono',monospace] text-[#525252] text-[16px] mr-3">
              /
            </span>
            <input
              ref={searchRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search visualizers — problems, topics, tags…"
              className="flex-1 bg-transparent border-none outline-none text-[#e5e5e5] text-[15px] placeholder:text-[#525252]"
            />
            {query && (
              <button
                onClick={() => setQuery("")}
                className="text-[#737373] hover:text-white mr-2 text-xs font-mono"
              >
                ✕
              </button>
            )}
            <kbd className="font-['JetBrains_Mono',monospace] text-[11px] text-[#737373] border border-[#333] rounded px-2 py-1 tracking-[0.05em] bg-[#171717]">
              ⌘K
            </kbd>
          </div>

          {/* Topic & Level Filters */}
          <div className="flex flex-wrap gap-2 mt-3.5 items-center">
            <span className="font-['JetBrains_Mono',monospace] text-[10.5px] text-[#525252] uppercase tracking-[0.1em] mr-1">
              Topic
            </span>

            {topicsList.map((tId) => {
              const name = TOPIC_LABELS[tId];
              const a = ACCENTS[tId];
              const on = selectedTopic === tId;
              return (
                <button
                  key={tId}
                  onClick={() =>
                    setSelectedTopic((prev) => (prev === tId ? null : tId))
                  }
                  style={{
                    color: on ? "#fff" : "#a3a3a3",
                    border: `1px solid ${on ? a : "#262626"}`,
                    background: on ? `${a}1f` : "transparent",
                  }}
                  className="font-['JetBrains_Mono',monospace] text-[12px] px-3 py-1.5 rounded cursor-pointer tracking-[0.02em] transition-all hover:border-[#404040] hover:text-[#e5e5e5]"
                >
                  {name}
                </button>
              );
            })}

            <span className="w-[1px] h-5 bg-[#262626] mx-1.5" />

            <span className="font-['JetBrains_Mono',monospace] text-[10.5px] text-[#525252] uppercase tracking-[0.1em] mr-1">
              Level
            </span>

            {diffsList.map((dName) => {
              const c = DIF_COLORS[dName];
              const on = selectedDiff === dName;
              return (
                <button
                  key={dName}
                  onClick={() =>
                    setSelectedDiff((prev) => (prev === dName ? null : dName))
                  }
                  style={{
                    color: on ? "#0a0a0a" : c,
                    border: `1px solid ${c}${on ? "" : "55"}`,
                    background: on ? c : `${c}12`,
                  }}
                  className="font-['JetBrains_Mono',monospace] text-[12px] px-3 py-1.5 rounded cursor-pointer tracking-[0.06em] uppercase font-bold transition-all"
                >
                  {dName}
                </button>
              );
            })}
          </div>
        </div>

        {/* Counter & Clear Button Bar */}
        <section className="pt-7 pb-3 flex items-baseline justify-between">
          <span className="font-['JetBrains_Mono',monospace] text-[13px] text-[#737373]">
            <span className="text-[#e5e5e5] font-semibold">{filtered.length}</span>{" "}
            visualizer{filtered.length === 1 ? "" : "s"}
          </span>

          {hasFilters && (
            <button
              onClick={handleReset}
              className="font-['JetBrains_Mono',monospace] text-[12px] text-[#a3a3a3] bg-transparent border border-[#262626] px-3 py-1.5 rounded cursor-pointer uppercase tracking-[0.05em] transition-all hover:border-[#f43f5e] hover:text-[#f43f5e] hover:bg-[#f43f5e10]"
            >
              Clear filters ✕
            </button>
          )}
        </section>

        {/* Problems Cards Grid */}
        <section className="pt-2 pb-20">
          {filtered.length === 0 ? (
            /* Empty State */
            <div className="border border-dashed border-[#333] rounded-lg py-20 px-6 text-center flex flex-col items-center gap-4 bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.02),transparent_60%)]">
              <div className="font-['JetBrains_Mono',monospace] text-[40px] text-[#404040]">
                [&nbsp;&nbsp;]
              </div>
              <div>
                <div className="text-[20px] font-semibold mb-1.5 text-white">
                  No visualizers found
                </div>
                <div className="text-[#737373] text-[14px]">
                  Nothing matches your current search and filters.
                </div>
              </div>
              <button
                onClick={handleReset}
                className="font-['JetBrains_Mono',monospace] text-[13px] text-[#0a0a0a] bg-[#e5e5e5] border-none rounded px-5 py-2.5 cursor-pointer font-bold uppercase tracking-[0.05em] transition-all hover:bg-white hover:shadow-[0_4px_20px_-6px_rgba(255,255,255,0.4)]"
              >
                Reset filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-[repeat(auto-fill,minmax(320px,1fr))] gap-4">
              {filtered.map((problem) => (
                <ProblemCard
                  key={problem.id}
                  problem={problem}
                  onLaunch={() => navigate(`/visualizer?problem=${problem.id}`)}
                />
              ))}
            </div>
          )}
        </section>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-[#262626] mt-5">
        <div className="max-w-[1240px] mx-auto px-7 py-8 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2.5 font-['JetBrains_Mono',monospace] text-[13px] text-[#737373]">
            <img
              src="/tracedsa.png"
              alt="Trace DSA"
              className="w-4 h-4 object-contain rounded-sm"
            />
            <span>Trace DSA — built for people who learn by seeing.</span>
          </div>
          <div className="flex gap-5 font-['JetBrains_Mono',monospace] text-[12px] text-[#737373] uppercase tracking-[0.05em]">
            <Link
              to="/visualizer"
              className="hover:text-[#c7d2fe] transition-colors"
            >
              Workbench
            </Link>
            <Link
              to="/revision"
              className="hover:text-[#c7d2fe] transition-colors"
            >
              Revision
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

// Individual Problem Card matching Claude Design card specs
function ProblemCard({
  problem,
  onLaunch,
}: {
  problem: ProblemInfo;
  onLaunch: () => void;
}) {
  const accent = ACCENTS[problem.topicId] || "#6366f1";
  const code = CODES[problem.topicId] || "AL";
  const difColor = DIF_COLORS[problem.difficulty] || "#10b981";

  return (
    <div
      onClick={onLaunch}
      style={
        {
          "--glowSolid": accent,
          "--glow": `${accent}40`,
        } as React.CSSProperties
      }
      className="group bg-gradient-to-b from-[rgba(30,30,33,0.85)] to-[rgba(17,17,19,0.9)] border border-[#2a2a2e] rounded-md shadow-[inset_0_1px_0_rgba(255,255,255,0.04),0_1px_2px_rgba(0,0,0,0.4)] p-[22px] flex flex-col gap-3.5 transition-all duration-200 relative cursor-pointer hover:border-[var(--glowSolid)] hover:shadow-[0_10px_40px_-10px_var(--glow),inset_0_1px_0_rgba(255,255,255,0.07)] hover:-translate-y-1"
    >
      {/* Top Header: 2-Letter Topic Badge + Difficulty Badge */}
      <div className="flex items-start justify-between gap-3">
        <div
          style={{
            borderColor: accent,
            color: accent,
            boxShadow: `0 0 18px -6px ${accent}`,
          }}
          className="w-11 h-11 border rounded-md grid place-items-center font-['JetBrains_Mono',monospace] font-bold text-[15px] bg-gradient-to-br from-[#ffffff10] to-[#ffffff02]"
        >
          {code}
        </div>

        <span
          style={{
            color: difColor,
            border: `1px solid ${difColor}55`,
            background: `${difColor}12`,
          }}
          className="font-['JetBrains_Mono',monospace] text-[10.5px] font-bold uppercase tracking-[0.06em] px-2.5 py-1 rounded"
        >
          {problem.difficulty}
        </span>
      </div>

      {/* Topic Name & Problem Title */}
      <div>
        <div className="font-['JetBrains_Mono',monospace] text-[10.5px] text-[#737373] uppercase tracking-[0.1em] mb-1.5">
          {problem.topic}
        </div>
        <div className="text-[18px] font-semibold tracking-[-0.01em] leading-[1.25] text-[#f5f5f5] group-hover:text-white transition-colors">
          {problem.title}
        </div>
      </div>

      {/* Summary */}
      <p className="text-[#8f8f8f] text-[13.5px] leading-[1.55] m-0 flex-1">
        {problem.description}
      </p>

      {/* Tags Chips */}
      <div className="flex flex-wrap gap-1.5">
        {problem.tags.map((tag) => (
          <span
            key={tag}
            className="font-['JetBrains_Mono',monospace] text-[10.5px] text-[#a3a3a3] border border-[#262626] rounded px-2 py-0.5 bg-[#ffffff05]"
          >
            {tag}
          </span>
        ))}
      </div>

      {/* Launch Visualizer Link Button */}
      <div className="flex items-center justify-between mt-1 pt-3.5 border-t border-[#1f1f1f] font-['JetBrains_Mono',monospace] text-[12.5px] font-medium text-[#e5e5e5] uppercase tracking-[0.04em] group-hover:text-[var(--glowSolid)] transition-colors">
        <span>Launch Visualizer</span>
        <span className="text-[15px] group-hover:translate-x-1 transition-transform">
          →
        </span>
      </div>
    </div>
  );
}
