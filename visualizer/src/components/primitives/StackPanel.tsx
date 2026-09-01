import { motion, AnimatePresence } from "framer-motion";
import { ArrowDown, ArrowUp, Layers, ArrowLeft } from "lucide-react";
import type { StackState, StackData } from "../../core/structures/stack/types";
import { normalizeStackState } from "../../core/structures/stack/helpers";
import { themeColors, type ThemeName } from "../../utils/theme";

interface StackPanelProps {
  state: StackState;
  theme?: ThemeName;
  colors?: Record<string, string>;
  maxHeight?: number | string;
}

export function StackPanel({
  state,
  theme = "indigo",
  colors: customColors,
  maxHeight = 360,
}: StackPanelProps) {
  const colors = customColors || themeColors[theme] || themeColors.indigo;
  const stacks = normalizeStackState(state);

  return (
    <div className="flex flex-wrap items-start justify-center gap-8 bg-transparent select-none">
      {stacks.map((st, index) => (
        <SingleStackRenderer
          key={st.id || `stack-${index}`}
          stackData={st}
          colors={colors}
          maxHeight={maxHeight}
        />
      ))}
    </div>
  );
}

function SingleStackRenderer({
  stackData,
  colors,
  maxHeight,
}: {
  stackData: StackData;
  colors: Record<string, string>;
  maxHeight: number | string;
}) {
  const { name = "Stack (LIFO)", values = [], topPointer = true } = stackData;

  // Stack items from top (last pushed, index length - 1) down to bottom (first pushed, index 0)
  const items = values
    .map((val, idx) => ({
      val,
      idx,
      isTop: idx === values.length - 1,
    }))
    .reverse();

  return (
    <div className="flex flex-col items-center select-none w-64 shrink-0 bg-transparent">
      {/* Header Label */}
      <div className="flex items-center gap-1.5 mb-2">
        <Layers className={`w-3.5 h-3.5 ${colors.titleClass}`} />
        <span className="text-xs font-mono font-bold uppercase tracking-wider text-neutral-300">
          {name}
        </span>
        <span className="text-[10px] font-mono text-neutral-500 bg-neutral-900 px-1.5 py-0.5 rounded border border-neutral-800">
          {values.length} {values.length === 1 ? "item" : "items"}
        </span>
      </div>

      {/* Top Push / Pop Direction Guide */}
      <div className="flex items-center gap-1.5 text-[10px] font-mono text-neutral-400 mb-1.5 bg-neutral-900/90 px-2.5 py-0.5 rounded-full border border-neutral-800">
        <ArrowDown className={`w-3 h-3 ${colors.titleClass}`} />
        <span>Push / Pop (Top)</span>
        <ArrowUp className={`w-3 h-3 ${colors.titleClass}`} />
      </div>

      {/* The Physical U-Shaped Stack Bucket Container */}
      <div
        className="w-full flex flex-col justify-end p-2.5 bg-neutral-950/90 border-b-2 border-l-2 border-r-2 border-neutral-700/80 rounded-b-md shadow-lg relative overflow-hidden"
        style={{
          minHeight: 200,
          maxHeight,
        }}
      >
        {/* Open Top Subtle Glow */}
        <div className="absolute top-0 left-0 right-0 h-4 bg-gradient-to-b from-neutral-700/15 to-transparent pointer-events-none" />

        {/* Stack Items Flow */}
        <div className="flex flex-col gap-1.5 w-full justify-end mt-auto overflow-hidden">
          <AnimatePresence initial={false} mode="popLayout">
            {items.length === 0 ? (
              <motion.div
                key="empty-stack"
                layout
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-neutral-600 font-mono text-xs text-center py-8 italic"
              >
                (Empty Stack)
              </motion.div>
            ) : (
              items.map(({ val, idx, isTop }) => {
                const isExplode =
                  typeof val === "string" &&
                  val.toLowerCase().includes("explode");

                return (
                  <motion.div
                    key={`stack-item-${idx}-${String(val)}`}
                    layout
                    initial={{ opacity: 0, y: -25, scale: 0.8 }}
                    animate={{
                      opacity: 1,
                      y: 0,
                      scale: isTop ? 1.02 : 1,
                      backgroundColor: isExplode
                        ? "#7f1d1d"
                        : isTop
                        ? colors.nodeActiveBg || "#1e1b4b"
                        : "#171717",
                      borderColor: isExplode
                        ? "#dc2626"
                        : isTop
                        ? colors.nodeActiveBorder || "#6366f1"
                        : "#262626",
                      boxShadow: isExplode
                        ? "0 4px 12px rgba(220,38,38,0.5)"
                        : isTop
                        ? "0 4px 12px -2px rgba(99,102,241,0.4), 0 2px 0 rgba(79,70,229,0.7)"
                        : "0 1px 2px rgba(0,0,0,0.3)",
                    }}
                    exit={{ opacity: 0, y: -25, scale: 0.6 }}
                    transition={{ type: "spring", stiffness: 350, damping: 25 }}
                    className="relative px-3 py-2 rounded-lg border-2 font-mono text-xs font-bold text-neutral-100 flex items-center justify-between z-10"
                  >
                    {/* Index or Order Badge */}
                    <span className="text-[10px] font-mono text-neutral-500">
                      [{idx}]
                    </span>

                    {/* Stack Element Value */}
                    <span className="font-mono text-xs font-semibold text-neutral-200 truncate max-w-[130px]">
                      {typeof val === "object" && val !== null
                        ? JSON.stringify(val)
                        : String(val)}
                    </span>

                    {/* Top Pointer Badge */}
                    {topPointer && isTop && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="flex items-center gap-1 text-[9px] font-mono font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/40"
                      >
                        <ArrowLeft className="w-2.5 h-2.5" />
                        <span>TOP</span>
                      </motion.div>
                    )}
                  </motion.div>
                );
              })
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

export default StackPanel;
