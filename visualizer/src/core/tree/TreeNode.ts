export class TreeNode {
  val: number;
  left: TreeNode | null;
  right: TreeNode | null;
  id: string;

  constructor(
    val: number,
    id: string,
    left?: TreeNode | null,
    right?: TreeNode | null,
  ) {
    this.val = val;
    this.id = id;
    this.left = left === undefined ? null : left;
    this.right = right === undefined ? null : right;
  }
}
