import React from "react";
import { TreeNode } from "../TreeNode";
import { deepCopyTree } from "../buildTree";
import { computeLayout } from "../layout";
import type { Frame } from "../types";

export function generateFrames(initialRoot: TreeNode | null): Frame[] {
  const frames: Frame[] = [];
  const callStack: string[] = [];
  const root = deepCopyTree(initialRoot);

  const pushFrame = (
    activeNodeId: string | null,
    phase: string,
    codeLine: number,
    msg: React.ReactNode,
  ) => {
    const currentTreeSnapshot = deepCopyTree(root);
    frames.push({
      callStack: [...callStack],
      activeNodeId,
      phase,
      codeLine,
      message: msg,
      layout: computeLayout(currentTreeSnapshot),
    });
  };

  pushFrame(
    null,
    "Initialization",
    0,
    "Initialized empty result array and called dfs(root).",
  );

  function dfs(node: TreeNode | null, parentId: string | null, side: string) {
    if (!node) {
      callStack.push("null");
      const nullId = `${parentId}-${side}-null`;
      pushFrame(
        nullId,
        "Base Case (null)",
        3,
        `Tried going ${side} from node ${parentId}, but it's null. Returning.`,
      );
      callStack.pop();
      return;
    }

    callStack.push(`dfs(${node.val})`);
    const id = node.id;

    pushFrame(
      id,
      "Step 1: Recurse Left",
      9,
      `Exploring the left subtree of node ${node.val}.`,
    );
    dfs(node.left, id, "left");

    pushFrame(
      id,
      "Step 2: Recurse Right",
      10,
      `Exploring the right subtree of node ${node.val}.`,
    );
    dfs(node.right, id, "right");

    pushFrame(
      id,
      "Step 3: Swap Children",
      6,
      `Both subtrees of ${node.val} are inverted. Now swapping ${node.val}'s left and right children!`,
    );

    // Swap logic
    let leftNode = node.left;
    node.left = node.right;
    node.right = leftNode;

    pushFrame(
      id,
      "Step 4: Swap Complete",
      7,
      `Children of node ${node.val} have been successfully swapped.`,
    );

    callStack.pop();
  }

  if (root) {
    dfs(root, null, "root");
  }

  pushFrame(
    null,
    "Finished",
    20,
    "Traversal complete! Tree is fully inverted.",
  );
  return frames;
}
