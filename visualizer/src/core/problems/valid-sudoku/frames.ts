import { FrameBuilder } from "../../shared/FrameBuilder";
import type { Scene } from "../../shared/types";
import { toMatrixState } from "../../structures/matrix/helpers";

export function generateFrames(data: { board: string[][] }): Scene[] {
  const { board } = data;
  const builder = new FrameBuilder<Scene>();

  const rows: Set<string>[] = Array.from({ length: 9 }, () => new Set<string>());
  const cols: Set<string>[] = Array.from({ length: 9 }, () => new Set<string>());
  const boxes: Set<string>[] = Array.from({ length: 9 }, () => new Set<string>());

  const rowPositions: Map<string, [number, number]>[] = Array.from({ length: 9 }, () => new Map());
  const colPositions: Map<string, [number, number]>[] = Array.from({ length: 9 }, () => new Map());
  const boxPositions: Map<string, [number, number]>[] = Array.from({ length: 9 }, () => new Map());

  const getHashMap = (r: number, c: number, box: number, val: string, conflictStatus = "None") => {
    const rowItems = Array.from(rows[r] ?? []).join(", ") || "∅";
    const colItems = Array.from(cols[c] ?? []).join(", ") || "∅";
    const boxItems = Array.from(boxes[box] ?? []).join(", ") || "∅";

    return {
      [`Checking Cell`]: `(${r}, ${c}) = '${val}'`,
      [`rows[${r}]`]: `{ ${rowItems} }`,
      [`cols[${c}]`]: `{ ${colItems} }`,
      [`boxes[${box}]`]: `{ ${boxItems} }`,
      [`Conflict`]: conflictStatus,
    };
  };

  const buildFrame = (
    codeLine: number,
    phase: string,
    explanation: string,
    gridOpts: {
      activeCell?: [number, number];
      activeRow?: number;
      activeCol?: number;
      activeBox?: number;
      conflictCell?: [number, number];
      conflictType?: "row" | "col" | "box";
    } = {},
    variables: Record<string, string | number> = {},
    customHashMap?: Record<string, string | number | boolean>,
  ) => {
    builder.pushFrame({
      phase,
      codeLine,
      explanation,
      structures: {
        matrix: toMatrixState(board, {
          title: "9x9 Sudoku Board",
          ...gridOpts,
        }),
        hashmap: {
          title: "Seen Subsets State",
          entries: customHashMap || {},
        },
      },
      variables,
    });
  };

  buildFrame(1, "Initialization", "Start isValidSudoku algorithm on 9x9 board.", {}, { "board size": "9x9" });
  buildFrame(2, "Initialize Sets", "Initialize 9 HashSets each for rows, columns, and 3x3 sub-boxes.");

  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      const value = board[r][c];
      const box = Math.floor(r / 3) * 3 + Math.floor(c / 3);

      const cellGrid = {
        activeCell: [r, c] as [number, number],
        activeRow: r,
        activeCol: c,
        activeBox: box,
      };

      buildFrame(
        7,
        "Inspect Cell",
        `Inspecting cell at (row: ${r}, col: ${c}). Value is '${value}'.`,
        cellGrid,
        { r, c, value, box },
        getHashMap(r, c, box, value),
      );

      if (value === ".") {
        buildFrame(
          8,
          "Skip Empty Cell",
          `Cell (${r}, ${c}) is empty ('.'). Skip to next cell.`,
          cellGrid,
          { r, c, value: "'.'", box },
          getHashMap(r, c, box, value),
        );
        continue;
      }

      buildFrame(
        9,
        "Compute Box Index",
        `Calculated 3x3 box index: Math.floor(${r}/3)*3 + Math.floor(${c}/3) = ${box}.`,
        cellGrid,
        { r, c, value, box },
        getHashMap(r, c, box, value),
      );

      const hasRowConflict = rows[r].has(value);
      const hasColConflict = cols[c].has(value);
      const hasBoxConflict = boxes[box].has(value);

      if (hasRowConflict || hasColConflict || hasBoxConflict) {
        let conflictReason = "";
        let prevPos: [number, number] | undefined;
        let conflictType: "row" | "col" | "box" = "row";

        if (hasRowConflict) {
          conflictReason = `Row ${r}`;
          prevPos = rowPositions[r].get(value);
          conflictType = "row";
        } else if (hasColConflict) {
          conflictReason = `Column ${c}`;
          prevPos = colPositions[c].get(value);
          conflictType = "col";
        } else {
          conflictReason = `3x3 Box ${box}`;
          prevPos = boxPositions[box].get(value);
          conflictType = "box";
        }

        const conflictGrid = {
          ...cellGrid,
          conflictCell: prevPos,
          conflictType,
        };

        buildFrame(
          10,
          "Conflict Detected",
          `Duplicate '${value}' detected in ${conflictReason}! Previously seen at (${prevPos ? prevPos.join(", ") : "earlier"}).`,
          conflictGrid,
          {
            r,
            c,
            value,
            box,
            "row conflict": hasRowConflict ? "TRUE" : "false",
            "col conflict": hasColConflict ? "TRUE" : "false",
            "box conflict": hasBoxConflict ? "TRUE" : "false",
          },
          getHashMap(r, c, box, value, `Found Duplicate in ${conflictReason}!`),
        );

        buildFrame(
          11,
          "Return False",
          `Sudoku board is INVALID due to duplicate '${value}' in ${conflictReason}. Returning false.`,
          conflictGrid,
          { result: "false" },
          getHashMap(r, c, box, value, "Invalid Board!"),
        );
        return builder.getFrames();
      }

      // Valid cell, record value
      rows[r].add(value);
      rowPositions[r].set(value, [r, c]);

      cols[c].add(value);
      colPositions[c].set(value, [r, c]);

      boxes[box].add(value);
      boxPositions[box].set(value, [r, c]);

      buildFrame(
        13,
        "Update Sets",
        `Added '${value}' to rows[${r}], cols[${c}], and boxes[${box}].`,
        cellGrid,
        { r, c, value, box },
        getHashMap(r, c, box, value),
      );
    }
  }

  buildFrame(
    18,
    "Validation Passed",
    "Completed check of all cells with zero duplicate conflicts. Return true (Valid Sudoku).",
    {},
    { result: "true" },
  );

  return builder.getFrames();
}

export default generateFrames;
