import React, { useState } from "react";
import { render, Box, Text, useInput, useApp } from "ink";
import { getTestCaseNumber } from "../../../utils/cli.js";
import { AIAssistant } from "../../../utils/aiHelper.js";

interface NodeState {
  val: number | string;
  nxt: number | null;
  isDummy: boolean;
}

interface Frame {
  memory: NodeState[];
  pointers: {
    prev: number | null;
    left: number | null;
    right: number | null;
    nextPair: number | null;
  };
  phase: string;
  message: React.ReactNode;
  rawMessageForAI: string;
}

function generateFrames(nums: number[]): Frame[] {
  const frames: Frame[] = [];
  
  // Initialize memory. Idx 0 is Dummy. Idx 1..N are nums.
  const memory: NodeState[] = [
    { val: "D", nxt: nums.length > 0 ? 1 : null, isDummy: true },
    ...nums.map((val, i) => ({
      val,
      nxt: i < nums.length - 1 ? i + 2 : null,
      isDummy: false
    }))
  ];

  let prev: number | null = 0; // Dummy
  let left: number | null = memory[0].nxt;
  let right: number | null = null;
  let nextPair: number | null = null;

  const pushFrame = (
    phase: string,
    msg: React.ReactNode,
    rawMsg: string
  ) => {
    frames.push({
      memory: JSON.parse(JSON.stringify(memory)),
      pointers: { prev, left, right, nextPair },
      phase,
      message: msg,
      rawMessageForAI: rawMsg,
    });
  };

  pushFrame(
    "Initialization",
    <Box flexDirection="column">
      <Text>We initialize a <Text color="cyan">Dummy node</Text> (val: D) at memory index 0. It points to the head at index 1.</Text>
      <Text>We set <Text bold color="yellow">prev</Text> to the dummy node, and <Text bold color="magenta">left</Text> to the head.</Text>
    </Box>,
    "Initialized dummy node, prev, and left pointers."
  );

  let step = 1;
  while (left !== null && memory[left].nxt !== null) {
    right = memory[left].nxt;
    nextPair = right !== null ? memory[right].nxt : null;

    pushFrame(
      `Step ${step}: Identify Nodes`,
      <Box flexDirection="column">
        <Text>Condition met: <Text color="magenta">left</Text> and <Text color="magenta">left.next</Text> are not null. We can swap!</Text>
        <Text>We identify the 4 key actors for this swap:</Text>
        <Text>1. <Text bold color="yellow">prev</Text> (Index {prev}): The node BEFORE the pair.</Text>
        <Text>2. <Text bold color="magenta">left</Text> (Index {left}): The first node of the pair.</Text>
        <Text>3. <Text bold color="cyan">right</Text> (Index {right}): The second node of the pair.</Text>
        <Text>4. <Text bold color="green">nextPair</Text> (Index {nextPair ?? "null"}): The node AFTER the pair.</Text>
      </Box>,
      `Identified right=${right} and nextPair=${nextPair}.`
    );

    // Swap pointers
    memory[right!].nxt = left;
    pushFrame(
      `Step ${step}: Reverse Pair`,
      <Box flexDirection="column">
        <Text><Text bold color="cyan">right.next = left</Text></Text>
        <Text>We make the second node point backward to the first node.</Text>
        <Text>Index {right} now points to Index {left}.</Text>
      </Box>,
      `right.next = left. Index ${right} nxt is now ${left}.`
    );

    memory[left].nxt = nextPair;
    pushFrame(
      `Step ${step}: Connect Forward`,
      <Box flexDirection="column">
        <Text><Text bold color="magenta">left.next = nextPair</Text></Text>
        <Text>We make the first node point to the start of the next pair.</Text>
        <Text>Index {left} now points to Index {nextPair ?? "null"}.</Text>
      </Box>,
      `left.next = nextPair. Index ${left} nxt is now ${nextPair}.`
    );

    memory[prev!].nxt = right;
    pushFrame(
      `Step ${step}: Connect Backward`,
      <Box flexDirection="column">
        <Text><Text bold color="yellow">prev.next = right</Text></Text>
        <Text>We make the previous node point to the NEW start of this pair (which is <Text color="cyan">right</Text>).</Text>
        <Text>Index {prev} now points to Index {right}.</Text>
        <Text bold color="green">The swap for this pair is now complete!</Text>
      </Box>,
      `prev.next = right. Index ${prev} nxt is now ${right}. Swap complete.`
    );

    // Move pointers
    prev = left;
    left = nextPair;
    right = null;
    nextPair = null;

    pushFrame(
      `Step ${step}: Move to Next Pair`,
      <Box flexDirection="column">
        <Text>We shift our pointers to prepare for the next iteration:</Text>
        <Text><Text bold color="yellow">prev = left</Text> (Moves to Index {prev})</Text>
        <Text><Text bold color="magenta">left = nextPair</Text> (Moves to Index {left ?? "null"})</Text>
      </Box>,
      `Shifted pointers for next iteration. prev=${prev}, left=${left}.`
    );

    step++;
  }

  pushFrame(
    "Finished",
    <Box flexDirection="column">
      <Text backgroundColor="green" color="black" bold> FINISHED! </Text>
      <Text>The loop terminates because <Text color="magenta">left</Text> is null or <Text color="magenta">left.next</Text> is null (less than 2 nodes remaining).</Text>
      <Text>We return <Text bold>dummy.next</Text> (Index {memory[0].nxt}).</Text>
    </Box>,
    `Loop finished. Returning dummy.next which is index ${memory[0].nxt}.`
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
  const { memory, pointers, phase, message } = frame;

  // Build logical linked list from dummy node
  const logicalList: number[] = [];
  let curr: number | null = 0; // start at dummy
  const visited = new Set<number>(); // safety against infinite loops during transient broken states
  while (curr !== null && !visited.has(curr)) {
    logicalList.push(curr);
    visited.add(curr);
    curr = memory[curr].nxt;
  }

  return (
    <Box flexDirection="row" width="100%" height="100%">
      {/* Main Visualizer */}
      <Box flexDirection="column" flexGrow={1} borderStyle="single" padding={1} width={isAIVisible ? "60%" : "100%"}>
        
        {/* Header */}
        <Box justifyContent="center" marginBottom={1}>
          <Text bold color="yellow">=== Swap Nodes in Pairs ===</Text>
        </Box>
        <Box justifyContent="center" marginBottom={1}>
          <Text bold color="cyan">{phase}</Text>
        </Box>

        {/* Pointer Legend */}
        <Box flexDirection="row" justifyContent="center" marginBottom={1}>
           <Text color="yellow" bold>prev: {pointers.prev ?? "null"}</Text><Text> | </Text>
           <Text color="magenta" bold>left: {pointers.left ?? "null"}</Text><Text> | </Text>
           <Text color="cyan" bold>right: {pointers.right ?? "null"}</Text><Text> | </Text>
           <Text color="green" bold>nextPair: {pointers.nextPair ?? "null"}</Text>
        </Box>

        {/* Memory View */}
        <Box flexDirection="column" borderStyle="single" borderColor="gray" marginX={2} marginBottom={1} padding={1}>
          <Box justifyContent="center" marginBottom={1}><Text bold>Memory View (Fixed Indices)</Text></Box>
          <Box flexDirection="row" overflowX="hidden">
            {memory.map((node, i) => {
              const isPrev = pointers.prev === i;
              const isLeft = pointers.left === i;
              const isRight = pointers.right === i;
              const isNextPair = pointers.nextPair === i;

              let ptrColor = "gray";
              let label = "Idx";
              if (isPrev) { ptrColor = "yellow"; label = "prev"; }
              else if (isLeft) { ptrColor = "magenta"; label = "left"; }
              else if (isRight) { ptrColor = "cyan"; label = "right"; }
              else if (isNextPair) { ptrColor = "green"; label = "nextPair"; }

              return (
                <Box key={i} flexDirection="column" alignItems="center" marginRight={2}>
                  <Text color={ptrColor} bold>{label} {i}</Text>
                  <Box borderStyle="round" borderColor="white" paddingX={1} marginTop={1}>
                     <Text>{node.val}</Text>
                  </Box>
                  <Text color="blue">nxt: {node.nxt ?? "null"}</Text>
                </Box>
              );
            })}
          </Box>
        </Box>

        {/* Logical List View */}
        <Box flexDirection="column" borderStyle="single" borderColor="gray" marginX={2} marginBottom={1} padding={1}>
          <Box justifyContent="center" marginBottom={1}><Text bold>Logical Linked List (Follows `nxt` pointers)</Text></Box>
          <Box flexDirection="row" flexWrap="wrap">
            {logicalList.map((idx, i) => {
               const node = memory[idx];
               const isLast = i === logicalList.length - 1;
               return (
                 <React.Fragment key={`logical-${i}`}>
                   <Box borderStyle="round" borderColor={node.isDummy ? "cyan" : "white"} paddingX={1}>
                     <Text color={node.isDummy ? "cyan" : "white"}>{node.val}</Text>
                   </Box>
                   <Box justifyContent="center" alignItems="center" marginX={1}>
                     <Text color="green">{'->'}</Text>
                   </Box>
                   {isLast && node.nxt === null && (
                      <Box justifyContent="center" alignItems="center">
                        <Text color="gray">null</Text>
                      </Box>
                   )}
                 </React.Fragment>
               );
            })}
            {visited.has(curr as number) && (
               <Box justifyContent="center" alignItems="center">
                  <Text color="red" bold>...CYCLE DETECTED...</Text>
               </Box>
            )}
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
                Memory: memory,
                Pointers: pointers,
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
    nums = [1, 2, 3, 4];
    break;
  case 2:
    nums = [1, 2, 3, 4, 5];
    break;
  case 3:
    nums = [1];
    break;
  case 4:
    nums = [];
    break;
  default:
    nums = [1, 2, 3, 4];
    break;
}

render(<VisualizerApp nums={nums} />);
