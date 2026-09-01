import CanvasViewport from "../shared/CanvasViewport";
import Variables from "../shared/Variables";
import StackBucket from "../shared/StackBucket";
import StepProgress from "../shared/StepProgress";
import Explanation from "../shared/Explanation";
import { STRUCTURE_PANELS } from "../primitives/registry";
import type { Scene } from "../../core/shared/types";
import { themeColors, type ThemeName } from "../../utils/theme";

interface VisualizerCanvasProps {
  frame: Scene;
  currentStep: number;
  totalSteps: number;
  onStepClick: (step: number) => void;
  theme?: ThemeName;
}

export function VisualizerCanvas({
  frame,
  currentStep,
  totalSteps,
  onStepClick,
  theme = "bone" as any,
}: VisualizerCanvasProps) {
  const colors = themeColors[theme] || themeColors.bone || themeColors.amber;

  // Normalize variables (supports either Record<string, any> or Array<{name, value}>)
  const normalizedVariables: Record<string, any> = {};
  if (frame.variables) {
    if (Array.isArray(frame.variables)) {
      for (const item of frame.variables) {
        normalizedVariables[item.name] = item.value;
      }
    } else {
      Object.assign(normalizedVariables, frame.variables);
    }
  }

  const structureEntries = Object.entries(frame.structures || {}).filter(
    ([_, state]) => state !== undefined && state !== null,
  );

  const hasVariables = Object.keys(normalizedVariables).length > 0;
  const hasCallStack = Boolean(frame.callStack && frame.callStack.length > 1);
  const explanationMessage = frame.explanation || frame.message;

  return (
    <div className="flex-1 relative bg-[#141519] rounded-[14px] shadow-[0_0_0_1px_rgba(255,255,255,0.045)] overflow-hidden flex flex-col h-full font-['Poppins',sans-serif]">
      {/* Anchored Viewport for Zero Layout Shift */}
      <CanvasViewport className="flex-1 w-full h-full relative">
        <div className="absolute inset-0 flex items-center justify-center p-8 min-w-[600px] pointer-events-auto">
          {/* Main Visualizer Data Structures & Primitives */}
          <div className="flex flex-wrap items-center justify-center gap-12">
            {structureEntries.map(([key, structState]) => {
              const PanelComponent = STRUCTURE_PANELS[key];
              if (!PanelComponent) {
                return (
                  <div
                    key={key}
                    className="p-4 border border-dashed border-[#2e2e34] rounded-[10px] text-xs text-[#8a8a93] font-['JetBrains_Mono',monospace]"
                  >
                    Unregistered structure: {key}
                  </div>
                );
              }
              return (
                <div
                  key={key}
                  className="shrink-0 flex items-center justify-center"
                >
                  <PanelComponent
                    state={structState}
                    theme={theme}
                    colors={colors}
                  />
                </div>
              );
            })}

            {/* In-Canvas Call Stack Bucket */}
            {hasCallStack && (
              <div className="shrink-0 flex items-center justify-center">
                <StackBucket stack={frame.callStack!} />
              </div>
            )}
          </div>
        </div>
      </CanvasViewport>

      {/* Floating State Variables Card (Top-Right) */}
      {hasVariables && (
        <div className="absolute top-4 right-4 z-20 pointer-events-auto">
          <Variables
            variables={normalizedVariables}
            highlightColorClass="text-[#c9c3b6]"
          />
        </div>
      )}

      {/* Step Progress & Phase Indicator at Top-Left */}
      <div className="absolute top-4 left-4 z-20 pointer-events-auto">
        <StepProgress
          label={frame.phase || "Step"}
          currentStep={currentStep}
          totalSteps={totalSteps}
          onStepClick={onStepClick}
        />
      </div>

      {/* Floating Explanation Card (Bottom-Center) */}
      {explanationMessage && (
        <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-20 pointer-events-auto max-w-2xl w-[92%] sm:w-auto">
          <Explanation message={explanationMessage} />
        </div>
      )}
    </div>
  );
}

export default VisualizerCanvas;
