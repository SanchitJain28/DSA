import { motion, AnimatePresence } from "framer-motion";
import { ArrowDown, ArrowUp, Layers, ArrowLeft } from "lucide-react";
import { type ThemeName } from "../../utils/theme";

export interface DataStackProps {
  stack?: (string | number | Record<string, any>)[];
  title?: string;
  maxHeight?: number | string;
  theme?: ThemeName;
  className?: string;
  showTopPointer?: boolean;
}

export default function DataStack({
  stack = [],
  title = "Stack (LIFO)",
  maxHeight = 360,
  className = "",
  showTopPointer = true,
}: DataStackProps) {
  // Stack items from top (last pushed, index length - 1) down to bottom (first pushed, index 0)
  const items = stack
    .map((val, idx) => ({
      val,
      idx,
      isTop: idx === stack.length - 1,
    }))
    .reverse();

  return (
    <div
      className={`flex flex-col items-center select-none w-64 shrink-0 font-['Poppins',sans-serif] ${className}`}
    >
      {/* Header Label */}
      <div className="flex items-center gap-2 mb-2">
        <Layers className="w-3.5 h-3.5 text-[#c9c3b6]" />
        <span className="text-[11.5px] font-semibold uppercase tracking-[0.1em] text-[#ededf0]">
          {title}
        </span>
        <span className="text-[10px] font-['JetBrains_Mono',monospace] text-[#82828b] bg-[#1c1c21] px-2 py-0.5 rounded-[6px] border border-[#26262c]">
          {stack.length} {stack.length === 1 ? "item" : "items"}
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
          minHeight: 200,
          maxHeight,
        }}
      >
        {/* Open Top Subtle Glow */}
        <div className="absolute top-0 left-0 right-0 h-4 bg-gradient-to-b from-white/[0.04] to-transparent pointer-events-none" />

        {/* Stack Items Flow */}
        <div className="flex flex-col gap-1.5 w-full justify-end mt-auto overflow-hidden">
          <AnimatePresence initial={false} mode="popLayout">
            {items.length === 0 ? (
              <motion.div
                key="empty-stack"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-[#5a5a63] font-['JetBrains_Mono',monospace] text-xs text-center py-8 italic"
              >
                (Empty Stack)
              </motion.div>
            ) : (
              items.map((item) => (
                <motion.div
                  key={`item-${item.idx}-${String(item.val)}`}
                  layout
                  initial={{ y: -40, opacity: 0, scale: 0.9 }}
                  animate={{ y: 0, opacity: 1, scale: 1 }}
                  exit={{ y: -30, opacity: 0, scale: 0.85 }}
                  transition={{ type: "spring", stiffness: 350, damping: 24 }}
                  className={`w-full py-2.5 px-3 rounded-[8px] flex items-center justify-between font-['JetBrains_Mono',monospace] font-bold text-sm shadow-[0_2px_4px_rgba(0,0,0,0.4)] ${
                    item.isTop
                      ? "bg-gradient-to-b from-[#302e2a] to-[#201f1c] border border-[#c9c3b6] text-white shadow-[0_0_10px_rgba(201,195,182,0.25)]"
                      : "bg-gradient-to-b from-[#24242a] to-[#1a1a1f] border border-[#34343c] text-[#ededf0]"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-[#6c6c76] font-normal">
                      #{item.idx}
                    </span>
                    <span className="truncate">{String(item.val)}</span>
                  </div>

                  {showTopPointer && item.isTop && (
                    <div className="flex items-center gap-1 text-[10px] uppercase tracking-wider text-[#c9c3b6]">
                      <ArrowLeft className="w-3 h-3" />
                      <span>TOP</span>
                    </div>
                  )}
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
