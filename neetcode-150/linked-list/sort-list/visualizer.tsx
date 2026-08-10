import React, { useState } from "react";
import { render, Box, Text, useInput, useApp } from "ink";
import { getTestCaseNumber } from "../../../utils/cli.js";
import { AIAssistant } from "../../../utils/aiHelper.js";

type NodeState = "UNVISITED" | "SPLITTING" | "WAITING" | "MERGING" | "SORTED";

interface TreeNode {
  id: string;
  depth: number;
  val: number[];
  state: NodeState;
  leftId: string | null;
  rightId: string | null;
}

interface Frame {
  tree: Record<string, TreeNode>;
  rootId: string | null;
  activeNodeId: string | null;
  phase: string;
  message: React.ReactNode;
  rawMessageForAI: string;
}

function generateFrames(nums: number[]): Frame[] {
  const frames: Frame[] = [];
  const tree: Record<string, TreeNode> = {};
  let nodeIdCounter = 0;
  let rootId: string | null = null;

  const snapshot = () => JSON.parse(JSON.stringify(tree));

  const pushFrame = (
    activeNodeId: string,
    phase: string,
    msg: React.ReactNode,
    rawMsg: string
  ) => {
    frames.push({
      tree: snapshot(),
      rootId,
      activeNodeId,
      phase,
      message: msg,
      rawMessageForAI: rawMsg,
    });
  };

  function sortListVis(arr: number[], depth: number): string {
    const id = `node_${nodeIdCounter++}`;
    tree[id] = { id, depth, val: arr, state: "SPLITTING", leftId: null, rightId: null };
    if (!rootId) rootId = id;

    pushFrame(
      id,
      "Function Call: sortList",
      <Box flexDirection="column">
        <Text>Called <Text bold color="cyan">sortList([{arr.join(" -> ")}])</Text>.</Text>
        {arr.length <= 1 ? (
          <Text>The list has 1 or 0 nodes. This is our <Text bold color="green">Base Case</Text>!</Text>
        ) : (
          <Text>The list has {'>'}1 nodes. We need to split it in half using the slow/fast pointer technique.</Text>
        )}
      </Box>,
      `sortList called on [${arr.join(", ")}].`
    );

    if (arr.length <= 1) {
      tree[id].state = "SORTED";
      pushFrame(
        id,
        "Base Case Return",
        <Box flexDirection="column">
          <Text><Text bold color="green">Base Case Reached!</Text> A list of 1 node is already sorted.</Text>
          <Text>We instantly return <Text bold color="cyan">[{arr.join(" -> ")}]</Text> back up the call stack.</Text>
        </Box>,
        `Base case reached for [${arr.join(", ")}]. Returning.`
      );
      return id;
    }

    const midIndex = Math.ceil(arr.length / 2);
    const leftArr = arr.slice(0, midIndex);
    const rightArr = arr.slice(midIndex);

    tree[id].state = "WAITING";
    pushFrame(
      id,
      "Splitting List",
      <Box flexDirection="column">
        <Text>We successfully found the middle of <Text bold>[{arr.join(" -> ")}]</Text>.</Text>
        <Text>Now we pause execution of this level to recursively sort the <Text bold color="magenta">LEFT</Text> half: <Text bold>const left = sortList(head);</Text></Text>
      </Box>,
      `Splitting [${arr.join(", ")}] into left=[${leftArr.join(", ")}] and right=[${rightArr.join(", ")}]. Pausing to sort left.`
    );

    const leftId = sortListVis(leftArr, depth + 1);
    tree[id].leftId = leftId;
    
    pushFrame(
      id,
      "Left Half Sorted",
      <Box flexDirection="column">
        <Text>The <Text bold color="magenta">LEFT</Text> half is now fully sorted: <Text bold>[{tree[leftId].val.join(" -> ")}]</Text>.</Text>
        <Text>Now we pause execution again to recursively sort the <Text bold color="yellow">RIGHT</Text> half: <Text bold>const right = sortList(mid);</Text></Text>
      </Box>,
      `Left half sorted. Now recursively calling sortList on right=[${rightArr.join(", ")}].`
    );

    const rightId = sortListVis(rightArr, depth + 1);
    tree[id].rightId = rightId;

    tree[id].state = "MERGING";
    pushFrame(
      id,
      "Both Halves Sorted - Merging",
      <Box flexDirection="column">
        <Text>Both halves are finally sorted!</Text>
        <Text>Left: <Text bold color="magenta">[{tree[leftId].val.join(" -> ")}]</Text></Text>
        <Text>Right: <Text bold color="yellow">[{tree[rightId].val.join(" -> ")}]</Text></Text>
        <Text>We now execute <Text bold color="cyan">return merge(left, right);</Text></Text>
      </Box>,
      `Both halves sorted. Executing merge(left, right).`
    );

    // Simulate merge
    const merged = [...tree[leftId].val, ...tree[rightId].val].sort((a, b) => a - b);
    tree[id].val = merged;
    tree[id].state = "SORTED";
    
    pushFrame(
      id,
      "Merge Complete",
      <Box flexDirection="column">
        <Text>The two halves have been merged into a single sorted list!</Text>
        <Text>Result: <Text bold color="green">[{merged.join(" -> ")}]</Text>.</Text>
        <Text>We return this sorted list back up the call stack.</Text>
      </Box>,
      `Merge complete. Result=[${merged.join(", ")}]. Returning up the stack.`
    );

    return id;
  }

  if (nums.length > 0) {
    sortListVis(nums, 0);
  } else {
    pushFrame("empty", "Empty List", <Text>List is empty.</Text>, "List is empty.");
  }

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
  const { tree, rootId, activeNodeId, phase, message } = frame;

  const renderTree = (nodeId: string, prefix: string = "", isTail: boolean = true) => {
    const node = tree[nodeId];
    if (!node) return null;

    const isActive = node.id === activeNodeId;
    let color = "gray";
    let stateLabel = "";

    switch (node.state) {
      case "SPLITTING": color = "cyan"; stateLabel = "Splitting..."; break;
      case "WAITING": color = "yellow"; stateLabel = "Waiting on children..."; break;
      case "MERGING": color = "magenta"; stateLabel = "Merging children..."; break;
      case "SORTED": color = "green"; stateLabel = "Sorted ✓"; break;
    }

    const boxChar = isTail ? "└── " : "├── ";
    const childPrefix = prefix + (isTail ? "    " : "│   ");
    
    // For root node, we don't need tree branches
    const isRoot = prefix === "";
    const displayPrefix = isRoot ? "" : prefix + boxChar;

    return (
      <Box key={nodeId} flexDirection="column">
        <Box flexDirection="row" alignItems="center">
          <Text>{displayPrefix}</Text>
          <Box borderStyle="round" borderColor={isActive ? "white" : color} paddingX={1} backgroundColor={isActive ? "gray" : undefined}>
            <Text color={isActive ? "white" : color} bold={isActive}>[{node.val.join(" -> ")}]</Text>
          </Box>
          <Text color={color} dimColor={!isActive}>  ({stateLabel})</Text>
        </Box>
        {node.leftId && renderTree(node.leftId, childPrefix, !node.rightId)}
        {node.rightId && renderTree(node.rightId, childPrefix, true)}
      </Box>
    );
  };

  return (
    <Box flexDirection="row" width="100%" height="100%">
      {/* Main Visualizer */}
      <Box flexDirection="column" flexGrow={1} borderStyle="single" padding={1} width={isAIVisible ? "60%" : "100%"}>
        
        {/* Header */}
        <Box justifyContent="center" marginBottom={1}>
          <Text bold color="yellow">=== Sort List (Merge Sort on Linked List) ===</Text>
        </Box>
        <Box justifyContent="center" marginBottom={1}>
          <Text bold color="cyan">{phase}</Text>
        </Box>

        {/* Tree View */}
        <Box flexDirection="column" borderStyle="single" borderColor="gray" marginX={2} marginBottom={1} padding={1} minHeight={15}>
          <Box justifyContent="center" marginBottom={1}><Text bold>Call Stack Tree (Divide & Conquer)</Text></Box>
          {rootId ? renderTree(rootId) : <Text>Empty tree</Text>}
        </Box>

        {/* Code Highlight View */}
        <Box flexDirection="column" borderStyle="single" borderColor="gray" marginX={2} marginBottom={1} padding={1}>
           <Text color={phase.includes("Splitting") ? "yellow" : "gray"}>1. Split list in half using slow/fast pointers</Text>
           <Text color={phase.includes("Left") || (tree[activeNodeId!]?.leftId === null && phase.includes("sortList")) ? "yellow" : "gray"}>2. const left = sortList(head);</Text>
           <Text color={phase.includes("Right") ? "yellow" : "gray"}>3. const right = sortList(mid);</Text>
           <Text color={phase.includes("Merging") || phase.includes("Merge Complete") ? "yellow" : "gray"}>4. return merge(left, right);</Text>
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
    nums = [4, 2, 1, 3];
    break;
  case 2:
    nums = [-1, 5, 3, 4, 0];
    break;
  case 3:
    nums = [3, 1];
    break;
  case 4:
    nums = [8, 3, 5, 2, 9, 1, 6];
    break;
  default:
    nums = [4, 2, 1, 3];
    break;
}

render(<VisualizerApp nums={nums} />);
