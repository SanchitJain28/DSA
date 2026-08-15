import { motion, AnimatePresence } from "framer-motion";

interface VariablesProps {
  variables: Record<string, string | number>;
  highlightColorClass?: string;
}

export default function Variables({
  variables,
  highlightColorClass = "text-white",
}: VariablesProps) {
  const entries = Object.entries(variables);

  return (
    <div className="h-32 bg-card rounded-xl border border-border p-4 flex flex-col justify-center items-center shadow-inner relative">
      <h3 className="absolute top-4 left-4 text-muted-foreground text-sm font-bold uppercase tracking-wider">
        Variables {entries.length === 0 && "(None)"}
      </h3>
      <div className="flex gap-8 items-center h-full pt-4">
        {entries.map(([key, val]) => (
          <div key={key} className="flex flex-col items-center">
            <span className="text-muted-foreground text-xs font-medium mb-1 uppercase tracking-wider">
              {key}
            </span>
            <div className="bg-background px-4 py-2 rounded-lg border border-border flex items-center justify-center min-w-[80px]">
              <AnimatePresence mode="popLayout">
                <motion.span
                  key={val}
                  initial={{ opacity: 0, y: -10, scale: 0.8 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.8 }}
                  className={`font-mono text-2xl font-bold ${highlightColorClass}`}
                >
                  {val}
                </motion.span>
              </AnimatePresence>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
