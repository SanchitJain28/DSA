import { motion, AnimatePresence } from "framer-motion";
import Pointer from "../shared/Pointer";
import { type LayoutNode } from "../../core/linked-list/types";
import { useSettings } from "../../contexts/SettingsContext";
import { themeColors, type ThemeName } from "../../utils/theme";

export interface LinkedListNodesProps {
  nodes: LayoutNode[];
  pointers?: Record<string, string>;
  activeNodeId?: string | null;
  theme?: ThemeName;
}

export default function LinkedListNodes({
  nodes,
  pointers = {},
  activeNodeId,
  theme = "indigo",
}: LinkedListNodesProps) {
  const { showPointers, randomizePointerColors } = useSettings();
  const colors = themeColors[theme] || themeColors.indigo;

  return (
    <div className="absolute inset-0">
      <AnimatePresence mode="popLayout">
        {nodes.map((node) => {
          const isActive = node.id === activeNodeId;
          const pointerLabels = Object.entries(pointers)
            .filter(([_, targetId]) => targetId === node.id)
            .map(([label]) => label);

          if (node.isNull) {
            return (
              <motion.div
                key={node.id}
                className={`absolute flex items-center justify-center w-8 h-8 -ml-4 -mt-4 text-sm font-bold rounded-full ${colors.nodeNullBg} text-rose-200 border-2 ${colors.nodeNullBorder} shadow-lg`}
                style={{ left: node.x, top: node.y }}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                transition={{
                  type: "spring",
                  stiffness: 300,
                  damping: 25,
                }}
              >
                ∅
              </motion.div>
            );
          }

          return (
            <div
              key={node.id}
              className="absolute"
              style={{ left: node.x, top: node.y }}
            >
              {showPointers && pointerLabels.length > 0 && (
                <Pointer
                  labels={pointerLabels}
                  x={0}
                  y={0}
                  themeClass={`text-${theme}-400 border-${theme}-800`}
                  randomColor={randomizePointerColors}
                />
              )}
              <motion.div
                layout
                initial={{ scale: 0, opacity: 0 }}
                animate={{
                  scale: isActive ? 1.15 : 1,
                  opacity: 1,
                  backgroundColor: isActive
                    ? colors.nodeActiveBg
                    : node.isDummy
                      ? "#18181b"
                      : "#1f2937",
                  borderColor: isActive
                    ? colors.nodeActiveBorder
                    : node.isDummy
                      ? "#3f3f46"
                      : "#374151",
                }}
                exit={{ scale: 0, opacity: 0 }}
                transition={{
                  type: "spring",
                  stiffness: 300,
                  damping: 25,
                }}
                className={`flex items-center justify-center w-14 h-14 -ml-7 -mt-7 rounded-md border-2 font-mono font-bold text-xl text-white select-none shadow-lg ${
                  node.isDummy ? "border-dashed" : ""
                } ${isActive ? "ring-4 ring-accent/40 shadow-xl" : ""}`}
              >
                {node.isDummy ? "D" : node.val}
              </motion.div>
            </div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
