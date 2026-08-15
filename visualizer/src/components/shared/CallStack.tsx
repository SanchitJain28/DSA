import { motion, AnimatePresence } from "framer-motion";

interface CallStackProps {
  stack: string[];
  activeBgClass?: string;
  activeTextClass?: string;
  activeBorderClass?: string;
  title?: string;
  mode?: "stack" | "queue";
}

export default function CallStack({
  stack,
  activeBgClass = "bg-gray-800",
  activeTextClass = "text-white",
  activeBorderClass = "border-gray-700",
  title = "Call Stack",
  mode = "stack",
}: CallStackProps) {
  return (
    <div className="flex-1 bg-card rounded-xl border border-border p-4 flex flex-col">
      <h3 className="text-muted-foreground text-sm font-bold mb-3 uppercase tracking-wider">
        {title}
      </h3>
      <div className="flex-1 overflow-y-auto pr-2 flex flex-col justify-start space-y-2 pt-2">
        <AnimatePresence initial={false}>
          {stack.length === 0 && (
            <motion.div
              layout
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-gray-600 font-mono text-sm text-center py-4 italic"
            >
              (Empty)
            </motion.div>
          )}
          {(() => {
            const items = mode === "stack" ? [...stack].reverse() : stack;
            return items.map((call, idx) => {
              const isTop = idx === 0;
              const originalIdx = mode === "stack" ? stack.length - 1 - idx : idx;
              return (
                <motion.div
                  layout
                  key={`${call}-${originalIdx}`}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                className={`px-3 py-2 rounded-lg font-mono text-sm whitespace-pre ${
                  isTop
                    ? `${activeBgClass} ${activeTextClass} ${activeBorderClass} shadow-md`
                    : "bg-background text-muted-foreground border border-border"
                }`}
              >
                {call}
                  </motion.div>
                );
              });
            })()}
        </AnimatePresence>
      </div>
    </div>
  );
}
