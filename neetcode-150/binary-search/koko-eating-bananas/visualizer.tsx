import React, { useState } from "react";
import { render, Box, Text, useInput, useApp } from "ink";
import { getTestCaseNumber } from "../../../utils/cli.js";
import { AIAssistant } from "../../../utils/aiHelper.js";

type Mode = "CROSSOVER" | "CONVERGENCE";

interface Frame {
  searchSpace: number[];
  left: number;
  right: number;
  mid: number | null;
  totalHours: number | null;
  isValid: boolean | null;
  phase: string;
  message: React.ReactNode;
  rawMessageForAI: string;
  mode: Mode;
}

function getTotalHours(piles: number[], k: number) {
  let total = 0;
  for (let i = 0; i < piles.length; i++) {
    total += Math.ceil(piles[i] / k);
  }
  return total;
}

function generateFrames(piles: number[], h: number, mode: Mode): Frame[] {
  const frames: Frame[] = [];
  const maxPile = Math.max(...piles);
  
  // The search space is all possible eating speeds k: 1 to maxPile
  const searchSpace = Array.from({ length: maxPile }, (_, i) => i + 1);

  let left = 1;
  let right = maxPile;

  const pushFrame = (
    phase: string,
    mid: number | null,
    totalHours: number | null,
    isValid: boolean | null,
    msg: React.ReactNode,
    rawMsg: string
  ) => {
    frames.push({
      searchSpace: [...searchSpace],
      left,
      right,
      mid,
      totalHours,
      isValid,
      phase,
      message: msg,
      rawMessageForAI: rawMsg,
      mode,
    });
  };

  const modeTitle = mode === "CROSSOVER" ? "Cross-Over (left <= right)" : "Convergence (left < right)";

  pushFrame(
    "Initialization",
    null,
    null,
    null,
    <Box flexDirection="column">
      <Text>Mode: <Text bold color="cyan">{modeTitle}</Text></Text>
      <Text>We are searching for the minimum eating speed <Text bold>k</Text> between <Text color="green">1</Text> and <Text color="green">{maxPile}</Text>.</Text>
    </Box>,
    `Initialized Binary Search in ${modeTitle} mode. Left: ${left}, Right: ${right}`
  );

  const condition = () => mode === "CROSSOVER" ? left <= right : left < right;

  let step = 1;
  while (condition()) {
    const mid = Math.floor((left + right) / 2);
    const hours = getTotalHours(piles, mid);
    const valid = hours <= h;

    pushFrame(
      `Step ${step}: Calculate Mid`,
      mid,
      hours,
      valid,
      <Box flexDirection="column">
        <Text>Checking speed <Text bold color="yellow">k = {mid}</Text>.</Text>
        <Text>At {mid} bananas/hr, Koko finishes in <Text color={valid ? "green" : "red"} bold>{hours} hours</Text>.</Text>
        <Text>Target limit is {h} hours. Is it valid? {valid ? <Text color="green" bold>YES</Text> : <Text color="red" bold>NO</Text>}.</Text>
      </Box>,
      `Calculated mid=${mid}. Total hours=${hours}. Target=${h}. Valid=${valid}.`
    );

    if (mode === "CROSSOVER") {
      // left <= right logic
      if (valid) {
        pushFrame(
          `Step ${step}: Update Right`,
          mid,
          hours,
          valid,
          <Box flexDirection="column">
            <Text>Since {mid} is valid, we know any speed {">"} {mid} is also valid but slower.</Text>
            <Text>Because we use <Text bold color="magenta">left {'<='} right</Text>, we MUST eliminate mid to avoid infinite loops.</Text>
            <Text>Even though {mid} could be the answer, we cross past it: <Text bold color="cyan">right = mid - 1</Text>.</Text>
          </Box>,
          `Valid speed. Updating right = mid - 1 = ${mid - 1}.`
        );
        right = mid - 1;
      } else {
        pushFrame(
          `Step ${step}: Update Left`,
          mid,
          hours,
          valid,
          <Box flexDirection="column">
            <Text>Since {mid} is invalid (too slow), we need a higher speed.</Text>
            <Text>We eliminate {mid} and everything below it: <Text bold color="cyan">left = mid + 1</Text>.</Text>
          </Box>,
          `Invalid speed. Updating left = mid + 1 = ${mid + 1}.`
        );
        left = mid + 1;
      }
    } else {
      // left < right logic
      if (valid) {
        pushFrame(
          `Step ${step}: Update Right`,
          mid,
          hours,
          valid,
          <Box flexDirection="column">
            <Text>Since {mid} is valid, it COULD be our minimum speed!</Text>
            <Text>Because we use <Text bold color="magenta">left {'<'} right</Text>, we DO NOT eliminate mid.</Text>
            <Text>We keep it in our search space: <Text bold color="cyan">right = mid</Text>.</Text>
            <Text>(If we did mid-1, we might lose our correct answer!)</Text>
          </Box>,
          `Valid speed. Updating right = mid = ${mid}.`
        );
        right = mid;
      } else {
        pushFrame(
          `Step ${step}: Update Left`,
          mid,
          hours,
          valid,
          <Box flexDirection="column">
            <Text>Since {mid} is invalid (too slow), we need a higher speed.</Text>
            <Text>It's definitely NOT the answer, so we eliminate it: <Text bold color="cyan">left = mid + 1</Text>.</Text>
          </Box>,
          `Invalid speed. Updating left = mid + 1 = ${mid + 1}.`
        );
        left = mid + 1;
      }
    }
    step++;
  }

  if (mode === "CROSSOVER") {
    pushFrame(
      "Finished (Crossed Over)",
      null,
      null,
      null,
      <Box flexDirection="column">
        <Text backgroundColor="green" color="black" bold> FINISHED! </Text>
        <Text>The loop broke because <Text bold>left ({left}) {'>'} right ({right})</Text>.</Text>
        <Text>In this mode, the <Text color="magenta">left</Text> pointer ALWAYS ends up pointing exactly at the minimum valid answer after crossing over.</Text>
        <Text>We return <Text bold color="green">left = {left}</Text>.</Text>
      </Box>,
      `Loop finished. left=${left} > right=${right}. Returning left.`
    );
  } else {
    pushFrame(
      "Finished (Converged)",
      null,
      null,
      null,
      <Box flexDirection="column">
        <Text backgroundColor="green" color="black" bold> FINISHED! </Text>
        <Text>The loop broke because <Text bold>left === right ({left})</Text>.</Text>
        <Text>The pointers converged onto exactly one element, which MUST be our answer because we safely kept valid answers using <Text bold>right = mid</Text>.</Text>
        <Text>We can return <Text bold color="green">left</Text> (or right, they are equal) = {left}.</Text>
      </Box>,
      `Loop finished. left === right = ${left}. Returning left.`
    );
  }

  return frames;
}

