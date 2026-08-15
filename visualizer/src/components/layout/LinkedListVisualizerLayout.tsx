import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Panel, Group as PanelGroup } from "react-resizable-panels";
import ResizeHandle from "../shared/ResizeHandle";
import { usePlaybackTimer } from "../../hooks/usePlaybackTimer";
import { useKeyboardControls } from "../../hooks/useKeyboardControls";
import CallStack from "../shared/CallStack";
import Variables from "../shared/Variables";
import Explanation from "../shared/Explanation";
import Header from "../shared/Header";
import SourceCode from "../shared/SourceCode";
import Pointer from "../shared/Pointer";
import type { Frame } from "../../core/linked-list/types";
import { useSettings } from "../../contexts/SettingsContext";
import { themeColors, type ThemeName } from "../../utils/theme";

interface LinkedListVisualizerLayoutProps {
  title: string;
  theme: ThemeName;
  frames: Frame[];
  code: { line: number; text: string }[];
}

export default function LinkedListVisualizerLayout({
  title,
  theme,
  frames,
  code,
}: LinkedListVisualizerLayoutProps) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const { showPointers, randomizePointerColors } = useSettings();

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
  const layout = frame.layout;

  let minX = 0,
    maxX = 0,
    minY = 0,
    maxY = 0;
  if (layout.nodes.length > 0) {
    minX = Math.min(...layout.nodes.map((n) => n.x));
    maxX = Math.max(...layout.nodes.map((n) => n.x));
    minY = Math.min(...layout.nodes.map((n) => n.y));
    maxY = Math.max(...layout.nodes.map((n) => n.y));
  }

  const paddingX = 80;
  const paddingY = 100;

  const graphWidth = maxX - minX + paddingX * 2;
  const graphHeight = maxY - minY + paddingY * 2;
  const offsetX = paddingX - minX;
  const offsetY = paddingY - minY;

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

          <Panel className="flex flex-col gap-4 min-w-0">
            <div className="flex-1 relative bg-card rounded-xl border border-border overflow-hidden shadow-inner flex items-center justify-center">
              <div
                className="relative"
                style={{
                  width: graphWidth,
                  height: graphHeight,
                  maxWidth: "100%",
                  maxHeight: "100%",
                }}
              >
                <div
                  style={{
                    transform: `translate(${offsetX}px, ${offsetY}px)`,
                    width: "100%",
                    height: "100%",
                    position: "absolute",
                  }}
                >
                  <svg className="absolute inset-0 w-full h-full overflow-visible pointer-events-none">
                    <defs>
                      <marker
                        id={`arrowhead-${theme}`}
                        markerWidth="10"
                        markerHeight="7"
                        refX="9"
                        refY="3.5"
                        orient="auto"
                      >
                        <polygon points="0 0, 10 3.5, 0 7" fill={colors.edge} />
                      </marker>
                    </defs>

                    <AnimatePresence>
                      {layout.edges.map((edge) => {
                        const isBackward =
                          edge.x1 > edge.x2 && Math.abs(edge.y1 - edge.y2) < 20;

                        let pathD;
                        if (isBackward) {
                          // Infer node centers
                          const cx1 = edge.x1 + 24;
                          const cx2 = edge.x2 - 28;
                          const y = edge.y1;

                          // Path from top of source to top of target
                          const startX = cx1;
                          const startY = y - 24;
                          const endX = cx2;
                          const endY = y - 28;
                          const midX = (cx1 + cx2) / 2;

                          pathD = `M ${startX} ${startY} Q ${midX} ${y - 70} ${endX} ${endY}`;
                        } else {
                          pathD = `M ${edge.x1} ${edge.y1} L ${edge.x2} ${edge.y2}`;
                        }

                        return (
                          <motion.path
                            key={edge.id}
                            initial={{ opacity: 0 }}
                            animate={{
                              d: pathD,
                              opacity: 1,
                            }}
                            exit={{ opacity: 0 }}
                            stroke={edge.isNull ? colors.edgeNull : colors.edge}
                            strokeDasharray={edge.isNull ? "6 6" : "none"}
                            fill="transparent"
                            strokeWidth="3"
                            markerEnd={`url(#arrowhead-${theme})`}
                            transition={{
                              type: "spring",
                              stiffness: 300,
                              damping: 25,
                            }}
                          />
                        );
                      })}
                    </AnimatePresence>
                  </svg>

                  <div className="absolute inset-0">
                    <AnimatePresence mode="popLayout">
                      {layout.nodes.map((node) => {
                        const isActive = node.id === frame.activeNodeId;
                        const pointerLabels = Object.entries(
                          frame.pointers || {},
                        )
                          .filter(([_, targetId]) => targetId === node.id)
                          .map(([label]) => label);

                        if (node.isNull) {
                          return (
                            <motion.div
                              key={node.id}
                              className={`absolute flex items-center justify-center w-8 h-8 -ml-4 -mt-4 text-sm font-bold rounded-full ${colors.nodeNullBg} text-rose-200 border-2 ${colors.nodeNullBorder} shadow-lg`}
                              style={{ left: node.x, top: node.y }}
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              exit={{ scale: 0 }}
                              transition={{ type: "spring", stiffness: 300, damping: 25 }}
                            >
                              ∅
                            </motion.div>
                          );
                        }

                        return (
                          <div
                            key={node.id}
                            className="absolute"
                            style={{ left: node.x, top: node.y }}
                          >
                            {showPointers && pointerLabels.length > 0 && (
                              <Pointer
                                labels={pointerLabels}
                                x={0}
                                y={0}
                                themeClass={`text-${theme}-400 border-${theme}-800`}
                                randomColor={randomizePointerColors}
                              />
                            )}
                            <motion.div
                              layout
                              initial={{ scale: 0, opacity: 0 }}
                              animate={{
                                scale: isActive ? 1.15 : 1,
                                opacity: 1,
                                backgroundColor: isActive
                                  ? colors.nodeActiveBg
                                  : "#1f2937",
                                borderColor: isActive
                                  ? colors.nodeActiveBorder
                                  : "#374151",
                              }}
                              exit={{ scale: 0, opacity: 0 }}
                              transition={{
                                type: "spring",
                                stiffness: 300,
                                damping: 25,
                              }}
                              className={`absolute w-12 h-12 -ml-6 -mt-6 rounded-full border-2 flex items-center justify-center font-bold shadow-lg z-10 ${node.isDummy ? "border-dashed" : ""}`}
                            >
                              {node.val === -1 ? "D" : node.val}
                            </motion.div>
                          </div>
                        );
                      })}
                    </AnimatePresence>
                  </div>
                </div>
              </div>

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
