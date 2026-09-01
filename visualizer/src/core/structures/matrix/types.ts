export interface MatrixState {
  title?: string;
  grid: any[][];
  activeCell?: [number, number];
  activeRow?: number;
  activeCol?: number;
  activeBox?: number;
  conflictCell?: [number, number];
  conflictType?: "row" | "col" | "box" | "cell";
  highlightCells?: [number, number][];
}
