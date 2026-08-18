import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Panel, Group as PanelGroup } from "react-resizable-panels";
import ResizeHandle from "../shared/ResizeHandle";
import { usePlaybackTimer } from "../../hooks/usePlaybackTimer";
import { useKeyboardControls } from "../../hooks/useKeyboardControls";
import Header from "../shared/Header";
import Variables from "../shared/Variables";
import CallStack from "../shared/CallStack";
import SourceCode from "../shared/SourceCode";
import Explanation from "../shared/Explanation";
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
  sidebarTitle,
  sidebarMode,
  currentIdx: controlledIdx,
  setCurrentIdx: setControlledIdx,
  isPlaying: controlledIsPlaying,
  setIsPlaying: setControlledIsPlaying,
}: TreeVisualizerLayoutProps) {
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

  const modalSlot = children || headerChildren;

  usePlaybackTimer(
    isPlaying,
    setIsPlaying,
    currentIdx,
    setCurrentIdx,
    frames.length,
  );

  useKeyboardControls(frames.length, setCurrentIdx, setIsPlaying);

  const frame = frames[currentIdx];
  const activeLayout = frame.layout || layout;

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
        {modalSlot}
      </Header>

      <div className="flex-1 mt-4 overflow-hidden">
        <PanelGroup orientation="horizontal">
          <Panel
            collapsible={true}
            defaultSize="20"
            minSize="15"
            maxSize="40"
            className="relative flex flex-col min-w-0"
          >
            <div className="flex-1 flex flex-col overflow-hidden">
              <CallStack
                stack={frame.callStack || []}
                activeBgClass={colors.callStackBg}
                activeTextClass={colors.callStackText}
                activeBorderClass={colors.callStackBorder}
                title={sidebarTitle}
                mode={sidebarMode}
              />
            </div>
          </Panel>

          <ResizeHandle />

          <Panel className="flex flex-col gap-4 min-w-0">
            <div className="flex-1 relative bg-card rounded-xl border border-border overflow-hidden shadow-inner flex items-center justify-center">
              <div className="relative" style={{ width: 600, height: 400 }}>
                <svg className="absolute inset-0 w-full h-full pointer-events-none overflow-visible">
                  {activeLayout.edges.map((edge) => (
                    <motion.line
                      key={edge.id}
                      x1={edge.x1}
                      y1={edge.y1}
                      x2={edge.x2}
                      y2={edge.y2}
                      stroke={edge.isNull ? colors.edgeNull : colors.edge}
                      strokeWidth={edge.isNull ? "2.5" : "3.5"}
                      strokeDasharray={edge.isNull ? "4 4" : "none"}
                      strokeLinecap="round"
                      initial={edge.isNull ? { opacity: 0 } : { pathLength: 0 }}
                      animate={edge.isNull ? { opacity: 1 } : { pathLength: 1 }}
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
                              isActive ? "z-20 ring-2 ring-rose-400/50" : "z-0"
                            }`}
                            style={{ left: node.x, top: node.y }}
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
                        ringClass = "ring-4 ring-teal-400/40 shadow-xl shadow-teal-500/30";
                        scale = 1.18;
                      } else if (isTarget) {
                        bg = "#9a3412"; // orange-800
                        border = "#f97316"; // orange-500
                        ringClass = "ring-2 ring-orange-400/50 shadow-lg shadow-orange-950/50";
                        scale = 1.15;
                      } else if (isSecondary) {
                        bg = "#4c1d95"; // violet-900
                        border = "#8b5cf6"; // violet-500
                        ringClass = "ring-2 ring-violet-400/50 shadow-lg shadow-violet-950/50";
                        scale = 1.15;
                      } else if (isSuccess) {
                        bg = "#14532d"; // green-900
                        border = "#22c55e"; // green-500
                        ringClass = "ring-2 ring-green-400/50 shadow-lg shadow-green-950/50";
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
                          style={{ left: node.x, top: node.y }}
                        >
                          {node.val}
                        </motion.div>
                      );
                    })}
                  </AnimatePresence>
                </div>
              </div>

              <div className="absolute bottom-4 left-4 text-sm text-muted-foreground font-medium">
                Phase: <span className={colors.phaseText}>{frame.phase}</span>
              </div>
            </div>

            <div className="h-28 shrink-0">
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
