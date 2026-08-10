import { TreeNode } from "./TreeNode";

// Standard 1-9 Tree (used for Preorder, Inorder, Postorder, MaxDepth, InvertTree)
export function buildStandardTree() {
  const n1 = new TreeNode(1, "n1");
  const n3 = new TreeNode(3, "n3");
  const n6 = new TreeNode(6, "n6");
  const n9 = new TreeNode(9, "n9");
  const n2 = new TreeNode(2, "n2", n1, n3);
  const n7 = new TreeNode(7, "n7", n6, n9);
  const n4 = new TreeNode(4, "n4", n2, n7);
  return n4;
}

export function buildDiameterTree() {
  const n8 = new TreeNode(8, "n8");
  const n9 = new TreeNode(9, "n9");
  const n4 = new TreeNode(4, "n4", n8);
  const n5 = new TreeNode(5, "n5", null, n9);
  const n2 = new TreeNode(2, "n2", n4, n5);
  const n3 = new TreeNode(3, "n3");
  const n1 = new TreeNode(1, "n1", n2, n3);
  return n1;
}

// Unbalanced Tree (used for Balanced Binary Tree)
export function buildUnbalancedTree() {
  const n6 = new TreeNode(6, "n6");
  const n4 = new TreeNode(4, "n4", n6);
  const n5 = new TreeNode(5, "n5");
  const n2 = new TreeNode(2, "n2", n4, n5);
  const n3 = new TreeNode(3, "n3");
  const n1 = new TreeNode(1, "n1", n2, n3);
  return n1;
}

export function buildPathSumTree() {
  const n7 = new TreeNode(7, "n7");
  const n2 = new TreeNode(2, "n2");
  const n1 = new TreeNode(1, "n1");
  const n11 = new TreeNode(11, "n11", n7, n2);
  const n13 = new TreeNode(13, "n13");
  const n4_2 = new TreeNode(4, "n4_2", null, n1);
  const n4_1 = new TreeNode(4, "n4_1", n11);
  const n8 = new TreeNode(8, "n8", n13, n4_2);
  const n5 = new TreeNode(5, "n5", n4_1, n8);
  return n5;
}

export function buildSymmetricTree() {
  const left_3 = new TreeNode(3, "l_3");
  const left_4 = new TreeNode(4, "l_4");
  const left_2 = new TreeNode(2, "l_2", left_3, left_4);

  const right_4 = new TreeNode(4, "r_4");
  const right_3 = new TreeNode(3, "r_3");
  const right_2 = new TreeNode(2, "r_2", right_4, right_3);

  const root = new TreeNode(1, "root", left_2, right_2);
  return root;
}

export function deepCopyTree(node: TreeNode | null): TreeNode | null {
  if (!node) return null;
  return new TreeNode(
    node.val,
    node.id,
    deepCopyTree(node.left),
    deepCopyTree(node.right),
  );
}
