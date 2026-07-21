import React, { useState } from "react";
import { render, Box, Text, useInput, useApp } from "ink";
import { getTestCaseNumber } from "../../../utils/cli.js";
import { AIAssistant } from "../../../utils/aiHelper.js";

type Mode = "unoptimized" | "optimized";

interface Frame {
  mode: Mode;
  phase: string;
  list1Nodes: { val: number; consumed: boolean; color: string }[];
  list2Nodes: { val: number; consumed: boolean; color: string }[];
  
  // Unoptimized specific
  array: number[];
  mergedNodes: number[]; // new nodes
  
  // Optimized specific
  mergedList: { val: number; color: string }[];
  t1Idx: number | null;
  t2Idx: number | null;
  tailIdx: number;

  message: React.ReactNode;
  rawMessageForAI: string;
}

function generateUnoptimizedFrames(arr1: number[], arr2: number[]): Frame[] {
  const frames: Frame[] = [];
  const list1Nodes = arr1.map(val => ({ val, consumed: false, color: "cyan" }));
  const list2Nodes = arr2.map(val => ({ val, consumed: false, color: "magenta" }));
  const array: number[] = [];

  const pushFrame = (phase: string, msg: React.ReactNode, rawMsg: string) => {
    frames.push({
      mode: "unoptimized",
      phase,
      list1Nodes: JSON.parse(JSON.stringify(list1Nodes)),
      list2Nodes: JSON.parse(JSON.stringify(list2Nodes)),
      array: [...array],
      mergedNodes: [],
      mergedList: [],
      t1Idx: null,
      t2Idx: null,
      tailIdx: 0,
      message: msg,
      rawMessageForAI: rawMsg
    });
  };

  pushFrame(
    "Initialization",
    <Text>We initialize an empty array to collect all values from both Linked Lists.</Text>,
    "Initialized empty array."
  );

  // Collect List 1
  for (let i = 0; i < list1Nodes.length; i++) {
    list1Nodes[i].consumed = true;
    array.push(list1Nodes[i].val);
    pushFrame(
      "Collecting List 1",
      <Text>Iterating through List 1 and pushing values to the array: <Text color="cyan">{list1Nodes[i].val}</Text></Text>,
      `Pushed ${list1Nodes[i].val} from List 1 to array.`
    );
  }

  // Collect List 2
  for (let i = 0; i < list2Nodes.length; i++) {
    list2Nodes[i].consumed = true;
    array.push(list2Nodes[i].val);
    pushFrame(
      "Collecting List 2",
      <Text>Iterating through List 2 and pushing values to the array: <Text color="magenta">{list2Nodes[i].val}</Text></Text>,
      `Pushed ${list2Nodes[i].val} from List 2 to array.`
    );
  }

  // Sorting
  pushFrame(
    "Sorting Array",
    <Text>Now we sort the entire array using <Text color="yellow">array.sort((a,b) {`=>`} a-b)</Text>. This takes O(N log N) time.</Text>,
    "Sorting array."
  );
  
  array.sort((a, b) => a - b);
  
  pushFrame(
    "Sorting Array",
    <Text>Array is now sorted!</Text>,
    "Array is sorted."
  );

  // Reconstruction
  const mergedNodes: number[] = [];
  for (let i = 0; i < array.length; i++) {
    mergedNodes.push(array[i]);
    
    frames.push({
      mode: "unoptimized",
      phase: "Reconstructing Linked List",
      list1Nodes: JSON.parse(JSON.stringify(list1Nodes)),
      list2Nodes: JSON.parse(JSON.stringify(list2Nodes)),
      array: [...array],
      mergedNodes: [...mergedNodes],
      mergedList: [],
      t1Idx: null,
      t2Idx: null,
      tailIdx: 0,
      message: <Text>Creating completely new ListNode instances for each element in the array to form the final Merged List.</Text>,
      rawMessageForAI: `Created new node with value ${array[i]} for merged list.`
    });
  }

  pushFrame(
    "Done (Unoptimized)",
    <Box flexDirection="column">
      <Text backgroundColor="green" color="black"> FINISHED O(N log N) </Text>
      <Text>This works, but uses O(N) extra space and is slower than necessary because both input lists were already sorted!</Text>
      <Text>{'\n'}Press <Text color="yellow">[M]</Text> to switch to the OPTIMIZED approach.</Text>
    </Box>,
    "Unoptimized approach finished."
  );

  return frames;
}

