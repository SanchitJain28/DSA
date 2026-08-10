import React from "react";
import { TreeNode } from "../TreeNode";
import type { Frame } from "../types";

export function generateFrames(root: TreeNode | null): Frame[] {
  const frames: Frame[] = [];
  const result: number[] = [];
  const callStack: string[] = [];

  const pushFrame = (
    activeNodeId: string | null,
    phase: string,
    codeLine: number,
    msg: React.ReactNode,
  ) => {
    frames.push({
      result: [...result],
      callStack: [...callStack],
      activeNodeId,
      phase,
      codeLine,
      message: msg,
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
      5,
      `Entered dfs for node ${node.val}. In Postorder, we must explore the LEFT side first!`,
    );
    dfs(node.left, id, "left");

    pushFrame(
      id,
      "Step 2: Recurse Right",
      6,
      `Left subtree of ${node.val} done. Now we must explore the RIGHT side.`,
    );
    dfs(node.right, id, "right");

    pushFrame(
      id,
      "Step 3: Process Node",
      7,
      `Both left and right subtrees of ${node.val} are done. Finally, we can process the node itself.`,
    );

    result.push(node.val);
    pushFrame(
      id,
      "Step 3: Process Node",
      7,
      `Pushed ${node.val} to result array.`,
    );

    pushFrame(
      id,
      "Step 4: Return",
      8,
      `Finished traversing left, right, and node for ${node.val}. Popping call stack.`,
    );
    callStack.pop();
  }

  if (root) {
    dfs(root, null, "root");
  }

  pushFrame(null, "Finished", 12, "Traversal complete! Stack is empty.");
  return frames;
}
