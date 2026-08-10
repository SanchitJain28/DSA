# Frame Generation Guide

This document explains the core concept of the Visualizer: **Frame Generation**. 
Creating accurate, detailed frames is the most important part of building a new algorithm visualizer, as it directly dictates what the user sees in the UI.

## What is a Frame?

A `Frame` represents a single, frozen snapshot in time during the execution of an algorithm. The visualizer UI works by stepping forward and backward through an array of these discrete frames.

A typical `Frame` interface looks like this:
```typescript
interface Frame {
  callStack: string[];
  activeNodeId: string | null;      // Or activeNodeIds: string[] for multiple nodes
  phase: string;
  codeLine: number;
  message: React.ReactNode;
  variables?: Record<string, string | number>;
  layout?: Layout;                  // For algorithms that modify structure
}
```

## The `pushFrame` Pattern

Every frame generation file (e.g., `src/core/tree/frames/preorderFrames.ts`) follows a specific pattern. You write the actual algorithm in JavaScript/TypeScript, but you augment it with a `pushFrame` helper function to capture snapshots.

### Standard Setup

```typescript
export function generateFrames(root: TreeNode | null): Frame[] {
  const frames: Frame[] = [];
  const callStack: string[] = [];

  const pushFrame = (
    activeNodeId: string | null,
    phase: string,
    codeLine: number,
    msg: string,
    variables: Record<string, string | number> = {}
  ) => {
    frames.push({
      callStack: [...callStack], // CRITICAL: Always spread the callStack to avoid reference bugs
      activeNodeId,
      phase,
      codeLine,
      message: msg,
      variables
    });
  };

  // ... Algorithm goes here ...

  return frames;
}
```

## Golden Rules for Accurate Frames

To build an educational, high-quality visualizer, follow these rules carefully:

### 1. Document Every Branch and Base Case
Do not skip over base cases (like hitting a `null` node). Users need to see *why* the recursion stops.

**Correct:**
```typescript
if (!node) {
  callStack.push("null");
  pushFrame(null, "Base Case", 2, "Reached a null node, returning to parent.");
  callStack.pop();
  return;
}
```

### 2. Manage the Call Stack Manually
Because you are running the algorithm synchronously to generate frames, you must manually simulate the Call Stack array.
- Call `callStack.push('functionName()')` *before* pushing a frame for that function step.
- Call `callStack.pop()` *right before* the function returns.

### 3. Deep Copy on Mutation (Dynamic Layouts)
If your algorithm modifies the data structure (e.g., Invert Binary Tree, sorting a Linked List), you **must** take a deep copy of the structure when capturing the frame, otherwise all frames will point to the final mutated structure!

```typescript
const pushFrame = (/* ...args */) => {
  const currentTreeSnapshot = deepCopyTree(root); // Deep copy!
  frames.push({
    // ...
    layout: computeLayout(currentTreeSnapshot) // Compute layout for the snapshot
  });
};
```
*Note: If the algorithm does NOT modify the structure (e.g., standard traversals), you don't need to do this. A single static layout is computed by the UI.*

### 4. Code Line Mapping
Ensure the `codeLine` passed to `pushFrame` exactly matches the line number of the executing code mapped in your `src/core/*/sourcecode/*.ts` file. This allows the UI to highlight the exact line of code currently running.

### 5. Multi-Node Tracking
If an algorithm compares multiple nodes at once (e.g., `Same Tree` or `Subtree`), use `activeNodeIds` (an array of strings) instead of a single `activeNodeId` so the UI highlights all relevant nodes simultaneously.

```typescript
pushFrame(
  [p.id, q.id], 
  "Compare Nodes", 
  7, 
  `Comparing values: ${p.val} and ${q.val}`
);
```

### 6. Meaningful Messages
The `message` property is rendered as an explanation at the bottom of the UI. Make it educational. Explain *what* is happening and *why*.
- **Bad**: "Going left."
- **Good**: "Exploring the left subtree of node 4 to find the target value."
