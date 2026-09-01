import type { ProblemMeta } from "../../shared/types";

export interface DailyTempsData {
  temps: number[];
}

export const meta: ProblemMeta<DailyTempsData> = {
  id: "dailytemperatures",
  title: "Daily Temperatures",
  difficulty: "Medium",
  category: "Stack",
  topicId: "stack",
  theme: "indigo",
  description:
    "Find the number of days you have to wait after the i-th day to get a warmer temperature using a monotonic decreasing stack.",
  tags: ["Monotonic Stack", "Array"],
  structures: ["array", "stack"],
  inputSchema: [
    {
      key: "temps",
      label: "Temperatures Array (comma-separated)",
      type: "array",
      placeholder: "[73, 74, 75, 71, 69, 72, 76, 73]",
    },
  ],
  testCases: [
    {
      id: "tc1",
      name: "Standard: [73, 74, 75, 71, 69, 72, 76, 73]",
      preview: "Temps: [73, 74, 75, 71, 69, 72, 76, 73]",
      data: { temps: [73, 74, 75, 71, 69, 72, 76, 73] },
    },
    {
      id: "tc2",
      name: "Increasing: [30, 40, 50, 60]",
      preview: "Temps: [30, 40, 50, 60]",
      data: { temps: [30, 40, 50, 60] },
    },
    {
      id: "tc3",
      name: "Decreasing: [30, 20, 10]",
      preview: "Temps: [30, 20, 10]",
      data: { temps: [30, 20, 10] },
    },
    {
      id: "tc4",
      name: "Varied Mix: [30, 38, 30, 36, 35, 40, 28]",
      preview: "Temps: [30, 38, 30, 36, 35, 40, 28]",
      data: { temps: [30, 38, 30, 36, 35, 40, 28] },
    },
  ],
};

export default meta;
