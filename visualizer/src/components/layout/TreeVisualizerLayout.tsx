import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Panel, Group as PanelGroup } from "react-resizable-panels";
import ResizeHandle from "../shared/ResizeHandle";
import { usePlaybackTimer } from "../../hooks/usePlaybackTimer";
import { useKeyboardControls } from "../../hooks/useKeyboardControls";
import Header from "../shared/Header";
import Variables from "../shared/Variables";
import StackBucket from "../shared/StackBucket";
import Queue from "../shared/Queue";
import SourceCode from "../shared/SourceCode";
import Explanation from "../shared/Explanation";
import StepProgress from "../shared/StepProgress";
import CanvasViewport from "../shared/CanvasViewport";
import type { Frame } from "../../core/tree/types";
import { themeColors, type ThemeName } from "../../utils/theme";

interface TreeVisualizerLayoutProps {
  title: string;
  theme: ThemeName;
  layout: {
    nodes: any[];
    edges: any[];
  };
  frames: Frame[];
  code: { line: number; text: string }[];
  children?: React.ReactNode;
  headerChildren?: React.ReactNode;
  sidebarTitle?: string;
  sidebarMode?: "stack" | "queue";
  currentIdx?: number;
  setCurrentIdx?: React.Dispatch<React.SetStateAction<number>>;
  isPlaying?: boolean;
  setIsPlaying?: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function TreeVisualizerLayout({
  title,
  theme,
  layout,
  frames,
  code,
  children,
  headerChildren,
  sidebarTitle = "Call Stack",
  sidebarMode = "stack",
  currentIdx: controlledIdx,
  setCurrentIdx: setControlledIdx,
  isPlaying: controlledIsPlaying,
  setIsPlaying: setControlledIsPlaying,
}: TreeVisualizerLayoutProps) {
  const [internalIdx, setInternalIdx] = useState(0);
  const [internalIsPlaying, setInternalIsPlaying] = useState(false);

  const currentIdx = controlledIdx !== undefined ? controlledIdx : internalIdx;
  const setCurrentIdx =
    setControlledIdx !== undefined ? setControlledIdx : setInternalIdx;
  const isPlaying =
    controlledIsPlaying !== undefined ? controlledIsPlaying : internalIsPlaying;
  const setIsPlaying =
    setControlledIsPlaying !== undefined
      ? setControlledIsPlaying
      : setInternalIsPlaying;

  const modalSlot = children || headerChildren;

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
  };

  const frame: Frame = frames[currentIdx] || frames[0] || DEFAULT_FRAME;
  const activeLayout = frame.layout || layout;

  const handleNext = () =>
    setCurrentIdx((p) => Math.min(p + 1, frames.length - 1));
  const handlePrev = () => setCurrentIdx((p) => Math.max(p - 1, 0));
  const handleReset = () => {
    setCurrentIdx(0);
    setIsPlaying(false);
  };

  const colors = themeColors[theme] || themeColors.indigo;