function generateOptimizedFrames(arr1: number[], arr2: number[]): Frame[] {
  const frames: Frame[] = [];
  const list1Nodes = arr1.map(val => ({ val, consumed: false, color: "cyan" }));
  const list2Nodes = arr2.map(val => ({ val, consumed: false, color: "magenta" }));
  const mergedList: { val: number; color: string }[] = [{ val: -1, color: "gray" }]; // Dummy node

  let t1 = arr1.length > 0 ? 0 : null;
  let t2 = arr2.length > 0 ? 0 : null;
  let tail = 0; // index in mergedList

  const pushFrame = (phase: string, msg: React.ReactNode, rawMsg: string) => {
    frames.push({
      mode: "optimized",
      phase,
      list1Nodes: JSON.parse(JSON.stringify(list1Nodes)),
      list2Nodes: JSON.parse(JSON.stringify(list2Nodes)),
      array: [],
      mergedNodes: [],
      mergedList: JSON.parse(JSON.stringify(mergedList)),
      t1Idx: t1,
      t2Idx: t2,
      tailIdx: tail,
      message: msg,
      rawMessageForAI: rawMsg
    });
  };

  pushFrame(
    "Initialization",
    <Box flexDirection="column">
      <Text>1. We create a <Text color="yellow">dummy node</Text> (val: -1) to simplify edge cases.</Text>
      <Text>2. <Text color="green">tail</Text> points to dummy. This will track the end of our merged list.</Text>
      <Text>3. <Text color="cyan">t1</Text> and <Text color="magenta">t2</Text> point to the heads of List 1 and List 2.</Text>
    </Box>,
    "Initialized dummy node, tail pointer, and t1/t2 pointers."
  );

  while (t1 !== null && t2 !== null) {
    const val1 = list1Nodes[t1].val;
    const val2 = list2Nodes[t2].val;
    
    pushFrame(
      "Comparing values",
      <Box flexDirection="column">
        <Text>Comparing <Text color="cyan">t1 ({val1})</Text> and <Text color="magenta">t2 ({val2})</Text>...</Text>
      </Box>,
      `Comparing t1.val=${val1} and t2.val=${val2}.`
    );

    if (val1 <= val2) {
      mergedList.push({ val: val1, color: "cyan" });
      list1Nodes[t1].consumed = true;
      pushFrame(
        "Linking Node",
        <Box flexDirection="column">
          <Text><Text color="cyan">{val1}</Text> {'<='} <Text color="magenta">{val2}</Text>. So we link <Text color="green">tail.next</Text> to <Text color="cyan">t1</Text>.</Text>
          <Text>We physically re-wire the existing node instead of creating a new one!</Text>
        </Box>,
        `t1 <= t2. Linking tail to t1.`
      );
      t1 = t1 + 1 < list1Nodes.length ? t1 + 1 : null;
    } else {
      mergedList.push({ val: val2, color: "magenta" });
      list2Nodes[t2].consumed = true;
      pushFrame(
        "Linking Node",
        <Box flexDirection="column">
          <Text><Text color="cyan">{val1}</Text> {'>'} <Text color="magenta">{val2}</Text>. So we link <Text color="green">tail.next</Text> to <Text color="magenta">t2</Text>.</Text>
          <Text>We physically re-wire the existing node instead of creating a new one!</Text>
        </Box>,
        `t1 > t2. Linking tail to t2.`
      );
      t2 = t2 + 1 < list2Nodes.length ? t2 + 1 : null;
    }
    
    tail++;
    pushFrame(
      "Advancing Pointers",
      <Box flexDirection="column">
        <Text>We advance the chosen list pointer, and move <Text color="green">tail</Text> forward to point to the newly added node.</Text>
      </Box>,
      "Advanced chosen pointer and tail."
    );
  }

  // Leftovers
  if (t1 !== null) {
    pushFrame(
      "Handling Leftovers",
      <Box flexDirection="column">
        <Text>List 2 is fully consumed, but List 1 still has elements left.</Text>
        <Text>Because List 1 is already sorted, we can just attach the entire remaining List 1 to <Text color="green">tail.next</Text> in O(1) time!</Text>
      </Box>,
      "List 2 is empty, appending remainder of List 1."
    );
    while (t1 < list1Nodes.length) {
      mergedList.push({ val: list1Nodes[t1].val, color: "cyan" });
      list1Nodes[t1].consumed = true;
      t1++;
      tail++;
    }
    t1 = null;
    pushFrame(
      "Handling Leftovers",
      <Text>Attached remaining elements from List 1.</Text>,
      "Attached List 1 leftovers."
    );
  } else if (t2 !== null) {
    pushFrame(
      "Handling Leftovers",
      <Box flexDirection="column">
        <Text>List 1 is fully consumed, but List 2 still has elements left.</Text>
        <Text>Because List 2 is already sorted, we can just attach the entire remaining List 2 to <Text color="green">tail.next</Text> in O(1) time!</Text>
      </Box>,
      "List 1 is empty, appending remainder of List 2."
    );
    while (t2 < list2Nodes.length) {
      mergedList.push({ val: list2Nodes[t2].val, color: "magenta" });
      list2Nodes[t2].consumed = true;
      t2++;
      tail++;
    }
    t2 = null;
    pushFrame(
      "Handling Leftovers",
      <Text>Attached remaining elements from List 2.</Text>,
      "Attached List 2 leftovers."
    );
  }

  pushFrame(
    "Done (Optimized)",
    <Box flexDirection="column">
      <Text backgroundColor="green" color="black"> FINISHED O(N) Time, O(1) Space </Text>
      <Text>We successfully merged the lists using their existing nodes! We return <Text color="yellow">dummy.next</Text> as the head of the new list.</Text>
      <Text>{'\n'}Press <Text color="yellow">[M]</Text> to switch to the UNOPTIMIZED approach.</Text>
    </Box>,
    "Optimized approach finished."
  );

  return frames;
}

