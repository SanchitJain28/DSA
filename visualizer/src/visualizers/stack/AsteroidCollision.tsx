import { useMemo, useState } from "react";
import StackVisualizerLayout from "../../components/layout/StackVisualizerLayout";
import ConfigModal from "../../components/shared/ConfigModal";
import { useConfigModal } from "../../hooks/useConfigModal";
import { type TestCase } from "../../components/shared/TestCaseSwitcher";
import { asteroidCollisionCode } from "../../core/stack/sourcecode/asteroidCollision";
import { generateFrames } from "../../core/stack/frames/asteroidCollisionFrames";
import { Sparkles } from "lucide-react";

interface AsteroidData {
  asteroids: number[];
}

type AsteroidTestCase = TestCase<AsteroidData>;

const TEST_CASES: AsteroidTestCase[] = [
  {
    id: "tc1",
    name: "Standard Collision: [5, 10, -5]",
    data: { asteroids: [5, 10, -5] },
  },
  {
    id: "tc2",
    name: "Equal Mass Mutual Destruction: [8, -8]",
    data: { asteroids: [8, -8] },
  },
  {
    id: "tc3",
    name: "Chain Reaction: [10, 2, -5]",
    data: { asteroids: [10, 2, -5] },
  },
  {
    id: "tc4",
    name: "Moving Away (No Collision): [-2, -1, 1, 2]",
    data: { asteroids: [-2, -1, 1, 2] },
  },
  {
    id: "tc5",
    name: "Complex Mix: [-2, -2, 1, -2]",
    data: { asteroids: [-2, -2, 1, -2] },
  },
];

export default function AsteroidCollision() {
  const [testCaseIdx, setTestCaseIdx] = useState(0);
  const [currentData, setCurrentData] = useState<AsteroidData>(
    TEST_CASES[0].data!
  );
  const [currentIdx, setCurrentIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  // Buffer state for modal
  const [tempAsteroidsInput, setTempAsteroidsInput] = useState(
    `[${TEST_CASES[0].data!.asteroids.join(", ")}]`
  );

  const modal = useConfigModal(0);

  const handleOpenModal = () => {
    modal.openModal(() => {
      setTempAsteroidsInput(`[${currentData.asteroids.join(", ")}]`);
      modal.setSelectedPresetIdx(testCaseIdx);
    });
  };

  const handleSelectPreset = (idx: number) => {
    modal.selectPreset(idx, () => {
      const tc = TEST_CASES[idx];
      if (tc?.data) {
        setTempAsteroidsInput(`[${tc.data.asteroids.join(", ")}]`);
      }
    });
  };

  const handleApplySettings = () => {
    modal.apply(() => {
      let asteroids = currentData.asteroids;
      if (tempAsteroidsInput.trim()) {
        const parsed = tempAsteroidsInput
          .replace(/^\[/, "")
          .replace(/\]$/, "")
          .split(",")
          .map((x) => Number(x.trim()))
          .filter((x) => !isNaN(x) && x !== 0);
        if (parsed.length > 0) {
          asteroids = parsed;
        }
      }

      if (modal.selectedPresetIdx !== null) {
        setTestCaseIdx(modal.selectedPresetIdx);
      }

      setCurrentData({ asteroids });
      setCurrentIdx(0);
      setIsPlaying(false);
    });
  };

  const frames = useMemo(() => {
    return generateFrames(currentData.asteroids);
  }, [currentData]);

  return (
    <StackVisualizerLayout
      title="Asteroid Collision"
      theme="orange"
      frames={frames}
      code={asteroidCollisionCode}
      currentIdx={currentIdx}
      setCurrentIdx={setCurrentIdx}
      isPlaying={isPlaying}
      setIsPlaying={setIsPlaying}
    >
      <ConfigModal
        title="Configure Asteroid Sizes & Velocities"
        description="Select a preset scenario or provide positive (rightward) and negative (leftward) asteroid sizes."
        theme="orange"
        isOpen={modal.isOpen}
        onOpenChange={modal.setIsOpen}
        onOpen={handleOpenModal}
        presets={TEST_CASES.map((tc) => ({
          id: tc.id,
          name: tc.name,
          preview: `Asteroids: [${tc.data!.asteroids.join(",")}]`,
        }))}
        selectedPresetIdx={modal.selectedPresetIdx}
        onSelectPreset={handleSelectPreset}
        onApply={handleApplySettings}
      >
        <div className="space-y-4">
          <div className="space-y-1">
            <label className="text-[11px] font-mono text-neutral-400 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-orange-400" />
              Asteroid Velocities (positive = right, negative = left):
            </label>
            <input
              type="text"
              value={tempAsteroidsInput}
              onChange={(e) => {
                setTempAsteroidsInput(e.target.value);
                modal.setSelectedPresetIdx(null);
              }}
              placeholder="[5, 10, -5]"
              className="w-full bg-neutral-950/80 border border-neutral-700/80 rounded-md px-3 py-2 text-xs font-mono text-neutral-100 focus:outline-none focus:ring-1 focus:ring-orange-500/60 focus:border-orange-500 placeholder:text-neutral-600"
            />
          </div>
        </div>
      </ConfigModal>
    </StackVisualizerLayout>
  );
}
