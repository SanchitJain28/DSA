import { useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { ThemeName } from "../../utils/theme";

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
  fromId?: string;
  toId?: string;
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
  activePathIds?: string[];
}

interface TreePanelProps {
  state: TreeState;
  theme?: ThemeName;
}

export default function TreePanel({ state }: TreePanelProps) {
  const nodes = state?.nodes || [];
  const edges = state?.edges || [];
  const activeNodeId = state?.activeNodeId;
  const activeNodeIds = state?.activeNodeIds;
  const activePathIds = state?.activePathIds;

  // Compute active path and illuminated edges
  const { activePathNodeIds, activeEdgeIds } = useMemo(() => {
    const parentMap = new Map<string, string>();
    for (const e of edges) {
      if (e.fromId && e.toId) {
        parentMap.set(e.toId, e.fromId);
      }
    }

    const targetId =
      activeNodeId || (activeNodeIds && activeNodeIds.length === 1 ? activeNodeIds[0] : null);
    if (!targetId && (!activePathIds || activePathIds.length === 0)) {
      return {
        activePathNodeIds: new Set<string>(),
        activeEdgeIds: new Set<string>(),
      };
    }

    const pathArr: string[] = [];
    if (activePathIds && activePathIds.length > 0) {
      pathArr.push(...activePathIds);
    } else if (targetId) {
      let curr: string | null | undefined = targetId;
      const visited = new Set<string>();
      while (curr && !visited.has(curr)) {
        visited.add(curr);
        pathArr.unshift(curr);
        curr = parentMap.get(curr);
      }
    }

    const pathNodeSet = new Set<string>(pathArr);
    const edgeSet = new Set<string>();

    for (let i = 0; i < pathArr.length - 1; i++) {
      const u = pathArr[i];
      const v = pathArr[i + 1];
      const matchingEdge = edges.find(
        (e) =>
          (e.fromId === u && e.toId === v) ||
          (e.id.startsWith(u) && e.id.includes(v)),
      );
      if (matchingEdge) {
        edgeSet.add(matchingEdge.id);
      }
    }

    return {
      activePathNodeIds: pathNodeSet,
      activeEdgeIds: edgeSet,
    };
  }, [edges, activeNodeId, activeNodeIds, activePathIds, nodes]);

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
    const paddingY = 50;

    return {
      totalWidth: Math.max(500, maxX - minX + paddingX * 2),
      totalHeight: Math.max(340, maxY - minY + paddingY * 2),
      originX: paddingX - minX,
      originY: paddingY - minY,
    };
  }, [state?.nodes]);

  return (
    <div
      className="relative shrink-0 font-['Poppins',sans-serif]"
      style={{ width: totalWidth, height: totalHeight }}
    >
      {/* Edges (SVG) */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none overflow-visible">
        {edges.map((edge) => {
          const isEdgeActive = activeEdgeIds.has(edge.id);
          const strokeColor = isEdgeActive
            ? edge.isNull
              ? "#b08a8a"
              : "#c9c3b6"
            : edge.isNull
            ? "#2e2e34"
            : "#3d3d45";

          const strokeWidth = isEdgeActive
            ? edge.isNull
              ? 2.5
              : 3.5
            : edge.isNull
            ? 2
            : 2.5;

          return (
            <motion.line
              key={edge.id}
              x1={edge.x1 + originX}
              y1={edge.y1 + originY}
              x2={edge.x2 + originX}
              y2={edge.y2 + originY}
              stroke={strokeColor}
              strokeWidth={strokeWidth}
              strokeDasharray={edge.isNull ? "4 4" : "none"}
              strokeLinecap="round"
              initial={edge.isNull ? { opacity: 0 } : { pathLength: 0 }}
              animate={edge.isNull ? { opacity: 1 } : { pathLength: 1 }}
              transition={{ duration: 0.3 }}
            />
          );
        })}
      </svg>

      {/* Nodes */}
      <div className="absolute inset-0">
        <AnimatePresence mode="popLayout">
          {nodes.map((node) => {
            const isActive =
              node.id === activeNodeId ||
              activeNodeIds?.includes(node.id) ||
              node.status === "active";

            const isPathAncestor =
              activePathNodeIds.has(node.id) && !isActive;

            const posX = node.x + originX;
            const posY = node.y + originY;

            if (node.isNull) {
              return (
                <motion.div
                  key={node.id}
                  layout
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{
                    scale: isActive ? 1.25 : 1,
                    opacity: isActive ? 1 : 0.4,
                    backgroundColor: isActive ? "#2b1c1c" : "#1a1a1e",
                    borderColor: isActive ? "#b08a8a" : "#2e2e34",
                  }}
                  exit={{ scale: 0, opacity: 0 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  className={`absolute w-5 h-5 -ml-2.5 -mt-2.5 rounded-full border flex items-center justify-center shadow-md ${
                    isActive ? "z-20 ring-2 ring-[#b08a8a]/50" : "z-0"
                  }`}
                  style={{ left: posX, top: posY }}
                >
                  {isActive && (
                    <span className="text-[10px] font-bold text-[#b08a8a]">
                      ∅
                    </span>
                  )}
                </motion.div>
              );
            }

            const isTarget = node.status === "target";
            const isSecondary = node.status === "secondary";
            const isSuccess = node.status === "success";

            let bg = "linear-gradient(180deg, #24242a, #1a1a1f)";
            let border = "#34343c";
            let shadow =
              "0 4px 12px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.08)";
            let textColor = "text-[#ededf0]";
            let scale = 1;

            if (isActive) {
              bg = "linear-gradient(180deg, #302e2a, #201f1c)";
              border = "#c9c3b6";
              shadow =
                "0 0 18px rgba(201,195,182,0.5), inset 0 1px 0 rgba(255,255,255,0.15)";
              textColor = "text-[#ffffff]";
              scale = 1.15;
            } else if (isPathAncestor) {
              bg = "linear-gradient(180deg, #252422, #1a1917)";
              border = "rgba(201,195,182,0.55)";
              shadow = "0 0 10px rgba(201,195,182,0.25)";
              textColor = "text-[#e2ddd2]";
              scale = 1.05;
            } else if (isTarget) {
              bg = "linear-gradient(180deg, #2b1c1c, #1a1010)";
              border = "#b08a8a";
              shadow = "0 0 14px rgba(176,138,138,0.4)";
              textColor = "text-[#b08a8a]";
              scale = 1.12;
            } else if (isSecondary) {
              bg = "linear-gradient(180deg, #2a2038, #1c1526)";
              border = "#a78bfa";
              shadow = "0 0 14px rgba(167,139,250,0.4)";
              textColor = "text-[#c4b5fd]";
              scale = 1.12;
            } else if (isSuccess) {
              bg = "linear-gradient(180deg, #18261e, #0e1712)";
              border = "#7d9b86";
              shadow = "0 0 14px rgba(125,155,134,0.4)";
              textColor = "text-[#7d9b86]";
              scale = 1.12;
            }

            return (
              <motion.div
                key={node.id}
                layout
                initial={{ scale: 0, opacity: 0 }}
                animate={{
                  scale,
                  opacity: 1,
                }}
                exit={{ scale: 0, opacity: 0 }}
                transition={{ type: "spring", stiffness: 350, damping: 24 }}
                className={`absolute w-12 h-12 -ml-6 -mt-6 rounded-full border-2 flex items-center justify-center font-['JetBrains_Mono',monospace] font-bold text-sm select-none z-10 ${textColor}`}
                style={{
                  left: posX,
                  top: posY,
                  background: bg,
                  borderColor: border,
                  boxShadow: shadow,
                }}
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
