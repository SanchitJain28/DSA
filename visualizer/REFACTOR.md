# DSA Visualizer — Scalability Refactor Strategy

Target: support 500+ LeetCode problems, including problems that combine
multiple data structures (e.g. LRU Cache = hashmap + linked list, Design
Twitter = hashmap + heap), without linear growth in boilerplate.

---

## 1. Core Problem With Current Architecture

- One hand-written `.tsx` visualizer per problem → 500 components at scale.
- One `*VisualizerLayout.tsx` per topic (8 today, would grow past 20+) —
  can't represent a problem that spans multiple structures (no
  `StackAndTreeVisualizerLayout` combinatorics is viable).
- `core/<topic>/frames/` + `core/<topic>/sourcecode/` flat folders force
  `*Frames.ts` suffix naming to avoid collisions, and split one problem's
  logic across two directories.
- Per-problem visualizer files (`ContainsDuplicate.tsx` etc.) are ~70%
  boilerplate (config modal wiring, input parsing, state) duplicated
  across every file.
- Frame types (`ArrayFrame`, tree frames, stack frames, …) are exclusive
  per topic — a frame can't natively hold both hashmap and heap state.

**Root fix:** stop modeling "visualizer per topic." Model "structure" as
the reusable plugin unit, and let a problem compose however many
structures it needs into one frame.

---

## 2. Core Data Model: `Scene`

Replace topic-specific frame types with one composable type. A frame
(`Scene`) is a snapshot that can hold any combination of structure states.

```ts
// core/shared/types.ts
export interface Scene {
  structures: Partial<{
    array: ArrayState;
    hashmap: HashMapState;
    stack: StackState;
    queue: QueueState;
    linkedList: LinkedListState;
    tree: TreeState;
    graph: GraphState;
    heap: HeapState;
    trie: TrieState;
  }>;
  variables?: { name: string; value: string }[];
  callStack?: CallStackFrame[];
  codeLine?: number;
  explanation: string;
}
```

A multi-structure problem is not a special case — it's just a `Scene`
with more keys populated in `structures`. No new abstraction needed for
"Design Twitter"–style problems.

Open decision from discussion: whether to keep a separate short `phase`
label (distinct from the longer `explanation`) for stepper UI — carry
forward if still wanted, otherwise drop.

---

## 3. `core/structures/` — One Folder Per Data Structure (the "plugin" unit)

Each structure is self-contained: its state shape + pure helper
functions that transform that state. This is the actual "plugin"
mechanism — not per-question bundles, but per-structure primitives that
compose.

```
core/structures/
  array/       { types.ts, helpers.ts }   // toArrayState(), highlight(), swap()
  hashmap/     { types.ts, helpers.ts }   // setHash(), deleteHash()
  stack/       { types.ts, helpers.ts }   // push(), pop(), peek()
  queue/       { types.ts, helpers.ts }
  linkedList/  { types.ts, helpers.ts }   // ListNode, buildList, moveToFront, evictTail
  tree/        { types.ts, helpers.ts }   // TreeNode, buildTree
  heap/        { types.ts, helpers.ts }
  graph/       { types.ts, helpers.ts }   // for future problems
  trie/        { types.ts, helpers.ts }   // for future problems
```

Adding a new structure (e.g. Trie) means: one new folder here + one new
panel component. Zero changes to any existing problem.

---

## 4. `core/problems/` — One Folder Per Problem

Replaces `core/<topic>/{frames,sourcecode}/` flat folders.

```
core/problems/
  two-sum/
    meta.ts       // id, title, difficulty, category, structures[], testCases[]
    source.ts     // displayed code string (lazy-loaded)
    frames.ts     // generateFrames() → Scene[], imports only from core/structures/*

  lru-cache/       // multi-structure example
    meta.ts        // structures: ["hashmap", "linkedList"]
    source.ts
    frames.ts       // composes hashmap + linkedList helpers, nothing special-cased

  ... (~500 of these eventually)
```

**Rule:** a problem's `frames.ts` only ever imports pure helpers from
`core/structures/*` and pushes `Scene` objects via `FrameBuilder`. It
never touches React, layout, or panel components.

### `meta.ts` vs `source.ts` — keep separate

`data/problems.ts` will glob-import every `meta.ts` to build the home
page listing/search/filters. If `source` (full code text) lived inside
`meta.ts`, the listing bundle would eagerly load 500 problems' full code
text just to render titles. Keep `source.ts` (and `frames.ts`) as
separate files, dynamically imported only when a specific problem's
page opens:

