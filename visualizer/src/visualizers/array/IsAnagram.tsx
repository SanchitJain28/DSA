import { useMemo, useState } from "react";
import ArrayVisualizerLayout from "../../components/layout/ArrayVisualizerLayout";
import ConfigModal from "../../components/shared/ConfigModal";
import { useConfigModal } from "../../hooks/useConfigModal";
import { type TestCase } from "../../components/shared/TestCaseSwitcher";
import { generateFrames } from "../../core/array/frames/isAnagramFrames";
import { isAnagramCode } from "../../core/array/sourcecode/isAnagram";
import { Type } from "lucide-react";

interface AnagramData {
  s: string;
  t: string;
}

type AnagramTestCase = TestCase<AnagramData>;

const TEST_CASES: AnagramTestCase[] = [
  {
    id: "tc1",
    name: "Classic: anagram vs nagaram (Valid)",
    data: { s: "anagram", t: "nagaram" },
  },
  {
    id: "tc2",
    name: "Mismatch: rat vs car (Invalid)",
    data: { s: "rat", t: "car" },
  },
  {
    id: "tc3",
    name: "Classic: listen vs silent (Valid)",
    data: { s: "listen", t: "silent" },
  },
  {
    id: "tc4",
    name: "Different Lengths: a vs ab (Invalid)",
    data: { s: "a", t: "ab" },
  },
];

export default function IsAnagram() {
  const [testCaseIdx, setTestCaseIdx] = useState(0);
  const [currentData, setCurrentData] = useState<AnagramData>(
    TEST_CASES[0].data!
  );
  const [currentIdx, setCurrentIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  // Buffer states for modal
  const [tempSInput, setTempSInput] = useState(TEST_CASES[0].data!.s);
  const [tempTInput, setTempTInput] = useState(TEST_CASES[0].data!.t);

  const modal = useConfigModal(0);

  const handleOpenModal = () => {
    modal.openModal(() => {
      setTempSInput(currentData.s);
      setTempTInput(currentData.t);
      modal.setSelectedPresetIdx(testCaseIdx);
    });
  };

  const handleSelectPreset = (idx: number) => {
    modal.selectPreset(idx, () => {
      const tc = TEST_CASES[idx];
      if (tc?.data) {
        setTempSInput(tc.data.s);
        setTempTInput(tc.data.t);
      }
    });
  };

  const handleApplySettings = () => {
    modal.apply(() => {
      let s = currentData.s;
      let t = currentData.t;
      if (tempSInput.trim()) {
        s = tempSInput.trim().toLowerCase();
      }
      if (tempTInput.trim()) {
        t = tempTInput.trim().toLowerCase();
      }

      if (modal.selectedPresetIdx !== null) {
        setTestCaseIdx(modal.selectedPresetIdx);
      }

      setCurrentData({ s, t });
      setCurrentIdx(0);
      setIsPlaying(false);
    });
  };

  const frames = useMemo(() => {
    return generateFrames(currentData.s, currentData.t);
  }, [currentData]);

  return (
    <ArrayVisualizerLayout
      title="Valid Anagram"
      theme="sky"
      frames={frames}
      code={isAnagramCode}
      currentIdx={currentIdx}
      setCurrentIdx={setCurrentIdx}
      isPlaying={isPlaying}
      setIsPlaying={setIsPlaying}
    >
      <ConfigModal
        title="Configure Anagram Strings"
        description="Select a preset scenario or provide custom strings s and t."
        theme="sky"
        isOpen={modal.isOpen}
        onOpenChange={modal.setIsOpen}
        onOpen={handleOpenModal}
        presets={TEST_CASES.map((tc) => ({
          id: tc.id,
          name: tc.name,
          preview: `s = "${tc.data!.s}", t = "${tc.data!.t}"`,
        }))}
        selectedPresetIdx={modal.selectedPresetIdx}
        onSelectPreset={handleSelectPreset}
        onApply={handleApplySettings}
      >
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-[11px] font-mono text-neutral-400 flex items-center gap-1">
                <Type className="w-3 h-3 text-sky-400" />
                String (s):
              </label>
              <input
                type="text"
                value={tempSInput}
                onChange={(e) => {
                  setTempSInput(e.target.value);
                  modal.setSelectedPresetIdx(null);
                }}
                placeholder="anagram"
                className="w-full bg-neutral-950/80 border border-neutral-700/80 rounded-md px-3 py-2 text-xs font-mono text-neutral-100 focus:outline-none focus:ring-1 focus:ring-sky-500/60 focus:border-sky-500 placeholder:text-neutral-600 lowercase"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-mono text-neutral-400 flex items-center gap-1">
                <Type className="w-3 h-3 text-sky-400" />
                String (t):
              </label>
              <input
                type="text"
                value={tempTInput}
                onChange={(e) => {
                  setTempTInput(e.target.value);
                  modal.setSelectedPresetIdx(null);
                }}
                placeholder="nagaram"
                className="w-full bg-neutral-950/80 border border-neutral-700/80 rounded-md px-3 py-2 text-xs font-mono text-neutral-100 focus:outline-none focus:ring-1 focus:ring-sky-500/60 focus:border-sky-500 placeholder:text-neutral-600 lowercase"
              />
            </div>
          </div>
        </div>
      </ConfigModal>
    </ArrayVisualizerLayout>
  );
}
