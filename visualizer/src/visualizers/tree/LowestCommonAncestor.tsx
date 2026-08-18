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
import { generateFrames } from "../../core/tree/frames/lowestCommonAncestorFrames";
import { lowestCommonAncestorCode } from "../../core/tree/sourcecode/lowestCommonAncestor";
import { TreeNode } from "../../core/tree/TreeNode";
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

interface LCATestCaseData {
  p: number;
  q: number;
}

type LCATestCase = TestCase<LCATestCaseData>;

const TEST_CASES: LCATestCase[] = [
  {
    id: "tc1",
    name: "Root Split: p = 2, q = 8",
    data: { p: 2, q: 8 },
  },
  {
    id: "tc2",
    name: "Ancestor is p: p = 2, q = 4",
    data: { p: 2, q: 4 },
  },
  {
    id: "tc3",
    name: "Subtree Split: p = 3, q = 5",
    data: { p: 3, q: 5 },
  },
  {
    id: "tc4",
    name: "Opposite Extremes: p = 0, q = 9",
    data: { p: 0, q: 9 },
  },
  {
    id: "tc5",
    name: "Right Subtree: p = 7, q = 9",
    data: { p: 7, q: 9 },
  },
  {
    id: "tc6",
    name: "Adjacent Nodes: p = 3, q = 4",
    data: { p: 3, q: 4 },
  },
];

function buildStandardBST(): TreeNode {
  const root = new TreeNode(6, "6");
  root.left = new TreeNode(2, "2");
  root.right = new TreeNode(8, "8");
  root.left.left = new TreeNode(0, "0");
  root.left.right = new TreeNode(4, "4");
  root.left.right.left = new TreeNode(3, "3");
  root.left.right.right = new TreeNode(5, "5");
  root.right.left = new TreeNode(7, "7");
  root.right.right = new TreeNode(9, "9");
  return root;
}

const VALID_NODES = [0, 2, 3, 4, 5, 6, 7, 8, 9];

