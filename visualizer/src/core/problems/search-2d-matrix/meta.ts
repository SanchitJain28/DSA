import type { ProblemMeta } from "../../shared/types";

export interface Search2DMatrixData {
  matrix: number[][];
  target: number;
}

export const meta: ProblemMeta<Search2DMatrixData> = {
  id: "search2dmatrix",
  title: "Search a 2D Matrix",
  difficulty: "Medium",
  category: "Binary Search",
  topicId: "binary-search",
  theme: "sky",
  description:
    "Treat an m x n row-sorted matrix as a virtual 1D sorted array [0 .. m*n - 1] and perform binary search.",
  tags: ["Binary Search", "2D Matrix", "Coordinate Mapping"],
  structures: ["matrix"],
  inputSchema: [
    {
      key: "matrix",
      label: "2D Matrix (JSON format)",
      type: "matrix",
      placeholder: "[[1,3,5,7],[10,11,16,20],[23,30,34,60]]",
    },
    {
      key: "target",
      label: "Target Value",
      type: "number",
      placeholder: "3",
    },
  ],
  testCases: [
    {
      id: "tc1",
      name: "Target Exists: 3 (3x4 Matrix)",
      preview: "Target 3 in 3x4 Matrix",
      data: {
        matrix: [
          [1, 3, 5, 7],
          [10, 11, 16, 20],
          [23, 30, 34, 60],
        ],
        target: 3,
      },
    },
    {
      id: "tc2",
      name: "Target Not Found: 13 (3x4 Matrix)",
      preview: "Target 13 in 3x4 Matrix",
      data: {
        matrix: [
          [1, 3, 5, 7],
          [10, 11, 16, 20],
          [23, 30, 34, 60],
        ],
        target: 13,
      },
    },
    {
      id: "tc3",
      name: "Target at Bottom-Right: 60",
      preview: "Target 60 in 3x4 Matrix",
      data: {
        matrix: [
          [1, 3, 5, 7],
          [10, 11, 16, 20],
          [23, 30, 34, 60],
        ],
        target: 60,
      },
    },
  ],
};

export default meta;
