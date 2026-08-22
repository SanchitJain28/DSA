import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { themeColors, type ThemeName } from "../../utils/theme";

interface QueueProps {
  queue: string[];
  title?: string;
  theme?: ThemeName;
  activeBgClass?: string;
  activeTextClass?: string;
  activeBorderClass?: string;
}

export default function Queue({
  queue,
  title = "QUEUE",
  theme = "indigo",
  activeBgClass,
  activeTextClass,
  activeBorderClass,
}: QueueProps) {
  const colors = themeColors[theme] || themeColors.indigo;

  const bg = activeBgClass || colors.callStackBg || "bg-indigo-950/60";
  const text = activeTextClass || colors.callStackText || "text-indigo-200";
  const border =
    activeBorderClass || colors.callStackBorder || "border-indigo-500/50";

  return (
    <div className="flex items-center gap-3 w-fit max-w-full select-none">
      {/* Left Exit Arrow */}
      <ArrowLeft className="w-4 h-4 text-rose-400/90 shrink-0 animate-pulse" />

      {/* Main Queue Conduit Box with Top-Border Title Notch */}
      <div className="relative w-fit max-w-full bg-transparent border border-neutral-800 rounded-md px-4 pt-3 pb-2 shadow-sm flex items-center gap-2.5">
        {/* Top-Border Floating Title Notch */}
        <span className="absolute -top-2.5 left-4 px-2 py-0.5 bg-[#171717] border border-neutral-800 rounded text-[10px] font-mono font-bold uppercase tracking-widest text-neutral-300">
          {title}
        </span>

        {/* Elements Conduit Row */}
        <div className="flex items-center gap-2.5 overflow-x-auto py-1">
          <AnimatePresence mode="popLayout" initial={false}>
            {queue.length === 0 ? (
              <motion.span
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-neutral-600 font-mono text-xs italic px-4 py-1"
              >
                (Empty)
              </motion.span>
            ) : (
              queue.map((item, idx) => {
                const isFront = idx === 0;
                const isRear = idx === queue.length - 1 && queue.length > 1;

                return (
                  <motion.div
                    layout
                    key={`${item}-${idx}`}
                    initial={{ opacity: 0, x: 20, scale: 0.9 }}
                    animate={{ opacity: 1, x: 0, scale: 1 }}
                    exit={{ opacity: 0, x: -20, scale: 0.9 }}
                    transition={{
                      type: "spring",
                      stiffness: 450,
                      damping: 28,
                    }}
                    className="relative shrink-0 pt-1"
                  >
                    {/* Floating Notch on Top Border of Card */}
                    {isFront && (
                      <span className="absolute -top-1 left-1/2 -translate-x-1/2 px-1.5 py-0.2 text-[8px] font-mono font-bold uppercase tracking-wider text-rose-300 bg-[#171717] border border-rose-500/50 rounded z-10">
                        FRONT
                      </span>
                    )}
                    {isRear && (
                      <span className="absolute -top-1 left-1/2 -translate-x-1/2 px-1.5 py-0.2 text-[8px] font-mono font-bold uppercase tracking-wider text-emerald-300 bg-[#171717] border border-emerald-500/50 rounded z-10">
                        REAR
                      </span>
                    )}

                    {/* Element Box */}
                    <div
                      className={`px-3 py-1.5 rounded-md font-mono text-xs whitespace-nowrap transition-colors duration-200 ${
                        isFront
                          ? `${bg} ${text} ${border} border shadow-md font-semibold ring-1 ring-indigo-400/30`
                          : "bg-neutral-900/90 text-neutral-300 border border-neutral-800/90 hover:border-neutral-700"
                      }`}
                    >
                      {item}
                    </div>
                  </motion.div>
                );
              })
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Right Entry Arrow */}
      <ArrowRight className="w-4 h-4 text-emerald-400/90 shrink-0 animate-pulse" />
    </div>
  );
}
