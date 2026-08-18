import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Panel, Group as PanelGroup } from "react-resizable-panels";
import ResizeHandle from "../../components/shared/ResizeHandle";
import { usePlaybackTimer } from "../../hooks/usePlaybackTimer";
import { useKeyboardControls } from "../../hooks/useKeyboardControls";
import Header from "../../components/shared/Header";
import Variables from "../../components/shared/Variables";
import SourceCode from "../../components/shared/SourceCode";
import Explanation from "../../components/shared/Explanation";
import CanvasViewport from "../../components/shared/CanvasViewport";
import ConfigModal from "../../components/shared/ConfigModal";
import { useConfigModal } from "../../hooks/useConfigModal";
import { type TestCase } from "../../components/shared/TestCaseSwitcher";
import { generateFrames } from "../../core/array/frames/longestConsecutiveFrames";
import { longestConsecutiveCode } from "../../core/array/sourcecode/longestConsecutive";
import { themeColors } from "../../utils/theme";
import { ArrowRight, Trophy, Hash, Link2, Binary } from "lucide-react";

interface LongestConsecutiveTestCaseData {
  nums: number[];
  preview: string;
}

type LongestConsecutiveTestCase = TestCase<LongestConsecutiveTestCaseData>;

const TEST_CASES: LongestConsecutiveTestCase[] = [
  {
    id: "tc1",
    name: "Example 1: [100, 4, 200, 1, 3, 2]",
    data: {
      nums: [100, 4, 200, 1, 3, 2],
      preview: "Longest: [1, 2, 3, 4] (Length = 4)",
    },
  },
  {
    id: "tc2",
    name: "Example 2: [0, 3, 7, 2, 5, 8, 4, 6, 0, 1]",
    data: {
      nums: [0, 3, 7, 2, 5, 8, 4, 6, 0, 1],
      preview: "Longest: [0..8] (Length = 9)",
    },
  },
  {
    id: "tc3",
    name: "Multiple Sequences: [9, 1, 4, 7, 3, -1, 0, 5, 8, -1, 6]",
    data: {
      nums: [9, 1, 4, 7, 3, -1, 0, 5, 8, -1, 6],
      preview: "Longest: [3, 4, 5, 6, 7, 8, 9] (Length = 7)",
    },
  },
  {
    id: "tc4",
    name: "Duplicates Test: [1, 2, 0, 1]",
    data: {
      nums: [1, 2, 0, 1],
      preview: "Longest: [0, 1, 2] (Length = 3)",
    },
  },
  {
    id: "tc5",
    name: "Disjoint Numbers: [10, 20, 30, 40]",
    data: {
      nums: [10, 20, 30, 40],
      preview: "Longest: Single elements (Length = 1)",
    },
  },
];

