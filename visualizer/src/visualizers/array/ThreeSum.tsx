import { useMemo, useState } from "react";
import ArrayVisualizerLayout from "../../components/layout/ArrayVisualizerLayout";
import TestCaseSwitcher, { type TestCase } from "../../components/shared/TestCaseSwitcher";
import { generateFrames } from "../../core/array/frames/threeSumFrames";
import { threeSumCode } from "../../core/array/sourcecode/threeSum";

type ArrayTestCase = TestCase<number[]>;

const TEST_CASES: ArrayTestCase[] = [
  {
    id: "tc1",
    name: "NeetCode Example",
    data: [-1, 0, 1, 2, -1, -4],
  },
  {
    id: "tc2",
    name: "All Zeros",
    data: [0, 0, 0, 0],
  },
  {
    id: "tc3",
    name: "No Triplets",
    data: [0, 1, 1],
  },
  {
    id: "tc4",
    name: "Large Array",
    data: [-2, 0, 1, 1, 2],
  },
];

export default function ThreeSum() {
  const [testCaseIdx, setTestCaseIdx] = useState(0);

  const frames = useMemo(() => {
    return generateFrames(TEST_CASES[testCaseIdx].data!);
  }, [testCaseIdx]);

  return (
    <ArrayVisualizerLayout
      title="3Sum"
      theme="teal"
      frames={frames}
      code={threeSumCode}
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
