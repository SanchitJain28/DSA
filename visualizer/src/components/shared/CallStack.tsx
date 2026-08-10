import { motion, AnimatePresence } from "framer-motion";

interface CallStackProps {
  stack: string[];
  activeBgClass?: string;
  activeTextClass?: string;
  activeBorderClass?: string;
}

export default function CallStack({
  stack,
  activeBgClass = "bg-gray-800",
  activeTextClass = "text-white",
  activeBorderClass = "border-gray-700",
}: CallStackProps) {
  return (
    <div className="flex-1 bg-gray-900 rounded-xl border border-gray-800 p-4 flex flex-col">
      <h3 className="text-gray-400 text-sm font-bold mb-3 uppercase tracking-wider">
        Call Stack
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
          {[...stack].reverse().map((call, idx) => {
            const isTop = idx === 0;
            const originalIdx = stack.length - 1 - idx;
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
                    : "bg-gray-950 text-gray-500 border border-gray-900"
                }`}
              >
                {call}
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}
