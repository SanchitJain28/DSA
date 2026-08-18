import { useMemo, useState } from "react";
import StackVisualizerLayout from "../../components/layout/StackVisualizerLayout";
import ConfigModal from "../../components/shared/ConfigModal";
import { useConfigModal } from "../../hooks/useConfigModal";
import { type TestCase } from "../../components/shared/TestCaseSwitcher";
import { generateFrames } from "../../core/stack/frames/dailyTemperaturesFrames";
import { dailyTemperaturesCode } from "../../core/stack/sourcecode/dailyTemperatures";
import { Thermometer } from "lucide-react";

interface DailyTempsData {
  temps: number[];
}

type DailyTempsTestCase = TestCase<DailyTempsData>;

const TEST_CASES: DailyTempsTestCase[] = [
  {
    id: "tc1",
    name: "Standard Case: [73, 74, 75, 71, 69, 72, 76, 73]",
    data: { temps: [73, 74, 75, 71, 69, 72, 76, 73] },
  },
  {
    id: "tc2",
    name: "Increasing Temperatures: [30, 40, 50, 60]",
    data: { temps: [30, 40, 50, 60] },
  },
  {
    id: "tc3",
    name: "Decreasing Temperatures: [30, 20, 10]",
    data: { temps: [30, 20, 10] },
  },
  {
    id: "tc4",
    name: "Varied Mix: [30, 38, 30, 36, 35, 40, 28]",
    data: { temps: [30, 38, 30, 36, 35, 40, 28] },
  },
];

export default function DailyTemperatures() {
  const [testCaseIdx, setTestCaseIdx] = useState(0);
  const [currentData, setCurrentData] = useState<DailyTempsData>(
    TEST_CASES[0].data!
  );
  const [currentIdx, setCurrentIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  // Buffer state for modal
  const [tempTempsInput, setTempTempsInput] = useState(
    `[${TEST_CASES[0].data!.temps.join(", ")}]`
  );

  const modal = useConfigModal(0);

  const handleOpenModal = () => {
    modal.openModal(() => {
      setTempTempsInput(`[${currentData.temps.join(", ")}]`);
      modal.setSelectedPresetIdx(testCaseIdx);
    });
  };

  const handleSelectPreset = (idx: number) => {
    modal.selectPreset(idx, () => {
      const tc = TEST_CASES[idx];
      if (tc?.data) {
        setTempTempsInput(`[${tc.data.temps.join(", ")}]`);
      }
    });
  };

  const handleApplySettings = () => {
    modal.apply(() => {
      let temps = currentData.temps;
      if (tempTempsInput.trim()) {
        const parsed = tempTempsInput
          .replace(/^\[/, "")
          .replace(/\]$/, "")
          .split(",")
          .map((x) => Number(x.trim()))
          .filter((x) => !isNaN(x));
        if (parsed.length > 0) {
          temps = parsed;
        }
      }

      if (modal.selectedPresetIdx !== null) {
        setTestCaseIdx(modal.selectedPresetIdx);
      }

      setCurrentData({ temps });
      setCurrentIdx(0);
      setIsPlaying(false);
    });
  };

  const frames = useMemo(() => {
    return generateFrames(currentData.temps);
  }, [currentData]);

  return (
    <StackVisualizerLayout
      title="Daily Temperatures"
      theme="indigo"
      frames={frames}
      code={dailyTemperaturesCode}
      currentIdx={currentIdx}
      setCurrentIdx={setCurrentIdx}
      isPlaying={isPlaying}
      setIsPlaying={setIsPlaying}
    >
      <ConfigModal
        title="Configure Daily Temperatures"
        description="Select a preset scenario or provide custom temperature values."
        theme="indigo"
        isOpen={modal.isOpen}
        onOpenChange={modal.setIsOpen}
        onOpen={handleOpenModal}
        presets={TEST_CASES.map((tc) => ({
          id: tc.id,
          name: tc.name,
          preview: `Temps: [${tc.data!.temps.join(",")}]`,
        }))}
        selectedPresetIdx={modal.selectedPresetIdx}
        onSelectPreset={handleSelectPreset}
        onApply={handleApplySettings}
      >
        <div className="space-y-4">
          <div className="space-y-1">
            <label className="text-[11px] font-mono text-neutral-400 flex items-center gap-1">
              <Thermometer className="w-3 h-3 text-indigo-400" />
              Temperatures Array (comma-separated):
            </label>
            <input
              type="text"
              value={tempTempsInput}
              onChange={(e) => {
                setTempTempsInput(e.target.value);
                modal.setSelectedPresetIdx(null);
              }}
              placeholder="[73, 74, 75, 71, 69, 72, 76, 73]"
              className="w-full bg-neutral-950/80 border border-neutral-700/80 rounded-md px-3 py-2 text-xs font-mono text-neutral-100 focus:outline-none focus:ring-1 focus:ring-indigo-500/60 focus:border-indigo-500 placeholder:text-neutral-600"
            />
          </div>
        </div>
      </ConfigModal>
    </StackVisualizerLayout>
  );
}
