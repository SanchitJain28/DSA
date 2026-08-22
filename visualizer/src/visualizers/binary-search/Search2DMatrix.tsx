import { useMemo, useState } from "react";
import BinarySearchVisualizerLayout from "../../components/layout/BinarySearchVisualizerLayout";
import ConfigModal from "../../components/shared/ConfigModal";
import { useConfigModal } from "../../hooks/useConfigModal";
import { type TestCase } from "../../components/shared/TestCaseSwitcher";
import { generateFrames, type SearchMatrixFrame } from "../../core/binary-search/frames/searchMatrixFrames";
import { searchMatrixCode } from "../../core/binary-search/sourcecode/searchMatrix";
import { ArrayRenderer } from "../../components/shared/ArrayRenderer";
import { themeColors } from "../../utils/theme";
import { Grid, Target } from "lucide-react";

interface SearchMatrixData {
  matrix: number[][];
  target: number;
}

type SearchMatrixTestCase = TestCase<SearchMatrixData>;

const TEST_CASES: SearchMatrixTestCase[] = [
  {
    id: "tc1",
    name: "Classic: 3x4 Matrix (Target 10 - Found)",
    data: {
      matrix: [
        [1, 2, 4, 8],
        [10, 11, 12, 13],
        [14, 20, 30, 40],
      ],
      target: 10,
    },
  },
  {
    id: "tc2",
    name: "Classic: 3x4 Matrix (Target 15 - Absent)",
    data: {
      matrix: [
        [1, 2, 4, 8],
        [10, 11, 12, 13],
        [14, 20, 30, 40],
      ],
      target: 15,
    },
  },
  {
    id: "tc3",
    name: "First Element (Target 1)",
    data: {
      matrix: [
        [1, 3, 5, 7],
        [10, 11, 16, 20],
        [23, 30, 34, 60],
      ],
      target: 1,
    },
  },
  {
    id: "tc4",
    name: "Last Element (Target 60)",
    data: {
      matrix: [
        [1, 3, 5, 7],
        [10, 11, 16, 20],
        [23, 30, 34, 60],
      ],
      target: 60,
    },
  },
  {
    id: "tc5",
    name: "Single 1x1 Matrix (Target 1)",
    data: {
      matrix: [[1]],
      target: 1,
    },
  },
  {
    id: "tc6",
    name: "Single Row Matrix (Target 7)",
    data: {
      matrix: [[1, 3, 5, 7, 9, 11]],
      target: 7,
    },
  },
  {
    id: "tc7",
    name: "Single Column Matrix (Target 20)",
    data: {
      matrix: [[2], [5], [9], [15], [20], [35]],
      target: 20,
    },
  },
];

