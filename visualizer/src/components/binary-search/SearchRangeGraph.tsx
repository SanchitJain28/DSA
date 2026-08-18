import { motion } from "framer-motion";
import { ArrowDown, GitCommit } from "lucide-react";
import { themeColors, type ThemeName } from "../../utils/theme";

export interface SearchRangeGraphProps {
  min: number;
  max: number;
  left?: number;
  right?: number;
  mid?: number;
  isMatch?: boolean;
  unit?: string;
  theme?: ThemeName;
  className?: string;
}

export default function SearchRangeGraph({
  min,
  max,
  left,
  right,
  mid,
  isMatch = false,
  unit = "",
  theme = "sky",
  className = "",
}: SearchRangeGraphProps) {
  const colors = themeColors[theme] || themeColors.sky;
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
    <div
      className={`w-full max-w-2xl bg-transparent border border-neutral-800/80 rounded-md p-4 flex flex-col gap-3 ${className}`}
    >
      {/* Header Info */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <GitCommit className={`w-4 h-4 ${colors.titleClass}`} />
          <span className="text-xs font-bold font-mono uppercase tracking-wider text-neutral-200">
            Search Space Range
          </span>
        </div>

        {hasRange && (
          <div className="flex items-center gap-2 text-xs font-mono">
            <span className="px-2.5 py-0.5 rounded bg-neutral-900 border border-neutral-800 text-neutral-300">
              Active Window:{" "}
              <strong className={colors.titleClass}>
                [{left} .. {right}]
              </strong>
            </span>
          </div>
        )}
      </div>

      {/* Visual Range Track */}
      <div className="relative pt-6 pb-4 px-3 select-none">
        {/* Full Domain Rail */}
        <div className="h-2.5 w-full bg-neutral-900/90 rounded-full relative overflow-hidden border border-neutral-800">
          {/* Active Range Highlight */}
          {hasRange && (
            <motion.div
              className={`absolute top-0 bottom-0 ${
                theme === "teal"
                  ? "bg-teal-500/40 border-y border-teal-400"
                  : "bg-sky-500/40 border-y border-sky-400"
              }`}
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
        <div className="flex justify-between items-center text-[10px] font-mono text-neutral-500 mt-1.5 px-0.5">
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
            <span className="text-[10px] font-mono font-bold text-sky-400 uppercase tracking-tighter">
              L ({left})
            </span>
            <div className="w-1.5 h-1.5 rotate-45 bg-sky-400 mt-0.5" />
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
            <span className="text-[10px] font-mono font-bold text-sky-400 uppercase tracking-tighter">
              R ({right})
            </span>
            <div className="w-1.5 h-1.5 rotate-45 bg-sky-400 mt-0.5" />
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
              className={`px-2 py-0.5 rounded shadow-lg border text-[11px] font-mono font-bold flex items-center gap-1 ${
                isMatch
                  ? "bg-emerald-600 text-white border-emerald-400 shadow-emerald-950/60"
                  : theme === "teal"
                    ? "bg-teal-600 text-white border-teal-400 shadow-teal-950/60"
                    : "bg-sky-600 text-white border-sky-400 shadow-sky-950/60"
              }`}
            >
              mid: {mid}
            </div>
            <ArrowDown
              className={`w-3.5 h-3.5 -mt-0.5 ${
                isMatch
                  ? "text-emerald-400"
                  : theme === "teal"
                    ? "text-teal-400"
                    : "text-sky-400"
              }`}
            />
          </motion.div>
        )}
      </div>
    </div>
  );
}
