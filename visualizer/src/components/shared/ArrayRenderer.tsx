import { motion } from "framer-motion";
import Pointer from "./Pointer";
import { useSettings } from "../../contexts/SettingsContext";
import type { ArrayData, ArrayFrame } from "../../core/array/types";

interface ArrayRendererProps {
  arr: ArrayData;
  frame: ArrayFrame;
  colors: Record<string, string>;
}

export function ArrayRenderer({ arr, frame, colors }: ArrayRendererProps) {
  const { showPointers, randomizePointerColors } = useSettings();

  return (
    <div className="flex flex-col items-start w-fit">
      <div className="text-muted-foreground font-bold mb-4 ml-2">
        {arr.name || arr.id}
      </div>

      <div className="relative flex items-center gap-2">
        {arr.values.map((val: any, idx: number) => {
          const nodeId = `${arr.id}-${idx}`;
          const isActive =
            frame.activeNodeId === nodeId ||
            (frame.activeNodeIds?.includes(nodeId) ?? false);

          const activePointers = arr.pointers
            ? Object.entries(arr.pointers).filter(([_, pIdx]) => pIdx === idx)
            : [];

          const isNested = Array.isArray(val);

          return (
            <div key={idx} className="relative flex flex-col items-center">
              {showPointers && activePointers.length > 0 && (
                <Pointer
                  labels={activePointers.map(([label]) => label)}
                  x={28}
                  y={34}
                  themeClass={colors.callStackBorder}
                  randomColor={randomizePointerColors || false}
                />
              )}

              {isNested ? (
                <NestedArrayRenderer
                  val={val}
                  isActive={isActive}
                  colors={colors}
                />
              ) : (
                <motion.div
                  layout
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{
                    scale: isActive ? 1.1 : 1,
                    opacity: 1,
                    backgroundColor: isActive ? colors.nodeActiveBg : "#1f2937",
                    borderColor: isActive ? colors.nodeActiveBorder : "#374151",
                  }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  className={`min-w-[3.5rem] h-14 px-2 rounded-lg border-2 flex items-center justify-center font-bold text-lg shadow-lg z-10 ${isActive ? "z-20" : ""}`}
                >
                  {val !== null ? String(val) : ""}
                </motion.div>
              )}
              <div className="text-[10px] text-muted-foreground mt-2">
                {idx}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function NestedArrayRenderer({
  val,
  isActive,
  colors,
}: {
  val: any[];
  isActive: boolean;
  colors: Record<string, string>;
}) {
  return (
    <motion.div
      layout
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{
        scale: isActive ? 1.1 : 1,
        opacity: 1,
        backgroundColor: isActive ? colors.nodeActiveBg : "#111827",
        borderColor: isActive ? colors.nodeActiveBorder : "#374151",
      }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className={`h-14 px-2 rounded-lg border-2 flex items-center justify-center font-bold text-sm shadow-lg z-10 ${isActive ? "z-20" : ""} gap-1 whitespace-nowrap`}
    >
      <span className="text-muted-foreground">[</span>
      {val.map((innerVal: any, i: number) => (
        <span
          key={i}
          className="px-1.5 py-0.5 bg-card rounded border border-border text-foreground"
        >
          {innerVal !== null
            ? typeof innerVal === "string"
              ? `"${innerVal}"`
              : String(innerVal)
            : ""}
        </span>
      ))}
      <span className="text-muted-foreground">]</span>
    </motion.div>
  );
}
