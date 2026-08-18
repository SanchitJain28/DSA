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
  const processedNodeIds = new Set<string>();

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

      if (processedNodeIds.has(node.id)) {
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
      "Start zigzagLevelOrder traversal (alternating Left-to-Right and Right-to-Left level order).",
      []
    )
  );

  const result: number[][] = [];
  const queue: TreeNode[] = [root];
  const queueState: string[] = [`Node(${root.val})`];

  // Line 3: Initialize result
  builder.pushFrame(
    getBaseFrame(
      3,
      "Setup",
      "Initialize empty result 2D array: [].",
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

  // Line 5: Initialize inverted = true
  let inverted = true;
  builder.pushFrame(
    getBaseFrame(
      5,
      "Flag Setup",
      "Initialize inverted = true (will flip to false on level 0 for left-to-right).",
      queueState,
      { inverted: "true", result: "[]" }
    )
  );

  let levelIndex = 0;

  while (queue.length > 0) {
    const levels = queue.length;
    const level: number[] = [];
    const currentLevelNodes: TreeNode[] = [];

    // Line 6: while condition
    builder.pushFrame(
      getBaseFrame(
        6,
        "While Loop",
        `Level ${levelIndex}: Queue has ${levels} node(s).`,
        queueState,
        {
          levelIndex,
          levels,
          queue: `[${queue.map((n) => n.val).join(", ")}]`,
          result: JSON.stringify(result),
        }
      )
    );

    // Line 7: levels count
    builder.pushFrame(
      getBaseFrame(
        7,
        "Level Size",
        `Current level size is levels = ${levels}.`,
        queueState,
        { levelIndex, levels, result: JSON.stringify(result) }
      )
    );

    // Line 8: level array init
    builder.pushFrame(
      getBaseFrame(
        8,
        "Initialize Level",
        `Initialize empty level array for level ${levelIndex}.`,
        queueState,
        { levelIndex, levels, level: "[]", result: JSON.stringify(result) }
      )
    );

    // Line 9: flip inverted flag
    inverted = !inverted;
    const direction = inverted ? "Right to Left (←)" : "Left to Right (→)";

    builder.pushFrame(
      getBaseFrame(
        9,
        "Toggle Direction",
        `Inverted flag toggled to ${inverted}. Traversal direction for level ${levelIndex} will be ${direction}.`,
        queueState,
        {
          levelIndex,
          inverted: inverted.toString(),
          direction,
          level: "[]",
          result: JSON.stringify(result),
        }
      )
    );

    for (let i = 0; i < levels; i++) {
      // Line 10: for loop
      builder.pushFrame(
        getBaseFrame(
          10,
          "Loop Level Nodes",
          `Processing node ${i + 1} of ${levels} at level ${levelIndex}.`,
          queueState,
          {
            levelIndex,
            i,
            levels,
            direction,
            level: JSON.stringify(level),
            result: JSON.stringify(result),
          }
        )
      );

      const node = queue.shift()!;
      queueState.shift();
      currentLevelNodes.push(node);

      // Line 11: queue.shift()
      builder.pushFrame(
        getBaseFrame(
          11,
          "Dequeue Node",
          `Dequeue node ${node.val} from queue.`,
          queueState,
          {
            levelIndex,
            i,
            levels,
            "node.val": node.val,
            direction,
            level: JSON.stringify(level),
            result: JSON.stringify(result),
          },
          { [node.id]: "active" }
        )
      );

      level.push(node.val);

      // Line 12: level.push(node.val)
      builder.pushFrame(
        getBaseFrame(
          12,
          "Record Level Node",
          `Add ${node.val} to current level array: [${level.join(", ")}].`,
          queueState,
          {
            levelIndex,
            i,
            levels,
            "node.val": node.val,
            direction,
            level: JSON.stringify(level),
            result: JSON.stringify(result),
          },
          { [node.id]: "active" }
        )
      );

      // Line 13: left child
      if (node.left) {
        queue.push(node.left);
        queueState.push(`Node(${node.left.val})`);

        builder.pushFrame(
          getBaseFrame(
            13,
            "Enqueue Left",
            `Node ${node.val} has left child ${node.left.val}. Enqueue for next level.`,
            queueState,
            {
              levelIndex,
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
            13,
            "Check Left",
            `Node ${node.val} has no left child.`,
            queueState,
            {
              levelIndex,
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

      // Line 14: right child
      if (node.right) {
        queue.push(node.right);
        queueState.push(`Node(${node.right.val})`);

        builder.pushFrame(
          getBaseFrame(
            14,
            "Enqueue Right",
            `Node ${node.val} has right child ${node.right.val}. Enqueue for next level.`,
            queueState,
            {
              levelIndex,
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
            14,
            "Check Right",
            `Node ${node.val} has no right child.`,
            queueState,
            {
              levelIndex,
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

    // Line 16: result.push(inverted ? level.reverse() : level)
    const finalLevelValues = inverted ? [...level].reverse() : [...level];
    result.push(finalLevelValues);

    for (const node of currentLevelNodes) {
      processedNodeIds.add(node.id);
    }

    builder.pushFrame(
      getBaseFrame(
        16,
        "Zigzag Push Level",
        `Level ${levelIndex} complete! ${
          inverted
            ? `Inverted flag is true -> Reversed [${level.join(", ")}] to [${finalLevelValues.join(", ")}] (Right-to-Left)`
            : `Inverted flag is false -> Kept [${finalLevelValues.join(", ")}] (Left-to-Right)`
        }. Push to result.`,
        queueState,
        {
          levelIndex,
          direction,
          "added level": JSON.stringify(finalLevelValues),
          result: JSON.stringify(result),
        }
      )
    );

    levelIndex++;
  }

  // Line 18: return result
  builder.pushFrame(
    getBaseFrame(
      18,
      "Return Result",
      `Queue is empty. Zigzag Level Order Traversal completed! Final result: ${JSON.stringify(result)}.`,
      [],
      { result: JSON.stringify(result) }
    )
  );

  return builder.getFrames();
}
