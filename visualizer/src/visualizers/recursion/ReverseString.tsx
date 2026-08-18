import { useMemo, useState } from "react";
import ArrayVisualizerLayout from "../../components/layout/ArrayVisualizerLayout";
import ConfigModal from "../../components/shared/ConfigModal";
import { useConfigModal } from "../../hooks/useConfigModal";
import { type TestCase } from "../../components/shared/TestCaseSwitcher";
import { generateFrames } from "../../core/recursion/frames/reverseStringFrames";
import { reverseStringCode } from "../../core/recursion/sourcecode/reverseString";
import { Type } from "lucide-react";

interface ReverseStringData {
  s: string;
}

type ReverseStringTestCase = TestCase<ReverseStringData>;

const TEST_CASES: ReverseStringTestCase[] = [
  {
    id: "tc1",
    name: 'Classic: "hello"',
    data: { s: "hello" },
  },
  {
    id: "tc2",
    name: 'Palindrome: "Hannah"',
    data: { s: "Hannah" },
  },
  {
    id: "tc3",
    name: 'Longer Word: "recursion"',
    data: { s: "recursion" },
  },
  {
    id: "tc4",
    name: 'Two Characters: "AB"',
    data: { s: "AB" },
  },
  {
    id: "tc5",
    name: 'Single Character: "a"',
    data: { s: "a" },
  },
];

export default function ReverseString() {
  const [testCaseIdx, setTestCaseIdx] = useState(0);
  const [currentData, setCurrentData] = useState<ReverseStringData>(
    TEST_CASES[0].data!
  );
  const [currentIdx, setCurrentIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  // Buffer state for modal
  const [tempSInput, setTempSInput] = useState(TEST_CASES[0].data!.s);

  const modal = useConfigModal(0);

  const handleOpenModal = () => {
    modal.openModal(() => {
      setTempSInput(currentData.s);
      modal.setSelectedPresetIdx(testCaseIdx);
    });
  };

  const handleSelectPreset = (idx: number) => {
    modal.selectPreset(idx, () => {
      const tc = TEST_CASES[idx];
      if (tc?.data) {
        setTempSInput(tc.data.s);
      }
    });
  };

  const handleApplySettings = () => {
    modal.apply(() => {
      let s = currentData.s;
      if (tempSInput.trim()) {
        s = tempSInput.trim();
      }

      if (modal.selectedPresetIdx !== null) {
        setTestCaseIdx(modal.selectedPresetIdx);
      }

      setCurrentData({ s });
      setCurrentIdx(0);
      setIsPlaying(false);
    });
  };

  const frames = useMemo(() => {
    return generateFrames(currentData.s);
  }, [currentData]);

  return (
    <ArrayVisualizerLayout
      title="Reverse String"
      theme="indigo"
      frames={frames}
      code={reverseStringCode}
      currentIdx={currentIdx}
      setCurrentIdx={setCurrentIdx}
      isPlaying={isPlaying}
      setIsPlaying={setIsPlaying}
    >
      <ConfigModal
        title="Configure String to Reverse"
        description="Select a preset scenario or provide custom text to reverse recursively."
        theme="indigo"
        isOpen={modal.isOpen}
        onOpenChange={modal.setIsOpen}
        onOpen={handleOpenModal}
        presets={TEST_CASES.map((tc) => ({
          id: tc.id,
          name: tc.name,
          preview: `s = "${tc.data!.s}"`,
        }))}
        selectedPresetIdx={modal.selectedPresetIdx}
        onSelectPreset={handleSelectPreset}
        onApply={handleApplySettings}
      >
        <div className="space-y-4">
          <div className="space-y-1">
            <label className="text-[11px] font-mono text-neutral-400 flex items-center gap-1">
              <Type className="w-3 h-3 text-indigo-400" />
              Input String:
            </label>
            <input
              type="text"
              value={tempSInput}
              onChange={(e) => {
                setTempSInput(e.target.value);
                modal.setSelectedPresetIdx(null);
              }}
              placeholder="hello"
              className="w-full bg-neutral-950/80 border border-neutral-700/80 rounded-md px-3 py-2 text-xs font-mono text-neutral-100 focus:outline-none focus:ring-1 focus:ring-indigo-500/60 focus:border-indigo-500 placeholder:text-neutral-600"
            />
          </div>
        </div>
      </ConfigModal>
    </ArrayVisualizerLayout>
  );
}
