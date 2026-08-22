import { FrameBuilder } from "../../shared/FrameBuilder";
import type { BaseFrame } from "../../shared/types";
import type { ArrayData } from "../../array/types";

export interface SearchMatrixFrame extends BaseFrame {
  matrix: number[][];
  target: number;
  leftIndex: number;
  rightIndex: number;
  midIndex: number | null;
  activeRow: number | null;
  activeCol: number | null;
  status: "init" | "searching" | "checking" | "found" | "not_found" | "adjust_left" | "adjust_right";
  eliminatedIndices: number[];
  arrays?: ArrayData[];
}

export function generateFrames(
  matrix: number[][],
  target: number
): SearchMatrixFrame[] {
  const builder = new FrameBuilder<SearchMatrixFrame>();

  const m = matrix.length;
  const n = m > 0 ? matrix[0].length : 0;
  const totalElements = m * n;

  const getEmptyVars = () => ({
    target: String(target),
    m: String(m),
    n: String(n),
    left: "0",
    right: String(totalElements - 1),
    mid: "—",
    row: "—",
    col: "—",
    "matrix[r][c]": "—",
    result: "Searching",
  });

  const makeArrays = (l: number, r: number, midIdx: number | null): ArrayData[] => {
    const rowArrays: ArrayData[] = matrix.map((rowArr, rIdx) => {
      const pointers: Record<string, number> = {};
      if (l >= 0 && Math.floor(l / n) === rIdx) pointers["LEFT"] = l % n;
      if (midIdx !== null && Math.floor(midIdx / n) === rIdx) pointers["MID"] = midIdx % n;
      if (r >= 0 && Math.floor(r / n) === rIdx) pointers["RIGHT"] = r % n;

      return {
        id: `row-${rIdx}`,
        name: `Row ${rIdx}`,
        values: [...rowArr],
        pointers,
      };
    });

    const flatPointers: Record<string, number> = {};
    if (l >= 0 && l < totalElements) flatPointers["LEFT"] = l;
    if (midIdx !== null && midIdx >= 0 && midIdx < totalElements) flatPointers["MID"] = midIdx;
    if (r >= 0 && r < totalElements) flatPointers["RIGHT"] = r;

    const flatArray: ArrayData = {
      id: "flattened",
      name: "1D Virtual Flattened Array",
      values: matrix.flat(),
      pointers: flatPointers,
    };

    return [...rowArrays, flatArray];
  };

  const getActiveNodeIds = (l: number, r: number, midIdx: number | null) => {
    const ids: string[] = [];
    if (l >= 0 && l < totalElements) {
      const rL = Math.floor(l / n);
      const cL = l % n;
      ids.push(`row-${rL}-${cL}`);
      ids.push(`flattened-${l}`);
    }
    if (midIdx !== null && midIdx >= 0 && midIdx < totalElements) {
      const rM = Math.floor(midIdx / n);
      const cM = midIdx % n;
      ids.push(`row-${rM}-${cM}`);
      ids.push(`flattened-${midIdx}`);
    }
    if (r >= 0 && r < totalElements) {
      const rR = Math.floor(r / n);
      const cR = r % n;
      ids.push(`row-${rR}-${cR}`);
      ids.push(`flattened-${r}`);
    }
    return ids;
  };

  if (m === 0 || n === 0) {
    builder.pushFrame({
      phase: "Empty Matrix",
      codeLine: 18,
      message: "Matrix is empty. Return false.",
      variables: {
        ...getEmptyVars(),
        result: "false",
      },
      matrix,
      target,
      leftIndex: 0,
      rightIndex: -1,
      midIndex: null,
      activeRow: null,
      activeCol: null,
      status: "not_found",
      eliminatedIndices: [],
      arrays: [],
    });
    return builder.getFrames();
  }

  // Step 1: Initial Setup
  builder.pushFrame({
    phase: "Initialization",
    codeLine: 1,
    message: `Start 2D binary search for target = ${target} across a ${m}x${n} sorted matrix (${totalElements} total cells).`,
    variables: getEmptyVars(),
    matrix,
    target,
    leftIndex: 0,
    rightIndex: totalElements - 1,
    midIndex: null,
    activeRow: null,
    activeCol: null,
    status: "init",
    eliminatedIndices: [],
    arrays: makeArrays(0, totalElements - 1, null),
    activeNodeIds: getActiveNodeIds(0, totalElements - 1, null),
  });

  // Step 2: Dimensions & Pointers
  let left = 0;
  let right = totalElements - 1;

  builder.pushFrame({
    phase: "Set Search Boundaries",
    codeLine: 4,
    message: `Map 2D matrix into a virtual 1D range [0 ... ${totalElements - 1}]. Set left = 0, right = ${totalElements - 1}.`,
    variables: {
      ...getEmptyVars(),
      left: "0",
      right: String(right),
    },
    matrix,
    target,
    leftIndex: left,
    rightIndex: right,
    midIndex: null,
    activeRow: null,
    activeCol: null,
    status: "init",
    eliminatedIndices: [],
    arrays: makeArrays(left, right, null),
    activeNodeIds: getActiveNodeIds(left, right, null),
  });

  const getEliminated = (l: number, r: number) => {
    const arr: number[] = [];
    for (let i = 0; i < l; i++) arr.push(i);
    for (let i = r + 1; i < totalElements; i++) arr.push(i);
    return arr;
  };

  while (left <= right) {
    // While loop check
    builder.pushFrame({
      phase: `Binary Search [${left} .. ${right}]`,
      codeLine: 6,
      message: `Search range [${left} ... ${right}] is valid (left <= right: ${left} <= ${right}).`,
      variables: {
        target: String(target),
        m: String(m),
        n: String(n),
        left: String(left),
        right: String(right),
        mid: "—",
        row: "—",
        col: "—",
        "matrix[r][c]": "—",
        result: "Searching",
      },
      matrix,
      target,
      leftIndex: left,
      rightIndex: right,
      midIndex: null,
      activeRow: null,
      activeCol: null,
      status: "searching",
      eliminatedIndices: getEliminated(left, right),
      arrays: makeArrays(left, right, null),
      activeNodeIds: getActiveNodeIds(left, right, null),
    });

    const mid = Math.floor((left + right) / 2);
    const row = Math.floor(mid / n);
    const col = mid % n;
    const midVal = matrix[row][col];

    // Compute Mid
    builder.pushFrame({
      phase: `Compute Mid = ${mid}`,
      codeLine: 7,
      message: `mid = Math.floor((${left} + ${right}) / 2) = ${mid}.`,
      variables: {
        target: String(target),
        m: String(m),
        n: String(n),
        left: String(left),
        right: String(right),
        mid: String(mid),
        row: "—",
        col: "—",
        "matrix[r][c]": "—",
        result: "Searching",
      },
      matrix,
      target,
      leftIndex: left,
      rightIndex: right,
      midIndex: mid,
      activeRow: null,
      activeCol: null,
      status: "searching",
      eliminatedIndices: getEliminated(left, right),
      arrays: makeArrays(left, right, mid),
      activeNodeIds: getActiveNodeIds(left, right, mid),
    });

    // 2D Projection: row & column mapping
    builder.pushFrame({
      phase: `Project to 2D [Row ${row}, Col ${col}]`,
      codeLine: 8,
      message: `Convert 1D index ${mid} to 2D matrix coordinates: row = ⌊${mid} / ${n}⌋ = ${row}, column = ${mid} % ${n} = ${col}. Cell value = matrix[${row}][${col}] = ${midVal}.`,
      variables: {
        target: String(target),
        m: String(m),
        n: String(n),
        left: String(left),
        right: String(right),
        mid: String(mid),
        row: String(row),
        col: String(col),
        "matrix[r][c]": String(midVal),
        result: "Evaluating",
      },
      matrix,
      target,
      leftIndex: left,
      rightIndex: right,
      midIndex: mid,
      activeRow: row,
      activeCol: col,
      status: "checking",
      eliminatedIndices: getEliminated(left, right),
      arrays: makeArrays(left, right, mid),
      activeNodeIds: getActiveNodeIds(left, right, mid),
    });

    // Compare with target
    if (midVal < target) {
      builder.pushFrame({
        phase: `Value ${midVal} < ${target}`,
        codeLine: 10,
        message: `matrix[${row}][${col}] (${midVal}) is strictly less than target (${target}). Target must be in the right half.`,
        variables: {
          target: String(target),
          m: String(m),
          n: String(n),
          left: String(left),
          right: String(right),
          mid: String(mid),
          row: String(row),
          col: String(col),
          "matrix[r][c]": String(midVal),
          result: `${midVal} < ${target}`,
        },
        matrix,
        target,
        leftIndex: left,
        rightIndex: right,
        midIndex: mid,
        activeRow: row,
        activeCol: col,
        status: "adjust_left",
        eliminatedIndices: getEliminated(left, right),
        arrays: makeArrays(left, right, mid),
        activeNodeIds: getActiveNodeIds(left, right, mid),
      });

      left = mid + 1;

      builder.pushFrame({
        phase: `Adjust Left -> ${left}`,
        codeLine: 11,
        message: `Set left = mid + 1 = ${left}. Pruned cells from index 0 to ${mid}.`,
        variables: {
          target: String(target),
          m: String(m),
          n: String(n),
          left: String(left),
          right: String(right),
          mid: String(mid),
          row: String(row),
          col: String(col),
          "matrix[r][c]": String(midVal),
          result: "Pruned Left",
        },
        matrix,
        target,
        leftIndex: left,
        rightIndex: right,
        midIndex: mid,
        activeRow: row,
        activeCol: col,
        status: "searching",
        eliminatedIndices: getEliminated(left, right),
        arrays: makeArrays(left, right, mid),
        activeNodeIds: getActiveNodeIds(left, right, mid),
      });
    } else if (midVal > target) {
      builder.pushFrame({
        phase: `Value ${midVal} > ${target}`,
        codeLine: 12,
        message: `matrix[${row}][${col}] (${midVal}) is strictly greater than target (${target}). Target must be in the left half.`,
        variables: {
          target: String(target),
          m: String(m),
          n: String(n),
          left: String(left),
          right: String(right),
          mid: String(mid),
          row: String(row),
          col: String(col),
          "matrix[r][c]": String(midVal),
          result: `${midVal} > ${target}`,
        },
        matrix,
        target,
        leftIndex: left,
        rightIndex: right,
        midIndex: mid,
        activeRow: row,
        activeCol: col,
        status: "adjust_right",
        eliminatedIndices: getEliminated(left, right),
        arrays: makeArrays(left, right, mid),
        activeNodeIds: getActiveNodeIds(left, right, mid),
      });

      right = mid - 1;

      builder.pushFrame({
        phase: `Adjust Right -> ${right}`,
        codeLine: 13,
        message: `Set right = mid - 1 = ${right}. Pruned cells from index ${mid} to ${totalElements - 1}.`,
        variables: {
          target: String(target),
          m: String(m),
          n: String(n),
          left: String(left),
          right: String(right),
          mid: String(mid),
          row: String(row),
          col: String(col),
          "matrix[r][c]": String(midVal),
          result: "Pruned Right",
        },
        matrix,
        target,
        leftIndex: left,
        rightIndex: right,
        midIndex: mid,
        activeRow: row,
        activeCol: col,
        status: "searching",
        eliminatedIndices: getEliminated(left, right),
        arrays: makeArrays(left, right, mid),
        activeNodeIds: getActiveNodeIds(left, right, mid),
      });
    } else {
      // Found target!
      const foundRowArrays: ArrayData[] = matrix.map((rowArr, rIdx) => {
        const pointers: Record<string, number> = {};
        if (rIdx === row) pointers["MATCH"] = col;
        return {
          id: `row-${rIdx}`,
          name: `Row ${rIdx}`,
          values: [...rowArr],
          pointers,
        };
      });

      const foundFlatPointers: Record<string, number> = { MATCH: mid };
      const foundFlatArray: ArrayData = {
        id: "flattened",
        name: "1D Virtual Flattened Array",
        values: matrix.flat(),
        pointers: foundFlatPointers,
      };

      builder.pushFrame({
        phase: `★ Target ${target} Found!`,
        codeLine: 15,
        message: `Found target ${target} at 2D coordinate matrix[${row}][${col}] (virtual 1D index ${mid})! Returning true.`,
        variables: {
          target: String(target),
          m: String(m),
          n: String(n),
          left: String(left),
          right: String(right),
          mid: String(mid),
          row: String(row),
          col: String(col),
          "matrix[r][c]": String(midVal),
          result: "true (Found)",
        },
        matrix,
        target,
        leftIndex: left,
        rightIndex: right,
        midIndex: mid,
        activeRow: row,
        activeCol: col,
        status: "found",
        eliminatedIndices: getEliminated(mid, mid),
        arrays: [...foundRowArrays, foundFlatArray],
        activeNodeIds: [`row-${row}-${col}`, `flattened-${mid}`],
      });
      return builder.getFrames();
    }
  }

  // Not Found
  builder.pushFrame({
    phase: "Target Not Found",
    codeLine: 18,
    message: `Search boundaries crossed (left: ${left} > right: ${right}). Target ${target} does not exist in matrix. Returning false.`,
    variables: {
      target: String(target),
      m: String(m),
      n: String(n),
      left: String(left),
      right: String(right),
      mid: "—",
      row: "—",
      col: "—",
      "matrix[r][c]": "—",
      result: "false (Not Found)",
    },
    matrix,
    target,
    leftIndex: left,
    rightIndex: right,
    midIndex: null,
    activeRow: null,
    activeCol: null,
    status: "not_found",
    eliminatedIndices: getEliminated(totalElements, -1),
    arrays: makeArrays(-1, -1, null),
  });

  return builder.getFrames();
}
