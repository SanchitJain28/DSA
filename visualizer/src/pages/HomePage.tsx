import { useState, useMemo, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { PROBLEMS, getProblemPath, type ProblemInfo } from "@/data/problems";

// 2-Letter Topic Codes from Design System
const TOPIC_CODES: Record<string, string> = {
  trees: "TR",
  arrays: "AR",
  "linked-list": "LL",
  stack: "ST",
  "binary-search": "BS",
  "sliding-window": "SW",
  recursion: "RC",
  heap: "HP",
};

const TOPIC_NAMES: Record<string, string> = {
  trees: "Trees",
  arrays: "Arrays",
  "linked-list": "Linked Lists",
  stack: "Stack",
  "binary-search": "Binary Search",
  "sliding-window": "Sliding Window",
  recursion: "Recursion",
  heap: "Heap",
};

const DIFFICULTY_DOTS: Record<string, string> = {
  Easy: "#7d9b86",
  Medium: "#c9b98f",
  Hard: "#b08a8a",
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

  const topicsList = Object.keys(TOPIC_CODES);
  const diffsList = ["Easy", "Medium", "Hard"] as const;

  return (
    <div className="min-h-screen bg-[#0f1013] text-[#ededf0] font-['Poppins',sans-serif] relative overflow-x-hidden selection:bg-[#c9c3b6] selection:text-[#15150f]">
      {/* Background Grid Pattern */}
      <div
        className="fixed inset-0 pointer-events-none z-0"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)",
          backgroundSize: "36px 36px",
        }}
      />

      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-[16px] bg-[#0f1013]/85 border-b border-white/[0.04]">
        <div className="max-w-[1200px] mx-auto px-7 py-[18px] flex items-center justify-between gap-5">
          <Link to="/" className="flex items-center gap-2.5 group cursor-pointer">
            <img
              src="/tracedsa.png"
              alt="Trace DSA Logo"
              className="w-[30px] h-[30px] object-contain rounded-md transition-transform group-hover:scale-105"
            />
            <span className="font-semibold text-[16px] tracking-[-0.01em] text-[#ededf0]">
              Trace<span className="text-[#c9c3b6]">DSA</span>
            </span>
          </Link>

          <nav className="flex items-center gap-[6px] bg-[#15161c] border border-white/[0.05] p-[5px] rounded-[12px]">
            <Link
              to="/visualizer"
              className="px-4 py-[9px] rounded-[9px] text-[13.5px] font-medium text-[#f2f2f5] bg-gradient-to-b from-[#33333a] to-[#26262c] border border-[#3d3d45] shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_2px_4px_rgba(0,0,0,0.45)] hover:from-[#3a3a42] hover:to-[#2c2c33] transition-all"
            >
              Visualizer Workbench
            </Link>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 max-w-[1200px] mx-auto px-7">
        {/* Hero Section */}
        <section className="pt-20 pb-11 max-w-[760px]">
          <h1 className="text-[clamp(38px,5.6vw,64px)] leading-[1.08] font-semibold tracking-[-0.035em] mb-5 text-[#ededf0]">
            Master DSA through <span className="text-[#c9c3b6]">visual intuition</span>
          </h1>

          <p className="text-[17px] leading-[1.65] text-[#8a8a93] max-w-[560px] mb-[34px] font-normal">
            Step through data structures and algorithms frame by frame. Watch pointers
            move, trees balance, and windows slide — no more memorizing, start seeing.
          </p>

          <div className="inline-flex items-stretch bg-[#15161c] border border-white/[0.05] rounded-[14px] p-[6px] gap-[2px]">
            <div className="flex items-baseline gap-2 px-[18px] py-[11px] rounded-[10px] bg-[#1c1d24]">
              <span className="font-semibold text-[17px] text-[#f5f5f7]">{totalCount}+</span>
              <span className="text-[12.5px] text-[#7c7c85]">Visualizers</span>
            </div>

            <div className="flex items-baseline gap-2 px-[18px] py-[11px] rounded-[10px] bg-[#1c1d24]">
              <span className="font-semibold text-[17px] text-[#f5f5f7]">8</span>
              <span className="text-[12.5px] text-[#7c7c85]">Categories</span>
            </div>

            <div className="flex items-baseline gap-2 px-[18px] py-[11px] rounded-[10px] bg-[#1c1d24]">
              <span className="font-semibold text-[17px] text-[#f5f5f7]">Live</span>
              <span className="text-[12.5px] text-[#7c7c85]">Playback</span>
            </div>
          </div>
        </section>

        {/* Sticky Search & Filter Bar */}
        <div className="sticky top-[70px] z-40 py-[14px] pb-[16px] bg-[#0f1013]/85 backdrop-blur-[16px] -mx-7 px-7">
          <div className="flex items-center bg-[#15161c] border border-white/[0.06] rounded-[13px] px-[18px] h-[54px] transition-all focus-within:shadow-[0_0_0_2px_rgba(201,195,182,0.34)]">
            <svg
              width="17"
              height="17"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#6c6c76"
              strokeWidth="2.2"
              strokeLinecap="round"
              className="mr-3 shrink-0"
            >
              <circle cx="11" cy="11" r="7" />
              <path d="M20 20l-3.5-3.5" />
            </svg>
            <input
              ref={searchRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search visualizers, topics or tags…"
              className="flex-1 bg-transparent border-none outline-none text-[#ededf0] text-[14.5px] placeholder:text-[#5a5a63]"
            />
            {query && (
              <button
                onClick={() => setQuery("")}
                className="text-[#7c7c85] hover:text-[#ededf0] mr-2 text-xs font-mono cursor-pointer"
              >
                ✕
              </button>
            )}
            <kbd className="font-['JetBrains_Mono',monospace] text-[11px] text-[#8a8a93] bg-[#21222b] rounded-[7px] px-[9px] py-[5px]">
              ⌘K
            </kbd>
          </div>

          {/* Segmented Filter Tracks */}
          <div className="flex flex-wrap gap-[14px] mt-3 items-center">
            {/* Topic Pills */}
            <div className="flex flex-wrap gap-1 bg-[#15161c] border border-white/[0.05] p-[5px] rounded-[12px]">
              {topicsList.map((tId) => {
                const name = TOPIC_NAMES[tId] || tId;
                const on = selectedTopic === tId;
                return (
                  <button
                    key={tId}
                    onClick={() =>
                      setSelectedTopic((prev) => (prev === tId ? null : tId))
                    }
                    className={`font-['Poppins',sans-serif] text-[13px] font-medium px-[14px] py-2 rounded-[9px] cursor-pointer whitespace-nowrap transition-all ${
                      on
                        ? "text-[#f2f2f5] bg-gradient-to-b from-[#33333a] to-[#26262c] border border-[#3d3d45] shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_2px_4px_rgba(0,0,0,0.45)]"
                        : "text-[#9a9aa3] bg-transparent border border-transparent hover:text-[#ededf0]"
                    }`}
                  >
                    {name}
                  </button>
                );
              })}
            </div>

            {/* Difficulty Chips */}
            <div className="flex gap-1 bg-[#15161c] border border-white/[0.05] p-[5px] rounded-[12px]">
              {diffsList.map((dName) => {
                const dotColor = DIFFICULTY_DOTS[dName];
                const on = selectedDiff === dName;
                return (
                  <button
                    key={dName}
                    onClick={() =>
                      setSelectedDiff((prev) => (prev === dName ? null : dName))
                    }
                    className={`inline-flex items-center gap-[7px] font-['Poppins',sans-serif] text-[13px] font-medium px-[14px] py-2 rounded-[9px] cursor-pointer whitespace-nowrap transition-all ${
                      on
                        ? "text-[#f2f2f5] bg-gradient-to-b from-[#33333a] to-[#26262c] border border-[#3d3d45] shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_2px_4px_rgba(0,0,0,0.45)]"
                        : "text-[#9a9aa3] bg-transparent border border-transparent hover:text-[#ededf0]"
                    }`}
                  >
                    <span
                      className="w-[6px] h-[6px] rounded-full"
                      style={{ backgroundColor: dotColor }}
                    />
                    {dName}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Counter & Clear Button Bar */}
        <section className="pt-[26px] pb-[14px] flex items-center justify-between gap-4">
          <span className="text-[13.5px] text-[#7c7c85]">
            <span className="text-[#ededf0] font-medium">{filtered.length}</span>{" "}
            visualizer{filtered.length === 1 ? "" : "s"} available
          </span>

          {hasFilters && (
            <button
              onClick={handleReset}
              className="font-['Poppins',sans-serif] text-[13px] font-medium text-[#c8c8d0] bg-gradient-to-b from-[#2b2b31] to-[#202026] border border-[#38383f] shadow-[inset_0_1px_0_rgba(255,255,255,0.06),0_2px_4px_rgba(0,0,0,0.4)] rounded-[9px] px-[15px] py-[9px] cursor-pointer hover:text-[#ededf0] hover:from-[#33333a] hover:to-[#26262c] transition-all"
            >
              Clear filters
            </button>
          )}
        </section>

        {/* Problems Cards Grid */}
        <section className="pt-[6px] pb-20">
          {filtered.length === 0 ? (
            /* Empty State */
            <div className="bg-[#111114] rounded-[16px] py-[76px] px-6 text-center flex flex-col items-center gap-2 border border-transparent shadow-[0_0_0_1px_rgba(255,255,255,0.045)]">
              <div className="flex items-center mb-[14px]">
                <div className="w-[34px] h-[34px] rounded-full border border-[#2e2e34]" />
                <div className="w-[44px] h-[1px] bg-[#232328]" />
                <div className="w-[34px] h-[34px] rounded-full border border-dashed border-[#3a3a42]" />
              </div>
              <div className="text-[19px] font-semibold text-[#ededf0]">No visualizers found</div>
              <div className="text-[#7c7c85] text-[14px] mb-5">
                Nothing matches your current search and filters.
              </div>
              <button
                onClick={handleReset}
                className="font-['Poppins',sans-serif] text-[14px] font-semibold text-[#15150f] bg-gradient-to-b from-[#d6d0c4] to-[#c4beb0] border border-[#b3ac9d] shadow-[inset_0_1px_0_rgba(255,255,255,0.45),0_3px_8px_rgba(0,0,0,0.5)] rounded-[11px] px-6 py-3 cursor-pointer hover:from-[#e2ddd2] hover:to-[#d2ccbe] transition-all"
              >
                Reset filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-[repeat(auto-fill,minmax(324px,1fr))] gap-[14px]">
              {filtered.map((problem) => (
                <ProblemCard
                  key={problem.id}
                  problem={problem}
                  onLaunch={() => navigate(getProblemPath(problem.id))}
                />
              ))}
            </div>
          )}
        </section>
      </main>

      {/* Footer */}
      <footer className="relative z-10 bg-[#0d0d10]">
        <div className="max-w-[1200px] mx-auto px-7 py-[30px] flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2.5 text-[13px] text-[#6c6c76]">
            <img
              src="/tracedsa.png"
              alt="Trace DSA Logo"
              className="w-[18px] h-[18px] object-contain rounded-sm"
            />
            <span>TraceDSA — built for people who learn by seeing.</span>
          </div>
          <div className="flex gap-[22px] text-[13px]">
            <Link
              to="/visualizer"
              className="text-[#8a8a93] hover:text-[#ededf0] transition-colors"
            >
              Workbench
            </Link>
            <a
              href="https://github.com"
              target="_blank"
              rel="noreferrer"
              className="text-[#8a8a93] hover:text-[#ededf0] transition-colors"
            >
              GitHub
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}

// Problem Card matching the new design system
function ProblemCard({
  problem,
  onLaunch,
}: {
  problem: ProblemInfo;
  onLaunch: () => void;
}) {
  const code = TOPIC_CODES[problem.topicId] || "DS";
  const difDot = DIFFICULTY_DOTS[problem.difficulty] || "#c9b98f";

  return (
    <div
      onClick={onLaunch}
      className="bg-[#15161d] hover:bg-[#1b1c25] rounded-[16px] p-5 flex flex-col gap-[13px] border border-white/[0.05] shadow-[0_4px_16px_rgba(0,0,0,0.25)] transition-colors duration-200 cursor-pointer"
    >
      {/* Top Row: Circular 2-Letter Code & Topic Name + Difficulty Chip */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-[11px] min-w-0">
          <div className="w-[38px] h-[38px] rounded-full border border-[#323440] bg-[#1f2029] grid place-items-center font-['JetBrains_Mono',monospace] text-[11.5px] font-semibold text-[#c8c8d0] shrink-0">
            {code}
          </div>
          <span className="text-[12.5px] text-[#7c7c85] truncate">
            {problem.topic}
          </span>
        </div>

        <span className="inline-flex items-center gap-[6px] text-[11.5px] font-medium px-[10px] py-[5px] rounded-[8px] text-[#b0b0b8] bg-[#1f2029] shrink-0">
          <span
            className="w-[5px] h-[5px] rounded-full"
            style={{ backgroundColor: difDot }}
          />
          {problem.difficulty}
        </span>
      </div>

      {/* Title */}
      <div className="text-[17.5px] font-semibold tracking-[-0.015em] leading-[1.3] text-[#ededf0]">
        {problem.title}
      </div>

      {/* Summary */}
      <p className="text-[#82828b] text-[13.5px] leading-[1.6] m-0 flex-1">
        {problem.description}
      </p>

      {/* Tags Chips */}
      <div className="flex flex-wrap gap-[6px]">
        {problem.tags.map((tag) => (
          <span
            key={tag}
            className="text-[11.5px] text-[#8a8a93] bg-[#1f2029] rounded-[7px] px-[10px] py-1"
          >
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
}