export default function Search2DMatrix() {
  const [testCaseIdx, setTestCaseIdx] = useState(0);
  const [currentData, setCurrentData] = useState<SearchMatrixData>(
    TEST_CASES[0].data!
  );

  const [currentIdx, setCurrentIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  // Buffer state for custom inputs in modal
  const [tempMatrixInput, setTempMatrixInput] = useState(
    JSON.stringify(TEST_CASES[0].data!.matrix)
  );
  const [tempTargetInput, setTempTargetInput] = useState(
    String(TEST_CASES[0].data!.target)
  );

  const modal = useConfigModal(0);
  const colors = themeColors.sky;

  const handleOpenModal = () => {
    modal.openModal(() => {
      setTempMatrixInput(JSON.stringify(currentData.matrix));
      setTempTargetInput(String(currentData.target));
      modal.setSelectedPresetIdx(testCaseIdx);
    });
  };

  const handleSelectPreset = (idx: number) => {
    modal.selectPreset(idx, () => {
      const tc = TEST_CASES[idx];
      if (tc?.data) {
        setTempMatrixInput(JSON.stringify(tc.data.matrix));
        setTempTargetInput(String(tc.data.target));
      }
    });
  };

  const handleApplySettings = () => {
    modal.apply(() => {
      let matrix = currentData.matrix;
      let target = currentData.target;

      try {
        const parsedMatrix = JSON.parse(tempMatrixInput);
        if (
          Array.isArray(parsedMatrix) &&
          parsedMatrix.length > 0 &&
          Array.isArray(parsedMatrix[0])
        ) {
          matrix = parsedMatrix;
        } else {
          throw new Error("Invalid 2D array");
        }
      } catch (err) {
        alert("Invalid matrix JSON format. Example: [[1, 2, 4], [10, 11, 12]]");
        return;
      }

      const parsedTarget = Number(tempTargetInput);
      if (!isNaN(parsedTarget)) {
        target = parsedTarget;
      }

      if (modal.selectedPresetIdx !== null) {
        setTestCaseIdx(modal.selectedPresetIdx);
      }

      setCurrentData({ matrix, target });
      setCurrentIdx(0);
      setIsPlaying(false);
    });
  };

  const frames = useMemo(() => {
    return generateFrames(currentData.matrix, currentData.target);
  }, [currentData.matrix, currentData.target]);

  const m = currentData.matrix.length;
  const n = m > 0 ? currentData.matrix[0].length : 0;

  return (
    <BinarySearchVisualizerLayout
      title="Search a 2D Matrix"
      theme="sky"
      frames={frames}
      code={searchMatrixCode}
      currentIdx={currentIdx}
      setCurrentIdx={setCurrentIdx}
      isPlaying={isPlaying}
      setIsPlaying={setIsPlaying}
      renderCanvasContent={(frame: SearchMatrixFrame) => {
        const rowArrays = frame.arrays ? frame.arrays.filter((a) => a.id.startsWith("row-")) : [];
        const flattenedArr = frame.arrays ? frame.arrays.find((a) => a.id === "flattened") : undefined;

        return (
          <div className="flex flex-col items-center gap-6 select-none w-fit pb-6">
            {/* 1. 2D Matrix Rows using standard ArrayRenderer */}
            <div className="bg-transparent border border-neutral-800/80 rounded-md p-4 flex flex-col items-center gap-4 shadow-sm w-fit">
              <div className="flex items-center gap-2 self-start border-b border-neutral-800/60 pb-2 w-full">
                <Grid className="w-4 h-4 text-sky-400" />
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-neutral-300">
                  2D Sorted Matrix ({m} × {n})
                </span>
              </div>

              {/* Rows */}
              <div className="flex flex-col gap-3 items-center">
                {rowArrays.map((arr) => (
                  <ArrayRenderer
                    key={arr.id}
                    arr={arr}
                    frame={frame}
                    colors={colors}
                  />
                ))}
              </div>
            </div>

            {/* 2. 1D Flattened Virtual Array using standard ArrayRenderer */}
            {flattenedArr && (
              <div className="bg-transparent border border-neutral-800/80 rounded-md p-4 flex flex-col items-center gap-3 shadow-sm w-fit">
                <ArrayRenderer
                  arr={flattenedArr}
                  frame={frame}
                  colors={colors}
                />
              </div>
            )}
          </div>
        );
      }}
    >
      <ConfigModal
        title="Configure 2D Matrix & Target"
        description="Select a preset scenario or provide custom 2D matrix JSON array and target value."
        theme="sky"
        isOpen={modal.isOpen}
        onOpenChange={modal.setIsOpen}
        onOpen={handleOpenModal}
        presets={TEST_CASES.map((tc) => ({
          id: tc.id,
          name: tc.name,
          preview: `target: ${tc.data!.target} | matrix: ${JSON.stringify(tc.data!.matrix)}`,
        }))}
        selectedPresetIdx={modal.selectedPresetIdx}
        onSelectPreset={handleSelectPreset}
        onApply={handleApplySettings}
      >
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Grid className="w-4 h-4 text-sky-400" />
              <label className="text-xs font-mono font-semibold text-neutral-300">
                2D Matrix (JSON array of rows)
              </label>
            </div>
            <textarea
              rows={4}
              value={tempMatrixInput}
              onChange={(e) => setTempMatrixInput(e.target.value)}
              placeholder="[[1, 3, 5], [10, 11, 16], [23, 30, 34]]"
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
              placeholder="10"
              className="w-full bg-neutral-950/80 border border-neutral-800 rounded-md px-3 py-2 text-xs font-mono text-neutral-200 focus:outline-none focus:border-sky-500/80"
            />
          </div>
        </div>
      </ConfigModal>
    </BinarySearchVisualizerLayout>
  );
}
