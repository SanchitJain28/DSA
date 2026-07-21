import React, { useState } from "react";
import { render, Box, Text, useInput, useApp } from "ink";
import { getTestCaseNumber } from "../../../utils/cli.js";
import { AIAssistant } from "../../../utils/aiHelper.js";

interface NodeState {
  val: number;
  nextTarget: number | null;
}

interface Frame {
  nodes: NodeState[];
  prevIdx: number | null;
  currIdx: number | null;
  nextIdx: number | null;
  highlightedLine: number;
  message: React.ReactNode;
  rawMessageForAI: string;
}

function generateFrames(nums: number[]): Frame[] {
  const frames: Frame[] = [];
  
  if (nums.length === 0) return frames;

  // Initialize node states
  let currentNodes: NodeState[] = nums.map((val, i) => ({
    val,
    nextTarget: i === nums.length - 1 ? null : i + 1
  }));

  let prevIdx: number | null = null;
  let currIdx: number | null = 0;
  let nextIdx: number | null = null;

  const pushFrame = (line: number, msg: React.ReactNode, rawMsg: string) => {
    frames.push({
      // deep copy nodes
      nodes: JSON.parse(JSON.stringify(currentNodes)),
      prevIdx,
      currIdx,
      nextIdx,
      highlightedLine: line,
      message: msg,
      rawMessageForAI: rawMsg
    });
  };

  // Line 1 & 2
  pushFrame(
    1,
    <Box flexDirection="column">
      <Text>We initialize two pointers:</Text>
      <Text>1. <Text color="magenta">prev</Text> starts at <Text color="gray">null</Text> because the reversed list will eventually point to null at the end.</Text>
      <Text>2. <Text color="yellow">curr</Text> starts at the <Text color="cyan">HEAD</Text> of our list (Node 0).</Text>
    </Box>,
    "Initialized prev to null and curr to head (index 0)."
  );

  while (currIdx !== null) {
    // Line 3
    pushFrame(
      3,
      <Box flexDirection="column">
        <Text><Text color="yellow">curr</Text> is not null (it's at index {currIdx}). So we enter the while loop!</Text>
      </Box>,
      `Checked while condition: curr is not null (index ${currIdx}). Entering loop.`
    );

    // Line 4: const next = curr.next;
    nextIdx = currentNodes[currIdx].nextTarget;
    pushFrame(
      4,
      <Box flexDirection="column">
        <Text bold>Step 1: Save the next node.</Text>
        <Text>Before we break the link of <Text color="yellow">curr</Text>, we MUST remember where the rest of the list is! Otherwise, it's lost in memory forever.</Text>
        <Text>We set <Text color="blue">next</Text> = curr.next (Index {nextIdx === null ? "null" : nextIdx}).</Text>
      </Box>,
      `Saved next node. next = curr.next (index ${nextIdx}).`
    );

    // Line 5: curr.next = prev;
    currentNodes[currIdx].nextTarget = prevIdx;
    pushFrame(
      5,
      <Box flexDirection="column">
        <Text bold>Step 2: Reverse the pointer!</Text>
        <Text>This is the magic step. We change <Text color="yellow">curr.next</Text> to point backwards to <Text color="magenta">prev</Text> (Index {prevIdx === null ? "null" : prevIdx}).</Text>
        <Text>Notice how the 'nxt' value inside the Node box has changed!</Text>
      </Box>,
      `Reversed the pointer. curr.next = prev (index ${prevIdx}). Notice the link is broken from the rest of the list.`
    );

    // Line 6: prev = curr;
    prevIdx = currIdx;
    pushFrame(
      6,
      <Box flexDirection="column">
        <Text bold>Step 3: Slide prev forward.</Text>
        <Text>Now that the arrow is reversed, our <Text color="magenta">prev</Text> pointer's job here is done.</Text>
        <Text>We slide <Text color="magenta">prev</Text> forward to sit on <Text color="yellow">curr</Text> (Index {currIdx}).</Text>
      </Box>,
      `Slid prev forward to curr (index ${currIdx}).`
    );

    // Line 7: curr = next;
    currIdx = nextIdx;
    pushFrame(
      7,
      <Box flexDirection="column">
        <Text bold>Step 4: Slide curr forward.</Text>
        <Text>Finally, we slide <Text color="yellow">curr</Text> forward to the <Text color="blue">next</Text> node we saved earlier (Index {currIdx === null ? "null" : currIdx}).</Text>
        <Text>Now we are ready for the next iteration!</Text>
      </Box>,
      `Slid curr forward to next (index ${currIdx}). Loop iteration complete.`
    );
  }

  // Line 3 exit
  pushFrame(
    3,
    <Box flexDirection="column">
      <Text><Text color="yellow">curr</Text> is now <Text color="gray">null</Text>. We have reached the end of the list!</Text>
      <Text>The while loop terminates.</Text>
    </Box>,
    `Checked while condition: curr is null. Exiting loop.`
  );

  // Line 9
  pushFrame(
    9,
    <Box flexDirection="column">
      <Text backgroundColor="green" color="black"> SUCCESS! </Text>
      <Text>The list is completely reversed. <Text color="magenta">prev</Text> is sitting on the NEW HEAD of the list.</Text>
      <Text>We return <Text color="magenta">prev</Text>.</Text>
    </Box>,
    `Returned prev, which is the new head of the reversed linked list.`
  );

  return frames;
}

const codeSnippet = [
  "let prev = null;",
  "let curr = head;",
  "while (curr !== null) {",
  "  const next = curr.next;",
  "  curr.next = prev;",
  "  prev = curr;",
  "  curr = next;",
  "}",
  "return prev;"
];

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

  if (frames.length === 0) return <Text>Empty list provided.</Text>;

  const frame = frames[currentFrameIdx];
  const { nodes, prevIdx, currIdx, nextIdx, highlightedLine, message } = frame;

  return (
    <Box flexDirection="row" width="100%" height="100%">
      {/* Main Visualizer */}
      <Box flexDirection="column" flexGrow={1} borderStyle="single" padding={1} width={isAIVisible ? "60%" : "100%"}>
        
        {/* Header */}
        <Box justifyContent="center" marginBottom={1}>
          <Text bold color="yellow">=== Reverse Linked List ===</Text>
        </Box>

        {/* Graphical + Code Split */}
        <Box flexDirection="row" height={12}>
          
          {/* Linked List Area */}
          <Box flexDirection="column" flexGrow={1}>
            <Box justifyContent="center" marginBottom={1}>
              <Text bold>Memory State</Text>
            </Box>
            
            <Box flexDirection="row" justifyContent="center">
              {nodes.map((node, i) => {
                // Determine display string for next target
                const nextStr = node.nextTarget === null ? "null" : `Idx ${node.nextTarget}`;
                const isTargetPrev = node.nextTarget !== null && node.nextTarget < i; // pointing backwards!
                
                // Determine arrow
                let arrowNode = null;
                if (i < nodes.length - 1) {
                  const nextNode = nodes[i + 1];
                  if (node.nextTarget === i + 1) {
                    arrowNode = <Text color="cyan">{"->"}</Text>;
                  } else if (nextNode.nextTarget === i) {
                    arrowNode = <Text color="green">{"<-"}</Text>;
                  } else {
                    arrowNode = <Text>{"  "}</Text>;
                  }
                }

                return (
                  <React.Fragment key={i}>
                    <Box flexDirection="column" alignItems="center">
                      <Text color="gray">Idx {i}</Text>
                      <Box borderStyle="round" borderColor={isTargetPrev ? "green" : "cyan"} flexDirection="column" paddingX={1}>
                        <Text>val: {node.val}</Text>
                        <Text color={isTargetPrev ? "green" : "cyan"}>nxt: {nextStr}</Text>
                      </Box>
                      {/* Pointers Row underneath */}
                      <Box flexDirection="column" alignItems="center" height={3}>
                        {prevIdx === i && <Text color="magenta">↑ prev</Text>}
                        {currIdx === i && <Text color="yellow">↑ curr</Text>}
                        {nextIdx === i && <Text color="blue">↑ next</Text>}
                      </Box>
                    </Box>
                    
                    {arrowNode && (
                      <Box flexDirection="column" justifyContent="flex-start" marginTop={2} paddingX={1}>
                        {arrowNode}
                      </Box>
                    )}
                  </React.Fragment>
                );
              })}
              
              {/* Representing the initial NULL space for prev */}
              <Box flexDirection="column" justifyContent="flex-start" marginTop={2} paddingX={1}>
                 <Text color="gray">{"  "}</Text>
              </Box>
              <Box flexDirection="column" alignItems="center">
                 <Box height={1}><Text> </Text></Box>
                 <Box paddingX={1} borderStyle="round" borderColor="gray">
                    <Text color="gray">null</Text>
                 </Box>
                 <Box flexDirection="column" alignItems="center" height={3}>
                    {prevIdx === null && <Text color="magenta">↑ prev</Text>}
                    {currIdx === null && <Text color="yellow">↑ curr</Text>}
                    {nextIdx === null && <Text color="blue">↑ next</Text>}
                 </Box>
              </Box>
            </Box>
          </Box>

          {/* Code Snippet Area */}
          <Box borderStyle="single" borderColor="gray" width={30} paddingX={1} flexDirection="column">
            <Box marginBottom={1}><Text bold>Algorithm</Text></Box>
            {codeSnippet.map((lineStr, idx) => {
              const lineNum = idx + 1;
              let isHighlighted = false;
              if (highlightedLine === 1 && (lineNum === 1 || lineNum === 2)) isHighlighted = true;
              else if (lineNum === highlightedLine) isHighlighted = true;
              
              return (
                <Text key={idx} color={isHighlighted ? "black" : "white"} backgroundColor={isHighlighted ? "yellow" : undefined}>
                  {lineStr}
                </Text>
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
            context={JSON.stringify({
              AlgorithmLine: codeSnippet[highlightedLine - 1],
              Pointers: {
                 prev: prevIdx === null ? "null" : `Index ${prevIdx}`,
                 curr: currIdx === null ? "null" : `Index ${currIdx}`,
                 next: nextIdx === null ? "null" : `Index ${nextIdx}`,
              },
              NodesMemoryState: nodes,
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

switch (testCase) {
  case 1:
    nums = [1, 2, 3, 4, 5];
    break;
  case 2:
    nums = [1, 2];
    break;
  case 3:
    nums = [1];
    break;
  case 4:
    nums = [10, 20, 30];
    break;
  default:
    nums = [1, 2, 3, 4, 5];
    break;
}

render(<VisualizerApp nums={nums} />);
