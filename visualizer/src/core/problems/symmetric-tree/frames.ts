import { FrameBuilder } from "../../shared/FrameBuilder";
import type { Scene } from "../../shared/types";
import { TreeNode } from "../../structures/tree/TreeNode";
import { buildTreeFromLevelOrder, toTreeState } from "../../structures/tree/helpers";

export function generateFrames(data: { values: (number | null)[] }): Scene[] {
  const values = data.values || [];
  const builder = new FrameBuilder<Scene>();
  const root = buildTreeFromLevelOrder(values);

  const callStack: string[] = [];
  const baseTreeState = toTreeState(root);

  const pushFrame = (
    activeNodeIds: string[],
    phase: string,
    codeLine: number,
    explanation: string,
    variables: Record<string, string | number> = {},
  ) => {
    builder.pushFrame({
      phase,
      codeLine,
      explanation,
      callStack: [...callStack],
      structures: {
        tree: {
          ...baseTreeState,
          activeNodeIds,
        },
      },
      variables,
    });
  };

  pushFrame(
    [],
    "Initialization",
    1,
    `Start isSymmetric on binary tree with root: ${root ? `Node(${root.val})` : "null"}.`,
    { result: "comparing" },
  );

  if (!root) {
    pushFrame([], "Base Case", 2, "Root is null. Empty tree is symmetric (true).", {
      result: "true",
    });
    return builder.getFrames();
  }

  function isMirror(
    t1: TreeNode | null,
    t2: TreeNode | null,
    parentId1: string | null,
    parentId2: string | null,
    side1: string,
    side2: string,
  ): boolean {
    const id1 = t1 ? t1.id : parentId1 ? `${parentId1}-${side1}-null` : "null1";
    const id2 = t2 ? t2.id : parentId2 ? `${parentId2}-${side2}-null` : "null2";
    const activeNodes = [id1, id2];

    const desc1 = t1 ? `Node(${t1.val})` : "null";
    const desc2 = t2 ? `Node(${t2.val})` : "null";

    callStack.push(`isMirror(${desc1}, ${desc2})`);

    pushFrame(
      activeNodes,
      "Mirror Check",
      4,
      `Comparing mirror pair: Left branch ${desc1} vs Right branch ${desc2}.`,
      { leftNode: desc1, rightNode: desc2 },
    );

    // Both null
    if (!t1 && !t2) {
      pushFrame(
        activeNodes,
        "Both Null (Mirror Match)",
        4,
        "Both mirror branches are null. Match! Returning true.",
        { leftNode: "null", rightNode: "null", match: "true" },
      );
      callStack.pop();
      return true;
    }

    // One null
    if (!t1 || !t2) {
      pushFrame(
        activeNodes,
        "Asymmetric (One Null)",
        5,
        `Asymmetry: one branch is null (${desc1}), other is not (${desc2}). Returning false.`,
        { leftNode: desc1, rightNode: desc2, match: "false" },
      );
      callStack.pop();
      return false;
    }

    // Value mismatch
    if (t1.val !== t2.val) {
      pushFrame(
        activeNodes,
        "Value Asymmetry",
        6,
        `Values differ: ${t1.val} !== ${t2.val}. Mirror condition violated! Returning false.`,
        { leftNode: desc1, rightNode: desc2, match: "false" },
      );
      callStack.pop();
      return false;
    }

    pushFrame(
      activeNodes,
      "Values Match",
      7,
      `Values match (${t1.val} === ${t2.val}). Now checking outer subtrees (t1.left vs t2.right).`,
      { leftNode: desc1, rightNode: desc2, match: "true" },
    );

    // Outer pair: t1.left vs t2.right
    const outerMatch = isMirror(
      t1.left,
      t2.right,
      t1.id,
      t2.id,
      "left",
      "right",
    );
    if (!outerMatch) {
      callStack.pop();
      return false;
    }

    pushFrame(
      activeNodes,
      "Check Inner Subtrees",
      7,
      `Outer subtrees matched! Now checking inner subtrees (t1.right vs t2.left).`,
      { leftNode: desc1, rightNode: desc2 },
    );

    // Inner pair: t1.right vs t2.left
    const innerMatch = isMirror(
      t1.right,
      t2.left,
      t1.id,
      t2.id,
      "right",
      "left",
    );
    if (!innerMatch) {
      callStack.pop();
      return false;
    }

    pushFrame(
      activeNodes,
      "Subtrees Symmetric",
      7,
      `Both outer and inner pairs matched for Node(${t1.val}) and Node(${t2.val}). Returning true.`,
      { leftNode: desc1, rightNode: desc2, match: "true" },
    );

    callStack.pop();
    return true;
  }

  const finalResult = isMirror(
    root.left,
    root.right,
    root.id,
    root.id,
    "left",
    "right",
  );

  pushFrame(
    [root.id],
    "Finished",
    9,
    `Tree is ${finalResult ? "symmetric" : "asymmetric"}. Returning ${finalResult}.`,
    { result: String(finalResult) },
  );

  return builder.getFrames();
}

export default generateFrames;
