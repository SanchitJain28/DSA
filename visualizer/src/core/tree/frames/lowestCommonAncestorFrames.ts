import { FrameBuilder } from "../../shared/FrameBuilder";
import { TreeNode } from "../TreeNode";
import { computeLayout } from "../layout";
import type { Frame } from "../types";

export function generateFrames(root: TreeNode | null, pVal: number, qVal: number): Frame[] {
  const builder = new FrameBuilder<Frame>();
  
  function findNodeDFS(node: TreeNode | null, val: number): TreeNode | null {
    if (!node) return null;
    if (node.val === val) return node;
    return findNodeDFS(node.left, val) || findNodeDFS(node.right, val);
  }

  const pNode = findNodeDFS(root, pVal);
  const qNode = findNodeDFS(root, qVal);

  if (!pNode || !qNode) return [];

  const layout = computeLayout(root);

  const getBaseFrame = () => ({
    variables: {
      p: String(pNode.val),
      q: String(qNode.val),
    },
    layout: JSON.parse(JSON.stringify(layout)),
  });

  const markNode = (frameLayout: any, id: string, type: "active" | "target" | "secondary" | "success") => {
    const node = frameLayout.nodes.find((n: any) => n.id === id);
    if (node) node.status = type;
  };

  builder.pushFrame({
    ...getBaseFrame(),
    phase: "Initialization",
    codeLine: 1,
    message: `Starting Lowest Common Ancestor search for nodes ${pVal} and ${qVal}.`,
  });

  function _lowestCommonAncestor(node: TreeNode | null): TreeNode | null {
    const nodeVal = node ? node.val : "null";
    builder.pushCall(`LCA(${nodeVal}, ${pVal}, ${qVal})`);

    const frameLayout = getBaseFrame().layout;
    if (node) markNode(frameLayout, node.id, "active");
    markNode(frameLayout, pNode!.id, "target");
    markNode(frameLayout, qNode!.id, "target");

    builder.pushFrame({
      ...getBaseFrame(),
      layout: frameLayout,
      phase: "Call",
      codeLine: 6,
      message: `Entering LCA with root = ${nodeVal}.`,
      variables: { ...getBaseFrame().variables, root: String(nodeVal) },
    });

    if (!node) {
      builder.pushFrame({
        ...getBaseFrame(),
        layout: frameLayout,
        phase: "Base Case",
        codeLine: 6,
        message: `root is null, returning null.`,
        variables: { ...getBaseFrame().variables, root: "null" },
      });
      builder.popCall();
      return null;
    }

    builder.pushFrame({
      ...getBaseFrame(),
      layout: frameLayout,
      phase: "Comparison",
      codeLine: 7,
      message: `Comparing p (${pVal}) and q (${qVal}) with root (${node.val}).`,
      variables: { ...getBaseFrame().variables, root: String(nodeVal) },
    });

    if (pVal < node.val && qVal < node.val) {
      builder.pushFrame({
        ...getBaseFrame(),
        layout: frameLayout,
        phase: "Go Left",
        codeLine: 8,
        message: `Both p and q are less than root, so LCA must be in the left subtree.`,
        variables: { ...getBaseFrame().variables, root: String(nodeVal) },
      });
      const res = _lowestCommonAncestor(node.left);
      builder.popCall();
      return res;
    } else if (pVal > node.val && qVal > node.val) {
      builder.pushFrame({
        ...getBaseFrame(),
        layout: frameLayout,
        phase: "Go Right",
        codeLine: 10,
        message: `Both p and q are greater than root, so LCA must be in the right subtree.`,
        variables: { ...getBaseFrame().variables, root: String(nodeVal) },
      });
      const res = _lowestCommonAncestor(node.right);
      builder.popCall();
      return res;
    } else {
      const finalLayout = getBaseFrame().layout;
      markNode(finalLayout, node.id, "success");
      
      builder.pushFrame({
        ...getBaseFrame(),
        layout: finalLayout,
        phase: "Found LCA",
        codeLine: 11,
        message: `p and q are on different sides (or one is the root). Therefore, ${node.val} is the Lowest Common Ancestor!`,
        variables: { ...getBaseFrame().variables, root: String(nodeVal) },
      });
      builder.popCall();
      return node;
    }
  }

  _lowestCommonAncestor(root);

  return builder.getFrames();
}
