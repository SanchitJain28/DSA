export type SetElementStatus =
  | "default"
  | "active"
  | "streak"
  | "skipped"
  | "bestStreak"
  | "match"
  | "conflict";

export interface SetState {
  title?: string;
  elements: (string | number)[];
  elementStatuses?: Record<string | number, SetElementStatus>;
  streakChain?: (string | number)[];
  bestStreak?: (string | number)[];
}
