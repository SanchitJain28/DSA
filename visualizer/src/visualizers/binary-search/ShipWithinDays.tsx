import { useMemo, useState } from "react";
import BinarySearchVisualizerLayout from "../../components/layout/BinarySearchVisualizerLayout";
import SearchRangeGraph from "../../components/binary-search/SearchRangeGraph";
import { ArrayRenderer } from "../../components/shared/ArrayRenderer";
import ConfigModal from "../../components/shared/ConfigModal";
import { useConfigModal } from "../../hooks/useConfigModal";
import { type TestCase } from "../../components/shared/TestCaseSwitcher";
import { generateFrames } from "../../core/binary-search/frames/shipWithinDaysFrames";
import { shipWithinDaysCode } from "../../core/binary-search/sourcecode/shipWithinDays";
import { themeColors } from "../../utils/theme";
import { Package, Calendar } from "lucide-react";

interface ShipData {
  weights: number[];
  days: number;
}

type ShipTestCase = TestCase<ShipData>;

const TEST_CASES: ShipTestCase[] = [
  {
    id: "tc1",
    name: "1 to 10 in 5 Days",
    data: { weights: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10], days: 5 },
  },
  {
    id: "tc2",
    name: "Standard Mix in 3 Days",
    data: { weights: [3, 2, 2, 4, 1, 4], days: 3 },
  },
  {
    id: "tc3",
    name: "Small Weights in 4 Days",
    data: { weights: [1, 2, 3, 1, 1], days: 4 },
  },
  {
    id: "tc4",
    name: "Equal Weights in 2 Days",
    data: { weights: [5, 5, 5, 5], days: 2 },
  },
  {
    id: "tc5",
    name: "Ship All in 1 Day",
    data: { weights: [10, 50, 100, 20], days: 1 },
  },
  {
    id: "tc6",
    name: "Heavy Packages in 4 Days",
    data: { weights: [10, 50, 100, 20], days: 4 },
  },
];

