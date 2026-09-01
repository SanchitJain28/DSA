import { FrameBuilder } from "../../shared/FrameBuilder";
import type { Scene } from "../../shared/types";
import { TreeNode } from "../../structures/tree/TreeNode";
import { buildTreeFromLevelOrder, toTreeState } from "../../structures/tree/helpers";

export function generateFrames(data: {
  values: (number | null)[];
  k: number;
}): Scene[] {
  const values = data.values || [];
  const { k } = data;
  const builder = new FrameBuilder<Scene>();
  const root = buildTreeFromLevelOrder(values);

  const callStack: string[] = [];
  const visitedInorder: number[] = [];
  let count = 0;
  let result: number | null = null;
  let foundTargetId: string | null = null;
  const baseTreeState = toTreeState(root);

  const pushFrame = (
    activeNodeId: string | null,
    phase: string,
    codeLine: number,
    explanation: string,
  ) => {
    const treeNodes = baseTreeState.nodes.map((n) => {
      if (foundTargetId && n.id === foundTargetId) {
        return { ...n, status: "success" as const };
      }
      if (visitedInorder.includes(Number(n.val))) {
        return { ...n, status: "secondary" as const };
      }
      return n;
    });

    builder.pushFrame({
      phase,
      codeLine,
      explanation,
      callStack: [...callStack],
      structures: {
        tree: {
          nodes: treeNodes,
          edges: baseTreeState.edges,
          activeNodeId,
        },
      },
      variables: {
        k,
        count,
        inorderVisited: `[${visitedInorder.join(", ")}]`,
        result: result !== null ? result : "not found yet",
      },
    });
  };

  pushFrame(
    null,
    "Initialization",
    1,
    `Start kthSmallest with k = ${k}. In-order traversal visits BST nodes in strictly ascending order.`,
  );

  if (!root) {
    pushFrame(null, "Empty Tree", 4, "Root is null. Returning 0.");
    return builder.getFrames();
  }

  function dfs(node: TreeNode | null, parentId: string | null, side: string) {
    if (!node || result !== null) {
      if (!node) {
        callStack.push("dfs(null)");
        const nullId = `${parentId}-${side}-null`;
        pushFrame(
          nullId,
          "Base Case (null)",
          4,
          `Reached null branch from ${parentId}. Returning.`,
        );
        callStack.pop();
      }
      return;
    }

    callStack.push(`dfs(${node.val})`);
    const id = node.id;

    // Recurse left
    pushFrame(
      id,
      "Recurse Left",
      5,
      `Traversing left subtree of Node(${node.val}) to find smaller elements.`,
    );
    dfs(node.left, id, "left");

    if (result !== null) {
      callStack.pop();
      return;
    }

    // In-order step
    count++;
    visitedInorder.push(node.val);

    pushFrame(
      id,
      "In-Order Visit",
      6,
      `In-order visit on Node(${node.val}). count is now ${count}. (Visited in order: [${visitedInorder.join(
        ", ",
      )}]).`,
    );

    if (count === k) {
      result = node.val;
      foundTargetId = id;
      pushFrame(
        id,
        "Target Found!",
        7,
        `count (${count}) === k (${k})! Found the ${k}-th smallest element: ${result}!`,
      );
      callStack.pop();
      return;
    }

    // Recurse right
    pushFrame(
      id,
      "Recurse Right",
      8,
      `Traversing right subtree of Node(${node.val}).`,
    );
    dfs(node.right, id, "right");

    callStack.pop();
  }

  dfs(root, null, "root");

  pushFrame(
    foundTargetId,
    "Finished",
    11,
    `Traversal complete! The ${k}-th smallest element in the BST is ${result}.`,
  );

  return builder.getFrames();
}

export default generateFrames;
