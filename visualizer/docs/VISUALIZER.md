# DSA Visualizer Architecture & Creation Guide

This document outlines the architecture, rules, and best practices for creating new algorithm visualizers in this repository. **You MUST read this document before creating or modifying any visualizer.**

## Architecture Overview

The visualizer application is built using React, Framer Motion, and Tailwind CSS. It uses a **frame-based animation system**, where an algorithm executes entirely in JavaScript memory to generate a discrete array of "Frames." The React UI then steps forward and backward through these frames over time.

### Core Separation of Concerns

1. **Core Data Structures (`src/core/*`)**: `TreeNode`, `ListNode` — the raw data models.
2. **Algorithm Source (`src/core/*/sourcecode/*`)**: Clean, formatted arrays of the algorithm code mapped by line number.
3. **Frame Generator (`src/core/*/frames/*`)**: Pure JavaScript functions that run the algorithm and take "snapshots" (frames) of the state.
4. **Layout Components (`src/components/layout/*`)**: Unified React components (`TreeVisualizerLayout`, `LinkedListVisualizerLayout`) that consume frames and handle all the UI rendering, controls, resizing panels, and animations.
5. **Visualizer Components (`src/visualizers/*`)**: The top-level pages that tie the tree, the frames, the source code, and the layout engine together.

---

## 1. Frame Generation System

Algorithms are visualized by recording their state step-by-step.

### The `Frame` Interface

A Frame represents a single step in time. It typically includes:

- `callStack`: Array of string representations of function calls (e.g., `["dfs(root)"]`).
- `activeNodeId` (or `activeNodeIds`): The ID(s) of the nodes currently being processed.
- `phase`: A short title or step description (e.g., "Compare Nodes", "Base Case").
- `codeLine`: The line number of the algorithm source code currently being executed.
- `message`: Detailed explanation of what is happening in this step.
- `variables`: Key/value map of relevant variables (e.g., pointers, depths).
- `layout`: (Optional) If the physical structure of the tree/list changes (like in Invert Binary Tree or Sort List), the frame _must_ contain a newly computed layout snapshot.

### Best Practices for `pushFrame`

- Always capture the base cases (e.g., when a node is null).
- Use clear, descriptive messages to explain _why_ something is happening.
- Use `callStack.push()` and `callStack.pop()` carefully around recursive calls so the call stack accurately matches the execution context.
- Use `activeNodeId` to highlight exactly which node the algorithm is focused on.

---

## 2. Layout Engine & Coordinates

The visualizers use absolute positioning (`x`, `y`) computed by a layout engine to draw SVG edges and HTML node elements.

### Static vs Dynamic Layouts

- **Static Layouts**: Most traversal or search algorithms (e.g., Same Tree, Preorder) do not modify the structure. The `TreeVisualizerLayout` allows you to pass a static `layout={frames[0].layout}` prop to optimize performance.
- **Dynamic Layouts**: Algorithms that swap or move nodes (e.g., Invert Binary Tree, Sort List) must generate a new layout for _every frame_. The `TreeVisualizerLayout` is smart enough to use `frame.layout || layout` to seamlessly switch between static fallback and dynamic frame layouts.

### Multi-Tree Rendering (Offset Layouts)

If you need to render multiple trees side-by-side (like in `SameTree` or `Subtree`), use `computeLayoutWithOffset` to shift the `x` coordinates and avoid node collisions:

```typescript
// Important: Ensure a large enough gap (e.g., 100 vs 500) so nodes don't mathematically overlap!
const layoutRoot = computeLayoutWithOffset(root, 100, "r-");
const layoutSub = computeLayoutWithOffset(subRoot, 500, "s-");
```

---

## 3. Themes and Styling

We have a centralized global theme system defined in `src/utils/theme.ts`.

- Available themes: `"cyan" | "orange" | "fuchsia" | "emerald" | "teal" | "indigo" | "rose"`.
- When building a new visualizer, pick a visually distinct theme to keep the application vibrant.
- **NEVER** define `themeColors` locally inside a layout component. Always import `themeColors` and `ThemeName` from `src/utils/theme.ts`.
- Node states (Active, Null, Default) rely on specific keys (`nodeActiveBg`, `nodeNullBg`, etc.) from the theme dictionary.

---

## Workflow for Creating a New Visualizer

To create a new visualizer, strictly follow this step-by-step workflow:

1. **Source Code Mapping**:
   - Create `src/core/<type>/sourcecode/<algorithm>.ts`.
   - Export an array of objects `{ line: number, text: string }` representing the raw algorithm code.
2. **Frame Generator**:
   - Create `src/core/<type>/frames/<algorithm>Frames.ts`.
   - Implement the algorithm logic, injecting `pushFrame` calls at every critical step and line of code.
3. **Top-Level Component**:
   - Create `src/visualizers/<type>/<AlgorithmName>.tsx`.
   - Construct the initial data structure (e.g., `buildStandardTree()`).
   - Call `generateFrames` inside a `useMemo` or `useState` hook (only generate once on mount!).
   - Render the appropriate layout component (`TreeVisualizerLayout` or `LinkedListVisualizerLayout`).
4. **App Routing**:
   - Update `src/App.tsx`.
   - Add the new visualizer to the `activeTab` literal union type.
   - Import the component.
   - Add a navigation button in the sidebar using the standard styling pattern.
   - Render the component conditionally in the Main Content Area.

By following this document, you ensure that all visualizers share a beautiful, consistent, and performant design language.