export default function LowestCommonAncestor() {
  const [testCaseIdx, setTestCaseIdx] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentData, setCurrentData] = useState<LCATestCaseData>(
    TEST_CASES[0].data!,
  );

  // Form modal temp state
  const [tempPInput, setTempPInput] = useState(String(TEST_CASES[0].data!.p));
  const [tempQInput, setTempQInput] = useState(String(TEST_CASES[0].data!.q));
  const [tempSelectedIdx, setTempSelectedIdx] = useState<number | null>(0);

  const [currentIdx, setCurrentIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const handleOpenModal = () => {
    setTempPInput(String(currentData.p));
    setTempQInput(String(currentData.q));
    setTempSelectedIdx(testCaseIdx);
    setIsModalOpen(true);
  };

  const handleSelectPreset = (idx: number) => {
    setTempSelectedIdx(idx);
    const tc = TEST_CASES[idx];
    setTempPInput(String(tc.data!.p));
    setTempQInput(String(tc.data!.q));
  };

  const handleApplySettings = () => {
    let p = currentData.p;
    let q = currentData.q;

    if (tempPInput.trim() !== "") {
      const parsedP = Number(tempPInput.trim());
      if (!isNaN(parsedP) && VALID_NODES.includes(parsedP)) {
        p = parsedP;
      }
    }

    if (tempQInput.trim() !== "") {
      const parsedQ = Number(tempQInput.trim());
      if (!isNaN(parsedQ) && VALID_NODES.includes(parsedQ)) {
        q = parsedQ;
      }
    }

    if (tempSelectedIdx !== null) {
      setTestCaseIdx(tempSelectedIdx);
    }

    setCurrentData({ p, q });
    setCurrentIdx(0);
    setIsPlaying(false);
    setIsModalOpen(false);
  };

  const bstRoot = useMemo(() => buildStandardBST(), []);
  const baseLayout = useMemo(() => computeLayout(bstRoot), [bstRoot]);

  const frames = useMemo(() => {
    return generateFrames(bstRoot, currentData.p, currentData.q);
  }, [bstRoot, currentData]);

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

  const colors = themeColors.sky;
  const variableEntries = Object.entries(frame.variables || {});

  return (
    <div className="flex flex-col h-screen bg-background text-foreground font-sans p-4">
      <Header
        title="Lowest Common Ancestor of a BST"
        titleColorClass={colors.titleClass}
        theme="sky"
        isPlaying={isPlaying}
        onPlayPause={() => setIsPlaying(!isPlaying)}
        onNext={handleNext}
        onPrev={handlePrev}
        onReset={handleReset}
      >
        {/* Clean, Single Modal Trigger in Header */}
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogTrigger
            onClick={handleOpenModal}
            className="flex items-center gap-1.5 bg-card hover:bg-accent/10 border border-border px-3 py-1.5 rounded-md text-xs font-medium text-foreground transition-colors shadow-sm cursor-pointer"
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-sky-400" />
            <span>Configure Inputs</span>
          </DialogTrigger>

          <DialogContent className="sm:max-w-xl bg-neutral-900 border-neutral-800 text-neutral-100 shadow-2xl p-5 rounded-lg">
            <DialogHeader>
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-md bg-sky-500/10 border border-sky-500/20 text-sky-400">
                  <SlidersHorizontal className="w-4 h-4" />
                </div>
                <div>
                  <DialogTitle className="text-base font-semibold text-neutral-100">
                    Configure Target Nodes & Scenarios
                  </DialogTitle>
                  <DialogDescription className="text-xs text-neutral-400 mt-0.5">
                    Select a preset pair of nodes or enter custom targets p and
                    q in the BST.
                  </DialogDescription>
                </div>
              </div>
            </DialogHeader>

            <div className="space-y-4 py-2">
              {/* 1. Preset Test Cases */}
              <div>
                <label className="text-xs font-mono font-semibold uppercase tracking-wider text-neutral-400 mb-2 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-sky-400" />
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
                            ? "bg-sky-950/50 border-sky-500/60 text-neutral-100 ring-1 ring-sky-500/40 shadow-sm"
                            : "bg-neutral-950/50 border-neutral-800 hover:bg-neutral-800/50 text-neutral-400 hover:text-neutral-200"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-semibold text-neutral-100">
                            {tc.name}
                          </span>
                          {isSelected && (
                            <Check className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                          )}
                        </div>
                        <div className="font-mono text-[11px] text-neutral-400 truncate">
                          p = {tc.data!.p} · q = {tc.data!.q}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 2. Custom Input Form */}
              <div className="pt-3 border-t border-neutral-800">
                <label className="text-xs font-mono font-semibold uppercase tracking-wider text-neutral-400 mb-2 block">
                  Custom Target Nodes (Available: [0, 2, 3, 4, 5, 6, 7, 8, 9])
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[11px] font-mono text-neutral-400 flex items-center gap-1">
                      <Target className="w-3 h-3 text-sky-400" />
                      Target Node p:
                    </label>
                    <input
                      type="number"
                      value={tempPInput}
                      onChange={(e) => {
                        setTempPInput(e.target.value);
                        setTempSelectedIdx(null);
                      }}
                      placeholder="2"
                      className="w-full bg-neutral-950/80 border border-neutral-700/80 rounded-md px-3 py-2 text-xs font-mono text-neutral-100 focus:outline-none focus:ring-1 focus:ring-sky-500/60 focus:border-sky-500 placeholder:text-neutral-600"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-mono text-neutral-400 flex items-center gap-1">
                      <Target className="w-3 h-3 text-sky-400" />
                      Target Node q:
                    </label>
                    <input
                      type="number"
                      value={tempQInput}
                      onChange={(e) => {
                        setTempQInput(e.target.value);
                        setTempSelectedIdx(null);
                      }}
                      placeholder="8"
                      className="w-full bg-neutral-950/80 border border-neutral-700/80 rounded-md px-3 py-2 text-xs font-mono text-neutral-100 focus:outline-none focus:ring-1 focus:ring-sky-500/60 focus:border-sky-500 placeholder:text-neutral-600"
                    />
                  </div>
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
                className="px-4 py-1.5 rounded-md bg-sky-600 hover:bg-sky-500 text-xs font-semibold text-white shadow-lg transition-colors cursor-pointer"
              >
                Apply & Run
              </button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </Header>

      <div className="flex-1 mt-4 overflow-hidden">
        <PanelGroup orientation="horizontal">
          {/* Main Unified Pan & Zoom Canvas Viewport */}
          <Panel className="flex flex-col min-w-0 h-full">
            <div className="flex-1 relative bg-card rounded-md border border-border overflow-hidden shadow-inner flex flex-col h-full">
              {/* Interactive Canvas Viewport (Drag to pan, wheel to zoom) */}
              <CanvasViewport className="flex-1 w-full h-full">
                <div className="flex flex-col items-center justify-center p-8 gap-8 min-w-[900px] w-full">
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
                                  val === "null" || val === "N/A"
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

                  {/* 2. Side-by-Side: Stack Bucket + BST Binary Tree Graph */}
                  <div className="flex items-center justify-center gap-12 w-full">
                    {/* In-Canvas Stack Bucket Container */}
                    <StackBucket
                      stack={frame.callStack || []}
                      title="Recursion Stack"
                      themeColorClass="text-sky-400"
                      activeBgClass="bg-sky-950/70"
                      activeBorderClass="border-sky-500/60"
                    />

                    {/* BST Binary Tree Graph */}
                    <div
                      className="relative"
                      style={{ width: 620, height: 420 }}
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

                            const isTarget = node.status === "target";
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
                                "ring-4 ring-sky-400/40 shadow-xl shadow-sky-500/30";
                              scale = 1.18;
                            } else if (isSuccess) {
                              bg = "#14532d"; // emerald/green
                              border = "#22c55e";
                              ringClass =
                                "ring-4 ring-green-400/50 shadow-xl shadow-green-950/60";
                              scale = 1.2;
                            } else if (isTarget) {
                              bg = "#9a3412"; // orange/amber
                              border = "#f97316";
                              ringClass =
                                "ring-2 ring-orange-400/50 shadow-lg shadow-orange-950/50";
                              scale = 1.12;
                            } else if (isSecondary) {
                              bg = "#4c1d95";
                              border = "#8b5cf6";
                              ringClass =
                                "ring-2 ring-violet-400/50 shadow-lg shadow-violet-950/50";
                              scale = 1.12;
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

              {/* Phase Indicator (Bottom-Left) */}
              <div className="absolute bottom-3 left-4 text-xs text-neutral-400 font-medium z-10 pointer-events-none">
                Phase: <span className={colors.phaseText}>{frame.phase}</span>
              </div>
            </div>
          </Panel>

          <ResizeHandle />

          {/* Right Column: SourceCode & Explanation */}
          <Panel
            defaultSize="30"
            minSize="20"
            className="flex flex-col gap-4 min-w-0"
          >
            <SourceCode
              code={lowestCommonAncestorCode}
              activeLine={frame.codeLine}
              theme="sky"
            />
            <Explanation
              message={frame.message}
              className={`h-32 rounded-md border p-4 shadow-inner shrink-0 ${colors.explanationBg} ${colors.explanationBorder}`}
            />
          </Panel>
        </PanelGroup>
      </div>
    </div>
  );
}
