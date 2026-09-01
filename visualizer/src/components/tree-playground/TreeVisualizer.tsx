import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  Play,
  RotateCcw,
  Sparkles,
  Pause,
  TreePine,
  Zap,
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Layers,
} from "lucide-react";
import CanvasViewport from "../shared/CanvasViewport";
import TreePanel from "../primitives/TreePanel";
import StepProgress from "../shared/StepProgress";
import Explanation from "../shared/Explanation";
import { TreeNode } from "../../core/structures/tree/TreeNode";
import { computeTreeLayoutWithOffset } from "../../core/structures/tree/layout";
import type { TreeState } from "../../core/structures/tree/types";

interface StepFrame {
  treeState: TreeState;
  message: string;
  queue: string[];
}

function parseArrayInput(str: string): (number | null)[] {
  const cleaned = str.trim().replace(/^\[/, "").replace(/\]$/, "").trim();
  if (!cleaned) return [];
  return cleaned.split(",").map((token) => {
    const t = token.trim().toLowerCase();
    if (
      t === "null" ||
      t === "none" ||
      t === "nil" ||
      t === "" ||
      t === "." ||
      t === "x"
    ) {
      return null;
    }
    const num = Number(t);
    return isNaN(num) ? null : num;
  });
}

function generateTreeSteps(arr: (number | null)[]): StepFrame[] {
  if (!arr.length || arr[0] === null) {
    return [
      {
        treeState: { nodes: [], edges: [] },
        message: "Empty array. Tree has no nodes.",
        queue: [],
      },
    ];
  }

  // Calculate tree depth first to calibrate initial horizontal offset
  const fullRoot = new TreeNode(arr[0], `node_0_${arr[0]}`);
  const fullQueue: TreeNode[] = [fullRoot];
  let scanIdx = 1;
  while (scanIdx < arr.length && fullQueue.length > 0) {
    const p = fullQueue.shift()!;
    if (scanIdx < arr.length) {
      const lVal = arr[scanIdx];
      if (lVal !== null) {
        p.left = new TreeNode(lVal, `node_${scanIdx}_${lVal}`);
        fullQueue.push(p.left);
      }
      scanIdx++;
    }
    if (scanIdx < arr.length) {
      const rVal = arr[scanIdx];
      if (rVal !== null) {
        p.right = new TreeNode(rVal, `node_${scanIdx}_${rVal}`);
        fullQueue.push(p.right);
      }
      scanIdx++;
    }
  }

  let maxDepth = 0;
  function getDepth(n: TreeNode | null, d: number) {
    if (!n) return;
    maxDepth = Math.max(maxDepth, d);
    getDepth(n.left, d + 1);
    getDepth(n.right, d + 1);
  }
  getDepth(fullRoot, 0);

  const initialOffset = Math.max(90, Math.min(180, 280 / Math.max(1, maxDepth)));
  const levelHeight = 64;

  // Build step-by-step state frames
  const steps: StepFrame[] = [];
  const root = new TreeNode(arr[0], `node_0_${arr[0]}`);
  const bfsQueue: TreeNode[] = [root];
  const queueStrings: string[] = [`${root.val}`];

  // Initial Root step
  const initialLayout = computeTreeLayoutWithOffset(
    root,
    400,
    50,
    "",
    initialOffset,
    levelHeight,
  );
  steps.push({
    treeState: {
      ...initialLayout,
      activeNodeId: root.id,
    },
    message: `🌱 Initialized root node with value ${root.val}`,
    queue: [...queueStrings],
  });

  let i = 1;
  while (i < arr.length && bfsQueue.length > 0) {
    const parent = bfsQueue.shift()!;
    queueStrings.shift();

    // Left child
    if (i < arr.length) {
      const leftVal = arr[i];
      if (leftVal !== null) {
        parent.left = new TreeNode(leftVal, `node_${i}_${leftVal}`);
        bfsQueue.push(parent.left);
        queueStrings.push(`${leftVal}`);

        const layout = computeTreeLayoutWithOffset(
          root,
          400,
          50,
          "",
          initialOffset,
          levelHeight,
        );
        steps.push({
          treeState: {
            ...layout,
            activeNodeId: parent.left.id,
            targetNodeId: parent.id,
          },
          message: `Attached left child (${leftVal}) to parent (${parent.val})`,
          queue: [...queueStrings],
        });
      } else {
        const layout = computeTreeLayoutWithOffset(
          root,
          400,
          50,
          "",
          initialOffset,
          levelHeight,
        );
        steps.push({
          treeState: {
            ...layout,
            activeNodeId: `${parent.id}-left-null`,
            targetNodeId: parent.id,
          },
          message: `Index ${i} is null: Parent (${parent.val}) has no left child`,
          queue: [...queueStrings],
        });
      }
      i++;
    }

    // Right child
    if (i < arr.length) {
      const rightVal = arr[i];
      if (rightVal !== null) {
        parent.right = new TreeNode(rightVal, `node_${i}_${rightVal}`);
        bfsQueue.push(parent.right);
        queueStrings.push(`${rightVal}`);

        const layout = computeTreeLayoutWithOffset(
          root,
          400,
          50,
          "",
          initialOffset,
          levelHeight,
        );
        steps.push({
          treeState: {
            ...layout,
            activeNodeId: parent.right.id,
            targetNodeId: parent.id,
          },
          message: `Attached right child (${rightVal}) to parent (${parent.val})`,
          queue: [...queueStrings],
        });
      } else {
        const layout = computeTreeLayoutWithOffset(
          root,
          400,
          50,
          "",
          initialOffset,
          levelHeight,
        );
        steps.push({
          treeState: {
            ...layout,
            activeNodeId: `${parent.id}-right-null`,
            targetNodeId: parent.id,
          },
          message: `Index ${i} is null: Parent (${parent.val}) has no right child`,
          queue: [...queueStrings],
        });
      }
      i++;
    }
  }

  const finalLayout = computeTreeLayoutWithOffset(
    root,
    400,
    50,
    "",
    initialOffset,
    levelHeight,
  );
  steps.push({
    treeState: {
      ...finalLayout,
      activeNodeId: undefined,
      targetNodeId: undefined,
    },
    message: `Tree construction complete with ${
      finalLayout.nodes.filter((n) => !n.isNull).length
    } nodes`,
    queue: [],
  });

  return steps;
}

