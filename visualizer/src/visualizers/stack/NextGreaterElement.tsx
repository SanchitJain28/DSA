import { useMemo, useState } from "react";
import StackVisualizerLayout from "../../components/layout/StackVisualizerLayout";
import ConfigModal from "../../components/shared/ConfigModal";
import { useConfigModal } from "../../hooks/useConfigModal";
import { type TestCase } from "../../components/shared/TestCaseSwitcher";
import { generateFrames } from "../../core/stack/frames/nextGreaterElementFrames";
import { nextGreaterElementCode } from "../../core/stack/sourcecode/nextGreaterElement";
import { Binary } from "lucide-react";

interface NGEData {
  nums1: number[];
  nums2: number[];
}

type NGETestCase = TestCase<NGEData>;

const TEST_CASES: NGETestCase[] = [
  {
    id: "tc1",
    name: "Classic: nums1=[4, 1, 2], nums2=[1, 3, 4, 2]",
    data: { nums1: [4, 1, 2], nums2: [1, 3, 4, 2] },
  },
  {
    id: "tc2",
    name: "Decreasing: nums1=[2, 4], nums2=[1, 2, 3, 4]",
    data: { nums1: [2, 4], nums2: [1, 2, 3, 4] },
  },
  {
    id: "tc3",
    name: "No Greater: nums1=[4, 3, 2], nums2=[4, 3, 2, 1]",
    data: { nums1: [4, 3, 2], nums2: [4, 3, 2, 1] },
  },
  {
    id: "tc4",
    name: "Single Element: nums1=[1], nums2=[1]",
    data: { nums1: [1], nums2: [1] },
  },
];

export default function NextGreaterElement() {
  const [testCaseIdx, setTestCaseIdx] = useState(0);
  const [currentData, setCurrentData] = useState<NGEData>(
    TEST_CASES[0].data!
  );
  const [currentIdx, setCurrentIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  // Buffer states for modal
  const [tempNums1Input, setTempNums1Input] = useState(
    `[${TEST_CASES[0].data!.nums1.join(", ")}]`
  );
  const [tempNums2Input, setTempNums2Input] = useState(
    `[${TEST_CASES[0].data!.nums2.join(", ")}]`
  );

  const modal = useConfigModal(0);

  const handleOpenModal = () => {
    modal.openModal(() => {
      setTempNums1Input(`[${currentData.nums1.join(", ")}]`);
      setTempNums2Input(`[${currentData.nums2.join(", ")}]`);
      modal.setSelectedPresetIdx(testCaseIdx);
    });
  };

  const handleSelectPreset = (idx: number) => {
    modal.selectPreset(idx, () => {
      const tc = TEST_CASES[idx];
      if (tc?.data) {
        setTempNums1Input(`[${tc.data.nums1.join(", ")}]`);
        setTempNums2Input(`[${tc.data.nums2.join(", ")}]`);
      }
    });
  };

  const handleApplySettings = () => {
    modal.apply(() => {
      let nums1 = currentData.nums1;
      let nums2 = currentData.nums2;

      if (tempNums1Input.trim()) {
        const parsed1 = tempNums1Input
          .replace(/^\[/, "")
          .replace(/\]$/, "")
          .split(",")
          .map((x) => Number(x.trim()))
          .filter((x) => !isNaN(x));
        if (parsed1.length > 0) nums1 = parsed1;
      }

      if (tempNums2Input.trim()) {
        const parsed2 = tempNums2Input
          .replace(/^\[/, "")
          .replace(/\]$/, "")
          .split(",")
          .map((x) => Number(x.trim()))
          .filter((x) => !isNaN(x));
        if (parsed2.length > 0) nums2 = parsed2;
      }

      if (modal.selectedPresetIdx !== null) {
        setTestCaseIdx(modal.selectedPresetIdx);
      }

      setCurrentData({ nums1, nums2 });
      setCurrentIdx(0);
      setIsPlaying(false);
    });
  };

  const frames = useMemo(() => {
    return generateFrames(currentData.nums1, currentData.nums2);
  }, [currentData]);

  return (
    <StackVisualizerLayout
      title="Next Greater Element I"
      theme="orange"
      frames={frames}
      code={nextGreaterElementCode}
      currentIdx={currentIdx}
      setCurrentIdx={setCurrentIdx}
      isPlaying={isPlaying}
      setIsPlaying={setIsPlaying}
    >
      <ConfigModal
        title="Configure Next Greater Element Arrays"
        description="Select a preset scenario or provide custom nums1 subset and nums2 search array."
        theme="orange"
        isOpen={modal.isOpen}
        onOpenChange={modal.setIsOpen}
        onOpen={handleOpenModal}
        presets={TEST_CASES.map((tc) => ({
          id: tc.id,
          name: tc.name,
          preview: `nums1: [${tc.data!.nums1.join(",")}], nums2: [${tc.data!.nums2.join(",")}]`,
        }))}
        selectedPresetIdx={modal.selectedPresetIdx}
        onSelectPreset={handleSelectPreset}
        onApply={handleApplySettings}
      >
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-[11px] font-mono text-neutral-400 flex items-center gap-1">
                <Binary className="w-3 h-3 text-orange-400" />
                Query Array (nums1):
              </label>
              <input
                type="text"
                value={tempNums1Input}
                onChange={(e) => {
                  setTempNums1Input(e.target.value);
                  modal.setSelectedPresetIdx(null);
                }}
                placeholder="[4, 1, 2]"
                className="w-full bg-neutral-950/80 border border-neutral-700/80 rounded-md px-3 py-2 text-xs font-mono text-neutral-100 focus:outline-none focus:ring-1 focus:ring-orange-500/60 focus:border-orange-500 placeholder:text-neutral-600"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-mono text-neutral-400 flex items-center gap-1">
                <Binary className="w-3 h-3 text-orange-400" />
                Search Array (nums2):
              </label>
              <input
                type="text"
                value={tempNums2Input}
                onChange={(e) => {
                  setTempNums2Input(e.target.value);
                  modal.setSelectedPresetIdx(null);
                }}
                placeholder="[1, 3, 4, 2]"
                className="w-full bg-neutral-950/80 border border-neutral-700/80 rounded-md px-3 py-2 text-xs font-mono text-neutral-100 focus:outline-none focus:ring-1 focus:ring-orange-500/60 focus:border-orange-500 placeholder:text-neutral-600"
              />
            </div>
          </div>
        </div>
      </ConfigModal>
    </StackVisualizerLayout>
  );
}
