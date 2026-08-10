import React, { useState } from "react";
import { render, Box, Text, useInput, useApp } from "ink";
import { getTestCaseNumber } from "../../../utils/cli.js";
import { AIAssistant } from "../../../utils/aiHelper.js";

interface Frame {
  nums: number[];
  result: (number | null)[];
  left: number;
  right: number;
  pos: number;
  leftSq: number | null;
  rightSq: number | null;
  phase: string;
  message: React.ReactNode;
  rawMessageForAI: string;
}

function generateFrames(nums: number[]): Frame[] {
  const frames: Frame[] = [];
  const result: (number | null)[] = new Array(nums.length).fill(null);
  
  let left = 0;
  let right = nums.length - 1;
  let pos = nums.length - 1;

  const pushFrame = (
    phase: string,
    leftSq: number | null,
    rightSq: number | null,
    msg: React.ReactNode,
    rawMsg: string
  ) => {
    frames.push({
      nums: [...nums],
      result: [...result],
      left,
      right,
      pos,
      leftSq,
      rightSq,
      phase,
      message: msg,
      rawMessageForAI: rawMsg,
    });
  };

  pushFrame(
    "Initialization",
    null,
    null,
    <Box flexDirection="column">
      <Text>We initialize three pointers:</Text>
      <Text>1. <Text bold color="magenta">left</Text> at the start of the array.</Text>
      <Text>2. <Text bold color="cyan">right</Text> at the end of the array.</Text>
      <Text>3. <Text bold color="yellow">pos</Text> at the end of the result array (since we are writing the largest squares first).</Text>
    </Box>,
    "Initialized left, right, and pos pointers."
  );

  let step = 1;
  while (left <= right) {
    const leftSq = nums[left] ** 2;
    const rightSq = nums[right] ** 2;

    pushFrame(
      `Step ${step}: Calculate Squares`,
      leftSq,
      rightSq,
      <Box flexDirection="column">
        <Text>Calculate the squares of the numbers at <Text color="magenta">left</Text> and <Text color="cyan">right</Text>.</Text>
        <Text>Left Square = {nums[left]}² = <Text bold color="magenta">{leftSq}</Text></Text>
        <Text>Right Square = {nums[right]}² = <Text bold color="cyan">{rightSq}</Text></Text>
        <Text>We compare them to find the largest square to place at <Text color="yellow">pos</Text>.</Text>
      </Box>,
      `Calculated leftSq=${leftSq} and rightSq=${rightSq}. Comparing them.`
    );

    if (leftSq > rightSq) {
      result[pos] = leftSq;
      pushFrame(
        `Step ${step}: Place Left Square`,
        leftSq,
        rightSq,
        <Box flexDirection="column">
          <Text><Text color="magenta" bold>{leftSq}</Text> {">"} <Text color="cyan" bold>{rightSq}</Text></Text>
          <Text>Since the left square is larger, we place it at index <Text color="yellow">{pos}</Text> in the result array.</Text>
          <Text>We then move <Text color="magenta">left</Text> forward by 1, and <Text color="yellow">pos</Text> backward by 1.</Text>
        </Box>,
        `leftSq > rightSq. Placed leftSq at pos ${pos}. Moved left pointer.`
      );
      left++;
    } else {
      result[pos] = rightSq;
      pushFrame(
        `Step ${step}: Place Right Square`,
        leftSq,
        rightSq,
        <Box flexDirection="column">
          <Text><Text color="cyan" bold>{rightSq}</Text> {">="} <Text color="magenta" bold>{leftSq}</Text></Text>
          <Text>Since the right square is larger (or equal), we place it at index <Text color="yellow">{pos}</Text> in the result array.</Text>
          <Text>We then move <Text color="cyan">right</Text> backward by 1, and <Text color="yellow">pos</Text> backward by 1.</Text>
        </Box>,
        `rightSq >= leftSq. Placed rightSq at pos ${pos}. Moved right pointer.`
      );
      right--;
    }
    
    pos--;
    step++;
  }

  pushFrame(
    "Finished",
    null,
    null,
    <Box flexDirection="column">
      <Text backgroundColor="green" color="black" bold> FINISHED! </Text>
      <Text>The <Text color="magenta">left</Text> pointer has crossed the <Text color="cyan">right</Text> pointer, meaning all elements have been processed.</Text>
      <Text>The result array is fully populated and sorted!</Text>
    </Box>,
    "Finished building the result array."
  );

  return frames;
}

