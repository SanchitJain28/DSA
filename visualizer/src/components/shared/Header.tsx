import React from "react";
import { Play, Pause, SkipForward, SkipBack, RotateCcw } from "lucide-react";
import { SidebarTrigger } from "../ui/sidebar";
import { type ThemeName } from "../../utils/theme";

interface HeaderProps {
  title: string;
  titleColorClass: string;
  theme?: ThemeName;
  isPlaying: boolean;
  onPlayPause: () => void;
  onNext: () => void;
  onPrev: () => void;
  onReset: () => void;
  children?: React.ReactNode;
}

const playButtonClasses: Record<ThemeName, string> = {
  cyan: "bg-cyan-600 hover:bg-cyan-500",
  orange: "bg-orange-600 hover:bg-orange-500",
  fuchsia: "bg-fuchsia-600 hover:bg-fuchsia-500",
  emerald: "bg-emerald-600 hover:bg-emerald-500",
  teal: "bg-teal-600 hover:bg-teal-500",
  indigo: "bg-indigo-600 hover:bg-indigo-500",
  rose: "bg-rose-600 hover:bg-rose-500",
  violet: "bg-violet-600 hover:bg-violet-500",
  amber: "bg-amber-600 hover:bg-amber-500",
  sky: "bg-sky-600 hover:bg-sky-500",
};

export default function Header({
  title,
  titleColorClass,
  theme = "indigo",
  isPlaying,
  onPlayPause,
  onNext,
  onPrev,
  onReset,
  children,
}: HeaderProps) {
  const activePlayClass = playButtonClasses[theme];
  return (
    <header className="flex items-center justify-between pb-4 border-b border-gray-800">
      <div className="flex items-center">
        <SidebarTrigger className="text-gray-400 hover:text-white mr-4" />
        <h1
          className={`text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r ${titleColorClass}`}
        >
          {title}
        </h1>
        {children}
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={onPrev}
          className="p-2 bg-gray-800 text-gray-300 rounded-lg hover:bg-gray-700 hover:text-white transition-colors"
        >
          <SkipBack size={18} />
        </button>
        <button
          onClick={onPlayPause}
          className={`flex items-center gap-2 px-4 py-2 text-white font-bold rounded-lg transition-colors ${activePlayClass}`}
        >
          {isPlaying ? <Pause size={18} /> : <Play size={18} />}
          {isPlaying ? "Pause" : "Play"}
        </button>
        <button
          onClick={onNext}
          className="p-2 bg-gray-800 text-gray-300 rounded-lg hover:bg-gray-700 hover:text-white transition-colors"
        >
          <SkipForward size={18} />
        </button>
        <button
          onClick={onReset}
          className="p-2 bg-gray-800 text-gray-300 rounded-lg hover:bg-gray-700 hover:text-white transition-colors ml-2"
          title="Reset"
        >
          <RotateCcw size={18} />
        </button>
      </div>
    </header>
  );
}
