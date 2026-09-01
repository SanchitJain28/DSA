import { motion } from "framer-motion";
import { ArrowUp } from "lucide-react";
import { themeColors, type ThemeName } from "../../utils/theme";

interface PointerProps {
  labels: string[];
  x: number;
  y: number;
  themeClass?: string;
  randomColor?: boolean;
}

export default function Pointer({ labels, x, y, themeClass = "border-[#3d3d45]", randomColor }: PointerProps) {
  if (labels.length === 0) return null;

  let customStyle: React.CSSProperties = {};
  let finalArrowClass = "text-[#c9c3b6]";

  if (randomColor && labels.length > 0) {
    const hash = labels[0].split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const themeNames = Object.keys(themeColors) as ThemeName[];
    const randomThemeName = themeNames[hash % themeNames.length];
    const bgColor = themeColors[randomThemeName].edge;

    customStyle = { backgroundColor: bgColor, color: "white", borderColor: "transparent" };
    finalArrowClass = "";
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
      className="absolute flex flex-col items-center justify-start z-20 pointer-events-none -translate-x-1/2"
      style={{ left: x, top: y + 26 }}
    >
      <ArrowUp
        className={`w-3.5 h-3.5 mb-1 ${randomColor ? "" : finalArrowClass}`}
        style={randomColor ? { color: customStyle.backgroundColor } : undefined}
      />
      <div
        className={`px-2 py-0.5 rounded-[6px] text-[10.5px] font-['JetBrains_Mono',monospace] font-bold uppercase tracking-wider shadow-[0_4px_10px_rgba(0,0,0,0.5)] bg-[#1c1c21] text-[#ededf0] border ${themeClass}`}
        style={customStyle}
      >
        {labels.join(", ")}
      </div>
    </motion.div>
  );
}
