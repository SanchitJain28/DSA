import { useMemo, useState } from "react";
import ArrayVisualizerLayout from "../../components/layout/ArrayVisualizerLayout";
import ConfigModal from "../../components/shared/ConfigModal";
import { useConfigModal } from "../../hooks/useConfigModal";
import { type TestCase } from "../../components/shared/TestCaseSwitcher";
import { generateFrames } from "../../core/array/frames/groupAnagramsFrames";
import { groupAnagramsCode } from "../../core/array/sourcecode/groupAnagrams";
import { Type } from "lucide-react";

interface GroupAnagramsData {
  strs: string[];
}

type GroupAnagramsTestCase = TestCase<GroupAnagramsData>;

const TEST_CASES: GroupAnagramsTestCase[] = [
  {
    id: "tc1",
    name: 'Classic: ["eat", "tea", "tan", "ate", "nat", "bat"]',
    data: { strs: ["eat", "tea", "tan", "ate", "nat", "bat"] },
  },
  {
    id: "tc2",
    name: 'Single Empty String: [""]',
    data: { strs: [""] },
  },
  {
    id: "tc3",
    name: 'Single Character: ["a"]',
    data: { strs: ["a"] },
  },
  {
    id: "tc4",
    name: 'Permutations: ["ab", "ba", "abc", "cba", "bca", "cab"]',
    data: { strs: ["ab", "ba", "abc", "cba", "bca", "cab"] },
  },
];

export default function GroupAnagrams() {
  const [testCaseIdx, setTestCaseIdx] = useState(0);
  const [currentData, setCurrentData] = useState<GroupAnagramsData>(
    TEST_CASES[0].data!
  );
  const [currentIdx, setCurrentIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  // Buffer state for modal
  const [tempStrsInput, setTempStrsInput] = useState(
    `[${TEST_CASES[0].data!.strs.map((s) => `"${s}"`).join(", ")}]`
  );

  const modal = useConfigModal(0);

  const handleOpenModal = () => {
    modal.openModal(() => {
      setTempStrsInput(
        `[${currentData.strs.map((s) => `"${s}"`).join(", ")}]`
      );
      modal.setSelectedPresetIdx(testCaseIdx);
    });
  };

  const handleSelectPreset = (idx: number) => {
    modal.selectPreset(idx, () => {
      const tc = TEST_CASES[idx];
      if (tc?.data) {
        setTempStrsInput(
          `[${tc.data.strs.map((s) => `"${s}"`).join(", ")}]`
        );
      }
    });
  };

  const handleApplySettings = () => {
    modal.apply(() => {
      let strs = currentData.strs;
      if (tempStrsInput.trim()) {
        const cleaned = tempStrsInput
          .replace(/^\[/, "")
          .replace(/\]$/, "")
          .split(",")
          .map((s) => s.trim().replace(/^["']/, "").replace(/["']$/, ""))
          .filter((s) => s.length > 0 || tempStrsInput.includes('""') || tempStrsInput.includes("''"));
        if (cleaned.length > 0) {
          strs = cleaned;
        }
      }

      if (modal.selectedPresetIdx !== null) {
        setTestCaseIdx(modal.selectedPresetIdx);
      }

      setCurrentData({ strs });
      setCurrentIdx(0);
      setIsPlaying(false);
    });
  };

  const frames = useMemo(() => {
    return generateFrames(currentData.strs);
  }, [currentData]);

  return (
    <ArrayVisualizerLayout
      title="Group Anagrams"
      theme="violet"
      frames={frames}
      code={groupAnagramsCode}
      currentIdx={currentIdx}
      setCurrentIdx={setCurrentIdx}
      isPlaying={isPlaying}
      setIsPlaying={setIsPlaying}
    >
      <ConfigModal
        title="Configure Words List"
        description="Select a preset scenario or provide custom strings to group."
        theme="violet"
        isOpen={modal.isOpen}
        onOpenChange={modal.setIsOpen}
        onOpen={handleOpenModal}
        presets={TEST_CASES.map((tc) => ({
          id: tc.id,
          name: tc.name,
          preview: `Strs: [${tc.data!.strs.map((s) => `"${s}"`).join(",")}]`,
        }))}
        selectedPresetIdx={modal.selectedPresetIdx}
        onSelectPreset={handleSelectPreset}
        onApply={handleApplySettings}
      >
        <div className="space-y-4">
          <div className="space-y-1">
            <label className="text-[11px] font-mono text-neutral-400 flex items-center gap-1">
              <Type className="w-3 h-3 text-violet-400" />
              Words List (comma-separated):
            </label>
            <input
              type="text"
              value={tempStrsInput}
              onChange={(e) => {
                setTempStrsInput(e.target.value);
                modal.setSelectedPresetIdx(null);
              }}
              placeholder='["eat", "tea", "tan", "ate", "nat", "bat"]'
              className="w-full bg-neutral-950/80 border border-neutral-700/80 rounded-md px-3 py-2 text-xs font-mono text-neutral-100 focus:outline-none focus:ring-1 focus:ring-violet-500/60 focus:border-violet-500 placeholder:text-neutral-600"
            />
          </div>
        </div>
      </ConfigModal>
    </ArrayVisualizerLayout>
  );
}
