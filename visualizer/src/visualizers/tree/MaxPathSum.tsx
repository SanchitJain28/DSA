import { useMemo, useState } from "react";
import TreeVisualizerLayout from "../../components/layout/TreeVisualizerLayout";
import ConfigModal from "../../components/shared/ConfigModal";
import { useConfigModal } from "../../hooks/useConfigModal";
import { computeLayout } from "../../core/tree/layout";
import { generateFrames } from "../../core/tree/frames/maxPathSumFrames";
import { maxPathSumCode } from "../../core/tree/sourcecode/maxPathSum";
import { TreeNode } from "../../core/tree/TreeNode";
import { type TestCase } from "../../components/shared/TestCaseSwitcher";
import { Network } from "lucide-react";

interface MaxPathSumData {
  array: (number | null)[];
  description: string;
}

type MaxPathSumTestCase = TestCase<MaxPathSumData>;

function buildTreeFromArray(arr: (number | null)[]): TreeNode | null {
  if (!arr || arr.length === 0 || arr[0] === null) return null;
  const root = new TreeNode(arr[0], "node_0");
  const queue: TreeNode[] = [root];
  let i = 1;
  while (queue.length > 0 && i < arr.length) {
    const curr = queue.shift()!;
    if (i < arr.length && arr[i] !== null) {
      curr.left = new TreeNode(arr[i]!, `node_${i}`);
      queue.push(curr.left);
    }
    i++;
    if (i < arr.length && arr[i] !== null) {
      curr.right = new TreeNode(arr[i]!, `node_${i}`);
      queue.push(curr.right);
    }
    i++;
  }
  return root;
}

const TEST_CASES: MaxPathSumTestCase[] = [
  {
    id: "tc1",
    name: "Classic: [-10, 9, 20, null, null, 15, 7] (Max Sum = 42)",
    data: {
      array: [-10, 9, 20, null, null, 15, 7],
      description: "Optimal path traverses through 15 -> 20 -> 7 with max path sum 42",
    },
  },
  {
    id: "tc2",
    name: "Simple Tree: [1, 2, 3] (Max Sum = 6)",
    data: {
      array: [1, 2, 3],
      description: "Path 2 -> 1 -> 3 gives 2 + 1 + 3 = 6",
    },
  },
  {
    id: "tc3",
    name: "Single Negative: [-3] (Max Sum = -3)",
    data: {
      array: [-3],
      description: "Single negative node must return its value -3",
    },
  },
  {
    id: "tc4",
    name: "All Negative: [-2, -1] (Max Sum = -1)",
    data: {
      array: [-2, -1],
      description: "Negative branches pruned with Math.max(0, ...), peak is node -1",
    },
  },
  {
    id: "tc5",
    name: "Deep Zigzag: [5, 4, 8, 11, null, 13, 4, 7, 2, null, null, null, 1] (Max Sum = 48)",
    data: {
      array: [5, 4, 8, 11, null, 13, 4, 7, 2, null, null, null, null, null, 1],
      description: "Complex multi-level tree path yielding maximum sum 48",
    },
  },
  {
    id: "tc6",
    name: "Branch Pruning: [2, -1] (Max Sum = 2)",
    data: {
      array: [2, -1],
      description: "Left branch -1 contributes 0 (pruned), path sum is 2",
    },
  },
];

export default function MaxPathSum() {
  const [testCaseIdx, setTestCaseIdx] = useState(0);
  const [currentData, setCurrentData] = useState<MaxPathSumData>(
    TEST_CASES[0].data!
  );

  const [tempArrayInput, setTempArrayInput] = useState(
    TEST_CASES[0].data!.array.map((x) => (x === null ? "null" : x)).join(", ")
  );

  const [currentIdx, setCurrentIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const modal = useConfigModal(0);

  const handleOpenModal = () => {
    modal.openModal(() => {
      setTempArrayInput(
        currentData.array.map((x) => (x === null ? "null" : x)).join(", ")
      );
      modal.setSelectedPresetIdx(testCaseIdx);
    });
  };

  const handleSelectPreset = (idx: number) => {
    modal.selectPreset(idx, () => {
      const tc = TEST_CASES[idx];
      setTempArrayInput(
        tc.data!.array.map((x) => (x === null ? "null" : x)).join(", ")
      );
    });
  };

  const handleApplySettings = () => {
    modal.apply(() => {
      let array = currentData.array;

      if (tempArrayInput.trim() !== "") {
        const parsed = tempArrayInput
          .replace(/^\[/, "")
          .replace(/\]$/, "")
          .split(",")
          .map((item) => {
            const trimmed = item.trim().toLowerCase();
            if (trimmed === "null" || trimmed === "none" || trimmed === "#" || trimmed === "") {
              return null;
            }
            const num = Number(trimmed);
            return isNaN(num) ? null : num;
          });
        if (parsed.length > 0 && parsed[0] !== null) {
          array = parsed;
        }
      }

      if (modal.selectedPresetIdx !== null) {
        setTestCaseIdx(modal.selectedPresetIdx);
      }

      setCurrentData({
        array,
        description: "Custom tree configuration",
      });
      setCurrentIdx(0);
      setIsPlaying(false);
    });
  };

  const treeRoot = useMemo(() => {
    return buildTreeFromArray(currentData.array);
  }, [currentData.array]);

  const frames = useMemo(() => {
    return generateFrames(treeRoot);
  }, [treeRoot]);

  const layout = useMemo(() => {
    return treeRoot ? computeLayout(treeRoot) : { nodes: [], edges: [] };
  }, [treeRoot]);

  return (
    <TreeVisualizerLayout
      title="Binary Tree Maximum Path Sum"
      theme="emerald"
      layout={layout}
      frames={frames}
      code={maxPathSumCode}
      sidebarTitle="Recursion Stack"
      sidebarMode="stack"
      currentIdx={currentIdx}
      setCurrentIdx={setCurrentIdx}
      isPlaying={isPlaying}
      setIsPlaying={setIsPlaying}
    >
      <ConfigModal
        title="Configure Binary Tree Inputs"
        description="Select a preset scenario or provide level-order array representation (use 'null' for empty nodes)."
        theme="emerald"
        isOpen={modal.isOpen}
        onOpenChange={modal.setIsOpen}
        onOpen={handleOpenModal}
        presets={TEST_CASES.map((tc) => ({
          id: tc.id,
          name: tc.name,
          preview: `[${tc.data!.array.map((x) => (x === null ? "null" : x)).join(", ")}]`,
        }))}
        selectedPresetIdx={modal.selectedPresetIdx}
        onSelectPreset={handleSelectPreset}
        onApply={handleApplySettings}
      >
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Network className="w-4 h-4 text-emerald-400" />
              <label className="text-xs font-mono font-semibold text-neutral-300">
                Level-Order Tree Array (null for empty nodes)
              </label>
            </div>
            <input
              type="text"
              value={tempArrayInput}
              onChange={(e) => setTempArrayInput(e.target.value)}
              placeholder="-10, 9, 20, null, null, 15, 7"
              className="w-full bg-neutral-950/80 border border-neutral-800 rounded-md px-3 py-2 text-xs font-mono text-neutral-200 focus:outline-none focus:border-emerald-500/80"
            />
            <p className="text-[11px] font-mono text-neutral-500">
              Input format: comma-separated numbers in breadth-first / level-order sequence.
            </p>
          </div>
        </div>
      </ConfigModal>
    </TreeVisualizerLayout>
  );
}
