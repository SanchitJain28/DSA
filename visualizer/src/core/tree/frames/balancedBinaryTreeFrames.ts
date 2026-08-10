import React from "react";
import { TreeNode } from "../TreeNode";
import type { Frame } from "../types";

export function generateFrames(root: TreeNode | null): Frame[] {
  const frames: Frame[] = [];
  const callStack: string[] = [];
  let resultState = true;

  const pushFrame = (
    activeNodeId: string | null,
    phase: string,
    codeLine: number,
    msg: React.ReactNode,
    vars: Record<string, number | string>,
  ) => {
    frames.push({
      callStack: [...callStack],
      activeNodeId,
      phase,
      codeLine,
      message: msg,
      variables: vars,
    });
  };

  pushFrame(null, "Initialization", 3, "Initialized result to true.", {
    result: "true",
  });

  function dfs(
    node: TreeNode | null,
    parentId: string | null,
    side: string,
  ): number {
    if (!node) {
      callStack.push("null");
      const nullId = `${parentId}-${side}-null`;
      pushFrame(nullId, "Base Case", 6, `Node is null. Returning 0.`, {
        result: resultState.toString(),
      });
      callStack.pop();
      return 0;
    }

    callStack.push(`dfs(${node.val})`);
    const id = node.id;

    pushFrame(
      id,
      "Recurse Left",
      7,
      `Calculating height for left subtree of ${node.val}.`,
      { result: resultState.toString() },
    );
    const leftHeight = dfs(node.left, id, "left");

    pushFrame(
      id,
      "Recurse Right",
      8,
      `Calculating height for right subtree of ${node.val}.`,
      { result: resultState.toString(), left: leftHeight },
    );
    const rightHeight = dfs(node.right, id, "right");

    pushFrame(
      id,
      "Check Balance",
      9,
      `leftHeight = ${leftHeight}, rightHeight = ${rightHeight}. Difference is ${Math.abs(leftHeight - rightHeight)}.`,
      { result: resultState.toString(), left: leftHeight, right: rightHeight },
    );

    if (Math.abs(leftHeight - rightHeight) > 1) {
      resultState = false;
      pushFrame(
        id,
        "Update Result",
        9,
        `Difference > 1! Setting result = false. Tree is unbalanced at node ${node.val}.`,
        { result: resultState.toString(), left: leftHeight, right: rightHeight },
      );
    }

    const retVal = 1 + Math.max(leftHeight, rightHeight);
    pushFrame(
      id,
      "Return",
      10,
      `Returning 1 + max(${leftHeight}, ${rightHeight}) = ${retVal}.`,
      { result: resultState.toString(), left: leftHeight, right: rightHeight },
    );

    callStack.pop();
    return retVal;
  }

  dfs(root, null, "root");

  pushFrame(null, "Finished", 14, `Traversal complete! result = ${resultState}`, {
    result: resultState.toString(),
  });

  return frames;
}
