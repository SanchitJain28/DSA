import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Panel, Group as PanelGroup } from "react-resizable-panels";
import ResizeHandle from "../shared/ResizeHandle";
import { usePlaybackTimer } from "../../hooks/usePlaybackTimer";
import { useKeyboardControls } from "../../hooks/useKeyboardControls";
import Header from "../shared/Header";
import Variables from "../shared/Variables";
import SourceCode from "../shared/SourceCode";
import Explanation from "../shared/Explanation";
import Pointer from "../shared/Pointer";
import type { SlidingWindowFrame } from "../../core/sliding-window/types";
import { themeColors, type ThemeName } from "../../utils/theme";

interface SlidingWindowVisualizerLayoutProps {
  title: string;
  theme: ThemeName;
  frames: SlidingWindowFrame[];
  code: { line: number; text: string }[];
}

export default function SlidingWindowVisualizerLayout({
  title,
  theme,
  frames,
  code,
}: SlidingWindowVisualizerLayoutProps) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  usePlaybackTimer(
    isPlaying,
    setIsPlaying,
    currentIdx,
    setCurrentIdx,
    frames.length,
  );

  useKeyboardControls(frames.length, setCurrentIdx, setIsPlaying);

  const frame = frames[currentIdx];

  const handleNext = () =>
    setCurrentIdx((p) => Math.min(p + 1, frames.length - 1));
  const handlePrev = () => setCurrentIdx((p) => Math.max(p - 1, 0));
  const handleReset = () => {
    setCurrentIdx(0);
    setIsPlaying(false);
  };

  const colors = themeColors[theme];

  return (
    <div className="flex flex-col h-screen bg-background text-foreground font-sans p-4">
      <Header
        title={title}
        titleColorClass={colors.titleClass}
        theme={theme}
        isPlaying={isPlaying}
        onPlayPause={() => setIsPlaying(!isPlaying)}
        onNext={handleNext}
        onPrev={handlePrev}
        onReset={handleReset}
      />

      <div className="flex-1 mt-4 overflow-hidden">
        <PanelGroup orientation="horizontal">
          <Panel className="flex flex-col gap-4 min-w-0">
            <div className="flex-1 relative bg-card rounded-xl border border-border overflow-hidden shadow-inner flex flex-col items-center justify-center p-8 gap-12">
              <AnimatePresence mode="popLayout">
                {frame.arrays.map((arr) => (
                  <div
                    key={arr.id}
                    className="flex flex-col items-start w-fit"
                  >
                    <div className="text-muted-foreground font-bold mb-4 ml-2">
                      {arr.name || arr.id}
                    </div>

                    <div className="relative flex items-center gap-2">
                      {/* SLIDING WINDOW OVERLAY */}
                      {arr.windows?.map((window, wIdx) => {
                        // The box is 56px (w-14) + 8px gap (gap-2) = 64px stride
                        const startOffset = window.start * 64 - 12; 
                        // The width is number of elements * 56 + number of gaps * 8, plus 24px extra padding to surround (12px each side)
                        const numElements = window.end - window.start + 1;
                        const width = numElements > 0 ? (numElements * 56 + (numElements - 1) * 8 + 24) : 0;
                        
                        return (
                          <motion.div
                            key={`window-${wIdx}`}
                            layout
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1, x: startOffset, width }}
                            transition={{ type: "spring", stiffness: 300, damping: 25 }}
                            // -top-4 moves it up 16px, h-[88px] is (56px box + 32px extra height for 16px top and bottom)
                            className={`absolute -top-4 h-[88px] rounded-lg z-20 pointer-events-none border-[3px] ${window.colorClass || `border-white`}`}
                            style={{ originX: 0 }}
                          />
                        );
                      })}

                      {arr.values.map((val, idx) => {
                        const nodeId = `${arr.id}-${idx}`;
                        const isActive =
                          frame.activeNodeId === nodeId ||
                          frame.activeNodeIds?.includes(nodeId);

                        // Find pointers for this index
                        const activePointers = arr.pointers
                          ? Object.entries(arr.pointers).filter(
                              ([_, pIdx]) => pIdx === idx,
                            )
                          : [];

                        return (
                          <div
                            key={idx}
                            className="relative flex flex-col items-center"
                          >
                            {/* Bottom Pointers using the shared component */}
                            {activePointers.length > 0 && (
                              <Pointer
                                labels={activePointers.map(([label]) => label)}
                                x={28} // Center of the 56px (w-14) box
                                y={34} // Bottom of the box
                                themeClass={colors.callStackBorder}
                              />
                            )}

                            <motion.div
                              layout
                              initial={{ scale: 0.8, opacity: 0 }}
                              animate={{
                                scale: isActive ? 1.1 : 1,
                                opacity: 1,
                                backgroundColor: isActive
                                  ? colors.nodeActiveBg
                                  : "#1f2937",
                                borderColor: isActive
                                  ? colors.nodeActiveBorder
                                  : "#374151",
                              }}
                              transition={{
                                type: "spring",
                                stiffness: 300,
                                damping: 20,
                              }}
                              className={`w-14 h-14 rounded-lg border-2 flex items-center justify-center font-bold text-lg shadow-lg z-10 ${isActive ? "z-20" : ""}`}
                            >
                              {val !== null ? val : ""}
                            </motion.div>
                            <div className="text-[10px] text-muted-foreground mt-2">
                              {idx}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </AnimatePresence>

              <div className="absolute bottom-4 left-4 text-sm text-muted-foreground font-medium">
                Phase: <span className={colors.phaseText}>{frame.phase}</span>
              </div>
            </div>

            <div className="h-28 shrink-0">
              <Variables
                variables={frame.variables || {}}
                highlightColorClass={colors.variablesText}
              />
            </div>
          </Panel>

          <ResizeHandle />

          <Panel
            defaultSize="30"
            minSize="20"
            className="flex flex-col gap-4 min-w-0"
          >
            <SourceCode code={code} activeLine={frame.codeLine} theme={theme} />
            <Explanation
              message={frame.message}
              className={`h-32 rounded-xl border p-4 shadow-inner shrink-0 ${colors.explanationBg} ${colors.explanationBorder}`}
            />
          </Panel>
        </PanelGroup>
      </div>
    </div>
  );
}
