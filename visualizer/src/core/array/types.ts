import type { BaseFrame } from "../shared/types";

export interface ArrayData {
  id: string; // e.g. "nums" or "result"
  name?: string; // label to display next to the array
  values: (number | string | null)[]; // The elements
  pointers?: Record<string, number>; // Map of pointer label -> index (e.g. { "left": 0, "right": 4, "pos": 4 })
}

export interface ArrayFrame extends BaseFrame {
  arrays: ArrayData[]; // Supports rendering multiple arrays at once
}
