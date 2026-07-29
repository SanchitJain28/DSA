import React, { useState } from "react";
import { render, Box, Text, useInput, useApp } from "ink";
import { getTestCaseNumber } from "../../../utils/cli.js";
import { AIAssistant } from "../../../utils/aiHelper.js";

interface Car {
  originalIndex: number;
  id: string;
  pos: number;
  spd: number;
  time: number;
}

interface Frame {
  cars: Car[];
  stack: number[];
  currentIndex: number;
  phase: string;
  message: React.ReactNode;
  rawMessageForAI: string;
}

function generateFrames(target: number, position: number[], speed: number[]): Frame[] {
  const frames: Frame[] = [];
  
  // Create cars and compute time
  const cars: Car[] = position
    .map((pos, i) => ({
      originalIndex: i,
      id: String.fromCharCode(65 + i), // A, B, C...
      pos,
      spd: speed[i],
      time: (target - pos) / speed[i]
    }))
    // Sort by position descending (closest to target first)
    .sort((a, b) => b.pos - a.pos);

  const stack: number[] = [];

  const pushFrame = (
    phase: string,
    currentIndex: number,
    msg: React.ReactNode,
    rawMsg: string
  ) => {
    frames.push({
      cars: [...cars],
      stack: [...stack],
      currentIndex,
      phase,
      message: msg,
      rawMessageForAI: rawMsg,
    });
  };

  pushFrame(
    "Initialization",
    -1,
    <Box flexDirection="column">
      <Text>1. We map each car to a <Text color="cyan">Position</Text> and <Text color="green">Speed</Text>.</Text>
      <Text>2. We calculate the <Text color="yellow">Time</Text> it takes to reach the target IF there were no other cars: <Text bold>Time = (Target - Pos) / Speed</Text>.</Text>
      <Text>3. We sort the cars by <Text color="cyan">Position</Text> descending (closest to target first) so we process leaders before followers.</Text>
    </Box>,
    "Initialized cars, computed times, and sorted by position descending."
  );

  for (let i = 0; i < cars.length; i++) {
    const car = cars[i];
    
    pushFrame(
      "Processing Car",
      i,
      <Box flexDirection="column">
        <Text>Processing Car <Text bold color="magenta">{car.id}</Text> at position <Text color="cyan">{car.pos}</Text>.</Text>
        <Text>Time to target = ({target} - {car.pos}) / {car.spd} = <Text bold color="yellow">{car.time.toFixed(2)}</Text>.</Text>
      </Box>,
      `Processing Car ${car.id}. Time to target: ${car.time.toFixed(2)}.`
    );

    if (stack.length === 0) {
      stack.push(car.time);
      pushFrame(
        "New Fleet Created",
        i,
        <Box flexDirection="column">
          <Text>Stack is empty. This car is currently closest to the target.</Text>
          <Text>It forms the first <Text color="green" bold>Fleet</Text>.</Text>
          <Text>Pushed Time <Text color="yellow">{car.time.toFixed(2)}</Text> to the Stack.</Text>
        </Box>,
        `Stack empty. Car ${car.id} forms new fleet. Pushed ${car.time.toFixed(2)} to stack.`
      );
    } else {
      const topTime = stack[stack.length - 1];
      
      pushFrame(
        "Comparing with Fleet Ahead",
        i,
        <Box flexDirection="column">
          <Text>Car <Text bold color="magenta">{car.id}</Text> time: <Text color="yellow">{car.time.toFixed(2)}</Text>.</Text>
          <Text>Fleet ahead time: <Text color="red">{topTime.toFixed(2)}</Text>.</Text>
          <Text>If Car {car.id}'s time is {'<='} Fleet ahead's time, it catches up!</Text>
        </Box>,
        `Comparing Car ${car.id} time (${car.time.toFixed(2)}) with fleet ahead time (${topTime.toFixed(2)}).`
      );

      if (car.time <= topTime) {
        pushFrame(
          "Car Catches Up!",
          i,
          <Box flexDirection="column">
            <Text backgroundColor="green" color="black" bold> BUMP! </Text>
            <Text>Car <Text bold color="magenta">{car.id}</Text> (<Text color="yellow">{car.time.toFixed(2)}</Text>) {'<='} Fleet Ahead (<Text color="red">{topTime.toFixed(2)}</Text>).</Text>
            <Text>This means Car {car.id} is faster and catches up to the fleet ahead before or at the target.</Text>
            <Text>It gets blocked and joins their fleet! The fleet's arrival time remains <Text color="red">{topTime.toFixed(2)}</Text>.</Text>
            <Text>(We DO NOT push this car's time to the stack).</Text>
          </Box>,
          `Car ${car.id} time <= fleet ahead time. It catches up and joins the fleet. Stack unchanged.`
        );
      } else {
        stack.push(car.time);
        pushFrame(
          "New Fleet Formed",
          i,
          <Box flexDirection="column">
            <Text backgroundColor="yellow" color="black" bold> TOO SLOW </Text>
            <Text>Car <Text bold color="magenta">{car.id}</Text> (<Text color="yellow">{car.time.toFixed(2)}</Text>) {'>'} Fleet Ahead (<Text color="red">{topTime.toFixed(2)}</Text>).</Text>
            <Text>This means Car {car.id} will NEVER catch up to the fleet ahead before the target.</Text>
            <Text>It forms a brand new fleet behind them!</Text>
            <Text>Pushed Time <Text color="yellow">{car.time.toFixed(2)}</Text> to the Stack.</Text>
          </Box>,
          `Car ${car.id} time > fleet ahead time. It forms a new fleet. Pushed ${car.time.toFixed(2)} to stack.`
        );
      }
    }
  }

  pushFrame(
    "Finished",
    cars.length - 1,
    <Box flexDirection="column">
      <Text backgroundColor="green" color="black" bold> FINISHED! </Text>
      <Text>All cars processed.</Text>
      <Text>The number of items in the stack represents the number of distinct fleets.</Text>
      <Text>Total Fleets = <Text bold color="green">{stack.length}</Text>.</Text>
    </Box>,
    `Finished. Total fleets = ${stack.length}.`
  );

  return frames;
}

const VisualizerApp: React.FC<{ target: number, position: number[], speed: number[] }> = ({ target, position, speed }) => {
  const [frames] = useState(() => generateFrames(target, position, speed));
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
  const { cars, stack, currentIndex, phase, message } = frame;

  return (
    <Box flexDirection="row" width="100%" height="100%">
      {/* Main Visualizer */}
      <Box flexDirection="column" flexGrow={1} borderStyle="single" padding={1} width={isAIVisible ? "60%" : "100%"}>
        
        {/* Header */}
        <Box justifyContent="center" marginBottom={1}>
          <Text bold color="yellow">=== Car Fleet (Monotonic Stack) ===</Text>
        </Box>
        <Box justifyContent="space-between" marginBottom={1} paddingX={2}>
          <Text bold color="cyan">Phase: {phase}</Text>
          <Text bold color="green">Target: {target} miles</Text>
        </Box>

        {/* Data Table */}
        <Box flexDirection="column" borderStyle="single" borderColor="gray" marginX={2} marginBottom={1}>
          {/* Table Header */}
          <Box flexDirection="row" borderBottom={true} borderStyle="single" borderColor="gray" paddingX={1}>
            <Box width={10}><Text bold>Car</Text></Box>
            <Box width={15}><Text bold>Pos (mi)</Text></Box>
            <Box width={15}><Text bold>Speed (mph)</Text></Box>
            <Box width={20}><Text bold>Time to Target</Text></Box>
            <Box width={15}><Text bold>Status</Text></Box>
          </Box>
          
          {/* Table Body */}
          {cars.map((car, i) => {
            const isCurrent = i === currentIndex;
            const isProcessed = i < currentIndex;
            
            // Determine if this car is a fleet leader
            const isFleetLeader = isProcessed && stack.includes(car.time) || (isCurrent && phase.includes("New Fleet"));

            return (
              <Box key={i} flexDirection="row" paddingX={1} backgroundColor={isCurrent ? "gray" : undefined}>
                <Box width={10}>
                  <Text color="magenta" bold>{car.id}</Text>
                  {isCurrent && <Text color="yellow"> {'<-'}</Text>}
                </Box>
                <Box width={15}><Text color="cyan">{car.pos}</Text></Box>
                <Box width={15}><Text color="green">{car.spd}</Text></Box>
                <Box width={20}><Text color="yellow">{car.time.toFixed(2)} hr</Text></Box>
                <Box width={15}>
                  {isProcessed ? (
                    isFleetLeader ? <Text color="green">Fleet Leader</Text> : <Text color="gray">Follower</Text>
                  ) : isCurrent ? (
                    <Text color="white">Evaluating...</Text>
                  ) : (
                    <Text color="gray">Waiting</Text>
                  )}
                </Box>
              </Box>
            );
          })}
        </Box>

        {/* Stack Area */}
        <Box flexDirection="column" marginX={2} marginBottom={1}>
          <Text bold>Fleet Arrivals Stack (Monotonically Increasing Time):</Text>
          <Box flexDirection="row" minHeight={3} alignItems="center">
            <Text color="gray" bold>BOTTOM  </Text>
            {stack.map((time, i) => (
              <Box key={i} borderStyle="round" borderColor="magenta" paddingX={1} marginRight={1}>
                <Text color="yellow">{time.toFixed(2)} hr</Text>
              </Box>
            ))}
            {stack.length > 0 && <Text color="gray" bold>  TOP</Text>}
            {stack.length === 0 && <Text color="gray">Empty Stack</Text>}
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
                CurrentIndex: currentIndex,
                Target: target,
                Cars: cars,
                StackState: stack,
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
let target: number;
let position: number[];
let speed: number[];

switch (testCase) {
  case 1:
    target = 12;
    position = [10, 8, 0, 5, 3];
    speed = [2, 4, 1, 1, 3];
    break;
  case 2:
    target = 10;
    position = [3];
    speed = [3];
    break;
  case 3:
    target = 100;
    position = [0, 2, 4];
    speed = [4, 2, 1];
    break;
  case 4:
    // Cars all catching up to one slow leader
    target = 20;
    position = [10, 8, 6, 4];
    speed = [1, 2, 3, 4]; 
    break;
  default:
    target = 12;
    position = [10, 8, 0, 5, 3];
    speed = [2, 4, 1, 1, 3];
    break;
}

render(<VisualizerApp target={target} position={position} speed={speed} />);
