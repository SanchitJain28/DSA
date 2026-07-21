import React, { useState } from "react";
import { render, Box, Text, useInput, useApp } from "ink";
import { getTestCaseNumber } from "../../../utils/cli.js";
import { AIAssistant } from "../../../utils/aiHelper.js";

type Op = 
  | { type: "set"; key: string; value: string; timestamp: number }
  | { type: "get"; key: string; timestamp: number };

interface TimeMapValue {
  value: string;
  timestamp: number;
}

interface Frame {
  timeMapState: Record<string, TimeMapValue[]>;
  currentOp: Op;
  isBinarySearch: boolean;
  searchArray: TimeMapValue[];
  left: number;
  right: number;
  mid: number;
  answer: number;
  phase: string;
  message: React.ReactNode;
  rawMessageForAI: string;
}

function generateFrames(operations: Op[]): Frame[] {
  const frames: Frame[] = [];
  const mapState: Record<string, TimeMapValue[]> = {};

  for (const op of operations) {
    // Clone map state so mutations don't affect previous frames
    const clonedMapState = JSON.parse(JSON.stringify(mapState));

    if (op.type === "set") {
      if (!clonedMapState[op.key]) {
        clonedMapState[op.key] = [];
      }
      clonedMapState[op.key].push({ value: op.value, timestamp: op.timestamp });
      
      // Update global map state
      mapState[op.key] = clonedMapState[op.key];

      frames.push({
        timeMapState: clonedMapState,
        currentOp: op,
        isBinarySearch: false,
        searchArray: [],
        left: -1, right: -1, mid: -1, answer: -1,
        phase: `Operation: SET`,
        message: (
          <Box flexDirection="column">
            <Text>Executing <Text color="magenta">set("{op.key}", "{op.value}", {op.timestamp})</Text></Text>
            <Text>Appended <Text color="yellow">{"{"} value: "{op.value}", timestamp: {op.timestamp} {"}"}</Text> to the list for key "{op.key}".</Text>
          </Box>
        ),
        rawMessageForAI: `Executing SET operation. Added value "${op.value}" at timestamp ${op.timestamp} to key "${op.key}".`
      });

    } else if (op.type === "get") {
      const values = clonedMapState[op.key] || [];
      
      frames.push({
        timeMapState: clonedMapState,
        currentOp: op,
        isBinarySearch: true,
        searchArray: values,
        left: -1, right: -1, mid: -1, answer: -1,
        phase: `Operation: GET`,
        message: (
          <Box flexDirection="column">
            <Text>Executing <Text color="cyan">get("{op.key}", {op.timestamp})</Text></Text>
            <Text>Target timestamp: <Text color="cyan">{op.timestamp}</Text></Text>
            {values.length === 0 ? (
               <Text>Key "{op.key}" does not exist. Returning empty string "".</Text>
            ) : (
               <Text>Array length is {values.length}. Initializing Binary Search...</Text>
            )}
          </Box>
        ),
        rawMessageForAI: `Executing GET operation for key "${op.key}" at target timestamp ${op.timestamp}. Array length is ${values.length}.`
      });

      if (values.length === 0) continue;

      let left = 0;
      let right = values.length - 1;
      let answer = -1;

      while (left <= right) {
        let mid = Math.floor((left + right) / 2);
        
        frames.push({
          timeMapState: clonedMapState,
          currentOp: op,
          isBinarySearch: true,
          searchArray: values,
          left, right, mid, answer,
          phase: `Operation: GET (Binary Search)`,
          message: (
            <Box flexDirection="column">
              <Text>Mid Index: {mid}</Text>
              <Text>Comparing values[mid].timestamp (<Text color="yellow">{values[mid].timestamp}</Text>) with target timestamp (<Text color="cyan">{op.timestamp}</Text>)...</Text>
            </Box>
          ),
          rawMessageForAI: `GET Binary Search: Mid index is ${mid}, timestamp is ${values[mid].timestamp}. Comparing with target ${op.timestamp}.`
        });

        if (values[mid].timestamp <= op.timestamp) {
          answer = mid;
          frames.push({
            timeMapState: clonedMapState,
            currentOp: op,
            isBinarySearch: true,
            searchArray: values,
            left, right, mid, answer,
            phase: `Operation: GET (Binary Search)`,
            message: (
              <Box flexDirection="column">
                <Text>values[mid].timestamp ({values[mid].timestamp}) <Text color="green">{'<='}</Text> Target ({op.timestamp})</Text>
                <Text>This is a valid candidate! We record <Text color="green">answer = {answer}</Text> (value: "{values[answer].value}").</Text>
                <Text>We must check if there's a closer timestamp to the right. Moving Left to {mid + 1}.</Text>
              </Box>
            ),
            rawMessageForAI: `values[mid].timestamp <= target. Valid candidate found. answer = ${answer}. Moving left to ${mid + 1}.`
          });
          left = mid + 1;
        } else {
          frames.push({
            timeMapState: clonedMapState,
            currentOp: op,
            isBinarySearch: true,
            searchArray: values,
            left, right, mid, answer,
            phase: `Operation: GET (Binary Search)`,
            message: (
              <Box flexDirection="column">
                <Text>values[mid].timestamp ({values[mid].timestamp}) <Text color="red">{'>'}</Text> Target ({op.timestamp})</Text>
                <Text>This timestamp is too far in the future. It is invalid.</Text>
                <Text>We must search to the left. Moving Right to {mid - 1}.</Text>
              </Box>
            ),
            rawMessageForAI: `values[mid].timestamp > target. Invalid candidate. Moving right to ${mid - 1}.`
          });
          right = mid - 1;
        }
      }

      frames.push({
        timeMapState: clonedMapState,
        currentOp: op,
        isBinarySearch: true,
        searchArray: values,
        left, right, mid: -1, answer,
        phase: `Operation: GET (Result)`,
        message: (
          <Box flexDirection="column">
             <Text backgroundColor="green" color="black"> SEARCH FINISHED! </Text>
             {answer === -1 ? (
                <Text>No valid timestamp found (&lt;= {op.timestamp}). Returning <Text bold>""</Text>.</Text>
             ) : (
                <Text>Best valid candidate is at index <Text color="cyan">{answer}</Text>. Returning value <Text bold>"{values[answer].value}"</Text>.</Text>
             )}
          </Box>
        ),
        rawMessageForAI: `GET Finished. Answer index is ${answer}. Result value is ${answer === -1 ? '""' : values[answer].value}.`
      });
    }
  }

  frames.push({
    timeMapState: mapState,
    currentOp: { type: "get", key: "", timestamp: 0 },
    isBinarySearch: false,
    searchArray: [],
    left: -1, right: -1, mid: -1, answer: -1,
    phase: "FINISHED",
    message: (
      <Box flexDirection="column">
        <Text backgroundColor="green" color="black"> ALL OPERATIONS COMPLETED! </Text>
        <Text>Press <Text color="yellow">[q]</Text> to exit.</Text>
      </Box>
    ),
    rawMessageForAI: "All operations completed successfully."
  });

  return frames;
}