const VisualizerApp: React.FC<{ nums: number[] }> = ({ nums }) => {
  const [frames] = useState(() => generateFrames(nums));
  const [currentFrameIdx, setCurrentFrameIdx] = useState(0);
  const [isAIVisible, setIsAIVisible] = useState(false);
  const { exit } = useApp();

  useInput((input, key) => {
    if (isAIVisible) {
      if (key.escape) setIsAIVisible(false);
      return;
    }

    if (input === "q" || key.escape || (key.ctrl && input === "c")) {
      exit();
    } else if (input === "a" || input === "?") {
      setIsAIVisible(true);
    } else if (key.rightArrow || input === " ") {
      if (currentFrameIdx < frames.length - 1) {
        setCurrentFrameIdx(currentFrameIdx + 1);
      }
    } else if (key.leftArrow) {
      if (currentFrameIdx > 0) {
        setCurrentFrameIdx(currentFrameIdx - 1);
      }
    }
  });

  const frame = frames[currentFrameIdx];
  const { nums: frameNums, result, left, right, pos, leftSq, rightSq, phase, message } = frame;

  // Maximum characters needed to pad numbers for a clean grid
  const padLen = 4;

  return (
    <Box flexDirection="row" width="100%" height="100%">
      {/* Main Visualizer */}
      <Box flexDirection="column" flexGrow={1} borderStyle="single" padding={1} width={isAIVisible ? "60%" : "100%"}>
        
        {/* Header */}
        <Box justifyContent="center" marginBottom={1}>
          <Text bold color="yellow">=== Squares of a Sorted Array (Two Pointers) ===</Text>
        </Box>
        <Box justifyContent="center" marginBottom={1}>
          <Text bold color="cyan">Phase: {phase}</Text>
        </Box>

        {/* Input Array View */}
        <Box flexDirection="column" borderStyle="single" borderColor="gray" marginX={2} marginBottom={1} padding={1}>
          <Box justifyContent="center" marginBottom={1}><Text bold>Original Array (nums)</Text></Box>
          <Box flexDirection="row" overflowX="hidden">
            {frameNums.map((val, i) => {
              const isLeft = i === left;
              const isRight = i === right;
              
              let borderColor = "white";
              let ptrStr = " ";
              let ptrColor = "gray";

              if (isLeft && isRight) { borderColor = "green"; ptrStr = "L/R"; ptrColor = "green"; }
              else if (isLeft) { borderColor = "magenta"; ptrStr = "L"; ptrColor = "magenta"; }
              else if (isRight) { borderColor = "cyan"; ptrStr = "R"; ptrColor = "cyan"; }

              return (
                <Box key={`nums-${i}`} flexDirection="column" alignItems="center" marginRight={1}>
                  <Box borderStyle="round" borderColor={borderColor} paddingX={1}>
                     <Text color={borderColor}>{val.toString().padStart(padLen, ' ')}</Text>
                  </Box>
                  <Text color={ptrColor} bold>{ptrStr === " " ? " " : `↑ ${ptrStr}`}</Text>
                </Box>
              );
            })}
          </Box>
          {/* Temporary Calculation View */}
          {leftSq !== null && rightSq !== null && (
             <Box flexDirection="row" marginTop={1} justifyContent="space-between">
                <Text>Left Square: <Text bold color="magenta">{leftSq}</Text></Text>
                <Text>Right Square: <Text bold color="cyan">{rightSq}</Text></Text>
             </Box>
          )}
        </Box>

        {/* Result Array View */}
        <Box flexDirection="column" borderStyle="single" borderColor="gray" marginX={2} marginBottom={1} padding={1}>
          <Box justifyContent="center" marginBottom={1}><Text bold>Result Array (Squares)</Text></Box>
          <Box flexDirection="row" overflowX="hidden">
            {result.map((val, i) => {
              const isPos = i === pos;
              const hasValue = val !== null;
              
              return (
                <Box key={`res-${i}`} flexDirection="column" alignItems="center" marginRight={1}>
                  <Box borderStyle="round" borderColor={hasValue ? "green" : "gray"} paddingX={1}>
                     <Text color={hasValue ? "white" : "gray"}>{(val ?? "   ").toString().padStart(padLen, ' ')}</Text>
                  </Box>
                  <Text color={isPos ? "yellow" : "gray"} bold>{isPos ? "↑ pos" : " "}</Text>
                </Box>
              );
            })}
          </Box>
        </Box>

        {/* Logs Area */}
        <Box flexGrow={1} borderStyle="single" padding={1} flexDirection="column">
          <Box justifyContent="center" marginBottom={1}><Text bold>Explanation</Text></Box>
          {message}
        </Box>
      </Box>

      {/* AI Assistant Sidebar */}
      {isAIVisible && (
        <Box width="40%" height="100%">
          <AIAssistant
            context={JSON.stringify(
              {
                Phase: phase,
                Left: left,
                Right: right,
                Pos: pos,
                LeftSquare: leftSq,
                RightSquare: rightSq,
                Explanation: frame.rawMessageForAI,
              },
              null,
              2
            )}
          />
        </Box>
      )}
    </Box>
  );
};

// Test Cases
const testCase = getTestCaseNumber();
let nums: number[];

switch (testCase) {
  case 1:
    nums = [-4, -1, 0, 3, 10];
    break;
  case 2:
    nums = [-7, -3, 2, 3, 11];
    break;
  case 3:
    nums = [-5, -3, -2, -1]; // All negatives
    break;
  case 4:
    nums = [1, 2, 3, 4, 5]; // All positives
    break;
  default:
    nums = [-4, -1, 0, 3, 10];
    break;
}

render(<VisualizerApp nums={nums} />);
