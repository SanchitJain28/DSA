import { FrameBuilder } from "../../shared/FrameBuilder";
import type { Scene } from "../../shared/types";
import { TreeNode } from "../../structures/tree/TreeNode";
import { toTreeState } from "../../structures/tree/helpers";

export function generateFrames(data: { n: number }): Scene[] {
  const n = Math.min(data.n, 5); // cap at 5 for clean recursion tree
  const builder = new FrameBuilder<Scene>();

  let idCounter = 0;
  let globalRoot: TreeNode | null = null;

  function startSimulation(nVal: number) {
    idCounter = 0;

    builder.pushFrame({
      phase: "Initialization",
      codeLine: 1,
      explanation: `Calling climbStairs(${n})`,
      structures: {
        tree: toTreeState(null),
      },
      variables: { n },
    });

    const res = _simulateClimb(nVal, null, "root");

    builder.pushFrame({
      phase: "Finished",
      codeLine: 4,
      explanation: `Execution complete. Total ways to climb ${nVal} stairs: ${res}`,
      structures: {
        tree: toTreeState(globalRoot),
      },
      variables: { finalResult: res },
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
      explanation: `Entering climbStairs with n = ${nVal}`,
      structures: {
        tree: toTreeState(globalRoot, currentId),
      },
      variables: { n: nVal },
    });

    builder.pushFrame({
      phase: "Check Base Case",
      codeLine: 2,
      explanation: `Checking if ${nVal} <= 2.`,
      structures: {
        tree: toTreeState(globalRoot, currentId),
      },
      variables: { n: nVal },
    });

    if (nVal <= 2) {
      const res = nVal;
      builder.pushFrame({
        phase: "Return Base Case",
        codeLine: 2,
        explanation: `${nVal} <= 2, so return ${res}`,
        structures: {
          tree: toTreeState(globalRoot, currentId),
        },
        variables: { n: nVal, result: res },
      });
      builder.popCall();
      return res;
    }

    builder.pushFrame({
      phase: "Recursive Calls",
      codeLine: 3,
      explanation: `Need to compute climbStairs(${nVal} - 1) and climbStairs(${nVal} - 2).`,
      structures: {
        tree: toTreeState(globalRoot, currentId),
      },
      variables: { n: nVal },
    });

    const leftRes = _simulateClimb(nVal - 1, currentNode, "left");

    builder.pushFrame({
      phase: "After n-1 Call",
      codeLine: 3,
      explanation: `climbStairs(${nVal} - 1) returned ${leftRes}. Now compute climbStairs(${nVal} - 2).`,
      structures: {
        tree: toTreeState(globalRoot, currentId),
      },
      variables: { n: nVal, leftResult: leftRes },
    });

    const rightRes = _simulateClimb(nVal - 2, currentNode, "right");

    const total = leftRes + rightRes;

    builder.pushFrame({
      phase: "Return Result",
      codeLine: 3,
      explanation: `Both recursive calls finished. ${leftRes} + ${rightRes} = ${total}. Returning ${total}.`,
      structures: {
        tree: toTreeState(globalRoot, currentId),
      },
      variables: { n: nVal, result: total },
    });

    builder.popCall();
    return total;
  }

  startSimulation(n);

  return builder.getFrames();
}

export default generateFrames;
