export interface ArrayWindow {
  start: number;
  end: number;
  colorClass?: string;
  label?: string;
}

export interface ArrayData {
  id: string;
  name?: string;
  values: any[];
  pointers?: Record<string, number>;
  activeIndex?: number;
  activeIndices?: number[];
  matchIndex?: number;
  matchIndices?: number[];
  conflictIndex?: number;
  windows?: ArrayWindow[];
}

export type ArrayState = ArrayData | ArrayData[];
