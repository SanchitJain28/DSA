import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Panel, Group as PanelGroup } from "react-resizable-panels";
import ResizeHandle from "../../components/shared/ResizeHandle";
import { usePlaybackTimer } from "../../hooks/usePlaybackTimer";
import { useKeyboardControls } from "../../hooks/useKeyboardControls";
import Header from "../../components/shared/Header";
import StackBucket from "../../components/shared/StackBucket";
import SourceCode from "../../components/shared/SourceCode";
import Explanation from "../../components/shared/Explanation";
import CanvasViewport from "../../components/shared/CanvasViewport";
import { type TestCase } from "../../components/shared/TestCaseSwitcher";
import { computeLayout } from "../../core/tree/layout";
import {
  buildPathSumIITree,
  generateFrames,
} from "../../core/tree/frames/pathSumIIFrames";
import { pathSumIICode } from "../../core/tree/sourcecode/pathSumII";
import { themeColors } from "../../utils/theme";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { SlidersHorizontal, Sparkles, Check, Target } from "lucide-react";

interface PathSumIITestCaseData {
  targetSum: number;
}

type PathSumIITestCase = TestCase<PathSumIITestCaseData>;

const TEST_CASES: PathSumIITestCase[] = [
  {
    id: "tc1",
    name: "Target 22 (Two paths: [5,4,11,2], [5,8,4,5])",
    data: { targetSum: 22 },
  },
  {
    id: "tc2",
    name: "Target 26 (One path: [5,8,13])",
    data: { targetSum: 26 },
  },
  {
    id: "tc3",
    name: "Target 18 (One path: [5,8,4,1])",
    data: { targetSum: 18 },
  },
  {
    id: "tc4",
    name: "Target 27 (One path: [5,4,11,7])",
    data: { targetSum: 27 },
  },
  {
    id: "tc5",
    name: "Target 35 (No valid paths)",
    data: { targetSum: 35 },
  },
];

