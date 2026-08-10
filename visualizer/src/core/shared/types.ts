import React from "react";

export interface BaseFrame {
  callStack: string[];
  phase: string;
  codeLine: number;
  message: React.ReactNode;
  variables?: Record<string, string | number>;
  activeNodeId?: string | null; // For backward compatibility with older frames
  activeNodeIds?: string[]; // For multi-node tracking
}
