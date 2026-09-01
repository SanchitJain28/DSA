import type { RangeState } from "./types";

export function toRangeState(
  min: number,
  max: number,
  options: Partial<RangeState> = {},
): RangeState {
  return {
    title: options.title || "Search Space Range",
    min,
    max,
    left: options.left,
    right: options.right,
    mid: options.mid,
    isMatch: options.isMatch,
    unit: options.unit || "",
  };
}
