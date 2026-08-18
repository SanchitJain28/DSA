import { useMemo, useState } from "react";
import LinkedListVisualizerLayout from "../../components/layout/LinkedListVisualizerLayout";
import ConfigModal from "../../components/shared/ConfigModal";
import { useConfigModal } from "../../hooks/useConfigModal";
import { generateFrames } from "../../core/linked-list/frames/rotateRightFrames";
import { rotateRightCode } from "../../core/linked-list/sourcecode/rotateRight";
import { type TestCase } from "../../components/shared/TestCaseSwitcher";
import { RotateCw } from "lucide-react";

interface RotateListData {
  values: number[];
  k: number;
}

type RotateListTestCase = TestCase<RotateListData>;

const TEST_CASES: RotateListTestCase[] = [
  {
    id: "tc1",
    name: "Example 1: [1, 2, 3, 4, 5], k = 2",
    data: { values: [1, 2, 3, 4, 5], k: 2 },
  },
  {
    id: "tc2",
    name: "Example 2: [0, 1, 2], k = 4",
    data: { values: [0, 1, 2], k: 4 },
  },
  {
    id: "tc3",
    name: "Full Rotation: [1, 2, 3, 4, 5], k = 5",
    data: { values: [1, 2, 3, 4, 5], k: 5 },
  },
  {
    id: "tc4",
    name: "Two Elements: [1, 2], k = 1",
    data: { values: [1, 2], k: 1 },
  },
  {
    id: "tc5",
    name: "Single Element: [1], k = 99",
    data: { values: [1], k: 99 },
  },
];

export default function RotateList() {
  const [testCaseIdx, setTestCaseIdx] = useState(0);
  const [currentData, setCurrentData] = useState<RotateListData>(
    TEST_CASES[0].data!
  );

  const [tempValuesInput, setTempValuesInput] = useState(
    TEST_CASES[0].data!.values.join(", ")
  );
  const [tempKInput, setTempKInput] = useState(
    String(TEST_CASES[0].data!.k)
  );

  const modal = useConfigModal(0);

  const handleOpenModal = () => {
    modal.openModal(() => {
      setTempValuesInput(currentData.values.join(", "));
      setTempKInput(String(currentData.k));
      modal.setSelectedPresetIdx(testCaseIdx);
    });
  };

  const handleSelectPreset = (idx: number) => {
    modal.selectPreset(idx, () => {
      const tc = TEST_CASES[idx];
      setTempValuesInput(tc.data!.values.join(", "));
      setTempKInput(String(tc.data!.k));
    });
  };

  const handleApplySettings = () => {
    modal.apply(() => {
      let values = currentData.values;
      let k = currentData.k;

      if (tempValuesInput.trim() !== "") {
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

      if (tempKInput.trim() !== "") {
        const parsedK = Number(tempKInput.trim());
        if (!isNaN(parsedK) && parsedK >= 0) {
          k = parsedK;
        }
      }

      if (modal.selectedPresetIdx !== null) {
        setTestCaseIdx(modal.selectedPresetIdx);
      }

      setCurrentData({ values, k });
    });
  };

  const frames = useMemo(() => {
    return generateFrames(currentData.values, currentData.k);
  }, [currentData]);

  return (
    <LinkedListVisualizerLayout
      title="Rotate List"
      theme="indigo"
      frames={frames}
      code={rotateRightCode}
    >
      <ConfigModal
        title="Configure List & Rotation"
        description="Select a preset scenario or provide custom nodes and rotation shift k."
        theme="indigo"
        icon={RotateCw}
        isOpen={modal.isOpen}
        onOpenChange={modal.setIsOpen}
        onOpen={handleOpenModal}
        presets={TEST_CASES.map((tc) => ({
          id: tc.id,
          name: tc.name,
          preview: `List: [${tc.data!.values.join(", ")}], k: ${tc.data!.k}`,
        }))}
        selectedPresetIdx={modal.selectedPresetIdx}
        onSelectPreset={handleSelectPreset}
        onApply={handleApplySettings}
      >
        <div className="grid grid-cols-3 gap-3">
          <div className="col-span-2 space-y-1">
            <label className="text-xs font-mono font-semibold uppercase tracking-wider text-neutral-400 block">
              Custom List Nodes
            </label>
            <input
              type="text"
              value={tempValuesInput}
              onChange={(e) => {
                setTempValuesInput(e.target.value);
                modal.setSelectedPresetIdx(null);
              }}
              placeholder="1, 2, 3, 4, 5"
              className="w-full bg-neutral-950/80 border border-neutral-700/80 rounded-md px-3 py-2 text-xs font-mono text-neutral-100 focus:outline-none focus:ring-1 focus:ring-indigo-500/60 focus:border-indigo-500 placeholder:text-neutral-600"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-mono font-semibold uppercase tracking-wider text-neutral-400 block">
              Shift (k)
            </label>
            <input
              type="number"
              value={tempKInput}
              onChange={(e) => {
                setTempKInput(e.target.value);
                modal.setSelectedPresetIdx(null);
              }}
              placeholder="2"
              className="w-full bg-neutral-950/80 border border-neutral-700/80 rounded-md px-3 py-2 text-xs font-mono text-neutral-100 focus:outline-none focus:ring-1 focus:ring-indigo-500/60 focus:border-indigo-500 placeholder:text-neutral-600"
            />
          </div>
        </div>
      </ConfigModal>
    </LinkedListVisualizerLayout>
  );
}
