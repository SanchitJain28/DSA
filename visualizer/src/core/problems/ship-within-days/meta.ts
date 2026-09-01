import type { ProblemMeta } from "../../shared/types";

export interface ShipWithinDaysData {
  weights: number[];
  days: number;
}

export const meta: ProblemMeta<ShipWithinDaysData> = {
  id: "shipwithindays",
  title: "Capacity To Ship Packages Within D Days",
  difficulty: "Medium",
  category: "Binary Search",
  topicId: "binary-search",
  theme: "teal",
  description:
    "Binary search on candidate ship capacity in range [max(weights) .. sum(weights)] to find minimum capacity feasible within D days.",
  tags: ["Binary Search on Answer", "Greedy Simulation"],
  structures: ["array", "range"],
  inputSchema: [
    {
      key: "weights",
      label: "Package Weights (comma-separated)",
      type: "array",
      placeholder: "[1, 2, 3, 4, 5, 6, 7, 8, 9, 10]",
    },
    {
      key: "days",
      label: "Maximum Days (D)",
      type: "number",
      placeholder: "5",
    },
  ],
  testCases: [
    {
      id: "tc1",
      name: "10 Packages in 5 Days: [1..10] (Days: 5)",
      preview: "Weights: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] · Days: 5",
      data: { weights: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10], days: 5 },
    },
    {
      id: "tc2",
      name: "6 Packages in 3 Days: [3, 2, 2, 4, 1, 4] (Days: 3)",
      preview: "Weights: [3, 2, 2, 4, 1, 4] · Days: 3",
      data: { weights: [3, 2, 2, 4, 1, 4], days: 3 },
    },
    {
      id: "tc3",
      name: "5 Packages in 1 Day: [1, 2, 3, 1, 1] (Days: 4)",
      preview: "Weights: [1, 2, 3, 1, 1] · Days: 4",
      data: { weights: [1, 2, 3, 1, 1], days: 4 },
    },
  ],
};

export default meta;