const PRESETS = [
  { label: "[1, 2, 3, 4, 5]", value: "[1, 2, 3, 4, 5]" },
  {
    label: "[3, 9, 20, null, null, 15, 7]",
    value: "[3, 9, 20, null, null, 15, 7]",
  },
  {
    label: "[1, 2, 3, null, 5, null, 4]",
    value: "[1, 2, 3, null, 5, null, 4]",
  },
  { label: "[4, 2, 7, 1, 3, 6, 9]", value: "[4, 2, 7, 1, 3, 6, 9]" },
  {
    label: "[1, null, 2, null, 3, null, 4]",
    value: "[1, null, 2, null, 3, null, 4]",
  },
  {
    label: "[5, 3, 8, 1, 4, 7, 9, 0, 2]",
    value: "[5, 3, 8, 1, 4, 7, 9, 0, 2]",
  },
];

const SPEED_OPTIONS = [
  { label: "0.5x", ms: 900 },
  { label: "1x", ms: 450 },
  { label: "2x", ms: 220 },
  { label: "4x", ms: 100 },
];

export default function TreeVisualizer() {
  const [inputText, setInputText] = useState("[1, 2, 3, 4, 5]");
  const [activeArray, setActiveArray] = useState<(number | null)[]>([
    1, 2, 3, 4, 5,
  ]);
  const [speedIndex, setSpeedIndex] = useState(1);
  const [stepIdx, setStepIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  const speedMs = SPEED_OPTIONS[speedIndex].ms;

  const steps = useMemo(() => {
    return generateTreeSteps(activeArray);
  }, [activeArray]);

  const currentFrame = steps[stepIdx] || steps[0];
  const totalSteps = steps.length;

  const startBuild = (arr: (number | null)[]) => {
    setActiveArray(arr);
    setStepIdx(0);
    setIsPlaying(true);
  };

  const handleApply = () => {
    const parsed = parseArrayInput(inputText);
    if (parsed.length > 0) {
      startBuild(parsed);
    }
  };

  const handlePresetSelect = (presetVal: string) => {
    setInputText(presetVal);
    const parsed = parseArrayInput(presetVal);
    if (parsed.length > 0) {
      startBuild(parsed);
    }
  };

  const handleReplay = () => {
    setStepIdx(0);
    setIsPlaying(true);
  };

  // Timer loop for automatic step animation
  useEffect(() => {
    if (!isPlaying) return;

    if (stepIdx >= steps.length - 1) {
      setIsPlaying(false);
      return;
    }

    const timer = setTimeout(() => {
      setStepIdx((prev) => Math.min(prev + 1, steps.length - 1));
    }, speedMs);

    return () => clearTimeout(timer);
  }, [isPlaying, stepIdx, steps.length, speedMs]);

  return (
    <div className="flex flex-col h-screen bg-[#0f1013] text-[#ededf0] font-['Poppins',sans-serif] p-4 select-none selection:bg-[#c9c3b6] selection:text-[#15150f]">
      {/* Top Header & Interactive Input Controls */}
      <header className="flex flex-wrap items-center justify-between gap-3 bg-[#15161d] border border-white/[0.05] px-4 py-3 rounded-[14px] shadow-[0_4px_16px_rgba(0,0,0,0.25)] shrink-0">
        <div className="flex items-center gap-3">
          <Link
            to="/"
            className="flex items-center gap-1.5 text-[12px] font-medium text-[#f2f2f5] bg-gradient-to-b from-[#33333a] to-[#26262c] border border-[#3d3d45] shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_1px_2px_rgba(0,0,0,0.4)] px-2.5 py-1.5 rounded-[8px] hover:from-[#3a3a42] hover:to-[#2c2c33] transition-all"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Home</span>
          </Link>

          <div className="flex items-center gap-2.5 pl-2 border-l border-white/[0.08]">
            <div className="w-8 h-8 rounded-[8px] bg-[#1f2029] border border-white/[0.06] flex items-center justify-center shadow-sm">
              <TreePine className="w-4 h-4 text-[#c9c3b6]" />
            </div>
            <div>
              <h1 className="text-[14.5px] font-semibold tracking-tight text-[#ededf0] flex items-center gap-2">
                Binary Tree Visualizer
                <span className="text-[10.5px] font-['JetBrains_Mono',monospace] font-medium px-2 py-0.5 rounded-full bg-[#1c1d24] text-[#c9c3b6] border border-white/[0.06]">
                  Array to Tree
                </span>
              </h1>
            </div>
          </div>
        </div>

        {/* Input Bar & Build / Replay Controls */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center bg-[#1c1d24] border border-[#2e2e34] rounded-[10px] px-3 py-1.5 gap-2 shadow-inner focus-within:border-[#c9c3b6] transition-all">
            <span className="text-xs font-['JetBrains_Mono',monospace] text-[#82828b] font-semibold">
              Array:
            </span>
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleApply();
              }}
              placeholder="e.g. [1, 2, 3, 4, 5]"
              className="bg-transparent text-xs font-['JetBrains_Mono',monospace] text-[#ededf0] focus:outline-none w-44 sm:w-60 placeholder:text-[#5a5a63]"
            />
            <button
              onClick={handleApply}
              className="flex items-center gap-1.5 bg-gradient-to-b from-[#d6d0c4] to-[#c4beb0] text-[#15150f] font-semibold text-xs px-3 py-1 rounded-[7px] shadow-sm hover:from-[#e2ddd2] hover:to-[#d2ccbe] active:scale-95 transition-all cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              Build
            </button>
          </div>

          <button
            onClick={handleReplay}
            title="Replay Animation"
            className="flex items-center gap-1.5 bg-gradient-to-b from-[#33333a] to-[#26262c] border border-[#3d3d45] text-[#ededf0] text-xs font-medium px-3 py-1.5 rounded-[9px] shadow-sm hover:from-[#3a3a42] hover:to-[#2c2c33] transition-all cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Replay
          </button>

          <button
            onClick={() => setStepIdx((p) => Math.max(0, p - 1))}
            disabled={stepIdx === 0}
            title="Previous Step"
            className="p-2 rounded-[9px] bg-gradient-to-b from-[#33333a] to-[#26262c] border border-[#3d3d45] text-[#ededf0] disabled:opacity-40 disabled:cursor-not-allowed shadow-sm hover:from-[#3a3a42] hover:to-[#2c2c33] transition-all cursor-pointer"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => setIsPlaying(!isPlaying)}
            title={isPlaying ? "Pause" : "Play"}
            className="p-2 rounded-[9px] bg-gradient-to-b from-[#33333a] to-[#26262c] border border-[#3d3d45] text-[#ededf0] shadow-sm hover:from-[#3a3a42] hover:to-[#2c2c33] transition-all cursor-pointer"
          >
            {isPlaying ? (
              <Pause className="w-3.5 h-3.5" />
            ) : (
              <Play className="w-3.5 h-3.5 fill-current" />
            )}
          </button>

          <button
            onClick={() => setStepIdx((p) => Math.min(steps.length - 1, p + 1))}
            disabled={stepIdx >= steps.length - 1}
            title="Next Step"
            className="p-2 rounded-[9px] bg-gradient-to-b from-[#33333a] to-[#26262c] border border-[#3d3d45] text-[#ededf0] disabled:opacity-40 disabled:cursor-not-allowed shadow-sm hover:from-[#3a3a42] hover:to-[#2c2c33] transition-all cursor-pointer"
          >
            <ChevronRight className="w-3.5 h-3.5" />
          </button>

          {/* Speed Selector */}
          <div className="flex items-center bg-[#1c1d24] border border-[#2e2e34] rounded-[9px] p-0.5 gap-0.5 ml-1">
            {SPEED_OPTIONS.map((spd, idx) => (
              <button
                key={spd.label}
                onClick={() => setSpeedIndex(idx)}
                className={`text-[11px] font-['JetBrains_Mono',monospace] font-medium px-2 py-0.5 rounded-[6px] transition-all cursor-pointer ${
                  speedIndex === idx
                    ? "bg-[#33333a] text-white shadow-sm font-bold border border-[#4a4a55]"
                    : "text-[#82828b] hover:text-[#ededf0]"
                }`}
              >
                {spd.label}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* Preset Pill Bar */}
      <div className="flex items-center gap-1.5 my-3 overflow-x-auto pb-1 scrollbar-none shrink-0">
        <span className="text-xs text-[#82828b] font-medium flex items-center gap-1 mr-1">
          <Zap className="w-3.5 h-3.5 text-[#c9c3b6]" /> Presets:
        </span>
        {PRESETS.map((preset, idx) => (
          <button
            key={idx}
            onClick={() => handlePresetSelect(preset.value)}
            className={`text-xs font-['JetBrains_Mono',monospace] px-2.5 py-1 rounded-[8px] border transition-all cursor-pointer whitespace-nowrap ${
              inputText === preset.value
                ? "bg-[#252422] border-[#c9c3b6] text-white font-semibold shadow-[0_0_10px_rgba(201,195,182,0.2)]"
                : "bg-[#15161d] border-white/[0.05] text-[#82828b] hover:text-[#ededf0] hover:bg-[#1c1d24]"
            }`}
          >
            {preset.label}
          </button>
        ))}
      </div>

      {/* Main Canvas Area */}
      <main className="flex-1 relative bg-[#141519] border border-white/[0.05] rounded-[14px] overflow-hidden shadow-[0_0_0_1px_rgba(255,255,255,0.045)] flex flex-col h-full font-['Poppins',sans-serif]">
        {/* Central Viewport with Native TreePanel */}
        <CanvasViewport className="flex-1 w-full h-full relative">
          <div className="absolute inset-0 flex items-center justify-center p-8 min-w-[600px] pointer-events-auto">
            <TreePanel state={currentFrame.treeState} />
          </div>
        </CanvasViewport>

        {/* Step Progress at Top-Left */}
        <div className="absolute top-4 left-4 z-20 pointer-events-auto">
          <StepProgress
            label="Construction Step"
            currentStep={stepIdx}
            totalSteps={totalSteps}
            onStepClick={(s) => setStepIdx(s)}
          />
        </div>

        {/* Real-time BFS Queue Pill (Top-Right) */}
        {currentFrame.queue.length > 0 && (
          <div className="absolute top-4 right-4 z-20 pointer-events-auto flex items-center gap-2 bg-[#15161d]/90 backdrop-blur-md border border-white/[0.06] rounded-[12px] px-3.5 py-2 shadow-[0_8px_24px_rgba(0,0,0,0.45)]">
            <div className="flex items-center gap-1.5 text-[11px] font-semibold text-[#ededf0]">
              <Layers className="w-3.5 h-3.5 text-[#c9c3b6]" />
              <span>BFS Queue:</span>
            </div>
            <div className="flex items-center gap-1 font-['JetBrains_Mono',monospace] text-xs">
              {currentFrame.queue.map((qItem, i) => (
                <span
                  key={i}
                  className="px-2 py-0.5 rounded-[6px] bg-[#1c1d24] text-white border border-white/[0.05] font-bold"
                >
                  {qItem}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Floating Explanation Card (Bottom-Center) */}
        <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-20 pointer-events-auto max-w-2xl w-[92%] sm:w-auto">
          <Explanation message={currentFrame.message} />
        </div>
      </main>
    </div>
  );
}
