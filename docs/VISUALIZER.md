# DSA Web Visualizer Standard Operating Procedure (SOP)

This document outlines the strict design guidelines, UI architecture, and implementation standards for building React-based Data Structures and Algorithms visualizers in this project. **You MUST read and follow these rules before building or modifying any visualizers.**

---

## 1. Tech Stack & Architecture

- **Framework:** React + Vite (TypeScript).
- **Styling:** TailwindCSS + Shadcn UI / Radix primitives.
- **Charts:** Recharts (`BarChart`, `Cell`, `ReferenceLine`, `Tooltip`, etc.).
- **Pan & Zoom:** `CanvasViewport` (`src/components/shared/CanvasViewport.tsx`).
- **Location:**
  - Visualizer Components: `visualizer/src/visualizers/<category>/<ProblemName>.tsx`
  - Core Logic & Frames: `visualizer/src/core/<category>/frames/<problem>Frames.ts`
  - Source Code Mappings: `visualizer/src/core/<category>/sourcecode/<problem>.ts`

---

## 2. Design System & Aesthetics (Classic Zinc Theme)

1. **Color Palette:**
   - **App Background:** `#171717` (Deep neutral zinc / charcoal).
   - **Cards & Viewport Panels:** `#202020` / `bg-neutral-900` with `border border-neutral-800`.
   - **Sub-cards & Inputs:** `#141414` / `bg-neutral-950/80` with `border border-neutral-800/80`.
   - **Accent Highlights:**
     - Probes / Active `mid`: Bright Cyan (`#38bdf8`) with white outline.
     - Feasible / Match: Emerald (`#10b981`).
     - Infeasible / Mismatch: Rose (`#f43f5e`).
     - Targets / Reference Lines: Amber (`#f59e0b`).

2. **Corner Roundness (Crucial Rule):**
   - **Crisp & Subtle:** Use `rounded-md` (6px) or `rounded-sm` (4px).
   - **Strictly Avoid:** Puffy `rounded-2xl` or `rounded-3xl` container bubbles ("AI slop").

3. **Solid Text Colors (No Gradient Text):**
   - Use clean, solid theme accent colors (e.g. `text-indigo-400`, `text-emerald-400`, `text-sky-400`).
   - **Never** use multi-color text gradients (`bg-gradient-to-r`, `bg-clip-text`) for titles or labels.

