import React from "react";
import { Panel, Group as PanelGroup } from "react-resizable-panels";
import ResizeHandle from "../shared/ResizeHandle";
import Header from "../shared/Header";
import SourceCode from "../shared/SourceCode";
import ConfigModal from "../shared/ConfigModal";
import VisualizerCanvas from "./VisualizerCanvas";
import type { ProblemMeta, Scene, SourceCodeLine } from "../../core/shared/types";
import { type ThemeName } from "../../utils/theme";
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
  const theme: ThemeName = meta.theme || "bone" as any;

  const DEFAULT_SCENE: Scene = {
    structures: {},
    explanation: "Ready to start simulation.",
    codeLine: 1,
    variables: {},
  };

  const frame = frames[state.currentIdx] || frames[0] || DEFAULT_SCENE;
  const inputSchema = meta.inputSchema || [];

  return (
    <div className="flex flex-col h-screen bg-[#0f1013] text-[#ededf0] font-['Poppins',sans-serif] p-4 selection:bg-[#c9c3b6] selection:text-[#15150f]">
      {/* Top Header */}
      <Header
        title={meta.title}
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
          description="Select a preset scenario or supply custom inputs."
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
            <div className="space-y-3">
              <div
                className={`grid gap-3 ${
                  inputSchema.length > 1
                    ? "grid-cols-1 sm:grid-cols-2"
                    : "grid-cols-1"
                }`}
              >
                {inputSchema.map((field) => (
                  <div key={field.key} className="space-y-1.5">
                    <label className="text-[11px] font-['JetBrains_Mono',monospace] text-[#82828b] flex items-center gap-1.5">
                      <Binary className="w-3.5 h-3.5 text-[#c9c3b6]" />
                      <span>{field.label}:</span>
                    </label>
                    <input
                      type={field.type === "number" ? "number" : "text"}
                      value={state.formBuffers[field.key] ?? ""}
                      onChange={(e) =>
                        state.setFieldValue(field.key, e.target.value)
                      }
                      placeholder={field.placeholder}
                      className="w-full bg-[#141417] border border-[#26262c] focus:border-[#c9c3b6] focus:shadow-[0_0_0_2px_rgba(201,195,182,0.34)] rounded-[9px] px-3 py-2 text-xs font-['JetBrains_Mono',monospace] text-[#ededf0] focus:outline-none placeholder:text-[#5a5a63] transition-all"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </ConfigModal>
      </Header>

      {/* Main Resizable Workspace */}
      <div className="flex-1 mt-3 overflow-hidden">
        <PanelGroup orientation="horizontal">
          {/* Left Canvas Panel (with floating HUD overlays) */}
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

          {/* Right Source Code Panel */}
          <Panel
            defaultSize={30}
            minSize={20}
            className="flex flex-col min-w-0 h-full"
          >
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
