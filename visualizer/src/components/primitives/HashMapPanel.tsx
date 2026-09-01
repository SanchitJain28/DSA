import { motion, AnimatePresence } from "framer-motion";
import { Hash } from "lucide-react";
import type { HashMapState } from "../../core/structures/hashmap/types";
import { themeColors, type ThemeName } from "../../utils/theme";

interface HashMapPanelProps {
  state: HashMapState | Record<string | number, any>;
  theme?: ThemeName;
  colors?: Record<string, string>;
  maxHeight?: number | string;
}

export function HashMapPanel({
  state,
  theme = "violet",
  colors: customColors,
  maxHeight = 320,
}: HashMapPanelProps) {
  const colors = customColors || themeColors[theme] || themeColors.violet;

  const mapState: HashMapState =
    state && typeof state === "object" && "entries" in state
      ? (state as HashMapState)
      : { entries: (state as Record<string | number, any>) || {} };

  const title = mapState.title || "Hash Map";
  const entries = Object.entries(mapState.entries || {}).filter(
    ([_, val]) => val !== undefined,
  );

  return (
    <div className="bg-transparent border border-neutral-800/90 rounded-md p-3.5 flex flex-col min-w-[260px] max-w-sm shadow-sm select-none">
      {/* Header Label */}
      <div className="flex items-center justify-between gap-2 mb-2.5 pb-1.5 border-b border-neutral-800/60">
        <div className="flex items-center gap-1.5">
          <Hash className={`w-3.5 h-3.5 ${colors.titleClass}`} />
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-neutral-300">
            {title}
          </span>
        </div>
        <span className="text-[10px] font-mono text-neutral-500 bg-neutral-900 px-1.5 py-0.5 rounded border border-neutral-800">
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
              className="text-neutral-500 font-mono text-xs text-center py-4 italic"
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

              let itemStyle = "bg-neutral-900/90 border-neutral-800";
              let valClass = colors.titleClass;

              if (isConflict) {
                itemStyle = "bg-rose-950/60 border-rose-500 shadow-md shadow-rose-950/40";
                valClass = "text-rose-400";
              } else if (isActive || isHighlight) {
                itemStyle = "bg-neutral-900 border-indigo-400/80 shadow-md shadow-indigo-950/30";
                valClass = "text-indigo-300 font-bold";
              }

              return (
                <motion.div
                  layout
                  key={key}
                  initial={{ opacity: 0, scale: 0.9, y: 4 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, y: -4 }}
                  transition={{ type: "spring", stiffness: 350, damping: 25 }}
                  className={`px-2.5 py-1.5 rounded border flex items-center justify-between gap-3 shadow-sm transition-colors ${itemStyle}`}
                >
                  {/* Key Badge */}
                  <div className="flex items-center gap-1.5 min-w-0">
                    <span className="text-neutral-500 text-[10px] font-mono uppercase">
                      key:
                    </span>
                    <span className="font-mono text-xs font-semibold text-neutral-200 truncate max-w-[110px]">
                      {key}
                    </span>
                  </div>

                  <span className="text-neutral-600 font-mono text-xs">→</span>

                  {/* Value Badge */}
                  <div className="flex items-center gap-1.5 shrink-0">
                    <span className="text-neutral-500 text-[10px] font-mono uppercase">
                      val:
                    </span>
                    <span className={`font-mono text-xs font-bold ${valClass}`}>
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