const VisualizerApp: React.FC<{ arr1: number[], arr2: number[] }> = ({ arr1, arr2 }) => {
  const [mode, setMode] = useState<Mode>("unoptimized");
  const [unoptimizedFrames] = useState(() => generateUnoptimizedFrames(arr1, arr2));
  const [optimizedFrames] = useState(() => generateOptimizedFrames(arr1, arr2));
  
  const [uIdx, setUIdx] = useState(0);
  const [oIdx, setOIdx] = useState(0);
  
  const [isAIVisible, setIsAIVisible] = useState(false);
  const { exit } = useApp();

  const frames = mode === "unoptimized" ? unoptimizedFrames : optimizedFrames;
  const currentFrameIdx = mode === "unoptimized" ? uIdx : oIdx;
  const setCurrentFrameIdx = mode === "unoptimized" ? setUIdx : setOIdx;

  useInput((input, key) => {
    if (isAIVisible) {
      if (key.escape) setIsAIVisible(false);
      return;
    }

    if (input === "q" || key.escape || (key.ctrl && input === "c")) {
      exit();
    } else if (input === "a" || input === "?") {
      setIsAIVisible(true);
    } else if (input === "m" || input === "M") {
      setMode(mode === "unoptimized" ? "optimized" : "unoptimized");
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

  const renderLinkedList = (nodes: {val: number, consumed?: boolean, color: string}[], pointerIdx: number | null, pointerName: string) => {
    return (
      <Box flexDirection="row" alignItems="flex-start" minHeight={4}>
        {nodes.map((node, i) => (
          <React.Fragment key={i}>
            <Box flexDirection="column" alignItems="center">
              <Box borderStyle="round" borderColor={node.consumed ? "gray" : node.color} paddingX={1}>
                <Text color={node.color} dimColor={node.consumed}>{node.val}</Text>
              </Box>
              {pointerIdx === i && <Text color="yellow">↑ {pointerName}</Text>}
            </Box>
            {i < nodes.length - 1 && (
              <Box marginTop={1} paddingX={1}>
                <Text color={node.consumed && nodes[i+1].consumed ? "gray" : "white"}>-&gt;</Text>
              </Box>
            )}
          </React.Fragment>
        ))}
      </Box>
    );
  };

  return (
    <Box flexDirection="row" width="100%" height="100%">
      {/* Main Visualizer */}
      <Box flexDirection="column" flexGrow={1} borderStyle="single" padding={1} width={isAIVisible ? "60%" : "100%"}>
        
        {/* Header */}
        <Box justifyContent="space-between" marginBottom={1}>
          <Text bold color="yellow">=== Merge Two Sorted Lists ===</Text>
          <Text bold color={mode === "unoptimized" ? "red" : "green"}>
            Mode: {mode.toUpperCase()} (Press 'M' to switch)
          </Text>
        </Box>

        <Box justifyContent="center" marginBottom={1}>
          <Text bold>{frame.phase}</Text>
        </Box>

        <Box flexDirection="column" height={20}>
          
          <Box flexDirection="column" marginBottom={1} borderStyle="single" padding={1}>
             <Text bold>List 1</Text>
             {frame.list1Nodes.length === 0 ? <Text color="gray">empty</Text> : renderLinkedList(frame.list1Nodes, mode === "optimized" ? frame.t1Idx : null, "t1")}
          </Box>
          
          <Box flexDirection="column" marginBottom={1} borderStyle="single" padding={1}>
             <Text bold>List 2</Text>
             {frame.list2Nodes.length === 0 ? <Text color="gray">empty</Text> : renderLinkedList(frame.list2Nodes, mode === "optimized" ? frame.t2Idx : null, "t2")}
          </Box>

          {mode === "unoptimized" ? (
             <Box flexDirection="column" borderStyle="single" padding={1} borderColor="red">
                <Text bold>Extra Space (O(N))</Text>
                <Box flexDirection="row" marginBottom={1}>
                  <Text>Array: [ </Text>
                  <Text color="white">{frame.array.join(", ")}</Text>
                  <Text> ]</Text>
                </Box>
                <Text bold>Merged List (New Nodes)</Text>
                {frame.mergedNodes.length === 0 ? <Text color="gray">empty</Text> : renderLinkedList(frame.mergedNodes.map(v => ({val: v, color: "white"})), null, "")}
             </Box>
          ) : (
             <Box flexDirection="column" borderStyle="single" padding={1} borderColor="green">
                <Text bold>Merged List (In-Place Pointers)</Text>
                {frame.mergedList.length === 0 ? <Text color="gray">empty</Text> : renderLinkedList(frame.mergedList, frame.tailIdx, "tail")}
             </Box>
          )}

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
            context={JSON.stringify({
              Mode: mode,
              Phase: frame.phase,
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
let arr1: number[];
let arr2: number[];

switch (testCase) {
  case 1:
    arr1 = [1, 2, 4];
    arr2 = [1, 3, 4];
    break;
  case 2:
    arr1 = [];
    arr2 = [];
    break;
  case 3:
    arr1 = [];
    arr2 = [0];
    break;
  case 4:
    arr1 = [5, 6, 7];
    arr2 = [1, 2, 3];
    break;
  default:
    arr1 = [1, 2, 4];
    arr2 = [1, 3, 4];
    break;
}

render(<VisualizerApp arr1={arr1} arr2={arr2} />);
