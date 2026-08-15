import { FrameBuilder } from "../../shared/FrameBuilder";
import type { ArrayFrame, SudokuGridData } from "../types";

export function generateFrames(board: string[][]): ArrayFrame[] {
  const builder = new FrameBuilder<ArrayFrame>();

  const rows: Set<string>[] = Array.from({ length: 9 }, () => new Set<string>());
  const cols: Set<string>[] = Array.from({ length: 9 }, () => new Set<string>());
  const boxes: Set<string>[] = Array.from({ length: 9 }, () => new Set<string>());

  // Track positions of added values to highlight conflicting cells
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

  const getBaseFrame = (
    codeLine: number,
    phase: string,
    message: string,
    gridData?: Partial<SudokuGridData>,
    variables: Record<string, string | number> = {},
    customHashMap?: Record<string, string | number | boolean>
  ): ArrayFrame => {
    return {
      phase,
      codeLine,
      message,
      variables,
      hashMap: customHashMap,
      grid: {
        board: board.map((row) => [...row]),
        ...gridData,
      },
      arrays: [],
      callStack: [],
    };
  };

  // Line 1: Initialization
  builder.pushFrame(
    getBaseFrame(
      1,
      "Initialization",
      "Start isValidSudoku algorithm on 9x9 board.",
      {},
      { "board.length": 9 }
    )
  );

  // Line 2-4: Sets Initialization
  builder.pushFrame(
    getBaseFrame(
      2,
      "Initialize Sets",
      "Initialize 9 HashSets for rows, columns, and 3x3 sub-boxes to store seen numbers.",
      {},
      { "rows count": 9, "cols count": 9, "boxes count": 9 }
    )
  );

  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      const value = board[r][c];
      const box = Math.floor(r / 3) * 3 + Math.floor(c / 3);

      const cellGrid: Partial<SudokuGridData> = {
        activeCell: [r, c],
        activeRow: r,
        activeCol: c,
        activeBox: box,
      };

      // Line 7: Get cell value
      builder.pushFrame(
        getBaseFrame(
          7,
          "Inspect Cell",
          `Inspecting cell at (row: ${r}, col: ${c}). Value is '${value}'.`,
          cellGrid,
          { r, c, value, box },
          getHashMap(r, c, box, value)
        )
      );

      // Line 8: If '.' continue
      if (value === ".") {
        builder.pushFrame(
          getBaseFrame(
            8,
            "Skip Empty Cell",
            `Cell (${r}, ${c}) is empty ('.'). Skip to next cell.`,
            cellGrid,
            { r, c, value: "'.'", box },
            getHashMap(r, c, box, value)
          )
        );
        continue;
      }

      // Line 9: Compute 3x3 box index
      builder.pushFrame(
        getBaseFrame(
          9,
          "Compute Box Index",
          `Calculated 3x3 box index: Math.floor(${r}/3)*3 + Math.floor(${c}/3) = ${box}.`,
          cellGrid,
          { r, c, value, box },
          getHashMap(r, c, box, value)
        )
      );

      const hasRowConflict = rows[r].has(value);
      const hasColConflict = cols[c].has(value);
      const hasBoxConflict = boxes[box].has(value);

      // Line 11: Check conflict condition
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

        const conflictGrid: Partial<SudokuGridData> = {
          ...cellGrid,
          conflictCell: prevPos,
          conflictType,
        };

        builder.pushFrame(
          getBaseFrame(
            11,
            "Conflict Detected",
            `Duplicate '${value}' detected in ${conflictReason}! It was previously seen at (${prevPos ? prevPos.join(", ") : "previous cell"}).`,
            conflictGrid,
            {
              r,
              c,
              value,
              box,
              "rows[r].has": hasRowConflict ? "TRUE" : "false",
              "cols[c].has": hasColConflict ? "TRUE" : "false",
              "boxes[box].has": hasBoxConflict ? "TRUE" : "false",
            },
            getHashMap(r, c, box, value, `Found Duplicate in ${conflictReason}!`)
          )
        );

        // Line 12: Return false
        builder.pushFrame(
          getBaseFrame(
            12,
            "Return False",
            `Sudoku board is INVALID due to duplicate '${value}' in ${conflictReason}. Return false.`,
            conflictGrid,
            { result: "false" },
            getHashMap(r, c, box, value, `Invalid Sudoku!`)
          )
        );

        return builder.getFrames();
      }

      builder.pushFrame(
        getBaseFrame(
          11,
          "No Conflict",
          `No duplicate for '${value}' in row ${r}, col ${c}, or box ${box}.`,
          cellGrid,
          {
            r,
            c,
            value,
            box,
            "rows[r].has": "false",
            "cols[c].has": "false",
            "boxes[box].has": "false",
          },
          getHashMap(r, c, box, value)
        )
      );

      // Line 14: Add to rows[r]
      rows[r].add(value);
      rowPositions[r].set(value, [r, c]);

      builder.pushFrame(
        getBaseFrame(
          14,
          "Update Row Set",
          `Added '${value}' to rows[${r}].`,
          cellGrid,
          { r, c, value, box },
          getHashMap(r, c, box, value)
        )
      );

      // Line 15: Add to cols[c]
      cols[c].add(value);
      colPositions[c].set(value, [r, c]);

      builder.pushFrame(
        getBaseFrame(
          15,
          "Update Column Set",
          `Added '${value}' to cols[${c}].`,
          cellGrid,
          { r, c, value, box },
          getHashMap(r, c, box, value)
        )
      );

      // Line 16: Add to boxes[box]
      boxes[box].add(value);
      boxPositions[box].set(value, [r, c]);

      builder.pushFrame(
        getBaseFrame(
          16,
          "Update Box Set",
          `Added '${value}' to boxes[${box}].`,
          cellGrid,
          { r, c, value, box },
          getHashMap(r, c, box, value)
        )
      );
    }
  }

  // Line 19: Return true
  builder.pushFrame(
    getBaseFrame(
      19,
      "Validation Passed",
      "Completed check of all 81 cells on the board with zero duplicate conflicts. Return true (Valid Sudoku).",
      {},
      { result: "true" }
    )
  );

  return builder.getFrames();
}
