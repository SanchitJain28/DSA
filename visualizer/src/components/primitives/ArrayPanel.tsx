import { motion, AnimatePresence } from "framer-motion";
import Pointer from "../shared/Pointer";
import { useSettings } from "../../contexts/SettingsContext";
import type { ArrayData, ArrayState } from "../../core/structures/array/types";
import { themeColors, type ThemeName } from "../../utils/theme";

interface ArrayPanelProps {
  state: ArrayState;
  theme?: ThemeName;
  colors?: Record<string, string>;
}

export function ArrayPanel({
  state,
  theme = "violet",
  colors: customColors,
}: ArrayPanelProps) {
  const colors = customColors || themeColors[theme] || themeColors.violet;
  const arrays = Array.isArray(state) ? state : [state];

  return (
    <div className="flex flex-col items-center justify-center gap-8 w-fit mx-auto bg-transparent">
      <AnimatePresence mode="popLayout">
        {arrays.map((arr) => (
          <SingleArrayRenderer
            key={arr.id}
            arr={arr}
            colors={colors}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}

function SingleArrayRenderer({
  arr,
  colors,
}: {
  arr: ArrayData;
  colors: Record<string, string>;
}) {
  const { showPointers, randomizePointerColors } = useSettings();

  return (
    <div className="flex flex-col items-start w-fit bg-transparent">
      {arr.name && (
        <div className="text-neutral-400 text-xs font-mono font-semibold uppercase tracking-wider mb-3 ml-1">
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
              className={`absolute -top-2.5 h-[76px] rounded-md z-0 pointer-events-none border-2 bg-indigo-500/10 shadow-sm ${
                window.colorClass ||
                "border-indigo-400/80 shadow-indigo-500/20"
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
                  themeClass={colors.callStackBorder}
                  randomColor={randomizePointerColors || false}
                />
              )}

              {isNested ? (
                <NestedArrayRenderer
                  val={val}
                  isActive={isActive}
                  isMatch={isMatch}
                  isConflict={isConflict}
                  colors={colors}
                />
              ) : (
                <motion.div
                  layout
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{
                    y: isActive || isMatch || isConflict ? -4 : 0,
                    scale: isActive || isMatch || isConflict ? 1.04 : 1,
                    opacity: 1,
                    backgroundColor: isConflict
                      ? "#3b1219"
                      : isMatch
                      ? "#062e24"
                      : isActive
                      ? colors.nodeActiveBg || "#241a15"
                      : "#171717",
                    borderColor: isConflict
                      ? "#f43f5e"
                      : isMatch
                      ? "#10b981"
                      : isActive
                      ? colors.nodeActiveBorder || "#f97316"
                      : "#2e2e32",
                    boxShadow: isConflict
                      ? "0 0 12px rgba(244, 63, 94, 0.4)"
                      : isMatch
                      ? "0 0 12px rgba(16, 185, 129, 0.4)"
                      : isActive
                      ? `0 4px 12px -2px rgba(249, 115, 22, 0.35)`
                      : "0 1px 2px rgba(0,0,0,0.3)",
                  }}
                  transition={{ type: "spring", stiffness: 350, damping: 24 }}
                  className={`w-14 h-14 rounded-md border flex items-center justify-center font-mono font-bold text-lg select-none z-10 ${
                    isConflict
                      ? "text-rose-200"
                      : isMatch
                      ? "text-emerald-200 font-extrabold"
                      : isActive
                      ? "text-white font-extrabold"
                      : "text-neutral-300"
                  }`}
                >
                  {val !== null && val !== undefined ? String(val) : ""}
                </motion.div>
              )}
              <div className="text-[10px] font-mono text-neutral-500 mt-2">
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
  colors,
}: {
  val: any[];
  isActive: boolean;
  isMatch: boolean;
  isConflict: boolean;
  colors: Record<string, string>;
}) {
  return (
    <motion.div
      layout
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{
        y: isActive || isMatch || isConflict ? -4 : 0,
        scale: isActive || isMatch || isConflict ? 1.04 : 1,
        opacity: 1,
        backgroundColor: isConflict
          ? "#3b1219"
          : isMatch
          ? "#062e24"
          : isActive
          ? colors.nodeActiveBg || "#241a15"
          : "#171717",
        borderColor: isConflict
          ? "#f43f5e"
          : isMatch
          ? "#10b981"
          : isActive
          ? colors.nodeActiveBorder || "#f97316"
          : "#2e2e32",
        boxShadow: isConflict
          ? "0 0 12px rgba(244, 63, 94, 0.4)"
          : isMatch
          ? "0 0 12px rgba(16, 185, 129, 0.4)"
          : isActive
          ? `0 4px 12px -2px rgba(249, 115, 22, 0.35)`
          : "0 1px 2px rgba(0,0,0,0.3)",
      }}
      transition={{ type: "spring", stiffness: 350, damping: 24 }}
      className={`h-14 px-3 rounded-md border flex items-center justify-center font-mono font-bold text-sm shadow-sm z-10 gap-1.5 whitespace-nowrap ${
        isConflict
          ? "text-rose-200"
          : isMatch
          ? "text-emerald-200"
          : isActive
          ? "text-white"
          : "text-neutral-300"
      }`}
    >
      <span className="text-neutral-500 font-mono">[</span>
      {val.map((innerVal: any, i: number) => (
        <span
          key={i}
          className="px-1.5 py-0.5 bg-neutral-900 rounded border border-neutral-800 text-neutral-200"
        >
          {innerVal !== null && innerVal !== undefined
            ? typeof innerVal === "string"
              ? `"${innerVal}"`
              : String(innerVal)
            : ""}
        </span>
      ))}
      <span className="text-neutral-500 font-mono">]</span>
    </motion.div>
  );
}

export default ArrayPanel;
