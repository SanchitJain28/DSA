import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Panel, Group as PanelGroup } from "react-resizable-panels";
import ResizeHandle from "../shared/ResizeHandle";
import { usePlaybackTimer } from "../../hooks/usePlaybackTimer";
import { useKeyboardControls } from "../../hooks/useKeyboardControls";
import Header from "../shared/Header";
import Variables from "../shared/Variables";
import SourceCode from "../shared/SourceCode";
import Explanation from "../shared/Explanation";
import Pointer from "../shared/Pointer";
import type { StackFrame } from "../../core/stack/types";
import { themeColors, type ThemeName } from "../../utils/theme";
import { ArrowLeft } from "lucide-react";

interface StackVisualizerLayoutProps {
  title: string;
  theme: ThemeName;
  frames: StackFrame[];
  code: { line: number; text: string }[];
  headerChildren?: React.ReactNode;
}

export default function StackVisualizerLayout({
  title,
  theme,
  frames,
  code,
  headerChildren,
}: StackVisualizerLayoutProps) {
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
          <Panel className="flex flex-col gap-4 min-w-0">
            <div className="flex-1 relative bg-card rounded-xl border border-border overflow-hidden shadow-inner flex flex-row items-center justify-center p-8 gap-32">
              
              <AnimatePresence mode="popLayout">
                <div className="flex gap-24">
                  {frame.stacks.map((stack) => (
                    <div key={stack.id} className="flex flex-col items-center w-fit">
                      <div className="text-muted-foreground font-bold text-lg mb-6">{stack.name || stack.id}</div>
                      
                      <div className="relative flex flex-col-reverse items-center gap-2 p-4 rounded-xl bg-background/50 border border-border shadow-inner min-w-[120px] min-h-[280px]">
                        {stack.values.map((val, idx) => {
                          const nodeId = `${stack.id}-${idx}`;
                          const isActive = frame.activeNodeId === nodeId || frame.activeNodeIds?.includes(nodeId);
                          const isTop = idx === stack.values.length - 1;

                          return (
                            <div key={idx} className="relative flex items-center justify-center">
                              <motion.div
                                layout
                                initial={{ opacity: 0, y: -20 }}
                                animate={{
                                  opacity: 1,
                                  y: 0,
                                  backgroundColor: isActive ? (nodeId.includes("explode") ? "#ef4444" : colors.nodeActiveBg) : "#1f2937",
                                  borderColor: isActive ? (nodeId.includes("explode") ? "#b91c1c" : colors.nodeActiveBorder) : "#374151",
                                }}
                                exit={{ opacity: 0, y: -20, scale: 0.5 }}
                                transition={{ type: "spring", stiffness: 300, damping: 25 }}
                                className={`w-24 h-16 rounded border-2 flex items-center justify-center font-bold text-xl shadow z-10 ${isActive ? 'z-20' : ''}`}
                              >
                                {val}
                              </motion.div>

                              {stack.topPointer && isTop && (
                                <motion.div
                                  initial={{ opacity: 0, x: -10 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  className="absolute left-full ml-4 flex items-center gap-1 text-sm font-bold text-muted-foreground whitespace-nowrap"
                                >
                                  <ArrowLeft size={16} className={colors.variablesText} />
                                  <span className={`px-3 py-1 rounded shadow ${colors.callStackBg} ${colors.callStackText}`}>TOP</span>
                                </motion.div>
                              )}
                            </div>
                          );
                        })}
                        {stack.values.length === 0 && (
                          <div className="flex items-center justify-center h-full w-full text-gray-600 text-base italic">
                            Empty
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex flex-col gap-12">
                  {frame.arrays && frame.arrays.map((arr) => (
                    <div key={arr.id} className="flex flex-col items-start w-fit">
                      <div className="text-muted-foreground font-bold mb-4 ml-2">{arr.name || arr.id}</div>
                      
                      <div className="relative flex items-center gap-2">
                        {arr.values.map((val, idx) => {
                          const nodeId = `${arr.id}-${idx}`;
                          const isActive = frame.activeNodeId === nodeId || frame.activeNodeIds?.includes(nodeId);

                          const activePointers = arr.pointers 
                            ? Object.entries(arr.pointers).filter(([_, pIdx]) => pIdx === idx)
                            : [];

                          return (
                            <div key={idx} className="relative flex flex-col items-center">
                              {activePointers.length > 0 && (
                                <Pointer
                                  labels={activePointers.map(([label]) => label)}
                                  x={28}
                                  y={34}
                                  themeClass={colors.callStackBorder}
                                />
                              )}

                              <motion.div
                                layout
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{
                                  scale: isActive ? 1.1 : 1,
                                  opacity: 1,
                                  backgroundColor: isActive ? (nodeId.includes("explode") ? "#ef4444" : colors.nodeActiveBg) : "#1f2937",
                                  borderColor: isActive ? (nodeId.includes("explode") ? "#b91c1c" : colors.nodeActiveBorder) : "#374151",
                                }}
                                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                                className={`w-14 h-14 rounded-lg border-2 flex items-center justify-center font-bold text-lg shadow-lg z-10 ${isActive ? 'z-20' : ''}`}
                              >
                                {val !== null ? val : ""}
                              </motion.div>
                              <div className="text-[10px] text-muted-foreground mt-2">{idx}</div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </AnimatePresence>

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
