import { useMemo, useState } from "react";
import LinkedListVisualizerLayout from "../../components/layout/LinkedListVisualizerLayout";
import ConfigModal from "../../components/shared/ConfigModal";
import { useConfigModal } from "../../hooks/useConfigModal";
import { middleNodeCode } from "../../core/linked-list/sourcecode/middleNode";
import { generateFrames } from "../../core/linked-list/frames/middleNodeFrames";
import { type TestCase } from "../../components/shared/TestCaseSwitcher";
import { ListTree } from "lucide-react";

interface MiddleNodeData {
  values: number[];
}

type MiddleNodeTestCase = TestCase<MiddleNodeData>;

const TEST_CASES: MiddleNodeTestCase[] = [
  {
    id: "tc1",
    name: "Odd Length [1, 2, 3, 4, 5]",
    data: { values: [1, 2, 3, 4, 5] },
  },
  {
    id: "tc2",
    name: "Even Length [1, 2, 3, 4, 5, 6]",
    data: { values: [1, 2, 3, 4, 5, 6] },
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
    name: "Larger List [10, 20, 30, 40, 50, 60, 70]",
    data: { values: [10, 20, 30, 40, 50, 60, 70] },
  },
];

export default function MiddleNode() {
  const [testCaseIdx, setTestCaseIdx] = useState(0);
  const [currentData, setCurrentData] = useState<MiddleNodeData>(
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
      title="Middle of the Linked List"
      theme="emerald"
      frames={frames}
      code={middleNodeCode}
    >
      <ConfigModal
        title="Configure Linked List"
        description="Select a preset scenario or provide custom comma-separated node values."
        theme="emerald"
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
            <ListTree className="w-3 h-3 text-emerald-400" />
            Node Values (comma-separated):
          </label>
          <input
            type="text"
            value={tempValuesInput}
            onChange={(e) => {
              setTempValuesInput(e.target.value);
              modal.setSelectedPresetIdx(null);
            }}
            placeholder="[1, 2, 3, 4, 5]"
            className="w-full bg-neutral-950/80 border border-neutral-700/80 rounded-md px-3 py-2 text-xs font-mono text-neutral-100 focus:outline-none focus:ring-1 focus:ring-emerald-500/60 focus:border-emerald-500 placeholder:text-neutral-600"
          />
        </div>
      </ConfigModal>
    </LinkedListVisualizerLayout>
  );
}
