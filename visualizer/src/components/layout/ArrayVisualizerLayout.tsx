import { useState } from "react";
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
import CallStack from "../shared/CallStack";
import type { ArrayFrame } from "../../core/array/types";
import { themeColors, type ThemeName } from "../../utils/theme";

interface ArrayVisualizerLayoutProps {
  title: string;
  theme: ThemeName;
  frames: ArrayFrame[];
  code: { line: number; text: string }[];
  headerChildren?: React.ReactNode;
}

export default function ArrayVisualizerLayout({
  title,
  theme,
  frames,
  code,
  headerChildren,
}: ArrayVisualizerLayoutProps) {
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
      >
        {headerChildren}
      </Header>

      <div className="flex-1 mt-4 overflow-hidden">
        <PanelGroup orientation="horizontal">
          {frame.hashMap && (
            <>
              <Panel
                collapsible={true}
                defaultSize="20"
                minSize="15"
                maxSize="40"
                className="relative flex flex-col min-w-0"
              >
                <div className="flex-1 flex flex-col overflow-hidden">
                  <HashMap
                    map={frame.hashMap}
                    activeBgClass={colors.callStackBg}
                    activeTextClass={colors.callStackText}
                    activeBorderClass={colors.callStackBorder}
                  />
                </div>
              </Panel>
              <ResizeHandle />
            </>
          )}

          {frame.callStack && frame.callStack.length > 1 && (
            <>
              <Panel
                collapsible={true}
                defaultSize="20"
                minSize="15"
                maxSize="40"
                className="relative flex flex-col min-w-0"
              >
                <div className="flex-1 flex flex-col overflow-hidden">
                  <CallStack
                    stack={frame.callStack}
                    activeBgClass={colors.callStackBg}
                    activeTextClass={colors.callStackText}
                    activeBorderClass={colors.callStackBorder}
                  />
                </div>
              </Panel>
              <ResizeHandle />
            </>
          )}

          <Panel className="flex flex-col gap-4 min-w-0">
            <div className="flex-1 relative bg-card rounded-xl border border-border overflow-hidden shadow-inner flex flex-col items-center justify-center p-8 gap-12">
              {frame.grid ? (
                <SudokuGridRenderer grid={frame.grid} colors={colors} />
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
