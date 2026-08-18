import React from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
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

const themeStyles: Record<
  ThemeName,
  {
    iconColor: string;
    headerIconWrapper: string;
    presetSelected: string;
    applyButton: string;
  }
> = {
  indigo: {
    iconColor: "text-indigo-400",
    headerIconWrapper: "bg-indigo-500/10 border-indigo-500/20 text-indigo-400",
    presetSelected:
      "bg-indigo-950/50 border-indigo-500/60 text-neutral-100 ring-1 ring-indigo-500/40 shadow-sm",
    applyButton: "bg-indigo-600 hover:bg-indigo-500",
  },
  cyan: {
    iconColor: "text-cyan-400",
    headerIconWrapper: "bg-cyan-500/10 border-cyan-500/20 text-cyan-400",
    presetSelected:
      "bg-cyan-950/50 border-cyan-500/60 text-neutral-100 ring-1 ring-cyan-500/40 shadow-sm",
    applyButton: "bg-cyan-600 hover:bg-cyan-500",
  },
  emerald: {
    iconColor: "text-emerald-400",
    headerIconWrapper: "bg-emerald-500/10 border-emerald-500/20 text-emerald-400",
    presetSelected:
      "bg-emerald-950/50 border-emerald-500/60 text-neutral-100 ring-1 ring-emerald-500/40 shadow-sm",
    applyButton: "bg-emerald-600 hover:bg-emerald-500",
  },
  amber: {
    iconColor: "text-amber-400",
    headerIconWrapper: "bg-amber-500/10 border-amber-500/20 text-amber-400",
    presetSelected:
      "bg-amber-950/50 border-amber-500/60 text-neutral-100 ring-1 ring-amber-500/40 shadow-sm",
    applyButton: "bg-amber-600 hover:bg-amber-500",
  },
  rose: {
    iconColor: "text-rose-400",
    headerIconWrapper: "bg-rose-500/10 border-rose-500/20 text-rose-400",
    presetSelected:
      "bg-rose-950/50 border-rose-500/60 text-neutral-100 ring-1 ring-rose-500/40 shadow-sm",
    applyButton: "bg-rose-600 hover:bg-rose-500",
  },
  fuchsia: {
    iconColor: "text-fuchsia-400",
    headerIconWrapper: "bg-fuchsia-500/10 border-fuchsia-500/20 text-fuchsia-400",
    presetSelected:
      "bg-fuchsia-950/50 border-fuchsia-500/60 text-neutral-100 ring-1 ring-fuchsia-500/40 shadow-sm",
    applyButton: "bg-fuchsia-600 hover:bg-fuchsia-500",
  },
  teal: {
    iconColor: "text-teal-400",
    headerIconWrapper: "bg-teal-500/10 border-teal-500/20 text-teal-400",
    presetSelected:
      "bg-teal-950/50 border-teal-500/60 text-neutral-100 ring-1 ring-teal-500/40 shadow-sm",
    applyButton: "bg-teal-600 hover:bg-teal-500",
  },
  orange: {
    iconColor: "text-orange-400",
    headerIconWrapper: "bg-orange-500/10 border-orange-500/20 text-orange-400",
    presetSelected:
      "bg-orange-950/50 border-orange-500/60 text-neutral-100 ring-1 ring-orange-500/40 shadow-sm",
    applyButton: "bg-orange-600 hover:bg-orange-500",
  },
  violet: {
    iconColor: "text-violet-400",
    headerIconWrapper: "bg-violet-500/10 border-violet-500/20 text-violet-400",
    presetSelected:
      "bg-violet-950/50 border-violet-500/60 text-neutral-100 ring-1 ring-violet-500/40 shadow-sm",
    applyButton: "bg-violet-600 hover:bg-violet-500",
  },
  sky: {
    iconColor: "text-sky-400",
    headerIconWrapper: "bg-sky-500/10 border-sky-500/20 text-sky-400",
    presetSelected:
      "bg-sky-950/50 border-sky-500/60 text-neutral-100 ring-1 ring-sky-500/40 shadow-sm",
    applyButton: "bg-sky-600 hover:bg-sky-500",
  },
};

export default function ConfigModal({
  title,
  description,
  theme = "indigo",
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
  const tStyle = themeStyles[theme] || themeStyles.indigo;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogTrigger
        onClick={onOpen}
        className="flex items-center gap-1.5 bg-card hover:bg-accent/10 border border-border px-3 py-1.5 rounded-md text-xs font-medium text-foreground transition-colors shadow-sm cursor-pointer"
      >
        <HeaderIcon className={`w-3.5 h-3.5 ${tStyle.iconColor}`} />
        <span>{triggerLabel}</span>
      </DialogTrigger>

      <DialogContent className="sm:max-w-xl bg-neutral-900 border-neutral-800 text-neutral-100 shadow-2xl p-5 rounded-lg">
        <DialogHeader>
          <div className="flex items-center gap-2.5">
            <div className={`p-2 rounded-md border ${tStyle.headerIconWrapper}`}>
              <HeaderIcon className="w-4 h-4" />
            </div>
            <div>
              <DialogTitle className="text-base font-semibold text-neutral-100">
                {title}
              </DialogTitle>
              <DialogDescription className="text-xs text-neutral-400 mt-0.5">
                {description}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {/* Preset Test Scenarios Grid */}
          {presets.length > 0 && (
            <div>
              <label className="text-xs font-mono font-semibold uppercase tracking-wider text-neutral-400 mb-2 flex items-center gap-1.5">
                <Sparkles className={`w-3.5 h-3.5 ${tStyle.iconColor}`} />
                Preset Test Scenarios
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-52 overflow-y-auto pr-1">
                {presets.map((preset, idx) => {
                  const isSelected = selectedPresetIdx === idx;
                  return (
                    <button
                      key={preset.id}
                      type="button"
                      onClick={() => onSelectPreset && onSelectPreset(idx)}
                      className={`p-2.5 rounded-md border text-left transition-all cursor-pointer flex flex-col gap-1 ${
                        isSelected
                          ? tStyle.presetSelected
                          : "bg-neutral-950/50 border-neutral-800 hover:bg-neutral-800/50 text-neutral-400 hover:text-neutral-200"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-neutral-100">
                          {preset.name}
                        </span>
                        {isSelected && (
                          <Check className={`w-3.5 h-3.5 ${tStyle.iconColor} shrink-0`} />
                        )}
                      </div>
                      <div className="font-mono text-[11px] text-neutral-400 truncate">
                        {preset.preview}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Custom Children Form Inputs */}
          {children && (
            <div className={`${presets.length > 0 ? "pt-3 border-t border-neutral-800" : ""}`}>
              {children}
            </div>
          )}
        </div>

        <DialogFooter className="mt-2 flex items-center justify-end gap-2 border-t border-neutral-800 bg-neutral-950/60 pt-4 rounded-b-lg">
          <DialogClose
            type="button"
            className="px-3.5 py-1.5 rounded-md border border-neutral-700 bg-neutral-800 text-xs font-medium text-neutral-300 hover:text-white hover:bg-neutral-700 transition-colors cursor-pointer"
          >
            Cancel
          </DialogClose>
          <button
            type="button"
            onClick={onApply}
            className={`px-4 py-1.5 rounded-md text-xs font-semibold text-white shadow-lg transition-colors cursor-pointer ${tStyle.applyButton}`}
          >
            Apply & Run
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
