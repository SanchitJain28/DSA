import React from "react";
import { TreeNode } from "../TreeNode";
import type { Frame } from "../types";

export function generateFrames(root: TreeNode | null): Frame[] {
  const frames: Frame[] = [];
  const callStack: string[] = [];
  let maxDiameterState = 0;

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

  pushFrame(null, "Initialization", 3, "Initialized maxDiameter to 0.", {
    maxDiameter: maxDiameterState,
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
        maxDiameter: maxDiameterState,
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
      `Calculating depth for left subtree of ${node.val}.`,
      { maxDiameter: maxDiameterState },
    );
    const leftDepth = dfs(node.left, id, "left");

    pushFrame(
      id,
      "Recurse Right",
      8,
      `Calculating depth for right subtree of ${node.val}.`,
      { maxDiameter: maxDiameterState, left: leftDepth },
    );
    const rightDepth = dfs(node.right, id, "right");

    const newDiameter = leftDepth + rightDepth;
    maxDiameterState = Math.max(maxDiameterState, newDiameter);

    pushFrame(
      id,
      "Update Max",
      9,
      `Diameter through ${node.val} is left (${leftDepth}) + right (${rightDepth}) = ${newDiameter}. Updating maxDiameter.`,
      { maxDiameter: maxDiameterState, left: leftDepth, right: rightDepth },
    );

    const returnDepth = 1 + Math.max(leftDepth, rightDepth);
    pushFrame(
      id,
      "Return",
      10,
      `Returning max depth of subtrees + 1: ${returnDepth}`,
      {
        maxDiameter: maxDiameterState,
        left: leftDepth,
        right: rightDepth,
        returnVal: returnDepth,
      },
    );

    callStack.pop();
    return returnDepth;
  }

  dfs(root, null, "root");
  pushFrame(
    null,
    "Finished",
    14,
    `Traversal complete! maxDiameter is ${maxDiameterState}.`,
    { maxDiameter: maxDiameterState },
  );
  return frames;
}
