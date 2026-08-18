import React, { useState } from "react";
import { AnimatePresence } from "framer-motion";
import { Panel, Group as PanelGroup } from "react-resizable-panels";
import ResizeHandle from "../shared/ResizeHandle";
import { usePlaybackTimer } from "../../hooks/usePlaybackTimer";
import { useKeyboardControls } from "../../hooks/useKeyboardControls";
import Header from "../shared/Header";
import Variables from "../shared/Variables";
import SourceCode from "../shared/SourceCode";
import Explanation from "../shared/Explanation";
import { ArrayRenderer } from "../shared/ArrayRenderer";
import DataStack from "../shared/DataStack";
import CanvasViewport from "../shared/CanvasViewport";
import StepProgress from "../shared/StepProgress";
import type { StackFrame } from "../../core/stack/types";
import { themeColors, type ThemeName } from "../../utils/theme";

export interface StackVisualizerLayoutProps {
  title: string;
  theme?: ThemeName;
  frames: StackFrame[];
  code: { line: number; text: string }[];
  children?: React.ReactNode;
  headerChildren?: React.ReactNode; // Backward compatibility
  currentIdx?: number;
  setCurrentIdx?: React.Dispatch<React.SetStateAction<number>>;
  isPlaying?: boolean;
  setIsPlaying?: React.Dispatch<React.SetStateAction<boolean>>;
  onReset?: () => void;
  renderExtraCanvasContent?: (frame: StackFrame) => React.ReactNode;
}

export default function StackVisualizerLayout({
  title,
  theme = "indigo",
  frames,
  code,
  children,
  headerChildren,
  currentIdx: controlledIdx,
  setCurrentIdx: setControlledIdx,
  isPlaying: controlledIsPlaying,
  setIsPlaying: setControlledIsPlaying,
  onReset,
  renderExtraCanvasContent,
}: StackVisualizerLayoutProps) {
  const [internalIdx, setInternalIdx] = useState(0);
  const [internalIsPlaying, setInternalIsPlaying] = useState(false);

  const currentIdx = controlledIdx !== undefined ? controlledIdx : internalIdx;
  const setCurrentIdx =
    setControlledIdx !== undefined ? setControlledIdx : setInternalIdx;
  const isPlaying =
    controlledIsPlaying !== undefined
      ? controlledIsPlaying
      : internalIsPlaying;
  const setIsPlaying =
    setControlledIsPlaying !== undefined
      ? setControlledIsPlaying
      : setInternalIsPlaying;

  const DEFAULT_FRAME: StackFrame = {
    variables: {},
    message: "No frame data",
    codeLine: 0,
    phase: "Idle",
    stacks: [],
    arrays: [],
  };

  const frame: StackFrame = frames[currentIdx] || frames[0] || DEFAULT_FRAME;

  usePlaybackTimer(
    isPlaying,
    setIsPlaying,
    currentIdx,
    setCurrentIdx,
    frames.length
  );

  useKeyboardControls(frames.length, setCurrentIdx, setIsPlaying);

  const handleNext = () => {
    if (currentIdx < frames.length - 1) {
      setCurrentIdx(currentIdx + 1);
    }
  };

  const handlePrev = () => {
    if (currentIdx > 0) {
      setCurrentIdx(currentIdx - 1);
    }
  };

  const handleReset = () => {
    setCurrentIdx(0);
    setIsPlaying(false);
    onReset?.();
  };

  const colors = themeColors[theme] || themeColors.indigo;
  const modalSlot = children || headerChildren;

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
        {modalSlot}
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

                  {/* 2. Extra In-Canvas Monotonic Pole Sight Chart (if provided) */}
                  {renderExtraCanvasContent && renderExtraCanvasContent(frame)}

                  {/* 3. Arrays and Physical Data Stacks In-Canvas Flow */}
                  <div className="w-full flex flex-wrap items-start justify-center gap-12 py-2">
                    {/* Data Stacks */}
                    {frame.stacks?.map((st) => (
                      <DataStack
                        key={st.id}
                        stack={st.values}
                        title={st.name || "Stack (LIFO)"}
                        theme={theme}
                        showTopPointer={st.topPointer ?? true}
                      />
                    ))}

                    {/* Arrays */}
                    {frame.arrays && frame.arrays.length > 0 && (
                      <div className="flex flex-col items-center justify-center gap-8 pt-2">
                        <AnimatePresence mode="popLayout">
                          {frame.arrays.map((arr) => (
                            <ArrayRenderer
                              key={arr.id}
                              arr={arr}
                              frame={frame}
                              colors={colors}
                            />
                          ))}
                        </AnimatePresence>
                      </div>
                    )}
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
