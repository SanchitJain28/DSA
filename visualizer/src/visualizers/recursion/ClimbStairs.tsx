import { useMemo, useState } from "react";
import TreeVisualizerLayout from "../../components/layout/TreeVisualizerLayout";
import ArrayVisualizerLayout from "../../components/layout/ArrayVisualizerLayout";
import ConfigModal from "../../components/shared/ConfigModal";
import { useConfigModal } from "../../hooks/useConfigModal";
import { type TestCase } from "../../components/shared/TestCaseSwitcher";
import { generateFrames as generateTreeFrames } from "../../core/recursion/frames/climbStairsTreeFrames";
import { generateDpFrames } from "../../core/recursion/frames/climbStairsDpFrames";
import {
  climbStairsTreeCode,
  climbStairsDpCode,
} from "../../core/recursion/sourcecode/climbStairs";
import { GitFork, Layers, Hash } from "lucide-react";

interface ClimbStairsData {
  n: number;
}

type ClimbStairsTestCase = TestCase<ClimbStairsData>;

const TEST_CASES: ClimbStairsTestCase[] = [
  {
    id: "tc1",
    name: "Small Steps: n = 3 (3 Ways)",
    data: { n: 3 },
  },
  {
    id: "tc2",
    name: "Standard: n = 4 (5 Ways)",
    data: { n: 4 },
  },
  {
    id: "tc3",
    name: "Larger: n = 5 (8 Ways)",
    data: { n: 5 },
  },
  {
    id: "tc4",
    name: "Base Case: n = 2 (2 Ways)",
    data: { n: 2 },
  },
];

