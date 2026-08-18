import { motion } from "framer-motion";
import Pointer from "./Pointer";
import { useSettings } from "../../contexts/SettingsContext";
import type { ArrayData } from "../../core/array/types";
import type { BaseFrame } from "../../core/shared/types";

interface ArrayRendererProps {
  arr: ArrayData;
  frame: BaseFrame;
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
          const activePointers = arr.pointers
            ? Object.entries(arr.pointers).filter(([_, pIdx]) => pIdx === idx)
            : [];

          const hasPointer = activePointers.length > 0;
          const isActive =
            frame.activeNodeId === nodeId ||
            (frame.activeNodeIds?.includes(nodeId) ?? false) ||
            hasPointer;

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
                    y: isActive ? -5 : 0,
                    scale: isActive ? 1.05 : 1,
                    opacity: 1,
                    backgroundColor: isActive
                      ? colors.nodeActiveBg || "#241a15"
                      : "#18181b",
                    borderColor: isActive
                      ? colors.nodeActiveBorder || "#f97316"
                      : "#2e2e32",
                    boxShadow: isActive
                      ? "0 4px 0 #9a3412, 0 8px 16px -2px rgba(249, 115, 22, 0.35)"
                      : "0 1px 2px rgba(0,0,0,0.3)",
                  }}
                  transition={{ type: "spring", stiffness: 350, damping: 22 }}
                  className={`w-14 h-14 rounded-xl border-2 flex items-center justify-center font-mono font-bold text-xl select-none z-10 ${
                    isActive ? "z-20 text-white font-extrabold" : "text-neutral-200"
                  }`}
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
        y: isActive ? -5 : 0,
        scale: isActive ? 1.05 : 1,
        opacity: 1,
        backgroundColor: isActive
          ? colors.nodeActiveBg || "#241a15"
          : "#18181b",
        borderColor: isActive
          ? colors.nodeActiveBorder || "#f97316"
          : "#2e2e32",
        boxShadow: isActive
          ? "0 4px 0 #9a3412, 0 8px 16px -2px rgba(249, 115, 22, 0.35)"
          : "0 1px 2px rgba(0,0,0,0.3)",
      }}
      transition={{ type: "spring", stiffness: 350, damping: 22 }}
      className={`h-14 px-3 rounded-xl border-2 flex items-center justify-center font-mono font-bold text-sm shadow-lg z-10 gap-1.5 whitespace-nowrap ${
        isActive ? "z-20 text-white" : "text-neutral-300"
      }`}
    >
      <span className="text-muted-foreground font-mono">[</span>
      {val.map((innerVal: any, i: number) => (
        <span
          key={i}
          className="px-1.5 py-0.5 bg-[#1f1f23] rounded border border-neutral-700 text-neutral-100"
        >
          {innerVal !== null
            ? typeof innerVal === "string"
              ? `"${innerVal}"`
              : String(innerVal)
            : ""}
        </span>
      ))}
      <span className="text-muted-foreground font-mono">]</span>
    </motion.div>
  );
}
