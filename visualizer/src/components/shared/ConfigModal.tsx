import React from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { SlidersHorizontal, Sparkles, Check } from "lucide-react";
import { type ThemeName } from "../../utils/theme";

export interface PresetItem {
  id: string;
  name: string;
  preview: string;
}

export interface ConfigModalProps {
  title: string;
  description: string;
  theme?: ThemeName;
  icon?: React.ComponentType<{ className?: string }>;
  triggerLabel?: string;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onOpen?: () => void;
  presets?: PresetItem[];
  selectedPresetIdx?: number | null;
  onSelectPreset?: (idx: number) => void;
  onApply: () => void;
  children?: React.ReactNode;
}

export default function ConfigModal({
  title,
  description,
  icon: HeaderIcon = SlidersHorizontal,
  triggerLabel = "Configure Inputs",
  isOpen,
  onOpenChange,
  onOpen,
  presets = [],
  selectedPresetIdx = null,
  onSelectPreset,
  onApply,
  children,
}: ConfigModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogTrigger
        onClick={onOpen}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-[8px] text-[12.5px] font-medium text-[#f2f2f5] bg-gradient-to-b from-[#33333a] to-[#26262c] border border-[#3d3d45] shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_2px_4px_rgba(0,0,0,0.45)] hover:from-[#3a3a42] hover:to-[#2c2c33] cursor-pointer transition-all active:scale-95 font-['Poppins',sans-serif]"
      >
        <HeaderIcon className="w-3.5 h-3.5 text-[#c9c3b6]" />
        <span>{triggerLabel}</span>
      </DialogTrigger>

      <DialogContent className="sm:max-w-xl bg-[#131316] border border-[#1e1e23] text-[#ededf0] shadow-[0_20px_50px_rgba(0,0,0,0.8),0_0_0_1px_rgba(255,255,255,0.06)] p-6 rounded-[16px] font-['Poppins',sans-serif]">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="w-[34px] h-[34px] rounded-[9px] bg-[#c9c3b6]/10 border border-[#c9c3b6]/25 grid place-items-center text-[#c9c3b6] shrink-0">
              <HeaderIcon className="w-4 h-4" />
            </div>
            <div>
              <DialogTitle className="text-[17.5px] font-semibold text-[#ededf0] tracking-[-0.015em]">
                {title}
              </DialogTitle>
              <DialogDescription className="text-[13px] text-[#82828b] mt-0.5">
                {description}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="py-3 space-y-4 max-h-[62vh] overflow-y-auto pr-1">
          {/* Preset Cases Selector */}
          {presets.length > 0 && (
            <div className="space-y-2">
              <label className="text-[11.5px] font-semibold uppercase tracking-[0.08em] text-[#a8a296] flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Presets Scenarios</span>
              </label>

              <div className="grid grid-cols-1 gap-2">
                {presets.map((preset, idx) => {
                  const isSelected = selectedPresetIdx === idx;
                  return (
                    <button
                      key={preset.id}
                      type="button"
                      onClick={() => onSelectPreset?.(idx)}
                      className={`text-left p-3 rounded-[10px] transition-all flex items-start justify-between gap-3 cursor-pointer ${
                        isSelected
                          ? "bg-gradient-to-b from-[#33333a] to-[#26262c] border border-[#c9c3b6] text-[#ededf0] shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_2px_6px_rgba(0,0,0,0.4)]"
                          : "bg-[#1c1c21] border border-transparent text-[#8a8a93] hover:text-[#ededf0] hover:border-[#38383f]"
                      }`}
                    >
                      <div className="space-y-1 min-w-0">
                        <div className="text-[13px] font-medium tracking-tight truncate">
                          {preset.name}
                        </div>
                        {preset.preview && (
                          <div className="font-['JetBrains_Mono',monospace] text-[11px] text-[#7c7c85] truncate">
                            {preset.preview}
                          </div>
                        )}
                      </div>
                      {isSelected && (
                        <span className="w-5 h-5 rounded-full bg-[#c9c3b6] grid place-items-center text-[#15150f] shrink-0 mt-0.5">
                          <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Custom Form Inputs Section */}
          {children && (
            <div className="pt-2 border-t border-[#1e1e23]">{children}</div>
          )}
        </div>

        <DialogFooter className="gap-2 sm:gap-0 pt-2 border-t border-[#1e1e23]">
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            className="px-4 py-2 rounded-[9px] text-[13px] font-medium text-[#8a8a93] hover:text-[#ededf0] hover:bg-[#1c1c20] transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onApply}
            className="px-5 py-2 rounded-[9px] text-[13px] font-semibold text-[#15150f] bg-gradient-to-b from-[#d6d0c4] to-[#c4beb0] border border-[#b3ac9d] shadow-[inset_0_1px_0_rgba(255,255,255,0.45),0_3px_8px_rgba(0,0,0,0.5)] hover:from-[#e2ddd2] hover:to-[#d2ccbe] transition-all cursor-pointer"
          >
            Apply &amp; Run
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
