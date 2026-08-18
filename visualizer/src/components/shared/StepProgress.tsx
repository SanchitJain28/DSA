import { motion } from "framer-motion";

export interface StepProgressProps {
  label?: string;
  currentStep: number;
  totalSteps: number;
  onStepClick?: (step: number) => void;
  className?: string;
  themeColor?: string;
}

export default function StepProgress({
  label,
  currentStep,
  totalSteps,
  onStepClick,
  className = "",
}: StepProgressProps) {
  if (totalSteps <= 1) return null;

  return (
    <div
      className={`inline-flex items-center gap-2.5 px-3 py-1 rounded-full bg-neutral-950/85 backdrop-blur-md border border-neutral-800/80 shadow-md select-none ${className}`}
    >
      {/* Step / Phase Label */}
      {label && (
        <span className="font-sans font-medium text-[11.5px] text-neutral-200 tracking-tight whitespace-nowrap">
          {label}
        </span>
      )}

      {/* Step Dots Track */}
      <div className="flex items-center gap-[3px] overflow-hidden py-0.5">
        {Array.from({ length: totalSteps }).map((_, i) => {
          const isPast = i < currentStep;
          const isCurrent = i === currentStep;

          return (
            <button
              key={i}
              type="button"
              onClick={() => onStepClick?.(i)}
              disabled={!onStepClick}
              title={`Step ${i + 1} of ${totalSteps}`}
              className="relative p-0 focus:outline-none cursor-pointer disabled:cursor-default"
            >
              <motion.span
                layout
                className={`block rounded-full transition-all duration-150 ${
                  isCurrent
                    ? "w-[6.5px] h-[6.5px] bg-white shadow-[0_0_6px_rgba(255,255,255,0.9)]"
                    : isPast
                      ? "w-[3.5px] h-[3.5px] bg-neutral-300 hover:bg-white"
                      : "w-[3.5px] h-[3.5px] bg-neutral-700/80 hover:bg-neutral-500"
                }`}
              />
            </button>
          );
        })}
      </div>

      {/* Step Numeric Indicator */}
      <span className="font-mono text-[10.5px] text-neutral-400 tracking-tight whitespace-nowrap">
        {currentStep + 1}/{totalSteps}
      </span>
    </div>
  );
}
