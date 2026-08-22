import { motion, AnimatePresence } from "framer-motion";
import { themeColors, type ThemeName } from "../../utils/theme";

export interface VariablesProps {
  variables?: Record<string, string | number | boolean | null | undefined>;
  title?: string;
  theme?: ThemeName;
  highlightColorClass?: string;
  className?: string;
}

export default function Variables({
  variables = {},
  title = "state",
  theme,
  highlightColorClass,
  className = "",
}: VariablesProps) {
  const entries = Object.entries(variables || {}).filter(
    ([_, val]) => val !== undefined
  );

  if (entries.length === 0) return null;

  const colorClass =
    highlightColorClass ||
    (theme && themeColors[theme]
      ? themeColors[theme].variablesText
      : "text-neutral-100");

  return (
    <div
      className={`bg-neutral-900/90 border border-neutral-800/90 rounded-md p-3.5 min-w-[200px] max-w-[320px] shadow-sm flex flex-col gap-2.5 ${className}`}
    >
      {/* Header */}
      <div className="text-sm font-bold text-neutral-100 tracking-tight font-sans select-none">
        {title}
      </div>

      {/* Key-Value Rows */}
      <div className="flex flex-col gap-1.5 font-mono text-xs">
        {entries.map(([key, val]) => {
          const valStr = String(val);
          const isDimmed =
            val === null ||
            valStr === "null" ||
            valStr === "[]" ||
            valStr === "N/A" ||
            valStr === "—" ||
            valStr === "None";

          return (
            <div
              key={key}
              className="flex items-center justify-between gap-6 py-0.5"
            >
              <span className="text-neutral-400 font-mono select-none">
                {key}
              </span>
              <AnimatePresence mode="popLayout">
                <motion.span
                  key={valStr}
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 4 }}
                  transition={{ duration: 0.15 }}
                  className={`font-mono font-medium text-right select-none ${
                    isDimmed ? "text-neutral-500 font-normal" : colorClass
                  }`}
                >
                  {valStr}
                </motion.span>
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </div>
  );
}
