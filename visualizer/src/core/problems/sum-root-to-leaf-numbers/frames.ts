import { FrameBuilder } from "../../shared/FrameBuilder";
import type { Scene } from "../../shared/types";
import { TreeNode } from "../../structures/tree/TreeNode";
import { buildTreeFromLevelOrder, toTreeState } from "../../structures/tree/helpers";

export function generateFrames(data: { values: (number | null)[] }): Scene[] {
  const values = data.values || [];
  const builder = new FrameBuilder<Scene>();
  const root = buildTreeFromLevelOrder(values);

  const callStack: string[] = [];
  const leafNumbers: number[] = [];
  const pathNodes: TreeNode[] = [];
  const baseTreeState = toTreeState(root);

  const pushFrame = (
    activeNodeId: string | null,
    phase: string,
    codeLine: number,
    explanation: string,
    curr: number,
  ) => {
    const totalSum = leafNumbers.reduce((a, b) => a + b, 0);
    const pathStr = pathNodes.map((n) => n.val).join(" -> ");

    builder.pushFrame({
      phase,
      codeLine,
      explanation,
      callStack: [...callStack],
      structures: {
        tree: {
          ...baseTreeState,
          activeNodeId,
        },
      },
      variables: {
        curr,
        currentPath: pathStr ? pathStr : "empty",
        numbersFound: `[${leafNumbers.join(", ")}]`,
        totalSum,
      },
    });
  };

  pushFrame(null, "Initialization", 1, "Start sumNumbers calculation.", 0);

  if (!root) {
    pushFrame(null, "Empty Tree", 3, "Root is null. Total sum is 0.", 0);
    return builder.getFrames();
  }

  function dfs(node: TreeNode | null, parentId: string | null, side: string, curr: number): number {
    if (!node) {
      callStack.push("dfs(null)");
      const nullId = `${parentId}-${side}-null`;
      pushFrame(
        nullId,
        "Base Case (null)",
        3,
        `Branch reached null from ${parentId}. Returning 0.`,
        curr,
      );
      callStack.pop();
      return 0;
    }

    callStack.push(`dfs(${node.val}, curr=${curr})`);
    const id = node.id;

    // Compute curr
    const prevCurr = curr;
    curr = curr * 10 + node.val;
    pathNodes.push(node);

    pushFrame(
      id,
      "Accumulate Number",
      4,
      `Updated number: (${prevCurr} × 10) + ${node.val} = ${curr}. Current path: ${pathNodes
        .map((n) => n.val)
        .join(" -> ")}.`,
      curr,
    );

    const isLeaf = !node.left && !node.right;

    pushFrame(
      id,
      "Check Leaf Node",
      5,
      `Checking if Node(${node.val}) is a leaf node. Is leaf? ${isLeaf ? "Yes" : "No"}.`,
      curr,
    );

    if (isLeaf) {
      leafNumbers.push(curr);
      pushFrame(
        id,
        "Leaf Reached",
        5,
        `Leaf reached! Path number formed is ${curr}. Total sum is now ${leafNumbers.reduce(
          (a, b) => a + b,
          0,
        )}.`,
        curr,
      );

      pathNodes.pop();
      callStack.pop();
      return curr;
    }

    // Left child
    pushFrame(
      id,
      "Recurse Left",
      6,
      `Recurse into left child of Node(${node.val}) with curr = ${curr}.`,
      curr,
    );
    const leftSum = dfs(node.left, id, "left", curr);

    // Right child
    pushFrame(
      id,
      "Recurse Right",
      6,
      `Left subtree of Node(${node.val}) returned ${leftSum}. Recurse into right child with curr = ${curr}.`,
      curr,
    );
    const rightSum = dfs(node.right, id, "right", curr);

    const subtreeSum = leftSum + rightSum;
    pathNodes.pop();

    pushFrame(
      id,
      "Aggregate Subtree",
      6,
      `Subtree at Node(${node.val}) total: left (${leftSum}) + right (${rightSum}) = ${subtreeSum}.`,
      curr,
    );

    callStack.pop();
    return subtreeSum;
  }

  const finalTotal = dfs(root, null, "root", 0);

  pushFrame(
    root.id,
    "Finished",
    8,
    `Finished traversal! Total sum of all root-to-leaf numbers is ${finalTotal}.`,
    finalTotal,
  );

  return builder.getFrames();
}

export default generateFrames;
