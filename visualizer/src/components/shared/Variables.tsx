import { motion, AnimatePresence } from "framer-motion";
import { themeColors, type ThemeName } from "../../utils/theme";

export interface VariablesProps {
  variables?: Record<string, string | number | boolean | null | undefined>;
  theme?: ThemeName;
  highlightColorClass?: string;
  className?: string;
}

export default function Variables({
  variables = {},
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
      : "text-white");

  return (
    <div
      className={`flex flex-wrap items-center justify-center gap-6 ${className}`}
    >
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
          <div key={key} className="flex flex-col items-center">
            <span className="text-neutral-400 text-xs font-mono font-semibold mb-1.5 uppercase tracking-wider">
              {key}
            </span>
            <div className="bg-neutral-900/90 border border-neutral-800 px-4 py-2 rounded-md flex items-center justify-center min-w-[96px] shadow-sm">
              <AnimatePresence mode="popLayout">
                <motion.span
                  key={valStr}
                  initial={{ opacity: 0, y: -8, scale: 0.85 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.85 }}
                  className={`font-mono text-base font-bold ${
                    isDimmed ? "text-neutral-500 font-normal" : colorClass
                  }`}
                >
                  {valStr}
                </motion.span>
              </AnimatePresence>
            </div>
          </div>
        );
      })}
    </div>
  );
}
