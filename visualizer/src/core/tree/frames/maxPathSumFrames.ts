import { FrameBuilder } from "../../shared/FrameBuilder";
import { TreeNode } from "../TreeNode";
import { computeLayout } from "../layout";
import type { Frame } from "../types";

export function generateFrames(root: TreeNode | null): Frame[] {
  const builder = new FrameBuilder<Frame>();

  const getEmptyVars = () => ({
    max: "-Infinity",
    currNode: "N/A",
    leftGain: "N/A",
    rightGain: "N/A",
    pathThrough: "N/A",
    returnGain: "N/A",
  });

  if (!root) {
    builder.pushFrame({
      phase: "Empty Tree",
      codeLine: 2,
      message: "Root is null. Maximum path sum is 0.",
      variables: {
        ...getEmptyVars(),
        max: "0",
        currNode: "null",
      },
      callStack: [],
      layout: { nodes: [], edges: [] },
    });
    return builder.getFrames();
  }

  const baseLayout = computeLayout(root);

  const getBaseFrame = () => ({
    variables: getEmptyVars(),
    layout: JSON.parse(JSON.stringify(baseLayout)),
  });

  const markNodes = (
    frameLayout: any,
    idMap: Record<string, "active" | "target" | "secondary" | "success">
  ) => {
    for (const node of frameLayout.nodes) {
      if (idMap[node.id]) {
        node.status = idMap[node.id];
      }
    }
  };

  const callStack: string[] = [];
  let max = -Infinity;

  // Step 1: Initial Frame
  builder.pushFrame({
    ...getBaseFrame(),
    phase: "Initialization",
    codeLine: 1,
    message: "Start calculating Binary Tree Maximum Path Sum using postorder DFS.",
    variables: {
      ...getEmptyVars(),
      max: "-Infinity",
    },
    callStack: [],
  });

  // Step 2: Initialize Max
  builder.pushFrame({
    ...getBaseFrame(),
    phase: "Setup",
    codeLine: 3,
    message: "Initialize global max = -Infinity to handle trees with all negative values.",
    variables: {
      ...getEmptyVars(),
      max: "-Infinity",
    },
    callStack: [],
  });

  function dfs(node: TreeNode | null, parentId: string | null, side: "left" | "right" | "root"): number {
    if (!node) {
      callStack.push("null");
      const nullId = parentId ? `${parentId}-${side}-null` : null;

      const frameLayout = getBaseFrame().layout;
      if (nullId) {
        markNodes(frameLayout, { [nullId]: "secondary" });
      }

      builder.pushFrame({
        layout: frameLayout,
        phase: "Base Case",
        codeLine: 6,
        message: "Base Case: node is null. Return 0 (no contribution).",
        variables: {
          max: max === -Infinity ? "-Infinity" : String(max),
          currNode: "null",
          leftGain: "0",
          rightGain: "0",
          pathThrough: "N/A",
          returnGain: "0",
        },
        callStack: [...callStack],
        activeNodeId: nullId,
      });

      callStack.pop();
      return 0;
    }

    callStack.push(`dfs(${node.val})`);
    const id = node.id;

    // Enter DFS for node
    const enterLayout = getBaseFrame().layout;
    markNodes(enterLayout, { [id]: "active" });

    builder.pushFrame({
      layout: enterLayout,
      phase: `Visit Node(${node.val})`,
      codeLine: 5,
      message: `Enter dfs(Node(${node.val})). Next, compute maximum branch gains from left and right subtrees.`,
      variables: {
        max: max === -Infinity ? "-Infinity" : String(max),
        currNode: `Node(${node.val})`,
        leftGain: "N/A",
        rightGain: "N/A",
        pathThrough: "N/A",
        returnGain: "N/A",
      },
      callStack: [...callStack],
      activeNodeId: id,
    });

    // Recurse Left
    const leftRecurseLayout = getBaseFrame().layout;
    markNodes(leftRecurseLayout, { [id]: "active" });

    builder.pushFrame({
      layout: leftRecurseLayout,
      phase: `Recurse Left from ${node.val}`,
      codeLine: 7,
      message: `Calculate max gain from left child of Node(${node.val}). Ignore negative returns with Math.max(0, ...).`,
      variables: {
        max: max === -Infinity ? "-Infinity" : String(max),
        currNode: `Node(${node.val})`,
        leftGain: "computing...",
        rightGain: "N/A",
        pathThrough: "N/A",
        returnGain: "N/A",
      },
      callStack: [...callStack],
      activeNodeId: id,
    });

    const leftRaw = dfs(node.left, id, "left");
    const left = Math.max(0, leftRaw);

    // After Left Child returns
    const leftDoneLayout = getBaseFrame().layout;
    markNodes(leftDoneLayout, { [id]: "active" });

    builder.pushFrame({
      layout: leftDoneLayout,
      phase: `Left Gain for ${node.val}`,
      codeLine: 7,
      message: `Left subtree of Node(${node.val}) returned ${leftRaw}. Left branch gain = Math.max(0, ${leftRaw}) = ${left}.`,
      variables: {
        max: max === -Infinity ? "-Infinity" : String(max),
        currNode: `Node(${node.val})`,
        leftGain: String(left),
        rightGain: "N/A",
        pathThrough: "N/A",
        returnGain: "N/A",
      },
      callStack: [...callStack],
      activeNodeId: id,
    });

    // Recurse Right
    const rightRecurseLayout = getBaseFrame().layout;
    markNodes(rightRecurseLayout, { [id]: "active" });

    builder.pushFrame({
      layout: rightRecurseLayout,
      phase: `Recurse Right from ${node.val}`,
      codeLine: 8,
      message: `Calculate max gain from right child of Node(${node.val}). Ignore negative returns with Math.max(0, ...).`,
      variables: {
        max: max === -Infinity ? "-Infinity" : String(max),
        currNode: `Node(${node.val})`,
        leftGain: String(left),
        rightGain: "computing...",
        pathThrough: "N/A",
        returnGain: "N/A",
      },
      callStack: [...callStack],
      activeNodeId: id,
    });

    const rightRaw = dfs(node.right, id, "right");
    const right = Math.max(0, rightRaw);

    // After Right Child returns
    const rightDoneLayout = getBaseFrame().layout;
    markNodes(rightDoneLayout, { [id]: "active" });

    builder.pushFrame({
      layout: rightDoneLayout,
      phase: `Right Gain for ${node.val}`,
      codeLine: 8,
      message: `Right subtree of Node(${node.val}) returned ${rightRaw}. Right branch gain = Math.max(0, ${rightRaw}) = ${right}.`,
      variables: {
        max: max === -Infinity ? "-Infinity" : String(max),
        currNode: `Node(${node.val})`,
        leftGain: String(left),
        rightGain: String(right),
        pathThrough: "N/A",
        returnGain: "N/A",
      },
      callStack: [...callStack],
      activeNodeId: id,
    });

    // Calculate path through current node (peak node)
    const currentPathSum = left + right + node.val;
    const isNewMax = currentPathSum > max;
    max = Math.max(max, currentPathSum);

    const updateLayout = getBaseFrame().layout;
    markNodes(updateLayout, {
      [id]: isNewMax ? "success" : "active",
    });

    builder.pushFrame({
      layout: updateLayout,
      phase: isNewMax ? `★ New Max Path Sum: ${max}` : `Evaluate Peak at Node(${node.val})`,
      codeLine: 9,
      message: `Path sum with Node(${node.val}) as peak = left (${left}) + right (${right}) + node.val (${node.val}) = ${currentPathSum}.${
        isNewMax
          ? ` New global maximum found: max = ${max}!`
          : ` Current max remains ${max} (since ${currentPathSum} <= ${max}).`
      }`,
      variables: {
        max: String(max),
        currNode: `Node(${node.val})`,
        leftGain: String(left),
        rightGain: String(right),
        pathThrough: `${left} + ${right} + (${node.val}) = ${currentPathSum}`,
        returnGain: "N/A",
      },
      callStack: [...callStack],
      activeNodeId: id,
    });

    // Return single branch gain to parent
    const returnVal = node.val + Math.max(left, right);
    const returnLayout = getBaseFrame().layout;
    markNodes(returnLayout, { [id]: "target" });

    builder.pushFrame({
      layout: returnLayout,
      phase: `Return Branch Gain from ${node.val}`,
      codeLine: 10,
      message: `Return max single-branch gain to parent: node.val (${node.val}) + max(left: ${left}, right: ${right}) = ${returnVal}.`,
      variables: {
        max: String(max),
        currNode: `Node(${node.val})`,
        leftGain: String(left),
        rightGain: String(right),
        pathThrough: String(currentPathSum),
        returnGain: `${node.val} + max(${left}, ${right}) = ${returnVal}`,
      },
      callStack: [...callStack],
      activeNodeId: id,
    });

    callStack.pop();
    return returnVal;
  }

  // Execute DFS from root
  dfs(root, null, "root");

  // Step Final: Return Max
  const finalLayout = getBaseFrame().layout;
  builder.pushFrame({
    layout: finalLayout,
    phase: "Finished",
    codeLine: 14,
    message: `Completed traversal. Binary Tree Maximum Path Sum is ${max}.`,
    variables: {
      max: String(max),
      currNode: "Done",
      leftGain: "—",
      rightGain: "—",
      pathThrough: "—",
      returnGain: String(max),
    },
    callStack: [],
  });

  return builder.getFrames();
}
