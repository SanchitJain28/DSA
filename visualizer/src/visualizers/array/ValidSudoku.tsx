import { useMemo, useState } from "react";
import ArrayVisualizerLayout from "../../components/layout/ArrayVisualizerLayout";
import TestCaseSwitcher, { type TestCase } from "../../components/shared/TestCaseSwitcher";
import { generateFrames } from "../../core/array/frames/isValidSudokuFrames";
import { isValidSudokuCode } from "../../core/array/sourcecode/isValidSudoku";

type SudokuTestCase = TestCase<string[][]>;

const TEST_CASES: SudokuTestCase[] = [
  {
    id: "tc1",
    name: "Valid Sudoku Board",
    data: [
      ["5", "3", ".", ".", "7", ".", ".", ".", "."],
      ["6", ".", ".", "1", "9", "5", ".", ".", "."],
      [".", "9", "8", ".", ".", ".", ".", "6", "."],
      ["8", ".", ".", ".", "6", ".", ".", ".", "3"],
      ["4", ".", ".", "8", ".", "3", ".", ".", "1"],
      ["7", ".", ".", ".", "2", ".", ".", ".", "6"],
      [".", "6", ".", ".", ".", ".", "2", "8", "."],
      [".", ".", ".", "4", "1", "9", ".", ".", "5"],
      [".", ".", ".", ".", "8", ".", ".", "7", "9"],
    ],
  },
  {
    id: "tc2",
    name: "Invalid (Row 0 Duplicate)",
    data: [
      ["8", "3", ".", ".", "7", ".", ".", "8", "."],
      ["6", ".", ".", "1", "9", "5", ".", ".", "."],
      [".", "9", "8", ".", ".", ".", ".", "6", "."],
      ["8", ".", ".", ".", "6", ".", ".", ".", "3"],
      ["4", ".", ".", "8", ".", "3", ".", ".", "1"],
      ["7", ".", ".", ".", "2", ".", ".", ".", "6"],
      [".", "6", ".", ".", ".", ".", "2", "8", "."],
      [".", ".", ".", "4", "1", "9", ".", ".", "5"],
      [".", ".", ".", ".", "8", ".", ".", "7", "9"],
    ],
  },
  {
    id: "tc3",
    name: "Invalid (Col 0 Duplicate)",
    data: [
      ["5", "3", ".", ".", "7", ".", ".", ".", "."],
      ["5", ".", ".", "1", "9", "5", ".", ".", "."],
      [".", "9", "8", ".", ".", ".", ".", "6", "."],
      ["8", ".", ".", ".", "6", ".", ".", ".", "3"],
      ["4", ".", ".", "8", ".", "3", ".", ".", "1"],
      ["7", ".", ".", ".", "2", ".", ".", ".", "6"],
      [".", "6", ".", ".", ".", ".", "2", "8", "."],
      [".", ".", ".", "4", "1", "9", ".", ".", "5"],
      [".", ".", ".", ".", "8", ".", ".", "7", "9"],
    ],
  },
  {
    id: "tc4",
    name: "Invalid (3x3 Box Duplicate)",
    data: [
      ["8", "3", ".", ".", "7", ".", ".", ".", "."],
      ["6", ".", ".", "1", "9", "5", ".", ".", "."],
      [".", "9", "8", ".", ".", ".", ".", "6", "."],
      ["8", ".", ".", ".", "6", ".", ".", ".", "3"],
      ["4", ".", ".", "8", ".", "3", ".", ".", "1"],
      ["7", ".", ".", ".", "2", ".", ".", ".", "6"],
      [".", "6", ".", ".", ".", ".", "2", "8", "."],
      [".", ".", ".", "4", "1", "9", ".", ".", "5"],
      [".", ".", ".", ".", "8", ".", ".", "7", "9"],
    ],
  },
];

export default function ValidSudoku() {
  const [testCaseIdx, setTestCaseIdx] = useState(0);

  const frames = useMemo(() => {
    return generateFrames(TEST_CASES[testCaseIdx].data!);
  }, [testCaseIdx]);

  return (
    <ArrayVisualizerLayout
      title="Valid Sudoku"
      theme="amber"
      frames={frames}
      code={isValidSudokuCode}
      headerChildren={
        <TestCaseSwitcher
          testCases={TEST_CASES}
          currentIndex={testCaseIdx}
          onChange={setTestCaseIdx}
        />
      }
    />
  );
}
