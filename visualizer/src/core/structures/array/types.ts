export interface ArrayWindow {
  start: number;
  end: number;
  colorClass?: string;
  label?: string;
}

export interface ArrayData {
  id: string;
  name?: string;
  values: any[];
  pointers?: Record<string, number>;
  activeIndex?: number;
  activeIndices?: number[];
  matchIndex?: number;
  matchIndices?: number[];
  conflictIndex?: number;
  windows?: ArrayWindow[];
}

export interface SudokuGridData {
  board: string[][];
  activeCell?: [number, number]; // [r, c]
  activeRow?: number;
  activeCol?: number;
  activeBox?: number;
  conflictCell?: [number, number];
  conflictType?: "row" | "col" | "box";
}

export type ArrayState = ArrayData | ArrayData[];
