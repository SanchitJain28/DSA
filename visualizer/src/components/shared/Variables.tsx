import { motion, AnimatePresence } from "framer-motion";

export interface VariablesProps {
  variables?: Record<string, string | number | boolean | null | undefined>;
  title?: string;
  theme?: string;
  highlightColorClass?: string;
  className?: string;
}

export default function Variables({
  variables = {},
  title = "state",
  className = "",
}: VariablesProps) {
  const entries = Object.entries(variables || {}).filter(
    ([_, val]) => val !== undefined
  );

  if (entries.length === 0) return null;

  return (
    <div
      className={`bg-[#131316] rounded-[14px] p-4 min-w-[210px] max-w-[320px] shadow-[0_0_0_1px_rgba(255,255,255,0.045)] flex flex-col gap-3 font-['Poppins',sans-serif] ${className}`}
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#1e1e23] pb-2">
        <span className="text-[13px] font-semibold text-[#ededf0] tracking-[-0.01em] select-none">
          {title}
        </span>
        <span className="w-[5px] h-[5px] rounded-full bg-[#c9c3b6]" />
      </div>

      {/* Key-Value Rows */}
      <div className="flex flex-col gap-1.5 font-['JetBrains_Mono',monospace] text-[12px]">
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
              className="flex items-center justify-between gap-5 py-0.5"
            >
              <span className="text-[#82828b] select-none">{key}</span>
              <AnimatePresence mode="popLayout">
                <motion.span
                  key={valStr}
                  initial={{ opacity: 0, y: -3 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 3 }}
                  transition={{ duration: 0.15 }}
                  className={`font-medium text-right select-none ${
                    isDimmed ? "text-[#5a5a63] font-normal" : "text-[#c9c3b6]"
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
