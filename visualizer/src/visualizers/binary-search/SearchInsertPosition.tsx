import { useMemo, useState } from "react";
import BinarySearchVisualizerLayout from "../../components/layout/BinarySearchVisualizerLayout";
import SearchRangeGraph from "../../components/binary-search/SearchRangeGraph";
import { ArrayRenderer } from "../../components/shared/ArrayRenderer";
import ConfigModal from "../../components/shared/ConfigModal";
import { useConfigModal } from "../../hooks/useConfigModal";
import { type TestCase } from "../../components/shared/TestCaseSwitcher";
import { generateFrames } from "../../core/binary-search/frames/searchInsertFrames";
import { searchInsertCode } from "../../core/binary-search/sourcecode/searchInsert";
import { themeColors } from "../../utils/theme";
import { Binary, Target } from "lucide-react";

interface SearchInsertData {
  nums: number[];
  target: number;
}

type SearchInsertTestCase = TestCase<SearchInsertData>;

const TEST_CASES: SearchInsertTestCase[] = [
  {
    id: "tc1",
    name: "Target Present in Middle (5)",
    data: { nums: [1, 3, 5, 6], target: 5 },
  },
  {
    id: "tc2",
    name: "Insert in Middle (2)",
    data: { nums: [1, 3, 5, 6], target: 2 },
  },
  {
    id: "tc3",
    name: "Insert at End (7)",
    data: { nums: [1, 3, 5, 6], target: 7 },
  },
  {
    id: "tc4",
    name: "Insert at Beginning (0)",
    data: { nums: [1, 3, 5, 6], target: 0 },
  },
  {
    id: "tc5",
    name: "Larger Array (Match 10)",
    data: { nums: [2, 4, 6, 8, 10, 12, 14, 16], target: 10 },
  },
  {
    id: "tc6",
    name: "Larger Array (Insert 9)",
    data: { nums: [2, 4, 6, 8, 10, 12, 14, 16], target: 9 },
  },
  {
    id: "tc7",
    name: "Single Element (Left 0)",
    data: { nums: [1], target: 0 },
  },
  {
    id: "tc8",
    name: "Single Element (Right 2)",
    data: { nums: [1], target: 2 },
  },
];

