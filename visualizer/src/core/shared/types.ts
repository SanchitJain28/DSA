import React from "react";
import type { ThemeName } from "@/utils/theme";

export interface BaseFrame {
  callStack?: string[];
  phase: string;
  codeLine: number;
  message: React.ReactNode;
  variables?: Record<string, string | number>;
  activeNodeId?: string | null; // For backward compatibility with older frames
  activeNodeIds?: string[]; // For multi-node tracking
  hashMap?: Record<string, string | number | boolean>; // For hash map visualization
}

export type StructureKey =
  | "array"
  | "arrays"
  | "hashmap"
  | "matrix"
  | "set"
  | "range"
  | "stack"
  | "queue"
  | "linkedList"
  | "tree"
  | "heap"
  | "graph"
  | "trie";


export interface VariableItem {
  name: string;
  value: string | number;
}

export interface Scene {
  structures: Partial<Record<StructureKey, any>>;
  variables?: Record<string, string | number> | VariableItem[];
  callStack?: string[];
  codeLine?: number;
  phase?: string;
  explanation: string;
  message?: React.ReactNode; 
}

export interface InputFieldDef {
  key: string;
  label: string;
  type: "array" | "matrix" | "number" | "string" | "boolean";
  placeholder?: string;
  defaultValue?: any;
}

export interface TestCase<T = any> {
  id: string;
  name: string;
  preview?: string;
  data: T;
}

export interface ProblemMeta<T = any> {
  id: string;
  title: string;
  difficulty: "Easy" | "Medium" | "Hard";
  category: string;
  topicId:
    | "arrays"
    | "trees"
    | "linked-list"
    | "stack"
    | "binary-search"
    | "sliding-window"
    | "recursion"
    | "heap";
  description?: string;
  theme?: ThemeName;
  tags?: string[];
  structures: StructureKey[];
  testCases: TestCase<T>[];
  inputSchema?: InputFieldDef[];
}

export interface SourceCodeLine {
  line: number;
  text: string;
}
