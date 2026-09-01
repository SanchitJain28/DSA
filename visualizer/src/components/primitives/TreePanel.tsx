import { useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { ThemeName } from "../../utils/theme";
import { themeColors } from "../../utils/theme";

export interface TreeLayoutNode {
  id: string;
  val: number | string;
  x: number;
  y: number;
  isNull?: boolean;
  status?: "active" | "target" | "secondary" | "success";
}

export interface TreeLayoutEdge {
  id: string;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  isNull?: boolean;
}

export interface TreeState {
  nodes: TreeLayoutNode[];
  edges: TreeLayoutEdge[];
  activeNodeId?: string | null;
  activeNodeIds?: string[];
}

interface TreePanelProps {
  state: TreeState;
  theme?: ThemeName;
}

export default function TreePanel({ state, theme = "emerald" }: TreePanelProps) {
  const colors = themeColors[theme] || themeColors.emerald;
  const nodes = state?.nodes || [];
  const edges = state?.edges || [];
  const activeNodeId = state?.activeNodeId;
  const activeNodeIds = state?.activeNodeIds || [];

  const { totalWidth, totalHeight, originX, originY } = useMemo(() => {
    const currentNodes = state?.nodes || [];
    let minX = Infinity;
    let maxX = -Infinity;
    let minY = Infinity;
    let maxY = -Infinity;

    for (const n of currentNodes) {
      if (n.x < minX) minX = n.x;
      if (n.x > maxX) maxX = n.x;
      if (n.y < minY) minY = n.y;
      if (n.y > maxY) maxY = n.y;
    }

    if (minX === Infinity) {
      minX = 0;
      maxX = 600;
      minY = 0;
      maxY = 320;
    }

    const paddingX = 60;
    const paddingY = 40;

    return {
      totalWidth: Math.max(500, maxX - minX + paddingX * 2),
      totalHeight: Math.max(340, maxY - minY + paddingY * 2),
      originX: paddingX - minX,
      originY: paddingY - minY,
    };
  }, [state?.nodes]);

  return (
    <div
      className="relative shrink-0"
      style={{ width: totalWidth, height: totalHeight }}
    >
      {/* Edges (SVG) */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none overflow-visible">
        {edges.map((edge) => (
          <motion.line
            key={edge.id}
            x1={edge.x1 + originX}
            y1={edge.y1 + originY}
            x2={edge.x2 + originX}
            y2={edge.y2 + originY}
            stroke={edge.isNull ? colors.edgeNull : colors.edge}
            strokeWidth={edge.isNull ? "2.5" : "3.5"}
            strokeDasharray={edge.isNull ? "4 4" : "none"}
            strokeLinecap="round"
            initial={edge.isNull ? { opacity: 0 } : { pathLength: 0 }}
            animate={edge.isNull ? { opacity: 1 } : { pathLength: 1 }}
            transition={{ duration: 0.4 }}
          />
        ))}
      </svg>

      {/* Nodes */}
      <div className="absolute inset-0">
        <AnimatePresence mode="popLayout">
          {nodes.map((node) => {
            const isActive =
              node.id === activeNodeId ||
              activeNodeIds.includes(node.id) ||
              node.status === "active";

            const posX = node.x + originX;
            const posY = node.y + originY;

            if (node.isNull) {
              return (
                <motion.div
                  key={node.id}
                  layout
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{
                    scale: isActive ? 1.3 : 1,
                    opacity: isActive ? 1 : 0.45,
                    backgroundColor: isActive ? colors.nodeNullBg : "#0f172a",
                    borderColor: isActive ? colors.nodeNullBorder : "#1e293b",
                  }}
                  exit={{ scale: 0, opacity: 0 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  className={`absolute w-5 h-5 -ml-2.5 -mt-2.5 rounded-full border-2 flex items-center justify-center shadow-md ${
                    isActive ? "z-20 ring-2 ring-rose-400/50" : "z-0"
                  }`}
                  style={{ left: posX, top: posY }}
                >
                  {isActive && (
                    <span className="text-[10px] font-bold text-rose-200">
                      ∅
                    </span>
                  )}
                </motion.div>
              );
            }

            const isTarget = node.status === "target";
            const isSecondary = node.status === "secondary";
            const isSuccess = node.status === "success";

            let bg = "#1e293b";
            let border = "#334155";
            let ringClass = "shadow-lg shadow-black/40";
            let scale = 1;

            if (isActive) {
              bg = colors.nodeActiveBg;
              border = colors.nodeActiveBorder;
              ringClass =
                "ring-4 ring-teal-400/40 shadow-xl shadow-teal-500/30";
              scale = 1.18;
            } else if (isTarget) {
              bg = "#9a3412";
              border = "#f97316";
              ringClass =
                "ring-2 ring-orange-400/50 shadow-lg shadow-orange-950/50";
              scale = 1.15;
            } else if (isSecondary) {
              bg = "#4c1d95";
              border = "#8b5cf6";
              ringClass =
                "ring-2 ring-violet-400/50 shadow-lg shadow-violet-950/50";
              scale = 1.15;
            } else if (isSuccess) {
              bg = "#14532d";
              border = "#22c55e";
              ringClass =
                "ring-2 ring-green-400/50 shadow-lg shadow-green-950/50";
              scale = 1.15;
            }

            return (
              <motion.div
                key={node.id}
                layout
                initial={{ scale: 0, opacity: 0 }}
                animate={{
                  scale,
                  opacity: 1,
                  backgroundColor: bg,
                  borderColor: border,
                }}
                exit={{ scale: 0, opacity: 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className={`absolute w-12 h-12 -ml-6 -mt-6 rounded-full border-2 flex items-center justify-center font-mono font-bold text-lg text-white select-none transition-colors duration-200 z-10 ${ringClass}`}
                style={{ left: posX, top: posY }}
              >
                {node.val}
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}
