import { motion, AnimatePresence } from "framer-motion";
import { Hash } from "lucide-react";
import { type ThemeName } from "../../utils/theme";

export interface HashMapProps {
  map?: Record<string, string | number | boolean | null | undefined>;
  title?: string;
  theme?: ThemeName;
  activeBgClass?: string;
  activeTextClass?: string;
  activeBorderClass?: string;
  className?: string;
  maxHeight?: number | string;
}

export default function HashMap({
  map = {},
  title = "Hash Map",
  className = "",
  maxHeight = 280,
}: HashMapProps) {
  const entries = Object.entries(map || {}).filter(
    ([_, val]) => val !== undefined
  );

  return (
    <div
      className={`bg-[#131316] border border-[#26262c] rounded-[14px] p-4 flex flex-col min-w-[260px] max-w-sm shadow-[0_0_0_1px_rgba(255,255,255,0.045)] select-none font-['Poppins',sans-serif] ${className}`}
    >
      {/* Header Label */}
      <div className="flex items-center justify-between gap-2 mb-3 pb-2 border-b border-[#1e1e23]">
        <div className="flex items-center gap-2">
          <Hash className="w-4 h-4 text-[#c9c3b6]" />
          <span className="text-[12px] font-semibold uppercase tracking-[0.08em] text-[#ededf0]">
            {title}
          </span>
        </div>
        <span className="text-[10.5px] font-['JetBrains_Mono',monospace] text-[#82828b] bg-[#1c1c21] px-2 py-0.5 rounded-[6px] border border-[#26262c]">
          {entries.length} {entries.length === 1 ? "entry" : "entries"}
        </span>
      </div>

      {/* Key-Value Pairs List */}
      <div
        className="flex flex-col gap-1.5 overflow-y-auto pr-1"
        style={{ maxHeight }}
      >
        <AnimatePresence mode="popLayout" initial={false}>
          {entries.length === 0 ? (
            <motion.div
              layout
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-[#5a5a63] font-['JetBrains_Mono',monospace] text-xs text-center py-4 italic"
            >
              (Empty Map)
            </motion.div>
          ) : (
            entries.map(([key, val]) => (
              <motion.div
                layout
                key={key}
                initial={{ opacity: 0, scale: 0.94 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.94 }}
                transition={{ type: "spring", stiffness: 350, damping: 25 }}
                className="px-3 py-2 bg-[#1c1c21] border border-[#26262c] rounded-[8px] flex items-center justify-between gap-3 shadow-sm"
              >
                {/* Key */}
                <div className="flex items-center gap-1.5 min-w-0">
                  <span className="text-[#6c6c76] text-[10px] font-['JetBrains_Mono',monospace] uppercase">
                    key:
                  </span>
                  <span className="font-['JetBrains_Mono',monospace] text-xs font-semibold text-[#ededf0] truncate max-w-[110px]">
                    {key}
                  </span>
                </div>

                <span className="text-[#5a5a63] font-['JetBrains_Mono',monospace] text-xs">→</span>

                {/* Value */}
                <div className="flex items-center gap-1.5 shrink-0">
                  <span className="text-[#6c6c76] text-[10px] font-['JetBrains_Mono',monospace] uppercase">
                    val:
                  </span>
                  <span className="font-['JetBrains_Mono',monospace] text-xs font-bold text-[#c9c3b6]">
                    {val !== null && val !== undefined ? String(val) : "null"}
                  </span>
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
