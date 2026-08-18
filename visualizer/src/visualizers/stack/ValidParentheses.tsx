import { useMemo, useState } from "react";
import StackVisualizerLayout from "../../components/layout/StackVisualizerLayout";
import ConfigModal from "../../components/shared/ConfigModal";
import { useConfigModal } from "../../hooks/useConfigModal";
import { type TestCase } from "../../components/shared/TestCaseSwitcher";
import { generateFrames } from "../../core/stack/frames/validParenthesesFrames";
import { validParenthesesCode } from "../../core/stack/sourcecode/validParentheses";
import { Brackets } from "lucide-react";

interface ValidParenthesesData {
  s: string;
}

type ValidParenthesesTestCase = TestCase<ValidParenthesesData>;

const TEST_CASES: ValidParenthesesTestCase[] = [
  {
    id: "tc1",
    name: "Mixed Valid: ()[]{}",
    data: { s: "()[]{}" },
  },
  {
    id: "tc2",
    name: "Nested Valid: ([{}])",
    data: { s: "([{}])" },
  },
  {
    id: "tc3",
    name: "Mismatch Bracket: (]",
    data: { s: "(]" },
  },
  {
    id: "tc4",
    name: "Wrong Order: ([)]",
    data: { s: "([)]" },
  },
  {
    id: "tc5",
    name: "Unclosed Brackets: (((",
    data: { s: "(((" },
  },
  {
    id: "tc6",
    name: "Premature Close: ]",
    data: { s: "]" },
  },
  {
    id: "tc7",
    name: "Stress Test: Nested & Repeated",
    data: { s: "((((({{{{{[[[[[]]]]]}}}}})))))" },
  },
];

export default function ValidParentheses() {
  const [testCaseIdx, setTestCaseIdx] = useState(0);
  const [currentData, setCurrentData] = useState<ValidParenthesesData>(
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
    <StackVisualizerLayout
      title="Valid Parentheses"
      theme="emerald"
      frames={frames}
      code={validParenthesesCode}
      currentIdx={currentIdx}
      setCurrentIdx={setCurrentIdx}
      isPlaying={isPlaying}
      setIsPlaying={setIsPlaying}
    >
      <ConfigModal
        title="Configure Parentheses String"
        description="Select a preset scenario or provide custom opening and closing brackets (), {}, []."
        theme="emerald"
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
              <Brackets className="w-3 h-3 text-emerald-400" />
              Brackets String (s):
            </label>
            <input
              type="text"
              value={tempSInput}
              onChange={(e) => {
                setTempSInput(e.target.value);
                modal.setSelectedPresetIdx(null);
              }}
              placeholder="()[]{}"
              className="w-full bg-neutral-950/80 border border-neutral-700/80 rounded-md px-3 py-2 text-xs font-mono text-neutral-100 focus:outline-none focus:ring-1 focus:ring-emerald-500/60 focus:border-emerald-500 placeholder:text-neutral-600"
            />
          </div>
        </div>
      </ConfigModal>
    </StackVisualizerLayout>
  );
}
