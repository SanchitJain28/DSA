import React from "react";
import { Play, Pause, SkipForward, SkipBack, RotateCcw } from "lucide-react";
import { SidebarTrigger } from "../ui/sidebar";
import { type ThemeName } from "../../utils/theme";

interface HeaderProps {
  title: string;
  titleColorClass?: string;
  theme?: ThemeName;
  isPlaying: boolean;
  onPlayPause: () => void;
  onNext: () => void;
  onPrev: () => void;
  onReset: () => void;
  children?: React.ReactNode;
}

export default function Header({
  title,
  isPlaying,
  onPlayPause,
  onNext,
  onPrev,
  onReset,
  children,
}: HeaderProps) {
  return (
    <header className="flex items-center justify-between pb-1 select-none font-['Poppins',sans-serif]">
      {/* Title & Actions */}
      <div className="flex items-center gap-3">
        <SidebarTrigger className="text-[#8a8a93] hover:text-[#ededf0] hover:bg-[#141417] p-1.5 rounded-[8px] transition-colors cursor-pointer" />
        <h1 className="text-[21px] font-semibold text-[#ededf0] tracking-[-0.025em]">
          {title}
        </h1>
        {children && <div className="ml-1">{children}</div>}
      </div>

      {/* Recessed Playback Controls Track */}
      <div className="flex items-center gap-1 bg-[#141417] p-1 rounded-[12px]">
        <button
          type="button"
          onClick={onPrev}
          title="Previous Step (Left Arrow)"
          className="p-2 text-[#f2f2f5] bg-gradient-to-b from-[#33333a] to-[#26262c] border border-[#3d3d45] shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_2px_4px_rgba(0,0,0,0.45)] hover:from-[#3a3a42] hover:to-[#2c2c33] rounded-[8px] cursor-pointer transition-all active:scale-95"
        >
          <SkipBack className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={onPlayPause}
          title={isPlaying ? "Pause (Space)" : "Play (Space)"}
          className={`flex items-center gap-1.5 px-4 py-1.5 rounded-[8px] text-[13px] font-semibold cursor-pointer transition-all active:scale-95 ${
            isPlaying
              ? "text-[#f2f2f5] bg-gradient-to-b from-[#33333a] to-[#26262c] border border-[#3d3d45] shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_2px_4px_rgba(0,0,0,0.45)] hover:from-[#3a3a42] hover:to-[#2c2c33]"
              : "text-[#15150f] bg-gradient-to-b from-[#d6d0c4] to-[#c4beb0] border border-[#b3ac9d] shadow-[inset_0_1px_0_rgba(255,255,255,0.45),0_3px_8px_rgba(0,0,0,0.5)] hover:from-[#e2ddd2] hover:to-[#d2ccbe]"
          }`}
        >
          {isPlaying ? (
            <Pause className="w-4 h-4 fill-current" />
          ) : (
            <Play className="w-4 h-4 fill-current" />
          )}
          <span>{isPlaying ? "Pause" : "Play"}</span>
        </button>

        <button
          type="button"
          onClick={onNext}
          title="Next Step (Right Arrow)"
          className="p-2 text-[#f2f2f5] bg-gradient-to-b from-[#33333a] to-[#26262c] border border-[#3d3d45] shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_2px_4px_rgba(0,0,0,0.45)] hover:from-[#3a3a42] hover:to-[#2c2c33] rounded-[8px] cursor-pointer transition-all active:scale-95"
        >
          <SkipForward className="w-4 h-4" />
        </button>

        <div className="w-[1px] h-4 bg-[#26262c] mx-0.5" />

        <button
          type="button"
          onClick={onReset}
          title="Reset Simulation (R)"
          className="p-2 text-[#8a8a93] hover:text-[#ededf0] hover:bg-[#1c1c20] rounded-[8px] cursor-pointer transition-all"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
}