const VisualizerApp: React.FC<{ operations: Op[] }> = ({ operations }) => {
  const [frames] = useState(() => generateFrames(operations));
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
  const { timeMapState, currentOp, isBinarySearch, searchArray, left, right, mid, answer, phase } = frame;

  return (
    <Box flexDirection="row" width="100%" height="100%">
      {/* Main Visualizer */}
      <Box flexDirection="column" flexGrow={1} borderStyle="single" padding={1} width={isAIVisible ? "60%" : "100%"}>
        
        {/* Header */}
        <Box justifyContent="center" marginBottom={1}>
          <Text bold color="yellow">=== Time Based Key-Value Store ===</Text>
        </Box>
        
        <Box justifyContent="center" marginBottom={1}>
          <Text bold color="cyan">{phase}</Text>
        </Box>

        {/* Global Map State */}
        <Box flexDirection="column" borderStyle="single" marginBottom={1}>
          <Box justifyContent="center" paddingBottom={1}><Text bold>Global TimeMap State</Text></Box>
          {Object.keys(timeMapState).length === 0 ? (
             <Box paddingLeft={2}><Text color="gray">(Empty)</Text></Box>
          ) : (
             Object.entries(timeMapState).map(([key, arr]) => (
                <Box key={key} flexDirection="row" paddingLeft={2}>
                   <Box width={10}><Text color="cyan">{key}</Text></Box>
                   <Text>: [ </Text>
                   {arr.map((item, idx) => (
                      <Text key={idx} color={
                          // Highlight if this is the target of current binary search and it's the answer
                          isBinarySearch && currentOp.key === key && idx === answer ? "green" : "white"
                      }>
                        {"{"}"{item.value}", t:{item.timestamp}{"}"}{idx < arr.length - 1 ? ", " : ""}
                      </Text>
                   ))}
                   <Text> ]</Text>
                </Box>
             ))
          )}
        </Box>

        {/* Binary Search Sub-Visualizer */}
        {isBinarySearch && searchArray.length > 0 && (
           <Box flexDirection="column" borderStyle="single" marginBottom={1}>
              <Box justifyContent="center" paddingBottom={1}><Text bold>Binary Search on Key "{currentOp.key}"</Text></Box>
              
              {/* Values */}
              <Box flexDirection="row" paddingLeft={2}>
                <Box width={8}><Text color="gray">Values:</Text></Box>
                {searchArray.map((item, i) => {
                  const isExcluded = (left !== -1 && right !== -1) && (i < left || i > right);
                  const color = isExcluded ? "gray" : i === mid ? "black" : i === answer ? "green" : "white";
                  const bg = i === mid ? "yellow" : undefined;
                  return (
                    <Box width={15} key={`val-${i}`}>
                      <Text color={color} backgroundColor={bg}>{"{"}{item.value}{"}"}</Text>
                    </Box>
                  );
                })}
              </Box>

              {/* Timestamps */}
              <Box flexDirection="row" paddingLeft={2}>
                <Box width={8}><Text color="gray">Time:</Text></Box>
                {searchArray.map((item, i) => {
                  const isExcluded = (left !== -1 && right !== -1) && (i < left || i > right);
                  const color = isExcluded ? "gray" : i === mid ? "black" : i === answer ? "green" : "cyan";
                  const bg = i === mid ? "yellow" : undefined;
                  return (
                    <Box width={15} key={`ts-${i}`}>
                      <Text color={color} backgroundColor={bg}>t:{item.timestamp}</Text>
                    </Box>
                  );
                })}
              </Box>

              {/* Indices */}
              <Box flexDirection="row" paddingLeft={2}>
                <Box width={8}><Text color="gray">Idx:</Text></Box>
                {searchArray.map((_, i) => {
                  return (
                    <Box width={15} key={`idx-${i}`}>
                      <Text color={i === mid ? "yellow" : "gray"}>[{i}]</Text>
                    </Box>
                  );
                })}
              </Box>

              {/* Pointers Row */}
              <Box flexDirection="row" paddingLeft={2} marginTop={1}>
                <Box width={8}><Text> </Text></Box>
                {searchArray.map((_, i) => {
                  let ptrNodes: React.ReactNode[] = [];
                  if (i === mid) {
                    if (i === left && i === right) ptrNodes = [<Text color="cyan" key="L">L</Text>, <Text color="yellow" key="M">M</Text>, <Text color="blue" key="R">R</Text>];
                    else if (i === left) ptrNodes = [<Text color="cyan" key="L">L</Text>, <Text key="1">/</Text>, <Text color="yellow" key="M">M</Text>];
                    else if (i === right) ptrNodes = [<Text color="yellow" key="M">M</Text>, <Text key="1">/</Text>, <Text color="blue" key="R">R</Text>];
                    else ptrNodes = [<Text color="yellow" key="M">  M  </Text>];
                  } else if (i === left && i === right) {
                    ptrNodes = [<Text color="cyan" key="L">L</Text>, <Text key="1">/</Text>, <Text color="blue" key="R">R</Text>];
                  } else if (i === left) {
                    ptrNodes = [<Text color="cyan" key="L">  L  </Text>];
                  } else if (i === right) {
                    ptrNodes = [<Text color="blue" key="R">  R  </Text>];
                  }
                  
                  if (i === answer && i !== mid) {
                     ptrNodes.push(<Text color="green" key="A"> (Ans)</Text>);
                  } else if (i === answer && i === mid) {
                     ptrNodes.push(<Text color="green" key="A">(Ans)</Text>);
                  }
                  
                  return <Box width={15} key={`ptr-${i}`}>{ptrNodes.length > 0 ? ptrNodes : <Text> </Text>}</Box>;
                })}
              </Box>
           </Box>
        )}

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
              GlobalMap: timeMapState,
              CurrentOperation: currentOp,
              BinarySearchState: {
                 IsActive: isBinarySearch,
                 SearchArray: searchArray,
                 Left: left,
                 Right: right,
                 Mid: mid,
                 AnswerCandidate: answer
              },
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
let operations: Op[];

switch (testCase) {
  case 1:
    operations = [
      { type: "set", key: "alice", value: "happy", timestamp: 1 },
      { type: "get", key: "alice", timestamp: 1 },
      { type: "get", key: "alice", timestamp: 2 },
      { type: "set", key: "alice", value: "sad", timestamp: 3 },
      { type: "get", key: "alice", timestamp: 3 },
    ];
    break;
  case 2:
    operations = [
      { type: "set", key: "foo", value: "bar", timestamp: 10 },
      { type: "set", key: "foo", value: "bar2", timestamp: 20 },
      { type: "get", key: "foo", timestamp: 5 },  // Before any timestamp
      { type: "get", key: "foo", timestamp: 15 }, // Between 10 and 20
      { type: "get", key: "foo", timestamp: 25 }, // After 20
    ];
    break;
  case 3:
    operations = [
      { type: "set", key: "x", value: "1", timestamp: 5 },
      { type: "set", key: "y", value: "2", timestamp: 10 },
      { type: "set", key: "x", value: "3", timestamp: 15 },
      { type: "get", key: "x", timestamp: 10 },
      { type: "get", key: "y", timestamp: 20 },
      { type: "get", key: "z", timestamp: 10 }, // Key doesn't exist
    ];
    break;
  default:
    operations = [
      { type: "set", key: "alice", value: "happy", timestamp: 1 },
      { type: "get", key: "alice", timestamp: 1 },
      { type: "get", key: "alice", timestamp: 2 },
      { type: "set", key: "alice", value: "sad", timestamp: 3 },
      { type: "get", key: "alice", timestamp: 3 },
    ];
    break;
}

render(<VisualizerApp operations={operations} />);
