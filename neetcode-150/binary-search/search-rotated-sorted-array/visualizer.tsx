import React, { useState } from "react";
import { render, Box, Text, useInput, useApp } from "ink";
import { getTestCaseNumber } from "../../../utils/cli.js";
import { AIAssistant } from "../../../utils/aiHelper.js";

interface Frame {
  left: number;
  right: number;
  mid: number;
  minIdx: number;
  phase: string;
  target: number;
  message: React.ReactNode;
  rawMessageForAI: string;
}

function generateFrames(nums: number[], target: number): Frame[] {
  const frames: Frame[] = [];
  
  // Phase 1: Find Minimum
  let left = 0;
  let right = nums.length - 1;
  let minElementIndex = -1;
  const phase1 = "PHASE 1: FIND MINIMUM";

  frames.push({
    left, right, mid: -1, minIdx: -1, phase: phase1, target,
    message: (
      <Box flexDirection="column">
        <Text bold>=== Search in Rotated Sorted Array ===</Text>
        <Text>Target: <Text color="magenta">{target}</Text></Text>
        <Text>{'\n'}Step 1: We must find the "cliff" (minimum element) to know where the array is split into two sorted halves.</Text>
        <Text>Press <Text color="yellow">[Right Arrow]</Text> to begin finding the minimum.</Text>
      </Box>
    ),
    rawMessageForAI: `Target is ${target}. Phase 1: Finding the minimum element to split the array into two sorted halves.`
  });

  while (left < right) {
    let mid = Math.floor((left + right) / 2);
    
    frames.push({
      left, right, mid, minIdx: -1, phase: phase1, target,
      message: (
        <Box flexDirection="column">
          <Text>Comparing Mid (<Text color="yellow">{nums[mid]}</Text>) with Right (<Text color="blue">{nums[right]}</Text>)...</Text>
        </Box>
      ),
      rawMessageForAI: `Comparing Mid nums[mid]=${nums[mid]} with Right nums[right]=${nums[right]}.`
    });

    if (nums[mid] > nums[right]) {
      frames.push({
        left, right, mid, minIdx: -1, phase: phase1, target,
        message: (
          <Box flexDirection="column">
            <Text>nums[mid] ({nums[mid]}) <Text color="red">{'>'}</Text> nums[right] ({nums[right]}).</Text>
            <Text>The cliff is to the right! Moving Left pointer to {mid + 1}.</Text>
          </Box>
        ),
        rawMessageForAI: `nums[mid] > nums[right], so cliff is to the right. Left = mid + 1.`
      });
      left = mid + 1;
    } else {
      frames.push({
        left, right, mid, minIdx: -1, phase: phase1, target,
        message: (
          <Box flexDirection="column">
            <Text>nums[mid] ({nums[mid]}) <Text color="green">{'<='}</Text> nums[right] ({nums[right]}).</Text>
            <Text>The right half is sorted! The minimum must be at mid or to the left. Moving Right to {mid}.</Text>
          </Box>
        ),
        rawMessageForAI: `nums[mid] <= nums[right], so right half is sorted. Right = mid.`
      });
      right = mid;
    }
  }

  minElementIndex = left;

  frames.push({
    left: -1, right: -1, mid: -1, minIdx: minElementIndex, phase: phase1, target,
    message: (
      <Box flexDirection="column">
        <Text>Found the minimum at index <Text color="cyan">{minElementIndex}</Text> (value: <Text bold>{nums[minElementIndex]}</Text>).</Text>
        <Text>The array is split into two perfectly sorted halves around this index!</Text>
      </Box>
    ),
    rawMessageForAI: `Found minimum at index ${minElementIndex} (value ${nums[minElementIndex]}).`
  });

  // Phase 2: Decide which half to search
  const phase2 = "PHASE 2: CHOOSE SEARCH SPACE";
  let searchLeft = -1;
  let searchRight = -1;

  if (target >= nums[minElementIndex] && target <= nums[nums.length - 1]) {
    searchLeft = minElementIndex;
    searchRight = nums.length - 1;
    frames.push({
      left: searchLeft, right: searchRight, mid: -1, minIdx: minElementIndex, phase: phase2, target,
      message: (
        <Box flexDirection="column">
          <Text>Is Target (<Text color="magenta">{target}</Text>) in the RIGHT sorted segment [{nums[minElementIndex]} ... {nums[nums.length - 1]}]?</Text>
          <Text><Text color="green">YES!</Text> Target is &gt;= {nums[minElementIndex]} and &lt;= {nums[nums.length - 1]}.</Text>
          <Text>We will search the RIGHT segment: Indices [{searchLeft}, {searchRight}].</Text>
        </Box>
      ),
      rawMessageForAI: `Target ${target} is in the right sorted segment [${nums[minElementIndex]} to ${nums[nums.length - 1]}]. Searching right segment.`
    });
  } else {
    searchLeft = 0;
    searchRight = minElementIndex - 1;
    frames.push({
      left: searchLeft, right: searchRight, mid: -1, minIdx: minElementIndex, phase: phase2, target,
      message: (
        <Box flexDirection="column">
          <Text>Is Target (<Text color="magenta">{target}</Text>) in the RIGHT sorted segment [{nums[minElementIndex]} ... {nums[nums.length - 1]}]?</Text>
          <Text><Text color="red">NO.</Text> Target is outside that range.</Text>
          <Text>It MUST be in the LEFT sorted segment: Indices [{searchLeft}, {searchRight}].</Text>
        </Box>
      ),
      rawMessageForAI: `Target ${target} is NOT in the right sorted segment. Must be in the left segment. Searching left segment.`
    });
  }

  // Phase 3: Standard Binary Search
  const phase3 = "PHASE 3: BINARY SEARCH";
  left = searchLeft;
  right = searchRight;

  while (left <= right) {
    let mid = Math.floor((left + right) / 2);

    frames.push({
      left, right, mid, minIdx: minElementIndex, phase: phase3, target,
      message: (
        <Box flexDirection="column">
          <Text>Mid Index: {mid}, Mid Value: <Text color="yellow">{nums[mid]}</Text></Text>
          <Text>Comparing nums[mid] (<Text color="yellow">{nums[mid]}</Text>) with Target (<Text color="magenta">{target}</Text>)...</Text>
        </Box>
      ),
      rawMessageForAI: `Phase 3 Binary search: Mid index ${mid}, value ${nums[mid]}. Comparing with target ${target}.`
    });

    if (nums[mid] < target) {
      frames.push({
        left, right, mid, minIdx: minElementIndex, phase: phase3, target,
        message: (
          <Box flexDirection="column">
            <Text>nums[mid] ({nums[mid]}) <Text color="red">{'<'}</Text> Target ({target}).</Text>
            <Text>Target must be to the right. Left = mid + 1 ({mid + 1}).</Text>
          </Box>
        ),
        rawMessageForAI: `nums[mid] < target. Left = mid + 1.`
      });
      left = mid + 1;
    } else if (nums[mid] > target) {
      frames.push({
        left, right, mid, minIdx: minElementIndex, phase: phase3, target,
        message: (
          <Box flexDirection="column">
            <Text>nums[mid] ({nums[mid]}) <Text color="red">{'>'}</Text> Target ({target}).</Text>
            <Text>Target must be to the left. Right = mid - 1 ({mid - 1}).</Text>
          </Box>
        ),
        rawMessageForAI: `nums[mid] > target. Right = mid - 1.`
      });
      right = mid - 1;
    } else {
      frames.push({
        left, right, mid, minIdx: minElementIndex, phase: phase3, target,
        message: (
          <Box flexDirection="column">
            <Text backgroundColor="green" color="black"> SUCCESS! </Text>
            <Text>nums[mid] === Target! Found target {target} at index <Text bold>{mid}</Text>.</Text>
          </Box>
        ),
        rawMessageForAI: `Found target ${target} at index ${mid}!`
      });
      return frames;
    }
  }

  frames.push({
    left, right, mid: -1, minIdx: minElementIndex, phase: phase3, target,
    message: (
      <Box flexDirection="column">
        <Text backgroundColor="red" color="white"> FAILED! </Text>
        <Text>Search space exhausted (left &gt; right). Target {target} is NOT in the array.</Text>
      </Box>
    ),
    rawMessageForAI: `Search space exhausted. Target not found.`
  });

  return frames;
}

