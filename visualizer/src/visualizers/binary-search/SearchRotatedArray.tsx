import { useMemo, useState } from "react";
import BinarySearchVisualizerLayout from "../../components/layout/BinarySearchVisualizerLayout";
import ConfigModal from "../../components/shared/ConfigModal";
import { useConfigModal } from "../../hooks/useConfigModal";
import { type TestCase } from "../../components/shared/TestCaseSwitcher";
import { generateFrames, type SearchRotatedFrame } from "../../core/binary-search/frames/searchRotatedFrames";
import { searchRotatedCode } from "../../core/binary-search/sourcecode/searchRotated";
import { ArrayRenderer } from "../../components/shared/ArrayRenderer";
import { themeColors } from "../../utils/theme";
import { BarChart3, Binary, Target } from "lucide-react";
import {
  BarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

interface SearchRotatedData {
  nums: number[];
  target: number;
}

type SearchRotatedTestCase = TestCase<SearchRotatedData>;

const TEST_CASES: SearchRotatedTestCase[] = [
  {
    id: "tc1",
    name: "Classic: [3, 4, 5, 6, 1, 2] (Target 1 - Found at 4)",
    data: {
      nums: [3, 4, 5, 6, 1, 2],
      target: 1,
    },
  },
  {
    id: "tc2",
    name: "Target in Left Portion: [4, 5, 6, 7, 0, 1, 2] (Target 5 - Found at 1)",
    data: {
      nums: [4, 5, 6, 7, 0, 1, 2],
      target: 5,
    },
  },
  {
    id: "tc3",
    name: "Target Absent: [3, 5, 6, 0, 1, 2] (Target 4 - Not Found)",
    data: {
      nums: [3, 5, 6, 0, 1, 2],
      target: 4,
    },
  },
  {
    id: "tc4",
    name: "Single Element Present: [1] (Target 1 - Found at 0)",
    data: {
      nums: [1],
      target: 1,
    },
  },
  {
    id: "tc5",
    name: "Single Element Absent: [1] (Target 0 - Not Found)",
    data: {
      nums: [1],
      target: 0,
    },
  },
  {
    id: "tc6",
    name: "Already Sorted: [11, 13, 15, 17, 19] (Target 17 - Found at 3)",
    data: {
      nums: [11, 13, 15, 17, 19],
      target: 17,
    },
  },
  {
    id: "tc7",
    name: "With Negatives: [4, 5, -3, -2, -1, 0, 1, 2] (Target -2 - Found at 3)",
    data: {
      nums: [4, 5, -3, -2, -1, 0, 1, 2],
      target: -2,
    },
  },
];

export default function SearchRotatedArray() {
  const [testCaseIdx, setTestCaseIdx] = useState(0);
  const [currentData, setCurrentData] = useState<SearchRotatedData>(
    TEST_CASES[0].data!
  );

  const [currentIdx, setCurrentIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  // Buffer state for custom inputs in modal
  const [tempNumsInput, setTempNumsInput] = useState(
    `[${TEST_CASES[0].data!.nums.join(", ")}]`
  );
  const [tempTargetInput, setTempTargetInput] = useState(
    String(TEST_CASES[0].data!.target)
  );

  const modal = useConfigModal(0);
  const colors = themeColors.sky;

  const handleOpenModal = () => {
    modal.openModal(() => {
      setTempNumsInput(`[${currentData.nums.join(", ")}]`);
      setTempTargetInput(String(currentData.target));
      modal.setSelectedPresetIdx(testCaseIdx);
    });
  };

  const handleSelectPreset = (idx: number) => {
    modal.selectPreset(idx, () => {
      const tc = TEST_CASES[idx];
      if (tc?.data) {
        setTempNumsInput(`[${tc.data.nums.join(", ")}]`);
        setTempTargetInput(String(tc.data.target));
      }
    });
  };

  const handleApplySettings = () => {
    modal.apply(() => {
      let nums = currentData.nums;
      let target = currentData.target;

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

      const parsedTarget = Number(tempTargetInput);
      if (!isNaN(parsedTarget)) {
        target = parsedTarget;
      }

      if (modal.selectedPresetIdx !== null) {
        setTestCaseIdx(modal.selectedPresetIdx);
      }

      setCurrentData({ nums, target });
      setCurrentIdx(0);
      setIsPlaying(false);
    });
  };

  const frames = useMemo(() => {
    return generateFrames(currentData.nums, currentData.target);
  }, [currentData.nums, currentData.target]);

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
      title="Search in Rotated Sorted Array"
      theme="sky"
      frames={frames}
      code={searchRotatedCode}
      currentIdx={currentIdx}
      setCurrentIdx={setCurrentIdx}
      isPlaying={isPlaying}
      setIsPlaying={setIsPlaying}
      renderCanvasContent={(frame: SearchRotatedFrame) => {
        const { leftIndex, rightIndex, midIndex, minIndex, status } = frame;

        return (
          <div className="flex flex-col items-center gap-6 select-none w-fit pb-6">
            {/* 1. Recharts Discrete Poles Bar Chart */}
            <div className="bg-transparent border border-neutral-800/80 rounded-md p-4 flex flex-col items-center gap-3 w-[560px] shadow-sm">
              <div className="flex items-center justify-between w-full border-b border-neutral-800/60 pb-2">
                <div className="flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-sky-400" />
                  <span className="text-xs font-mono font-bold uppercase tracking-wider text-neutral-300">
                    Rotated Array Values Profile
                  </span>
                </div>
                <div className="flex items-center gap-2 text-[11px] font-mono text-neutral-400">
                  <span>Target: <strong className="text-sky-300 font-bold">{currentData.target}</strong></span>
                  {minIndex !== null && (
                    <span className="text-neutral-500">| Pivot: <strong className="text-amber-400">#{minIndex}</strong></span>
                  )}
                </div>
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
                    <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                      {chartData.map((entry) => {
                        const idx = entry.index;
                        const isLeft = idx === leftIndex;
                        const isRight = idx === rightIndex;
                        const isMid = idx === midIndex;
                        const isMin = idx === minIndex;
                        const isEliminated = frame.eliminatedIndices?.includes(idx);
                        const isMatch = status === "found" && isMid;

                        let fillColor = "#3f3f46"; // Active range neutral
                        if (isMatch) {
                          fillColor = "#10b981"; // Emerald Match
                        } else if (isMid) {
                          fillColor = "#38bdf8"; // Cyan Mid
                        } else if (isMin && status !== "searching") {
                          fillColor = "#f59e0b"; // Amber Pivot
                        } else if (isRight) {
                          fillColor = "#14b8a6"; // Teal Right
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
            <div className="w-full flex flex-col items-center justify-center pt-2">
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
        title="Configure Rotated Sorted Array & Target"
        description="Select a preset scenario or provide custom array and target value."
        theme="sky"
        isOpen={modal.isOpen}
        onOpenChange={modal.setIsOpen}
        onOpen={handleOpenModal}
        presets={TEST_CASES.map((tc) => ({
          id: tc.id,
          name: tc.name,
          preview: `Target: ${tc.data!.target} · Array: [${tc.data!.nums.join(", ")}]`,
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
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Target className="w-4 h-4 text-sky-400" />
              <label className="text-xs font-mono font-semibold text-neutral-300">
                Target Value
              </label>
            </div>
            <input
              type="number"
              value={tempTargetInput}
              onChange={(e) => setTempTargetInput(e.target.value)}
              placeholder="1"
              className="w-full bg-neutral-950/80 border border-neutral-800 rounded-md px-3 py-2 text-xs font-mono text-neutral-200 focus:outline-none focus:border-sky-500/80"
            />
          </div>
        </div>
      </ConfigModal>
    </BinarySearchVisualizerLayout>
  );
}
