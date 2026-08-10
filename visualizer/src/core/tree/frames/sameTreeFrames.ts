import { TreeNode } from "../TreeNode";
import type { Frame } from "../types";
import { computeLayoutWithOffset } from "../layout";
import { FrameBuilder } from "@/core/shared/FrameBuilder";

export function generateFrames(
  p: TreeNode | null,
  q: TreeNode | null,
): Frame[] {
  const builder = new FrameBuilder<Frame>();

  const layoutP = computeLayoutWithOffset(p, 100, "p-");
  const layoutQ = computeLayoutWithOffset(q, 500, "q-");

  const layout = {
    nodes: [...layoutP.nodes, ...layoutQ.nodes],
    edges: [...layoutP.edges, ...layoutQ.edges],
  };

  builder.pushFrame({
    phase: "Initialization",
    codeLine: 0,
    message: "Initialized function isSameTree(p, q).",
    layout,
  });

  function isSameTree(
    nodeP: TreeNode | null,
    nodeQ: TreeNode | null,
    parentIdP: string | null,
    parentIdQ: string | null,
    side: string,
  ): boolean {
    const idP = nodeP
      ? `p-${nodeP.id}`
      : parentIdP
        ? `p-${parentIdP}-${side}-null`
        : "p-null";
    const idQ = nodeQ
      ? `q-${nodeQ.id}`
      : parentIdQ
        ? `q-${parentIdQ}-${side}-null`
        : "q-null";
    const activeNodes = [idP, idQ];

    return builder.executeCall(
      `isSameTree(${nodeP?.val ?? "null"}, ${nodeQ?.val ?? "null"})`,
      () => {
        builder.pushFrame({
          activeNodeIds: activeNodes,
          phase: "Compare Nodes",
          codeLine: 3,
          message: `Comparing nodes: p=${nodeP?.val ?? "null"}, q=${nodeQ?.val ?? "null"}`,
          layout,
        });

        if (!nodeP && !nodeQ) {
          builder.pushFrame({
            activeNodeIds: activeNodes,
            phase: "Base Case (Both Null)",
            codeLine: 4,
            message: `Both nodes are null. They are identical. Returning true.`,
            layout,
          });
          return true;
        }

        if (!nodeP || !nodeQ) {
          builder.pushFrame({
            activeNodeIds: activeNodes,
            phase: "Base Case (One Null)",
            codeLine: 5,
            message: `One node is null while the other is not. Trees are not identical! Returning false.`,
            layout,
          });
          return false;
        }

        if (nodeP.val !== nodeQ.val) {
          builder.pushFrame({
            activeNodeIds: activeNodes,
            phase: "Value Mismatch",
            codeLine: 6,
            message: `Values differ: ${nodeP.val} !== ${nodeQ.val}. Trees are not identical! Returning false.`,
            layout,
          });
          return false;
        }

        builder.pushFrame({
          activeNodeIds: activeNodes,
          phase: "Values Match",
          codeLine: 7,
          message: `Values match (${nodeP.val} === ${nodeQ.val}). Recursively checking left and right subtrees.`,
          layout,
        });

        const leftSame = isSameTree(
          nodeP.left,
          nodeQ.left,
          nodeP.id,
          nodeQ.id,
          "left",
        );
        if (!leftSame) {
          builder.pushFrame({
            activeNodeIds: activeNodes,
            phase: "Left Mismatch",
            codeLine: 7,
            message: `Left subtrees are not identical. Returning false.`,
            layout,
          });
          return false;
        }

        const rightSame = isSameTree(
          nodeP.right,
          nodeQ.right,
          nodeP.id,
          nodeQ.id,
          "right",
        );
        if (!rightSame) {
          builder.pushFrame({
            activeNodeIds: activeNodes,
            phase: "Right Mismatch",
            codeLine: 7,
            message: `Right subtrees are not identical. Returning false.`,
            layout,
          });
          return false;
        }

        builder.pushFrame({
          activeNodeIds: activeNodes,
          phase: "Subtrees Match",
          codeLine: 7,
          message: `Both left and right subtrees match for nodes ${nodeP.val} and ${nodeQ.val}. Returning true.`,
          layout,
        });

        return true;
      },
    );
  }

  const result = isSameTree(p, q, null, null, "root");

  builder.pushFrame({
    phase: "Finished",
    codeLine: 8,
    message: `Traversal complete! Trees are ${result ? "identical" : "not identical"}.`,
    layout,
  });

  return builder.getFrames();
}