export default function ShipWithinDays() {
  const [testCaseIdx, setTestCaseIdx] = useState(0);
  const [currentData, setCurrentData] = useState<ShipData>(
    TEST_CASES[0].data!
  );
  const [currentIdx, setCurrentIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  // Buffer states for modal
  const [tempWeightsInput, setTempWeightsInput] = useState(
    `[${TEST_CASES[0].data!.weights.join(", ")}]`
  );
  const [tempDaysInput, setTempDaysInput] = useState(
    String(TEST_CASES[0].data!.days)
  );

  const modal = useConfigModal(0);

  const handleOpenModal = () => {
    modal.openModal(() => {
      setTempWeightsInput(`[${currentData.weights.join(", ")}]`);
      setTempDaysInput(String(currentData.days));
      modal.setSelectedPresetIdx(testCaseIdx);
    });
  };

  const handleSelectPreset = (idx: number) => {
    modal.selectPreset(idx, () => {
      const tc = TEST_CASES[idx];
      if (tc?.data) {
        setTempWeightsInput(`[${tc.data.weights.join(", ")}]`);
        setTempDaysInput(String(tc.data.days));
      }
    });
  };

  const handleApplySettings = () => {
    modal.apply(() => {
      let weights = currentData.weights;
      if (tempWeightsInput.trim()) {
        const parsed = tempWeightsInput
          .replace(/^\[/, "")
          .replace(/\]$/, "")
          .split(",")
          .map((x) => Number(x.trim()))
          .filter((x) => !isNaN(x) && x > 0);
        if (parsed.length > 0) {
          weights = parsed;
        }
      }

      let days = currentData.days;
      if (tempDaysInput.trim() !== "") {
        const parsedDays = Number(tempDaysInput.trim());
        if (!isNaN(parsedDays) && parsedDays > 0) {
          days = parsedDays;
        }
      }

      if (modal.selectedPresetIdx !== null) {
        setTestCaseIdx(modal.selectedPresetIdx);
      }

      setCurrentData({ weights, days });
      setCurrentIdx(0);
      setIsPlaying(false);
    });
  };

  const frames = useMemo(() => {
    return generateFrames(currentData.weights, currentData.days);
  }, [currentData]);

  const colors = themeColors.teal;

  const minCapacity = useMemo(() => {
    return Math.max(...currentData.weights);
  }, [currentData.weights]);

  const maxCapacity = useMemo(() => {
    return currentData.weights.reduce((a, b) => a + b, 0);
  }, [currentData.weights]);

  return (
    <BinarySearchVisualizerLayout
      title="Capacity To Ship Packages Within D Days"
      theme="teal"
      frames={frames}
      code={shipWithinDaysCode}
      currentIdx={currentIdx}
      setCurrentIdx={setCurrentIdx}
      isPlaying={isPlaying}
      setIsPlaying={setIsPlaying}
      renderCanvasContent={(frame) => {
        const leftVal =
          typeof frame.variables?.left === "number"
            ? frame.variables.left
            : undefined;
        const rightVal =
          typeof frame.variables?.right === "number"
            ? frame.variables.right
            : undefined;
        const midVal =
          typeof frame.variables?.mid === "number"
            ? frame.variables.mid
            : typeof frame.variables?.midCapacity === "number"
              ? frame.variables.midCapacity
              : undefined;

        const isFeasible =
          frame.phase.toLowerCase().includes("feasible") ||
          frame.phase.toLowerCase().includes("optimal");

        return (
          <div className="w-full flex flex-col items-center gap-6 py-2">
            {/* 1. Simple Range Graph */}
            <SearchRangeGraph
              min={minCapacity}
              max={maxCapacity}
              left={leftVal}
              right={rightVal}
              mid={midVal}
              isMatch={isFeasible}
              unit="kg"
              theme="teal"
            />

            {/* 2. Arrays Rendering */}
            <div className="w-full flex flex-col items-center gap-8 py-2">
              {frame.arrays?.map((arr: any) => (
                <ArrayRenderer
                  key={arr.id}
                  arr={arr}
                  frame={frame}
                  colors={colors}
                />
              ))}
            </div>
          </div>
        );
      }}
    >
      <ConfigModal
        title="Configure Package Weights & Days"
        description="Select a preset scenario or modify package weights and days limit."
        theme="teal"
        isOpen={modal.isOpen}
        onOpenChange={modal.setIsOpen}
        onOpen={handleOpenModal}
        presets={TEST_CASES.map((tc) => ({
          id: tc.id,
          name: tc.name,
          preview: `Weights: [${tc.data!.weights.join(",")}] · Days: ${tc.data!.days}`,
        }))}
        selectedPresetIdx={modal.selectedPresetIdx}
        onSelectPreset={handleSelectPreset}
        onApply={handleApplySettings}
      >
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2 space-y-1">
              <label className="text-[11px] font-mono text-neutral-400 flex items-center gap-1">
                <Package className="w-3 h-3 text-teal-400" />
                Package Weights (comma-separated):
              </label>
              <input
                type="text"
                value={tempWeightsInput}
                onChange={(e) => {
                  setTempWeightsInput(e.target.value);
                  modal.setSelectedPresetIdx(null);
                }}
                placeholder="[1, 2, 3, 4, 5, 6, 7, 8, 9, 10]"
                className="w-full bg-neutral-950/80 border border-neutral-700/80 rounded-md px-3 py-2 text-xs font-mono text-neutral-100 focus:outline-none focus:ring-1 focus:ring-teal-500/60 focus:border-teal-500 placeholder:text-neutral-600"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-mono text-neutral-400 flex items-center gap-1">
                <Calendar className="w-3 h-3 text-teal-400" />
                Days Limit (D):
              </label>
              <input
                type="number"
                value={tempDaysInput}
                onChange={(e) => {
                  setTempDaysInput(e.target.value);
                  modal.setSelectedPresetIdx(null);
                }}
                placeholder="5"
                min="1"
                className="w-full bg-neutral-950/80 border border-neutral-700/80 rounded-md px-3 py-2 text-xs font-mono text-neutral-100 focus:outline-none focus:ring-1 focus:ring-teal-500/60 focus:border-teal-500 placeholder:text-neutral-600"
              />
            </div>
          </div>
        </div>
      </ConfigModal>
    </BinarySearchVisualizerLayout>
  );
}
