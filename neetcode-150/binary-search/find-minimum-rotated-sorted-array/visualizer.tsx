import React, { useState, useEffect } from "react";
import { render, Box, Text, useInput, useApp } from "ink";
import { getTestCaseNumber } from "../../../utils/cli";
import { AIAssistant } from "../../../utils/aiHelper";

interface Frame {
  left: number;
  right: number;
  mid: number;
  message: React.ReactNode;
  rawMessageForAI: string; // Plain text context for the AI
}

function generateFrames(nums: number[]): Frame[] {
  const frames: Frame[] = [];
  let left = 0;
  let right = nums.length - 1;

  frames.push({
    left,
    right,
    mid: -1,
    message: (
      <Box flexDirection="column">
        <Box justifyContent="center">
          <Text bold>=== Find Minimum in Rotated Sorted Array ===</Text>
        </Box>
        <Text>
          {"\n"}Notice how the array values form two "hills" due to the
          rotation.
        </Text>
        <Text>
          Our goal is to find the bottom of the cliff (the minimum value).
        </Text>
        <Text>
          {"\n"}Press <Text color="yellow">[Right Arrow]</Text> to step forward.
        </Text>
      </Box>
    ),
    rawMessageForAI:
      "Notice how the array values form two hills due to the rotation. Our goal is to find the bottom of the cliff (the minimum value).",
  });

  while (left < right) {
    const mid = Math.floor((left + right) / 2);

    frames.push({
      left,
      right,
      mid,
      message: (
        <Box flexDirection="column">
          <Text>
            Calculated Mid Index: Math.floor(({left} + {right}) / 2) ={" "}
            <Text color="yellow">{mid}</Text>
          </Text>
          <Text>
            {"\n"}Comparing nums[mid] (<Text color="yellow">{nums[mid]}</Text>)
            with nums[right] (<Text color="magenta">{nums[right]}</Text>)...
          </Text>
        </Box>
      ),
      rawMessageForAI: `Calculated Mid Index: ${mid}. Comparing nums[mid] (${nums[mid]}) with nums[right] (${nums[right]})...`,
    });

    if (nums[mid] > nums[right]) {
      frames.push({
        left,
        right,
        mid,
        message: (
          <Box flexDirection="column">
            <Text>
              nums[mid] ({nums[mid]}) <Text color="red">{">"}</Text> nums[right]
              ({nums[right]}).
            </Text>
            <Text>
              {"\n"}
              <Text bold>What does this mean?</Text>
            </Text>
            <Text>
              Because the array is rotated, if the middle is STRICTLY GREATER
              than the right end, there must be a "cliff" (a sudden drop)
              somewhere to the right of mid.
            </Text>
            <Text>
              Therefore, the minimum MUST be strictly to the right of mid.
            </Text>
            <Text>
              {"\n"}Moving Left pointer to mid + 1 (<Text bold>{mid + 1}</Text>
              ).
            </Text>
          </Box>
        ),
        rawMessageForAI: `nums[mid] (${nums[mid]}) > nums[right] (${nums[right]}). There must be a cliff somewhere to the right of mid. Moving Left pointer to mid + 1.`,
      });
      left = mid + 1;
    } else {
      frames.push({
        left,
        right,
        mid,
        message: (
          <Box flexDirection="column">
            <Text>
              nums[mid] ({nums[mid]}) <Text color="green">{"<="}</Text>{" "}
              nums[right] ({nums[right]}).
            </Text>
            <Text>
              {"\n"}
              <Text bold>What does this mean?</Text>
            </Text>
            <Text>
              The right half (from mid to right) is perfectly sorted and climbs
              smoothly. There is no "cliff" here.
            </Text>
            <Text>
              Therefore, the minimum is either at mid itself, or somewhere to
              the left.
            </Text>
            <Text>
              {"\n"}Moving Right pointer to mid (<Text bold>{mid}</Text>).
            </Text>
          </Box>
        ),
        rawMessageForAI: `nums[mid] (${nums[mid]}) <= nums[right] (${nums[right]}). The right half is perfectly sorted. Moving Right pointer to mid.`,
      });
      right = mid;
    }

    if (left < right) {
      frames.push({
        left,
        right,
        mid: -1,
        message: (
          <Box flexDirection="column">
            <Text>
              Updated search space bounds: [<Text color="cyan">{left}</Text>,{" "}
              <Text color="magenta">{right}</Text>].
            </Text>
            <Text>Continuing search...</Text>
          </Box>
        ),
        rawMessageForAI: `Updated search space bounds: [${left}, ${right}]. Continuing search...`,
      });
    }
  }

  frames.push({
    left,
    right,
    mid: -1,
    message: (
      <Box flexDirection="column">
        <Box>
          <Text backgroundColor="green" color="black">
            FINISHED!
          </Text>
          <Text> Left and Right pointers have met at index {left}.</Text>
        </Box>
        <Text>
          {"\n"}The minimum element is <Text bold>{nums[left]}</Text>.
        </Text>
        <Text>
          {"\n"}Press <Text color="yellow">[q]</Text> to exit.
        </Text>
      </Box>
    ),
    rawMessageForAI: `FINISHED! Left and Right pointers have met at index ${left}. The minimum element is ${nums[left]}.`,
  });

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
  const { left, right, mid } = frame;

  const maxVal = Math.max(...nums);
  const minVal = Math.min(...nums);
  const chartHeight = 12;

  return (
    <Box flexDirection="row" width="100%" height="100%">
      {/* Main Visualizer Area */}
      <Box
        flexDirection="column"
        flexGrow={1}
        borderStyle="single"
        padding={1}
        width={isAIVisible ? "60%" : "100%"}
      >
        {/* Array Bar Chart */}
        <Box
          height={chartHeight + 5}
          flexDirection="column"
          borderStyle="single"
        >
          <Box justifyContent="center">
            <Text bold>Array Bar Chart</Text>
          </Box>
          {Array.from({ length: chartHeight }).map((_, rIdx) => {
            const row = chartHeight - rIdx;
            return (
              <Box key={`row-${row}`}>
                {nums.map((val, i) => {
                  const normalizedHeight =
                    maxVal === minVal
                      ? 1
                      : Math.ceil(
                          ((val - minVal + 1) / (maxVal - minVal + 1)) *
                            chartHeight,
                        );
                  const isGray = i < left || i > right;
                  const isMid = i === mid;
                  const color = isGray ? "gray" : isMid ? "yellow" : "white";

                  return (
                    <Box width={7} key={i}>
                      <Text color={color}>
                        {normalizedHeight >= row ? "████" : "    "}
                      </Text>
                    </Box>
                  );
                })}
              </Box>
            );
          })}

          {/* Values Row */}
          <Box>
            {nums.map((val, i) => {
              const isGray = i < left || i > right;
              const isMid = i === mid;
              const color = isGray ? "gray" : isMid ? "black" : "white";
              const bg = isMid ? "yellow" : undefined;
              return (
                <Box width={7} key={`val-${i}`}>
                  <Text color={color} backgroundColor={bg}>
                    {val.toString().padStart(2, " ").padEnd(4, " ")}
                  </Text>
                </Box>
              );
            })}
          </Box>

          {/* Indices Row */}
          <Box>
            {nums.map((_, i) => {
              const isMid = i === mid;
              const inRange = i >= left && i <= right;
              const color = isMid ? "yellow" : inRange ? "cyan" : "gray";
              return (
                <Box width={7} key={`idx-${i}`}>
                  <Text color={color}>{`i:${i}`.padEnd(4, " ")}</Text>
                </Box>
              );
            })}
          </Box>

          {/* Pointers Row */}
          <Box>
            {nums.map((_, i) => {
              let ptrNodes: React.ReactNode[] = [];
              if (i === mid) {
                if (i === left && i === right)
                  ptrNodes = [
                    <Text color="cyan" key="L">
                      L
                    </Text>,
                    <Text color="yellow" key="M">
                      M
                    </Text>,
                    <Text color="magenta" key="R">
                      R
                    </Text>,
                  ];
                else if (i === left)
                  ptrNodes = [
                    <Text color="cyan" key="L">
                      L
                    </Text>,
                    <Text key="1">/</Text>,
                    <Text color="yellow" key="M">
                      M
                    </Text>,
                  ];
                else if (i === right)
                  ptrNodes = [
                    <Text color="yellow" key="M">
                      M
                    </Text>,
                    <Text key="1">/</Text>,
                    <Text color="magenta" key="R">
                      R
                    </Text>,
                  ];
                else
                  ptrNodes = [
                    <Text color="yellow" key="M">
                      {" "}
                      M{" "}
                    </Text>,
                  ];
              } else if (i === left && i === right) {
                ptrNodes = [
                  <Text color="cyan" key="L">
                    L
                  </Text>,
                  <Text key="1">/</Text>,
                  <Text color="magenta" key="R">
                    R
                  </Text>,
                ];
              } else if (i === left) {
                ptrNodes = [
                  <Text color="cyan" key="L">
                    {" "}
                    L{" "}
                  </Text>,
                ];
              } else if (i === right) {
                ptrNodes = [
                  <Text color="magenta" key="R">
                    {" "}
                    R{" "}
                  </Text>,
                ];
              }

              return (
                <Box width={7} key={`ptr-${i}`}>
                  {ptrNodes}
                </Box>
              );
            })}
          </Box>
        </Box>

        {/* Logs Area */}
        <Box
          flexGrow={1}
          borderStyle="single"
          padding={1}
          flexDirection="column"
        >
          <Box justifyContent="center" marginBottom={1}>
            <Text bold>Logs & Execution Logic</Text>
          </Box>
          {frame.message}
        </Box>
      </Box>

      {/* AI Assistant Sidebar */}
      {isAIVisible && (
        <Box width="40%" height="100%">
          <AIAssistant
            context={JSON.stringify(
              {
                Array: nums,
                Left: left,
                Right: right,
                Mid: mid,
                Explanation: frame.rawMessageForAI,
              },
              null,
              2,
            )}
          />
        </Box>
      )}
    </Box>
  );
};

// Execution
const testCase = getTestCaseNumber();
let nums: number[];

switch (testCase) {
  case 1:
    nums = [3, 4, 5, 6, 1, 2];
    break;
  case 2:
    nums = [4, 5, 0, 1, 2, 3];
    break;
  case 3:
    nums = [4, 5, 6, 7];
    break;
  case 4:
    nums = [11, 13, 15, 17];
    break;
  case 5:
    nums = [2, 1];
    break;
  case 6:
    nums = [7, 8, 9, 10, 11, 12, 1, 2, 3, 4, 5, 6];
    break;
  default:
    nums = [3, 4, 5, 6, 1, 2];
    break;
}

render(<VisualizerApp nums={nums} />);
