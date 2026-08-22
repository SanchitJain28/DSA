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
import CanvasViewport from "../shared/CanvasViewport";
import StepProgress from "../shared/StepProgress";
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
    frames.length,
  );

  useKeyboardControls(frames.length, setCurrentIdx, setIsPlaying);

  const DEFAULT_FRAME: SlidingWindowFrame = {
    phase: "Ready",
    codeLine: 1,
    message: "",
    variables: {},
    arrays: [],
  };

  const frame: SlidingWindowFrame =
    frames[currentIdx] || frames[0] || DEFAULT_FRAME;

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
                  {/* Sliding Window Arrays + Variables State Card on Right */}
                  <div className="w-full flex flex-wrap items-start justify-center gap-12 py-4">
                    <div className="flex flex-col items-center justify-center gap-10">
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
                                      ([_, pIdx]) => pIdx === idx,
                                    )
                                  : [];

                                const isElementActive =
                                  isActive || activePointers.length > 0;

                                return (
                                  <div
                                    key={idx}
                                    className="flex flex-col items-center relative"
                                  >
                                    {/* Pointers Overlay */}
                                    <div className="h-6 flex items-center justify-center gap-1 mb-1">
                                      <AnimatePresence>
                                        {activePointers.map(([pName]) => (
                                          <motion.span
                                            key={pName}
                                            initial={{
                                              opacity: 0,
                                              scale: 0.5,
                                              y: 5,
                                            }}
                                            animate={{
                                              opacity: 1,
                                              scale: 1,
                                              y: 0,
                                            }}
                                            exit={{
                                              opacity: 0,
                                              scale: 0.5,
                                              y: -5,
                                            }}
                                            className={`text-xs font-mono font-bold px-1.5 py-0.5 rounded shadow-sm ${
                                              pName === "L" ||
                                              pName === "start" ||
                                              pName === "left"
                                                ? "bg-amber-500/20 text-amber-300 border border-amber-500/40"
                                                : "bg-teal-500/20 text-teal-300 border border-teal-500/40"
                                            }`}
                                          >
                                            {pName}
                                          </motion.span>
                                        ))}
                                      </AnimatePresence>
                                    </div>

                                    <motion.div
                                      layout
                                      initial={{ scale: 0.8, opacity: 0 }}
                                      animate={{
                                        scale: isElementActive ? 1.05 : 1,
                                        opacity: 1,
                                        backgroundColor: isElementActive
                                          ? colors.nodeActiveBg || "#241a15"
                                          : "#18181b",
                                        borderColor: isElementActive
                                          ? colors.nodeActiveBorder || "#f97316"
                                          : "#2e2e32",
                                        boxShadow: isElementActive
                                          ? "0 4px 0 #9a3412, 0 8px 16px -2px rgba(249, 115, 22, 0.35)"
                                          : "0 1px 2px rgba(0,0,0,0.3)",
                                      }}
                                      transition={{
                                        type: "spring",
                                        stiffness: 350,
                                        damping: 22,
                                      }}
                                      className={`w-14 h-14 rounded-xl border-2 flex items-center justify-center font-mono font-bold text-xl select-none z-10 ${
                                        isElementActive
                                          ? "z-20 text-white font-extrabold"
                                          : "text-neutral-200"
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

                    {/* In-Canvas Variables State Card on Right */}
                    <div className="shrink-0 pt-6">
                      <Variables
                        variables={frame.variables}
                        highlightColorClass={colors.variablesText}
                      />
                    </div>
                  </div>
                </div>
              </CanvasViewport>

              {/* Step Progress & Phase Indicator */}
              <div className="absolute bottom-3 left-4 z-10">
                <StepProgress
                  label={frame.phase || "Phase"}
                  currentStep={currentIdx}
                  totalSteps={frames.length}
                  onStepClick={setCurrentIdx}
                />
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
