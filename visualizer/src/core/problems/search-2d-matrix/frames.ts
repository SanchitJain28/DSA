import { FrameBuilder } from "../../shared/FrameBuilder";
import type { Scene } from "../../shared/types";
import { toMatrixState } from "../../structures/matrix/helpers";

export function generateFrames(data: {
  matrix: number[][];
  target: number;
}): Scene[] {
  const { matrix, target } = data;
  const builder = new FrameBuilder<Scene>();

  const m = matrix?.length || 0;
  const n = m > 0 ? matrix[0].length : 0;
  const totalElements = m * n;

  if (m === 0 || n === 0) {
    builder.pushFrame({
      phase: "Empty Matrix",
      codeLine: 18,
      explanation: "Matrix is empty. Return false.",
      structures: {
        matrix: toMatrixState(matrix || [[]], { title: "2D Matrix" }),
      },
      variables: { target, result: "false" },
    });
    return builder.getFrames();
  }

  const buildFrame = (
    phase: string,
    codeLine: number,
    explanation: string,
    variables: Record<string, string | number> = {},
    opts: {
      activeCell?: [number, number];
      conflictCell?: [number, number];
      highlightCells?: [number, number][];
      activeRow?: number;
      activeCol?: number;
    } = {},
  ) => {
    builder.pushFrame({
      phase,
      codeLine,
      explanation,
      structures: {
        matrix: toMatrixState(matrix, {
          title: `2D Matrix (${m}x${n})`,
          activeCell: opts.activeCell,
          conflictCell: opts.conflictCell,
          highlightCells: opts.highlightCells,
          activeRow: opts.activeRow,
          activeCol: opts.activeCol,
        }),
      },
      variables: {
        target,
        m,
        n,
        ...variables,
      },
    });
  };

  buildFrame(
    "Initialization",
    1,
    `Start 2D binary search for target = ${target} across a ${m}x${n} sorted matrix (${totalElements} total cells).`,
    { left: 0, right: totalElements - 1, result: "Searching" },
  );

  let left = 0;
  let right = totalElements - 1;

  buildFrame(
    "Set Boundaries",
    4,
    `Map 2D matrix to virtual 1D indices [0 .. ${totalElements - 1}]. Set left = 0, right = ${totalElements - 1}.`,
    { left, right, result: "Searching" },
  );

  while (left <= right) {
    buildFrame(
      "Binary Search Window",
      5,
      `Active search space: [${left} .. ${right}].`,
      { left, right, result: "Searching" },
    );

    const mid = Math.floor((left + right) / 2);
    const row = Math.floor(mid / n);
    const col = mid % n;
    const midVal = matrix[row][col];

    buildFrame(
      "Project to 2D",
      8,
      `mid = ⌊(${left} + ${right}) / 2⌋ = ${mid}. 2D cell: row = ⌊${mid}/${n}⌋ = ${row}, col = ${mid}%${n} = ${col}. Value = ${midVal}.`,
      {
        left,
        right,
        mid,
        row,
        col,
        "matrix[row][col]": midVal,
        result: "Evaluating",
      },
      { activeCell: [row, col], activeRow: row, activeCol: col },
    );

    if (midVal === target) {
      buildFrame(
        "★ Target Found!",
        11,
        `Exact match! matrix[${row}][${col}] === ${target}. Returning true.`,
        {
          left,
          right,
          mid,
          row,
          col,
          "matrix[row][col]": midVal,
          result: "true (Found)",
        },
        { activeCell: [row, col], activeRow: row, activeCol: col },
      );
      return builder.getFrames();
    } else if (midVal < target) {
      buildFrame(
        "Value < Target",
        13,
        `matrix[${row}][${col}] (${midVal}) < target (${target}). Target is in right half. Set left = mid + 1 = ${mid + 1}.`,
        {
          left,
          right,
          mid,
          row,
          col,
          "matrix[row][col]": midVal,
          result: `${midVal} < ${target}`,
        },
        { activeCell: [row, col] },
      );
      left = mid + 1;
    } else {
      buildFrame(
        "Value > Target",
        15,
        `matrix[${row}][${col}] (${midVal}) > target (${target}). Target is in left half. Set right = mid - 1 = ${mid - 1}.`,
        {
          left,
          right,
          mid,
          row,
          col,
          "matrix[row][col]": midVal,
          result: `${midVal} > ${target}`,
        },
        { activeCell: [row, col] },
      );
      right = mid - 1;
    }
  }

  buildFrame(
    "Target Not Found",
    18,
    `Search range exhausted (left > right). Target ${target} does not exist in matrix. Returning false.`,
    { left, right, result: "false (Not Found)" },
  );

  return builder.getFrames();
}

export default generateFrames;
