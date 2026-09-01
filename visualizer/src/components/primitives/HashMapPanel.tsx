import { motion, AnimatePresence } from "framer-motion";
import { Hash } from "lucide-react";
import type { HashMapState } from "../../core/structures/hashmap/types";
import { type ThemeName } from "../../utils/theme";

interface HashMapPanelProps {
  state: HashMapState | Record<string | number, any>;
  theme?: ThemeName;
  colors?: Record<string, string>;
  maxHeight?: number | string;
}

export function HashMapPanel({
  state,
  maxHeight = 320,
}: HashMapPanelProps) {
  const mapState: HashMapState =
    state && typeof state === "object" && "entries" in state
      ? (state as HashMapState)
      : { entries: (state as Record<string | number, any>) || {} };

  const title = mapState.title || "Hash Map";
  const entries = Object.entries(mapState.entries || {}).filter(
    ([_, val]) => val !== undefined,
  );

  return (
    <div className="bg-[#131316] rounded-[14px] p-4 flex flex-col min-w-[270px] max-w-sm shadow-[0_0_0_1px_rgba(255,255,255,0.045)] select-none font-['Poppins',sans-serif]">
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
            entries.map(([key, val]) => {
              const isActive =
                mapState.activeKey !== undefined &&
                String(mapState.activeKey) === String(key);
              const isHighlight =
                mapState.highlightKey !== undefined &&
                String(mapState.highlightKey) === String(key);
              const isConflict =
                mapState.conflictKey !== undefined &&
                String(mapState.conflictKey) === String(key);

              let itemClass = "bg-[#1c1c21] border border-[#26262c]";
              let valColor = "text-[#c9c3b6]";

              if (isConflict) {
                itemClass = "bg-gradient-to-b from-[#2b1c1c] to-[#1a1010] border border-[#b08a8a] shadow-[0_0_10px_rgba(176,138,138,0.3)]";
                valColor = "text-[#b08a8a]";
              } else if (isActive || isHighlight) {
                itemClass = "bg-gradient-to-b from-[#302e2a] to-[#201f1c] border border-[#c9c3b6] shadow-[0_0_10px_rgba(201,195,182,0.25)]";
                valColor = "text-white font-bold";
              }

              return (
                <motion.div
                  layout
                  key={key}
                  initial={{ opacity: 0, scale: 0.9, y: 4 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, y: -4 }}
                  transition={{ type: "spring", stiffness: 350, damping: 25 }}
                  className={`px-3 py-2 rounded-[8px] flex items-center justify-between gap-3 shadow-sm transition-colors ${itemClass}`}
                >
                  {/* Key Badge */}
                  <div className="flex items-center gap-1.5 min-w-0">
                    <span className="text-[#6c6c76] text-[10px] font-['JetBrains_Mono',monospace] uppercase">
                      key:
                    </span>
                    <span className="font-['JetBrains_Mono',monospace] text-xs font-semibold text-[#ededf0] truncate max-w-[110px]">
                      {key}
                    </span>
                  </div>

                  <span className="text-[#5a5a63] font-['JetBrains_Mono',monospace] text-xs">→</span>

                  {/* Value Badge */}
                  <div className="flex items-center gap-1.5 shrink-0">
                    <span className="text-[#6c6c76] text-[10px] font-['JetBrains_Mono',monospace] uppercase">
                      val:
                    </span>
                    <span className={`font-['JetBrains_Mono',monospace] text-xs font-bold ${valColor}`}>
                      {val !== null && val !== undefined ? String(val) : "null"}
                    </span>
                  </div>
                </motion.div>
              );
            })
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default HashMapPanel;
