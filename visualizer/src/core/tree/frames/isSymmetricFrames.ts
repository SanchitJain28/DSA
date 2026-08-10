import { TreeNode } from "../TreeNode";
import type { Frame } from "../types";
import { computeLayout } from "../layout";
import { FrameBuilder } from "@/core/shared/FrameBuilder";

export function generateFrames(root: TreeNode | null): Frame[] {
  const builder = new FrameBuilder<Frame>();

  const layout = computeLayout(root);

  builder.pushFrame({
    phase: "Initialization",
    codeLine: 1,
    message: "Initialized function isSymmetric(root).",
    layout,
  });

  function isMirror(
    left: TreeNode | null,
    right: TreeNode | null,
    parentIdLeft: string | null,
    parentIdRight: string | null,
    sideLeft: string,
    sideRight: string,
  ): boolean {
    const idL = left
      ? left.id
      : parentIdLeft
        ? `${parentIdLeft}-${sideLeft}-null`
        : "null";
    const idR = right
      ? right.id
      : parentIdRight
        ? `${parentIdRight}-${sideRight}-null`
        : "null";
    const activeNodes = [idL, idR];

    return builder.executeCall(
      `isMirror(${left?.val ?? "null"}, ${right?.val ?? "null"})`,
      () => {
        builder.pushFrame({
          activeNodeIds: activeNodes,
          phase: "Check Nodes",
          codeLine: 2,
          message: `Checking if left node (${left?.val ?? "null"}) is a mirror of right node (${right?.val ?? "null"}).`,
          layout,
        });

        if (!left && !right) {
          builder.pushFrame({
            activeNodeIds: activeNodes,
            phase: "Base Case (Both Null)",
            codeLine: 3,
            message: `Both nodes are null. They mirror each other. Returning true.`,
            layout,
          });
          return true;
        }

        if (!left || !right) {
          builder.pushFrame({
            activeNodeIds: activeNodes,
            phase: "Base Case (One Null)",
            codeLine: 4,
            message: `One node is null and the other is not. Not a mirror! Returning false.`,
            layout,
          });
          return false;
        }

        builder.pushFrame({
          activeNodeIds: activeNodes,
          phase: "Compare Values",
          codeLine: 6,
          message: `Comparing values: ${left.val} === ${right.val}.`,
          layout,
        });

        if (left.val !== right.val) {
          builder.pushFrame({
            activeNodeIds: activeNodes,
            phase: "Value Mismatch",
            codeLine: 6,
            message: `Values differ! ${left.val} !== ${right.val}. Not a mirror. Returning false.`,
            layout,
          });
          return false;
        }

        builder.pushFrame({
          activeNodeIds: activeNodes,
          phase: "Values Match",
          codeLine: 7,
          message: `Values match! Recursively checking outer children (left.left with right.right).`,
          layout,
        });

        const outerMirror = isMirror(
          left.left,
          right.right,
          left.id,
          right.id,
          "left",
          "right",
        );

        if (!outerMirror) {
          builder.pushFrame({
            activeNodeIds: activeNodes,
            phase: "Outer Mismatch",
            codeLine: 7,
            message: `Outer children do not mirror. Returning false.`,
            layout,
          });
          return false;
        }

        builder.pushFrame({
          activeNodeIds: activeNodes,
          phase: "Outer Match",
          codeLine: 8,
          message: `Outer children match! Now checking inner children (left.right with right.left).`,
          layout,
        });

        const innerMirror = isMirror(
          left.right,
          right.left,
          left.id,
          right.id,
          "right",
          "left",
        );

        if (!innerMirror) {
          builder.pushFrame({
            activeNodeIds: activeNodes,
            phase: "Inner Mismatch",
            codeLine: 8,
            message: `Inner children do not mirror. Returning false.`,
            layout,
          });
          return false;
        }

        builder.pushFrame({
          activeNodeIds: activeNodes,
          phase: "Subtrees Mirror",
          codeLine: 9,
          message: `Both outer and inner children mirror successfully. Returning true!`,
          layout,
        });

        return true;
      },
    );
  }

  builder.pushFrame({
    phase: "Initial Call",
    codeLine: 11,
    message:
      "Starting symmetric check by comparing root's left and right children.",
    layout,
  });

  const result = isMirror(
    root?.left ?? null,
    root?.right ?? null,
    root?.id ?? null,
    root?.id ?? null,
    "left",
    "right",
  );

  builder.pushFrame({
    phase: "Finished",
    codeLine: 12,
    message: `Traversal complete! The tree is ${result ? "symmetric" : "not symmetric"}.`,
    layout,
  });

  return builder.getFrames();
}
