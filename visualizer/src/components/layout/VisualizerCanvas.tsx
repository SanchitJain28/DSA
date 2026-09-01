import CanvasViewport from "../shared/CanvasViewport";
import Variables from "../shared/Variables";
import StackBucket from "../shared/StackBucket";
import StepProgress from "../shared/StepProgress";
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
  theme = "violet",
}: VisualizerCanvasProps) {
  const colors = themeColors[theme] || themeColors.violet;

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

  return (
    <div className="flex-1 relative bg-card rounded-md border border-border overflow-hidden shadow-inner flex flex-col h-full">
      <CanvasViewport className="flex-1 w-full h-full">
        <div className="flex flex-col items-center justify-center p-8 gap-8 min-w-[700px] w-full mx-auto">
          {/* Main Visualizer Elements Row */}
          <div className="w-full flex flex-wrap items-start justify-center gap-10 py-2">
            {structureEntries.map(([key, structState]) => {
              const PanelComponent = STRUCTURE_PANELS[key];
              if (!PanelComponent) {
                return (
                  <div
                    key={key}
                    className="p-4 border border-dashed border-neutral-700 rounded text-xs text-neutral-400 font-mono"
                  >
                    Unregistered structure: {key}
                  </div>
                );
              }
              return (
                <div key={key} className="shrink-0 flex items-center justify-center">
                  <PanelComponent
                    state={structState}
                    theme={theme}
                    colors={colors}
                  />
                </div>
              );
            })}

            {/* In-Canvas Call Stack Bucket if recursion/callstack exists */}
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

            {/* In-Canvas Variables State Card */}
            {Object.keys(normalizedVariables).length > 0 && (
              <div className="shrink-0 pt-2">
                <Variables
                  variables={normalizedVariables}
                  highlightColorClass={colors.variablesText}
                />
              </div>
            )}
          </div>
        </div>
      </CanvasViewport>

      {/* Step Progress & Phase Indicator at Bottom-Left */}
      <div className="absolute bottom-3 left-4 z-10">
        <StepProgress
          label={frame.phase || "Step"}
          currentStep={currentStep}
          totalSteps={totalSteps}
          onStepClick={onStepClick}
        />
      </div>
    </div>
  );
}

export default VisualizerCanvas;
