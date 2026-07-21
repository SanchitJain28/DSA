# DSA Visualizer Standard Operating Procedure (SOP)

This document outlines the strict guidelines and architecture for building terminal-based Data Structures and Algorithms visualizers in this project. **You MUST read and follow these rules before building any new visualizers.**

## 1. Tech Stack & Framework
- **Framework:** `ink` (React for the CLI).
- **Execution:** `tsx` (Native ESM support). Do NOT use `ts-node` or `blessed`.
- **File Naming:** The visualizer MUST be named `visualizer.tsx` and placed in the same folder as the algorithm it visualizes (e.g., `neetcode-150/binary-search/find-minimum.../visualizer.tsx`).

## 2. Shared Utilities

Always import and utilize these shared utilities to ensure consistency across all visualizers.

### Test Cases (`utils/cli.ts`)
Visualizers MUST support running different test cases via the `--test=N` flag.
```tsx
import { getTestCaseNumber } from '../../../utils/cli';

const testCase = getTestCaseNumber();
switch (testCase) {
  case 1: // define nums/target
  case 2: // define nums/target
  default: // fallback to 1
}
```

### AI Assistant Sidebar (`utils/aiHelper.tsx`)
Every visualizer MUST include the interactive DeepSeek AI Assistant sidebar.
- Import `AIAssistant` from `../../../utils/aiHelper`.
- Maintain a state `isAIVisible`.
- When rendering, wrap your UI in a flex row and allocate 40% width to the AI sidebar if visible.
- Pass a stringified JSON `context` to the AI containing the current frame state (arrays, pointers, variables, and explanations).

## 3. Architecture & State Management

1. **Pre-computing Frames:**
   - Instead of trying to render the algorithm interactively in real-time, simulate the algorithm fully in a `generateFrames()` function and capture the state at each step into a `Frame[]` array.
   - A `Frame` interface should contain all variables needed for the UI (e.g., `left`, `right`, `mid`, `message`, `rawMessageForAI`).
2. **Component Structure:**
   - Create a `VisualizerApp` React component.
   - Use `useState` to track `currentFrameIdx`.
   - Use `useInput` to handle keyboard navigation:
     - `Right Arrow` or `Space`: Next Frame.
     - `Left Arrow`: Previous Frame.
     - `a` or `?`: Toggle AI Sidebar.
     - `q` or `Escape`: Exit (if AI sidebar is closed).
3. **Layout Guidelines (Ink):**
   - Use `<Box flexDirection="row">` as the root.
   - Left side: Main Visualizer (flexGrow=1, width=100% or 60% if AI is visible).
     - Contains the graphical representation (e.g., Bar Charts, Pointers).
     - Contains a Logs area showing the `frame.message`.
   - Right side: `<AIAssistant />` (width=40%).
4. **Drawing Graphics:**
   - Map over arrays to build visual elements (like bar charts or matrices) using `<Box>` and `<Text>`.
   - Use colors like `cyan`, `magenta`, `yellow`, `green`, `red` heavily to make pointers and differences obvious.

## 4. Execution Command
To run a visualizer, always use:
```bash
npx tsx visualizer.tsx --test=1
```
