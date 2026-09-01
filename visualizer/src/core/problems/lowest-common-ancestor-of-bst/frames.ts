import { FrameBuilder } from "../../shared/FrameBuilder";
import type { Scene } from "../../shared/types";
import { TreeNode } from "../../structures/tree/TreeNode";
import { buildTreeFromLevelOrder, toTreeState } from "../../structures/tree/helpers";

export function generateFrames(data: {
  values: (number | null)[];
  p: number;
  q: number;
}): Scene[] {
  const values = data.values || [];
  const { p, q } = data;
  const builder = new FrameBuilder<Scene>();
  const root = buildTreeFromLevelOrder(values);

  function findNode(node: TreeNode | null, val: number): TreeNode | null {
    if (!node) return null;
    if (node.val === val) return node;
    return findNode(node.left, val) || findNode(node.right, val);
  }

  const pNode = findNode(root, p);
  const qNode = findNode(root, q);
  const baseTreeState = toTreeState(root);

  const pushFrame = (
    activeNodeId: string | null,
    phase: string,
    codeLine: number,
    explanation: string,
    successId: string | null = null,
  ) => {
    const treeNodes = baseTreeState.nodes.map((n) => {
      if (successId && n.id === successId) {
        return { ...n, status: "success" as const };
      }
      if (pNode && n.id === pNode.id) {
        return { ...n, status: "target" as const };
      }
      if (qNode && n.id === qNode.id) {
        return { ...n, status: "target" as const };
      }
      return n;
    });

    builder.pushFrame({
      phase,
      codeLine,
      explanation,
      structures: {
        tree: {
          nodes: treeNodes,
          edges: baseTreeState.edges,
          activeNodeId,
        },
      },
      variables: {
        p: String(p),
        q: String(q),
        curr: activeNodeId ? baseTreeState.nodes.find((n) => n.id === activeNodeId)?.val ?? "null" : "null",
      },
    });
  };

  pushFrame(
    null,
    "Initialization",
    1,
    `Start lowestCommonAncestor for target nodes p = ${p} and q = ${q}.`,
  );

  let curr: TreeNode | null = root;

  while (curr) {
    pushFrame(
      curr.id,
      "Check Current Node",
      3,
      `Visiting Node(${curr.val}). Comparing with p = ${p} and q = ${q}.`,
    );

    if (p < curr.val && q < curr.val) {
      pushFrame(
        curr.id,
        "Branch Left",
        4,
        `Both p (${p}) and q (${q}) < curr (${curr.val}). LCA must be in the left subtree.`,
      );
      curr = curr.left;
    } else if (p > curr.val && q > curr.val) {
      pushFrame(
        curr.id,
        "Branch Right",
        6,
        `Both p (${p}) and q (${q}) > curr (${curr.val}). LCA must be in the right subtree.`,
      );
      curr = curr.right;
    } else {
      // Found split point!
      pushFrame(
        curr.id,
        "LCA Found!",
        9,
        `Split point found at Node(${curr.val})! p and q lie on different sides (or one equals curr). Node(${curr.val}) is the Lowest Common Ancestor!`,
        curr.id,
      );
      break;
    }
  }

  return builder.getFrames();
}

export default generateFrames;
