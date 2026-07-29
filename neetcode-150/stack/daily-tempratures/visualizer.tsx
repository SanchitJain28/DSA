import React, { useState } from "react";
import { render, Box, Text, useInput, useApp } from "ink";
import { getTestCaseNumber } from "../../../utils/cli.js";
import { AIAssistant } from "../../../utils/aiHelper.js";

interface Frame {
  temperatures: number[];
  result: number[];
  stack: number[];
  currentIndex: number;
  highlightResultIndex: number;
  phase: string;
  popped: string;
  pushed: string;
  message: React.ReactNode;
  rawMessageForAI: string;
}

function generateFrames(temperatures: number[]): Frame[] {
  const frames: Frame[] = [];
  const result = new Array(temperatures.length).fill(0);
  const stack: number[] = [];

  const pushFrame = (
    currentIndex: number,
    phase: string,
    popped: string,
    pushed: string,
    highlightResultIndex: number,
    msg: React.ReactNode,
    rawMsg: string
  ) => {
    frames.push({
      temperatures: [...temperatures],
      result: [...result],
      stack: [...stack],
      currentIndex,
      highlightResultIndex,
      phase,
      popped,
      pushed,
      message: msg,
      rawMessageForAI: rawMsg,
    });
  };

  pushFrame(
    -1,
    "Initialization",
    "N/A",
    "N/A",
    -1,
    <Text>We initialize a <Text color="green">result array</Text> with 0s and an empty <Text color="magenta">stack</Text> to keep track of indices of colder days.</Text>,
    "Initialized result array with 0s and empty stack."
  );

  for (let i = 0; i < temperatures.length; i++) {
    pushFrame(
      i,
      "Moving Pointer",
      "N/A",
      "N/A",
      -1,
      <Text>Processing index {i} (Temperature: <Text color="cyan">{temperatures[i]}°</Text>). Checking if we can pop from the stack...</Text>,
      `Processing index ${i} with temp ${temperatures[i]}. Checking stack.`
    );

    while (stack.length > 0 && temperatures[i] > temperatures[stack[stack.length - 1]]) {
      const topIndex = stack[stack.length - 1];
      const topTemp = temperatures[topIndex];

      pushFrame(
        i,
        "Stack Condition Met",
        "N/A",
        "N/A",
        -1,
        <Box flexDirection="column">
          <Text backgroundColor="yellow" color="black" bold> Condition Met! </Text>
          <Text>Current Temp (<Text color="cyan">{temperatures[i]}°</Text>) {'>'} Stack Top Temp (<Text color="magenta">{topTemp}°</Text> at index {topIndex}).</Text>
          <Text>We found a warmer day for the day at index {topIndex}!</Text>
        </Box>,
        `Current temp ${temperatures[i]} > stack top temp ${topTemp} at index ${topIndex}.`
      );

      const prevIndex = stack.pop()!;
      const daysWaited = i - prevIndex;
      result[prevIndex] = daysWaited;

      pushFrame(
        i,
        "Popping & Updating",
        `${prevIndex} (Temp: ${topTemp}°)`,
        "N/A",
        prevIndex,
        <Box flexDirection="column">
          <Text>Popped index <Text bold>{prevIndex}</Text> from the stack.</Text>
          <Text>Calculation: Current Index ({i}) - Popped Index ({prevIndex}) = <Text color="green">{daysWaited} days</Text>.</Text>
          <Text>Updated result[{prevIndex}] = {daysWaited}</Text>
        </Box>,
        `Popped index ${prevIndex}. Updated result[${prevIndex}] = ${daysWaited}.`
      );
    }

    stack.push(i);
    pushFrame(
      i,
      "Pushing to Stack",
      "N/A",
      `${i} (Temp: ${temperatures[i]}°)`,
      -1,
      <Text>No more elements to pop. Pushed current index <Text bold>{i}</Text> to the stack.</Text>,
      `Pushed index ${i} to stack.`
    );
  }

  pushFrame(
    temperatures.length,
    "Finished",
    "N/A",
    "N/A",
    -1,
    <Box flexDirection="column">
      <Text backgroundColor="green" color="black" bold> FINISHED! </Text>
      <Text>We have processed all days. Any indices remaining in the stack will keep their default value of 0, meaning a warmer day was never found.</Text>
    </Box>,
    "Finished processing all temperatures."
  );

  return frames;
}

