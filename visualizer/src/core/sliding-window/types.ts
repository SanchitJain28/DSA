import type { BaseFrame } from "../shared/types";
import type { ArrayData } from "../array/types";

export interface SlidingWindowData extends ArrayData {
  windows?: {
    start: number;
    end: number;
    colorClass?: string;
  }[];
}

export interface SlidingWindowFrame extends BaseFrame {
  arrays: SlidingWindowData[];
}
