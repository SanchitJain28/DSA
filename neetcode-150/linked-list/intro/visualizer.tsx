import React, { useState } from "react";
import { render, Box, Text, useInput, useApp } from "ink";
import { getTestCaseNumber } from "../../../utils/cli.js";
import { AIAssistant } from "../../../utils/aiHelper.js";

interface ListNodeInfo {
  val: number | string;
  isHead?: boolean;
  isNew?: boolean;
  isDeleted?: boolean;
}

interface Frame {
  phase: string;
  nodes: ListNodeInfo[];
  currPointerIdx: number;
  message: React.ReactNode;
  rawMessageForAI: string;
}

function generateIntroSequence(): Frame[] {
  const frames: Frame[] = [];

  // Step 1: Array vs Linked List Concept
  frames.push({
    phase: "1. The Concept: Array vs Linked List",
    nodes: [],
    currPointerIdx: -1,
    message: (
      <Box flexDirection="column">
        <Text bold color="yellow">
          === Welcome to Linked Lists! ===
        </Text>
        <Text>
          Arrays store elements in <Text color="cyan">contiguous memory</Text>{" "}
          (side-by-side). This makes accessing elements fast (O(1)), but
          inserting or deleting elements in the middle is slow (O(N)) because
          you have to shift everything.
        </Text>
        <Text>
          {"\n"}A{" "}
          <Text bold color="magenta">
            Linked List
          </Text>{" "}
          is different. Elements (called "Nodes") are scattered randomly in
          memory. They stay connected because each Node contains a{" "}
          <Text color="yellow">pointer</Text> to the exact memory address of the
          next Node!
        </Text>
        <Text>
          {"\n"}Press <Text color="yellow">[Right Arrow]</Text> to create your
          first Node.
        </Text>
      </Box>
    ),
    rawMessageForAI:
      "Introduction to Linked Lists versus Arrays. Explaining contiguous memory vs scattered nodes connected by pointers.",
  });

  // Step 2: Creating a single Node
  frames.push({
    phase: "2. The Anatomy of a Node",
    nodes: [{ val: 10, isHead: true, isNew: true }],
    currPointerIdx: 0,
    message: (
      <Box flexDirection="column">
        <Text>
          Here is a single <Text color="cyan">Node</Text>. It has two parts:
        </Text>
        <Text>
          1. <Text bold>Data (val)</Text>: The actual value we want to store
          (e.g., 10).
        </Text>
        <Text>
          2. <Text bold>Next Pointer (next)</Text>: A reference to the next
          node. Right now, it points to <Text color="gray">null</Text> because
          it's the only node.
        </Text>
        <Text>
          {"\n"}Because this is the first node in our list, we call it the{" "}
          <Text bold color="cyan">
            HEAD
          </Text>
          .
        </Text>
      </Box>
    ),
    rawMessageForAI:
      "Created the first node (Head) with value 10 and next pointing to null.",
  });

  // Step 3: Appending a Node
  frames.push({
    phase: "3. Growing the List",
    nodes: [
      { val: 10, isHead: true },
      { val: 20, isNew: true },
    ],
    currPointerIdx: -1,
    message: (
      <Box flexDirection="column">
        <Text>
          We want to add a new Node with value 20. We don't need to find
          contiguous space!
        </Text>
        <Text>
          We simply create the new node anywhere in memory, and tell the Head
          node's <Text color="yellow">next</Text> pointer to point to it.
        </Text>
        <Text>
          {"\n"}The new node now points to <Text color="gray">null</Text>,
          marking the end of the list (the <Text bold>TAIL</Text>).
        </Text>
      </Box>
    ),
    rawMessageForAI:
      "Appended a second node with value 20. The first node's next pointer now points to the second node.",
  });

  frames.push({
    phase: "3. Growing the List",
    nodes: [{ val: 10, isHead: true }, { val: 20 }, { val: 30, isNew: true }],
    currPointerIdx: -1,
    message: (
      <Box flexDirection="column">
        <Text>Let's add one more node with value 30.</Text>
        <Text>
          Notice how the chain grows? We can keep adding nodes indefinitely
          without ever having to "resize" an array.
        </Text>
      </Box>
    ),
    rawMessageForAI: "Appended a third node with value 30.",
  });

  // Step 4: Traversal
  frames.push({
    phase: "4. Traversal (Visiting Nodes)",
    nodes: [{ val: 10, isHead: true }, { val: 20 }, { val: 30 }],
    currPointerIdx: 0,
    message: (
      <Box flexDirection="column">
        <Text>
          Because nodes aren't indexed like arrays, we can't just say{" "}
          <Text color="gray">list[2]</Text>.
        </Text>
        <Text>
          To read the 3rd node, we MUST start at the{" "}
          <Text bold color="cyan">
            HEAD
          </Text>{" "}
          and follow the pointers one by one.
        </Text>
        <Text>
          {"\n"}We create a temporary pointer called{" "}
          <Text color="yellow">curr</Text> (current) and point it to the HEAD.
        </Text>
      </Box>
    ),
    rawMessageForAI:
      "Starting traversal. A temporary pointer 'curr' is pointing at the Head node (value 10).",
  });

  frames.push({
    phase: "4. Traversal (Visiting Nodes)",
    nodes: [{ val: 10, isHead: true }, { val: 20 }, { val: 30 }],
    currPointerIdx: 1,
    message: (
      <Box flexDirection="column">
        <Text>
          We execute: <Text color="magenta">curr = curr.next</Text>
        </Text>
        <Text>
          The <Text color="yellow">curr</Text> pointer follows the arrow to the
          second node (20).
        </Text>
      </Box>
    ),
    rawMessageForAI:
      "Traversing to the second node using curr = curr.next. Curr is now at value 20.",
  });

  frames.push({
    phase: "4. Traversal (Visiting Nodes)",
    nodes: [{ val: 10, isHead: true }, { val: 20 }, { val: 30 }],
    currPointerIdx: 2,
    message: (
      <Box flexDirection="column">
        <Text>
          We execute: <Text color="magenta">curr = curr.next</Text> again.
        </Text>
        <Text>
          The <Text color="yellow">curr</Text> pointer is now at the third node
          (30).
        </Text>
        <Text>
          If we do <Text color="magenta">curr = curr.next</Text> one more time,{" "}
          <Text color="yellow">curr</Text> will become{" "}
          <Text color="gray">null</Text>, and our loop will end!
        </Text>
      </Box>
    ),
    rawMessageForAI:
      "Traversing to the third node. Curr is now at value 30. One more next will hit null.",
  });

  // Step 5: Fast Insertion
  frames.push({
    phase: "5. Fast Insertion (O(1))",
    nodes: [
      { val: 10, isHead: true },
      { val: 15, isNew: true },
      { val: 20 },
      { val: 30 },
    ],
    currPointerIdx: 1,
    message: (
      <Box flexDirection="column">
        <Text>
          What if we want to insert <Text color="green">15</Text> between 10 and
          20?
        </Text>
        <Text>
          In an array, we'd have to shift 20 and 30 to the right. In a Linked
          List, we just re-wire the pointers!
        </Text>
        <Text>{"\n"}1. Create node 15.</Text>
        <Text>2. Point 15's next to 20.</Text>
        <Text>3. Point 10's next to 15.</Text>
        <Text>
          <Text color="green">Done in O(1) time!</Text> (Assuming we already had
          a pointer there).
        </Text>
      </Box>
    ),
    rawMessageForAI:
      "Inserted a new node with value 15 between 10 and 20. Explained that insertion is O(1) by rewiring pointers.",
  });

  // Step 6: Fast Deletion
  frames.push({
    phase: "6. Fast Deletion (O(1))",
    nodes: [
      { val: 10, isHead: true },
      { val: 15, isDeleted: true },
      { val: 20 },
      { val: 30 },
    ],
    currPointerIdx: -1,
    message: (
      <Box flexDirection="column">
        <Text>
          Similarly, to delete the node <Text color="red">15</Text>, we just
          bypass it.
        </Text>
        <Text>We change 10's next pointer to point directly to 20.</Text>
        <Text>
          Node 15 is now detached from the list and will be automatically
          cleaned up by the Garbage Collector!
        </Text>
      </Box>
    ),
    rawMessageForAI:
      "Deleted node 15 by bypassing it and pointing 10 directly to 20. Explained garbage collection.",
  });

  frames.push({
    phase: "Finished!",
    nodes: [{ val: 10, isHead: true }, { val: 20 }, { val: 30 }],
    currPointerIdx: -1,
    message: (
      <Box flexDirection="column">
        <Text backgroundColor="green" color="black">
          {" "}
          CONGRATULATIONS!{" "}
        </Text>
        <Text>You now understand the core concepts of Linked Lists!</Text>
        <Text>
          {"\n"}In interview problems, you'll be given the{" "}
          <Text bold color="cyan">
            HEAD
          </Text>{" "}
          node and asked to manipulate pointers to reverse the list, find
          cycles, or merge lists.
        </Text>
        <Text>
          {"\n"}Press <Text color="yellow">[q]</Text> to exit and start
          practicing!
        </Text>
      </Box>
    ),
    rawMessageForAI: "Finished introduction to linked lists.",
  });

  return frames;
}