export default function LongestConsecutive() {
  const [testCaseIdx, setTestCaseIdx] = useState(0);
  const [currentNums, setCurrentNums] = useState<number[]>(
    TEST_CASES[0].data!.nums
  );
  const [tempCustomInput, setTempCustomInput] = useState(
    TEST_CASES[0].data!.nums.join(", ")
  );

  const [currentIdx, setCurrentIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const modal = useConfigModal(0);

  const handleOpenModal = () => {
    modal.openModal(() => {
      setTempCustomInput(currentNums.join(", "));
      modal.setSelectedPresetIdx(testCaseIdx);
    });
  };

  const handleSelectPreset = (idx: number) => {
    modal.selectPreset(idx, () => {
      const tc = TEST_CASES[idx];
      if (tc?.data) {
        setTempCustomInput(tc.data.nums.join(", "));
      }
    });
  };

  const handleApplySettings = () => {
    modal.apply(() => {
      let numsToApply = currentNums;
      if (tempCustomInput.trim() !== "") {
        const parsed = tempCustomInput
          .split(",")
          .map((x) => Number(x.trim()))
          .filter((x) => !isNaN(x));
        if (parsed.length > 0) {
          numsToApply = parsed;
        }
      }

      if (modal.selectedPresetIdx !== null) {
        setTestCaseIdx(modal.selectedPresetIdx);
      }

      setCurrentNums(numsToApply);
      setCurrentIdx(0);
      setIsPlaying(false);
    });
  };

  const frames = useMemo(() => {
    return generateFrames(currentNums);
  }, [currentNums]);

  usePlaybackTimer(
    isPlaying,
    setIsPlaying,
    currentIdx,
    setCurrentIdx,
    frames.length
  );

  useKeyboardControls(frames.length, setCurrentIdx, setIsPlaying);

  const frame = frames[currentIdx] || frames[0];

  const handleNext = () =>
    setCurrentIdx((p) => Math.min(p + 1, frames.length - 1));
  const handlePrev = () => setCurrentIdx((p) => Math.max(p - 1, 0));
  const handleReset = () => {
    setCurrentIdx(0);
    setIsPlaying(false);
  };

  const colors = themeColors.cyan;

  return (
    <div className="flex flex-col h-screen bg-background text-foreground font-sans p-4">
      <Header
        title="Longest Consecutive Sequence"
        titleColorClass={colors.titleClass}
        theme="cyan"
        isPlaying={isPlaying}
        onPlayPause={() => setIsPlaying(!isPlaying)}
        onNext={handleNext}
        onPrev={handlePrev}
        onReset={handleReset}
      >
        <ConfigModal
          title="Configure Test Cases & Custom Array"
          description="Select a preset scenario or provide your own comma-separated integers."
          theme="cyan"
          isOpen={modal.isOpen}
          onOpenChange={modal.setIsOpen}
          onOpen={handleOpenModal}
          presets={TEST_CASES.map((tc) => ({
            id: tc.id,
            name: tc.name,
            preview: tc.data!.preview,
          }))}
          selectedPresetIdx={modal.selectedPresetIdx}
          onSelectPreset={handleSelectPreset}
          onApply={handleApplySettings}
        >
          <div className="space-y-4">
            <div className="space-y-1">
              <label className="text-[11px] font-mono text-neutral-400 flex items-center gap-1">
                <Binary className="w-3 h-3 text-cyan-400" />
                Custom Array Values (comma-separated):
              </label>
              <input
                type="text"
                value={tempCustomInput}
                onChange={(e) => {
                  setTempCustomInput(e.target.value);
                  modal.setSelectedPresetIdx(null);
                }}
                placeholder="100, 4, 200, 1, 3, 2"
                className="w-full bg-neutral-950/80 border border-neutral-700/80 rounded-md px-3 py-2 text-xs font-mono text-neutral-100 focus:outline-none focus:ring-1 focus:ring-cyan-500/60 focus:border-cyan-500 placeholder:text-neutral-600"
              />
            </div>
          </div>
        </ConfigModal>
      </Header>

      <div className="flex-1 mt-4 overflow-hidden">
        <PanelGroup orientation="horizontal">
          <Panel className="flex flex-col min-w-0 h-full">
            <div className="flex-1 relative bg-card rounded-md border border-border overflow-hidden shadow-inner flex flex-col h-full">
              <CanvasViewport className="flex-1 w-full h-full">
                <div className="flex flex-col items-center justify-center p-8 gap-6 min-w-[700px] max-w-[1000px] w-full mx-auto">
                  {/* 1. In-Canvas Variables Strip */}
                  <Variables
                    variables={frame.variables}
                    highlightColorClass={colors.variablesText}
                  />

                  {/* 2. Hash Set Element Grid */}
                  <div className="w-full max-w-3xl bg-transparent border border-neutral-800/80 rounded-md p-4 flex flex-col gap-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-xs font-mono font-semibold uppercase tracking-wider text-neutral-300">
                        <Hash className="w-4 h-4 text-cyan-400" />
                        <span>Hash Set Elements ({frame.setElements.length} Unique)</span>
                      </div>
                      <div className="text-[11px] font-mono text-neutral-500 flex items-center gap-3">
                        <span className="flex items-center gap-1.5">
                          <span className="w-2.5 h-2.5 rounded-full bg-cyan-500" />
                          Inspecting
                        </span>
                        <span className="flex items-center gap-1.5">
                          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                          Streak Member
                        </span>
                        <span className="flex items-center gap-1.5">
                          <span className="w-2.5 h-2.5 rounded-full bg-rose-500/60" />
                          Non-Start
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2.5 items-center justify-center p-2 min-h-[56px]">
                      {frame.setElements.map((el) => {
                        const status = frame.elementStatuses[el] || "default";

                        let badgeStyle = "bg-neutral-900 border-neutral-800 text-neutral-300";
                        if (status === "active") {
                          badgeStyle =
                            "bg-cyan-950 border-cyan-400 text-cyan-200 ring-2 ring-cyan-400/50 shadow-md shadow-cyan-950";
                        } else if (status === "streak") {
                          badgeStyle =
                            "bg-emerald-950 border-emerald-400 text-emerald-200 ring-2 ring-emerald-400/50 shadow-md shadow-emerald-950";
                        } else if (status === "skipped") {
                          badgeStyle =
                            "bg-rose-950/40 border-rose-800/60 text-rose-300/80 opacity-60";
                        } else if (status === "bestStreak") {
                          badgeStyle =
                            "bg-sky-950/70 border-sky-600 text-sky-200 ring-1 ring-sky-500/30";
                        }

                        return (
                          <motion.div
                            key={el}
                            layout
                            className={`px-3.5 py-1.5 rounded-md border font-mono text-sm font-bold flex items-center justify-center transition-all ${badgeStyle}`}
                          >
                            {el}
                          </motion.div>
                        );
                      })}
                    </div>
                  </div>

                  {/* 3. Active Streak Chain (Animated Linked Nodes) */}
                  <div className="w-full max-w-3xl bg-transparent border border-neutral-800 rounded-md p-5 flex flex-col gap-3 min-h-[120px]">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-xs font-mono font-semibold uppercase tracking-wider text-emerald-400">
                        <Link2 className="w-4 h-4" />
                        <span>Active Streak Chain (Length = {frame.currentStreak.length})</span>
                      </div>
                      {frame.currentStreak.length > 0 && (
                        <span className="text-[11px] font-mono text-emerald-300/80">
                          Expanding while set.has(curr + 1)
                        </span>
                      )}
                    </div>

                    <div className="flex items-center justify-center gap-2 flex-wrap min-h-[48px] py-2">
                      {frame.currentStreak.length === 0 ? (
                        <span className="text-xs font-mono text-neutral-600 italic">
                          No active streak expanding...
                        </span>
                      ) : (
                        frame.currentStreak.map((num, idx) => (
                          <div key={num} className="flex items-center gap-2">
                            <motion.div
                              initial={{ scale: 0, opacity: 0 }}
                              animate={{ scale: 1, opacity: 1 }}
                              transition={{ type: "spring", stiffness: 350, damping: 22 }}
                              className="px-4 py-2 bg-emerald-950/90 border-2 border-emerald-400 rounded-md font-mono text-base font-bold text-emerald-100 ring-2 ring-emerald-500/30 shadow-lg shadow-emerald-950/50"
                            >
                              {num}
                            </motion.div>
                            {idx < frame.currentStreak.length - 1 && (
                              <ArrowRight className="w-4 h-4 text-emerald-400 shrink-0" />
                            )}
                          </div>
                        ))
                      )}
                    </div>
                  </div>

                  {/* 4. Best Longest Streak Recorded */}
                  {frame.bestStreak.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="w-full max-w-3xl bg-transparent border border-sky-500/40 rounded-md p-4 flex items-center justify-between shadow-sm"
                    >
                      <div className="flex items-center gap-2">
                        <Trophy className="w-4 h-4 text-sky-400" />
                        <span className="text-xs font-mono font-bold text-sky-300 uppercase tracking-wider">
                          Best Global Streak (Length = {frame.bestStreak.length})
                        </span>
                      </div>
                      <div className="flex items-center gap-2 font-mono font-bold text-sm text-sky-200">
                        [{frame.bestStreak.join(", ")}]
                      </div>
                    </motion.div>
                  )}
                </div>
              </CanvasViewport>

              {/* Phase Indicator */}
              <div className="absolute bottom-3 left-4 text-xs text-neutral-400 font-medium z-10 pointer-events-none">
                Phase: <span className={colors.phaseText}>{frame.phase}</span>
              </div>
            </div>
          </Panel>

          <ResizeHandle />

          <Panel
            defaultSize="30"
            minSize="20"
            className="flex flex-col gap-4 min-w-0"
          >
            <Explanation
              message={frame.message}
              className={`h-32 rounded-md border p-4 shadow-inner shrink-0 ${colors.explanationBg} ${colors.explanationBorder}`}
            />
            <SourceCode
              code={longestConsecutiveCode}
              activeLine={frame.codeLine}
              theme="cyan"
            />
          </Panel>
        </PanelGroup>
      </div>
    </div>
  );
}
