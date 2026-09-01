import type {
  VisualizerType,
  ProblemInfo,
  TopicGroup,
} from "@/types/visualizer";
import { getAllProblems } from "@/core/problems/registry";

export type { VisualizerType, ProblemInfo, TopicGroup };

export const TOPIC_GROUPS: TopicGroup[] = [
  {
    id: "arrays",
    name: "Arrays & Hashing",
    description:
      "Frequency maps, two pointers, prefix sums, and in-place transformations.",
    iconName: "LayoutGrid",
    theme: "violet",
  },
  {
    id: "trees",
    name: "Trees & BST",
    description:
      "Recursive traversals, level-order BFS, path finding, and BST properties.",
    iconName: "Network",
    theme: "emerald",
  },
  {
    id: "linked-list",
    name: "Linked Lists",
    description:
      "Fast & slow pointers, pointer manipulation, reversal, and merge patterns.",
    iconName: "Link2",
    theme: "cyan",
  },
  {
    id: "stack",
    name: "Stack",
    description:
      "LIFO matching, monotonic stacks, collision simulation, and span evaluation.",
    iconName: "Layers",
    theme: "indigo",
  },
  {
    id: "binary-search",
    name: "Binary Search",
    description:
      "Search space reduction, boundary conditions, and binary search on answer.",
    iconName: "Search",
    theme: "sky",
  },
  {
    id: "sliding-window",
    name: "Sliding Window",
    description:
      "Dynamic window expansion, frequency tracking, and shrinking conditions.",
    iconName: "BetweenHorizontalEnd",
    theme: "indigo",
  },
  {
    id: "recursion",
    name: "Recursion & DP",
    description:
      "Call stack unwinding, branching decision trees, and 1D memoization.",
    iconName: "GitFork",
    theme: "emerald",
  },
  {
    id: "heap",
    name: "Heap / Priority Queue",
    description:
      "Complete binary tree representation, sift up, and sift down priority queue operations.",
    iconName: "Binary",
    theme: "emerald",
  },
];

export const PROBLEMS: ProblemInfo[] = getAllProblems();

export function getProblemInfo(id: string): ProblemInfo | undefined {
  return PROBLEMS.find((p) => p.id === id);
}

export function getProblemPath(id: string): string {
  const prob = getProblemInfo(id);
  if (prob) {
    return `/problems/${prob.topicId}/${prob.id}`;
  }
  return `/problems/${id}`;
}
