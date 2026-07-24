import React, { useState } from "react";
import { render, Box, Text, useInput, useApp } from "ink";
import { getTestCaseNumber } from "../../../utils/cli.js";
import { AIAssistant } from "../../../utils/aiHelper.js";

interface Frame {
  nodes: { val: number; nextTarget: number | null }[];
  slowIdx: number | null;
  fastIdx: number | null;
  phase: string;
  message: React.ReactNode;
  rawMessageForAI: string;
}

function generateFrames(nums: number[], cyclePos: number): Frame[] {
  const frames: Frame[] = [];

  if (nums.length === 0) return frames;

  // Initialize node states
  const nodes = nums.map((val, i) => ({
    val,
    nextTarget:
      i === nums.length - 1 ? (cyclePos !== -1 ? cyclePos : null) : i + 1,
  }));

  let slowIdx: number | null = 0;
  let fastIdx: number | null = 0;

  const pushFrame = (phase: string, msg: React.ReactNode, rawMsg: string) => {
    frames.push({
      nodes: JSON.parse(JSON.stringify(nodes)),
      slowIdx,
      fastIdx,
      phase,
      message: msg,
      rawMessageForAI: rawMsg,
    });
  };

  pushFrame(
    "Initialization",
    <Box flexDirection="column">
      <Text>
        We initialize two pointers at the <Text color="cyan">HEAD</Text>:
      </Text>
      <Text>
        1. <Text color="magenta">slow</Text> (Tortoise): Moves 1 step at a time.
      </Text>
      <Text>
        2. <Text color="yellow">fast</Text> (Hare): Moves 2 steps at a time.
      </Text>
    </Box>,
    "Initialized slow and fast pointers at head (index 0).",
  );

  let stepCounter = 1;
  while (fastIdx !== null && nodes[fastIdx].nextTarget !== null) {
    // Determine the next positions
    const nextSlow: any = nodes[slowIdx!].nextTarget;
    const fastNext: any = nodes[fastIdx].nextTarget;
    const nextFast: any = fastNext !== null ? nodes[fastNext].nextTarget : null;

    pushFrame(
      `Step ${stepCounter}: Movement`,
      <Box flexDirection="column">
        <Text>
          <Text color="yellow">fast</Text> and its next node are not null.
        </Text>
        <Text>
          We move <Text color="magenta">slow</Text> forward by{" "}
          <Text bold>1</Text> step to Index{" "}
          {nextSlow === null ? "null" : nextSlow}.
        </Text>
        <Text>
          We move <Text color="yellow">fast</Text> forward by{" "}
          <Text bold>2</Text> steps to Index{" "}
          {nextFast === null ? "null" : nextFast}.
        </Text>
      </Box>,
      `Moving slow 1 step to ${nextSlow} and fast 2 steps to ${nextFast}.`,
    );

    slowIdx = nextSlow;
    fastIdx = nextFast;

    if (slowIdx === fastIdx) {
      pushFrame(
        `Step ${stepCounter}: Cycle Detected!`,
        <Box flexDirection="column">
          <Text backgroundColor="red" color="white" bold>
            {" "}
            COLLISION DETECTED!{" "}
          </Text>
          <Text>
            Because the <Text color="yellow">fast</Text> pointer moves 2x
            faster, it wraps around the cycle and "laps" the{" "}
            <Text color="magenta">slow</Text> pointer!
          </Text>
          <Text>
            Both pointers are now on{" "}
            <Text bold color="green">
              Index {slowIdx}
            </Text>
            .
          </Text>
          <Text>
            We return <Text color="green">true</Text>.
          </Text>
        </Box>,
        `Collision detected at index ${slowIdx}. Returning true (cycle exists).`,
      );
      return frames;
    }

    stepCounter++;
  }

  pushFrame(
    "Linear List Detected",
    <Box flexDirection="column">
      <Text backgroundColor="green" color="black" bold>
        {" "}
        END OF LIST REACHED{" "}
      </Text>
      <Text>
        The <Text color="yellow">fast</Text> pointer hit a{" "}
        <Text color="gray">null</Text> node!
      </Text>
      <Text>
        This means the list has an end. A list with an end cannot possibly have
        a cycle.
      </Text>
      <Text>
        We return <Text color="green">false</Text>.
      </Text>
    </Box>,
    "Fast pointer reached null. Returning false (no cycle).",
  );

  return frames;
}

