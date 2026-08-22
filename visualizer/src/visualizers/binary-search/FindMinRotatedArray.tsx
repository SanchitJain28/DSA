import { useMemo, useState } from "react";
import BinarySearchVisualizerLayout from "../../components/layout/BinarySearchVisualizerLayout";
import ConfigModal from "../../components/shared/ConfigModal";
import { useConfigModal } from "../../hooks/useConfigModal";
import { type TestCase } from "../../components/shared/TestCaseSwitcher";
import { generateFrames, type FindMinFrame } from "../../core/binary-search/frames/findMinFrames";
import { findMinCode } from "../../core/binary-search/sourcecode/findMin";
import { ArrayRenderer } from "../../components/shared/ArrayRenderer";
import { themeColors } from "../../utils/theme";
import { BarChart3, Binary } from "lucide-react";
import {
  BarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

interface FindMinData {
  nums: number[];
  description: string;
}

type FindMinTestCase = TestCase<FindMinData>;

const TEST_CASES: FindMinTestCase[] = [
  {
    id: "tc1",
    name: "Classic Rotated 4 times: [3, 4, 5, 6, 1, 2] (Min = 1)",
    data: {
      nums: [3, 4, 5, 6, 1, 2],
      description: "Inflection point occurs between 6 and 1",
    },
  },
  {
    id: "tc2",
    name: "Middle Drop: [4, 5, 6, 7, 0, 1, 2] (Min = 0)",
    data: {
      nums: [4, 5, 6, 7, 0, 1, 2],
      description: "Steep drop from 7 to 0 in the middle of array",
    },
  },
  {
    id: "tc3",
    name: "Already Sorted: [11, 13, 15, 17] (Min = 11)",
    data: {
      nums: [11, 13, 15, 17],
      description: "0 rotations, left-most element is the minimum",
    },
  },
  {
    id: "tc4",
    name: "Rotated 1 time: [2, 3, 4, 5, 1] (Min = 1)",
    data: {
      nums: [2, 3, 4, 5, 1],
      description: "Last element is the minimum",
    },
  },
  {
    id: "tc5",
    name: "Two Elements: [2, 1] (Min = 1)",
    data: {
      nums: [2, 1],
      description: "Simple 2-element inverted array",
    },
  },
  {
    id: "tc6",
    name: "Single Element: [1] (Min = 1)",
    data: {
      nums: [1],
      description: "Base single element array",
    },
  },
  {
    id: "tc7",
    name: "With Negatives: [4, 5, -3, -2, -1, 0, 1, 2, 3] (Min = -3)",
    data: {
      nums: [4, 5, -3, -2, -1, 0, 1, 2, 3],
      description: "Array containing negative integers",
    },
  },
];

export default function FindMinRotatedArray() {
  const [testCaseIdx, setTestCaseIdx] = useState(0);
  const [currentData, setCurrentData] = useState<FindMinData>(
    TEST_CASES[0].data!
  );

  const [currentIdx, setCurrentIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  // Buffer state for custom inputs in modal
  const [tempNumsInput, setTempNumsInput] = useState(
    `[${TEST_CASES[0].data!.nums.join(", ")}]`
  );

  const modal = useConfigModal(0);
  const colors = themeColors.sky;

  const handleOpenModal = () => {
    modal.openModal(() => {
      setTempNumsInput(`[${currentData.nums.join(", ")}]`);
      modal.setSelectedPresetIdx(testCaseIdx);
    });
  };

  const handleSelectPreset = (idx: number) => {
    modal.selectPreset(idx, () => {
      const tc = TEST_CASES[idx];
      if (tc?.data) {
        setTempNumsInput(`[${tc.data.nums.join(", ")}]`);
      }
    });
  };

  const handleApplySettings = () => {
    modal.apply(() => {
      let nums = currentData.nums;

      if (tempNumsInput.trim()) {
        const parsed = tempNumsInput
          .replace(/^\[/, "")
          .replace(/\]$/, "")
          .split(",")
          .map((x) => Number(x.trim()))
          .filter((x) => !isNaN(x));

        if (parsed.length > 0) {
          nums = parsed;
        }
      }

      if (modal.selectedPresetIdx !== null) {
        setTestCaseIdx(modal.selectedPresetIdx);
      }

      setCurrentData({
        nums,
        description: `Custom array with ${nums.length} items`,
      });
      setCurrentIdx(0);
      setIsPlaying(false);
    });
  };

  const frames = useMemo(() => {
    return generateFrames(currentData.nums);
  }, [currentData.nums]);

  // Transform data for Recharts discrete vertical poles
  const chartData = useMemo(() => {
    return currentData.nums.map((val, idx) => ({
      index: idx,
      label: `[${idx}]`,
      value: val,
    }));
  }, [currentData.nums]);

  return (
    <BinarySearchVisualizerLayout
      title="Find Minimum in Rotated Sorted Array"
      theme="sky"
      frames={frames}
      code={findMinCode}
      currentIdx={currentIdx}
      setCurrentIdx={setCurrentIdx}
      isPlaying={isPlaying}
      setIsPlaying={setIsPlaying}
      renderCanvasContent={(frame: FindMinFrame) => {
        const { leftIndex, rightIndex, midIndex, status } = frame;
        const rightVal = rightIndex >= 0 ? currentData.nums[rightIndex] : undefined;

        return (
          <div className="flex flex-col items-center gap-6 select-none w-fit">
            {/* 1. Recharts Discrete Poles Bar Chart */}
            <div className="bg-transparent border border-neutral-800/80 rounded-md p-4 flex flex-col items-center gap-3 w-[560px] shadow-sm">
              <div className="flex items-center justify-between w-full border-b border-neutral-800/60 pb-2">
                <div className="flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-sky-400" />
                  <span className="text-xs font-mono font-bold uppercase tracking-wider text-neutral-300">
                    Rotated Array Values Profile
                  </span>
                </div>
                {rightVal !== undefined && (
                  <span className="text-[11px] font-mono text-neutral-400">
                    Threshold <span className="text-amber-400 font-semibold">nums[R] = {rightVal}</span>
                  </span>
                )}
              </div>

              {/* Bar Chart Container */}
              <div className="w-full h-44 pt-2">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={chartData}
                    margin={{ top: 10, right: 15, left: -20, bottom: 0 }}
                  >
                    <XAxis
                      dataKey="label"
                      stroke="#52525b"
                      fontSize={10}
                      fontFamily="monospace"
                      tickLine={false}
                    />
                    <YAxis
                      stroke="#52525b"
                      fontSize={10}
                      fontFamily="monospace"
                      tickLine={false}
                      domain={["auto", "auto"]}
                    />
                    <Tooltip
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          const data = payload[0].payload;
                          return (
                            <div className="bg-neutral-900 border border-neutral-700 px-2 py-1 rounded text-[11px] font-mono text-neutral-200">
                              <span>Index #{data.index}: <strong>{data.value}</strong></span>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    {rightVal !== undefined && (
                      <ReferenceLine
                        y={rightVal}
                        stroke="#f59e0b"
                        strokeDasharray="4 4"
                        strokeWidth={1.5}
                      />
                    )}
                    <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                      {chartData.map((entry) => {
                        const idx = entry.index;
                        const isLeft = idx === leftIndex;
                        const isRight = idx === rightIndex;
                        const isMid = idx === midIndex;
                        const isEliminated = idx < leftIndex || idx > rightIndex;
                        const isFound = status === "found" && isLeft;

                        let fillColor = "#3f3f46"; // Active range neutral
                        if (isFound) {
                          fillColor = "#10b981"; // Emerald found
                        } else if (isMid) {
                          fillColor = "#38bdf8"; // Cyan Mid
                        } else if (isRight) {
                          fillColor = "#f59e0b"; // Amber Right
                        } else if (isLeft) {
                          fillColor = "#6366f1"; // Indigo Left
                        } else if (isEliminated) {
                          fillColor = "#27272a"; // Dimmed eliminated
                        }

                        return (
                          <Cell
                            key={`bar-cell-${idx}`}
                            fill={fillColor}
                            opacity={isEliminated ? 0.3 : 1}
                          />
                        );
                      })}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* 2. Standard Shared ArrayRenderer Component */}
            <div className="w-full flex flex-col items-center justify-center pt-2 pb-6">
              {frame.arrays?.map((arr) => (
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
        title="Configure Rotated Sorted Array"
        description="Select a preset scenario or provide a custom rotated sorted array."
        theme="sky"
        isOpen={modal.isOpen}
        onOpenChange={modal.setIsOpen}
        onOpen={handleOpenModal}
        presets={TEST_CASES.map((tc) => ({
          id: tc.id,
          name: tc.name,
          preview: `[${tc.data!.nums.join(", ")}]`,
        }))}
        selectedPresetIdx={modal.selectedPresetIdx}
        onSelectPreset={handleSelectPreset}
        onApply={handleApplySettings}
      >
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Binary className="w-4 h-4 text-sky-400" />
              <label className="text-xs font-mono font-semibold text-neutral-300">
                Rotated Sorted Array (comma-separated)
              </label>
            </div>
            <input
              type="text"
              value={tempNumsInput}
              onChange={(e) => setTempNumsInput(e.target.value)}
              placeholder="3, 4, 5, 6, 1, 2"
              className="w-full bg-neutral-950/80 border border-neutral-800 rounded-md px-3 py-2 text-xs font-mono text-neutral-200 focus:outline-none focus:border-sky-500/80"
            />
            <p className="text-[11px] font-mono text-neutral-500">
              Input format: unique integers originally sorted and rotated.
            </p>
          </div>
        </div>
      </ConfigModal>
    </BinarySearchVisualizerLayout>
  );
}
