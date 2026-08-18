import React from "react";

interface ExplanationProps {
  message: React.ReactNode;
  className?: string;
}

export default function Explanation({
  message,
  className = "h-32 bg-card rounded-md border border-border p-4 shadow-inner",
}: ExplanationProps) {
  return (
    <div className={className}>
      <h3 className="text-current opacity-75 text-sm font-bold mb-2 uppercase tracking-wider">
        Explanation
      </h3>
      <p className="text-gray-300 text-sm leading-relaxed">{message}</p>
    </div>
  );
}
