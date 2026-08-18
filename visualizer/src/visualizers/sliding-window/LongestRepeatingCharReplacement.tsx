import { useMemo, useState } from "react";
import SlidingWindowVisualizerLayout from "../../components/layout/SlidingWindowVisualizerLayout";
import ConfigModal from "../../components/shared/ConfigModal";
import { useConfigModal } from "../../hooks/useConfigModal";
import { type TestCase } from "../../components/shared/TestCaseSwitcher";
import { longestRepeatingCharReplacementCode } from "../../core/sliding-window/sourcecode/longestRepeatingCharReplacement";
import { generateFrames } from "../../core/sliding-window/frames/longestRepeatingCharReplacementFrames";
import { Type, Hash } from "lucide-react";

interface LRCRData {
  s: string;
  k: number;
}

type LRCRTestCase = TestCase<LRCRData>;

const TEST_CASES: LRCRTestCase[] = [
  {
    id: "tc1",
    name: "Classic Alternating: ABAB (k = 2)",
    data: { s: "ABAB", k: 2 },
  },
  {
    id: "tc2",
    name: "Standard Mix: AABABBA (k = 1)",
    data: { s: "AABABBA", k: 1 },
  },
  {
    id: "tc3",
    name: "Consecutive Repeats: ABBB (k = 2)",
    data: { s: "ABBB", k: 2 },
  },
  {
    id: "tc4",
    name: "All Identical: AAAA (k = 2)",
    data: { s: "AAAA", k: 2 },
  },
  {
    id: "tc5",
    name: "All Distinct: ABCDE (k = 1)",
    data: { s: "ABCDE", k: 1 },
  },
  {
    id: "tc6",
    name: "Enclosed Block: BAAAB (k = 2)",
    data: { s: "BAAAB", k: 2 },
  },
];

export default function LongestRepeatingCharReplacement() {
  const [testCaseIdx, setTestCaseIdx] = useState(0);
  const [currentData, setCurrentData] = useState<LRCRData>(
    TEST_CASES[0].data!
  );
  const [currentIdx, setCurrentIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  // Buffer states for modal
  const [tempSInput, setTempSInput] = useState(TEST_CASES[0].data!.s);
  const [tempKInput, setTempKInput] = useState(
    String(TEST_CASES[0].data!.k)
  );

  const modal = useConfigModal(0);

  const handleOpenModal = () => {
    modal.openModal(() => {
      setTempSInput(currentData.s);
      setTempKInput(String(currentData.k));
      modal.setSelectedPresetIdx(testCaseIdx);
    });
  };

  const handleSelectPreset = (idx: number) => {
    modal.selectPreset(idx, () => {
      const tc = TEST_CASES[idx];
      if (tc?.data) {
        setTempSInput(tc.data.s);
        setTempKInput(String(tc.data.k));
      }
    });
  };

  const handleApplySettings = () => {
    modal.apply(() => {
      let s = currentData.s;
      if (tempSInput.trim()) {
        s = tempSInput.trim().toUpperCase();
      }

      let k = currentData.k;
      if (tempKInput.trim() !== "") {
        const parsedK = Number(tempKInput.trim());
        if (!isNaN(parsedK) && parsedK >= 0) {
          k = parsedK;
        }
      }

      if (modal.selectedPresetIdx !== null) {
        setTestCaseIdx(modal.selectedPresetIdx);
      }

      setCurrentData({ s, k });
      setCurrentIdx(0);
      setIsPlaying(false);
    });
  };

  const frames = useMemo(() => {
    return generateFrames(currentData.s, currentData.k);
  }, [currentData]);

  return (
    <SlidingWindowVisualizerLayout
      title="Longest Repeating Character Replacement"
      theme="indigo"
      frames={frames}
      code={longestRepeatingCharReplacementCode}
      currentIdx={currentIdx}
      setCurrentIdx={setCurrentIdx}
      isPlaying={isPlaying}
      setIsPlaying={setIsPlaying}
    >
      <ConfigModal
        title="Configure String & Replacements"
        description="Select a preset scenario or provide a custom uppercase string and k value."
        theme="indigo"
        isOpen={modal.isOpen}
        onOpenChange={modal.setIsOpen}
        onOpen={handleOpenModal}
        presets={TEST_CASES.map((tc) => ({
          id: tc.id,
          name: tc.name,
          preview: `s = "${tc.data!.s}", k = ${tc.data!.k}`,
        }))}
        selectedPresetIdx={modal.selectedPresetIdx}
        onSelectPreset={handleSelectPreset}
        onApply={handleApplySettings}
      >
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2 space-y-1">
              <label className="text-[11px] font-mono text-neutral-400 flex items-center gap-1">
                <Type className="w-3 h-3 text-indigo-400" />
                String (s):
              </label>
              <input
                type="text"
                value={tempSInput}
                onChange={(e) => {
                  setTempSInput(e.target.value);
                  modal.setSelectedPresetIdx(null);
                }}
                placeholder="AABABBA"
                className="w-full bg-neutral-950/80 border border-neutral-700/80 rounded-md px-3 py-2 text-xs font-mono text-neutral-100 focus:outline-none focus:ring-1 focus:ring-indigo-500/60 focus:border-indigo-500 placeholder:text-neutral-600 uppercase"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-mono text-neutral-400 flex items-center gap-1">
                <Hash className="w-3 h-3 text-indigo-400" />
                Max Replacements (k):
              </label>
              <input
                type="number"
                value={tempKInput}
                onChange={(e) => {
                  setTempKInput(e.target.value);
                  modal.setSelectedPresetIdx(null);
                }}
                placeholder="1"
                min="0"
                className="w-full bg-neutral-950/80 border border-neutral-700/80 rounded-md px-3 py-2 text-xs font-mono text-neutral-100 focus:outline-none focus:ring-1 focus:ring-indigo-500/60 focus:border-indigo-500 placeholder:text-neutral-600"
              />
            </div>
          </div>
        </div>
      </ConfigModal>
    </SlidingWindowVisualizerLayout>
  );
}
