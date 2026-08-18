import { useMemo, useState } from "react";
import LinkedListVisualizerLayout from "../../components/layout/LinkedListVisualizerLayout";
import ConfigModal from "../../components/shared/ConfigModal";
import { useConfigModal } from "../../hooks/useConfigModal";
import { sortListCode } from "../../core/linked-list/sourcecode/sortList";
import { generateFrames } from "../../core/linked-list/frames/sortListFrames";
import { type TestCase } from "../../components/shared/TestCaseSwitcher";
import { ListTree } from "lucide-react";

interface SortListData {
  values: number[];
}

type SortListTestCase = TestCase<SortListData>;

const TEST_CASES: SortListTestCase[] = [
  {
    id: "tc1",
    name: "Standard [4, 2, 1, 3]",
    data: { values: [4, 2, 1, 3] },
  },
  {
    id: "tc2",
    name: "With Negatives [-1, 5, 3, 4, 0]",
    data: { values: [-1, 5, 3, 4, 0] },
  },
  {
    id: "tc3",
    name: "Two Elements [2, 1]",
    data: { values: [2, 1] },
  },
  {
    id: "tc4",
    name: "Single Element [5]",
    data: { values: [5] },
  },
  {
    id: "tc5",
    name: "Larger List [10, 30, 20, 50, 40]",
    data: { values: [10, 30, 20, 50, 40] },
  },
];

export default function SortList() {
  const [testCaseIdx, setTestCaseIdx] = useState(0);
  const [currentData, setCurrentData] = useState<SortListData>(
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
      title="Sort List (Merge Sort)"
      theme="indigo"
      frames={frames}
      code={sortListCode}
    >
      <ConfigModal
        title="Configure List for Merge Sort"
        description="Select a preset unsorted list scenario or provide custom node values."
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
            placeholder="[4, 2, 1, 3]"
            className="w-full bg-neutral-950/80 border border-neutral-700/80 rounded-md px-3 py-2 text-xs font-mono text-neutral-100 focus:outline-none focus:ring-1 focus:ring-indigo-500/60 focus:border-indigo-500 placeholder:text-neutral-600"
          />
        </div>
      </ConfigModal>
    </LinkedListVisualizerLayout>
  );
}
