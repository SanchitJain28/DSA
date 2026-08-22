import { useMemo, useState } from "react";
import HeapVisualizerLayout from "../../components/layout/HeapVisualizerLayout";
import { HeapTreeRenderer } from "../../components/heap/HeapTreeRenderer";
import { ArrayRenderer } from "../../components/shared/ArrayRenderer";
import ConfigModal from "../../components/shared/ConfigModal";
import { useConfigModal } from "../../hooks/useConfigModal";
import { type TestCase } from "../../components/shared/TestCaseSwitcher";
import {
  generateFrames,
  type HeapAction,
} from "../../core/heap/frames/minHeapFrames";
import { type HeapFrame } from "../../core/heap/types";
import { minHeapCode } from "../../core/heap/sourcecode/minHeap";
import { themeColors } from "../../utils/theme";
import { Binary, GitCommit, Layers } from "lucide-react";

interface HeapScenarioData {
  actions: HeapAction[];
  rawText: string;
}

type HeapTestCase = TestCase<HeapScenarioData>;

const TEST_CASES: HeapTestCase[] = [
  {
    id: "tc1",
    name: "Insertions & Heapify Up: [5, 3, 17, 10, 84, 19, 6, 22, 9]",
    data: {
      actions: [
        { type: "add", value: 5 },
        { type: "add", value: 3 },
        { type: "add", value: 17 },
        { type: "add", value: 10 },
        { type: "add", value: 84 },
        { type: "add", value: 19 },
        { type: "add", value: 6 },
        { type: "add", value: 22 },
        { type: "add", value: 9 },
      ],
      rawText: "add:5, add:3, add:17, add:10, add:84, add:19, add:6, add:22, add:9",
    },
  },
  {
    id: "tc2",
    name: "Poll & Heapify Down: [4, 10, 3, 5, 1] then 2x poll()",
    data: {
      actions: [
        { type: "add", value: 4 },
        { type: "add", value: 10 },
        { type: "add", value: 3 },
        { type: "add", value: 5 },
        { type: "add", value: 1 },
        { type: "poll" },
        { type: "poll" },
      ],
      rawText: "add:4, add:10, add:3, add:5, add:1, poll, poll",
    },
  },
  {
    id: "tc3",
    name: "Reverse Sorted Stream: [90, 80, 70, 60, 50, 40, 30]",
    data: {
      actions: [
        { type: "add", value: 90 },
        { type: "add", value: 80 },
        { type: "add", value: 70 },
        { type: "add", value: 60 },
        { type: "add", value: 50 },
        { type: "add", value: 40 },
        { type: "add", value: 30 },
      ],
      rawText: "add:90, add:80, add:70, add:60, add:50, add:40, add:30",
    },
  },
  {
    id: "tc4",
    name: "Priority Queue Mix: [25, 15, 35, 5] -> poll() -> add(2) -> poll()",
    data: {
      actions: [
        { type: "add", value: 25 },
        { type: "add", value: 15 },
        { type: "add", value: 35 },
        { type: "add", value: 5 },
        { type: "poll" },
        { type: "add", value: 2 },
        { type: "poll" },
      ],
      rawText: "add:25, add:15, add:35, add:5, poll, add:2, poll",
    },
  },
  {
    id: "tc5",
    name: "Small 3-Node Heap: [10, 20, 5] -> poll()",
    data: {
      actions: [
        { type: "add", value: 10 },
        { type: "add", value: 20 },
        { type: "add", value: 5 },
        { type: "poll" },
      ],
      rawText: "add:10, add:20, add:5, poll",
    },
  },
  {
    id: "tc6",
    name: "Single Element: add(42) -> poll()",
    data: {
      actions: [
        { type: "add", value: 42 },
        { type: "poll" },
      ],
      rawText: "add:42, poll",
    },
  },
];

function parseActions(raw: string): HeapAction[] {
  const parts = raw.split(",").map((p) => p.trim());
  const actions: HeapAction[] = [];

  for (const part of parts) {
    if (part.toLowerCase().startsWith("add:") || part.toLowerCase().startsWith("add(")) {
      const numStr = part.replace(/^add[:(]/i, "").replace(/\)$/, "");
      const val = Number(numStr.trim());
      if (!isNaN(val)) actions.push({ type: "add", value: val });
    } else if (part.toLowerCase().startsWith("poll") || part.toLowerCase().startsWith("pop")) {
      actions.push({ type: "poll" });
    } else if (!isNaN(Number(part)) && part !== "") {
      // Default plain number to add
      actions.push({ type: "add", value: Number(part) });
    }
  }

  return actions;
}

