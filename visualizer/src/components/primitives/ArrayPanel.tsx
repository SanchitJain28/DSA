import { motion, AnimatePresence } from "framer-motion";
import Pointer from "../shared/Pointer";
import { useSettings } from "../../contexts/SettingsContext";
import type { ArrayData, ArrayState } from "../../core/structures/array/types";
import { type ThemeName } from "../../utils/theme";

interface ArrayPanelProps {
  state: ArrayState;
  theme?: ThemeName;
  colors?: Record<string, string>;
}

export function ArrayPanel({
  state,
}: ArrayPanelProps) {
  const arrays = Array.isArray(state) ? state : [state];

  return (
    <div className="flex flex-col items-center justify-center gap-8 w-fit mx-auto bg-transparent font-['Poppins',sans-serif]">
      <AnimatePresence mode="popLayout">
        {arrays.map((arr) => (
          <SingleArrayRenderer
            key={arr.id}
            arr={arr}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}

function SingleArrayRenderer({
  arr,
}: {
  arr: ArrayData;
}) {
  const { showPointers, randomizePointerColors } = useSettings();

  return (
    <div className="flex flex-col items-start w-fit bg-transparent">
      {arr.name && (
        <div className="text-[#8a8a93] text-[11.5px] font-semibold uppercase tracking-[0.1em] mb-3 ml-1">
          {arr.name}
        </div>
      )}

      <div className="relative flex items-center gap-2.5">
        {/* Sliding Window Bounding Box Overlay */}
        {arr.windows?.map((window, wIdx) => {
          // Box width: 56px (w-14) + 10px gap (gap-2.5) = 66px stride
          const startOffset = window.start * 66 - 6;
          const numElements = window.end - window.start + 1;
          const width =
            numElements > 0
              ? numElements * 56 + (numElements - 1) * 10 + 12
              : 0;

          return (
            <motion.div
              key={`window-${wIdx}`}
              layout
              initial={{ opacity: 0 }}
              animate={{
                opacity: 1,
                x: startOffset,
                width,
              }}
              transition={{
                type: "spring",
                stiffness: 300,
                damping: 25,
              }}
              className={`absolute -top-2.5 h-[76px] rounded-[12px] z-0 pointer-events-none border-2 bg-[#c9c3b6]/10 shadow-sm ${
                window.colorClass ||
                "border-[#c9c3b6]/80 shadow-[#c9c3b6]/20"
              }`}
              style={{ originX: 0 }}
            />
          );
        })}

        {arr.values.map((val: any, idx: number) => {
          const activePointers = arr.pointers
            ? Object.entries(arr.pointers).filter(([_, pIdx]) => pIdx === idx)
            : [];

          const hasPointer = activePointers.length > 0;
          const isExplicitActive =
            arr.activeIndex === idx ||
            (arr.activeIndices?.includes(idx) ?? false);
          const isMatch =
            arr.matchIndex === idx ||
            (arr.matchIndices?.includes(idx) ?? false);
          const isConflict = arr.conflictIndex === idx;

          const isActive = isExplicitActive || hasPointer;
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
                  isMatch={isMatch}
                  isConflict={isConflict}
                />
              ) : (
                <motion.div
                  layout
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{
                    y: isActive || isMatch || isConflict ? -4 : 0,
                    scale: isActive || isMatch || isConflict ? 1.04 : 1,
                    opacity: 1,
                    background: isConflict
                      ? "linear-gradient(180deg, #2b1c1c, #1a1010)"
                      : isMatch
                      ? "linear-gradient(180deg, #18261e, #0e1712)"
                      : isActive
                      ? "linear-gradient(180deg, #302e2a, #201f1c)"
                      : "linear-gradient(180deg, #24242a, #1a1a1f)",
                    borderColor: isConflict
                      ? "#b08a8a"
                      : isMatch
                      ? "#7d9b86"
                      : isActive
                      ? "#c9c3b6"
                      : "#34343c",
                    boxShadow: isConflict
                      ? "0 0 14px rgba(176, 138, 138, 0.4)"
                      : isMatch
                      ? "0 0 14px rgba(125, 155, 134, 0.4)"
                      : isActive
                      ? "0 0 14px rgba(201, 195, 182, 0.35), inset 0 1px 0 rgba(255,255,255,0.12)"
                      : "0 4px 10px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.08)",
                  }}
                  transition={{ type: "spring", stiffness: 350, damping: 24 }}
                  className={`w-14 h-14 rounded-[10px] border flex items-center justify-center font-['JetBrains_Mono',monospace] font-bold text-lg select-none z-10 ${
                    isConflict
                      ? "text-[#b08a8a]"
                      : isMatch
                      ? "text-[#7d9b86]"
                      : isActive
                      ? "text-[#ffffff]"
                      : "text-[#ededf0]"
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
  isMatch,
  isConflict,
}: {
  val: any[];
  isActive: boolean;
  isMatch: boolean;
  isConflict: boolean;
}) {
  return (
    <motion.div
      layout
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{
        y: isActive || isMatch || isConflict ? -4 : 0,
        scale: isActive || isMatch || isConflict ? 1.04 : 1,
        opacity: 1,
        background: isConflict
          ? "linear-gradient(180deg, #2b1c1c, #1a1010)"
          : isMatch
          ? "linear-gradient(180deg, #18261e, #0e1712)"
          : isActive
          ? "linear-gradient(180deg, #302e2a, #201f1c)"
          : "linear-gradient(180deg, #24242a, #1a1a1f)",
        borderColor: isConflict
          ? "#b08a8a"
          : isMatch
          ? "#7d9b86"
          : isActive
          ? "#c9c3b6"
          : "#34343c",
        boxShadow: isConflict
          ? "0 0 14px rgba(176, 138, 138, 0.4)"
          : isMatch
          ? "0 0 14px rgba(125, 155, 134, 0.4)"
          : isActive
          ? "0 0 14px rgba(201, 195, 182, 0.35)"
          : "0 4px 10px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.08)",
      }}
      transition={{ type: "spring", stiffness: 350, damping: 24 }}
      className={`min-w-14 h-14 px-2.5 rounded-[10px] border flex items-center justify-center gap-1.5 font-['JetBrains_Mono',monospace] font-bold text-sm select-none z-10 ${
        isConflict
          ? "text-[#b08a8a]"
          : isMatch
          ? "text-[#7d9b86]"
          : isActive
          ? "text-[#ffffff]"
          : "text-[#ededf0]"
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

export default ArrayPanel;
