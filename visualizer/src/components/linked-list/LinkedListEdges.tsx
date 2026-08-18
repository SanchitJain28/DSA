import { motion, AnimatePresence } from "framer-motion";
import { type LayoutEdge } from "../../core/linked-list/types";
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
  theme = "indigo",
  edgeColor,
  edgeNullColor,
  className = "",
}: LinkedListEdgesProps) {
  const colors = themeColors[theme] || themeColors.indigo;
  const strokeColor = edgeColor || colors.edge;
  const nullStrokeColor = edgeNullColor || colors.edgeNull;

  return (
    <svg
      className={`absolute inset-0 w-full h-full overflow-visible pointer-events-none ${className}`}
    >
      <defs>
        <marker
          id={`arrowhead-${theme}`}
          markerWidth="8"
          markerHeight="6"
          refX="7"
          refY="3"
          orient="auto"
        >
          <polygon points="0 0, 8 3, 0 6" fill={strokeColor} />
        </marker>
      </defs>

      <AnimatePresence>
        {edges.map((edge) => {
          const isBackward =
            edge.x1 > edge.x2 && Math.abs(edge.y1 - edge.y2) < 40;
          const isCircular = edge.id.includes("circle");

          let pathD: string;
          if (isBackward || isCircular) {
            const startX = edge.x1;
            const startY = edge.y1 - 24;
            const endX = edge.x2;
            const endY = edge.y2 - 24;
            const midX = (startX + endX) / 2;
            pathD = `M ${startX} ${startY} Q ${midX} ${Math.min(startY, endY) - 65} ${endX} ${endY}`;
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
              strokeDasharray={edge.isNull ? "6 6" : "none"}
              fill="transparent"
              strokeWidth="2.5"
              markerEnd={`url(#arrowhead-${theme})`}
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
