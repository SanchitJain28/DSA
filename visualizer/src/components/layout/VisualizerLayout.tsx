import React from "react";
import { Panel, Group as PanelGroup } from "react-resizable-panels";
import ResizeHandle from "../shared/ResizeHandle";
import Header from "../shared/Header";
import SourceCode from "../shared/SourceCode";
import Explanation from "../shared/Explanation";
import ConfigModal from "../shared/ConfigModal";
import VisualizerCanvas from "./VisualizerCanvas";
import type { ProblemMeta, Scene, SourceCodeLine } from "../../core/shared/types";
import { themeColors, type ThemeName } from "../../utils/theme";
import { Binary } from "lucide-react";

export interface VisualizerLayoutProps {
  meta: ProblemMeta;
  frames: Scene[];
  source: SourceCodeLine[];
  state: {
    currentIdx: number;
    setCurrentIdx: React.Dispatch<React.SetStateAction<number>>;
    isPlaying: boolean;
    setIsPlaying: React.Dispatch<React.SetStateAction<boolean>>;
    handleNext: () => void;
    handlePrev: () => void;
    handleReset: () => void;
    handlePlayPause: () => void;
    formBuffers: Record<string, string>;
    setFieldValue: (key: string, value: string) => void;
    modal: {
      isOpen: boolean;
      setIsOpen: (open: boolean) => void;
      selectedPresetIdx: number | null;
      onOpen: () => void;
      onSelectPreset: (idx: number) => void;
      onApply: () => void;
    };
  };
}

export function VisualizerLayout({
  meta,
  frames,
  source,
  state,
}: VisualizerLayoutProps) {
  const theme: ThemeName = meta.theme || "violet";
  const colors = themeColors[theme] || themeColors.violet;

  const DEFAULT_SCENE: Scene = {
    structures: {},
    explanation: "Ready to start simulation.",
    codeLine: 1,
    variables: {},
  };

  const frame = frames[state.currentIdx] || frames[0] || DEFAULT_SCENE;

  const inputSchema = meta.inputSchema || [];

  return (
    <div className="flex flex-col h-screen bg-background text-foreground font-sans p-4">
      {/* Top Header */}
      <Header
        title={meta.title}
        titleColorClass={colors.titleClass}
        theme={theme}
        isPlaying={state.isPlaying}
        onPlayPause={state.handlePlayPause}
        onNext={state.handleNext}
        onPrev={state.handlePrev}
        onReset={state.handleReset}
      >
        {/* Unified Configure Inputs Modal */}
        <ConfigModal
          title={`Configure ${meta.title}`}
          description="Select a preset scenario or provide custom problem inputs."
          theme={theme}
          isOpen={state.modal.isOpen}
          onOpenChange={state.modal.setIsOpen}
          onOpen={state.modal.onOpen}
          presets={meta.testCases.map((tc) => ({
            id: tc.id,
            name: tc.name,
            preview: tc.preview || JSON.stringify(tc.data),
          }))}
          selectedPresetIdx={state.modal.selectedPresetIdx}
          onSelectPreset={state.modal.onSelectPreset}
          onApply={state.modal.onApply}
        >
          {inputSchema.length > 0 && (
            <div className="space-y-4">
              <div
                className={`grid gap-3 ${
                  inputSchema.length > 1
                    ? "grid-cols-1 sm:grid-cols-2"
                    : "grid-cols-1"
                }`}
              >
                {inputSchema.map((field) => (
                  <div key={field.key} className="space-y-1">
                    <label className="text-[11px] font-mono text-neutral-400 flex items-center gap-1.5">
                      <Binary className={`w-3.5 h-3.5 ${colors.titleClass}`} />
                      <span>{field.label}:</span>
                    </label>
                    <input
                      type={field.type === "number" ? "number" : "text"}
                      value={state.formBuffers[field.key] ?? ""}
                      onChange={(e) =>
                        state.setFieldValue(field.key, e.target.value)
                      }
                      placeholder={field.placeholder}
                      className="w-full bg-neutral-950/80 border border-neutral-700/80 rounded-md px-3 py-2 text-xs font-mono text-neutral-100 focus:outline-none focus:ring-1 focus:ring-indigo-500/60 focus:border-indigo-500 placeholder:text-neutral-600"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </ConfigModal>
      </Header>

      {/* Main Resizable Workspace */}
      <div className="flex-1 mt-4 overflow-hidden">
        <PanelGroup orientation="horizontal">
          {/* Left Canvas Panel */}
          <Panel className="flex flex-col min-w-0 h-full">
            <VisualizerCanvas
              frame={frame}
              currentStep={state.currentIdx}
              totalSteps={frames.length}
              onStepClick={state.setCurrentIdx}
              theme={theme}
            />
          </Panel>

          <ResizeHandle />

          {/* Right Explanation & Code Panel */}
          <Panel
            defaultSize={30}
            minSize={20}
            className="flex flex-col gap-4 min-w-0"
          >
            <Explanation
              message={frame.explanation || frame.message}
              className={`h-32 rounded-md border p-4 shadow-inner shrink-0 ${colors.explanationBg} ${colors.explanationBorder}`}
            />
            <SourceCode
              code={source}
              activeLine={frame.codeLine ?? 1}
              theme={theme}
            />
          </Panel>
        </PanelGroup>
      </div>
    </div>
  );
}

export default VisualizerLayout;
