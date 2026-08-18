import { useMemo, useState } from "react";
import StackVisualizerLayout from "../../components/layout/StackVisualizerLayout";
import ConfigModal from "../../components/shared/ConfigModal";
import { useConfigModal } from "../../hooks/useConfigModal";
import { type TestCase } from "../../components/shared/TestCaseSwitcher";
import { carFleetCode } from "../../core/stack/sourcecode/carFleet";
import { generateFrames } from "../../core/stack/frames/carFleetFrames";
import { Car, Flag, Gauge } from "lucide-react";

interface CarFleetData {
  target: number;
  position: number[];
  speed: number[];
}

type CarFleetTestCase = TestCase<CarFleetData>;

const TEST_CASES: CarFleetTestCase[] = [
  {
    id: "tc1",
    name: "Classic Example: target=12, 5 cars",
    data: {
      target: 12,
      position: [10, 8, 0, 5, 3],
      speed: [2, 4, 1, 1, 3],
    },
  },
  {
    id: "tc2",
    name: "Single Car: target=10",
    data: {
      target: 10,
      position: [3],
      speed: [3],
    },
  },
  {
    id: "tc3",
    name: "All Merge to 1 Fleet: target=100",
    data: {
      target: 100,
      position: [0, 2, 4],
      speed: [4, 2, 1],
    },
  },
  {
    id: "tc4",
    name: "No Catchup (2 Fleets): target=10",
    data: {
      target: 10,
      position: [6, 8],
      speed: [3, 2],
    },
  },
];

export default function CarFleet() {
  const [testCaseIdx, setTestCaseIdx] = useState(0);
  const [currentData, setCurrentData] = useState<CarFleetData>(
    TEST_CASES[0].data!
  );
  const [currentIdx, setCurrentIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  // Buffer states for modal
  const [tempTargetInput, setTempTargetInput] = useState(
    String(TEST_CASES[0].data!.target)
  );
  const [tempPosInput, setTempPosInput] = useState(
    `[${TEST_CASES[0].data!.position.join(", ")}]`
  );
  const [tempSpeedInput, setTempSpeedInput] = useState(
    `[${TEST_CASES[0].data!.speed.join(", ")}]`
  );

  const modal = useConfigModal(0);

  const handleOpenModal = () => {
    modal.openModal(() => {
      setTempTargetInput(String(currentData.target));
      setTempPosInput(`[${currentData.position.join(", ")}]`);
      setTempSpeedInput(`[${currentData.speed.join(", ")}]`);
      modal.setSelectedPresetIdx(testCaseIdx);
    });
  };

  const handleSelectPreset = (idx: number) => {
    modal.selectPreset(idx, () => {
      const tc = TEST_CASES[idx];
      if (tc?.data) {
        setTempTargetInput(String(tc.data.target));
        setTempPosInput(`[${tc.data.position.join(", ")}]`);
        setTempSpeedInput(`[${tc.data.speed.join(", ")}]`);
      }
    });
  };

  const handleApplySettings = () => {
    modal.apply(() => {
      let target = currentData.target;
      let position = currentData.position;
      let speed = currentData.speed;

      if (tempTargetInput.trim()) {
        const parsedT = Number(tempTargetInput.trim());
        if (!isNaN(parsedT) && parsedT > 0) target = parsedT;
      }

      if (tempPosInput.trim() && tempSpeedInput.trim()) {
        const parsedPos = tempPosInput
          .replace(/^\[/, "")
          .replace(/\]$/, "")
          .split(",")
          .map((x) => Number(x.trim()))
          .filter((x) => !isNaN(x));

        const parsedSpeed = tempSpeedInput
          .replace(/^\[/, "")
          .replace(/\]$/, "")
          .split(",")
          .map((x) => Number(x.trim()))
          .filter((x) => !isNaN(x) && x > 0);

        if (parsedPos.length > 0 && parsedPos.length === parsedSpeed.length) {
          position = parsedPos;
          speed = parsedSpeed;
        }
      }

      if (modal.selectedPresetIdx !== null) {
        setTestCaseIdx(modal.selectedPresetIdx);
      }

      setCurrentData({ target, position, speed });
      setCurrentIdx(0);
      setIsPlaying(false);
    });
  };

  const frames = useMemo(() => {
    return generateFrames(
      currentData.target,
      currentData.position,
      currentData.speed
    );
  }, [currentData]);

  return (
    <StackVisualizerLayout
      title="Car Fleet"
      theme="indigo"
      frames={frames}
      code={carFleetCode}
      currentIdx={currentIdx}
      setCurrentIdx={setCurrentIdx}
      isPlaying={isPlaying}
      setIsPlaying={setIsPlaying}
    >
      <ConfigModal
        title="Configure Car Fleet Positions & Speeds"
        description="Select a preset scenario or provide custom target destination, car positions, and speeds."
        theme="indigo"
        isOpen={modal.isOpen}
        onOpenChange={modal.setIsOpen}
        onOpen={handleOpenModal}
        presets={TEST_CASES.map((tc) => ({
          id: tc.id,
          name: tc.name,
          preview: `Target: ${tc.data!.target}, Pos: [${tc.data!.position.join(",")}], Speed: [${tc.data!.speed.join(",")}]`,
        }))}
        selectedPresetIdx={modal.selectedPresetIdx}
        onSelectPreset={handleSelectPreset}
        onApply={handleApplySettings}
      >
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="space-y-1">
              <label className="text-[11px] font-mono text-neutral-400 flex items-center gap-1">
                <Flag className="w-3 h-3 text-indigo-400" />
                Target Mile:
              </label>
              <input
                type="number"
                value={tempTargetInput}
                onChange={(e) => {
                  setTempTargetInput(e.target.value);
                  modal.setSelectedPresetIdx(null);
                }}
                placeholder="12"
                min="1"
                className="w-full bg-neutral-950/80 border border-neutral-700/80 rounded-md px-3 py-2 text-xs font-mono text-neutral-100 focus:outline-none focus:ring-1 focus:ring-indigo-500/60 focus:border-indigo-500 placeholder:text-neutral-600"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-mono text-neutral-400 flex items-center gap-1">
                <Car className="w-3 h-3 text-indigo-400" />
                Car Positions:
              </label>
              <input
                type="text"
                value={tempPosInput}
                onChange={(e) => {
                  setTempPosInput(e.target.value);
                  modal.setSelectedPresetIdx(null);
                }}
                placeholder="[10, 8, 0, 5, 3]"
                className="w-full bg-neutral-950/80 border border-neutral-700/80 rounded-md px-3 py-2 text-xs font-mono text-neutral-100 focus:outline-none focus:ring-1 focus:ring-indigo-500/60 focus:border-indigo-500 placeholder:text-neutral-600"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-mono text-neutral-400 flex items-center gap-1">
                <Gauge className="w-3 h-3 text-indigo-400" />
                Car Speeds:
              </label>
              <input
                type="text"
                value={tempSpeedInput}
                onChange={(e) => {
                  setTempSpeedInput(e.target.value);
                  modal.setSelectedPresetIdx(null);
                }}
                placeholder="[2, 4, 1, 1, 3]"
                className="w-full bg-neutral-950/80 border border-neutral-700/80 rounded-md px-3 py-2 text-xs font-mono text-neutral-100 focus:outline-none focus:ring-1 focus:ring-indigo-500/60 focus:border-indigo-500 placeholder:text-neutral-600"
              />
            </div>
          </div>
        </div>
      </ConfigModal>
    </StackVisualizerLayout>
  );
}