const VisualizerApp: React.FC<{ nums: number[]; cyclePos: number }> = ({
  nums,
  cyclePos,
}) => {
  const [frames] = useState(() => generateFrames(nums, cyclePos));
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

  if (frames.length === 0) return <Text>Empty list provided.</Text>;

  const frame = frames[currentFrameIdx];
  const { nodes, slowIdx, fastIdx, phase, message } = frame;

  return (
    <Box flexDirection="row" width="100%" height="100%">
      {/* Main Visualizer */}
      <Box
        flexDirection="column"
        flexGrow={1}
        borderStyle="single"
        padding={1}
        width={isAIVisible ? "60%" : "100%"}
      >
        {/* Header */}
        <Box justifyContent="center" marginBottom={1}>
          <Text bold color="yellow">
            === Linked List Cycle (Floyd's Tortoise & Hare) ===
          </Text>
        </Box>
        <Box justifyContent="center" marginBottom={1}>
          <Text bold color="cyan">
            {phase}
          </Text>
        </Box>

        {/* Linked List Area */}
        <Box flexDirection="column" height={15} justifyContent="center">
          
          {/* Pointers Top Label */}
          <Box flexDirection="row">
            {nodes.map((_, i) => (
              <Box width={7} key={`ptr-lbl-${i}`}>
                <Box width={5} justifyContent="center" alignItems="center">
                  {slowIdx === i && fastIdx === i ? <Text color="red" bold>s/f</Text> :
                   slowIdx === i ? <Text color="magenta" bold>s</Text> :
                   fastIdx === i ? <Text color="yellow" bold>f</Text> :
                   <Text> </Text>}
                </Box>
              </Box>
            ))}
          </Box>
          
          {/* Pointers Arrow Down */}
          <Box flexDirection="row">
            {nodes.map((_, i) => (
              <Box width={7} key={`ptr-arr-${i}`}>
                <Box width={5} justifyContent="center" alignItems="center">
                  {(slowIdx === i || fastIdx === i) ? <Text color="white">↓</Text> : <Text> </Text>}
                </Box>
              </Box>
            ))}
          </Box>

          {/* Nodes Row */}
          <Box flexDirection="row">
            {nodes.map((node, i) => (
              <Box width={7} key={`node-${i}`} flexDirection="row" alignItems="center">
                <Box width={5} borderStyle="round" borderColor="cyan" justifyContent="center" paddingX={0}>
                  <Text>{node.val}</Text>
                </Box>
                {i < nodes.length - 1 ? <Text color="cyan">-&gt;</Text> : <Text>  </Text>}
              </Box>
            ))}
          </Box>

          {/* Cycle Wrap-Around Arrow (Only if cycle exists) */}
          {cyclePos !== -1 && (
            <>
              <Box flexDirection="row">
                {/* Space up to cyclePos center */}
                <Box width={cyclePos * 7 + 2} />
                <Text color="red" bold>↑</Text>
                {/* Space up to last node center */}
                <Box width={(nodes.length - 1 - cyclePos) * 7 - 1} />
                <Text color="red" bold>|</Text>
              </Box>
              <Box flexDirection="row">
                <Box width={cyclePos * 7 + 2} />
                <Text color="red" bold>+{'-'.repeat((nodes.length - 1 - cyclePos) * 7 - 1)}+</Text>
              </Box>
            </>
          )}

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
                Pointers: {
                  slow: slowIdx === null ? "null" : `Index ${slowIdx}`,
                  fast: fastIdx === null ? "null" : `Index ${fastIdx}`,
                },
                NodesMemoryState: nodes,
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

// Test Cases
const testCase = getTestCaseNumber();
let nums: number[];
let cyclePos: number; // Index it connects to, or -1 if no cycle

switch (testCase) {
  case 1:
    // User requested EXACT 1 to 9 cyclic list!
    nums = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    cyclePos = 2; // Loops back to 3 (which is index 2)
    break;
  case 2:
    // Linear list (no cycle)
    nums = [1, 2, 3, 4, 5];
    cyclePos = -1;
    break;
  case 3:
    // Tiny cycle (loops to 0)
    nums = [1, 2];
    cyclePos = 0;
    break;
  case 4:
    // No cycle, size 1
    nums = [1];
    cyclePos = -1;
    break;
  default:
    nums = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    cyclePos = 2; 
    break;
}

render(<VisualizerApp nums={nums} cyclePos={cyclePos} />);
