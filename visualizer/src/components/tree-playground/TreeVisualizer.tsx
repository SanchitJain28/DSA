import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Play,
  RotateCcw,
  Sparkles,
  Pause,
  TreePine,
  Zap,
  CheckCircle2,
  Brush,
  Network,
} from "lucide-react";
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  Handle,
  Position,
  BackgroundVariant,
  MarkerType,
  type Node,
  type Edge,
  type NodeProps,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import {
  Tldraw,
  Editor,
  createShapeId,
  toRichText,
  type TLShapePartial,
} from "tldraw";
import "tldraw/tldraw.css";
import { TreeNode } from "../../core/structures/tree/TreeNode";

interface ParsedNode {
  id: string;
  val: number;
  x: number;
  y: number;
  depth: number;
  parentId?: string;
  isLeft?: boolean;
}

interface TreeEdge {
  id: string;
  fromId: string;
  toId: string;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

interface BuildStep {
  type: "root" | "edge" | "node" | "null" | "complete";
  node?: ParsedNode;
  edge?: TreeEdge;
  parentId?: string;
  activeId?: string;
  targetId?: string;
  message: string;
  queue: string[];
}

interface TreeNodeData extends Record<string, unknown> {
  label: number;
  status: "default" | "active" | "target" | "success";
  badge?: string;
}

type CustomTreeNode = Node<TreeNodeData, "treeNode">;

function TreeNodeComponent({ data }: NodeProps<CustomTreeNode>) {
  const status = data.status || "default";

  let bg = "bg-slate-900 border-slate-700 text-slate-100";
  let ring = "shadow-lg shadow-black/40";
  if (status === "success") {
    bg = "bg-emerald-950/90 border-emerald-500 text-emerald-200";
    ring = "ring-2 ring-emerald-500/30 shadow-lg shadow-emerald-950/50";
  } else if (status === "active") {
    bg = "bg-sky-600 border-sky-300 text-white font-black";
    ring = "ring-4 ring-sky-400/40 shadow-xl shadow-sky-500/40";
  } else if (status === "target") {
    bg = "bg-amber-950/90 border-amber-400 text-amber-200 font-bold";
    ring = "ring-2 ring-amber-400/50 shadow-lg shadow-amber-950/50";
  }

  return (
    <div
      className={`relative w-12 h-12 rounded-full border-2 flex items-center justify-center font-mono font-bold text-base select-none transition-all duration-300 ${bg} ${ring}`}
    >
      <Handle
        type="target"
        position={Position.Top}
        className="w-2 h-2 !bg-sky-400 border-none opacity-0"
      />
      <span>{data.label}</span>
      {data.badge && (
        <span
          className={`absolute -top-6 px-1.5 py-0.5 rounded text-[10px] text-white font-sans font-semibold tracking-wider uppercase shadow ${
            data.badge === "Parent" ? "bg-amber-500" : "bg-sky-500"
          }`}
        >
          {data.badge}
        </span>
      )}
      <Handle
        type="source"
        position={Position.Bottom}
        className="w-2 h-2 !bg-sky-400 border-none opacity-0"
      />
    </div>
  );
}

function parseArrayInput(str: string): (number | null)[] {
  const cleaned = str.trim().replace(/^\[/, "").replace(/\]$/, "").trim();
  if (!cleaned) return [];
  return cleaned.split(",").map((token) => {
    const t = token.trim().toLowerCase();
    if (t === "null" || t === "none" || t === "nil" || t === "" || t === ".")
      return null;
    const num = Number(t);
    return isNaN(num) ? null : num;
  });
}

function buildTreeStructure(arr: (number | null)[]) {
  if (!arr.length || arr[0] === null) {
    return { nodes: [], edges: [], steps: [], depth: 0 };
  }

  const root = new TreeNode(arr[0], `node_0_${arr[0]}`);
  const queue: TreeNode[] = [root];
  let i = 1;

  while (i < arr.length && queue.length > 0) {
    const parent = queue.shift()!;

    if (i < arr.length) {
      const leftVal = arr[i];
      if (leftVal !== null) {
        parent.left = new TreeNode(leftVal, `node_${i}_${leftVal}`);
        queue.push(parent.left);
      }
      i++;
    }

    if (i < arr.length) {
      const rightVal = arr[i];
      if (rightVal !== null) {
        parent.right = new TreeNode(rightVal, `node_${i}_${rightVal}`);
        queue.push(parent.right);
      }
      i++;
    }
  }

  let maxDepth = 0;
  function getDepth(node: TreeNode | null, currentDepth: number) {
    if (!node) return;
    maxDepth = Math.max(maxDepth, currentDepth);
    getDepth(node.left, currentDepth + 1);
    getDepth(node.right, currentDepth + 1);
  }
  getDepth(root, 0);

  const initialOffset = Math.max(
    130,
    Math.min(240, 420 / Math.max(1, maxDepth)),
  );
  const allNodes: ParsedNode[] = [];
  const allEdges: TreeEdge[] = [];
  const nodeMap = new Map<string, ParsedNode>();

  function calculatePositions(
    node: TreeNode | null,
    x: number,
    y: number,
    offset: number,
    depth: number,
    parentId?: string,
    isLeft?: boolean,
  ) {
    if (!node) return;

    const parsedNode: ParsedNode = {
      id: node.id,
      val: node.val,
      x,
      y,
      depth,
      parentId,
      isLeft,
    };
    allNodes.push(parsedNode);
    nodeMap.set(node.id, parsedNode);

    const verticalGap = 85;
    const nextOffset = Math.max(34, offset * 0.52);

    if (node.left) {
      const childX = x - offset;
      const childY = y + verticalGap;
      allEdges.push({
        id: `edge-${node.id}-${node.left.id}`,
        fromId: node.id,
        toId: node.left.id,
        x1: x,
        y1: y,
        x2: childX,
        y2: childY,
      });
      calculatePositions(
        node.left,
        childX,
        childY,
        nextOffset,
        depth + 1,
        node.id,
        true,
      );
    }

    if (node.right) {
      const childX = x + offset;
      const childY = y + verticalGap;
      allEdges.push({
        id: `edge-${node.id}-${node.right.id}`,
        fromId: node.id,
        toId: node.right.id,
        x1: x,
        y1: y,
        x2: childX,
        y2: childY,
      });
      calculatePositions(
        node.right,
        childX,
        childY,
        nextOffset,
        depth + 1,
        node.id,
        false,
      );
    }
  }

  calculatePositions(root, 400, 60, initialOffset, 0);

  const steps: BuildStep[] = [];
  const buildQueue: TreeNode[] = [root];
  const queueStrings: string[] = [`Node(${root.val})`];

  const rootParsed = nodeMap.get(root.id)!;
  steps.push({
    type: "root",
    node: rootParsed,
    activeId: root.id,
    message: `🌱 Creating root node with value ${root.val}`,
    queue: [...queueStrings],
  });

  let arrIdx = 1;
  while (arrIdx < arr.length && buildQueue.length > 0) {
    const parent = buildQueue.shift()!;
    queueStrings.shift();

    // Left child
    if (arrIdx < arr.length) {
      const leftVal = arr[arrIdx];
      if (leftVal !== null && parent.left) {
        const leftParsed = nodeMap.get(parent.left.id)!;
        const edge = allEdges.find(
          (e) => e.fromId === parent.id && e.toId === parent.left!.id,
        )!;

        steps.push({
          type: "edge",
          edge,
          parentId: parent.id,
          targetId: parent.id,
          activeId: leftParsed.id,
          message: `🌿 Connecting left branch from parent ${parent.val} to child ${leftVal}...`,
          queue: [...queueStrings],
        });

        buildQueue.push(parent.left);
        queueStrings.push(`Node(${leftVal})`);

        steps.push({
          type: "node",
          node: leftParsed,
          parentId: parent.id,
          activeId: leftParsed.id,
          targetId: parent.id,
          message: `✨ Joined left child Node(${leftVal}) to parent Node(${parent.val})!`,
          queue: [...queueStrings],
        });
      } else {
        steps.push({
          type: "null",
          parentId: parent.id,
          targetId: parent.id,
          message: `⚪ Index ${arrIdx} is null. Parent ${parent.val} has no left child.`,
          queue: [...queueStrings],
        });
      }
      arrIdx++;
    }

    // Right child
    if (arrIdx < arr.length) {
      const rightVal = arr[arrIdx];
      if (rightVal !== null && parent.right) {
        const rightParsed = nodeMap.get(parent.right.id)!;
        const edge = allEdges.find(
          (e) => e.fromId === parent.id && e.toId === parent.right!.id,
        )!;

        steps.push({
          type: "edge",
          edge,
          parentId: parent.id,
          targetId: parent.id,
          activeId: rightParsed.id,
          message: `🌿 Connecting right branch from parent ${parent.val} to child ${rightVal}...`,
          queue: [...queueStrings],
        });

        buildQueue.push(parent.right);
        queueStrings.push(`Node(${rightVal})`);

        steps.push({
          type: "node",
          node: rightParsed,
          parentId: parent.id,
          activeId: rightParsed.id,
          targetId: parent.id,
          message: `✨ Joined right child Node(${rightVal}) to parent Node(${parent.val})!`,
          queue: [...queueStrings],
        });
      } else {
        steps.push({
          type: "null",
          parentId: parent.id,
          targetId: parent.id,
          message: `⚪ Index ${arrIdx} is null. Parent ${parent.val} has no right child.`,
          queue: [...queueStrings],
        });
      }
      arrIdx++;
    }
  }

  steps.push({
    type: "complete",
    message: `🎉 Binary tree construction complete! (${allNodes.length} nodes connected)`,
    queue: [],
  });

  return { nodes: allNodes, edges: allEdges, steps, depth: maxDepth + 1 };
}

const PRESETS = [
  { label: "[1, 2, 3, 4, 5]", value: "[1, 2, 3, 4, 5]" },
  {
    label: "[3, 9, 20, null, null, 15, 7]",
    value: "[3, 9, 20, null, null, 15, 7]",
  },
  {
    label: "[1, 2, 3, null, 5, null, 4]",
    value: "[1, 2, 3, null, 5, null, 4]",
  },
  { label: "[4, 2, 7, 1, 3, 6, 9]", value: "[4, 2, 7, 1, 3, 6, 9]" },
  {
    label: "[1, null, 2, null, 3, null, 4]",
    value: "[1, null, 2, null, 3, null, 4]",
  },
  {
    label: "[5, 3, 8, 1, 4, 7, 9, 0, 2]",
    value: "[5, 3, 8, 1, 4, 7, 9, 0, 2]",
  },
];

const SPEED_OPTIONS = [
  { label: "0.5x", ms: 700 },
  { label: "1x", ms: 380 },
  { label: "2x", ms: 180 },
  { label: "4x", ms: 80 },
];

export default function TreeVisualizer() {
  const [inputText, setInputText] = useState("[1, 2, 3, 4, 5]");
  const [activeArray, setActiveArray] = useState<(number | null)[]>([
    1, 2, 3, 4, 5,
  ]);
  const [speedIndex, setSpeedIndex] = useState(1); // 1x
  const [stepIdx, setStepIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [canvasMode, setCanvasMode] = useState<"xyflow" | "spring" | "tldraw">(
    "xyflow",
  );

  const speedMs = SPEED_OPTIONS[speedIndex].ms;
  const tldrawEditorRef = useRef<Editor | null>(null);

  const { nodes, edges, steps, depth } = useMemo(() => {
    return buildTreeStructure(activeArray);
  }, [activeArray]);

  const startBuild = (arr: (number | null)[]) => {
    setActiveArray(arr);
    setStepIdx(0);
    setIsPlaying(true);
  };

  const handleApply = () => {
    const parsed = parseArrayInput(inputText);
    if (parsed.length > 0) {
      startBuild(parsed);
    }
  };

  const handlePresetSelect = (presetVal: string) => {
    setInputText(presetVal);
    const parsed = parseArrayInput(presetVal);
    if (parsed.length > 0) {
      startBuild(parsed);
    }
  };

  const handleReplay = () => {
    setStepIdx(0);
    setIsPlaying(true);
  };

  // Timer loop for automatic build animation
  useEffect(() => {
    if (!isPlaying) return;

    if (stepIdx >= steps.length - 1) {
      setIsPlaying(false);
      return;
    }

    const timer = setTimeout(() => {
      setStepIdx((prev) => Math.min(prev + 1, steps.length - 1));
    }, speedMs);

    return () => clearTimeout(timer);
  }, [isPlaying, stepIdx, steps.length, speedMs]);

  // Synchronize state with tldraw infinite canvas
  useEffect(() => {
    const editor = tldrawEditorRef.current;
    if (!editor || canvasMode !== "tldraw") return;

    const existingShapes = editor.getCurrentPageShapeIds();
    if (existingShapes.size > 0) {
      editor.deleteShapes(Array.from(existingShapes));
    }

    if (!steps.length) return;

    const shapesToCreate: TLShapePartial[] = [];
    const nodeSet = new Set<string>();
    const edgeSet = new Set<string>();

    for (let i = 0; i <= stepIdx; i++) {
      const s = steps[i];
      if (s.node) nodeSet.add(s.node.id);
      if (s.edge) edgeSet.add(s.edge.id);
    }

    const currentStep = steps[stepIdx];
    const isComplete = stepIdx >= steps.length - 1;

    for (const node of nodes) {
      if (!nodeSet.has(node.id)) continue;

      const isActive = currentStep?.activeId === node.id;
      const isTarget = currentStep?.targetId === node.id && !isActive;

      let colorName: "black" | "blue" | "green" | "orange" | "violet" = "blue";
      if (isComplete) colorName = "green";
      else if (isActive) colorName = "blue";
      else if (isTarget) colorName = "orange";

      shapesToCreate.push({
        id: createShapeId(`node-${node.id}`),
        type: "geo",
        x: node.x - 28,
        y: node.y - 28,
        props: {
          geo: "ellipse",
          w: 56,
          h: 56,
          richText: toRichText(String(node.val)),
          color: colorName,
          fill: "semi",
          size: "m",
          font: "mono",
          align: "middle",
          verticalAlign: "middle",
        },
      });
    }

    for (const edge of edges) {
      if (!edgeSet.has(edge.id)) continue;

      shapesToCreate.push({
        id: createShapeId(`edge-${edge.id}`),
        type: "arrow",
        x: edge.x1,
        y: edge.y1,
        props: {
          start: { x: 0, y: 0 },
          end: { x: edge.x2 - edge.x1, y: edge.y2 - edge.y1 },
          color: isComplete ? "green" : "blue",
          size: "m",
          arrowheadEnd: "arrow",
        },
      });
    }

    if (shapesToCreate.length > 0) {
      editor.createShapes(shapesToCreate);
    }

    if (stepIdx === 0 || isComplete) {
      editor.zoomToFit({ animation: { duration: 400 } });
    }
  }, [stepIdx, steps, nodes, edges, canvasMode]);

  // Determine visible nodes & edges for SVG Spring Canvas & XYFlow
  const visibleState = useMemo(() => {
    if (!steps.length)
      return { visibleNodes: [], visibleEdges: [], currentStep: null };

    const currentStep = steps[stepIdx] || steps[0];
    const nodeSet = new Set<string>();
    const edgeSet = new Set<string>();

    for (let i = 0; i <= stepIdx; i++) {
      const s = steps[i];
      if (s.node) nodeSet.add(s.node.id);
      if (s.edge) edgeSet.add(s.edge.id);
    }

    const visibleNodes = nodes.filter((n) => nodeSet.has(n.id));
    const visibleEdges = edges.filter((e) => edgeSet.has(e.id));

    return { visibleNodes, visibleEdges, currentStep };
  }, [nodes, edges, steps, stepIdx]);

  const currentStep = visibleState.currentStep;
  const isComplete = stepIdx >= steps.length - 1;

  // React Flow (@xyflow/react) Node and Edge Mapping
  const nodeTypes = useMemo(() => ({ treeNode: TreeNodeComponent }), []);

  const flowNodes: CustomTreeNode[] = useMemo(() => {
    return visibleState.visibleNodes.map((n) => {
      const isActive = currentStep?.activeId === n.id;
      const isTarget = currentStep?.targetId === n.id && !isActive;

      let status: "default" | "active" | "target" | "success" = "default";
      if (isComplete) status = "success";
      else if (isActive) status = "active";
      else if (isTarget) status = "target";

      let badge = undefined;
      if (isActive && !isComplete) badge = "New";
      else if (isTarget && !isComplete) badge = "Parent";

      return {
        id: n.id,
        type: "treeNode",
        position: { x: n.x - 24, y: n.y - 24 },
        data: {
          label: n.val,
          status,
          badge,
        },
      };
    });
  }, [visibleState.visibleNodes, currentStep, isComplete]);

  const flowEdges: Edge[] = useMemo(() => {
    return visibleState.visibleEdges.map((e) => {
      const edgeColor = isComplete ? "#10b981" : "#38bdf8";
      return {
        id: e.id,
        source: e.fromId,
        target: e.toId,
        type: "straight",
        animated: false,
        style: {
          stroke: edgeColor,
          strokeWidth: 2.5,
          strokeLinecap: "round",
        },
        markerEnd: {
          type: MarkerType.ArrowClosed,
          color: edgeColor,
          width: 12,
          height: 12,
        },
      };
    });
  }, [visibleState.visibleEdges, isComplete]);

  // Bounding box calculations for SVG Spring Canvas auto-centering
  const bounds = useMemo(() => {
    if (!nodes.length)
      return {
        minX: 300,
        maxX: 500,
        minY: 30,
        maxY: 300,
        width: 400,
        height: 350,
        viewBox: "0 0 800 500",
      };

    let minX = Infinity;
    let maxX = -Infinity;
    let minY = Infinity;
    let maxY = -Infinity;

    for (const n of nodes) {
      minX = Math.min(minX, n.x - 45);
      maxX = Math.max(maxX, n.x + 45);
      minY = Math.min(minY, n.y - 35);
      maxY = Math.max(maxY, n.y + 55);
    }

    const width = Math.max(500, maxX - minX + 90);
    const height = Math.max(360, maxY - minY + 90);
    const startX = minX - 45;
    const startY = Math.max(0, minY - 25);

    return {
      minX,
      maxX,
      minY,
      maxY,
      width,
      height,
      viewBox: `${startX} ${startY} ${width} ${height}`,
    };
  }, [nodes]);

  return (
    <div className="flex flex-col h-screen bg-background text-foreground font-sans p-4 select-none">
      {/* Top Header & Interactive Input Controls */}
      <header className="flex flex-wrap items-center justify-between gap-3 bg-card/60 backdrop-blur-md border border-border/80 px-4 py-3 rounded-xl shadow-sm shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-sky-500 to-indigo-600 flex items-center justify-center shadow-md shadow-sky-500/20">
            <TreePine className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-base font-bold tracking-tight text-foreground flex items-center gap-2">
              Binary Tree Visualizer
              <span className="text-[11px] font-mono font-medium px-2 py-0.5 rounded-full bg-sky-500/15 text-sky-400 border border-sky-500/30">
                Array to Tree
              </span>
            </h1>
            <p className="text-xs text-muted-foreground">
              Direct Level-Order Animated Tree Construction
            </p>
          </div>
        </div>

        {/* Input Bar & Build / Replay Controls */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center bg-secondary/80 border border-border rounded-lg px-3 py-1.5 gap-2 shadow-inner focus-within:ring-2 focus-within:ring-sky-500/50 transition-all">
            <span className="text-xs font-mono text-muted-foreground font-semibold">
              Array:
            </span>
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleApply();
              }}
              placeholder="e.g. [1, 2, 3, 4, 5]"
              className="bg-transparent text-xs font-mono text-foreground focus:outline-none w-44 sm:w-60 placeholder:text-muted-foreground/50"
            />
            <button
              onClick={handleApply}
              className="flex items-center gap-1.5 bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-500 hover:to-blue-500 active:scale-95 text-white text-xs font-semibold px-3 py-1 rounded-md shadow-md transition-all cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              Build
            </button>
          </div>

          <button
            onClick={handleReplay}
            title="Replay Animation"
            className="flex items-center gap-1.5 bg-secondary hover:bg-secondary/80 border border-border text-foreground text-xs font-medium px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Replay
          </button>

          <button
            onClick={() => setIsPlaying(!isPlaying)}
            title={isPlaying ? "Pause" : "Play"}
            className="p-2 rounded-lg bg-secondary hover:bg-secondary/80 border border-border text-foreground transition-colors cursor-pointer"
          >
            {isPlaying ? (
              <Pause className="w-3.5 h-3.5" />
            ) : (
              <Play className="w-3.5 h-3.5 fill-current" />
            )}
          </button>

          {/* Speed Selector */}
          <div className="flex items-center bg-secondary/80 border border-border rounded-lg p-0.5 gap-0.5">
            {SPEED_OPTIONS.map((spd, idx) => (
              <button
                key={spd.label}
                onClick={() => setSpeedIndex(idx)}
                className={`text-[11px] font-mono font-medium px-2 py-0.5 rounded transition-all cursor-pointer ${
                  speedIndex === idx
                    ? "bg-sky-600 text-white shadow-sm font-bold"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {spd.label}
              </button>
            ))}
          </div>

          {/* 3-Way Engine Mode Switcher */}
          <div className="flex items-center bg-secondary/80 border border-border rounded-lg p-0.5 gap-0.5 ml-1">
            <button
              onClick={() => setCanvasMode("xyflow")}
              className={`flex items-center gap-1 text-[11px] font-sans font-semibold px-2.5 py-1 rounded transition-all cursor-pointer ${
                canvasMode === "xyflow"
                  ? "bg-sky-600 text-white shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Network className="w-3 h-3" />
              React Flow
            </button>
            <button
              onClick={() => setCanvasMode("spring")}
              className={`flex items-center gap-1 text-[11px] font-sans font-semibold px-2.5 py-1 rounded transition-all cursor-pointer ${
                canvasMode === "spring"
                  ? "bg-sky-600 text-white shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Zap className="w-3 h-3" />
              Neon Spring
            </button>
            <button
              onClick={() => setCanvasMode("tldraw")}
              className={`flex items-center gap-1 text-[11px] font-sans font-semibold px-2.5 py-1 rounded transition-all cursor-pointer ${
                canvasMode === "tldraw"
                  ? "bg-indigo-600 text-white shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Brush className="w-3 h-3" />
              tldraw
            </button>
          </div>
        </div>
      </header>

      {/* Preset Pill Bar */}
      <div className="flex items-center gap-1.5 my-3 overflow-x-auto pb-1 scrollbar-none shrink-0">
        <span className="text-xs text-muted-foreground font-medium flex items-center gap-1 mr-1">
          <Zap className="w-3.5 h-3.5 text-amber-400" /> Presets:
        </span>
        {PRESETS.map((preset, idx) => (
          <button
            key={idx}
            onClick={() => handlePresetSelect(preset.value)}
            className={`text-xs font-mono px-2.5 py-1 rounded-lg border transition-all cursor-pointer whitespace-nowrap ${
              inputText === preset.value
                ? "bg-sky-950/80 border-sky-500 text-sky-200 shadow-sm shadow-sky-900/30 font-semibold"
                : "bg-card/40 border-border/80 text-muted-foreground hover:text-foreground hover:bg-card/80 hover:border-border"
            }`}
          >
            {preset.label}
          </button>
        ))}
      </div>

      {/* Main Canvas Area */}
      <main className="flex-1 relative bg-card/40 border border-border rounded-2xl overflow-hidden shadow-inner flex flex-col items-center justify-center p-0">
        {canvasMode === "xyflow" ? (
          /* @xyflow/react Graph Canvas */
          <div className="w-full h-full relative">
            <ReactFlow
              nodes={flowNodes}
              edges={flowEdges}
              nodeTypes={nodeTypes}
              colorMode="dark"
              fitView
              minZoom={0.2}
              maxZoom={2.5}
              defaultEdgeOptions={{
                type: "straight",
                animated: false,
              }}
              proOptions={{ hideAttribution: true }}
            >
              <Background
                variant={BackgroundVariant.Dots}
                gap={20}
                size={1.5}
                color="#334155"
              />
              <Controls className="bg-card/90 border border-border rounded-lg fill-foreground text-foreground shadow-lg" />
              <MiniMap
                nodeColor={(n) => {
                  if (n.data?.status === "success") return "#10b981";
                  if (n.data?.status === "active") return "#0284c7";
                  if (n.data?.status === "target") return "#f59e0b";
                  return "#38bdf8";
                }}
                maskColor="rgba(0, 0, 0, 0.7)"
                className="bg-card/90 border border-border rounded-lg shadow-lg"
              />
            </ReactFlow>
          </div>
        ) : canvasMode === "tldraw" ? (
          /* tldraw Infinite Whiteboard Canvas */
          <div className="w-full h-full relative">
            <Tldraw
              onMount={(editor) => {
                tldrawEditorRef.current = editor;
                editor.user.updateUserPreferences({ colorScheme: "dark" });
                editor.zoomToFit({ animation: { duration: 200 } });
              }}
              options={{ maxShapesPerPage: 1000 }}
            />
          </div>
        ) : (
          /* Neon Spring Physics Canvas */
          <div className="relative w-full h-full flex items-center justify-center overflow-auto p-4">
            <div
              className="absolute inset-0 opacity-[0.03] pointer-events-none"
              style={{
                backgroundImage:
                  "radial-gradient(#ffffff 1px, transparent 1px)",
                backgroundSize: "24px 24px",
              }}
            />

            <div
              className="relative transition-all duration-300"
              style={{
                width: bounds.width,
                height: bounds.height,
              }}
            >
              {/* SVG Connecting Branches */}
              <svg
                className="absolute inset-0 w-full h-full pointer-events-none overflow-visible"
                viewBox={bounds.viewBox}
              >
                <defs>
                  <linearGradient
                    id="treeEdgeGradient"
                    x1="0%"
                    y1="0%"
                    x2="100%"
                    y2="100%"
                  >
                    <stop offset="0%" stopColor="#38bdf8" />
                    <stop offset="100%" stopColor="#6366f1" />
                  </linearGradient>
                </defs>

                {visibleState.visibleEdges.map((edge) => (
                  <motion.line
                    key={edge.id}
                    x1={edge.x1}
                    y1={edge.y1}
                    x2={edge.x2}
                    y2={edge.y2}
                    stroke="url(#treeEdgeGradient)"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 1 }}
                    transition={{
                      duration: Math.max(0.2, (speedMs / 1000) * 0.8),
                      ease: "easeOut",
                    }}
                  />
                ))}
              </svg>

              {/* Tree Nodes */}
              <div className="absolute inset-0">
                <AnimatePresence>
                  {visibleState.visibleNodes.map((node) => {
                    const isActive = currentStep?.activeId === node.id;
                    const isTarget =
                      currentStep?.targetId === node.id && !isActive;

                    let nodeBg = "bg-slate-900";
                    let nodeBorder = "border-slate-700";
                    let textColor = "text-slate-100";
                    let shadowClass = "shadow-lg shadow-black/40";

                    if (isComplete) {
                      nodeBg = "bg-emerald-950/90";
                      nodeBorder = "border-emerald-500";
                      textColor = "text-emerald-200";
                      shadowClass =
                        "shadow-lg shadow-emerald-950/50 ring-2 ring-emerald-500/30";
                    } else if (isActive) {
                      nodeBg = "bg-sky-600";
                      nodeBorder = "border-sky-300";
                      textColor = "text-white font-black";
                      shadowClass =
                        "shadow-xl shadow-sky-500/40 ring-4 ring-sky-400/40";
                    } else if (isTarget) {
                      nodeBg = "bg-amber-950/90";
                      nodeBorder = "border-amber-400";
                      textColor = "text-amber-200 font-bold";
                      shadowClass =
                        "shadow-lg shadow-amber-950/50 ring-2 ring-amber-400/50";
                    }

                    const posX = node.x - (bounds.minX - 45);
                    const posY = node.y - Math.max(0, bounds.minY - 25);

                    return (
                      <motion.div
                        key={node.id}
                        layout
                        initial={{ scale: 0, opacity: 0, y: posY - 20 }}
                        animate={{
                          scale: isActive ? 1.2 : 1,
                          opacity: 1,
                          y: posY,
                          x: posX,
                        }}
                        exit={{ scale: 0, opacity: 0 }}
                        transition={{
                          type: "spring",
                          stiffness: 380,
                          damping: 22,
                        }}
                        className={`absolute w-12 h-12 -ml-6 -mt-6 rounded-full border-2 flex items-center justify-center font-mono font-bold text-base select-none transition-colors duration-200 ${nodeBg} ${nodeBorder} ${textColor} ${shadowClass} z-10 cursor-pointer`}
                        style={{ left: 0, top: 0 }}
                      >
                        <span>{node.val}</span>

                        {isActive && !isComplete && (
                          <motion.span
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="absolute -top-6 px-1.5 py-0.5 rounded bg-sky-500 text-[10px] text-white font-sans font-semibold tracking-wider uppercase shadow"
                          >
                            New
                          </motion.span>
                        )}
                        {isTarget && !isComplete && (
                          <motion.span
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="absolute -top-6 px-1.5 py-0.5 rounded bg-amber-500 text-[10px] text-white font-sans font-semibold tracking-wider uppercase shadow"
                          >
                            Parent
                          </motion.span>
                        )}
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>
            </div>
          </div>
        )}

        {/* Floating Real-Time Status Banner (Bottom Left) */}
        <div className="absolute bottom-4 left-4 max-w-md bg-card/90 backdrop-blur-md border border-border/80 rounded-xl p-3 shadow-lg flex flex-col gap-1.5 z-20 pointer-events-auto">
          <div className="flex items-center gap-2 text-xs font-semibold text-foreground">
            {isComplete ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            ) : (
              <Sparkles className="w-4 h-4 text-sky-400 animate-pulse" />
            )}
            <span>{currentStep?.message || "Ready"}</span>
          </div>

          {/* Real-time BFS Queue Strip */}
          {currentStep?.queue && currentStep.queue.length > 0 && (
            <div className="flex items-center gap-1 text-[11px] font-mono text-muted-foreground pt-1 border-t border-border/50 overflow-x-auto">
              <span className="text-[10px] font-sans font-bold uppercase tracking-wider text-sky-400 mr-1">
                Queue:
              </span>
              {currentStep.queue.map((qItem, i) => (
                <span
                  key={i}
                  className="px-1.5 py-0.5 rounded bg-secondary/80 text-foreground border border-border/50 whitespace-nowrap"
                >
                  {qItem}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Tree Stats Badge (Bottom Right) */}
        <div className="absolute bottom-4 right-4 bg-card/90 backdrop-blur-md border border-border/80 rounded-xl px-3 py-2 shadow-lg flex items-center gap-3 text-xs font-mono z-20 pointer-events-auto">
          <div className="flex items-center gap-1.5">
            <span className="text-muted-foreground font-sans">Nodes:</span>
            <span className="font-bold text-sky-400">
              {visibleState.visibleNodes.length}
            </span>
            <span className="text-muted-foreground/60">/</span>
            <span className="text-muted-foreground">{nodes.length}</span>
          </div>
          <div className="w-px h-3 bg-border" />
          <div className="flex items-center gap-1.5">
            <span className="text-muted-foreground font-sans">Depth:</span>
            <span className="font-bold text-indigo-400">{depth}</span>
          </div>
        </div>
      </main>
    </div>
  );
}