export default function ClimbStairs() {
  const [testCaseIdx, setTestCaseIdx] = useState(1);
  const [currentN, setCurrentN] = useState<number>(TEST_CASES[1].data!.n);
  const [layoutMode, setLayoutMode] = useState<"tree" | "dp">("tree");

  // Controlled playback state for layout toggles
  const [currentIdx, setCurrentIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  // Buffer state for modal
  const [tempNInput, setTempNInput] = useState(String(TEST_CASES[1].data!.n));
  const [tempLayoutMode, setTempLayoutMode] = useState<"tree" | "dp">("tree");

  const modal = useConfigModal(1);

  const handleOpenModal = () => {
    modal.openModal(() => {
      setTempNInput(String(currentN));
      setTempLayoutMode(layoutMode);
      modal.setSelectedPresetIdx(testCaseIdx);
    });
  };

  const handleSelectPreset = (idx: number) => {
    modal.selectPreset(idx, () => {
      const tc = TEST_CASES[idx];
      if (tc?.data) {
        setTempNInput(String(tc.data.n));
      }
    });
  };

  const handleApplySettings = () => {
    modal.apply(() => {
      let n = currentN;
      if (tempNInput.trim() !== "") {
        const parsed = Number(tempNInput.trim());
        if (!isNaN(parsed) && parsed >= 1 && parsed <= 7) {
          n = parsed;
        }
      }

      if (modal.selectedPresetIdx !== null) {
        setTestCaseIdx(modal.selectedPresetIdx);
      }

      setCurrentN(n);
      setLayoutMode(tempLayoutMode);
      setCurrentIdx(0);
      setIsPlaying(false);
    });
  };

  const treeFrames = useMemo(() => {
    // Cap tree view at 5 to keep recursion layout clean
    const safeN = Math.min(currentN, 5);
    return generateTreeFrames(safeN);
  }, [currentN]);

  const dpFrames = useMemo(() => {
    return generateDpFrames(currentN);
  }, [currentN]);

  const modalSlot = (
    <div className="flex items-center gap-3">
      {/* Mode Switcher Pill in Header */}
      <div className="flex items-center bg-neutral-900 border border-neutral-800 rounded-md p-0.5">
        <button
          type="button"
          onClick={() => {
            setLayoutMode("tree");
            setCurrentIdx(0);
            setIsPlaying(false);
          }}
          className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded transition-all cursor-pointer ${
            layoutMode === "tree"
              ? "bg-emerald-600 text-white shadow-sm shadow-emerald-950/60"
              : "text-neutral-400 hover:text-neutral-200"
          }`}
        >
          <GitFork className="w-3.5 h-3.5" />
          <span>Recursion Tree</span>
        </button>

        <button
          type="button"
          onClick={() => {
            setLayoutMode("dp");
            setCurrentIdx(0);
            setIsPlaying(false);
          }}
          className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded transition-all cursor-pointer ${
            layoutMode === "dp"
              ? "bg-emerald-600 text-white shadow-sm shadow-emerald-950/60"
              : "text-neutral-400 hover:text-neutral-200"
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>1D DP (Memo)</span>
        </button>
      </div>

      <ConfigModal
        title="Configure Stairs Steps & View"
        description="Select a preset step count, provide a custom n value (1..7), or switch visual mode."
        theme="emerald"
        isOpen={modal.isOpen}
        onOpenChange={modal.setIsOpen}
        onOpen={handleOpenModal}
        presets={TEST_CASES.map((tc) => ({
          id: tc.id,
          name: tc.name,
          preview: `n = ${tc.data!.n} steps`,
        }))}
        selectedPresetIdx={modal.selectedPresetIdx}
        onSelectPreset={handleSelectPreset}
        onApply={handleApplySettings}
      >
        <div className="space-y-4">
          <div className="space-y-1">
            <label className="text-[11px] font-mono text-neutral-400 flex items-center gap-1">
              <Hash className="w-3 h-3 text-emerald-400" />
              Number of Steps (n):
            </label>
            <input
              type="number"
              value={tempNInput}
              onChange={(e) => {
                setTempNInput(e.target.value);
                modal.setSelectedPresetIdx(null);
              }}
              placeholder="4"
              min="1"
              max="7"
              className="w-full bg-neutral-950/80 border border-neutral-700/80 rounded-md px-3 py-2 text-xs font-mono text-neutral-100 focus:outline-none focus:ring-1 focus:ring-emerald-500/60 focus:border-emerald-500 placeholder:text-neutral-600"
            />
          </div>

          <div className="pt-3 border-t border-neutral-800">
            <label className="text-xs font-mono font-semibold uppercase tracking-wider text-neutral-400 mb-2 block">
              Visualizer Layout Mode
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setTempLayoutMode("tree")}
                className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-md border text-xs font-semibold transition-all cursor-pointer ${
                  tempLayoutMode === "tree"
                    ? "bg-emerald-600 text-white border-emerald-500 shadow-md shadow-emerald-950/50"
                    : "bg-neutral-950/50 border-neutral-800 text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800/50"
                }`}
              >
                <GitFork className="w-3.5 h-3.5" />
                <span>Recursion Tree</span>
              </button>

              <button
                type="button"
                onClick={() => setTempLayoutMode("dp")}
                className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-md border text-xs font-semibold transition-all cursor-pointer ${
                  tempLayoutMode === "dp"
                    ? "bg-emerald-600 text-white border-emerald-500 shadow-md shadow-emerald-950/50"
                    : "bg-neutral-950/50 border-neutral-800 text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800/50"
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>1D DP (Memo)</span>
              </button>
            </div>
          </div>
        </div>
      </ConfigModal>
    </div>
  );

  if (layoutMode === "tree") {
    return (
      <TreeVisualizerLayout
        title="Climbing Stairs (Recursion Tree)"
        theme="emerald"
        layout={treeFrames[0].layout!}
        frames={treeFrames}
        code={climbStairsTreeCode}
        currentIdx={currentIdx}
        setCurrentIdx={setCurrentIdx}
        isPlaying={isPlaying}
        setIsPlaying={setIsPlaying}
      >
        {modalSlot}
      </TreeVisualizerLayout>
    );
  }

  return (
    <ArrayVisualizerLayout
      title="Climbing Stairs (1D DP)"
      theme="emerald"
      frames={dpFrames}
      code={climbStairsDpCode}
      currentIdx={currentIdx}
      setCurrentIdx={setCurrentIdx}
      isPlaying={isPlaying}
      setIsPlaying={setIsPlaying}
    >
      {modalSlot}
    </ArrayVisualizerLayout>
  );
}
