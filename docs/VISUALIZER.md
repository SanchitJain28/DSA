# DSA Web Visualizer Standard Operating Procedure (SOP)

This document outlines the strict guidelines and architecture for building React-based Data Structures and Algorithms visualizers in this project. **You MUST read and follow these rules before building any new visualizers.**

## 1. Tech Stack & Framework
- **Framework:** React + Vite.
- **Styling:** TailwindCSS + Shadcn UI / Radix primitives.
- **Location:** All visualizers are built inside `visualizer/src/visualizers/` and core logic belongs in `visualizer/src/core/`.

## 2. Architecture & State Management

1. **Pre-computing Frames (`FrameBuilder`)**
   - We do not run the algorithm interactively in real-time. Instead, we simulate the algorithm fully inside a `generateFrames()` function and capture the state at each step using `FrameBuilder`.
   - Each frame captures:
     - `phase`: The logical step (e.g., "Initialization", "Call", "Swap").
     - `codeLine`: The currently executing line of the source code.
     - `message`: A human-readable explanation of what is happening.
     - `variables`: A dictionary of current primitive variable states.
     - Data structures (`arrays`, `layout`, `hashMap`, `callStack`) depending on the visualizer layout.

2. **Source Code Mapping**
   - The visualizer displays the executing source code on the right panel.
   - You must create a `sourcecode.ts` file that exports the raw code as an array of objects `{ line: number, text: string }`.

3. **Layout Wrappers**
   - Never build a visualizer UI from scratch. Use one of the pre-built layout wrappers from `visualizer/src/components/layout/`:
     - `ArrayVisualizerLayout`: For 1D/2D Array, Stack, and Hashing problems.
     - `TreeVisualizerLayout`: For Binary Tree and Graph problems.

## 3. Side Panel Guidelines (CRITICAL)

The visualizer layout features a dedicated side panel (Column 2) specifically designed to show auxiliary data structures. **You MUST respect these categorizations when building visualizer frames:**

### For Array and Hashing Problems:
- You must display a **HashSet** or **HashMap** in the side panel if the problem utilizes one (e.g., Two Sum, Group Anagrams, Contains Duplicate).
- Inject the map data into the frame using the `hashMap` property in `ArrayFrame`.

### For Recursive, Tree, and DP Problems:
- You must display a **Call Stack** in the side panel to trace the recursive execution.
- Utilize the `callStack` property in the frame data. (Note: `FrameBuilder` natively manages `pushCall` and `popCall` for the stack trace automatically!).
- For DP problems (like 1D Memoization), you can combine the Call Stack with an Array or HashMap to show the DP table growing alongside the recursive stack.

## 4. Building a New Visualizer

To add a new visualizer, follow these exact steps:
1. Identify the correct category (e.g., `array`, `tree`, `recursion`, `stack`).
2. Add the `sourcecode.ts` file mapping the algorithm's lines.
3. Add the `[problem]Frames.ts` file simulating the algorithm and generating frames.
4. Create the `[Problem].tsx` component that consumes the frames and wraps them in `ArrayVisualizerLayout` or `TreeVisualizerLayout`.
5. Register the component in `visualizer/src/pages/VisualizerPage.tsx`.
6. Add the navigation link in `visualizer/src/components/layout/AppSidebar.tsx`.
