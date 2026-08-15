import { FrameBuilder } from "../../shared/FrameBuilder";
import { TreeNode } from "../../tree/TreeNode";
import { computeLayout } from "../../tree/layout";
import type { Frame } from "../../tree/types";

export function generateFrames(n: number): Frame[] {
  const builder = new FrameBuilder<Frame>();

  let idCounter = 0;
  let globalRoot: TreeNode | null = null;

  function startSimulation(nVal: number) {
    idCounter = 0;

    builder.pushFrame({
      phase: "Initialization",
      codeLine: 1,
      message: `Calling climbStairs(${n})`,
      variables: { n: String(n) },
      layout: computeLayout(null),
    });

    const res = _simulateClimb(nVal, null, "root");

    builder.pushFrame({
      phase: "Finished",
      codeLine: 4,
      message: `Execution complete. Total ways to climb ${nVal} stairs: ${res}`,
      variables: { finalResult: String(res) },
      layout: computeLayout(globalRoot),
    });
  }

  function _simulateClimb(
    nVal: number,
    parentNode: TreeNode | null,
    side: "left" | "right" | "root",
  ): number {
    const currentId = `node-${idCounter++}`;
    const currentNode = new TreeNode(nVal, currentId);

    if (side === "root") {
      globalRoot = currentNode;
    } else if (parentNode) {
      if (side === "left") parentNode.left = currentNode;
      else if (side === "right") parentNode.right = currentNode;
    }

    builder.pushCall(`climbStairs(${nVal})`);

    builder.pushFrame({
      phase: "Call",
      codeLine: 1,
      message: `Entering climbStairs with n = ${nVal}`,
      variables: { n: String(nVal) },
      layout: computeLayout(globalRoot),
      activeNodeId: currentId,
    });

    builder.pushFrame({
      phase: "Check Base Case",
      codeLine: 2,
      message: `Checking if ${nVal} <= 2.`,
      variables: { n: String(nVal) },
      layout: computeLayout(globalRoot),
      activeNodeId: currentId,
    });

    if (nVal <= 2) {
      const res = nVal;
      builder.pushFrame({
        phase: "Return Base Case",
        codeLine: 2,
        message: `${nVal} <= 2, so return ${res}`,
        variables: { n: String(nVal), result: String(res) },
        layout: computeLayout(globalRoot),
        activeNodeId: currentId,
      });
      builder.popCall();
      return res;
    }

    builder.pushFrame({
      phase: "Recursive Calls",
      codeLine: 3,
      message: `Need to compute climbStairs(${nVal} - 1) and climbStairs(${nVal} - 2).`,
      variables: { n: String(nVal) },
      layout: computeLayout(globalRoot),
      activeNodeId: currentId,
    });

    const leftRes = _simulateClimb(nVal - 1, currentNode, "left");

    builder.pushFrame({
      phase: "After n-1 Call",
      codeLine: 3,
      message: `climbStairs(${nVal} - 1) returned ${leftRes}. Now compute climbStairs(${nVal} - 2).`,
      variables: { n: String(nVal), leftResult: String(leftRes) },
      layout: computeLayout(globalRoot),
      activeNodeId: currentId,
    });

    const rightRes = _simulateClimb(nVal - 2, currentNode, "right");

    const total = leftRes + rightRes;

    builder.pushFrame({
      phase: "Return Result",
      codeLine: 3,
      message: `Both recursive calls finished. ${leftRes} + ${rightRes} = ${total}. Returning ${total}.`,
      variables: { n: String(nVal), result: String(total) },
      layout: computeLayout(globalRoot),
      activeNodeId: currentId,
    });

    builder.popCall();
    return total;
  }

  startSimulation(n);

  return builder.getFrames();
}
