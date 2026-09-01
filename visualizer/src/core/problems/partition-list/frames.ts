import { FrameBuilder } from "../../shared/FrameBuilder";
import type { Scene } from "../../shared/types";
import { type LayoutNode, type LayoutEdge } from "../../structures/linked-list/types";

export function generateFrames(data: {
  values: number[];
  x: number;
}): Scene[] {
  const { values, x } = data;
  const builder = new FrameBuilder<Scene>();

  if (values.length === 0) {
    builder.pushFrame({
      phase: "Empty List",
      codeLine: 2,
      explanation: "The linked list is empty. Returning null.",
      structures: {
        linkedList: {
          nodes: [{ id: "null_0", val: "null", x: 100, y: 70, isNull: true }],
          edges: [],
          pointers: {},
        },
      },
      variables: {
        x,
        "curr.val": "N/A",
      },
    });
    return builder.getFrames();
  }

  if (values.length === 1) {
    builder.pushFrame({
      phase: "Single Node",
      codeLine: 2,
      explanation: `The list has only 1 node (${values[0]}). No partitioning needed. Returning head.`,
      structures: {
        linkedList: {
          nodes: [
            { id: "node-0", val: values[0], x: 100, y: 70 },
            { id: "null_0", val: "null", x: 210, y: 70, isNull: true },
          ],
          edges: [
            {
              id: "edge-0-null",
              x1: 124,
              y1: 70,
              x2: 190,
              y2: 70,
              isNull: true,
            },
          ],
          pointers: { head: "node-0", curr: "node-0" },
        },
      },
      variables: {
        x,
        "curr.val": values[0],
        "curr.val < x": String(values[0] < x),
      },
    });
    return builder.getFrames();
  }

  const n = values.length;
  const X_SPACING = 110;
  const X_START = 80;
  const Y_ORIG = 50;
  const Y_LESS = 160;
  const Y_MORE = 270;
  const Y_FINAL = 160;

  const lessIndices: number[] = [];
  const moreIndices: number[] = [];

  const computePartitionLayout = (
    mode: "initial" | "processing" | "joined" | "final",
    currIdx: number | null,
    _t1Idx: number | "dummy" = "dummy",
    _t2Idx: number | "dummy" = "dummy",
    severMoreTail: boolean = false,
    joinPartitions: boolean = false,
  ): { nodes: LayoutNode[]; edges: LayoutEdge[] } => {
    const nodes: LayoutNode[] = [];
    const edges: LayoutEdge[] = [];

    const NODE_RADIUS = 24;
    const ARROW_OFFSET = 28;

    if (mode === "initial") {
      for (let i = 0; i < n; i++) {
        nodes.push({
          id: `node-${i}`,
          val: values[i],
          x: X_START + i * X_SPACING,
          y: Y_ORIG,
        });
        if (i < n - 1) {
          edges.push({
            id: `edge-${i}-${i + 1}`,
            x1: X_START + i * X_SPACING + NODE_RADIUS,
            y1: Y_ORIG,
            x2: X_START + (i + 1) * X_SPACING - ARROW_OFFSET,
            y2: Y_ORIG,
          });
        }
      }
      nodes.push({
        id: `null-orig`,
        val: "null",
        x: X_START + n * X_SPACING,
        y: Y_ORIG,
        isNull: true,
      });
      edges.push({
        id: `edge-${n - 1}-null`,
        x1: X_START + (n - 1) * X_SPACING + NODE_RADIUS,
        y1: Y_ORIG,
        x2: X_START + n * X_SPACING - 20,
        y2: Y_ORIG,
        isNull: true,
      });
      return { nodes, edges };
    }

    if (mode === "final" || (mode === "joined" && joinPartitions)) {
      const combinedIndices = [...lessIndices, ...moreIndices];
      nodes.push({
        id: "dummy-less",
        val: -1,
        x: X_START,
        y: Y_FINAL,
        isDummy: true,
      });

      for (let i = 0; i < combinedIndices.length; i++) {
        const origIdx = combinedIndices[i];
        const nodeX = X_START + (i + 1) * X_SPACING;
        nodes.push({
          id: `node-${origIdx}`,
          val: values[origIdx],
          x: nodeX,
          y: Y_FINAL,
        });

        const prevX = i === 0 ? X_START : X_START + i * X_SPACING;
        edges.push({
          id: `edge-final-${i}`,
          x1: prevX + NODE_RADIUS,
          y1: Y_FINAL,
          x2: nodeX - ARROW_OFFSET,
          y2: Y_FINAL,
        });
      }

      const lastX = X_START + (combinedIndices.length + 1) * X_SPACING;
      nodes.push({
        id: `null-final`,
        val: "null",
        x: lastX,
        y: Y_FINAL,
        isNull: true,
      });
      edges.push({
        id: `edge-final-null`,
        x1: X_START + combinedIndices.length * X_SPACING + NODE_RADIUS,
        y1: Y_FINAL,
        x2: lastX - 20,
        y2: Y_FINAL,
        isNull: true,
      });

      return { nodes, edges };
    }

    // 1. Less partition row
    nodes.push({
      id: "dummy-less",
      val: -1,
      x: X_START,
      y: Y_LESS,
      isDummy: true,
    });

    let prevLessX = X_START;
    for (let i = 0; i < lessIndices.length; i++) {
      const origIdx = lessIndices[i];
      const nodeX = X_START + (i + 1) * X_SPACING;
      nodes.push({
        id: `node-${origIdx}`,
        val: values[origIdx],
        x: nodeX,
        y: Y_LESS,
      });
      edges.push({
        id: `edge-less-${i}`,
        x1: prevLessX + NODE_RADIUS,
        y1: Y_LESS,
        x2: nodeX - ARROW_OFFSET,
        y2: Y_LESS,
      });
      prevLessX = nodeX;
    }

    // 2. More partition row
    nodes.push({
      id: "dummy-more",
      val: -1,
      x: X_START,
      y: Y_MORE,
      isDummy: true,
    });

    let prevMoreX = X_START;
    for (let i = 0; i < moreIndices.length; i++) {
      const origIdx = moreIndices[i];
      const nodeX = X_START + (i + 1) * X_SPACING;
      nodes.push({
        id: `node-${origIdx}`,
        val: values[origIdx],
        x: nodeX,
        y: Y_MORE,
      });
      edges.push({
        id: `edge-more-${i}`,
        x1: prevMoreX + NODE_RADIUS,
        y1: Y_MORE,
        x2: nodeX - ARROW_OFFSET,
        y2: Y_MORE,
      });
      prevMoreX = nodeX;
    }

    // 3. Remaining in input list
    if (currIdx !== null && currIdx < n) {
      for (let i = currIdx; i < n; i++) {
        const nodeX = X_START + i * X_SPACING;
        nodes.push({
          id: `node-${i}`,
          val: values[i],
          x: nodeX,
          y: Y_ORIG,
        });
        if (i < n - 1) {
          edges.push({
            id: `edge-orig-${i}-${i + 1}`,
            x1: nodeX + NODE_RADIUS,
            y1: Y_ORIG,
            x2: X_START + (i + 1) * X_SPACING - ARROW_OFFSET,
            y2: Y_ORIG,
          });
        }
      }
      nodes.push({
        id: `null-orig`,
        val: "null",
        x: X_START + n * X_SPACING,
        y: Y_ORIG,
        isNull: true,
      });
      edges.push({
        id: `edge-orig-${n - 1}-null`,
        x1: X_START + (n - 1) * X_SPACING + NODE_RADIUS,
        y1: Y_ORIG,
        x2: X_START + n * X_SPACING - 20,
        y2: Y_ORIG,
        isNull: true,
      });
    }

    if (joinPartitions) {
      const moreFirstX =
        moreIndices.length > 0 ? X_START + 1 * X_SPACING : X_START;
      edges.push({
        id: "edge-join-less-more",
        x1: prevLessX + NODE_RADIUS,
        y1: Y_LESS,
        x2: moreFirstX - ARROW_OFFSET,
        y2: Y_MORE,
      });
    } else {
      const nullLessX = prevLessX + X_SPACING;
      nodes.push({
        id: `null-less`,
        val: "null",
        x: nullLessX,
        y: Y_LESS,
        isNull: true,
      });
      edges.push({
        id: `edge-less-null`,
        x1: prevLessX + NODE_RADIUS,
        y1: Y_LESS,
        x2: nullLessX - 20,
        y2: Y_LESS,
        isNull: true,
      });
    }

    if (severMoreTail || moreIndices.length > 0) {
      const nullMoreX = prevMoreX + X_SPACING;
      nodes.push({
        id: `null-more`,
        val: "null",
        x: nullMoreX,
        y: Y_MORE,
        isNull: true,
      });
      edges.push({
        id: `edge-more-null`,
        x1: prevMoreX + NODE_RADIUS,
        y1: Y_MORE,
        x2: nullMoreX - 20,
        y2: Y_MORE,
        isNull: true,
      });
    }

    return { nodes, edges };
  };

  const getT1Val = (t1: number | "dummy") =>
    t1 === "dummy" ? "dummyLess (-1)" : `Node(${values[t1]})`;
  const getT2Val = (t2: number | "dummy") =>
    t2 === "dummy" ? "dummyMore (-1)" : `Node(${values[t2]})`;

  // Step 1: Initial Frame
  builder.pushFrame({
    phase: "Initial List",
    codeLine: 1,
    explanation: `Given linked list [${values.join(", ")}] and partition value x = ${x}. Partition so all nodes < ${x} appear before nodes >= ${x}.`,
    structures: {
      linkedList: {
        ...computePartitionLayout("initial", 0, "dummy", "dummy"),
        pointers: { head: "node-0", curr: "node-0" },
      },
    },
    variables: {
      x,
      "curr.val": values[0],
      "curr.val < x": String(values[0] < x),
      "t1.val": "N/A",
      "t2.val": "N/A",
    },
  });

  // Step 2: Create Dummies
  builder.pushFrame({
    phase: "Create Dummy Anchors",
    codeLine: 3,
    explanation: `Create dummyLess (-1) and dummyMore (-1) to anchor the '< ${x}' and '>= ${x}' partition chains.`,
    structures: {
      linkedList: {
        ...computePartitionLayout("processing", 0, "dummy", "dummy"),
        pointers: {
          head: "node-0",
          dummyLess: "dummy-less",
          dummyMore: "dummy-more",
        },
      },
    },
    variables: {
      x,
      "curr.val": values[0],
      "curr.val < x": String(values[0] < x),
      "t1.val": "dummyLess (-1)",
      "t2.val": "dummyMore (-1)",
    },
  });

  let t1: number | "dummy" = "dummy";
  let t2: number | "dummy" = "dummy";

  builder.pushFrame({
    phase: "Setup Pointers",
    codeLine: 5,
    explanation: `Initialize t1 at dummyLess and t2 at dummyMore. Initialize curr = head (Node ${values[0]}).`,
    structures: {
      linkedList: {
        ...computePartitionLayout("processing", 0, t1, t2),
        pointers: {
          curr: "node-0",
          t1: "dummy-less",
          t2: "dummy-more",
        },
      },
    },
    variables: {
      x,
      "curr.val": values[0],
      "curr.val < x": String(values[0] < x),
      "t1.val": getT1Val(t1),
      "t2.val": getT2Val(t2),
    },
  });

  for (let i = 0; i < n; i++) {
    const val = values[i];
    const isLess = val < x;

    builder.pushFrame({
      phase: isLess ? "Evaluate (< x)" : "Evaluate (>= x)",
      codeLine: 9,
      explanation: isLess
        ? `Node ${val} < ${x}: this node belongs to the '< ${x}' partition.`
        : `Node ${val} >= ${x}: this node belongs to the '>= ${x}' partition.`,
      structures: {
        linkedList: {
          ...computePartitionLayout("processing", i, t1, t2),
          pointers: {
            curr: `node-${i}`,
            t1: t1 === "dummy" ? "dummy-less" : `node-${t1}`,
            t2: t2 === "dummy" ? "dummy-more" : `node-${t2}`,
          },
          activeNodeId: `node-${i}`,
        },
      },
      variables: {
        x,
        "curr.val": val,
        "curr.val < x": String(isLess),
        "t1.val": getT1Val(t1),
        "t2.val": getT2Val(t2),
      },
    });

    if (isLess) {
      lessIndices.push(i);
      builder.pushFrame({
        phase: "Append to Less List",
        codeLine: 10,
        explanation: `Link t1.next = Node(${val}) to extend the '< ${x}' partition.`,
        structures: {
          linkedList: {
            ...computePartitionLayout("processing", i + 1, t1, t2),
            pointers: {
              curr: `node-${i}`,
              t1: t1 === "dummy" ? "dummy-less" : `node-${t1}`,
              t2: t2 === "dummy" ? "dummy-more" : `node-${t2}`,
            },
            activeNodeId: `node-${i}`,
          },
        },
        variables: {
          x,
          "curr.val": val,
          "curr.val < x": "true",
          "t1.val": getT1Val(t1),
          "t2.val": getT2Val(t2),
        },
      });

      t1 = i;
      builder.pushFrame({
        phase: "Advance t1 Pointer",
        codeLine: 11,
        explanation: `Advance tail pointer t1 to Node(${val}).`,
        structures: {
          linkedList: {
            ...computePartitionLayout("processing", i + 1, t1, t2),
            pointers: {
              curr: `node-${i}`,
              t1: `node-${t1}`,
              t2: t2 === "dummy" ? "dummy-more" : `node-${t2}`,
            },
            activeNodeId: `node-${i}`,
          },
        },
        variables: {
          x,
          "curr.val": val,
          "curr.val < x": "true",
          "t1.val": getT1Val(t1),
          "t2.val": getT2Val(t2),
        },
      });
    } else {
      moreIndices.push(i);
      builder.pushFrame({
        phase: "Append to More List",
        codeLine: 13,
        explanation: `Link t2.next = Node(${val}) to extend the '>= ${x}' partition.`,
        structures: {
          linkedList: {
            ...computePartitionLayout("processing", i + 1, t1, t2),
            pointers: {
              curr: `node-${i}`,
              t1: t1 === "dummy" ? "dummy-less" : `node-${t1}`,
              t2: t2 === "dummy" ? "dummy-more" : `node-${t2}`,
            },
            activeNodeId: `node-${i}`,
          },
        },
        variables: {
          x,
          "curr.val": val,
          "curr.val < x": "false",
          "t1.val": getT1Val(t1),
          "t2.val": getT2Val(t2),
        },
      });

      t2 = i;
      builder.pushFrame({
        phase: "Advance t2 Pointer",
        codeLine: 14,
        explanation: `Advance tail pointer t2 to Node(${val}).`,
        structures: {
          linkedList: {
            ...computePartitionLayout("processing", i + 1, t1, t2),
            pointers: {
              curr: `node-${i}`,
              t1: t1 === "dummy" ? "dummy-less" : `node-${t1}`,
              t2: `node-${t2}`,
            },
            activeNodeId: `node-${i}`,
          },
        },
        variables: {
          x,
          "curr.val": val,
          "curr.val < x": "false",
          "t1.val": getT1Val(t1),
          "t2.val": getT2Val(t2),
        },
      });
    }

    const nextIdx = i + 1;
    const nextNodeStr = nextIdx < n ? `Node(${values[nextIdx]})` : "null";
    builder.pushFrame({
      phase: "Advance curr Pointer",
      codeLine: 16,
      explanation: `Advance curr to ${nextNodeStr}.`,
      structures: {
        linkedList: {
          ...computePartitionLayout("processing", nextIdx, t1, t2),
          pointers: {
            curr: nextIdx < n ? `node-${nextIdx}` : "null-orig",
            t1: t1 === "dummy" ? "dummy-less" : `node-${t1}`,
            t2: t2 === "dummy" ? "dummy-more" : `node-${t2}`,
          },
        },
      },
      variables: {
        x,
        "curr.val": nextIdx < n ? values[nextIdx] : "null",
        "curr.val < x": nextIdx < n ? String(values[nextIdx] < x) : "N/A",
        "t1.val": getT1Val(t1),
        "t2.val": getT2Val(t2),
      },
    });
  }

  // Sever More Tail
  builder.pushFrame({
    phase: "Sever More Tail",
    codeLine: 18,
    explanation: "Set t2.next = null to terminate the '>= x' partition.",
    structures: {
      linkedList: {
        ...computePartitionLayout("processing", n, t1, t2, true),
        pointers: {
          t1: t1 === "dummy" ? "dummy-less" : `node-${t1}`,
          t2: t2 === "dummy" ? "dummy-more" : `node-${t2}`,
        },
      },
    },
    variables: {
      x,
      "curr.val": "null",
      "curr.val < x": "N/A",
      "t1.val": getT1Val(t1),
      "t2.val": getT2Val(t2),
    },
  });

  // Connect Partitions
  builder.pushFrame({
    phase: "Connect Partitions",
    codeLine: 19,
    explanation: "Link t1.next = dummyMore.next to attach '>= x' partition onto the end of '< x' partition.",
    structures: {
      linkedList: {
        ...computePartitionLayout("processing", n, t1, t2, true, true),
        pointers: {
          t1: t1 === "dummy" ? "dummy-less" : `node-${t1}`,
          dummyMore: "dummy-more",
        },
      },
    },
    variables: {
      x,
      "curr.val": "null",
      "curr.val < x": "N/A",
      "t1.val": getT1Val(t1),
      "t2.val": getT2Val(t2),
    },
  });

  const finalResultValues = [...lessIndices, ...moreIndices].map(
    (idx) => values[idx],
  );

  builder.pushFrame({
    phase: "Finished",
    codeLine: 20,
    explanation: `Partitioning complete. Returning dummyLess.next: [${finalResultValues.join(", ")}].`,
    structures: {
      linkedList: {
        ...computePartitionLayout("final", n, t1, t2, true, true),
        pointers: {
          head: lessIndices.length > 0 ? `node-${lessIndices[0]}` : "null-final",
        },
      },
    },
    variables: {
      x,
      result: `[${finalResultValues.join(", ")}]`,
    },
  });

  return builder.getFrames();
}

export default generateFrames;
