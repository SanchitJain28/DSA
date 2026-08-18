import React, { useState } from "react";
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
import CanvasViewport from "../shared/CanvasViewport";
import type { SlidingWindowFrame } from "../../core/sliding-window/types";
import { themeColors, type ThemeName } from "../../utils/theme";

export interface SlidingWindowVisualizerLayoutProps {
  title: string;
  theme?: ThemeName;
  frames: SlidingWindowFrame[];
  code: { line: number; text: string }[];
  children?: React.ReactNode;
  currentIdx?: number;
  setCurrentIdx?: React.Dispatch<React.SetStateAction<number>>;
  isPlaying?: boolean;
  setIsPlaying?: React.Dispatch<React.SetStateAction<boolean>>;
  onReset?: () => void;
}

export default function SlidingWindowVisualizerLayout({
  title,
  theme = "indigo",
  frames,
  code,
  children,
  currentIdx: controlledIdx,
  setCurrentIdx: setControlledIdx,
  isPlaying: controlledIsPlaying,
  setIsPlaying: setControlledIsPlaying,
  onReset: customReset,
}: SlidingWindowVisualizerLayoutProps) {
  const [internalIdx, setInternalIdx] = useState(0);
  const [internalIsPlaying, setInternalIsPlaying] = useState(false);

  const isControlled =
    controlledIdx !== undefined && setControlledIdx !== undefined;
  const currentIdx = isControlled ? controlledIdx : internalIdx;
  const setCurrentIdx = isControlled ? setControlledIdx : setInternalIdx;

  const isPlayingControlled =
    controlledIsPlaying !== undefined && setControlledIsPlaying !== undefined;
  const isPlaying = isPlayingControlled
    ? controlledIsPlaying
    : internalIsPlaying;
  const setIsPlaying = isPlayingControlled
    ? setControlledIsPlaying
    : setInternalIsPlaying;

  usePlaybackTimer(
    isPlaying,
    setIsPlaying,
    currentIdx,
    setCurrentIdx,
    frames.length
  );

  useKeyboardControls(frames.length, setCurrentIdx, setIsPlaying);

  const frame = frames[currentIdx] ||
    frames[0] || {
      phase: "Ready",
      codeLine: 1,
      message: "",
      variables: {},
      arrays: [],
    };

  const handleNext = () =>
    setCurrentIdx((p) => Math.min(p + 1, frames.length - 1));
  const handlePrev = () => setCurrentIdx((p) => Math.max(p - 1, 0));
  const handleReset = () => {
    setCurrentIdx(0);
    setIsPlaying(false);
    if (customReset) customReset();
  };

  const colors = themeColors[theme] || themeColors.indigo;

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
      >
        {children}
      </Header>

      <div className="flex-1 mt-4 overflow-hidden">
        <PanelGroup orientation="horizontal">
          <Panel className="flex flex-col min-w-0 h-full">
            {/* Main Interactive Canvas Area */}
            <div className="flex-1 relative bg-card rounded-md border border-border overflow-hidden shadow-inner flex flex-col h-full">
              <CanvasViewport className="flex-1 w-full h-full">
                <div className="flex flex-col items-center justify-center p-8 gap-8 min-w-[700px] w-full mx-auto">
                  {/* 1. In-Canvas Variables Strip */}
                  <Variables
                    variables={frame.variables}
                    highlightColorClass={colors.variablesText}
                  />

                  {/* 2. Sliding Window Arrays Flow */}
                  <div className="w-full flex flex-col items-center justify-center gap-10 py-4">
                    <AnimatePresence mode="popLayout">
                      {frame.arrays?.map((arr) => (
                        <div
                          key={arr.id}
                          className="flex flex-col items-start w-fit bg-transparent"
                        >
                          <div className="text-muted-foreground font-mono font-bold text-xs uppercase tracking-wider mb-4 ml-2">
                            {arr.name || arr.id}
                          </div>

                          <div className="relative flex items-center gap-2">
                            {/* Sliding Window Bounding Box Overlay */}
                            {arr.windows?.map((window, wIdx) => {
                              // Box: 56px (w-14) + 8px gap (gap-2) = 64px stride
                              const startOffset = window.start * 64 - 10;
                              const numElements = window.end - window.start + 1;
                              const width =
                                numElements > 0
                                  ? numElements * 56 +
                                    (numElements - 1) * 8 +
                                    20
                                  : 0;

                              return (
                                <motion.div
                                  key={`window-${wIdx}`}
                                  layout
                                  initial={{ opacity: 0 }}
                                  animate={{
                                    opacity: 1,
                                    x: startOffset,
                                    width,
                                  }}
                                  transition={{
                                    type: "spring",
                                    stiffness: 300,
                                    damping: 25,
                                  }}
                                  className={`absolute -top-3 h-[80px] rounded-md z-20 pointer-events-none border-2 bg-indigo-500/10 shadow-sm ${
                                    window.colorClass ||
                                    "border-indigo-400 shadow-indigo-500/20"
                                  }`}
                                  style={{ originX: 0 }}
                                />
                              );
                            })}

                            {arr.values?.map((val, idx) => {
                              const nodeId = `${arr.id}-${idx}`;
                              const isActive =
                                frame.activeNodeId === nodeId ||
                                (frame.activeNodeIds?.includes(nodeId) ??
                                  false);

                              // Active pointers for this index (e.g. L, R)
                              const activePointers = arr.pointers
                                ? Object.entries(arr.pointers).filter(
                                    ([_, pIdx]) => pIdx === idx
                                  )
                                : [];

                              return (
                                <div
                                  key={idx}
                                  className="relative flex flex-col items-center"
                                >
                                  {/* Pointer Badges */}
                                  {activePointers.length > 0 && (
                                    <Pointer
                                      labels={activePointers.map(
                                        ([label]) => label
                                      )}
                                      x={28}
                                      y={34}
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
                                    className={`w-14 h-14 rounded-md border-2 flex items-center justify-center font-mono font-bold text-xl shadow-md z-10 select-none ${
                                      isActive ? "z-20" : ""
                                    }`}
                                  >
                                    {val !== null ? String(val) : ""}
                                  </motion.div>

                                  <div className="text-[10px] font-mono text-muted-foreground mt-2">
                                    {idx}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      ))}
                    </AnimatePresence>
                  </div>
                </div>
              </CanvasViewport>

              {/* Phase Indicator */}
              <div className="absolute bottom-3 left-4 text-xs text-neutral-400 font-medium z-10 pointer-events-none">
                Phase: <span className={colors.phaseText}>{frame.phase}</span>
              </div>
            </div>
          </Panel>

          <ResizeHandle />

          <Panel
            defaultSize="30"
            minSize="20"
            className="flex flex-col gap-4 min-w-0"
          >
            <Explanation
              message={frame.message}
              className={`h-32 rounded-md border p-4 shadow-inner shrink-0 ${colors.explanationBg} ${colors.explanationBorder}`}
            />
            <SourceCode code={code} activeLine={frame.codeLine} theme={theme} />
          </Panel>
        </PanelGroup>
      </div>
    </div>
  );
}
