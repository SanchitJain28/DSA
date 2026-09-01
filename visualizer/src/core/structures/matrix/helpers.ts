import type { MatrixState } from "./types";

export function toMatrixState(
  grid: any[][],
  options: Partial<MatrixState> = {},
): MatrixState {
  return {
    title: options.title || "Matrix Grid",
    grid: grid.map((row) => [...row]),
    activeCell: options.activeCell,
    activeRow: options.activeRow,
    activeCol: options.activeCol,
    activeBox: options.activeBox,
    conflictCell: options.conflictCell,
    conflictType: options.conflictType,
    highlightCells: options.highlightCells ? [...options.highlightCells] : undefined,
  };
}
