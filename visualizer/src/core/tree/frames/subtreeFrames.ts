import { TreeNode } from "../TreeNode";
import type { Frame } from "../types";
import { computeLayoutWithOffset } from "../layout";
import { FrameBuilder } from "@/core/shared/FrameBuilder";

export function generateFrames(
  root: TreeNode | null,
  subRoot: TreeNode | null,
): Frame[] {
  const builder = new FrameBuilder<Frame>();

  const layoutRoot = computeLayoutWithOffset(root, 100, "r-");
  const layoutSub = computeLayoutWithOffset(subRoot, 500, "s-");

  const layout = {
    nodes: [...layoutRoot.nodes, ...layoutSub.nodes],
    edges: [...layoutRoot.edges, ...layoutSub.edges],
  };

  builder.pushFrame({
    phase: "Initialization",
    codeLine: 0,
    message: "Initialized function isSubtree(root, subRoot).",
    layout,
  });

  function isSameTree(
    p: TreeNode | null,
    q: TreeNode | null,
    parentIdP: string | null,
    parentIdQ: string | null,
    side: string,
  ): boolean {
    const idP = p
      ? `r-${p.id}`
      : parentIdP
        ? `r-${parentIdP}-${side}-null`
        : "r-null";
    const idQ = q
      ? `s-${q.id}`
      : parentIdQ
        ? `s-${parentIdQ}-${side}-null`
        : "s-null";
    const activeNodes = [idP, idQ];

    return builder.executeCall(
      `isSameTree(${p?.val ?? "null"}, ${q?.val ?? "null"})`,
      () => {
        builder.pushFrame({
          activeNodeIds: activeNodes,
          phase: "Compare Nodes",
          codeLine: 7,
          message: `Comparing nodes: p=${p?.val ?? "null"}, q=${q?.val ?? "null"}`,
          layout,
        });

        if (!p && !q) {
          builder.pushFrame({
            activeNodeIds: activeNodes,
            phase: "Base Case (Both Null)",
            codeLine: 8,
            message: `Both nodes are null. They are identical. Returning true.`,
            layout,
          });
          return true;
        }

        if (!p || !q) {
          builder.pushFrame({
            activeNodeIds: activeNodes,
            phase: "Base Case (One Null)",
            codeLine: 9,
            message: `One node is null while the other is not. Trees are not identical! Returning false.`,
            layout,
          });
          return false;
        }

        if (p.val !== q.val) {
          builder.pushFrame({
            activeNodeIds: activeNodes,
            phase: "Value Mismatch",
            codeLine: 10,
            message: `Values differ: ${p.val} !== ${q.val}. Trees are not identical! Returning false.`,
            layout,
          });
          return false;
        }

        builder.pushFrame({
          activeNodeIds: activeNodes,
          phase: "Values Match",
          codeLine: 11,
          message: `Values match (${p.val} === ${q.val}). Recursively checking left and right subtrees.`,
          layout,
        });

        const leftSame = isSameTree(p.left, q.left, p.id, q.id, "left");
        if (!leftSame) {
          builder.pushFrame({
            activeNodeIds: activeNodes,
            phase: "Left Mismatch",
            codeLine: 11,
            message: `Left subtrees are not identical. Returning false.`,
            layout,
          });
          return false;
        }

        const rightSame = isSameTree(p.right, q.right, p.id, q.id, "right");
        if (!rightSame) {
          builder.pushFrame({
            activeNodeIds: activeNodes,
            phase: "Right Mismatch",
            codeLine: 11,
            message: `Right subtrees are not identical. Returning false.`,
            layout,
          });
          return false;
        }

        builder.pushFrame({
          activeNodeIds: activeNodes,
          phase: "Subtrees Match",
          codeLine: 11,
          message: `Both left and right subtrees match for nodes ${p.val} and ${q.val}. Returning true.`,
          layout,
        });

        return true;
      },
    );
  }

  function isSubtree(
    node: TreeNode | null,
    parentId: string | null,
    side: string,
  ): boolean {
    const id = node
      ? `r-${node.id}`
      : parentId
        ? `r-${parentId}-${side}-null`
        : "r-null";

    return builder.executeCall(
      `isSubtree(${node?.val ?? "null"}, subRoot)`,
      () => {
        builder.pushFrame({
          activeNodeIds: [id, `s-${subRoot?.id}`],
          phase: "Check Subtree",
          codeLine: 4,
          message: `Checking if subRoot is a subtree starting at node ${node?.val ?? "null"}.`,
          layout,
        });

        if (!node) {
          builder.pushFrame({
            activeNodeIds: [id],
            phase: "Base Case (Null Node)",
            codeLine: 4,
            message: `Node is null, cannot contain subRoot. Returning false.`,
            layout,
          });
          return false;
        }

        builder.pushFrame({
          activeNodeIds: [id, `s-${subRoot?.id}`],
          phase: "Call isSameTree",
          codeLine: 5,
          message: `Calling isSameTree to see if trees match exactly starting at ${node.val}.`,
          layout,
        });

        if (isSameTree(node, subRoot, node.id, subRoot?.id ?? null, side)) {
          builder.pushFrame({
            activeNodeIds: [id, `s-${subRoot?.id}`],
            phase: "Subtree Found",
            codeLine: 5,
            message: `isSameTree returned true! Found the subtree at node ${node.val}. Returning true.`,
            layout,
          });
          return true;
        }

        builder.pushFrame({
          activeNodeIds: [id],
          phase: "Recursive Check",
          codeLine: 6,
          message: `isSameTree returned false. Recursively checking left and right children of ${node.val}.`,
          layout,
        });

        const leftCheck = isSubtree(node.left, node.id, "left");
        if (leftCheck) {
          return true;
        }

        const rightCheck = isSubtree(node.right, node.id, "right");
        if (rightCheck) {
          return true;
        }

        builder.pushFrame({
          activeNodeIds: [id],
          phase: "Subtree Not Found",
          codeLine: 6,
          message: `Subtree not found in left or right children of ${node.val}. Returning false.`,
          layout,
        });

        return false;
      },
    );
  }

  const result = isSubtree(root, null, "root");

  builder.pushFrame({
    phase: "Finished",
    codeLine: 7,
    message: `Traversal complete! isSubtree returned ${result ? "true" : "false"}.`,
    layout,
  });

  return builder.getFrames();
}
