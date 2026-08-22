import React, { useState } from "react";
import { Panel, Group as PanelGroup } from "react-resizable-panels";
import ResizeHandle from "../shared/ResizeHandle";
import { usePlaybackTimer } from "../../hooks/usePlaybackTimer";
import { useKeyboardControls } from "../../hooks/useKeyboardControls";
import Header from "../shared/Header";
import Variables from "../shared/Variables";
import Explanation from "../shared/Explanation";
import SourceCode from "../shared/SourceCode";
import CanvasViewport from "../shared/CanvasViewport";
import StepProgress from "../shared/StepProgress";
import { themeColors, type ThemeName } from "../../utils/theme";

export interface HeapVisualizerLayoutProps {
  title: string;
  theme?: ThemeName;
  frames: any[];
  code: { line: number; text: string }[];
  children?: React.ReactNode; // For header config modal
  currentIdx?: number;
  setCurrentIdx?: React.Dispatch<React.SetStateAction<number>>;
  isPlaying?: boolean;
  setIsPlaying?: React.Dispatch<React.SetStateAction<boolean>>;
  onReset?: () => void;
  renderCanvasContent?: (frame: any) => React.ReactNode;
}

export default function HeapVisualizerLayout({
  title,
  theme = "emerald",
  frames,
  code,
  children,
  currentIdx: controlledIdx,
  setCurrentIdx: setControlledIdx,
  isPlaying: controlledIsPlaying,
  setIsPlaying: setControlledIsPlaying,
  onReset: customReset,
  renderCanvasContent,
}: HeapVisualizerLayoutProps) {
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

  const DEFAULT_FRAME = {
    variables: {},
    message: "No frame data",
    codeLine: 0,
    phase: "Ready",
  };

  const frame = frames[currentIdx] || frames[0] || DEFAULT_FRAME;

  const handleNext = () =>
    setCurrentIdx((p) => Math.min(p + 1, frames.length - 1));
  const handlePrev = () => setCurrentIdx((p) => Math.max(p - 1, 0));
  const handleReset = () => {
    setCurrentIdx(0);
    setIsPlaying(false);
    if (customReset) customReset();
  };

  const colors = themeColors[theme] || themeColors.emerald;

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
            <div className="flex-1 relative bg-card rounded-md border border-border overflow-hidden shadow-inner flex flex-col h-full">
              <CanvasViewport className="flex-1 w-full h-full">
                <div className="flex items-start justify-center p-8 gap-10 w-fit max-w-full mx-auto">
                  {renderCanvasContent && (
                    <div className="flex flex-col items-center gap-6 shrink-0">
                      {renderCanvasContent(frame)}
                    </div>
                  )}

                  {/* In-Canvas Variables State Card on Right */}
                  <div className="shrink-0 pt-2">
                    <Variables
                      variables={frame.variables}
                      highlightColorClass={colors.variablesText}
                    />
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
