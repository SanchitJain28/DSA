import { useMemo, useState } from "react";
import LinkedListVisualizerLayout from "../../components/layout/LinkedListVisualizerLayout";
import ConfigModal from "../../components/shared/ConfigModal";
import { useConfigModal } from "../../hooks/useConfigModal";
import { generateHasCycleFrames } from "../../core/linked-list/frames/hasCycleFrames";
import { hasCycleCode } from "../../core/linked-list/sourcecode/hasCycle";
import { type TestCase } from "../../components/shared/TestCaseSwitcher";
import { ListTree } from "lucide-react";

interface HasCycleData {
  values: number[];
  pos: number;
}

type HasCycleTestCase = TestCase<HasCycleData>;

const TEST_CASES: HasCycleTestCase[] = [
  {
    id: "tc1",
    name: "Standard Cycle: [3, 2, 0, -4], pos = 1",
    data: { values: [3, 2, 0, -4], pos: 1 },
  },
  {
    id: "tc2",
    name: "Two Elements Cycle: [1, 2], pos = 0",
    data: { values: [1, 2], pos: 0 },
  },
  {
    id: "tc3",
    name: "No Cycle: [1], pos = -1",
    data: { values: [1], pos: -1 },
  },
  {
    id: "tc4",
    name: "No Cycle Linear: [1, 2, 3, 4, 5], pos = -1",
    data: { values: [1, 2, 3, 4, 5], pos: -1 },
  },
  {
    id: "tc5",
    name: "Longer Cycle: [10, 20, 30, 40, 50, 60], pos = 2",
    data: { values: [10, 20, 30, 40, 50, 60], pos: 2 },
  },
];

export default function HasCycle() {
  const [testCaseIdx, setTestCaseIdx] = useState(0);
  const [currentData, setCurrentData] = useState<HasCycleData>(
    TEST_CASES[0].data!
  );
  const [tempValuesInput, setTempValuesInput] = useState(
    `[${TEST_CASES[0].data!.values.join(", ")}]`
  );
  const [tempPosInput, setTempPosInput] = useState(
    String(TEST_CASES[0].data!.pos)
  );

  const modal = useConfigModal(0);

  const handleOpenModal = () => {
    modal.openModal(() => {
      setTempValuesInput(`[${currentData.values.join(", ")}]`);
      setTempPosInput(String(currentData.pos));
      modal.setSelectedPresetIdx(testCaseIdx);
    });
  };

  const handleSelectPreset = (idx: number) => {
    modal.selectPreset(idx, () => {
      const tc = TEST_CASES[idx];
      setTempValuesInput(`[${tc.data!.values.join(", ")}]`);
      setTempPosInput(String(tc.data!.pos));
    });
  };

  const handleApplySettings = () => {
    modal.apply(() => {
      let values = currentData.values;
      let pos = currentData.pos;

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

      if (tempPosInput.trim()) {
        const parsedPos = Number(tempPosInput.trim());
        if (!isNaN(parsedPos)) {
          pos = parsedPos >= values.length ? -1 : parsedPos;
        }
      }

      if (modal.selectedPresetIdx !== null) {
        setTestCaseIdx(modal.selectedPresetIdx);
      }

      setCurrentData({ values, pos });
    });
  };

  const frames = useMemo(() => {
    return generateHasCycleFrames(currentData.values, currentData.pos);
  }, [currentData]);

  return (
    <LinkedListVisualizerLayout
      title="Linked List Cycle"
      theme="teal"
      frames={frames}
      code={hasCycleCode}
    >
      <ConfigModal
        title="Configure Linked List & Cycle"
        description="Select a preset cycle scenario or provide custom node values and cycle target pos (-1 for no cycle)."
        theme="teal"
        isOpen={modal.isOpen}
        onOpenChange={modal.setIsOpen}
        onOpen={handleOpenModal}
        presets={TEST_CASES.map((tc) => ({
          id: tc.id,
          name: tc.name,
          preview: `List: [${tc.data!.values.join(" -> ")}], pos: ${tc.data!.pos}`,
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
              placeholder="[3, 2, 0, -4]"
              className="w-full bg-neutral-950/80 border border-neutral-700/80 rounded-md px-3 py-2 text-xs font-mono text-neutral-100 focus:outline-none focus:ring-1 focus:ring-teal-500/60 focus:border-teal-500 placeholder:text-neutral-600"
            />
          </div>
          <div className="space-y-1">
            <label className="text-[11px] font-mono text-neutral-400 block">
              Cycle Pos (-1 = None):
            </label>
            <input
              type="number"
              value={tempPosInput}
              onChange={(e) => {
                setTempPosInput(e.target.value);
                modal.setSelectedPresetIdx(null);
              }}
              placeholder="1"
              className="w-full bg-neutral-950/80 border border-neutral-700/80 rounded-md px-3 py-2 text-xs font-mono text-neutral-100 focus:outline-none focus:ring-1 focus:ring-teal-500/60 focus:border-teal-500 placeholder:text-neutral-600"
            />
          </div>
        </div>
      </ConfigModal>
    </LinkedListVisualizerLayout>
  );
}
