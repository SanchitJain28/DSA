import type { Frame } from "../types";
import { FrameBuilder } from "../../shared/FrameBuilder";
import { TreeNode } from "../TreeNode";

export function generateFrames(root: TreeNode | null): Frame[] {
  const builder = new FrameBuilder<Frame>();
  
  builder.pushFrame({
    phase: "Initialization",
    codeLine: 1,
    message: "Starting countNodes visualization.",
    activeNodeIds: root ? [root.id] : [],
    variables: { root: root ? `Node(${root.val})` : "null" }
  });

  function countNodes(node: TreeNode | null, callStackIndex: number): number {
    const currentCall = `countNodes(${node ? node.val : 'null'})`;
    builder.pushCall(currentCall);

    if (!node) {
      builder.pushFrame({
        phase: "Base Case",
        codeLine: 2,
        message: "Node is null. Return 0.",
        activeNodeIds: [],
        variables: { root: "null" }
      });
      builder.popCall();
      return 0;
    }

    builder.pushFrame({
      phase: "Init Pointers",
      codeLine: 3,
      message: `Initialize left and right pointers at node ${node.val}.`,
      activeNodeIds: [node.id],
      variables: { root: node.val, left: node.val, right: node.val, leftHeight: 0, rightHeight: 0 }
    });

    let left: TreeNode | null = node;
    let right: TreeNode | null = node;
    let leftHeight = 0;
    let rightHeight = 0;

    // Traverse left
    while (left) {
      builder.pushFrame({
        phase: "Left Traversal",
        codeLine: 7,
        message: `Traversing left child of ${left.val}.`,
        activeNodeIds: [left.id],
        variables: { root: node.val, left: left.val, right: right ? right.val : "null", leftHeight, rightHeight }
      });
      left = left.left;
      leftHeight++;
    }

    builder.pushFrame({
      phase: "Left Height",
      codeLine: 10,
      message: `Left height from node ${node.val} is ${leftHeight}.`,
      activeNodeIds: [node.id],
      variables: { root: node.val, left: "null", right: right ? right.val : "null", leftHeight, rightHeight }
    });

    // Traverse right
    while (right) {
      builder.pushFrame({
        phase: "Right Traversal",
        codeLine: 11,
        message: `Traversing right child of ${right.val}.`,
        activeNodeIds: [right.id],
        variables: { root: node.val, left: "null", right: right.val, leftHeight, rightHeight }
      });
      right = right.right;
      rightHeight++;
    }

    builder.pushFrame({
      phase: "Right Height",
      codeLine: 14,
      message: `Right height from node ${node.val} is ${rightHeight}.`,
      activeNodeIds: [node.id],
      variables: { root: node.val, left: "null", right: "null", leftHeight, rightHeight }
    });

    builder.pushFrame({
      phase: "Compare Heights",
      codeLine: 15,
      message: `Comparing leftHeight (${leftHeight}) with rightHeight (${rightHeight}).`,
      activeNodeIds: [node.id],
      variables: { root: node.val, left: "null", right: "null", leftHeight, rightHeight }
    });

    if (leftHeight === rightHeight) {
      const nodes = Math.pow(2, leftHeight) - 1;
      builder.pushFrame({
        phase: "Perfect Subtree",
        codeLine: 15,
        message: `Subtree is a perfect binary tree. Nodes = 2^${leftHeight} - 1 = ${nodes}.`,
        activeNodeIds: [node.id],
        variables: { root: node.val, left: "null", right: "null", leftHeight, rightHeight, result: nodes }
      });
      builder.popCall();
      return nodes;
    }

    builder.pushFrame({
      phase: "Recursive Case",
      codeLine: 16,
      message: `Subtree at ${node.val} is not perfect. Returning 1 + countNodes(left) + countNodes(right).`,
      activeNodeIds: [node.id],
      variables: { root: node.val, left: "null", right: "null", leftHeight, rightHeight }
    });

    const leftNodes = countNodes(node.left, callStackIndex + 1);
    const rightNodes = countNodes(node.right, callStackIndex + 1);
    const total = 1 + leftNodes + rightNodes;

    builder.pushCall(currentCall);
    builder.pushFrame({
      phase: "Return Total",
      codeLine: 16,
      message: `Total nodes for subtree at ${node.val} is 1 + ${leftNodes} + ${rightNodes} = ${total}.`,
      activeNodeIds: [node.id],
      variables: { root: node.val, left: "null", right: "null", leftHeight, rightHeight, total }
    });
    builder.popCall();

    return total;
  }

  const finalTotal = countNodes(root, 0);

  builder.pushFrame({
    phase: "Finished",
    codeLine: 17,
    message: `Total nodes in the tree: ${finalTotal}.`,
    activeNodeIds: [],
    variables: { total: finalTotal }
  });

  return builder.getFrames();
}