```ts
const meta = PROBLEMS[problemId]; // light, always loaded
const { generateFrames } = await import(`core/problems/${id}/frames`);
const { source } = await import(`core/problems/${id}/source`); // heavy, loaded on demand
```

### Example `meta.ts`

```ts
export default {
  id: "two-sum",
  title: "Two Sum",
  difficulty: "Easy",
  category: "array",
  structures: ["array", "hashmap"],
  testCases: [
    {
      id: "tc1",
      name: "Basic: [2,7,11,15], target=9",
      data: { nums: [2, 7, 11, 15], target: 9 },
    },
  ],
};
```

---

## 5. `components/primitives/` — One Panel Per Structure, Not Per Problem

Replaces scattered per-topic renderers (`ArrayRenderer.tsx`,
`HashMap.tsx`, `HeapTreeRenderer.tsx`, etc. — keep these, just
relocate/rename for consistency) plus eliminates the need for any
per-problem visual component.

```
components/primitives/
  ArrayPanel.tsx
  HashMapPanel.tsx
  StackPanel.tsx
  QueuePanel.tsx
  LinkedListPanel.tsx
  TreePanel.tsx
  HeapPanel.tsx
  registry.ts        // STRUCTURE_PANELS: Record<StructureKey, Component>
```

```ts
// components/primitives/registry.ts
export const STRUCTURE_PANELS: Record<string, React.FC<any>> = {
  array: ArrayPanel,
  hashmap: HashMapPanel,
  stack: StackPanel,
  queue: QueuePanel,
  linkedList: LinkedListPanel,
  tree: TreePanel,
  heap: HeapPanel,
};
```

---

## 6. `components/layout/` — One Generic Layout, Not One Per Topic

Replaces all 8 `*VisualizerLayout.tsx` files.

```
components/layout/
  VisualizerLayout.tsx    // chrome: header, controls, source code, playback
  VisualizerCanvas.tsx    // reads Scene.structures keys, renders matching panels via registry
  AppSidebar.tsx          // unchanged
```

```tsx
function VisualizerCanvas({ frame }: { frame: Scene }) {
  return (
    <div
      className="grid gap-4"
      style={{
        gridTemplateColumns: `repeat(${Object.keys(frame.structures).length}, 1fr)`,
      }}
    >
      {Object.entries(frame.structures).map(([key, state]) => {
        const Panel = STRUCTURE_PANELS[key];
        return <Panel key={key} state={state} />;
      })}
    </div>
  );
}
```

This is what makes multi-structure problems free: the layout doesn't
know or care whether it's rendering 1 structure or 4 — it just maps
over whatever keys are populated.

---

## 7. `visualizers/*.tsx` — Eliminated Entirely

`VisualizerPage.tsx` becomes the single page for every problem:

```tsx
const meta = PROBLEMS[problemId];
const { generateFrames } = await import(`core/problems/${problemId}/frames`);
const { source } = await import(`core/problems/${problemId}/source`);
const state = useVisualizerState(meta.testCases);
const frames = useMemo(
  () => generateFrames(...state.currentData),
  [state.currentData],
);

return (
  <VisualizerLayout meta={meta} frames={frames} source={source} state={state} />
);
```

No per-problem route, no per-problem component file, no per-problem
custom rendering logic.

---

## 8. Kill the Per-Problem Boilerplate: `useVisualizerState`

Current per-problem visualizer files (e.g. `ContainsDuplicate.tsx`) are
~70% identical state/modal wiring repeated per file:
`testCaseIdx`/`currentData`/`currentIdx`/`isPlaying` state, config modal
open/select/apply handlers, input-string parsing.

Extract into one hook:

```ts
function useVisualizerState<T>(testCases: TestCase<T>[]) {
  // owns: testCaseIdx, currentData, currentIdx, isPlaying, tempInput, modal state
  // returns: { currentData, currentIdx, setCurrentIdx, isPlaying, setIsPlaying, modalProps, layoutProps }
}
```

`ConfigModal` input fields should similarly become structure-driven
(array input, hashmap key/value input, tree-from-array input) composed
per problem via `meta.testCases` shape, rather than hand-written JSX
per problem file.

---

## 9. `Scene`-ify an Existing `frames.ts` (Two Sum, migrated)