const VisualizerApp: React.FC<{ temperatures: number[] }> = ({ temperatures }) => {
  const [frames] = useState(() => generateFrames(temperatures));
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

  const renderArray = (title: string, arr: number[], currentIndex: number, highlightIndex: number = -1, color: string) => {
    return (
      <Box flexDirection="column" marginBottom={1}>
        <Text bold>{title}</Text>
        <Box flexDirection="row">
          {arr.map((val, i) => (
            <Box key={i} flexDirection="column" alignItems="center" marginRight={1}>
              <Box borderStyle="round" borderColor={i === highlightIndex ? "red" : color} paddingX={1}>
                <Text color={i === highlightIndex ? "red" : color}>{val}</Text>
              </Box>
              <Text color="yellow">{i === currentIndex ? "↑" : " "}</Text>
            </Box>
          ))}
        </Box>
      </Box>
    );
  };

  return (
    <Box flexDirection="row" width="100%" height="100%">
      {/* Main Visualizer */}
      <Box flexDirection="column" flexGrow={1} borderStyle="single" padding={1} width={isAIVisible ? "60%" : "100%"}>
        
        {/* Header */}
        <Box justifyContent="center" marginBottom={1}>
          <Text bold color="yellow">=== Daily Temperatures (Monotonic Stack) ===</Text>
        </Box>
        <Box justifyContent="center" marginBottom={1}>
          <Text bold color="cyan">{frame.phase}</Text>
        </Box>

        {/* Arrays Area */}
        <Box flexDirection="column" height={15} justifyContent="center" paddingX={2}>
          {renderArray("Temperatures", frame.temperatures, frame.currentIndex, -1, "cyan")}
          {renderArray("Result", frame.result, -1, frame.highlightResultIndex, "green")}
          
          <Box flexDirection="column" marginTop={1}>
            <Text bold>Stack (Indices waiting for a warmer day)</Text>
            <Box flexDirection="row">
              <Text color="magenta">[ </Text>
              {frame.stack.map((idx, i) => (
                <Text key={i} color="magenta">
                  {idx}(<Text color="cyan">{frame.temperatures[idx]}°</Text>){i < frame.stack.length - 1 ? ", " : ""}
                </Text>
              ))}
              <Text color="magenta"> ]</Text>
            </Box>
          </Box>

          <Box flexDirection="row" marginTop={1}>
             <Box width="50%">
                <Text color="gray">Popped: </Text>
                <Text color="red">{frame.popped}</Text>
             </Box>
             <Box width="50%">
                <Text color="gray">Pushed: </Text>
                <Text color="green">{frame.pushed}</Text>
             </Box>
          </Box>
        </Box>

        {/* Logs Area */}
        <Box flexGrow={1} borderStyle="single" padding={1} flexDirection="column">
          <Box justifyContent="center" marginBottom={1}><Text bold>Explanation</Text></Box>
          {frame.message}
        </Box>
      </Box>

      {/* AI Assistant Sidebar */}
      {isAIVisible && (
        <Box width="40%" height="100%">
          <AIAssistant
            context={JSON.stringify(
              {
                Phase: frame.phase,
                CurrentIndex: frame.currentIndex,
                StackState: frame.stack,
                ResultArray: frame.result,
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
let temperatures: number[];

switch (testCase) {
  case 1:
    temperatures = [73, 74, 75, 71, 69, 72, 76, 73];
    break;
  case 2:
    temperatures = [30, 40, 50, 60];
    break;
  case 3:
    temperatures = [30, 60, 90];
    break;
  case 4:
    temperatures = [30, 38, 30, 36, 35, 40, 28];
    break;
  default:
    temperatures = [73, 74, 75, 71, 69, 72, 76, 73];
    break;
}

render(<VisualizerApp temperatures={temperatures} />);
