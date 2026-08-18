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
  buildPreset1Tree,
  buildPreset2Tree,
  buildPreset3Tree,
  buildPreset4Tree,
  buildPreset5Tree,
  generateFrames,
} from "../../core/tree/frames/sumRootToLeafFrames";
import { sumRootToLeafCode } from "../../core/tree/sourcecode/sumRootToLeaf";
import { themeColors } from "../../utils/theme";
import { TreeNode } from "../../core/tree/TreeNode";
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
import { SlidersHorizontal, Sparkles, Check } from "lucide-react";

interface SumRootTestCaseData {
  buildTree: () => TreeNode;
  preview: string;
}

type SumRootTestCase = TestCase<SumRootTestCaseData>;

const TEST_CASES: SumRootTestCase[] = [
  {
    id: "tc1",
    name: "Example 1: [4, 9, 0, 5, 1]",
    data: {
      buildTree: buildPreset1Tree,
      preview: "Paths: 495 + 491 + 40 = 1026",
    },
  },
  {
    id: "tc2",
    name: "Example 2: [1, 2, 3]",
    data: {
      buildTree: buildPreset2Tree,
      preview: "Paths: 12 + 13 = 25",
    },
  },
  {
    id: "tc3",
    name: "Single Branch: [1, 0]",
    data: {
      buildTree: buildPreset3Tree,
      preview: "Path: 10 = 10",
    },
  },
  {
    id: "tc4",
    name: "Full 3-Level Tree: [4, 2, 7, 1, 3, 6, 9]",
    data: {
      buildTree: buildPreset4Tree,
      preview: "Paths: 421 + 423 + 476 + 479 = 1799",
    },
  },
  {
    id: "tc5",
    name: "Single Node: [9]",
    data: {
      buildTree: buildPreset5Tree,
      preview: "Path: 9 = 9",
    },
  },
];

export default function SumRootToLeaf() {
  const [testCaseIdx, setTestCaseIdx] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tempSelectedIdx, setTempSelectedIdx] = useState(0);

  const [currentIdx, setCurrentIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const handleOpenModal = () => {
    setTempSelectedIdx(testCaseIdx);
    setIsModalOpen(true);
  };

  const handleApplySettings = () => {
    setTestCaseIdx(tempSelectedIdx);
    setCurrentIdx(0);
    setIsPlaying(false);
    setIsModalOpen(false);
  };

  const currentTestCase = TEST_CASES[testCaseIdx];
  const treeRoot = useMemo(
    () => currentTestCase.data!.buildTree(),
    [testCaseIdx]
  );
  const baseLayout = useMemo(() => computeLayout(treeRoot), [treeRoot]);

  const frames = useMemo(() => {
    const root = currentTestCase.data!.buildTree();
    return generateFrames(root);
  }, [testCaseIdx]);

  usePlaybackTimer(
    isPlaying,
    setIsPlaying,
    currentIdx,
    setCurrentIdx,
    frames.length
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

  const colors = themeColors.amber;
  const variableEntries = Object.entries(frame.variables || {});

  return (
    <div className="flex flex-col h-screen bg-background text-foreground font-sans p-4">
      <Header
        title="Sum Root to Leaf Numbers"
        titleColorClass={colors.titleClass}
        theme="amber"
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
            <SlidersHorizontal className="w-3.5 h-3.5 text-amber-400" />
            <span>Configure Inputs</span>
          </DialogTrigger>

          <DialogContent className="sm:max-w-xl bg-neutral-900 border-neutral-800 text-neutral-100 shadow-2xl p-5 rounded-lg">
            <DialogHeader>
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-md bg-amber-500/10 border border-amber-500/20 text-amber-400">
                  <SlidersHorizontal className="w-4 h-4" />
                </div>
                <div>
                  <DialogTitle className="text-base font-semibold text-neutral-100">
                    Configure Tree Scenario
                  </DialogTitle>
                  <DialogDescription className="text-xs text-neutral-400 mt-0.5">
                    Select a binary tree test scenario to visualize root-to-leaf path sums.
                  </DialogDescription>
                </div>
              </div>
            </DialogHeader>

            <div className="space-y-4 py-2">
              <div>
                <label className="text-xs font-mono font-semibold uppercase tracking-wider text-neutral-400 mb-2 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  Preset Test Scenarios
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-60 overflow-y-auto pr-1">
                  {TEST_CASES.map((tc, idx) => {
                    const isSelected = tempSelectedIdx === idx;
                    return (
                      <button
                        key={tc.id}
                        type="button"
                        onClick={() => setTempSelectedIdx(idx)}
                        className={`p-2.5 rounded-md border text-left transition-all cursor-pointer flex flex-col gap-1 ${
                          isSelected
                            ? "bg-amber-950/50 border-amber-500/60 text-neutral-100 ring-1 ring-amber-500/40 shadow-sm"
                            : "bg-neutral-950/50 border-neutral-800 hover:bg-neutral-800/50 text-neutral-400 hover:text-neutral-200"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-semibold text-neutral-100">
                            {tc.name}
                          </span>
                          {isSelected && (
                            <Check className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                          )}
                        </div>
                        <div className="font-mono text-[11px] text-neutral-400 truncate">
                          {tc.data!.preview}
                        </div>
                      </button>
                    );
                  })}
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
                className="px-4 py-1.5 rounded-md bg-amber-600 hover:bg-amber-500 text-xs font-semibold text-white shadow-lg transition-colors cursor-pointer"
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
                  {/* 1. Canvas Variables (Design Schema) */}
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
                                  val === "null" || val === "[]" || val === "∅"
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

                  {/* 2. In-Canvas Stack Bucket + Binary Tree Graph */}
                  <div className="flex items-center justify-center gap-12 w-full">
                    <StackBucket
                      stack={frame.callStack || []}
                      title="Recursion Stack"
                      themeColorClass="text-amber-400"
                      activeBgClass="bg-amber-950/70"
                      activeBorderClass="border-amber-500/60"
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

                            const isSecondary = node.status === "secondary"; // in current path
                            const isSuccess = node.status === "success"; // completed leaf

                            let bg = "#1f2937";
                            let border = "#374151";
                            let ringClass = "shadow-lg shadow-black/40";
                            let scale = 1;

                            if (isActive) {
                              bg = colors.nodeActiveBg;
                              border = colors.nodeActiveBorder;
                              ringClass =
                                "ring-4 ring-amber-400/40 shadow-xl shadow-amber-500/30";
                              scale = 1.18;
                            } else if (isSuccess) {
                              bg = "#14532d"; // emerald
                              border = "#22c55e";
                              ringClass =
                                "ring-4 ring-green-400/60 shadow-xl shadow-green-950/70";
                              scale = 1.22;
                            } else if (isSecondary) {
                              bg = "#451a03"; // dark amber
                              border = "#f59e0b";
                              ringClass =
                                "ring-2 ring-amber-400/50 shadow-lg shadow-amber-950/50";
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
              code={sumRootToLeafCode}
              activeLine={frame.codeLine}
              theme="amber"
            />
          </Panel>
        </PanelGroup>
      </div>
    </div>
  );
}