```ts
import { FrameBuilder } from "../../shared/FrameBuilder";
import type { Scene } from "../../shared/types";
import { toArrayState } from "../../structures/array/helpers";
import { setHash } from "../../structures/hashmap/helpers";

export function twoSumFrames(nums: number[], target: number) {
  const builder = new FrameBuilder<Scene>();
  let map: Record<number, number> = {};
  let i = 0;

  const buildFrame = (
    explanation: string,
    codeLine: number,
    variables: Record<string, string> = {},
    opts: { matchIndex?: number } = {},
  ) => {
    builder.pushFrame({
      structures: {
        array: toArrayState(nums, {
          activeIndex: i < nums.length ? i : undefined,
          matchIndex: opts.matchIndex,
        }),
        hashmap: { entries: map },
      },
      variables: [
        { name: "target", value: String(target) },
        ...toVarList(variables),
      ],
      codeLine,
      explanation,
    });
  };

  buildFrame(`Starting twoSum with target = ${target}.`, 1, { needed: "N/A" });

  builder.executeCall(`twoSum([${nums.join(", ")}], ${target})`, () => {
    buildFrame(
      "Initialize an empty hash map. It will store { value: index }.",
      2,
    );
    for (i = 0; i < nums.length; i++) {
      const num = nums[i];
      buildFrame(`Processing index ${i}, value = ${num}.`, 3, {
        needed: "N/A",
      });
      const needed = target - num;
      const loopVars = { needed: String(needed) };
      buildFrame(
        `We need ${needed} (${target} - ${num}) to reach the target.`,
        4,
        loopVars,
      );

      if (needed in map) {
        const matchIndex = map[needed];
        buildFrame(
          `Found ${needed} in the map! It's at index ${matchIndex}.`,
          5,
          loopVars,
          { matchIndex },
        );
        buildFrame(`Return the indices [${matchIndex}, ${i}].`, 6, loopVars, {
          matchIndex,
        });
        return [matchIndex, i];
      }

      buildFrame(`${needed} not found in the map yet.`, 7, loopVars);
      map = setHash(map, num, i);
      buildFrame(`Store value ${num} → index ${i} in the map.`, 8, loopVars);
    }

    buildFrame("No valid pair found, returning [-1, -1].", 11);
    return [-1, -1];
  });

  return { scenes: builder.getFrames(), result: builder.getReturnValue() };
}

function toVarList(vars: Record<string, string>) {
  return Object.entries(vars).map(([name, value]) => ({ name, value }));
}
```

---

## 10. Multi-Structure Example: LRU Cache

```ts
// core/problems/lru-cache/frames.ts
import { setHash, deleteHash } from "core/structures/hashmap/helpers";
import {
  moveToFront,
  evictTail,
  insertHead,
} from "core/structures/linkedList/helpers";
import type { Scene } from "core/shared/types";

