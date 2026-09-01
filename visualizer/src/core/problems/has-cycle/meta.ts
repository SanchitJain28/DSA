import type { ProblemMeta } from "../../shared/types";

export interface HasCycleData {
  values: number[];
  pos: number;
}

export const meta: ProblemMeta<HasCycleData> = {
  id: "hascycle",
  title: "Linked List Cycle",
  difficulty: "Easy",
  category: "Linked List",
  topicId: "linked-list",
  theme: "indigo",
  description:
    "Detect whether a linked list contains a cycle using Floyd's Tortoise and Hare algorithm.",
  tags: ["Linked List", "Two Pointers", "Cycle Detection", "Floyd's Algorithm"],
  structures: ["linkedList"],
  inputSchema: [
    {
      key: "values",
      label: "Node Values (comma-separated)",
      type: "array",
      placeholder: "[3, 2, 0, -4]",
    },
    {
      key: "pos",
      label: "Cycle Tail Connection Index (pos, -1 for none)",
      type: "number",
      placeholder: "1",
    },
  ],
  testCases: [
    {
      id: "tc1",
      name: "Cycle at pos 1: [3, 2, 0, -4] (pos=1)",
      preview: "Nodes: [3, 2, 0, -4], pos: 1",
      data: { values: [3, 2, 0, -4], pos: 1 },
    },
    {
      id: "tc2",
      name: "Cycle at pos 0: [1, 2] (pos=0)",
      preview: "Nodes: [1, 2], pos: 0",
      data: { values: [1, 2], pos: 0 },
    },
    {
      id: "tc3",
      name: "No Cycle: [1, 2, 3, 4] (pos=-1)",
      preview: "Nodes: [1, 2, 3, 4], pos: -1",
      data: { values: [1, 2, 3, 4], pos: -1 },
    },
    {
      id: "tc4",
      name: "Single Node No Cycle: [1] (pos=-1)",
      preview: "Nodes: [1], pos: -1",
      data: { values: [1], pos: -1 },
    },
  ],
};

export default meta;
