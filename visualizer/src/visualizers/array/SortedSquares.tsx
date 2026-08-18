import { useMemo, useState } from "react";
import ArrayVisualizerLayout from "../../components/layout/ArrayVisualizerLayout";
import ConfigModal from "../../components/shared/ConfigModal";
import { useConfigModal } from "../../hooks/useConfigModal";
import { type TestCase } from "../../components/shared/TestCaseSwitcher";
import { sortedSquaresCode } from "../../core/array/sourcecode/sortedSquares";
import { generateFrames } from "../../core/array/frames/sortedSquaresFrames";
import { Binary } from "lucide-react";

interface SortedSquaresData {
  nums: number[];
}

type SortedSquaresTestCase = TestCase<SortedSquaresData>;

const TEST_CASES: SortedSquaresTestCase[] = [
  {
    id: "tc1",
    name: "Classic Mix: [-4, -1, 0, 3, 10]",
    data: { nums: [-4, -1, 0, 3, 10] },
  },
  {
    id: "tc2",
    name: "Standard Mix: [-7, -3, 2, 3, 11]",
    data: { nums: [-7, -3, 2, 3, 11] },
  },
  {
    id: "tc3",
    name: "All Negative: [-5, -3, -2, -1]",
    data: { nums: [-5, -3, -2, -1] },
  },
  {
    id: "tc4",
    name: "All Positive: [1, 2, 3, 4]",
    data: { nums: [1, 2, 3, 4] },
  },
];

export default function SortedSquares() {
  const [testCaseIdx, setTestCaseIdx] = useState(0);
  const [currentData, setCurrentData] = useState<SortedSquaresData>(
    TEST_CASES[0].data!
  );
  const [currentIdx, setCurrentIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  // Buffer state for modal
  const [tempNumsInput, setTempNumsInput] = useState(
    `[${TEST_CASES[0].data!.nums.join(", ")}]`
  );

  const modal = useConfigModal(0);

  const handleOpenModal = () => {
    modal.openModal(() => {
      setTempNumsInput(`[${currentData.nums.join(", ")}]`);
      modal.setSelectedPresetIdx(testCaseIdx);
    });
  };

  const handleSelectPreset = (idx: number) => {
    modal.selectPreset(idx, () => {
      const tc = TEST_CASES[idx];
      if (tc?.data) {
        setTempNumsInput(`[${tc.data.nums.join(", ")}]`);
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

      if (modal.selectedPresetIdx !== null) {
        setTestCaseIdx(modal.selectedPresetIdx);
      }

      setCurrentData({ nums });
      setCurrentIdx(0);
      setIsPlaying(false);
    });
  };

  const frames = useMemo(() => {
    return generateFrames(currentData.nums);
  }, [currentData]);

  return (
    <ArrayVisualizerLayout
      title="Squares of a Sorted Array"
      theme="sky"
      frames={frames}
      code={sortedSquaresCode}
      currentIdx={currentIdx}
      setCurrentIdx={setCurrentIdx}
      isPlaying={isPlaying}
      setIsPlaying={setIsPlaying}
    >
      <ConfigModal
        title="Configure Sorted Array"
        description="Select a preset scenario or provide custom numbers in sorted order."
        theme="sky"
        isOpen={modal.isOpen}
        onOpenChange={modal.setIsOpen}
        onOpen={handleOpenModal}
        presets={TEST_CASES.map((tc) => ({
          id: tc.id,
          name: tc.name,
          preview: `Nums: [${tc.data!.nums.join(",")}]`,
        }))}
        selectedPresetIdx={modal.selectedPresetIdx}
        onSelectPreset={handleSelectPreset}
        onApply={handleApplySettings}
      >
        <div className="space-y-4">
          <div className="space-y-1">
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
              placeholder="[-4, -1, 0, 3, 10]"
              className="w-full bg-neutral-950/80 border border-neutral-700/80 rounded-md px-3 py-2 text-xs font-mono text-neutral-100 focus:outline-none focus:ring-1 focus:ring-sky-500/60 focus:border-sky-500 placeholder:text-neutral-600"
            />
          </div>
        </div>
      </ConfigModal>
    </ArrayVisualizerLayout>
  );
}
