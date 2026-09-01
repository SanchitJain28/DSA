export interface StackData {
  id?: string;
  name?: string;
  values: (string | number | Record<string, any>)[];
  topPointer?: boolean;
}

export type StackState = StackData | StackData[] | (string | number)[];
