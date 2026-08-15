import type { BaseFrame } from "../shared/types";

export interface LayoutNode {
  id: string;
  val: number | string;
  x: number;
  y: number;
  isDummy?: boolean;
  isNull?: boolean;
}

export interface LayoutEdge {
  id: string;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  isNull?: boolean;
}

export interface Frame extends BaseFrame {
  pointers?: Record<string, string>;
  layout: { nodes: LayoutNode[]; edges: LayoutEdge[] };
}
