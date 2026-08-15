import { FrameBuilder } from "../../shared/FrameBuilder";
import { TreeNode } from "../TreeNode";
import { computeLayout } from "../layout";
import type { Frame } from "../types";

export function generateFrames(root: TreeNode | null): Frame[] {
  const builder = new FrameBuilder<Frame>();
  
  const initialLayout = root ? computeLayout(root) : { nodes: [], edges: [] };

  const getBaseFrame = (
    codeLine: number,
    phase: string,
    message: string,
    variables: Record<string, string | number> = {},
    callStack: string[],
    activeNodeId?: string
  ): Frame => {
    // Clone layout to avoid mutating the original
    const layout = JSON.parse(JSON.stringify(initialLayout));
    
    // Highlight active node
    if (activeNodeId) {
      const node = layout.nodes.find((n: any) => n.id === activeNodeId);
      if (node) {
        node.status = "active";
      }
    }

    return {
      phase,
      codeLine,
      message,
      variables,
      callStack,
      layout,
    };
  };

  builder.pushFrame(
    getBaseFrame(1, "Initialization", "Start isValidBST algorithm.", {}, [])
  );

  if (!root) {
    builder.pushFrame(
      getBaseFrame(2, "Base Case", "Root is null, return true.", {}, [])
    );
    return builder.getFrames();
  }

  const callStack: string[] = [];

  function dfs(node: TreeNode | null, min: number, max: number): boolean {
    const nodeStr = node ? node.val.toString() : "null";
    const minStr = min === -Infinity ? "-∞" : min.toString();
    const maxStr = max === Infinity ? "∞" : max.toString();
    const funcCall = `dfs(${nodeStr}, ${minStr}, ${maxStr})`;
    
    callStack.push(funcCall);

    if (!node) {
      builder.pushFrame(
        getBaseFrame(
          4,
          "Base Case",
          "Node is null, returning true.",
          { min: minStr, max: maxStr },
          [...callStack]
        )
      );
      callStack.pop();
      return true;
    }

    const nodeId = node.val.toString();

    builder.pushFrame(
      getBaseFrame(
        5,
        "Validate bounds",
        `Checking if ${node.val} <= ${minStr} or ${node.val} >= ${maxStr}`,
        { min: minStr, max: maxStr, "node.val": node.val },
        [...callStack],
        nodeId
      )
    );

    if (node.val <= min || node.val >= max) {
      builder.pushFrame(
        getBaseFrame(
          5,
          "Validation Failed",
          `Node ${node.val} is out of bounds! Returning false.`,
          { min: minStr, max: maxStr, "node.val": node.val },
          [...callStack],
          nodeId
        )
      );
      callStack.pop();
      return false;
    }

    builder.pushFrame(
      getBaseFrame(
        6,
        "DFS Recursive Call",
        `Validation passed. Calling dfs on left child...`,
        { min: minStr, max: maxStr, "node.val": node.val },
        [...callStack],
        nodeId
      )
    );

    const leftValid = dfs(node.left, min, node.val);

    if (!leftValid) {
      builder.pushFrame(
        getBaseFrame(
          6,
          "Return",
          `Left subtree of ${node.val} was invalid. Returning false.`,
          { min: minStr, max: maxStr, "node.val": node.val, leftValid: "false" },
          [...callStack],
          nodeId
        )
      );
      callStack.pop();
      return false;
    }

    builder.pushFrame(
      getBaseFrame(
        6,
        "DFS Recursive Call",
        `Left subtree valid. Calling dfs on right child...`,
        { min: minStr, max: maxStr, "node.val": node.val, leftValid: "true" },
        [...callStack],
        nodeId
      )
    );

    const rightValid = dfs(node.right, node.val, max);
    const result = leftValid && rightValid;

    builder.pushFrame(
      getBaseFrame(
        6,
        "Return",
        `Subtrees for ${node.val} validated: left=${leftValid}, right=${rightValid}. Returning ${result}.`,
        { min: minStr, max: maxStr, "node.val": node.val, leftValid: "true", rightValid: rightValid.toString() },
        [...callStack],
        nodeId
      )
    );

    callStack.pop();
    return result;
  }

  builder.pushFrame(
    getBaseFrame(
      8,
      "Initial DFS Call",
      "Call dfs(root, -∞, ∞)",
      {},
      [...callStack]
    )
  );

  const finalResult = dfs(root, -Infinity, Infinity);

  builder.pushFrame(
    getBaseFrame(
      8,
      "Final Result",
      `Algorithm finished. Valid BST: ${finalResult}`,
      { result: finalResult.toString() },
      []
    )
  );

  return builder.getFrames();
}
