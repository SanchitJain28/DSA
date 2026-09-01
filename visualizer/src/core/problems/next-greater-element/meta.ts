import type { ProblemMeta } from "../../shared/types";

export interface NextGreaterElementData {
  nums1: number[];
  nums2: number[];
}

export const meta: ProblemMeta<NextGreaterElementData> = {
  id: "nextgreaterelement",
  title: "Next Greater Element I",
  difficulty: "Easy",
  category: "Stack",
  topicId: "stack",
  theme: "indigo",
  description:
    "Find the next greater element for each number in nums1 within nums2 using a monotonic stack and hash map.",
  tags: ["Monotonic Stack", "Hash Map", "Array"],
  structures: ["array", "stack", "hashmap"],
  inputSchema: [
    {
      key: "nums1",
      label: "Subset Array (nums1)",
      type: "array",
      placeholder: "[4, 1, 2]",
    },
    {
      key: "nums2",
      label: "Full Array (nums2)",
      type: "array",
      placeholder: "[1, 3, 4, 2]",
    },
  ],
  testCases: [
    {
      id: "tc1",
      name: "Standard: nums1=[4,1,2], nums2=[1,3,4,2]",
      preview: "nums1=[4,1,2], nums2=[1,3,4,2]",
      data: { nums1: [4, 1, 2], nums2: [1, 3, 4, 2] },
    },
    {
      id: "tc2",
      name: "Standard: nums1=[2,4], nums2=[1,2,3,4]",
      preview: "nums1=[2,4], nums2=[1,2,3,4]",
      data: { nums1: [2, 4], nums2: [1, 2, 3, 4] },
    },
    {
      id: "tc3",
      name: "Decreasing: nums1=[3,1], nums2=[3,2,1]",
      preview: "nums1=[3,1], nums2=[3,2,1]",
      data: { nums1: [3, 1], nums2: [3, 2, 1] },
    },
  ],
};

export default meta;
