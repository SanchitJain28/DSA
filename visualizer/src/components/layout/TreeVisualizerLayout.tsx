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
}

export default function TreeVisualizerLayout({
  title,
  theme,
  layout,
  frames,
  code,
}: TreeVisualizerLayoutProps) {
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
    <div className="flex flex-col h-screen bg-gray-950 text-gray-100 font-sans p-4">
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
            <div className="flex-1 relative bg-gray-900 rounded-xl border border-gray-800 overflow-hidden shadow-inner flex items-center justify-center">
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
                      strokeWidth="3"
                      strokeDasharray={edge.isNull ? "6 6" : "none"}
                      initial={edge.isNull ? { opacity: 0 } : { pathLength: 0 }}
                      animate={edge.isNull ? { opacity: 1 } : { pathLength: 1 }}
                      transition={{ duration: 0.5 }}
                    />
                  ))}
                </svg>

                <div className="absolute inset-0">
                  <AnimatePresence mode="popLayout">
                    {activeLayout.nodes.map((node) => {
                      const isActive =
                        node.id === frame.activeNodeId ||
                        (frame.activeNodeIds &&
                          frame.activeNodeIds.includes(node.id));

                      if (node.isNull) {
                        return (
                          <motion.div
                            key={node.id}
                            layout
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{
                              scale: isActive ? 1.2 : 1,
                              opacity: isActive ? 1 : 0.3,
                              backgroundColor: isActive
                                ? colors.nodeNullBg
                                : "#111827",
                              borderColor: isActive
                                ? colors.nodeNullBorder
                                : "#1f2937",
                            }}
                            exit={{ scale: 0, opacity: 0 }}
                            transition={{
                              type: "spring",
                              stiffness: 300,
                              damping: 20,
                            }}
                            className={`absolute w-6 h-6 -ml-3 -mt-3 rounded-full border-2 flex items-center justify-center shadow-lg ${isActive ? "z-10" : "z-0"}`}
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

                      return (
                        <motion.div
                          key={node.id}
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
                            damping: 20,
                          }}
                          className="absolute w-12 h-12 -ml-6 -mt-6 rounded-full border-2 flex items-center justify-center font-bold shadow-lg z-10"
                          style={{ left: node.x, top: node.y }}
                        >
                          {node.val}
                        </motion.div>
                      );
                    })}
                  </AnimatePresence>
                </div>
              </div>

              <div className="absolute bottom-4 left-4 text-sm text-gray-500 font-medium">
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
