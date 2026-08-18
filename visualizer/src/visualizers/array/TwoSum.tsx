import { useMemo, useState } from "react";
import ArrayVisualizerLayout from "../../components/layout/ArrayVisualizerLayout";
import ConfigModal from "../../components/shared/ConfigModal";
import { useConfigModal } from "../../hooks/useConfigModal";
import { type TestCase } from "../../components/shared/TestCaseSwitcher";
import { generateFrames } from "../../core/array/frames/twoSumFrames";
import { twoSumCode } from "../../core/array/sourcecode/twoSum";
import { Binary, Target } from "lucide-react";

interface TwoSumData {
  nums: number[];
  target: number;
}

type TwoSumTestCase = TestCase<TwoSumData>;

const TEST_CASES: TwoSumTestCase[] = [
  {
    id: "tc1",
    name: "Classic Example: [2, 7, 11, 15] (Target: 9)",
    data: { nums: [2, 7, 11, 15], target: 9 },
  },
  {
    id: "tc2",
    name: "Target at End: [3, 2, 4] (Target: 6)",
    data: { nums: [3, 2, 4], target: 6 },
  },
  {
    id: "tc3",
    name: "Duplicate Elements: [3, 3] (Target: 6)",
    data: { nums: [3, 3], target: 6 },
  },
  {
    id: "tc4",
    name: "Larger Array: [1, 5, 3, 7, 9] (Target: 12)",
    data: { nums: [1, 5, 3, 7, 9], target: 12 },
  },
];

export default function TwoSum() {
  const [testCaseIdx, setTestCaseIdx] = useState(0);
  const [currentData, setCurrentData] = useState<TwoSumData>(
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
          nums = parsed;
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

  return (
    <ArrayVisualizerLayout
      title="Two Sum"
      theme="violet"
      frames={frames}
      code={twoSumCode}
      currentIdx={currentIdx}
      setCurrentIdx={setCurrentIdx}
      isPlaying={isPlaying}
      setIsPlaying={setIsPlaying}
    >
      <ConfigModal
        title="Configure Two Sum Inputs"
        description="Select a preset scenario or provide custom array numbers and a target value."
        theme="violet"
        isOpen={modal.isOpen}
        onOpenChange={modal.setIsOpen}
        onOpen={handleOpenModal}
        presets={TEST_CASES.map((tc) => ({
          id: tc.id,
          name: tc.name,
          preview: `Nums: [${tc.data!.nums.join(",")}] · Target: ${tc.data!.target}`,
        }))}
        selectedPresetIdx={modal.selectedPresetIdx}
        onSelectPreset={handleSelectPreset}
        onApply={handleApplySettings}
      >
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2 space-y-1">
              <label className="text-[11px] font-mono text-neutral-400 flex items-center gap-1">
                <Binary className="w-3 h-3 text-violet-400" />
                Array Numbers (comma-separated):
              </label>
              <input
                type="text"
                value={tempNumsInput}
                onChange={(e) => {
                  setTempNumsInput(e.target.value);
                  modal.setSelectedPresetIdx(null);
                }}
                placeholder="[2, 7, 11, 15]"
                className="w-full bg-neutral-950/80 border border-neutral-700/80 rounded-md px-3 py-2 text-xs font-mono text-neutral-100 focus:outline-none focus:ring-1 focus:ring-violet-500/60 focus:border-violet-500 placeholder:text-neutral-600"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-mono text-neutral-400 flex items-center gap-1">
                <Target className="w-3 h-3 text-violet-400" />
                Target Value:
              </label>
              <input
                type="number"
                value={tempTargetInput}
                onChange={(e) => {
                  setTempTargetInput(e.target.value);
                  modal.setSelectedPresetIdx(null);
                }}
                placeholder="9"
                className="w-full bg-neutral-950/80 border border-neutral-700/80 rounded-md px-3 py-2 text-xs font-mono text-neutral-100 focus:outline-none focus:ring-1 focus:ring-violet-500/60 focus:border-violet-500 placeholder:text-neutral-600"
              />
            </div>
          </div>
        </div>
      </ConfigModal>
    </ArrayVisualizerLayout>
  );
}
