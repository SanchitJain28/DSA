import type { BaseFrame } from "../shared/types";
import type { ArrayData } from "../array/types";

export interface HeapNode {
  id: string;
  value: number;
  index: number;
  x: number;
  y: number;
  level: number;
}

export interface HeapEdge {
  id: string;
  from: string;
  to: string;
  fromIndex: number;
  toIndex: number;
}

export interface HeapTreeLayout {
  nodes: HeapNode[];
  edges: HeapEdge[];
  width: number;
  height: number;
}

export type HeapOperation = "add" | "poll" | "peek" | "build" | "idle";

export interface HeapFrame extends BaseFrame {
  heap: number[];
  operation: HeapOperation;
  opValue?: number;
  currentIndex?: number | null;
  parentIndex?: number | null;
  leftChildIndex?: number | null;
  rightChildIndex?: number | null;
  smallestIndex?: number | null;
  swapIndices?: [number, number] | null;
  compareIndices?: [number, number] | null;
  activeIndices?: number[];
  layout: HeapTreeLayout;
  arrays?: ArrayData[];
}
