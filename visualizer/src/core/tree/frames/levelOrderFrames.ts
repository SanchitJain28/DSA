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
      message: "Root is null, returning empty array.",
      variables: { root: "null" }
    });
    return builder.getFrames();
  }

  const layout = computeLayout(root);

  const getBaseFrame = () => ({
    variables: {} as Record<string, string | number>,
    layout: JSON.parse(JSON.stringify(layout)),
  });

  const markNodes = (frameLayout: any, idMap: Record<string, "active" | "target" | "secondary" | "success">) => {
    for (const node of frameLayout.nodes) {
      if (idMap[node.id]) {
        node.status = idMap[node.id];
      }
    }
  };

  builder.pushFrame({
    ...getBaseFrame(),
    phase: "Initialization",
    codeLine: 1,
    message: "Starting Level Order Traversal.",
  });

  const queue: TreeNode[] = [root];
  const result: number[][] = [];
  
  // Custom queue visualization instead of pushing/popping from builder.callStack
  const queueState: string[] = [`Node(${root.val})`];

  builder.pushFrame({
    ...getBaseFrame(),
    phase: "Setup",
    codeLine: 3,
    message: `Initialize queue with root node ${root.val}.`,
    callStack: [...queueState]
  });

  builder.pushFrame({
    ...getBaseFrame(),
    phase: "Setup",
    codeLine: 4,
    message: "Initialize empty result array.",
    callStack: [...queueState],
    variables: { result: JSON.stringify(result) }
  });

  while (queue.length > 0) {
    builder.pushFrame({
      ...getBaseFrame(),
      phase: "While Loop",
      codeLine: 5,
      message: `Queue has ${queue.length} elements.`,
      callStack: [...queueState],
      variables: { result: JSON.stringify(result) }
    });

    const levelSize = queue.length;
    const level: number[] = [];
    
    builder.pushFrame({
      ...getBaseFrame(),
      phase: "Level Setup",
      codeLine: 6,
      message: `Current level size is ${levelSize}.`,
      callStack: [...queueState],
      variables: { levelSize, result: JSON.stringify(result), level: JSON.stringify(level) }
    });

    for (let i = 0; i < levelSize; i++) {
      const node = queue.shift()!;
      queueState.shift(); // remove from our string queue
      
      const frameLayout = getBaseFrame().layout;
      markNodes(frameLayout, { [node.id]: "active" });

      builder.pushFrame({
        ...getBaseFrame(),
        layout: frameLayout,
        phase: "Process Node",
        codeLine: 9,
        message: `Dequeue node ${node.val}.`,
        callStack: [...queueState],
        variables: { i, levelSize, result: JSON.stringify(result), level: JSON.stringify(level), node: node.val }
      });

      level.push(node.val);

      builder.pushFrame({
        ...getBaseFrame(),
        layout: frameLayout,
        phase: "Process Node",
        codeLine: 10,
        message: `Add ${node.val} to current level array.`,
        callStack: [...queueState],
        variables: { i, levelSize, result: JSON.stringify(result), level: JSON.stringify(level), node: node.val }
      });

      if (node.left) {
        queue.push(node.left);
        queueState.push(`Node(${node.left.val})`);
        
        markNodes(frameLayout, { [node.id]: "active", [node.left.id]: "secondary" });
        
        builder.pushFrame({
          ...getBaseFrame(),
          layout: frameLayout,
          phase: "Enqueue Children",
          codeLine: 11,
          message: `Enqueue left child ${node.left.val}.`,
          callStack: [...queueState],
          variables: { i, levelSize, result: JSON.stringify(result), level: JSON.stringify(level), node: node.val }
        });
      }

      if (node.right) {
        queue.push(node.right);
        queueState.push(`Node(${node.right.val})`);
        
        markNodes(frameLayout, { [node.id]: "active", [node.right.id]: "secondary" });

        builder.pushFrame({
          ...getBaseFrame(),
          layout: frameLayout,
          phase: "Enqueue Children",
          codeLine: 12,
          message: `Enqueue right child ${node.right.val}.`,
          callStack: [...queueState],
          variables: { i, levelSize, result: JSON.stringify(result), level: JSON.stringify(level), node: node.val }
        });
      }
    }

    result.push(level);
    
    // Highlight all nodes in this level as success
    const currentLayout = getBaseFrame().layout;
    // We don't easily have the node IDs of this level, but we can just use the values for a rough map, 
    // or skip highlighting them as success for simplicity, but let's do it for effect.
    // Actually, since nodes can have duplicate values, this might be tricky without keeping track.
    
    builder.pushFrame({
      ...getBaseFrame(),
      layout: currentLayout,
      phase: "End Level",
      codeLine: 14,
      message: `Level complete! Adding ${JSON.stringify(level)} to result.`,
      callStack: [...queueState],
      variables: { result: JSON.stringify(result) }
    });
  }

  builder.pushFrame({
    ...getBaseFrame(),
    phase: "Return",
    codeLine: 16,
    message: `Queue is empty. Returning final result.`,
    callStack: [...queueState],
    variables: { result: JSON.stringify(result) }
  });

  return builder.getFrames();
}