const VisualizerApp: React.FC<{ piles: number[], h: number }> = ({ piles, h }) => {
  const [mode, setMode] = useState<Mode>("CROSSOVER");
  
  // Re-generate frames when mode changes
  const [frames, setFrames] = useState(() => generateFrames(piles, h, mode));
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
    } else if (input.toLowerCase() === "m") {
      const newMode = mode === "CROSSOVER" ? "CONVERGENCE" : "CROSSOVER";
      setMode(newMode);
      setFrames(generateFrames(piles, h, newMode));
      setCurrentFrameIdx(0);
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
  const { searchSpace, left, right, mid, phase, message, isValid, totalHours } = frame;

  return (
    <Box flexDirection="row" width="100%" height="100%">
      {/* Main Visualizer */}
      <Box flexDirection="column" flexGrow={1} borderStyle="single" padding={1} width={isAIVisible ? "60%" : "100%"}>
        
        {/* Header */}
        <Box justifyContent="center" marginBottom={1}>
          <Text bold color="yellow">=== Koko Eating Bananas (Binary Search) ===</Text>
        </Box>
        <Box justifyContent="space-between" marginBottom={1} paddingX={2}>
          <Text bold color="cyan">Phase: {phase}</Text>
          <Text bold color="magenta">Piles: [{piles.join(", ")}]</Text>
          <Text bold color="green">Limit: {h} hours</Text>
        </Box>
        <Box justifyContent="center" marginBottom={1}>
           <Text backgroundColor="blue" color="white" bold> Mode: {mode === "CROSSOVER" ? "left <= right" : "left < right"} (Press 'M' to toggle) </Text>
        </Box>

        {/* Binary Search Line */}
        <Box flexDirection="column" height={10} justifyContent="center" marginX={2} borderStyle="single" borderColor="gray" padding={1}>
           <Text bold>Search Space (Speed 'k'):</Text>
           
           <Box flexDirection="row" marginTop={1} overflowX="hidden">
             {searchSpace.map((val) => {
                let bgColor = undefined;
                let color = "gray";

                // Is it currently the mid pointer being evaluated?
                if (val === mid) {
                   bgColor = isValid === true ? "green" : isValid === false ? "red" : "yellow";
                   color = "black";
                } else if (val >= left && val <= right) {
                   color = "white"; // Inside active search space
                }

                // If left > right (crossed over), highlight the answer
                if (phase.includes("Finished") && val === left) {
                   bgColor = "green";
                   color = "black";
                }

                return (
                  <Box key={val} width={4} justifyContent="center">
                    <Text backgroundColor={bgColor} color={color}>{val}</Text>
                  </Box>
                );
             })}
           </Box>
           
           {/* Pointers Row */}
           <Box flexDirection="row">
             {searchSpace.map((val) => {
               const isLeft = val === left;
               const isRight = val === right;
               const isMid = val === mid;

               let ptrStr = "";
               if (isLeft && isRight && isMid) ptrStr = "L,M,R";
               else if (isLeft && isRight) ptrStr = "L,R";
               else if (isLeft && isMid) ptrStr = "L,M";
               else if (isRight && isMid) ptrStr = "R,M";
               else if (isLeft) ptrStr = "L";
               else if (isRight) ptrStr = "R";
               else if (isMid) ptrStr = "M";

               return (
                  <Box key={val} width={4} justifyContent="center">
                    <Text color={isMid ? "yellow" : isLeft ? "magenta" : isRight ? "cyan" : "gray"}>
                      {ptrStr ? `↑${ptrStr}` : ""}
                    </Text>
                  </Box>
               );
             })}
           </Box>
        </Box>

        {/* Current State Info */}
        <Box flexDirection="row" marginX={2} marginBottom={1} justifyContent="space-between">
            <Text>Left = <Text color="magenta">{left}</Text></Text>
            <Text>Mid = <Text color="yellow">{mid ?? "-"}</Text></Text>
            <Text>Right = <Text color="cyan">{right}</Text></Text>
            <Text>Hours = <Text color={isValid ? "green" : "red"}>{totalHours ?? "-"}</Text></Text>
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
                Mode: mode,
                Phase: phase,
                Left: left,
                Right: right,
                Mid: mid,
                TotalHours: totalHours,
                TargetLimit: h,
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
let piles: number[];
let h: number;

switch (testCase) {
  case 1:
    piles = [3, 6, 7, 11];
    h = 8;
    break;
  case 2:
    piles = [30, 11, 23, 4, 20];
    h = 5;
    break;
  case 3:
    piles = [30, 11, 23, 4, 20];
    h = 6;
    break;
  default:
    piles = [3, 6, 7, 11];
    h = 8;
    break;
}

render(<VisualizerApp piles={piles} h={h} />);