  // Dynamic graph bounding box
  const { totalGraphWidth, totalGraphHeight, originX, originY } =
    useMemo(() => {
      let gMinX = Infinity;
      let gMaxX = -Infinity;
      let gMinY = Infinity;
      let gMaxY = -Infinity;

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
        gMaxY = 320;
      }

      const paddingX = 60;
      const paddingY = 40;

      return {
        totalGraphWidth: Math.max(500, gMaxX - gMinX + paddingX * 2),
        totalGraphHeight: Math.max(340, gMaxY - gMinY + paddingY * 2),
        originX: paddingX - gMinX,
        originY: paddingY - gMinY,
      };
    }, [frames]);

  const hasCallStack = useMemo(() => {
    return frames.some(
      (f) => Array.isArray(f.callStack) && f.callStack.length > 0,
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
        {modalSlot}
      </Header>

      <div className="flex-1 mt-4 overflow-hidden">
        <PanelGroup orientation="horizontal">
          {/* Main Interactive Canvas Area */}
          <Panel className="flex flex-col min-w-0 h-full">
            <div className="flex-1 relative bg-card rounded-md border border-border overflow-hidden shadow-inner flex flex-col h-full">
              <CanvasViewport className="flex-1 w-full h-full">
                <div className="flex flex-col items-center justify-center p-8 gap-6 min-w-[700px] w-full">
                  {/* 1. In-Canvas Queue Ribbon (when in Queue mode) */}
                  {hasCallStack && sidebarMode === "queue" && (
                    <Queue
                      queue={frame.callStack || []}
                      title={sidebarTitle}
                      theme={theme}
                      activeBgClass={colors.callStackBg}
                      activeTextClass={colors.callStackText}
                      activeBorderClass={colors.callStackBorder}
                    />
                  )}

                  {/* 2. In-Canvas Content Flow (Tree Graph + Stack on Left + Variables on Right) */}
                  <div className="flex items-start justify-center gap-12 w-full pt-2">
                    {hasCallStack && sidebarMode === "stack" && (
                      <div className="shrink-0">
                        <StackBucket
                          stack={frame.callStack || []}
                          title={sidebarTitle || "Recursion Stack"}
                          themeColorClass={colors.titleClass}
                          activeBgClass={colors.callStackBg}
                          activeBorderClass={colors.callStackBorder}
                        />
                      </div>
                    )}

                    {/* Dynamic Tree Canvas */}
                    <div
                      className="relative shrink-0"
                      style={{
                        width: totalGraphWidth,
                        height: totalGraphHeight,
                      }}
                    >
                      <svg className="absolute inset-0 w-full h-full pointer-events-none overflow-visible">
                        {activeLayout.edges.map((edge) => (
                          <motion.line
                            key={edge.id}
                            x1={edge.x1 + originX}
                            y1={edge.y1 + originY}
                            x2={edge.x2 + originX}
                            y2={edge.y2 + originY}
                            stroke={edge.isNull ? colors.edgeNull : colors.edge}
                            strokeWidth={edge.isNull ? "2.5" : "3.5"}
                            strokeDasharray={edge.isNull ? "4 4" : "none"}
                            strokeLinecap="round"
                            initial={
                              edge.isNull ? { opacity: 0 } : { pathLength: 0 }
                            }
                            animate={
                              edge.isNull ? { opacity: 1 } : { pathLength: 1 }
                            }
                            transition={{ duration: 0.4 }}
                          />
                        ))}
                      </svg>

                      <div className="absolute inset-0">
                        <AnimatePresence mode="popLayout">
                          {activeLayout.nodes.map((node) => {
                            const isActive =
                              node.id === frame.activeNodeId ||
                              (frame.activeNodeIds &&
                                frame.activeNodeIds.includes(node.id)) ||
                              node.status === "active";

                            const posX = node.x + originX;
                            const posY = node.y + originY;

                            if (node.isNull) {
                              return (
                                <motion.div
                                  key={node.id}
                                  layout
                                  initial={{ scale: 0, opacity: 0 }}
                                  animate={{
                                    scale: isActive ? 1.3 : 1,
                                    opacity: isActive ? 1 : 0.45,
                                    backgroundColor: isActive
                                      ? colors.nodeNullBg
                                      : "#0f172a",
                                    borderColor: isActive
                                      ? colors.nodeNullBorder
                                      : "#1e293b",
                                  }}
                                  exit={{ scale: 0, opacity: 0 }}
                                  transition={{
                                    type: "spring",
                                    stiffness: 300,
                                    damping: 20,
                                  }}
                                  className={`absolute w-5 h-5 -ml-2.5 -mt-2.5 rounded-full border-2 flex items-center justify-center shadow-md ${
                                    isActive
                                      ? "z-20 ring-2 ring-rose-400/50"
                                      : "z-0"
                                  }`}
                                  style={{ left: posX, top: posY }}
                                >
                                  {isActive && (
                                    <span className="text-[10px] font-bold text-rose-200">
                                      ∅
                                    </span>
                                  )}
                                </motion.div>
                              );
                            }

                            const isTarget = node.status === "target";
                            const isSecondary = node.status === "secondary";
                            const isSuccess = node.status === "success";

                            let bg = "#1e293b";
                            let border = "#334155";
                            let ringClass = "shadow-lg shadow-black/40";
                            let scale = 1;

                            if (isActive) {
                              bg = colors.nodeActiveBg;
                              border = colors.nodeActiveBorder;
                              ringClass =
                                "ring-4 ring-teal-400/40 shadow-xl shadow-teal-500/30";
                              scale = 1.18;
                            } else if (isTarget) {
                              bg = "#9a3412"; // orange-800
                              border = "#f97316"; // orange-500
                              ringClass =
                                "ring-2 ring-orange-400/50 shadow-lg shadow-orange-950/50";
                              scale = 1.15;
                            } else if (isSecondary) {
                              bg = "#4c1d95"; // violet-900
                              border = "#8b5cf6"; // violet-500
                              ringClass =
                                "ring-2 ring-violet-400/50 shadow-lg shadow-violet-950/50";
                              scale = 1.15;
                            } else if (isSuccess) {
                              bg = "#14532d"; // green-900
                              border = "#22c55e"; // green-500
                              ringClass =
                                "ring-2 ring-green-400/50 shadow-lg shadow-green-950/50";
                              scale = 1.15;
                            }

                            return (
                              <motion.div
                                key={node.id}
                                layout
                                initial={{ scale: 0, opacity: 0 }}
                                animate={{
                                  scale,
                                  opacity: 1,
                                  backgroundColor: bg,
                                  borderColor: border,
                                }}
                                exit={{ scale: 0, opacity: 0 }}
                                transition={{
                                  type: "spring",
                                  stiffness: 300,
                                  damping: 20,
                                }}
                                className={`absolute w-12 h-12 -ml-6 -mt-6 rounded-full border-2 flex items-center justify-center font-mono font-bold text-lg text-white select-none transition-colors duration-200 z-10 ${ringClass}`}
                                style={{ left: posX, top: posY }}
                              >
                                {node.val}
                              </motion.div>
                            );
                          })}
                        </AnimatePresence>
                      </div>
                    </div>

                    {/* Right Side: In-Canvas Variables State Card */}
                    <div className="shrink-0 pt-2">
                      <Variables
                        variables={{
                          ...frame.variables,
                          ...(frame.result
                            ? { result: `[${frame.result.join(", ")}]` }
                            : {}),
                        }}
                        highlightColorClass={colors.variablesText}
                      />
                    </div>
                  </div>
                </div>
              </CanvasViewport>

              {/* Step Progress & Phase Indicator (Canvas Bottom-Left) */}
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

          {/* Right Panel: Code & Explanation */}
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
