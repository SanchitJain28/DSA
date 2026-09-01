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

export interface LinkedListState {
  nodes: LayoutNode[];
  edges: LayoutEdge[];
  pointers?: Record<string, string>;
  activeNodeId?: string | null;
}
