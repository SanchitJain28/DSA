import type { ProblemMeta } from "../../shared/types";

export interface CarFleetData {
  target: number;
  position: number[];
  speed: number[];
}

export const meta: ProblemMeta<CarFleetData> = {
  id: "carfleet",
  title: "Car Fleet",
  difficulty: "Medium",
  category: "Stack",
  topicId: "stack",
  theme: "indigo",
  description:
    "Calculate the number of car fleets that will arrive at the target destination using arrival times and a monotonic stack.",
  tags: ["Stack", "Sorting", "Monotonic Stack"],
  structures: ["array", "stack"],
  inputSchema: [
    {
      key: "target",
      label: "Target Destination (miles)",
      type: "number",
      placeholder: "12",
    },
    {
      key: "position",
      label: "Car Positions (comma-separated)",
      type: "array",
      placeholder: "[10, 8, 0, 5, 3]",
    },
    {
      key: "speed",
      label: "Car Speeds (comma-separated)",
      type: "array",
      placeholder: "[2, 4, 1, 1, 3]",
    },
  ],
  testCases: [
    {
      id: "tc1",
      name: "Classic: target=12, 5 cars",
      preview: "Target 12, Pos: [10,8,0,5,3], Speed: [2,4,1,1,3]",
      data: {
        target: 12,
        position: [10, 8, 0, 5, 3],
        speed: [2, 4, 1, 1, 3],
      },
    },
    {
      id: "tc2",
      name: "Single Car: target=10",
      preview: "Target 10, Pos: [3], Speed: [3]",
      data: {
        target: 10,
        position: [3],
        speed: [3],
      },
    },
    {
      id: "tc3",
      name: "All Merge to 1 Fleet: target=100",
      preview: "Target 100, Pos: [0,2,4], Speed: [4,2,1]",
      data: {
        target: 100,
        position: [0, 2, 4],
        speed: [4, 2, 1],
      },
    },
    {
      id: "tc4",
      name: "No Catchup (2 Fleets): target=10",
      preview: "Target 10, Pos: [6,8], Speed: [3,2]",
      data: {
        target: 10,
        position: [6, 8],
        speed: [3, 2],
      },
    },
  ],
};

export default meta;
