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
    activeNodeId: string | null,
    phase: string,
    codeLine: number,
    explanation: string,
    minVal: number,
    maxVal: number,
    isValid: boolean,
  ) => {
    const minStr = minVal === -Infinity ? "-∞" : String(minVal);
    const maxStr = maxVal === Infinity ? "+∞" : String(maxVal);

    builder.pushFrame({
      phase,
      codeLine,
      explanation,
      callStack: [...callStack],
      structures: {
        tree: {
          ...baseTreeState,
          activeNodeId,
        },
      },
      variables: {
        validRange: `(${minStr}, ${maxStr})`,
        isValid: String(isValid),
      },
    });
  };

  pushFrame(
    null,
    "Initialization",
    1,
    `Start isValidBST with root: ${root ? `Node(${root.val})` : "null"}. Initial range: (-∞, +∞).`,
    -Infinity,
    Infinity,
    true,
  );

  if (!root) {
    pushFrame(null, "Base Case", 3, "Root is null. Empty tree is valid BST (true).", -Infinity, Infinity, true);
    return builder.getFrames();
  }

  function validate(
    node: TreeNode | null,
    parentId: string | null,
    side: string,
    min: number,
    max: number,
  ): boolean {
    const minStr = min === -Infinity ? "-∞" : String(min);
    const maxStr = max === Infinity ? "+∞" : String(max);

    if (!node) {
      callStack.push("validate(null)");
      const nullId = `${parentId}-${side}-null`;
      pushFrame(
        nullId,
        "Base Case (null)",
        3,
        `Reached null child from ${parentId}. Null is a valid BST. Returning true.`,
        min,
        max,
        true,
      );
      callStack.pop();
      return true;
    }

    callStack.push(`validate(${node.val}, ${minStr} < x < ${maxStr})`);
    const id = node.id;

    // Check bounds
    const inBounds = node.val > min && node.val < max;

    pushFrame(
      id,
      "Check Range Bounds",
      4,
      `Checking Node(${node.val}): Is ${minStr} < ${node.val} < ${maxStr}? ${
        inBounds ? "YES (Valid)" : "NO! BST violation!"
      }`,
      min,
      max,
      inBounds,
    );

    if (!inBounds) {
      pushFrame(
        id,
        "Invalid BST Detected",
        4,
        `Node(${node.val}) violates BST property for range (${minStr}, ${maxStr}). Returning false.`,
        min,
        max,
        false,
      );
      callStack.pop();
      return false;
    }

    // Recurse left: min < left < node.val
    pushFrame(
      id,
      "Recurse Left",
      5,
      `Explore left subtree of Node(${node.val}) with range (${minStr}, ${node.val}).`,
      min,
      node.val,
      true,
    );
    if (!validate(node.left, id, "left", min, node.val)) {
      callStack.pop();
      return false;
    }

    // Recurse right: node.val < right < max
    pushFrame(
      id,
      "Recurse Right",
      5,
      `Left subtree of Node(${node.val}) is valid! Explore right subtree with range (${node.val}, ${maxStr}).`,
      node.val,
      max,
      true,
    );
    if (!validate(node.right, id, "right", node.val, max)) {
      callStack.pop();
      return false;
    }

    callStack.pop();
    return true;
  }

  const finalResult = validate(root, null, "root", -Infinity, Infinity);

  pushFrame(
    root.id,
    "Finished",
    7,
    `Validation complete! Tree is ${finalResult ? "a VALID BST (true)" : "an INVALID BST (false)"}.`,
    -Infinity,
    Infinity,
    finalResult,
  );

  return builder.getFrames();
}

export default generateFrames;
