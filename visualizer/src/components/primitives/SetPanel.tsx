import { motion } from "framer-motion";
import { Hash, Link2, Trophy, ArrowRight } from "lucide-react";
import type { SetState } from "../../core/structures/set/types";
import { type ThemeName } from "../../utils/theme";

interface SetPanelProps {
  state: SetState;
  theme?: ThemeName;
  colors?: Record<string, string>;
}

export function SetPanel({
  state,
}: SetPanelProps) {
  const {
    title = "Hash Set Elements",
    elements = [],
    elementStatuses = {},
    streakChain = [],
    bestStreak = [],
  } = state;

  return (
    <div className="flex flex-col items-center justify-center gap-5 w-full max-w-3xl mx-auto select-none bg-transparent font-['Poppins',sans-serif]">
      {/* 1. Hash Set Elements Box */}
      <div className="w-full bg-[#131316] border border-[#26262c] rounded-[14px] p-4 flex flex-col gap-3 shadow-[0_0_0_1px_rgba(255,255,255,0.045)]">
        <div className="flex items-center justify-between pb-2 border-b border-[#1e1e23]">
          <div className="flex items-center gap-2 text-[11.5px] font-semibold uppercase tracking-[0.1em] text-[#ededf0]">
            <Hash className="w-4 h-4 text-[#c9c3b6]" />
            <span>
              {title} ({elements.length} Unique)
            </span>
          </div>
          <div className="text-[10.5px] font-['JetBrains_Mono',monospace] text-[#82828b] flex items-center gap-3">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#c9c3b6]" />
              Inspecting
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#7d9b86]" />
              Streak Member
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#b08a8a]" />
              Non-Start
            </span>
          </div>
        </div>

        <div className="flex flex-wrap gap-2.5 items-center justify-center p-2 min-h-[56px]">
          {elements.map((el) => {
            const status = elementStatuses[el] || "default";

            let badgeStyle = "bg-[#1c1c21] border-[#26262c] text-[#ededf0]";
            if (status === "active") {
              badgeStyle =
                "bg-gradient-to-b from-[#302e2a] to-[#201f1c] border-[#c9c3b6] text-white shadow-[0_0_12px_rgba(201,195,182,0.35)]";
            } else if (status === "streak") {
              badgeStyle =
                "bg-gradient-to-b from-[#18261e] to-[#0e1712] border-[#7d9b86] text-[#7d9b86] shadow-[0_0_12px_rgba(125,155,134,0.35)]";
            } else if (status === "skipped") {
              badgeStyle =
                "bg-gradient-to-b from-[#2b1c1c] to-[#1a1010] border-[#b08a8a]/60 text-[#b08a8a] opacity-60";
            } else if (status === "bestStreak") {
              badgeStyle =
                "bg-gradient-to-b from-[#33333a] to-[#26262c] border-[#3d3d45] text-[#ededf0]";
            }

            return (
              <motion.div
                key={el}
                layout
                className={`px-3.5 py-1.5 rounded-[8px] border font-['JetBrains_Mono',monospace] text-sm font-bold flex items-center justify-center transition-all ${badgeStyle}`}
              >
                {el}
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* 2. Active Streak Chain */}
      {streakChain !== undefined && (
        <div className="w-full bg-[#131316] border border-[#26262c] rounded-[14px] p-4 flex flex-col gap-3 min-h-[100px] shadow-[0_0_0_1px_rgba(255,255,255,0.045)]">
          <div className="flex items-center justify-between pb-2 border-b border-[#1e1e23]">
            <div className="flex items-center gap-2 text-[11.5px] font-semibold uppercase tracking-[0.1em] text-[#7d9b86]">
              <Link2 className="w-4 h-4" />
              <span>
                Active Streak Chain (Length = {streakChain.length})
              </span>
            </div>
            {streakChain.length > 0 && (
              <span className="text-[10.5px] font-['JetBrains_Mono',monospace] text-[#7d9b86]/80">
                Expanding sequence
              </span>
            )}
          </div>

          <div className="flex items-center justify-center gap-2 flex-wrap min-h-[44px] py-1">
            {streakChain.length === 0 ? (
              <span className="text-xs font-['JetBrains_Mono',monospace] text-[#5a5a63] italic">
                No active streak expanding...
              </span>
            ) : (
              streakChain.map((num, idx) => (
                <div key={num} className="flex items-center gap-2">
                  <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: "spring", stiffness: 350, damping: 22 }}
                    className="px-3.5 py-1.5 bg-gradient-to-b from-[#18261e] to-[#0e1712] border border-[#7d9b86] rounded-[8px] font-['JetBrains_Mono',monospace] text-base font-bold text-[#7d9b86] shadow-[0_0_12px_rgba(125,155,134,0.35)]"
                  >
                    {num}
                  </motion.div>
                  {idx < streakChain.length - 1 && (
                    <ArrowRight className="w-3.5 h-3.5 text-[#3d3d45] shrink-0" />
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
          className="w-full bg-[#131316] border border-[#3d3d45] rounded-[14px] p-3.5 flex items-center justify-between shadow-[0_0_0_1px_rgba(255,255,255,0.045)]"
        >
          <div className="flex items-center gap-2">
            <Trophy className="w-4 h-4 text-[#c9c3b6]" />
            <span className="text-[11.5px] font-semibold text-[#ededf0] uppercase tracking-[0.08em]">
              Best Global Streak (Length = {bestStreak.length})
            </span>
          </div>
          <div className="flex items-center gap-2 font-['JetBrains_Mono',monospace] font-bold text-sm text-[#c9c3b6]">
            [{bestStreak.join(", ")}]
          </div>
        </motion.div>
      )}
    </div>
  );
}

export default SetPanel;
