import type { SetState, SetElementStatus } from "./types";

export function toSetState(
  elements: (string | number)[],
  options: Partial<SetState> = {},
): SetState {
  return {
    title: options.title || "Hash Set Elements",
    elements: [...elements],
    elementStatuses: options.elementStatuses ? { ...options.elementStatuses } : {},
    streakChain: options.streakChain ? [...options.streakChain] : undefined,
    bestStreak: options.bestStreak ? [...options.bestStreak] : undefined,
  };
}

export function setElementStatus(
  setObj: SetState,
  element: string | number,
  status: SetElementStatus,
): SetState {
  return {
    ...setObj,
    elementStatuses: {
      ...(setObj.elementStatuses || {}),
      [element]: status,
    },
  };
}
