import { motion, AnimatePresence } from "framer-motion";
import { Layers, ArrowDown, ArrowUp } from "lucide-react";

interface StackBucketProps {
  stack: string[];
  title?: string;
  maxHeight?: number | string;
  themeColorClass?: string;
  activeBgClass?: string;
  activeBorderClass?: string;
}

export default function StackBucket({
  stack = [],
  title = "CALL STACK (LIFO)",
  maxHeight = 360,
}: StackBucketProps) {
  // Items arranged from top of stack (last pushed) down to bottom of stack (first pushed)
  const reversedStack = stack
    .map((call, originalIdx) => ({
      call,
      originalIdx,
      isTop: originalIdx === stack.length - 1,
    }))
    .reverse();

  return (
    <div className="flex flex-col items-center select-none w-[240px] shrink-0 font-['Poppins',sans-serif]">
      {/* Header Label */}
      <div className="flex items-center gap-2 mb-2">
        <Layers className="w-3.5 h-3.5 text-[#c9c3b6]" />
        <span className="text-[11.5px] font-semibold uppercase tracking-[0.1em] text-[#ededf0]">
          {title}
        </span>
      </div>

      {/* Top Push / Pop Direction Guide */}
      <div className="flex items-center gap-1.5 text-[10px] font-['JetBrains_Mono',monospace] text-[#82828b] mb-2 bg-[#141417] px-2.5 py-0.5 rounded-full border border-[#26262c]">
        <ArrowDown className="w-3 h-3 text-[#c9c3b6]" />
        <span>Push / Pop (Top)</span>
        <ArrowUp className="w-3 h-3 text-[#c9c3b6]" />
      </div>

      {/* The Physical U-Shaped Stack Bucket Container */}
      <div
        className="w-full flex flex-col justify-end p-2.5 bg-[#131316] border-b-2 border-l-2 border-r-2 border-[#3d3d45] rounded-b-[12px] shadow-[0_8px_20px_rgba(0,0,0,0.5)] relative overflow-hidden"
        style={{
          minHeight: 180,
          maxHeight,
        }}
      >
        {/* Open Top Subtle Gradient */}
        <div className="absolute top-0 left-0 right-0 h-4 bg-gradient-to-b from-white/[0.04] to-transparent pointer-events-none" />

        {/* Stack Items Flow (Top of stack at the top, bottom at the base) */}
        <div className="flex flex-col gap-1.5 w-full justify-end mt-auto overflow-hidden">
          <AnimatePresence initial={false} mode="popLayout">
            {stack.length === 0 ? (
              <motion.div
                key="empty-stack"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="text-[#5a5a63] font-['JetBrains_Mono',monospace] text-xs text-center py-8 italic flex flex-col items-center gap-1"
              >
                <span>∅ (Empty Stack)</span>
              </motion.div>
            ) : (
              reversedStack.map(({ call, originalIdx, isTop }) => (
                <motion.div
                  layout
                  key={`stack-frame-${originalIdx}`}
                  initial={{ opacity: 0, y: -20, scale: 0.94 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -20, scale: 0.94 }}
                  transition={{
                    type: "spring",
                    stiffness: 380,
                    damping: 26,
                    mass: 0.8,
                  }}
                  className={`px-3 py-2 rounded-[8px] font-['JetBrains_Mono',monospace] text-xs font-semibold transition-all flex items-center justify-between shadow-[0_2px_4px_rgba(0,0,0,0.4)] ${
                    isTop
                      ? "bg-gradient-to-b from-[#302e2a] to-[#201f1c] text-white border border-[#c9c3b6] shadow-[0_0_12px_rgba(201,195,182,0.25)] ring-1 ring-[#c9c3b6]/40"
                      : "bg-gradient-to-b from-[#24242a] to-[#1a1a1f] text-[#a1a1aa] border border-[#34343c]"
                  }`}
                >
                  <span className="truncate">{call}</span>
                  {isTop && (
                    <span className="text-[9px] font-bold uppercase px-1.5 py-0.5 bg-[#c9c3b6]/20 text-[#e2ddd2] rounded-[5px] border border-[#c9c3b6]/50 shrink-0 ml-1.5">
                      TOP
                    </span>
                  )}
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Stack Base Plate Stand */}
      <div className="w-[88%] h-1.5 bg-[#26262c] rounded-b-[6px] shadow-sm border-t border-[#34343c] mt-0.5" />
    </div>
  );
}