const VisualizerApp: React.FC<{ nums: number[], target: number }> = ({ nums, target }) => {
  const [frames] = useState(() => generateFrames(nums, target));
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
  const { left, right, mid, minIdx, phase } = frame;

  const maxVal = Math.max(...nums);
  const minVal = Math.min(...nums);
  const chartHeight = 12;

  return (
    <Box flexDirection="row" width="100%" height="100%">
      {/* Main Visualizer */}
      <Box flexDirection="column" flexGrow={1} borderStyle="single" padding={1} width={isAIVisible ? "60%" : "100%"}>
        
        {/* Header */}
        <Box justifyContent="center" marginBottom={1}>
          <Text bold color="yellow">{phase}</Text>
        </Box>

        {/* Array Bar Chart */}
        <Box height={chartHeight + 5} flexDirection="column" borderStyle="single">
          <Box justifyContent="center"><Text bold>Array Bar Chart</Text></Box>
          {Array.from({ length: chartHeight }).map((_, rIdx) => {
            const row = chartHeight - rIdx;
            return (
              <Box key={`row-${row}`}>
                {nums.map((val, i) => {
                  const normalizedHeight = maxVal === minVal ? 1 : Math.ceil(((val - minVal + 1) / (maxVal - minVal + 1)) * chartHeight);
                  let color = "white";
                  if (i === mid) color = "yellow";
                  else if (minIdx !== -1) {
                     // Color the left and right sorted segments differently
                     if (i < minIdx) color = "magenta";
                     else color = "cyan";
                  }

                  // Gray out values outside search space (if left/right are valid)
                  const isExcluded = (left !== -1 && right !== -1) && (i < left || i > right);
                  if (isExcluded) color = "gray";

                  return (
                    <Box width={7} key={i}>
                      <Text color={color}>{normalizedHeight >= row ? '████' : '    '}</Text>
                    </Box>
                  );
                })}
              </Box>
            );
          })}

          {/* Values Row */}
          <Box>
            {nums.map((val, i) => {
              const isExcluded = (left !== -1 && right !== -1) && (i < left || i > right);
              const color = isExcluded ? "gray" : i === mid ? "black" : "white";
              const bg = i === mid ? "yellow" : undefined;
              return (
                <Box width={7} key={`val-${i}`}>
                  <Text color={color} backgroundColor={bg}>{val.toString().padStart(2, " ").padEnd(4, " ")}</Text>
                </Box>
              );
            })}
          </Box>

          {/* Indices Row */}
          <Box>
            {nums.map((_, i) => {
              return (
                <Box width={7} key={`idx-${i}`}>
                  <Text color={i === mid ? "yellow" : i === minIdx ? "cyan" : "gray"}>{`i:${i}`.padEnd(4, " ")}</Text>
                </Box>
              );
            })}
          </Box>

          {/* Pointers Row */}
          <Box>
            {nums.map((_, i) => {
              let ptrNodes: React.ReactNode[] = [];
              if (i === mid) {
                if (i === left && i === right) ptrNodes = [<Text color="cyan" key="L">L</Text>, <Text color="yellow" key="M">M</Text>, <Text color="blue" key="R">R</Text>];
                else if (i === left) ptrNodes = [<Text color="cyan" key="L">L</Text>, <Text key="1">/</Text>, <Text color="yellow" key="M">M</Text>];
                else if (i === right) ptrNodes = [<Text color="yellow" key="M">M</Text>, <Text key="1">/</Text>, <Text color="blue" key="R">R</Text>];
                else ptrNodes = [<Text color="yellow" key="M"> M </Text>];
              } else if (i === left && i === right) {
                ptrNodes = [<Text color="cyan" key="L">L</Text>, <Text key="1">/</Text>, <Text color="blue" key="R">R</Text>];
              } else if (i === left) {
                ptrNodes = [<Text color="cyan" key="L"> L </Text>];
              } else if (i === right) {
                ptrNodes = [<Text color="blue" key="R"> R </Text>];
              }
              return <Box width={7} key={`ptr-${i}`}>{ptrNodes}</Box>;
            })}
          </Box>
        </Box>

        {/* Logs Area */}
        <Box flexGrow={1} borderStyle="single" padding={1} flexDirection="column">
          <Box justifyContent="center" marginBottom={1}><Text bold>Logs & Execution Logic</Text></Box>
          {frame.message}
        </Box>
      </Box>

      {/* AI Assistant Sidebar */}
      {isAIVisible && (
        <Box width="40%" height="100%">
          <AIAssistant
            context={JSON.stringify({
              Array: nums,
              Target: target,
              Left: left,
              Right: right,
              Mid: mid,
              MinElementIndex: minIdx,
              Phase: phase,
              Explanation: frame.rawMessageForAI,
            }, null, 2)}
          />
        </Box>
      )}
    </Box>
  );
};

// Test Cases
const testCase = getTestCaseNumber();
let nums: number[];
let target: number;

switch (testCase) {
  case 1:
    nums = [4, 5, 6, 7, 0, 1, 2];
    target = 0;
    break;
  case 2:
    nums = [4, 5, 6, 7, 0, 1, 2];
    target = 3; // Doesn't exist
    break;
  case 3:
    nums = [1];
    target = 0;
    break;
  case 4:
    nums = [3, 4, 5, 6, 1, 2];
    target = 1;
    break;
  case 5:
    nums = [5, 1, 3];
    target = 5;
    break;
  default:
    nums = [4, 5, 6, 7, 0, 1, 2];
    target = 0;
    break;
}

render(<VisualizerApp nums={nums} target={target} />);
