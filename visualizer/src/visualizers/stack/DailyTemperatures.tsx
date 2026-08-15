import { useMemo, useState } from "react";
import StackVisualizerLayout from "../../components/layout/StackVisualizerLayout";
import TestCaseSwitcher, { type TestCase } from "../../components/shared/TestCaseSwitcher";
import { generateFrames } from "../../core/stack/frames/dailyTemperaturesFrames";
import { dailyTemperaturesCode } from "../../core/stack/sourcecode/dailyTemperatures";

type StackTestCase = TestCase<number[]>;

const TEST_CASES: StackTestCase[] = [
  {
    id: "tc1",
    name: "Standard Case",
    data: [73, 74, 75, 71, 69, 72, 76, 73],
  },
  {
    id: "tc2",
    name: "Increasing Temps",
    data: [30, 40, 50, 60],
  },
  {
    id: "tc3",
    name: "Decreasing Temps",
    data: [30, 20, 10],
  },
  {
    id: "tc4",
    name: "NeetCode Example",
    data: [30, 38, 30, 36, 35, 40, 28],
  },
];

export default function DailyTemperatures() {
  const [testCaseIdx, setTestCaseIdx] = useState(0);

  const frames = useMemo(() => {
    return generateFrames(TEST_CASES[testCaseIdx].data!);
  }, [testCaseIdx]);

  return (
    <StackVisualizerLayout
      title="Daily Temperatures"
      theme="indigo"
      frames={frames}
      code={dailyTemperaturesCode}
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
