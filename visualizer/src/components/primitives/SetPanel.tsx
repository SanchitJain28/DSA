import { motion } from "framer-motion";
import { Hash, Link2, Trophy, ArrowRight } from "lucide-react";
import type { SetState } from "../../core/structures/set/types";
import { themeColors, type ThemeName } from "../../utils/theme";

interface SetPanelProps {
  state: SetState;
  theme?: ThemeName;
  colors?: Record<string, string>;
}

export function SetPanel({
  state,
  theme = "cyan",
  colors: customColors,
}: SetPanelProps) {
  const colors = customColors || themeColors[theme] || themeColors.cyan;
  const {
    title = "Hash Set Elements",
    elements = [],
    elementStatuses = {},
    streakChain = [],
    bestStreak = [],
  } = state;

  return (
    <div className="flex flex-col items-center justify-center gap-5 w-full max-w-3xl mx-auto select-none bg-transparent">
      {/* 1. Hash Set Elements Box */}
      <div className="w-full bg-transparent border border-neutral-800/90 rounded-md p-4 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-mono font-semibold uppercase tracking-wider text-neutral-300">
            <Hash className={`w-4 h-4 ${colors.titleClass}`} />
            <span>
              {title} ({elements.length} Unique)
            </span>
          </div>
          <div className="text-[11px] font-mono text-neutral-400 flex items-center gap-3">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-500" />
              Inspecting
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              Streak Member
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500/60" />
              Non-Start
            </span>
          </div>
        </div>

        <div className="flex flex-wrap gap-2.5 items-center justify-center p-2 min-h-[56px]">
          {elements.map((el) => {
            const status = elementStatuses[el] || "default";

            let badgeStyle = "bg-neutral-900 border-neutral-800 text-neutral-300";
            if (status === "active") {
              badgeStyle =
                "bg-cyan-950 border-cyan-400 text-cyan-200 ring-2 ring-cyan-400/50 shadow-md shadow-cyan-950";
            } else if (status === "streak") {
              badgeStyle =
                "bg-emerald-950 border-emerald-400 text-emerald-200 ring-2 ring-emerald-400/50 shadow-md shadow-emerald-950";
            } else if (status === "skipped") {
              badgeStyle =
                "bg-rose-950/40 border-rose-800/60 text-rose-300/80 opacity-60";
            } else if (status === "bestStreak") {
              badgeStyle =
                "bg-sky-950/70 border-sky-600 text-sky-200 ring-1 ring-sky-500/30";
            }

            return (
              <motion.div
                key={el}
                layout
                className={`px-3.5 py-1.5 rounded-md border font-mono text-sm font-bold flex items-center justify-center transition-all ${badgeStyle}`}
              >
                {el}
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* 2. Active Streak Chain */}
      {streakChain !== undefined && (
        <div className="w-full bg-transparent border border-neutral-800 rounded-md p-4 flex flex-col gap-3 min-h-[100px]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-mono font-semibold uppercase tracking-wider text-emerald-400">
              <Link2 className="w-4 h-4" />
              <span>
                Active Streak Chain (Length = {streakChain.length})
              </span>
            </div>
            {streakChain.length > 0 && (
              <span className="text-[11px] font-mono text-emerald-300/80">
                Expanding sequence
              </span>
            )}
          </div>

          <div className="flex items-center justify-center gap-2 flex-wrap min-h-[44px] py-1">
            {streakChain.length === 0 ? (
              <span className="text-xs font-mono text-neutral-600 italic">
                No active streak expanding...
              </span>
            ) : (
              streakChain.map((num, idx) => (
                <div key={num} className="flex items-center gap-2">
                  <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: "spring", stiffness: 350, damping: 22 }}
                    className="px-3.5 py-1.5 bg-emerald-950/90 border-2 border-emerald-400 rounded-md font-mono text-base font-bold text-emerald-100 ring-2 ring-emerald-500/30 shadow-md shadow-emerald-950/50"
                  >
                    {num}
                  </motion.div>
                  {idx < streakChain.length - 1 && (
                    <ArrowRight className="w-4 h-4 text-emerald-400 shrink-0" />
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* 3. Best Global Streak */}
      {bestStreak.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full bg-transparent border border-sky-500/40 rounded-md p-3.5 flex items-center justify-between shadow-sm"
        >
          <div className="flex items-center gap-2">
            <Trophy className="w-4 h-4 text-sky-400" />
            <span className="text-xs font-mono font-bold text-sky-300 uppercase tracking-wider">
              Best Global Streak (Length = {bestStreak.length})
            </span>
          </div>
          <div className="flex items-center gap-2 font-mono font-bold text-sm text-sky-200">
            [{bestStreak.join(", ")}]
          </div>
        </motion.div>
      )}
    </div>
  );
}

export default SetPanel;