export default function MinHeapVisualizer() {
  const [testCaseIdx, setTestCaseIdx] = useState(0);
  const [currentData, setCurrentData] = useState<HeapScenarioData>(
    TEST_CASES[0].data!
  );

  const [currentIdx, setCurrentIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  // Buffer state for custom inputs in modal
  const [tempActionsInput, setTempActionsInput] = useState(
    TEST_CASES[0].data!.rawText
  );

  const modal = useConfigModal(0);
  const colors = themeColors.emerald;

  const handleOpenModal = () => {
    modal.openModal(() => {
      setTempActionsInput(currentData.rawText);
      modal.setSelectedPresetIdx(testCaseIdx);
    });
  };

  const handleSelectPreset = (idx: number) => {
    modal.selectPreset(idx, () => {
      const tc = TEST_CASES[idx];
      if (tc?.data) {
        setTempActionsInput(tc.data.rawText);
      }
    });
  };

  const handleApplySettings = () => {
    modal.apply(() => {
      let actions = currentData.actions;

      if (tempActionsInput.trim()) {
        const parsed = parseActions(tempActionsInput);
        if (parsed.length > 0) {
          actions = parsed;
        }
      }

      if (modal.selectedPresetIdx !== null) {
        setTestCaseIdx(modal.selectedPresetIdx);
      }

      setCurrentData({
        actions,
        rawText: tempActionsInput,
      });
      setCurrentIdx(0);
      setIsPlaying(false);
    });
  };

  const frames = useMemo(() => {
    return generateFrames(currentData.actions);
  }, [currentData.actions]);

  return (
    <HeapVisualizerLayout
      title="Min Heap (Heapify Up & Down)"
      theme="emerald"
      frames={frames}
      code={minHeapCode}
      currentIdx={currentIdx}
      setCurrentIdx={setCurrentIdx}
      isPlaying={isPlaying}
      setIsPlaying={setIsPlaying}
      renderCanvasContent={(frame: HeapFrame) => {
        return (
          <div className="flex flex-col items-center gap-6 select-none w-fit pb-6">
            {/* 1. Complete Binary Tree Representation */}
            <div className="bg-transparent border border-neutral-800/80 rounded-md p-4 flex flex-col items-center gap-3 w-fit min-w-[560px] shadow-sm">
              <div className="flex items-center justify-between w-full border-b border-neutral-800/60 pb-2">
                <div className="flex items-center gap-2">
                  <GitCommit className="w-4 h-4 text-emerald-400" />
                  <span className="text-xs font-mono font-bold uppercase tracking-wider text-neutral-300">
                    Complete Binary Tree Structure
                  </span>
                </div>
                <div className="text-[11px] font-mono text-neutral-400">
                  Total Nodes: <strong className="text-emerald-300">{frame.heap.length}</strong>
                </div>
              </div>

              {/* Tree Canvas */}
              <div className="w-full flex items-center justify-center pt-2">
                <HeapTreeRenderer layout={frame.layout} frame={frame} />
              </div>
            </div>

            {/* 2. Underlying Array Representation */}
            <div className="bg-transparent border border-neutral-800/80 rounded-md p-4 flex flex-col items-center gap-3 w-fit min-w-[560px] shadow-sm">
              <div className="flex items-center gap-2 self-start border-b border-neutral-800/60 pb-2 w-full">
                <Binary className="w-4 h-4 text-emerald-400" />
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-neutral-300">
                  Underlying Array (Sequential Level-Order)
                </span>
              </div>

              <div className="w-full flex flex-col items-center justify-center pt-2">
                {frame.arrays?.map((arr) => (
                  <ArrayRenderer
                    key={arr.id}
                    arr={arr}
                    frame={frame}
                    colors={colors}
                  />
                ))}
              </div>
            </div>
          </div>
        );
      }}
    >
      <ConfigModal
        title="Configure Min Heap Operations"
        description="Select a preset scenario or supply a comma-separated sequence of operations (e.g. add:5, add:3, poll)."
        theme="emerald"
        isOpen={modal.isOpen}
        onOpenChange={modal.setIsOpen}
        onOpen={handleOpenModal}
        presets={TEST_CASES.map((tc) => ({
          id: tc.id,
          name: tc.name,
          preview: tc.data!.rawText,
        }))}
        selectedPresetIdx={modal.selectedPresetIdx}
        onSelectPreset={handleSelectPreset}
        onApply={handleApplySettings}
      >
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-emerald-400" />
              <label className="text-xs font-mono font-semibold text-neutral-300">
                Operations Sequence (comma-separated)
              </label>
            </div>
            <textarea
              rows={3}
              value={tempActionsInput}
              onChange={(e) => setTempActionsInput(e.target.value)}
              placeholder="add:5, add:3, add:17, add:10, poll, poll"
              className="w-full bg-neutral-950/80 border border-neutral-800 rounded-md px-3 py-2 text-xs font-mono text-neutral-200 focus:outline-none focus:border-emerald-500/80"
            />
            <p className="text-[11px] font-mono text-neutral-500">
              Format: <code>add:&lt;value&gt;</code> to insert and heapify up, <code>poll</code> to extract root and heapify down.
            </p>
          </div>
        </div>
      </ConfigModal>
    </HeapVisualizerLayout>
  );
}
