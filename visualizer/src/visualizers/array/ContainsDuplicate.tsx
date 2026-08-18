import { useMemo, useState } from "react";
import ArrayVisualizerLayout from "../../components/layout/ArrayVisualizerLayout";
import ConfigModal from "../../components/shared/ConfigModal";
import { useConfigModal } from "../../hooks/useConfigModal";
import { type TestCase } from "../../components/shared/TestCaseSwitcher";
import { generateFrames } from "../../core/array/frames/containsDuplicateFrames";
import { containsDuplicateCode } from "../../core/array/sourcecode/containsDuplicate";
import { Binary } from "lucide-react";

interface ContainsDuplicateData {
  nums: number[];
}

type ContainsDuplicateTestCase = TestCase<ContainsDuplicateData>;

const TEST_CASES: ContainsDuplicateTestCase[] = [
  {
    id: "tc1",
    name: "Duplicate at Ends: [1, 2, 3, 1]",
    data: { nums: [1, 2, 3, 1] },
  },
  {
    id: "tc2",
    name: "All Unique: [1, 2, 3, 4]",
    data: { nums: [1, 2, 3, 4] },
  },
  {
    id: "tc3",
    name: "Multiple Duplicates: [1, 1, 1, 3, 3, 4, 2]",
    data: { nums: [1, 1, 1, 3, 3, 4, 2] },
  },
  {
    id: "tc4",
    name: "Larger Unique Array: [10, 20, 30, 40, 50]",
    data: { nums: [10, 20, 30, 40, 50] },
  },
];

export default function ContainsDuplicate() {
  const [testCaseIdx, setTestCaseIdx] = useState(0);
  const [currentData, setCurrentData] = useState<ContainsDuplicateData>(
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
          nums = parsed;
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
      title="Contains Duplicate"
      theme="indigo"
      frames={frames}
      code={containsDuplicateCode}
      currentIdx={currentIdx}
      setCurrentIdx={setCurrentIdx}
      isPlaying={isPlaying}
      setIsPlaying={setIsPlaying}
    >
      <ConfigModal
        title="Configure Array Numbers"
        description="Select a preset scenario or provide custom array numbers."
        theme="indigo"
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
              <Binary className="w-3 h-3 text-indigo-400" />
              Array Numbers (comma-separated):
            </label>
            <input
              type="text"
              value={tempNumsInput}
              onChange={(e) => {
                setTempNumsInput(e.target.value);
                modal.setSelectedPresetIdx(null);
              }}
              placeholder="[1, 2, 3, 1]"
              className="w-full bg-neutral-950/80 border border-neutral-700/80 rounded-md px-3 py-2 text-xs font-mono text-neutral-100 focus:outline-none focus:ring-1 focus:ring-indigo-500/60 focus:border-indigo-500 placeholder:text-neutral-600"
            />
          </div>
        </div>
      </ConfigModal>
    </ArrayVisualizerLayout>
  );
}
