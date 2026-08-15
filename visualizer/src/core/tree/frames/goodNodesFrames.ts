import { FrameBuilder } from "../../shared/FrameBuilder";
import { TreeNode } from "../TreeNode";
import { computeLayout } from "../layout";
import type { Frame } from "../types";

export function generateFrames(root: TreeNode | null): Frame[] {
  const builder = new FrameBuilder<Frame>();
  const initialLayout = root ? computeLayout(root) : { nodes: [], edges: [] };

  let goodCount = 0;
  const goodNodeIds: string[] = [];
  const badNodeIds: string[] = [];
  const callStack: string[] = [];

  const getBaseFrame = (
    codeLine: number,
    phase: string,
    message: string,
    activeNodeId?: string,
    currentMaxStr = "-∞"
  ): Frame => {
    const layout = JSON.parse(JSON.stringify(initialLayout));

    for (const node of layout.nodes) {
      if (node.isNull) continue;

      if (goodNodeIds.includes(node.id)) {
        node.status = "success";
      } else if (badNodeIds.includes(node.id)) {
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
        goodNodes: goodCount.toString(),
        "max so far along path": currentMaxStr,
        "good nodes found": goodNodeIds.length > 0 ? goodNodeIds.join(", ") : "none",
      },
      callStack: [...callStack],
      layout,
    };
  };

  // Line 1: Function entry
  builder.pushFrame(
    getBaseFrame(
      1,
      "Initialization",
      "Start count good nodes algorithm. A node X is good if on the path from root to X there are no nodes with a value greater than X."
    )
  );

  if (!root) {
    builder.pushFrame(
      getBaseFrame(2, "Base Case", "Root is null, return 0.")
    );
    return builder.getFrames();
  }

  // Line 3: Initialize count
  builder.pushFrame(
    getBaseFrame(3, "Initialization", "Initialize count goodNodes = 0.")
  );

  function dfs(node: TreeNode | null, maxSofar: number = -Infinity) {
    const nodeValStr = node ? node.val.toString() : "null";
    const maxStr = maxSofar === -Infinity ? "-∞" : maxSofar.toString();
    const callStr = `dfs(${nodeValStr}, max: ${maxStr})`;
    callStack.push(callStr);

    if (!node) {
      builder.pushFrame(
        getBaseFrame(5, "Base Case", "Node is null, return back to parent.", undefined, maxStr)
      );
      callStack.pop();
      return;
    }

    const nodeId = node.id;

    // Line 4/5: Entering node
    builder.pushFrame(
      getBaseFrame(
        5,
        "Visit Node",
        `Visiting node ${node.val} with max value along path = ${maxStr}.`,
        nodeId,
        maxStr
      )
    );

    const isGood = node.val >= maxSofar;

    // Line 6: Check if good
    builder.pushFrame(
      getBaseFrame(
        6,
        "Evaluate Node",
        `Checking if node.val (${node.val}) >= maxSoFar (${maxStr}): ${isGood ? "YES (Good Node!)" : "NO (Blocked by larger ancestor)"}.`,
        nodeId,
        maxStr
      )
    );

    const newMax = Math.max(maxSofar, node.val);
    const newMaxStr = newMax.toString();

    // Line 7: Update maxSofar
    builder.pushFrame(
      getBaseFrame(
        7,
        "Update Max",
        `Update maxSofar along path = max(${maxStr}, ${node.val}) = ${newMaxStr}.`,
        nodeId,
        newMaxStr
      )
    );

    // Line 8: Increment if good
    if (isGood) {
      goodCount++;
      goodNodeIds.push(nodeId);

      builder.pushFrame(
        getBaseFrame(
          8,
          "Increment Count",
          `Node ${node.val} is a GOOD NODE! Increment goodNodes to ${goodCount}.`,
          nodeId,
          newMaxStr
        )
      );
    } else {
      badNodeIds.push(nodeId);

      builder.pushFrame(
        getBaseFrame(
          8,
          "Not a Good Node",
          `Node ${node.val} is NOT a good node because an ancestor has value ${maxStr} > ${node.val}.`,
          nodeId,
          newMaxStr
        )
      );
    }

    // Line 9: Recurse left
    builder.pushFrame(
      getBaseFrame(
        9,
        "DFS Left",
        `Recurse on left child of node ${node.val} with maxSoFar = ${newMaxStr}.`,
        nodeId,
        newMaxStr
      )
    );
    dfs(node.left, newMax);

    // Line 10: Recurse right
    builder.pushFrame(
      getBaseFrame(
        10,
        "DFS Right",
        `Recurse on right child of node ${node.val} with maxSoFar = ${newMaxStr}.`,
        nodeId,
        newMaxStr
      )
    );
    dfs(node.right, newMax);

    callStack.pop();
  }

  // Line 12: Start DFS
  builder.pushFrame(
    getBaseFrame(12, "Start DFS", `Call dfs(root, -∞) starting at root node ${root.val}.`, root.id)
  );

  dfs(root, -Infinity);

  // Line 13: Return goodNodes
  builder.pushFrame(
    getBaseFrame(
      13,
      "Return Result",
      `Traversal completed. Total good nodes found in the binary tree = ${goodCount}.`
    )
  );

  return builder.getFrames();
}
