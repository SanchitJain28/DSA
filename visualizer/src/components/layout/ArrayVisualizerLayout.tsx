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
import SudokuGridRenderer from "../shared/SudokuGridRenderer";
import HashMap from "../shared/HashMap";
import StackBucket from "../shared/StackBucket";
import CanvasViewport from "../shared/CanvasViewport";
import type { ArrayFrame } from "../../core/array/types";
import { themeColors, type ThemeName } from "../../utils/theme";

export interface ArrayVisualizerLayoutProps {
  title: string;
  theme?: ThemeName;
  frames: ArrayFrame[];
  code: { line: number; text: string }[];
  children?: React.ReactNode;
  headerChildren?: React.ReactNode; // Backward compatibility
  currentIdx?: number;
  setCurrentIdx?: React.Dispatch<React.SetStateAction<number>>;
  isPlaying?: boolean;
  setIsPlaying?: React.Dispatch<React.SetStateAction<boolean>>;
  onReset?: () => void;
  renderExtraCanvasContent?: (frame: ArrayFrame) => React.ReactNode;
}

export default function ArrayVisualizerLayout({
  title,
  theme = "violet",
  frames,
  code,
  children,
  headerChildren,
  currentIdx: controlledIdx,
  setCurrentIdx: setControlledIdx,
  isPlaying: controlledIsPlaying,
  setIsPlaying: setControlledIsPlaying,
  onReset: customReset,
  renderExtraCanvasContent,
}: ArrayVisualizerLayoutProps) {
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
    };

  const handleNext = () =>
    setCurrentIdx((p) => Math.min(p + 1, frames.length - 1));
  const handlePrev = () => setCurrentIdx((p) => Math.max(p - 1, 0));
  const handleReset = () => {
    setCurrentIdx(0);
    setIsPlaying(false);
    if (customReset) customReset();
  };

  const colors = themeColors[theme] || themeColors.violet;
  const modalSlot = children || headerChildren;

  const hasHashMap = frame.hashMap && Object.keys(frame.hashMap).length >= 0;

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

                  {/* 2. Extra In-Canvas Content (if provided) */}
                  {renderExtraCanvasContent && renderExtraCanvasContent(frame)}

                  {/* 3. Arrays and HashMap In-Canvas Container */}
                  <div className="w-full flex flex-wrap items-start justify-center gap-10 py-2">
                    {/* Arrays / Grid */}
                    <div className="flex flex-col items-center justify-center gap-8">
                      {frame.grid ? (
                        <SudokuGridRenderer
                          grid={frame.grid}
                          colors={colors}
                        />
                      ) : (
                        <AnimatePresence mode="popLayout">
                          {frame.arrays?.map((arr) => (
                            <ArrayRenderer
                              key={arr.id}
                              arr={arr}
                              frame={frame}
                              colors={colors}
                            />
                          ))}
                        </AnimatePresence>
                      )}
                    </div>

                    {/* In-Canvas HashMap */}
                    {hasHashMap && (
                      <div className="shrink-0 pt-2">
                        <HashMap
                          map={frame.hashMap}
                          theme={theme}
                          activeTextClass={colors.titleClass}
                        />
                      </div>
                    )}

                    {/* In-Canvas Call Stack Bucket */}
                    {frame.callStack && frame.callStack.length > 1 && (
                      <div className="shrink-0 pt-2">
                        <StackBucket
                          stack={frame.callStack}
                          themeColorClass={colors.titleClass}
                          activeBgClass={colors.callStackBg}
                          activeBorderClass={colors.callStackBorder}
                        />
                      </div>
                    )}
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
