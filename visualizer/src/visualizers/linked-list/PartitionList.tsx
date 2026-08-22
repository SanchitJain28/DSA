import { useMemo, useState } from "react";
import LinkedListVisualizerLayout from "../../components/layout/LinkedListVisualizerLayout";
import ConfigModal from "../../components/shared/ConfigModal";
import { useConfigModal } from "../../hooks/useConfigModal";
import { generateFrames } from "../../core/linked-list/frames/partitionListFrames";
import { partitionListCode } from "../../core/linked-list/sourcecode/partitionList";
import { type TestCase } from "../../components/shared/TestCaseSwitcher";
import { Split, Hash } from "lucide-react";

interface PartitionListData {
  values: number[];
  x: number;
}

type PartitionListTestCase = TestCase<PartitionListData>;

const TEST_CASES: PartitionListTestCase[] = [
  {
    id: "tc1",
    name: "Classic: [1, 4, 3, 2, 5, 2], x = 3",
    data: { values: [1, 4, 3, 2, 5, 2], x: 3 },
  },
  {
    id: "tc2",
    name: "Two Elements: [2, 1], x = 2",
    data: { values: [2, 1], x: 2 },
  },
  {
    id: "tc3",
    name: "All Less: [1, 2, 3], x = 5",
    data: { values: [1, 2, 3], x: 5 },
  },
  {
    id: "tc4",
    name: "All Greater: [5, 4, 3], x = 2",
    data: { values: [5, 4, 3], x: 2 },
  },
  {
    id: "tc5",
    name: "Boundary Duplicates: [3, 1, 4, 3, 2, 5, 3], x = 3",
    data: { values: [3, 1, 4, 3, 2, 5, 3], x: 3 },
  },
  {
    id: "tc6",
    name: "Single Node: [1], x = 0",
    data: { values: [1], x: 0 },
  },
];

export default function PartitionList() {
  const [testCaseIdx, setTestCaseIdx] = useState(0);
  const [currentData, setCurrentData] = useState<PartitionListData>(
    TEST_CASES[0].data!
  );

  const [tempValuesInput, setTempValuesInput] = useState(
    TEST_CASES[0].data!.values.join(", ")
  );
  const [tempXInput, setTempXInput] = useState(
    String(TEST_CASES[0].data!.x)
  );

  const [currentIdx, setCurrentIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const modal = useConfigModal(0);

  const handleOpenModal = () => {
    modal.openModal(() => {
      setTempValuesInput(currentData.values.join(", "));
      setTempXInput(String(currentData.x));
      modal.setSelectedPresetIdx(testCaseIdx);
    });
  };

  const handleSelectPreset = (idx: number) => {
    modal.selectPreset(idx, () => {
      const tc = TEST_CASES[idx];
      setTempValuesInput(tc.data!.values.join(", "));
      setTempXInput(String(tc.data!.x));
    });
  };

  const handleApplySettings = () => {
    modal.apply(() => {
      let values = currentData.values;
      let x = currentData.x;

      if (tempValuesInput.trim() !== "") {
        const parsed = tempValuesInput
          .replace(/^\[/, "")
          .replace(/\]$/, "")
          .split(",")
          .map((v) => Number(v.trim()))
          .filter((v) => !isNaN(v));
        if (parsed.length > 0) {
          values = parsed;
        }
      }

      if (tempXInput.trim() !== "") {
        const parsedX = Number(tempXInput.trim());
        if (!isNaN(parsedX)) {
          x = parsedX;
        }
      }

      if (modal.selectedPresetIdx !== null) {
        setTestCaseIdx(modal.selectedPresetIdx);
      }

      setCurrentData({ values, x });
      setCurrentIdx(0);
      setIsPlaying(false);
    });
  };

  const frames = useMemo(() => {
    return generateFrames(currentData.values, currentData.x);
  }, [currentData]);

  return (
    <LinkedListVisualizerLayout
      title="Partition List"
      theme="indigo"
      frames={frames}
      code={partitionListCode}
      currentIdx={currentIdx}
      setCurrentIdx={setCurrentIdx}
      isPlaying={isPlaying}
      setIsPlaying={setIsPlaying}
    >
      <ConfigModal
        title="Configure Partition Inputs"
        description="Select a preset test scenario or specify custom linked list values and partition target x."
        theme="indigo"
        isOpen={modal.isOpen}
        onOpenChange={modal.setIsOpen}
        onOpen={handleOpenModal}
        presets={TEST_CASES.map((tc) => ({
          id: tc.id,
          name: tc.name,
          preview: `List: [${tc.data!.values.join(", ")}], x: ${tc.data!.x}`,
        }))}
        selectedPresetIdx={modal.selectedPresetIdx}
        onSelectPreset={handleSelectPreset}
        onApply={handleApplySettings}
      >
        <div className="space-y-4">
          <div className="space-y-1">
            <label className="text-[11px] font-mono text-neutral-400 flex items-center gap-1">
              <Split className="w-3 h-3 text-indigo-400" />
              Linked List Values (comma-separated):
            </label>
            <input
              type="text"
              value={tempValuesInput}
              onChange={(e) => {
                setTempValuesInput(e.target.value);
                modal.setSelectedPresetIdx(null);
              }}
              placeholder="1, 4, 3, 2, 5, 2"
              className="w-full bg-neutral-950/80 border border-neutral-700/80 rounded-md px-3 py-2 text-xs font-mono text-neutral-100 focus:outline-none focus:ring-1 focus:ring-indigo-500/60 focus:border-indigo-500 placeholder:text-neutral-600"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-mono text-neutral-400 flex items-center gap-1">
              <Hash className="w-3 h-3 text-indigo-400" />
              Partition Value (x):
            </label>
            <input
              type="number"
              value={tempXInput}
              onChange={(e) => {
                setTempXInput(e.target.value);
                modal.setSelectedPresetIdx(null);
              }}
              placeholder="3"
              className="w-full bg-neutral-950/80 border border-neutral-700/80 rounded-md px-3 py-2 text-xs font-mono text-neutral-100 focus:outline-none focus:ring-1 focus:ring-indigo-500/60 focus:border-indigo-500 placeholder:text-neutral-600"
            />
          </div>
        </div>
      </ConfigModal>
    </LinkedListVisualizerLayout>
  );
}
