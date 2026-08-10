import { motion, AnimatePresence } from "framer-motion";

interface ResultArrayProps {
  result: number[];
  itemBgClass?: string;
  itemBorderClass?: string;
  itemTextClass?: string;
}

export default function ResultArray({
  result,
  itemBgClass = "bg-gray-800",
  itemBorderClass = "border-gray-600",
  itemTextClass = "text-white",
}: ResultArrayProps) {
  return (
    <div className="h-32 bg-gray-900 rounded-xl border border-gray-800 p-4 flex flex-col justify-center">
      <h3 className="text-gray-400 text-sm font-bold mb-3 uppercase tracking-wider">
        Result Array
      </h3>
      <div className="flex space-x-2 overflow-x-auto pb-2">
        <AnimatePresence>
          {result.length === 0 && (
            <span className="text-gray-600 italic">Empty</span>
          )}
          {result.map((val, i) => (
            <motion.div
              key={`res-${i}-${val}`}
              initial={{ opacity: 0, y: -20, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              className={`min-w-10 h-10 px-2 flex items-center justify-center rounded-lg font-bold shadow-sm border ${itemBgClass} ${itemBorderClass} ${itemTextClass}`}
            >
              {val}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
