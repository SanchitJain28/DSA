import { useMemo, useState } from "react";
import LinkedListVisualizerLayout from "../../components/layout/LinkedListVisualizerLayout";
import ConfigModal from "../../components/shared/ConfigModal";
import { useConfigModal } from "../../hooks/useConfigModal";
import { removeNthFromEndCode } from "../../core/linked-list/sourcecode/removeNthFromEnd";
import { generateFrames } from "../../core/linked-list/frames/removeNthFromEndFrames";
import { type TestCase } from "../../components/shared/TestCaseSwitcher";
import { ListTree } from "lucide-react";

interface RemoveNthData {
  values: number[];
  n: number;
}

type RemoveNthTestCase = TestCase<RemoveNthData>;

const TEST_CASES: RemoveNthTestCase[] = [
  {
    id: "tc1",
    name: "Example 1: [1, 2, 3, 4, 5], n = 2",
    data: { values: [1, 2, 3, 4, 5], n: 2 },
  },
  {
    id: "tc2",
    name: "Single Element: [1], n = 1",
    data: { values: [1], n: 1 },
  },
  {
    id: "tc3",
    name: "Remove Tail: [1, 2], n = 1",
    data: { values: [1, 2], n: 1 },
  },
  {
    id: "tc4",
    name: "Remove Head: [1, 2], n = 2",
    data: { values: [1, 2], n: 2 },
  },
  {
    id: "tc5",
    name: "Larger List: [10, 20, 30, 40, 50], n = 5",
    data: { values: [10, 20, 30, 40, 50], n: 5 },
  },
];

export default function RemoveNthFromEnd() {
  const [testCaseIdx, setTestCaseIdx] = useState(0);
  const [currentData, setCurrentData] = useState<RemoveNthData>(
    TEST_CASES[0].data!
  );
  const [tempValuesInput, setTempValuesInput] = useState(
    `[${TEST_CASES[0].data!.values.join(", ")}]`
  );
  const [tempNInput, setTempNInput] = useState(String(TEST_CASES[0].data!.n));

  const modal = useConfigModal(0);

  const handleOpenModal = () => {
    modal.openModal(() => {
      setTempValuesInput(`[${currentData.values.join(", ")}]`);
      setTempNInput(String(currentData.n));
      modal.setSelectedPresetIdx(testCaseIdx);
    });
  };

  const handleSelectPreset = (idx: number) => {
    modal.selectPreset(idx, () => {
      const tc = TEST_CASES[idx];
      setTempValuesInput(`[${tc.data!.values.join(", ")}]`);
      setTempNInput(String(tc.data!.n));
    });
  };

  const handleApplySettings = () => {
    modal.apply(() => {
      let values = currentData.values;
      let n = currentData.n;

      if (tempValuesInput.trim()) {
        const parsed = tempValuesInput
          .replace(/^\[/, "")
          .replace(/\]$/, "")
          .split(",")
          .map((x) => Number(x.trim()))
          .filter((x) => !isNaN(x));
        if (parsed.length > 0) {
          values = parsed;
        }
      }

      if (tempNInput.trim()) {
        const parsedN = Number(tempNInput.trim());
        if (!isNaN(parsedN) && parsedN > 0) {
          n = Math.min(parsedN, values.length);
        }
      }

      if (modal.selectedPresetIdx !== null) {
        setTestCaseIdx(modal.selectedPresetIdx);
      }

      setCurrentData({ values, n });
    });
  };

  const frames = useMemo(() => {
    return generateFrames(currentData.values, currentData.n);
  }, [currentData]);

  return (
    <LinkedListVisualizerLayout
      title="Remove Nth Node From End"
      theme="teal"
      frames={frames}
      code={removeNthFromEndCode}
    >
      <ConfigModal
        title="Configure List & N"
        description="Select a preset scenario or provide custom node values and N."
        theme="teal"
        isOpen={modal.isOpen}
        onOpenChange={modal.setIsOpen}
        onOpen={handleOpenModal}
        presets={TEST_CASES.map((tc) => ({
          id: tc.id,
          name: tc.name,
          preview: `List: [${tc.data!.values.join(" -> ")}], n: ${tc.data!.n}`,
        }))}
        selectedPresetIdx={modal.selectedPresetIdx}
        onSelectPreset={handleSelectPreset}
        onApply={handleApplySettings}
      >
        <div className="grid grid-cols-3 gap-3">
          <div className="col-span-2 space-y-1">
            <label className="text-[11px] font-mono text-neutral-400 flex items-center gap-1">
              <ListTree className="w-3 h-3 text-teal-400" />
              Node Values:
            </label>
            <input
              type="text"
              value={tempValuesInput}
              onChange={(e) => {
                setTempValuesInput(e.target.value);
                modal.setSelectedPresetIdx(null);
              }}
              placeholder="[1, 2, 3, 4, 5]"
              className="w-full bg-neutral-950/80 border border-neutral-700/80 rounded-md px-3 py-2 text-xs font-mono text-neutral-100 focus:outline-none focus:ring-1 focus:ring-teal-500/60 focus:border-teal-500 placeholder:text-neutral-600"
            />
          </div>
          <div className="space-y-1">
            <label className="text-[11px] font-mono text-neutral-400 block">
              N (from end):
            </label>
            <input
              type="number"
              value={tempNInput}
              onChange={(e) => {
                setTempNInput(e.target.value);
                modal.setSelectedPresetIdx(null);
              }}
              placeholder="2"
              className="w-full bg-neutral-950/80 border border-neutral-700/80 rounded-md px-3 py-2 text-xs font-mono text-neutral-100 focus:outline-none focus:ring-1 focus:ring-teal-500/60 focus:border-teal-500 placeholder:text-neutral-600"
            />
          </div>
        </div>
      </ConfigModal>
    </LinkedListVisualizerLayout>
  );
}
