import { motion } from "framer-motion";
import Pointer from "./Pointer";
import { useSettings } from "../../contexts/SettingsContext";
import type { ArrayData } from "../../core/structures/array/types";
import type { BaseFrame } from "../../core/shared/types";

interface ArrayRendererProps {
  arr: ArrayData;
  frame: BaseFrame;
  colors?: Record<string, string>;
}

export function ArrayRenderer({ arr, frame }: ArrayRendererProps) {
  const { showPointers, randomizePointerColors } = useSettings();

  return (
    <div className="flex flex-col items-start w-fit font-['Poppins',sans-serif]">
      {arr.name && (
        <div className="text-[#8a8a93] text-[11.5px] font-semibold uppercase tracking-[0.1em] mb-3 ml-1">
          {arr.name}
        </div>
      )}

      <div className="relative flex items-center gap-2.5">
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
                  themeClass="border-[#c9c3b6] text-[#c9c3b6]"
                  randomColor={randomizePointerColors || false}
                />
              )}

              {isNested ? (
                <NestedArrayRenderer
                  val={val}
                  isActive={isActive}
                />
              ) : (
                <motion.div
                  layout
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{
                    y: isActive ? -4 : 0,
                    scale: isActive ? 1.04 : 1,
                    opacity: 1,
                    background: isActive
                      ? "linear-gradient(180deg, #302e2a, #201f1c)"
                      : "linear-gradient(180deg, #24242a, #1a1a1f)",
                    borderColor: isActive ? "#c9c3b6" : "#34343c",
                    boxShadow: isActive
                      ? "0 0 14px rgba(201, 195, 182, 0.35), inset 0 1px 0 rgba(255,255,255,0.12)"
                      : "0 4px 10px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.08)",
                  }}
                  transition={{ type: "spring", stiffness: 350, damping: 22 }}
                  className={`w-14 h-14 rounded-[10px] border flex items-center justify-center font-['JetBrains_Mono',monospace] font-bold text-lg select-none z-10 ${
                    isActive ? "z-20 text-[#ffffff]" : "text-[#ededf0]"
                  }`}
                >
                  {val !== null && val !== undefined ? String(val) : ""}
                </motion.div>
              )}
              <div className="text-[11px] font-['JetBrains_Mono',monospace] text-[#6c6c76] mt-2 font-medium">
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
}: {
  val: any[];
  isActive: boolean;
}) {
  return (
    <motion.div
      layout
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{
        y: isActive ? -4 : 0,
        scale: isActive ? 1.04 : 1,
        opacity: 1,
        background: isActive
          ? "linear-gradient(180deg, #302e2a, #201f1c)"
          : "linear-gradient(180deg, #24242a, #1a1a1f)",
        borderColor: isActive ? "#c9c3b6" : "#34343c",
        boxShadow: isActive
          ? "0 0 14px rgba(201, 195, 182, 0.35)"
          : "0 4px 10px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.08)",
      }}
      transition={{ type: "spring", stiffness: 350, damping: 22 }}
      className={`min-w-14 h-14 px-2.5 rounded-[10px] border flex items-center justify-center gap-1.5 font-['JetBrains_Mono',monospace] font-bold text-sm select-none z-10 ${
        isActive ? "text-[#ffffff]" : "text-[#ededf0]"
      }`}
    >
      <span>[</span>
      {val.map((item, i) => (
        <span key={i} className="flex items-center">
          <span>{String(item)}</span>
          {i < val.length - 1 && <span className="text-[#6c6c76] mr-1">,</span>}
        </span>
      ))}
      <span>]</span>
    </motion.div>
  );
}

export default ArrayRenderer;
