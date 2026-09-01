import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { type ThemeName } from "../../utils/theme";

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
}: QueueProps) {
  return (
    <div className="flex items-center gap-3 w-fit max-w-full select-none font-['Poppins',sans-serif]">
      {/* Left Exit Arrow */}
      <ArrowLeft className="w-4 h-4 text-[#b08a8a] shrink-0 animate-pulse" />

      {/* Main Queue Conduit Box with Top-Border Title Notch */}
      <div className="relative w-fit max-w-full bg-[#131316] border border-[#26262c] rounded-[12px] px-4 pt-3 pb-2 shadow-[0_0_0_1px_rgba(255,255,255,0.045)] flex items-center gap-2.5">
        {/* Top-Border Floating Title Notch */}
        <span className="absolute -top-2.5 left-4 px-2 py-0.5 bg-[#1c1c21] border border-[#26262c] rounded-[6px] text-[10px] font-['JetBrains_Mono',monospace] font-bold uppercase tracking-widest text-[#a8a296]">
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
                className="text-[#5a5a63] font-['JetBrains_Mono',monospace] text-xs italic px-4 py-1"
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
                      <span className="absolute -top-1 left-1/2 -translate-x-1/2 px-1.5 py-0.2 text-[8px] font-['JetBrains_Mono',monospace] font-bold uppercase tracking-wider text-[#b08a8a] bg-[#1c1c21] border border-[#b08a8a]/50 rounded z-10">
                        FRONT
                      </span>
                    )}
                    {isRear && (
                      <span className="absolute -top-1 left-1/2 -translate-x-1/2 px-1.5 py-0.2 text-[8px] font-['JetBrains_Mono',monospace] font-bold uppercase tracking-wider text-[#7d9b86] bg-[#1c1c21] border border-[#7d9b86]/50 rounded z-10">
                        REAR
                      </span>
                    )}

                    <div
                      className={`min-w-[48px] h-12 px-3 rounded-[8px] border flex items-center justify-center font-['JetBrains_Mono',monospace] text-xs font-bold transition-all shadow-sm ${
                        isFront
                          ? "bg-gradient-to-b from-[#302e2a] to-[#201f1c] border-[#c9c3b6] text-white shadow-[0_0_10px_rgba(201,195,182,0.25)]"
                          : "bg-gradient-to-b from-[#24242a] to-[#1a1a1f] border-[#34343c] text-[#ededf0]"
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

      {/* Right Entrance Arrow */}
      <ArrowRight className="w-4 h-4 text-[#7d9b86] shrink-0" />
    </div>
  );
}
