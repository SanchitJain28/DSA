import { FrameBuilder } from "../../shared/FrameBuilder";
import { TreeNode } from "../TreeNode";
import { computeLayout } from "../layout";
import type { Frame } from "../types";

export function generateFrames(root: TreeNode | null, k: number): Frame[] {
  const builder = new FrameBuilder<Frame>();
  const initialLayout = root ? computeLayout(root) : { nodes: [], edges: [] };

  let count = 0;
  let result = 0;
  const visitedInorder: number[] = [];
  let foundTargetId: string | null = null;
  const callStack: string[] = [];

  const getBaseFrame = (
    codeLine: number,
    phase: string,
    message: string,
    activeNodeId?: string
  ): Frame => {
    const layout = JSON.parse(JSON.stringify(initialLayout));

    for (const node of layout.nodes) {
      if (node.isNull) continue;

      if (foundTargetId && node.id === foundTargetId) {
        node.status = "success";
      } else if (visitedInorder.includes(node.val)) {
        node.status = "secondary";
      }

      if (activeNodeId && node.id === activeNodeId) {
        node.status = "active";
      }
    }

    return {
      phase,
      codeLine,
      message,
      variables: {
        k: k.toString(),
        count: count.toString(),
        result: result === 0 ? "0 (not found yet)" : result.toString(),
        "inorder visited": visitedInorder.length > 0 ? `[${visitedInorder.join(", ")}]` : "[]",
      },
      callStack: [...callStack],
      layout,
    };
  };

  // Line 1: Function entry
  builder.pushFrame(
    getBaseFrame(1, "Initialization", `Start kthSmallest with k = ${k}. In-order traversal on a BST visits nodes in sorted order.`)
  );

  if (!root) {
    builder.pushFrame(
      getBaseFrame(5, "Base Case", "Root is null, returning 0.")
    );
    return builder.getFrames();
  }

  // Line 2: Initialize count & result
  builder.pushFrame(
    getBaseFrame(2, "Initialization", "Initialize count = 0 and result = 0.")
  );

  function dfs(node: TreeNode | null) {
    const nodeStr = node ? node.val.toString() : "null";
    const callStr = `dfs(${nodeStr})`;
    callStack.push(callStr);

    if (!node) {
      builder.pushFrame(
        getBaseFrame(5, "Base Case", "node is null, return back to caller.")
      );
      callStack.pop();
      return;
    }

    const nodeId = node.id;

    // Line 4/5: Entering node
    builder.pushFrame(
      getBaseFrame(5, "Traversal", `Visiting node ${node.val}. Check if node is null (false).`, nodeId)
    );

    // Line 6: Recurse left
    builder.pushFrame(
      getBaseFrame(6, "DFS Left", `Traverse left subtree of node ${node.val}.`, nodeId)
    );
    dfs(node.left);

    // Line 7: Process current node (In-Order)
    count++;
    visitedInorder.push(node.val);

    builder.pushFrame(
      getBaseFrame(
        7,
        "Increment Count",
        `In-order visit on node ${node.val}. Increment count to ${count}. (Visited elements in sorted order: [${visitedInorder.join(", ")}])`,
        nodeId
      )
    );

    // Line 8: Check if count === k
    builder.pushFrame(
      getBaseFrame(
        8,
        "Check Target",
        `Checking if count (${count}) === k (${k}).`,
        nodeId
      )
    );

    if (count === k) {
      result = node.val;
      foundTargetId = nodeId;

      // Line 9: Set result
      builder.pushFrame(
        getBaseFrame(
          9,
          "Found K-th Smallest",
          `count (${count}) === k (${k})! Found the ${k}-th smallest element: ${result}.`,
          nodeId
        )
      );

      // Line 10: Return early
      builder.pushFrame(
        getBaseFrame(
          10,
          "Early Return",
          `Returning from dfs(${node.val}) because k-th smallest element has been found.`,
          nodeId
        )
      );

      callStack.pop();
      return;
    }

    // Line 12: Recurse right
    builder.pushFrame(
      getBaseFrame(12, "DFS Right", `Traverse right subtree of node ${node.val}.`, nodeId)
    );
    dfs(node.right);

    callStack.pop();
  }

  // Line 15: Initial call
  builder.pushFrame(
    getBaseFrame(15, "Start DFS", `Call dfs(root) starting at root node ${root.val}.`, root.id)
  );

  dfs(root);

  // Line 16: Return result
  builder.pushFrame(
    getBaseFrame(
      16,
      "Return",
      `Traversal completed. The ${k}-th smallest element in the BST is ${result}.`
    )
  );

  return builder.getFrames();
}
