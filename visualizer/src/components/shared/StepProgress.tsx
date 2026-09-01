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
      className={`inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-[#141417] border border-[#1e1e23] shadow-[0_4px_12px_rgba(0,0,0,0.5)] select-none ${className}`}
    >
      {/* Step / Phase Label */}
      {label && (
        <span className="font-['Poppins',sans-serif] font-medium text-[12px] text-[#ededf0] tracking-[-0.01em] whitespace-nowrap">
          {label}
        </span>
      )}

      {/* Step Dots Track */}
      <div className="flex items-center gap-[3.5px] overflow-hidden py-0.5 max-w-[280px]">
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
                    ? "w-[7px] h-[7px] bg-[#c9c3b6] shadow-[0_0_8px_rgba(201,195,182,0.85)]"
                    : isPast
                      ? "w-[4px] h-[4px] bg-[#82828b] hover:bg-[#ededf0]"
                      : "w-[4px] h-[4px] bg-[#2e2e34] hover:bg-[#5a5a63]"
                }`}
              />
            </button>
          );
        })}
      </div>

      {/* Step Numeric Indicator */}
      <span className="font-['JetBrains_Mono',monospace] text-[11px] text-[#c9c3b6] tracking-tight whitespace-nowrap">
        {currentStep + 1}/{totalSteps}
      </span>
    </div>
  );
}
