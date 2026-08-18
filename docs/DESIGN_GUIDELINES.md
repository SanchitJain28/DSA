# DSA Visualizer Design Guidelines & UI Architecture

This document defines the strict visual design principles, component styling patterns, and layout rules for all DSA visualizers in this project. Follow these rules to ensure all visualizers feel cohesive, premium, and distraction-free.

---

## 1. Core Visual Principles

1. **Classic Zinc Aesthetic:**
   - Base workspace background: `#171717` (Deep neutral zinc).
   - Surface cards & panels: `#202020` / `bg-neutral-900` with `border border-neutral-800`.
   - Floating interactive elements: `bg-neutral-900/90` with `border border-neutral-800`.

2. **Crisp Corners (No AI Slop):**
   - Use subtle, crisp corners: **`rounded-md` (6px)** or **`rounded-sm` (4px)**.
   - **Strictly avoid** puffy, bubbly `rounded-2xl` or `rounded-3xl` container bubbles.

3. **Solid Text Colors (No Multi-Color Gradients):**
   - Always use solid, semantic accent colors (e.g. `text-cyan-400`, `text-emerald-400`, `text-amber-400`, `text-indigo-400`).
   - **Never** use multi-color gradient text (`bg-gradient-to-r`, `bg-clip-text`) for titles, subtitles, or labels.

---

## 2. In-Canvas Container Transparency (Crucial Rule)

Inside the interactive `<CanvasViewport>`:
- **All section containers, chart boxes, grid wrappers, and streak cards MUST have a transparent background (`bg-transparent`).**
- **Do NOT** use dark solid fills (`bg-neutral-950`, `bg-black`, `bg-neutral-900`) on inner canvas section wrappers.
- The interactive `#171717` dot grid must flow freely and continuously across the entire canvas area.

```tsx
/* ✅ CORRECT: Transparent container allows canvas dot grid to flow through */
<div className="w-full max-w-3xl bg-transparent border border-neutral-800/80 rounded-md p-4 flex flex-col gap-3">
  {/* Section content */}
</div>

/* ❌ INCORRECT: Opaque box creates an ugly black patch blocking the dot grid */
<div className="w-full max-w-3xl bg-neutral-950/60 border border-neutral-800 rounded-md p-4 flex flex-col gap-3">
  {/* Section content */}
</div>
```

---

## 3. Top Header Architecture

The top header is clean, borderless, and uncluttered:

1. **Borderless Divider:**
   - No bottom divider line (`border-b border-border`). The header blends seamlessly into the canvas.
   ```tsx
   <header className="flex items-center justify-between pb-2">
   ```

2. **Balanced Title Spacing:**
   - Left section uses `gap-3.5` with generous separation between the Sidebar Trigger, Title, and Configure Inputs button:
   ```tsx
   <div className="flex items-center gap-3.5">
     <SidebarTrigger className="text-muted-foreground hover:text-white" />
     <h1 className={`text-2xl font-bold ${titleColorClass}`}>{title}</h1>
     {children && <div className="ml-1">{children}</div>}
   </div>
   ```

3. **Single Modal Trigger (`Configure Inputs`):**
   - **No controls or clutter in the header** except Playback controls and the `Configure Inputs` button.
   - All test cases, preset scenarios, custom inputs, and view mode toggles belong inside the dialog modal.

---

## 4. Reusable Dialog Modal Standard (`ConfigModal` & `useConfigModal`)

To provide instant scenario switching without code duplication:

1. **Shared `ConfigModal` Component (`src/components/shared/ConfigModal.tsx`):**
   - Automatically renders the trigger button, subtle blur backdrop (`bg-black/10 backdrop-blur-[2px]`), preset scenario grid, custom input slot, and styled footer.

2. **Custom Hook `useConfigModal` (`src/hooks/useConfigModal.ts`):**
   - Manages dialog open/close lifecycle, active preset index selection, and temporary form buffer commits.

```tsx
/* Example Usage in Visualizer Header */
<ConfigModal
  title="Configure Test Cases & List"
  description="Select a preset scenario or provide custom input values."
  theme="indigo"
  isOpen={modal.isOpen}
  onOpenChange={modal.setIsOpen}
  onOpen={handleOpenModal}
  presets={TEST_CASES.map((tc) => ({
    id: tc.id,
    name: tc.name,
    preview: tc.data.preview,
  }))}
  selectedPresetIdx={modal.selectedPresetIdx}
  onSelectPreset={handleSelectPreset}
  onApply={handleApplySettings}
>
  {/* Custom Inputs Slot */}
  <div className="space-y-1">
    <label className="text-xs font-mono text-neutral-400">Custom Input</label>
    <input value={tempInput} onChange={(e) => setTempInput(e.target.value)} ... />
  </div>
</ConfigModal>
```

---

## 5. In-Canvas Variables Strip (Design Schema)

Variables are placed **inside the canvas flow** above the visual structures:

1. **Label:**
   - `text-neutral-400 text-xs font-mono font-semibold mb-1.5 uppercase tracking-wider`.
2. **Value Card:**
   - `bg-neutral-900/90 border border-neutral-800 px-4 py-2 rounded-md flex items-center justify-center min-w-[96px] shadow-sm`.
3. **Typography & Animation:**
   - Active values: Glowing theme color (e.g. `text-cyan-400 font-mono text-base font-bold`).
   - Inactive / Empty values: Dimmed (`text-neutral-500 font-normal` for `"null"`, `"[]"`, `"∅"`).
   - Animated with `AnimatePresence mode="popLayout"` and `motion.span`.

---

## 6. In-Canvas Stack Bucket (Recursion & Tree Standard)

For recursion, DFS, backtracking, and stack algorithms:
- **Do NOT** build a separate fixed left sidebar for the call stack.
- Use the shared **`StackBucket`** component (`src/components/shared/StackBucket.tsx`) inside the canvas, side-by-side with the tree or graph.
- Push and pop frames animate smoothly through the open top lip with spring physics.
- The top active frame displays a `TOP` indicator badge and glowing accent border.

---

## 7. Right Panel Layout Standard

In the right-hand column:
1. **`Explanation` Card (TOP):**
   - Fixed height card (`className="h-32 rounded-md border p-4 shadow-inner shrink-0"`).
   - Displays real-time algorithm commentary for the current step.
2. **`SourceCode` Panel (BOTTOM):**
   - Fills remaining height (`className="flex-1 min-h-0"`).
   - Highlights the active execution line with smooth line indicators.

---

## 8. Summary Checklist for New Visualizers

- [ ] `#171717` dark zinc theme with `CanvasViewport` pan & zoom.
- [ ] In-canvas variables strip matching the design schema.
- [ ] All in-canvas section wrappers use `bg-transparent`.
- [ ] Borderless header with solid title color and single `Configure Inputs` trigger.
- [ ] `Configure Inputs` modal with `bg-black/10 backdrop-blur-[2px]`.
- [ ] In-canvas `StackBucket` for recursion/tree/stack problems.
- [ ] `Explanation` on TOP, `SourceCode` below in the right panel.
- [ ] Clean `rounded-md` (6px) or `rounded-sm` (4px) borders.