4. **Container Transparency (Crucial):**
   - In-canvas section wrappers (grids, chains, charts, banners) MUST use `bg-transparent` so the `#171717` canvas dot grid flows cleanly through them.
   - For full styling rules, see [docs/DESIGN_GUIDELINES.md](file:///Users/sanchitjain/vscode_files/DSA/docs/DESIGN_GUIDELINES.md).

5. **Dialog Modal Overlay:**
   - Use `bg-black/10 backdrop-blur-[2px]`.
   - **Never** use heavy dark overlays that block out the visualizer.

---

## 3. Visualizer Canvas Standard: Single Unified Window with Pan & Zoom

All new visualizers must use **one full-height interactive canvas** in Column 1 instead of splitting the screen into separate fixed decks:

1. **`CanvasViewport` Integration:**
   - Wrap the main visualizer content (charts, arrays, nodes, variables) inside `<CanvasViewport className="flex-1 w-full h-full">`.
   - **Click & Drag:** Pans smoothly across the canvas with `cursor-grab` / `cursor-grabbing`.
   - **Wheel & Pinch Zoom:** Smooth scaling from **40% ($0.4\times$) up to 250% ($2.5\times$)**.
   - **Floating Mini-Controls (Bottom-Right):** Includes `−` (Zoom Out), `100%` (Zoom indicator), `+` (Zoom In), and `⛶` (Reset View & Scale).
   - **Dynamic Dot Grid:** Subtle background dot grid that moves with panning and zooming.

2. **In-Canvas Variables Strip:**
   - **Do NOT create a separate fixed-height bottom Variables deck.**
   - Place the variables strip directly **inside the canvas** flow (above or near the visual nodes).
   - Variables must pan and zoom seamlessly together with the visualizer elements.
   - Use `AnimatePresence` and `motion.span` for smooth numeric transitions.

3. **In-Canvas Stack Bucket (For Recursion, Trees, and Stack Problems):**
   - **Do NOT create a dedicated left column panel for recursion call stacks.**
   - Instead, place an in-canvas physical **`StackBucket`** (`src/components/shared/StackBucket.tsx`) inside the pannable canvas alongside the tree or data structures.
   - Stack frames push in from the top and pop out to the top with realistic LIFO physics animations.
   - Highlights the top active frame with glowing accent colors.

4. **Phase Indicator:**
   - Positioned cleanly at the bottom-left corner of the canvas viewport (`absolute bottom-3 left-4 pointer-events-none`).

---

## 4. Header & Configuration Modal (`Configure Inputs`)

To keep the UI clean and uncluttered:

1. **Top Header:**
   - Contains only the problem title, sidebar trigger, playback controls (`Prev`, `Play/Pause`, `Next`, `Reset`), and **one single modal trigger button**:
     ```tsx
     <DialogTrigger className="flex items-center gap-1.5 bg-card hover:bg-accent/10 border border-border px-3 py-1.5 rounded-md text-xs font-medium text-foreground transition-colors shadow-sm cursor-pointer">
       <SlidersHorizontal className="w-3.5 h-3.5 text-accent" />
       <span>Configure Inputs</span>
     </DialogTrigger>
     ```

2. **Shadcn Dialog Modal (`@/components/ui/dialog.tsx`):**
   - **Preset Test Scenarios:** Selectable 2-column card grid showing scenario name and data preview with active checkmarks.
   - **Custom Problem Inputs:** Input fields for custom arrays, strings, target values, or constraint parameters.
   - **Visualizer Layout Mode:** Toggle between layout views (e.g. `Dual View`, `Poles Chart`, `Cells/Packages Only`).
   - **Footer Action:** `Cancel` and `Apply & Run` (instantly resets and starts the algorithm from Step 1).

---

## 5. Chart Guidelines (Binary Search & Range Problems)

1. **Discrete Poles:**
   - Use discrete Recharts vertical poles (`BarChart` with individual `Cell` styling) instead of continuous curved lines.
   - Pole height = Days required, array value, or monotonic function value $f(x)$.
2. **Transparent Background:**
   - Always use `bg-transparent` for chart containers so the canvas dot grid shows through cleanly.
3. **Color Semantics:**
   - Active probe (`mid`): Bright Cyan (`#38bdf8`).
   - Target line: Horizontal dashed amber reference line (`#f59e0b`).
   - Feasible region: Emerald (`#10b981`).
   - Infeasible region: Rose (`#f43f5e`).
   - Pruned / Inactive range: Dimmed out charcoal (`#262626` / opacity 0.35).

---

## 6. Right Panel Layout Standard

In the right-hand panel of all visualizers:
- **`Explanation` Card:** Placed on **TOP** (`className="h-32 rounded-md border p-4 shadow-inner shrink-0"`).
- **`SourceCode` Panel:** Placed **BELOW** the Explanation card (`className="flex-1 min-h-0"`).

---

## 6. Building a New Visualizer Step-by-Step

When tasked with building a new visualizer:

1. **Core Source Code:** Create `src/core/<category>/sourcecode/<problem>.ts` exporting the code array with 1-based line numbers.
2. **Core Frame Builder:** Create `src/core/<category>/frames/<problem>Frames.ts` simulating the algorithm step-by-step using `FrameBuilder` (recording `phase`, `codeLine`, `message`, `variables`, and data structures).
3. **Visualizer Component:** Create `src/visualizers/<category>/<ProblemName>.tsx`:
   - Use the **Single Unified Canvas** with `CanvasViewport`.
   - Place variables inside the canvas flow.
   - Put all test cases and inputs inside the `Configure Inputs` Shadcn `Dialog` modal.
   - Use `#171717` classic zinc theme and `rounded-md` corners.
4. **Register in Router & Navigation:**
   - Register route in `src/pages/VisualizerPage.tsx`.
   - Add sidebar navigation item in `src/components/layout/AppSidebar.tsx`.
