import React, { useState } from "react";
import { render, Box, Text, useInput, useApp } from "ink";
import { getTestCaseNumber } from "../../../utils/cli.js";
import { AIAssistant } from "../../../utils/aiHelper.js";

interface Frame {
  colors: string[];
  lightBeam?: { startIndex: number; endIndex: number; height: number };
  message: React.ReactNode;
  rawMessageForAI: string;
  phase: string;
  result: number[];
}

function generateFrames(temperatures: number[]): Frame[] {
  const frames: Frame[] = [];
  const result = new Array(temperatures.length).fill(0);
  const stack: number[] = [];
  const resolved = new Set<number>();

  const getColors = (currentIndex: number, comparingTo: number = -1) => {
    return temperatures.map((_, i) => {
      if (i === comparingTo) return "red";
      if (i === currentIndex) return "cyan";
      if (i > currentIndex) return "gray";
      if (stack.includes(i)) return "magenta";
      if (resolved.has(i)) return "green";
      return "gray";
    });
  };

  const pushFrame = (
    phase: string,
    currentIndex: number,
    comparingTo: number,
    lightBeam: { startIndex: number; endIndex: number; height: number } | undefined,
    msg: React.ReactNode,
    rawMsg: string
  ) => {
    frames.push({
      colors: getColors(currentIndex, comparingTo),
      lightBeam,
      phase,
      message: msg,
      rawMessageForAI: rawMsg,
      result: [...result],
    });
  };

  pushFrame(
    "Initialization",
    -1,
    -1,
    undefined,
    <Text>We initialize a stack and start scanning poles from left to right.</Text>,
    "Initialized visualizer."
  );

  for (let i = 0; i < temperatures.length; i++) {
    pushFrame(
      "Scanning",
      i,
      -1,
      undefined,
      <Text>Processing pole at index {i} (Temp: <Text color="cyan">{temperatures[i]}°</Text>). Checking if it's taller than the pole at the top of the stack...</Text>,
      `Processing index ${i} with temp ${temperatures[i]}. Checking stack.`
    );

    while (stack.length > 0 && temperatures[i] > temperatures[stack[stack.length - 1]]) {
      const topIndex = stack[stack.length - 1];

      pushFrame(
        "Condition Met",
        i,
        topIndex,
        { startIndex: i, endIndex: topIndex, height: temperatures[topIndex] },
        <Box flexDirection="column">
          <Text backgroundColor="yellow" color="black" bold> Condition Met! </Text>
          <Text>
            <Text color="cyan">Cyan pole</Text> ({temperatures[i]}°) {">"} <Text color="red">Red stack top</Text> ({temperatures[topIndex]}°).
          </Text>
          <Text>The Cyan pole shines a <Text backgroundColor="yellow" color="black"> yellow light </Text> over the shorter poles to hit the Red pole!</Text>
          <Text>Red pole found its next warmer temperature.</Text>
        </Box>,
        `Cyan pole (${temperatures[i]}) > Red stack top (${temperatures[topIndex]}). Light beam activated.`
      );

      const prevIndex = stack.pop()!;
      result[prevIndex] = i - prevIndex;
      resolved.add(prevIndex);

      pushFrame(
        "Resolved",
        i,
        -1,
        undefined,
        <Box flexDirection="column">
          <Text>Popped index {prevIndex}. Days waited = {i} - {prevIndex} = <Text bold color="green">{i - prevIndex} days</Text>.</Text>
          <Text>The pole at index {prevIndex} is now resolved (<Text color="green">Green</Text>).</Text>
        </Box>,
        `Popped index ${prevIndex}. Days waited = ${i - prevIndex}. Pole resolved.`
      );
    }

    stack.push(i);
    pushFrame(
      "Push to Stack",
      i,
      -1,
      undefined,
      <Text>No more shorter poles to pop. Pushed index {i} onto the stack (<Text color="magenta">Magenta</Text>).</Text>,
      `Pushed index ${i} to stack.`
    );
  }

  pushFrame(
    "Finished",
    temperatures.length - 1,
    -1,
    undefined,
    <Box flexDirection="column">
      <Text backgroundColor="green" color="black" bold> FINISHED! </Text>
      <Text>The remaining <Text color="magenta">Magenta</Text> poles never found a taller pole.</Text>
      <Text>Final Result: [{result.join(", ")}]</Text>
    </Box>,
    `Finished. Final Result: [${result.join(", ")}]`
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
  
  // Calculate Grid
  const minTemp = Math.min(...temperatures);
  const maxTemp = Math.max(...temperatures);
  const maxPoleHeight = (maxTemp - minTemp) + 1;
  const maxRow = maxPoleHeight + 3;

  const renderGridRows = () => {
    const gridRows = [];
    const targetR = frame.lightBeam ? (temperatures[frame.lightBeam.endIndex] - minTemp) + 3 : -1;

    for (let r = maxRow; r >= 0; r--) {
      const rowCells = [];
      for (let i = 0; i < temperatures.length; i++) {
        const temp = temperatures[i];
        const poleHeight = (temp - minTemp) + 1;
        const bgColor = frame.colors[i] as string; // 'cyan', 'red', 'magenta', 'green', 'gray'

        let colContent;
        if (r === 0) colContent = <Text color="white">  {i.toString().padStart(2, " ")}  </Text>;
        else if (r === 1) colContent = <Text color="gray">  Idx </Text>;
        else if (r === 2) colContent = <Text color="white">{temp.toString().padStart(3, " ")}°  </Text>;
        else if (r >= 3 && r < poleHeight + 3) {
          colContent = <Text backgroundColor={bgColor}>      </Text>;
        } else if (frame.lightBeam && r === targetR && i > frame.lightBeam.endIndex && i < frame.lightBeam.startIndex) {
          colContent = <Text backgroundColor="yellow" color="black">------</Text>;
        } else {
          colContent = <Text>      </Text>;
        }
        rowCells.push(<Box key={`col-${i}`}>{colContent}</Box>);

        if (i < temperatures.length - 1) {
          let spacerContent;
          if (frame.lightBeam && r === targetR && i >= frame.lightBeam.endIndex && i < frame.lightBeam.startIndex) {
            spacerContent = <Text backgroundColor="yellow" color="black">--</Text>;
          } else {
            spacerContent = <Text>  </Text>;
          }
          rowCells.push(<Box key={`spacer-${i}`}>{spacerContent}</Box>);
        }
      }
      gridRows.push(<Box key={`row-${r}`} flexDirection="row">{rowCells}</Box>);
    }
    return gridRows;
  };

  return (
    <Box flexDirection="row" width="100%" height="100%">
      {/* Main Visualizer */}
      <Box flexDirection="column" flexGrow={1} borderStyle="single" padding={1} width={isAIVisible ? "60%" : "100%"}>
        
        {/* Header */}
        <Box justifyContent="center" marginBottom={1}>
          <Text bold color="yellow">=== Light Poles (Monotonic Stack) ===</Text>
        </Box>
        <Box justifyContent="center" marginBottom={1}>
          <Text bold color="cyan">{frame.phase}</Text>
        </Box>
        
        {/* Legend */}
        <Box flexDirection="row" justifyContent="center" marginBottom={1}>
          <Text backgroundColor="cyan" color="black"> Current </Text><Text>  </Text>
          <Text backgroundColor="magenta" color="black"> Stack </Text><Text>  </Text>
          <Text backgroundColor="red" color="black"> Comparing </Text><Text>  </Text>
          <Text backgroundColor="green" color="black"> Resolved </Text><Text>  </Text>
          <Text backgroundColor="gray" color="black"> Pending </Text>
        </Box>

        {/* Grid Area */}
        <Box flexDirection="column" justifyContent="flex-end" flexGrow={1} paddingX={2} minHeight={maxRow + 1}>
          {renderGridRows()}
        </Box>

        {/* Logs Area */}
        <Box height={6} borderStyle="single" padding={1} flexDirection="column" marginTop={1}>
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
