import React from "react";
import { motion, AnimatePresence } from "framer-motion";

interface ExplanationProps {
  message: React.ReactNode;
  className?: string;
}

export default function Explanation({
  message,
  className = "bg-[#16171d]/95 backdrop-blur-md border border-[#2b2d38] rounded-[14px] px-5 py-3 shadow-[0_8px_32px_rgba(0,0,0,0.6),0_0_0_1px_rgba(255,255,255,0.06)] font-['Poppins',sans-serif] min-w-[320px] max-w-2xl text-center",
}: ExplanationProps) {
  return (
    <div className={className}>
      <div className="flex items-center justify-center gap-2 mb-1 select-none">
        <span className="text-[10.5px] font-semibold tracking-[0.1em] uppercase text-[#a8a296]">
          01 — Explanation
        </span>
      </div>
      <AnimatePresence mode="wait">
        <motion.p
          key={String(message)}
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          transition={{ duration: 0.15 }}
          className="text-[#ededf0] text-[13px] sm:text-[13.5px] leading-[1.6] m-0 font-normal select-text"
        >
          {message}
        </motion.p>
      </AnimatePresence>
    </div>
  );
}
