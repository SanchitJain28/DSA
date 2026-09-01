import type { StackData, StackState } from "./types";

export function toStackState(
  values: (string | number | Record<string, any>)[],
  options: {
    id?: string;
    name?: string;
    topPointer?: boolean;
  } = {},
): StackData {
  return {
    id: options.id || "stack",
    name: options.name || "Stack (LIFO)",
    values: [...values],
    topPointer: options.topPointer ?? values.length > 0,
  };
}

export function normalizeStackState(state: StackState): StackData[] {
  if (Array.isArray(state)) {
    if (state.length === 0) {
      return [{ id: "stack", name: "Stack (LIFO)", values: [], topPointer: false }];
    }
    // Check if it's an array of StackData objects or raw values
    if (typeof state[0] === "object" && state[0] !== null && "values" in state[0]) {
      return state as StackData[];
    }
    return [
      {
        id: "stack",
        name: "Stack (LIFO)",
        values: state as (string | number)[],
        topPointer: state.length > 0,
      },
    ];
  }

  if (state && typeof state === "object" && "values" in state) {
    return [state as StackData];
  }

  return [{ id: "stack", name: "Stack (LIFO)", values: [], topPointer: false }];
}
