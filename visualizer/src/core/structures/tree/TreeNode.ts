export class TreeNode {
  val: number;
  id: string;
  left: TreeNode | null;
  right: TreeNode | null;

  constructor(
    val: number,
    id?: string,
    left: TreeNode | null = null,
    right: TreeNode | null = null,
  ) {
    this.val = val;
    this.id = id || `node_${Math.random().toString(36).substr(2, 6)}`;
    this.left = left;
    this.right = right;
  }
}
