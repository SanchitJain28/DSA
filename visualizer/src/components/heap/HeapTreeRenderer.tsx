import { motion } from "framer-motion";
import type { HeapTreeLayout, HeapFrame } from "../../core/heap/types";

interface HeapTreeRendererProps {
  layout: HeapTreeLayout;
  frame: HeapFrame;
}

export function HeapTreeRenderer({ layout, frame }: HeapTreeRendererProps) {
  const { nodes, edges, width, height } = layout;
  const { currentIndex, parentIndex, smallestIndex, swapIndices, compareIndices } = frame;

  if (nodes.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-neutral-500 font-mono text-xs border border-dashed border-neutral-800 rounded-md">
        <span>Heap is currently empty</span>
        <span className="text-[10px] text-neutral-600 mt-1">Add values to see the binary tree structure</span>
      </div>
    );
  }

  return (
    <div
      className="relative select-none flex items-center justify-center"
      style={{ width: `${width}px`, height: `${height}px` }}
    >
      {/* SVG Connecting Edges */}
      <svg
        className="absolute inset-0 pointer-events-none"
        width={width}
        height={height}
      >
        {edges.map((edge) => {
          const fromNode = nodes.find((n) => n.id === edge.from);
          const toNode = nodes.find((n) => n.id === edge.to);
          if (!fromNode || !toNode) return null;

          const isEdgeActive =
            (compareIndices &&
              ((compareIndices[0] === edge.fromIndex && compareIndices[1] === edge.toIndex) ||
                (compareIndices[1] === edge.fromIndex && compareIndices[0] === edge.toIndex))) ||
            (swapIndices &&
              ((swapIndices[0] === edge.fromIndex && swapIndices[1] === edge.toIndex) ||
                (swapIndices[1] === edge.fromIndex && swapIndices[0] === edge.toIndex)));

          return (
            <line
              key={edge.id}
              x1={fromNode.x}
              y1={fromNode.y}
              x2={toNode.x}
              y2={toNode.y}
              stroke={isEdgeActive ? "#38bdf8" : "#27272a"}
              strokeWidth={isEdgeActive ? 2.5 : 1.5}
              strokeDasharray={isEdgeActive ? "4 2" : "none"}
              className="transition-all duration-300"
            />
          );
        })}
      </svg>

      {/* Nodes */}
      {nodes.map((node) => {
        const idx = node.index;
        const isCurrent = idx === currentIndex;
        const isParent = idx === parentIndex;
        const isSmallest = idx === smallestIndex && smallestIndex !== currentIndex;
        const isSwapping = swapIndices && (swapIndices[0] === idx || swapIndices[1] === idx);
        const isComparing = compareIndices && (compareIndices[0] === idx || compareIndices[1] === idx);

        let badgeLabel = "";
        let badgeColor = "";

        if (isSwapping) {
          badgeLabel = "SWAP";
          badgeColor = "bg-amber-950 text-amber-300 border-amber-500/60";
        } else if (isSmallest) {
          badgeLabel = "SMALLEST";
          badgeColor = "bg-emerald-950 text-emerald-300 border-emerald-500/60";
        } else if (isParent) {
          badgeLabel = "PARENT";
          badgeColor = "bg-indigo-950 text-indigo-300 border-indigo-500/60";
        } else if (isCurrent) {
          badgeLabel = "CURR";
          badgeColor = "bg-sky-950 text-sky-300 border-sky-500/60";
        }

        let bgClass = "bg-neutral-900/90";
        let borderClass = "border-neutral-800";
        let textClass = "text-neutral-200";
        let ringClass = "";

        if (isSwapping) {
          bgClass = "bg-amber-950/80";
          borderClass = "border-amber-400";
          textClass = "text-amber-100 font-extrabold";
          ringClass = "ring-2 ring-amber-400/50 shadow-lg shadow-amber-500/20";
        } else if (isSmallest) {
          bgClass = "bg-emerald-950/80";
          borderClass = "border-emerald-400";
          textClass = "text-emerald-100 font-extrabold";
          ringClass = "ring-2 ring-emerald-400/50 shadow-lg shadow-emerald-500/20";
        } else if (isCurrent) {
          bgClass = "bg-sky-950/80";
          borderClass = "border-sky-400";
          textClass = "text-sky-100 font-extrabold";
          ringClass = "ring-2 ring-sky-400/50 shadow-lg shadow-sky-500/20 scale-105";
        } else if (isComparing) {
          bgClass = "bg-indigo-950/80";
          borderClass = "border-indigo-400";
          textClass = "text-indigo-100 font-extrabold";
          ringClass = "ring-2 ring-indigo-400/50";
        }

        return (
          <motion.div
            key={node.id}
            layout
            initial={{ scale: 0.6, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 350, damping: 25 }}
            style={{
              position: "absolute",
              left: `${node.x}px`,
              top: `${node.y}px`,
              transform: "translate(-50%, -50%)",
            }}
            className="flex flex-col items-center z-10"
          >
            {/* Top Role Badge */}
            <div className="h-3.5 flex items-center justify-center mb-0.5">
              {badgeLabel && (
                <span
                  className={`text-[8px] font-mono font-bold px-1 rounded border shadow-sm ${badgeColor}`}
                >
                  {badgeLabel}
                </span>
              )}
            </div>

            {/* Circular / Rounded-xl Node Card */}
            <div
              className={`w-11 h-11 rounded-xl border-2 flex flex-col items-center justify-center font-mono transition-all duration-200 ${bgClass} ${borderClass} ${textClass} ${ringClass}`}
            >
              <span className="text-sm font-bold leading-none">{node.value}</span>
              <span className="text-[8px] text-neutral-500 leading-none mt-0.5">
                #{node.index}
              </span>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
