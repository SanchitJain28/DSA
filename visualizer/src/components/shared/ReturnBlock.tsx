import { motion, AnimatePresence } from "framer-motion";
import { CornerDownRight } from "lucide-react";

export interface ReturnBlockProps {
  frame: any;
  currentIdx?: number;
  totalSteps?: number;
  className?: string;
}

export function getFrameReturnValue(
  frame: any,
  totalFrames?: number,
  currentIdx?: number
): { isReturn: boolean; value: any; message?: string } | null {
  if (!frame) return null;

  // 1. Explicit returnValue
  if (frame.returnValue !== undefined) {
    return {
      isReturn: true,
      value: frame.returnValue,
      message: typeof frame.message === "string" ? frame.message : undefined,
    };
  }

  // 2. Check if phase indicates return or completion
  const phaseLower = (frame.phase || "").toLowerCase();
  const isFinishedPhase =
    phaseLower.includes("finish") ||
    phaseLower.includes("return") ||
    phaseLower.includes("complete") ||
    phaseLower.includes("result") ||
    phaseLower.includes("done") ||
    phaseLower.includes("found");

  const isFinalStep =
    typeof currentIdx === "number" &&
    typeof totalFrames === "number" &&
    totalFrames > 1 &&
    currentIdx === totalFrames - 1;

  if (!isFinishedPhase && !isFinalStep) {
    return null;
  }

  // 3. Extract from variables
  if (frame.variables) {
    if (frame.variables["return"] !== undefined) {
      return { isReturn: true, value: frame.variables["return"] };
    }
    if (frame.variables["returnValue"] !== undefined) {
      return { isReturn: true, value: frame.variables["returnValue"] };
    }
    if (frame.variables["result"] !== undefined) {
      return { isReturn: true, value: frame.variables["result"] };
    }
    if (frame.variables["ans"] !== undefined) {
      return { isReturn: true, value: frame.variables["ans"] };
    }
    if (frame.variables["output"] !== undefined) {
      return { isReturn: true, value: frame.variables["output"] };
    }
  }

  // 4. Extract from frame.arrays (e.g. "result" array)
  if (Array.isArray(frame.arrays)) {
    const resArr = frame.arrays.find(
      (a: any) =>
        (a.name || a.id || "").toLowerCase() === "result" ||
        (a.name || a.id || "").toLowerCase() === "output"
    );
    if (resArr && resArr.values) {
      return { isReturn: true, value: resArr.values };
    }
  }

  // 5. Extract from frame.result
  if (frame.result !== undefined) {
    return { isReturn: true, value: frame.result };
  }

  // 6. Regex check on message
  if (typeof frame.message === "string") {
    const msg = frame.message;
    const matchBool = msg.match(/returning\s+(true|false)/i);
    if (matchBool) {
      return { isReturn: true, value: matchBool[1].toLowerCase() === "true" };
    }
    const matchArray = msg.match(/returning\s+(\[.*?\])/i);
    if (matchArray) {
      try {
        return { isReturn: true, value: JSON.parse(matchArray[1]) };
      } catch {
        return { isReturn: true, value: matchArray[1] };
      }
    }
    const matchNum = msg.match(/returning\s+(-?\d+)/i);
    if (matchNum) {
      return { isReturn: true, value: Number(matchNum[1]) };
    }
  }

  return { isReturn: true, value: "Completed" };
}

export default function ReturnBlock({
  frame,
  currentIdx,
  totalSteps,
  className = "",
}: ReturnBlockProps) {
  const retData = getFrameReturnValue(frame, totalSteps, currentIdx);

  if (!retData || !retData.isReturn) {
    return null;
  }

  const { value } = retData;

  const valueString =
    typeof value === "object" && value !== null
      ? JSON.stringify(value)
      : String(value);

  const isBoolean = typeof value === "boolean" || value === "true" || value === "false";
  const isTrue = value === true || value === "true";

  return (
    <AnimatePresence>
      <div className={`w-full flex justify-center py-2 ${className}`}>
        <motion.div
          layout
          initial={{ opacity: 0, y: 12, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 12, scale: 0.96 }}
          transition={{ type: "spring", stiffness: 350, damping: 25 }}
          className="w-full max-w-xl bg-[#121214]/95 backdrop-blur-md border border-emerald-500/40 rounded-xl px-4 py-3 shadow-[0_0_25px_rgba(16,185,129,0.12)] flex items-center justify-between gap-4 select-none"
        >
          {/* Left: Return Value Label */}
          <div className="flex items-center gap-2.5 shrink-0">
            <div className="w-6 h-6 rounded-md bg-emerald-500/20 border border-emerald-500/30 grid place-items-center text-emerald-400">
              <CornerDownRight className="w-3.5 h-3.5" />
            </div>
            <span className="font-mono text-xs font-bold uppercase tracking-wider text-emerald-400">
              Return Value
            </span>
          </div>

          {/* Right: Returned Value directly on the same line */}
          <div className="font-mono font-bold text-sm tracking-wide text-emerald-300 overflow-x-auto text-right">
            {isBoolean ? (
              <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded text-xs font-bold uppercase ${
                  isTrue
                    ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
                    : "bg-rose-500/20 text-rose-300 border border-rose-500/40"
                }`}
              >
                {isTrue ? "true" : "false"}
              </span>
            ) : Array.isArray(value) ? (
              <span className="text-emerald-300 whitespace-nowrap">
                {JSON.stringify(value).replace(/,/g, ", ")}
              </span>
            ) : (
              <span className="text-emerald-300">{valueString}</span>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