export default function SearchInsertPosition() {
  const [testCaseIdx, setTestCaseIdx] = useState(0);
  const [currentData, setCurrentData] = useState<SearchInsertData>(
    TEST_CASES[0].data!
  );
  const [currentIdx, setCurrentIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  // Buffer states for modal
  const [tempNumsInput, setTempNumsInput] = useState(
    `[${TEST_CASES[0].data!.nums.join(", ")}]`
  );
  const [tempTargetInput, setTempTargetInput] = useState(
    String(TEST_CASES[0].data!.target)
  );

  const modal = useConfigModal(0);

  const handleOpenModal = () => {
    modal.openModal(() => {
      setTempNumsInput(`[${currentData.nums.join(", ")}]`);
      setTempTargetInput(String(currentData.target));
      modal.setSelectedPresetIdx(testCaseIdx);
    });
  };

  const handleSelectPreset = (idx: number) => {
    modal.selectPreset(idx, () => {
      const tc = TEST_CASES[idx];
      if (tc?.data) {
        setTempNumsInput(`[${tc.data.nums.join(", ")}]`);
        setTempTargetInput(String(tc.data.target));
      }
    });
  };

  const handleApplySettings = () => {
    modal.apply(() => {
      let nums = currentData.nums;
      if (tempNumsInput.trim()) {
        const parsed = tempNumsInput
          .replace(/^\[/, "")
          .replace(/\]$/, "")
          .split(",")
          .map((x) => Number(x.trim()))
          .filter((x) => !isNaN(x));
        if (parsed.length > 0) {
          nums = parsed.sort((a, b) => a - b);
        }
      }

      let target = currentData.target;
      if (tempTargetInput.trim() !== "") {
        const parsedTarget = Number(tempTargetInput.trim());
        if (!isNaN(parsedTarget)) {
          target = parsedTarget;
        }
      }

      if (modal.selectedPresetIdx !== null) {
        setTestCaseIdx(modal.selectedPresetIdx);
      }

      setCurrentData({ nums, target });
      setCurrentIdx(0);
      setIsPlaying(false);
    });
  };

  const frames = useMemo(() => {
    return generateFrames(currentData.nums, currentData.target);
  }, [currentData]);

  const colors = themeColors.sky;

  return (
    <BinarySearchVisualizerLayout
      title="Search Insert Position"
      theme="sky"
      frames={frames}
      code={searchInsertCode}
      currentIdx={currentIdx}
      setCurrentIdx={setCurrentIdx}
      isPlaying={isPlaying}
      setIsPlaying={setIsPlaying}
      renderCanvasContent={(frame) => {
        const leftVal =
          typeof frame.variables?.left === "number"
            ? frame.variables.left
            : undefined;
        const rightVal =
          typeof frame.variables?.right === "number"
            ? frame.variables.right
            : undefined;
        const midVal =
          typeof frame.variables?.mid === "number"
            ? frame.variables.mid
            : undefined;
        const isMatch = frame.phase.toLowerCase().includes("match");

        return (
          <div className="w-full flex flex-col items-center justify-center p-4 gap-6">
            {/* 1. Simple Range Graph */}
            <SearchRangeGraph
              min={0}
              max={currentData.nums.length - 1}
              left={leftVal}
              right={rightVal}
              mid={midVal}
              isMatch={isMatch}
              theme="sky"
            />

            {/* 2. Sorted Array Rendering */}
            <div className="w-full flex flex-col items-center justify-center py-2">
              {frame.arrays?.map((arr: any) => (
                <ArrayRenderer
                  key={arr.id}
                  arr={arr}
                  frame={frame}
                  colors={colors}
                />
              ))}
            </div>
          </div>
        );
      }}
    >
      <ConfigModal
        title="Configure Test Cases & Target"
        description="Select a preset scenario or modify array and target inputs."
        theme="sky"
        isOpen={modal.isOpen}
        onOpenChange={modal.setIsOpen}
        onOpen={handleOpenModal}
        presets={TEST_CASES.map((tc) => ({
          id: tc.id,
          name: tc.name,
          preview: `Array: [${tc.data!.nums.join(",")}] · Target: ${tc.data!.target}`,
        }))}
        selectedPresetIdx={modal.selectedPresetIdx}
        onSelectPreset={handleSelectPreset}
        onApply={handleApplySettings}
      >
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2 space-y-1">
              <label className="text-[11px] font-mono text-neutral-400 flex items-center gap-1">
                <Binary className="w-3 h-3 text-sky-400" />
                Sorted Array (comma-separated):
              </label>
              <input
                type="text"
                value={tempNumsInput}
                onChange={(e) => {
                  setTempNumsInput(e.target.value);
                  modal.setSelectedPresetIdx(null);
                }}
                placeholder="[1, 3, 5, 6]"
                className="w-full bg-neutral-950/80 border border-neutral-700/80 rounded-md px-3 py-2 text-xs font-mono text-neutral-100 focus:outline-none focus:ring-1 focus:ring-sky-500/60 focus:border-sky-500 placeholder:text-neutral-600"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-mono text-neutral-400 flex items-center gap-1">
                <Target className="w-3 h-3 text-sky-400" />
                Target Value:
              </label>
              <input
                type="number"
                value={tempTargetInput}
                onChange={(e) => {
                  setTempTargetInput(e.target.value);
                  modal.setSelectedPresetIdx(null);
                }}
                placeholder="5"
                className="w-full bg-neutral-950/80 border border-neutral-700/80 rounded-md px-3 py-2 text-xs font-mono text-neutral-100 focus:outline-none focus:ring-1 focus:ring-sky-500/60 focus:border-sky-500 placeholder:text-neutral-600"
              />
            </div>
          </div>
        </div>
      </ConfigModal>
    </BinarySearchVisualizerLayout>
  );
}
