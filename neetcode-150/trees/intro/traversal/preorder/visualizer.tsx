import React, { useState } from "react";
import { render, Box, Text, useInput, useApp } from "ink";
import { getTestCaseNumber } from "../../../../../utils/cli.js";
import { AIAssistant } from "../../../../../utils/aiHelper.js";

// Basic TreeNode for our visualizer logic
class TreeNode {
  val: number;
  left: TreeNode | null;
  right: TreeNode | null;
  id: string;

  constructor(val: number, id: string, left?: TreeNode | null, right?: TreeNode | null) {
    this.val = val;
    this.id = id;
    this.left = left === undefined ? null : left;
    this.right = right === undefined ? null : right;
  }
}

interface Frame {
  result: number[];
  callStack: string[];
  activeNodeId: string | null;
  phase: string;
  message: React.ReactNode;
  rawMessageForAI: string;
  codeLine: number;
}

function buildTree1() {
  //       1
  //      / \
  //     2   3
  //    / \   \
  //   4   5   6
  const n4 = new TreeNode(4, "n4");
  const n5 = new TreeNode(5, "n5");
  const n6 = new TreeNode(6, "n6");
  const n2 = new TreeNode(2, "n2", n4, n5);
  const n3 = new TreeNode(3, "n3", null, n6);
  const n1 = new TreeNode(1, "n1", n2, n3);
  return n1;
}

function buildTree2() {
  //   1
  //    \
  //     2
  //    /
  //   3
  const n3 = new TreeNode(3, "n3");
  const n2 = new TreeNode(2, "n2", n3, null);
  const n1 = new TreeNode(1, "n1", null, n2);
  return n1;
}

function buildTree3() {
  return new TreeNode(1, "n1");
}

function generateFrames(root: TreeNode | null): Frame[] {
  const frames: Frame[] = [];
  const result: number[] = [];
  const callStack: string[] = [];

  const pushFrame = (
    activeNodeId: string | null,
    phase: string,
    codeLine: number,
    msg: React.ReactNode,
    rawMsg: string
  ) => {
    frames.push({
      result: [...result],
      callStack: [...callStack],
      activeNodeId,
      phase,
      codeLine,
      message: msg,
      rawMessageForAI: rawMsg,
    });
  };

  pushFrame(
    null,
    "Initialization",
    0,
    <Box flexDirection="column">
      <Text>We initialize an empty <Text bold color="green">result array</Text> to hold the values.</Text>
      <Text>Then we call <Text bold color="cyan">dfs(root)</Text> to start the Preorder Traversal.</Text>
      <Text>Preorder means we process: <Text bold color="yellow">Node -{">"} Left -{">"} Right</Text>.</Text>
    </Box>,
    "Initialized empty result array and called dfs(root)."
  );

  function dfs(node: TreeNode | null, parentId: string | null, side: string) {
    if (!node) {
      callStack.push("null");
      pushFrame(
        parentId,
        "Base Case (null)",
        8,
        <Box flexDirection="column">
          <Text>We tried to go to the <Text bold>{side}</Text> of node <Text color="magenta">{parentId}</Text>, but it is <Text color="gray">null</Text>.</Text>
          <Text>This is our base case! We simply <Text color="yellow">return</Text> and pop the call stack.</Text>
        </Box>,
        `Reached null node from ${parentId}'s ${side}. Returning.`
      );
      callStack.pop();
      return;
    }

    callStack.push(node.val.toString());
    const id = node.id;

    // 1. Process Node
    pushFrame(
      id,
      "Step 1: Process Node",
      9,
      <Box flexDirection="column">
        <Text>We entered <Text bold color="cyan">dfs(node {node.val})</Text>.</Text>
        <Text>In <Text bold color="yellow">Preorder</Text>, the very first thing we do is process the node itself!</Text>
      </Box>,
      `Entered dfs for node ${node.val}.`
    );

    result.push(node.val);
    pushFrame(
      id,
      "Step 1: Process Node",
      10,
      <Box flexDirection="column">
        <Text>We pushed <Text bold color="green">{node.val}</Text> to our result array.</Text>
        <Text>Result: [{result.join(", ")}]</Text>
      </Box>,
      `Pushed ${node.val} to result array.`
    );

    // 2. Recurse Left
    pushFrame(
      id,
      "Step 2: Recurse Left",
      11,
      <Box flexDirection="column">
        <Text>Now we must recursively call <Text bold color="magenta">dfs(node.left)</Text>.</Text>
        <Text>We pause execution of node {node.val} and travel down its left subtree.</Text>
      </Box>,
      `Calling dfs on left child of node ${node.val}.`
    );
    dfs(node.left, id, "left");

    // 3. Recurse Right
    pushFrame(
      id,
      "Step 3: Recurse Right",
      12,
      <Box flexDirection="column">
        <Text>We finished the entire left subtree of node {node.val}!</Text>
        <Text>Now we must recursively call <Text bold color="magenta">dfs(node.right)</Text>.</Text>
        <Text>We pause execution of node {node.val} again and travel down its right subtree.</Text>
      </Box>,
      `Left subtree of ${node.val} done. Calling dfs on right child.`
    );
    dfs(node.right, id, "right");

    // 4. Return
    pushFrame(
      id,
      "Step 4: Return",
      13,
      <Box flexDirection="column">
        <Text>We have processed the node, its left subtree, and its right subtree.</Text>
        <Text>The <Text bold color="cyan">dfs({node.val})</Text> call is completely finished!</Text>
        <Text>We <Text color="yellow">return</Text> up the call stack to the parent.</Text>
      </Box>,
      `Finished dfs for node ${node.val}. Returning to parent.`
    );
    callStack.pop();
  }

  if (root) {
    dfs(root, null, "root");
  }

  pushFrame(
    null,
    "Finished",
    15,
    <Box flexDirection="column">
      <Text backgroundColor="green" color="black" bold> FINISHED! </Text>
      <Text>The call stack is completely empty.</Text>
      <Text>Our final Preorder traversal result is: <Text bold color="green">[{result.join(", ")}]</Text>.</Text>
    </Box>,
    `Traversal complete. Final result: [${result.join(", ")}].`
  );

  return frames;
}

