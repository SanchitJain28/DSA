import { motion, AnimatePresence } from "framer-motion";
import { type LayoutEdge } from "../../core/structures/linked-list/types";
import { themeColors, type ThemeName } from "../../utils/theme";

export interface LinkedListEdgesProps {
  edges: LayoutEdge[];
  theme?: ThemeName;
  edgeColor?: string;
  edgeNullColor?: string;
  className?: string;
}

export default function LinkedListEdges({
  edges,
  theme = "bone" as any,
  edgeColor,
  edgeNullColor,
  className = "",
}: LinkedListEdgesProps) {
  const colors = themeColors[theme] || themeColors.bone;
  const strokeColor = edgeColor || colors.edge || "#3d3d45";
  const nullStrokeColor = edgeNullColor || colors.edgeNull || "#2e2e34";

  return (
    <svg
      className={`absolute inset-0 w-full h-full overflow-visible pointer-events-none ${className}`}
    >
      <defs>
        <marker
          id={`arrowhead-${theme}`}
          markerWidth="7"
          markerHeight="6"
          refX="6"
          refY="3"
          orient="auto"
        >
          <polygon points="0 0.5, 6 3, 0 5.5" fill={strokeColor} />
        </marker>
        <marker
          id={`arrowhead-null-${theme}`}
          markerWidth="7"
          markerHeight="6"
          refX="6"
          refY="3"
          orient="auto"
        >
          <polygon points="0 0.5, 6 3, 0 5.5" fill={nullStrokeColor} />
        </marker>
      </defs>

      <AnimatePresence>
        {edges.map((edge) => {
          const isBackward =
            edge.x1 > edge.x2 && Math.abs(edge.y1 - edge.y2) < 40;
          const isLongForward =
            edge.x2 - edge.x1 > 120 && Math.abs(edge.y1 - edge.y2) < 40;
          const isCircular = edge.id.includes("circle");

          let pathD: string;
          if (isBackward || isLongForward || isCircular) {
            const startX = edge.x1;
            const startY = edge.y1 - 24;
            const endX = edge.x2;
            const endY = edge.y2 - 24;
            const midX = (startX + endX) / 2;
            const arcHeight = Math.abs(edge.x1 - edge.x2) > 200 ? 80 : 55;
            pathD = `M ${startX} ${startY} Q ${midX} ${
              Math.min(startY, endY) - arcHeight
            } ${endX} ${endY}`;
          } else {
            pathD = `M ${edge.x1} ${edge.y1} L ${edge.x2} ${edge.y2}`;
          }

          return (
            <motion.path
              key={edge.id}
              initial={{ opacity: 0 }}
              animate={{
                d: pathD,
                opacity: 1,
              }}
              exit={{ opacity: 0 }}
              stroke={edge.isNull ? nullStrokeColor : strokeColor}
              strokeDasharray={edge.isNull ? "5 5" : "none"}
              fill="transparent"
              strokeWidth="2"
              markerEnd={
                edge.isNull
                  ? `url(#arrowhead-null-${theme})`
                  : `url(#arrowhead-${theme})`
              }
              transition={{
                type: "spring",
                stiffness: 300,
                damping: 25,
              }}
            />
          );
        })}
      </AnimatePresence>
    </svg>
  );
}