export function generateFrames(
  capacity: number,
  ops: [string, ...number[]][],
): Scene[] {
  const scenes: Scene[] = [];
  let map = {};
  let list = { nodes: [], head: null, tail: null };

  for (const [op, key, val] of ops) {
    if (op === "get") {
      if (key in map) {
        list = moveToFront(list, key);
        scenes.push({
          structures: {
            hashmap: { entries: map, activeKey: key },
            linkedList: list,
          },
          explanation: `get(${key}) hit, move to front`,
        });
      } else {
        scenes.push({
          structures: { hashmap: { entries: map }, linkedList: list },
          explanation: `get(${key}) miss`,
        });
      }
    }
    if (op === "put") {
      if (Object.keys(map).length >= capacity && !(key in map)) {
        const evicted = list.tail;
        list = evictTail(list);
        map = deleteHash(map, evicted);
      }
      list = insertHead(list, key, val);
      map = setHash(map, key, val);
      scenes.push({
        structures: {
          hashmap: { entries: map, activeKey: key },
          linkedList: list,
        },
        explanation: `put(${key}, ${val})`,
      });
    }
  }
  return scenes;
}
```

No special-casing anywhere — same `Scene` shape, `VisualizerCanvas`
automatically renders both `HashMapPanel` and `LinkedListPanel`.

---

## 11. `data/problems.ts` — Auto-Derived Registry

Replace manual registry maintenance with a glob-import of every
`meta.ts`:

```ts
const metaModules = import.meta.glob("../core/problems/*/meta.ts", {
  eager: true,
});
export const PROBLEMS = Object.values(metaModules).map((m: any) => m.default);
```

Adding a problem = adding a folder. No manual registration step.

---

## 12. Target Folder Structure (Full)

```
src/
├── core/
│   ├── shared/
│   │   ├── types.ts              # Scene, StructureKey, ProblemMeta
│   │   └── FrameBuilder.ts
│   ├── structures/                # one per data structure
│   │   ├── array/   { types.ts, helpers.ts }
│   │   ├── hashmap/ { types.ts, helpers.ts }
│   │   ├── stack/   { types.ts, helpers.ts }
│   │   ├── queue/   { types.ts, helpers.ts }
│   │   ├── linkedList/ { types.ts, helpers.ts }
│   │   ├── tree/    { types.ts, helpers.ts }
│   │   ├── heap/    { types.ts, helpers.ts }
│   │   ├── graph/   { types.ts, helpers.ts }
│   │   └── trie/    { types.ts, helpers.ts }
│   └── problems/                  # one per LeetCode problem
│       ├── two-sum/        { meta.ts, source.ts, frames.ts }
│       ├── lru-cache/      { meta.ts, source.ts, frames.ts }
│       └── ...
├── components/
│   ├── primitives/
│   │   ├── ArrayPanel.tsx / HashMapPanel.tsx / StackPanel.tsx / ...
│   │   └── registry.ts
│   ├── layout/
│   │   ├── VisualizerLayout.tsx
│   │   ├── VisualizerCanvas.tsx
│   │   └── AppSidebar.tsx
│   ├── controls/                  # renamed/consolidated from "shared"
│   │   ├── ConfigModal.tsx, TestCaseSwitcher.tsx, StepProgress.tsx,
│   │   │   PlaybackControls.tsx, SourceCode.tsx, CallStack.tsx,
│   │   │   Variables.tsx, Explanation.tsx, Header.tsx, ...
│   └── ui/                        # unchanged (shadcn)
├── hooks/
│   ├── useVisualizerState.ts      # NEW — extracts per-problem boilerplate
│   ├── useConfigModal.ts / useKeyboardControls.ts / usePlaybackTimer.ts
├── data/problems.ts                # auto-derived via glob import
├── pages/
│   ├── HomePage.tsx / RevisionPage.tsx
│   └── VisualizerPage.tsx          # single page for ALL problems
├── contexts/ lib/ utils/
└── App.tsx / main.tsx
```

**Eliminated:** `visualizers/**` (90+ files), 7 of 8
`*VisualizerLayout.tsx`, flat `core/<topic>/{frames,sourcecode}/`
directories with `*Frames.ts` naming workaround.

---

## 13. Migration Plan (No Big-Bang Rewrite)

1. Build `core/structures/*` and `components/primitives/registry.ts` —
   new code, doesn't touch anything existing.
2. Build `VisualizerLayout`, `VisualizerCanvas`, `useVisualizerState` —
   validate end-to-end against 2–3 problems (e.g. two-sum,
   contains-duplicate) before scaling.
3. Migrate problems in batches by topic, starting with `array/` (most
   uniform). Each batch: write `core/problems/<id>/{meta,source,frames}`,
   delete the old `visualizers/<topic>/<Name>.tsx` and eventually the
   old `*VisualizerLayout.tsx` once its topic is fully migrated.
4. `VisualizerPage` can support both new (`core/problems/*`) and legacy
   (`visualizers/*`) problems simultaneously during migration — route by
   whether `core/problems/<id>/meta.ts` exists, fallback to legacy
   component otherwise. Avoids a flag-day cutover.
5. Delete `core/<topic>/{frames,sourcecode}/` and remaining
   `*VisualizerLayout.tsx` files only after their last problem is
   migrated.

---

## 14. Fixed Along the Way (from initial structure review)

- Remove duplicate `support.js` (root + `design/`).
- Move/gitignore `design/` folder (design-tool export, not source).
- Consistent naming: `rotateRight` (not `RotateList` in one layer,
  `rotateRight` in another) — apply repo-wide once migrated.
- No test directory currently — add unit tests for `core/structures/*`
  helpers and non-trivial `frames.ts` logic (sortList, threeSum, LRU
  eviction) since these are pure functions and trivially testable.

---

## 15. Open Decision

Whether `Scene` keeps a separate short `phase` field (distinct from the
longer `explanation` string) for stepper UI labeling — carry forward
if still needed, otherwise `explanation` alone covers narration.
