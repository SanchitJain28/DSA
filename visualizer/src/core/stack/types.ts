import type { BaseFrame } from "../shared/types";
import type { ArrayData } from "../array/types";

export interface StackData {
  id: string;
  name?: string;
  values: (number | string)[];
  topPointer?: boolean; // If true, explicitly render a "TOP" arrow
}

export interface StackFrame extends BaseFrame {
  arrays?: ArrayData[];
  stacks: StackData[];
}