const VisualizerApp: React.FC = () => {
  const [frames] = useState(() => generateIntroSequence());
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
  const { nodes, currPointerIdx, phase, message } = frame;

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
        <Box justifyContent="center" marginBottom={2}>
          <Text bold color="magenta">
            {phase}
          </Text>
        </Box>

        {/* Linked List Graphical Area */}
        <Box
          height={10}
          flexDirection="column"
          justifyContent="center"
          alignItems="center"
        >
          {nodes.length === 0 ? (
            <Text color="gray">(No Nodes in Memory)</Text>
          ) : (
            <>
              {/* Nodes Row */}
              <Box flexDirection="row" alignItems="center">
                {nodes.map((node, i) => {
                  const isLast = i === nodes.length - 1;
                  const boxColor = node.isDeleted
                    ? "red"
                    : node.isNew
                      ? "green"
                      : "cyan";
                  return (
                    <React.Fragment key={i}>
                      {/* The Node Box */}
                      <Box
                        borderStyle="round"
                        borderColor={boxColor}
                        paddingX={1}
                      >
                        <Text color={boxColor} dimColor={node.isDeleted}>
                          {node.val}
                        </Text>
                      </Box>

                      {/* The Pointer Arrow */}
                      <Box paddingX={1}>
                        {isLast ? (
                          <Text color="gray">{"-> null"}</Text>
                        ) : node.isDeleted ? (
                          <Text color="red">{"-x"}</Text> // Broken link
                        ) : (
                          <Text color="yellow">{"->"}</Text>
                        )}
                      </Box>
                    </React.Fragment>
                  );
                })}
              </Box>

              {/* Labels Row (HEAD and CURR pointers) */}
              <Box flexDirection="row" marginTop={1}>
                {nodes.map((node, i) => {
                  // We must align the labels strictly under the node boxes.
                  // A node box is approx 6 chars wide + padding. We'll use fixed widths.
                  return (
                    <Box
                      width={9}
                      marginLeft={i === 0 ? 0 : 2}
                      key={`label-${i}`}
                      flexDirection="column"
                      alignItems="center"
                    >
                      {node.isHead && <Text color="cyan">HEAD</Text>}
                      {currPointerIdx === i && (
                        <Text color="yellow">↑ curr</Text>
                      )}
                    </Box>
                  );
                })}
              </Box>
            </>
          )}
        </Box>

        {/* Logs Area */}
        <Box
          flexGrow={1}
          borderStyle="single"
          padding={1}
          flexDirection="column"
        >
          <Box justifyContent="center" marginBottom={1}>
            <Text bold>Explanation</Text>
          </Box>
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
                LinkedListState: nodes,
                CurrentPointerIndex: currPointerIdx,
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

// Start App
render(<VisualizerApp />);
