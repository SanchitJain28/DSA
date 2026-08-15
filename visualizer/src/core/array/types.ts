import type { BaseFrame } from "../shared/types";

export interface ArrayData {
  id: string; // e.g. "nums" or "result"
  name?: string; // label to display next to the array
  values: any[]; // The elements
  pointers?: Record<string, number>; // Map of pointer label -> index (e.g. { "left": 0, "right": 4, "pos": 4 })
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

export interface ArrayFrame extends BaseFrame {
  arrays?: ArrayData[]; // Supports rendering multiple arrays at once
  grid?: SudokuGridData;
}