// Helpers for Top-Down Tree Grid Layout
const getDepth = (node: TreeNode | null): number => {
  if (!node) return 0;
  return 1 + Math.max(getDepth(node.left), getDepth(node.right));
};

const buildGrid = (root: TreeNode | null) => {
  if (!root) return [];
  const depth = getDepth(root);
  const rows = depth * 2 - 1;
  const cols = Math.pow(2, depth) * 4; 
  const grid: { char: string, id?: string, val?: number }[][] = Array.from({ length: rows }, () => 
    Array.from({ length: cols }, () => ({ char: " " }))
  );

  const fill = (node: TreeNode, r: number, c: number, offset: number) => {
    grid[r][c] = { char: node.val.toString(), id: node.id, val: node.val };
    if (node.left) {
      grid[r + 1][c - Math.floor(offset / 2)] = { char: "/" };
      fill(node.left, r + 2, c - offset, Math.floor(offset / 2));
    }
    if (node.right) {
      grid[r + 1][c + Math.floor(offset / 2)] = { char: "\\" };
      fill(node.right, r + 2, c + offset, Math.floor(offset / 2));
    }
  };

  const initialOffset = Math.pow(2, depth - 1) * 2;
  const startC = Math.floor(cols / 2);
  fill(root, 0, startC, initialOffset);
  return grid;
};

