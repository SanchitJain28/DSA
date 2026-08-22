import { useMemo, useState } from "react";
import TreeVisualizerLayout from "../../components/layout/TreeVisualizerLayout";
import ConfigModal from "../../components/shared/ConfigModal";
import { useConfigModal } from "../../hooks/useConfigModal";
import { computeLayout } from "../../core/tree/layout";
import { generateFrames } from "../../core/tree/frames/widthOfBinaryTreeFrames";
import { widthOfBinaryTreeCode } from "../../core/tree/sourcecode/widthOfBinaryTree";
import { TreeNode } from "../../core/tree/TreeNode";
import { type TestCase } from "../../components/shared/TestCaseSwitcher";
import { ArrowLeftRight, Network } from "lucide-react";

interface TreeWidthData {
  array: (number | null)[];
  description: string;
}

type TreeWidthTestCase = TestCase<TreeWidthData>;

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

const TEST_CASES: TreeWidthTestCase[] = [
  {
    id: "tc1",
    name: "Classic: [1, 3, 2, 5, 3, null, 9] (Width = 4)",
    data: {
      array: [1, 3, 2, 5, 3, null, 9],
      description: "Level 3 spans from index 0 to 3 -> width 4",
    },
  },
  {
    id: "tc2",
    name: "Asymmetric: [1, 3, 2, 5, null, null, 9, 6, null, 7] (Width = 7)",
    data: {
      array: [1, 3, 2, 5, null, null, 9, 6, null, null, null, null, null, 7],
      description: "Deep asymmetric branches spanning width 7",
    },
  },
  {
    id: "tc3",
    name: "Left Leaning: [1, 3, 2, 5] (Width = 2)",
    data: {
      array: [1, 3, 2, 5],
      description: "Level 2 spans across 2 nodes -> width 2",
    },
  },
  {
    id: "tc4",
    name: "Full Binary Tree: [1, 2, 3, 4, 5, 6, 7] (Width = 4)",
    data: {
      array: [1, 2, 3, 4, 5, 6, 7],
      description: "Complete full binary tree level with 4 nodes",
    },
  },
  {
    id: "tc5",
    name: "Linear Chain: [1, 2, null, 3, null, 4] (Width = 1)",
    data: {
      array: [1, 2, null, 3, null, null, null, 4],
      description: "Single branch line with width 1 at every level",
    },
  },
  {
    id: "tc6",
    name: "Single Node: [1] (Width = 1)",
    data: {
      array: [1],
      description: "Root only tree with width 1",
    },
  },
];

export default function WidthOfBinaryTree() {
  const [testCaseIdx, setTestCaseIdx] = useState(0);
  const [currentData, setCurrentData] = useState<TreeWidthData>(
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
      title="Maximum Width of Binary Tree"
      theme="indigo"
      layout={layout}
      frames={frames}
      code={widthOfBinaryTreeCode}
      sidebarTitle="Queue"
      sidebarMode="queue"
      currentIdx={currentIdx}
      setCurrentIdx={setCurrentIdx}
      isPlaying={isPlaying}
      setIsPlaying={setIsPlaying}
    >
      <ConfigModal
        title="Configure Binary Tree Inputs"
        description="Select a preset scenario or provide level-order array representation (use 'null' for empty nodes)."
        theme="indigo"
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
          <div className="space-y-1">
            <label className="text-[11px] font-mono text-neutral-400 flex items-center gap-1">
              <Network className="w-3 h-3 text-indigo-400" />
              Level-Order Tree Array (e.g. 1, 3, 2, 5, 3, null, 9):
            </label>
            <input
              type="text"
              value={tempArrayInput}
              onChange={(e) => {
                setTempArrayInput(e.target.value);
                modal.setSelectedPresetIdx(null);
              }}
              placeholder="1, 3, 2, 5, 3, null, 9"
              className="w-full bg-neutral-950/80 border border-neutral-700/80 rounded-md px-3 py-2 text-xs font-mono text-neutral-100 focus:outline-none focus:ring-1 focus:ring-indigo-500/60 focus:border-indigo-500 placeholder:text-neutral-600"
            />
          </div>
          <div className="text-[11px] text-neutral-500 font-mono flex items-center gap-1">
            <ArrowLeftRight className="w-3 h-3 text-neutral-400" />
            Indices: Left child = 2 * idx + 1, Right child = 2 * idx + 2
          </div>
        </div>
      </ConfigModal>
    </TreeVisualizerLayout>
  );
}
