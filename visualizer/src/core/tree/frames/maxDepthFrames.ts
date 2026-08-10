import React from "react";
import { TreeNode } from "../TreeNode";
import type { Frame } from "../types";

export function generateFramesSol1(root: TreeNode | null): Frame[] {
  const frames: Frame[] = [];
  const callStack: string[] = [];
  let currentDepth = 0;
  let maxDepthState = 0;

  const pushFrame = (
    activeNodeId: string | null,
    phase: string,
    codeLine: number,
    msg: React.ReactNode,
  ) => {
    frames.push({
      callStack: [...callStack],
      activeNodeId,
      phase,
      codeLine,
      message: msg,
      variables: {
        maxDepth: maxDepthState,
        currDepth: currentDepth,
      },
    });
  };

  pushFrame(
    null,
    "Initialization",
    3,
    "Initialized maxDepth and currDepth variables.",
  );

  function dfs(node: TreeNode | null, parentId: string | null, side: string) {
    if (!node) {
      callStack.push("null");
      const nullId = `${parentId}-${side}-null`;
      pushFrame(nullId, "Base Case", 7, `Node is null. Returning.`);
      callStack.pop();
      return;
    }

    callStack.push(`dfs(${node.val})`);
    const id = node.id;

    currentDepth++;
    pushFrame(
      id,
      "Increment Depth",
      8,
      `Visiting node ${node.val}. Incrementing currDepth.`,
    );

    maxDepthState = Math.max(maxDepthState, currentDepth);
    pushFrame(
      id,
      "Update Max",
      9,
      `Updating maxDepth to max(${maxDepthState}, ${currentDepth}).`,
    );

    pushFrame(id, "Recurse Left", 10, `Exploring left subtree of ${node.val}.`);
    dfs(node.left, id, "left");

    pushFrame(
      id,
      "Recurse Right",
      11,
      `Exploring right subtree of ${node.val}.`,
    );
    dfs(node.right, id, "right");

    currentDepth--;
    pushFrame(
      id,
      "Backtrack",
      12,
      `Finished exploring node ${node.val}. Decrementing currDepth and backtracking.`,
    );

    callStack.pop();
  }

  dfs(root, null, "root");
  pushFrame(null, "Finished", 15, "Traversal complete! Returning maxDepth.");
  return frames;
}

export function generateFramesSol2(root: TreeNode | null): Frame[] {
  const frames: Frame[] = [];
  const callStack: string[] = [];

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

  pushFrame(null, "Initialization", 18, "Starting bottom-up recursion.", {});

  function dfs(
    node: TreeNode | null,
    parentId: string | null,
    side: string,
  ): number {
    if (!node) {
      callStack.push("null");
      const nullId = `${parentId}-${side}-null`;
      pushFrame(nullId, "Base Case", 19, `Node is null. Returning 0.`, {});
      callStack.pop();
      return 0;
    }

    callStack.push(`maxDepth(${node.val})`);
    const id = node.id;

    pushFrame(
      id,
      "Recurse Left",
      20,
      `Calculating maxDepth for left subtree of ${node.val}.`,
      {},
    );
    const leftDepth = dfs(node.left, id, "left");

    pushFrame(
      id,
      "Recurse Right",
      20,
      `Calculating maxDepth for right subtree of ${node.val}.`,
      { leftDepth },
    );
    const rightDepth = dfs(node.right, id, "right");

    const ans = 1 + Math.max(leftDepth, rightDepth);
    pushFrame(
      id,
      "Return",
      20,
      `Math.max(${leftDepth}, ${rightDepth}) + 1 = ${ans}. Returning ${ans}.`,
      { leftDepth, rightDepth, returnVal: ans },
    );

    callStack.pop();
    return ans;
  }

  dfs(root, null, "root");
  pushFrame(null, "Finished", 21, "Traversal complete!", {});
  return frames;
}
