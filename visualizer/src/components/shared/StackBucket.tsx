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
  title = "Call Stack (LIFO)",
  maxHeight = 360,
  themeColorClass = "text-sky-400",
  activeBgClass = "bg-sky-950/70",
  activeBorderClass = "border-sky-500/60",
}: StackBucketProps) {
  // Items arranged from top of stack (last pushed) down to bottom of stack (first pushed)
  const reversedStack = stack.map((call, originalIdx) => ({
    call,
    originalIdx,
    isTop: originalIdx === stack.length - 1,
  })).reverse();

  return (
    <div className="flex flex-col items-center select-none w-64 shrink-0">
      {/* Header Label */}
      <div className="flex items-center gap-1.5 mb-2">
        <Layers className={`w-3.5 h-3.5 ${themeColorClass}`} />
        <span className="text-xs font-mono font-bold uppercase tracking-wider text-neutral-300">
          {title}
        </span>
      </div>

      {/* Top Push / Pop Direction Guide */}
      <div className="flex items-center gap-1.5 text-[10px] font-mono text-neutral-400 mb-1.5 bg-neutral-900/80 px-2.5 py-0.5 rounded-full border border-neutral-800">
        <ArrowDown className="w-3 h-3 text-sky-400" />
        <span>Push / Pop (Top)</span>
        <ArrowUp className="w-3 h-3 text-sky-400" />
      </div>

      {/* The Physical U-Shaped Stack Bucket Container */}
      <div
        className="w-full flex flex-col justify-end p-2.5 bg-neutral-950/80 border-b-2 border-l-2 border-r-2 border-neutral-700/80 rounded-b-md shadow-lg relative overflow-hidden"
        style={{
          minHeight: 200,
          maxHeight,
        }}
      >
        {/* Open Top Subtle Gradient */}
        <div className="absolute top-0 left-0 right-0 h-4 bg-gradient-to-b from-sky-500/10 to-transparent pointer-events-none" />

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
                className="text-neutral-500 font-mono text-xs text-center py-10 italic flex flex-col items-center gap-1"
              >
                <span>∅ (Stack Empty)</span>
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
                  className={`px-3 py-2 rounded-md font-mono text-xs transition-colors flex items-center justify-between shadow-sm border ${
                    isTop
                      ? `${activeBgClass} ${activeBorderClass} text-neutral-100 shadow-md ring-1 ring-sky-500/40`
                      : "bg-neutral-900/90 text-neutral-400 border-neutral-800"
                  }`}
                >
                  <span className="font-semibold truncate">{call}</span>
                  {isTop && (
                    <span className="text-[9px] font-mono font-bold uppercase px-1.5 py-0.5 bg-sky-500/20 text-sky-300 rounded border border-sky-500/50 shrink-0 ml-1.5">
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
      <div className="w-[88%] h-2 bg-neutral-800 rounded-b-md shadow-sm border-t border-neutral-700/50 mt-0.5" />
    </div>
  );
}
