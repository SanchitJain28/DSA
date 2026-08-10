import { motion } from "framer-motion";
import { ArrowUp } from "lucide-react";

interface PointerProps {
  labels: string[];
  x: number;
  y: number;
  themeClass: string;
}

export default function Pointer({ labels, x, y, themeClass }: PointerProps) {
  if (labels.length === 0) return null;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
      className={`absolute flex flex-col items-center justify-start z-20 pointer-events-none -translate-x-1/2`}
      style={{ left: x, top: y + 26 }}
    >
      <ArrowUp className={`w-4 h-4 mb-1 ${themeClass.replace("border-", "text-")}`} />
      <div className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider shadow-lg bg-gray-900 border ${themeClass}`}>
        {labels.join(", ")}
      </div>
    </motion.div>
  );
}
