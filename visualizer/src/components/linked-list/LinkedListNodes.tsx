import { motion, AnimatePresence } from "framer-motion";
import Pointer from "../shared/Pointer";
import { type LayoutNode } from "../../core/structures/linked-list/types";
import { useSettings } from "../../contexts/SettingsContext";
import { type ThemeName } from "../../utils/theme";

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
}: LinkedListNodesProps) {
  const { showPointers, randomizePointerColors } = useSettings();

  return (
    <div className="absolute inset-0 font-['Poppins',sans-serif]">
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
                className="absolute flex items-center justify-center w-8 h-8 -ml-4 -mt-4 text-xs font-bold rounded-full bg-[#2b1c1c] text-[#b08a8a] border border-[#b08a8a] shadow-[0_0_10px_rgba(176,138,138,0.35)]"
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
                  themeClass="border-[#c9c3b6] text-[#c9c3b6]"
                  randomColor={randomizePointerColors}
                />
              )}
              <motion.div
                layout
                initial={{ scale: 0, opacity: 0 }}
                animate={{
                  scale: isActive ? 1.08 : 1,
                  opacity: 1,
                  background: isActive
                    ? "linear-gradient(180deg, #302e2a, #201f1c)"
                    : node.isDummy
                    ? "linear-gradient(180deg, #1c1c20, #141417)"
                    : "linear-gradient(180deg, #24242a, #1a1a1f)",
                  borderColor: isActive
                    ? "#c9c3b6"
                    : node.isDummy
                    ? "#3d3d45"
                    : "#34343c",
                  boxShadow: isActive
                    ? "0 0 18px rgba(201,195,182,0.45), inset 0 1px 0 rgba(255,255,255,0.15)"
                    : "0 4px 10px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.08)",
                }}
                exit={{ scale: 0, opacity: 0 }}
                transition={{
                  type: "spring",
                  stiffness: 350,
                  damping: 24,
                }}
                className={`flex items-center justify-center w-14 h-14 -ml-7 -mt-7 rounded-[10px] border font-['JetBrains_Mono',monospace] font-bold text-lg select-none z-10 ${
                  isActive
                    ? "text-[#ffffff]"
                    : node.isDummy
                    ? "border-dashed text-[#82828b]"
                    : "text-[#ededf0]"
                }`}
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
