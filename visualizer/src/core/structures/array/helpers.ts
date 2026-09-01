import type { ArrayData } from "./types";

export function toArrayState(
  values: any[],
  options: Partial<ArrayData> = {},
): ArrayData {
  return {
    id: options.id || "nums",
    name: options.name || options.id || "nums",
    values: [...values],
    pointers: options.pointers ? { ...options.pointers } : {},
    activeIndex: options.activeIndex,
    activeIndices: options.activeIndices ? [...options.activeIndices] : undefined,
    matchIndex: options.matchIndex,
    matchIndices: options.matchIndices ? [...options.matchIndices] : undefined,
    conflictIndex: options.conflictIndex,
    windows: options.windows ? [...options.windows] : undefined,
  };
}

export function setPointer(
  arr: ArrayData,
  label: string,
  index: number | null | undefined,
): ArrayData {
  const newPointers = { ...(arr.pointers || {}) };
  if (index === null || index === undefined) {
    delete newPointers[label];
  } else {
    newPointers[label] = index;
  }
  return {
    ...arr,
    pointers: newPointers,
  };
}

export function swap(arr: any[], i: number, j: number): any[] {
  const next = [...arr];
  const temp = next[i];
  next[i] = next[j];
  next[j] = temp;
  return next;
}
