import { motion, AnimatePresence } from "framer-motion";

interface HashMapProps {
  map: Record<string, string | number | boolean>;
  activeBgClass?: string;
  activeTextClass?: string;
  activeBorderClass?: string;
}

export default function HashMap({
  map,
  activeBgClass = "bg-gray-800",
  activeTextClass = "text-white",
  activeBorderClass = "border-gray-700",
}: HashMapProps) {
  const entries = Object.entries(map);

  return (
    <div className="flex-1 bg-card rounded-xl border border-border p-4 flex flex-col min-h-0">
      <h3 className="text-muted-foreground text-sm font-bold mb-3 uppercase tracking-wider">
        Hash Map
      </h3>
      <div className="flex-1 overflow-y-auto pr-2 flex flex-col justify-start space-y-2 pt-2 min-h-0">
        <AnimatePresence initial={false}>
          {entries.length === 0 && (
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
          {entries.map(([key, value]) => (
            <motion.div
              layout
              key={key}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
              className={`px-3 py-2 rounded-lg font-mono text-sm flex justify-between items-center whitespace-pre ${activeBgClass} ${activeTextClass} ${activeBorderClass} shadow-md border`}
            >
              <span className="font-bold opacity-80">{key}</span>
              <span className="opacity-100">{String(value)}</span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
