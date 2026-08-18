import React, { useState, useMemo } from "react";
import { Panel, Group as PanelGroup } from "react-resizable-panels";
import ResizeHandle from "../shared/ResizeHandle";
import { usePlaybackTimer } from "../../hooks/usePlaybackTimer";
import { useKeyboardControls } from "../../hooks/useKeyboardControls";
import StackBucket from "../shared/StackBucket";
import Variables from "../shared/Variables";
import Explanation from "../shared/Explanation";
import Header from "../shared/Header";
import SourceCode from "../shared/SourceCode";
import CanvasViewport from "../shared/CanvasViewport";
import StepProgress from "../shared/StepProgress";
import LinkedListEdges from "../linked-list/LinkedListEdges";
import LinkedListNodes from "../linked-list/LinkedListNodes";
import type { Frame } from "../../core/linked-list/types";
import { themeColors, type ThemeName } from "../../utils/theme";

export interface LinkedListVisualizerLayoutProps {
  title: string;
  theme: ThemeName;
  frames: Frame[];
  code: { line: number; text: string }[];
  children?: React.ReactNode;
  currentIdx?: number;
  setCurrentIdx?: React.Dispatch<React.SetStateAction<number>>;
  isPlaying?: boolean;
  setIsPlaying?: React.Dispatch<React.SetStateAction<boolean>>;
  onReset?: () => void;
}

export default function LinkedListVisualizerLayout({
  title,
  theme,
  frames,
  code,
  children,
  currentIdx: controlledIdx,
  setCurrentIdx: setControlledIdx,
  isPlaying: controlledIsPlaying,
  setIsPlaying: setControlledIsPlaying,
  onReset: customReset,
}: LinkedListVisualizerLayoutProps) {
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

  const DEFAULT_FRAME: Frame = {
    variables: {},
    message: "No frame data",
    codeLine: 0,
    phase: "Ready",
    layout: { nodes: [], edges: [] },
  };

  const frame: Frame = frames[currentIdx] || frames[0] || DEFAULT_FRAME;

  const handleNext = () =>
    setCurrentIdx((p) => Math.min(p + 1, frames.length - 1));
  const handlePrev = () => setCurrentIdx((p) => Math.max(p - 1, 0));
  const handleReset = () => {
    setCurrentIdx(0);
    setIsPlaying(false);
    if (customReset) customReset();
  };

  const colors = themeColors[theme] || themeColors.indigo;
  const layout = frame.layout || { nodes: [], edges: [] };

  const { totalGraphWidth, totalGraphHeight, originX, originY } =
    useMemo(() => {
      let gMinX = Infinity,
        gMaxX = -Infinity,
        gMinY = Infinity,
        gMaxY = -Infinity;

      for (const f of frames) {
        for (const n of f.layout?.nodes || []) {
          if (n.x < gMinX) gMinX = n.x;
          if (n.x > gMaxX) gMaxX = n.x;
          if (n.y < gMinY) gMinY = n.y;
          if (n.y > gMaxY) gMaxY = n.y;
        }
      }

      if (gMinX === Infinity) {
        gMinX = 0;
        gMaxX = 600;
        gMinY = 0;
        gMaxY = 160;
      }

      const paddingX = 80;
      const paddingY = 80;

      return {
        totalGraphWidth: Math.max(360, gMaxX - gMinX + paddingX * 2),
        totalGraphHeight: Math.max(180, gMaxY - gMinY + paddingY * 2),
        originX: paddingX - gMinX,
        originY: paddingY - gMinY,
      };
    }, [frames]);

  const hasCallStack = useMemo(() => {
    return frames.some(
      (f) => Array.isArray(f.callStack) && f.callStack.length > 1,
    );
  }, [frames]);

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
                <div className="flex flex-col items-center justify-center p-8 gap-8 min-w-[700px] w-full">
                  <Variables
                    variables={frame.variables}
                    highlightColorClass={colors.variablesText}
                  />

                  <div className="flex items-start justify-center gap-12 w-full pt-2">
                    {hasCallStack && (
                      <div className="shrink-0">
                        <StackBucket
                          stack={frame.callStack || []}
                          title="Recursion Stack"
                          themeColorClass={colors.variablesText}
                          activeBgClass={colors.callStackBg}
                          activeBorderClass={colors.callStackBorder}
                        />
                      </div>
                    )}

                    <div
                      className="relative bg-transparent flex items-center justify-center"
                      style={{
                        width: totalGraphWidth,
                        height: totalGraphHeight,
                      }}
                    >
                      <div
                        style={{
                          transform: `translate(${originX}px, ${originY}px)`,
                          width: "100%",
                          height: "100%",
                          position: "absolute",
                        }}
                      >
                        <LinkedListEdges edges={layout.edges} theme={theme} />
                        <LinkedListNodes
                          nodes={layout.nodes}
                          pointers={frame.pointers}
                          activeNodeId={frame.activeNodeId}
                          theme={theme}
                        />
                      </div>
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
