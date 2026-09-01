import { motion } from "framer-motion";
import { ArrowDown, GitCommit } from "lucide-react";
import type { RangeState } from "../../core/structures/range/types";
import { type ThemeName } from "../../utils/theme";

interface RangePanelProps {
  state: RangeState;
  theme?: ThemeName;
  colors?: Record<string, string>;
}

export function RangePanel({
  state,
}: RangePanelProps) {
  const {
    title = "Search Space Range",
    min,
    max,
    left,
    right,
    mid,
    isMatch = false,
    unit = "",
  } = state;

  const span = Math.max(1, max - min);

  // Clamp percentages between 0% and 100%
  const leftPct =
    left !== undefined
      ? Math.max(0, Math.min(100, ((left - min) / span) * 100))
      : 0;
  const rightPct =
    right !== undefined
      ? Math.max(0, Math.min(100, ((right - min) / span) * 100))
      : 100;
  const midPct =
    mid !== undefined
      ? Math.max(0, Math.min(100, ((mid - min) / span) * 100))
      : 50;

  const hasRange = left !== undefined && right !== undefined;
  const rangeWidthPct = Math.max(1, rightPct - leftPct);

  return (
    <div className="w-full max-w-2xl bg-[#131316] rounded-[14px] p-4 flex flex-col gap-3.5 select-none shadow-[0_0_0_1px_rgba(255,255,255,0.045)] font-['Poppins',sans-serif]">
      {/* Header Info */}
      <div className="flex items-center justify-between border-b border-[#1e1e23] pb-2">
        <div className="flex items-center gap-2">
          <GitCommit className="w-4 h-4 text-[#c9c3b6]" />
          <span className="text-[12px] font-semibold uppercase tracking-[0.08em] text-[#ededf0]">
            {title}
          </span>
        </div>

        {hasRange && (
          <div className="flex items-center gap-2 font-['JetBrains_Mono',monospace] text-[11.5px]">
            <span className="px-2.5 py-0.5 rounded-[7px] bg-[#1c1c21] text-[#82828b]">
              Active Window:{" "}
              <strong className="text-[#c9c3b6]">
                [{left} .. {right}]
              </strong>
            </span>
          </div>
        )}
      </div>

      {/* Visual Range Track */}
      <div className="relative pt-6 pb-4 px-3 select-none">
        {/* Full Domain Rail */}
        <div className="h-2.5 w-full bg-[#141417] rounded-full relative overflow-hidden border border-[#26262c]">
          {/* Active Range Highlight */}
          {hasRange && (
            <motion.div
              className="absolute top-0 bottom-0 bg-[#c9c3b6]/30 border-y border-[#c9c3b6]/60"
              initial={false}
              animate={{
                left: `${leftPct}%`,
                width: `${rangeWidthPct}%`,
              }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            />
          )}
        </div>

        {/* Min & Max End Points */}
        <div className="flex justify-between items-center text-[10.5px] font-['JetBrains_Mono',monospace] text-[#6c6c76] mt-2 px-0.5">
          <span>
            {min}
            {unit}
          </span>
          <span>
            {max}
            {unit}
          </span>
        </div>

        {/* Left Bound Pointer */}
        {left !== undefined && (
          <motion.div
            className="absolute top-0 flex flex-col items-center -ml-3 pointer-events-none z-10"
            initial={false}
            animate={{ left: `${leftPct}%` }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            <span className="text-[10.5px] font-['JetBrains_Mono',monospace] font-bold text-[#c9c3b6] uppercase tracking-tighter">
              L ({left})
            </span>
            <div className="w-1.5 h-1.5 rotate-45 bg-[#c9c3b6] mt-0.5" />
          </motion.div>
        )}

        {/* Right Bound Pointer */}
        {right !== undefined && (
          <motion.div
            className="absolute top-0 flex flex-col items-center -ml-3 pointer-events-none z-10"
            initial={false}
            animate={{ left: `${rightPct}%` }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            <span className="text-[10.5px] font-['JetBrains_Mono',monospace] font-bold text-[#c9c3b6] uppercase tracking-tighter">
              R ({right})
            </span>
            <div className="w-1.5 h-1.5 rotate-45 bg-[#c9c3b6] mt-0.5" />
          </motion.div>
        )}

        {/* Mid Pointer */}
        {mid !== undefined && (
          <motion.div
            className="absolute top-0 flex flex-col items-center -ml-6 pointer-events-none z-20"
            initial={false}
            animate={{ left: `${midPct}%` }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
          >
            <div
              className={`px-2 py-0.5 rounded-[7px] shadow-[0_4px_12px_rgba(0,0,0,0.5)] border text-[11px] font-['JetBrains_Mono',monospace] font-bold flex items-center gap-1 ${
                isMatch
                  ? "bg-[#7d9b86] text-white border-[#7d9b86] shadow-emerald-950/60"
                  : "bg-gradient-to-b from-[#33333a] to-[#26262c] text-[#ededf0] border-[#c9c3b6]"
              }`}
            >
              mid: {mid}
            </div>
            <ArrowDown
              className={`w-3.5 h-3.5 -mt-0.5 ${
                isMatch ? "text-[#7d9b86]" : "text-[#c9c3b6]"
              }`}
            />
          </motion.div>
        )}
      </div>
    </div>
  );
}

export default RangePanel;
