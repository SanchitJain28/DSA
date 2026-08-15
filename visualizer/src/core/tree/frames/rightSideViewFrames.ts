import { FrameBuilder } from "../../shared/FrameBuilder";
import { TreeNode } from "../TreeNode";
import { computeLayout } from "../layout";
import type { Frame } from "../types";

export function generateFrames(root: TreeNode | null): Frame[] {
  const builder = new FrameBuilder<Frame>();

  if (!root) {
    builder.pushFrame({
      phase: "Initialization",
      codeLine: 2,
      message: "Root is null, returning empty array [].",
      variables: { root: "null", result: "[]" },
      callStack: [],
    });
    return builder.getFrames();
  }

  const layout = computeLayout(root);
  const rightSideNodeIds: string[] = [];

  const getBaseFrame = (
    codeLine: number,
    phase: string,
    message: string,
    queueState: string[],
    variables: Record<string, string | number> = {},
    activeMap: Record<string, "active" | "target" | "secondary" | "success"> = {}
  ): Frame => {
    const frameLayout = JSON.parse(JSON.stringify(layout));

    for (const node of frameLayout.nodes) {
      if (node.isNull) continue;

      if (rightSideNodeIds.includes(node.id)) {
        node.status = "success";
      }

      if (activeMap[node.id]) {
        node.status = activeMap[node.id];
      }
    }

    return {
      phase,
      codeLine,
      message,
      variables,
      callStack: [...queueState],
      layout: frameLayout,
    };
  };

  // Line 1: Function entry
  builder.pushFrame(
    getBaseFrame(
      1,
      "Initialization",
      "Start rightSideView algorithm to find nodes visible when looking at the binary tree from the right side.",
      []
    )
  );

  const result: number[] = [];
  const queue: TreeNode[] = [root];
  const queueState: string[] = [`Node(${root.val})`];

  // Line 3: Initialize result
  builder.pushFrame(
    getBaseFrame(
      3,
      "Setup",
      "Initialize empty result array to collect rightmost node values.",
      queueState,
      { result: "[]" }
    )
  );

  // Line 4: Initialize queue with root
  builder.pushFrame(
    getBaseFrame(
      4,
      "Initialize Queue",
      `Initialize queue with root node ${root.val}.`,
      queueState,
      { result: "[]", queue: `[Node(${root.val})]` },
      { [root.id]: "active" }
    )
  );

  let levelIndex = 0;

  while (queue.length > 0) {
    const levels = queue.length;
    const level: number[] = [];
    const levelNodes: TreeNode[] = [];

    // Line 5: while condition
    builder.pushFrame(
      getBaseFrame(
        5,
        "While Loop",
        `Queue has ${levels} node(s) for level ${levelIndex}.`,
        queueState,
        {
          levels,
          result: JSON.stringify(result),
          queue: `[${queue.map((n) => n.val).join(", ")}]`,
        }
      )
    );

    // Line 6: levels count
    builder.pushFrame(
      getBaseFrame(
        6,
        "Level Size",
        `Current level has ${levels} node(s) to process.`,
        queueState,
        {
          levels,
          result: JSON.stringify(result),
          level: "[]",
        }
      )
    );

    // Line 7: level array init
    builder.pushFrame(
      getBaseFrame(
        7,
        "Initialize Level",
        `Initialize empty level array for level ${levelIndex}.`,
        queueState,
        {
          levels,
          result: JSON.stringify(result),
          level: "[]",
        }
      )
    );

    for (let i = 0; i < levels; i++) {
      // Line 8: for loop
      builder.pushFrame(
        getBaseFrame(
          8,
          "Loop Level Nodes",
          `Processing node ${i + 1} of ${levels} at level ${levelIndex}.`,
          queueState,
          {
            i,
            levels,
            level: JSON.stringify(level),
            result: JSON.stringify(result),
          }
        )
      );

      const node = queue.shift()!;
      queueState.shift();
      levelNodes.push(node);

      // Line 9: queue.shift()
      builder.pushFrame(
        getBaseFrame(
          9,
          "Dequeue Node",
          `Dequeue node ${node.val} from the front of the queue.`,
          queueState,
          {
            i,
            levels,
            "node.val": node.val,
            level: JSON.stringify(level),
            result: JSON.stringify(result),
          },
          { [node.id]: "active" }
        )
      );

      level.push(node.val);

      // Line 10: level.push(node.val)
      builder.pushFrame(
        getBaseFrame(
          10,
          "Record Level Node",
          `Push ${node.val} into the current level array: [${level.join(", ")}].`,
          queueState,
          {
            i,
            levels,
            "node.val": node.val,
            level: JSON.stringify(level),
            result: JSON.stringify(result),
          },
          { [node.id]: "active" }
        )
      );

      // Line 11: left child
      if (node.left) {
        queue.push(node.left);
        queueState.push(`Node(${node.left.val})`);

        builder.pushFrame(
          getBaseFrame(
            11,
            "Enqueue Left",
            `Node ${node.val} has left child ${node.left.val}. Enqueue it for next level.`,
            queueState,
            {
              i,
              levels,
              "node.val": node.val,
              level: JSON.stringify(level),
              result: JSON.stringify(result),
            },
            { [node.id]: "active", [node.left.id]: "secondary" }
          )
        );
      } else {
        builder.pushFrame(
          getBaseFrame(
            11,
            "Check Left",
            `Node ${node.val} has no left child.`,
            queueState,
            {
              i,
              levels,
              "node.val": node.val,
              level: JSON.stringify(level),
              result: JSON.stringify(result),
            },
            { [node.id]: "active" }
          )
        );
      }

      // Line 12: right child
      if (node.right) {
        queue.push(node.right);
        queueState.push(`Node(${node.right.val})`);

        builder.pushFrame(
          getBaseFrame(
            12,
            "Enqueue Right",
            `Node ${node.val} has right child ${node.right.val}. Enqueue it for next level.`,
            queueState,
            {
              i,
              levels,
              "node.val": node.val,
              level: JSON.stringify(level),
              result: JSON.stringify(result),
            },
            { [node.id]: "active", [node.right.id]: "secondary" }
          )
        );
      } else {
        builder.pushFrame(
          getBaseFrame(
            12,
            "Check Right",
            `Node ${node.val} has no right child.`,
            queueState,
            {
              i,
              levels,
              "node.val": node.val,
              level: JSON.stringify(level),
              result: JSON.stringify(result),
            },
            { [node.id]: "active" }
          )
        );
      }
    }

    // Line 14: result.push(level.pop()!)
    const rightmostNode = levelNodes[levelNodes.length - 1];
    const rightmostVal = level.pop()!;
    result.push(rightmostVal);
    rightSideNodeIds.push(rightmostNode.id);

    builder.pushFrame(
      getBaseFrame(
        14,
        "Capture Rightmost Node",
        `Level ${levelIndex} complete! The rightmost node is ${rightmostVal}. Push ${rightmostVal} into right-side view result.`,
        queueState,
        {
          levelIndex,
          "rightmost visible": rightmostVal,
          result: JSON.stringify(result),
        },
        { [rightmostNode.id]: "success" }
      )
    );

    levelIndex++;
  }

  // Line 16: return result
  builder.pushFrame(
    getBaseFrame(
      16,
      "Return Result",
      `Queue is empty. All tree levels processed. Final Right Side View is [${result.join(", ")}].`,
      [],
      { result: JSON.stringify(result) }
    )
  );

  return builder.getFrames();
}