export default function PathSumII() {
  const [testCaseIdx, setTestCaseIdx] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentData, setCurrentData] = useState<PathSumIITestCaseData>(
    TEST_CASES[0].data!,
  );

  const [tempTargetInput, setTempTargetInput] = useState(
    String(TEST_CASES[0].data!.targetSum),
  );
  const [tempSelectedIdx, setTempSelectedIdx] = useState<number | null>(0);

  const [currentIdx, setCurrentIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const handleOpenModal = () => {
    setTempTargetInput(String(currentData.targetSum));
    setTempSelectedIdx(testCaseIdx);
    setIsModalOpen(true);
  };

  const handleSelectPreset = (idx: number) => {
    setTempSelectedIdx(idx);
    const tc = TEST_CASES[idx];
    setTempTargetInput(String(tc.data!.targetSum));
  };

  const handleApplySettings = () => {
    let targetSum = currentData.targetSum;

    if (tempTargetInput.trim() !== "") {
      const parsed = Number(tempTargetInput.trim());
      if (!isNaN(parsed)) {
        targetSum = parsed;
      }
    }

    if (tempSelectedIdx !== null) {
      setTestCaseIdx(tempSelectedIdx);
    }

    setCurrentData({ targetSum });
    setCurrentIdx(0);
    setIsPlaying(false);
    setIsModalOpen(false);
  };

  const treeRoot = useMemo(() => buildPathSumIITree(), []);
  const baseLayout = useMemo(() => computeLayout(treeRoot), [treeRoot]);

  const frames = useMemo(() => {
    const root = buildPathSumIITree();
    return generateFrames(root, currentData.targetSum);
  }, [currentData]);

  usePlaybackTimer(
    isPlaying,
    setIsPlaying,
    currentIdx,
    setCurrentIdx,
    frames.length,
  );

  useKeyboardControls(frames.length, setCurrentIdx, setIsPlaying);

  const frame = frames[currentIdx] || frames[0];
  const activeLayout = frame.layout || baseLayout;

  const handleNext = () =>
    setCurrentIdx((p) => Math.min(p + 1, frames.length - 1));
  const handlePrev = () => setCurrentIdx((p) => Math.max(p - 1, 0));
  const handleReset = () => {
    setCurrentIdx(0);
    setIsPlaying(false);
  };

  const colors = themeColors.emerald;
  const variableEntries = Object.entries(frame.variables || {});

  return (
    <div className="flex flex-col h-screen bg-background text-foreground font-sans p-4">
      <Header
        title="Path Sum II"
        titleColorClass={colors.titleClass}
        theme="emerald"
        isPlaying={isPlaying}
        onPlayPause={() => setIsPlaying(!isPlaying)}
        onNext={handleNext}
        onPrev={handlePrev}
        onReset={handleReset}
      >
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogTrigger
            onClick={handleOpenModal}
            className="flex items-center gap-1.5 bg-card hover:bg-accent/10 border border-border px-3 py-1.5 rounded-md text-xs font-medium text-foreground transition-colors shadow-sm cursor-pointer"
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-emerald-400" />
            <span>Configure Inputs</span>
          </DialogTrigger>

          <DialogContent className="sm:max-w-xl bg-neutral-900 border-neutral-800 text-neutral-100 shadow-2xl p-5 rounded-lg">
            <DialogHeader>
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                  <SlidersHorizontal className="w-4 h-4" />
                </div>
                <div>
                  <DialogTitle className="text-base font-semibold text-neutral-100">
                    Configure Target Sum & Scenarios
                  </DialogTitle>
                  <DialogDescription className="text-xs text-neutral-400 mt-0.5">
                    Select a preset path sum scenario or enter a custom target
                    value.
                  </DialogDescription>
                </div>
              </div>
            </DialogHeader>

            <div className="space-y-4 py-2">
              <div>
                <label className="text-xs font-mono font-semibold uppercase tracking-wider text-neutral-400 mb-2 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                  Preset Test Scenarios
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-52 overflow-y-auto pr-1">
                  {TEST_CASES.map((tc, idx) => {
                    const isSelected = tempSelectedIdx === idx;
                    return (
                      <button
                        key={tc.id}
                        type="button"
                        onClick={() => handleSelectPreset(idx)}
                        className={`p-2.5 rounded-md border text-left transition-all cursor-pointer flex flex-col gap-1 ${
                          isSelected
                            ? "bg-emerald-950/50 border-emerald-500/60 text-neutral-100 ring-1 ring-emerald-500/40 shadow-sm"
                            : "bg-neutral-950/50 border-neutral-800 hover:bg-neutral-800/50 text-neutral-400 hover:text-neutral-200"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-semibold text-neutral-100">
                            {tc.name}
                          </span>
                          {isSelected && (
                            <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                          )}
                        </div>
                        <div className="font-mono text-[11px] text-neutral-400 truncate">
                          Target Sum = {tc.data!.targetSum}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 2. Custom Input Form */}
              <div className="pt-3 border-t border-neutral-800">
                <label className="text-xs font-mono font-semibold uppercase tracking-wider text-neutral-400 mb-2 block">
                  Custom Target Sum
                </label>
                <div className="space-y-1">
                  <label className="text-[11px] font-mono text-neutral-400 flex items-center gap-1">
                    <Target className="w-3 h-3 text-emerald-400" />
                    Target Sum Value:
                  </label>
                  <input
                    type="number"
                    value={tempTargetInput}
                    onChange={(e) => {
                      setTempTargetInput(e.target.value);
                      setTempSelectedIdx(null);
                    }}
                    placeholder="22"
                    className="w-full bg-neutral-950/80 border border-neutral-700/80 rounded-md px-3 py-2 text-xs font-mono text-neutral-100 focus:outline-none focus:ring-1 focus:ring-emerald-500/60 focus:border-emerald-500 placeholder:text-neutral-600"
                  />
                </div>
              </div>
            </div>

            <DialogFooter className="mt-2 flex items-center justify-end gap-2 border-t border-neutral-800 bg-neutral-950/60 pt-4 rounded-b-lg">
              <DialogClose
                type="button"
                className="px-3.5 py-1.5 rounded-md border border-neutral-700 bg-neutral-800 text-xs font-medium text-neutral-300 hover:text-white hover:bg-neutral-700 transition-colors cursor-pointer"
              >
                Cancel
              </DialogClose>
              <button
                type="button"
                onClick={handleApplySettings}
                className="px-4 py-1.5 rounded-md bg-emerald-600 hover:bg-emerald-500 text-xs font-semibold text-white shadow-lg transition-colors cursor-pointer"
              >
                Apply & Run
              </button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </Header>

      <div className="flex-1 mt-4 overflow-hidden">
        <PanelGroup orientation="horizontal">
          <Panel className="flex flex-col min-w-0 h-full">
            <div className="flex-1 relative bg-card rounded-md border border-border overflow-hidden shadow-inner flex flex-col h-full">
              <CanvasViewport className="flex-1 w-full h-full">
                <div className="flex flex-col items-center justify-center p-8 gap-8 min-w-[920px] w-full">
                  {variableEntries.length > 0 && (
                    <div className="flex flex-wrap items-center justify-center gap-6">
                      {variableEntries.map(([key, val]) => (
                        <div key={key} className="flex flex-col items-center">
                          <span className="text-neutral-400 text-xs font-mono font-semibold mb-1.5 uppercase tracking-wider">
                            {key}
                          </span>
                          <div className="bg-neutral-900/90 border border-neutral-800 px-4 py-2 rounded-md flex items-center justify-center min-w-[96px] shadow-sm">
                            <AnimatePresence mode="popLayout">
                              <motion.span
                                key={String(val)}
                                initial={{ opacity: 0, y: -8, scale: 0.85 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: 8, scale: 0.85 }}
                                className={`font-mono text-base font-bold ${
                                  val === "null" || val === "[]"
                                    ? "text-neutral-500 font-normal"
                                    : colors.variablesText
                                }`}
                              >
                                {val}
                              </motion.span>
                            </AnimatePresence>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="flex items-center justify-center gap-12 w-full">
                    <StackBucket
                      stack={frame.callStack || []}
                      title="Recursion Stack"
                      themeColorClass="text-emerald-400"
                      activeBgClass="bg-emerald-950/70"
                      activeBorderClass="border-emerald-500/60"
                    />

                    <div
                      className="relative"
                      style={{ width: 640, height: 430 }}
                    >
                      <svg className="absolute inset-0 w-full h-full pointer-events-none overflow-visible">
                        {activeLayout.edges.map((edge) => (
                          <motion.line
                            key={edge.id}
                            x1={edge.x1}
                            y1={edge.y1}
                            x2={edge.x2}
                            y2={edge.y2}
                            stroke={edge.isNull ? colors.edgeNull : colors.edge}
                            strokeWidth={edge.isNull ? "2.5" : "3.5"}
                            strokeDasharray={edge.isNull ? "4 4" : "none"}
                            strokeLinecap="round"
                            initial={
                              edge.isNull ? { opacity: 0 } : { pathLength: 0 }
                            }
                            animate={
                              edge.isNull ? { opacity: 1 } : { pathLength: 1 }
                            }
                            transition={{ duration: 0.4 }}
                          />
                        ))}
                      </svg>

                      <div className="absolute inset-0">
                        <AnimatePresence mode="popLayout">
                          {activeLayout.nodes.map((node) => {
                            const isActive =
                              node.id === frame.activeNodeId ||
                              (frame.activeNodeIds &&
                                frame.activeNodeIds.includes(node.id)) ||
                              node.status === "active";

                            if (node.isNull) {
                              return (
                                <motion.div
                                  key={node.id}
                                  layout
                                  initial={{ scale: 0, opacity: 0 }}
                                  animate={{
                                    scale: isActive ? 1.3 : 1,
                                    opacity: isActive ? 1 : 0.45,
                                    backgroundColor: isActive
                                      ? colors.nodeNullBg
                                      : "#0f172a",
                                    borderColor: isActive
                                      ? colors.nodeNullBorder
                                      : "#1e293b",
                                  }}
                                  exit={{ scale: 0, opacity: 0 }}
                                  transition={{
                                    type: "spring",
                                    stiffness: 300,
                                    damping: 20,
                                  }}
                                  className={`absolute w-5 h-5 -ml-2.5 -mt-2.5 rounded-full border-2 flex items-center justify-center shadow-md ${
                                    isActive
                                      ? "z-20 ring-2 ring-rose-400/50"
                                      : "z-0"
                                  }`}
                                  style={{ left: node.x, top: node.y }}
                                >
                                  {isActive && (
                                    <span className="text-[10px] font-bold text-rose-200">
                                      ∅
                                    </span>
                                  )}
                                </motion.div>
                              );
                            }

                            const isSecondary = node.status === "secondary";
                            const isSuccess = node.status === "success";

                            let bg = "#1f2937";
                            let border = "#374151";
                            let ringClass = "shadow-lg shadow-black/40";
                            let scale = 1;

                            if (isActive) {
                              bg = colors.nodeActiveBg;
                              border = colors.nodeActiveBorder;
                              ringClass =
                                "ring-4 ring-emerald-400/40 shadow-xl shadow-emerald-500/30";
                              scale = 1.18;
                            } else if (isSuccess) {
                              bg = "#14532d";
                              border = "#22c55e";
                              ringClass =
                                "ring-4 ring-green-400/60 shadow-xl shadow-green-950/70";
                              scale = 1.22;
                            } else if (isSecondary) {
                              bg = "#064e3b";
                              border = "#10b981";
                              ringClass =
                                "ring-2 ring-emerald-400/50 shadow-lg shadow-emerald-950/50";
                              scale = 1.08;
                            }

                            return (
                              <motion.div
                                key={node.id}
                                layout
                                initial={{ scale: 0, opacity: 0 }}
                                animate={{
                                  scale,
                                  opacity: 1,
                                  backgroundColor: bg,
                                  borderColor: border,
                                }}
                                exit={{ scale: 0, opacity: 0 }}
                                transition={{
                                  type: "spring",
                                  stiffness: 300,
                                  damping: 20,
                                }}
                                className={`absolute w-12 h-12 -ml-6 -mt-6 rounded-md border-2 flex items-center justify-center font-mono font-bold text-lg text-white select-none transition-colors duration-200 z-10 ${ringClass}`}
                                style={{ left: node.x, top: node.y }}
                              >
                                {node.val}
                              </motion.div>
                            );
                          })}
                        </AnimatePresence>
                      </div>
                    </div>
                  </div>
                </div>
              </CanvasViewport>

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
              code={pathSumIICode}
              activeLine={frame.codeLine}
              theme="emerald"
            />
          </Panel>
        </PanelGroup>
      </div>
    </div>
  );
}
