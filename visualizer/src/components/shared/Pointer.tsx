import { motion } from "framer-motion";
import { ArrowUp } from "lucide-react";

interface PointerProps {
  labels: string[];
  x: number;
  y: number;
  themeClass: string;
  randomColor?: boolean;
}

import { themeColors, type ThemeName } from "../../utils/theme";

export default function Pointer({ labels, x, y, themeClass, randomColor }: PointerProps) {
  if (labels.length === 0) return null;

  let customStyle: React.CSSProperties = {};
  let finalThemeClass = themeClass;
  let finalArrowClass = themeClass.replace("border-", "text-");

  if (randomColor && labels.length > 0) {
    const hash = labels[0].split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const themeNames = Object.keys(themeColors) as ThemeName[];
    const randomThemeName = themeNames[hash % themeNames.length];
    const bgColor = themeColors[randomThemeName].edge;
    
    customStyle = { backgroundColor: bgColor, color: 'white', borderColor: 'transparent' };
    finalThemeClass = "";
    // We can't easily dynamically set text color in tailwind if it's not safelisted, 
    // but we can set style color for the arrow too by using a span wrapper or directly on ArrowUp if we remove tailwind color class.
  }

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
      <ArrowUp 
        className={`w-4 h-4 mb-1 ${randomColor ? '' : finalArrowClass}`} 
        style={randomColor ? { color: customStyle.backgroundColor } : undefined}
      />
      <div 
        className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider shadow-lg bg-card border ${finalThemeClass}`}
        style={customStyle}
      >
        {labels.join(", ")}
      </div>
    </motion.div>
  );
}
