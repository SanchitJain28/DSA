import { useMemo, useState } from "react";
import LinkedListVisualizerLayout from "../../components/layout/LinkedListVisualizerLayout";
import ConfigModal from "../../components/shared/ConfigModal";
import { useConfigModal } from "../../hooks/useConfigModal";
import { generateFrames } from "../../core/linked-list/frames/reorderListFrames";
import { reorderListCode } from "../../core/linked-list/sourcecode/reorderList";
import { type TestCase } from "../../components/shared/TestCaseSwitcher";
import { ListTree } from "lucide-react";

interface ReorderListData {
  values: number[];
}

type ReorderListTestCase = TestCase<ReorderListData>;

const TEST_CASES: ReorderListTestCase[] = [
  {
    id: "tc1",
    name: "Even Length [1, 2, 3, 4]",
    data: { values: [1, 2, 3, 4] },
  },
  {
    id: "tc2",
    name: "Odd Length [1, 2, 3, 4, 5]",
    data: { values: [1, 2, 3, 4, 5] },
  },
  {
    id: "tc3",
    name: "Two Elements [1, 2]",
    data: { values: [1, 2] },
  },
  {
    id: "tc4",
    name: "Single Element [1]",
    data: { values: [1] },
  },
  {
    id: "tc5",
    name: "Larger List [10, 20, 30, 40, 50, 60]",
    data: { values: [10, 20, 30, 40, 50, 60] },
  },
];

export default function ReorderList() {
  const [testCaseIdx, setTestCaseIdx] = useState(0);
  const [currentData, setCurrentData] = useState<ReorderListData>(
    TEST_CASES[0].data!
  );
  const [tempValuesInput, setTempValuesInput] = useState(
    `[${TEST_CASES[0].data!.values.join(", ")}]`
  );

  const modal = useConfigModal(0);

  const handleOpenModal = () => {
    modal.openModal(() => {
      setTempValuesInput(`[${currentData.values.join(", ")}]`);
      modal.setSelectedPresetIdx(testCaseIdx);
    });
  };

  const handleSelectPreset = (idx: number) => {
    modal.selectPreset(idx, () => {
      const tc = TEST_CASES[idx];
      setTempValuesInput(`[${tc.data!.values.join(", ")}]`);
    });
  };

  const handleApplySettings = () => {
    modal.apply(() => {
      let values = currentData.values;
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

      if (modal.selectedPresetIdx !== null) {
        setTestCaseIdx(modal.selectedPresetIdx);
      }

      setCurrentData({ values });
    });
  };

  const frames = useMemo(() => {
    return generateFrames(currentData.values);
  }, [currentData]);

  return (
    <LinkedListVisualizerLayout
      title="Reorder List"
      theme="indigo"
      frames={frames}
      code={reorderListCode}
    >
      <ConfigModal
        title="Configure List for Reordering"
        description="Select a preset linked list scenario or provide custom node values."
        theme="indigo"
        isOpen={modal.isOpen}
        onOpenChange={modal.setIsOpen}
        onOpen={handleOpenModal}
        presets={TEST_CASES.map((tc) => ({
          id: tc.id,
          name: tc.name,
          preview: `List: [${tc.data!.values.join(" -> ")}]`,
        }))}
        selectedPresetIdx={modal.selectedPresetIdx}
        onSelectPreset={handleSelectPreset}
        onApply={handleApplySettings}
      >
        <div className="space-y-1">
          <label className="text-[11px] font-mono text-neutral-400 flex items-center gap-1">
            <ListTree className="w-3 h-3 text-indigo-400" />
            Node Values (comma-separated):
          </label>
          <input
            type="text"
            value={tempValuesInput}
            onChange={(e) => {
              setTempValuesInput(e.target.value);
              modal.setSelectedPresetIdx(null);
            }}
            placeholder="[1, 2, 3, 4]"
            className="w-full bg-neutral-950/80 border border-neutral-700/80 rounded-md px-3 py-2 text-xs font-mono text-neutral-100 focus:outline-none focus:ring-1 focus:ring-indigo-500/60 focus:border-indigo-500 placeholder:text-neutral-600"
          />
        </div>
      </ConfigModal>
    </LinkedListVisualizerLayout>
  );
}