const VisualizerApp: React.FC<{ root: TreeNode | null }> = ({ root }) => {
  const [frames] = useState(() => generateFrames(root));
  const [grid] = useState(() => buildGrid(root));
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
  const { result, callStack, activeNodeId, phase, message, codeLine } = frame;

  return (
    <Box flexDirection="row" width="100%" height="100%">
      {/* Main Visualizer */}
      <Box flexDirection="column" flexGrow={1} borderStyle="single" padding={1} width={isAIVisible ? "60%" : "100%"}>
        
        {/* Header */}
        <Box justifyContent="center" marginBottom={1}>
          <Text bold color="yellow">=== Preorder Traversal (DFS) ===</Text>
        </Box>
        <Box justifyContent="center" marginBottom={1}>
          <Text bold color="cyan">{phase}</Text>
        </Box>

        {/* Tree & Stack Row */}
        <Box flexDirection="row" width="100%" marginBottom={1}>
          
          {/* Top-Down Binary Tree View */}
          <Box flexDirection="column" flexGrow={1} borderStyle="single" borderColor="gray" marginX={1} padding={1} alignItems="center">
            <Box justifyContent="center" marginBottom={1}><Text bold>Binary Tree</Text></Box>
            <Box flexDirection="column" marginTop={1}>
               {grid.map((row, rIdx) => (
                 <Box key={rIdx} flexDirection="row">
                   {row.map((cell, cIdx) => {
                      let bgColor = undefined;
                      let textColor = "gray";

                      if (cell.id) {
                         const isActive = cell.id === activeNodeId;
                         const isVisited = result.includes(cell.val!);
                         if (isActive) {
                           bgColor = "white";
                           textColor = "black";
                         } else if (isVisited) {
                           bgColor = "green";
                           textColor = "black";
                         } else {
                           textColor = "white";
                         }
                      }

                      return (
                        <Text key={cIdx} backgroundColor={bgColor} color={textColor} bold={cell.id !== undefined}>
                           {cell.char}
                        </Text>
                      );
                   })}
                 </Box>
               ))}
            </Box>
          </Box>

          {/* Call Stack View */}
          <Box flexDirection="column" width={25} borderStyle="single" borderColor="gray" marginX={1} padding={1}>
            <Box justifyContent="center" marginBottom={1}><Text bold>Call Stack</Text></Box>
            <Box flexDirection="column-reverse" minHeight={8} justifyContent="flex-start">
               {callStack.map((val, i) => (
                 <Box key={i} borderStyle="round" borderColor="magenta" paddingX={1} marginBottom={i===0 ? 0 : 1}>
                   <Text color="white">dfs(node: {val})</Text>
                 </Box>
               ))}
               {callStack.length === 0 && <Text color="gray">Stack Empty</Text>}
            </Box>
          </Box>
        </Box>

        {/* Code & Result Row */}
        <Box flexDirection="row" width="100%" marginBottom={1}>
          {/* Code Highlight */}
          <Box flexDirection="column" flexGrow={1} borderStyle="single" borderColor="gray" marginX={1} padding={1}>
            <Text color={codeLine === 8 ? "yellow" : "gray"}> 8: if (!node) return;</Text>
            <Text color={codeLine === 10 ? "yellow" : "gray"}>10: <Text bold={codeLine === 10}>result.push(node.val);</Text></Text>
            <Text color={codeLine === 11 ? "yellow" : "gray"}>11: <Text bold={codeLine === 11}>dfs(node.left);</Text></Text>
            <Text color={codeLine === 12 ? "yellow" : "gray"}>12: <Text bold={codeLine === 12}>dfs(node.right);</Text></Text>
            <Text color={codeLine === 13 ? "yellow" : "gray"}>13: {'}'}</Text>
          </Box>

          {/* Result Array */}
          <Box flexDirection="column" width={35} borderStyle="single" borderColor="gray" marginX={1} padding={1}>
            <Box justifyContent="center" marginBottom={1}><Text bold>Result Array</Text></Box>
            <Box flexDirection="row" flexWrap="wrap">
              <Text bold color="green">[{result.join(", ")}]</Text>
            </Box>
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
                ActiveNode: activeNodeId,
                Result: result,
                CallStack: callStack,
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
let root: TreeNode | null;

switch (testCase) {
  case 1:
    root = buildTree1();
    break;
  case 2:
    root = buildTree2();
    break;
  case 3:
    root = buildTree3();
    break;
  case 4:
    root = null;
    break;
  default:
    root = buildTree1();
    break;
}

render(<VisualizerApp root={root} />);
