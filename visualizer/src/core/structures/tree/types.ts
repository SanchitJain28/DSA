export interface TreeLayoutNode {
  id: string;
  val: number | string;
  x: number;
  y: number;
  isNull?: boolean;
  status?: "active" | "target" | "secondary" | "success";
}

export interface TreeLayoutEdge {
  id: string;
  fromId?: string;
  toId?: string;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  isNull?: boolean;
}

export interface TreeState {
  nodes: TreeLayoutNode[];
  edges: TreeLayoutEdge[];
  activeNodeId?: string | null;
  activeNodeIds?: string[];
  activePathIds?: string[];
}
